import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist/client'),base='/artstronomy-2026';
// Vite rewrites module imports; these are runtime absolute URLs used by Three,
// image tracking, hand tracking, iframe experiences and standalone pages.
function visit(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);if(entry.isDirectory()){visit(file);continue;}
 if(!/\.(?:html|js|css|json)$/.test(entry.name))continue;
 const source=readFileSync(file,'utf8');
 const result=source.replace(/(["'`(=])\/(assets|fonts|mediapipe|ar-poster|radio-scanner|cosmic)(?=[/"'`)])/g,`$1${base}/$2`);
 if(result!==source)writeFileSync(file,result);
}}
visit(root);writeFileSync(path.join(root,'.nojekyll'),'');
console.log('Prepared all embedded experience paths for GitHub Pages.');
