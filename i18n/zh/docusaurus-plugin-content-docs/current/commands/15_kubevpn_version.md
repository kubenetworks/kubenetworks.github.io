---
sidebar_position: 15
---

# kubevpn version

打印客户端版本信息。

## 示例

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

**选项 `--image` 可以覆盖 `Image` 中镜像，使用此镜像启动 `kubevpn-traffic-manager` pod**