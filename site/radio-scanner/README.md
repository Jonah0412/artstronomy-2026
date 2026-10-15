# ARTStronomy — Deep-Sky Radio Spectrogram & Cosmic Audio Scanner

Free, client-side HTML + CSS + JavaScript. No frameworks, CDNs, paid libraries,
audio files, server application, keys, microphone access or build step required.
The website camera viewport uses this same vanilla module through a small React
wrapper. This is a browser implementation; TouchDesigner is not required.

## GitHub Pages

Unzip `artstronomy-radio-scanner.zip`, then publish the contents of `radio-scanner`
as your GitHub Pages folder. Open its `index.html` through the HTTPS Pages URL.
All paths are relative, so repository subfolder URLs work. Use HTTP(S), not a
`file://` URL, because the code uses browser ES modules.

## Embed

```html
<link rel="stylesheet" href="./radio-scanner/radio-scanner.css">
<div id="camera-viewport" style="position:relative;height:85vh;min-height:500px"></div>
<script type="module">
  import { mountRadioScanner } from './radio-scanner/radio-scanner.js';
  import { creatorData } from './radio-scanner/creators.js';
  const scanner = mountRadioScanner(document.querySelector('#camera-viewport'), {
    creators: creatorData
  });
  // On route change / unmount: scanner.destroy();
</script>
```

## Modules

- `index.html`: container, stylesheet, initialization and page cleanup.
- `radio-scanner.css`: responsive observatory layout and controls.
- `radio-scanner.js`: Canvas spectrum, simulated RF waterfall, radar, waveform,
  drag tuning, beacon lock, metadata and a focused two-column discovery interface.
- `cosmic-audio.js`: Web Audio oscillator drone, filtered generated noise,
  harmonic tones, waveshaped pulsar clicks, analyser, master mute and teardown.
- `signal-model.js`: virtual band limits, beacon allocation and metadata text.
- `creators.js`: verified 22-student roster. `assets/` contains the existing
  category artwork used until individual project images are supplied.

## Interaction and audio

Drag the spectrum or frequency slider. Hold within 5 MHz of a beacon for 700 ms
to lock; clicking a beacon, the previous/next controls, or the student dropdown
provides a direct alternative. A native range slider supports keyboard tuning.
Static fades into a harmonic signature and the student details decode on lock.

Audio starts muted. An AudioContext is created/resumed only after an explicit
button click. Use the AUDIO FEED ENABLED / MUTED control and volume slider.
The page mutes when hidden, and closing the view stops sources, closes the
AudioContext, and releases observers/listeners/render loops.
The scope waveform reads the actual synthesized audio analyser when audio is
on; it uses a labelled visual simulation while muted.

The 1.200–1.700 GHz band, radar positions, noise and pulsars are designed
exhibition signals, not received RF, real CMB measurements or astronomical data.
Those virtual radio frequencies are mapped to audible oscillator frequencies.
The waterfall visualizes the simulated radio band; it is not an audio FFT plotted
with GHz labels. No audio files are downloaded or recorded.

## Approved content

The current roster supplies names/categories and shared category artwork only.
To add approved content, extend each record:

```js
{
  id: 'existing-student-id', name: 'Confirmed student name', category: 'Branding',
  image: './assets/project-graphic-design.webp',
  projectTitle: 'Approved project title',
  projectThumbnail: './assets/approved-project-thumbnail.webp'
}
```

Until supplied, titles and individual project images are clearly marked pending.
The standalone version uses mouse, touch and keyboard. The integrated website
also keeps its existing optional MediaPipe webcam hand input: horizontal hand
movement tunes the dial. Hosts can connect their own input with
`scanner.setHand({x: 0.5, y: 0.5})` (normalized 0–1 coordinates).

## Performance and validation

Canvas pixel density is capped at 1.5. The waterfall history is 256×128 pixels
updated at 20 Hz; visual rendering uses requestAnimationFrame. Rendering pauses
when hidden/offscreen, and ambient sweeps respect reduced motion. No WebGL is
required. Hardware/browser audio behavior still needs testing on the exhibition
computer. Desktop browser build checks alone cannot guarantee a specific fps.

Hand control in the integrated site: hold an index–thumb pinch and move horizontally to tune. An open hand, fist, or loss of tracking releases the frequency. Each new pinch grabs the current frequency without jumping.
