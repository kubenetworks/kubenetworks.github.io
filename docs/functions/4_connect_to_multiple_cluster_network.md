---
sidebar_position: 4
---

# Connect to multiple kubernetes cluster

already connected cluster `ccijorbccotmqodvr189g`

```shell
➜  ~ kubevpn status
CURRENT   CONNECTION ID   CLUSTER                 KUBECONFIG                      NAMESPACE   STATUS      NETIF
*         03dc50feb8c3    ccijorbccotmqodvr189g   /Users/naison/.kube/config      default     connected   utun4
```

then connect to another cluster `ccidd77aam2dtnc3qnddg`

```shell
➜  ~ kubevpn connect -n default --kubeconfig ~/.kube/dev_config
Starting connect
Detected cluster CIDRs: 172.29.0.0/16, 172.21.0.0/16 (cached)
Using traffic manager in namespace "default"
Forwarded ports (TCP/UDP/xDS)
Created TUN device "utun4"
Added 2 pod/service CIDR routes
Configured DNS
Now you can access resources in the kubernetes cluster !
```

use command `kubevpn status` to check connection status

```shell
➜  ~ kubevpn status
CURRENT   CONNECTION ID   CLUSTER                 KUBECONFIG                      NAMESPACE   STATUS      NETIF
          03dc50feb8c3    ccijorbccotmqodvr189g   /Users/naison/.kube/config      default     connected   utun4
*         86bfdef0ed05    ccidd77aam2dtnc3qnddg   /Users/naison/.kube/dev_config  default     connected   utun5
➜  ~
```