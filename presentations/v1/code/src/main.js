import './style.css';
import { slides } from './slides.js';

const W = 1600;
const H = 900;

const deck = document.getElementById('deck');
const counter = document.getElementById('counter');
const bar = document.getElementById('progress-bar');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const overview = document.getElementById('overview');
const grid = document.getElementById('overview-grid');

// Render all slides once; navigation only toggles classes.
deck.innerHTML = slides
  .map((s, i) => `<section class="slide ${s.cls || ''}" id="slide-${i + 1}" aria-label="${s.title}">${s.html}</section>`)
  .join('');
const els = [...deck.children];

grid.innerHTML = slides
  .map((s, i) => `<button class="ov-item" data-i="${i}" id="ov-${i + 1}"><small>${String(i + 1).padStart(2, '0')}</small><span>${s.title}</span></button>`)
  .join('');

let current = -1;

function fit() {
  const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
  deck.style.transform = `scale(${scale})`;
}

function go(i, { push = true } = {}) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (i === current) return;
  els.forEach((el, n) => {
    el.classList.toggle('active', n === i);
    el.classList.toggle('prev', n < i);
  });
  current = i;
  counter.textContent = `${i + 1} / ${slides.length}`;
  bar.style.width = `${((i + 1) / slides.length) * 100}%`;
  btnPrev.disabled = i === 0;
  btnNext.disabled = i === slides.length - 1;
  grid.querySelectorAll('.ov-item').forEach((b, n) => b.classList.toggle('current', n === i));
  document.title = `${i + 1}. ${slides[i].title} · LabTrack Proposal`;
  if (push) history.replaceState(null, '', `#${i + 1}`);
}

const next = () => go(current + 1);
const prev = () => go(current - 1);

function toggleOverview(show = overview.hidden) {
  overview.hidden = !show;
  if (show) grid.querySelector('.current')?.focus();
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

btnPrev.addEventListener('click', prev);
btnNext.addEventListener('click', next);
document.getElementById('btn-overview').addEventListener('click', () => toggleOverview());
document.getElementById('btn-close-overview').addEventListener('click', () => toggleOverview(false));
document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);
grid.addEventListener('click', (e) => {
  const item = e.target.closest('.ov-item');
  if (!item) return;
  go(Number(item.dataset.i));
  toggleOverview(false);
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (!overview.hidden) {
    if (e.key === 'Escape' || e.key.toLowerCase() === 'o') toggleOverview(false);
    return;
  }
  switch (e.key) {
    case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); next(); break;
    case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
    case 'Home': go(0); break;
    case 'End': go(slides.length - 1); break;
    case 'o': case 'O': toggleOverview(true); break;
    case 'f': case 'F': toggleFullscreen(); break;
  }
});

// Basic swipe support for touch screens.
let touchX = null;
document.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  touchX = null;
});

window.addEventListener('resize', fit);
window.addEventListener('hashchange', () => go(parseInt(location.hash.slice(1), 10) - 1 || 0, { push: false }));

fit();
go(parseInt(location.hash.slice(1), 10) - 1 || 0, { push: false });
