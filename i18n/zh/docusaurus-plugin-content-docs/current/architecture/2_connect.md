---
sidebar_position: 2
---

# 链接模式

`kubevpn` 使用 [gVisor](https://github.com/google/gvisor) 来访问服务 IP，不依赖于 iptables。

使用 `gVisor` 访问 k8s `service-cidr` 和 `pod-cidr` 网络

![connect_gvisor.svg](img/connect_gvisor.svg)