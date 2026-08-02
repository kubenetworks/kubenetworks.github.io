---
sidebar_position: 10
---

# Local proxy architecture

The local proxy (`kubevpn proxy-out`) provides a SOCKS5 and HTTP CONNECT proxy server that forwards traffic to the
Kubernetes cluster. This enables applications that don't support VPN/TUN interfaces (or run in environments where TUN
isn't available) to access cluster services through standard proxy protocols.

## Architecture

```text
Local Application
  │
  ├── SOCKS5 proxy ──────────┐
  │   (socks5://localhost:X)  │
  │                           ▼
  └── HTTP CONNECT proxy ──► ClusterConnector
      (http://localhost:Y)       │
                                 ├── resolve service name
                                 │   (Service → Endpoints → Pod)
                                 │
                                 ├── select target pod
                                 │   (random from ready endpoints)
                                 │
                                 └── kubectl port-forward
                                     (PodDialer → net.Conn)
```

## Use Cases

- **Nested VPN**: When another VPN client owns OS routes and TUN can't be used
- **Route conflicts**: When cluster CIDRs overlap with local network
- **Container environments**: Where TUN device creation is not possible

## How it works

The local proxy has two connector modes, selected by `--egress`:

**Cluster mode (default, no `--egress`)**

1. Start local SOCKS5 and/or HTTP CONNECT listener
2. When a connection arrives, resolve the destination hostname to a Kubernetes service
3. Look up service endpoints to find a ready pod
4. Use `kubectl port-forward` to establish a TCP connection to the target pod
5. Relay traffic bidirectionally between client and pod

**Host-egress mode (`--egress`)**

1. Start local SOCKS5 and/or HTTP CONNECT listener
2. When a connection arrives, dial the target directly from the host
3. Use the host's own DNS and network (socks5h host egress) — no Kubernetes API resolution
4. Relay traffic bidirectionally

Host-egress mode reaches the public internet directly. Under an active VPN connection it also reaches the cluster,
because the host's routing table already points cluster CIDRs into the VPN tunnel.

## User-daemon-managed proxy

Besides the standalone `kubevpn proxy-out` command, the same proxy can be started automatically by `kubevpn connect
--socks`. In that form the **user daemon** manages the proxy lifecycle: it stays up for the duration of the connection
and is torn down on disconnect. With `kubevpn connect --socks --egress` the managed proxy runs in host-egress mode.

## Protocols

- **SOCKS5** (RFC 1928): Supports CONNECT command, IPv4/FQDN/IPv6 addresses. Use `socks5h://` for proxy-side DNS
  resolution of cluster names.
- **HTTP CONNECT** (RFC 7231): Standard HTTP CONNECT tunneling for TCP traffic.

Scope: TCP traffic only. UDP is not supported through the proxy.

![local_proxy.svg](img/local_proxy.svg)
