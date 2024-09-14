---
sidebar_position: 9
---

# kubevpn status

展示连接状态和列出代理/克隆资源

展示连接状态和列出代理或克隆资源，您可以通过状态字段和 netif 检查连接状态。如果 netif 为空，意味着 tun
设备已关闭，因此它是不健康的，它还将显示路由信息，如果代理工作负载，不仅显示自己的代理资源，其他路由信息也会显示。

# 示例

## 展示连接状态和代理/克隆资源列表

```shell
kubevpn status
```

## 通过别名配置名称 dev_new 查询状态

```shell
kubevpn status --alias dev_new
```

## 以 json 格式输出状态查询结果

```shell
kubevpn status -o json
```

## 以 yaml 格式输出状态查询结果

```shell
kubevpn status -o yaml
```

# 选项

```text
--alias='':
别名，通过别名配置名称查询连接状态

-f, --file='/Users/bytedance/.kubevpn/config.yaml':
配置文件位置

-o, --output='table':
输出格式。可选项：(json, yaml, table)

-r, --remote='':
远程配置文件，例如：https://raw.githubusercontent.com/kubenetworks/kubevpn/master/pkg/config/config.yaml
```