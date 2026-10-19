export const openingLines = ['22 CREATORS', '5 DISCIPLINE', 'ONE UNIVERSAL'];
const destinations = {
  ar: ['SCAN THE ART', 'SHIFT REALITY', 'AR POSTER'],
  gallery: ['LEAVE ORBIT', 'ENTER THE ART', 'VIRTUAL GALLERY'],
  scanner: ['TUNE IN', 'FIND A SIGNAL', 'RADIO SCANNER'],
  website: ['MEET THE MINDS', 'EXPLORE THE WORK', 'ARTSTRONOMY'],
  station: ['COURSE RESET', 'HOMEWARD BOUND', 'BACK TO SHIP'],
};
export function journeyLines(destination) {
  return destinations[destination] || destinations.station;
}
