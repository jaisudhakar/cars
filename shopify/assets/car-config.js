/* Car configurator — the car page (car.html) and the Shopify "Car configurator" product section.
 * The car drives in when the page opens; pick a paint and the car is repainted, the price
 * counts to the new amount and the monthly estimate follows. "Take it for a spin" drives the
 * car off-screen and back. Reserve adds the car in that paint to the garage / Shopify cart.
 *
 * Data: <script type="application/json" data-cfg-json> inside [data-cfg] (Shopify), otherwise
 * the car in window.CARS whose id matches ?id= in the URL (static site). ?paint=2 picks a paint. */
(function () {
  'use strict';
  if (window.CarConfig) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function create(main) {
    var B = window.BRAND || {};
    var CARS = window.CARS || [];
    var params = new URLSearchParams(location.search);
    var json = $('[data-cfg-json]', main);
    var car;
    try { car = json ? JSON.parse(json.textContent) : null; } catch (e) { car = null; }
    if (!car) car = CARS.filter(function (c) { return c.id === params.get('id'); })[0] || CARS[0];
    if (!car || !car.paints || !car.paints.length) return null;
    if (window.CarArt) window.CarArt.fill([car]);
    var cur = main.getAttribute('data-currency') || document.documentElement.getAttribute('data-currency') || 'USD';
    function money(n) {
      try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n); }
      catch (e) { return '$' + Math.round(n).toLocaleString(); }
    }
    function amount(p) { return typeof p.amount === 'number' ? p.amount : (window.SiteCart ? window.SiteCart.parsePrice(p.price) : parseFloat(p.price) || 0); }
    var apr = parseFloat(main.getAttribute('data-apr') || '4.9'), months = +(main.getAttribute('data-months') || 48), down = parseFloat(main.getAttribute('data-down') || '20') / 100;
    function monthly(price) {
      var loan = price * (1 - down), r = apr / 100 / 12;
      return r ? loan * r / (1 - Math.pow(1 + r, -months)) : loan / months;
    }

    var k = clamp((+(params.get('paint') || 1) || 1) - 1, 0, car.paints.length - 1);
    if (!json) document.title = car.name + ' — ' + (B.name || 'Cars');
    var stage = $('[data-cfg-car]', main);
    var ui = {
      crumb: $('[data-cfg-crumb]', main), cat: $('[data-cfg-cat]', main), name: $('[data-cfg-name]', main),
      tag: $('[data-cfg-tag]', main), desc: $('[data-cfg-desc]', main), price: $('[data-cfg-price]', main),
      paintName: $('[data-cfg-paint-name]', main), paints: $('[data-cfg-paints]', main), month: $('[data-cfg-month]', main),
      reserve: $('[data-cfg-reserve]', main), msg: $('[data-cfg-msg]', main), ghost: $('[data-cfg-ghost]', main),
      specs: $('[data-cfg-specs]', main), details: $('[data-cfg-details]', main), related: $('[data-cfg-related]', main),
      sticky: $('[data-cfg-sticky]', main), drive: $('[data-cfg-drive]', main), test: $('[data-cfg-test]', main)
    };
    function text(el, v) { if (el && v != null && !el.hasAttribute('data-keep')) el.textContent = v; }
    text(ui.crumb, car.name);
    text(ui.cat, car.categoryLabel);
    text(ui.name, car.name);
    text(ui.tag, car.tagline);
    text(ui.desc, car.description);
    text(ui.ghost, car.name);
    if (car.tone) main.style.setProperty('--tone', car.tone);
    var img = car.paints[k].image || car.image;
    stage.innerHTML = img ? '<img src="' + esc(img) + '" alt="' + esc(car.name) + '">' : window.CarArt.svg(car.style, car.paints[k].hex, { title: car.name });
    stage.classList.toggle('cfg-car--photo', !!img);
    var min = Math.min.apply(null, car.paints.map(amount));
    var countEl = $('[data-cfg-count]', main);
    if (countEl) countEl.textContent = car.paints.length > 1 ? car.paints.length + ' colours' : 'One finish';
    ui.paints.innerHTML = car.paints.map(function (p, i) {
      var extra = amount(p) - min;
      return '<button type="button" class="cfg-paint' + (p.av === false ? ' is-na' : '') + '" role="radio" aria-checked="false" data-k="' + i + '" style="--c:' + esc(p.hex) + '">' +
        '<i aria-hidden="true"></i><span><strong>' + esc(p.name) + '</strong>' + (p.av === false ? '<small>Sold out</small>' : (extra ? '<small>+' + money(extra) + '</small>' : '')) + '</span></button>';
    }).join('');

    // specs with count-up numbers
    if (ui.specs) {
      var s = car.specs || {};
      var rows = [['Power', s.power], ['0–100 km/h', s.accel], ['Range', s.range], ['Top speed', s.top], ['Seats', car.seats ? String(car.seats) : ''], ['Drive', car.drive], ['Fuel', car.fuel], ['Model year', car.year ? String(car.year) : '']];
      ui.specs.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
        var m = r[0] !== 'Model year' && String(r[1]).match(/^([\d.,]+)\s*(.*)$/);
        var num = m ? '<span data-count-to="' + m[1].replace(/,/g, '') + '"><span data-count>' + esc(m[1]) + '</span></span>' + (m[2] ? '<small>' + esc(m[2]) + '</small>' : '') : esc(r[1]);
        return '<div class="cfg-spec" data-reveal><dt>' + r[0] + '</dt><dd' + (m ? '' : ' class="is-text"') + '>' + num + '</dd></div>';
      }).join('');
    }
    if (ui.details && car.details && car.details.length) {
      ui.details.innerHTML = car.details.map(function (d, i) {
        return '<li data-reveal style="--rd:' + (i * 0.06).toFixed(2) + 's"><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span>' + esc(d) + '</li>';
      }).join('');
    }

    var shown = null, raf = 0;
    function countPrice(n) {
      cancelAnimationFrame(raf);
      if (shown == null || reduce) { shown = n; ui.price.textContent = money(n); return; }
      var from = shown, t0 = performance.now();
      (function step(now) {
        var t = clamp((now - t0) / 600, 0, 1), e = 1 - Math.pow(1 - t, 3);
        shown = from + (n - from) * e;
        ui.price.textContent = money(t < 1 ? Math.round(shown) : n);
        if (t < 1) raf = requestAnimationFrame(step);
      })(t0);
    }
    function pick(i, quiet) {
      k = i;
      var p = car.paints[i];
      var im = stage.querySelector('img');
      if (im) {
        var src = p.image || car.image;
        if (src && im.getAttribute('src') !== src) {
          var pre = new Image();
          pre.onload = function () {
            im.src = src;
            if (im.animate && !reduce) im.animate([{ opacity: 0.3, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' });
          };
          pre.src = src;
        }
      }
      else window.CarArt.paint(stage, p.hex);
      main.style.setProperty('--paint', p.hex);
      text(ui.paintName, p.name);
      countPrice(amount(p));
      if (ui.month) ui.month.textContent = money(Math.round(monthly(amount(p))));
      $$('.cfg-paint', ui.paints).forEach(function (b, n) { b.setAttribute('aria-checked', n === i ? 'true' : 'false'); b.tabIndex = n === i ? 0 : -1; });
      if (ui.sticky) { text($('[data-sticky-price]', ui.sticky), p.price); text($('[data-sticky-paint]', ui.sticky), p.name); }
      if (ui.reserve) ui.reserve.disabled = p.av === false;
      if (!quiet && !reduce) { stage.classList.remove('is-shine'); void stage.offsetWidth; stage.classList.add('is-shine'); }
      if (!quiet) {
        var u = new URL(location.href);
        if (json && p.id) u.searchParams.set('variant', p.id); else u.searchParams.set('paint', i + 1);
        history.replaceState(history.state, '', u.toString());
      }
    }
    ui.paints.addEventListener('click', function (e) { var b = e.target.closest('.cfg-paint'); if (b) pick(+b.getAttribute('data-k')); });
    ui.paints.addEventListener('keydown', function (e) {
      var n = car.paints.length, i = k;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (k + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (k - 1 + n) % n;
      else return;
      e.preventDefault(); pick(i); ui.paints.children[i].focus();
    });
    // Shopify: ?variant=123 selects that paint
    var v = params.get('variant');
    if (v) car.paints.forEach(function (p, i) { if (String(p.id) === v) k = i; });
    pick(k, true);

    /* the car drives in when the page opens; "Take it for a spin" drives it off and back */
    var wheelR = 1, busy = false;
    function setX(x) {
      stage.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      if (window.CarArt) window.CarArt.spin(stage, x / wheelR * 57.2958);
    }
    function drive(from, to, dur, ease, done) {
      var t0 = performance.now();
      main.classList.add('cfg-moving');
      (function step(now) {
        var t = clamp((now - t0) / dur, 0, 1);
        setX(from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(step);
        else { main.classList.remove('cfg-moving'); if (done) done(); }
      })(t0);
    }
    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
    function easeIn(t) { return t * t * t; }
    function measure() { wheelR = Math.max(1, stage.offsetWidth * 34 / 640); }
    measure();
    window.addEventListener('resize', measure);
    if (!reduce) {
      setX(-window.innerWidth);
      var go = function () { drive(-window.innerWidth, 0, 1700, easeOut); };
      if (document.documentElement.classList.contains('pt-in')) setTimeout(go, 500); else go();
    }
    if (ui.drive) ui.drive.addEventListener('click', function () {
      if (busy || reduce) return;
      busy = true;
      var W = window.innerWidth;
      drive(0, W, 1000, easeIn, function () {
        setX(-W);
        drive(-W, 0, 1500, easeOut, function () { busy = false; });
      });
    });

    function reserve(btn) {
      if (!window.SiteCart) return;
      var p = car.paints[k];
      btn.classList.add('is-busy');
      window.SiteCart.add({ id: p.id, quantity: 1, title: car.name, variant: p.name, price: p.price, image: p.image || car.image || window.CarArt.dataUri(car.style, p.hex) })
        .then(function () {
          var label = (B.cartLabel || 'cart').toLowerCase();
          ui.msg.innerHTML = '<i aria-hidden="true"></i>' + esc(car.name) + ' in ' + esc(p.name) + ' is in your ' + esc(label) + '. ';
          var a = document.createElement('a');
          a.href = window.SiteCart.cartUrl; a.textContent = 'View ' + label;
          ui.msg.appendChild(a);
          ui.msg.className = 'cfg-msg is-ok';
          if (!window.SiteCart.isShopify) setTimeout(function () { window.SiteCart.open(); }, 400);
        })
        .catch(function (err) {
          ui.msg.className = 'cfg-msg is-err';
          ui.msg.textContent = (err && err.message) || 'Could not add to cart. Please try again.';
        })
        .then(function () { btn.classList.remove('is-busy'); });
    }
    if (ui.reserve) ui.reserve.addEventListener('click', function () { reserve(ui.reserve); });
    if (ui.sticky) {
      text($('[data-sticky-name]', ui.sticky), car.name);
      $('[data-sticky-reserve]', ui.sticky).addEventListener('click', function (e) { reserve(e.currentTarget); });
      if ('IntersectionObserver' in window && ui.reserve) {
        new IntersectionObserver(function (en) { ui.sticky.classList.toggle('is-on', !en[0].isIntersecting); }).observe(ui.reserve);
      }
    }
    if (ui.test && !json) ui.test.href = 'contact.html?model=' + encodeURIComponent(car.name) + '#test-drive';

    // related: same category first, then the rest (static site)
    if (ui.related && window.CarCard && CARS.length) {
      var rel = CARS.filter(function (c) { return c.id !== car.id; })
        .sort(function (a, b) { return (b.category === car.category) - (a.category === car.category); }).slice(0, 3);
      ui.related.innerHTML = rel.map(window.CarCard.html).join('');
      window.CarCard.wire(ui.related, CARS);
    }
    if (window.SiteMotion) window.SiteMotion.init(main);
    if (window.CarSections) window.CarSections.init(main);
    return {};
  }

  function initAll(root) {
    [].forEach.call((root || document).querySelectorAll('[data-cfg]'), function (el) {
      if (!el.__cfg) { el.__cfg = true; create(el); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  window.CarConfig = { initAll: initAll };
})();
