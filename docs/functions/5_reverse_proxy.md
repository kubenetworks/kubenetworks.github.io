---
sidebar_position: 5
---

# Reverse proxy

use command `kubevpn proxy` to proxy all inbound traffic to local computer.

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

For local testing, save the following code as `hello.go`

```go
package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		_, _ = io.WriteString(writer, "Hello world!")
		fmt.Printf(">>Received request: %s %s from %s\n", request.Method, request.RequestURI, request.RemoteAddr)
	})
	_ = http.ListenAndServe(":9080", nil)
}
```

and compile it

```
go build hello.go
```

then run it

```
./hello &
```

```shell
export selector=productpage
export pod=`kubectl get pods -l app=${selector} -n default -o jsonpath='{.items[0].metadata.name}'`
export pod_ip=`kubectl get pod $pod -n default -o jsonpath='{.status.podIP}'`
curl -v -H "foo: bar" http://$pod_ip:9080/health
```

response would like below

```
❯ curl -v -H "foo: bar" http://$pod_ip:9080/health
*   Trying 192.168.72.77:9080...
* Connected to 192.168.72.77 (192.168.72.77) port 9080 (#0)
> GET /health HTTP/1.1
> Host: 192.168.72.77:9080
> User-Agent: curl/7.87.0
> Accept: */*
> foo: bar
> 
>>Received request: GET /health from xxx.xxx.xxx.xxx:52974
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Date: Sat, 04 Nov 2023 10:19:50 GMT
< Content-Length: 12
< Content-Type: text/plain; charset=utf-8
< 
* Connection #0 to host 192.168.72.77 left intact
Hello world!
```

also you can access via service name

```shell
➜  ~ curl productpage:9080
Hello world!%
➜  ~ curl productpage.default.svc.cluster.local:9080
Hello world!%
```
