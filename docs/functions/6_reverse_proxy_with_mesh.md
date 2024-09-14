---
sidebar_position: 6
---

# Reverse proxy with mesh

Support HTTP, gRPC, Thrift and WebSocket etc. with specific header `"foo: bar"` will route to your local machine

```shell
➜  ~ kubevpn proxy deployment/productpage --headers foo=bar
Connected to cluster
Injecting inbound sidecar for deployment/productpage
Checking rollout status for deployment/productpage
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Rollout successfully for deployment/productpage
+----------------------------------------------------------+
| Now you can access resources in the kubernetes cluster ! |
+----------------------------------------------------------+
➜  ~
```

first access without header "foo: bar", it will access existing pod on kubernetes cluster.

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

Now let's access local service with HTTP header `"foo: bar"`

```shell
➜  ~ curl productpage:9080 -H "foo: bar"
>>Received request: GET / from xxx.xxx.xxx.xxx:51296
Hello world!  
```