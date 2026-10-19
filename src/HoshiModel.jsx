import { createFrameGate } from './performance/render-budget.js';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { createHoshiWave } from "./HoshiWave.js";
import { createHoshiTrail } from "./HoshiTrail.js";

const modelUrl = "/assets/mascot-3d-web.glb";
const AR_MIN_SCALE = 0.16;
const AR_MAX_SCALE = 0.48;

export const HoshiModel = forwardRef(function HoshiModel({
  className = "",
  label = "Interactive 3D model of Hoshi",
  defer = false,
  arOverlay = false,
  showFallback = true,
  enabled = true,
}, ref) {
  const hostRef = useRef(null);
  const arStarterRef = useRef(null);
  const interactionRef = useRef({});
  const [loadState, setLoadState] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(!defer);

  useImperativeHandle(ref, () => ({
    startAR: () => arStarterRef.current?.() ?? Promise.reject(new Error("AR renderer is not ready")),
    rotateBy: (amount) => interactionRef.current.rotateBy?.(amount),
    scaleBy: (amount) => interactionRef.current.scaleBy?.(amount),
    setScale: (amount) => interactionRef.current.setScale?.(amount),
    pulse: () => interactionRef.current.pulse?.(),
    wave: () => interactionRef.current.wave?.(),
    translateBy: (x, z) => interactionRef.current.translateBy?.(x, z),
    translateScreenBy: (x, y) => interactionRef.current.translateScreenBy?.(x, y),
    moveToScreen: (x, y) => interactionRef.current.moveToScreen?.(x, y),
    walkBy: (x, z) => interactionRef.current.walkBy?.(x, z),
    placeAtReticle: () => interactionRef.current.placeAtReticle?.(),
    walkToReticle: () => interactionRef.current.walkToReticle?.(),
  }), []);

  useEffect(() => {
    if (!defer || shouldLoad) return undefined;
    const host = hostRef.current;
    if (!host) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShouldLoad(true),
      { rootMargin: "240px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [defer, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !enabled) return undefined;
    const host = hostRef.current;
    if (!host) return undefined;

    setLoadState("loading");
    setProgress(0);

    let renderer;
    let frame = 0;
    let modelRoot;
    let waveAnimation;
    let disposed = false;
    let resizeObserver;
    let visibilityObserver;
    let isVisible = true;
    let xrActive = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartRotation = 0;
    let dragRotationTarget = 0;
    let dragRotationCurrent = 0;
    let modelScaleTarget = arOverlay ? 0.28 : 1;
    let modelScaleCurrent = modelScaleTarget;
    let modelGroundOffset = 0.86;
    let grounded = false;
    let groundSurfaceY = 0;
    let pulseStartedAt = 0;
    let lastDrawTime = performance.now();
    let walkStartedAt = 0;
    let walkTarget = null;
    let xrReferenceSpace = null;
    let hitTestSource = null;
    let lastHitPoint = null;
    let xrDragging = false;
    let xrDragMoved = false;
    let xrDragStartPoint = null;
    let xrDragStartedAt = 0;
    let transientHitTestSource = null;
    let reticle = null;
    let pointerDownAt = 0;
    let pointerMoved = false;
    let pinchStartDistance = 0;
    let pinchStartScale = 1;
    let pinchStartAngle = 0;
    let pinchStartRotation = 0;
    let dragStartModelX = 0;
    let dragStartModelZ = 0;
    const activePointers = new Map();
    const modelPositionCurrent = new THREE.Vector3();
    const modelPositionTarget = new THREE.Vector3();
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const scene = new THREE.Scene();
    const trail = createHoshiTrail(scene);
    const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 100);
    camera.position.set(0, 0.02, 4.25);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !arOverlay && !window.matchMedia("(max-width: 720px)").matches,
        powerPreference: "high-performance",
        preserveDrawingBuffer: arOverlay,
      });
    } catch {
      setLoadState("error");
      return undefined;
    }

    renderer.setPixelRatio(arOverlay ? 1 : Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.domElement.className = "hoshi-model-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff0cf, 0x1a2554, 1.35));
    const keyLight = new THREE.DirectionalLight(0xffedc0, 2.15);
    keyLight.position.set(3.5, 4.5, 5.5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xa886df, 1.25);
    rimLight.position.set(-4, 1.2, 2.4);
    scene.add(rimLight);
    const fillLight = new THREE.DirectionalLight(0xef4c3c, 0.65);
    fillLight.position.set(2, -3, 2.8);
    scene.add(fillLight);

    const reticleGeometry = new THREE.RingGeometry(0.07, 0.095, 48).rotateX(-Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xf7df36, transparent: true, opacity: 0.92 });
    reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const fitModel = (object) => {
      const bounds = new THREE.Box3().setFromObject(object);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      object.position.sub(center);
      // Keep a safe frame around Hoshi so rotation and floating never crop the model.
      const scale = 1.72 / Math.max(size.x, size.y);
      object.scale.setScalar(scale);
      modelGroundOffset = (size.y * scale) / 2;
    };

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        modelRoot = new THREE.Group();
        waveAnimation = createHoshiWave(gltf.scene);
        fitModel(gltf.scene);
        modelRoot.add(gltf.scene);
        modelRoot.rotation.set(-0.04, -0.08, -0.015);
        if (xrActive) {
          modelPositionCurrent.set(0, -0.2, -2.2);
          modelPositionTarget.copy(modelPositionCurrent);
        } else if (arOverlay) {
          grounded = true;
          groundSurfaceY = -modelGroundOffset;
        }
        modelRoot.position.copy(modelPositionCurrent);
        scene.add(modelRoot);
        setProgress(100);
        setLoadState("ready");
      },
      (event) => {
        if (event.total > 0) {
          const nextProgress = Math.min(99, Math.round((event.loaded / event.total) * 100));
          setProgress((current) => (nextProgress - current >= 10 ? nextProgress : current));
        }
      },
      () => {
        if (!disposed) setLoadState("error");
      },
    );

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const triggerPulse = () => {
      pulseStartedAt = performance.now();
    };
    const scaleBy = (amount) => {
      modelScaleTarget = THREE.MathUtils.clamp(modelScaleTarget * amount, AR_MIN_SCALE, AR_MAX_SCALE);
      if (grounded) {
        const groundedY = groundSurfaceY + modelGroundOffset * modelScaleTarget;
        modelPositionTarget.y = groundedY;
        if (walkTarget) walkTarget.y = groundedY;
      }
    };
    const setScale = (amount) => {
      modelScaleTarget = THREE.MathUtils.clamp(amount, AR_MIN_SCALE, AR_MAX_SCALE);
      if (grounded) {
        const groundedY = groundSurfaceY + modelGroundOffset * modelScaleTarget;
        modelPositionTarget.y = groundedY;
        if (walkTarget) walkTarget.y = groundedY;
      }
    };
    const setGroundPosition = (x, surfaceY, z, immediate = false) => {
      walkTarget = null;
      grounded = true;
      groundSurfaceY = surfaceY;
      modelPositionTarget.set(x, surfaceY + modelGroundOffset * modelScaleTarget, z);
      if (immediate) modelPositionCurrent.copy(modelPositionTarget);
    };
    const translateBy = (x, z) => {
      walkTarget = null;
      if (xrActive && lastHitPoint && !grounded) {
        grounded = true;
        groundSurfaceY = lastHitPoint.y;
        modelPositionTarget.y = groundSurfaceY + modelGroundOffset * modelScaleTarget;
        modelPositionCurrent.y = modelPositionTarget.y;
      }
      modelPositionTarget.x += x;
      modelPositionTarget.z += z;
    };
    const getScreenBounds = () => {
      const cameraDistance = Math.max(1, Math.abs(camera.position.z - modelPositionTarget.z));
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * cameraDistance;
      return {
        x: Math.max(0.28, halfHeight * camera.aspect * 0.88),
        y: Math.max(0.42, halfHeight * 0.84),
      };
    };
    const translateScreenBy = (x, y) => {
      const bounds = getScreenBounds();
      grounded = false;
      walkTarget = null;
      modelPositionTarget.x = THREE.MathUtils.clamp(modelPositionTarget.x + x, -bounds.x, bounds.x);
      modelPositionTarget.y = THREE.MathUtils.clamp(modelPositionTarget.y + y, -bounds.y, bounds.y);
      modelPositionTarget.z = 0;
    };
    const moveToScreen = (x, y) => {
      const bounds = getScreenBounds();
      grounded = false;
      walkTarget = null;
      modelPositionTarget.set(
        THREE.MathUtils.clamp(x, -1, 1) * bounds.x,
        THREE.MathUtils.clamp(y, -1, 1) * bounds.y,
        0,
      );
    };
    const walkTo = (target) => {
      walkTarget = target.clone();
      walkStartedAt = performance.now();
    };
    const walkBy = (x, z) => {
      const target = modelPositionTarget.clone();
      target.x += x;
      target.z += z;
      walkTo(target);
    };
    const pointOnSurface = (point) => new THREE.Vector3(
      point.x,
      point.y + modelGroundOffset * modelScaleTarget,
      point.z,
    );
    const walkToReticle = () => {
      if (!lastHitPoint) return;
      if (!grounded) {
        setGroundPosition(lastHitPoint.x, lastHitPoint.y, lastHitPoint.z, true);
        return;
      }
      walkTo(pointOnSurface(lastHitPoint));
    };
    interactionRef.current = {
      rotateBy: (amount) => { dragRotationTarget += amount; },
      scaleBy,
      setScale,
      pulse: triggerPulse,
      wave: () => waveAnimation?.play(),
      translateBy,
      translateScreenBy,
      moveToScreen,
      walkBy,
      placeAtReticle: () => {
        if (lastHitPoint) setGroundPosition(lastHitPoint.x, lastHitPoint.y, lastHitPoint.z, true);
      },
      walkToReticle,
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activePointers.size === 1) {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragStartRotation = dragRotationTarget;
        dragStartModelX = modelPositionTarget.x;
        dragStartModelZ = modelPositionTarget.z;
        pointerDownAt = performance.now();
        pointerMoved = false;
      } else if (activePointers.size === 2) {
        const [first, second] = [...activePointers.values()];
        pinchStartDistance = Math.hypot(second.x - first.x, second.y - first.y);
        pinchStartScale = modelScaleTarget;
        pinchStartAngle = Math.atan2(second.y - first.y, second.x - first.x);
        pinchStartRotation = dragRotationTarget;
        isDragging = false;
      }
      host.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
      const rect = host.getBoundingClientRect();
      if (activePointers.size >= 2) {
        const [first, second] = [...activePointers.values()];
        const distance = Math.hypot(second.x - first.x, second.y - first.y);
        if (pinchStartDistance > 0) {
          modelScaleTarget = THREE.MathUtils.clamp(
            pinchStartScale * (distance / pinchStartDistance),
            AR_MIN_SCALE,
            AR_MAX_SCALE,
          );
        }
        const angle = Math.atan2(second.y - first.y, second.x - first.x);
        dragRotationTarget = pinchStartRotation + angle - pinchStartAngle;
        pointerMoved = true;
        return;
      }
      if (isDragging) {
        const dragX = event.clientX - dragStartX;
        const dragY = event.clientY - dragStartY;
        if (arOverlay) {
          walkTarget = null;
          modelPositionTarget.x = dragStartModelX + (dragX / rect.width) * 1.8;
          modelPositionTarget.z = dragStartModelZ + (dragY / rect.height) * 1.8;
        } else {
          dragRotationTarget = dragStartRotation + (dragX / rect.width) * Math.PI * 2;
        }
        if (Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY) > 7) pointerMoved = true;
        return;
      }
      if (reducedMotion) return;
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.28;
    };
    const onPointerUp = (event) => {
      const wasTap = arOverlay && activePointers.size === 1 && !pointerMoved && performance.now() - pointerDownAt < 420;
      activePointers.delete(event.pointerId);
      isDragging = false;
      if (wasTap) {
        const rect = host.getBoundingClientRect();
        const tapX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.65;
        const tapZ = ((event.clientY - rect.top) / rect.height - 0.5) * 1.5;
        walkBy(tapX, tapZ);
      }
      if (activePointers.size === 1) {
        const [remaining] = activePointers.values();
        dragStartX = remaining.x;
        dragStartY = remaining.y;
        dragStartRotation = dragRotationTarget;
      }
      if (host.hasPointerCapture?.(event.pointerId)) host.releasePointerCapture(event.pointerId);
    };
    const onWheel = (event) => {
      if (!arOverlay) return;
      event.preventDefault();
      scaleBy(event.deltaY > 0 ? 0.92 : 1.08);
    };
    const onPointerLeave = () => pointerTarget.set(0, 0);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("wheel", onWheel, { passive: false });

    const startedAt = performance.now();
    const walkDirection = new THREE.Vector3();
    const draw = (time, xrFrame) => {
      if (disposed) return;
      const deltaTime = Math.min((time - lastDrawTime) / 1000, 0.05);
      lastDrawTime = time;

      if (xrActive && xrFrame && hitTestSource && xrReferenceSpace) {
        const hitResults = xrFrame.getHitTestResults(hitTestSource);
        if (hitResults.length > 0) {
          const pose = hitResults[0].getPose(xrReferenceSpace);
          if (pose) {
            reticle.visible = true;
            reticle.matrix.fromArray(pose.transform.matrix);
            lastHitPoint = new THREE.Vector3(
              pose.transform.position.x,
              pose.transform.position.y,
              pose.transform.position.z,
            );
            if (xrDragging) {
              const movedDistance = xrDragStartPoint ? lastHitPoint.distanceTo(xrDragStartPoint) : 0;
              if (movedDistance > 0.025 || performance.now() - xrDragStartedAt > 140) {
                xrDragMoved = true;
                setGroundPosition(lastHitPoint.x, lastHitPoint.y, lastHitPoint.z, true);
              }
            }
          }
        } else {
          reticle.visible = false;
        }
      }

      pointerCurrent.lerp(pointerTarget, 0.07);
      dragRotationCurrent += (dragRotationTarget - dragRotationCurrent) * 0.12;
      modelScaleCurrent += (modelScaleTarget - modelScaleCurrent) * 0.12;
      if (modelRoot) {
        waveAnimation?.update(deltaTime);
        const elapsed = (time - startedAt) / 1000;
        const pulseElapsed = pulseStartedAt ? (time - pulseStartedAt) / 900 : 1;
        const pulseStrength = pulseElapsed < 1 ? Math.sin(pulseElapsed * Math.PI) * (1 - pulseElapsed) : 0;
        if (pulseElapsed >= 1) pulseStartedAt = 0;
        let walking = false;
        if (walkTarget) {
          walkDirection.subVectors(walkTarget, modelPositionCurrent);
          const distance = walkDirection.length();
          if (distance > 0.018) {
            walking = true;
            walkDirection.normalize();
            const step = Math.min(distance, deltaTime * 0.52);
            modelPositionCurrent.addScaledVector(walkDirection, step);
            dragRotationTarget = Math.atan2(walkDirection.x, walkDirection.z);
          } else {
            modelPositionCurrent.copy(walkTarget);
            modelPositionTarget.copy(walkTarget);
            walkTarget = null;
          }
        } else {
          modelPositionCurrent.lerp(modelPositionTarget, xrDragging ? 1 : 0.18);
        }
        const walkingPhase = (time - walkStartedAt) / 85;
        const walkingBob = walking ? Math.abs(Math.sin(walkingPhase)) * 0.055 : 0;
        const walkingTilt = walking ? Math.sin(walkingPhase * 0.5) * 0.055 : 0;
        modelRoot.rotation.y = -0.08 + dragRotationCurrent + pointerCurrent.x + (reducedMotion ? 0 : Math.sin(elapsed * 0.38) * 0.055);
        modelRoot.rotation.x = -0.04 - pointerCurrent.y + walkingTilt;
        modelRoot.rotation.z = -0.015 + pulseStrength * Math.sin(pulseElapsed * Math.PI * 5) * 0.12 + walkingTilt * 0.45;
        modelRoot.scale.setScalar(modelScaleCurrent * (1 + pulseStrength * 0.18));
        modelRoot.position.copy(modelPositionCurrent);
        modelRoot.position.y += walkingBob + (walking || reducedMotion ? 0 : Math.sin(elapsed * 0.72) * 0.035);
        trail.update(modelPositionCurrent, modelScaleCurrent, deltaTime, modelRoot.visible, reducedMotion);
      }
      renderer.render(scene, camera);
    };
    const frameGate=createFrameGate();
    const renderFrame = (time) => {
      if(frameGate.due(time))draw(time);
      if (!disposed && isVisible && !xrActive) frame = requestAnimationFrame(renderFrame);
    };
    const resume = () => {
      if (!disposed && isVisible && !xrActive && !frame) frame = requestAnimationFrame(renderFrame);
    };
    const pause = () => {
      frameGate.reset();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) resume();
        else pause();
      },
      { rootMargin: "120px" },
    );
    visibilityObserver.observe(host);
    resume();

    arStarterRef.current = async () => {
      if (!navigator.xr?.requestSession) throw new Error("WebXR AR is unavailable");
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["local-floor", "light-estimation", "dom-overlay"],
        domOverlay: { root: document.body },
      });
      pause();
      xrActive = true;
      renderer.xr.enabled = true;
      try {
        renderer.xr.setReferenceSpaceType("local");
        await renderer.xr.setSession(session);
        xrReferenceSpace = await session.requestReferenceSpace("local");
        const viewerSpace = await session.requestReferenceSpace("viewer");
        hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
        if (session.requestHitTestSourceForTransientInput) {
          transientHitTestSource = await session.requestHitTestSourceForTransientInput({
            profile: "generic-touchscreen",
          }).catch(() => null);
        }
        grounded = false;
        lastHitPoint = null;
        reticle.visible = false;
        modelPositionCurrent.set(0, -0.2, -2.2);
        modelPositionTarget.copy(modelPositionCurrent);
        if (modelRoot) modelRoot.position.copy(modelPositionCurrent);
        renderer.setAnimationLoop(draw);
      } catch (error) {
        renderer.xr.enabled = false;
        xrActive = false;
        await session.end().catch(() => undefined);
        resume();
        throw error;
      }

      const transientPointFromEvent = (event) => {
        if (!transientHitTestSource || !event.frame?.getHitTestResultsForTransientInput) return null;
        const groups = event.frame.getHitTestResultsForTransientInput(transientHitTestSource);
        const matchingGroup = groups.find((group) => group.inputSource === event.inputSource) ?? groups[0];
        const pose = matchingGroup?.results?.[0]?.getPose(xrReferenceSpace);
        return pose ? new THREE.Vector3(
          pose.transform.position.x,
          pose.transform.position.y,
          pose.transform.position.z,
        ) : null;
      };
      const onSelectStart = () => {
        xrDragging = true;
        xrDragMoved = false;
        xrDragStartedAt = performance.now();
        xrDragStartPoint = lastHitPoint?.clone() ?? null;
      };
      const onSelectEnd = () => { xrDragging = false; };
      const onSelect = (event) => {
        const selectedPoint = transientPointFromEvent(event) ?? lastHitPoint;
        if (!selectedPoint) {
          triggerPulse();
          return;
        }
        lastHitPoint = selectedPoint.clone();
        if (xrDragMoved) {
          xrDragMoved = false;
          return;
        }
        if (!grounded) setGroundPosition(selectedPoint.x, selectedPoint.y, selectedPoint.z, true);
        else walkTo(pointOnSurface(selectedPoint));
      };
      session.addEventListener("selectstart", onSelectStart);
      session.addEventListener("selectend", onSelectEnd);
      session.addEventListener("select", onSelect);
      session.addEventListener("end", () => {
        renderer.setAnimationLoop(null);
        renderer.xr.enabled = false;
        xrActive = false;
        hitTestSource?.cancel?.();
        transientHitTestSource?.cancel?.();
        hitTestSource = null;
        transientHitTestSource = null;
        xrReferenceSpace = null;
        lastHitPoint = null;
        reticle.visible = false;
        xrDragging = false;
        xrDragMoved = false;
        grounded = false;
        walkTarget = null;
        modelPositionCurrent.set(0, 0, 0);
        modelPositionTarget.set(0, 0, 0);
        if (modelRoot) modelRoot.position.copy(modelPositionCurrent);
        resume();
      }, { once: true });
      return session;
    };

    return () => {
      disposed = true;
      arStarterRef.current = null;
      interactionRef.current = {};
      pause();
      renderer.setAnimationLoop(null);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("wheel", onWheel);
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => value?.isTexture && value.dispose());
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [arOverlay, enabled, shouldLoad]);

  return (
    <div
      ref={hostRef}
      className={`hoshi-model ${className} ${loadState === "ready" ? "is-ready" : ""}`}
      role="img"
      aria-label={label}
    >
      {showFallback && <img className="hoshi-model-fallback" src="/assets/hoshi-mascot.webp" alt="" decoding="async" />}
      {shouldLoad && loadState === "loading" && (
        <span className="hoshi-model-status" role="status">Loading 3D Hoshi · {progress}%</span>
      )}
      {loadState === "error" && (
        <span className="hoshi-model-status" role="status">3D preview unavailable</span>
      )}
    </div>
  );
});
