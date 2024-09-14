---
sidebar_position: 5
---

# kubevpn leave

离开代理资源并恢复到原始状态

这个命令用于离开代理资源。在使用 `kubevpn proxy xxx`
命令后，你可以使用这个命令来离开代理资源。你只能离开自己代理的资源。当最后一个用户离开代理资源时，它会恢复工作负载容器。(删除容器
vpn 和 envoy-proxy)。

# 示例

## 离开代理资源并恢复到原始状态

```shell
kubevpn leave deployment/authors
```