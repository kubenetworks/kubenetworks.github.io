---
sidebar_position: 12
---

# RBAC permission

KubeVPN involves **two distinct identities**, each needing a different set of RBAC
permissions:

| Identity | Who | What it does | How RBAC is provided |
|---|---|---|---|
| **Server** — `kubevpn-traffic-manager` ServiceAccount | The in-cluster traffic-manager pod | Runs the VPN/xDS/DNS server, and performs **all cluster-view work server-side**: sidecar injection, route & service discovery, CIDR/DNS detection, DHCP IP allocation | Created automatically by `helm install` (recommended) **or** by `kubevpn connect` on first connect |
| **Client** — developer kubeconfig | The user running the `kubevpn` CLI | Bootstraps/upgrades the traffic manager, port-forwards to it, and sends *intent* (proxy/leave) over gRPC; the manager does the actual mutation | Bound to the kubeconfig the user runs `kubevpn` with |

Because injection, route discovery and CIDR/DNS detection now run **inside the traffic
manager**, the *client* needs far fewer permissions than in older versions — e.g. `proxy`
no longer patches the target workload (only `get`/`list` to resolve it); the manager patches
it with its own ServiceAccount.

---

## 1. Server side — traffic manager ServiceAccount

The traffic-manager pod runs as the `kubevpn-traffic-manager` ServiceAccount. It needs three
grants:

1. **Manager Role** (namespaced, `resourceNames`-scoped) — manage its own ConfigMap & Secret.
2. **Route Role** (`kubevpn-traffic-manager-route`, namespaced) — `list`/`watch` pods &
   services for server-side route/service discovery.
3. **Proxy Role/ClusterRole** (`kubevpn-traffic-manager-proxy`) — patch any workload type
   (incl. CRDs like Argo Rollouts) for server-side sidecar injection / unpatch.

You normally **do not write these by hand** — they are created for you. The YAML below shows
the canonical grants (the fixed `kubevpn-traffic-manager*` names that `kubevpn connect`
auto-creates); Helm provisions the equivalent grants but names each object after the release
(e.g. `helm install kubevpn …` → `kubevpn`, `kubevpn-proxy`).

### Recommended: install with Helm (cluster-scoped, central)

A central manager in the `kubevpn` namespace serves clients across **all** namespaces, so it
uses a cluster-scoped proxy grant. The chart creates the ServiceAccount, the namespaced
manager Role/RoleBinding, and (gated by `rbac.proxyClusterRole`, default `true`) the proxy
ClusterRole/ClusterRoleBinding:

```yaml
# Manager Role — own ConfigMap & Secret (namespaced, resourceNames-scoped)
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
# Proxy ClusterRole — server-side sidecar injection across all namespaces.
# Wildcard resources so any workload type (incl. CRDs like Argo Rollouts) can be patched.
# Enabled by values.rbac.proxyClusterRole=true (default). This is the ONLY cluster-scoped
# RBAC object KubeVPN uses.
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
# single-namespace manager (no cluster-scoped RBAC):
# helm install ... --set rbac.proxyClusterRole=false
```

> The route-discovery grant is subsumed by the wildcard proxy ClusterRole in the central
> install. When `rbac.proxyClusterRole=false`, the manager only serves its own namespace and
> the namespaced route/proxy Roles are created lazily by `kubevpn connect`.

### Minimal: single-namespace (no cluster-scoped RBAC)

If the manager should only serve **one** namespace, grant the three roles namespaced. This is
exactly what `kubevpn connect` creates automatically (best-effort) when it targets a
per-namespace manager — provision them ahead of time only in clusters where the client
kubeconfig is not allowed to create RBAC:

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
  name: kubevpn-traffic-manager-route   # server-side route & service discovery
  namespace: YOUR_NAMESPACE
rules:
  - apiGroups: [ "" ]
    resources: [ "pods", "services" ]
    verbs: [ "list", "watch" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kubevpn-traffic-manager-proxy   # server-side sidecar injection / unpatch
  namespace: YOUR_NAMESPACE
rules:
  - apiGroups: [ "*" ]
    resources: [ "*" ]
    verbs: [ "get", "list", "watch", "create", "delete", "patch", "update" ]
---
# One RoleBinding per Role, all binding the same ServiceAccount. Example for the manager Role:
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
# ... repeat for -route and -proxy
```

---

## 2. Client side — developer kubeconfig

This is the RBAC bound to the kubeconfig a developer runs `kubevpn` with.

### Recommended: full features across all namespaces

Covers every command — `connect`, `proxy`, `leave`, `reset`, `sync`, `run` — including
bootstrapping the traffic manager itself when it is not pre-installed. Bind this ClusterRole
to the developer (or their group) cluster-wide:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubevpn-user
rules:
  # traffic-manager bootstrap / upgrade / cleanup
  - apiGroups: [ "" ]
    resources: [ "namespaces" ]
    verbs: [ "get", "list", "update" ]        # label the manager ns; list for DNS search domains
  - apiGroups: [ "" ]
    resources: [ "serviceaccounts", "services", "configmaps", "secrets" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch", "delete" ]
  - apiGroups: [ "rbac.authorization.k8s.io" ]
    resources: [ "roles", "rolebindings" ]
    verbs: [ "get", "create", "delete" ]
  - apiGroups: [ "rbac.authorization.k8s.io" ]      # only for a central (kubevpn-namespace) install
    resources: [ "clusterroles", "clusterrolebindings" ]
    verbs: [ "get", "create", "delete" ]
  - apiGroups: [ "batch" ]
    resources: [ "jobs" ]
    verbs: [ "get", "create", "delete" ]
  # proxy / reset / sync: resolve & (reset only) patch target workloads of any controller type
  - apiGroups: [ "apps" ]
    resources: [ "deployments", "statefulsets", "daemonsets", "replicasets" ]
    verbs: [ "get", "list", "create", "update", "patch", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "replicationcontrollers" ]
    verbs: [ "get", "list", "patch", "update" ]
  # connect: port-forward, CIDR/DNS probes, endpoints for the local proxy
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

### Minimal: `connect` + `proxy` in a single namespace

Use this when the traffic manager is **already installed by an administrator** (e.g. via
Helm), so the client never has to create the manager or any RBAC. Injection, route/service
discovery and CIDR/DNS detection all run server-side, so the client only needs to
port-forward, read a few resources, and resolve the proxy target:

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
    verbs: [ "create" ]                 # tunnel to the traffic-manager pod
  - apiGroups: [ "" ]
    resources: [ "pods/exec" ]
    verbs: [ "create" ]                 # read manager pod /etc/resolv.conf (DNS); CIDR fallback
  - apiGroups: [ "" ]
    resources: [ "services", "configmaps" ]
    verbs: [ "get", "list" ]            # manager Service ClusterIP + cached CIDR/DNS
  - apiGroups: [ "apps" ]
    resources: [ "deployments", "statefulsets", "daemonsets", "replicasets" ]
    verbs: [ "get", "list" ]            # resolve the proxy target (injection is server-side)
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

> **Notes**
> - The minimal Role assumes the server-side traffic manager (§1) is pre-provisioned. If the
>   client must bootstrap the manager itself, it additionally needs `create`/`delete` on
>   serviceaccounts, roles, rolebindings, services, configmaps, secrets, deployments (see the
>   recommended ClusterRole).
> - `configmaps` needs `update` in addition to `get`/`list` **only** for the first-connect
>   CIDR-cache write when the manager has not yet warmed it; a Helm-installed manager warms it
>   on startup, so `get`/`list` suffices in steady state.
> - `reset` and `sync` mutate the target workload with the client kubeconfig (they can run
>   without an active VPN), so they need `patch`/`update` on workloads — use the recommended
>   ClusterRole for those commands.
