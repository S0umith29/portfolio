/* ── Bootstrap ──────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {

  /* 1. GSAP + ScrollTrigger registration */
  gsap.registerPlugin(ScrollTrigger);

  /* 2. Lenis smooth scroll */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    duration:  prefersReduced ? 0 : 1.2,
    easing:    t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  /* Tick Lenis inside GSAP's RAF so ScrollTrigger stays in sync */
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* Expose for section scripts */
  window.lenis = lenis;

  /* ── Hero ───────────────────────────────────────────────────── */
  initHero(prefersReduced);

  /* ── About ──────────────────────────────────────────────────── */
  initAbout(prefersReduced);

  /* ── Projects ───────────────────────────────────────────────── */
  initProjects(prefersReduced);

  /* ── Skills ─────────────────────────────────────────────────── */
  initSkills(prefersReduced);

  /* ── Contact ─────────────────────────────────────────────────── */
  initContact(prefersReduced);
});

/* ─────────────────────────── initSkills ────────────────────────
   Each .skill-group (category label + chips row) fades up with
   stagger as the section enters the viewport.
   Individual chips also get a micro-stagger so the reveal reads
   left-to-right across each row.
   Skipped entirely when prefers-reduced-motion is set — chips
   remain visible at their natural CSS state.
──────────────────────────────────────────────────────────────── */
function initSkills(prefersReduced) {
  if (prefersReduced) return;

  /* Reveal each category row */
  gsap.from('#skills .skill-group', {
    opacity:  0,
    y:        36,
    duration: 0.7,
    stagger:  0.13,
    ease:     'power2.out',
    scrollTrigger: {
      trigger: '#skills .skills-list',
      start:   'top 80%',
    },
  });

  /* Within each row, cascade the chips left-to-right */
  gsap.from('#skills .skill-chip', {
    opacity:  0,
    scale:    0.88,
    duration: 0.45,
    stagger:  0.028,
    ease:     'back.out(1.4)',
    scrollTrigger: {
      trigger: '#skills .skills-list',
      start:   'top 78%',
    },
  });
}

/* ─────────────────────────── initContact ───────────────────────
   Three contact cards stagger up on scroll.
   CSS handles all hover transitions — no GSAP hover needed here
   (no 3-D tilt; the dark background calls for a cleaner lift).
──────────────────────────────────────────────────────────────── */
function initContact(prefersReduced) {
  if (prefersReduced) return;

  gsap.from('#contact .reveal-up', {
    opacity:  0,
    y:        44,
    duration: 0.8,
    stagger:  0.15,
    ease:     'power2.out',
    scrollTrigger: {
      trigger: '#contact',
      start:   'top 78%',
    },
  });

  gsap.from('#contact .contact-card', {
    opacity:  0,
    y:        32,
    duration: 0.65,
    stagger:  0.1,
    ease:     'power2.out',
    scrollTrigger: {
      trigger: '#contact .contact-cards',
      start:   'top 82%',
    },
  });
}

/* ─────────────────────────── initAbout ─────────────────────────
   Scroll-triggered fade-up: heading → photo → bio, staggered.
   Reduced-motion: elements are visible in their natural CSS state
   (no gsap.from() is called, so no opacity:0 is ever applied).
──────────────────────────────────────────────────────────────── */
function initAbout(prefersReduced) {
  if (prefersReduced) return;

  gsap.from('#about .reveal-up', {
    opacity:  0,
    y:        48,
    duration: 0.85,
    stagger:  0.18,
    ease:     'power2.out',
    scrollTrigger: {
      trigger: '#about',
      start:   'top 78%',
    },
  });
}

/* ─────────────────────────── initProjects ───────────────────────
   Cards stagger-reveal on scroll.
   Hover tilt: GSAP 3-D rotateX / rotateY based on cursor offset
   from card centre, with a slight Y lift. Resets on mouseleave.
   Both disabled when prefers-reduced-motion is set.
──────────────────────────────────────────────────────────────── */
function initProjects(prefersReduced) {
  if (prefersReduced) return;

  /* Staggered entrance */
  gsap.from('#projects .project-card', {
    opacity:  0,
    y:        56,
    duration: 0.75,
    stagger:  0.11,
    ease:     'power2.out',
    scrollTrigger: {
      trigger: '#projects .projects-grid',
      start:   'top 80%',
    },
  });

  /* Hover tilt — tracks cursor relative to card centre */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const dx  = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2); // -1 → +1
      const dy  = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2); // -1 → +1
      gsap.to(card, {
        rotateY:           dx *  5,
        rotateX:           dy * -5,
        y:                 -6,
        transformPerspective: 900,
        transformOrigin:   'center center',
        duration:          0.35,
        ease:              'power1.out',
        overwrite:         'auto',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX:  0,
        rotateY:  0,
        y:        0,
        duration: 0.55,
        ease:     'power2.out',
        overwrite: 'auto',
      });
    });
  });
}

/* ─────────────────────────── initHero ──────────────────────────
   Entrance: label fades, name lines slide up from clip, tagline
   and CTA fade in sequentially.
   Scroll: 5 shapes parallax at different speeds through the text
   plane — 3 behind (z-10), 2 in front (z-30).
   All motion disabled when prefers-reduced-motion is set.
──────────────────────────────────────────────────────────────── */
function initHero(prefersReduced) {
  const scrollArea = document.getElementById('hero-scroll-area');
  if (!scrollArea) return;

  /* ── Entrance animations (play once on load) ── */
  if (!prefersReduced) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-label', { opacity: 1, duration: 0.7, delay: 0.15 })
      .to('.name-line',  { y: '0%',   duration: 1,   stagger: 0.12 }, '-=0.4')
      .to('.hero-tagline',{ opacity: 1, y: 0,          duration: 0.7  }, '-=0.5')
      .to('.hero-cta',   { opacity: 1, duration: 0.6  }, '-=0.4');
  } else {
    /* Skip animation — reveal everything immediately */
    gsap.set(['.hero-label', '.hero-tagline', '.hero-cta'], { opacity: 1 });
    gsap.set('.name-line', { y: '0%' });
  }

  /* ── Scroll-driven parallax (shapes move at different speeds) ── */
  if (prefersReduced) return;

  /*
   * Each shape is animated from its CSS position over the full
   * scroll distance of the hero-scroll-area (200vh - 100vh = 100vh).
   * Negative y → shape travels upward; positive → downward.
   * Different speeds give the illusion of 3-D depth.
   */
  const shapes = [
    /* el,         y travel,  rotation delta */
    ['.s-ring',   -160,        40  ],   /* large ring drifts down-left slowly   */
    ['.s-blob',   -300,         0  ],   /* blob rises from bottom-left fast     */
    ['.s-bar',    -100,       -25  ],   /* bar slides diagonally, medium pace   */
    ['.s-square', -220,        55  ],   /* square climbs from bottom-right      */
    ['.s-dot',    -360,         0  ],   /* tiny dot shoots upward fastest       */
  ];

  shapes.forEach(([selector, y, rotation]) => {
    const el = document.querySelector(selector);
    if (!el) return;

    gsap.to(el, {
      y,
      rotation,
      ease: 'none',
      scrollTrigger: {
        trigger:  scrollArea,
        start:    'top top',
        end:      'bottom top',
        scrub:    1.8,
      },
    });
  });
}
