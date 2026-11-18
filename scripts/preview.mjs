import http from 'node:http';
import worker from '../dist/server/index.js';
// Receive local runtime configuration through stdin; never persist credentials.
if(process.stdin.isTTY)process.stdin.setRawMode(true);
console.log('Waiting for preview configuration on stdin.');
let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>{input+=chunk;const end=input.search(/[\r\n]/);if(end<0)return;const env=JSON.parse(input.slice(0,end));input='';process.stdin.removeAllListeners('data');process.stdin.on('data',chunk=>{if(chunk.includes('\u0003'))process.exit(0);});
  const server=http.createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);const request=new Request('http://127.0.0.1:4173'+req.url,{method:req.method,headers:req.headers,...(body.length?{body}: {})});const result=await worker.fetch(request,env);res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}catch{res.writeHead(500);res.end('Preview error');}});
  server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
});
