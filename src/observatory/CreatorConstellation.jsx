import { useEffect, useRef, useState } from 'react';
import { creators, creatorCount, disciplines, disciplineOf, creatorsIn, animationMedia, disciplineColors, clusterPoints, projectStatus } from './content.js';
import { Dialog } from './Dialog.jsx';

function CreatorDetails({ creator, onOpen }) {
  return <>
    <span className="obs-eyebrow">CREATIVE SIGNAL / {String(creators.indexOf(creator) + 1).padStart(2,'0')}</span>
    <img src={creator.image} alt={`${disciplineOf(creator)} discipline illustration`} loading="lazy" width="600" height="400"/>
    <span className="obs-art-status">DISCIPLINE PREVIEW</span>
    <p className="obs-mono">{creator.category}</p><h3>{creator.name}</h3>
    <p>{projectStatus(creator)}</p>
    <p className="obs-muted">Individual artwork and project information will appear here when confirmed.</p>
    {onOpen && <button className="obs-button obs-button--secondary" onClick={onOpen}>View creator ↗</button>}
  </>;
}

export function CreatorConstellation({ selection }) {
  const [filter,setFilter] = useState('All'), [medium,setMedium] = useState('All');
  const [selected,setSelected] = useState(creators[0]), [profile,setProfile] = useState(null), [snap,setSnap] = useState(80);
  const [list,setList] = useState(false), [page,setPage] = useState(0);
  const field = useRef(null), clusters = useRef([]), drag = useRef(null);
  useEffect(() => {
    if (!selection) return;
    const creator = creators.find(item => item.id === selection.id);
    if (creator) { setSelected(creator); setFilter(disciplineOf(creator)); setMedium('All'); setProfile(creator); setSnap(80); }
  }, [selection]);
  const shown = filter === 'All' ? disciplines : [filter];
  const visibleCreators = creators.filter(c => (filter === 'All' || disciplineOf(c) === filter) && (medium === 'All' || c.category === medium));
  function choose(creator) {
    setSelected(creator);
    if (matchMedia('(max-width: 767px)').matches) { setProfile(creator); setSnap(80); }
  }
  function setDiscipline(value) {
    setFilter(value); setMedium('All'); setPage(0);
    const next = value === 'All' ? creators[0] : creatorsIn(value)[0];
    if (next) setSelected(next);
    field.current?.scrollTo({ left: 0 });
  }
  function movePage(next) {
    next = Math.max(0, Math.min(shown.length - 1, next)); setPage(next);
    const el = clusters.current[next];
    if (el) field.current.scrollTo({ left: el.offsetLeft - field.current.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section className="obs-section obs-creators" id="creators" tabIndex={-1} aria-labelledby="creators-heading">
    <div className="obs-section-head"><div><p className="obs-eyebrow">03 / THE CREATOR CONSTELLATION</p><h2 id="creators-heading">{creatorCount} minds.<br/><em>Infinite possibilities.</em></h2></div><p>Choose a star. Meet its creator.<br/>Five disciplines, one expanding universe.</p></div>
    <div className="obs-filterbar"><div className="obs-filters" role="group" aria-label="Filter by discipline">{['All',...disciplines].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setDiscipline(value)}>{value}<span>{value === 'All' ? creatorCount : creatorsIn(value).length}</span></button>)}</div><button className="obs-view-toggle" aria-pressed={list} onClick={() => setList(!list)}>{list ? 'Star map ✦' : 'List view ≡'}</button></div>
    {filter === 'Animation' && <label className="obs-medium">Animation medium <select value={medium} onChange={event => { const value=event.target.value; setMedium(value); const next=creators.find(c => disciplineOf(c)==='Animation' && (value==='All'||c.category===value)); if(next)setSelected(next); }}><option>All</option>{animationMedia.map(value => <option key={value}>{value}</option>)}</select></label>}
    <div className="obs-constellation-layout">
      <div className="obs-constellation-surface">
        {list ? <div className="obs-creator-list">{visibleCreators.map(creator => <button key={creator.id} onClick={() => choose(creator)} aria-pressed={selected.id===creator.id}><span>{String(creators.indexOf(creator)+1).padStart(2,'0')}</span><strong>{creator.name}</strong><small>{creator.category}</small><span>↗</span></button>)}</div> : <>
          <div ref={field} className="obs-clusters" onScroll={() => { const el=field.current; if(el.clientWidth && matchMedia('(max-width: 767px)').matches) setPage(Math.round(el.scrollLeft / el.clientWidth)); }}>
            {shown.map((discipline,i) => {
              const items = creatorsIn(discipline).filter(c => medium==='All'||c.category===medium), points=clusterPoints(items.length);
              return <div key={discipline} ref={node => {clusters.current[i]=node;}} className="obs-cluster" style={{'--orbit-color':disciplineColors[discipline]}} role="group" aria-label={`${discipline} constellation`}>
                <h3>{discipline}<small>{items.length} {items.length===1?'SIGNAL':'SIGNALS'}</small></h3>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={points.map(p=>`${p.x},${p.y}`).join(' ')}/></svg>
                {items.map((creator,j) => <button key={creator.id} className="obs-star" style={{left:`${points[j].x}%`,top:`${points[j].y}%`}} aria-label={`${creator.name}, ${creator.category}`} aria-pressed={selected.id===creator.id} onClick={()=>choose(creator)}
                  onKeyDown={event=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?items.length-1:(j+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+items.length)%items.length;event.currentTarget.parentElement.querySelectorAll('.obs-star')[n]?.focus();}}}>
                  <span aria-hidden="true">✦</span><small>{String(creators.indexOf(creator)+1).padStart(2,'0')}</small>
                </button>)}
                {!items.length && <p className="obs-empty">No confirmed creator in this medium yet.</p>}
              </div>;
            })}
          </div>
          <div className="obs-cluster-pager"><button onClick={()=>movePage(page-1)} disabled={page===0} aria-label="Previous discipline">←</button><span className="obs-mono">{shown[Math.min(page,shown.length-1)]} · {Math.min(page+1,shown.length)} / {shown.length}</span><button onClick={()=>movePage(page+1)} disabled={page>=shown.length-1} aria-label="Next discipline">→</button></div>
        </>}
        {!visibleCreators.length && list && <p className="obs-empty">No confirmed creator in this medium yet.</p>}
        <p className="obs-map-note obs-mono">{visibleCreators.length} VERIFIED SIGNALS · TAP A STAR OR SWITCH TO LIST VIEW</p>
      </div>
      <aside className="obs-creator-dock" aria-label="Selected creator" aria-live="polite"><CreatorDetails creator={selected} onOpen={()=>{setProfile(selected);setSnap(80);}}/></aside>
    </div>
    {profile && <Dialog className="obs-profile" label={`${profile.name} — creator profile`} onClose={()=>setProfile(null)}>
      <div className="obs-sheet" style={{'--sheet-height':`${snap}dvh`}}>
        <div className="obs-sheet-handle" aria-hidden="true" onPointerDown={event=>{drag.current=event.clientY;event.currentTarget.setPointerCapture(event.pointerId);}} onPointerUp={event=>{if(drag.current!==null){const distance=event.clientY-drag.current;if(distance>130)setProfile(null);else if(Math.abs(distance)>25)setSnap(value=>distance>0?Math.max(40,value-20):Math.min(80,value+20));drag.current=null;}}}><i/></div>
        <div className="obs-profile-toolbar"><span className="obs-mono">THE CREATOR ARCHIVE</span><button onClick={()=>setProfile(null)} autoFocus>Close ×</button></div>
        <div className="obs-sheet-sizes" aria-label="Profile panel height">{[40,60,80].map(value=><button key={value} onClick={()=>setSnap(value)} aria-pressed={snap===value}>{value===40?'Compact':value===60?'Medium':'Expanded'}</button>)}</div>
        <div className="obs-profile-content"><CreatorDetails creator={profile}/></div>
        <nav className="obs-profile-nav" aria-label="Browse creators"><button onClick={()=>{const c=creators[(creators.indexOf(profile)-1+creatorCount)%creatorCount];setProfile(c);setSelected(c);}}>← Previous</button><span className="obs-mono">{creators.indexOf(profile)+1} / {creatorCount}</span><button onClick={()=>{const c=creators[(creators.indexOf(profile)+1)%creatorCount];setProfile(c);setSelected(c);}}>Next →</button></nav>
      </div>
    </Dialog>}
  </section>;
}
