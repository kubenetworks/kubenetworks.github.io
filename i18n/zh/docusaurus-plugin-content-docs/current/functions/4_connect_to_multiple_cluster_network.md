---
sidebar_position: 4
---

# 链接到多个集群网络

有个两个模式

- 模式 `lite`: 可以链接到多个集群网络，但是仅支持链接到多集群。
- 模式 `full`: 不仅支持链接到单个集群网络，还可以拦截工作负载流量到本地电脑。

可以看到已经链接到了一个集群 `ccijorbccotmqodvr189g`，是 `full` 模式

```shell
➜  ~ kubevpn status
ID Mode Cluster               Kubeconfig                 Namespace Status
0  full ccijorbccotmqodvr189g /Users/naison/.kube/config default   Connected
```

此时还可以使用 `lite` 模式链接到其它集群

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

使用命令 `kubevpn status` 查看当前链接状态。

```shell
➜  ~ kubevpn status
ID Mode Cluster               Kubeconfig                     Namespace Status
0  full ccijorbccotmqodvr189g /Users/naison/.kube/config     default   Connected
1  lite ccidd77aam2dtnc3qnddg /Users/naison/.kube/dev_config default   Connected
➜  ~
```

可以看到连接到了多个集群。