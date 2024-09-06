---
sidebar_position: 10
---

# Kubevpn alias

Configure command aliases for easier execution, similar to SSH alias configuration.

This command reads the `~/.kubevpn/config.yaml` file as the configuration source. You can also specify a different file
path using the `-f` flag. The configuration supports dependencies; for example, if one cluster's API server needs to be
accessed through another cluster, you can use the `needs` syntax. This allows actions to be performed on the required
cluster first before targeting the destination cluster.

# Examples

If you have the following configuration in your `~/.kubevpn/config.yaml`:

```yaml
Name: dev
Needs: jumper
Flags:
  - connect
  - --kubeconfig=~/.kube/config
  - --namespace=default
  - --lite
---

Name: jumper
Flags:
  - connect
  - --kubeconfig=~/.kube/jumper_config
  - --namespace=test
  - --extra-hosts=xxx.com
```

Config file support three field: `Name`,`Needs`,`Flags`

## Use kubevpn alias config to simply execute command, connect to cluster network by order: jumper --> dev

```shell
kubevpn alias dev
```

## kubevpn alias jumper, just connect to cluster jumper

```shell
kubevpn alias jumper
```

# Options

```text
-f, --file='/Users/bytedance/.kubevpn/config.yaml':
Config file location

-r, --remote='':
Remote config file, eg: https://raw.githubusercontent.com/kubenetworks/kubevpn/master/pkg/config/config.yaml
```