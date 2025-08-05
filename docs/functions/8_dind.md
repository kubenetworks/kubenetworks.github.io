---
sidebar_position: 8
---

# Run KubeVPN in Docker (Docker in Docker)

If you want to start the development mode locally using Docker in Docker (DinD), because the program will read and
write the `/tmp` directory, you need to manually add the parameter `-v /tmp:/tmp` (outer docker) and other thing is you
need to special parameter `--network` (inner docker) for sharing network and pid

Example:

```shell
docker run -it --privileged --sysctl net.ipv6.conf.all.disable_ipv6=0 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp -v ~/.kube/config:/root/.kube/config --platform linux/amd64 naison/kubevpn:latest
```

```shell
➜  ~ docker run -it --privileged --sysctl net.ipv6.conf.all.disable_ipv6=0 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp -v ~/.kube/vke:/root/.kube/config --platform linux/amd64 naison/kubevpn:latest
Unable to find image 'naison/kubevpn:latest' locally
latest: Pulling from naison/kubevpn
9c704ecd0c69: Already exists
4987d0a976b5: Pull complete
8aa94c4fc048: Pull complete
526fee014382: Pull complete
6c1c2bedceb6: Pull complete
97ac845120c5: Pull complete
ca82aef6a9eb: Pull complete
1fd9534c7596: Pull complete
588bd802eb9c: Pull complete
Digest: sha256:368db2e0d98f6866dcefd60512960ce1310e85c24a398fea2a347905ced9507d
Status: Downloaded newer image for naison/kubevpn:latest
WARNING: image with reference naison/kubevpn was found but does not match the specified platform: wanted linux/amd64, actual: linux/arm64
root@5732124e6447:/app# kubevpn run deployment/authors --headers user=naison --entrypoint sh
hostname is 5732124e6447
Starting connect
Got network CIDR from cache
Use exist traffic manager
Forwarding port...
Connected tunnel
Adding route...
Configured DNS service
Injecting inbound sidecar for deployment/authors
Patching workload deployment/authors
Checking rollout status for deployment/authors
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
deployment "authors" successfully rolled out
Rollout successfully for Deployment.apps/authors
tar: removing leading '/' from member names
/tmp/6460902982794789917:/var/run/secrets/kubernetes.io/serviceaccount
tar: Removing leading `/' from member names
tar: Removing leading `/' from hard link targets
/tmp/5028895788722532426:/var/run/secrets/kubernetes.io/serviceaccount
Network mode is container:d0b3dab8912a
Created container: nginx_default_kubevpn_6df63
Wait container nginx_default_kubevpn_6df63 to be running...
Container nginx_default_kubevpn_6df63 is running now
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
Created main container: authors_default_kubevpn_6df5f
/opt/microservices # ps -ef
PID   USER     TIME  COMMAND
    1 root      0:00 {bash} /usr/bin/qemu-x86_64 /bin/bash /bin/bash
   14 root      0:02 {kubevpn} /usr/bin/qemu-x86_64 /usr/local/bin/kubevpn kubevpn run deployment/authors --headers
   25 root      0:01 {kubevpn} /usr/bin/qemu-x86_64 /usr/local/bin/kubevpn /usr/local/bin/kubevpn daemon
   37 root      0:04 {kubevpn} /usr/bin/qemu-x86_64 /usr/local/bin/kubevpn /usr/local/bin/kubevpn daemon --sudo
   53 root      0:00 nginx: master process nginx -g daemon off;
(4/4) Installing curl (8.0.1-r0)
Executing busybox-1.33.1-r3.trigger
OK: 8 MiB in 19 packagesnx: worker process
/opt/microservices #

/opt/microservices # cat > hello.go <<EOF
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
        _, _ = io.WriteString(writer, "Hello world!")
        fmt.Println(">> Container Received request: %s %s from %s\n", request.Method, request.RequestURI, request.RemoteAddr)
    })
    fmt.Println("Start listening http port 9080 ...")
    _ = http.ListenAndServe(":9080", nil)
}
EOF
/opt/microservices # go build hello.go
/opt/microservices # 
//opt/microservices # ls -alh
total 12M    
drwxr-xr-x    1 root     root          26 Nov  4 10:29 .
drwxr-xr-x    1 root     root          26 Oct 18  2021 ..
-rwxr-xr-x    1 root     root        6.3M Oct 18  2021 app
-rwxr-xr-x    1 root     root        5.8M Nov  4 10:29 hello
-rw-r--r--    1 root     root         387 Nov  4 10:28 hello.go
/opt/microservices # 
/opt/microservices # apk add curl
OK: 8 MiB in 19 packages
/opt/microservices # ./hello &
/opt/microservices # Start listening http port 9080 ...
[2]+  Done                       ./hello
/opt/microservices # curl localhost:9080
>> Container Received request: GET / from 127.0.0.1:41230
Hello world!/opt/microservices # 

/opt/microservices # curl authors:9080/health -H "foo: bar"
>>Received request: GET /health from 198.19.0.109:57930
                                                        Hello world!/opt/microservices # 
/opt/microservices # curl localhost:9080/health
{"status":"Authors is healthy"}/opt/microservices # exit
Created container: default_authors
Wait container default_authors to be running...
Container default_authors is running now
Disconnecting from the cluster...
Leaving workload deployments.apps/authors
Disconnecting from the cluster...
Performing cleanup operations
Clearing DNS settings
root@d0b3dab8912a:/app# exit
exit
➜  ~
```

during test, check what container is running

```text
➜  ~ docker ps
CONTAINER ID   IMAGE                           COMMAND                  CREATED         STATUS         PORTS     NAMES
1cd576b51b66   naison/authors:latest           "sh"                     4 minutes ago   Up 4 minutes             authors_default_kubevpn_6df5f
56a6793df82d   nginx:latest                    "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes             nginx_default_kubevpn_6df63
d0b3dab8912a   naison/kubevpn:v2.0.0     "/bin/bash"              5 minutes ago   Up 5 minutes             upbeat_noyce
➜  ~
```

* For clean up after test

```shell
kubectl delete -f https://raw.githubusercontent.com/kubenetworks/kubevpn/master/samples/bookinfo.yaml
```