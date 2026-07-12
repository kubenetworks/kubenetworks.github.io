---
sidebar_position: 3
---

# kubevpn disconnect

断开与 Kubernetes 集群网络的连接

使用 `kubevpn connect` 命令后，可以使用此命令断开与特定集群的连接。

- 断开前，会自动离开依赖于此集群的代理资源和同步资源。
- 断开后，还会清理 DNS 和 hosts 设置。

# 示例

## 断开指定连接 ID 的连接

```shell
kubevpn disconnect 03dc50feb8c3
```

## 断开所有集群连接

```shell
kubevpn disconnect --all
```

# 选项

```text
--all=false:
断开所有集群连接

--debug=false:
是否启用调试模式，true 或 false
```
