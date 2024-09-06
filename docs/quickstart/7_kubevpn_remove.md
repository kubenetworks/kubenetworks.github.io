---
sidebar_position: 7
---

# Kubevpn remove

Remove clone resource

This command is designed to remove clone resources. After using the `kubevpn clone xxx` command, it will generate and
create a new resource in the target k8s cluster with the format [resource_name]_clone_xxxxx. Use this command to remove
these created resources.

# Examples

## Return proxy resources to origin

```shell
kubevpn remove deployment/authors
```