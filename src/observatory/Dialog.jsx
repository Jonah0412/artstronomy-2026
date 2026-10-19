import { useEffect, useRef } from 'react';

// Native modal provides background inertness, focus containment and Escape.
export function Dialog({ children, label, onClose, className = '' }) {
  const ref = useRef(null), callback = useRef(onClose);
  callback.current = onClose;
  useEffect(() => {
    const element = ref.current, previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close(); document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={ref} className={`obs-dialog ${className}`} aria-label={label}
    onCancel={event => { event.preventDefault(); callback.current(); }}
    onClick={event => { if (event.target === ref.current) { const r = ref.current.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) callback.current(); } }}>
    {children}
  </dialog>;
}
