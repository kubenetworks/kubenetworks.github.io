---
sidebar_position: 18
---

# Kubevpn proxy-out

Expose cluster workloads through a local outbound proxy.

This command is designed for nested VPN cases where OS routes are owned by another VPN client. Instead of depending on
cluster CIDR routing, it resolves cluster service hostnames and forwards TCP traffic through the Kubernetes API. Use
SOCKS5 with `socks5h` when you want the proxy to resolve cluster DNS names.

# Examples

## Start a local SOCKS5 proxy and access a cluster Service through socks5h

```shell
kubevpn proxy-out --listen-socks 127.0.0.1:1080
curl --proxy socks5h://127.0.0.1:1080 http://productpage.default.svc.cluster.local:9080
```

## Start both SOCKS5 and HTTP CONNECT listeners for TCP traffic

```shell
kubevpn proxy-out --listen-socks 127.0.0.1:1080 --listen-http-connect 127.0.0.1:3128
```

## Host-direct egress: reach the internet via the host

With `--egress` the proxy dials targets directly from the host, using the host's own DNS and network (socks5h host
egress), instead of resolving cluster Services via the Kubernetes API. This reaches the public internet and — under an
active VPN — the cluster too.

```shell
kubevpn proxy-out --egress --listen-socks 127.0.0.1:1080
curl --proxy socks5h://127.0.0.1:1080 https://www.google.com
```

## Access a Pod IP or Service ClusterIP through the proxy

```shell
curl --proxy socks5h://127.0.0.1:1080 http://172.21.10.49:9080
```

## Use environment variables for proxy

```shell
export ALL_PROXY=socks5h://127.0.0.1:1080
# or for HTTP CONNECT proxy
export HTTP_PROXY=http://127.0.0.1:3128
export HTTPS_PROXY=http://127.0.0.1:3128
```

# Options

```text
--egress=false:
Dial targets directly from the host (host DNS + network, socks5h egress) instead of resolving cluster Services via
the Kubernetes API

--listen-http-connect='':
Local HTTP CONNECT listen address

--listen-socks='127.0.0.1:1080':
Local SOCKS5 listen address
```
