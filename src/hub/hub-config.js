import { creatorCount } from '../observatory/content.js';
export const HUB_SCREENS = [
  { id: 'ar', title: 'AR POSTER', action: 'Scan poster', note: 'Print or digital artwork', x: -4.26, z: -1.15, yaw: .17 },
  { id: 'gallery', title: 'VIRTUAL GALLERY', action: 'Enter gallery', note: `${creatorCount} minds in orbit`, x: -1.43, z: -1.56, yaw: .055 },
  { id: 'scanner', title: 'RADIO SCANNER', action: 'Tune in', note: 'Explore creative frequencies', x: 1.43, z: -1.56, yaw: -.055 },
  { id: 'website', title: 'WEBSITE', action: 'Visit website', note: 'The ARTStronomy exhibition', x: 4.26, z: -1.15, yaw: -.17 },
];
export function clampLook(yaw, pitch) {
  return { yaw: Math.max(-.64, Math.min(.64, yaw)), pitch: Math.max(-.25, Math.min(.38, pitch)) };
}
