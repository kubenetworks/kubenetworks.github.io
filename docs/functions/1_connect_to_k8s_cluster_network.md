---
sidebar_position: 1
---

# Connect to kubernetes cluster

use command `kubevpn connect` connect to k8s cluster network, prompt `Password:` need to input computer
password. to enable root operation (create a tun device).

```shell
➜  ~ kubevpn connect
Password:
Starting connect
Detected cluster CIDRs: 172.29.0.0/16, 172.21.0.0/16
Labeled namespace "default"
Created ServiceAccount "kubevpn-traffic-manager"
Created Role "kubevpn-traffic-manager"
Created RoleBinding "kubevpn-traffic-manager"
Created Service "kubevpn-traffic-manager"
Created ConfigMap "kubevpn-traffic-manager"
Created Deployment "kubevpn-traffic-manager"

Pod kubevpn-traffic-manager-66d969fd45-9zlbp is Pending
Container   Reason            Message
vpn         ContainerCreating
xds         ContainerCreating
dns         ContainerCreating

Pod kubevpn-traffic-manager-66d969fd45-9zlbp is Running
Container   Reason           Message
vpn         ContainerRunning
xds         ContainerRunning
dns         ContainerRunning

Forwarded ports (TCP/UDP/xDS)
Allocated TUN IP 198.18.0.100
Created TUN device "utun4"
Added 2 pod/service CIDR routes
Configured DNS
Now you can access resources in the kubernetes cluster !
➜  ~
```

already connected to cluster network, use command `kubevpn status` to check status

```shell
➜  ~ kubevpn status
CURRENT   CONNECTION ID   CLUSTER                 KUBECONFIG                      NAMESPACE   STATUS      NETIF
*         03dc50feb8c3    ccijorbccotmqodvr189g   /Users/naison/.kube/config      default     connected   utun4
➜  ~
```

use pod `productpage-788df7ff7f-jpkcs` IP `172.29.2.134`

```shell
➜  ~ kubectl get pods -o wide
NAME                                       READY   STATUS             RESTARTS   AGE     IP                NODE              NOMINATED NODE   READINESS GATES
authors-dbb57d856-mbgqk                    3/3     Running            0          7d23h   172.29.2.132      192.168.0.5       <none>           <none>
details-7d8b5f6bcf-hcl4t                   1/1     Running            0          61d     172.29.0.77       192.168.104.255   <none>           <none>
kubevpn-traffic-manager-66d969fd45-9zlbp   3/3     Running            0          74s     172.29.2.136      192.168.0.5       <none>           <none>
productpage-788df7ff7f-jpkcs               1/1     Running            0          61d     172.29.2.134      192.168.0.5       <none>           <none>
ratings-77b6cd4499-zvl6c                   1/1     Running            0          61d     172.29.0.86       192.168.104.255   <none>           <none>
reviews-85c88894d9-vgkxd                   1/1     Running            0          24d     172.29.2.249      192.168.0.5       <none>           <none>
```

use `ping` to test connection, seems good

```shell
➜  ~ ping 172.29.2.134
PING 172.29.2.134 (172.29.2.134): 56 data bytes
64 bytes from 172.29.2.134: icmp_seq=0 ttl=63 time=55.727 ms
64 bytes from 172.29.2.134: icmp_seq=1 ttl=63 time=56.270 ms
64 bytes from 172.29.2.134: icmp_seq=2 ttl=63 time=55.228 ms
64 bytes from 172.29.2.134: icmp_seq=3 ttl=63 time=54.293 ms
^C
--- 172.29.2.134 ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 54.293/55.380/56.270/0.728 ms
```

use service `productpage` IP `172.21.10.49`

```shell
➜  ~ kubectl get services -o wide
NAME                      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                              AGE     SELECTOR
authors                   ClusterIP   172.21.5.160    <none>        9080/TCP                             114d    app=authors
details                   ClusterIP   172.21.6.183    <none>        9080/TCP                             114d    app=details
kubernetes                ClusterIP   172.21.0.1      <none>        443/TCP                              319d    <none>
kubevpn-traffic-manager   ClusterIP   172.21.2.86     <none>        10801/TCP,9002/TCP,53/UDP            2m28s   app=kubevpn-traffic-manager
productpage               ClusterIP   172.21.10.49    <none>        9080/TCP                             114d    app=productpage
ratings                   ClusterIP   172.21.3.247    <none>        9080/TCP                             114d    app=ratings
reviews                   ClusterIP   172.21.8.24     <none>        9080/TCP                             114d    app=reviews
```

use command `curl` to test service connection

```shell
➜  ~ curl 172.21.10.49:9080
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Bookstore App</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

seems good too~