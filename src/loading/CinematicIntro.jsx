import {useLayoutEffect, useRef} from 'react';
import {gsap} from 'gsap';
import {boundedReady, reconstruct, rememberIntro} from './intro-model.js';
import './cinematic-intro.css';

import {openingLines as lines} from './journey-copy.js';

/** Opening only. Homepage Hoshi and destination journey loaders stay independent. */
export function CinematicIntro({onComplete}) {
  const root = useRef(null);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  useLayoutEffect(() => {
    const element = root.current;
    const abort = new AbortController();
    const previousFocus = document.activeElement;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let finished = false;
    let timeline;
    let context;
    const finish = () => {
      if (finished) return;
      finished = true;
      abort.abort();
      clearTimeout(watchdog);
      timeline?.kill();
      context?.revert();
      document.body.classList.remove('site-opening');
      try { rememberIntro(window.sessionStorage); } catch { /* Storage is optional. */ }
      callback.current();
      requestAnimationFrame(() => document.querySelector('.hero h1')?.focus({preventScroll:true}));
    };
    // Independent, non-visible escape even if font readiness or animation stalls.
    const watchdog = setTimeout(finish, 8000);
    document.body.classList.add('site-opening');
    element.focus({preventScroll:true});
    const onMotion = () => { if (motion.matches) finish(); };
    motion.addEventListener('change', onMotion);
    // No hidden keyboard skip control: focus stays in the short modal until arrival.
    const containFocus = event => {
      if (event.key === 'Tab') { event.preventDefault(); element.focus({preventScroll:true}); }
    };
    element.addEventListener('keydown', containFocus);
    try {
      context = gsap.context(() => {});
      context.add(() => {
        const rows = [...element.querySelectorAll('.cinema-row')];
        const glyphRows = [...element.querySelectorAll('.cinema-glyphs')];
        const hero = ['.hero-title-wrap', '.mascot-stage', '.hero-bottom'];
        timeline = gsap.timeline({paused:true, onComplete:finish});
        if (motion.matches) {
          timeline.to(element, {opacity:0, duration:.18});
          return;
        }
        gsap.set(hero, {autoAlpha:0, y:18});
        rows.forEach((row, index) => {
          const state = {progress:0};
          let lastBeat = -1;
          timeline.fromTo(row,
            {x:index % 2 ? 18 : -18, opacity:0, clipPath:'inset(45% 0 45% 0)'},
            {x:0, opacity:1, clipPath:'inset(0% 0 0% 0)', duration:.95, ease:'power3.inOut'}, index*.14);
          timeline.to(state, {progress:1, duration:1.1, ease:'none', onUpdate:() => {
            const beat = Math.floor(state.progress*14);
            if (beat !== lastBeat || state.progress === 1) {
              glyphRows[index].textContent = reconstruct(lines[index], state.progress, beat);
              lastBeat = beat;
            }
          }}, .18+index*.18);
        });
        timeline.to(rows, {x:(i)=>i%2?14:-14, opacity:0, stagger:.07, duration:.45, ease:'power2.in'}, 2.45)
          // One full-size curtain reveals the existing homepage; no shrinking frame.
          .to(element, {clipPath:'inset(0 0 100% 0)', duration:.85, ease:'power3.inOut'}, 2.9)
          .to(hero, {autoAlpha:1, y:0, stagger:.06, duration:.7, ease:'power3.out'}, 3.02);
      });
      boundedReady([document.fonts?.ready ?? Promise.resolve()], motion.matches ? 100 : 1800, abort.signal).then(() => {
        if (!finished && !abort.signal.aborted) {
          element.querySelector('[role="status"]').textContent = 'Your creative universe is ready';
          timeline.play();
        }
      });
    } catch {
      // Setup failures must expose the working homepage immediately.
      finish();
    }
    return () => {
      finished = true;
      abort.abort();
      clearTimeout(watchdog);
      timeline?.kill();
      motion.removeEventListener('change', onMotion);
      element.removeEventListener('keydown', containFocus);
      context?.revert();
      document.body.classList.remove('site-opening');
      if (element.contains(document.activeElement)) previousFocus?.focus?.();
    };
  }, []);
  return <div className="cinema-intro" ref={root} role="dialog" aria-modal="true" aria-label="Welcome to ARTStronomy 2026" tabIndex={-1}>
    <p className="sr-only" role="status">Preparing your creative universe</p>
    <div className="cinema-panel">
      <div className="cinema-type" role="img" aria-label={lines.join('. ')}>
        {lines.map(line=><div key={line} className="cinema-row" aria-hidden="true"><span className="cinema-glyphs">{line}</span></div>)}
      </div>
    </div>
  </div>;
}
