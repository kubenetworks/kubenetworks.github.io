---
sidebar_position: 1
---

# Security

This document covers security considerations, permissions, and best practices when using KubeVPN.

## Local Permissions

KubeVPN requires elevated privileges for certain operations:

- **TUN device creation**: Creating a virtual network interface requires root/administrator privileges
- **Routing table management**: Modifying system routes to route cluster traffic through the TUN device
- **DNS configuration**: Updating system DNS settings to resolve cluster domains

On first use, KubeVPN will request privilege escalation (sudo on macOS/Linux, UAC on Windows) to set up these components. The daemon process runs with elevated privileges to maintain the network connection, while the CLI itself runs unprivileged after the initial setup.

## Cluster RBAC

KubeVPN uses the Kubernetes RBAC (Role-Based Access Control) system. The required permissions are:

- Read/write ConfigMaps (for IPAM allocation and Envoy configuration)
- Read/write Secrets (for TLS certificate management)
- Read/write Deployments (for traffic manager deployment)
- Read pods/namespaces/services (for discovery and injection)
- Create pods (for sidecar injection)
- Patch pods (for unpatching when leaving)

The traffic manager runs with its own service account and limited permissions, not with cluster admin privileges unless explicitly configured.

## Network & DNS

- **TUN Device**: KubeVPN creates an isolated TUN device that only routes traffic to/from the Kubernetes cluster
- **DNS Isolation**: Cluster DNS queries are routed through the cluster, while other DNS queries continue using the system resolver (except on Linux where `resolvectl` sets per-link DNS)
- **Traffic Encryption**: All data-plane traffic between the client and cluster is encrypted via TLS with obfuscation enabled by default (see [Obfuscation](https://github.com/kubenetworks/kubevpn/blob/master/docs/54-traffic-obfuscation.md))

## Sidecar Capabilities

When injecting sidecars, KubeVPN uses a privileged security context with:

- `NET_ADMIN`: For iptables rules when routing traffic through the proxy
- `NET_RAW`: For ICMP/ping functionality
- `privileged: true`: To write to `/proc/sys/net/ipv4/ip_forward` and related sysctls at startup
- `RunAsUser: 0`, `RunAsGroup: 0`: Runs as root

This is required for the VPN sidecar to function properly. For shared clusters, consider the security implications carefully.

## Shared Cluster Best Practices

When using KubeVPN on a shared cluster:

1. **Use dedicated namespaces**: Create a specific namespace for KubeVPN (e.g., `kubevpn`) instead of using `default`
2. **Limit permissions**: Use Kubernetes RBAC to restrict what KubeVPN can do in other namespaces
3. **Audit activity**: Monitor pod creations/updates/deletions in the cluster
4. **Clean up properly**: Always use `kubevpn leave` and `kubevpn disconnect` instead of killing the process to ensure resources are cleaned up
5. **Avoid production clusters**: Prefer staging or development clusters for daily development

## Minimal Permissions & Cleanup

KubeVPN is designed to:

- Use your existing kubeconfig for cluster access
- Clean up proxy/sync resources (pods, configmaps, secrets) when using `kubevpn leave`
- Clean up local network resources when using `kubevpn disconnect`
- Not run persistent cluster-wide components except the traffic manager (which can be uninstalled with `kubevpn uninstall`)
- Use ephemeral TLS certificates that rotate automatically

For DNS troubleshooting, see:
- [Linux DNS](../faq/linux-dns.md)
- [Windows VMP](../faq/windows-vmp.md)

## Implementation Details

For deeper technical understanding:

- [Data-Plane Stream Obfuscation & TLS Enforcement](https://github.com/kubenetworks/kubevpn/blob/master/docs/54-traffic-obfuscation.md)
- [Traffic Manager Architecture](https://github.com/kubenetworks/kubevpn/blob/master/docs/01-traffic-manager.md)
