---
sidebar_position: 3
---

# Proxy mode

As shown in the diagram below, the user uses the command `kubevpn proxy deployment/authors` to intercept the workload's
inbound traffic to the local computer. Therefore, whoever accesses the `authors` service in the cluster, the inbound
traffic (on the workload's declared container ports) will be routed to the local computer.

After proxy resource, it also connected to cluster network automatically. so just startup your app in local PC and
waiting for inbound traffic.

## How it works

1. Connect to cluster network (same as connect mode).
2. **Injection runs server-side.** The client sends the proxy intent to the traffic manager
   over gRPC (`ProxyInject`); the manager, using its own in-cluster ServiceAccount, injects a
   **VPN + Envoy** sidecar pair into the target workload. There is no client-side injection
   fallback.
3. The injected sidecar's iptables DNAT captures inbound traffic to a **fixed** Envoy inbound
   port (`:15006`) — not to any client IP. Envoy then routes it via the xDS control plane:
   - **without `--headers`** — every request on each **declared** container port is forwarded
     to your machine over the tunnel (undeclared ports fall through to the real app);
   - **with `--headers k=v`** — only matching requests go to your machine, the rest hit the
     real app (multiple users can proxy the same workload with different headers).
4. Because the routing target lives in the Envoy xDS config, a client TUN-IP change is picked
   up automatically (TCP + UDP) with **no Pod restart**.
5. Support port mapping (`--portmap`) to route additional / renamed ports to local.

"VPN-only" proxy (no `--headers`) is just this mesh path with empty headers — there is no
separate VPN-only injector.

```text
┌──────────┐    ┌─────────┌──────────┐    ┌──────────┐
│ ServiceA ├───►│ sidecar │ ServiceB │ ┌─►│ ServiceC │
└──────────┘    └────┌────┘──────────┘ │  └──────────┘
                     │                 │
                     │                 │                     cloud
 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘─ ─ ─ ─ ─ ─ ─ ─ ─┘ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                     │                 │                     local
                 ┌───┘──────┐          │
                 │ ServiceB'├──────────┘
                 └──────────┘
```

![proxy.svg](img/proxy.svg)
