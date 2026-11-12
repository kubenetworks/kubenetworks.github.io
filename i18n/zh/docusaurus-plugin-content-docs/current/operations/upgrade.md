---
sidebar_position: 2
---

# 升级

本文档介绍 KubeVPN 的升级，包括客户端升级、流量管理器升级和混合版本部署的注意事项。

## 客户端升级

KubeVPN 包含内置升级命令，可将客户端更新到最新版本：

```shell
kubevpn upgrade
```

此命令将：
1. 检查 GitHub 上的最新版本
2. 如果有可用升级，下载新二进制文件
3. 退出所有运行中的守护进程
4. 用新版本原子替换当前二进制文件
5. 使用新版本重启守护进程

如果安装目录不可写，它会在继续之前请求权限提升。

## 客户端与流量管理器版本兼容性

KubeVPN 在连接时使用版本协商协议：

- **较新客户端 + 较旧管理器**：客户端将自动升级集群中的流量管理器
- **较旧客户端 + 较新管理器**：不推荐这样做，可能会导致连接问题（混合版本部署请见下文）

通常，最好保持客户端和流量管理器版本一致。流量管理器部署由连接的客户端管理，因此当多个客户端使用同一个集群时，最后连接的客户端版本决定了流量管理器的版本。

## 混淆混合版本部署

从没有混淆的版本升级到有混淆的版本（较新版本默认启用）时，需要特别注意：

:::warning
没有混淆代码的旧客户端连接到新管理器时，发送的是纯文本帧，而新管理器会尝试对其进行 XOR 解码 — 连接会变得乱码，看门狗会不断重连。
:::

### 部署期间的缓解措施

在仍有旧客户端在使用时，暂时禁用流量管理器 Secret 中的混淆：

```shell
kubectl edit secret -n kubevpn kubevpn
```

添加条目：
```yaml
data:
  KUBEVPN_OBFUSCATE: "MA=="  # base64 编码的 "0"
```

或者通过命令：
```shell
kubectl patch secret -n kubevpn kubevpn --patch '{"data":{"KUBEVPN_OBFUSCATE":"MA=="}}'
```

所有客户端升级完成后，移除此条目以重新启用混淆。

### TLS Secret 轮换注意事项

流量管理器 Secret 在升级时会重新生成。手动添加的 `KUBEVPN_OBFUSCATE=0` 条目在轮换期间会丢失，必须重新应用。由于默认启用混淆，丢失选择退出条目会默默重新启用混淆。

## 回滚

如果升级后遇到问题：

1. 首先尝试断开并重新连接：
   ```shell
   kubevpn disconnect --all
   kubevpn connect
   ```

2. 如果问题仍然存在，请从 [GitHub Releases](https://github.com/kubenetworks/kubevpn/releases) 下载以前的版本并手动安装。

3. 要回滚流量管理器，请使用所需的旧客户端版本连接 — 它会自动降级流量管理器部署。

## 故障排除

常见的升级问题和解决方案：

| 问题 | 解决方案 |
|------|----------|
| `kubevpn upgrade` 期间权限被拒绝 | 使用 sudo 运行（Linux/macOS）或确保二进制目录可写 |
| 管理器升级后旧客户端无法连接 | 使用上述缓解措施暂时禁用混淆 |
| 升级后守护进程无法启动 | 杀死所有剩余的守护进程并重试：`pkill -9 kubevpn` |
| 二进制文件损坏 | 重新下载二进制文件并验证其校验和 |

## 实现细节

深入的技术理解：

- [客户端自我升级](https://github.com/kubenetworks/kubevpn/blob/master/docs/33-client-upgrade.md)
- [数据平面流混淆与 TLS 强制执行](https://github.com/kubenetworks/kubevpn/blob/master/docs/54-traffic-obfuscation.md)
