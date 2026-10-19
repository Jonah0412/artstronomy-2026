export const INTRO_SESSION_KEY = 'artstronomy-cinematic-intro-v1';
export function shouldShowIntro(storage, hash = '') {
  if (hash && hash !== '#top') return false;
  try { return storage.getItem(INTRO_SESSION_KEY) !== 'seen'; } catch { return true; }
}
export function rememberIntro(storage) {
  try { storage.setItem(INTRO_SESSION_KEY, 'seen'); } catch { /* Private storage is optional. */ }
}
// Deterministic substitutions keep the rhythm controlled; resolved letters never scramble again.
export function reconstruct(text, progress, beat = 0) {
  const glyphs = 'AEIOVX+◇';
  return [...text].map((letter, i) => letter === ' ' || progress >= (i + 1) / text.length
    ? letter : glyphs[(i + beat) % glyphs.length]).join('');
}
export function boundedReady(promises, timeout = 2500, signal) {
  return new Promise(resolve => {
    let settled = false;
    const done = () => { if (settled) return; settled = true; clearTimeout(timer); signal?.removeEventListener('abort', done); resolve(); };
    const timer = setTimeout(done, timeout);
    signal?.addEventListener('abort', done, {once:true});
    if (signal?.aborted) done();
    Promise.allSettled(promises).then(done);
  });
}
