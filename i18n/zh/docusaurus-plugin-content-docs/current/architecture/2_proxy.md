---
sidebar_position: 2
---

# 代理模式

如下图所示，用户使用命令 `kubevpn proxy deployment/authors` 代理了所有流量到本地电脑。因此无论何人访问集群中的 `authors`
服务，入站流量都会拦截到本地电脑上。

![proxy.svg](proxy.svg)