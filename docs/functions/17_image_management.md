---
sidebar_position: 17
---

# Image management

kubevpn provides image management commands for copying and re-tagging container images across registries. The
implementation is based on [regclient](https://github.com/regclient/regclient), supporting efficient layer-level
transfer, DSN-style inline credentials, and automatic TLS detection.

## Copy an image

Copy an image between registries. Only pulls layers that don't exist at the target. In the same registry, it attempts
to mount layers between repositories:

```shell
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest registry.example.org/kubevpn/kubevpn:latest
```

## Re-tag an image

Within the same repository, re-tagging only sends the manifest with the new tag:

```shell
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest ghcr.io/kubenetworks/kubevpn:v2.3.4
```

## DSN-style inline credentials

You can embed username and password directly in the image reference, eliminating the need for `docker login`:

```shell
kubevpn image copy admin:secret@registry-a.local:5000/repo:v1 admin:secret@registry-b.example.com/repo:v1
```

The format is:

```text
[user[:password]@]registry[:port]/namespace/repo[:tag|@digest]
```

Examples:

| Reference | Parsed As |
|-----------|-----------|
| `ghcr.io/kubenetworks/kubevpn:latest` | No credentials, standard ref |
| `admin:secret@registry.example.com/repo:v1` | User `admin`, password `secret` |
| `admin@registry.example.com/repo:v1` | User `admin`, no password |
| `user:pass@registry.com/repo@sha256:abcd...` | Credentials + digest ref |

Inline credentials take precedence over Docker credential store for the same registry.

## Automatic TLS detection

When inline credentials are provided, the registry's TLS support is probed automatically:

1. **HTTPS probe**: Try TLS handshake on port 443 — if success, use HTTPS (auto-handles self-signed certs)
2. **HTTP fallback**: If TLS fails, try HTTP GET on `/v2/` — if success, use plain HTTP
3. **Default**: If both fail, default to strict HTTPS

This eliminates the need for `http://` prefixes or `--insecure` flags. Private registries with self-signed
certificates and plain HTTP registries both work out of the box.

## Docker dependency

**`image copy` does NOT require Docker.** It works on machines without Docker installed.

Two independent authentication paths, by priority:

| Priority | Method | Source | Docker Required |
|----------|--------|--------|-----------------|
| 1 (high) | DSN inline credentials | `user:pass@registry.com/repo:tag` | No |
| 2 (low) | Docker credential store | `~/.docker/config.json` | Yes (`docker login`) |

When Docker is not installed, `WithDockerCreds`/`WithDockerCerts` skip silently — no error, no blocking. DSN inline
credentials work through a completely independent path with no Docker coupling.

| Scenario | Works? |
|----------|--------|
| No Docker, with inline creds | Yes |
| No Docker, no creds, public image | Yes |
| No Docker, no creds, private image | No (401) |
| Docker installed, `docker login` done | Yes |
| Docker + inline creds (same registry) | Yes (inline wins) |

When Docker is available, credentials are read from `~/.docker/config.json` automatically:

```shell
docker login registry.example.org
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest registry.example.org/kubevpn/kubevpn:latest
```

## Transfer image to private registry

When your cluster uses a private registry, use `--transfer-image` with connect/proxy/run commands to automatically
copy the kubevpn image:

```shell
kubevpn connect --transfer-image --image registry.example.org/kubevpn/kubevpn:latest
```

If your private registry requires authentication for pulling images in Kubernetes, create a pull secret and reference
it:

```shell
kubevpn connect --image registry.example.org/kubevpn/kubevpn:latest --image-pull-secret-name my-registry-secret
```

`--transfer-image` and `--image-pull-secret-name` are flags of the `connect` / `proxy` / `run`
commands (they govern how Kubernetes pulls the kubevpn image). They are **not** flags of
`kubevpn image copy` — that command authenticates via DSN inline credentials or the Docker
credential store instead (see above).

![image_copy](img/image_copy.svg)
