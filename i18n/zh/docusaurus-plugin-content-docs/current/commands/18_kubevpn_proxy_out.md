---
sidebar_position: 18
---

# kubevpn proxy-out

通过本地出站代理暴露集群工作负载。

此命令为嵌套 VPN 场景设计，当 OS 路由被另一个 VPN 客户端占用时使用。它不依赖集群 CIDR 路由，而是解析集群服务主机名
并通过 Kubernetes API 转发 TCP 流量。使用 `socks5h` 协议可以让代理解析集群 DNS 名称。

# 示例

## 启动本地 SOCKS5 代理并通过 socks5h 访问集群服务

```shell
kubevpn proxy-out --listen-socks 127.0.0.1:1080
curl --proxy socks5h://127.0.0.1:1080 http://productpage.default.svc.cluster.local:9080
```

## 同时启动 SOCKS5 和 HTTP CONNECT 监听器

```shell
kubevpn proxy-out --listen-socks 127.0.0.1:1080 --listen-http-connect 127.0.0.1:3128
```

## 通过代理访问 Pod IP 或 Service ClusterIP

```shell
curl --proxy socks5h://127.0.0.1:1080 http://172.21.10.49:9080
```

## 使用环境变量设置代理

```shell
export ALL_PROXY=socks5h://127.0.0.1:1080
# 或者 HTTP CONNECT 代理
export HTTP_PROXY=http://127.0.0.1:3128
export HTTPS_PROXY=http://127.0.0.1:3128
```

# 选项

```text
--listen-http-connect='':
本地 HTTP CONNECT 监听地址

--listen-socks='127.0.0.1:1080':
本地 SOCKS5 监听地址
```
