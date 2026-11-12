---
sidebar_position: 1
---

# What should I do if the dependent image cannot be pulled, or the inner environment cannot access ghcr.io?

Answer: here are three solutions to solve this problem

- Solution 1: In the network that can access ghcr.io, transfer the image in the command `kubevpn version` to your own
  private image registry, and then add option `--image` to specify the image when starting the command.
  Example:

``` shell
kubevpn version
```

Look for the `Image:` line in the output, which will show something like `ghcr.io/kubenetworks/kubevpn:v2.x.x` — transfer this image to your private docker registry:

```text
docker pull ghcr.io/kubenetworks/kubevpn:v2.x.x
docker tag ghcr.io/kubenetworks/kubevpn:v2.x.x [docker registry]/[namespace]/[repo]:[tag]
docker push [docker registry]/[namespace]/[repo]:[tag]
```

Then you can use this image, as follows:

```text
kubevpn connect --image [docker registry]/[namespace]/[repo]:[tag]
Starting connect
Detected cluster CIDRs: 172.29.0.0/16, 172.21.0.0/16
...
```

- Solution 2: Use options `--transfer-image`, enable this flag will transfer image from default image to `--image`
  specified address automatically.
  Example

```shell
kubevpn connect --transfer-image --image registry.example.org/kubevpn/kubevpn:latest
Starting connect
Detected cluster CIDRs: 172.29.0.0/16, 172.21.0.0/16 (cached)
Using traffic manager in namespace "default"
Forwarded ports (TCP/UDP/xDS)
Allocated TUN IP 198.18.0.100
Created TUN device "utun4"
Configured DNS
Now you can access resources in the kubernetes cluster !
```

- Solution 3: Use the `kubevpn image copy` command to copy the image to your private registry:

```shell
kubevpn image copy ghcr.io/kubenetworks/kubevpn:latest registry.example.org/kubevpn/kubevpn:latest
```

Then use `--image` to specify the private registry image:

```shell
kubevpn connect --image registry.example.org/kubevpn/kubevpn:latest
```

If your private registry requires authentication, you can create a Kubernetes secret and reference it:

```shell
kubevpn connect --image registry.example.org/kubevpn/kubevpn:latest --image-pull-secret-name my-registry-secret
```
