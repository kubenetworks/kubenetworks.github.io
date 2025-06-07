---
sidebar_position: 2
---

# kubevpn connect

连接到 Kubernetes 集群网络

连接到 Kubernetes 集群网络后，您可以在本地 PC 上 `ping PodIP` 或 `curl ServiceIP`，同时也支持 k8s DNS 解析。例如：`curl
authors/authors.default/authors.default.svc/authors.default.svc.cluster.local`。因此，即便项目启动依赖运行在 k8s
集群中的其它组件，您也可以在本地 PC 上启动您的应用程序，就像在 k8s 集群中一样连接它们。

# 示例

## 连接到 k8s 集群网络

```shell
kubevpn connect
```

## 连接到位于堡垒机或 SSH 跳板机后的 api-server

```shell
kubevpn connect --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## 支持 ProxyJump

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn connect --ssh-alias <alias>
```

## 支持 SSH 认证 GSSAPI

```shell
kubevpn connect --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn connect --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn connect --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

## 支持 SSH 多级跳转

```shell
kubevpn connect --ssh-jump "--ssh-addr jump.naison.org --ssh-username naison --gssapi-password xxx" --ssh-username root --ssh-addr 127.0.0.1:22 --ssh-keyfile ~/.ssh/dst.pem
```

# 选项

```text
--debug=false:
是否启用调试模式，true 或 false

--extra-cidr=[]:
额外的网段 CIDR，将这些 CIDR 网段添加到路由表中。例如：--extra-cidr 192.168.0.159/24
--extra-cidr 192.168.1.160/32

--extra-domain=[]:
额外的域名字符串，解析后的 IP 将添加到路由表中，例如：--extra-domain test.abc.com --extra-domain
foo.test.com

--extra-node-ip=false:
额外的 node IP，将集群节点 node IP 添加到路由表中。

--foreground=false:
前台挂起

--gssapi-cache='':
GSSAPI 缓存文件路径，使用命令 `kinit -c /path/to/cache USERNAME@RELAM` 生成

--gssapi-keytab='':
GSSAPI keytab 文件路径

--gssapi-password='':
GSSAPI 密码

--image='docker.io/naison/kubevpn:v2.2.17':
使用此镜像启动容器

--netstack='system':
网络协议栈（"system"|"gvisor"）gvisor：使用 gvisor （性能和稳定兼得），system：使用 system 模式（最稳定）

--lite=false:
以 lite 模式连接多个集群，，你需要特别指定此选项
模式 lite: 可以链接到多个集群网络，但是仅支持链接到多集群。
模式 full: 不仅支持链接到单个集群网络，还可以拦截工作负载流量到本地电脑。

--remote-kubeconfig='':
远程 SSH 服务器上 kubeconfig 文件的绝对路径

--ssh-addr='':
可选的 SSH 跳板服务器地址，如 <hostname>:<port>，例如：127.0.0.1:22

--ssh-alias='':
可选的 ~/.ssh/config 中的配置别名，用于 SSH 认证

--ssh-jump='':
可选的堡垒机配置字符串，例如：'--ssh-addr jumpe.naison.org --ssh-username naison --gssapi-password
xxx'

--ssh-keyfile='':
SSH 跳板机的认证私钥文件

--ssh-password='':
SSH 跳板服务器的密码

--ssh-username='':
SSH 跳板服务器的用户名

--transfer-image=false:
将镜像转存到远程仓库，它将镜像 docker.io/naison/kubevpn:v2.2.17 转存到 `--image`
特定镜像，默认为：docker.io/naison/kubevpn:v2.2.17
```