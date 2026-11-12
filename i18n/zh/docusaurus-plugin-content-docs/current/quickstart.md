---
sidebar_position: 0
---

# 快速开始

KubeVPN 提供了一个云原生开发环境, 可以在本地连接云端 kubernetes
网络的工具，可以在本地直接访问远端集群的服务。也可以在远端集群访问到本地服务，便于调试及开发。同时还可以使用运行模式，直接在本地使用
Docker 将远程容器运行在本地。

## 前置条件

- Kubernetes 集群 (v1.20+)
- 具有适当权限的 Kubeconfig
- Docker（用于 `kubevpn run` 模式，可选）
- 管理员/root 权限（用于创建 TUN 设备）

在开始之前，请查看[安全](./operations/security.md)文档。

## 安装客户端

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="macOS" label="macOS" default>

### 使用 [brew](https://brew.sh/)

```shell
brew install kubevpn
```

### 使用 [krew](https://krew.sigs.k8s.io/)

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### 使用脚本安装

```shell
curl -fsSL https://kubevpn.dev/install.sh | sh
```

### 从 GitHub release 下载

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

  </TabItem>
  <TabItem value="Linux" label="Linux">

### 使用 [brew](https://brew.sh/)

```shell
brew install kubevpn
```

### 使用 [krew](https://krew.sigs.k8s.io/)

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### 使用 [snap](https://snapcraft.io/kubevpn) 安装

```shell
sudo snap install kubevpn
```

### 使用脚本安装

```shell
curl -fsSL https://kubevpn.dev/install.sh | sh
```

### 从 GitHub release 下载

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

  </TabItem>

  <TabItem value="Windows" label="Windows">

### 使用 [scoop](https://scoop.sh/) 安装

```shell
scoop bucket add extras
scoop install kubevpn
```

### 使用 [krew](https://krew.sigs.k8s.io/)

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### 从 GitHub release 下载

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

  </TabItem>

</Tabs>

## 安装 kubevpn server 在 Kubernetes 集群中（可选）

可以通过 helm 提前在集群中安装 kubevpn server（当 kubevpn client 链接时，如果 server 没有安装，client 将会自动安装
server），如下命令：

```shell
helm repo add kubevpn https://raw.githubusercontent.com/kubenetworks/kubevpn/master/charts
helm repo update
```

```shell
helm search repo kubevpn
```

```shell
helm install kubevpn kubevpn/kubevpn --namespace kubevpn --create-namespace
```

如果使用私有镜像仓库，使用以下命令安装：

```shell
helm install kubevpn kubevpn/kubevpn \
  --set image.repository=[YOUR_PRIVATE_REGISTRY]/kubevpn/kubevpn \
  --set 'imagePullSecrets[0].name=registry' \
  --namespace kubevpn \
  --create-namespace
```

## 创建演示命名空间

让我们为演示创建一个专用的命名空间：

```shell
kubectl create namespace kubevpn-demo
```

## 安装 bookinfo 作为 demo 应用

将示例 bookinfo 应用程序部署到演示命名空间：

```shell
kubectl apply -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml -n kubevpn-demo
```

等待所有 pod 准备就绪：

```shell
kubectl wait --for=condition=ready --timeout=5m pod --all -n kubevpn-demo
```

## 连接到集群

现在让我们使用 KubeVPN 连接到集群：

```shell
kubevpn connect --namespace kubevpn-demo
```

## 检查连接状态

验证您的连接：

```shell
kubevpn status
```

## 访问集群服务

现在您可以直接从本地机器访问 productpage 服务：

```shell
curl http://productpage:9080
```

或在浏览器中打开：
```
http://productpage:9080
```

## 清理

完成后，清理：

（可选）如果使用了 `kubevpn proxy`，先清除代理资源：
```shell
kubevpn leave deployment/productpage -n kubevpn-demo
```

断开与集群的连接：
```shell
kubevpn disconnect --all
```

删除 bookinfo 应用程序：
```shell
kubectl delete -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml -n kubevpn-demo
```

删除演示命名空间：
```shell
kubectl delete namespace kubevpn-demo
```

:::warning
您也可以使用 `kubevpn uninstall -n kubevpn-demo` 删除流量管理器及相关资源，但这会影响共享集群中使用同一命名空间的所有用户。仅当您确定没有其他人在该命名空间中使用 KubeVPN 时才使用此命令。
:::
