---
sidebar_position: 7
---

# DNS 架构

如下图所示，在 `Pod` `kubevpn-traffic-manager` 中，内置了一个 `DNS server`
，用于做域名解析服务。

当在本地使用域名的方式访问集群中资源时：

- 首先发送 `DNS query` 到 `DNS server`
- `DNS server` 会尝试解析给到的 `name`，例如 `authors.default`
- 如果查询不到，则会根据 `/etc/resolv.conf` 文件中的 `search` 规则，进行补全和重试

![dns.svg](dns.svg)