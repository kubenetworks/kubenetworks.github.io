---
sidebar_position: 6
---

# 开发模式

如下图所示，`用户 A` 和 `用户 B`，分别使用了 `kubevpn dev` 和 `kubevpn proxy`
命令开发了同一个服务 `authors`:

- 用户 A: `kubevpn dev deployment/authors --headers user=A`
- 用户 B: `kubevpn proxy deployment/authors --headers user=B`

当集群中的 `authors` 服务收到流量时:

- `HTTP header` 中带有 `user: A` 的流量会击中 `用户 A` 的本地电脑
- `HTTP header` 中带有 `user: B` 的流量会击中 `用户 B` 的本地电脑
- `HTTP header` 中不匹配的流量会击中集群中原始的 `authors` 服务

和 `service mesh` 方案不同的地方在于: `用户 A` 会在本地使用 `Docker` 模拟 `Pod` 运行时，也就是会把 `Pod`
中的存储卷，环境变量和网络，都以 `Docker container`
的形式运行在本地。这样在本地可以更快速的进行代码调试。

![dev.svg](img/dev.svg)