---
sidebar_position: 1
---

# QuickStart

KubeVPN offers a Cloud Native Dev Environment, connect to kubernetes cluster network, you can access remote kubernetes
cluster
network, remote kubernetes cluster service can also access your local service. and more, you can run your kubernetes pod
on local Docker container with same environment、volume、and network. you can develop your application on local PC
totally.

# Install server (optional)

you can install kubevpn server previously (it will automatically install by kubevpn by command `kubevpn connect`)

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

if using private docker registry, use the following command to install:

```shell
helm install kubevpn kubevpn/kubevpn --set image.repository=[YOUR_PRIVATE_REGISTRY]/kubevpn/kubevpn --set 'imagePullSecrets[0].name=registry' -n default --debug --set image.tag=v2.2.2
```

# Install client

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="macOS" label="macOS" default>

### Use brew

```shell
brew install kubevpn
```

### Use krew

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### Download from GitHub release

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

</TabItem>
<TabItem value="Linux" label="Linux">

### Use brew

```shell
brew install kubevpn
```

### Use krew

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### Download from GitHub release

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

</TabItem>

<TabItem value="Windows" label="Windows">

### Use krew

```shell
kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git
kubectl krew install kubevpn/kubevpn
kubectl kubevpn
```

### Download from GitHub release

[https://github.com/kubenetworks/kubevpn/releases/latest](https://github.com/kubenetworks/kubevpn/releases/latest)

</TabItem>

</Tabs>

# Install bookinfo as demo application

```shell
kubectl apply -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml
```

For clean up after test

```shell
kubectl delete -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml
```