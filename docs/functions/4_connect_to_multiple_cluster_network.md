---
sidebar_position: 4
---

# Connect to multiple kubernetes cluster network

- Mode `lite`: can connect to multiple cluster network, design for only connecting to multiple cluster network.
- Mode `Full`: not only connect to cluster network, it also supports proxy workloads inbound traffic to local PC.

```shell
➜  ~ kubevpn status
ID Mode Cluster               Kubeconfig                 Namespace Status
0  full ccijorbccotmqodvr189g /Users/naison/.kube/config default   Connected
```

```shell
➜  ~ kubevpn connect -n default --kubeconfig ~/.kube/dev_config --lite
start to connect
got cidr from cache
get cidr successfully
update ref count successfully
traffic manager already exist, reuse it
port forward ready
tunnel connected
adding route...
dns service ok
+---------------------------------------------------------------------------+
|    Now you can access resources in the kubernetes cluster, enjoy it :)    |
+---------------------------------------------------------------------------+
```

```shell
➜  ~ kubevpn status
ID Mode Cluster               Kubeconfig                     Namespace Status
0  full ccijorbccotmqodvr189g /Users/naison/.kube/config     default   Connected
1  lite ccidd77aam2dtnc3qnddg /Users/naison/.kube/dev_config default   Connected
➜  ~
```