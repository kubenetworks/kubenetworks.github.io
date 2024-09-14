---
sidebar_position: 4
---

# Connect to multiple kubernetes cluster

- Mode `lite`: can connect to multiple cluster network, design for only connecting to multiple cluster network.
- Mode `Full`: not only connect to cluster network, it also supports proxy workloads inbound traffic to local PC.

already connected cluster `ccijorbccotmqodvr189g` with mode `full`

```shell
➜  ~ kubevpn status
ID Mode Cluster               Kubeconfig                 Namespace Status
0  full ccijorbccotmqodvr189g /Users/naison/.kube/config default   Connected
```

then connect to another cluster `ccidd77aam2dtnc3qnddg` with mode `lite`

```shell
➜  ~ kubevpn connect -n default --kubeconfig ~/.kube/dev_config --lite
Starting connect
Got network CIDR from cache
Use exist traffic manager
Forwarding port...
Connected tunnel
Adding route...
Configured DNS service
+----------------------------------------------------------+
| Now you can access resources in the kubernetes cluster ! |
+----------------------------------------------------------+
```

use command `kubevpn status` to check connection status

```shell
➜  ~ kubevpn status
ID Mode Cluster               Kubeconfig                     Namespace Status
0  full ccijorbccotmqodvr189g /Users/naison/.kube/config     default   Connected
1  lite ccidd77aam2dtnc3qnddg /Users/naison/.kube/dev_config default   Connected
➜  ~
```