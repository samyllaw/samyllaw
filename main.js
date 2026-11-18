/* Samylla W. — portfolio interactions (no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var menu = document.getElementById('m-menu');
  var openBtn = document.querySelector('[data-menu-open]');
  var closeBtn = document.querySelector('[data-menu-close]');
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open && closeBtn) closeBtn.focus(); else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); });

  /* Home: bilingual statement (PT ⇄ EN) */
  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var layers = hero.querySelectorAll('[data-lang]');
    var buttons = hero.querySelectorAll('[data-set-lang]');
    var current = 'pt', manual = false;
    function show(lang) {
      current = lang;
      layers.forEach(function (p) {
        var on = p.getAttribute('data-lang') === lang;
        p.setAttribute('data-on', on ? 'true' : 'false');
        p.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === lang ? 'true' : 'false'); });
    }
    setTimeout(function () { show('pt'); }, 350);
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { manual = true; show(b.getAttribute('data-set-lang')); });
    });
    if (!reduce) setInterval(function () { if (!manual) show(current === 'pt' ? 'en' : 'pt'); }, 5000);
  }

  /* About: experience accordion (all closed by default, one open at a time) */
  var rows = document.querySelectorAll('.xr');
  rows.forEach(function (row) {
    var btn = row.querySelector('.xb');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var willOpen = !row.classList.contains('xr-open');
      rows.forEach(function (r) {
        r.classList.remove('xr-open');
        var b = r.querySelector('.xb'); if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) { row.classList.add('xr-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* Scroll reveal fallback for browsers without CSS scroll-driven animations */
  var supportsTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (!supportsTimeline && 'IntersectionObserver' in window && !reduce) {
    var els = document.querySelectorAll('.sr, .sg-it');
    els.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(40px)'; el.style.transition = 'opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'none'; io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
})();
