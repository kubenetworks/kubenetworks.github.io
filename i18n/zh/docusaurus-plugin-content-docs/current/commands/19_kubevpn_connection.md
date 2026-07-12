---
sidebar_position: 19
---

# kubevpn connection

连接管理命令。别名：`conn`。

当同时连接到多个 Kubernetes 集群时，使用这些子命令列出和切换活跃连接。

# 子命令

## connection list

列出所有已连接的集群网络连接。别名：`ls`。

```shell
kubevpn connection list
# 或使用别名
kubevpn connection ls
kubevpn conn ls
```

## connection use

切换当前活跃连接。`sync`/`unsync` 等命令将使用当前连接。

```shell
kubevpn connection use 03dc50feb8c3
```
