---
sidebar_position: 1
---

# Global options

same as `kubectl options`。

```text
--as=''                               Specifies the username to impersonate for the operation. This could be a regular user or a service account in a namespace.
--as-group=[]                         Indicates the group to impersonate for the operation. This flag can be repeated to specify multiple groups.
--as-uid=''                           Defines the UID to impersonate for the operation.
--cache-dir='/Users/xxx/.kube/cache'  Set the default cache directory.
--certificate-authority=''            Path to a certificate file for the certificate authority.
--client-certificate=''               Path to a client certificate file for TLS.
--client-key=''                       Path to a client key file for TLS.
--cluster=''                          Determines the name of the kubeconfig cluster to use.
--context=''                          Specifies the name of the kubeconfig context to use.
--disable-compression=false           If true, disables response compression for all requests to the server.
--insecure-skip-tls-verify=false      If true, skips checking the server's certificate for validity, making HTTPS connections insecure.
--kubeconfig=''                       Path to the kubeconfig file to use for CLI requests.
--match-server-version=false          Ensures the server version matches the client version.
-n, --namespace=''                    Defines the namespace scope for this CLI request.
--password=''                         Password for basic authentication to the API server.
--request-timeout='0'                 Sets the amount of time to wait before giving up on a server request, with non-zero values specifying a time unit.
-s, --server=''                       The address and port of the Kubernetes API server.
--tls-server-name=''                  Server name used for server certificate validation; if not provided, the hostname used to contact the server is used.
--token=''                            Bearer token for authentication to the API server.
--user=''                             Name of the kubeconfig user to use.
--username=''                         Username for basic authentication to the API server.
```