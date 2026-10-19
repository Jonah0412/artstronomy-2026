import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {useJourney} from "./journey/useJourney.js";
import {JourneyOverlay} from "./journey/JourneyOverlay.jsx";
import {DOCKING_KINDS} from './journey/docking-plan.js';
import ControlStation from "./ControlStation.jsx";
const RadioViewport = lazy(() => import("./RadioViewport.jsx").then(module => ({ default: module.RadioViewport })));
const VirtualGallery = lazy(() => import("./gallery/VirtualGallery.jsx").then(module => ({ default: module.VirtualGallery })));

export function ARCameraFallback({ stream, onClose, onRestartCamera, onPauseCamera, arrivalPhase=null, onHubReady, introBlocked=false, entryDestination="station" }) {
  const [bootReady,setBootReady]=useState(false);
  const entryStarted=useRef(false);
  const handleReady=value=>{setBootReady(value);onHubReady?.(value);};
  const [mode, setMode] = useState("station");
  const [scannerHands,setScannerHands]=useState(false);
  const [handTracking,setHandTracking]=useState({state:'idle',text:''});
  useEffect(()=>{if(handTracking.state==='error')setScannerHands(false);},[handTracking.state]);
  const [switchingCamera, setSwitchingCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState(() => (
    stream?.getVideoTracks()[0]?.getSettings?.().facingMode === "environment" ? "environment" : "user"
  ));
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const dialogRef = useRef(null);
  const posterRef = useRef(null);
  const modalActions = useRef(null);
  const journey=useJourney({onMode:next=>{setMode(next);if(next!=='scanner'){setScannerHands(false);setHandTracking({state:'idle',text:''});}setMessage('');},onDone:next=>{if(next==='website')onClose();else requestAnimationFrame(()=>{const selector=next==='gallery'?'.virtual-gallery__surface':next==='ar'?'.ar-poster-frame':'.seated-hub';dialogRef.current?.querySelector(selector)?.focus({preventScroll:true});});}});
  useEffect(()=>{if(journey.phase?.kind==='warp'){
    // Warm the code and decoded images only; create no second WebGL renderer.
    import('./gallery/gallery-engine.js').catch(()=>{});
    for(const src of ['/assets/project-graphic-design.webp','/assets/project-web-publishing.webp','/assets/project-animation.webp']){const image=new Image();image.src=src;image.decode().catch(()=>{});}
  }},[journey.phase?.kind]);
  const navigate=next=>{if(journey.isActive())return;journey.begin(mode,next);};
  useEffect(()=>{
    if(!bootReady||arrivalPhase||introBlocked||entryStarted.current)return;
    entryStarted.current=true;
    if(['ar','gallery','scanner'].includes(entryDestination))journey.begin('station',entryDestination);
  },[bootReady,arrivalPhase,introBlocked,entryDestination]);
  const cinematic=useMemo(()=>{
    const phase=journey.phase||arrivalPhase;
    if(phase&&(['seat','portal','return','arrival','monitor'].includes(phase.kind)||DOCKING_KINDS.has(phase.kind)))return phase;
    if(mode==='scanner')return {kind:'monitor',monitor:'scanner',duration:0};
    return null;
  },[journey.phase,arrivalPhase,mode]);
  modalActions.current = { onClose: () => journey.isActive()?journey.skip():navigate(mode==='station'?'website':'station') };

  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    const keydown = event => {
      const nestedDialog = event.target.closest?.('[role="dialog"]');
      if (nestedDialog && nestedDialog !== dialog) return;
      const actions = modalActions.current;
      if (event.key === 'Escape') { event.preventDefault(); actions.onClose(); }
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('button:not(:disabled),select:not(:disabled),iframe,[tabindex="0"]')].filter(node => node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden');
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    dialog.querySelector('button')?.focus({ preventScroll: true });
    dialog.addEventListener('keydown', keydown);
    return () => { dialog.removeEventListener('keydown', keydown); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);

  // The virtual room does not need a webcam. Release it before the gallery's
  // optional immersive AR session requests the device camera for itself.
  useEffect(() => {
    if (!(mode==='scanner'&&scannerHands) && stream) onPauseCamera?.();
  }, [mode, stream, scannerHands, onPauseCamera]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.srcObject = stream;
    const detectedFacing = stream?.getVideoTracks()[0]?.getSettings?.().facingMode;
    if (detectedFacing === "user" || detectedFacing === "environment") setCameraFacing(detectedFacing);
    document.body.classList.add("modal-open");
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      document.body.classList.remove("modal-open");
    };
  }, [stream]);

  // Only the same-origin poster frame can request the return journey.
  useEffect(() => {
    const receive = event => {
      if (event.origin !== location.origin || event.source !== posterRef.current?.contentWindow) return;
      if (event.data?.type === 'artstronomy:poster-close') modalActions.current.onClose();
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  const enableCamera = async () => {
    setSwitchingCamera(true);
    try { await onRestartCamera("user"); setMessage(""); }
    catch { setScannerHands(false); setHandTracking({state:"error",text:"Camera unavailable · retry hand control"}); setMessage("Camera unavailable. You can still explore the gallery or radio scanner."); }
    finally { setSwitchingCamera(false); }
  };

  const handControls = <><button type="button" aria-pressed={scannerHands} disabled={switchingCamera} onClick={()=>{if(scannerHands){setScannerHands(false);setHandTracking({state:'idle',text:''});onPauseCamera?.();}else{setHandTracking({state:'loading',text:'Starting camera and hand tracking…'});setScannerHands(true);enableCamera();}}}>{scannerHands?(handTracking.state==='detected'?'Hand detected':handTracking.state==='ready'?'Tracking ready':handTracking.state==='waiting'?'Camera paused':'Starting hand control…'):(handTracking.state==='error'?'Retry hand control':'Enable hand control')}</button>{(message||handTracking.text)&&<span role="status">{message||handTracking.text}</span>}</>;

  return (
    <section ref={dialogRef} className={`ar-camera ar-camera--${mode} ${journey.phase?"journey-active":""} ${journey.phase?.kind==='tv'?"journey-tv":""} ${journey.phase?.kind==='portal'?"journey-portal":""}`} role="dialog" aria-modal="true" aria-label="ARTStronomy experiences">
      <div className="ar-camera__scene">
        <video ref={videoRef} aria-hidden={mode!=="scanner"} className={cameraFacing === "user" ? "is-mirrored" : ""} autoPlay playsInline muted aria-label={`Live ${cameraFacing === "user" ? "front" : "back"} camera view`} />
        {(mode === "station" || mode === "scanner") ? <ControlStation introBlocked={introBlocked} onReady={handleReady} cinematic={cinematic} onClose={()=>navigate('website')} onSelect={navigate} onScannerClose={()=>navigate('station')} scanner={mode==='scanner'?<Suspense fallback={<span className="ar-loading">Opening the signal scanner…</span>}><RadioViewport handControls={handControls} videoRef={videoRef} stream={scannerHands?stream:null} mirrored={cameraFacing==='user'} onTrackingState={setHandTracking}/></Suspense>:null}/> : mode === "website" ? null : mode === "gallery" ? (
          <Suspense fallback={<span className="ar-loading">Opening the virtual gallery…</span>}><VirtualGallery onWebsite={()=>navigate('website')} onClose={()=>navigate('station')} busy={!!journey.phase} /></Suspense>
        ) : (
          <iframe ref={posterRef} className="ar-poster-frame" title="ARTStronomy AR Poster scanner" src="/ar-poster/index.html?embedded=1" allow="camera" />
        )}
      </div>

      <JourneyOverlay phase={journey.phase}/>
    </section>
  );
}
