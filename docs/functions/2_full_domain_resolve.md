---
sidebar_position: 2
---

# Domain resolve

support k8s dns name resolve.

a Pod/Service named `productpage` in the `default` namespace can successfully resolve by following name:

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
