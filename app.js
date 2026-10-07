/* ============================================================
   Portfolio JS — nav state, mobile menu, reveal on scroll
   ============================================================ */

/* ---------- Nav state + active link ---------- */
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = [...document.querySelectorAll('section[id]')];

function onScroll() {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', y > 24);

  const mid = y + window.innerHeight * 0.35;
  let active = null;
  for (const s of sections) {
    if (s.offsetTop <= mid) active = s.id;
  }
  navLinks.forEach((l) => l.classList.toggle('active', l.dataset.target === active));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
  menu.querySelectorAll('a[href]').forEach((l) => l.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) setOpen(false); });
})();

/* ---------- Reveal on view (staggered within each parent) ---------- */
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  // siblings revealed together get a small stagger
  const groups = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(i, 5) * 70}ms`);
    groups.set(parent, i + 1);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
})();
