import { useRef, useState } from 'react';
import { creators, creatorCount, disciplineOf, projectStatus } from './content.js';

export function ProjectionWall({ onCreator }) {
  const [index, setIndex] = useState(0), track = useRef(null), frames = useRef([]), drag = useRef(null);
  const creator = creators[index];
  function go(next) {
    next = (next + creatorCount) % creatorCount;
    setIndex(next);
    const node = frames.current[next];
    track.current?.scrollTo({ left: track.current.scrollLeft + node.getBoundingClientRect().left - track.current.getBoundingClientRect().left - (parseFloat(getComputedStyle(track.current).scrollPaddingLeft) || 0), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function onScroll() {
    const left = track.current.getBoundingClientRect().left + (parseFloat(getComputedStyle(track.current).scrollPaddingLeft) || 0);
    let nearest = 0, distance = Infinity;
    frames.current.forEach((node, i) => { const d = Math.abs(node.getBoundingClientRect().left - left); if (d < distance) { distance = d; nearest = i; } });
    setIndex(nearest);
  }
  return <section className="obs-section obs-projection" id="artworks" aria-labelledby="projection-heading" tabIndex={-1}>
    <div className="obs-section-head"><div><p className="obs-eyebrow">01 / THE PROJECTION WALL</p><h2 id="projection-heading">A window into<br/><em>creative worlds.</em></h2></div><p>Meet the minds behind the work.<br/>A first look at their creative disciplines.</p></div>
    <div className="obs-projection-stage">
      <span className="obs-projection-corner" aria-hidden="true">+</span>
      <div className="obs-filmstrip" ref={track} onScroll={onScroll}
        onPointerDown={event=>{if(event.pointerType!=='mouse'||event.button!==0)return;drag.current={x:event.clientX,left:track.current.scrollLeft};event.currentTarget.setPointerCapture(event.pointerId);event.currentTarget.classList.add('is-dragging');}}
        onPointerMove={event=>{if(drag.current)track.current.scrollLeft=drag.current.left-(event.clientX-drag.current.x);}}
        onPointerUp={event=>{if(!drag.current)return;drag.current=null;event.currentTarget.classList.remove('is-dragging');go(index);}}
        onPointerCancel={event=>{drag.current=null;event.currentTarget.classList.remove('is-dragging');}}
        onDragStart={event=>event.preventDefault()} tabIndex={0} role="region" aria-label="Creator projection wall. Use arrow keys to browse."
        onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); go(event.key === 'Home' ? 0 : event.key === 'End' ? creatorCount - 1 : index + (event.key === 'ArrowRight' ? 1 : -1)); } }}>
        {creators.map((item, i) => <figure ref={node => { frames.current[i] = node; }} className="obs-projection-frame" key={item.id}>
          <div className="obs-art-mat"><img src={item.image} alt={`${disciplineOf(item)} discipline illustration — not the creator’s project artwork`} loading="lazy" decoding="async" width="1200" height="800"/></div>
          <figcaption><div><span className="obs-mono">{String(i + 1).padStart(2, '0')} / {String(creatorCount).padStart(2, '0')} · {item.category}</span><h3>{item.name}</h3><p>{projectStatus(item)}</p></div><span className="obs-art-status">DISCIPLINE PREVIEW</span></figcaption>
        </figure>)}
      </div>
      <div className="obs-projection-controls"><span className="obs-mono" role="status">{String(index + 1).padStart(2,'0')} / {creatorCount} · {creator.name}</span><div><button aria-label="Previous creator projection" onClick={() => go(index - 1)}>←</button><button aria-label="Next creator projection" onClick={() => go(index + 1)}>→</button></div></div>
    </div>
    <div className="obs-contact-sheet" role="group" aria-label="Choose a creator projection">{creators.map((item, i) => <button key={item.id} aria-label={`Show ${item.name}`} aria-pressed={index === i} onClick={() => go(i)}><img src={item.image} alt="" loading="lazy" decoding="async"/><span>{String(i + 1).padStart(2,'0')}</span></button>)}</div>
    <div className="obs-projection-note"><p>Discipline illustrations are shown while individual project artwork is being prepared.</p><button className="obs-text-link" onClick={() => onCreator(creator.id)}>Meet this creator ↗</button></div>
  </section>;
}
