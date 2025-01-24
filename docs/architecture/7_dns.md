---
sidebar_position: 7
---

# DNS architecture

As shown in the diagram below, the `kubevpn-traffic-manager` Pod has a built-in `DNS server` for domain name resolution
services.

When accessing resources in the cluster locally using a domain name:

- First, a `DNS query` is sent to the `DNS server`.
- The `DNS server` will try to resolve the given `name`, for example, `authors.default`.
- If the query fails, it will complement the name and retry based on the `search` rules in the `/etc/resolv.conf` file.

![dns.svg](dns.svg)