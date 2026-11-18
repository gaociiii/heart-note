import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html;charset=utf-8','.js':'application/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const assets={};for(const name of readdirSync(path.join(root,'web'))){const type=types[path.extname(name)];if(type){const bytes=readFileSync(path.join(root,'web',name));const binary=type==='image/png';assets['/'+name]={content:bytes.toString(binary?'base64':'utf8'),type,binary};}}
const hosting=JSON.parse(readFileSync('.openai/hosting.json','utf8'));if(hosting.static)throw Error('Worker hosting must not contain static configuration');
mkdirSync('dist/server',{recursive:true});mkdirSync('dist/.openai',{recursive:true});
writeFileSync('dist/server/index.js','const ASSETS='+JSON.stringify(assets)+';\n'+readFileSync('server/worker.mjs','utf8'));
writeFileSync('dist/.openai/hosting.json',JSON.stringify(hosting,null,2)+'\n');
console.log('Built authenticated Worker with '+Object.keys(assets).length+' assets.');
