import { creatorData } from '../cosmic/creators.js';

// The existing verified roster remains the single source for every experience.
export const creators = creatorData;
export const creatorCount = creators.length;
export const disciplines = ['Branding', 'Web Design', 'Publishing', 'Advertising', 'Animation'];
export const animationMedia = ['2D Animation', '3D Animation', 'Mix Media', 'Motion Graphic'];
export const disciplineOf = creator => animationMedia.includes(creator.category) ? 'Animation' : creator.category;
export const creatorsIn = discipline => creators.filter(creator => disciplineOf(creator) === discipline);
export const exhibition = Object.freeze({
  year: '2026', dates: '18–20 December 2026', shortDates: '18–20 DEC 2026',
  hours: '11:00 AM–8:00 PM daily', shortHours: '11 AM–8 PM DAILY',
  venue: 'GMBB · Level 5', city: 'Kuala Lumpur',
  instagram: 'https://www.instagram.com/artstronomy_2026?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==',
});
export const disciplineColors = { Branding: '#ffd400', 'Web Design': '#56c6b5', Publishing: '#a7c2f5', Advertising: '#56c6b5', Animation: '#56c6b5' };
export const projectStatus = creator => creator.projectTitle || 'Project details to be announced';
// Stable coordinates: large touch targets and identical ordering in DOM/list views.
export function clusterPoints(count) {
  return Array.from({ length: count }, (_, index) => ({
    x: 18 + (index % 4) * 21 + (Math.floor(index / 4) % 2) * 3,
    y: 28 + Math.floor(index / 4) * 24 + Math.sin(index * 1.9) * 6,
  }));
}
