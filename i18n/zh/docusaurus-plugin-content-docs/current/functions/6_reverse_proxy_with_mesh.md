---
sidebar_position: 6
---

# 反向代理支持服务网格

支持 HTTP, gRPC, Thrift 和 WebSocket 等, 携带了指定 header `"foo: bar"` 的流量，将会路由到本地

```shell
➜  ~ kubevpn proxy deployment/productpage --headers foo=bar
Connected to cluster
Injecting inbound sidecar for deployment/productpage
Checking rollout status for deployment/productpage
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Rollout successfully for deployment/productpage
Now you can access resources in the kubernetes cluster !
➜  ~
```

#### 不带 header 直接访问集群资源，可以看到返回的是集群中的服务内容。

```shell
➜  ~ curl productpage:9080
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Bookstore App</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
...
```

#### 带上特定 header 访问集群资源，可以看到返回了本地服务的内容。

```shell
➜  ~ curl productpage:9080 -H "foo: bar"
Hello world!%
```