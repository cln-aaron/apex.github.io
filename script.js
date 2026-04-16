/* APEX AI BOOTCAMP 2026 — microsite interactions */

// ===== Custom cursor =====
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  const hoverables = 'a, button, .tab, .track, .deep-card, .award, .ctf, .mentor';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove('hover');
  });
})();

// ===== Scroll reveal =====
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach((el) => io.observe(el));
})();

// ===== Nav active on scroll =====
(function () {
  const links = document.querySelectorAll('nav .links a');
  if (!links.length) return;
  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY + 140;
    let idx = 0;
    sections.forEach((s, i) => {
      if (s.offsetTop <= y) idx = i;
    });
    links.forEach((a, i) => a.classList.toggle('active', i === idx));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ===== Schedule tabs =====
(function () {
  const tabs = document.querySelectorAll('.tab');
  const days = document.querySelectorAll('.day');
  tabs.forEach((t) => {
    t.addEventListener('click', () => {
      const tgt = t.dataset.day;
      tabs.forEach((x) => x.classList.toggle('active', x === t));
      days.forEach((d) => d.classList.toggle('active', d.dataset.day === tgt));
    });
  });
})();

// ===== Count-up stats =====
(function () {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1400;
      const t0 = performance.now();
      function step(t) {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = end * eased;
        const formatted = end >= 10 ? Math.round(v).toLocaleString() : v.toFixed(0);
        el.textContent = prefix + formatted + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  els.forEach((el) => io.observe(el));
})();

// ===== Hero terminal type-on =====
(function () {
  const lines = document.querySelectorAll('#hero .terminal .line');
  if (!lines.length) return;
  lines.forEach((l) => (l.style.visibility = 'hidden'));
  let i = 0;
  function next() {
    if (i >= lines.length) return;
    lines[i].style.visibility = 'visible';
    i++;
    setTimeout(next, 320);
  }
  setTimeout(next, 500);
})();
