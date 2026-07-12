---
sidebar_position: 20
---

# kubevpn route

路由表管理。管理当前连接的 TUN 设备上的路由。

# 子命令

## route add

向当前连接的 TUN 设备添加路由。

```shell
kubevpn route add 198.18.0.1/32
```

## route delete

从当前连接的 TUN 设备删除路由。

```shell
kubevpn route delete 198.18.0.1/32
```

## route search

按目标 IP 搜索路由。显示网关、源 IP、MTU 和网络接口信息。

```shell
kubevpn route search 198.18.0.1
```

输出示例：

```text
DESTINATION  GATEWAY      RT_IFA         MTU    NETIF
198.18.0.1   198.18.0.1   198.18.0.1     1500   utun5
```
