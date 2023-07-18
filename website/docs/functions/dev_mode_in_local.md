---
sidebar_position: 6
---

# Dev mode in local 🐳

Run the Kubernetes pod in the local Docker container, and cooperate with the service mesh to intercept the traffic with
the specified header to the local, or all the traffic to the local.

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

You can see that it will start up two containers with docker, mapping to pod two container, and share port with same
network, you can use `localhost:port`
to access another container. And more, all environment、volume and network are the same as remote kubernetes pod, it is
truly consistent with the kubernetes runtime. Makes develop on local PC comes true.

```shell
➜  ~ docker ps
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                                        NAMES
de9e2f8ab57d        nginx:latest            "/docker-entrypoint.…"   5 seconds ago       Up 5 seconds                                                     nginx_kube-system_kubevpn_e21d8
28aa30e8929e        naison/authors:latest   "./app"                  6 seconds ago       Up 5 seconds        0.0.0.0:80->80/tcp, 0.0.0.0:9080->9080/tcp   authors_kube-system_kubevpn_e21d8
➜  ~
```

If you want to specify the image to start the container locally, you can use the parameter `--docker-image`. When the
image does not exist locally, it will be pulled from the corresponding mirror warehouse. If you want to specify startup
parameters, you can use `--entrypoint` parameter, replace it with the command you want to execute, such
as `--entrypoint /bin/bash`, for more parameters, see `kubevpn dev --help`.
