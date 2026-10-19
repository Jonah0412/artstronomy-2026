import { useEffect, useRef } from 'react';
import { mountCosmicViewport } from './cosmic/cosmic-viewport.js';
import { startHandTracking } from './cosmic/hand-tracking.js';
import { creatorData } from './cosmic/creators.js';
import './cosmic/cosmic-viewport.css';

// React only owns mount/unmount. The renderer itself is framework-independent.
export function CosmicViewport({ videoRef, stream, mirrored }) {
  const hostRef = useRef(null), engineRef = useRef(null);
  useEffect(() => {
    engineRef.current = mountCosmicViewport(hostRef.current, { creators: creatorData });
    return () => { engineRef.current?.destroy(); engineRef.current = null; };
  }, []);
  useEffect(() => {
    let cancelled = false, controller;
    const engine = engineRef.current;
    if (!stream || !videoRef.current) { engine?.setTrackingStatus('Camera off · mouse & touch ready'); return; }
    startHandTracking({ video: videoRef.current, mirrored,
      visionModule: import('@mediapipe/tasks-vision'), assetRoot: `${import.meta.env.BASE_URL}mediapipe`,
      onHand: hand => engine?.setHand(hand), onStatus: text => engine?.setTrackingStatus(text),
    }).then(result => { controller = result; if(cancelled) result.stop(); });
    return () => { cancelled = true; controller?.stop(); };
  }, [stream, mirrored, videoRef]);
  return <div className="cosmic-host" ref={hostRef} />;
}
