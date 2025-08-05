---
sidebar_position: 7
---

# 同步模式

如下图所示，`用户 A` 和 `用户 B`，分别使用了 `kubevpn sync`
命令同步了同一个服务 `authors`:

- 用户 A: `kubevpn sync deployment/authors --headers user=A --sync ~/code:/app/code`
- 用户 B: `kubevpn sync deployment/authors --headers user=B --sync ~/code:/app/code`

当集群中的 `authors` 服务收到流量时:

- `HTTP header` 中带有 `user: A` 的流量会击中同步的服务 `authors'`
- `HTTP header` 中带有 `user: B` 的流量会击中同步的服务 `authors''`
- `HTTP header` 中不匹配的流量会击中集群中原始的 `authors` 服务

使用 `syncthing` 实现了文件同步：

- 用户 A 电脑上的 `~/code` 会被同步到集群中同步的资源 `authors'` 的 `/app/code` 目录中
- 用户 B 电脑上的 `~/code` 会被同步到集群中同步的资源 `authors''` 的 `/app/code` 目录中

![sync.svg](img/sync.svg)