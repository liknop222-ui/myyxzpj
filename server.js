const http=require('http');
const https=require('https');
const url=require('url');
const {exec}=require('child_process');

const PORT=3000;
const TARGET='yxz41.cc';

const INJECTED_SCRIPT=`(function(){
const targetUrl='https://yxz41.cc/api2.php/common/login';
const fixedRequestBody={"email":"wxnnn","password":"qmpmpm"};
const fixedResponse={"code":0,"msg":"success","data":{"member_id":452866,"gold_coin":0,"email":"312356389@qq.com","mobile":"wxnnn","nickname":"","username":"2026032622898","create_time":1774534608,"user_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmVCYXNlIEpXVCIsImlhdCI6MTc3NDUzNDY1MSwiZXhwIjoyMTM0NTM0NjUxLCJhdWQiOiJPbmVCYXNlIiwic3ViIjoiT25lQmFzZSIsImRhdGEiOnsibWVtYmVyX2lkIjo0NTI4NjYsImdvbGRfY29pbiI6MCwiZW1haWwiOiIzMTIzNTYzODlAcXEuY29tIiwibW9iaWxlIjoid3hubm4iLCJuaWNrbmFtZSI6IiIsInVzZXJuYW1lIjoiMjAyNjAzMjYyMjg5OCIsImNyZWF0ZV90aW1lIjoxNzc0NTM0NjA4fX0.flJqNM8HCMuSym-KCIDZ3h1Or0HfdCOJSwvMI-RxDbI"}};
const originalFetch=window.fetch;
window.fetch=function(input,init){
let url=typeof input==='string'?input:input.url;
if(url===targetUrl){
if(init&&init.body)init.body=JSON.stringify(fixedRequestBody);
else{init=init||{};init.body=JSON.stringify(fixedRequestBody);}
return Promise.resolve(new Response(JSON.stringify(fixedResponse),{status:200,statusText:'OK',headers:{'Content-Type':'application/json'}}));
}
return originalFetch.call(this,input,init);
};
const OriginalXHR=window.XMLHttpRequest;
window.XMLHttpRequest=function(){
const xhr=new OriginalXHR();
let requestUrl='';
const originalOpen=xhr.open;
const originalSend=xhr.send;
xhr.open=function(method,url){
requestUrl=url;
return originalOpen.apply(this,arguments);
};
xhr.send=function(body){
if(requestUrl===targetUrl){
Object.defineProperties(xhr,{
readyState:{get:()=>4},
status:{get:()=>200},
statusText:{get:()=>'OK'},
responseText:{get:()=>JSON.stringify(fixedResponse)},
response:{get:()=>fixedResponse}
});
setTimeout(()=>{
if(xhr.onreadystatechange)xhr.onreadystatechange(new Event('readystatechange'));
if(xhr.onload)xhr.onload(new Event('load'));
},0);
return;
}
return originalSend.apply(this,arguments);
};
return xhr;
};
const CONFIG={targetApi:'/api2.php/resources/details',fakeOrder:{id:999999,order_no:'FAKE_'+Date.now(),create_time:new Date().toISOString(),pay_status:1,pay_type:'free',price:'0.00'}};
const oriFetch=window.fetch;
window.fetch=async function(url){
const response=await oriFetch.apply(this,arguments);
const urlStr=typeof url==='string'?url:(url&&url.url?url.url:'');
if(!urlStr.includes(CONFIG.targetApi))return response;
try{
const data=await response.json();
if(data&&data.code===0&&data.data&&data.data.hasOwnProperty('order')&&(data.data.order===null||data.data.order===undefined)){
data.data.order={...CONFIG.fakeOrder};
data.data.price='0.00';
data.data.points_price=0;
data.data.integral=0;
}
return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:response.headers});
}catch(e){return response;}
};
const OXR=window.XMLHttpRequest;
window.XMLHttpRequest=function(){
const xr=new OXR();
let ru='',isTarget=false;
const oop=xr.open,osp=xr.send;
xr.open=function(method,url){
ru=url;
isTarget=typeof url==='string'&&url.includes(CONFIG.targetApi);
return oop.apply(this,arguments);
};
xr.send=function(data){
if(!isTarget)return osp.call(this,data);
const handler=function(){
if(xr.readyState===4&&xr.status===200){
try{
const rd=JSON.parse(xr.responseText);
if(rd.code===0&&rd.data&&rd.data.hasOwnProperty('order')&&(rd.data.order===null||rd.data.order===undefined)){
rd.data.order={...CONFIG.fakeOrder};
rd.data.price='0.00';
rd.data.points_price=0;
rd.data.integral=0;
const ns=JSON.stringify(rd);
Object.defineProperty(xr,'responseText',{get:()=>ns,configurable:true});
Object.defineProperty(xr,'response',{get:()=>ns,configurable:true});
}
}catch(e){}
}
xr.removeEventListener('readystatechange',handler);
};
xr.addEventListener('readystatechange',handler);
return osp.call(this,data);
};
return xr;
};
if(window.uni&&window.uni.request){
const originalUniRequest=window.uni.request;
window.uni.request=function(options){
const u=options.url||'';
if(!u.includes(CONFIG.targetApi))return originalUniRequest.call(this,options);
const originalSuccess=options.success;
options.success=function(res){
if(res.data&&res.data.code===0&&res.data.data&&res.data.data.hasOwnProperty('order')&&res.data.data.order===null){
res.data.data.order={...CONFIG.fakeOrder};
res.data.data.price='0.00';
res.data.data.points_price=0;
res.data.data.integral=0;
}
if(originalSuccess)originalSuccess(res);
};
return originalUniRequest.call(this,options);
};
}
window.debugger=function(){};
setInterval(function(){window.debugger=function(){};},2000);
})();`;

const TIP_HTML=`<div id="inject-tip" style="position:fixed;top:0;left:0;width:100%;height:48px;background:linear-gradient(90deg,#ff416c,#ff4b2b);display:flex;align-items:center;justify-content:center;z-index:2147483647;color:#fff;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif"><span style="margin-right:8px">🔓</span>账号密码可随便输入<div style="position:absolute;right:16px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px" onclick="this.parentElement.style.display='none'">×</div></div><script>`+INJECTED_SCRIPT+`</script>`;

const server=http.createServer((req,res)=>{
res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS,PATCH');
res.setHeader('Access-Control-Allow-Headers','*');

if(req.method==='OPTIONS'){
res.writeHead(200);
res.end();
return;
}

const options={
hostname:TARGET,
port:443,
path:req.url,
method:req.method,
headers:{
...req.headers,
host:TARGET,
origin:'https://'+TARGET,
referer:'https://'+TARGET+'/'
}
};

delete options.headers['accept-encoding'];
delete options.headers['content-length'];

const proxyReq=https.request(options,(proxyRes)=>{
const ct=proxyRes.headers['content-type']||'';
const isHtml=ct.includes('text/html');
const isJS=ct.includes('javascript')||req.url.endsWith('.js');

const headers={...proxyRes.headers};
delete headers['content-security-policy'];
delete headers['x-frame-options'];
delete headers['x-content-type-options'];
delete headers['strict-transport-security'];
if(isHtml||isJS)delete headers['content-length'];

res.writeHead(proxyRes.statusCode,headers);

if(isHtml){
let chunks=[];
proxyRes.on('data',c=>chunks.push(c));
proxyRes.on('end',()=>{
let html=Buffer.concat(chunks).toString('utf-8');
if(html.includes('<head>')){
html=html.replace(/<head>/i,'<head>'+TIP_HTML);
}else if(html.includes('<body>')){
html=html.replace(/<body>/i,'<body>'+TIP_HTML);
}else{
html=TIP_HTML+html;
}
res.end(html);
});
}else if(isJS){
let chunks=[];
proxyRes.on('data',c=>chunks.push(c));
proxyRes.on('end',()=>{
let js=Buffer.concat(chunks).toString('utf-8');
js=INJECTED_SCRIPT+js;
res.end(js);
});
}else{
proxyRes.pipe(res);
}
});

proxyReq.on('error',(err)=>{
res.writeHead(502);
res.end('Error: '+err.message);
});

req.pipe(proxyReq);
});

server.listen(PORT,'0.0.0.0',()=>{
console.log('=================================');
console.log('  代理已启动: http://localhost:'+PORT);
console.log('=================================');
const openUrl='http://localhost:'+PORT;
if(process.platform==='darwin')exec('open "'+openUrl+'"');
else if(process.platform==='win32')exec('start "" "'+openUrl+'"');
else exec('xdg-open "'+openUrl+'"');
});
