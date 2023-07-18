---
sidebar_position: 1
---

# 快速开始

KubeVPN 是一个云原生开发工具, 可以在本地连接云端 kubernetes 网络的工具，可以在本地直接访问远端集群的服务。也可以在远端集群访问到本地服务，便于调试及开发。同时还可以使用开发模式，直接在本地使用 Docker 将远程容器运行在本地。

## 从 Github release 下载编译好的二进制文件

[链接](https://github.com/KubeNetworks/kubevpn/releases/latest)

## 从 自定义 Krew 仓库安装

```shell
(
  kubectl krew index add kubevpn https://github.com/KubeNetworks/kubevpn.git && \
  kubectl krew install kubevpn/kubevpn && kubectl kubevpn
)
```

## 自己构建二进制文件

```shell
(
  git clone https://github.com/KubeNetworks/kubevpn.git && \
  cd kubevpn && make kubevpn && ./bin/kubevpn
)

```

## 安装 bookinfo 作为 demo 应用

```shell
kubectl apply -f https://raw.githubusercontent.com/KubeNetworks/kubevpn/master/samples/bookinfo.yaml
```

