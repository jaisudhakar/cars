/* Road Run — a pinned, scroll-driven road. As you scroll, each car drives in from the
 * left, parks in front of you with its name, price and paint colours, then drives off
 * as the next one arrives. Wheels turn with the distance, the sky goes from day to
 * night, the scenery slides past at different speeds and a speedometer follows your
 * scroll speed. Pick a paint to repaint the parked car — the price updates with it.
 *
 * Markup: see index.html (#road-run) or shopify/sections/road-run.liquid.
 * Data: <script type="application/json" data-rr-json> in the section, or window.CARS. */
(function () {
  'use strict';
  if (window.RoadRun) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, t) { a = rgb(a); b = rgb(b); return 'rgb(' + Math.round(lerp(a[0], b[0], t)) + ',' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ')'; }
  function money(n, cur) {
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n); }
    catch (e) { return '$' + Math.round(n).toLocaleString(); }
  }
  function amountOf(p) {
    if (typeof p.amount === 'number') return p.amount;
    return window.SiteCart ? window.SiteCart.parsePrice(p.price) : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0;
  }

  // sky colours: [top, bottom] for day, golden hour and night
  var SKY = [['#7fb8f0', '#e6f1fb'], ['#3d4f8f', '#ffb27a'], ['#04060c', '#16203a']];
  var SPEC_LABELS = { power: 'Power', accel: '0–100 km/h', range: 'Range', top: 'Top speed' };

  function create(sec) {
    var json = sec.querySelector('[data-rr-json]');
    var cars;
    try { cars = json ? JSON.parse(json.textContent) : (window.CARS || []); } catch (e) { cars = []; }
    var only = sec.getAttribute('data-rr-ids');
    if (only && !json) {
      var ids = only.split(',').map(function (s) { return s.trim(); });
      cars = ids.map(function (id) { return cars.filter(function (c) { return c.id === id; })[0]; }).filter(Boolean);
    }
    cars = cars.filter(function (c) { return c.paints && c.paints.length; });
    if (window.CarArt) window.CarArt.fill(cars);
    var N = cars.length;
    if (!N) return null;
    var cur = sec.getAttribute('data-currency') || document.documentElement.getAttribute('data-currency') || 'USD';

    var $ = function (s) { return sec.querySelector(s); };
    var sticky = $('.rr-sticky');
    var stage = $('[data-rr-cars]');
    var ui = {
      idx: $('[data-rr-idx]'), max: $('[data-rr-max]'), cat: $('[data-rr-cat]'), name: $('[data-rr-name]'),
      tag: $('[data-rr-tag]'), price: $('[data-rr-price]'), paintName: $('[data-rr-paint]'), paints: $('[data-rr-paints]'),
      specs: $('[data-rr-specs]'), reserve: $('[data-rr-reserve]'), link: $('[data-rr-link]'), msg: $('[data-rr-msg]'),
      info: $('.rr-info'), steps: $('[data-rr-steps]'), ghost: $('[data-rr-ghost]'),
      speed: $('[data-rr-speed]'), needle: $('[data-rr-needle]'), odo: $('[data-rr-odo]'), hint: $('.rr-hint'),
      sun: $('.rr-sun'), lane: $('[data-rr-lane]')
    };
    var layers = [].slice.call(sec.querySelectorAll('[data-rr-layer]')).map(function (el) {
      return { el: el, k: parseFloat(el.getAttribute('data-rr-layer')) || 0.2, aspect: parseFloat(el.getAttribute('data-aspect')) || 4, tile: 0 };
    });
    if (ui.max) ui.max.textContent = pad2(N);
    sec.style.setProperty('--rr-n', (N - 0.1).toFixed(2));

    /* ---------- cars ---------- */
    var chosen = cars.map(function () { return 0; });
    var els = cars.map(function (c, i) {
      var el = document.createElement('div');
      el.className = 'rr-car';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<div class="rr-car-in"><span class="rr-beam"></span>' + art(c, 0) + '</div>';
      stage.appendChild(el);
      return { el: el, inner: el.querySelector('.rr-car-in'), x: -9999, vis: false };
    });
    function art(c, pi) {
      var p = c.paints[pi];
      var img = p.image || c.image;
      if (img) return '<img class="rr-photo" src="' + esc(img) + '" alt="" decoding="async" draggable="false">';
      return window.CarArt ? window.CarArt.svg(c.style, p.hex) : '';
    }

    /* ---------- steps (right-hand list) ---------- */
    if (ui.steps) {
      ui.steps.innerHTML = cars.map(function (c, i) {
        return '<li><button type="button" data-rr-go="' + i + '"><span>' + pad2(i + 1) + '</span>' + esc(c.name) + '<i></i></button></li>';
      }).join('');
      ui.steps.addEventListener('click', function (e) {
        var b = e.target.closest('[data-rr-go]');
        if (b) scrollToCar(+b.getAttribute('data-rr-go'));
      });
    }

    /* ---------- geometry ---------- */
    var W = 0, H = 0, VH = 0, carW = 0, carH = 0, roadY = 0, cx = 0, mobile = false;
    var P0 = -0.45, SPAN = N - 1 + 0.9;      // progress runs from car 0 arriving to the last car leaving
    function measure() {
      var r = sticky.getBoundingClientRect();
      W = r.width; H = r.height; VH = window.innerHeight;
      mobile = W < 900;
      carW = mobile ? Math.min(W * 0.96, 560) : clamp(W * 0.5, 520, 900);
      carH = carW * 240 / 640;
      roadY = H * (mobile ? 0.74 : 0.86);
      cx = mobile ? W * 0.5 : W * 0.6;
      els.forEach(function (c) { c.el.style.width = carW.toFixed(1) + 'px'; });
      layers.forEach(function (l) {
        l.tile = l.el.offsetHeight * l.aspect;
        l.el.style.width = (W + l.tile * 2) + 'px';
      });
    }
    function progressTarget() {
      var r = sec.getBoundingClientRect();
      var u = clamp(-r.top / Math.max(1, r.height - VH), 0, 1);
      return { u: u, p: P0 + u * SPAN };
    }
    function scrollToCar(i) {
      var r = sec.getBoundingClientRect();
      var top = window.pageYOffset + r.top;
      var u = (i - P0) / SPAN;
      window.scrollTo({ top: top + u * (r.height - VH), behavior: reduce ? 'auto' : 'smooth' });
    }

    /* ---------- frame loop ---------- */
    var p = P0, u = 0, raf = 0, last = 0, visible = false, dead = false, active = -1;
    var speed = 0, odo = 0, lastP = P0, tick = 0;
    function place(ts) {
      var tgt = progressTarget();
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 1 / 60;
      last = ts;
      var k = reduce ? 1 : 1 - Math.exp(-dt / 0.11);
      p += (tgt.p - p) * k;
      u += (tgt.u - u) * k;
      if (Math.abs(tgt.p - p) < 0.0004) p = tgt.p;
      var dp = p - lastP; lastP = p;
      // speedometer: only counts while a car is actually moving (not parked)
      var nearest = Math.round(clamp(p, 0, N - 1));
      var moving = Math.abs(p - nearest) > 0.2 ? 1 : 0.15;
      speed += (clamp(Math.abs(dp) / dt * 95 * moving, 0, 260) - speed) * (1 - Math.exp(-dt / 0.25));
      odo += Math.abs(dp) * 0.42;

      // cars
      var drive = W * 0.62 + carW;
      var activeNow = -1;
      els.forEach(function (c, i) {
        var t = p - i;
        var a = Math.abs(t);
        var g = a < 0.22 ? 0 : Math.pow((a - 0.22) / 0.78, 1.35) * (t < 0 ? -1 : 1);
        var x = cx + g * drive;
        var vis = a < 1.05 && x > -carW && x < W + carW;
        if (vis !== c.vis) { c.vis = vis; c.el.style.visibility = vis ? 'visible' : 'hidden'; }
        if (a < 0.5) activeNow = i;
        if (!vis) return;
        var vx = x - c.x;
        c.x = x;
        var tiltDeg = reduce ? 0 : clamp(-vx * 0.04, -1.6, 1.6);
        var bob = reduce || a < 0.22 ? 0 : Math.sin(x * 0.05) * 1.2;
        c.el.style.transform = 'translate3d(' + (x - carW / 2).toFixed(1) + 'px,' + (roadY - carH * 214 / 240 + bob).toFixed(1) + 'px,0)';
        c.inner.style.transform = 'rotate(' + tiltDeg.toFixed(2) + 'deg)';
        c.el.classList.toggle('is-parked', a < 0.22);
        if (window.CarArt) window.CarArt.spin(c.el, (x / (carW * 34 / 640)) * 57.2958);
      });
      if (activeNow !== active && activeNow > -1) { active = activeNow; show(active); }
      sec.classList.toggle('rr-has-car', activeNow > -1 && Math.abs(p - activeNow) < 0.34);

      // scenery
      var night = smooth(0.42, 0.78, u), dusk = smooth(0.12, 0.5, u) * (1 - night);
      var top = night > 0 ? mix(SKY[1][0], SKY[2][0], night) : mix(SKY[0][0], SKY[1][0], dusk);
      var bot = night > 0 ? mix(SKY[1][1], SKY[2][1], night) : mix(SKY[0][1], SKY[1][1], dusk);
      sticky.style.setProperty('--sky-top', top);
      sticky.style.setProperty('--sky-bot', bot);
      sticky.style.setProperty('--night', night.toFixed(3));
      sticky.style.setProperty('--dusk', dusk.toFixed(3));
      sec.classList.toggle('rr-dark', night > 0.45);
      if (ui.sun) ui.sun.style.transform = 'translate3d(0,' + (u * H * 0.5).toFixed(1) + 'px,0)';
      var cam = p * W * 0.9;
      layers.forEach(function (l) {
        if (!l.tile) return;
        var off = (cam * l.k) % l.tile;
        if (off < 0) off += l.tile;
        l.el.style.transform = 'translate3d(' + (-off - l.tile * 0.5).toFixed(1) + 'px,0,0)';
      });
      if (ui.lane) ui.lane.style.backgroundPositionX = (-cam * 1.1).toFixed(1) + 'px';
      if (ui.ghost) ui.ghost.style.transform = 'translate3d(' + (-(p - Math.round(p)) * W * 0.35).toFixed(1) + 'px,-50%,0)';

      // HUD (every other frame is plenty)
      if (++tick % 2 === 0) {
        if (ui.speed) ui.speed.textContent = Math.round(speed);
        if (ui.needle) ui.needle.style.transform = 'rotate(' + (-120 + clamp(speed / 260, 0, 1) * 240).toFixed(1) + 'deg)';
        if (ui.odo) ui.odo.textContent = ('00000' + Math.floor(odo * 10)).slice(-6);
      }
      if (ui.hint) ui.hint.classList.toggle('is-gone', u > 0.02);
      if (ui.steps) sec.style.setProperty('--rr-prog', clamp((p - P0) / SPAN, 0, 1).toFixed(4));
      return Math.abs(tgt.p - p) > 0.0004 || speed > 0.5;
    }
    function frame(ts) {
      raf = 0;
      if (dead) return;
      var busy = place(ts);
      if (visible && busy) raf = requestAnimationFrame(frame);
      else { last = 0; idle(); }
    }
    function kick() { if (!raf && !dead) raf = requestAnimationFrame(frame); }

    /* gentle snap: when scrolling stops between two cars, roll on to the closer one */
    var snapT = 0, snap = sec.getAttribute('data-rr-snap') !== 'false';
    function idle() {
      if (!snap || reduce) return;
      clearTimeout(snapT);
      snapT = setTimeout(function () {
        var t = progressTarget();
        if (t.u <= 0 || t.u >= 1) return;
        var i = Math.round(clamp(t.p, 0, N - 1));
        var d = Math.abs(t.p - i);
        if (d > 0.12 && d < 0.42) scrollToCar(i);
      }, 260);
    }

    /* ---------- info panel ---------- */
    var shownAmount = null, countRaf = 0;
    function show(i) {
      var c = cars[i];
      if (ui.idx) ui.idx.textContent = pad2(i + 1);
      if (ui.cat) ui.cat.textContent = c.categoryLabel || '';
      if (ui.name) ui.name.textContent = c.name;
      if (ui.tag) ui.tag.textContent = c.tagline || '';
      if (ui.ghost) ui.ghost.textContent = c.name;
      if (ui.link) ui.link.href = c.url || '#';
      if (ui.msg) { ui.msg.textContent = ''; ui.msg.className = 'rr-msg'; }
      if (ui.specs) {
        var s = c.specs || {};
        ui.specs.innerHTML = Object.keys(SPEC_LABELS).filter(function (k) { return s[k]; }).map(function (k) {
          return '<div><dt>' + SPEC_LABELS[k] + '</dt><dd>' + esc(s[k]) + '</dd></div>';
        }).join('');
      }
      renderPaints(i);
      setPaint(i, chosen[i], true);
      if (!reduce) {
        sec.classList.remove('rr-swap');
        void sec.offsetWidth;
        sec.classList.add('rr-swap');
      }
      if (ui.steps) [].forEach.call(ui.steps.querySelectorAll('button'), function (b, k) {
        b.classList.toggle('is-on', k === i);
        b.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
    }
    function renderPaints(i) {
      if (!ui.paints) return;
      var c = cars[i];
      var min = Math.min.apply(null, c.paints.map(amountOf));
      ui.paints.innerHTML = c.paints.map(function (pt, k) {
        var extra = amountOf(pt) - min;
        return '<button type="button" class="rr-paint' + (pt.av === false ? ' is-na' : '') + '" role="radio" aria-checked="false" data-k="' + k + '" style="--c:' + esc(pt.hex) + '" title="' + esc(pt.name) + '">' +
          '<i aria-hidden="true"></i><span class="rr-paint-txt"><span>' + esc(pt.name) + '</span><b>' + (extra > 0 ? '+' + money(extra, cur) : 'Included') + '</b></span></button>';
      }).join('');
    }
    function setPaint(i, k, instant) {
      var c = cars[i], pt = c.paints[k];
      chosen[i] = k;
      var car = els[i];
      if (pt.image || c.image) {
        var img = car.inner.querySelector('img');
        var src = pt.image || c.image;
        if (img && img.getAttribute('src') !== src) img.src = src;
      } else if (window.CarArt) window.CarArt.paint(car.el, pt.hex);
      if (!instant && !reduce) {
        car.inner.classList.remove('is-shine');
        void car.inner.offsetWidth;
        car.inner.classList.add('is-shine');
      }
      sec.style.setProperty('--rr-paint', pt.hex);
      if (ui.paintName) ui.paintName.textContent = pt.name;
      if (ui.paints) [].forEach.call(ui.paints.children, function (b, n) {
        b.setAttribute('aria-checked', n === k ? 'true' : 'false');
        b.tabIndex = n === k ? 0 : -1;
      });
      countTo(amountOf(pt), instant);
      if (ui.reserve) ui.reserve.disabled = pt.av === false;
    }
    function countTo(n, instant) {
      if (!ui.price) return;
      cancelAnimationFrame(countRaf);
      var from = shownAmount == null || instant ? n : shownAmount;
      if (from === n || reduce) { shownAmount = n; ui.price.textContent = money(n, cur); return; }
      var t0 = performance.now();
      (function step(now) {
        var t = clamp((now - t0) / 650, 0, 1), e = 1 - Math.pow(1 - t, 3);
        shownAmount = from + (n - from) * e;
        ui.price.textContent = money(t < 1 ? Math.round(shownAmount) : n, cur);
        if (t < 1) countRaf = requestAnimationFrame(step); else shownAmount = n;
      })(t0);
      ui.price.classList.remove('is-bump');
      void ui.price.offsetWidth;
      ui.price.classList.add('is-bump');
    }
    if (ui.paints) {
      ui.paints.addEventListener('click', function (e) {
        var b = e.target.closest('.rr-paint');
        if (b && active > -1) setPaint(active, +b.getAttribute('data-k'));
      });
      // hover previews the colour on the car; leaving puts the chosen one back
      ui.paints.addEventListener('pointerover', function (e) {
        var b = e.target.closest('.rr-paint');
        if (!b || active < 0 || e.pointerType !== 'mouse') return;
        var c = cars[active], pt = c.paints[+b.getAttribute('data-k')];
        if (!pt.image && !c.image && window.CarArt) window.CarArt.paint(els[active].el, pt.hex);
      });
      ui.paints.addEventListener('pointerleave', function () {
        if (active < 0) return;
        var c = cars[active], pt = c.paints[chosen[active]];
        if (!pt.image && !c.image && window.CarArt) window.CarArt.paint(els[active].el, pt.hex);
      });
      ui.paints.addEventListener('keydown', function (e) {
        if (active < 0) return;
        var n = cars[active].paints.length, k = chosen[active];
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = (k + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = (k - 1 + n) % n;
        else return;
        e.preventDefault();
        setPaint(active, k);
        ui.paints.children[k].focus();
      });
    }
    if (ui.reserve) ui.reserve.addEventListener('click', function () {
      if (active < 0 || !window.SiteCart) return;
      var c = cars[active], pt = c.paints[chosen[active]];
      ui.reserve.classList.add('is-busy');
      window.SiteCart.add({
        id: pt.id, quantity: 1, title: c.name, variant: pt.name, price: pt.price,
        image: pt.image || c.image || (window.CarArt ? window.CarArt.dataUri(c.style, pt.hex) : '')
      }).then(function () {
        ui.msg.className = 'rr-msg is-ok';
        ui.msg.innerHTML = '<i aria-hidden="true"></i>' + esc(c.name) + ' in ' + esc(pt.name) + ' reserved. ';
        var a = document.createElement('a');
        a.href = window.SiteCart.cartUrl;
        a.textContent = 'View ' + ((window.BRAND && window.BRAND.cartLabel) || 'cart').toLowerCase();
        if (!window.SiteCart.isShopify) a.addEventListener('click', function (ev) { ev.preventDefault(); window.SiteCart.open(); });
        ui.msg.appendChild(a);
      }).catch(function (err) {
        ui.msg.className = 'rr-msg is-err';
        ui.msg.textContent = (err && err.message) || 'Could not reserve. Please try again.';
      }).then(function () { ui.reserve.classList.remove('is-busy'); });
    });

    /* ---------- lifecycle ---------- */
    function onScroll() { kick(); }
    function onResize() { measure(); kick(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible) { sec.classList.add('rr-in'); kick(); }
      }, { rootMargin: '100px 0px' });
      io.observe(sec);
    } else { visible = true; sec.classList.add('rr-in'); }
    measure();
    place(performance.now());
    if (active < 0) show(0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);

    return {
      destroy: function () {
        dead = true;
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        if (io) io.disconnect();
      },
      go: scrollToCar
    };
  }

  var instances = new Map();
  function initAll(root) {
    [].forEach.call((root || document).querySelectorAll('[data-rr]'), function (sec) {
      if (!instances.has(sec)) { var i = create(sec); if (i) instances.set(sec, i); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('shopify:section:unload', function (e) {
    [].forEach.call(e.target.querySelectorAll('[data-rr]'), function (sec) {
      var i = instances.get(sec);
      if (i) { i.destroy(); instances.delete(sec); }
    });
  });
  window.RoadRun = { initAll: initAll };
})();
