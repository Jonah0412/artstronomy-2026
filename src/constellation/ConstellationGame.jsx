import { useEffect, useRef, useState } from 'react';
import {animate, createScope, stagger} from 'animejs';
import { ORBITS, QUESTIONS, matchOrbit } from './game-model.js';
import './constellation-game.css';

const emotions=['happy','surprised','shy','excited'];
const reactions=['Ooh, I like your style!','A little unexpected. I love it!','A thoughtful choice.','Now that is creative energy!'];
function ChoiceIcon({kind}){
  const paths={identity:'M6 5h12v12H6z M11 10h12v12H11z',cursor:'M7 4v20l5-6 5 8 4-3-5-7 8-1z',pages:'M4 5h8l4 3 4-3h8v19h-8l-4 3-4-3H4z M16 8v19 M7 10h4 M7 14h4 M21 10h4 M21 14h4',motion:'M5 7h22v20H5z M5 12h22 M11 7v5 M20 7v5 M13 16l7 4-7 4z',spark:'M16 3l3 9 10 4-10 3-3 10-4-10-9-3 9-4z'};
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d={paths[kind]} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/></svg>;
}
function Constellation({orbit}){
  const points=ORBITS[orbit].points;
  return <svg className="constellation-game__map" viewBox="0 0 100 100" role="img" aria-label={`${orbit} creative constellation`}><circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" opacity=".15"/><polyline points={points.map(p=>p.join(',')).join(' ')} fill="none" stroke="currentColor" strokeWidth=".6"/>{points.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="3" fill="currentColor" opacity=".12"/><circle cx={x} cy={y} r="1.1" fill="#f7df36"/></g>)}</svg>;
}
const suggestions={
 Branding:['Explore visual identity and logo systems','Try a moodboard of colours, type and shapes','Create a consistent look for something you love'],
 'Web Design':['Explore interactive storytelling and user journeys','Sketch a simple app or website flow','Make one small interaction feel delightful'],
 Publishing:['Explore editorial design, books and zines','Pair expressive typography with images','Design a short story across a few pages'],
 Advertising:['Explore campaign ideas and persuasive messages','Turn an everyday observation into a headline','Find a surprising way to share a meaningful idea'],
 Animation:['Explore 2D Animation, 3D Animation, Mix Media and Motion Graphic','Sketch a character or storyboard a tiny scene','Bring a shape, feeling or story to life'],
};
export default function ConstellationGame() {
  const [step,setStep]=useState(0),[answers,setAnswers]=useState([]),[finished,setFinished]=useState(false);
  const playRef=useRef(null),fitRef=useRef(null);
  const [saving,setSaving]=useState(false),[notice,setNotice]=useState(''),[cardUrl,setCardUrl]=useState('');
  const cardUrlRef=useRef('');
  const heading=useRef(null),interacted=useRef(false),alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;if(cardUrlRef.current)URL.revokeObjectURL(cardUrlRef.current);};},[]);
  useEffect(()=>{if(interacted.current)heading.current?.focus({preventScroll:true});},[step,finished]);
  const selected=answers[step],question=QUESTIONS[step],orbit=finished?matchOrbit(answers):null;
  const meta=orbit?ORBITS[orbit]:null;
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const scope=createScope({root:playRef}).add(()=>{
      animate('.constellation-game__choice, .constellation-game__result-heading, .constellation-game__fit',{opacity:[0,1],translateY:[16,0],delay:stagger(45),duration:420,ease:'out(3)'});
    });
    return()=>scope.revert();
  },[step,finished]);
  const emotion=meta?meta.emotion:selected===undefined?0:selected;
  function choose(index){setAnswers(previous=>{const next=[...previous];next[step]=index;return next;});setNotice('');}
  function next(){if(selected===undefined)return;interacted.current=true;if(step===QUESTIONS.length-1)setFinished(true);else setStep(step+1);}
  function reset(){interacted.current=true;setAnswers([]);setStep(0);setFinished(false);setNotice('');if(cardUrlRef.current)URL.revokeObjectURL(cardUrlRef.current);cardUrlRef.current='';setCardUrl('');}
  async function download(){
    setSaving(true);setNotice('');
    try{
      const {createOrbitCard}=await import('./share-card.js');
      const blob=await createOrbitCard(orbit);
      if(!alive.current)return;
      if(cardUrlRef.current)URL.revokeObjectURL(cardUrlRef.current);
      const url=URL.createObjectURL(blob);cardUrlRef.current=url;setCardUrl(url);
      const link=document.createElement('a');link.href=url;link.download=`ARTStronomy-${orbit.replaceAll(' ','-')}-Orbit.png`;document.body.append(link);link.click();link.remove();
      setNotice('Card ready! If the download did not start, use Save PNG below.');
    }catch{if(alive.current)setNotice('The image could not be saved. Please try Download Card again.');}
    finally{if(alive.current)setSaving(false);}
  }
  return <section className={`constellation-game ${finished?'is-result':''}`} id="creative-constellation" aria-label="Find Your Creative Constellation">
    <div className="constellation-game__intro">
      <p className="constellation-game__eyebrow">A LITTLE COSMIC SELF-DISCOVERY</p>
      <h2>FIND YOUR<br/>CREATIVE<br/><span>CONSTELLATION.</span></h2>
      <p>Five quick choices. Follow your instincts.<br/>{' '}Find the creative orbit that feels like you.</p>
      <div className="constellation-game__hoshi-stage">
        <span className="constellation-game__small-star" aria-hidden="true">✦</span>
        <div className="constellation-game__hoshi" role="img" aria-label={`${emotions[emotion]} Hoshi`} style={{'--emotion-position':`${emotion*100/3}%`}}/>
        <span className="constellation-game__speech">{finished?'Your stars have aligned!':selected===undefined?'No wrong answers. Just you.':reactions[emotion]}</span>
      </div>
      <span className="constellation-game__time">✦ ABOUT 30 SECONDS · JUST FOR FUN</span>
    </div>
    <div ref={playRef} className="constellation-game__play">
    {!finished?<>
      <div className="constellation-game__progress-label"><span>YOUR CREATIVE SIGNAL</span><span>0{step+1} / 05</span></div>
      <div className="constellation-game__progress" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={step} aria-valuetext={`Question ${step+1} of 5`}>{QUESTIONS.map((_,i)=><span key={i} className={i<=step?'is-lit':''}/>)}</div>
      <h3 ref={heading} tabIndex={-1} id="constellation-question">{question.title}</h3><p className="constellation-game__hint">{question.hint}</p>
      <fieldset className="constellation-game__choices" aria-labelledby="constellation-question"><legend className="constellation-game__sr">Choose one answer</legend>{question.choices.map(([label,cue,icon],i)=><label key={`${step}-${i}`} className={`constellation-game__choice ${selected===i?'is-selected':''}`}><input type="radio" name={`creative-question-${step}`} checked={selected===i} onChange={()=>choose(i)}/><span className="constellation-game__choice-top"><ChoiceIcon kind={icon}/><span aria-hidden="true">{selected===i?'✓':String.fromCharCode(65+i)}</span></span><strong>{label}</strong><span className="constellation-game__cue">{cue}</span></label>)}</fieldset>
      <div className="constellation-game__actions"><button className="constellation-game__back" type="button" disabled={step===0} onClick={()=>{interacted.current=true;setStep(step-1);}}>← Back</button><button className="constellation-game__primary" type="button" disabled={selected===undefined} onClick={next}>{step===4?'Reveal My Orbit ✦':'Next Question →'}</button></div>
    </>:<>
      <p className="constellation-game__eyebrow">YOUR STARS HAVE ALIGNED</p>
      <div className="constellation-game__result-heading"><div><p>You’re in the</p><h3 ref={heading} tabIndex={-1}>{orbit}<br/><span>Orbit ✦</span></h3></div><Constellation orbit={orbit}/></div>
      <p className="constellation-game__result-line">{meta.line}</p><p className="constellation-game__description">{meta.description}</p>
      <div className="constellation-game__fit" ref={fitRef} tabIndex={-1}><h4>A creative direction for you</h4><p>Your choices suggest you may enjoy {orbit.toLowerCase()}. Here are a few ways to explore it:</p><ul>{suggestions[orbit].map(idea=><li key={idea}>{idea}</li>)}</ul></div>
      <div className="constellation-game__result-actions"><button type="button" className="constellation-game__primary" onClick={()=>{fitRef.current?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"center"});fitRef.current?.focus({preventScroll:true});}}>Explore My Orbit ↗</button><button type="button" className="constellation-game__secondary" onClick={download} disabled={saving}>{saving?'Creating card…':'Download Card ↓'}</button><button type="button" className="constellation-game__replay" onClick={reset} disabled={saving}>Play Again ↻</button></div>
      {cardUrl&&<details className="constellation-game__card-preview" open><summary>Your share card</summary><img src={cardUrl} alt={`I’m in the ${orbit} Orbit — ARTStronomy share card`} width="1080" height="1350"/><a className="constellation-game__secondary" href={cardUrl} download={`ARTStronomy-${orbit.replaceAll(' ','-')}-Orbit.png`}>Save PNG ↓</a></details>}
      <p className="constellation-game__notice" role="status">{notice||'A playful match based on your choices. Every orbit is worth exploring.'}</p>
    </>}
    </div>
  </section>;
}
