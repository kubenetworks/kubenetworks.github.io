---
sidebar_position: 1
---

# 全局参数

和 `kubectl options` 支持的参数相同。

```text
--as=''                                 用于操作的用户模拟身份。用户可以是普通用户或命名空间中的服务账户。
--as-group=[]                           用于操作的组模拟身份，此标志可以重复指定多个组。
--as-uid=''                             用于操作的 UID 模拟身份。
--cache-dir='/Users/xxx/.kube/cache'    默认的缓存目录路径。
--certificate-authority=''              证书颁发机构的证书文件路径。
--client-certificate=''                 TLS 客户端证书文件的路径。
--client-key=''                         TLS 客户端密钥文件的路径。
--cluster=''                            使用的 kubeconfig 集群名称。
--context=''                            使用的 kubeconfig 上下文名称。
--disable-compression=false             如果为 true，则对所有发送到服务器的请求禁用响应压缩。
--insecure-skip-tls-verify=false        如果为 true，则不检查服务器的证书有效性。这会使您的 HTTPS 连接不安全。
--kubeconfig=''                         用于 CLI 请求的 kubeconfig 文件路径。
--match-server-version=false            要求服务器版本与客户端版本匹配。
-n, --namespace=''                      当前 CLI 请求的命名空间范围。
--password=''                           API 服务器基本身份验证的密码。
--request-timeout='0'                   放弃单个服务器请求前的等待时间长度。非零值应包含相应的时间单位（例如1s, 2m, 3h）。值为零表示不超时请求。
-s, --server=''                         Kubernetes API服务器的地址和端口。
--tls-server-name=''                    用于服务器证书验证的服务器名称。如果不提供，则使用联系服务器的主机名。
--token=''                              API 服务器身份验证的持有者令牌。
--user=''                               使用的 kubeconfig 用户名称。
--username=''                           API 服务器基本身份验证的用户名。
```