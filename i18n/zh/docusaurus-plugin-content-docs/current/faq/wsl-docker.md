---
sidebar_position: 2
---

# 使用 WSL (Windows Subsystem for Linux) Docker 时，使用 `kubevpn run` 模式无法连接集群网络，如何解决此问题？

答：

这是因为 WSL 的 Docker 使用 Windows 的网络，所以即使您在 WSL 中启动容器，此容器也不会使用 WSL 网络，而是使用 Windows 网络。

解决方案：

1. 在 WSL 中安装 docker，而不是使用 Windows Docker-desktop
2. 在 Windows 上使用命令 `kubevpn connect`，然后在 WSL 中启动 `kubevpn run`
3. 在 Windows 上使用命令 `kubevpn connect` 启动一个容器，然后在 WSL 中启动 `kubevpn run --network container:$CONTAINER_ID`
