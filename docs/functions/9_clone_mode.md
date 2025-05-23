---
sidebar_position: 9
---

# Clone mode

Run cloned deployment in same cluster, and cooperate with the service mesh to intercept the traffic
with the specified header or all the traffic to the clone deployment.

```shell
➜  ~ kubevpn clone deployment/authors -c authors --headers foo=bar --sync ~/GolandProjects/bookinfo-authors:/app/code
Starting connect
Got network CIDR from cache
Use exist traffic manager
Forwarding port...
Forwarding from 127.0.0.1:51744 -> 10800
Forwarding from [::1]:51744 -> 10800
Forwarding from 127.0.0.1:51745 -> 10801
Forwarding from [::1]:51745 -> 10801
Forwarding from 127.0.0.1:51746 -> 10802
Forwarding from [::1]:51746 -> 10802
Connected tunnel
Handling connection for 51744
Adding route...
Configuring DNS service...
Configured DNS service
Clone workloads...
Clone workload deployment/authors
Defaulted container "authors" out of: nginx, authors
Create clone resource Deployment.apps/authors-clone-108ce in target cluster
Wait for clone resource Deployment.apps/authors-clone-108ce to be ready

Pod authors-clone-108ce-6fc847b4c9-zjxlm is Pending...
Container Reason Message

Pod authors-clone-108ce-6fc847b4c9-zjxlm is Pending...
Type Reason Message

Pod authors-clone-108ce-6fc847b4c9-zjxlm is Pending...
Container Reason            Message
authors   ContainerCreating
nginx     ContainerCreating
syncthing ContainerCreating
vpn       ContainerCreating

Pod authors-clone-108ce-6fc847b4c9-zjxlm is Running...
Container Reason           Message
authors   ContainerRunning
nginx     ContainerRunning
syncthing ContainerRunning
vpn       ContainerRunning

Checking rollout status for deployment/authors
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "authors" rollout to finish: 1 old replicas are pending termination...
Rollout successfully for deployment/authors
Access the syncthing GUI via the following URL: http://127.0.0.1:51766
+----------------------------------------------------------+
| Now you can access resources in the kubernetes cluster ! |
+----------------------------------------------------------+%
➜  ~
```

Use `kubevpn status` to display status

```shell
➜  ~ kubevpn status
ID    Mode   Cluster                 Kubeconfig                                 Namespace    Status      Netif
0     full   ccdpol3fqtofinnpvv720   /Users/naison/.kube/vke                    default      Connected   utun6

ID    Name                       Headers   IP             PortMap             CurrentPC
0     deployments.apps/authors   foo=bar   198.19.0.107   9080->9080,80->80   false

ID    Name                 Headers   ToName                ToKubeconfig              ToNamespace   SyncthingGUI
0     deployment/authors   foo=bar   authors-clone-108ce   /Users/naison/.kube/vke   default       http://127.0.0.1:51766
➜  ~
```

You can use browser to open `SyncthingGUI` address `http://127.0.0.1:51766`

![syncthing](img/syncthing.png)

- After synchronize process finished, all local code synced to k8s `deployment/authors-clone-108ce`
- You can start up application in this pod manually
- All traffic with header `foo=bar` will hit `deployment/authors-clone-108ce`, other traffic will hit origin
  `deployment/authors`