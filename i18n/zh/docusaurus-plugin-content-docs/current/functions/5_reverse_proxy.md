---
sidebar_position: 5
---

# 反向代理

使用命令 `kubevpn proxy` 代理所有的入站流量到本地电脑。

```shell
➜  ~ kubevpn proxy deployment/productpage
Connected to cluster
Injecting inbound sidecar for deployment/productpage
Checking rollout status for deployment/productpage
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...
Rollout successfully for deployment/productpage
Now you can access resources in the kubernetes cluster !
➜  ~
```

此时在本地使用 `go` 启动一个服务，用于承接流量。

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

运行

```shell
go run hello.go &
```

使用 `service` name 的方式，直接访问集群中的 `productpage` 服务。

```shell
➜  ~ curl productpage:9080
Hello world!%
➜  ~ curl productpage.default.svc.cluster.local:9080
Hello world!%
```

可以看到直接击中了本地电脑的服务。