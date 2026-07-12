---
sidebar_position: 17
---

# kubevpn ssh

SSH 连接到远程服务器。

此命令打开一个 SSH 终端会话到远程服务器。在完整模式（默认）下，不仅连接到 SSH 服务器，还创建一个双向 TUN 隧道来
与内部网络 IP 通信（使用 198.18.0.0/16 CIDR 范围）。在精简模式下，仅连接到 SSH 服务器，不创建隧道。

# 示例

## 通过堡垒机或 SSH 跳板机连接到服务器

```shell
kubevpn ssh --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## 支持 ProxyJump

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────┘
```

```shell
kubevpn ssh --ssh-alias <alias>
```

## 支持 SSH 认证 GSSAPI

```shell
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

## 使用精简模式（仅连接 SSH，不创建隧道）

```shell
kubevpn ssh --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --lite
```

# 选项

```text
--extra-cidr=[]:
额外的网段 CIDR

--gssapi-cache='':
GSSAPI 缓存文件路径

--gssapi-keytab='':
GSSAPI keytab 文件路径

--gssapi-password='':
GSSAPI 密码

--lite=false:
精简模式。"lite" 模式：仅连接到 SSH 服务器。
"full" 模式：不仅连接到 SSH 服务器，还创建双向 TUN 隧道与内部 IP 通信

--platform='linux/amd64':
设置 SSH 服务器平台（需要安装 kubevpn 命令时使用）

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
```
