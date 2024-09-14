---
sidebar_position: 3
---

# 短域名解析

连接到此命名空间下，可以直接使用 `service` name 的方式访问，否则访问其它命令空间下的服务，需要带上命令空间作为域名的一部分，使用如下的域名即可。

- `productpage.default`
- `productpage.default.svc.cluster.local`

```shell
➜  ~ curl productpage:9080
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Bookstore App</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
...
```

可以看到直接使用 service name 的方式，可以正常访问到集群资源。