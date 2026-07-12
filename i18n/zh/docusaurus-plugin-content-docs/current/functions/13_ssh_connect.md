---
sidebar_position: 13
---

# SSH 连接到远程服务器

使用命令 `kubevpn ssh` 连接到远程服务器，可选创建双向网络隧道。

## 完整模式（默认）

在完整模式下，kubevpn 不仅打开 SSH 终端会话，还会在远程服务器上安装 kubevpn（如需要）并创建双向 TUN 隧道。
这允许您直接访问远程服务器的内部网络 IP。

```shell
kubevpn ssh --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## 精简模式

在精简模式下，kubevpn 仅连接到 SSH 服务器，不创建隧道。适用于只需要终端会话的场景。

```shell
kubevpn ssh --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --lite
```

## 多跳跳转

kubevpn ssh 支持 ProxyJump 进行多跳 SSH 链：

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────┘
```

```shell
kubevpn ssh --ssh-alias <alias>
```

## GSSAPI/Kerberos 认证

```shell
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

![ssh_connect](img/ssh_connect.svg)
