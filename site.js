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
  const glow = document.createElement('div'); glow.className = 'cursor-glow'; document.body.append(glow);
  addEventListener('pointermove', e => { glow.style.opacity = 1; glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, {passive: true});
  document.documentElement.addEventListener('pointerleave', () => { glow.style.opacity = 0; });
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
  const [title, file] = images[step.dataset.screen];
  const img = $('#screen');
  steps.forEach(item => {
    const on = item === step;
    item.classList.toggle('active', on);
    item.querySelector('button').setAttribute('aria-pressed', on);
  });
  img.src = $('#zoom').href = 'assets/' + file;
  img.alt = 'شاشة ' + title;
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
    const msg = 'السلام عليكم، أنا ' + form.elements.customer.value + '، نشاطي: ' + select.selectedOptions[0].textContent + '، ورقمي: ' + form.elements.phone.value + '. عايز أعرف أكتر عن FlexMax Accounts';
    open('https://wa.me/201101830923?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
}
// روابط السوشيال: حط الرابط هنا لما الصفحة تجهز وهيشتغل الزرار تلقائياً
const SOCIAL = { facebook: '', instagram: '', youtube: '', tiktok: '' };
$$('[data-social]').forEach(a => {
  const url = SOCIAL[a.dataset.social];
  if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.removeAttribute('aria-disabled'); }
});
})();
