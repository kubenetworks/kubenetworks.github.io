---
sidebar_position: 9
---

# kubevpn status

显示连接状态和代理/同步资源列表

显示连接状态和代理或同步资源信息。可以通过 status 字段和 netif 检查连接状态。如果 netif 为空，表示 TUN 设备已关闭，
连接不健康。还会显示路由信息。

# 示例

## 显示连接状态和代理/同步资源列表

```shell
kubevpn status
```

## 通过别名配置名查询状态

```shell
kubevpn status --alias dev_new
```

## 以 JSON 格式输出

```shell
kubevpn status -o json
```

## 以 YAML 格式输出

```shell
kubevpn status -o yaml
```

## 宽格式输出（包含 IP 列）

```shell
kubevpn status -o wide
```

# 选项

```text
--alias='':
别名，通过别名配置名查询连接状态

-f, --kubevpnconfig='~/.kubevpn/config.yaml':
kubevpnconfig 文件路径

-o, --output='table':
输出格式，可选：(json, yaml, table, wide)

-r, --remote='':
远程配置文件地址
```
