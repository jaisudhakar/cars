/* Inner pages: inventory (filter / sort / search), car page (paint configurator),
 * contact + test-drive form, accordions. Adapted from shopify-theme-viral's pages.js. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CARS = window.CARS || [];
  var B = window.BRAND || {};
  var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function params() { return new URLSearchParams(location.search); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function money(n) { return window.CarMoney ? window.CarMoney(n) : '$' + Math.round(n).toLocaleString(); }
  function monthly(price, opts) {
    opts = opts || {};
    var loan = price * (1 - (opts.down == null ? 0.2 : opts.down));
    var n = opts.months || 48, r = (opts.apr == null ? 4.9 : opts.apr) / 100 / 12;
    return r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
  }

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
    var top = Math.ceil(Math.max.apply(null, prices.concat([0])) / 5000) * 5000;
    var maxPrice = top;
    if (maxEl) { maxEl.max = top; maxEl.min = Math.floor(Math.min.apply(null, prices) / 5000) * 5000; maxEl.value = top; }

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
        if (q && (p.name + ' ' + p.categoryLabel + ' ' + p.description + ' ' + p.fuel).toLowerCase().indexOf(q.toLowerCase()) < 0) return false;
        return true;
      });
      if (sort === 'price-asc') out.sort(function (a, b) { return a.base - b.base; });
      if (sort === 'price-desc') out.sort(function (a, b) { return b.base - a.base; });
      if (sort === 'power') out.sort(function (a, b) { return parseFloat(b.specs.power) - parseFloat(a.specs.power); });
      if (sort === 'accel') out.sort(function (a, b) { return parseFloat(a.specs.accel) - parseFloat(b.specs.accel); });
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
      var heading = q ? 'Search results' : (cat === 'all' ? 'All inventory' : catInfo.label + ' cars');
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

  /* ================= CAR PAGE ================= */
  function carPage(main) {
    var id = params().get('id');
    var car = CARS.filter(function (c) { return c.id === id; })[0] || CARS[0];
    if (!car) return;
    var k = clamp(+(params().get('paint') || 1) - 1, 0, car.paints.length - 1) || 0;
    document.title = car.name + ' — ' + (B.name || 'Cars');
    var stage = $('[data-cfg-car]', main);
    var ui = {
      crumb: $('[data-cfg-crumb]', main), cat: $('[data-cfg-cat]', main), name: $('[data-cfg-name]', main),
      tag: $('[data-cfg-tag]', main), desc: $('[data-cfg-desc]', main), price: $('[data-cfg-price]', main),
      paintName: $('[data-cfg-paint-name]', main), paints: $('[data-cfg-paints]', main), month: $('[data-cfg-month]', main),
      reserve: $('[data-cfg-reserve]', main), msg: $('[data-cfg-msg]', main), ghost: $('[data-cfg-ghost]', main),
      specs: $('[data-cfg-specs]', main), details: $('[data-cfg-details]', main), related: $('[data-cfg-related]', main),
      sticky: $('[data-cfg-sticky]', main), drive: $('[data-cfg-drive]', main)
    };
    ui.crumb.textContent = car.name;
    ui.cat.textContent = car.categoryLabel;
    ui.name.textContent = car.name;
    ui.tag.textContent = car.tagline;
    ui.desc.textContent = car.description;
    ui.ghost.textContent = car.name;
    main.style.setProperty('--tone', car.tone || '#eef0f2');
    var img = car.paints[k].image || car.image;
    stage.innerHTML = '<span class="cfg-beam" aria-hidden="true"></span>' + (img ? '<img src="' + esc(img) + '" alt="' + esc(car.name) + '">' : window.CarArt.svg(car.style, car.paints[k].hex, { title: car.name }));
    var min = Math.min.apply(null, car.paints.map(function (p) { return p.amount; }));
    ui.paints.innerHTML = car.paints.map(function (p, i) {
      var extra = p.amount - min;
      return '<button type="button" class="cfg-paint" role="radio" aria-checked="false" data-k="' + i + '" style="--c:' + esc(p.hex) + '">' +
        '<i aria-hidden="true"></i><span><strong>' + esc(p.name) + '</strong><small>' + (extra ? '+' + money(extra) : 'Included') + '</small></span></button>';
    }).join('');

    // specs with count-up numbers
    var s = car.specs || {};
    var rows = [['Power', s.power], ['0–100 km/h', s.accel], ['Range', s.range], ['Top speed', s.top], ['Seats', String(car.seats || '')], ['Drive', car.drive], ['Fuel', car.fuel], ['Model year', String(car.year || '')]];
    ui.specs.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
      var m = String(r[1]).match(/^([\d.,]+)\s*(.*)$/);
      var num = m && r[0] !== 'Model year' ? '<span data-count-to="' + m[1].replace(/,/g, '') + '"><span data-count>' + esc(m[1]) + '</span></span>' + (m[2] ? '<small>' + esc(m[2]) + '</small>' : '') : esc(r[1]);
      return '<div class="cfg-spec" data-reveal><dt>' + r[0] + '</dt><dd' + (m ? '' : ' class="is-text"') + '>' + num + '</dd></div>';
    }).join('');
    ui.details.innerHTML = (car.details || []).map(function (d, i) {
      return '<li data-reveal style="--rd:' + (i * 0.06).toFixed(2) + 's"><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span>' + esc(d) + '</li>';
    }).join('');

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
      if (im) { var src = p.image || car.image; if (src) im.src = src; }
      else window.CarArt.paint(stage, p.hex);
      main.style.setProperty('--paint', p.hex);
      ui.paintName.textContent = p.name;
      countPrice(p.amount);
      ui.month.textContent = money(monthly(p.amount));
      $$('.cfg-paint', ui.paints).forEach(function (b, n) { b.setAttribute('aria-checked', n === i ? 'true' : 'false'); b.tabIndex = n === i ? 0 : -1; });
      if (ui.sticky) { $('[data-sticky-price]', ui.sticky).textContent = p.price; $('[data-sticky-paint]', ui.sticky).textContent = p.name; }
      if (!quiet && !reduce) { stage.classList.remove('is-shine'); void stage.offsetWidth; stage.classList.add('is-shine'); }
      var u = new URL(location.href);
      u.searchParams.set('paint', i + 1);
      history.replaceState(null, '', u.pathname.split('/').pop() + u.search);
    }
    ui.paints.addEventListener('click', function (e) { var b = e.target.closest('.cfg-paint'); if (b) pick(+b.getAttribute('data-k')); });
    ui.paints.addEventListener('keydown', function (e) {
      var n = car.paints.length, i = k;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (k + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (k - 1 + n) % n;
      else return;
      e.preventDefault(); pick(i); ui.paints.children[i].focus();
    });
    pick(k, true);

    // the car drives in when the page opens; "Take it for a spin" drives it off and back
    var wheelR = 1, x = 0, busy = false;
    function setX(v) {
      x = v;
      stage.style.transform = 'translate3d(' + v.toFixed(1) + 'px,0,0)';
      window.CarArt.spin(stage, v / wheelR * 57.2958);
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
    var easeOut = function (t) { return 1 - Math.pow(1 - t, 4); };
    var easeIn = function (t) { return t * t * t; };
    wheelR = Math.max(1, stage.offsetWidth * 34 / 640);
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
    window.addEventListener('resize', function () { wheelR = Math.max(1, stage.offsetWidth * 34 / 640); });

    function reserve(btn) {
      var p = car.paints[k];
      btn.classList.add('is-busy');
      return window.SiteCart.add({ id: p.id, quantity: 1, title: car.name, variant: p.name, price: p.price, image: p.image || car.image || window.CarArt.dataUri(car.style, p.hex) })
        .then(function () {
          ui.msg.innerHTML = '<i aria-hidden="true"></i>' + esc(car.name) + ' in ' + esc(p.name) + ' is in your ' + esc((B.cartLabel || 'cart').toLowerCase()) + '. ';
          var a = document.createElement('a');
          a.href = '#cart'; a.textContent = 'View ' + (B.cartLabel || 'cart').toLowerCase();
          ui.msg.appendChild(a);
          ui.msg.className = 'cfg-msg is-ok';
          setTimeout(function () { window.SiteCart.open(); }, 400);
        })
        .then(function () { btn.classList.remove('is-busy'); });
    }
    ui.reserve.addEventListener('click', function () { reserve(ui.reserve); });
    if (ui.sticky) {
      $('[data-sticky-name]', ui.sticky).textContent = car.name;
      $('[data-sticky-reserve]', ui.sticky).addEventListener('click', function (e) { reserve(e.currentTarget); });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) { ui.sticky.classList.toggle('is-on', !en[0].isIntersecting); }).observe(ui.reserve);
      }
    }
    var test = $('[data-cfg-test]', main);
    if (test) test.href = 'contact.html?model=' + encodeURIComponent(car.name) + '#test-drive';

    // related: same category first, then the rest
    var rel = CARS.filter(function (c) { return c.id !== car.id; })
      .sort(function (a, b) { return (b.category === car.category) - (a.category === car.category); }).slice(0, 3);
    ui.related.innerHTML = rel.map(window.CarCard.html).join('');
    window.CarCard.wire(ui.related, CARS);

    if (window.SiteMotion) window.SiteMotion.init(main);
    if (window.CarSections) window.CarSections.init(main);
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
  if (kind === 'car') carPage(main);
  if (kind === 'contact') contact(main);
})();
