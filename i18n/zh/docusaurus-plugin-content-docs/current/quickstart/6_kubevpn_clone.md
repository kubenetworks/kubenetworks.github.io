---
sidebar_position: 6
---

# kubevpn clone

克隆工作负载运行到目标 kubeconfig 集群中，包括相同的卷、环境和网络配置

通过这种方式，您可以在相同或不同的集群中启动另一个 deployment，使用不同的镜像版本。它还支持服务网格代理。只有带有特殊 HTTP header 的流量才会被路由到克隆的资源。

# 示例

## 克隆

### 克隆 deployment 运行在在当前集群和当前命名空间中

```shell
kubevpn clone deployment/productpage
```

### 克隆 deployment 运行在当前集群中但使用不同命名空间

```shell
kubevpn clone deployment/productpage -n test
```

### 克隆 deployment 运行到另一个集群中

```shell
kubevpn clone deployment/productpage --target-kubeconfig ~/.kube/other-kubeconfig
```

### 克隆多个工作负载运行在在当前集群和当前命名空间中

```shell
kubevpn clone deployment/authors deployment/productpage
```

或

```shell
kubevpn clone deployment authors productpage
```

# 使用服务网格克隆，带有头部 a=1 的流量会路由到克隆的工作负载，否则路由到原始工作负载

```shell
kubevpn clone deployment/productpage --headers a=1
```

# 克隆位于堡垒机或 SSH 跳板机后面的工作负载

```shell
kubevpn clone deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --headers a=1
```

# 同样支持 ProxyJump，像这样

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn clone service/productpage --ssh-alias <alias> --headers a=1
```

# 支持 SSH 认证 GSSAPI

```shell
kubevpn clone service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn clone service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn clone service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

选项:

```text
--debug=false:
是否启用调试模式，true 或 false

--engine='raw':
传输引擎 ("mix"|"raw") mix: 同时使用 gvisor 和 raw（兼顾性能和稳定性），raw: 使用 raw 模式（最稳定）

--extra-cidr=[]:
额外的网络 CIDR 字符串，将这些 CIDR 网络添加到路由表中，例如：--extra-cidr 192.168.0.159/24
--extra-cidr 192.168.1.160/32

--extra-domain=[]:
额外的域名字符串，解析后的 IP 将添加到路由表中，例如：--extra-domain test.abc.com --extra-domain
foo.test.com

--extra-node-ip=false:
额外的节点 IP，将集群节点 IP 添加到路由表中。

--gssapi-cache='':
GSSAPI 缓存文件路径，使用命令 `kinit -c /path/to/cache USERNAME@RELAM` 来生成

--gssapi-keytab='':
GSSAPI keytab 文件路径

--gssapi-password='':
GSSAPI 密码

-H, --headers=[]:
带有特殊 HTTP header 的流量（使用 `and` 匹配所有头部）将被反向代理到目标集群的对应工作负载上。
如果不指定，将重定向所有流量到目标集群的对应工作负载。例如：--headers a=1 --headers b=2

--image='docker.io/naison/kubevpn:v2.2.17':
使用此镜像来启动容器

--remote-kubeconfig='':
SSH 服务器的远程 kubeconfig 的抽象路径，默认是 /home/$USERNAME/.kube/config

--ssh-addr='':
可选的 SSH 跳板服务器地址，格式为 <hostname>:<port>，例如：127.0.0.1:22

--ssh-alias='':
可选的 ~/.ssh/config 中的配置别名用于 SSH 认证

--ssh-jump='':
可选的堡垒跳转配置字符串，例如：'--ssh-addr jump.naison.org --ssh-username naison --gssapi-password xxx'

--ssh-keyfile='':
SSH 跳板机的认证私钥文件

--ssh-password='':
SSH 跳板服务器的密码

--ssh-username='':
SSH 跳板服务器的用户名

--sync='':
将本地目录同步到远程 pod 目录。格式：LOCAL_DIR:REMOTE_DIR，例如：~/code:/app/code

--target-container='':
使用特殊镜像启动的克隆容器，如果未指定，使用原始镜像

--target-image='':
使用此镜像启动容器，如果未指定，使用原始镜像

--target-kubeconfig='':
将在此集群中创建克隆工作负载，如果未指定，使用原始集群

--target-namespace='':
在此命名空间中克隆工作负载，如果未指定，使用原始命名空间

--target-registry='':
使用此镜像仓库替换克隆工作负载的原始镜像仓库，如果未指定，使用原始镜像仓库

将镜像转存到远程仓库，它将镜像 docker.io/naison/kubevpn:v2.2.17 转存到 `--image`
特定镜像，默认为：docker.io/naison/kubevpn:v2.2.17
```