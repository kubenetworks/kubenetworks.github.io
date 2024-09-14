---
sidebar_position: 12
---

# Kubevpn quit

Disconnect from the cluster, leave proxy resources, quit the daemon gRPC server and clean up dns/host.

Before quitting kubevpn, it will restore the proxy resources to their origin and disconnect from the cluster. It will
also clean up the dns/hosts settings.

# Examples

```bash
kubevpn quit
```