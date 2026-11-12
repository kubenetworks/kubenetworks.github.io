---
sidebar_position: 2
---

# Using WSL (Windows Subsystem for Linux) Docker, when using mode `kubevpn run`, can't connect to cluster network, how to solve this problem?

Answer:

This is because WSL's Docker uses Windows's Network, so even if you start a container in WSL, this container will not use WSL network, but use Windows network.

Solutions:

1. Install docker in WSL, instead of using Windows Docker-desktop
2. Use command `kubevpn connect` on Windows, and then start `kubevpn run` in WSL
3. Start a container using command `kubevpn connect` on Windows, and then
   start `kubevpn run --network container:$CONTAINER_ID` in WSL
