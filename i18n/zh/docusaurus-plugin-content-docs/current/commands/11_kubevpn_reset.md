---
sidebar_position: 11
---

# kubevpn reset

重置工作负载为原来的规格

重置操作将会移除所有由 kubevpn 注入的容器，vpn 和 envoy。并且恢复所有的服务网格规则。

## 示例

### 重置在默认命名空间的 deployment authors

```bash
kubevpn reset deployment/authors
```

### 重置另一个命名空间 test

```shell
kubevpn reset deployment/authors -n test
```

### 连接到堡垒机或 ssh 跳转机后的集群 API 服务器

```shell
kubevpn reset deployment/authors --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

### 也支持 ProxyJump，例如

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn reset deployment/authors --ssh-alias <alias>
```

### 支持使用 GSSAPI 进行 ssh 认证

```shell
kubevpn reset deployment/authors --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn reset deployment/authors --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn reset deployment/authors --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
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