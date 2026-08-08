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

原理是使用了 `envoy` 做了数据面，然后实现了一个 `envoy` 的控制面。与默认 mesh 模式一样，注入在**服务端**
（流量管理器内）执行，客户端只通过 gRPC 下发意图。

## gVisor 模式 ( 不需要 `Privileged: true` 和 `NET_ADMIN` )

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
不支持 `Privileged: true` 特权模式和特性 `NET_ADMIN`。

![gvisor-mesh.svg](img/gvisor-mesh.svg)

## 每客户端 gvisor 栈（数据面内部）

gvisor 数据面围绕三个目标重新设计：**会话连续性**（某条隧道连接断开不能杀死正在进行的 gvisor TCP 会话，
如 SSH/SCP）、**客户端隔离**（一个慢客户端不能拖慢其他客户端）以及**存活检测独立**（数据面拥塞不能饿死
心跳探测，从而避免误判触发重连）。

### 每客户端栈（服务端）

每个客户端——以其 TUN IP 标识——在流量管理器上获得一个**独立的 gvisor 栈**，其生命周期是客户端会话，
而非任何单条连接。连接池中的某条隧道连接断开只会从路由表中移除一条连接；客户端的 gvisor TCP 状态
（序列号、窗口、拥塞）得以保留，因此当该连接重连时会话可以直接恢复。一个慢客户端只能拖慢它自己的栈，
不影响其他客户端。

```text
客户端 A（4 条数据连接） ─┐
                          ├→ 栈-A（生命周期：客户端 A 会话）→ TCPForwarder → 集群
客户端 A 重连 ─────────────┘

客户端 B（4 条数据连接） ─┐
                          ├→ 栈-B（生命周期：客户端 B 会话）→ TCPForwarder → 集群
客户端 B 重连 ─────────────┘

客户端之间（A→B）：通过 RouteHub 直接转发（不经过 gvisor 栈）
```

在一个新客户端 IP 发出第一个发往集群的数据包时创建栈；当该客户端所有数据连接都消失后，经过
一段宽限期（3× 心跳周期 ≈ 180 秒）再销毁——足以覆盖短暂的网络抖动或笔记本休眠，又足够短以及时
回收已真正断开客户端的内存。

### 控制 / 数据面分离（客户端）

客户端向服务端开启两类连接：

| 连接 | 前缀 | 服务端行为 |
|---|---|---|
| 数据连接（×4） | 原始 IP → 注入 gvisor 栈 | 注册路由，承载用户流量 |
| 控制连接（×1） | 控制帧（心跳 ICMP） | 不注册路由，永不被数据拥塞阻塞 |

心跳走专用的控制连接，因此即使四条数据连接都被拥塞阻塞，心跳仍能流通，存活看门狗永远不会误判隧道
已死。数据包采用**阻塞式**通道发送而非静默丢弃，因此背压能干净地传递给 OS TCP（平滑收窗口），
而不是触发 RTO 指数退避的卡顿。

### 连接池分发

客户端在一个并行 TCP 连接池上复用流量。数据包按流的五元组
`(协议, 目的 IP, 源端口, 目的端口)` 的无状态哈希分发，因此到同一热点目的地的不同流会分散到不同连接，
而同一条流的每个包都落在同一条连接上（会话亲和性、不乱序）。没有可用端口的包（ICMP、分片）回退到
目的 IP 哈希。由于服务端现在为每个客户端保留一个共享 gvisor 栈，每流连接亲和性不再是正确性要求，
但仍保留用于负载分发。
