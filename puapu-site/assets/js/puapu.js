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
