---
sidebar_position: 10
---

# 支持多种协议

支持 OSI 模型三层及三层以上的协议，例如：

- TCP
- UDP
- ICMP
- gRPC
- Thrift
- WebSocket
- HTTP
- ...

:::note
完整的协议支持（含 UDP、ICMP）适用于 VPN 数据面——`kubevpn connect` 以及代理非 Service 类工作负载
（如 `kubevpn proxy deployment/xxx`），它们使用 TUN 设备。

**Fargate / Service 模式**（`kubevpn proxy service/xxx`，即目标是 K8s Service，或在无 TUN 设备 /
`NET_ADMIN` 的 Fargate 环境）经 envoy + SSH 反向隧道转发，**仅支持 TCP**——该路径不支持 UDP 与 ICMP。
:::