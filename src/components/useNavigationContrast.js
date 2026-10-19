import { useLayoutEffect } from 'react';

// Resolve transparent section backgrounds through their painted ancestors.
function backgroundOf(element) {
  for (let node = element; node; node = node.parentElement) {
    const values = getComputedStyle(node).backgroundColor.match(/[\d.]+/g)?.map(Number);
    if (values?.length >= 3 && (values[3] ?? 1) > 0.5) return values.slice(0, 3);
  }
  return [8, 21, 15];
}
function luminance(rgb) {
  const linear = rgb.map(value => {
    const c = value / 255;
    return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  });
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
const dark = luminance([8, 21, 15]), light = luminance([244, 241, 223]);

export function useNavigationContrast(headerRef, panelRef, open) {
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;
    const surfaces = [...document.querySelectorAll('main section, main footer')];
    function update() {
      frame = 0;
      const regions = surfaces.map(element => ({element, rect: element.getBoundingClientRect()}));
      const panel = panelRef.current?.getBoundingClientRect();
      for (const control of header.children) {
        const rect = control.getBoundingClientRect();
        const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
        // The menu covers only the right side on desktop, and both controls on phones.
        const panelLeft = header.parentElement.dataset.position === 'left' ? 0 : innerWidth - (panel?.width || 0);
        const covered = open && (control.classList.contains('sm-toggle') || (panel && x >= panelLeft && x <= panelLeft + panel.width));
        const surface = regions.findLast(({rect:r}) => x >= r.left && x <= r.right && y >= r.top && y < r.bottom)?.element;
        const brightness = covered ? luminance([16, 41, 30]) : luminance(backgroundOf(surface));
        const darkContrast = (brightness + .05) / (dark + .05);
        const lightContrast = (light + .05) / (brightness + .05);
        const ink = darkContrast > lightContrast ? 'dark' : 'light';
        if (control.dataset.contrast === ink) continue;
        control.dataset.contrast = ink;
        control.style.setProperty('--nav-ink', ink === 'dark' ? '#08150f' : '#f4f1df');
        control.style.setProperty('--nav-shadow', ink === 'dark' ? '#f4f1df66' : '#08150f66');
      }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('exhibition-scroll', schedule);
    window.addEventListener('resize', schedule, {passive:true});
    window.addEventListener('pageshow', schedule);
    // Font/image loading and expanded creator cards can move section boundaries.
    const observer = new ResizeObserver(schedule);
    surfaces.forEach(element => observer.observe(element));
    observer.observe(header);
    return () => {
      cancelAnimationFrame(frame);observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('exhibition-scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
    };
  }, [headerRef, panelRef, open]);
}
