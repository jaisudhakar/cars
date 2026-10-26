/* Showroom wheel — cars ride a large circle; the one at the front is the active model
 * (the same interaction as Nike Orbit in shopify-theme-viral). Turn it by dragging the cars,
 * dragging the knurled "wheel" control, scrolling sideways, the arrow keys or clicking a car.
 * Wheels spin as the cars travel. Paint swatches repaint the front car and update the price;
 * "Reserve" adds that car + paint to the garage (Shopify cart in a theme).
 * Data comes from <script data-orbit-json> or window.CARS. */
(function () {
  'use strict';
  if (window.CarOrbit) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function pad2(n) { n = '' + n; return n.length < 2 ? '0' + n : n; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function create(sec) {
    var stage = sec.querySelector('[data-orbit-stage]');
    var ring = sec.querySelector('[data-orbit-ring]');
    var json = sec.querySelector('[data-orbit-json]');
    if (!stage) return null;
    var items;
    try { items = json ? JSON.parse(json.textContent) : (window.CARS || []); } catch (e) { return null; }
    items = items.filter(function (p) { return p.paints && p.paints.length; });
    if (window.CarArt) window.CarArt.fill(items);
    var N = items.length;
    if (!N) return null;

    var ui = {
      idx: sec.querySelector('[data-orbit-idx]'),
      name: sec.querySelector('[data-orbit-name]'),
      price: sec.querySelector('[data-orbit-price]'),
      meta: sec.querySelector('[data-orbit-meta]'),
      details: sec.querySelector('[data-orbit-details]'),
      info: sec.querySelector('.orbit-info'),
      wheel: sec.querySelector('[data-orbit-wheel]'),
      track: sec.querySelector('[data-orbit-track]'),
      paints: sec.querySelector('[data-orbit-paints]'),
      paintName: sec.querySelector('[data-orbit-paint]'),
      reserve: sec.querySelector('[data-orbit-reserve]'),
      msg: sec.querySelector('[data-orbit-msg]'),
      max: sec.querySelector('[data-orbit-max]')
    };
    if (ui.max) ui.max.textContent = pad2(N);
    var chosen = items.map(function () { return 0; });

    /* ---------- cars ---------- */
    var cars = items.map(function (p, i) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'orbit-car';
      el.setAttribute('aria-label', p.name);
      var pt = p.paints[0];
      var img = pt.image || p.image;
      if (img && !p.cutout) el.className += ' orbit-car--photo';
      el.innerHTML = '<span class="orbit-float">' + (img
        ? '<img src="' + esc(img) + '" alt="" draggable="false" decoding="async">'
        : (window.CarArt ? window.CarArt.svg(p.style, pt.hex) : '')) + '</span>';
      stage.appendChild(el);
      el.addEventListener('click', function (e) {
        if (moved > 6) { e.preventDefault(); return; }
        if (activeIndex() === i) { if (p.url) location.href = p.url; }
        else goTo(nearestTarget(i));
      });
      return { el: el, fl: el.querySelector('.orbit-float') };
    });

    /* ---------- geometry ---------- */
    var W = 0, H = 0, C = { x: 0, y: 0 }, R = 0, A0 = 0, STEP = 0.36, BASE = 300;
    // product photos are square cards: smaller, and anchored by their middle instead of their wheels
    var photos = items.some(function (p) { return (p.paints[0].image || p.image) && !p.cutout; });
    var LIFT = photos ? 0.55 : 0.3;
    function measure() {
      var r = stage.getBoundingClientRect();
      W = r.width; H = r.height;
      if (W < 750) {
        // phones: the active car sits on top of a wide arc, neighbours peek in at the sides
        R = H * 1.05;
        C.x = W / 2; C.y = H * 0.46 + R;
        A0 = -Math.PI / 2;
        STEP = 0.3;
        BASE = photos ? clamp(W * 0.6, 200, 300) : clamp(W * 0.82, 260, 420);
      } else {
        // active car sits up-left of a big circle whose centre is off to the bottom right
        var ax = W * 0.5, ay = H * 0.44;
        C.x = W * 0.86; C.y = H * 1.06;
        R = Math.hypot(ax - C.x, ay - C.y);
        A0 = Math.atan2(ay - C.y, ax - C.x);
        STEP = 0.36;
        BASE = photos ? clamp(Math.min(W * 0.26, H * 0.46), 240, 420) : clamp(W * 0.34, 300, 560);
      }
      if (ring) {
        ring.style.width = ring.style.height = (R * 2) + 'px';
        ring.style.left = (C.x - R) + 'px';
        ring.style.top = (C.y - R) + 'px';
      }
    }

    /* ---------- motion ---------- */
    var pos = 0, target = 0, raf = 0, last = 0, t0 = performance.now(), visible = true, dead = false;
    function wrapD(d) {                // shortest signed distance on the loop
      d = ((d % N) + N) % N;
      return d > N / 2 ? d - N : d;
    }
    function activeIndex() { return ((Math.round(pos) % N) + N) % N; }
    function nearestTarget(i) { return Math.round(pos) + wrapD(i - Math.round(pos)); }

    var shown = -1;
    function paint(ts) {
      var t = (ts - t0) / 1000;
      cars.forEach(function (s, i) {
        var d = wrapD(i - pos);
        var ad = Math.abs(d);
        var ang = A0 + d * STEP;
        var x = C.x + Math.cos(ang) * R, y = C.y + Math.sin(ang) * R;
        var sc = 1 / (1 + 0.8 * ad);
        var op = ad < 2.3 ? 1 : clamp(1 - (ad - 2.3) / 0.9, 0, 1);
        var w = BASE * sc;
        var bob = reduceMotion ? 0 : Math.sin(t * 1.3 + i * 1.3) * 5 * sc;
        s.el.style.width = w.toFixed(1) + 'px';
        s.el.style.transform = 'translate3d(' + (x - w / 2).toFixed(1) + 'px,' + (y - w * LIFT).toFixed(1) + 'px,0) rotate(' + (-d * 5).toFixed(2) + 'deg)';
        s.fl.style.transform = 'translateY(' + bob.toFixed(2) + 'px)';
        s.el.style.opacity = op.toFixed(3);
        s.el.style.zIndex = 100 - Math.round(ad * 10);
        s.el.style.visibility = op <= 0 ? 'hidden' : '';
        s.el.tabIndex = ad < 0.5 ? 0 : -1;
        s.el.classList.toggle('orbit-front', ad < 0.5);
        // cars roll round the circle: drag them forward and the wheels turn forward
        if (window.CarArt) window.CarArt.spin(s.el, -pos * 300);
      });
      if (ui.track) ui.track.style.backgroundPosition = (-pos * 46).toFixed(1) + 'px 0';
      var a = activeIndex();
      if (a !== shown) { shown = a; showInfo(a); }
    }
    function frame(ts) {
      raf = 0;
      if (dead) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 1 / 60;
      last = ts;
      if (!dragging) {
        var k = reduceMotion ? 1 : 1 - Math.exp(-dt / 0.16);
        pos += (target - pos) * k;
        if (Math.abs(target - pos) < 0.0005) pos = target;
      }
      paint(ts);
      // keep running while visible: the cars float
      if (visible && (!reduceMotion || pos !== target || dragging)) raf = requestAnimationFrame(frame);
      else last = 0;
    }
    function kick() { if (!raf && !dead) raf = requestAnimationFrame(frame); }
    function goTo(t) { target = t; kick(); }

    /* ---------- info panel + paints ---------- */
    var busy = false;
    function showInfo(i) {
      var p = items[i];
      if (ui.idx) ui.idx.textContent = pad2(i + 1) + ' / ' + pad2(N);
      if (ui.name) ui.name.textContent = p.name;
      if (ui.meta) ui.meta.textContent = [p.categoryLabel, p.specs && p.specs.power, p.specs && p.specs.accel && ('0–100 ' + p.specs.accel)].filter(Boolean).join(' · ');
      if (ui.details) ui.details.href = p.url || '#';
      if (ui.msg) { ui.msg.textContent = ''; ui.msg.className = 'orbit-msg'; }
      if (ui.info && !reduceMotion) {
        ui.info.classList.remove('orbit-swap');
        void ui.info.offsetWidth;
        ui.info.classList.add('orbit-swap');
      }
      if (ui.wheel) {
        ui.wheel.setAttribute('aria-valuenow', i + 1);
        ui.wheel.setAttribute('aria-valuetext', p.name);
      }
      renderPaints(p);
      setPaint(i, chosen[i]);
    }
    function renderPaints(p) {
      if (!ui.paints) return;
      ui.paints.innerHTML = p.paints.map(function (pt, k) {
        return '<button type="button" class="orbit-paint' + (pt.av === false ? ' orbit-na' : '') + '" role="radio" aria-checked="false" data-k="' + k + '" style="--c:' + esc(pt.hex) + '">' +
          '<i aria-hidden="true"></i><span>' + esc(pt.name) + '</span></button>';
      }).join('');
    }
    function setPaint(i, k) {
      var p = items[i], pt = p.paints[k];
      chosen[i] = k;
      var car = cars[i];
      var img = car.el.querySelector('img');
      if (img) {
        var src = pt.image || p.image;
        if (src && img.getAttribute('src') !== src) {
          var pre = new Image();
          pre.onload = function () {
            img.src = src;
            if (img.animate && !reduceMotion) img.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 300 });
          };
          pre.src = src;
        }
      }
      else if (window.CarArt) window.CarArt.paint(car.el, pt.hex);
      if (ui.price) {
        ui.price.textContent = pt.price;
        ui.price.classList.remove('orbit-bump');
        void ui.price.offsetWidth;
        ui.price.classList.add('orbit-bump');
      }
      if (ui.paintName) ui.paintName.textContent = pt.name;
      sec.style.setProperty('--orbit-paint', pt.hex);
      if (ui.paints) [].forEach.call(ui.paints.children, function (b, n) {
        b.setAttribute('aria-checked', n === k ? 'true' : 'false');
        b.tabIndex = n === k ? 0 : -1;
      });
      if (ui.reserve) ui.reserve.disabled = pt.av === false;
    }
    if (ui.paints) {
      ui.paints.addEventListener('click', function (e) {
        var b = e.target.closest('.orbit-paint');
        if (b) setPaint(activeIndex(), +b.getAttribute('data-k'));
      });
      ui.paints.addEventListener('keydown', function (e) {
        var i = activeIndex(), n = items[i].paints.length, k = chosen[i];
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = (k + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = (k - 1 + n) % n;
        else return;
        e.preventDefault();
        setPaint(i, k);
        ui.paints.children[k].focus();
      });
    }
    if (ui.reserve) ui.reserve.addEventListener('click', function () {
      if (busy || !window.SiteCart) return;
      var i = activeIndex(), p = items[i], pt = p.paints[chosen[i]];
      busy = true;
      ui.reserve.classList.add('orbit-busy');
      window.SiteCart.add({ id: pt.id, quantity: 1, title: p.name, variant: pt.name, price: pt.price, image: pt.image || p.image || (window.CarArt ? window.CarArt.dataUri(p.style, pt.hex) : '') })
        .then(function () {
          ui.msg.innerHTML = '';
          ui.msg.className = 'orbit-msg orbit-msg-ok';
          var ok = document.createElement('span');
          ok.className = 'orbit-check';
          ok.setAttribute('aria-hidden', 'true');
          ui.msg.appendChild(ok);
          ui.msg.appendChild(document.createTextNode(p.name + ' in ' + pt.name + ' added to your cart '));
          var a = document.createElement('a');
          a.href = window.SiteCart.cartUrl;
          a.textContent = 'View ' + ((window.BRAND && window.BRAND.cartLabel) || 'cart').toLowerCase();
          if (!window.SiteCart.isShopify) a.addEventListener('click', function (e) { e.preventDefault(); window.SiteCart.open(); });
          ui.msg.appendChild(a);
          driveOff(cars[i].el);
        })
        .catch(function (err) {
          ui.msg.className = 'orbit-msg orbit-msg-err';
          ui.msg.textContent = (err && err.message) || 'Could not add to cart. Please try again.';
        })
        .then(function () { busy = false; ui.reserve.classList.remove('orbit-busy'); });
    });
    // the reserved car does a little "rev": jumps forward and settles
    function driveOff(el) {
      if (reduceMotion || !el.animate) return;
      var f = el.querySelector('.orbit-float');
      f.animate([
        { transform: 'translateX(0)' }, { transform: 'translateX(-10px) rotate(1deg)', offset: 0.25 },
        { transform: 'translateX(26px) rotate(-1.5deg)', offset: 0.6 }, { transform: 'translateX(0)' }
      ], { duration: 900, easing: 'cubic-bezier(.3,0,.2,1)' });
    }

    /* ---------- input ---------- */
    var dragging = false, moved = 0, dX = 0, dY = 0, dPos = 0, dScale = 1, lastX = 0, lastT = 0, flick = 0, dEl = null, dId = 0;
    function startDrag(ev, scale) {
      if (ev.button !== 0) return;
      dragging = true; moved = 0;
      dX = lastX = ev.clientX; dY = ev.clientY; dPos = pos; dScale = scale; flick = 0; lastT = performance.now();
      dEl = ev.currentTarget; dId = ev.pointerId;
      sec.classList.add('orbit-dragging');
      kick();
    }
    function moveDrag(ev) {
      if (!dragging) return;
      var dx = ev.clientX - dX;
      moved = Math.max(moved, Math.abs(dx), Math.abs(ev.clientY - dY));
      // capture only once it is a real drag, so a plain click still reaches the car
      if (dEl && moved > 4) { try { dEl.setPointerCapture(dId); } catch (e) {} dEl = null; }
      pos = dPos + dx * dScale;
      var now = performance.now();
      flick = flick * 0.5 + ((ev.clientX - lastX) * dScale / Math.max(1, now - lastT)) * 0.5;
      lastX = ev.clientX; lastT = now;
    }
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      sec.classList.remove('orbit-dragging');
      target = Math.round(pos + clamp(flick * 90, -1, 1));
      kick();
      setTimeout(function () { moved = 0; }, 0);
    }
    // dragging the cars: drag left to bring the next one forward
    stage.addEventListener('pointerdown', function (ev) { measure(); startDrag(ev, -1 / Math.max(160, W * 0.16)); });
    stage.addEventListener('pointermove', moveDrag);
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    if (ui.wheel) {
      // the wheel control turns like a knurled dial: drag right for the next car
      ui.wheel.addEventListener('pointerdown', function (ev) { startDrag(ev, 1 / 46); });
      ui.wheel.addEventListener('pointermove', moveDrag);
      ui.wheel.addEventListener('pointerup', endDrag);
      ui.wheel.addEventListener('pointercancel', endDrag);
      ui.wheel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); goTo(Math.round(target) + 1); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); goTo(Math.round(target) - 1); }
        else if (e.key === 'Home') { e.preventDefault(); goTo(nearestTarget(0)); }
        else if (e.key === 'End') { e.preventDefault(); goTo(nearestTarget(N - 1)); }
      });
    }
    // sideways scroll / trackpad swipe turns the wheel; vertical scroll still scrolls the page
    var wheelAcc = 0, wheelT = 0;
    sec.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      wheelAcc += e.deltaX;
      if (Math.abs(wheelAcc) > 60 && performance.now() - wheelT > 220) {
        goTo(Math.round(target) + (wheelAcc > 0 ? 1 : -1));
        wheelAcc = 0; wheelT = performance.now();
      }
    }, { passive: false });
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.round(target) + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.round(target) - 1); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible) { sec.classList.add('orbit-in'); kick(); }
      }, { threshold: 0.15 }).observe(sec);
    } else sec.classList.add('orbit-in');

    measure();
    window.addEventListener('resize', function () { measure(); kick(); });
    paint(performance.now());
    kick();

    return { destroy: function () { dead = true; if (raf) cancelAnimationFrame(raf); } };
  }

  var instances = new Map();
  function initAll(root) {
    [].forEach.call((root || document).querySelectorAll('[data-orbit-section]'), function (sec) {
      if (!instances.has(sec)) { var i = create(sec); if (i) instances.set(sec, i); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('shopify:section:unload', function (e) {
    [].forEach.call(e.target.querySelectorAll('[data-orbit-section]'), function (sec) {
      var i = instances.get(sec);
      if (i) { i.destroy(); instances.delete(sec); }
    });
  });
  window.CarOrbit = { initAll: initAll };
})();
