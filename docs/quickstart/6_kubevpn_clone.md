---
sidebar_position: 6
---

# Kubevpn clone

Clone workloads to run in target-kubeconfig cluster with same volume、env、and network

In this way, you can start up another deployment in same cluster or not, but with different image version, it also
supports service mesh proxy. only traffic with special header will hit to cloned_resource.

# Examples

## clone

### clone deployment run into current cluster and current namespace

```shell
kubevpn clone deployment/productpage
```

### clone deployment run into current cluster with different namespace

```shell
kubevpn clone deployment/productpage -n test
```

### clone deployment run into another cluster

```shell
kubevpn clone deployment/productpage --target-kubeconfig ~/.kube/other-kubeconfig
```

### clone multiple workloads run into current cluster and current namespace

```shell
kubevpn clone deployment/authors deployment/productpage
```

or

```shell
kubevpn clone deployment authors productpage
```

# clone with mesh, traffic with HTTP header foo=bar, will hit cloned workloads, otherwise hit origin workloads

```shell
kubevpn clone deployment/productpage --headers foo=bar
```

# clone workloads which api-server behind of bastion host or ssh jump host

```shell
kubevpn clone deployment/productpage --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --headers foo=bar
```

# It also supports ProxyJump, like

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn clone service/productpage --ssh-alias <alias> --headers foo=bar
```

# Support ssh auth GSSAPI

```shell
kubevpn clone service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn clone service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn clone service/productpage --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
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

--gssapi-cache='':
GSSAPI cache file path, use command `kinit -c /path/to/cache USERNAME@RELAM` to generate

--gssapi-keytab='':
GSSAPI keytab file path

--gssapi-password='':
GSSAPI password

-H, --headers=[]:
Traffic with special headers (use `and` to match all headers) with reverse it to target cluster cloned workloads.
If not special, redirect all traffic to target cluster cloned workloads. eg: --headers foo=bar --headers env=dev

--image='docker.io/naison/kubevpn:v2.2.17':
Use this image to startup container

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

--sync='':
Sync local dir to remote pod dir. format: LOCAL_DIR:REMOTE_DIR, eg: ~/code:/app/code

--target-container='':
Clone container use special image to startup this container, if not special, use origin image

--target-image='':
Clone container use this image to startup container, if not special, use origin image

--target-kubeconfig='':
Clone workloads will create in this cluster, if not special, use origin cluster

--target-namespace='':
Clone workloads in this namespace, if not special, use origin namespace

--target-registry='':
Clone workloads will create this registry domain to replace origin registry, if not special, use origin
registry

--transfer-image=false:
transfer image to remote registry, it will transfer image docker.io/naison/kubevpn:v2.2.17 to flags `--image`
special image, default: docker.io/naison/kubevpn:v2.2.17
```