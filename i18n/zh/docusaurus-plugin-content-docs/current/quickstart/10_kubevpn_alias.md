---
sidebar_position: 10
---

# kubevpn alias

配置文件别名，用于简化命令执行，类似于 ssh 别名配置

配置文件支持三个字段：`Name`、`Needs`、`Flags`，它将读取 `~/.kubevpn/config.yaml` 文件作为配置文件，也可以通过 `-f`
参数指定特定的文件路径。它还支持依赖关系，例如一个集群的 API 服务器需要通过另一个集群访问，您可以使用 `needs`
语法。它将首先对 `needs` 集群执行操作，然后对目标集群执行操作。

# 示例

假设您的 `~/.kubevpn/config.yaml` 文件中有以下配置：

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

## 使用 kubevpn alias 配置简化命令执行，按顺序连接到集群网络：jumper --> dev

```shell
kubevpn alias dev
```

## kubevpn alias jumper，仅连接到集群 jumper

```shell
kubevpn alias jumper
```

# 选项

```text
-f, --file='/Users/bytedance/.kubevpn/config.yaml':
配置文件位置

-r, --remote='':
远程配置文件，例如：https://raw.githubusercontent.com/kubenetworks/kubevpn/master/pkg/config/config.yaml
```