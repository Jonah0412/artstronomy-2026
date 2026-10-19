import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mountRadioScanner } from './radio/radio-scanner.js';
import { startHandTracking } from './cosmic/hand-tracking.js';
import './radio/radio-scanner.css';

export function RadioViewport({ videoRef, stream, mirrored, onTrackingState, handControls }) {
  const host = useRef(null), scanner = useRef(null);
  const [handSlot, setHandSlot] = useState(null);
  useEffect(() => {
    scanner.current = mountRadioScanner(host.current);
    setHandSlot(scanner.current.handControlSlot);
    return () => { scanner.current?.destroy();scanner.current=null; };
  }, []);
  useEffect(() => {
    const view=scanner.current;let cancelled=false,tracking;
    if(!stream||!videoRef.current){view?.setTrackingStatus('Drag the dial · camera optional');return;}
    startHandTracking({video:videoRef.current,mirrored,assetRoot:`${import.meta.env.BASE_URL}mediapipe`,visionModule:import('@mediapipe/tasks-vision'),onHand:hand=>{if(!cancelled)view?.setHand(hand);},onStatus:text=>{if(!cancelled)view?.setTrackingStatus(text);},onState:state=>{if(!cancelled)onTrackingState?.(state);}}).then(controller=>{tracking=controller;if(cancelled)tracking.stop();});
    return () => {cancelled=true;tracking?.stop();};
  }, [stream,mirrored,videoRef,onTrackingState]);
  return <><div className="radio-host" ref={host}/>{handSlot && handControls ? createPortal(handControls, handSlot) : null}</>;
}
