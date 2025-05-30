---
sidebar_position: 3
---

# Proxy with service mesh

As shown in the diagram below, `User A` and `User B` use the `kubevpn proxy` command to proxy the same service `authors`
respectively:

- User A: `kubevpn proxy deployment/authors --headers user=A`
- User B: `kubevpn proxy deployment/authors --headers user=B`

When the `authors` service in the cluster receives traffic:

- Traffic with `user: A` in the `HTTP header` will hit `User A`'s local computer.
- Traffic with `user: B` in the `HTTP header` will hit `User B`'s local computer.
- Unmatched traffic in the `HTTP header` will hit the original `authors` service in the cluster.

The principle is to use `envoy` as the data plane and implement a control plane for `envoy`.

## Default mode ( need ```Privileged: true``` and cap ```NET_ADMIN``` )

The key is how to implement the function bellow.

> When the `authors` service in the cluster receives traffic

default mode use `iptables` `DNAT` traffic to port `:15006`, so works on `Pod` level, best experience.

example:

```shell
kubevpn proxy deployment/authors --headers user=A
```

![mesh.svg](img/mesh.svg)