---
sidebar_position: 8
---

# kubevpn dev

在本地 Docker 容器中启动您的 Kubernetes 工作负载，具有相同的卷、环境变量和网络
这个命令做了什么：

* 下载指向 MountPath 的卷，挂载到 Docker 容器
* 连接到集群网络，将网络设置到 Docker 容器
* 获取所有环境变量（通过命令 env），将环境变量设置到 Docker 容器

# 示例

## 开发工作负载

### 开发 deployment

```shell
kubevpn dev deployment/productpage
```

### 开发 service

```shell
kubevpn dev service/productpage
```

# 使用服务网格开发工作负载，带有 HTTP header foo=bar 的流量将命中本地 PC，其它流量不受影响

```shell
kubevpn dev service/productpage --headers foo=bar
```

# 开发不代理流量的工作负载

```shell
kubevpn dev service/productpage --no-proxy
```

# 开发位于堡垒机或 SSH 跳板机后面的 API 服务器的工作负载

```shell
kubevpn dev deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

# 它还支持 ProxyJump，像这样

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn dev deployment/productpage --ssh-alias <alias>
```

# 切换到终端模式；将 stdin 发送到 'bash' 并将 'bash' 的 stdout/stderror 从客户端发送回来

```shell
kubevpn dev deployment/authors -n default --kubeconfig ~/.kube/config --ssh-alias dev --entrypoint /bin/bash
```

或

```shell
kubevpn dev deployment/authors -n default --kubeconfig ~/.kube/config --ssh-alias dev --entrypoint /bin/bash
```

# 支持 SSH auth GSSAPI

```shell
kubevpn dev deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab --entrypoint /bin/bash
kubevpn dev deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache --entrypoint /bin/bash
kubevpn dev deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD> --entrypoint /bin/bash
```

## 选项

```text
--connect-mode='host':
连接到 Kubernetes 网络，在容器内或主机上，例如：[container|host]

-c, --container='':
容器名称。如果省略，则使用 kubectl.kubernetes.io/default-container 注释来选择要附加的容器，或者将选择 Pod 中的第一个容器

--debug=false:
是否启用调试模式，true 或 false

--dev-image='':
用于启动 docker 容器，默认是 pod 镜像

--entrypoint='':
覆盖镜像的默认入口点

--expose=:
暴露一个端口或一系列端口

--extra-cidr=[]:
额外的网段 CIDR，将这些 CIDR 网段添加到路由表中。例如：--extra-cidr 192.168.0.159/24
--extra-cidr 192.168.1.160/32

--extra-domain=[]:
额外的域名字符串，解析后的 IP 将添加到路由表中，例如：--extra-domain test.abc.com --extra-domain
foo.test.com

--extra-node-ip=false:
额外的 node IP，将集群节点 node IP 添加到路由表中。

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

--no-proxy=false:
是否将远程工作负载流量代理到本地，true：仅在本地启动容器，不注入容器以截取流量，false：拦截流量并转发到本地

--platform='':
如果服务器支持多平台，则设置平台

--privileged=true:
为此容器提供扩展权限

-p, --publish=:
将容器的端口发布到主机上

-P, --publish-all=false:
将所有暴露的端口发布到随机端口

--pull='missing':
运行之前拉取镜像（"always"|"missing"|"never"）

--remote-kubeconfig='':
远程 SSH 服务器上 kubeconfig 文件的绝对路径

--sig-proxy=true:
将接收到的信号代理给进程

--ssh-addr='':
选择性的 SSH 跳板机地址，如 <hostname>:<port>，例如：127.0.0.1:22

--ssh-alias='':
与 ~/.ssh/config 的可选配置别名，用于 SSH 认证

--ssh-jump='':
可选的堡垒机跳板配置，例如：'--ssh-addr jumpe.naison.org --ssh-username naison --gssapi-password xxx'

--ssh-keyfile='':
SSH 跳板机的认证可选私钥文件

--ssh-password='':
SSH 跳板机的可选密码

--ssh-username='':
SSH 跳板机的可选用户名

将镜像转存到远程仓库，它将镜像 docker.io/naison/kubevpn:v2.2.17 转存到 `--image`
特定镜像，默认为：docker.io/naison/kubevpn:v2.2.17

-v, --volume=:
绑定挂载一个卷
```