---
sidebar_position: 3
---

# 使用命令 `kubevpn run` 进入开发模式后，但无法访问 kubernetes api-server，出现错误 `172.17.0.1:443 connect refused`，如何解决此问题？

答：

可能是 k8s 网络子网与 docker 子网冲突。

解决方案：

- 使用选项 `--connect-mode container` 来启动命令 `kubevpn run`
- 修改 `~/.docker/daemon.json`，添加一个不冲突的子网，例如：`"bip": "172.15.0.1/24"`。

```shell
cat ~/.docker/daemon.json
```

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "features": {
    "buildkit": true
  },
  "insecure-registries": []
}
```

添加一个不冲突的子网，例如：172.15.0.1/24

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "features": {
    "buildkit": true
  },
  "insecure-registries": [],
  "bip": "172.15.0.1/24"
}
```

重启 docker 并重试。
