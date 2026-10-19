import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {KineticTextReveal} from '../components/ui/kinetic-text-reveal';
const LiquidGlassCarousel=lazy(()=>import('../components/ui/liquid-glass-carousel').then(module=>({default:module.LiquidGlassCarousel})));
gsap.registerPlugin(ScrollTrigger);

const artworks = [
 {src:'/assets/hoshi-poster.webp',title:'Hoshi · A star is born',aspect:3/4},
 {src:'/assets/project-graphic-design.webp',title:'Identity, colour & possibility · Exhibition artwork',aspect:1.5},
 {src:'/assets/project-web-publishing.webp',title:'Ideas made interactive · Exhibition artwork',aspect:1.5},
 {src:'/assets/project-animation.webp',title:'Worlds beyond imagination · Exhibition artwork',aspect:1.5},
];
export function ArtworkCarousel({enabled}){
 const host=useRef(null),[seen,setSeen]=useState(false);
 useEffect(()=>{if(!enabled)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setSeen(true);observer.disconnect();}},{rootMargin:'180px'});observer.observe(host.current);return()=>observer.disconnect();},[enabled]);
 return <section ref={host} className="artwork-orbit" aria-label="Exhibition artwork carousel">
   <div className="artwork-orbit__heading"><p className="eyebrow">A glimpse into our universe</p><span>ART / PLAY / POSSIBILITY</span></div>
   {enabled&&seen?<Suspense fallback={<div className="artwork-orbit__poster"><img src={artworks[0].src} alt="Hoshi exhibition artwork"/></div>}><LiquidGlassCarousel items={artworks} background="#08150f" panelHeight={460} gap={26} entry={false}/></Suspense>:<div className="artwork-orbit__poster"><img src={artworks[0].src} alt="Hoshi exhibition artwork"/></div>}
   <p className="artwork-orbit__credit">Exhibition visual studies · <a href="https://componentry.dev/docs/components/liquid-glass-carousel" target="_blank" rel="noreferrer">Liquid glass by Componentry ↗</a></p>
 </section>;
}

export function KineticHeading({text,className='',enabled=true}){
 const host=useRef(null),reveal=useRef(null);
 useEffect(()=>{if(!enabled)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){reveal.current?.play();observer.disconnect();}},{threshold:.2});observer.observe(host.current);return()=>observer.disconnect();},[enabled]);
 return <h2 ref={host} className={className}><KineticTextReveal ref={reveal} text={text} splitBy="words" distance={75} stagger={.09} autoPlay={false} blur={false}/></h2>;
}

// Each panel finishes its natural reading scroll before it is pinned. The next
// panel then covers it while it recedes, following GreenSock's overscroll demo.
export function useExhibitionMotion(enabled){
 useEffect(()=>{
  if(!enabled)return;
  const media=gsap.matchMedia();let timer;
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const panels=[...document.querySelectorAll('main > section:is(.hero,.artwork-orbit,.about,.disciplines,.creator-section,.day-events,.visit)')];
   panels.forEach((panel,index)=>{
    gsap.set(panel,{position:'relative',zIndex:index+1,transformOrigin:'50% 100%'});
    if(index===panels.length-1)return;
    gsap.to(panel,{scale:()=>innerWidth<700?.94:.86,opacity:.25,ease:'none',scrollTrigger:{
     trigger:panel,start:()=>panel.offsetHeight>=innerHeight?'bottom bottom':'top top',end:()=>`+=${innerHeight*.85}`,
     pin:true,pinSpacing:false,scrub:true,invalidateOnRefresh:true,
     onUpdate:()=>window.dispatchEvent(new Event('exhibition-scroll')),
    }});
   });
  });
  let alive=true;
  const refresh=()=>{if(!alive)return;clearTimeout(timer);timer=setTimeout(()=>ScrollTrigger.refresh(),160);};
  const observer=new ResizeObserver(refresh);
  document.querySelectorAll('main > section').forEach(node=>observer.observe(node));
  document.fonts?.ready.then(refresh);refresh();
  return()=>{alive=false;clearTimeout(timer);observer.disconnect();media.revert();};
 },[enabled]);
}
