/* ============================================================
   GATEGuide — script.js
   All site interactivity
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── SCROLL PROGRESS BAR ─────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ── MOBILE MENU ─────────────────────────────────── */
  document.getElementById('hamburger').addEventListener('click', function () {
    document.getElementById('mobile-menu').classList.toggle('open');
  });
  document.querySelectorAll('[data-action="closeMenu"]').forEach(el => {
    el.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('open'));
  });

  /* ── DARK / LIGHT MODE TOGGLE ─────────────────────── */
  const toggleBtn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('gateGuideTheme');
  if (saved === 'light') { document.body.classList.add('light-mode'); toggleBtn.textContent = '☀️'; }
  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    toggleBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('gateGuideTheme', isLight ? 'light' : 'dark');
  });

  /* ── STICKY CTA BAR ──────────────────────────────── */
  const stickyCTA  = document.getElementById('sticky-cta');
  const stickyClose = document.getElementById('sticky-cta-close');
  const bookSection = document.getElementById('book');
  let ctaDismissed = false;

  setTimeout(() => { if (!ctaDismissed) stickyCTA.classList.add('visible'); }, 3000);
  stickyClose.addEventListener('click', () => { stickyCTA.classList.remove('visible'); ctaDismissed = true; });
  document.getElementById('sticky-cta-btn').addEventListener('click', () => {
    stickyCTA.classList.remove('visible');
  });
  const ctaObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { stickyCTA.classList.remove('visible'); }
      else if (!ctaDismissed) { stickyCTA.classList.add('visible'); }
    });
  }, { threshold: 0.1 });
  ctaObs.observe(bookSection);

  /* ── FAQ ACCORDION ───────────────────────────────── */
  document.querySelectorAll('[data-action="toggleFAQ"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── UPI PANEL TOGGLE ────────────────────────────── */
  document.querySelectorAll('[data-action="toggleUPI"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-target');
      const panel = document.getElementById(id);
      const wasVisible = panel.classList.contains('visible');
      document.querySelectorAll('.upi-panel.visible').forEach(p => p.classList.remove('visible'));
      if (!wasVisible) {
        panel.classList.add('visible');
        setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      }
    });
  });

  /* ── COPY UPI ID ─────────────────────────────────── */
  document.querySelectorAll('[data-action="copyUPI"]').forEach(el => {
    el.addEventListener('click', function () {
      const okId = this.getAttribute('data-target');
      navigator.clipboard.writeText('6351023729@ptyes').then(() => {
        const badge = document.getElementById(okId);
        badge.style.display = 'inline';
        setTimeout(() => badge.style.display = 'none', 2500);
      }).catch(() => prompt('Copy your UPI ID:', '6351023729@ptyes'));
    });
  });

  /* ── BOOKING FORM (Formspree AJAX) ───────────────── */
  const form = document.getElementById('gate-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      let valid = true;
      const name    = document.getElementById('f-name');
      const email   = document.getElementById('f-email');
      const session = document.getElementById('f-session');

      [name, email, session].forEach(el => el.classList.remove('input-invalid'));
      document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');

      if (!name.value.trim()) { name.classList.add('input-invalid'); document.getElementById('err-name').style.display = 'block'; valid = false; }
      if (!email.value.trim() || !email.value.includes('@')) { email.classList.add('input-invalid'); document.getElementById('err-email').style.display = 'block'; valid = false; }
      if (!session.value) { session.classList.add('input-invalid'); document.getElementById('err-session').style.display = 'block'; valid = false; }
      if (!valid) return;

      const btn = document.getElementById('submit-btn');
      document.getElementById('btn-text').style.display = 'none';
      document.getElementById('btn-loader').style.display = 'inline';
      btn.disabled = true; btn.style.opacity = '0.7';
      document.getElementById('form-error').style.display = 'none';

      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          document.getElementById('booking-form-box').style.display = 'none';
          document.getElementById('success-box').style.display = 'block';
          document.getElementById('success-box').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else { throw new Error(); }
      } catch {
        document.getElementById('form-error').style.display = 'block';
        document.getElementById('btn-text').style.display = 'inline';
        document.getElementById('btn-loader').style.display = 'none';
        btn.disabled = false; btn.style.opacity = '1';
      }
    });
  }

  /* ── TYPEWRITER EFFECT (hero) ────────────────────── */
  const phrases = [
    'GATE 2027 Aspirant?',
    'Struggling with Algorithms?',
    'Targeting IIT / IISc?',
    'Need 1:1 Guidance?'
  ];
  const target = document.getElementById('typewriter-text');
  if (target) {
    let pi = 0, ci = 0, deleting = false;
    function type() {
      const phrase = phrases[pi];
      if (!deleting) {
        target.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        target.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, deleting ? 55 : 90);
    }
    setTimeout(type, 1200);
  }

  /* ── SCROLL FADE-IN ANIMATIONS ───────────────────── */
  const fadeEls = document.querySelectorAll(
    '.step-card, .price-card, .testimonial, .resource-card, .faq-item, .subject-box'
  );
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeUp 0.55s ease both';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => { el.style.opacity = '0'; obs.observe(el); });

});
