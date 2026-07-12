---
sidebar_position: 4
---

# 链接到多个集群网络

可以看到已经链接到了一个集群 `ccijorbccotmqodvr189g`

```shell
➜  ~ kubevpn status
CURRENT   CONNECTION ID   CLUSTER                 KUBECONFIG                      NAMESPACE   STATUS      NETIF
*         03dc50feb8c3    ccijorbccotmqodvr189g   /Users/naison/.kube/config      default     connected   utun4
➜  ~
```

此时还可以链接到其它集群

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

使用命令 `kubevpn status` 查看当前链接状态。

```shell
➜  ~ kubevpn status
CURRENT   CONNECTION ID   CLUSTER                 KUBECONFIG                      NAMESPACE   STATUS      NETIF
          03dc50feb8c3    ccijorbccotmqodvr189g   /Users/naison/.kube/config      default     connected   utun4
*         86bfdef0ed05    ccidd77aam2dtnc3qnddg   /Users/naison/.kube/dev_config  default     connected   utun5
➜  ~
```

可以看到连接到了多个集群。