---
sidebar_position: 3
---

# kubevpn disconnect

与 Kubernetes 集群网络断开连接

这个命令用来断开与集群的连接。在使用 `kubevpn connect`
命令后，你可以使用这个命令从特定的集群断开连接。

- 在断开连接之前，它会退出代理模式和同步资源（如果处于代理模式/同步模式）。
- 断开连接后，它还会清理 DNS 和 hosts 相关设置。

# 示例

## 断开与第一个集群网络的连接

```shell
kubevpn disconnect 0
```

## 断开与第二个集群网络的连接

```shell
kubevpn disconnect 1
```

## 断开与所有集群网络的连接

```shell
kubevpn disconnect --all
```

# 选项

```text
--all=false:
与所有集群断开连接，断开所有集群网络的连接

```