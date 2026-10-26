/* Inner pages: inventory (filter / sort / search), contact + test-drive form, accordions.
 * The car page lives in car-config.js. Adapted from shopify-theme-viral's pages.js. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CARS = window.CARS || [];
  var B = window.BRAND || {};

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function params() { return new URLSearchParams(location.search); }
  function money(n) { return window.CarMoney ? window.CarMoney(n) : '$' + Math.round(n).toLocaleString(); }

  /* ---------- accordion ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.acc-btn');
    if (!btn) return;
    var item = btn.closest('.acc-item');
    var open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ================= INVENTORY ================= */
  function inventory(main) {
    var grid = $('[data-shop-grid]', main);
    var countEl = $('[data-shop-count]', main);
    var sortEl = $('[data-shop-sort]', main);
    var title = $('[data-shop-title]', main);
    var queryEl = $('[data-shop-query]', main);
    var empty = $('[data-shop-empty]', main);
    var tabsWrap = $('[data-shop-tabs]', main);
    var bar = $('[data-shop-bar]', main);
    var fuelEl = $('[data-shop-fuel]', main);
    var maxEl = $('[data-shop-max]', main), maxOut = $('[data-shop-max-out]', main);
    var q = (params().get('q') || '').trim();
    var cat = params().get('c') || 'all';
    var sort = params().get('sort') || 'featured';
    var fuel = 'all';
    var prices = CARS.map(function (c) { return c.base; });
    var STEP = 500;
    var top = Math.ceil(Math.max.apply(null, prices.concat([0])) / STEP) * STEP;
    var maxPrice = top;
    if (maxEl) { maxEl.step = STEP; maxEl.max = top; maxEl.min = Math.floor(Math.min.apply(null, prices) / STEP) * STEP; maxEl.value = top; }

    tabsWrap.innerHTML = '<span class="tab-ink" aria-hidden="true"></span>' + (window.CATEGORIES || []).map(function (c) {
      var n = c.id === 'all' ? CARS.length : CARS.filter(function (p) { return p.category === c.id; }).length;
      return '<button type="button" class="tab" data-filter="' + esc(c.id) + '" aria-pressed="' + (c.id === cat) + '">' + esc(c.label) + ' <span class="muted">' + n + '</span></button>';
    }).join('');
    sortEl.value = sort;
    if (fuelEl) {
      var fuels = CARS.map(function (c) { return c.fuel; }).filter(function (f, i, a) { return f && a.indexOf(f) === i; });
      fuelEl.innerHTML = '<option value="all">Any fuel</option>' + fuels.map(function (f) { return '<option>' + esc(f) + '</option>'; }).join('');
    }

    function list() {
      var out = CARS.filter(function (p) {
        if (cat !== 'all' && p.category !== cat) return false;
        if (fuel !== 'all' && p.fuel !== fuel) return false;
        if (p.base > maxPrice) return false;
        if (q && (p.name + ' ' + p.categoryLabel + ' ' + p.description + ' ' + (p.fuel || '') + ' ' + p.paints.map(function (x) { return x.name; }).join(' ')).toLowerCase().indexOf(q.toLowerCase()) < 0) return false;
        return true;
      });
      if (sort === 'price-asc') out.sort(function (a, b) { return a.base - b.base; });
      if (sort === 'price-desc') out.sort(function (a, b) { return b.base - a.base; });
      if (sort === 'colours') out.sort(function (a, b) { return b.paints.length - a.paints.length; });
      if (sort === 'name') out.sort(function (a, b) { return a.name.localeCompare(b.name); });
      return out;
    }
    function sync() {
      var u = new URL(location.href);
      ['c', 'q', 'sort'].forEach(function (k) { u.searchParams.delete(k); });
      if (cat !== 'all') u.searchParams.set('c', cat);
      if (q) u.searchParams.set('q', q);
      if (sort !== 'featured') u.searchParams.set('sort', sort);
      history.replaceState(null, '', u.pathname.split('/').pop() + u.search);
    }
    function render(animate) {
      var items = list();
      var paint = function () { grid.innerHTML = items.map(window.CarCard.html).join(''); };
      if (animate && window.SiteSections) window.SiteSections.flip(grid, paint); else paint();
      if (!animate && window.SiteMotion) window.SiteMotion.init(grid);
      countEl.textContent = items.length + (items.length === 1 ? ' car' : ' cars');
      empty.hidden = items.length > 0;
      queryEl.hidden = !q;
      if (q) queryEl.querySelector('span').textContent = 'Results for “' + q + '”';
      var catInfo = (window.CATEGORIES || []).filter(function (c) { return c.id === cat; })[0] || {};
      var heading = q ? 'Search results' : (cat === 'all' ? 'All RC cars' : catInfo.label);
      if (title.getAttribute('data-current') !== heading) {
        title.setAttribute('data-current', heading);
        var words = heading.split(' ');
        title.innerHTML = esc(words[0]) + (words.length > 1 ? ' <em>' + esc(words.slice(1).join(' ')) + '</em>' : '');
        if (!reduce && title.animate) title.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
      if (maxOut) maxOut.textContent = maxPrice >= top ? 'Any price' : 'Up to ' + money(maxPrice);
      document.title = heading + ' — ' + (B.name || 'Cars');
      sync();
    }

    window.CarCard.wire(grid, CARS);
    var tabs = window.SiteSections.tabs(tabsWrap, function (f) { cat = f; render(true); });
    sortEl.addEventListener('change', function () { sort = sortEl.value; render(true); });
    if (fuelEl) fuelEl.addEventListener('change', function () { fuel = fuelEl.value; render(true); });
    if (maxEl) {
      var fill = function () { maxEl.style.setProperty('--fill', ((maxEl.value - maxEl.min) / (maxEl.max - maxEl.min) * 100) + '%'); };
      fill();
      maxEl.addEventListener('input', function () { maxPrice = +maxEl.value; fill(); render(true); });
    }
    queryEl.querySelector('button').addEventListener('click', function () { q = ''; render(true); });
    $('[data-shop-reset]', main).addEventListener('click', function () {
      q = ''; cat = 'all'; sort = 'featured'; fuel = 'all'; maxPrice = top;
      sortEl.value = sort;
      if (fuelEl) fuelEl.value = 'all';
      if (maxEl) { maxEl.value = top; maxEl.dispatchEvent(new Event('input')); }
      tabs.pick(tabs.buttons[0], true);
      render(true);
    });
    $$('.view-toggle button', main).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.view-toggle button', main).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        window.SiteSections.flip(grid, function () { grid.classList.toggle('cols-2', b.getAttribute('data-cols') === '2'); });
      });
    });
    window.addEventListener('scroll', function () { bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= 70); }, { passive: true });
    render(false);
  }

  /* ================= CONTACT ================= */
  function builtBy(main) {
    var d = B.developer, box = $('[data-built-by]', main);
    if (!d || !box) return;
    var ICON = {
      mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
      phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
      globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>',
      github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
      link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
    };
    var rows = [];
    if (d.email) rows.push('<a class="bb-row" href="mailto:' + esc(d.email) + '">' + ICON.mail + '<span><small>Email</small>' + esc(d.email) + '</span></a>');
    if (d.phone) rows.push('<a class="bb-row" href="tel:' + esc(String(d.phone).replace(/[^+\d]/g, '')) + '">' + ICON.phone + '<span><small>Phone</small>' + esc(d.phone) + '</span></a>');
    box.innerHTML =
      '<div class="bb-photo">' + (d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="lazy">' : '') + '<span class="bb-ring" aria-hidden="true"></span></div>' +
      '<div class="bb-body">' +
      '  <p class="eyebrow">Website designed &amp; built by</p>' +
      '  <h2 class="bb-name">' + esc(d.name) + '</h2>' +
      '  <p class="bb-title">' + esc(d.title || '') + '</p>' +
      (d.bio ? '  <p class="bb-bio">' + esc(d.bio) + '</p>' : '') +
      '  <p class="bb-meta">' + [d.company, d.location].filter(Boolean).map(esc).join(' · ') + '</p>' +
      '  <div class="bb-rows">' + rows.join('') + '</div>' +
      '  <div class="bb-links">' + (d.links || []).map(function (l) {
        return '<a class="bb-link" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + (ICON[l.icon] || ICON.link) + esc(l.label) + '</a>';
      }).join('') + '</div>' +
      '</div>';
  }

  function contact(main) {
    var c = B.contact || {};
    builtBy(main);
    // hide contact cards whose detail is not filled in yet (e.g. phone)
    $$('[data-brand]', main).forEach(function (el) {
      var k = el.getAttribute('data-brand'), card = el.closest('.info-card');
      if (!c[k] && card && (k === 'phone' || k === 'email')) card.hidden = true;
    });
    $$('[data-brand]', main).forEach(function (el) {
      var key = el.getAttribute('data-brand');
      if (c[key]) el.textContent = c[key];
      if (key === 'email' && el.closest('a')) el.closest('a').href = 'mailto:' + c.email;
      if (key === 'phone' && el.closest('a')) el.closest('a').href = 'tel:' + String(c.phone).replace(/[^+\d]/g, '');
    });
    var form = $('[data-contact-form]', main);
    if (!form) return;
    var model = $('select[name="model"]', form);
    if (model) {
      model.innerHTML = '<option value="">Not sure yet</option>' + CARS.map(function (car) { return '<option>' + esc(car.name) + '</option>'; }).join('');
      var pre = params().get('model');
      if (pre) model.value = pre;
    }
    var date = $('input[type="date"]', form);
    if (date) date.min = new Date().toISOString().slice(0, 10);
    var rules = {
      name: function (v) { return v.trim().length > 1 || 'Please enter your name.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email.'; },
      phone: function (v) { return v.replace(/\D/g, '').length >= 7 || 'Please enter a phone number.'; }
    };
    function check(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var res = rule(input.value);
      var field = input.closest('.field');
      field.classList.toggle('is-invalid', res !== true);
      field.querySelector('.field-err').textContent = res === true ? '' : res;
      return res === true;
    }
    $$('input, textarea', form).forEach(function (i) {
      i.addEventListener('blur', function () { if (i.value) check(i); });
      i.addEventListener('input', function () { if (i.closest('.field') && i.closest('.field').classList.contains('is-invalid')) check(i); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('input[name], textarea[name]', form).filter(function (i) { return !check(i); });
      if (bad.length) { bad[0].focus(); return; }
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending…';
      // Static demo: no server. Hook this up to Formspree, Netlify Forms or Shopify's contact form.
      setTimeout(function () {
        form.hidden = true;
        var done = $('[data-contact-done]', main);
        done.classList.add('is-on');
        done.querySelector('[data-done-name]').textContent = $('input[name="name"]', form).value.trim().split(' ')[0];
      }, 900);
    });
  }

  var main = document.querySelector('[data-page]');
  if (!main) return;
  var kind = main.getAttribute('data-page');
  if (kind === 'inventory') inventory(main);
  if (kind === 'contact') contact(main);
})();
