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
const HEADROOM      = 0.15;   // most of the frame's top we may crop before reaching the hair
// the web frames only cover the part of the (16:9) frame the character and desk occupy: [x0, y0, x1, y1]
const CROP = [0, 0.17, 0.68, 1];
const THEME = { bg: 'rgb(242 234 225)', night: 0 };   // kept current by initTheme(); the stage paints with it

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SNAP = new URLSearchParams(location.search).has('snap');   // testing: jump straight to the target frame
const isNarrow = () => window.innerWidth <= 820;

window.addEventListener('DOMContentLoaded', () => {
  const stage = initStage();
  const sky = initSky();
  initTheme(stage, sky);
  const thread = initThread();
  const wave = initWave(stage, () => current);
  initCursorLight();
  const scenes = initScenes();
  initReveals();
  const lenis = initScroll();
  if (SNAP) {
    window.__story = { scenes, stage };
    const at = new URLSearchParams(location.search).get('at');      // testing: open at a point in the story (0..1)
    if (at) setTimeout(() => window.scrollTo(0, +at * (document.documentElement.scrollHeight - innerHeight)), 300);
  }

  /* One loop drives everything: scroll → section progress → frame + graphics */
  let current = FRAMES.sections.hero[1];
  let lastMove = performance.now();
  let lastScroll = -1;
  const intro = { start: 0, done: prefersReduced };
  stage.whenHeroReady(() => { intro.start = performance.now(); });

  function tick(now) {
    if (lenis) lenis.raf(now);

    const progress = scenes.update();
    if (window.scrollY !== lastScroll) {
      lastScroll = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (!prefersReduced) document.documentElement.style.setProperty('--par', (max > 0 ? lastScroll / max : 0).toFixed(4));
      thread.update();
    }
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
    const waving = wave.frame(now, clamp(shown, 0, FRAMES.count - 1));
    if (waving) stage.mix(...waving);
    else stage.draw(clamp(shown, 0, FRAMES.count - 1));
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});

/* ── Stage: canvas + progressive frame loading ──────────────────── */
function initStage() {
  const canvas = document.getElementById('stage-canvas');
  const ctx = canvas.getContext('2d');
  // phones get 'm'; high-DPI desktops big enough to show the detail get the full-resolution 'h' set
  const dpr = window.devicePixelRatio || 1;
  const conn = navigator.connection || {};
  const lite = !!conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '');   // data saver or a slow network
  const set = isNarrow() || (lite && dpr < 1.5) ? 'm' : !lite && dpr >= 1.5 && window.innerWidth * dpr >= 2200 ? 'h' : 'd';
  const frames = new Array(FRAMES.count).fill(null);
  const loader = document.querySelector('.loader');
  let loaded = 0;
  let heroReady = null;
  let lastDrawn = '';
  let layout = { dx: 0, dy: 0, dw: 0, dh: 0 };
  let motion = null;   // per-frame change, from tools/encode_frames.py; idle breathing waits for it
  fetch('assets/web/frames/motion.json').then(r => r.json()).then(m => { motion = m; }).catch(() => {});

  // Load order: the hero wave first, then coarse-to-fine passes over the whole story
  const order = [];
  const seen = new Set();
  const push = i => { if (i < FRAMES.count && !seen.has(i)) { seen.add(i); order.push(i); } };
  for (let i = 0; i <= FRAMES.sections.hero[1]; i += lite ? 2 : 1) push(i);
  push(FRAMES.sections.hero[1]);                                          // the intro waits for the wave's last frame
  const heroCount = order.length;
  // on a slow connection every other frame is enough: neighbouring frames are blended anyway
  for (const step of lite ? [16, 8, 4, 2] : [16, 8, 4, 2, 1]) for (let i = 0; i < FRAMES.count; i += step) push(i);
  const total = order.length;

  // the hero wave loads straight away; the rest of the story waits until the page has loaded and the
  // browser is idle, and pauses while the tab is in the background
  let next = 0, released = false;
  const release = () => { if (released) return; released = true; for (let k = 0; k < 6; k++) pump(); };
  const pump = () => {
    if (next >= total) return;
    if (next >= heroCount && !released) return;
    if (document.hidden) { document.addEventListener('visibilitychange', pump, { once: true }); return; }
    const i = order[next++];
    const img = new Image();
    img.decoding = 'async';
    if (next <= heroCount) img.fetchPriority = 'high';
    // load/error events always fire; decode() can stall indefinitely in background tabs
    img.onload = img.onerror = () => {
      if (img.naturalWidth) frames[i] = img;
      loaded++;
      loader.style.setProperty('--loaded', loaded / total);
      if (loaded === total) loader.classList.add('done');
      if (heroReady && i === FRAMES.sections.hero[1]) { heroReady(); heroReady = null; }
      lastDrawn = '';
      pump();
    };
    img.src = `assets/web/frames/${set}/${String(i + 1).padStart(4, '0')}.webp`;
  };
  for (let k = 0; k < 6; k++) pump();
  const idle = window.requestIdleCallback || (fn => setTimeout(fn, 300));
  // give the first screen a head start: the story frames start 1.5 s after load, when the browser is idle
  const later = () => setTimeout(() => idle(release), 1500);
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    const cw = canvas.width, ch = canvas.height;
    // cover the stage, but never crop into the headroom above the character (head sits ~20% down);
    // on wide, short stages the leftover space is plain backdrop colour
    const scale = Math.min(Math.max(cw / FRAMES.width, ch / FRAMES.height), ch / (FRAMES.height * (1 - HEADROOM)));
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
    dx = dw >= cw ? Math.min(0, Math.max(cw - dw, dx)) : clamp(isNarrow() ? dx : 0, 0, cw - dw);
    layout = { dx, dy: ch - dh, dw, dh };                      // bottom stays flush, like the video
    lastDrawn = '';
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
      const i = Math.floor(f);
      this.mix(i, i + 1, f - i);
    },
    // frame i, with frame j laid over it at strength a (neighbours while scrolling, any pair for the wave)
    mix(i, j, a) {
      const key = `${i}|${j}|${Math.round(a * 50)}`;
      if (key === lastDrawn) return;
      const base = nearest(i);
      if (!base) return;
      lastDrawn = key;
      const { dx, dy, dw, dh } = layout;
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);              // the sky shows through around him
      // at night, a warm desk-lamp glow behind the character so he reads as lit, not pasted on
      if (THEME.night > 0.01) {
        const cx = dx + CHAR_CENTER * dw * 0.92, cy = dy + 0.58 * dh, r = 0.62 * dh;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgb(255 178 105 / ${0.24 * THEME.night})`);
        g.addColorStop(0.55, `rgb(255 150 80 / ${0.07 * THEME.night})`);
        g.addColorStop(1, 'rgb(255 150 80 / 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      const [cx0, cy0, cx1, cy1] = CROP, fx = dx + cx0 * dw, fy = dy + cy0 * dh, fw = (cx1 - cx0) * dw, fh = (cy1 - cy0) * dh;
      ctx.drawImage(base, fx, fy, fw, fh);
      // blend toward the next frame so motion stays continuous between the 12fps keyframes
      const over = a > 0.02 ? (j === i + 1 ? frames[j] : nearest(j)) : null;
      if (over) {
        ctx.globalAlpha = a;
        ctx.drawImage(over, fx, fy, fw, fh);
        ctx.globalAlpha = 1;
      }
    },
    invalidate() { lastDrawn = ''; },
    // where the character stands on screen, in CSS pixels (for click-to-wave)
    charBox() {
      const dpr = canvas.width / (canvas.clientWidth || 1), r = canvas.getBoundingClientRect();
      const { dx, dy, dw, dh } = layout;
      return { left: r.left + (dx + 0.07 * dw) / dpr, right: r.left + (dx + 0.40 * dw) / dpr,
               top: r.top + (dy + 0.21 * dh) / dpr, bottom: r.top + Math.min(dy + dh, canvas.height) / dpr };
    },
  };
}

/* ── Theme: day from sunrise to sunset, night after, with a golden blend at both ──
   Sunrise/sunset are estimated from the visitor's date and time zone (no location prompt).
   The toggle cycles Auto → Day → Night. ?time=19:40 previews a time of day. */
// Backgrounds drift through dusk tones; foreground colours switch once, when the background turns dark,
// so text never fades into a mid-grey background halfway through sunset.
const BACKDROP = {
  //             day               dusk (light side)   dusk (dark side)   night
  '--bg':      [[226, 235, 244], [240, 214, 200],    [46, 38, 50],      [16, 18, 25]],
  '--bg-soft': [[212, 224, 236], [232, 204, 188],    [58, 49, 62],      [28, 31, 41]],
};
const PALETTE = {
  //            day                       night
  '--ink':       [[28, 26, 23],             [238, 231, 221]],
  '--muted':     [[70, 68, 74],             [158, 151, 142]],   /* darker by day: body text sits on blue sky */
  '--line':      [[28, 26, 23, 0.12],       [238, 231, 221, 0.13]],
  '--card':      [[255, 252, 248, 0.72],    [30, 33, 44, 0.72]],
  '--paper':     [[255, 253, 249],          [34, 38, 50]],
  '--solid-top': [[46, 42, 38],             [246, 239, 229]],
  '--solid-bot': [[23, 21, 18],             [221, 212, 199]],
  '--solid-ink': [[242, 234, 225],          [22, 20, 17]],
  '--sky':       [[255, 246, 228, 0.18],    [140, 160, 255, 0.10]],
};
const NUMBERS = { '--sk': [1, 2.4], '--hl': [0.75, 0.07], '--grain': [0.05, 0.04] };
// Sunrise is cool and soft, sunset hot and dramatic; both blend in from day on the light side
const SKY = {
  //               day                    sunrise                sunset                 twilight              night
  '--sky-top':   [[60, 128, 208],         [104, 124, 196],       [70, 52, 120],         [40, 36, 72],         [7, 10, 22]],
  '--sky-mid':   [[120, 176, 230],        [236, 170, 182],       [232, 108, 96],        [96, 60, 92],         [14, 18, 34]],
  '--sky-low':   [[196, 222, 240],        [255, 214, 170],       [255, 166, 86],        [160, 88, 84],        [24, 26, 44]],
  '--cloud-top': [[255, 255, 255],        [255, 236, 240],       [255, 214, 176],       [132, 106, 142],      [60, 66, 94]],
  '--cloud-bot': [[196, 212, 232],        [212, 176, 206],       [214, 104, 108],       [80, 62, 96],         [32, 36, 56]],
  '--glint':     [[255, 255, 255, 0.5],   [255, 255, 255, 0.5],  [255, 240, 220, 0.5],  [255, 200, 150, 0.12], [255, 200, 150, 0.10]],
  '--scrim':     [[235, 242, 250, 0.30],  [255, 240, 236, 0.32], [255, 236, 220, 0.36], [30, 26, 44, 0.30],   [12, 14, 22, 0.32]],
};
const SKY_NUMBERS = { '--cloud-a': [0.95, 0.9, 0.92, 0.5, 0.28], '--stars': [0, 0.12, 0, 0.55, 1] };
const MODES = ['auto', 'day', 'night'];
// each name starts with the button's visible word, so voice control ("click Auto") works
const MODE_TITLE = { auto: 'Auto theme (follows the sun)', day: 'Day theme', night: 'Night theme' };

function initTheme(stage, sky) {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const params = new URLSearchParams(location.search);
  const preview = params.get('time');
  // preview: ?speed=720 runs the clock 720x (a whole day in two minutes), starting at ?time= or now
  const speed = +params.get('speed') || 0, lapseStart = Date.now(), lapseFrom = preview ? timeFrom(preview) : new Date();
  const clock = () => speed ? new Date(lapseFrom.getTime() + (Date.now() - lapseStart) * speed) : preview ? timeFrom(preview) : new Date();
  let mode = 'auto';
  try { mode = MODES.includes(localStorage.getItem('theme')) ? localStorage.getItem('theme') : 'auto'; } catch (e) {}
  let shown = null, tween = null;

  const css = c => `rgb(${c.slice(0, 3).map(Math.round).join(' ')}${c.length > 3 ? ` / ${c[3].toFixed(3)}` : ''})`;
  const lerp = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);

  function apply(t, golden, date) {
    const dark = t >= 0.5 ? 1 : 0;                                  // foreground flips once, at the midpoint
    const light = clamp(Math.max(golden, t * 2), 0, 1), deep = clamp((t - 0.5) * 2, 0, 1);
    // sky: day → golden hour on the light side, twilight → night on the dark side
    const morning = date.getHours() < 12;
    for (const [name, [day, sunrise, sunset, dusk, night]] of Object.entries(SKY)) {
      root.style.setProperty(name, css(dark ? lerp(dusk, night, deep) : lerp(day, morning ? sunrise : sunset, light)));
    }
    for (const [name, [day, sunrise, sunset, dusk, night]] of Object.entries(SKY_NUMBERS)) {
      const gold = morning ? sunrise : sunset;
      const v = dark ? dusk + (night - dusk) * deep : day + (gold - day) * light;
      root.style.setProperty(name, v.toFixed(3));
    }
    sky.paint(date, t);
    // golden hours: deepen the orange accent toward brick red so it still stands out against an orange sky
    root.style.setProperty('--accent', css(dark ? [217, 72, 28] : lerp([217, 72, 28], [168, 40, 24], light * 0.9)));
    for (const [name, [day, duskLight, duskDark, night]] of Object.entries(BACKDROP)) {
      root.style.setProperty(name, css(dark ? lerp(duskDark, night, (t - 0.5) * 2) : lerp(day, duskLight, light)));
    }
    for (const [name, [d, n]] of Object.entries(PALETTE)) {
      root.style.setProperty(name, css(name === '--sky' ? lerp(d, n, t) : dark ? n : d));
    }
    for (const [name, [d, n]] of Object.entries(NUMBERS)) root.style.setProperty(name, (dark ? n : d).toFixed(3));
    root.style.setProperty('--shadow-rgb', dark ? '0 0 0' : '70 45 20');
    root.style.setProperty('--golden', golden.toFixed(3));
    THEME.bg = root.style.getPropertyValue('--bg');
    THEME.night = t;
    if (meta) meta.content = THEME.bg;
    root.dataset.look = dark ? 'night' : 'day';
    button.dataset.look = root.dataset.look;
    stage.invalidate();
  }

  function target() {
    // a fixed afternoon / late evening when forced, so the sun and moon still sit somewhere sensible
    if (mode === 'day') return { t: 0, golden: 0, date: timeFrom('14:00') };
    if (mode === 'night') return { t: 1, golden: 0, date: timeFrom('22:30') };
    const date = clock();
    return { ...skyAt(date), date };
  }

  function update(animate) {
    const to = target();
    if (!animate || prefersReduced || shown === null) { shown = to; apply(to.t, to.golden, to.date); return; }
    const from = { ...shown }, start = performance.now();
    cancelAnimationFrame(tween);
    const step = now => {
      const k = easeInOut(Math.min(1, (now - start) / 700));
      shown = { t: from.t + (to.t - from.t) * k, golden: from.golden + (to.golden - from.golden) * k, date: to.date };
      apply(shown.t, shown.golden, to.date);
      if (k < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  }

  function label() {
    button.querySelector('.theme-mode').textContent = mode[0].toUpperCase() + mode.slice(1);
    button.title = MODE_TITLE[mode];
    button.setAttribute('aria-label', MODE_TITLE[mode]);
  }

  button.addEventListener('click', () => {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    try { localStorage.setItem('theme', mode); } catch (e) {}
    label();
    // crossfade the whole page where supported; otherwise tween the colours
    if (document.startViewTransition && !prefersReduced) document.startViewTransition(() => update(false));
    else update(true);
  });
  label();
  update(false);
  setInterval(() => { if (mode === 'auto') update(!speed); }, speed ? 150 : 60 * 1000);
  if (speed) {                                                          // a small clock so you can see where in the day it is
    const tag = Object.assign(document.createElement('div'), { className: 'lapse-clock' });
    document.body.appendChild(tag);
    setInterval(() => { tag.textContent = clock().toTimeString().slice(0, 5); }, 150);
  }
}

// How far into night it is (t: 0 day … 1 night) and how strong the sunrise/sunset glow is
function skyAt(date) {
  const { rise, set } = sunTimes(date);
  const m = date.getHours() * 60 + date.getMinutes();
  const smooth = x => x * x * (3 - 2 * x);
  const ramp = (a, b) => smooth(clamp((m - a) / (b - a), 0, 1));
  const t = m < (rise + set) / 2 ? 1 - ramp(rise - 35, rise + 25) : ramp(set - 25, set + 35);
  const golden = Math.max(0, 1 - Math.abs(m - set) / 75, 1 - Math.abs(m - rise) / 75);   // golden hours, ~75 min either side
  return { t, golden };
}

// Sunrise and sunset in local minutes, estimated from the day of year and a latitude guessed from the time zone
function sunTimes(date) {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const south = /^(Australia|Antarctica)\/|^Pacific\/(Auckland|Chatham|Fiji)|^America\/(Sao_Paulo|Argentina|Santiago|Montevideo|Asuncion)|^Africa\/(Johannesburg|Maputo|Harare|Windhoek)/.test(zone);
  const lat = (south ? -34 : 38) * Math.PI / 180;
  const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 864e5);
  const decl = -23.44 * Math.cos(2 * Math.PI / 365 * (day + 10)) * Math.PI / 180;
  const horizon = -0.833 * Math.PI / 180;                                 // refraction + the sun's radius: visible a bit below the horizon
  const hourAngle = Math.acos(clamp((Math.sin(horizon) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl)), -1, 1)) * 180 / Math.PI;
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset(), jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  const dst = date.getTimezoneOffset() < Math.max(jan, jul) ? 60 : 0;    // clocks moved forward: the sun is "late"
  // equation of time: the sun runs up to ~16 min ahead of or behind the clock over the year
  const B = 2 * Math.PI * (day - 81) / 365;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const noon = 12 * 60 + dst - eot, half = hourAngle * 4;                 // 4 minutes per degree
  return { rise: noon - half, set: noon + half, noon };
}

function timeFrom(hhmm) {
  const d = new Date(), [h, m] = hhmm.split(':').map(Number);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

/* ── Sky: sun and moon on real arcs, stars at night, clouds always drifting ──
   Colours come from initTheme(); this places the bodies for a given time. */
function initSky() {
  const sun = document.querySelector('.sky-sun');
  const moon = document.querySelector('.sky-moon');
  const stars = [...document.querySelectorAll('.sky-stars')];
  let drawnAge = -1, drawnWarmth = -1;

  // a fixed star field (seeded, so it's the same sky every visit), denser toward the top
  function drawStars() {
    stars.forEach((c, k) => {
      const w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) return;
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      let seed = 11 + k * 977;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let i = 0, n = Math.round(w * h / 13000); i < n; i++) {
        const x = rnd() * w, y = Math.pow(rnd(), 1.5) * h * 0.85;
        const big = rnd() < 0.07, r = big ? 1.2 + rnd() * 0.6 : 0.4 + rnd() * 0.7;
        if (big) { ctx.fillStyle = 'rgb(255 248 235 / 0.16)'; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 7); ctx.fill(); }
        ctx.fillStyle = `rgb(255 250 240 / ${0.55 + rnd() * 0.45})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
    });
  }

  // the moon's actual phase for the date: lit crescent/gibbous over a faint earthshine disc
  function drawMoon(age) {
    const ctx = moon.getContext('2d'), R = moon.width / 2 - 6, p = age / SYNODIC;
    ctx.clearRect(0, 0, moon.width, moon.height);
    ctx.save();
    ctx.translate(moon.width / 2, moon.height / 2);
    ctx.fillStyle = 'rgb(210 214 230 / 0.16)';
    ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill();
    const c = Math.cos(2 * Math.PI * p), waxing = p < 0.5;
    ctx.beginPath();
    if (waxing) ctx.arc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);          // lit limb on the right
    else ctx.arc(0, 0, R, Math.PI / 2, -Math.PI / 2, false);                 // lit limb on the left
    // terminator: bulges into the lit side for a crescent, into the dark side for a gibbous moon
    if (waxing) ctx.ellipse(0, 0, R * Math.abs(c), R, 0, Math.PI / 2, -Math.PI / 2, c > 0);
    else ctx.ellipse(0, 0, R * Math.abs(c), R, 0, -Math.PI / 2, Math.PI / 2, c > 0);
    const g = ctx.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R);
    g.addColorStop(0, 'rgb(255 251 238)');
    g.addColorStop(1, 'rgb(226 220 200)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  // the sun: a crisp disc with a bright core, faint rays and a soft corona; deeper orange near the horizon
  function drawSun(warmth) {
    const ctx = sun.getContext('2d'), W = sun.width, c = W / 2, R = W * 0.17;
    const g1 = Math.round(236 - 40 * warmth), b1 = Math.round(170 - 90 * warmth);
    const g2 = Math.round(196 - 70 * warmth), b2 = Math.round(110 - 80 * warmth);
    ctx.clearRect(0, 0, W, W);
    const corona = ctx.createRadialGradient(c, c, R * 0.8, c, c, c);
    corona.addColorStop(0, `rgb(255 ${g1} ${b1} / 0.55)`);
    corona.addColorStop(0.35, `rgb(255 ${g2} ${b2} / 0.16)`);
    corona.addColorStop(1, 'rgb(255 200 120 / 0)');
    ctx.fillStyle = corona;
    ctx.fillRect(0, 0, W, W);
    ctx.save();
    ctx.translate(c, c);
    for (let i = 0; i < 16; i++) {                                           // soft illustrated rays
      ctx.rotate(Math.PI / 8);
      const ray = ctx.createLinearGradient(R, 0, c * 0.95, 0);
      ray.addColorStop(0, `rgb(255 ${g1} ${b1} / ${i % 2 ? 0.16 : 0.26})`);
      ray.addColorStop(1, 'rgb(255 220 160 / 0)');
      ctx.fillStyle = ray;
      ctx.beginPath(); ctx.moveTo(R * 0.9, -R * 0.09); ctx.lineTo(c * (i % 2 ? 0.7 : 0.95), 0); ctx.lineTo(R * 0.9, R * 0.09); ctx.fill();
    }
    ctx.restore();
    const disc = ctx.createRadialGradient(c - R * 0.3, c - R * 0.3, R * 0.05, c, c, R);
    disc.addColorStop(0, 'rgb(255 253 244)');
    disc.addColorStop(0.55, `rgb(255 ${g1} ${b1})`);
    disc.addColorStop(1, `rgb(255 ${g2} ${b2})`);
    ctx.fillStyle = disc;
    ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgb(255 255 255 / 0.45)';
    ctx.lineWidth = W / 256;
    ctx.beginPath(); ctx.arc(c, c, R - ctx.lineWidth, 0, 7); ctx.stroke();
  }

  // position on a high, flat arc: rises just right of the character, crosses above the headlines,
  // sets at the far right, so it never sits behind his face
  const place = (el, u, alpha) => {
    const on = u > -0.04 && u < 1.04;
    const k = clamp(u, 0, 1);
    const left = isNarrow() ? 8 : 40;
    el.style.setProperty('--x', `${left + (94 - left) * k}%`);
    el.style.setProperty('--y', `${(isNarrow() ? 34 : 36) - (isNarrow() ? 16 : 26) * Math.sin(Math.PI * k)}%`);   // phones: stays clear of his head and the top bar
    el.style.setProperty('--a', on ? (alpha * clamp(Math.sin(Math.PI * k) * 3 + 0.2, 0, 1)).toFixed(3) : '0');
  };

  drawStars();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawStars, 200); });

  return {
    paint(date, t) {
      const m = date.getHours() * 60 + date.getMinutes();
      const { rise, set, noon } = sunTimes(date);
      const nearHorizon = 1 - Math.sin(Math.PI * clamp((m - rise) / (set - rise), 0, 1));
      if (Math.abs(nearHorizon - drawnWarmth) > 0.04) { drawSun(nearHorizon); drawnWarmth = nearHorizon; }
      place(sun, (m - rise) / (set - rise), 1 - t);

      // the moon crosses the sky about 50 minutes later each day: full moons rise at sunset, new moons at sunrise
      const age = moonAge(date);
      if (Math.abs(age - drawnAge) > 0.2) { drawMoon(age); drawnAge = age; }
      const transit = noon + (age / SYNODIC) * 1440;
      const mrise = transit - 372;
      const u = (((m - mrise) % 1440) + 1440) % 1440 / 744;
      place(moon, u, 0.3 + 0.7 * t);                                          // faint by day, bright at night
    },
  };
}

const SYNODIC = 29.530588;
function moonAge(date) {
  const days = (date - Date.UTC(2000, 0, 6, 18, 14)) / 864e5;               // a known new moon
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
}

/* ── Workflow thread: a line that links the sections and draws itself as you scroll ── */
function initThread() {
  const thread = document.querySelector('.thread');
  const head = thread.querySelector('.thread-head');
  const scenes = [...document.querySelectorAll('.scene')].filter(s => s.id !== 'hero');
  const nodes = scenes.map(() => thread.appendChild(Object.assign(document.createElement('i'), { className: 'thread-node' })));
  let top = 0, height = 1, marks = [];

  function measure() {
    const first = scenes[0], last = scenes[scenes.length - 1];
    top = first.offsetTop + window.innerHeight * 0.32;
    height = Math.max(1, last.offsetTop + window.innerHeight * 0.4 - top);
    thread.style.top = `${top}px`;
    thread.style.height = `${height}px`;
    marks = scenes.map(s => s.offsetTop + window.innerHeight * 0.32 - top);
    nodes.forEach((n, i) => { n.style.top = `${marks[i]}px`; });
  }

  measure();
  new ResizeObserver(measure).observe(document.getElementById('story'));

  return {
    update() {
      const y = clamp(window.scrollY + window.innerHeight * 0.5 - top, 0, height);
      thread.style.setProperty('--thread', (y / height).toFixed(4));
      thread.style.setProperty('--head', `${y.toFixed(1)}px`);
      head.style.opacity = y > 0 && y < height ? 1 : 0;
      nodes.forEach((n, i) => n.classList.toggle('on', y >= marks[i] - 1));
    },
  };
}

/* ── Click to wave: tap the character and he says hi ──
   The wave exists only standing, so at the desk he answers with a speech bubble instead. */
const WAVE = { from: 0, to: FRAMES.sections.hero[1], ms: 2400, blend: 260 };
const AT_DESK = [122, 419];                       // fly-in, seated sections and fly-out (web frame indices)

function initWave(stage, currentFrame) {
  const bubble = Object.assign(document.createElement('div'), { className: 'say-hi' });
  bubble.setAttribute('role', 'status');
  document.body.appendChild(bubble);
  let start = 0, bubbleTimer;
  const atDesk = () => { const f = currentFrame(); return f >= AT_DESK[0] && f <= AT_DESK[1]; };
  const inside = (x, y) => { const b = stage.charBox(); return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom; };
  const ignore = el => el.closest('a, button, input, textarea, .card, .path, .badge, .topbar');

  function say(text) {
    const b = stage.charBox();
    bubble.textContent = text;
    bubble.style.left = `${(b.left + b.right) / 2 + (b.right - b.left) * 0.18}px`;
    bubble.style.top = `${b.top + 6}px`;
    bubble.classList.remove('show'); void bubble.offsetWidth; bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2600);
  }

  function hello() {
    if (atDesk()) { say('Hi! A bit busy building right now 😄'); return; }
    say('Hi there! 👋');
    if (!prefersReduced && !start) start = performance.now();
  }
  document.addEventListener('click', e => {
    if (ignore(e.target) || !inside(e.clientX, e.clientY)) return;
    hello();
  });
  document.querySelector('.say-hi-key').addEventListener('click', hello);
  // a pointer cursor over him hints that he's clickable
  document.addEventListener('mousemove', e => {
    document.body.classList.toggle('can-wave', !ignore(e.target) && inside(e.clientX, e.clientY));
  }, { passive: true });

  return {
    // returns [i, j, alpha] to draw while waving, or null when not
    frame(now, scrollFrame) {
      if (!start) return null;
      const t = now - start, { blend, ms } = WAVE;
      const at = k => WAVE.from + easeInOut(clamp(k, 0, 1)) * (WAVE.to - WAVE.from);
      if (t < blend) return [Math.round(scrollFrame), Math.round(at(0)), t / blend];          // ease into the wave
      if (t < blend + ms) { const f = at((t - blend) / ms); return [Math.floor(f), Math.floor(f) + 1, f % 1]; }
      if (t < 2 * blend + ms) return [Math.round(at(1)), Math.round(scrollFrame), (t - blend - ms) / blend]; // and back out
      start = 0;
      return null;
    },
  };
}

/* ── Cursor light: cards catch a soft glow where the pointer is ── */
function initCursorLight() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.addEventListener('pointermove', e => {
    const el = e.target.closest('.card, .path, .badge');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

/* ── Scenes: map scroll position to frames and per-section graphics ── */
function initScenes() {
  const els = [...document.querySelectorAll('.scene')];
  const scenes = els.map(el => ({ el, name: el.dataset.scene, range: FRAMES.sections[el.dataset.scene] }));
  const pile = buildPile(document.querySelector('.pile'));
  const pileNote = document.querySelector('.pile-note');
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
      pileNote.style.opacity = easeOut(clamp((p - 0.45) / 0.15, 0, 1));
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

// the kinds of busywork teams hand me; each lands on the pile as the character sighs at it
const TASKS = ['Manual hand-offs', 'Repeat questions', 'Request queue', 'Buried in docs', 'Weekly reports', 'Data cleanup', 'Status updates', 'Model not in prod', 'Copy & paste'];

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
  document.querySelectorAll('.display, .headline').forEach(splitWords);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll(REVEALS).forEach(el => io.observe(el));
}

// wrap every word in a mask so headlines can rise in word by word (keeps <em> styling intact)
function splitWords(el) {
  const sentence = el.textContent.replace(/\s+/g, ' ').trim();
  let n = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) return walk(child);
      if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'), wi = document.createElement('span');
        w.className = 'w'; wi.className = 'wi'; wi.textContent = part;
        w.setAttribute('aria-hidden', 'true');
        wi.style.setProperty('--wi', n++);
        w.appendChild(wi); frag.appendChild(w);
      });
      child.replaceWith(frag);
    });
  };
  walk(el);
  el.appendChild(Object.assign(document.createElement('span'), { className: 'sr-only', textContent: sentence }));
  el.classList.add('split');
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
function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
