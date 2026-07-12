---
sidebar_position: 10
---

# 本地代理架构

本地代理（`kubevpn proxy-out`）提供 SOCKS5 和 HTTP CONNECT 代理服务器，将流量转发到 Kubernetes 集群。
这使得不支持 VPN/TUN 接口的应用程序（或在无法创建 TUN 的环境中）可以通过标准代理协议访问集群服务。

## 架构

```text
本地应用程序
  │
  ├── SOCKS5 代理 ───────────┐
  │   (socks5://localhost:X)  │
  │                           ▼
  └── HTTP CONNECT 代理 ──► ClusterConnector
      (http://localhost:Y)       │
                                 ├── 解析服务名
                                 │   (Service → Endpoints → Pod)
                                 │
                                 ├── 选择目标 Pod
                                 │   (从就绪端点中随机选择)
                                 │
                                 └── kubectl port-forward
                                     (PodDialer → net.Conn)
```

## 使用场景

- **嵌套 VPN**：当另一个 VPN 客户端占用 OS 路由且无法使用 TUN 时
- **路由冲突**：当集群 CIDR 与本地网络重叠时
- **容器环境**：无法创建 TUN 设备的环境

## 工作原理

1. 启动本地 SOCKS5 和/或 HTTP CONNECT 监听器
2. 当连接到达时，将目标主机名解析为 Kubernetes 服务
3. 查找服务端点找到就绪的 Pod
4. 使用 `kubectl port-forward` 建立到目标 Pod 的 TCP 连接
5. 在客户端和 Pod 之间双向转发流量

## 协议

- **SOCKS5**（RFC 1928）：支持 CONNECT 命令，IPv4/FQDN/IPv6 地址。使用 `socks5h://` 可以让代理端解析集群 DNS 名称。
- **HTTP CONNECT**（RFC 7231）：标准 HTTP CONNECT 隧道，用于 TCP 流量。

范围：仅支持 TCP 流量。UDP 不通过代理支持。

![local_proxy.svg](img/local_proxy.svg)
