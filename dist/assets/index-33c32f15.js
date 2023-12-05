/* empty css             */import{E as i}from"./el-card-995605f8.js";import{d as _,c as p,e as h,f as s,w as t,h as e,i as r,bL as u,p as m,k as x,_ as g}from"./index-84bec190.js";const o=d=>(m("data-v-6dc19752"),d=d(),x(),d),v=o(()=>e("div",{class:"card-header"},"从源码构建",-1)),b=o(()=>e("span",null,"您可以从源码构建 PhoenixBuilder 以使用。",-1)),f=o(()=>e("div",{class:"card-header"},"下载预构建版本",-1)),k=o(()=>e("div",null,[e("span",null,"我们也为每个稳定版本提供了预先构建好的二进制文件供您使用，点击以下链接以查看。"),e("p",{style:{"margin-top":"16px"}},[e("a",{style:{"white-space":"normal","word-wrap":"break-word"},href:"https://github.com/LNSSPsd/PhoenixBuilder/releases/latest",target:"_blank"},"https://github.com/LNSSPsd/PhoenixBuilder/releases/latest ")])],-1)),w=o(()=>e("div",{class:"card-header"},"更改验证服务器",-1)),y=o(()=>e("span",null,"您可能需要在启动客户端程序时添加额外参数来使用我们的服务",-1)),P=_({__name:"index",setup(d){let c=`git clone git@github.com:LNSSPsd/PhoenixBuilder.git

cd PhoenixBuilder

make current

# 初次使用在执行完一次 make 后执行下面的命令
sed "s/urrentProtocol byte = 10/urrentProtocol byte = 8/g"~/go/pkg/mod/github.com/sandertv/go-raknet@v1.9.1/conn.go 

make current

./build/phoenixbuilder`,l=`./phoenixbuilder -A https://liliya233.uk

./windows-amd64.exe -A https://liliya233.uk`;return(S,B)=>{const n=u,a=i;return p(),h("div",null,[s(a,{shadow:"hover"},{header:t(()=>[v]),default:t(()=>[e("div",null,[b,s(n,{code:r(c),type:"bash"},null,8,["code"])])]),_:1}),s(a,{style:{"margin-top":"12px"},shadow:"hover"},{header:t(()=>[f]),default:t(()=>[k]),_:1}),s(a,{style:{"margin-top":"12px"},shadow:"hover"},{header:t(()=>[w]),default:t(()=>[e("div",null,[y,s(n,{code:r(l),type:"bash"},null,8,["code"])])]),_:1})])}}});const C=g(P,[["__scopeId","data-v-6dc19752"]]);export{C as default};
