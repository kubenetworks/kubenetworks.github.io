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

原理是使用了 `envoy` 做了数据面，然后实现了一个 `envoy` 的控制面（xDS）。

注入在**服务端**执行：客户端通过 gRPC 把代理意图下发给流量管理器，由其用自己的 ServiceAccount 注入
sidecar（没有客户端注入路径）。每个用户的路由目标存放在 Envoy xDS 配置里，因此客户端 IP 变化会经 xDS
推送生效（TCP + UDP），**无需重启 Pod**。"VPN-only" 代理（`kubevpn proxy` 不带 `--headers`）就是这条
mesh 路径的空 header 形式，匹配每个已声明端口上的所有请求；没有独立的 VPN-only injector。

## 默认模式(需要特性 ```Privileged: true``` 和 ```NET_ADMIN```)

关键是如何实现如下功能

> 当集群中的 `authors` 服务收到流量时

默认模式使用 `iptables` `DNAT` 将流量转发到**固定的** Envoy 入站端口 `:15006`（不指向任何客户端 IP），
所以工作在 `Pod` 级别，无论 `Pod` 是否会通过注册中心访问、通过 `service` 访问还是直接访问，都可以拦截流量，
因此体验是最好的。随后 Envoy 按 header（或空 header 的全匹配）路由到对应用户的 TUN IP。

例如:

```shell
kubevpn proxy deployment/authors --headers user=A
```

![mesh.svg](img/mesh.svg)