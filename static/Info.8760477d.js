var O=Object.defineProperty,G=Object.defineProperties;var I=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var A=(e,a,t)=>a in e?O(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,B=(e,a)=>{for(var t in a||(a={}))T.call(a,t)&&A(e,t,a[t]);if(D)for(var t of D(a))$.call(a,t)&&A(e,t,a[t]);return e},F=(e,a)=>G(e,I(a));import{b as R,c as U}from"./department.82777549.js";import{M as P,D as c,a as z}from"./Modal.c7ef67ca.js";import{h as q,k as l,l as f,y as E,C as n,D as o,z as _,L as h,O as d,B as y,q as L,A as H,t as J,r as v,V as k,U as M}from"./element-plus.b05a9d59.js";import K from"./Drawer.ab98cdae.js";import{_ as Q}from"./index.b1bc12a8.js";import"./staff.bf4a4e79.js";const W=(e,a)=>{const{info:t}=J(e),m=v(!1),b=v(!1),p=v({}),u=()=>{a.emit("get-view")};return{drawerVisible:m,modalVisible:b,drawerInfo:p,DepartmentStatus:c,onGetView:u,handleOpenEdit:()=>{m.value=!0,p.value=F(B({},t.value),{departmentPid:""})},handleOpenCAdd:()=>{m.value=!0,p.value={departmentPid:t.value.id,departmentPName:t.value.name}},handleChange:()=>{k.confirm("\u786E\u8BA4\u64CD\u4F5C?","\u63D0\u793A",{confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(async()=>{let i=t.value.status===c.online?c.offline:c.online;await R({id:t.value.id,status:i}),M.success({message:"\u64CD\u4F5C\u6210\u529F",type:"success"}),u()})},handleRemoveManage:async i=>{k.confirm("\u786E\u8BA4\u79FB\u9664?","\u63D0\u793A",{confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(async()=>{await U({departmentId:t.value.id,userId:i.userId,status:z.remove}),u(),M.success({message:"\u64CD\u4F5C\u6210\u529F",type:"success"}),u()})},handleAddManage:()=>{b.value=!0}}},X=q({components:{Drawer:K,Modal:P},props:{info:{type:Object,default:()=>({})},isShow:{type:Boolean,default:!1}},setup(e,a){return B({},W(e,a))}}),Y={class:"justify-between"},Z={key:0},x=d("\u7F16\u8F91\u90E8\u95E8"),ee=d("\u6DFB\u52A0\u5B50\u90E8\u95E8"),ae={class:"justify-between mb-5"},ne=_("span",null,"\u90E8\u95E8\u4E3B\u7BA1",-1),te={key:0},oe=d("\u65B0\u589E\u90E8\u95E8\u4E3B\u7BA1"),ue=d("\u79FB\u9664");function le(e,a,t,m,b,p){const u=l("el-button"),w=l("el-form-item"),C=l("el-col"),V=l("el-row"),g=l("el-form"),s=l("el-table-column"),i=l("el-table"),N=l("el-card"),S=l("Drawer"),j=l("Modal");return f(),E("div",null,[n(N,{class:"mb-5"},{header:o(()=>[_("div",Y,[_("span",null,h(e.info.name),1),e.isShow?y("",!0):(f(),E("div",Z,[n(u,{type:"text",class:"el-button--danger",onClick:e.handleChange},{default:o(()=>[d(h(e.info.status===e.DepartmentStatus.online?"\u7981\u7528\u90E8\u95E8":"\u542F\u7528\u90E8\u95E8"),1)]),_:1},8,["onClick"]),n(u,{type:"primary",plain:"",onClick:e.handleOpenEdit},{default:o(()=>[x]),_:1},8,["onClick"]),n(u,{type:"primary",onClick:e.handleOpenCAdd},{default:o(()=>[ee]),_:1},8,["onClick"])]))])]),default:o(()=>[n(g,{inline:""},{default:o(()=>[n(V,{gutter:20},{default:o(()=>[n(C,{span:12},{default:o(()=>[n(w,{label:"\u90E8\u95E8\u7C7B\u578B:"},{default:o(()=>[d(h(e.info.sysTypeName),1)]),_:1})]),_:1}),n(C,{span:6},{default:o(()=>[n(w,{label:"\u6240\u5C5E\u516C\u53F8:"},{default:o(()=>[d(h(e.info.companyName),1)]),_:1})]),_:1})]),_:1})]),_:1}),_("h3",ae,[ne,e.isShow?y("",!0):(f(),E("div",te,[n(u,{type:"primary",plain:"",onClick:e.handleAddManage},{default:o(()=>[oe]),_:1},8,["onClick"])]))]),n(i,{data:e.info.manage,border:""},{default:o(()=>[n(s,{prop:"userName",label:"\u59D3\u540D",width:"180"}),n(s,{prop:"mobile",label:"\u624B\u673A\u53F7\u7801",width:"180"}),n(s,{prop:"departmentName",label:"\u90E8\u95E8"}),n(s,{prop:"gender",label:"\u6027\u522B"}),n(s,{prop:"invitationTime",label:"\u7533\u8BF7\u65F6\u95F4"}),n(s,{prop:"invitationName",label:"\u9080\u8BF7\u4EBA"}),e.isShow?y("",!0):(f(),L(s,{key:0,label:"\u64CD\u4F5C"},{default:o(r=>[n(u,{size:"mini",type:"text",onClick:()=>e.handleRemoveManage(r.row)},{default:o(()=>[ue]),_:2},1032,["onClick"])]),_:1}))]),_:1},8,["data"])]),_:1}),H(e.$slots,"default"),n(S,{modelValue:e.drawerVisible,"onUpdate:modelValue":a[0]||(a[0]=r=>e.drawerVisible=r),"form-data":e.drawerInfo,onGetView:e.onGetView},null,8,["modelValue","form-data","onGetView"]),n(j,{modelValue:e.modalVisible,"onUpdate:modelValue":a[1]||(a[1]=r=>e.modalVisible=r),info:e.info,onGetView:e.onGetView},null,8,["modelValue","info","onGetView"])])}var fe=Q(X,[["render",le]]);export{fe as default};
