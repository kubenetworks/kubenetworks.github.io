---
sidebar_position: 4
---

# 使用服务网格进行代理

如下图所示，`用户 A` 和 `用户 B`，分别使用了 `kubevpn proxy`
命令代理了同一个服务 `authors`:

- 用户 A: `kubevpn proxy deployment/authors --headers user=A`
- 用户 B: `kubevpn proxy deployment/authors --headers user=B`

当集群中的 `authors` 服务收到流量时:

- `HTTP header` 中带有 `user: A` 的流量会击中 `用户 A` 的本地电脑
- `HTTP header` 中带有 `user: B` 的流量会击中 `用户 B` 的本地电脑
- `HTTP header` 中不匹配的流量会击中集群中原始的 `authors` 服务

原理是使用了 `envoy` 做了数据面，然后实现了一个 `envoy` 的控制面。

## 默认模式(需要特性 ```Privileged: true``` 和 ```NET_ADMIN```)

关键是如何实现如下功能

> 当集群中的 `authors` 服务收到流量时

默认模式使用 `iptables` `DNAT` 将流量转发到端口 `:15006`，所以工作在 `Pod` 级别，无论 `Pod`
是否会通过注册中心访问、通过 `service` 访问还是直接访问，都可以拦截流量，因此体验是最好的。

例如:

```shell
kubevpn proxy deployment/authors --headers user=A
```

![mesh.svg](img/mesh.svg)