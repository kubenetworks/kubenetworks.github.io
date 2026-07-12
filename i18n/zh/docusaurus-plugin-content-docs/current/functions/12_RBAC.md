---
sidebar_position: 12
---

# RBAC 权限

KubeVPN 涉及**两个不同的身份**，各自需要不同的 RBAC 权限：

| 身份 | 是谁 | 做什么 | RBAC 来源 |
|---|---|---|---|
| **服务端** — `kubevpn-traffic-manager` ServiceAccount | 集群内的 traffic-manager Pod | 运行 VPN/xDS/DNS 服务，并在**服务端完成所有需要集群视角的工作**：sidecar 注入、路由与服务发现、CIDR/DNS 探测、DHCP IP 分配 | 由 `helm install`（推荐）**或** `kubevpn connect` 首次连接时自动创建 |
| **客户端** — 开发者 kubeconfig | 运行 `kubevpn` 命令行的用户 | 引导/升级 traffic manager、对其做端口转发，并通过 gRPC 下发*意图*（proxy/leave）；真正的改动由 manager 执行 | 绑定到用户运行 `kubevpn` 所用的 kubeconfig |

由于注入、路由发现、CIDR/DNS 探测现在都在 **traffic manager 内部**执行，*客户端*所需权限比旧版本少了很多——例如 `proxy` 不再对目标工作负载做 patch（仅 `get`/`list` 用于解析），改由 manager 用自己的 ServiceAccount 去 patch。

---

## 1. 服务端 —— traffic manager ServiceAccount

traffic-manager Pod 以 `kubevpn-traffic-manager` 这个 ServiceAccount 运行，需要三组授权：

1. **manager Role**（命名空间级，`resourceNames` 限定）—— 管理自己的 ConfigMap 和 Secret。
2. **route Role**（`kubevpn-traffic-manager-route`，命名空间级）—— 对 pods 与 services 做
   `list`/`watch`，用于服务端路由/服务发现。
3. **proxy Role/ClusterRole**（`kubevpn-traffic-manager-proxy`）—— patch 任意类型的工作负载
   （含 Argo Rollouts 等 CRD），用于服务端 sidecar 注入 / 卸载。

一般**无需手写**，它们会被自动创建。下面的 YAML 展示的是规范化的授权（即 `kubevpn connect`
自动创建时使用的固定名 `kubevpn-traffic-manager*`）；Helm 会创建等价的授权，但每个对象以
release 名命名（例如 `helm install kubevpn …` → `kubevpn`、`kubevpn-proxy`）。

### 推荐：使用 Helm 安装（集群级、集中式）

位于 `kubevpn` 命名空间的集中式 manager 会为**所有**命名空间的客户端服务，因此使用集群级的
proxy 授权。Chart 会创建 ServiceAccount、命名空间级的 manager Role/RoleBinding，以及（由
`rbac.proxyClusterRole` 控制，默认 `true`）proxy 的 ClusterRole/ClusterRoleBinding：

```yaml
# manager Role —— 自己的 ConfigMap 和 Secret（命名空间级，resourceNames 限定）
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kubevpn-traffic-manager
  namespace: kubevpn
rules:
  - apiGroups: [ "" ]
    resources: [ "configmaps", "secrets" ]
    resourceNames: [ "kubevpn-traffic-manager" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch", "delete" ]
---
# proxy ClusterRole —— 跨所有命名空间的服务端 sidecar 注入。
# 使用通配资源，以便 patch 任意工作负载类型（含 Argo Rollouts 等 CRD）。
# 由 values.rbac.proxyClusterRole=true（默认）开启。这是 KubeVPN 唯一使用的集群级 RBAC 对象。
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubevpn-traffic-manager-proxy
rules:
  - apiGroups: [ "*" ]
    resources: [ "*" ]
    verbs: [ "get", "list", "watch", "create", "delete", "patch", "update" ]
```

```bash
helm install kubevpn kubevpn/kubevpn -n kubevpn --create-namespace
# 单命名空间 manager（不创建任何集群级 RBAC）：
# helm install ... --set rbac.proxyClusterRole=false
```

> 在集中式安装下，路由发现所需的授权已被通配的 proxy ClusterRole 覆盖。当
> `rbac.proxyClusterRole=false` 时，manager 只服务自身命名空间，命名空间级的 route/proxy
> Role 由 `kubevpn connect` 按需惰性创建。

### 最小：单命名空间（不使用任何集群级 RBAC）

如果 manager 只需服务**一个**命名空间，则以命名空间级授予这三组角色。这正是 `kubevpn connect`
在面向单命名空间 manager 时自动（best-effort）创建的内容——仅当集群里客户端 kubeconfig
不被允许创建 RBAC 时，才需要提前手工预置：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kubevpn-traffic-manager
  namespace: YOUR_NAMESPACE
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kubevpn-traffic-manager
  namespace: YOUR_NAMESPACE
rules:
  - apiGroups: [ "" ]
    resources: [ "configmaps", "secrets" ]
    resourceNames: [ "kubevpn-traffic-manager" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch", "delete" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kubevpn-traffic-manager-route   # 服务端路由与服务发现
  namespace: YOUR_NAMESPACE
rules:
  - apiGroups: [ "" ]
    resources: [ "pods", "services" ]
    verbs: [ "list", "watch" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kubevpn-traffic-manager-proxy   # 服务端 sidecar 注入 / 卸载
  namespace: YOUR_NAMESPACE
rules:
  - apiGroups: [ "*" ]
    resources: [ "*" ]
    verbs: [ "get", "list", "watch", "create", "delete", "patch", "update" ]
---
# 每个 Role 对应一个 RoleBinding，均绑定同一个 ServiceAccount。以 manager Role 为例：
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kubevpn-traffic-manager
  namespace: YOUR_NAMESPACE
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: kubevpn-traffic-manager
subjects:
  - kind: ServiceAccount
    name: kubevpn-traffic-manager
    namespace: YOUR_NAMESPACE
# ... 对 -route 与 -proxy 重复同样的 RoleBinding
```

---

## 2. 客户端 —— 开发者 kubeconfig

即绑定到开发者运行 `kubevpn` 所用 kubeconfig 上的 RBAC。

### 推荐：全功能、覆盖所有命名空间

覆盖全部命令——`connect`、`proxy`、`leave`、`reset`、`sync`、`run`——包括在 traffic manager
未预装时由客户端自行引导创建它。将下面这个 ClusterRole 以集群级绑定给开发者（或其用户组）：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubevpn-user
rules:
  # traffic-manager 引导 / 升级 / 清理
  - apiGroups: [ "" ]
    resources: [ "namespaces" ]
    verbs: [ "get", "list", "update" ]        # 给 manager 命名空间打标签；list 用于 DNS 搜索域
  - apiGroups: [ "" ]
    resources: [ "serviceaccounts", "services", "configmaps", "secrets" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch", "delete" ]
  - apiGroups: [ "rbac.authorization.k8s.io" ]
    resources: [ "roles", "rolebindings" ]
    verbs: [ "get", "create", "delete" ]
  - apiGroups: [ "rbac.authorization.k8s.io" ]      # 仅集中式（kubevpn 命名空间）安装需要
    resources: [ "clusterroles", "clusterrolebindings" ]
    verbs: [ "get", "create", "delete" ]
  - apiGroups: [ "batch" ]
    resources: [ "jobs" ]
    verbs: [ "get", "create", "delete" ]
  # proxy / reset / sync：解析目标工作负载（reset 时还需 patch），支持任意控制器类型
  - apiGroups: [ "apps" ]
    resources: [ "deployments", "statefulsets", "daemonsets", "replicasets" ]
    verbs: [ "get", "list", "create", "update", "patch", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "replicationcontrollers" ]
    verbs: [ "get", "list", "patch", "update" ]
  # connect：端口转发、CIDR/DNS 探测、本地代理所需的 endpoints
  - apiGroups: [ "" ]
    resources: [ "pods" ]
    verbs: [ "get", "list", "create", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "pods/portforward", "pods/exec" ]
    verbs: [ "create" ]
  - apiGroups: [ "" ]
    resources: [ "endpoints" ]
    verbs: [ "get", "list" ]
```

### 最小：单命名空间内 `connect` + `proxy`

当 traffic manager **已由管理员安装**（例如通过 Helm）时使用此配置，客户端完全不需要创建
manager 或任何 RBAC。注入、路由/服务发现、CIDR/DNS 探测都在服务端完成，客户端只需做端口转发、
读取少量资源、以及解析 proxy 目标：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kubevpn-user-minimal
  namespace: YOUR_NAMESPACE
rules:
  - apiGroups: [ "" ]
    resources: [ "pods" ]
    verbs: [ "get", "list" ]
  - apiGroups: [ "" ]
    resources: [ "pods/portforward" ]
    verbs: [ "create" ]                 # 连接到 traffic-manager Pod 的隧道
  - apiGroups: [ "" ]
    resources: [ "pods/exec" ]
    verbs: [ "create" ]                 # 读取 manager Pod 的 /etc/resolv.conf（DNS）；CIDR 回退
  - apiGroups: [ "" ]
    resources: [ "services", "configmaps" ]
    verbs: [ "get", "list" ]            # manager Service ClusterIP + 缓存的 CIDR/DNS
  - apiGroups: [ "apps" ]
    resources: [ "deployments", "statefulsets", "daemonsets", "replicasets" ]
    verbs: [ "get", "list" ]            # 解析 proxy 目标（注入在服务端执行）
  - apiGroups: [ "" ]
    resources: [ "namespaces" ]
    verbs: [ "get", "list" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kubevpn-user-minimal
  namespace: YOUR_NAMESPACE
subjects:
  - kind: ServiceAccount
    name: YOUR_SERVICE_ACCOUNT
    namespace: YOUR_NAMESPACE
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: kubevpn-user-minimal
```

> **说明**
> - 最小 Role 假定服务端 traffic manager（见 §1）已预先安装。若需由客户端自行引导创建 manager，
>   还需对 serviceaccounts、roles、rolebindings、services、configmaps、secrets、deployments
>   具备 `create`/`delete` 权限（见推荐 ClusterRole）。
> - 只有在首次连接、manager 尚未预热 CIDR 缓存时，`configmaps` 才需要在 `get`/`list` 之外加上
>   `update`；Helm 安装的 manager 启动即预热该缓存，因此稳态下 `get`/`list` 即可。
> - `reset` 与 `sync` 会用客户端 kubeconfig 改动目标工作负载（可在无 VPN 时运行），因此需要对
>   工作负载具备 `patch`/`update`——这类命令请使用推荐 ClusterRole。
