---
sidebar_position: 3
---

# Kubevpn disconnect

Disconnect from Kubernetes cluster network

This command is used to disconnect from the cluster. After using the `kubevpn connect` command, you can use this command
to disconnect from a specific cluster.

- Before disconnecting, it will leave the proxy resource and sync resource if the resource depends on this cluster.
- After disconnecting, it will also clean up the DNS and hosts.

# Examples

## disconnect from first cluster

```shell
kubevpn disconnect 0
```

## disconnect from second cluster

```shell
kubevpn disconnect 1
```

## disconnect from all cluster

```shell
kubevpn disconnect --all
```

# Options

```text
--all=false:
Disconnect all clusters, disconnect from all cluster networks

```