---
sidebar_position: 12
---

# kubevpn quit

断开与集群的连接，退出守护进程 gRPC 服务器并清理 dns 和 hosts。

退出 kubevpn 之前，它会退出代理模式和同步资源（如果处于代理模式/同步模式）。断开连接后，清理 DNS 和 hosts 相关设置。

# 示例

```bash
kubevpn quit
```