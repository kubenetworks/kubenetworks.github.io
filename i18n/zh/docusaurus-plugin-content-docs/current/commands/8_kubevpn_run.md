---
sidebar_position: 8
---

# kubevpn run

在本地 Docker 容器中运行 Kubernetes 工作负载，具有相同的卷、环境变量和网络

这个命令做了什么：

* 下载 MountPath 指向的卷，挂载到 Docker 容器
* 连接到集群网络，将网络设置到 Docker 容器
* 获取所有环境变量（通过 env 命令），将环境变量设置到 Docker 容器

# 示例

## 运行工作负载

```shell
kubevpn run deployment/productpage
```

## 使用服务网格运行，带有 HTTP header foo=bar 的流量命中本地

```shell
kubevpn run deployment/productpage --headers foo=bar
```

## 运行不代理流量的工作负载

```shell
kubevpn run deployment/productpage --no-proxy
```

## 运行位于堡垒机后的工作负载

```shell
kubevpn run deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## 支持 ProxyJump

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn run deployment/productpage --ssh-alias <alias>
```

## 切换到终端模式

```shell
kubevpn run deployment/authors -n default --kubeconfig ~/.kube/config --ssh-alias dev --entrypoint /bin/bash
```

## 支持 SSH 认证 GSSAPI

```shell
kubevpn run deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab --entrypoint /bin/bash
kubevpn run deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache --entrypoint /bin/bash
kubevpn run deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD> --entrypoint /bin/bash
```

# 选项

```text
--connect-mode='host':
连接到 Kubernetes 网络的模式，可选：[container|host]

-c, --container='':
容器名称

--debug=false:
是否启用调试模式

--dev-image='':
用于启动 Docker 容器的镜像，默认为 Pod 镜像

--entrypoint='':
覆盖镜像的默认入口点

--expose=:
暴露端口或端口范围

--extra-cidr=[]:
额外的网段 CIDR

--extra-domain=[]:
额外的域名字符串

--extra-node-ip=false:
将集群节点 IP 添加到路由表

-H, --headers=[]:
带有特定 Header 的流量将被代理到本地

--image='ghcr.io/kubenetworks/kubevpn:latest':
使用此镜像启动容器

--image-pull-secret-name='':
拉取私有仓库镜像时使用的 Secret 名称

--manager-namespace='':
流量管理器所在的命名空间

--no-proxy=false:
是否代理远程流量到本地

--platform='':
设置平台（多平台支持时）

--privileged=true:
为容器提供扩展权限

-p, --publish=:
将容器端口发布到主机

-P, --publish-all=false:
将所有暴露端口发布到随机端口

--pull='missing':
运行前拉取镜像（"always"|"missing"|"never"）

--remote-kubeconfig='':
远程 SSH 服务器上 kubeconfig 的绝对路径

--rm=false:
容器退出时自动删除容器

--ssh-addr='':
SSH 跳板服务器地址

--ssh-alias='':
SSH 配置别名

--ssh-jump='':
堡垒机配置字符串

--ssh-keyfile='':
SSH 私钥文件

--ssh-password='':
SSH 密码

--ssh-username='':
SSH 用户名

--transfer-image=false:
将镜像转存到远程仓库

-v, --volume=:
绑定挂载卷
```
