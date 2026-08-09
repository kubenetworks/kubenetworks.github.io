---
sidebar_position: 11
---

# IPv6 / 双栈架构

KubeVPN 端到端采用双栈：每一层处理地址时都**同时处理一个 IPv4 和一个 IPv6 地址对**。一次连接会从两个地址池
各分配一个地址，TUN 设备承载两者，路由和 DNS 为两族同时编程，gvisor 栈同时转发两者，envoy 按族生成监听器。

IPv6 尽力启用——当主机或 Pod 没有 IPv6 时，v6 那一半会被优雅跳过（例如使用仅 IPv4 的 envoy 模板），
因此纯 IPv4 环境仍然可用。

## 地址池

定义在 `pkg/config/config.go`：

| 常量 | 值 | 作用 |
|---|---|---|
| `IPv4Pool` | `198.18.0.0/16` | TUN IPv4 分配池（基准测试保留段） |
| `IPv6Pool` | `2001:2::/64` | TUN IPv6 分配池（基准测试保留段） |

两个段都取自为基准测试保留的地址块（RFC 2544 / RFC 5180），以避免与真实集群流量冲突。

## v4/v6 对如何贯穿整栈

```text
DHCP               RentIP → 从两个 ipallocator.Range 位图返回 (IPv4, IPv6) 对
   │
NetworkManager     localTunIPv4 + localTunIPv6 ; ChangeTunIP() 热更新两者
   │
TUN 设备           分配两个地址；按平台走 v6 路径；按族配置路由 + iptables/ip6tables
   │
gvisor 栈          ipv4.NewProtocol + ipv6.NewProtocol；两者都开启转发
   │
DNS                为 AF_INET 和 AF_INET6 设置解析器
   │
Envoy xDS          LocalTunIPv6 传播到规则；选择 ipv4 或双栈模板
```

### DHCP —— 成对分配

DHCP 管理器持有**两个**分配位图，一个基于 IPv4 池，一个基于 IPv6 池。每次租用都返回一个 v4+v6 对；
释放时按 IP 是否为 IPv4 分派。这保证每个连接都有一致的对，而非独立的 v4/v6 租约。

### NetworkManager —— 地址对持有者

`localTunIPv4` 和 `localTunIPv6` 是数据面的规范地址对。当控制面返回 TUN IP 时，非空的 IPv6 字段会被
解析为 v6 CIDR。`ChangeTunIP(newIPv4, newIPv6)` 在不重启栈的情况下热更新两者。

### TUN 设备 —— 按平台分配 v6

两个地址都分配到接口上；v6 路径按平台不同：

- **macOS/BSD**：只*添加*别名，因此会先移除旧地址，避免设备携带两个 IP。
- **Windows**：基于 `winipcfg` LUID 的地址管理。
- **Linux**：netlink。

路由与之对应：为 IPv4 编程 `nat PREROUTING` DNAT，为 IPv6 编程平行的 `ip6tables` 规则。

### gvisor 栈 —— 双网络协议

栈同时注册 `ipv4.NewProtocol` 和 `ipv6.NewProtocol`，设置每协议选项，并通过
`SetForwardingDefaultAndAllNICs` 为两族开启转发。

### DNS —— 双族

在 Windows 上，对 `AF_INET` 和 `AF_INET6` 都调用 `SetDNS`，销毁时两者都刷新。其他平台为两族配置
解析器。

### Envoy xDS —— 按族 + 模板选择

IPv6 的 TUN 地址被带入 envoy 规则规范并传播到每条规则，使控制面能为 v6 目标生成监听器/集群。sidecar
有**两种内嵌的 bootstrap 变体**：双栈（`envoy.yaml` / `fargate_envoy.yaml`）和仅 IPv4
（`envoy_ipv4.yaml` / `fargate_envoy_ipv4.yaml`）。变体在注入时通过检测管理器命名空间中的 Pod 是否支持
IPv6 来选择。

## 能力检测

| 检查 | 作用 |
|---|---|
| `IsIPv6Enabled` | 主机是否有 IPv6（任一接口上有非环回 v6 地址，或 Windows 注册表标志） |
| `DetectPodSupportIPv6` | 管理器命名空间中的 Pod 是否支持 IPv6——用于选择 envoy 模板 |
| `IsIPv6(packet)` | 对原始数据包的首字节检查，用于数据面按族路由 |

当 IPv6 不可用时，跳过 v6 那一半的分配/赋值，并使用仅 IPv4 的 envoy 模板。

## 数据包级按族分发

在数据面，原始数据包按 IP 版本首字节分类以选择正确的处理路径。为 v6 心跳生成 ICMPv6 包，与
IPv4 的 ICMP 心跳相对应。
