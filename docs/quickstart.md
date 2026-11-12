---
sidebar_position: 0
---

# QuickStart

KubeVPN offers a Cloud Native Dev Environment, connect to kubernetes cluster network, you can access remote kubernetes
cluster network, remote kubernetes cluster service can also access your local service. and more, you can run your kubernetes pod
on local Docker container with same environment, volume, and network. You can develop your application on local PC
totally.

## Prerequisites

- Kubernetes cluster (v1.20+)
- Kubeconfig with appropriate permissions
- Docker (for `kubevpn run` mode, optional)
- Administrator/root privileges (for TUN device creation)

Before starting, please review the [Security](./operations/security.md) documentation.

## Install Client

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="macOS" label="macOS" default>

### Use [brew](https://brew.sh/)

```shell
brew install kubevpn
```

### Use [krew](https://krew.sigs.k8s.io/)

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### Install from script

```shell
curl -fsSL https://kubevpn.dev/install.sh | sh
```

### Download from GitHub release

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

  </TabItem>
  <TabItem value="Linux" label="Linux">

### Use [brew](https://brew.sh/)

```shell
brew install kubevpn
```

### Use [krew](https://krew.sigs.k8s.io/)

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### Install from [snap](https://snapcraft.io/kubevpn)

```shell
sudo snap install kubevpn
```

### Install from script

```shell
curl -fsSL https://kubevpn.dev/install.sh | sh
```

### Download from GitHub release

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

  </TabItem>

  <TabItem value="Windows" label="Windows">

### Install from [scoop](https://scoop.sh/)

```shell
scoop bucket add extras
scoop install kubevpn
```

### Use [krew](https://krew.sigs.k8s.io/)

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### Download from GitHub release

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

  </TabItem>

</Tabs>

## Install Server in Kubernetes Cluster (Optional)

You can install kubevpn server previously (it will automatically install by kubevpn client with
command `kubevpn connect` if detect kubevpn server not exist):

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

If using private docker registry, use the following command to install:

```shell
helm install kubevpn kubevpn/kubevpn \
  --set image.repository=[YOUR_PRIVATE_REGISTRY]/kubevpn/kubevpn \
  --set 'imagePullSecrets[0].name=registry' \
  --namespace kubevpn \
  --create-namespace
```

## Create Demo Namespace

Let's create a dedicated namespace for our demo:

```shell
kubectl create namespace kubevpn-demo
```

## Deploy Bookinfo as Demo Application

Deploy the sample bookinfo application to the demo namespace:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml -n kubevpn-demo
```

Wait for all pods to become ready:

```shell
kubectl wait --for=condition=ready --timeout=5m pod --all -n kubevpn-demo
```

## Connect to the Cluster

Now let's connect to the cluster using KubeVPN:

```shell
kubevpn connect --namespace kubevpn-demo
```

## Check Connection Status

Verify your connection:

```shell
kubevpn status
```

## Access Cluster Service

Now you can access the productpage service directly from your local machine:

```shell
curl http://productpage:9080
```

Or open it in your browser:
```
http://productpage:9080
```

## Cleanup

When you're done, clean up:

(Optional) If you used `kubevpn proxy`, leave proxy resources first:
```shell
kubevpn leave deployment/productpage -n kubevpn-demo
```

Disconnect from the cluster:
```shell
kubevpn disconnect --all
```

Delete the bookinfo application:
```shell
kubectl delete -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml -n kubevpn-demo
```

Delete the demo namespace:
```shell
kubectl delete namespace kubevpn-demo
```

:::warning
You can also use `kubevpn uninstall -n kubevpn-demo` to remove the traffic manager and related resources, but this affects all users sharing the same namespace in a shared cluster. Only use this when you are certain no one else is using KubeVPN in that namespace.
:::
