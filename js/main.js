/* ── Character sequence ─────────────────────────────────────────────
   660 frames (every 2nd frame of the 24fps master), split into storyboard
   sections. Ranges come from assets/web/frames/manifest.json. */
const FRAMES = {
  count: 660,
  width: 1600,
  height: 900,
  sections: {
    hero:       [0, 61],
    problem:    [62, 134],
    build:      [135, 271],
    result:     [272, 408],
    projects:   [409, 479],
    background: [480, 539],
    websites:   [540, 599],
    contact:    [600, 659],
  },
};
const MONITOR_RIGHT = 0.52;   // right edge of the desk + monitor, as a fraction of frame width
const CHAR_CENTER   = 0.28;   // character + desk centre, used to frame phones
const BG = '#F2EAE1';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SNAP = new URLSearchParams(location.search).has('snap');   // testing: jump straight to the target frame
const isNarrow = () => window.innerWidth <= 820;

window.addEventListener('DOMContentLoaded', () => {
  const stage = initStage();
  const scenes = initScenes();
  initReveals();
  const lenis = initScroll();
  if (SNAP) window.__story = { scenes, stage };

  /* One loop drives everything: scroll → section progress → frame + graphics */
  let current = FRAMES.sections.hero[1];
  let lastMove = performance.now();
  const intro = { start: 0, done: prefersReduced };
  stage.whenHeroReady(() => { intro.start = performance.now(); });

  function tick(now) {
    if (lenis) lenis.raf(now);

    const progress = scenes.update();
    let target = progress.frame;

    // Arrival greeting: the wave plays once on load, then the hero rests on its last frame
    if (!intro.done && progress.inHero) {
      if (!intro.start) target = 0;
      else {
        const t = Math.min(1, (now - intro.start) / 2600);
        target = easeInOut(t) * FRAMES.sections.hero[1];
        if (t === 1) intro.done = true;
      }
    } else if (!progress.inHero) intro.done = true;

    // Ease toward the target so scrolling feels weighted, never jumpy
    const delta = target - current;
    const moving = Math.abs(delta) > 0.25;
    if (moving) lastMove = now;
    current += prefersReduced || SNAP ? delta : delta * 0.14;
    document.documentElement.dataset.frame = Math.round(current);

    // Blend neighbouring frames only while moving (reads as motion blur);
    // at rest show one whole frame so a held pose is never a double exposure
    let shown = moving ? current : Math.round(current);

    // When the page is still at a calm pose, keep the character breathing instead of freezing
    if (!moving && !prefersReduced && !SNAP && intro.done && now - lastMove > 800) {
      const base = Math.round(current);
      const step = Math.round(Math.sin((now - lastMove) / 1100));
      if (stage.isCalm(base) && stage.isCalm(base + step)) shown = base + step;
    }
    stage.draw(clamp(shown, 0, FRAMES.count - 1));
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});

/* ── Stage: canvas + progressive frame loading ──────────────────── */
function initStage() {
  const canvas = document.getElementById('stage-canvas');
  const ctx = canvas.getContext('2d');
  const set = isNarrow() ? 'm' : 'd';
  const frames = new Array(FRAMES.count).fill(null);
  const loader = document.querySelector('.loader');
  let loaded = 0;
  let heroReady = null;
  let lastDrawn = -1;
  let layout = { dx: 0, dy: 0, dw: 0, dh: 0 };
  let motion = null;   // per-frame change, from tools/encode_frames.py; idle breathing waits for it
  fetch('assets/web/frames/motion.json').then(r => r.json()).then(m => { motion = m; }).catch(() => {});

  // Load order: the hero wave first, then coarse-to-fine passes over the whole story
  const order = [];
  const seen = new Set();
  const push = i => { if (i < FRAMES.count && !seen.has(i)) { seen.add(i); order.push(i); } };
  for (let i = 0; i <= FRAMES.sections.hero[1]; i++) push(i);
  for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < FRAMES.count; i += step) push(i);

  let next = 0;
  const pump = () => {
    if (next >= order.length) return;
    const i = order[next++];
    const img = new Image();
    img.decoding = 'async';
    // load/error events always fire; decode() can stall indefinitely in background tabs
    img.onload = img.onerror = () => {
      if (img.naturalWidth) frames[i] = img;
      loaded++;
      loader.style.setProperty('--loaded', loaded / FRAMES.count);
      if (loaded === FRAMES.count) loader.classList.add('done');
      if (heroReady && i === FRAMES.sections.hero[1]) { heroReady(); heroReady = null; }
      lastDrawn = -1;
      pump();
    };
    img.src = `assets/web/frames/${set}/${String(i + 1).padStart(4, '0')}.webp`;
  };
  for (let k = 0; k < 6; k++) pump();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    const cw = canvas.width, ch = canvas.height;
    const scale = Math.max(cw / FRAMES.width, ch / FRAMES.height);
    const dw = FRAMES.width * scale, dh = FRAMES.height * scale;
    let dx;
    if (isNarrow()) {
      dx = cw / 2 - CHAR_CENTER * dw;                         // phones: centre on the character
    } else {
      // desktops: left-align, and slide left (never past the character) if the copy needs room
      const minCopy = 520 * dpr;
      const wanted = cw - minCopy - MONITOR_RIGHT * dw;
      dx = Math.min(0, Math.max(wanted, -0.06 * dw));
      const left = (dx + MONITOR_RIGHT * dw) / dpr + 24;
      document.documentElement.style.setProperty('--content-left', `${Math.round(left)}px`);
    }
    dx = Math.min(0, Math.max(cw - dw, dx));
    layout = { dx, dy: ch - dh, dw, dh };                      // bottom stays flush, like the video
    lastDrawn = -1;
  }
  window.addEventListener('resize', resize);
  resize();

  const nearest = i => {
    for (let r = 0; r < 32; r++) {
      if (frames[i - r]) return frames[i - r];
      if (frames[i + r]) return frames[i + r];
    }
    return null;
  };

  return {
    whenHeroReady(fn) { if (frames[FRAMES.sections.hero[1]]) fn(); else heroReady = fn; },
    isCalm(i) {
      if (!motion || i < 1 || i >= FRAMES.count - 1 || !frames[i]) return false;
      return Math.max(motion[i - 1], motion[i], motion[i + 1]) < 1.0;
    },
    draw(f) {
      const key = Math.round(f * 50);
      if (key === lastDrawn) return;
      const i = Math.floor(f), a = f - i;
      const base = nearest(i);
      if (!base) return;
      lastDrawn = key;
      const { dx, dy, dw, dh } = layout;
      ctx.globalAlpha = 1;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, dx, dy, dw, dh);
      // blend toward the next frame so motion stays continuous between the 12fps keyframes
      if (a > 0.02 && frames[i + 1]) {
        ctx.globalAlpha = a;
        ctx.drawImage(frames[i + 1], dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }
    },
  };
}

/* ── Scenes: map scroll position to frames and per-section graphics ── */
function initScenes() {
  const els = [...document.querySelectorAll('.scene')];
  const scenes = els.map(el => ({ el, name: el.dataset.scene, range: FRAMES.sections[el.dataset.scene] }));
  const pile = buildPile(document.querySelector('.pile'));
  const tasks = document.querySelector('.js-tasks');
  const tasksBar = document.querySelector('.js-tasks-bar');
  const flow = document.querySelector('.viz-flow');
  const nodes = [...document.querySelectorAll('.node')];
  const swap = document.querySelector('.swap');

  const graphics = {
    problem(p) {
      pile.forEach((card, i) => {
        const t = clamp((p - 0.06 - i * 0.045) / 0.12, 0, 1);
        const e = easeOut(t);
        card.style.opacity = e;
        card.style.transform = `translate(${card.dataset.x}px, ${(1 - e) * -140 - i * 6}px) rotate(${card.dataset.r * e}deg)`;
      });
      const h = clamp(p / 0.62, 0, 1);
      tasks.textContent = Math.round(easeIn(h) * 128);
      tasksBar.style.transform = `scaleX(${h})`;
    },
    build(p) {
      const f = clamp((p - 0.18) / 0.55, 0, 1);
      flow.style.setProperty('--flow', f);
      nodes.forEach((n, i) => n.classList.toggle('on', f >= i / (nodes.length - 1) - 0.02));
    },
    result(p) {
      swap.style.setProperty('--strike', easeOut(clamp((p - 0.12) / 0.14, 0, 1)));
      swap.style.setProperty('--after', easeOut(clamp((p - 0.24) / 0.14, 0, 1)));
    },
  };

  return {
    update() {
      const vh = window.innerHeight;
      const y = window.scrollY + vh * 0.5;
      let frame = FRAMES.sections.hero[1];
      let inHero = true;
      for (const s of scenes) {
        const top = s.el.offsetTop, h = s.el.offsetHeight;
        // the last scene can't scroll past the page end, so it completes half a screen early
        const span = s === scenes[scenes.length - 1] ? h - vh * 0.5 : h;
        const p = clamp((y - top) / span, 0, 1);
        if (graphics[s.name]) graphics[s.name](p);
        if (s.name === 'hero' || y < top) continue;
        inHero = false;
        frame = s.range[0] + p * (s.range[1] - s.range[0]);
      }
      return { frame, inHero };
    },
  };
}

// the kinds of busywork teams hand me — each lands on the pile as the character sighs at it
const TASKS = ['PDF → spreadsheet', 'Inbox triage', 'Weekly report', 'Data entry', 'Find that doc', 'Form intake', 'Ticket routing', 'Copy & paste', 'Status update'];

function buildPile(root) {
  const cards = [];
  for (let i = 0; i < TASKS.length; i++) {
    const c = document.createElement('div');
    c.className = 'pdf';
    c.dataset.kind = TASKS[i];
    c.dataset.x = Math.round((Math.sin(i * 2.1) * 0.5 + 0.5) * 40);
    c.dataset.r = Math.round(Math.sin(i * 1.7) * 9);
    root.appendChild(c);
    cards.push(c);
  }
  return cards;
}

/* ── Reveals: text, services and cards ease in as their panel arrives ── */
const REVEALS = '.reveal, .card, .service';
function initReveals() {
  document.querySelectorAll('.panel').forEach(panel => {
    panel.querySelectorAll(REVEALS).forEach((el, i) => el.style.setProperty('--d', i));
  });
  document.querySelectorAll('.card').forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 90}ms`; });
  document.querySelectorAll('.service').forEach((el, i) => { el.style.transitionDelay = `${200 + i * 110}ms`; });
  if (prefersReduced) {
    document.querySelectorAll(REVEALS).forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll(REVEALS).forEach(el => io.observe(el));
}

/* ── Smooth scrolling ─────────────────────────────────────────────── */
function initScroll() {
  if (prefersReduced || typeof Lenis === 'undefined') return null;
  const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      // land a little into the section so its panel and gesture are already underway
      lenis.scrollTo(target, { offset: target.id === 'hero' ? 0 : window.innerHeight * 0.15 });
    });
  });
  return lenis;
}

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t) { return t * t; }
function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
