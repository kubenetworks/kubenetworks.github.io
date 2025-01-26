---
sidebar_position: 16
---

# Kubevpn version

Print the client version information.

## Example

```shell
kubevpn version
```

```text
KubeVPN: CLI
    Version: v2.2.17
    Daemon: v2.2.17
    Image: docker.io/naison/kubevpn:v2.2.17
    Branch: master
    Git commit: ac918b5
    Built time: 2024-09-03 20:31:08
    Built OS/Arch: darwin/arm64
    Built Go version: go1.22.6
```

**Options `--image` can overwrite `Image` value, use this image to start up `kubevpn-traffic-manager` pod**