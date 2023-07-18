---
sidebar_position: 6
---

# 本地进入开发模式 🐳

将 Kubernetes pod 运行在本地的 Docker 容器中，同时配合 service mesh, 拦截带有指定 header 的流量到本地，或者所有的流量到本地。这个开发模式依赖于本地 Docker。

```shell
➜  ~ kubevpn -n kube-system --headers a=1 -p 9080:9080 -p 80:80 dev deployment/authors
got cidr from cache
update ref count successfully
traffic manager already exist, reuse it
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
deployment "authors" successfully rolled out
port forward ready
tunnel connected
dns service ok
tar: removing leading '/' from member names
/var/folders/4_/wt19r8113kq_mfws8sb_w1z00000gn/T/3264799524258261475:/var/run/secrets/kubernetes.io/serviceaccount
tar: Removing leading '/' from member names
tar: Removing leading '/' from hard link targets
/var/folders/4_/wt19r8113kq_mfws8sb_w1z00000gn/T/4472770436329940969:/var/run/secrets/kubernetes.io/serviceaccount
tar: Removing leading '/' from member names
tar: Removing leading '/' from hard link targets
/var/folders/4_/wt19r8113kq_mfws8sb_w1z00000gn/T/359584695576599326:/var/run/secrets/kubernetes.io/serviceaccount
Created container: authors_kube-system_kubevpn_a7d82
Wait container authors_kube-system_kubevpn_a7d82 to be running...
Container authors_kube-system_kubevpn_a7d82 is running on port 9080/tcp:32771 now
Created container: nginx_kube-system_kubevpn_a7d82
Wait container nginx_kube-system_kubevpn_a7d82 to be running...
Container nginx_kube-system_kubevpn_a7d82 is running now
/opt/microservices # ls
app
/opt/microservices # ps -ef
PID   USER     TIME  COMMAND
    1 root      0:00 ./app
   10 root      0:00 nginx: master process nginx -g daemon off;
   32 root      0:00 /bin/sh
   44 101       0:00 nginx: worker process
   45 101       0:00 nginx: worker process
   46 101       0:00 nginx: worker process
   47 101       0:00 nginx: worker process
   49 root      0:00 ps -ef
/opt/microservices # apk add curl
fetch https://dl-cdn.alpinelinux.org/alpine/v3.14/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.14/community/x86_64/APKINDEX.tar.gz
(1/4) Installing brotli-libs (1.0.9-r5)
(2/4) Installing nghttp2-libs (1.43.0-r0)
(3/4) Installing libcurl (7.79.1-r5)
(4/4) Installing curl (7.79.1-r5)
Executing busybox-1.33.1-r3.trigger
OK: 8 MiB in 19 packages
/opt/microservices # curl localhost:9080
404 page not found
/opt/microservices # curl localhost:9080/health
{"status":"Authors is healthy"}/opt/microservices # exit
prepare to exit, cleaning up
update ref count successfully
clean up successful
```

此时本地会启动两个 container, 对应 pod 容器中的两个 container, 并且共享端口, 可以直接使用 localhost:port 的形式直接访问另一个 container,
并且, 所有的环境变量、挂载卷、网络条件都和 pod 一样, 真正做到与 kubernetes 运行环境一致。

```shell
➜  ~ docker ps
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                                        NAMES
de9e2f8ab57d        nginx:latest            "/docker-entrypoint.…"   5 seconds ago       Up 5 seconds                                                     nginx_kube-system_kubevpn_e21d8
28aa30e8929e        naison/authors:latest   "./app"                  6 seconds ago       Up 5 seconds        0.0.0.0:80->80/tcp, 0.0.0.0:9080->9080/tcp   authors_kube-system_kubevpn_e21d8
➜  ~
```

如果你想指定在本地启动容器的镜像, 可以使用参数 `--docker-image`, 当本地不存在该镜像时, 会从对应的镜像仓库拉取。如果你想指定启动参数，可以使用 `--entrypoint`
参数，替换为你想要执行的命令，比如 `--entrypoint /bin/bash`, 更多使用参数，请参见 `kubevpn dev --help`.