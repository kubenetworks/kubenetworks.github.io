---
sidebar_position: 3
---

# Proxy mode

As shown in the diagram below, the user uses the command `kubevpn proxy deployment/authors` to proxy all traffic to the
local computer. Therefore, whoever accesses the `authors` service in the cluster, the inbound traffic will be intercepted
to the local computer.

![proxy.svg](img/proxy.svg)