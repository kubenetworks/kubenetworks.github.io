---
sidebar_position: 14
---

# Local outbound proxy (proxy-out)

For nested VPN cases or environments where TUN devices are not available, kubevpn provides a local SOCKS5 and HTTP
CONNECT proxy to access cluster services.

## Use case

When another VPN client already owns the OS routes and you can't use TUN-based connectivity, `kubevpn proxy-out` lets
you access cluster services through standard proxy protocols.

## Start a SOCKS5 proxy

```shell
kubevpn proxy-out --listen-socks 127.0.0.1:1080
```

Then access cluster services through the proxy:

```shell
curl --proxy socks5h://127.0.0.1:1080 http://productpage.default.svc.cluster.local:9080
```

Use `socks5h://` (with the `h`) to let the proxy resolve cluster DNS names.

## Start both SOCKS5 and HTTP CONNECT proxies

```shell
kubevpn proxy-out --listen-socks 127.0.0.1:1080 --listen-http-connect 127.0.0.1:3128
```

## Use environment variables

```shell
export ALL_PROXY=socks5h://127.0.0.1:1080
curl http://productpage.default.svc.cluster.local:9080
```

Or for HTTP CONNECT:

```shell
export HTTP_PROXY=http://127.0.0.1:3128
export HTTPS_PROXY=http://127.0.0.1:3128
```

## Managed SOCKS proxy with connect

You can also start a managed SOCKS5 proxy automatically when connecting:

```shell
kubevpn connect --socks
curl --proxy socks5h://127.0.0.1:1080 http://productpage.default.svc.cluster.local:9080
```

The managed proxy listens on `127.0.0.1:1080` by default; override it with `--socks-listen`,
e.g. `kubevpn connect --socks --socks-listen 127.0.0.1:2080`. The managed proxy will be
automatically stopped when you disconnect.

![proxy_out](img/proxy_out.svg)
