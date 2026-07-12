---
sidebar_position: 9
---

# SSH architecture

KubeVPN's SSH subsystem provides two core capabilities:

1. **SSH Jump Host** — Access private Kubernetes clusters through SSH tunnels
2. **SSH Remote Terminal** — Create interactive terminal sessions on remote servers with optional TUN tunnel

## SSH Jump Host

When the Kubernetes API Server is in a private network and not directly reachable, use SSH tunnels to access it:

```text
┌──────┐    SSH tunnel    ┌──────────┐       ┌──────────────┐
│ Local ├────────────────►│ Jump Host├──────►│ K8s API Server│
└──────┘  127.0.0.1:N     └──────────┘       └──────────────┘
```

### Connection Flow

1. Establish SSH connection to the jump host
2. Create a local port-forward through SSH to the API server
3. Rewrite kubeconfig to point to the local forwarded port
4. All subsequent kubectl operations go through the SSH tunnel

### Authentication Methods

| Method | Flags |
|--------|-------|
| Password | `--ssh-password` |
| Key file | `--ssh-keyfile` |
| SSH config alias | `--ssh-alias` |
| GSSAPI/Kerberos password | `--gssapi-password` |
| GSSAPI keytab | `--gssapi-keytab` |
| GSSAPI credential cache | `--gssapi-cache` |

### ProxyJump Support

Supports multi-hop SSH chains via `--ssh-jump` or SSH config `ProxyJump`:

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

## SSH Remote Terminal

The `kubevpn ssh` command creates an interactive terminal on a remote server through a WebSocket connection to the
daemon. Two modes are supported:

- **Full mode** (default): Connect to SSH server and create a two-way TUN tunnel for inner IP communication (using
  198.18.0.0/16 CIDR range)
- **Lite mode** (`--lite`): Only connect to SSH server, no tunnel creation

The terminal session supports automatic window resize detection and raw terminal mode.

![ssh.svg](img/ssh.svg)
