// These tiers apply only to the two 3D environments, never to the main website.
export function environmentQuality({mobile=false,memory=8,cores=8}={}){
 const high=!mobile&&memory>=8&&cores>=6;
 return {name:high?'high':'balanced',fps:mobile?30:60,shadowSize:high?1024:512,
   reflections:high,bloom:high,dust:high?140:55,segments:high?48:32,
   textureSize:512,maxDrawCalls:120,maxTextureBytes:60*1024*1024};
}
export function deviceQuality(mobile){return environmentQuality({mobile,memory:navigator.deviceMemory||8,cores:navigator.hardwareConcurrency||8});}
