---
sidebar_position: 2
---

# 域名解析

支持 k8s dns 解析。比如一个名为 `productpage` 的 Pod 或者 Service 处于 `default` 命名空间下可以被如下域名正常解析到：

- `productpage`
- `productpage.default`
- `productpage.default.svc.cluster.local`

```shell
➜  ~ curl productpage.default.svc.cluster.local:9080
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Bookstore App</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

可以看到能够被正常解析，并且返回相应内容。