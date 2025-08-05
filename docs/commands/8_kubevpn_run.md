---
sidebar_position: 8
---

# Kubevpn run

Run your kubernetes workloads in local Docker container with same volume、env、and network
What did it do:

* Download volume which MountPath point to, mount to docker container
* Connect to cluster network, set network to docker container
* Get all environment with command (env), set env to docker container

# Examples

## Run workloads

```shell
kubevpn run deployment/productpage
```

## Develop workloads with mesh, traffic with HTTP header foo=bar, will hit local PC, otherwise no effect

```shell
kubevpn run service/productpage --headers foo=bar
```

## Develop workloads without proxy traffic

```shell
kubevpn run service/productpage --no-proxy
```

## Develop workloads which api-server behind of bastion host or ssh jump host

```shell
kubevpn run deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## It also support ProxyJump, like

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn run deployment/productpage --ssh-alias <alias>
```

## Switch to terminal mode; send stdin to 'bash' and sends stdout/stderror from 'bash' back to the client

```shell
kubevpn run deployment/authors -n default --kubeconfig ~/.kube/config --ssh-alias dev --entrypoint /bin/bash
```

or

```shell
kubevpn run deployment/authors -n default --kubeconfig ~/.kube/config --ssh-alias dev --entrypoint /bin/bash
```

## Support ssh auth GSSAPI

```shell
kubevpn run deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab --entrypoint /bin/bash
kubevpn run deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache --entrypoint /bin/bash
kubevpn run deployment/authors -n default --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD> --entrypoint /bin/bash
```

# Options

```text
--connect-mode='host':
Connect to kubernetes network in container or in host, eg: [container|host]

-c, --container='':
Container name. If omitted, use the kubectl.kubernetes.io/default-container annotation for selecting the
container to be attached or the first container in the pod will be chosen

--debug=false:
enable debug mode or not, true or false

--dev-image='':
Use to startup docker container, Default is pod image

--entrypoint='':
Overwrite the default ENTRYPOINT of the image

--expose=:
Expose a port or a range of ports

--extra-cidr=[]:
Extra network CIDR string, add those cidr network to route table, eg: --extra-cidr 192.168.0.159/24 
--extra-cidr 192.168.1.160/32

--extra-domain=[]:
Extra domain string, the resolved IP will add to route table, eg: --extra-domain test.abc.com --extra-domain
foo.test.com

--extra-node-ip=false:
Extra node IP, add cluster node IP to route table.

--gssapi-cache='':
GSSAPI cache file path, use command `kinit -c /path/to/cache USERNAME@RELAM` to generate

--gssapi-keytab='':
GSSAPI keytab file path

--gssapi-password='':
GSSAPI password

-H, --headers=[]:
Traffic with special headers with reverse it to local PC, you should startup your service after reverse
workloads successfully, If not special, redirect all traffic to local PC, format: <KEY>=<VALUE>, like: k1=v1,k2=v2

--image='docker.io/naison/kubevpn:v2.2.17':
use this image to startup container

--no-proxy=false:
Whether proxy remote workloads traffic into local or not, true: just startup container on local without inject
containers to intercept traffic, false: intercept traffic and forward to local

--platform='':
Set platform if server is multi-platform capable

--privileged=true:
Give extended privileges to this container

-p, --publish=:
Publish a container's port(s) to the host

-P, --publish-all=false:
Publish all exposed ports to random ports

--pull='missing':
Pull image before running ("always"|"missing"|"never")

--remote-kubeconfig='':
Abstract path of kubeconfig on ssh remote server

--sig-proxy=true:
Proxy received signals to the process

--ssh-addr='':
Optional ssh jump server address to dial as <hostname>:<port>, eg: 127.0.0.1:22

--ssh-alias='':
Optional config alias with ~/.ssh/config for SSH authentication

--ssh-jump='':
Optional bastion jump config string, eg: '--ssh-addr jumpe.naison.org --ssh-username naison --gssapi-password
xxx'

--ssh-keyfile='':
Optional file with private key for SSH authentication

--ssh-password='':
Optional password for ssh jump server

--ssh-username='':
Optional username for ssh jump server

--transfer-image=false:
transfer image to remote registry, it will transfer image docker.io/naison/kubevpn:v2.2.17 to flags `--image`
special image, default: docker.io/naison/kubevpn:v2.2.17

-v, --volume=:
Bind mount a volume
```