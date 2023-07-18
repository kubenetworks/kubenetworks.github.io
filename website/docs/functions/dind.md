---
sidebar_position: 7
---

# DinD ( Docker in Docker ) use kubevpn in Docker

If you want to start the development mode locally using Docker in Docker (DinD), because the program will read and
write the `/tmp` directory, you need to manually add the parameter `-v /tmp:/tmp` (outer docker) and other thing is you
need to special parameter `--network` (inner docker) for sharing network and pid

Example:

```shell
docker run -it --privileged -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp -v /Users/naison/.kube/config:/root/.kube/config naison/kubevpn:v1.1.21
```

```shell
➜  ~ docker run -it --privileged -c authors -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp -v /Users/naison/.kube/vke:/root/.kube/config -v /Users/naison/Desktop/kubevpn/bin:/app naison/kubevpn:v1.1.21
root@4d0c3c4eae2b:/# hostname
4d0c3c4eae2b
root@4d0c3c4eae2b:/# kubevpn -n kube-system --image naison/kubevpn:v1.1.21 --headers user=naison --network container:4d0c3c4eae2b --entrypoint /bin/bash dev deployment/authors

----------------------------------------------------------------------------------
    Warn: Use sudo to execute command kubevpn can not use user env KUBECONFIG.
    Because of sudo user env and user env are different.
    Current env KUBECONFIG value:
----------------------------------------------------------------------------------

got cidr from cache
traffic manager not exist, try to create it...
pod [kubevpn-traffic-manager] status is Pending
Container Reason Message

pod [kubevpn-traffic-manager] status is Pending
Container     Reason            Message
control-plane ContainerCreating
vpn           ContainerCreating
webhook       ContainerCreating

pod [kubevpn-traffic-manager] status is Running
Container     Reason           Message
control-plane ContainerRunning
vpn           ContainerRunning
webhook       ContainerRunning

update ref count successfully
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
deployment "authors" successfully rolled out
port forward ready
tunnel connected
dns service ok
tar: removing leading '/' from member names
/tmp/3122262358661539581:/var/run/secrets/kubernetes.io/serviceaccount
tar: Removing leading '/' from member names
tar: Removing leading '/' from hard link targets
/tmp/7677066538742627822:/var/run/secrets/kubernetes.io/serviceaccount
latest: Pulling from naison/authors
Digest: sha256:2e7b2d6a4c6143cde888fcdb70ba091d533e11de70e13e151adff7510a5d52d4
Status: Downloaded newer image for naison/authors:latest
Created container: authors_kube-system_kubevpn_c68e4
Wait container authors_kube-system_kubevpn_c68e4 to be running...
Container authors_kube-system_kubevpn_c68e4 is running now
Created container: nginx_kube-system_kubevpn_c68e7
Wait container nginx_kube-system_kubevpn_c68e7 to be running...
Container nginx_kube-system_kubevpn_c68e7 is running now
/opt/microservices # ps -ef
PID   USER     TIME  COMMAND
    1 root      0:00 {bash} /usr/bin/qemu-x86_64 /bin/bash /bin/bash
   60 root      0:07 {kubevpn} /usr/bin/qemu-x86_64 kubevpn kubevpn dev deployment/authors -n kube-system --image naison/kubevpn:v1.1.21 --headers user=naison --parent
   73 root      0:00 {tail} /usr/bin/qemu-x86_64 /usr/bin/tail tail -f /dev/null
   80 root      0:00 {nginx} /usr/bin/qemu-x86_64 /usr/sbin/nginx nginx -g daemon off;
   92 root      0:00 {sh} /usr/bin/qemu-x86_64 /bin/sh /bin/sh
  156 101       0:00 {nginx} /usr/bin/qemu-x86_64 /usr/sbin/nginx nginx -g daemon off;
  158 101       0:00 {nginx} /usr/bin/qemu-x86_64 /usr/sbin/nginx nginx -g daemon off;
  160 101       0:00 {nginx} /usr/bin/qemu-x86_64 /usr/sbin/nginx nginx -g daemon off;
  162 101       0:00 {nginx} /usr/bin/qemu-x86_64 /usr/sbin/nginx nginx -g daemon off;
  164 root      0:00 ps -ef
/opt/microservices # ls
app
/opt/microservices # apk add curl
fetch https://dl-cdn.alpinelinux.org/alpine/v3.14/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.14/community/x86_64/APKINDEX.tar.gz
(1/4) Installing brotli-libs (1.0.9-r5)
(2/4) Installing nghttp2-libs (1.43.0-r0)
(3/4) Installing libcurl (7.79.1-r5)
(4/4) Installing curl (7.79.1-r5)
Executing busybox-1.33.1-r3.trigger
OK: 8 MiB in 19 packages
/opt/microservices # curl localhost:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
/opt/microservices # ls
app
/opt/microservices # exit
prepare to exit, cleaning up
update ref count successfully
ref-count is zero, prepare to clean up resource
clean up successful
root@4d0c3c4eae2b:/# exit
exit
```