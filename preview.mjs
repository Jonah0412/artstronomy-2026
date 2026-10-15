// Local viewer for ARTSTRONOMY 2026.
// No package installation, source publishing, account credentials or deployment.
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';

const args=process.argv.slice(2);
const value=flag=>{const i=args.indexOf(flag);return i<0?undefined:args[i+1];};
const port=Number(value('--port')||4173),lan=args.includes('--lan');
const cert=value('--cert'),key=value('--key');
if(!Number.isInteger(port)||port<1||port>65535)throw Error('Use a valid --port number.');
if(Boolean(cert)!==Boolean(key))throw Error('HTTPS needs both --cert and --key.');
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'site');
if(!fs.existsSync(path.join(root,'index.html')))throw Error('Extract the entire ZIP first. Keep preview.mjs beside the site folder.');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.wasm':'application/wasm','.glb':'model/gltf-binary','.gltf':'model/gltf+json','.woff':'font/woff','.woff2':'font/woff2','.mp4':'video/mp4','.mp3':'audio/mpeg','.zip':'application/zip','.txt':'text/plain; charset=utf-8'};
function serve(request,response){
  if(!['GET','HEAD'].includes(request.method)){response.writeHead(405,{'Allow':'GET, HEAD'});response.end();return;}
  let pathname;
  try{pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);}catch{response.writeHead(400);response.end('Invalid path');return;}
  if(pathname==='/artstronomy-2026'||pathname.startsWith('/artstronomy-2026/'))pathname=pathname.slice('/artstronomy-2026'.length)||'/';
  let file=path.resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){response.writeHead(403);response.end();return;}
  try{
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    if(!fs.existsSync(file)){
      if(!path.extname(pathname)&&request.headers.accept?.includes('text/html'))file=path.join(root,'index.html');
      else{response.writeHead(404);response.end('File not found');return;}
    }
    const stat=fs.statSync(file);
    if(!stat.isFile()){response.writeHead(404);response.end();return;}
    response.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    if(request.method==='HEAD'){response.end();return;}
    const stream=fs.createReadStream(file);stream.on('error',()=>response.destroy());stream.pipe(response);
  }catch{if(!response.headersSent)response.writeHead(404);response.end();}
}
const scheme=cert?'https':'http';
const server=cert?https.createServer({cert:fs.readFileSync(cert),key:fs.readFileSync(key)},serve):http.createServer(serve);
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is occupied. Try: node preview.mjs --port 4174`:error.message);process.exitCode=1;});
server.listen(port,lan?'0.0.0.0':'127.0.0.1',()=>{
  console.log(`ARTSTRONOMY 2026\nOpen: ${scheme}://localhost:${port}\nStop: Ctrl+C`);
  if(lan){for(const entries of Object.values(os.networkInterfaces()))for(const address of entries||[])if(address.family==='IPv4'&&!address.internal)console.log(`Same-Wi-Fi phone/tablet: ${scheme}://${address.address}:${port}`);
    if(!cert)console.log('LAN HTTP supports the visual/touch review. Camera, gyro and WebXR may require trusted HTTPS.');
  }
});
