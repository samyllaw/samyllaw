/**
 * script.js — Portfolio · Samylla W.
 * 1. Theme toggle
 * 2. Hamburger + More dropdown
 * 3. Contact form
 * 4. Scroll reveal (.reveal-up, .stagger-children)
 * 5. Scrollspy
 * 6. Scroll progress + nav blur
 * 7. Hero dot-grid canvas
 * 8. Project page open/close
 */

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ── 1. THEME ───────────────────────────────────────────────── */
(function initTheme() {
  const html = document.documentElement;
  const btn  = $('#themeToggle');
  const KEY  = 'sw-theme';
  function apply(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  const saved  = localStorage.getItem(KEY);
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  apply(saved || system);
  btn.addEventListener('click', () => apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
})();


/* ── 2. HAMBURGER + MORE DROPDOWN ───────────────────────────── */
(function initNav() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const moreBtn    = $('#moreBtn');
  const moreDropdown = $('#moreDropdown');
  const moreWrapper  = moreBtn && moreBtn.closest('.nav__more');

  // Hamburger — toggles dedicated mobile menu panel
  const closeMenu = () => {
    hamburger.classList.remove('is-active');
    mobileMenu && mobileMenu.classList.remove('is-open');
    mobileMenu && mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  };
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', String(open));
  });
  // Close on any mobile menu link click
  $$('.mobile-menu__link').forEach(l => l.addEventListener('click', closeMenu));
  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-wrapper') && !e.target.closest('.mobile-menu')) closeMenu();
  });

  // Desktop More dropdown (unchanged)
  if (!moreBtn || !moreDropdown || !moreWrapper) return;
  const openMore  = () => { moreDropdown.classList.add('is-open'); moreWrapper.classList.add('is-open'); moreBtn.setAttribute('aria-expanded', 'true'); };
  const closeMore = () => { moreDropdown.classList.remove('is-open'); moreWrapper.classList.remove('is-open'); moreBtn.setAttribute('aria-expanded', 'false'); };
  const toggleMore = () => moreDropdown.classList.contains('is-open') ? closeMore() : openMore();
  moreBtn.addEventListener('click', e => { e.stopPropagation(); toggleMore(); });
  $$('.nav__dropdown-link').forEach(l => l.addEventListener('click', closeMore));
  document.addEventListener('click', e => { if (!moreWrapper.contains(e.target)) closeMore(); });
})();


/* ── 3. CONTACT FORM ────────────────────────────────────────── */
(function initForm() {
  const form    = $('#contactForm');
  if (!form) return;
  const name    = $('#name');
  const email   = $('#email');
  const message = $('#message');
  const success = $('#formSuccess');
  const EMAIL   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const err = (el, eEl, msg) => { el.classList.add('is-invalid'); eEl.textContent = msg; };
  const ok  = (el, eEl)      => { el.classList.remove('is-invalid'); eEl.textContent = ''; };
  function validate() {
    let valid = true;
    const ne = $('#nameError'), ee = $('#emailError'), me = $('#messageError');
    if (!name.value.trim())                   { err(name,    ne, 'Please enter your name.');            valid = false; } else ok(name, ne);
    if (!email.value.trim())                  { err(email,   ee, 'Please enter your email.');            valid = false; }
    else if (!EMAIL.test(email.value.trim())) { err(email,   ee, 'Please enter a valid email address.'); valid = false; } else ok(email, ee);
    if (!message.value.trim())                { err(message, me, 'Please write your message.');          valid = false; } else ok(message, me);
    return valid;
  }
  [name, email, message].forEach(el => {
    el.addEventListener('input', () => { el.classList.remove('is-invalid'); const e = $(`#${el.id}Error`); if (e) e.textContent = ''; });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    success.classList.remove('is-visible');
    if (!validate()) return;
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      form.reset();
      ['name','email','message'].forEach(id => ok($(`#${id}`), $(`#${id}Error`)));
      success.classList.add('is-visible');
      success.setAttribute('aria-hidden', 'false');
      btn.textContent = 'Send message'; btn.disabled = false;
      setTimeout(() => { success.classList.remove('is-visible'); success.setAttribute('aria-hidden','true'); }, 5000);
    }, 900);
  });
})();


/* ── 4. SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const SINGLE   = '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade';
  const STAGGER  = '.stagger-children';

  function observe(el, threshold, rootMargin) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
          // watch for exit upward so we can re-animate on next scroll down
          exitObs.observe(entry.target);
        }
      });
    }, { threshold, rootMargin });
    return io;
  }

  const singleObs  = observe(null, 0.08, '0px 0px -48px 0px');
  const staggerObs = observe(null, 0.06, '0px 0px -30px 0px');

  // When element exits above viewport, reset and re-attach reveal observer
  const exitObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // left viewport from the top (scrolling back up past it)
      if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
        entry.target.classList.remove('is-visible');
        exitObs.unobserve(entry.target);
        const isStagger = entry.target.matches(STAGGER);
        (isStagger ? staggerObs : singleObs).observe(entry.target);
      }
    });
  }, { threshold: 0 });

  $$(SINGLE).forEach(el => singleObs.observe(el));
  $$(STAGGER).forEach(el => staggerObs.observe(el));
})();


/* ── 5. SCROLLSPY ───────────────────────────────────────────── */
(function initScrollspy() {
  const sections = $$('section[id]');
  const links    = $$('.nav__link, .nav__dropdown-link');
  if (!sections.length || !links.length) return;
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '60');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = links.find(l => l.getAttribute('href') === `#${entry.target.id}`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: `-${navH}px 0px -55% 0px` });
  sections.forEach(s => obs.observe(s));
})();


/* ── 6. SCROLL PROGRESS + NAV BLUR ─────────────────────────── */
(function initScroll() {
  const bar = $('#scrollProgress');
  const nav = $('.nav-wrapper');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (bar) bar.style.width = pct + '%';
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });
})();


/* ── 7. HERO CANVAS ─────────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const SPACING = 28, R = 1.2;

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }

  function draw() {
    if (!canvas.width) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const theme = document.documentElement.getAttribute('data-theme');
    const base  = theme === 'dark' ? 'rgba(90,152,200,' : 'rgba(39,75,103,';
    const cols  = Math.ceil(canvas.width  / SPACING) + 1;
    const rows  = Math.ceil(canvas.height / SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * SPACING, y = r * SPACING;
        const dx = (x / canvas.width) - 0.5, dy = (y / canvas.height) - 0.5;
        const alpha = Math.max(0, 0.55 - Math.sqrt(dx*dx + dy*dy) * 1.1);
        ctx.beginPath();
        ctx.arc(x, y, R, 0, Math.PI * 2);
        ctx.fillStyle = base + alpha.toFixed(3) + ')';
        ctx.fill();
      }
    }
  }

  new ResizeObserver(() => { resize(); draw(); }).observe(canvas);
  resize(); draw();
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();


/* ── 8. PROJECT PAGES ───────────────────────────────────────── */
(function initProjectPages() {
  const portfolio = $('#mainPortfolio');
  const footer    = $('.footer');
  let savedScrollY = 0;

  function openPage(id) {
    const page = $(`#page-${id}`);
    if (!page) return;
    savedScrollY = window.scrollY;
    portfolio.style.display = 'none';
    if (footer) footer.style.display = 'none';
    page.style.display = 'block';
    page.setAttribute('aria-hidden', 'false');
    page.classList.add('is-open');
    window.scrollTo(0, 0);
    document.title = (page.querySelector('.page-nav__title')?.textContent || '') + ' — Samylla W.';
  }

  function closePage() {
    $$('.project-page').forEach(p => {
      p.style.display = 'none';
      p.setAttribute('aria-hidden', 'true');
      p.classList.remove('is-open');
    });
    portfolio.style.display = '';
    if (footer) footer.style.display = '';
    document.title = 'Samylla W. — Design Engineer';
    // Two rAF frames so the portfolio is fully painted before scrolling
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, savedScrollY)));
  }

  $$('[data-project]').forEach(btn => btn.addEventListener('click', () => openPage(btn.dataset.project)));
  $$('[data-article]').forEach(btn => btn.addEventListener('click', () => openPage('article-' + btn.dataset.article)));
  $$('[data-close]').forEach(btn => btn.addEventListener('click', closePage));
})();


/* ── 9. SCROLL TO TOP BUTTON ────────────────────────────────── */
(function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M8 12V4M4 8l4-4 4 4"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
