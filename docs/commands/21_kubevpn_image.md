---
sidebar_position: 21
---

# Kubevpn image

Image management commands.

# Subcommands

## image copy

Copy or re-tag an image. Alias: `cp`. This works between registries and only pulls layers that do not exist at the
target. In the same registry it attempts to mount the layers between repositories. And within the same repository it
only sends the manifest with the new tag.

Image references support **DSN-style inline credentials**: you can embed username and password directly in the
reference. TLS is detected automatically — the command probes the registry with HTTPS first and falls back to plain
HTTP if the TLS handshake fails — eliminating the need for manual `--insecure` flags.

### Copy an image to another registry

```shell
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest registry.example.org/kubevpn/kubevpn:latest
```

### Re-tag an image

```shell
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest ghcr.io/kubenetworks/kubevpn:v2.3.4
```

### Copy with inline registry credentials (TLS auto-detected)

```shell
kubevpn image copy user:pass@src-registry.com/repo:v1 user:pass@dst-registry.com/repo:v1
```

### Copy between private registries

```shell
kubevpn image copy admin:secret@registry-a.local:5000/repo:v1 admin:secret@registry-b.example.com/repo:v1
```

### DSN reference format

Image references support inline credentials in a DSN-style format:

```text
[user[:password]@]registry[:port]/namespace/repo[:tag|@digest]
└── credentials ──┘└──────────── standard image reference ──────────┘
```

| Example | Parsed As |
|---------|-----------|
| `ghcr.io/kubenetworks/kubevpn:latest` | No credentials, standard ref |
| `admin:secret@registry.example.com/repo:v1` | User `admin`, password `secret` |
| `admin@registry.example.com/repo:v1` | User `admin`, no password |
| `user:pass@registry.com/repo@sha256:abcd...` | Credentials + digest ref |
| `registry.com/repo@sha256:abcd...` | No credentials, digest ref |
| `nginx:latest` | Docker Hub short name, no credentials |

### Automatic TLS detection

When inline credentials are provided, the registry's TLS support is probed automatically:

1. Try HTTPS handshake (port 443) — if success, use HTTPS (skip CA verify for self-signed certs)
2. If TLS fails, try HTTP GET on `/v2/` (port 80) — if success, use plain HTTP
3. If both fail, default to strict HTTPS

This eliminates the need for `http://` prefixes or `--insecure` flags.

### Authentication

`image copy` has two independent authentication paths, ordered by priority:

| Priority | Method | Source | Docker Required |
|----------|--------|--------|-----------------|
| 1 (high) | DSN inline credentials | `user:pass@registry.com/repo:tag` | No |
| 2 (low) | Docker credential store | `~/.docker/config.json` | Yes (`docker login`) |

When both point to the same registry, inline credentials override Docker credentials.

**Docker is NOT required.** The command works without Docker installed — `WithDockerCreds`/`WithDockerCerts` skip
silently when `~/.docker/config.json` or `/etc/docker/certs.d` do not exist.

| Scenario | Works? | Notes |
|----------|--------|-------|
| Docker installed, `docker login` done, no inline creds | Yes | Reads `~/.docker/config.json` |
| Docker installed, `docker login` done, with inline creds | Yes | Inline overrides Docker creds |
| No Docker, with inline creds | Yes | Inline creds work independently |
| No Docker, no inline creds, public image | Yes | No auth needed |
| No Docker, no inline creds, private image | No | No credential source, registry returns 401 |
