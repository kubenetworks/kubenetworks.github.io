---
sidebar_position: 2
---

# Connect mode with gVisor

As shown in the diagram below, both computers can connect to the same cluster network using `kubevpn connect`, enabling
them to access cluster resources locally.

use `gVisor` to access k8s `service-cidr` and `pod-cidr` network

## Requirement

- No need ```Privileged: true```
- No need cap ```NET_ADMIN```

![connect_gvisor.svg](img/connect_gvisor.svg)