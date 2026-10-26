/* Car art — side-view cars drawn as inline SVG so every model can be repainted
 * in any colour and its wheels can spin. No image files needed; a transparent
 * PNG/WebP can replace the drawing per car (see road-run.js / car-orbit.js).
 *
 *   CarArt.svg(style, hex, opts)   → '<svg …>' markup (style: sedan|coupe|suv|hatch|pickup|ev)
 *   CarArt.dataUri(style, hex)     → 'data:image/svg+xml,…' for <img> (bag, search, thumbnails)
 *   CarArt.paint(svgOrWrap, hex)   → repaint (the body fades to the new colour)
 *   CarArt.spin(svgOrWrap, deg)    → turn the wheels
 *   CarArt.hex('Midnight Blue')    → best-guess colour for a paint name (Shopify variants)
 *
 * The car faces right, wheels sit on y = 214 in a 640 × 240 box. */
(function () {
  'use strict';
  if (window.CarArt) return;

  var GROUND = 214;
  var uid = 0;

  /* {F} / {R} are replaced with the front / rear wheel arches */
  var STYLES = {
    sedan: {
      rx: 150, fx: 480, wr: 34, sill: 188,
      body: 'M36 178 C31 160 33 143 48 135 L150 124 C176 120 192 111 208 96 C230 77 254 67 292 66 L372 66 C402 66 418 75 436 94 L454 113 C502 117 560 121 594 131 C609 137 615 151 613 167 L609 183 C607 188 602 188 596 188 {F} {R} L48 188 C40 188 37 184 36 178 Z',
      glass: 'M216 103 C236 83 258 74 292 73 L370 73 C396 73 409 81 424 97 L438 112 L210 112 C210 109 212 106 216 103 Z',
      pillars: [[326, 70, 9, 43]],
      lines: ['M330 113 L333 182', 'M226 115 C219 140 217 162 220 182', 'M437 114 C432 140 431 160 433 176'],
      handles: [[348, 124], [246, 124]],
      mirror: 'M432 102 L452 99 C459 99 461 106 456 110 L436 112 Z',
      head: 'M570 128 C584 129 598 133 606 140 L604 146 C590 142 578 139 566 136 Z',
      tail: 'M38 140 L62 137 L62 147 L36 150 Z',
      lower: 'M562 170 L607 167 L605 180 L566 182 Z',
      belt: 'M150 119 C260 115 380 114 456 116'
    },
    ev: {
      rx: 152, fx: 482, wr: 34, sill: 188, aero: true,
      body: 'M36 176 C32 160 34 146 50 139 L146 128 C178 122 200 106 222 90 C246 74 272 67 306 66 L370 66 C404 67 426 78 448 98 L466 114 C516 119 566 125 596 136 C610 142 615 155 612 170 L607 184 C605 188 601 188 596 188 {F} {R} L48 188 C40 188 37 183 36 176 Z',
      glass: 'M228 101 C250 83 274 74 306 73 L368 73 C398 74 418 83 436 99 L450 112 L222 112 C222 108 224 104 228 101 Z',
      pillars: [[334, 70, 8, 43]],
      lines: ['M338 113 L340 182', 'M232 115 C225 140 223 162 226 182', 'M444 116 C439 140 438 160 440 176'],
      handles: [[356, 123, 1], [252, 123, 1]],
      mirror: 'M444 104 L462 102 C468 102 469 108 465 111 L448 113 Z',
      head: 'M548 128 C572 129 594 133 608 142 L606 145 C590 138 570 134 546 132 Z',
      tail: 'M36 141 L66 137 L66 142 L36 146 Z',
      lower: 'M572 172 L607 170 L605 180 L576 182 Z',
      belt: 'M150 121 C270 117 390 116 466 118'
    },
    coupe: {
      rx: 146, fx: 484, wr: 34, sill: 186, sport: true,
      body: 'M34 172 C31 158 36 147 52 141 L150 131 C186 125 214 104 244 89 C266 78 292 74 322 74 C356 74 386 82 412 99 L444 119 C504 123 562 129 598 141 C611 147 617 160 613 173 L607 183 C605 186 601 186 597 186 {F} {R} L46 186 C38 186 35 180 34 172 Z',
      glass: 'M246 112 C266 95 292 83 322 82 C352 82 378 90 402 106 L416 117 L240 118 C240 116 242 114 246 112 Z',
      pillars: [[292, 82, 7, 36]],
      lines: ['M298 119 L304 180', 'M436 121 C432 142 431 160 433 176', 'M210 142 C230 150 260 156 300 158'],
      handles: [[326, 128]],
      mirror: 'M414 106 L434 103 C440 103 442 109 438 113 L418 116 Z',
      head: 'M572 134 C588 136 600 140 608 147 L606 152 C592 148 580 145 566 142 Z',
      tail: 'M36 146 L66 141 L66 149 L35 153 Z',
      lower: 'M556 166 L608 162 L604 176 L560 178 Z',
      spoiler: 'M40 137 L92 131 L95 124 L82 123 L78 129 L42 131 Z',
      belt: 'M150 127 C260 123 380 121 444 123'
    },
    suv: {
      rx: 150, fx: 482, wr: 37, sill: 190,
      body: 'M34 180 L32 124 C32 108 40 97 56 92 L122 70 C142 62 164 58 194 58 L402 58 C422 58 434 64 448 78 L478 110 C530 115 572 121 597 131 C611 137 617 151 615 169 L611 186 C609 190 605 190 599 190 {F} {R} L46 190 C38 190 34 186 34 180 Z',
      glass: 'M66 104 C66 100 68 98 72 96 L128 77 C146 71 164 68 194 68 L398 68 C413 68 423 73 433 83 L458 110 L66 110 Z',
      pillars: [[192, 66, 10, 45], [320, 66, 10, 45]],
      lines: ['M325 111 L327 184', 'M210 112 C206 140 205 162 208 178', 'M436 113 C432 140 431 160 433 176'],
      handles: [[348, 124], [232, 124]],
      mirror: 'M452 104 L472 101 C479 101 481 108 476 112 L456 114 Z',
      head: 'M572 126 C588 127 602 132 610 139 L608 146 C594 142 580 139 566 136 Z',
      tail: 'M34 116 L52 114 L52 140 L33 142 Z',
      lower: 'M570 176 L612 172 L610 184 L574 186 Z',
      rails: 'M118 55 L412 55',
      belt: 'M60 116 C200 114 360 113 478 114'
    },
    hatch: {
      rx: 158, fx: 462, wr: 33, sill: 188,
      body: 'M52 178 L50 128 C50 112 58 100 72 94 L134 74 C154 67 172 64 202 64 L346 64 C368 64 382 70 396 82 L440 114 C492 119 540 124 566 134 C580 140 586 152 584 168 L580 184 C578 188 574 188 568 188 {F} {R} L62 188 C55 188 52 184 52 178 Z',
      glass: 'M80 106 C80 102 82 100 86 98 L138 82 C156 76 172 73 202 73 L344 73 C362 73 374 78 386 88 L418 112 L80 112 Z',
      pillars: [[258, 70, 10, 43]],
      lines: ['M263 113 L265 182', 'M412 116 C409 140 409 160 411 176'],
      handles: [[290, 125]],
      mirror: 'M410 102 L428 99 C434 99 436 105 432 109 L414 111 Z',
      head: 'M548 130 C562 131 574 135 582 142 L580 148 C568 144 556 141 544 138 Z',
      tail: 'M52 114 L68 112 L68 134 L51 136 Z',
      lower: 'M548 170 L582 168 L580 180 L552 182 Z',
      belt: 'M70 118 C200 116 330 115 440 117'
    },
    pickup: {
      rx: 150, fx: 492, wr: 38, sill: 190,
      body: 'M30 182 L28 116 L246 116 L250 74 C251 64 258 58 270 58 L376 58 C392 58 402 64 412 76 L440 108 C504 112 572 118 602 128 C616 134 620 148 618 168 L614 186 C612 190 608 190 602 190 {F} {R} L40 190 C33 190 30 187 30 182 Z',
      glass: 'M262 70 C263 67 266 66 270 66 L374 66 C386 66 394 70 402 80 L426 108 L262 108 Z',
      pillars: [[328, 64, 9, 45]],
      lines: ['M332 109 L334 184', 'M250 116 L252 184', 'M440 112 C436 140 436 160 438 178', 'M40 124 L40 178'],
      handles: [[354, 124], [64, 128]],
      mirror: 'M440 98 L462 95 C469 95 471 102 466 106 L444 108 Z',
      head: 'M576 124 C592 125 606 130 614 137 L612 144 C598 140 584 137 570 134 Z',
      tail: 'M28 120 L38 120 L38 142 L28 142 Z',
      lower: 'M588 148 L618 150 L616 168 L590 166 Z',
      rails: 'M28 113 L246 113',
      belt: 'M28 128 L246 128'
    }
  };

  function arch(w, wr, sill) {
    var half = wr + 8, r = half + 1;
    return 'L' + (w + half) + ' ' + sill + ' A' + r + ' ' + r + ' 0 1 0 ' + (w - half) + ' ' + sill;
  }
  function well(w, s) {
    var half = s.wr + 8, r = half + 1;
    return (w - half) + ' ' + s.sill + ' A' + r + ' ' + r + ' 0 1 1 ' + (w + half) + ' ' + s.sill + ' Z';
  }
  function bodyPath(s) {
    return s.body.replace('{F}', arch(s.fx, s.wr, s.sill)).replace('{R}', arch(s.rx, s.wr, s.sill));
  }
  function n(v) { return Math.round(v * 100) / 100; }

  function wheel(x, s, id, spin) {
    var r = s.wr, cy = GROUND - r, rim = r * 0.66, out = '';
    out += '<circle cx="' + x + '" cy="' + cy + '" r="' + r + '" fill="#121314"/>';
    out += '<circle cx="' + x + '" cy="' + cy + '" r="' + n(r - 4) + '" fill="none" stroke="#2a2c2f" stroke-width="2"/>';
    out += '<circle cx="' + x + '" cy="' + cy + '" r="' + n(rim) + '" fill="url(#' + id + 'r)"/>';
    // brake caliper (does not turn)
    out += '<path d="M' + n(x + rim * 0.35) + ' ' + n(cy - rim * 0.86) + ' A' + n(rim * 0.92) + ' ' + n(rim * 0.92) + ' 0 0 1 ' + n(x + rim * 0.86) + ' ' + n(cy - rim * 0.3) + '" fill="none" stroke="var(--caliper,#e3262f)" stroke-width="' + n(rim * 0.2) + '" stroke-linecap="round"/>';
    out += '<g class="car-wheel"' + (spin ? ' style="transform-origin:' + x + 'px ' + cy + 'px"' : '') + '>';
    var k, a;
    if (s.aero) {
      out += '<circle cx="' + x + '" cy="' + cy + '" r="' + n(rim - 1) + '" fill="#d5dae0" opacity=".92"/>';
      for (k = 0; k < 5; k++) {
        a = k * Math.PI * 2 / 5;
        out += '<circle cx="' + n(x + Math.cos(a) * rim * 0.6) + '" cy="' + n(cy + Math.sin(a) * rim * 0.6) + '" r="' + n(rim * 0.17) + '" fill="#22262b"/>';
      }
      out += '<path d="M' + n(x - rim * 0.95) + ' ' + cy + ' A' + n(rim * 0.95) + ' ' + n(rim * 0.95) + ' 0 0 1 ' + n(x) + ' ' + n(cy - rim * 0.95) + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>';
    } else {
      var spokes = s.sport ? 10 : 5;
      for (k = 0; k < spokes; k++) {
        a = k * Math.PI * 2 / spokes + (s.sport && k % 2 ? 0.12 : 0);
        out += '<line x1="' + n(x + Math.cos(a) * 6) + '" y1="' + n(cy + Math.sin(a) * 6) + '" x2="' + n(x + Math.cos(a) * (rim - 2)) + '" y2="' + n(cy + Math.sin(a) * (rim - 2)) + '" stroke="#dfe3e8" stroke-width="' + (s.sport ? 3 : 5.5) + '" stroke-linecap="round"/>';
      }
    }
    out += '<circle cx="' + x + '" cy="' + cy + '" r="' + n(rim * 0.24) + '" fill="#9aa1a9"/>';
    out += '<circle cx="' + x + '" cy="' + cy + '" r="' + n(rim * 0.1) + '" fill="#2b2e33"/>';
    out += '</g>';
    return out;
  }

  /* opts: { spin: true (wheels can turn), title: '', cls: '', flat: false (no CSS var, for data URIs) } */
  function svg(style, hex, opts) {
    opts = opts || {};
    var s = STYLES[style] || STYLES.sedan;
    var id = 'ca' + (++uid) + '_';
    var paint = opts.flat ? hex : 'var(--paint,' + hex + ')';
    var body = bodyPath(s);
    var cx = (s.rx + s.fx) / 2, span = (s.fx - s.rx) / 2 + 150;
    var o = '';
    o += '<svg class="car-svg' + (opts.cls ? ' ' + opts.cls : '') + '" viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg"' +
      (opts.flat ? '' : ' style="--paint:' + hex + '"') +
      (opts.title ? ' role="img" aria-label="' + String(opts.title).replace(/"/g, '&quot;') + '"' : ' aria-hidden="true"') + ' focusable="false">';
    o += '<defs>' +
      '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity=".06"/>' +
        '<stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/>' +
        '<stop offset=".6" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4552"/><stop offset="1" stop-color="#0c1015"/></linearGradient>' +
      '<radialGradient id="' + id + 'r"><stop offset=".55" stop-color="#3a3f46"/><stop offset="1" stop-color="#16181b"/></radialGradient>' +
      '<radialGradient id="' + id + 'd"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="' + id + 'c"><path d="' + s.glass + '"/></clipPath>' +
      '</defs>';
    // ground shadow
    o += '<ellipse class="car-shadow" cx="' + cx + '" cy="' + (GROUND + 2) + '" rx="' + span + '" ry="11" fill="url(#' + id + 'd)"/>';
    o += '<g class="car-body">';
    if (s.rails) o += '<path d="' + s.rails + '" stroke="#1d1f22" stroke-width="5" stroke-linecap="round" fill="none"/>';
    o += '<path class="car-paint" d="' + body + '" style="fill:' + paint + '"/>';
    o += '<path d="' + body + '" fill="url(#' + id + 's)"/>';
    o += '<path d="' + body + '" fill="url(#' + id + 'h)"/>';
    // glass + reflection
    o += '<path d="' + s.glass + '" fill="url(#' + id + 'g)"/>';
    o += '<g clip-path="url(#' + id + 'c)" fill="#fff"><path d="M180 112 L260 60 L300 60 L220 112 Z" opacity=".16"/><path d="M236 112 L316 60 L330 60 L250 112 Z" opacity=".1"/></g>';
    (s.pillars || []).forEach(function (p) {
      o += '<rect x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" style="fill:' + paint + '"/>';
      o += '<rect x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" fill="#000" opacity=".18"/>';
    });
    if (s.belt) o += '<path d="' + s.belt + '" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>';
    (s.lines || []).forEach(function (d) {
      o += '<path d="' + d + '" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.4" stroke-linecap="round"/>';
    });
    (s.handles || []).forEach(function (h) {
      o += '<rect x="' + h[0] + '" y="' + h[1] + '" width="' + (h[2] ? 18 : 22) + '" height="' + (h[2] ? 3 : 5) + '" rx="2.5" fill="' + (h[2] ? '#000' : '#1b1d20') + '" opacity="' + (h[2] ? '.35' : '.55') + '"/>';
    });
    if (s.spoiler) o += '<path d="' + s.spoiler + '" fill="#15171a"/>';
    o += '<path d="' + s.lower + '" fill="#141619"/>';
    o += '<path d="' + s.mirror + '" style="fill:' + paint + '"/><path d="' + s.mirror + '" fill="#000" opacity=".25"/>';
    o += '<path class="car-head" d="' + s.head + '" fill="#fff7d6"/>';
    o += '<path class="car-tail" d="' + s.tail + '" fill="#e8202a"/>';
    // side skirt between the wheels
    o += '<rect x="' + (s.rx + s.wr + 10) + '" y="' + (s.sill - 5) + '" width="' + (s.fx - s.rx - 2 * s.wr - 20) + '" height="5" rx="2" fill="#000" opacity=".4"/>';
    o += '</g>';
    // dark wheel wells: exactly the arch cut-outs
    o += '<path fill="#0b0c0d" d="M' + well(s.rx, s) + ' M' + well(s.fx, s) + '"/>';
    o += wheel(s.rx, s, id, opts.spin !== false && !opts.flat);
    o += wheel(s.fx, s, id, opts.spin !== false && !opts.flat);
    o += '</svg>';
    return o;
  }

  var cache = {};
  function dataUri(style, hex) {
    var k = style + hex;
    if (!cache[k]) cache[k] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(style, hex, { flat: true, spin: false }));
    return cache[k];
  }
  function svgOf(el) { return !el ? null : (el.tagName && el.tagName.toLowerCase() === 'svg' ? el : el.querySelector('svg.car-svg')); }
  function paint(el, hex) { var s = svgOf(el); if (s) s.style.setProperty('--paint', hex); }
  function spin(el, deg) {
    var s = svgOf(el);
    if (!s) return;
    var w = s.__wheels || (s.__wheels = s.querySelectorAll('.car-wheel'));
    var t = 'rotate(' + deg.toFixed(1) + 'deg)';
    for (var i = 0; i < w.length; i++) w[i].style.transform = t;
  }

  /* colour words → hex, for Shopify variants named "Rosso Red", "Midnight Blue" … */
  var WORDS = [
    ['black|nero|onyx|obsidian|midnight black|jet', '#111316'], ['white|bianco|pearl|glacier|snow|ivory|chalk', '#eceff2'],
    ['silver|platinum|argent|mercury', '#b9bec5'], ['grey|gray|graphite|gunmetal|titanium|slate|nardo', '#5f656d'],
    ['red|rosso|crimson|scarlet|ruby|flame|cherry', '#c3161f'], ['orange|arancio|copper|sunset|papaya', '#f06a1d'],
    ['yellow|giallo|gold|amber|lemon', '#f2c21b'], ['lime|volt|acid|neon', '#b6e01f'],
    ['green|verde|emerald|racing green|forest|olive|sage', '#1f6b45'], ['teal|cyan|aqua|turquoise', '#139aa0'],
    ['blue|blu|azure|cobalt|navy|ocean|sapphire|sky|midnight', '#1f4fbf'], ['purple|violet|viola|plum|amethyst', '#6b2fb3'],
    ['pink|rose|magenta', '#e0457b'], ['brown|bronze|mocha|espresso|sand|beige|champagne', '#8a6a4a']
  ];
  function hex(name) {
    var s = String(name || '').toLowerCase();
    var m = s.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/);
    if (m) return m[0];
    for (var i = 0; i < WORDS.length; i++) if (new RegExp('\\b(' + WORDS[i][0] + ')\\b').test(s)) return WORDS[i][1];
    return '#6d737b';
  }
  function light(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  }

  window.CarArt = { svg: svg, dataUri: dataUri, paint: paint, spin: spin, hex: hex, isLight: light, styles: Object.keys(STYLES), GROUND: GROUND };
})();
