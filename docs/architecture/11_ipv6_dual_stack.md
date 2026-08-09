---
sidebar_position: 11
---

# IPv6 / Dual-Stack architecture

KubeVPN is dual-stack end to end: every layer that handles an address handles **both an IPv4 and an IPv6 address as a
pair**. A connection is allocated one address from each pool, the TUN device carries both, routes and DNS are
programmed for both families, the gvisor stack forwards both, and envoy generates listeners per family.

IPv6 is enabled best-effort — where the host or pod has no IPv6, the v6 half is gracefully skipped (e.g. an IPv4-only
envoy template), so an IPv4-only environment still works.

## Address pools

Defined in `pkg/config/config.go`:

| Constant | Value | Role |
|---|---|---|
| `IPv4Pool` | `198.18.0.0/16` | TUN IPv4 allocation pool (benchmarking-reserved range) |
| `IPv6Pool` | `2001:2::/64` | TUN IPv6 allocation pool (benchmarking-reserved range) |

Both ranges are from blocks reserved for benchmarking (RFC 2544 / RFC 5180), chosen to avoid colliding with real
cluster traffic.

## How the v4/v6 pair threads through the stack

```text
DHCP               RentIP → (IPv4, IPv6) pair from two ipallocator.Range bitmaps
   │
NetworkManager     localTunIPv4 + localTunIPv6 ; ChangeTunIP() hot-updates both
   │
TUN device         assigns both addresses; per-OS v6 path; routes + iptables/ip6tables per family
   │
gvisor stack       ipv4.NewProtocol + ipv6.NewProtocol; forwarding on both
   │
DNS                resolver set for AF_INET and AF_INET6
   │
Envoy xDS          LocalTunIPv6 propagated into rules; ipv4 vs dual template
```

### DHCP — paired allocation

The DHCP manager holds **two** allocation bitmaps, one over the IPv4 pool and one over the IPv6 pool. Every rent
returns a v4+v6 pair; release dispatches by checking whether the IP is IPv4. This guarantees every connection has a
consistent pair instead of independent v4/v6 leases.

### NetworkManager — the pair holder

`localTunIPv4` and `localTunIPv6` are the data-plane's canonical pair. When the control plane returns a TUN IP, a
non-empty IPv6 field is parsed into the v6 CIDR. `ChangeTunIP(newIPv4, newIPv6)` hot-updates both addresses without
restarting the stack.

### TUN device — per-OS v6 assignment

Both addresses are assigned to the interface; the v6 path is platform-specific:

- **macOS/BSD**: only *adds* an alias, so the old address is removed first to avoid the device carrying two IPs.
- **Windows**: `winipcfg` LUID-based address management.
- **Linux**: netlink.

Routing mirrors this: `nat PREROUTING` DNAT for IPv4 and the parallel `ip6tables` rule for IPv6.

### gvisor stack — both network protocols

The stack registers both `ipv4.NewProtocol` and `ipv6.NewProtocol`, sets per-protocol options, and enables forwarding
for both families via `SetForwardingDefaultAndAllNICs`.

### DNS — both families

On Windows, `SetDNS` is called for both `AF_INET` and `AF_INET6`, and both are flushed on teardown. Other platforms
configure the resolver for both families.

### Envoy xDS — per-family + template selection

The IPv6 TUN address is carried in the envoy rule spec and propagated into each rule so the control plane can emit
listeners/clusters for the v6 target. The sidecar has **two embedded bootstrap variants**: dual-stack
(`envoy.yaml` / `fargate_envoy.yaml`) and IPv4-only (`envoy_ipv4.yaml` / `fargate_envoy_ipv4.yaml`). The variant is
chosen at injection time by detecting whether pods in the manager namespace support IPv6.

## Capability detection

| Check | What it does |
|---|---|
| `IsIPv6Enabled` | Whether the host has IPv6 (non-loopback v6 address on an interface, or the Windows registry flag) |
| `DetectPodSupportIPv6` | Whether pods in the manager namespace support IPv6 — picks the envoy template |
| `IsIPv6(packet)` | First-nibble check on a raw packet, used in the data plane to route by family |

When IPv6 is unavailable, allocation/assignment of the v6 half is skipped and the IPv4-only envoy template is used.

## Packet-level family dispatch

In the data plane, raw packets are classified by the IP-version nibble to pick the right handling path. ICMPv6
packets are generated for the v6 heartbeat, paralleling the IPv4 ICMP heartbeat.
