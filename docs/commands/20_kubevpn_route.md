---
sidebar_position: 20
---

# Kubevpn route

Route table management. Manage routes on the current connection's tun device.

# Subcommands

## route add

Add a route to the current connection's tun device.

```shell
kubevpn route add 198.18.0.1/32
```

## route delete

Delete a specific route from the current connection's tun device.

```shell
kubevpn route delete 198.18.0.1/32
```

## route search

Search for a specific route by destination IP. Shows the gateway, source IP, MTU and network interface for the route.

```shell
kubevpn route search 198.18.0.1
```

Example output:

```text
DESTINATION  GATEWAY      RT_IFA         MTU    NETIF
198.18.0.1   198.18.0.1   198.18.0.1     1500   utun5
```
