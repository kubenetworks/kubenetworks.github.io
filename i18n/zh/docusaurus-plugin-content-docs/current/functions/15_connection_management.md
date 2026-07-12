---
sidebar_position: 15
---

# 连接管理

当同时连接到多个 Kubernetes 集群时，kubevpn 提供连接管理命令来列出和切换活跃连接。

## 列出所有连接

```shell
➜  ~ kubevpn connection list
CURRENT   CONNECTION ID   CLUSTER                 KUBECONFIG                      NAMESPACE   STATUS      NETIF
          03dc50feb8c3    ccijorbccotmqodvr189g   ~/.kube/config                  default     connected   utun4
*         86bfdef0ed05    ccidd77aam2dtnc3qnddg   ~/.kube/dev_config              default     connected   utun5
```

也可以使用短别名：

```shell
kubevpn connection ls
kubevpn conn ls
```

## 切换活跃连接

使用 `connection use` 切换当前活跃连接。`sync`/`unsync` 等命令会操作当前连接。

```shell
kubevpn connection use 03dc50feb8c3
```

## 断开特定连接

```shell
kubevpn disconnect 03dc50feb8c3
```

## 断开所有连接

```shell
kubevpn disconnect --all
```

![connection_mgmt](img/connection_mgmt.svg)
