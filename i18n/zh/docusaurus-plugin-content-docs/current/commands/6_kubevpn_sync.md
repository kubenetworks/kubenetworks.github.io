---
sidebar_position: 6
---

# kubevpn sync

将本地目录同步到克隆的工作负载目录，该工作负载在当前命名空间中运行，具有与目标工作负载相同的卷、环境变量和网络

通过这种方式，我们在当前命名空间中启动另一个 deployment，但使用不同的镜像版本，
也支持服务网格代理。只有带有特定 header 的流量才会命中同步资源。

# 示例

## 同步 deployment 并将本地目录同步到远程

```shell
kubevpn sync deployment/productpage --sync ~/code:/code/app
```

## 使用服务网格同步，带有 HTTP header foo=bar 的流量命中同步工作负载，否则命中原始工作负载

```shell
kubevpn sync deployment/productpage --sync ~/code:/code/app --headers foo=bar
```

## 同步位于堡垒机或 SSH 跳板机后面的工作负载

```shell
kubevpn sync deployment/productpage --sync ~/code:/code/app --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --headers foo=bar
```

## 支持 ProxyJump

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn sync deployment/productpage --sync ~/code:/code/app --ssh-alias <alias> --headers foo=bar
```

## 支持 SSH 认证 GSSAPI

```shell
kubevpn sync deployment/productpage --sync ~/code:/code/app --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn sync deployment/productpage --sync ~/code:/code/app --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn sync deployment/productpage --sync ~/code:/code/app --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

# 选项

```text
-c, --container='':
容器名称

--debug=false:
是否启用调试模式

--extra-cidr=[]:
额外的网段 CIDR

--extra-domain=[]:
额外的域名字符串

--extra-node-ip=false:
将集群节点 IP 添加到路由表

-H, --headers=[]:
带有特定 Header 的流量将被路由到同步工作负载

--image='ghcr.io/kubenetworks/kubevpn:latest':
使用此镜像启动容器

--image-pull-secret-name='':
拉取私有仓库镜像时使用的 Secret 名称

--remote-kubeconfig='':
远程 SSH 服务器上 kubeconfig 的绝对路径

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

--sync='':
同步本地目录到远程 pod 目录，格式：LOCAL_DIR:REMOTE_DIR

--target-image='':
同步容器使用此镜像启动，如果未指定，使用原始镜像

--transfer-image=false:
将镜像转存到远程仓库
```
