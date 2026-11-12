---
sidebar_position: 7
---

# On Linux, Once use kubevpn connect to k8s cluster network, then lost connection to internet network?

## Reason

There is no optimal method for setting up DNS in the Linux system, as there are numerous types of Linux distributions with different network management configurations.

## Expect

Set up a separate DNS for the `tun` device while preserving your internet connection.

## Quick Recovery

If you've already lost internet connectivity after disconnecting, try these steps first:

### 1. Disconnect all KubeVPN connections

```shell
kubevpn disconnect --all
```

### 2. Check and restore your DNS configuration

Check your current `/etc/resolv.conf`:
```shell
cat /etc/resolv.conf
```

If it looks incorrect, you may need to restore it from backup or restart your network manager:
```shell
# For NetworkManager
sudo systemctl restart NetworkManager

# For systemd-networkd
sudo systemctl restart systemd-networkd

# Or reboot your system as a last resort
```

## Resolve

Install and configure tools `resolvectl` to properly manage per-link DNS.

### (1) Install tools `resolvectl`

Package information for `resolvectl`:

| Operating system         | Package name     | Installation                   |
|--------------------------|------------------|--------------------------------|
| AlmaLinux                | systemd-resolved | `dnf install systemd-resolved` |
| Arch Linux               | systemd          | `pacman -S systemd`            |
| Debian                   | systemd          | `apt install systemd`          |
| Fedora                   | systemd-resolved | `dnf install systemd-resolved` |
| Red Hat Enterprise Linux | systemd-resolved | `dnf install systemd-resolved` |
| Rocky Linux              | systemd-resolved | `dnf install systemd-resolved` |
| Ubuntu                   | systemd          | `apt install systemd`          |

### (2) Verify install and enable service

Once installed, enable and start the service:

```shell
sudo systemctl enable systemd-resolved.service
```

```shell
sudo systemctl start systemd-resolved.service
```

Verify it's running:
```shell
resolvectl status
```

This shows information related to name resolution coming from the resolve daemon.

### (3) Reboot

Please reboot your computer, this is important to ensure the changes take effect properly.

After rebooting, use `kubevpn connect` — everything should work fine and you'll maintain internet connectivity while connected to the cluster.

## Diagnostics

If you still have issues after following the above steps, collect this information before opening an issue:

1. KubeVPN logs:
   ```shell
   kubevpn logs
   ```

2. Current DNS configuration:
   ```shell
   cat /etc/resolv.conf
   resolvectl status
   ```

3. Network interfaces:
   ```shell
   ip addr show
   ip route show
   ```

4. Your Linux distribution and version:
   ```shell
   lsb_release -a
   # or
   cat /etc/os-release
   ```
