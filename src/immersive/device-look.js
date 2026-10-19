import { Euler, Quaternion, Vector3, MathUtils } from 'three';

// Capability detection includes iPads that identify themselves as desktop Macs.
export function isHandheld(env = globalThis) {
  const n = env.navigator;
  return !!n && (n.userAgentData?.mobile === true || /Android|iPhone|iPad|iPod/i.test(n.userAgent || '') ||
    (/Mac/i.test(n.platform || '') && n.maxTouchPoints > 1));
}
let permissionGranted = false;
export function needsMotionPermission() {
  return !permissionGranted && typeof globalThis.DeviceOrientationEvent?.requestPermission === 'function';
}
export function createDeviceLook({ read, apply, blocked = () => false, onState = () => {} }) {
  let active = false, disposed = false, anchor = null, timer;
  const rotation = new Euler(0, 0, 0, 'YXZ'), heading = new Euler(0, 0, 0, 'YXZ');
  const q = new Quaternion(), screenQ = new Quaternion(), axis = new Vector3(0, 0, 1);
  const correction = new Quaternion(-Math.sqrt(.5), 0, 0, Math.sqrt(.5));
  const reset = () => { anchor = null; };
  function stop(report = true) {
    active = false; reset(); clearTimeout(timer);
    window.removeEventListener('deviceorientation', orientation);
    window.removeEventListener('orientationchange', reset);
    if (report) onState('off');
  }
  function orientation(event) {
    if (!active || document.hidden || blocked()) { reset(); return; }
    if (![event.alpha, event.beta, event.gamma].every(Number.isFinite)) return;
    rotation.set(MathUtils.degToRad(event.beta), MathUtils.degToRad(event.alpha), -MathUtils.degToRad(event.gamma));
    q.setFromEuler(rotation).multiply(correction).multiply(screenQ.setFromAxisAngle(axis, -MathUtils.degToRad(screen.orientation?.angle ?? window.orientation ?? 0)));
    heading.setFromQuaternion(q, 'YXZ');
    if (!anchor) { anchor = { yaw: heading.y, pitch: heading.x, base: read() }; clearTimeout(timer); onState('active'); }
    const delta = Math.atan2(Math.sin(heading.y-anchor.yaw), Math.cos(heading.y-anchor.yaw));
    apply({ yaw: anchor.base.yaw + delta, pitch: anchor.base.pitch + heading.x-anchor.pitch });
  }
  async function start(userGesture = false) {
    if (disposed || active) return;
    if (!isHandheld() || !window.isSecureContext || !window.DeviceOrientationEvent) { onState('unavailable'); return; }
    if (needsMotionPermission()) {
      if (!userGesture) { onState('permission'); return; }
      try {
        if (await DeviceOrientationEvent.requestPermission() !== 'granted') { if(!disposed)onState('denied'); return; }
        permissionGranted = true;
      } catch { if (!disposed) onState('denied'); return; }
    }
    if (disposed) return;
    active = true; reset(); onState('starting');
    window.addEventListener('deviceorientation', orientation);
    window.addEventListener('orientationchange', reset);
    timer = setTimeout(() => { if (!anchor) { stop(false); onState('unavailable'); } }, 3500);
  }
  return { start, stop, reset, get active() { return active; }, dispose() { disposed = true; stop(false); } };
}
