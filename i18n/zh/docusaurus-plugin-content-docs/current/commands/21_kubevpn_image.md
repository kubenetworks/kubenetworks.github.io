---
sidebar_position: 21
---

# kubevpn image

镜像管理命令。

# 子命令

## image copy

复制或重新标记镜像。别名：`cp`。此命令在仓库之间工作，只拉取目标不存在的层。在同一仓库中，
只发送带有新标签的 manifest。

镜像引用支持 **DSN 风格的内联凭据**：可以直接在引用中嵌入用户名和密码。TLS 自动检测 — 命令先尝试 HTTPS
连接，如果 TLS 握手失败则回退到 HTTP — 无需手动指定 `--insecure` 参数。

### 复制镜像到另一个仓库

```shell
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest registry.example.org/kubevpn/kubevpn:latest
```

### 重新标记镜像

```shell
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest ghcr.io/kubenetworks/kubevpn:v2.11.5
```

### 使用内联凭据复制（TLS 自动检测）

```shell
kubevpn image copy user:pass@src-registry.com/repo:v1 user:pass@dst-registry.com/repo:v1
```

### 在私有仓库之间复制

```shell
kubevpn image copy admin:secret@registry-a.local:5000/repo:v1 admin:secret@registry-b.example.com/repo:v1
```

### DSN 引用格式

镜像引用支持 DSN 风格的内联凭据格式：

```text
[用户[:密码]@]仓库主机[:端口]/命名空间/镜像名[:标签|@摘要]
└── 凭据 ──┘└──────────── 标准镜像引用 ──────────┘
```

| 示例 | 解析结果 |
|------|---------|
| `ghcr.io/kubenetworks/kubevpn:latest` | 无凭据，标准引用 |
| `admin:secret@registry.example.com/repo:v1` | 用户 `admin`，密码 `secret` |
| `admin@registry.example.com/repo:v1` | 用户 `admin`，无密码 |
| `user:pass@registry.com/repo@sha256:abcd...` | 凭据 + 摘要引用 |
| `registry.com/repo@sha256:abcd...` | 无凭据，摘要引用 |
| `nginx:latest` | Docker Hub 短名称，无凭据 |

### 自动 TLS 检测

提供内联凭据时，会自动探测仓库的 TLS 支持：

1. 尝试 HTTPS 握手（443 端口）— 成功则使用 HTTPS（自动处理自签名证书）
2. TLS 失败时，尝试 HTTP GET `/v2/`（80 端口）— 成功则使用 HTTP
3. 都失败时，默认使用严格 HTTPS

无需手动指定 `http://` 前缀或 `--insecure` 参数。

### 认证

`image copy` 有两条独立的认证路径，按优先级排列：

| 优先级 | 认证方式 | 来源 | 依赖 Docker |
|--------|---------|------|------------|
| 1（高） | DSN 内联凭据 | `user:pass@registry.com/repo:tag` | 不依赖 |
| 2（低） | Docker 凭据存储 | `~/.docker/config.json` | 需要 `docker login` |

当两者指向同一个 registry 时，内联凭据覆盖 Docker 凭据。

**不依赖 Docker。** 机器上没有安装 Docker 也能正常使用 — `WithDockerCreds`/`WithDockerCerts` 在 `~/.docker/config.json` 或 `/etc/docker/certs.d` 不存在时静默跳过，不报错。

| 场景 | 是否可用 | 说明 |
|------|---------|------|
| 有 Docker，已 `docker login`，无内联凭据 | 可用 | 自动读取 `~/.docker/config.json` |
| 有 Docker，已 `docker login`，有内联凭据 | 可用 | 内联凭据覆盖 Docker 凭据 |
| 无 Docker，有内联凭据 | 可用 | 内联凭据独立工作 |
| 无 Docker，无内联凭据，目标为公开镜像 | 可用 | 无需认证 |
| 无 Docker，无内联凭据，目标为私有镜像 | 不可用 | 无凭据来源，registry 返回 401 |
