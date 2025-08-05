---
sidebar_position: 5
---

# 使用 gVisor 服务网格进行代理

如下图所示，`用户 A` 和 `用户 B`，分别使用了 `kubevpn proxy`
命令代理了同一个服务 `authors`:

- 用户 A: `kubevpn proxy deployment/authors --headers user=A`
- 用户 B: `kubevpn proxy deployment/authors --headers user=B`

当集群中的 `authors` 服务收到流量时:

- `HTTP header` 中带有 `user: A` 的流量会击中 `用户 A` 的本地电脑
- `HTTP header` 中带有 `user: B` 的流量会击中 `用户 B` 的本地电脑
- `HTTP header` 中不匹配的流量会击中集群中原始的 `authors` 服务

原理是使用了 `envoy` 做了数据面，然后实现了一个 `envoy` 的控制面。

## gVisor 模式 ( 不需要特性 ```Privileged: true``` 和 ```NET_ADMIN``` )

gVisor 模式修改了 `k8s service` 的 `targetPort` 为 `envoy` 的监听端口，例如：

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: authors
    service: authors
  name: authors
  namespace: default
spec:
  clusterIP: 172.21.5.157
  clusterIPs:
    - 172.21.5.157
  ports:
    - name: http
      port: 9080
      protocol: TCP
      targetPort: 64071
  selector:
    app: authors
  sessionAffinity: None
  type: ClusterIP
```

因此 gvisor 模式工作在`k8s service`服务级别，需要通过 `service name` 来访问。

例如:

```shell
kubevpn proxy service/authors --headers user=A
```

我们可以在 `AWS Fargate` 上使用 `gvisor`
模式，因为 [Fargate 节点](https://docs.aws.amazon.com/zh_cn/AmazonECS/latest/developerguide/fargate-security-considerations.html)
不支持 ```Privileged: true```特权模式和特性 ```NET_ADMIN```

![gvisor-mesh.svg](img/gvisor-mesh.svg)