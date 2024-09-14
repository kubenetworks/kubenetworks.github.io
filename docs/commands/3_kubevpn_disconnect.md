---
sidebar_position: 3
---

# Kubevpn disconnect

Disconnect from Kubernetes cluster network

This command is used to disconnect from the cluster. After using the `kubevpn connect` command, you can use this command
to disconnect from a specific cluster. Before disconnecting, it will leave the proxy resource and clone resource if the
resource depends on this cluster. After disconnecting, it will also clean up the DNS and hosts.

# Examples

## Disconnect from the cluster network and restore proxy resource

```shell
kubevpn disconnect
```

# Options

```text
--all=false:
Disconnect all clusters, disconnect from all cluster networks

--cluster-id=[]:
Cluster id, command status -o yaml/json will show cluster-id
```