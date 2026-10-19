import { useEffect, useRef, useState } from 'react';
import { Dialog } from './Dialog.jsx';
import { exhibition } from './content.js';

const links = [['Exhibition', '#about'], ['Creators', '#creators'], ['Programme', '#day-events'], ['Visit', '#visit']];
export function Header({ onExperience }) {
  const [open, setOpen] = useState(false), header = useRef(null), progress = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      header.current?.classList.toggle('is-scrolled', scrollY > 120);
      const range = document.documentElement.scrollHeight - innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(queue); resize.observe(document.body);
    addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue); update();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); removeEventListener('scroll', queue); removeEventListener('resize', queue); };
  }, []);
  const experience = destination => { setOpen(false); onExperience(destination); };
  const follow = id => {
    setOpen(false);
    // Wait until the native dialog has restored focus and removed inertness.
    requestAnimationFrame(() => { const target = document.querySelector(id); target?.focus({ preventScroll: true }); target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
  };
  return <>
    <a className="obs-skip" href="#main-content">Skip to exhibition</a>
    <header ref={header} className="obs-header" aria-label="Main navigation">
      <a className="obs-brand" href="#top" aria-label="ARTStronomy home"><img src="/assets/hoshi-mascot.webp" alt="" width="32" height="32"/><span>ARTStronomy<small>UTAR · FINAL YEAR EXHIBITION</small></span></a>
      <nav className="obs-desktop-nav" aria-label="Exhibition sections">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <nav className="obs-experiences" aria-label="Experiences"><span className="obs-mono">EXPLORE</span><button onClick={() => experience('station')}>Ship ↗</button><button onClick={() => experience('gallery')}>Museum ↗</button><button onClick={() => experience('scanner')}>Radio ↗</button></nav>
      <button className="obs-menu-toggle" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Menu <span aria-hidden="true">☰</span></button>
      <span ref={progress} className="obs-scroll-progress" aria-hidden="true"/>
    </header>
    {open && <Dialog label="Exhibition navigation" onClose={() => setOpen(false)} className="obs-menu">
      <div className="obs-menu-top"><span className="obs-mono">ARTSTRONOMY / 2026</span><button autoFocus onClick={() => setOpen(false)}>Close ×</button></div>
      <nav aria-label="Exhibition sections">{links.map(([label, href], i) => <a key={href} href={href} onClick={event => { event.preventDefault(); follow(href); }}><small>0{i + 1}</small>{label}<span>↗</span></a>)}</nav>
      <p className="obs-mono">ENTER AN EXPERIENCE</p><div className="obs-menu-destinations">{[['station','Spaceship'],['gallery','Orbital Museum'],['scanner','Radio Scanner'],['ar','AR Poster']].map(([id, label]) => <button key={id} onClick={() => experience(id)}>{label} ↗</button>)}</div>
      <a className="obs-menu-social" href={exhibition.instagram} target="_blank" rel="noreferrer">@artstronomy_2026 ↗</a>
    </Dialog>}
  </>;
}
