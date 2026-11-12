---
sidebar_position: 3
---

# After using command `kubevpn run` enter develop mode, but can't access kubernetes api-server, occur error `172.17.0.1:443 connect refused`, how to solve this problem?

Answer:

Maybe k8s network subnet is conflicting with docker subnet.

Solutions:

- Use option `--connect-mode container` to start command `kubevpn run`
- Modify `~/.docker/daemon.json`, add a non-conflicting subnet, eg: `"bip": "172.15.0.1/24"`.

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

Add a non-conflicting subnet, eg: 172.15.0.1/24

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

Restart docker and retry.
