// Museum-only route. Other destination timelines remain unchanged.
export const DOCKING_KINDS=new Set(['depart','warp','approach','dock','airlock','museum-arrival','undock']);
export function museumArrival(){return [
 {kind:'depart',duration:600,mode:'station'},
 {kind:'warp',duration:1000},
 {kind:'approach',duration:1500},
 {kind:'dock',duration:650},
 {kind:'airlock',duration:1150},
 {kind:'museum-arrival',duration:1000,mode:'gallery'},
];}
export function museumReturn(){return [
 {kind:'fade',duration:180},
 {kind:'airlock',duration:900,mode:'station',reverse:true},
 {kind:'undock',duration:1100},
 {kind:'arrival',duration:600,mode:'station'},
];}
export const dockingCopy={depart:'Departure clearance received',warp:'Transfer to the orbital museum',approach:'Aligning with museum docking collar',dock:'Docking clamps engaged',airlock:'Equalising airlock pressure','museum-arrival':'Welcome to the Orbital Art Museum',undock:'Returning to the command station'};
