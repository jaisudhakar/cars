/* Small car sections:
 *   [data-car-art="suv"] data-paint="#hex"   draws a car into any element
 *   [data-count-to="620"]                   number counts up when scrolled into view
 *   [data-fin]                              finance calculator (monthly payment)
 *   [data-td-form]                          test-drive request form (front-end demo) */
(function () {
  'use strict';
  if (window.CarSections) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function cur(el) { return (el && el.closest('[data-currency]') || document.documentElement).getAttribute('data-currency') || 'USD'; }
  function money(n, c, dec) {
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: c, maximumFractionDigits: dec || 0, minimumFractionDigits: dec || 0 }).format(n); }
    catch (e) { return '$' + n.toFixed(dec || 0); }
  }
  function amount(p) { return window.SiteCart ? window.SiteCart.parsePrice(p) : parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0; }

  /* ---------- car drawings ---------- */
  function arts(root) {
    if (!window.CarArt) return;
    [].forEach.call(root.querySelectorAll('[data-car-art]'), function (el) {
      if (el.__art) return;
      el.__art = true;
      el.innerHTML = window.CarArt.svg(el.getAttribute('data-car-art'), el.getAttribute('data-paint') || '#c3161f') + el.innerHTML;
    });
  }

  /* ---------- count-up numbers ---------- */
  function counters(root) {
    var els = [].slice.call(root.querySelectorAll('[data-count-to]')).filter(function (el) { return !el.__c; });
    els.forEach(function (el) {
      el.__c = true;
      var to = parseFloat(el.getAttribute('data-count-to'));
      var dec = (el.getAttribute('data-count-to').split('.')[1] || '').length;
      var out = el.querySelector('[data-count]') || el;
      function run() {
        if (reduce) { out.textContent = to.toFixed(dec); return; }
        var t0 = performance.now(), dur = 1600;
        (function step(now) {
          var t = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - t, 4);
          out.textContent = (to * e).toFixed(dec);
          if (t < 1) requestAnimationFrame(step);
        })(t0);
      }
      out.textContent = (0).toFixed(dec);
      if (!('IntersectionObserver' in window)) { run(); return; }
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { io.disconnect(); run(); }
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* ---------- finance calculator ---------- */
  function finance(sec) {
    var json = sec.querySelector('[data-fin-json]');
    var cars;
    try { cars = json ? JSON.parse(json.textContent) : (window.CARS || []); } catch (e) { cars = []; }
    if (!cars.length) return;
    var c = cur(sec);
    var sel = sec.querySelector('[data-fin-car]');
    var down = sec.querySelector('[data-fin-down]');
    var apr = sec.querySelector('[data-fin-apr]');
    var terms = sec.querySelector('[data-fin-terms]');
    var art = sec.querySelector('[data-fin-art]');
    var o = {
      price: sec.querySelector('[data-fin-price]'), down: sec.querySelector('[data-fin-down-out]'), apr: sec.querySelector('[data-fin-apr-out]'),
      monthly: sec.querySelector('[data-fin-monthly]'), loan: sec.querySelector('[data-fin-loan]'), total: sec.querySelector('[data-fin-total]'),
      name: sec.querySelector('[data-fin-name]')
    };
    sel.innerHTML = cars.map(function (car, i) { return '<option value="' + i + '">' + car.name + ' — from ' + (car.paints && car.paints[0] ? car.paints[0].price : car.price) + '</option>'; }).join('');
    var months = 48, shown = 0, raf = 0;
    if (terms) {
      var on = terms.querySelector('[aria-pressed="true"]');
      if (on) months = +on.getAttribute('data-months');
      terms.addEventListener('click', function (e) {
        var b = e.target.closest('[data-months]');
        if (!b) return;
        [].forEach.call(terms.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        months = +b.getAttribute('data-months');
        calc();
      });
    }
    function fill(r) { r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); }
    function drawCar(swap) {
      var car = cars[+sel.value];
      if (!art || !window.CarArt) return;
      var p = car.paints[0];
      var img = p.image || car.image;
      art.innerHTML = img ? '<img src="' + img + '" alt="">' : window.CarArt.svg(car.style, p.hex, { title: car.name });
      if (swap && !reduce) { art.classList.remove('is-swap'); void art.offsetWidth; art.classList.add('is-swap'); }
      if (o.name) o.name.textContent = car.name;
    }
    function calc() {
      var car = cars[+sel.value];
      var price = car.paints && car.paints[0] ? amount(car.paints[0].price) : amount(car.price);
      var dp = price * (+down.value / 100);
      var loan = Math.max(0, price - dp);
      var r = +apr.value / 100 / 12;
      var m = r ? loan * r / (1 - Math.pow(1 + r, -months)) : loan / months;
      fill(down); fill(apr);
      o.price.textContent = money(price, c);
      o.down.textContent = down.value + '% · ' + money(dp, c);
      o.apr.textContent = (+apr.value).toFixed(1) + '%';
      o.loan.textContent = money(loan, c);
      o.total.textContent = money(m * months + dp, c);
      tween(m);
    }
    function tween(to) {
      cancelAnimationFrame(raf);
      if (reduce) { shown = to; o.monthly.firstChild.nodeValue = money(to, c); return; }
      var from = shown, t0 = performance.now();
      (function step(now) {
        var t = clamp((now - t0) / 500, 0, 1), e = 1 - Math.pow(1 - t, 3);
        shown = from + (to - from) * e;
        o.monthly.firstChild.nodeValue = money(shown, c);
        if (t < 1) raf = requestAnimationFrame(step);
      })(t0);
    }
    sel.addEventListener('change', function () { drawCar(true); calc(); });
    down.addEventListener('input', calc);
    apr.addEventListener('input', calc);
    var pre = sec.getAttribute('data-fin-default');
    if (pre) cars.forEach(function (car, i) { if (car.id === pre) sel.value = i; });
    drawCar(false);
    calc();
  }

  /* ---------- test drive form ---------- */
  function testDrive(form) {
    var msg = form.parentNode.querySelector('.td-msg');
    var sel = form.querySelector('select[name="model"]');
    if (sel && sel.options.length <= 1 && window.CARS) {
      sel.innerHTML += window.CARS.map(function (c) { return '<option>' + c.name + '</option>'; }).join('');
    }
    var date = form.querySelector('input[type="date"]');
    if (date) date.min = new Date().toISOString().slice(0, 10);
    form.addEventListener('submit', function (e) {
      if (form.hasAttribute('data-td-native')) return;   // Shopify contact form: let it post
      e.preventDefault();
      var ok = form.checkValidity();
      form.classList.toggle('is-error', !ok);
      if (!ok) { msg.className = 'td-msg is-err'; msg.textContent = 'Please fill in every field.'; return; }
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      msg.className = 'td-msg is-ok';
      msg.textContent = 'Thanks ' + name.split(' ')[0] + ' — your ' + (sel ? sel.value : 'test drive') + ' is pencilled in. We will call to confirm.';
      form.reset();
    });
  }

  function init(root) {
    root = root || document;
    arts(root);
    counters(root);
    [].forEach.call(root.querySelectorAll('[data-fin]'), function (s) { if (!s.__f) { s.__f = 1; finance(s); } });
    [].forEach.call(root.querySelectorAll('[data-td-form]'), function (f) { if (!f.__t) { f.__t = 1; testDrive(f); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
  window.CarSections = { init: init };
})();
