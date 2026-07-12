---
sidebar_position: 14
---

# Kubevpn logs

Print the logs for the kubevpn daemon gRPC server. It will show both the sudo daemon and user daemon gRPC server logs.

## Examples

### Show logs for the kubevpn daemon server

```bash
kubevpn logs
```

### Follow more logs

```shell
kubevpn logs -f
```

### Show recent 50 lines of log

```shell
kubevpn logs -l 50
```

# Options

```text
-f, --follow=false:
Specify if the logs should be streamed.

-l, --lines=10:
Lines of recent log file to display.
```
