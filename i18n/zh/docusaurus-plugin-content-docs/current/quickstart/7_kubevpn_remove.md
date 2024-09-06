---
sidebar_position: 7
---

# kubevpn remove

删除克隆资源

这个命令被设计用来删除克隆资源。在使用了 `kubevpn clone xxx` 命令后，它会在目标 k8s
集群中创建一个名称格式为 `[resource_name]_clone_xxxxx` 的新资源，使用这个命令可以删除这些创建的资源。

# 示例

## 将代理资源恢复到原始状态

```shell
kubevpn remove deployment/authors
```