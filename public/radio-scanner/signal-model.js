// Fictional exhibition radio band, MHz. These are not received astronomical data.
export const BAND = Object.freeze({ min: 1200, max: 1700 });
export const LOCK_RADIUS = 5;
export const LOCK_DELAY = 700;
export const clampFrequency = value => Math.min(BAND.max, Math.max(BAND.min, Number(value) || BAND.min));
export const normalizeFrequency = value => (clampFrequency(value) - BAND.min) / (BAND.max - BAND.min);
export function makeBeacons(creators) {
  return creators.map((creator, index) => ({ ...creator, index,
    frequency: BAND.min + (index + 1) * (BAND.max - BAND.min) / (creators.length + 1),
    code: `ART-${String(index + 1).padStart(2, '0')}`,
  }));
}
export function nearestBeacon(beacons, frequency) {
  let result = null, distance = Infinity;
  for (const beacon of beacons) {
    const next = Math.abs(beacon.frequency - frequency);
    if (next < distance) { result = beacon; distance = next; }
  }
  return { beacon: result, distance };
}

// UI-only tuning proximity, never camera confidence or physical LiDAR data.
export function signalMatch(beacons, frequency) {
  if (!beacons.length) return 0;
  const {distance} = nearestBeacon(beacons, clampFrequency(frequency));
  const reach = (BAND.max-BAND.min)/(beacons.length+1);
  return Math.round(Math.max(0,Math.min(1,1-distance/reach))*100);
}
