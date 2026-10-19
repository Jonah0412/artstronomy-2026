export const INSTRUMENT_FONT = '"IBM Plex Mono", monospace';
let readiness;
export function ensureInstrumentFonts() {
  if (!globalThis.document?.fonts) return Promise.resolve();
  return readiness ||= Promise.allSettled([
    document.fonts.load('400 24px "IBM Plex Mono"'),
    document.fonts.load('500 34px "IBM Plex Mono"'),
    document.fonts.load('600 34px "Inter Variable"'),
  ]);
}
// Fit without horizontal distortion or ellipsis: every verified name survives.
export function fitCanvasText(ctx, text, width, preferredSize, family = INSTRUMENT_FONT, weight = 500) {
  let size = preferredSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > width && size > 10) {
    size -= 1; ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}
