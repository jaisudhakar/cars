/* Car catalog for the static site (home sections, inventory, car pages, search).
 *
 * Each car: id, name, style (body drawing: sedan|ev|coupe|suv|hatch|pickup), base price,
 * specs and paints. A paint is { name, hex, extra } — `extra` is the paint's price on top
 * of the base price, so the price changes as you pick colours.
 * Optional `image: 'assets/img/cars/x.png'` uses a photo (transparent, facing right) instead
 * of the drawing.
 *
 * The bottom of the file turns paints into the same options/variants shape Shopify uses,
 * so every section works the same way with this file or with Shopify products. */
window.CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'electric', label: 'Electric' },
  { id: 'suv', label: 'SUV' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'performance', label: 'Performance' },
  { id: 'compact', label: 'Compact' },
  { id: 'truck', label: 'Truck' }
];

window.CARS = [
  {
    id: 'aurora-ev',
    name: 'Aurora EV',
    tagline: 'Silent. Swift. All-electric.',
    style: 'ev',
    category: 'electric', categoryLabel: 'Electric sedan',
    price: 54900, badge: 'New', tone: '#e9eef3', year: 2026,
    fuel: 'Electric', seats: 5, drive: 'Dual-motor AWD',
    specs: { power: '510 hp', accel: '3.9 s', range: '620 km', top: '233 km/h' },
    description: 'A long-range electric sedan with dual-motor all-wheel drive, a flat glass roof and a cabin as quiet as a library. Charges from 10 to 80% in 18 minutes.',
    details: ['Dual-motor all-wheel drive', '800 V fast charging — 10–80% in 18 min', 'Panoramic glass roof', 'Over-the-air updates', '8-year battery warranty'],
    paints: [
      { name: 'Glacier White', hex: '#eceff2', extra: 0 },
      { name: 'Midnight Black', hex: '#121417', extra: 0 },
      { name: 'Electric Blue', hex: '#1f55d6', extra: 1200 },
      { name: 'Volt Lime', hex: '#b6dc1f', extra: 2400 }
    ]
  },
  {
    id: 'furia-gt',
    name: 'Furia GT',
    tagline: 'Twin-turbo V8. Zero apologies.',
    style: 'coupe',
    category: 'performance', categoryLabel: 'Performance coupe',
    price: 89900, badge: 'Limited', tone: '#f3e9e6', year: 2026,
    fuel: 'Petrol', seats: 2, drive: 'Rear-wheel drive',
    specs: { power: '620 hp', accel: '3.1 s', range: '540 km', top: '318 km/h' },
    description: 'A front-mid-engine grand tourer with a 4.0 L twin-turbo V8, carbon-ceramic brakes and an active rear wing. Built for the long way home.',
    details: ['4.0 L twin-turbo V8', 'Carbon-ceramic brakes', 'Active rear wing', 'Adaptive magnetic dampers', 'Launch control'],
    paints: [
      { name: 'Rosso Corsa', hex: '#c3161f', extra: 0 },
      { name: 'Solar Yellow', hex: '#f2c21b', extra: 3500 },
      { name: 'Nero Black', hex: '#111316', extra: 0 },
      { name: 'Papaya Orange', hex: '#f06a1d', extra: 3500 }
    ]
  },
  {
    id: 'terra-x7',
    name: 'Terra X7',
    tagline: 'Seven seats. Every road.',
    style: 'suv',
    category: 'suv', categoryLabel: 'Family SUV',
    price: 62500, badge: 'Bestseller', tone: '#e8ece6', year: 2026,
    fuel: 'Plug-in hybrid', seats: 7, drive: 'Intelligent AWD',
    specs: { power: '380 hp', accel: '5.4 s', range: '780 km', top: '240 km/h' },
    description: 'A seven-seat plug-in hybrid SUV with 80 km of electric range, air suspension and a third row adults actually fit in.',
    details: ['Plug-in hybrid — 80 km electric', 'Air suspension with off-road mode', '7 seats, power-folding third row', '2,700 kg towing', '360° camera'],
    paints: [
      { name: 'Obsidian Black', hex: '#14161a', extra: 0 },
      { name: 'Forest Green', hex: '#24573f', extra: 900 },
      { name: 'Champagne Sand', hex: '#b39a72', extra: 900 },
      { name: 'Glacier White', hex: '#eceff2', extra: 0 }
    ]
  },
  {
    id: 'strada',
    name: 'Strada',
    tagline: 'The everyday executive.',
    style: 'sedan',
    category: 'sedan', categoryLabel: 'Executive sedan',
    price: 38400, tone: '#eeeae4', year: 2026,
    fuel: 'Hybrid', seats: 5, drive: 'Front-wheel drive',
    specs: { power: '255 hp', accel: '6.2 s', range: '940 km', top: '235 km/h' },
    description: 'A comfortable, efficient hybrid sedan with a 12.3" curved display, ventilated seats and the best fuel economy in its class.',
    details: ['Self-charging hybrid', '12.3" curved display', 'Ventilated front seats', 'Adaptive cruise with lane centring', '5-star safety rating'],
    paints: [
      { name: 'Rosso Red', hex: '#b5141d', extra: 0 },
      { name: 'Graphite Grey', hex: '#4c5259', extra: 0 },
      { name: 'Pearl White', hex: '#f1f1ee', extra: 750 },
      { name: 'Ocean Blue', hex: '#1d3f8f', extra: 750 }
    ]
  },
  {
    id: 'volt-s',
    name: 'Volt S',
    tagline: 'Electric with a temper.',
    style: 'ev',
    category: 'performance', categoryLabel: 'Electric performance',
    price: 71900, badge: 'New', tone: '#ece8f1', year: 2026,
    fuel: 'Electric', seats: 4, drive: 'Tri-motor AWD',
    specs: { power: '760 hp', accel: '2.4 s', range: '540 km', top: '280 km/h' },
    description: 'Three motors, torque vectoring and a track mode that keeps the battery cool lap after lap. The quickest car we have ever built.',
    details: ['Tri-motor AWD with torque vectoring', 'Track mode with battery pre-conditioning', 'Carbon fibre roof', 'Sport seats with heating & cooling', 'Drift mode'],
    paints: [
      { name: 'Nardo Grey', hex: '#7d8288', extra: 0 },
      { name: 'Ultra Violet', hex: '#6b2fb3', extra: 2900 },
      { name: 'Crimson', hex: '#a3101b', extra: 1500 },
      { name: 'Pearl White', hex: '#f1f1ee', extra: 0 }
    ]
  },
  {
    id: 'ridge',
    name: 'Ridge',
    tagline: 'Work hard. Play harder.',
    style: 'pickup',
    category: 'truck', categoryLabel: 'Pickup truck',
    price: 52700, tone: '#ecebe4', year: 2026,
    fuel: 'Diesel', seats: 5, drive: '4×4 with low range',
    specs: { power: '400 hp', accel: '6.4 s', range: '900 km', top: '190 km/h' },
    description: 'A full-size crew-cab pickup with a 1,100 kg payload, 4,500 kg towing and a tailgate that turns into a step.',
    details: ['3.0 L turbo diesel', '4,500 kg towing', '1,100 kg payload', 'Locking rear differential', 'Bed power outlets'],
    paints: [
      { name: 'Racing Green', hex: '#1f4d36', extra: 0 },
      { name: 'Gunmetal', hex: '#3f454c', extra: 0 },
      { name: 'Copper Orange', hex: '#c0561f', extra: 1100 },
      { name: 'Jet Black', hex: '#0f1113', extra: 0 }
    ]
  },
  {
    id: 'nova',
    name: 'Nova',
    tagline: 'Small car. Big personality.',
    style: 'hatch',
    category: 'compact', categoryLabel: 'Compact hatch',
    price: 27900, tone: '#e6eef0', year: 2026,
    fuel: 'Hybrid', seats: 5, drive: 'Front-wheel drive',
    specs: { power: '180 hp', accel: '7.8 s', range: '1,050 km', top: '205 km/h' },
    description: 'A compact hybrid hatch that parks anywhere, sips fuel and still has room for a weekend away.',
    details: ['Self-charging hybrid', 'Wireless phone mirroring', 'Folding rear seats — 1,200 L', 'Park assist', 'Contrast roof options'],
    paints: [
      { name: 'Sky Blue', hex: '#4c9ad8', extra: 0 },
      { name: 'Coral Pink', hex: '#e46a6a', extra: 500 },
      { name: 'Lemon Yellow', hex: '#f0cf2a', extra: 500 },
      { name: 'Chalk White', hex: '#eeeee9', extra: 0 }
    ]
  }
];

/* ---------- build Shopify-style fields (no need to edit below) ---------- */
(function () {
  var cur = document.documentElement.getAttribute('data-currency') || 'USD';
  function money(n) {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n); }
    catch (e) { return '$' + Math.round(n).toLocaleString(); }
  }
  window.CARS.forEach(function (c) {
    c.base = c.price;
    c.price = money(c.price);
    c.url = 'car.html?id=' + encodeURIComponent(c.id);
    c.type = c.category;
    c.paints.forEach(function (p, i) {
      p.id = c.id + '-' + (i + 1);
      p.av = p.av !== false;
      p.price = money(c.base + (p.extra || 0));
      p.amount = c.base + (p.extra || 0);
    });
    c.options = [{ name: 'Paint', values: c.paints.map(function (p) { return p.name; }) }];
    c.variants = c.paints.map(function (p) { return { id: p.id, av: p.av, price: p.price, opts: [p.name] }; });
    c.images = c.image ? [c.image] : (window.CarArt ? [window.CarArt.dataUri(c.style, c.paints[0].hex)] : []);
  });
  window.CATALOG = window.CARS;
  window.CarMoney = money;
})();
