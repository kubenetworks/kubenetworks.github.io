---
sidebar_position: 17
---

# Kubevpn ssh

SSH to a jump server and connect to its network.

This command opens an SSH terminal session to a remote server. In full mode (default), it not only connects to the SSH
server, but also creates a two-way tunnel to communicate with inner IPs on the remote network (using the 198.18.0.0/16
CIDR range). In lite mode, it only connects to the SSH server without creating the tunnel.

# Examples

## Jump to server behind of bastion host or ssh jump host

```shell
kubevpn ssh --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## It also supports ProxyJump, like

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────┘
```

```shell
kubevpn ssh --ssh-alias <alias>
```

## Support ssh auth GSSAPI

```shell
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn ssh --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

## Use lite mode (only connect to ssh server, no tunnel)

```shell
kubevpn ssh --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem --lite
```

# Options

```text
--extra-cidr=[]:
Extra network CIDR string, eg: --extra-cidr 192.168.0.159/24 --extra-cidr 192.168.1.160/32

--gssapi-cache='':
GSSAPI cache file path, use command `kinit -c /path/to/cache USERNAME@RELAM` to generate

--gssapi-keytab='':
GSSAPI keytab file path

--gssapi-password='':
GSSAPI password

--lite=false:
connect to ssh server in lite mode. mode "lite": design for only connect to ssh server.
mode "full": not only connect to ssh server, it also create a two-way tunnel communicate with inner ip

--platform='linux/amd64':
Set ssh server platform if needs to install command kubevpn

--remote-kubeconfig='':
Abstract path of kubeconfig on ssh remote server

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
```
