/* 食べカフェ pu-a-pu 第2案（v7）：メニューの開閉・スクロール表示・地図の読み込み・下のバー */
(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 最初の画面の写真を貼る動き */
  requestAnimationFrame(function () { setTimeout(function () { d.body.classList.add('ready'); }, 60); });

  /* ヘッダーの影・下のバー */
  var hd = d.getElementById('hd'), bar = d.getElementById('bar');
  function onScroll() {
    var y = window.pageYOffset || root.scrollTop;
    if (hd) hd.classList.toggle('sc', y > 8);
    if (bar) bar.classList.toggle('show', y > 120 || reduce);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  /* 短いページでもバーが出るように */
  setTimeout(function () { if (bar) bar.classList.add('show'); }, 1200);

  /* スクロールで表示 */
  var els = d.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || reduce) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
  } else {
    /* 横にスクロールする列（スマホの写真の列など）は、1つ見えたら列の全部を表示する（画面の右外の項目が隠れたまま残らないように） */
    var show = function (el) {
      el.classList.add('in');
      var row = el.parentElement;
      if (row && row.scrollWidth > row.clientWidth + 1) {
        for (var c = row.firstElementChild; c; c = c.nextElementSibling) if (c.classList.contains('rv')) c.classList.add('in');
      }
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
    /* 保険：観測が働かないときも、画面の近くの要素は必ず表示する／印刷では全部表示 */
    setTimeout(function () {
      for (var q = 0; q < els.length; q++) if (els[q].getBoundingClientRect().top < window.innerHeight * 1.1) show(els[q]);
    }, 2500);
    window.addEventListener('beforeprint', function () { for (var q = 0; q < els.length; q++) els[q].classList.add('in'); });
  }

  /* メニュー（下から出るシート） */
  var btn = d.querySelector('.menu-btn'), sheet = d.getElementById('sheet');
  if (btn && sheet) {
    var pn = sheet.querySelector('.sheet-pn'), last = null;
    var open = function () {
      last = d.activeElement;
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      root.style.overflow = 'hidden';
      requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('open'); }); });
      var f = sheet.querySelector('.sheet-x'); if (f) f.focus();
    };
    var close = function () {
      sheet.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      root.style.overflow = '';
      setTimeout(function () { sheet.hidden = true; }, reduce ? 0 : 350);
      if (last && last.focus) last.focus();
    };
    btn.addEventListener('click', open);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) close();
      else if (e.target.closest('a') && e.target.closest('a').getAttribute('href').charAt(0) === '#') close();
    });
    d.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { /* シートの中だけを移動 */
        var f = pn.querySelectorAll('a,button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  /* 地図：ボタンを押したときだけ Googleマップを読み込む */
  var maps = d.querySelectorAll('.map[data-map]');
  for (var k = 0; k < maps.length; k++) {
    (function (m) {
      var b = m.querySelector('.map-load');
      if (!b) return;
      b.addEventListener('click', function () {
        var f = d.createElement('iframe');
        f.src = m.getAttribute('data-map');
        f.title = '食べカフェ pu-a-pu の地図';
        f.loading = 'lazy';
        f.referrerPolicy = 'no-referrer-when-downgrade';
        m.innerHTML = '';
        m.appendChild(f);
      });
    })(maps[k]);
  }

  /* ページ内の目次：いま見ている所に印 */
  var chips = d.querySelectorAll('.chips a');
  if (chips.length && 'IntersectionObserver' in window) {
    var map = {};
    chips.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          chips.forEach(function (a) { a.classList.remove('on'); });
          map[e.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var t = d.getElementById(id); if (t) io2.observe(t); });
  }
})();
