---
sidebar_position: 1
---

# 快速开始

KubeVPN 是一个云原生开发工具, 可以在本地连接云端 kubernetes
网络的工具，可以在本地直接访问远端集群的服务。也可以在远端集群访问到本地服务，便于调试及开发。同时还可以使用开发模式，直接在本地使用
Docker 将远程容器运行在本地。

# 安装 kubevpn server

可以通过 helm 安装 server，如下命令：

```shell
➜ helm repo add kubevpn https://raw.githubusercontent.com/kubenetworks/kubevpn/master/charts
"kubevpn" has been added to your repositories
```

```shell
➜ helm search repo kubevpn
NAME            	CHART VERSION	APP VERSION	DESCRIPTION
kubevpn/kubevpn 	2.2.2        	v2.2.2     	A Helm chart for KubeVPN
```

```shell
➜  ~ helm install kubevpn kubevpn/kubevpn
NAME: kubevpn
LAST DEPLOYED: Thu Feb 15 21:36:57 2024
NAMESPACE: test
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Connect to cluster network by running these commands:
  kubevpn connect --namespace test
  export POD_IP=$(kubectl get pods --namespace test -l "app.kubernetes.io/name=kubevpn,app.kubernetes.io/instance=kubevpn" -o jsonpath="{.items[0].status.podIP}")
  ping $POD_IP
```

当 client 链接时，如果 server 没有安装，client 将会自动安装 server

# 安装 kubevpn client

## 从 Github release 下载编译好的二进制文件

[链接](https://github.com/kubenetworks/kubevpn/releases/latest)

## 从 自定义 Krew 仓库安装

```shell
(
  kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git && \
  kubectl krew install kubevpn/kubevpn && kubectl kubevpn
)
```

## 自己构建二进制文件

```shell
(
  git clone https://github.com/kubenetworks/kubevpn.git && \
  cd kubevpn && make kubevpn && ./bin/kubevpn
)

```

## 安装 bookinfo 作为 demo 应用

```shell
kubectl apply -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml
```

