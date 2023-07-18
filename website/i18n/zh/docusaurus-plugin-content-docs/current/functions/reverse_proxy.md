---
sidebar_position: 4
---

# 反向代理

```shell
➜  ~ kubevpn proxy deployment/productpage
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

```go
package main

import (
	"io"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		_, _ = io.WriteString(writer, "Hello world!")
	})
	_ = http.ListenAndServe(":9080", nil)
}
```

```shell
➜  ~ curl productpage:9080
Hello world!%
➜  ~ curl productpage.default.svc.cluster.local:9080
Hello world!%
```