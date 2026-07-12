---
sidebar_position: 10
---

# Support multiple protocol

support OSI model layers 3 and above, protocols like:

- TCP
- UDP
- ICMP
- gRPC
- Thrift
- WebSocket
- HTTP
- ...

:::note
Full protocol coverage (including UDP and ICMP) applies to the VPN data path — `kubevpn
connect` and proxying a non-Service workload (e.g. `kubevpn proxy deployment/xxx`), which uses
a TUN device.

**Fargate / Service mode** (`kubevpn proxy service/xxx`, used when the target is a K8s
Service or on Fargate where a TUN device / `NET_ADMIN` is unavailable) routes through
envoy + an SSH reverse tunnel and is **TCP-only** — UDP and ICMP are not supported on that
path.
:::