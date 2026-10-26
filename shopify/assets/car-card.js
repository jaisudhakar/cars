/* Car cards — the car drives forward with turning wheels on hover; paint dots repaint it
 * and update the price; "Reserve" adds the car in that paint to the garage.
 *
 *   CarCard.html(car, index)    → card markup
 *   CarCard.wire(container, list) → paint dots + reserve for every card inside container
 *
 * car = item from data/catalog.js or the same shape built in Liquid (snippets/car-json.liquid). */
(function () {
  'use strict';
  if (window.CarCard) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function url(c) { return c.url || ('car.html?id=' + encodeURIComponent(c.id)); }
  function art(c, k) {
    var p = c.paints[k || 0];
    var img = p.image || c.image;
    return img ? '<img src="' + esc(img) + '" alt="' + esc(c.name) + '" loading="lazy" decoding="async">'
      : (window.CarArt ? window.CarArt.svg(c.style, p.hex, { title: c.name + ' in ' + p.name }) : '');
  }

  function html(c, i) {
    var s = c.specs || {};
    var specs = [[s.power, 'Power'], [s.accel, '0–100'], [s.range, 'Range']].filter(function (x) { return x[0]; });
    return '' +
      '<article class="cc" data-id="' + esc(c.id) + '" data-reveal style="--tone:' + esc(c.tone || '#eef0f2') + ';--rd:' + ((i || 0) % 3 * 0.08).toFixed(2) + 's">' +
      '  <a class="cc-media" href="' + esc(url(c)) + '" data-cursor="Drive" aria-label="' + esc(c.name) + '">' +
      '    <span class="cc-ghost" aria-hidden="true">' + esc(c.name) + '</span>' +
      '    <span class="cc-car">' + art(c, 0) + '</span>' +
      (c.badge ? '    <span class="cc-badge">' + esc(c.badge) + '</span>' : '') +
      '    <span class="cc-year">' + esc(c.year || '') + '</span>' +
      '  </a>' +
      '  <div class="cc-body">' +
      '    <div class="cc-top">' +
      '      <div><h3 class="cc-name"><a href="' + esc(url(c)) + '">' + esc(c.name) + '</a></h3><p class="cc-cat">' + esc([c.categoryLabel, c.fuel].filter(Boolean).join(' · ')) + '</p></div>' +
      '      <div class="cc-price"><small>From</small><strong data-cc-price>' + esc(c.paints[0].price || c.price) + '</strong></div>' +
      '    </div>' +
      (specs.length ? '    <ul class="cc-specs">' + specs.map(function (x) { return '<li><b>' + esc(x[0]) + '</b>' + x[1] + '</li>'; }).join('') + '</ul>' : '') +
      '    <div class="cc-foot">' +
      '      <div class="cc-paints" role="radiogroup" aria-label="Paint for ' + esc(c.name) + '">' + c.paints.map(function (p, k) {
        return '<button type="button" role="radio" aria-checked="' + (k === 0) + '" data-k="' + k + '" style="--c:' + esc(p.hex) + '" aria-label="' + esc(p.name + ' — ' + p.price) + '" title="' + esc(p.name) + '"></button>';
      }).join('') + '<span class="cc-paint-name" data-cc-paint>' + esc(c.paints[0].name) + '</span></div>' +
      '      <button type="button" class="cc-add" data-cc-add>Reserve <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
      '    </div>' +
      '  </div>' +
      '</article>';
  }

  function wire(container, list) {
    if (!container || container.__cc) return;
    container.__cc = true;
    function find(card) {
      var id = card.getAttribute('data-id');
      return (list || window.CARS || []).filter(function (c) { return String(c.id) === id; })[0];
    }
    function pick(card, c, k, preview) {
      var p = c.paints[k];
      var car = card.querySelector('.cc-car');
      var img = car.querySelector('img');
      if (img) { var src = p.image || c.image; if (src) img.src = src; }
      else if (window.CarArt) window.CarArt.paint(car, p.hex);
      if (preview) return;
      card.__k = k;
      card.querySelector('[data-cc-price]').textContent = p.price;
      card.querySelector('[data-cc-paint]').textContent = p.name;
      [].forEach.call(card.querySelectorAll('.cc-paints [data-k]'), function (b) { b.setAttribute('aria-checked', +b.getAttribute('data-k') === k ? 'true' : 'false'); });
      var pr = card.querySelector('[data-cc-price]');
      pr.classList.remove('is-bump'); void pr.offsetWidth; pr.classList.add('is-bump');
    }
    container.addEventListener('click', function (e) {
      var card = e.target.closest('.cc');
      if (!card) return;
      var c = find(card);
      if (!c) return;
      var dot = e.target.closest('.cc-paints [data-k]');
      if (dot) { pick(card, c, +dot.getAttribute('data-k')); return; }
      var add = e.target.closest('[data-cc-add]');
      if (add && window.SiteCart) {
        var p = c.paints[card.__k || 0];
        add.classList.add('is-busy');
        window.SiteCart.add({ id: p.id, quantity: 1, title: c.name, variant: p.name, price: p.price, image: p.image || c.image || (window.CarArt ? window.CarArt.dataUri(c.style, p.hex) : '') })
          .then(function () {
            add.classList.add('is-done');
            add.firstChild.nodeValue = 'Reserved ';
            if (!window.SiteCart.isShopify) setTimeout(function () { window.SiteCart.open(); }, 350);
            setTimeout(function () { add.classList.remove('is-done'); add.firstChild.nodeValue = 'Reserve '; }, 2600);
          })
          .catch(function (err) { alert((err && err.message) || 'Could not reserve.'); })
          .then(function () { add.classList.remove('is-busy'); });
      }
    });
    // hovering a dot previews the colour
    container.addEventListener('pointerover', function (e) {
      var dot = e.target.closest('.cc-paints [data-k]');
      if (!dot || e.pointerType !== 'mouse') return;
      var card = dot.closest('.cc'), c = find(card);
      if (c) pick(card, c, +dot.getAttribute('data-k'), true);
    });
    container.addEventListener('pointerout', function (e) {
      var wrap = e.target.closest('.cc-paints');
      if (!wrap || wrap.contains(e.relatedTarget)) return;
      var card = wrap.closest('.cc'), c = find(card);
      if (c) pick(card, c, card.__k || 0, true);
    });
  }

  window.CarCard = { html: html, wire: wire, url: url };
})();
