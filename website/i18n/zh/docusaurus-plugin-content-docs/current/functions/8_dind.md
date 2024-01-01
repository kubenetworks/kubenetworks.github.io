---
sidebar_position: 8
---

# DinD ( Docker in Docker ) 在 Docker 中使用 kubevpn

如果你想在本地使用 Docker in Docker (DinD) 的方式启动开发模式, 由于程序会读写 `/tmp` 目录，您需要手动添加参数 `-v /tmp:/tmp`, 还有一点需要注意, 如果使用 DinD
模式，为了共享容器网络和 pid, 还需要指定参数 `--network`

例如:

```shell
docker run -it --privileged --sysctl net.ipv6.conf.all.disable_ipv6=0 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp -v ~/.kube/config:/root/.kube/config --platform linux/amd64 naison/kubevpn:v2.0.0
```

```shell
➜  ~ docker run -it --privileged --sysctl net.ipv6.conf.all.disable_ipv6=0 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp -v ~/.kube/vke:/root/.kube/config --platform linux/amd64 naison/kubevpn:v2.0.0
Unable to find image 'naison/kubevpn:v2.0.0' locally
v2.0.0: Pulling from naison/kubevpn
445a6a12be2b: Already exists
bd6c670dd834: Pull complete
64a7297475a2: Pull complete
33fa2e3224db: Pull complete
e008f553422a: Pull complete
5132e0110ddc: Pull complete
5b2243de1f1a: Pull complete
662a712db21d: Pull complete
4f4fb700ef54: Pull complete
33f0298d1d4f: Pull complete
Digest: sha256:115b975a97edd0b41ce7a0bc1d8428e6b8569c91a72fe31ea0bada63c685742e
Status: Downloaded newer image for naison/kubevpn:v2.0.0
root@d0b3dab8912a:/app# kubevpn dev deployment/authors --headers user=naison -it --entrypoint sh

----------------------------------------------------------------------------------
    Warn: Use sudo to execute command kubevpn can not use user env KUBECONFIG.
    Because of sudo user env and user env are different.
    Current env KUBECONFIG value:
----------------------------------------------------------------------------------

hostname is d0b3dab8912a
connectting to cluster
start to connect
got cidr from cache
get cidr successfully
update ref count successfully
traffic manager already exist, reuse it
port forward ready
tunnel connected
dns service ok
start to create remote inbound pod for Deployment.apps/authors
patch workload default/Deployment.apps/authors with sidecar
rollout status for Deployment.apps/authors
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
deployment "authors" successfully rolled out
rollout status for Deployment.apps/authors successfully
create remote inbound pod for Deployment.apps/authors successfully
tar: removing leading '/' from member names
/tmp/6460902982794789917:/var/run/secrets/kubernetes.io/serviceaccount
tar: Removing leading `/' from member names
tar: Removing leading `/' from hard link targets
/tmp/5028895788722532426:/var/run/secrets/kubernetes.io/serviceaccount
network mode is container:d0b3dab8912a
Created container: nginx_default_kubevpn_6df63
Wait container nginx_default_kubevpn_6df63 to be running...
Container nginx_default_kubevpn_6df63 is running now
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
Created main container: authors_default_kubevpn_6df5f
/opt/microservices # ps -ef
PID   USER     TIME  COMMAND
    1 root      0:00 {bash} /usr/bin/qemu-x86_64 /bin/bash /bin/bash
   14 root      0:02 {kubevpn} /usr/bin/qemu-x86_64 /usr/local/bin/kubevpn kubevpn dev deployment/authors --headers
   25 root      0:01 {kubevpn} /usr/bin/qemu-x86_64 /usr/local/bin/kubevpn /usr/local/bin/kubevpn daemon
   37 root      0:04 {kubevpn} /usr/bin/qemu-x86_64 /usr/local/bin/kubevpn /usr/local/bin/kubevpn daemon --sudo
   53 root      0:00 nginx: master process nginx -g daemon off;
(4/4) Installing curl (8.0.1-r0)
Executing busybox-1.33.1-r3.trigger
OK: 8 MiB in 19 packagesnx: worker process
/opt/microservices #
/opt/microservices # apk add curl
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
/opt/microservices # ls -alh
total 6M
drwxr-xr-x    2 root     root        4.0K Oct 18  2021 .
drwxr-xr-x    1 root     root        4.0K Oct 18  2021 ..
-rwxr-xr-x    1 root     root        6.3M Oct 18  2021 app
/opt/microservices # ./app &
/opt/microservices # 2023/09/30 14:27:32 Start listening http port 9080 ...

/opt/microservices # curl authors:9080/health
/opt/microservices # curl authors:9080/health
{"status":"Authors is healthy"}/opt/microservices #
/opt/microservices # curl localhost:9080/health
{"status":"Authors is healthy"}/opt/microservices # exit
prepare to exit, cleaning up
update ref count successfully
tun device closed
leave resource: deployments.apps/authors
workload default/deployments.apps/authors is controlled by a controller
leave resource: deployments.apps/authors successfully
clean up successfully
prepare to exit, cleaning up
update ref count successfully
clean up successfully
root@d0b3dab8912a:/app# exit
exit
➜  ~
```

```text
➜  ~ docker ps
CONTAINER ID   IMAGE                           COMMAND                  CREATED         STATUS         PORTS     NAMES
1cd576b51b66   naison/authors:latest           "sh"                     4 minutes ago   Up 4 minutes             authors_default_kubevpn_6df5f
56a6793df82d   nginx:latest                    "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes             nginx_default_kubevpn_6df63
d0b3dab8912a   naison/kubevpn:v2.0.0     "/bin/bash"              5 minutes ago   Up 5 minutes             upbeat_noyce
➜  ~
```