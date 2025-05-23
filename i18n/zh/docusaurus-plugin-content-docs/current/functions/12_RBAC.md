---
sidebar_position: 12
---

# RBAC 权限

## 安装 `kubevpn server` 所需的最小 `RBAC` 权限

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: kubevpn-server
rules:
  - apiGroups: [ "" ]
    resources: [ "configmaps" ]
    resourceNames: [ "kubevpn-traffic-manager" ]
    verbs: [ "list", "watch", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "secrets" ]
    resourceNames: [ "kubevpn-traffic-manager" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch", "delete" ]
  - apiGroups: [ "admissionregistration.k8s.io" ]
    resources: [ "mutatingwebhookconfigurations" ]
    verbs: [ "create", "get", "list", "watch" ]
  - apiGroups: [ "", "rbac.authorization.k8s.io" ]
    resources: [ "serviceaccounts", "rolebindings", "roles", "secrets" ]
    verbs: [ "create" ]
  - apiGroups: [ "" ]
    resources: [ "namespaces" ]
    verbs: [ "get", "update" ]
  - apiGroups: [ "", "apps" ]
    resources: [ "statefulsets", "deployments" ]
    verbs: [ "get", "patch", "list" ]
  - apiGroups: [ "" ]
    resources: [ "pods" ]
    verbs: [ "create", "get", "list", "patch", "watch" ]
  - apiGroups: [ "" ]
    resources: [ "configmaps" ]
    verbs: [ "update", "create", "get", "patch" ]
  - apiGroups: [ "" ]
    resources: [ "services" ]
    verbs: [ "get", "list", "create", "patch", "watch" ]
  - apiGroups: [ "" ]
    resources: [ "pods/exec", "pods/portforward" ]
    verbs: [ "create" ]
  - apiGroups: [ "", "metrics.k8s.io" ]
    resources: [ "pods", "pods/log", "endpoints" ]
    verbs: [ "list", "get" ]
```

## `kubevpn client` 客户端的最小访问权限

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubevpn-client
rules:
  - apiGroups: [ "apps", "" ]
    resources: [ "deployments", "services", "pods", "secrets" ]
    verbs: [ "get", "list" ]
  - apiGroups: [ "" ]
    resources: [ "namespaces" ]
    verbs: [ "get" ]
  - apiGroups: [ "" ]
    resources: [ "configmaps" ]
    verbs: [ "update", "get", "list" ]
  - apiGroups: [ "" ]
    resources: [ "pods/portforward" , "pods/exec" ]
    verbs: [ "create" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kubevpn-access-binding
  namespace: YOUR_INSTALLED_NAMESPACE
subjects:
  - kind: ServiceAccount
    name: kubevpn-sa
    namespace: YOUR_INSTALLED_NAMESPACE
roleRef:
  kind: ClusterRole
  name: kubevpn-client
  apiGroup: rbac.authorization.k8s.io
```