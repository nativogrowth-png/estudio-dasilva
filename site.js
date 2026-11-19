/* Estudio Da Silva · comportamiento de la maqueta. Lee config.js (ajustes) y feed.js (Instagram). */
(function () {
  'use strict';
  var S = window.SITE, F = window.FEED;
  var root = document.documentElement;
  var qs = new URLSearchParams(location.search);
  root.classList.add('js');
  if (qs.has('captura')) { if (+qs.get('captura')) root.style.setProperty('--hero-h', qs.get('captura') + 'px'); root.classList.add('static'); document.querySelectorAll('img[loading=lazy]').forEach(function (i) { i.loading = 'eager'; }); }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var miles = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };

  /* Promesa del hero (config.js, o ?promesa=B para probar) */
  var clave = (qs.get('promesa') || S.PROMESA_ACTIVA || 'A').toUpperCase();
  var p = S.PROMESAS[clave] || S.PROMESAS.A;
  $$('[data-promesa]').forEach(function (el) { el.textContent = p[el.getAttribute('data-promesa')]; });

  /* Enlaces de WhatsApp con mensaje según el botón */
  $$('[data-wa]').forEach(function (a) {
    var t = S.WA_TEXTOS[a.getAttribute('data-wa')] || S.WA_TEXTOS.general;
    a.href = 'https://wa.me/' + S.WHATSAPP + '?text=' + encodeURIComponent(t);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* Instagram: todo sale de window.FEED */
  var sinEmoji = function (t) {
    return t.replace(/[\u{1F000}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
  };
  var corto = function (t) {
    t = sinEmoji(t);
    var m = t.match(/^(.{20,}?[.?!])(\s|$)/);          /* primera oración */
    if (m && m[1].length <= 90) t = m[1];
    if (t.length > 90) t = t.slice(0, 88).replace(/\s+\S*$/, '') + '…';
    return t;
  };
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var fecha = function (iso) { var d = new Date(iso.slice(0, 10) + 'T12:00:00'); return d.getDate() + ' ' + MESES[d.getMonth()]; };

  if (F && F.perfil) {
    var pf = F.perfil;
    $$('[data-feed]').forEach(function (el) {
      var k = el.getAttribute('data-feed'), v = pf[k];
      if (v == null) return;
      el.textContent = typeof v === 'number' ? miles(v) : v;
    });
    var av = $('#igAv'); if (av && pf.foto) av.src = pf.foto;
    var fol = $('#igFollow'); if (fol) fol.href = 'https://www.instagram.com/' + pf.usuario + '/';
  }

  var list = $('#reels');
  if (list && F && F.reels) {
    list.innerHTML = F.reels.slice(0, 20).map(function (r) {
      var titulo = corto(r.titulo);
      var vistas = r.vistas != null ? '<span class="views"><svg class="ic" aria-hidden="true"><use href="#i-eye"/></svg>' + miles(r.vistas) + '</span>' : '<span></span>';
      return '<li class="reel"><a href="' + r.url + '" target="_blank" rel="noopener" aria-label="' + titulo.replace(/"/g, '&quot;') + ' (se abre en Instagram)">' +
        '<span class="reel-cover"><img src="' + r.thumb + '" alt="" ' + (qs.has('captura') ? '' : ' loading="lazy"') + ' width="400" height="711">' +
        '<span class="reel-ig" aria-hidden="true"><svg class="ic"><use href="#i-ig"/></svg></span></span>' +
        '<span class="reel-info"><span class="reel-title">' + titulo + '</span>' +
        '<span class="reel-meta">' + vistas + '<span>' + fecha(r.fecha) + '</span></span></span></a></li>';
    }).join('');
  }

  /* Carrusel (escritorio): flechas + barra de avance */
  var prev = $('#igPrev'), next = $('#igNext'), bar = $('#igBar');
  function carState() {
    if (!list) return;
    var max = list.scrollWidth - list.clientWidth;
    var x = list.scrollLeft;
    if (prev) prev.disabled = x <= 4;
    if (next) next.disabled = x >= max - 4;
    if (bar && max > 0) {
      var w = list.clientWidth / list.scrollWidth;
      bar.style.width = (w * 100) + '%';
      bar.style.transform = 'translateX(' + ((x / max) * (1 / w - 1) * 100) + '%)';
    }
  }
  function mover(dir) {
    var card = $('.reel', list); if (!card) return;
    var paso = (card.offsetWidth + 16) * 5;
    list.scrollBy({ left: dir * paso, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  if (prev) prev.addEventListener('click', function () { mover(-1); });
  if (next) next.addEventListener('click', function () { mover(1); });
  if (list) { list.addEventListener('scroll', carState, { passive: true }); window.addEventListener('resize', carState); carState(); }
  if (list) list.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { mover(.2); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { mover(-.2); e.preventDefault(); }
  });

  /* Servicios: acordeón en celular, lista abierta en escritorio */
  var mq = matchMedia('(min-width: 1024px)');
  function servicios() {
    var ds = $$('#svList .svc');
    if (mq.matches) ds.forEach(function (d) { d.removeAttribute('name'); d.open = true; });
    else ds.forEach(function (d, i) { d.setAttribute('name', 'svc'); d.open = i === 0; });
  }
  servicios();
  (mq.addEventListener ? mq.addEventListener('change', servicios) : mq.addListener(servicios));

  /* Testimonios: si una tarjeta trae data-video, se reproduce ahí mismo */
  $$('.t-card').forEach(function (c) {
    var src = c.getAttribute('data-video');
    if (!src) return;
    c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-label', 'Reproducir testimonio');
    var play = function () {
      var v = document.createElement('video');
      v.src = src; v.controls = true; v.playsInline = true; v.autoplay = true;
      v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000';
      c.innerHTML = ''; c.appendChild(v);
    };
    c.addEventListener('click', play);
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
  });

  /* Menú del celular y encabezado */
  var hdr = $('.site-header'), btn = $('#menuBtn');
  btn.addEventListener('click', function () {
    var o = hdr.classList.toggle('open');
    btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { hdr.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }); });
  var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Entrada suave (una sola, respeta reduced-motion por CSS) */
  var rv = $$('.reveal');
  if ('IntersectionObserver' in window && !root.classList.contains('static')) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* Formulario: arma la consulta y la abre en WhatsApp, lista para enviar */
  var form = $('#form'), ok = $('#formOk');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var vacio = false;
    ['#f-nombre', '#f-wa', '#f-msg'].forEach(function (s) {
      var el = $(s), bad = !el.value.trim();
      el.classList.toggle('invalid', bad); el.setAttribute('aria-invalid', bad);
      if (bad && !vacio) { el.focus(); vacio = true; }
    });
    if (vacio) return;
    var perfil = (form.querySelector('input[name=perfil]:checked') || {}).value === 'emprendedor' ? 'emprendedor/a' : 'una empresa';
    var txt = 'Hola Marianela, vengo de la web. Soy ' + $('#f-nombre').value.trim() + ' (' + perfil + ').\n' +
      $('#f-msg').value.trim() + '\nMi WhatsApp: ' + $('#f-wa').value.trim();
    window.open('https://wa.me/' + S.WHATSAPP + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
    ok.hidden = false; form.reset();
  });
})();
