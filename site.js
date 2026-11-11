(() => {
const images = {
  stock: ['جرد الأصناف', 'stock.webp'],
  stockcard: ['كارت تتبع الصنف', 'stockcard.webp'],
  customers: ['حسابات العملاء', 'customers.webp'],
  suppliers: ['حسابات الموردين', 'suppliers.webp'],
  production: ['استهلاك الخامات في التصنيع', 'production.webp'],
  wallet: ['تحويل واستلام الأموال والليمت', 'wallet-transfer.webp'],
  walletlog: ['سجل المحافظ والتحويلات', 'wallets-log.webp']
};
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
let lang = 'ar';
const bar = $('.top');
const onScroll = () => bar.classList.toggle('scrolled', scrollY > 24);
onScroll(); addEventListener('scroll', onScroll, {passive: true});
const burger = $('.burger');
if (burger) {
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', bar.classList.toggle('open')));
  $$('.links a').forEach(a => a.addEventListener('click', () => { bar.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));
}
const nav = $('.links'), links = $$('.links a');
if (nav && links.length) {
  const pill = document.createElement('span'); pill.className = 'pill'; nav.prepend(pill);
  links.forEach(a => a.addEventListener('pointerenter', () => { pill.style.left = a.offsetLeft + 'px'; pill.style.width = a.offsetWidth + 'px'; pill.style.opacity = 1; }));
  nav.addEventListener('pointerleave', () => { pill.style.opacity = 0; });
}
if (links.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), {rootMargin: '-45% 0px -50% 0px'});
  $$('main section[id]').forEach(s => spy.observe(s));
}
const tilt = $('#tilt'), vis = $('.visual');
if (tilt && vis && !reduced.matches) {
  vis.addEventListener('pointermove', e => {
    const r = vis.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    tilt.style.setProperty('--ry', (x - .5) * -8 + 'deg'); tilt.style.setProperty('--rx', (y - .5) * 6 + 'deg');
    tilt.style.setProperty('--gx', x * 100 + '%'); tilt.style.setProperty('--gy', y * 100 + '%');
    vis.style.setProperty('--px', (x - .5) * 2); vis.style.setProperty('--py', (y - .5) * 2);
  });
  vis.addEventListener('pointerleave', () => ['--ry', '--rx'].forEach(p => tilt.style.setProperty(p, '0deg')) || ['--px', '--py'].forEach(p => vis.style.setProperty(p, 0)));
}
if (fine.matches && !reduced.matches) {
  $$('.button').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5) * 10 + 'px'); b.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5) * 8 + 'px'); });
    b.addEventListener('pointerleave', () => { b.style.removeProperty('--tx'); b.style.removeProperty('--ty'); });
  });
}
$$('.glow').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px');
}));
const steps = $$('[data-screen]');
function activate(step) {
  if (step.classList.contains('active')) return;
  const file = images[step.dataset.screen][1], title = step.querySelector('button').textContent;
  const img = $('#screen');
  steps.forEach(item => {
    const on = item === step;
    item.classList.toggle('active', on);
    item.querySelector('button').setAttribute('aria-pressed', on);
  });
  img.src = $('#zoom').href = 'assets/' + file;
  img.alt = (lang === 'en' ? 'Screen: ' : 'شاشة ') + title;
  $('#caption').textContent = title;
  img.getAnimations().forEach(a => a.cancel());
  if (!reduced.matches) img.animate([{opacity: .2, transform: 'scale(.97)', filter: 'blur(8px)'}, {opacity: 1, transform: 'scale(1)', filter: 'blur(0)'}], {duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)'});
}
steps.forEach(step => step.querySelector('button').addEventListener('click', () => activate(step)));
if (steps.length && 'IntersectionObserver' in window) {
  const desktop = matchMedia('(min-width: 900px)');
  const observer = new IntersectionObserver(entries => {
    if (!desktop.matches || reduced.matches) return;
    entries.forEach(entry => { if (entry.isIntersecting) activate(entry.target); });
  }, {rootMargin: '-42% 0px -42% 0px'});
  steps.forEach(step => observer.observe(step));
}
const form = $('#demo-form');
if (form) {
  const activity = new URLSearchParams(location.search).get('activity');
  const select = form.elements.activity;
  if ([...select.options].some(option => option.value === activity)) select.value = activity;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const n = form.elements.customer.value, a = select.selectedOptions[0].textContent, p = form.elements.phone.value, m = form.elements.message ? form.elements.message.value.trim() : '';
    const msg = lang === 'en' ? 'Hello, I’m ' + n + '. My business: ' + a + '. My number: ' + p + '. I’d like to know more about FlexMax Accounts.' + (m ? '\nMessage: ' + m : '') : 'السلام عليكم، أنا ' + n + '، نشاطي: ' + a + '، ورقمي: ' + p + '. عايز أعرف أكتر عن FlexMax Accounts' + (m ? '\nالرسالة: ' + m : '');
    open('https://wa.me/201101830923?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
}
// روابط السوشيال: حط الرابط هنا لما الصفحة تجهز وهيشتغل الزرار تلقائياً
const SOCIAL = { facebook: '', instagram: '', youtube: '', tiktok: '' };
$$('[data-social]').forEach(a => {
  const url = SOCIAL[a.dataset.social];
  if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.removeAttribute('aria-disabled'); }
});

// ---------- أكورديون بحركة فتح وقفل ----------
$$('.faq details').forEach(det => {
  const sum = det.querySelector('summary'); let anim = null, target = det.open;
  det.classList.toggle('is-open', det.open);
  sum.addEventListener('click', e => {
    e.preventDefault();
    if (anim) { anim.onfinish = null; anim.cancel(); anim = null; det.open = target; det.style.overflow = ''; }
    const opening = !det.open; target = opening;
    if (reduced.matches) { det.open = opening; det.classList.toggle('is-open', opening); return; }
    det.style.overflow = 'hidden';
    const from = det.offsetHeight; let to;
    if (opening) { det.open = true; det.classList.add('is-open'); to = det.offsetHeight; }
    else { det.classList.remove('is-open'); det.open = false; to = det.offsetHeight; det.open = true; }
    anim = det.animate({height: [from + 'px', to + 'px']}, {duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)'});
    anim.onfinish = () => { det.open = opening; det.style.overflow = ''; anim = null; };
  });
});

// ---------- اللغة: عربي (RTL) / English (LTR) ----------
const WA_MSG = {ar: 'السلام عليكم، عايز أعرف أكتر عن برنامج FlexMax Accounts', en: 'Hello, I’d like to know more about FlexMax Accounts'};
function setLang(l, persist) {
  lang = l;
  const root = document.documentElement; root.lang = l; root.dir = l === 'en' ? 'ltr' : 'rtl';
  $$('[data-en]').forEach(el => {
    if (!el.hasAttribute('data-ar')) el.setAttribute('data-ar', el.innerHTML);
    el.innerHTML = l === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar');
  });
  ['alt', 'aria-label', 'content'].forEach(at => $$('[data-en-' + at + ']').forEach(el => {
    const k = 'data-ar-' + at;
    if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(at));
    el.setAttribute(at, l === 'en' ? el.getAttribute('data-en-' + at) : el.getAttribute(k));
  }));
  $$('a[href^="https://wa.me/"]').forEach(a => { a.href = 'https://wa.me/201101830923?text=' + encodeURIComponent(WA_MSG[l]); });
  $$('a[href^="demo.html"]').forEach(a => { const q = new URL(a.getAttribute('href'), 'http://x/').searchParams; q.set('lang', l); a.setAttribute('href', 'demo.html?' + q); });
  const btn = $('.lang');
  if (btn) { btn.textContent = l === 'en' ? 'عربي' : 'EN'; btn.setAttribute('aria-label', l === 'en' ? 'التبديل إلى العربية' : 'Switch to English'); }
  const active = $('.step.active');
  if (active && $('#screen')) {
    const t = active.querySelector('button').textContent;
    $('#screen').alt = (l === 'en' ? 'Screen: ' : 'شاشة ') + t; $('#caption').textContent = t;
  }
  if (persist) { try { localStorage.setItem('fm-lang', l); } catch (e) {} }
}
{
  const q = new URLSearchParams(location.search).get('lang');
  let saved = null; try { saved = localStorage.getItem('fm-lang'); } catch (e) {}
  setLang(q === 'en' || q === 'ar' ? q : saved === 'en' ? 'en' : 'ar', false);
  const btn = $('.lang'); if (btn) btn.addEventListener('click', () => setLang(lang === 'en' ? 'ar' : 'en', true));
}
})();


