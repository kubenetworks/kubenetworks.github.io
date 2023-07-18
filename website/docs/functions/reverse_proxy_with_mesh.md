---
sidebar_position: 5
---

# Reverse proxy with mesh

Support HTTP, GRPC and WebSocket etc. with specific header `"a: 1"` will route to your local machine

```shell
➜  ~ kubevpn proxy deployment/productpage --headers a=1
got cidr from cache
traffic manager not exist, try to create it...
pod [kubevpn-traffic-manager] status is Running
Container     Reason           Message
control-plane ContainerRunning
vpn           ContainerRunning
webhook       ContainerRunning

update ref count successfully
Waiting for deployment "productpage" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "productpage" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "productpage" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
deployment "productpage" successfully rolled out
port forward ready
your ip is 223.254.0.101
tunnel connected
dns service ok

---------------------------------------------------------------------------
    Now you can access resources in the kubernetes cluster, enjoy it :)
---------------------------------------------------------------------------

```

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

```shell
➜  ~ curl productpage:9080 -H "a: 1"
Hello world!%
```