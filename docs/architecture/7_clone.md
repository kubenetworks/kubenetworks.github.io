---
sidebar_position: 7
---

# Clone mode

As shown in the diagram below, `User A` and `User B` use the `kubevpn clone` command to clone the same
service `authors`:

- User A: `kubevpn clone deployment/authors --headers user=A --sync ~/code:/app/code`
- User B: `kubevpn clone deployment/authors --headers user=B --sync ~/code:/app/code`

When the `authors` service in the cluster receives traffic:

- Traffic with `user: A` in the `HTTP header` will hit the cloned service `authors'`.
- Traffic with `user: B` in the `HTTP header` will hit the cloned service `authors''`.
- Unmatched traffic in the `HTTP header` will hit the original `authors` service in the cluster.

File synchronization is implemented using `syncthing`:

- The `~/code` on user A's computer will be synchronized to the `/app/code` directory of the cloned resource `authors'`
  in the cluster.
- The `~/code` on user B's computer will be synchronized to the `/app/code` directory of the cloned resource `authors''`
  in the cluster.

![clone.svg](img/clone.svg)