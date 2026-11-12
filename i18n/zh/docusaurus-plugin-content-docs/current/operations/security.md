---
sidebar_position: 1
---

# 安全

本文档介绍使用 KubeVPN 时的安全考虑、权限和最佳实践。

## 本地权限

KubeVPN 在执行某些操作时需要提升权限：

- **TUN 设备创建**：创建虚拟网络接口需要 root/管理员权限
- **路由表管理**：修改系统路由以通过 TUN 设备路由集群流量
- **DNS 配置**：更新系统 DNS 设置以解析集群域名

首次使用时，KubeVPN 会请求权限提升（macOS/Linux 上是 sudo，Windows 上是 UAC）来设置这些组件。守护进程以提升的权限运行以维护网络连接，而 CLI 本身在初始设置后以非特权用户运行。

## 集群 RBAC

KubeVPN 使用 Kubernetes RBAC（基于角色的访问控制）系统。所需权限包括：

- 读/写 ConfigMap（用于 IPAM 分配和 Envoy 配置）
- 读/写 Secret（用于 TLS 证书管理）
- 读/写 Deployment（用于流量管理器部署）
- 读 pod/namespace/service（用于发现和注入）
- 创建 pod（用于 sidecar 注入）
- 补丁 pod（用于离开时取消注入）

流量管理器使用自己的服务帐户和有限权限运行，除非显式配置，否则不使用集群管理员权限。

## 网络与 DNS

- **TUN 设备**：KubeVPN 创建一个隔离的 TUN 设备，仅路由进出 Kubernetes 集群的流量
- **DNS 隔离**：集群 DNS 查询通过集群路由，其他 DNS 查询继续使用系统解析器（Linux 除外，其中 `resolvectl` 设置每个链路的 DNS）
- **流量加密**：客户端与集群之间的所有数据平面流量都通过 TLS 加密，默认启用混淆（参见 [混淆](https://github.com/kubenetworks/kubevpn/blob/master/docs/54-traffic-obfuscation.md)）

## Sidecar 权限

注入 sidecar 时，KubeVPN 使用特权安全上下文，包括：

- `NET_ADMIN`：用于通过代理路由流量时的 iptables 规则
- `NET_RAW`：用于 ICMP/ping 功能
- `privileged: true`：用于在启动时写入 `/proc/sys/net/ipv4/ip_forward` 和相关 sysctl
- `RunAsUser: 0`、`RunAsGroup: 0`：以 root 用户运行

这是 VPN sidecar 正常运行所必需的。对于共享集群，请仔细考虑安全影响。

## 共享集群最佳实践

在共享集群上使用 KubeVPN 时：

1. **使用专用命名空间**：为 KubeVPN 创建一个特定的命名空间（例如 `kubevpn`），而不是使用 `default`
2. **限制权限**：使用 Kubernetes RBAC 限制 KubeVPN 在其他命名空间中可以执行的操作
3. **审计活动**：监控集群中的 pod 创建/更新/删除
4. **正确清理**：始终使用 `kubevpn leave` 和 `kubevpn disconnect`，而不是终止进程，以确保资源被清理
5. **避免生产集群**：日常开发首选预发布或开发集群

## 最小权限与清理

KubeVPN 设计为：

- 使用现有的 kubeconfig 进行集群访问
- 使用 `kubevpn leave` 时清理代理/同步资源（pod、configmap、secret）
- 使用 `kubevpn disconnect` 时清理本地网络资源
- 除流量管理器外不运行持久的集群范围组件（流量管理器可通过 `kubevpn uninstall` 卸载）
- 使用自动轮换的临时 TLS 证书

DNS 故障排除请参阅：
- [Linux DNS](../faq/linux-dns.md)
- [Windows VMP](../faq/windows-vmp.md)

## 实现细节

深入的技术理解：

- [数据平面流混淆与 TLS 强制执行](https://github.com/kubenetworks/kubevpn/blob/master/docs/54-traffic-obfuscation.md)
- [流量管理器架构](https://github.com/kubenetworks/kubevpn/blob/master/docs/01-traffic-manager.md)
