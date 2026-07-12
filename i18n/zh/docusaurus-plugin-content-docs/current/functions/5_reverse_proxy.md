---
sidebar_position: 5
---

# 反向代理

使用命令 `kubevpn proxy` 将某个工作负载的入站流量反向代理到本地电脑。

:::note
代理作用于工作负载的**已声明容器端口**（Pod spec 中声明的端口，以及 `--portmap` 追加的端口）。
Envoy 在服务端注入，不带 `--headers` 时会匹配每个已声明端口上的所有请求并经隧道转发到本地。
发往**未声明端口**的流量没有监听器，会回落到集群中的真实应用——这不再是旧版"捕获所有端口"的
VPN sidecar。若需覆盖额外端口，请用 `--portmap` 声明。
:::

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

此时在本地编写一个测试服务，将以下代码保存为 `hello.go`

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

编译

```
go build hello.go
```

运行

```
./hello &
```

通过 Pod IP 访问测试

```shell
export selector=productpage
export pod=`kubectl get pods -l app=${selector} -n default -o jsonpath='{.items[0].metadata.name}'`
export pod_ip=`kubectl get pod $pod -n default -o jsonpath='{.status.podIP}'`
curl -v -H "foo: bar" http://$pod_ip:9080/health
```

响应如下

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

也可以使用 service name 的方式访问

```shell
➜  ~ curl productpage:9080
Hello world!%
➜  ~ curl productpage.default.svc.cluster.local:9080
Hello world!%
```
