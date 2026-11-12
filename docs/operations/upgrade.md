---
sidebar_position: 2
---

# Upgrade

This document covers upgrading KubeVPN, including client upgrades, traffic manager upgrades, and mixed-version rollout considerations.

## Client Upgrade

KubeVPN includes a built-in upgrade command to update the client to the latest version:

```shell
kubevpn upgrade
```

This command will:
1. Check for the latest release on GitHub
2. Download the new binary if an upgrade is available
3. Quit any running daemons
4. Atomically replace the current binary with the new one
5. Restart the daemons with the new version

If the install directory is not writable, it will request privilege escalation before proceeding.

## Client & Traffic Manager Version Compatibility

KubeVPN uses a version negotiation protocol at connect time:

- **Newer client + Older manager**: The client will automatically upgrade the traffic manager in the cluster
- **Older client + Newer manager**: This is not recommended and may result in connection issues (see below for mixed-version rollout)

Generally, it's best to keep the client and traffic manager versions aligned. The traffic manager deployment is managed by the connecting client, so when multiple clients use the same cluster, the last connecting client's version determines the traffic manager version.

## Obfuscation Mixed-Version Rollout

When upgrading from a version without obfuscation to a version with obfuscation (enabled by default in newer versions), special care is needed:

:::warning
An old client (without obfuscation code) connecting to a new manager sends plaintext frames that the new manager tries to XOR-decode — the connection becomes garbled and the watchdog reconnect-loops.
:::

### Mitigation During Rollout

Temporarily disable obfuscation in the traffic-manager Secret while old clients are still in use:

```shell
kubectl edit secret -n kubevpn kubevpn
```

Add the entry:
```yaml
data:
  KUBEVPN_OBFUSCATE: "MA=="  # base64 for "0"
```

Or via:
```shell
kubectl patch secret -n kubevpn kubevpn --patch '{"data":{"KUBEVPN_OBFUSCATE":"MA=="}}'
```

Once all clients are upgraded, remove this entry to re-enable obfuscation.

### TLS Secret Rotation Caveat

The traffic-manager Secret is regenerated on upgrade. A manually added `KUBEVPN_OBFUSCATE=0` entry will be lost during rotation and must be re-applied. With obfuscation on by default, losing the opt-out entry silently re-enables obfuscation.

## Rolling Back

If you encounter issues after upgrading:

1. First try disconnecting and reconnecting:
   ```shell
   kubevpn disconnect --all
   kubevpn connect
   ```

2. If the issue persists, download the previous version from [GitHub Releases](https://github.com/kubenetworks/kubevpn/releases) and install it manually.

3. To roll back the traffic manager, connect with the desired older client version — it will automatically downgrade the traffic manager deployment.

## Troubleshooting

Common upgrade issues and solutions:

| Issue | Solution |
|-------|----------|
| Permission denied during `kubevpn upgrade` | Run with sudo (Linux/macOS) or ensure the binary directory is writable |
| Old client can't connect after manager upgrade | Use the mitigation above to temporarily disable obfuscation |
| Daemon won't start after upgrade | Kill any leftover daemon processes and try again: `pkill -9 kubevpn` |
| Binary corruption | Re-download the binary and verify its checksum |

## Implementation Details

For deeper technical understanding:

- [Client Self-Upgrade](https://github.com/kubenetworks/kubevpn/blob/master/docs/33-client-upgrade.md)
- [Data-Plane Stream Obfuscation & TLS Enforcement](https://github.com/kubenetworks/kubevpn/blob/master/docs/54-traffic-obfuscation.md)
