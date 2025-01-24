---
sidebar_position: 5
---

# Dev mode

As shown in the figure below, `User A` and `User B` use the `kubevpn dev` and `kubevpn proxy` commands respectively to
develop the same service `authors`:

- User A: `kubevpn dev deployment/authors --headers user=A`
- User B: `kubevpn proxy deployment/authors --headers user=B`

When the `authors` service in the cluster receives traffic:

- Traffic with `user: A` in the `HTTP header` will hit `User A`'s local computer.
- Traffic with `user: B` in the `HTTP header` will hit `User B`'s local computer.
- Unmatched traffic in the `HTTP header` will hit the original `authors` service in the cluster.

The difference with the `service mesh` solution is: `User A` will use `Docker` to simulate the `Pod` runtime locally,
which means that the storage volume, environment variables and network in the `Pod` will be run locally in the form of
a `Docker container`. This allows for faster code debugging locally.

![dev.svg](dev.svg)