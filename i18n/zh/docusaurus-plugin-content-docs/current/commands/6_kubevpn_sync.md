---
sidebar_position: 6
---

# kubevpn sync

同步工作负载运行在当前工作空间中，可以使用相同的卷、环境和网络配置

通过这种方式，您可以在当前工作空间中启动另一个同步的 deployment，使用不同的镜像版本。它还支持服务网格代理。只有带有特殊 HTTP
header 的流量才会被路由到同步的资源。

# 示例

## 同步

### 同步默认 namespace 下的 deployment

```shell
kubevpn sync deployment/productpage
```

### 同步命名空间为 test 下的 deployment

```shell
kubevpn sync deployment/productpage -n test
```

# 使用服务网格同步，带有HTTP header foo=bar 的流量会路由到同步的工作负载，否则路由到原始工作负载

```shell
kubevpn sync deployment/productpage --headers foo=bar
```

# 同步位于堡垒机或 SSH 跳板机后面的工作负载

```shell
kubevpn sync deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --headers foo=bar
```

# 同样支持 ProxyJump，像这样

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn sync service/productpage --ssh-alias <alias> --headers foo=bar
```

# 支持 SSH 认证 GSSAPI

```shell
kubevpn sync service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn sync service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn sync service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

选项:

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

--gssapi-cache='':
GSSAPI 缓存文件路径，使用命令 `kinit -c /path/to/cache USERNAME@RELAM` 来生成

--gssapi-keytab='':
GSSAPI keytab 文件路径

--gssapi-password='':
GSSAPI 密码

-H, --headers=[]:
带有特殊 HTTP header 的流量（使用 `and` 匹配所有HTTP header）将被反向代理到目标集群的对应工作负载上。
如果不指定，将重定向所有流量到目标集群的对应工作负载。格式：<KEY>=<VALUE>例如：--headers foo=bar

--image='docker.io/naison/kubevpn:v2.2.17':
使用此镜像来启动容器

--remote-kubeconfig='':
远程 SSH 服务器上 kubeconfig 文件的绝对路径

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

--target-image='':
使用此镜像启动容器，如果未指定，使用原始镜像

--transfer-image=false:
将镜像转存到远程仓库，它将镜像 docker.io/naison/kubevpn:v2.2.17 转存到 `--image`
特定镜像，默认为：docker.io/naison/kubevpn:v2.2.17
```