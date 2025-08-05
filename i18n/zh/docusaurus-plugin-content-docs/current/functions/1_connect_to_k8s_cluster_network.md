---
sidebar_position: 1
---

# 链接到集群网络

使用命令 `kubevpn connect` 链接到集群，请注意这里需要输入电脑密码。因为需要 `root` 权限。(创建虚拟网卡)

```shell
➜  ~ kubevpn connect
Password:
Starting connect
Getting network CIDR from cluster info...
Getting network CIDR from CNI...
Getting network CIDR from services...
Labeling Namespace default
Creating ServiceAccount kubevpn-traffic-manager
Creating Roles kubevpn-traffic-manager
Creating RoleBinding kubevpn-traffic-manager
Creating Service kubevpn-traffic-manager
Creating MutatingWebhookConfiguration kubevpn-traffic-manager
Creating Deployment kubevpn-traffic-manager

Pod kubevpn-traffic-manager-66d969fd45-9zlbp is Pending
Container     Reason            Message
control-plane ContainerCreating
vpn           ContainerCreating
webhook       ContainerCreating

Pod kubevpn-traffic-manager-66d969fd45-9zlbp is Running
Container     Reason           Message
control-plane ContainerRunning
vpn           ContainerRunning
webhook       ContainerRunning

Forwarding port...
Connected tunnel
Adding route...
Configured DNS service
Now you can access resources in the kubernetes cluster !
➜  ~
```

提示已经链接到集群了。使用命令 `kubevpn status` 检查一下状态。

```shell
➜  ~ kubevpn status
CURRENT   CONNECTION ID   CLUSTER                 KUBECONFIG                      NAMESPACE   STATUS      NETIF
*         03dc50feb8c3    ccijorbccotmqodvr189g   /Users/naison/.kube/config      default     connected   utun4
➜  ~
```


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

找一个 pod 的 IP，比如 `productpage-788df7ff7f-jpkcs` 的 IP `172.29.2.134`

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

测试应该可以直接 Ping 通，说明本地可以正常访问到集群网络了。

```shell
➜  ~ kubectl get services -o wide
NAME                      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                              AGE     SELECTOR
authors                   ClusterIP   172.21.5.160    <none>        9080/TCP                             114d    app=authors
details                   ClusterIP   172.21.6.183    <none>        9080/TCP                             114d    app=details
kubernetes                ClusterIP   172.21.0.1      <none>        443/TCP                              319d    <none>
kubevpn-traffic-manager   ClusterIP   172.21.2.86     <none>        8422/UDP,10800/TCP,9002/TCP,80/TCP   2m28s   app=kubevpn-traffic-manager
productpage               ClusterIP   172.21.10.49    <none>        9080/TCP                             114d    app=productpage
ratings                   ClusterIP   172.21.3.247    <none>        9080/TCP                             114d    app=ratings
reviews                   ClusterIP   172.21.8.24     <none>        9080/TCP                             114d    app=reviews
```

找一个 service 的 IP，比如 `productpage` 的 IP `172.21.10.49`，试着访问一下服务 `productpage`

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

可以看到也可以正常访问，也就是可以在本地访问到集群的 pod 和 service 了～