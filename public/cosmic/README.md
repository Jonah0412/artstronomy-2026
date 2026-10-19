# ARTStronomy Star Observatory

A vanilla JavaScript / Three.js viewport with 22 creator stars, five category
orbits, camera focus, a magnifying cosmic lens, and optional webcam hand input.
The React website uses the same renderer through `src/CosmicViewport.jsx`.
This is a web implementation of the requested real-time visual direction; it is
not a TouchDesigner `.toe` project and does not need TouchDesigner installed.

## Use on GitHub Pages

Download and extract `artstronomy-cosmic-embed.zip`. Put the contents of its
`cosmic` directory in your Pages publishing folder. Open `index.html` through
GitHub Pages (HTTPS). No server application, API key, paid service, installation,
or build command is required for this standalone version. Keep the `vendor`
and `mediapipe` directories beside the HTML file. Avoid opening via `file://`:
browser modules and camera access need an HTTP(S) origin.

## Embed in an existing page

```html
<link rel="stylesheet" href="./cosmic/cosmic-viewport.css">
<script type="importmap">
{"imports":{"three":"./cosmic/vendor/three.module.js"}}
</script>
<div id="camera-viewport" style="position:relative;height:80vh;min-height:480px"></div>
<script type="module">
  import { mountCosmicViewport } from './cosmic/cosmic-viewport.js';
  import { creatorData } from './cosmic/creators.js';
  const viewport = mountCosmicViewport(document.querySelector('#camera-viewport'), {
    creators: creatorData
  });
  // On route change or component unmount:
  // viewport.destroy();
</script>
```

If your page already has an import map, add `three` to it instead of creating a
second one. The included HTML also demonstrates the optional camera adapter.
The main website bundles Three.js; the standalone version self-hosts the same
free library. An alternative CDN import map is:
`"three": "https://unpkg.com/three@0.185.1/build/three.module.js"`.

## Files

- `index.html`: HTML structure, camera opt-in, JavaScript initialization.
- `cosmic-viewport.css`: scoped HUD, glass panels, responsive console styles.
- `cosmic-viewport.js`: vanilla renderer, custom inertia controls, lens shader,
  hand input API and lifecycle cleanup.
- `creators.js`: verified names/categories. Add `projectTitle` when approved.
- `hand-tracking.js`: optional self-hosted MediaPipe adapter.
- `vendor/`: free Three.js and MediaPipe JavaScript; notices included.
- `mediapipe/`: hand model and WASM runtime.

## Controls

- Drag / arrow keys: rotate; idle rotation resumes after interaction.
- Hover: read name, project title, category and sector coordinates.
- Click/tap a star or choose a creator from the dropdown: smoothly focus.
- Cosmic Lens: move a circular inspection lens over the scene. True UV
  magnification reveals a separate 3D polar grid and wireframe layer.
- Wheel, two-finger pinch, or +/−: change the active zoom from 1.0× to 4.0×.
- Reset view / Escape (canvas focused): return to the full galaxy.
- Enable camera: point to move the cursor; pinch or hold over a star to select.
  Hand movement also steers the galaxy while in Orbit mode. Use the onscreen
  mode buttons for switching to the lens.

## Data and performance

Coordinates describe this designed exhibition space, not an astronomical chart.
Student project titles have not been supplied: the UI says they are awaiting
announcement rather than inventing them. Animation includes all four supplied
animation specialties in one shared orbital category.

No camera images are uploaded or stored. Mouse/touch exploration works without
camera permission. Hand inference runs at approximately 12 Hz on the CPU;
rendering uses requestAnimationFrame independently. 60 fps is a target, not a
guarantee; test on the actual exhibition computer and camera. The renderer caps
pixel density, reduces it when frames are slow, uses 850–1500 dust points, pauses
rendering while hidden/offscreen, and respects reduced motion. WebGL2 is needed.

`destroy()` stops animation, removes event listeners, disconnects observers and
disposes geometries, materials, textures, render targets and the WebGL context.
Stop the hand adapter and camera tracks when the host closes. The supplied
React wrapper and standalone HTML demonstrate that cleanup.
