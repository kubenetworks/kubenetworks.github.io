---
sidebar_position: 4
---

# Proxy with gVisor service mesh

As shown in the diagram below, `User A` and `User B` use the `kubevpn proxy` command to proxy the same service `authors`
respectively:

- User A: `kubevpn proxy deployment/authors --headers user=A`
- User B: `kubevpn proxy deployment/authors --headers user=B`

When the `authors` service in the cluster receives traffic:

- Traffic with `user: A` in the `HTTP header` will hit `User A`'s local computer.
- Traffic with `user: B` in the `HTTP header` will hit `User B`'s local computer.
- Unmatched traffic in the `HTTP header` will hit the original `authors` service in the cluster.

The principle is to use `envoy` as the data plane and implement a control plane for `envoy`.

## gVisor mode ( not need ```Privileged: true``` or cap ```NET_ADMIN``` )

gVisor mode modify `k8s service` `targetPort` to envoy listener port. eg:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: authors
    service: authors
  name: authors
  namespace: default
spec:
  clusterIP: 172.21.5.157
  clusterIPs:
    - 172.21.5.157
  ports:
    - name: http
      port: 9080
      protocol: TCP
      targetPort: 64071
  selector:
    app: authors
  sessionAffinity: None
  type: ClusterIP
```

so works on `k8s service` level, needs to access via `service`. if `Pod` registry their `IP` to registration center and
access via `registration center`, this mode will not work.

example:

```shell
kubevpn proxy service/authors --headers user=A
```

we can use this mode on AWS Fargate node.
because [Fargate node](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-security-considerations.html)
not support ```Privileged: true``` and cap
```NET_ADMIN```

![gvisor-mesh.svg](img/gvisor-mesh.svg)