---
sidebar_position: 8
---

# DNS 架构

如下图所示，`kubevpn-traffic-manager` Pod 内置了 `DNS 服务器`，用于域名解析服务。

当在本地使用域名访问集群中的资源时：

- 首先发送 `DNS 查询` 到 `DNS 服务器`
- `DNS 服务器` 会尝试解析给定的 `名称`，例如 `authors.default`
- 如果查询不到，则根据 `/etc/resolv.conf` 文件中的 `search` 规则进行补全和重试

## DNS 转发服务器

DNS 转发服务器在流量管理器 Pod 中作为 `dns` 容器运行，监听 53 端口。

### 解析策略

对于每个查询（例如 `my-svc`）：

1. **缓存检查**：缓存以 `(name, qtype, qclass)` 为键，存储**完整的 DNS 响应**，而非仅名称映射。正向应答按记录
   最小 TTL 过期（上限 30 分钟）；`NXDOMAIN`/`NODATA` 按 SOA 最小值做负缓存（上限 30 秒）；瞬时失败
   （`SERVFAIL`）**不**缓存。
2. **单飞合并**：并发的相同未命中查询会被合并，只发起一次上游查询。
3. **搜索域扩展**：如果未缓存，使用所有搜索域扩展名称：
   - `my-svc.`（裸名）
   - `my-svc.default.svc.cluster.local.`
   - `my-svc.svc.cluster.local.`
   - `my-svc.cluster.local.`
4. **扇出解析**：对每个扩展名称 × 每个上游 DNS 服务器并发查询，第一个成功响应胜出，其余在途分支被取消。
5. **缓存更新**：存储胜出的响应。
6. **响应重写**：将扩展名称替换回原始名称。

## 客户端 DNS 设置

平台特定的 DNS 配置：

- **Linux**：systemd-resolved（首选）> tailscale DNS 配置器。**没有 `/etc/resolv.conf` 降级**——若主机没有
  可做分域解析的 DNS 管理器，安装步骤会打印告警并返回，不触碰全局 resolver（KubeVPN 从不写 `/etc/resolv.conf`）。
- **macOS**：/etc/resolver/ 目录下每个域的解析器文件
- **Windows**：TUN 接口上的 LUID.SetDNS

此外，还会为服务添加 `/etc/hosts` 条目（service.name -> ClusterIP），以支持短域名解析。这些条目由**流量管理器
推送驱动**：管理器发现服务并经 `WatchNamespaceRoutes` 流推送给客户端（见[连接模式](2_connect.md)），再写入 DNS
配置——客户端不再运行自己的 service informer。

![dns.svg](img/dns.svg)
