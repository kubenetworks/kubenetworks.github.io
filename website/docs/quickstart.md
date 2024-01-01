---
sidebar_position: 1
---

# QuickStart

KubeVPN is Cloud Native Dev Environment, connect to kubernetes cluster network, you can access remote kubernetes cluster
network, remote kubernetes cluster service can also access your local service. and more, you can run your kubernetes pod
on local Docker container with same environment、volume、and network. you can develop your application on local PC
totally.

## Install from GitHub release

[LINK](https://github.com/kubenetworks/kubevpn/releases/latest)

## Install from custom krew index

```shell
(
  kubectl krew index add kubevpn https://github.com/kubenetworks/kubevpn.git && \
  kubectl krew install kubevpn/kubevpn && kubectl kubevpn
)
```

## Install from build it manually

```shell
(
  git clone https://github.com/kubenetworks/kubevpn.git && \
  cd kubevpn && make kubevpn && ./bin/kubevpn
)

```

## Install bookinfo as demo application

```shell
kubectl apply -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml
```

For clean up after test

```shell
kubectl delete -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml
```