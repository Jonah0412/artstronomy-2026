// A playful preference match, not a personality assessment. Each discipline has
// four primary answers; all five results are reachable without random tie-breaks.
export const ORBITS = {
  Branding: { line: 'You make a lasting impression.', description: 'You notice the little details that make something unmistakable. Colour, character and identity belong in your creative universe.', points: [[20,62],[35,25],[61,19],[80,49],[56,77],[20,62],[61,19]], emotion: 0 },
  'Web Design': { line: 'You connect the dots.', description: 'Curiosity leads the way. You love discovering how things work and turning a small interaction into a great experience.', points: [[18,33],[48,20],[78,34],[68,72],[36,80],[18,33],[68,72],[48,20]], emotion: 1 },
  Publishing: { line: 'You see a story in everything.', description: 'You enjoy slowing down, exploring details and finding a rhythm between words and images. Your ideas deserve another page.', points: [[15,30],[48,42],[84,25],[78,70],[48,82],[20,67],[15,30],[48,42],[48,82]], emotion: 2 },
  Advertising: { line: 'You spark the conversation.', description: 'You follow bold ideas with something to say. A surprising message, a fresh perspective, a moment people remember—that is your orbit.', points: [[23,76],[40,47],[29,23],[78,20],[58,46],[70,75],[40,47],[58,46]], emotion: 3 },
  Animation: { line: 'You bring imagination to life.', description: 'Movement, emotion and imaginary worlds catch your eye. You see the magic in characters and stories that keep unfolding.', points: [[18,58],[38,19],[55,44],[83,27],[74,74],[45,83],[18,58],[55,44],[74,74]], emotion: 3 },
};
// [label, short visual cue, icon, primary orbit, secondary orbit]
export const QUESTIONS = [
  { title: 'What catches your eye first?', hint: 'Go with your first instinct.', choices: [
    ['A striking identity','Colours that belong together','identity','Branding','Advertising'],
    ['A clever interaction','Something you want to explore','cursor','Web Design','Animation'],
    ['A beautiful page','Type, images and a little order','pages','Publishing','Branding'],
    ['A character with personality','A whole world in one expression','motion','Animation','Publishing'],
  ]},
  { title: 'How would you invite people in?', hint: 'Your idea is ready to meet the world.', choices: [
    ['Make them look twice','One unexpected message','spark','Advertising','Branding'],
    ['Give it a signature look','A style they will remember','identity','Branding','Web Design'],
    ['Let them play with it','Discover by doing','cursor','Web Design','Animation'],
    ['Tell a story worth keeping','Something to read and revisit','pages','Publishing','Advertising'],
  ]},
  { title: 'Pick your creative playground.', hint: 'Where would you happily lose an afternoon?', choices: [
    ['A world in motion','Characters, scenes and movement','motion','Animation','Web Design'],
    ['A wall of big ideas','Headlines that stop you scrolling','spark','Advertising','Publishing'],
    ['A colour-and-shape studio','Experiment until it feels just right','identity','Branding','Animation'],
    ['An interactive space','Buttons, journeys and discoveries','cursor','Web Design','Branding'],
  ]},
  { title: 'What feeling should your work leave?', hint: 'Imagine someone experiencing your idea.', choices: [
    ['“Just one more page.”','Draw them into the details','pages','Publishing','Web Design'],
    ['“I felt that.”','A character that stays with them','motion','Animation','Advertising'],
    ['“I need to share this.”','An idea that starts a conversation','spark','Advertising','Animation'],
    ['“That is so you.”','A personality they recognise','identity','Branding','Publishing'],
  ]},
  { title: 'One final touch. What do you add?', hint: 'Your constellation is almost complete.', choices: [
    ['A delightful interaction','A tiny discovery for the curious','cursor','Web Design','Publishing'],
    ['A thoughtful ending','The last page feels complete','pages','Publishing','Animation'],
    ['A little movement','A small moment of magic','motion','Animation','Branding'],
    ['An unforgettable line','Say more with fewer words','spark','Advertising','Web Design'],
  ]},
];
export function matchOrbit(answers) {
  if (answers.length !== QUESTIONS.length || answers.some((answer,i) => !Number.isInteger(answer) || !QUESTIONS[i].choices[answer])) return null;
  const scores = Object.fromEntries(Object.keys(ORBITS).map(name => [name,0]));
  answers.forEach((answer,i) => { const choice=QUESTIONS[i].choices[answer]; scores[choice[3]]+=3; scores[choice[4]]+=1; });
  const best=Math.max(...Object.values(scores));
  // For a tie, prefer the most recent primary preference among tied orbits.
  for(let i=answers.length-1;i>=0;i--){const orbit=QUESTIONS[i].choices[answers[i]][3];if(scores[orbit]===best)return orbit;}
  return Object.keys(scores).find(orbit=>scores[orbit]===best);
}
export function creatorsForOrbit(creators,orbit) {
  return creators.filter(creator => orbit === 'Animation'
    ? ['Mix Media','3D Animation','2D Animation'].includes(creator.category)
    : creator.category === orbit);
}
