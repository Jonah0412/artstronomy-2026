import {useLayoutEffect, useRef} from 'react';
import {gsap} from 'gsap';
import {reconstruct} from './intro-model.js';
import {journeyLines} from './journey-copy.js';
import './cinematic-intro.css';

/** A single continuous title sequence across a trip's existing camera phases. */
export function KineticJourney({phase}) {
  const root = useRef(null);
  const lines = journeyLines(phase.to);
  const started = phase.tripStarted ?? phase.started;
  const duration = phase.tripDuration ?? phase.duration;
  useLayoutEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const rows = [...root.current.querySelectorAll('.cinema-row')];
    const glyphs = [...root.current.querySelectorAll('.cinema-glyphs')];
    let context;
    const settle = () => {
      context?.revert();
      glyphs.forEach((glyph, i) => { glyph.textContent = lines[i]; });
    };
    const onMotion = () => { if (motion.matches) settle(); };
    motion.addEventListener('change', onMotion);
    if (!motion.matches) {
      try {
        context = gsap.context(() => {
          const remaining = Math.max(.1, (duration - (performance.now() - started)) / 1000);
          const reveal = Math.min(.65, remaining * .28);
          const timeline = gsap.timeline();
          rows.forEach((row, i) => {
            const state = {progress:0};
            let beat = -1;
            timeline.fromTo(row, {x:i%2 ? 14 : -14, opacity:0, clipPath:'inset(44% 0 44% 0)'},
              {x:0, opacity:1, clipPath:'inset(0% 0 0% 0)', duration:reveal, ease:'power3.out'}, i * reveal * .12);
            timeline.to(state, {progress:1, duration:reveal, ease:'none', onUpdate:() => {
              const next = Math.floor(state.progress*12);
              if (next !== beat || state.progress === 1) {
                glyphs[i].textContent = reconstruct(lines[i], state.progress, next);
                beat = next;
              }
            }}, i * reveal * .12);
          });
          timeline.to(root.current.querySelector('.cinema-type'), {opacity:0, duration:Math.min(.3, remaining*.18), ease:'power2.in'}, remaining-Math.min(.3, remaining*.18));
        }, root);
      } catch { settle(); }
    }
    return () => { motion.removeEventListener('change', onMotion); context?.revert(); };
    // Phase changes retain the same sequence and do not restart letter reconstruction.
  }, [lines, started, duration]);
  return <div ref={root} className="journey-kinetic" data-destination={phase.to}>
    <p className="sr-only" role="status">{lines.join('. ')}</p>
    <div className="cinema-type" role="img" aria-label={lines.join('. ')}>
      {lines.map(line=><div key={line} className="cinema-row" aria-hidden="true"><span className="cinema-glyphs">{line}</span></div>)}
    </div>
  </div>;
}
