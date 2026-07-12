---
sidebar_position: 16
---

# Route management

kubevpn provides route management commands to add, delete, and search routes on the TUN device.

## Add a route

Add a custom route to the current connection's TUN device:

```shell
kubevpn route add 198.18.0.1/32
```

## Delete a route

Remove a route from the TUN device:

```shell
kubevpn route delete 198.18.0.1/32
```

## Search a route

Look up routing information for a specific IP:

```shell
➜  ~ kubevpn route search 198.18.0.1
DESTINATION  GATEWAY      RT_IFA         MTU    NETIF
198.18.0.1   198.18.0.1   198.18.0.1     1500   utun5
```

## Extra routes via connect flags

You can also add extra routes at connect time:

```shell
kubevpn connect --extra-cidr 192.168.0.0/24 --extra-cidr 10.0.0.0/8
kubevpn connect --extra-domain test.example.com
kubevpn connect --extra-node-ip
```

![route_mgmt](img/route_mgmt.svg)
