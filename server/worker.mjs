// ASSETS is embedded at build time. Credentials only come from runtime secrets.
const TTL=7*24*60*60;
const encoder=new TextEncoder();
const failures=new Map();
const baseHeaders={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"};
const bytesHex=s=>new Uint8Array(s.match(/.{2}/g)?.map(x=>parseInt(x,16))||[]);
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
function equal(a,b){if(a.length!==b.length)return false;let v=0;for(let i=0;i<a.length;i++)v|=a[i]^b[i];return v===0;}
function response(body,status=200,headers={}){return new Response(body,{status,headers:{...baseHeaders,...headers}});}
function json(data,status=200,headers={}){return response(JSON.stringify(data),status,{'Content-Type':'application/json;charset=utf-8',...headers});}
function redirect(path,headers={}){return response(null,303,{Location:path,...headers});}
function cookie(value,age=TTL){return `heart_session=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;}
function configured(env){return env.HOST_USERNAME&&/^[a-f0-9]{64}$/.test(env.HOST_PASSWORD_HASH||'')&&/^[a-f0-9]{32}$/.test(env.HOST_PASSWORD_SALT||'')&&env.SESSION_SECRET?.length>=32;}
async function hmacKey(secret){return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function signSession(env){const payload=btoa(JSON.stringify({u:env.HOST_USERNAME,exp:Math.floor(Date.now()/1000)+TTL,nonce:crypto.randomUUID()})).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');const signature=await crypto.subtle.sign('HMAC',await hmacKey(env.SESSION_SECRET),encoder.encode(payload));return payload+'.'+hex(signature);}
async function authenticated(request,env){
  if(!configured(env))return false;const token=request.headers.get('Cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('heart_session='))?.slice(14);if(!token||token.length>1024)return false;
  try{const [payload,signature,...extra]=token.split('.');if(extra.length||!signature||!/^[a-f0-9]{64}$/.test(signature))return false;if(!await crypto.subtle.verify('HMAC',await hmacKey(env.SESSION_SECRET),bytesHex(signature),encoder.encode(payload)))return false;const data=JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')));const now=Math.floor(Date.now()/1000);return data.u===env.HOST_USERNAME&&Number.isSafeInteger(data.exp)&&data.exp>now&&data.exp<=now+TTL?data.exp:false;}catch{return false;}
}
async function passwordMatches(password,env){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);const hash=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytesHex(env.HOST_PASSWORD_SALT),iterations:100000},key,256);return equal(new Uint8Array(hash),bytesHex(env.HOST_PASSWORD_HASH));}
const publicAssets=new Set(['/icon.svg','/icon-192.png','/icon-512.png','/icon-maskable.png','/apple-touch-icon.png','/manifest.webmanifest','/login.js','/pwa.js','/sw.js']);
function asset(path,headers={}){const entry=ASSETS[path];return entry?response(entry.binary?Uint8Array.from(atob(entry.content),character=>character.charCodeAt(0)):entry.content,200,{'Content-Type':entry.type,...headers}):response('Not found',404);}
export default {async fetch(request,env){
  const url=new URL(request.url),path=url.pathname;
  if(path==='/auth/login'||path==='/auth/logout'){
    if(request.method!=='POST')return response('Method not allowed',405,{Allow:'POST'});
    if(request.headers.get('Origin')!==url.origin)return json({error:'Forbidden'},403);
    if(path==='/auth/logout')return json({ok:true},200,{'Set-Cookie':cookie('',0)});
    if(!configured(env))return json({error:'Login not configured'},503);
    const ip=request.headers.get('CF-Connecting-IP')||'unknown',now=Date.now();
    for(const [key,state] of failures)if(state.until<=now)failures.delete(key);
    const state=failures.get(ip);if(state?.count>=10)return json({error:'Too many attempts'},429,{'Retry-After':String(Math.ceil((state.until-now)/1000))});
    if(Number(request.headers.get('Content-Length'))>2048)return json({error:'Invalid request'},400);
    let data;try{const body=await request.text();if(body.length>2048)throw Error();data=JSON.parse(body);}catch{return json({error:'Invalid request'},400);}
    if(typeof data.username!=='string'||typeof data.password!=='string'||data.username.length>100||data.password.length>200)return json({error:'Invalid request'},400);
    const validPassword=await passwordMatches(data.password,env);
    if(data.username!==env.HOST_USERNAME||!validPassword){if(failures.size>10000)failures.delete(failures.keys().next().value);failures.set(ip,{count:(state?.count||0)+1,until:state?.until||now+15*60000});return json({error:'Invalid credentials'},401);}
    failures.delete(ip);return json({ok:true},200,{'Set-Cookie':cookie(await signSession(env))});
  }
  if(!['GET','HEAD'].includes(request.method))return response('Method not allowed',405);
  if(publicAssets.has(path)){const result=asset(path);return request.method==='HEAD'?new Response(null,{status:result.status,headers:result.headers}):result;}
  const signedIn=await authenticated(request,env);
  if(path==='/login')return signedIn?redirect('/'):asset('/login.html');
  if(path==='/auth/session')return signedIn?json({username:env.HOST_USERNAME}):json({error:'Unauthorized'},401);
  if(!signedIn)return path==='/'||path==='/index.html'?redirect('/login'):json({error:'Unauthorized'},401);
  if(path==='/login.html')return redirect('/');
  const isApp=path==='/'||path==='/index.html';
  const result=asset(isApp?'/index.html':path,isApp?{'X-Heart-Session-Expires':String(signedIn)}:{});
  return request.method==='HEAD'?new Response(null,{status:result.status,headers:result.headers}):result;
}};
