---
sidebar_position: 14
---

# kubevpn logs

打印 kubevpn 守护进程 gRPC 服务器的日志。同时显示 sudo 守护进程和用户守护进程的日志。

## 示例

### 显示守护进程日志

```bash
kubevpn logs
```

### 持续输出日志

```shell
kubevpn logs -f
```

### 显示最近 50 行日志

```shell
kubevpn logs -l 50
```

# 选项

```text
-f, --follow=false:
指定是否持续输出日志流

-l, --lines=10:
显示最近日志文件的行数
```
