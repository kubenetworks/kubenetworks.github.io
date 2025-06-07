---
sidebar_position: 13
---

# kubevpn uninstall

清理在 Kubernetes 集群中由 kubevpn 创建的所有资源

卸载操作将删除在 Kubernetes 集群中由 kubevpn 创建的所有资源，例如 deployment、service、serviceAccount 等等，同时，它还将删除本地开发
Docker 容器、Docker 网络、由 kubevpn 添加的 hosts 记录，并清理 DNS 设置。

## 示例

### 重置默认命名空间：

```bash
kubevpn uninstall
```

### 重置另一个命名空间 test

```shell
kubevpn uninstall -n test
```

### 连接到堡垒机或 ssh 跳转机后的集群 API 服务器

```shell
kubevpn uninstall --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

### 也支持 ProxyJump，例如

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn uninstall --ssh-alias <alias>
```

### 支持使用 GSSAPI 进行 ssh 认证

```shell
kubevpn uninstall --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn uninstall --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn uninstall --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

# 选项

```text
--gssapi-cache='':
GSSAPI 缓存文件路径，使用命令 `kinit -c /path/to/cache USERNAME@RELAM` 生成

--gssapi-keytab='':
GSSAPI keytab 文件路径

--gssapi-password='':
GSSAPI 密码

--remote-kubeconfig='':
远程 SSH 服务器上 kubeconfig 文件的绝对路径

--ssh-addr='':
可选的 ssh 跳转服务器地址，格式为 <hostname>:<port>，例如：127.0.0.1:22

--ssh-alias='':
可选的 SSH 配置别名，使用 ~/.ssh/config 文件进行 SSH 认证

--ssh-jump='':
可选的堡垒机跳转配置字符串，例如：'--ssh-addr jumpe.naison.org --ssh-username naison --gssapi-password
xxx'

--ssh-keyfile='':
用于 SSH 认证的私钥文件的路径

--ssh-password='':
ssh 跳转服务器的密码

--ssh-username='':
ssh 跳转服务器的用户名
```