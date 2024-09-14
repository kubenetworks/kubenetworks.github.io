---
sidebar_position: 11
---

# Kubevpn reset

Reset all resources created by kubevpn in a Kubernetes cluster

The reset operation will delete all resources created by kubevpn in the Kubernetes cluster, such as deployments,
services, service accounts, etc. It will also delete local development Docker containers, Docker networks, host entries
added by kubevpn, and clean up DNS settings.

# Examples

## Reset the default namespace:

```bash
kubevpn reset
```

## Reset another namespace test

```shell
kubevpn reset -n test
```

## Reset cluster api-server behind of bastion host or ssh jump host

```shell
kubevpn reset --ssh-addr 192.168.1.100:22 --ssh-username root --ssh-keyfile ~/.ssh/ssh.pem
```

## It also support ProxyJump, like

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

```shell
kubevpn reset --ssh-alias <alias>
```

## Support ssh auth GSSAPI

```shell
kubevpn reset --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-keytab /path/to/keytab
kubevpn reset --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-cache /path/to/cache
kubevpn reset --ssh-addr <HOST:PORT> --ssh-username <USERNAME> --gssapi-password <PASSWORD>
```

# Options

```text
--gssapi-cache='':
GSSAPI cache file path, use command `kinit -c /path/to/cache USERNAME@RELAM` to generate

--gssapi-keytab='':
GSSAPI keytab file path

--gssapi-password='':
GSSAPI password

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
```