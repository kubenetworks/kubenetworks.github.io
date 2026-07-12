---
sidebar_position: 7
---

# 本地进入运行模式

将 Kubernetes pod 运行在本地的 Docker 容器中🐳，同时配合 service mesh 拦截流量到本地——可以是带有指定 header（`--headers`）的请求，或在不带 header 时拦截工作负载**已声明容器端口**上的所有流量。这个运行模式依赖于本地 Docker。

:::note
不带 `--headers` 时，拦截只覆盖工作负载的**已声明容器端口**。发往未声明端口的流量会回落到集群中的
真实应用，而非本地容器。需要按请求分流请用 `--headers`，需要额外端口路由到本地请显式声明这些端口。
:::

```shell
➜  ~ kubevpn run deployment/authors --headers foo=bar --entrypoint sh
Starting connect
Detected cluster CIDRs: 172.29.0.0/16, 172.21.0.0/16 (cached)
Using traffic manager in namespace "default"
Forwarded ports (TCP/UDP/xDS)
Created TUN device "utun4"
Added 2 pod/service CIDR routes
Configured DNS
Injecting inbound sidecar for deployment/authors
Patching workload deployment/authors
Checking rollout status for deployment/authors
Waiting for deployment "authors" rollout to finish: 0 out of 1 new replicas have been updated...
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
deployment "authors" successfully rolled out
Rollout successfully for Deployment.apps/authors 
tar: removing leading '/' from member names
/var/folders/30/cmv9c_5j3mq_kthx63sb1t5c0000gn/T/4563987760170736212:/var/run/secrets/kubernetes.io/serviceaccount
tar: Removing leading `/' from member names
tar: Removing leading `/' from hard link targets
/var/folders/30/cmv9c_5j3mq_kthx63sb1t5c0000gn/T/4044542168121221027:/var/run/secrets/kubernetes.io/serviceaccount
create docker network 56c25058d4b7498d02c2c2386ccd1b2b127cb02e8a1918d6d24bffd18570200e
Created container: nginx_default_kubevpn_a9a22
Wait container nginx_default_kubevpn_a9a22 to be running...
Container nginx_default_kubevpn_a9a22 is running on port 80/tcp:80 8888/tcp:8888 9080/tcp:9080 now
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
Created main container: authors_default_kubevpn_a9a22
/opt/microservices # ls
app
/opt/microservices # ps -ef
PID   USER     TIME  COMMAND
    1 root      0:00 nginx: master process nginx -g daemon off;
   29 101       0:00 nginx: worker process
   30 101       0:00 nginx: worker process
   31 101       0:00 nginx: worker process
   32 101       0:00 nginx: worker process
   33 101       0:00 nginx: worker process
   34 root      0:00 {sh} /usr/bin/qemu-x86_64 /bin/sh sh
   44 root      0:00 ps -ef
/opt/microservices # apk add curl
fetch https://dl-cdn.alpinelinux.org/alpine/v3.14/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.14/community/x86_64/APKINDEX.tar.gz
(1/4) Installing brotli-libs (1.0.9-r5)
(2/4) Installing nghttp2-libs (1.43.0-r0)
(3/4) Installing libcurl (8.0.1-r0)
(4/4) Installing curl (8.0.1-r0)
Executing busybox-1.33.1-r3.trigger
OK: 8 MiB in 19 packages
/opt/microservices # ./app &
/opt/microservices # 2023/09/30 13:41:58 Start listening http port 9080 ...

/opt/microservices # curl localhost:9080/health
{"status":"Authors is healthy"} /opt/microservices # echo "continue testing pod access..."
continue testing pod access...
/opt/microservices # exit
Created container: default_authors
Wait container default_authors to be running...
Container default_authors is running now
Disconnecting from the cluster...
Leaving workload deployments.apps/authors
Disconnecting from the cluster...
Performing cleanup operations
Clearing DNS settings
➜  ~
```

此时本地会启动两个 container, 对应 pod 容器中的两个 container, 并且共享端口, 可以直接使用 localhost:port 的形式直接访问另一个 container,
并且, 所有的环境变量、挂载卷、网络条件都和 pod 一样, 真正做到与 kubernetes 运行环境一致。

```shell
➜  ~ docker ps
CONTAINER ID   IMAGE                           COMMAND                  CREATED          STATUS          PORTS                                                                NAMES
afdecf41c08d   naison/authors:latest           "sh"                     37 seconds ago   Up 36 seconds                                                                        authors_default_kubevpn_a9a22
fc04e42799a5   nginx:latest                    "/docker-entrypoint.…"   37 seconds ago   Up 37 seconds   0.0.0.0:80->80/tcp, 0.0.0.0:8888->8888/tcp, 0.0.0.0:9080->9080/tcp   nginx_default_kubevpn_a9a22
➜  ~
```

通过 Pod IP 访问本地 Docker 容器中的服务

```shell
export authors_pod=`kubectl get pods -l app=authors -n default -o jsonpath='{.items[0].metadata.name}'`
export authors_pod_ip=`kubectl get pod $authors_pod -n default -o jsonpath='{.status.podIP}'`
curl -kv -H "foo: bar" http://$authors_pod_ip:80/health
```

查看 nginx 容器日志

```shell
docker logs $(docker ps --format '{{.Names}}' | grep nginx_default_kubevpn)
```

如果你只是想在本地启动镜像，可以用一种简单的方式：

```shell
kubevpn run deployment/authors --no-proxy -it --rm
```

例如：

```shell
➜  ~ kubevpn run deployment/authors --no-proxy
Starting connect
Detected cluster CIDRs: 172.29.0.0/16, 172.21.0.0/16 (cached)
Using traffic manager in namespace "default"
Forwarded ports (TCP/UDP/xDS)
Created TUN device "utun4"
Added 2 pod/service CIDR routes
Configured DNS
tar: removing leading '/' from member names
/var/folders/30/cmv9c_5j3mq_kthx63sb1t5c0000gn/T/5631078868924498209:/var/run/secrets/kubernetes.io/serviceaccount
tar: Removing leading `/' from member names
tar: Removing leading `/' from hard link targets
/var/folders/30/cmv9c_5j3mq_kthx63sb1t5c0000gn/T/1548572512863475037:/var/run/secrets/kubernetes.io/serviceaccount
create docker network 56c25058d4b7498d02c2c2386ccd1b2b127cb02e8a1918d6d24bffd18570200e
Created container: nginx_default_kubevpn_ff34b
Wait container nginx_default_kubevpn_ff34b to be running...
Container nginx_default_kubevpn_ff34b is running on port 80/tcp:80 8888/tcp:8888 9080/tcp:9080 now
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
Created main container: authors_default_kubevpn_ff34b
2023/09/30 14:02:31 Start listening http port 9080 ...

```

此时程序会挂起，默认为显示日志

如果你想指定在本地启动容器的镜像, 可以使用参数 `--dev-image`, 当本地不存在该镜像时, 会从对应的镜像仓库拉取。如果你想指定启动参数，可以使用 `--entrypoint`
参数，替换为你想要执行的命令，比如 `--entrypoint /bin/bash`, 更多使用参数，请参见 `kubevpn run --help`.
