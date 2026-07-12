---
sidebar_position: 9
---

# SSH 架构

KubeVPN 的 SSH 子系统提供两大核心能力：

1. **SSH 跳板机** — 通过 SSH 隧道访问私有网络中的 Kubernetes 集群
2. **SSH 远程终端** — 在远程服务器上创建交互式终端会话，可选建立 TUN 隧道

## SSH 跳板机

当 Kubernetes API Server 在私有网络中不可直达时，通过 SSH 隧道访问：

```text
┌──────┐    SSH 隧道    ┌──────────┐       ┌──────────────┐
│ 本机  ├──────────────►│ 跳板机    ├──────►│ K8s API 服务器│
└──────┘  127.0.0.1:N   └──────────┘       └──────────────┘
```

### 连接流程

1. 建立到跳板机的 SSH 连接
2. 通过 SSH 创建本地端口转发到 API 服务器
3. 重写 kubeconfig 指向本地转发端口
4. 后续所有 kubectl 操作通过 SSH 隧道进行

### 认证方式

| 方式 | 参数 |
|------|------|
| 密码 | `--ssh-password` |
| 密钥文件 | `--ssh-keyfile` |
| SSH 配置别名 | `--ssh-alias` |
| GSSAPI/Kerberos 密码 | `--gssapi-password` |
| GSSAPI keytab | `--gssapi-keytab` |
| GSSAPI 凭据缓存 | `--gssapi-cache` |

### ProxyJump 支持

支持多跳 SSH 链，通过 `--ssh-jump` 或 SSH 配置 `ProxyJump`：

```text
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐                 ┌────────────┐
│  pc  ├────►│ ssh1 ├────►│ ssh2 ├────►│ ssh3 ├─────►... ─────► │ api-server │
└──────┘     └──────┘     └──────┘     └──────┘                 └────────────┘
```

## SSH 远程终端

`kubevpn ssh` 命令通过 WebSocket 连接到守护进程，在远程服务器上创建交互式终端。支持两种模式：

- **完整模式**（默认）：连接到 SSH 服务器并创建双向 TUN 隧道，用于内部 IP 通信（使用 198.18.0.0/16 CIDR 范围）
- **精简模式**（`--lite`）：仅连接到 SSH 服务器，不创建隧道

终端会话支持自动窗口大小检测和 raw 终端模式。

![ssh.svg](img/ssh.svg)
