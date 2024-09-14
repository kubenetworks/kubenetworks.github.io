---
sidebar_position: 4
---

# Kubevpn proxy

Proxy kubernetes workloads inbound traffic into local PC

Proxy k8s workloads inbound traffic into local PC with/without service mesh. Without service mesh, it will proxy all
inbound traffic into local PC, even traffic protocol is layer 4(Transport layer). With service mesh, it will proxy
traffic which has special header to local PC, support protocol HTTP, gRPC, Thrift, WebSocket etc. After proxy resource, it
also connected to cluster network automatically. so just startup your app in local PC and waiting for inbound traffic,
make debug more easier.

# Examples

## Reverse proxy

### proxy deployment

```shell
kubevpn proxy deployment/productpage
```

### proxy service

```shell
kubevpn proxy service/productpage
```

### proxy multiple workloads

```shell
kubevpn proxy deployment/authors deployment/productpage
```

or

```shell
kubevpn proxy deployment authors productpage
```

## Reverse proxy with mesh, traffic with HTTP header foo=bar, will hit local PC, otherwise no effect

```shell
kubevpn proxy service/productpage --headers foo=bar
```

## Reverse proxy with mesh, traffic with HTTP header foo=bar and env=dev, will hit local PC, otherwise no effect

```shell
kubevpn proxy service/productpage --headers foo=bar --headers env=dev
```

## Connect to api-server behind of bastion host or ssh jump host and proxy kubernetes resource traffic into local PC

```shell
kubevpn proxy deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --headers foo=bar
```

## It also support ProxyJump, like

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn proxy service/productpage --ssh-alias <alias> --headers foo=bar
```

## Support ssh auth GSSAPI

```shell
kubevpn proxy service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn proxy service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn proxy service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

## Support port map, you can proxy container port to local port by command:

```shell
kubevpn proxy deployment/productpage --portmap 80:8080
```

## Proxy container port 9080 to local port 8080 of TCP protocol

```shell
kubevpn proxy deployment/productpage --portmap 9080:8080
```

## Proxy container port 9080 to local port 5000 of UDP protocol

```shell
kubevpn proxy deployment/productpage --portmap udp/9080:5000
```

## Auto proxy container port to same local port, and auto detect protocol

```shell
kubevpn proxy deployment/productpage
```

# Options

```text
--debug=false:
Enable debug mode or not, true or false

--engine='raw':
transport engine ("mix"|"raw") mix: use gvisor and raw both (both performance and stable), raw: use raw mode
(best stable)

--extra-cidr=[]:
Extra network CIDR string, add those cidr network to route table, eg: --extra-cidr 192.168.0.159/24
--extra-cidr 192.168.1.160/32

--extra-domain=[]:
Extra domain string, the resolved IP will add to route table, eg: --extra-domain test.abc.com --extra-domain
foo.test.com

--extra-node-ip=false:
Extra node IP, add cluster node IP to route table.

--foreground=false:
foreground hang up

--gssapi-cache='':
GSSAPI cache file path, use command `kinit -c /path/to/cache USERNAME@RELAM` to generate

--gssapi-keytab='':
GSSAPI keytab file path

--gssapi-password='':
GSSAPI password

-H, --headers=[]:
Traffic with special headers (use `and` to match all headers) with reverse it to local PC, If not special,
redirect all traffic to local PC. eg: --headers foo=bar --headers env=dev

--image='docker.io/naison/kubevpn:v2.2.17':
Use this image to startup container

--portmap=[]:
Port map, map container port to local port, format: [tcp/udp]/containerPort:localPort, If not special,
localPort will use containerPort. eg: tcp/80:8080 or udp/5000:5001 or 80 or 80:8080

--remote-kubeconfig='':
Remote kubeconfig abstract path of ssh server, default is /home/$USERNAME/.kube/config

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
```
