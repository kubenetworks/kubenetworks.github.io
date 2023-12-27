"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[88],{3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>m});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},l=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(t),f=o,m=u["".concat(c,".").concat(f)]||u[f]||d[f]||i;return t?r.createElement(m,a(a({ref:n},l),{},{components:t})):r.createElement(m,a({ref:n},l))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=f;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s[u]="string"==typeof e?e:o,a[1]=s;for(var p=2;p<i;p++)a[p]=t[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},403:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var r=t(7462),o=(t(7294),t(3905));const i={sidebar_position:4},a="Reverse proxy",s={unversionedId:"functions/reverse_proxy",id:"functions/reverse_proxy",title:"Reverse proxy",description:"",source:"@site/docs/functions/reverse_proxy.md",sourceDirName:"functions",slug:"/functions/reverse_proxy",permalink:"/kubevpn-docs/docs/functions/reverse_proxy",draft:!1,editUrl:"https://github.com/KubeNetworks/kubevpn-docs/tree/master/website/docs/docs/functions/reverse_proxy.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"functions",previous:{title:"Short Domain resolve",permalink:"/kubevpn-docs/docs/functions/short_domain_resolve"},next:{title:"Reverse proxy with mesh",permalink:"/kubevpn-docs/docs/functions/reverse_proxy_with_mesh"}},c={},p=[],l={toc:p},u="wrapper";function d(e){let{components:n,...t}=e;return(0,o.kt)(u,(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"reverse-proxy"},"Reverse proxy"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},'\u279c  ~ kubevpn proxy deployment/productpage\ngot cidr from cache\ntraffic manager not exist, try to create it...\npod [kubevpn-traffic-manager] status is Running\nContainer     Reason           Message\ncontrol-plane ContainerRunning\nvpn           ContainerRunning\nwebhook       ContainerRunning\n\nupdate ref count successfully\nWaiting for deployment "productpage" rollout to finish: 1 out of 2 new replicas have been updated...\nWaiting for deployment "productpage" rollout to finish: 1 out of 2 new replicas have been updated...\nWaiting for deployment "productpage" rollout to finish: 1 out of 2 new replicas have been updated...\nWaiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...\nWaiting for deployment "productpage" rollout to finish: 1 old replicas are pending termination...\ndeployment "productpage" successfully rolled out\nport forward ready\nyour ip is 223.254.0.101\ntunnel connected\ndns service ok\n\n---------------------------------------------------------------------------\n    Now you can access resources in the kubernetes cluster, enjoy it :)\n---------------------------------------------------------------------------\n\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},'package main\n\nimport (\n    "io"\n    "net/http"\n)\n\nfunc main() {\n    http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {\n        _, _ = io.WriteString(writer, "Hello world!")\n    })\n    _ = http.ListenAndServe(":9080", nil)\n}\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"\u279c  ~ curl productpage:9080\nHello world!%\n\u279c  ~ curl productpage.default.svc.cluster.local:9080\nHello world!%\n")))}d.isMDXComponent=!0}}]);