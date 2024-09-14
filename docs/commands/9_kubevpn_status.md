---
sidebar_position: 9
---

# Kubevpn status

Show connect status and list proxy/clone resource

Show connect status and list proxy or clone resource. You can check the connect status by the status field and netif. If
netif is empty, it means the tun device is closed, making it unhealthy. It will also display route information. If
proxying workloads, it shows not only the proxy resource itself but also other route information.

# Examples

## Show status for connect status and list proxy/clone resource

```shell
kubevpn status
```

## Query status by alias config name dev_new

```shell
kubevpn status --alias dev_new
```

## Query status with output in JSON format

```shell
kubevpn status -o json
```

## Query status with output in YAML format

```shell
kubevpn status -o yaml
```

# Options

```text
--alias='':
Alias name, query connect status by alias config name

-f, --file='/Users/bytedance/.kubevpn/config.yaml':
Config file location

-o, --output='table':
Output format. One of: (json, yaml, table)

-r, --remote='':
Remote config file, e.g., https://raw.githubusercontent.com/kubenetworks/kubevpn/master/pkg/config/config.yaml
```