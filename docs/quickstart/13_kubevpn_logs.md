---
sidebar_position: 13
---

# Kubevpn logs

Print the logs for the kubevpn daemon gRPC server. It will show both the sudo daemon and daemon gRPC server logs.

## Examples

### Show logs for the kubevpn daemon server

```bash
kubevpn logs
```

### follow more log

```shell
kubevpn logs -f
```

# Options

```text
-f, --follow=false:
Specify if the logs should be streamed.
```