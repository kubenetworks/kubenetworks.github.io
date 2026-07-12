---
sidebar_position: 10
---

# kubevpn alias

配置文件别名，用于简化命令执行，类似于 SSH alias 配置。

读取 `~/.kubevpn/config.yaml` 文件作为配置源，也可以通过 `-f` 参数指定文件路径，或通过 `--remote` 指定远程配置文件。
配置支持依赖关系，使用 `Needs` 语法可以先对依赖集群执行操作，然后对目标集群执行操作。

# 示例

假设您的 `~/.kubevpn/config.yaml` 文件中有以下配置：

```yaml
Name: dev
Description: 这是开发环境
Needs: jumper
Flags:
  - connect
  - --kubeconfig=~/.kube/config
  - --namespace=default
---

Name: jumper
Description: 这是跳板机环境
Flags:
  - connect
  - --kubeconfig=~/.kube/jumper_config
  - --namespace=test
  - --extra-hosts=xxx.com

---

Name: all-in-one
Description: 使用 '--kubeconfig-json' 参数，无需指定 kubeconfig 路径
Flags:
  - connect
  - --kubeconfig-json={"apiVersion":"v1","clusters":[{"cluster":{"certificate-authority-data":"LS0tLS1CRU..."}}]}
  - --namespace=test
  - --extra-hosts=xxx.com
```

配置文件支持四个字段：`Name`、`Description`、`Needs`、`Flags`

## 使用别名配置简化命令，按顺序连接：jumper --> dev

```shell
kubevpn alias dev
```

## 仅连接到集群 jumper

```shell
kubevpn alias jumper
```

## 支持 '--kubeconfig-json'，kubeconfig 会保存到 ~/.kubevpn/temp/[ALIAS_NAME]

```shell
kubevpn alias all-in-one
```

# 选项

```text
-f, --kubevpnconfig='~/.kubevpn/config.yaml':
kubevpnconfig 文件路径

-r, --remote='':
远程配置文件地址
```
