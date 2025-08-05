---
sidebar_position: 7
---

# Kubevpn unsync

Remove sync resource

This command is designed to remove sync resources. After using the `kubevpn sync xxx` command, it will generate and
create a new resource in the target k8s cluster with the format `[resource_name]_sync_xxx`. Use this command to remove
these created resources.

# Examples

## Restore proxy resources to origin spec

```shell
kubevpn unsync deployment/authors-sync-108ce
```