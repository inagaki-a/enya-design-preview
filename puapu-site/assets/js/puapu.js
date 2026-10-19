/* 食べカフェ pu-a-pu  スマホのメニュー（開く・閉じる） */
(function () {
  var b = document.querySelector('.burger'), d = document.getElementById('drawer'),
      r = document.documentElement, h = document.querySelector('header.site');
  if (!b || !d || !h) return;
  function t(o) {
    if (o) d.style.top = Math.max(0, h.getBoundingClientRect().bottom) + 'px';
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
    b.setAttribute('aria-label', o ? 'メニューを閉じる' : 'メニューを開く');
    b.classList.toggle('x', o); d.classList.toggle('o', o); r.classList.toggle('lock', o);
  }
  b.addEventListener('click', function () { t(!d.classList.contains('o')); });
  d.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { t(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.classList.contains('o')) { t(false); b.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 900 && d.classList.contains('o')) t(false); });
})();

/* 動き：ヘッダーの影・スクロールで表示
   - 動きを減らす設定／IntersectionObserver が無い端末では何もしない（すべて最初から表示）
   - 隠すのは「読み込んだ時点で画面より下にある要素」だけ（見えている所がちらつかない）
   - 保険：印刷前・一定時間後には、画面の近くにある要素を必ず表示する */
(function () {
  var d = document, h = d.querySelector('header.site');
  function sc() { if (h) h.classList.toggle('sc', (window.pageYOffset || d.documentElement.scrollTop) > 8); }
  window.addEventListener('scroll', sc, { passive: true }); sc();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var list = [], vh = window.innerHeight || d.documentElement.clientHeight;
  var LIST = '.doors,.tiles,.svc,.gallery,.cards,.flow,.ngrid,.nl,.mlist,.imgs,.pn,.tbl,.mnote';
  function add(el, i) {
    if (!el || el.classList.contains('rv') || el.getBoundingClientRect().top < vh) return;
    el.style.setProperty('--d', (Math.min(i, 5) * 0.08) + 's');
    el.classList.add('rv'); list.push(el);
  }
  function walk(parent) {
    Array.prototype.forEach.call(parent.children, function (c, i) {
      if (c.matches('.split,.art,.faq')) walk(c);
      else if (c.matches(LIST) && c.children.length > 1) {
        Array.prototype.forEach.call(c.children, function (li, j) { add(li, j); });
      } else add(c, Math.min(i, 2));
    });
  }
  d.querySelectorAll('main section:not(.hero1):not(.phero):not(.info) > .wrap, section.contact > .wrap').forEach(walk);
  if (!list.length) return;

  function show(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    /* 表示が終わったら印を外し、ふだんのホバーの動きに戻す */
    setTimeout(function () { el.classList.remove('rv', 'in'); el.style.removeProperty('--d'); }, 1300 + parseFloat(el.style.getPropertyValue('--d') || 0) * 1000);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  list.forEach(function (el) { io.observe(el); });

  window.addEventListener('beforeprint', function () { list.forEach(show); });
  setTimeout(function () {
    list.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight * 1.1) show(el); });
  }, 2500);
})();
