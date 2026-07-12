---
sidebar_position: 10
---

# Kubevpn alias

Configure command aliases for easier execution, similar to SSH alias configuration.

This command reads the `~/.kubevpn/config.yaml` file as the configuration source. You can also specify a different file
path using the `-f` flag. It also supports remote config file via `--remote` flag. The configuration supports
dependencies; for example, if one cluster's API server needs to be accessed through another cluster, you can use the
`Needs` syntax. This allows actions to be performed on the required cluster first before targeting the destination cluster.

# Examples

If you have the following configuration in your `~/.kubevpn/config.yaml`:

```yaml
Name: dev
Description: This is dev k8s environment
Needs: jumper
Flags:
  - connect
  - --kubeconfig=~/.kube/config
  - --namespace=default
---

Name: jumper
Description: This is jumper k8s environment
Flags:
  - connect
  - --kubeconfig=~/.kube/jumper_config
  - --namespace=test
  - --extra-hosts=xxx.com

---

Name: all-in-one
Description: use special flags '--kubeconfig-json', no need to special kubeconfig path
Flags:
  - connect
  - --kubeconfig-json={"apiVersion":"v1","clusters":[{"cluster":{"certificate-authority-data":"LS0tLS1CRU..."}}]}
  - --namespace=test
  - --extra-hosts=xxx.com
```

Config file supports four fields: `Name`, `Description`, `Needs`, `Flags`

## Use kubevpn alias config to simply execute command, connect to cluster network by order: jumper --> dev

```shell
kubevpn alias dev
```

## kubevpn alias jumper, just connect to cluster jumper

```shell
kubevpn alias jumper
```

## Support special flags '--kubeconfig-json', it will save kubeconfig into ~/.kubevpn/temp/[ALIAS_NAME]

```shell
kubevpn alias all-in-one
```

# Options

```text
-f, --kubevpnconfig='~/.kubevpn/config.yaml':
Path to the kubevpnconfig file to use for CLI requests.

-r, --remote='':
Remote config file, eg: https://raw.githubusercontent.com/kubenetworks/kubevpn/master/pkg/config/config.yaml
```
