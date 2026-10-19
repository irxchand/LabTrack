import './style.css';
import './fonts.css';
import './website-theme.css';
import {slides} from './slides.js';
const $ = s=>document.querySelector(s);
const deck=$('#deck');
deck.innerHTML=slides.map((s,i)=>`<section class="slide ${s.kind||''}" aria-label="${i+1}. ${s.title}">${s.kind==='cover'?s.html:`<p class="section">${s.section}</p><h2>${s.title}</h2><div class="content">${s.html}</div>`}<footer class="slide-footer"><span>LABTRACK / CCE 2026</span><span>${String(i+1).padStart(2,'0')}</span></footer></section>`).join('');
const params=new URLSearchParams(location.search);
function safeUrl(value,fallback){try{const u=new URL(value||fallback);return ['http:','https:'].includes(u.protocol)?u.href:fallback}catch{return fallback}}
const ui=safeUrl(params.get('demo'),'http://localhost:5173');
const api=safeUrl(params.get('api'),'http://127.0.0.1:8000/docs');
document.querySelectorAll('[data-demo]').forEach(a=>a.href=a.dataset.demo==='ui'?ui:api);
let current=0;
function fit(){const r=$('#stage').getBoundingClientRect();deck.style.transform=`scale(${Math.min(r.width/1600,r.height/900)})`}
function fromHash(){return Math.max(0,Math.min(slides.length-1,(Number(location.hash.slice(1))||1)-1))}
function show(n){current=Math.max(0,Math.min(slides.length-1,n));document.querySelectorAll('.slide').forEach((el,i)=>{el.classList.toggle('active',i===current);el.setAttribute('aria-hidden',String(i!==current));el.inert=i!==current});$('#position').textContent=`${current+1} / ${slides.length}`;$('#prev').disabled=current===0;$('#next').disabled=current===slides.length-1;history.replaceState(null,'',`#${current+1}`);$('#notes-body').textContent=`${slides[current].title}\nSuggested time: ${slides[current].time}\n\n${slides[current].notes}`;document.title=`${current+1}. ${slides[current].title} | LabTrack CCE`;document.querySelectorAll('#index-body button').forEach((b,i)=>b.classList.toggle('current',i===current))}
$('#index-body').innerHTML=slides.map((s,i)=>`<button data-slide="${i}">${String(i+1).padStart(2,'0')}  ${s.title}</button>`).join('');
$('#index-body').addEventListener('click',e=>{const b=e.target.closest('button');if(b){show(Number(b.dataset.slide));$('#index').close()}});
$('#prev').onclick=()=>show(current-1);$('#next').onclick=()=>show(current+1);
$('#notes-button').onclick=()=>$('#notes').showModal();$('#overview').onclick=()=>$('#index').showModal();
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{ /* Browser policy may require a direct user gesture. */ }}
$('#fullscreen').onclick=fullscreen;
let elapsed=0,started=null;
$('#clock-button').onclick=()=>{if(started!==null){elapsed+=Date.now()-started;started=null;$('#clock-button').textContent='Resume timer'}else{started=Date.now();$('#clock-button').textContent='Pause timer'}};
setInterval(()=>{const secs=Math.floor((elapsed+(started===null?0:Date.now()-started))/1000);$('#timer').textContent=`${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`},250);
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey)return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}else if(e.key==='Home'){e.preventDefault();show(0)}else if(e.key==='End'){e.preventDefault();show(slides.length-1)}else if(e.key.toLowerCase()==='n')$('#notes').showModal();else if(e.key.toLowerCase()==='o')$('#index').showModal();else if(e.key.toLowerCase()==='f')fullscreen()});
let touchX=null;deck.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});deck.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>70)show(current+(dx<0?1:-1));touchX=null},{passive:true});
window.addEventListener('resize',fit);window.addEventListener('hashchange',()=>show(fromHash()));show(fromHash());fit();
