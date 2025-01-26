---
sidebar_position: 14
---

# kubevpn logs

打印 kubevpn 守护进程 gRPC 服务器的日志。它将同时显示 sudo 守护进程和守护进程 gRPC 服务器日志。

## 示例

### 显示 kubevpn 守护进程服务器的日志

```bash
kubevpn logs
```

## 持续输出日志

```shell
kubevpn logs -f
```

## 选项

```text
-f, --follow=false:
   指定是否应该持续输出日志流。
```