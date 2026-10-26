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
    slot.innerHTML = '<span class="ch-beam" aria-hidden="true"></span>' +
      (img ? '<img src="' + img + '" alt="" decoding="async">' : (window.CarArt ? window.CarArt.svg(style, hex) : ''));
    var dots = sec.querySelector('[data-hero-paints]');
    var copy = sec.querySelector('.ch-copy');
    var word = sec.querySelector('.ch-word');

    var enterX = 0, scrollX = 0, raf = 0, dead = false, entered = false, t0 = 0;
    var wheelR = 1;
    function measure() { wheelR = Math.max(1, slot.offsetWidth * 34 / 640); }
    function render() {
      var x = enterX + scrollX;
      slot.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      if (window.CarArt) window.CarArt.spin(slot, x / wheelR * 57.2958);
    }
    function enter(now) {
      if (dead) return;
      if (!t0) t0 = now;
      var t = clamp((now - t0) / 1800, 0, 1);
      var e = 1 - Math.pow(1 - t, 4);
      enterX = -(window.innerWidth * 1.1) * (1 - e);
      sec.classList.toggle('ch-moving', t < 0.85);
      render();
      if (t < 1) requestAnimationFrame(enter);
      else { entered = true; sec.classList.add('ch-parked'); }
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = sec.getBoundingClientRect();
        var y = clamp(-r.top, 0, r.height);
        scrollX = reduce ? 0 : y * 1.25;
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
        if (window.CarArt) window.CarArt.paint(slot, b.getAttribute('data-hex'));
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
