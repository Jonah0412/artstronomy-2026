import { useEffect, useRef, useState } from 'react';
import { isHandheld } from './device-look.js';
import './immersive-help.css';

// Brief on-entry guidance. Help can be reopened without permanent control panels.
export function ImmersiveHelp({ ready, motion, onMotion, gallery = false, children, fallback = '' }) {
  const [open, setOpen] = useState(false), [leaving, setLeaving] = useState(false), [cycle, setCycle] = useState(0);
  const panel = useRef(null), button = useRef(null), handheld = isHandheld();
  useEffect(() => {
    if (!ready) { setOpen(false); return; }
    setOpen(true); setLeaving(false);
    if(cycle>0)return; // Manually opened help stays while the visitor uses its controls.
    const fade = setTimeout(() => { if (!panel.current?.contains(document.activeElement)) setLeaving(true); }, 4000);
    const close = setTimeout(() => { if (!panel.current?.contains(document.activeElement)) setOpen(false); }, 4500);
    return () => { clearTimeout(fade); clearTimeout(close); };
  }, [ready, cycle]);
  const text = fallback || (handheld
    ? `${motion === 'active' ? 'Turn your device to look around.' : 'Drag to look around.'} ${gallery ? 'Tap the floor to walk there, or tap an artwork to walk closer and view its details.' : 'Tap a cockpit monitor to enter.'}`
    : gallery ? 'Drag to look · WASD or arrow keys to walk · hover on artwork for details.' : 'Drag to look around · click a monitor to enter. Tab and Enter work too.');
  return <>
    <button ref={button} className="immersive-help-toggle" aria-label="Navigation help" aria-expanded={open} onClick={() => { if (open) setOpen(false); else setCycle(v=>v+1); }}>?</button>
    {open && ready && <aside ref={panel} className={`immersive-help ${leaving ? 'is-leaving' : ''}`} aria-label="Navigation help" onPointerEnter={()=>setLeaving(false)}>
      <p role="status">{text}</p>
      {handheld && ['permission','denied','off'].includes(motion) && <button onClick={()=>onMotion(true)}>Enable motion look</button>}
      {motion==='active' && <button onClick={()=>onMotion(false)}>Use touch look</button>}
      {motion==='starting' && <small>Connecting motion sensors…</small>}
      {motion==='denied' && <small>Motion permission wasn’t granted. Touch navigation is ready.</small>}
      {cycle>0&&children}
      <button className="immersive-help-close" aria-label="Dismiss navigation help" onClick={()=>{button.current?.focus();setOpen(false);}}>×</button>
    </aside>}
  </>;
}
