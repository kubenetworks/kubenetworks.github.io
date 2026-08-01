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

## SSH Data-plane Bypass (auto-detect)

When you connect with `--ssh-addr` and that SSH host happens to be a Kubernetes node, kubevpn can tunnel the entire
VPN data plane through the SSH connection instead of `kubectl port-forward`. This avoids the API server entirely and
sidesteps the well-known port-forward "black-hole" problem (a local TCP connection that looks alive but never carries
data). Because a node's kube-proxy rules make the traffic manager's ClusterIP directly reachable, the SSH host can dial
it directly.

### Auto-detection (zero new flags)

When `--ssh-addr` is provided, the root daemon automatically probes whether the SSH host can reach the traffic
manager's ClusterIP:

```text
probeSSHDataPlane()
  1. Get Service "kubevpn-traffic-manager" → ClusterIP
  2. SSH dial → tcp://<ClusterIP>:10801  (3s timeout)
  3. Success → sshForward()   — SSH tunnel for all data-plane ports
     Failure → portForward()  — standard kubectl port-forward (unchanged)
```

No new CLI flags and no new proto fields. A bastion-only SSH host (not a K8s node) fails the probe silently and falls
back to the standard port-forward path — fully backward compatible.

### Path comparison

```text
Standard path (port-forward):
  TUN ─▶ 127.0.0.1:<local> ─▶ [SPDY/WS via API server] ─▶ pod:10801

SSH data-plane path:
  TUN ─▶ 127.0.0.1:<local> ─▶ [SSH tunnel] ─▶ node ─▶ ClusterIP:10801 ─▶ pod:10801
```

| Aspect | port-forward | SSH data-plane |
|---|---|---|
| API server dependency | Yes (SPDY/WebSocket) | No |
| Black-hole risk | Known issue | SSH TCP is reliable |
| Reconnection | Client-side detect + retry | `PortMapUntil` auto-reconnects |
| Pod restart handling | Must re-find pod | ClusterIP is stable; kube-proxy updates endpoints |
| Requirement | kubeconfig access | SSH access to a K8s node |

Liveness is unchanged: the heartbeat watchdog operates at the TUN layer, so it works regardless of whether the
underlying transport is port-forward or an SSH tunnel.

## SSH Remote Terminal

The `kubevpn ssh` command creates an interactive terminal on a remote server through a WebSocket connection to the
daemon. Two modes are supported:

- **Full mode** (default): Connect to SSH server and create a two-way TUN tunnel for inner IP communication (using
  198.18.0.0/16 CIDR range)
- **Lite mode** (`--lite`): Only connect to SSH server, no tunnel creation

The terminal session supports automatic window resize detection and raw terminal mode.

![ssh.svg](img/ssh.svg)
