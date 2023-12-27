"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[651],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>k});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},b=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=s(n),b=o,k=p["".concat(c,".").concat(b)]||p[b]||m[b]||a;return n?r.createElement(k,l(l({ref:t},u),{},{components:n})):r.createElement(k,l({ref:t},u))}));function k(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=b;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[p]="string"==typeof e?e:o,l[1]=i;for(var s=2;s<a;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}b.displayName="MDXCreateElement"},2257:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>a,metadata:()=>i,toc:()=>s});var r=n(7462),o=(n(7294),n(3905));const a={sidebar_position:1},l="QuickStart",i={unversionedId:"quickstart",id:"quickstart",title:"QuickStart",description:"KubeVPN is Cloud Native Dev Environment, connect to kubernetes cluster network, you can access remote kubernetes cluster network, remote kubernetes cluster service can also access your local service. and more, you can run your kubernetes pod on local Docker container with same environment\u3001volume\u3001and network. you can develop your application on local PC totally.",source:"@site/docs/quickstart.md",sourceDirName:".",slug:"/quickstart",permalink:"/kubevpn-docs/docs/quickstart",draft:!1,editUrl:"https://github.com/KubeNetworks/kubevpn-docs/tree/master/website/docs/docs/quickstart.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"docs",next:{title:"Functions",permalink:"/kubevpn-docs/docs/category/functions"}},c={},s=[{value:"Install from GitHub release",id:"install-from-github-release",level:2},{value:"Install from custom krew index",id:"install-from-custom-krew-index",level:2},{value:"Install from build it manually",id:"install-from-build-it-manually",level:2},{value:"Install bookinfo as demo application",id:"install-bookinfo-as-demo-application",level:2}],u={toc:s},p="wrapper";function m(e){let{components:t,...n}=e;return(0,o.kt)(p,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"quickstart"},"QuickStart"),(0,o.kt)("p",null,"KubeVPN is Cloud Native Dev Environment, connect to kubernetes cluster network, you can access remote kubernetes cluster network, remote kubernetes cluster service can also access your local service. and more, you can run your kubernetes pod on local Docker container with same environment\u3001volume\u3001and network. you can develop your application on local PC totally."),(0,o.kt)("h2",{id:"install-from-github-release"},"Install from GitHub release"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/KubeNetworks/kubevpn/releases/latest"},"LINK")),(0,o.kt)("h2",{id:"install-from-custom-krew-index"},"Install from custom krew index"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"(\n  kubectl krew index add kubevpn https://github.com/KubeNetworks/kubevpn.git && \\\n  kubectl krew install kubevpn/kubevpn && kubectl kubevpn\n)\n")),(0,o.kt)("h2",{id:"install-from-build-it-manually"},"Install from build it manually"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"(\n  git clone https://github.com/KubeNetworks/kubevpn.git && \\\n  cd kubevpn && make kubevpn && ./bin/kubevpn\n)\n\n")),(0,o.kt)("h2",{id:"install-bookinfo-as-demo-application"},"Install bookinfo as demo application"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl apply -f https://raw.githubusercontent.com/KubeNetworks/kubevpn/master/samples/bookinfo.yaml\n")))}m.isMDXComponent=!0}}]);