---
sidebar_position: 7
---

# 在 Linux 上使用 kubevpn 连接 K8s 集群网络后，无法访问互联网了?

## 原因

在 Linux 系统中找不到设置 DNS 的最佳方法，因为 Linux 发行版种类繁多，具有不同的网络管理配置。

## 期望

为 `tun` 设备单独设置 DNS，同时保留您的互联网连接。

## 快速恢复

如果您断开连接后已经失去互联网连接，请先尝试以下步骤：

### 1. 断开所有 KubeVPN 连接

```shell
kubevpn disconnect --all
```

### 2. 检查并恢复您的 DNS 配置

检查当前的 `/etc/resolv.conf`：
```shell
cat /etc/resolv.conf
```

如果它看起来不正确，您可能需要从备份恢复它或重新启动网络管理器：
```shell
# 对于 NetworkManager
sudo systemctl restart NetworkManager

# 对于 systemd-networkd
sudo systemctl restart systemd-networkd

# 或者作为最后的手段重启您的系统
```

## 解决方法

安装并配置工具 `resolvectl` 以正确管理每个链路的 DNS。

### (1) 安装工具 `resolvectl`

`resolvectl` 的软件包信息：

| 操作系统                     | 软件包名称            | 安装命令                           |
|--------------------------|------------------|--------------------------------|
| AlmaLinux                | systemd-resolved | `dnf install systemd-resolved` |
| Arch Linux               | systemd          | `pacman -S systemd`            |
| Debian                   | systemd          | `apt install systemd`          |
| Fedora                   | systemd-resolved | `dnf install systemd-resolved` |
| Red Hat Enterprise Linux | systemd-resolved | `dnf install systemd-resolved` |
| Rocky Linux              | systemd-resolved | `dnf install systemd-resolved` |
| Ubuntu                   | systemd          | `apt install systemd`          |

### (2) 验证安装并启用服务

安装完成后，启用并启动服务：

```shell
sudo systemctl enable systemd-resolved.service
```

```shell
sudo systemctl start systemd-resolved.service
```

验证它正在运行：
```shell
resolvectl status
```

此命令将显示来自解析守护进程的名称解析信息。

### (3) 重启电脑

请重启计算机，这很重要，以确保更改正确生效。

重启后，使用 `kubevpn connect` — 一切应该正常工作，并且在连接到集群时您将保持互联网连接。

## 诊断

如果按照上述步骤操作后仍然有问题，请在打开问题之前收集以下信息：

1. KubeVPN 日志：
   ```shell
   kubevpn logs
   ```

2. 当前 DNS 配置：
   ```shell
   cat /etc/resolv.conf
   resolvectl status
   ```

3. 网络接口：
   ```shell
   ip addr show
   ip route show
   ```

4. 您的 Linux 发行版和版本：
   ```shell
   lsb_release -a
   # 或
   cat /etc/os-release
   ```
