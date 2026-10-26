/* Car hero — the hero car drives in when the page opens (wheels turning, light streaks
 * behind it), idles with its headlights on, and drives off to the right as you scroll.
 * Paint dots under it repaint the car. Markup: [data-car-hero] in index.html or
 * shopify/sections/car-hero.liquid. */
(function () {
  'use strict';
  if (window.CarHero) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function create(sec) {
    var slot = sec.querySelector('[data-hero-car]');
    if (!slot) return null;
    var style = slot.getAttribute('data-style') || 'ev';
    var hex = slot.getAttribute('data-paint') || '#1f55d6';
    var img = slot.getAttribute('data-image');
    var cutout = slot.hasAttribute('data-cutout');
    var face = slot.getAttribute('data-face') === 'left' ? -1 : 1;   // a car facing left enters from the right
    if (img && !cutout) slot.classList.add('ch-car--photo');
    if (cutout) slot.classList.add('ch-car--cut');
    slot.innerHTML = (img ? '<span class="ch-trail" aria-hidden="true"></span><img src="' + img + '" alt="" decoding="async">'
      : '<span class="ch-beam" aria-hidden="true"></span>' + (window.CarArt ? window.CarArt.svg(style, hex) : ''));
    var dots = sec.querySelector('[data-hero-paints]');
    var copy = sec.querySelector('.ch-copy');
    var word = sec.querySelector('.ch-word');

    var enterX = 0, scrollX = 0, raf = 0, dead = false, entered = false, t0 = 0;
    var wheelR = 1;
    function measure() { wheelR = Math.max(1, slot.offsetWidth * 34 / 640); }
    var lastX = 0;
    function render() {
      var x = enterX + scrollX;
      slot.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      if (window.CarArt) window.CarArt.spin(slot, x / wheelR * 57.2958);
      // a photo leans into the motion while it moves
      if (img) {
        var v = x - lastX;
        slot.style.setProperty('--lean', Math.max(-8, Math.min(8, -v * 0.25)).toFixed(2) + 'deg');
        slot.style.setProperty('--trail', Math.min(1, Math.abs(v) / 20).toFixed(3));
      }
      lastX = x;
    }
    function enter(now) {
      if (dead) return;
      if (!t0) t0 = now;
      var t = clamp((now - t0) / 1800, 0, 1);
      var e = 1 - Math.pow(1 - t, 4);
      enterX = -(window.innerWidth * 1.1) * (1 - e) * face;
      sec.classList.toggle('ch-moving', t < 0.85);
      render();
      if (t < 1) requestAnimationFrame(enter);
      else { entered = true; sec.classList.add('ch-parked'); render(); }
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = sec.getBoundingClientRect();
        var y = clamp(-r.top, 0, r.height);
        scrollX = (reduce ? 0 : y * (window.innerWidth < 900 ? 0.45 : 1.25)) * face;
        sec.classList.toggle('ch-moving', y > 8 && y < r.height * 0.9);
        if (copy && !reduce) {
          copy.style.transform = 'translate3d(0,' + (-y * 0.25).toFixed(1) + 'px,0)';
          copy.style.opacity = clamp(1 - y / (r.height * 0.7), 0, 1).toFixed(3);
        }
        if (word && !reduce) word.style.transform = 'translate3d(' + (-y * 0.4).toFixed(1) + 'px,0,0)';
        if (entered || reduce) render();
      });
    }
    if (dots) {
      dots.addEventListener('click', function (e) {
        var b = e.target.closest('[data-hex]');
        if (!b) return;
        [].forEach.call(dots.querySelectorAll('[data-hex]'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var src = b.getAttribute('data-image'), im = slot.querySelector('img');
        if (src && im) {
          var pre = new Image();
          pre.onload = function () {
            im.src = src;
            if (im.animate && !reduce) im.animate([{ opacity: 0.3, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
          };
          pre.src = src;
        } else if (window.CarArt) window.CarArt.paint(slot, b.getAttribute('data-hex'));
        sec.style.setProperty('--hero-paint', b.getAttribute('data-hex'));
        var label = sec.querySelector('[data-hero-paint-name]');
        if (label) label.textContent = b.getAttribute('aria-label');
        slot.classList.remove('is-shine'); void slot.offsetWidth; slot.classList.add('is-shine');
      });
    }

    measure();
    window.addEventListener('resize', function () { measure(); render(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    function start() {
      if (reduce) { entered = true; sec.classList.add('ch-parked'); render(); return; }
      requestAnimationFrame(enter);
    }
    // wait for the preloader so the car arrives on screen, not behind it
    if (document.documentElement.classList.contains('is-loading')) document.addEventListener('site:ready', start, { once: true });
    else start();
    render();
    onScroll();
    return { destroy: function () { dead = true; window.removeEventListener('scroll', onScroll); } };
  }

  var instances = new Map();
  function initAll(root) {
    [].forEach.call((root || document).querySelectorAll('[data-car-hero]'), function (sec) {
      if (!instances.has(sec)) { var i = create(sec); if (i) instances.set(sec, i); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  window.CarHero = { initAll: initAll };
})();
