---
sidebar_position: 5
---

# Kubevpn leave

Leave proxy resource and restore it to origin

This command is used to leave proxy resources. After using the `kubevpn proxy xxx` command, you can use this command to
leave proxy resources. You can only leave proxy resources that you set up yourself. And the last one to leave the proxy
resource, it will also restore the workloads container. Otherwise, it will keep containers [vpn, envoy-proxy] until the
last one to leave.

# Examples

## Leave proxy resource and restore it to origin

```shell
kubevpn leave deployment/authors
```