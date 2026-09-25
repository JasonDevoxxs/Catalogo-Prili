/* animations.js — parallax, 3D tilt, partículas e scroll animations */

/* ---- PARALLAX HERO ---- */
export function initParallax() {
  const hero    = document.getElementById('hero');
  const content = document.getElementById('hero-content');
  const bg      = document.querySelector('.hero-bg');
  const blob1   = document.querySelector('.blob-1');
  const blob2   = document.querySelector('.blob-2');
  if (!hero || !content) return;

  const vh = window.innerHeight;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > vh * 1.2) return;

    const progress = y / vh;
    if (content) {
      content.style.transform = `translateY(${y * 0.35}px)`;
      content.style.opacity   = `${1 - progress * 1.4}`;
    }
    if (bg) bg.style.transform = `translateY(${y * 0.15}px)`;
    if (blob1) blob1.style.transform = `translate(${y * 0.08}px, ${y * 0.12}px)`;
    if (blob2) blob2.style.transform = `translate(${-y * 0.06}px, ${y * 0.08}px)`;
  }, { passive: true });

  /* paralaxe do grid no fundo */
  const grid = document.querySelector('.hero-grid');
  window.addEventListener('scroll', () => {
    if (grid) grid.style.transform = `translateY(${window.scrollY * 0.05}px)`;
  }, { passive: true });
}

/* ---- HEADER AO ROLAR ---- */
export function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ---- PARTÍCULAS ---- */
export function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      opacity: ${Math.random() * 0.4 + 0.1};
      animation-delay: ${Math.random() * 15}s;
      animation-duration: ${Math.random() * 12 + 12}s;
    `;
    container.appendChild(p);
  }
}

/* ---- 3D TILT NOS CARDS ---- */
export function apply3DTilt(card) {
  const shine = card.querySelector('.card-shine');
  let rafId;

  card.addEventListener('mousemove', e => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect  = card.getBoundingClientRect();
      const cx    = (e.clientX - rect.left) / rect.width;
      const cy    = (e.clientY - rect.top)  / rect.height;
      const tiltX = (cy - 0.5) * -18;
      const tiltY = (cx - 0.5) *  18;

      card.style.transition = 'box-shadow var(--t-med), border-color var(--t-med)';
      card.style.transform  = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px) scale(1.02)`;

      if (shine) {
        shine.style.opacity    = '1';
        shine.style.background = `radial-gradient(circle at ${cx * 100}% ${cy * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });
  });

  card.addEventListener('mouseleave', () => {
    cancelAnimationFrame(rafId);
    card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow var(--t-med), border-color var(--t-med)';
    card.style.transform  = `perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)`;
    if (shine) shine.style.opacity = '0';
  });
}

/* ---- SCROLL REVEAL ---- */
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay || (idx * 60);
      setTimeout(() => el.classList.add('visible'), Number(delay));
      observer.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .produto-card').forEach((el, i) => {
    el.dataset.delay = i * 55;
    observer.observe(el);
  });

  return observer;
}

/* ---- BOTÕES MAGNÉTICOS ---- */
export function initMagneticBtns() {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.3;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      btn.style.transform  = '';
    });
  });
}

/* ---- CONTADOR ANIMADO ---- */
export function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const startVal = 0;
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ---- INIT TODOS ---- */
export function initAll() {
  initParallax();
  initHeader();
  initParticles();
  initScrollReveal();
  initMagneticBtns();
}
