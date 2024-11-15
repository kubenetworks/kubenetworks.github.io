---
sidebar_position: 4
---

# kubevpn proxy

将 Kubernetes 工作负载的入站流量代理到本地 PC

无论是否使用服务网格，都能将 k8s 工作负载的入站流量代理到本地 PC。在没有服务网格的情况下，它将代理所有入站流量到本地
PC，即使流量协议是第4层（传输层）。使用服务网格时，它将代理具有特殊 HTTP header 的流量到本地 PC，支持 HTTP、gRPC、Thrift、WebSocket
等协议。代理资源后，它还会自动连接到集群网络。因此，只需在本地 PC 启动您的应用程序并等待入站流量，使调试更加简单。

# 示例

## 反向代理

### 代理 deployment

```shell
kubevpn proxy deployment/productpage
```

### 代理 service

```shell
kubevpn proxy service/productpage
```

### 代理多个工作负载

```shell
kubevpn proxy deployment/authors deployment/productpage
```

or

```shell
kubevpn proxy deployment authors productpage
```

## 使用服务网格进行反向代理，带有HTTP header foo=bar 的流量将命中本地 PC，其它流量不受影响

```shell
kubevpn proxy service/productpage --headers foo=bar
```

## 使用服务网格进行反向代理，带有HTTP header foo=bar 和 env=dev 的流量将命中本地 PC，其它流量不受影响

```shell
kubevpn proxy service/productpage --headers foo=bar --headers env=dev
```

## 连接到位于堡垒机或 SSH 跳板机后的 api-server 并将 Kubernetes 资源流量代理到本地 PC

```shell
kubevpn proxy deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --headers foo=bar
```

## 它也支持 ProxyJump，像这样

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn proxy service/productpage --ssh-alias <alias> --headers foo=bar
```

## 支持 SSH 认证 GSSAPI

```shell
kubevpn proxy service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn proxy service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn proxy service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

## 支持端口映射，您可以通过命令将容器端口代理到本地端口：

```shell
kubevpn proxy deployment/productpage --portmap 80:8080
```

## 将容器端口 9080 代理到本地 TCP 协议的端口 8080

```shell
kubevpn proxy deployment/productpage --portmap 9080:8080
```

## 将容器端口 9080 代理到本地 UDP 协议的端口 5000

```shell
kubevpn proxy deployment/productpage --portmap udp/9080:5000
```

## 自动将容器端口代理到相同的本地端口，并自动检测协议

```shell
kubevpn proxy deployment/productpage
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

-H, --headers=[]:
带有特殊 HTTP header 的流量（使用 `and` 匹配所有HTTP header）将被反向代理到本地 PC，如果不指定，将重定向所有流量到本地 PC。
格式：<KEY>=<VALUE>, 例如：--headers foo=bar

--image='docker.io/naison/kubevpn:v2.2.17':
使用此镜像启动容器

--netstack='system':
网络协议栈（"system"|"gvisor"）gvisor：使用 gvisor （性能和稳定兼得），system：使用 system 模式（最稳定）

--portmap=[]:
端口映射，将容器端口映射到本地端口，格式：[tcp/udp]/containerPort:localPort，如果未指定，
localPort 将使用 containerPort。例如：tcp/80:8080 或 udp/5000:5001 或 80 或 80:8080

--remote-kubeconfig='':
远程 SSH 服务器上 kubeconfig 文件的绝对路径，默认为 /home/$USERNAME/.kube/config

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

将镜像转存到远程仓库，它将镜像 docker.io/naison/kubevpn:v2.2.17 转存到 `--image`
特定镜像，默认为：docker.io/naison/kubevpn:v2.2.17
```
