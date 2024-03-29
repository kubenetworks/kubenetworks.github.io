---
sidebar_position: 6
---

# Reverse proxy with mesh

Support HTTP, GRPC and WebSocket etc. with specific header `"a: 1"` will route to your local machine

```shell
➜  ~ kubevpn proxy deployment/productpage --headers a=1
already connect to cluster
start to create remote inbound pod for deployment/productpage
patch workload default/deployment/productpage with sidecar
rollout status for deployment/productpage
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
deployment "productpage" successfully rolled out
rollout status for deployment/productpage successfully
create remote inbound pod for deployment/productpage successfully
+---------------------------------------------------------------------------+
|    Now you can access resources in the kubernetes cluster, enjoy it :)    |
+---------------------------------------------------------------------------+
➜  ~
```

first access without header "a: 1", it will access existing pod on kubernetes cluster.

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

Now let's access local service with header `"a: 1"`

```shell
➜  ~ curl productpage:9080 -H "a: 1"
>>Received request: GET / from xxx.xxx.xxx.xxx:51296
Hello world!  
```