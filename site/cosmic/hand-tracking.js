import { createHandGesture } from './hand-gesture.js';
// Optional MediaPipe adapter. No video leaves the visitor's browser.
// Model/WASM files are self-hosted. Camera permission is obtained by the host.
export async function startHandTracking({ video, mirrored = true, visionModule, assetRoot, onHand, onStatus, onState = () => {} }) {
  const gestures=createHandGesture();
  let lastGesture='',lastResult=0;
  let tracker, timer, cancelled = false, previousTime = -1;
  const report = (state, text) => { if (!cancelled) { onStatus(text); onState({state, text}); } };
  const stop = () => { cancelled = true; clearTimeout(timer); tracker?.close(); tracker = null; onHand(null); };
  // Return cancellation immediately, including while model initialization runs.
  const ready = (async () => {
    try {
      report('loading', 'Loading hand tracking…');
      const { FilesetResolver, HandLandmarker } = await visionModule;
      if (cancelled) return;
      const files = await FilesetResolver.forVisionTasks(`${assetRoot}/wasm`);
      if (cancelled) return;
      const created = await HandLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: `${assetRoot}/hand_landmarker.task?v=fbc2a30080c3`, delegate: 'CPU' },
        runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: .55, minTrackingConfidence: .5,
      });
      if (cancelled) { created.close(); return; }
      tracker = created;
      report('ready', 'Tracking ready · show your hand to the front camera');
      video.play?.().catch(() => report('waiting', 'Camera paused · turn hand control off and on to retry'));
      let misses = 0;
      const detect = () => {
        if (cancelled) return;
        if (!document.hidden && video.readyState >= 2 && video.currentTime !== previousTime) {
          previousTime = video.currentTime;
          try {
            lastResult=performance.now();
            const result = tracker.detectForVideo(video, performance.now());
            const hand = result.landmarks?.[0];
            if (hand) {
              const input=gestures.update(hand,{world:result.worldLandmarks?.[0],aspect:(video.videoWidth||1)/(video.videoHeight||1),mirrored});
              onHand(input);
              const gesture=input?.gesture||'open';
              if(misses!==-1||gesture!==lastGesture)report('detected',gesture==='pinch'?'Pinch held · move left/right to tune':gesture==='fist'?'Fist · signal control stopped':'Hand open · pinch index + thumb to tune');
              lastGesture=gesture;
              misses = -1;
            } else {
              gestures.reset();onHand(null); if(misses === -1) misses = 0; misses++;
              if(misses===8) report('ready', 'Show your hand · keep your palm inside the camera view');
            }
          } catch (error) { console.error('Hand tracking frame failed', error); report('error', 'Tracking stopped · retry hand control'); onHand(null); return; }
        }
        if(document.hidden||performance.now()-lastResult>400){gestures.reset();onHand(null);}
        // Approximately 12 Hz hand inference, independently of the visual loop.
        timer = setTimeout(detect, 80);
      };
      detect();
    } catch (error) {
      if (!cancelled) {
        console.error('Hand tracking startup failed', error);
        report('error', 'Hand tracking could not start · retry hand control');
        onHand(null);
      }
    }
  })();
  return { stop, ready };
}
