---
sidebar_position: 2
---

# Kubevpn connect

Connect to kubernetes cluster network

After connect to kubernetes cluster network, you can `ping PodIP` or `curl ServiceIP` in local PC, it also supports k8s
DNS resolve. Like: `curl authors/authors.default/authors.default.svc/authors.default.svc.cluster.local`. So you can
start up your application in local PC. depends on anything in k8s cluster is ok, connect to them just like in k8s
cluster.

# Examples

## Connect to k8s cluster network

```shell
kubevpn connect
```

## Connect to api-server behind of bastion host or ssh jump host

```shell
kubevpn connect --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## It also support ProxyJump, like

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn connect --ssh-alias <alias>
```

## Support ssh auth GSSAPI

```shell
kubevpn connect --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn connect --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn connect --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

## Support ssh jump inline

```shell
kubevpn connect --ssh-jump "--ssh-addr jump.naison.org --ssh-username naison --gssapi-password xxx" --ssh-username root --ssh-addr 127.0.0.1:22 --ssh-keyfile ~/.ssh/dst.pem
```

# Options

```text
--debug=false:
enable debug mode or not, true or false

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
Hang up

--gssapi-cache='':
GSSAPI cache file path, use command `kinit -c /path/to/cache USERNAME@RELAM` to generate

--gssapi-keytab='':
GSSAPI keytab file path

--gssapi-password='':
GSSAPI password

--image='docker.io/naison/kubevpn:v2.2.17':
use this image to startup container

--lite=false:
connect to multiple cluster in lite mode, you needs to special this options
mode lite: connect to multiple cluster network, design for only connecting to multiple cluster network
mode full: not only connect to cluster network, it also supports proxy workloads inbound traffic to local PC

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