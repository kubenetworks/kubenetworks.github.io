---
sidebar_position: 7
---

# Kubevpn remove

Remove clone resource

This command is designed to remove clone resources. After using the `kubevpn clone xxx` command, it will generate and
create a new resource in the target k8s cluster with the format `[resource_name]_clone_xxx`. Use this command to remove
these created resources.

# Examples

## Restore proxy resources to origin spec

```shell
kubevpn remove deployment/authors-clone-645d7
```