---
sidebar_position: 15
---

# Kubevpn upgrade

Upgrade kubevpn client to the latest version, automatically download and install the latest kubevpn from GitHub.
Disconnect from all k8s clusters, leave proxied resources, remove all sync resources, and then upgrade the local
daemon gRPC server to the latest version.

## Examples

### Upgrade kubevpn to the latest version

```bash
kubevpn upgrade
```