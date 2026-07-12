---
sidebar_position: 19
---

# Kubevpn connection

Connection management commands. Alias: `conn`.

When you connect to multiple Kubernetes clusters simultaneously, use these subcommands to list and switch between
active connections.

# Subcommands

## connection list

List all connections connected to cluster network. Alias: `ls`.

```shell
kubevpn connection list
# or use aliases
kubevpn connection ls
kubevpn conn ls
```

## connection use

Use a specific connection. Change the current active connection to the specified connection ID. Commands like
`sync`/`unsync` will use this connection.

```shell
kubevpn connection use 03dc50feb8c3
```
