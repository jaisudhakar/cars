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
  function contact(main) {
    var c = B.contact || {};
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
