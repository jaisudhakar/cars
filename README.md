# Veloce — animated car dealership theme (HTML site + Shopify sections)

A scroll-animated storefront for a car brand or dealership, built on the same framework as
[`shopify-theme-viral`](https://github.com/jaisudhakar/shopify-theme-viral) (shared motion helpers, site shell,
cart and section pattern), delivered two ways from the same CSS/JS:

| Folder | What it is |
| --- | --- |
| `html/` | Static multi-page site. Open `html/index.html` — no build step. Ideal for client demos. |
| `shopify/` | 11 theme sections + snippets + assets to drop into any Shopify theme (Dawn or similar). |
| `reference/` | The "drag the wheel" design reference the Showroom section is based on. |

"Veloce" and the models are placeholder names — re-skin with the client's brand before showing it (see below).

## The animations

| Section | What happens |
| --- | --- |
| **Road Run** (signature) | A pinned road. As you scroll, each car drives in from the left with its wheels turning, parks in front of you, then drives off as the next one arrives. While parked it shows name, tagline, specs and the **price in each paint colour** — pick a paint and the car is repainted and the price counts to the new amount. The sky goes day → golden hour → night (stars, lit windows, street lamps, headlight beams), scenery slides past in parallax layers, a speedometer follows your scroll speed and an odometer counts the distance. A model list on the right jumps to any car. |
| **Showroom wheel** | The interaction from `reference/showroom-wheel-reference.png`: cars ride a big arc, drag the cars or the knurled "Drag the wheel" control (or scroll sideways / arrow keys). Bottom right: paint swatches instead of sizes — they repaint the front car and update the price — plus **Reserve**. |
| **Car hero** | Dark hero; the car drives in when the page opens (light streaks, moving lane lines), idles with headlights on, and drives off to the right as you scroll. Colour dots repaint it. |
| Body-type tiles | Dark fill sweeps in, the car drives across with spinning wheels. |
| Stats band | Numbers count up (0–100 time, range, power, warranty). |
| Feature scroll | Sticky picture panel follows the active point. |
| Finance calculator | Pick a car, slide deposit / APR, pick a term — the monthly payment counts to the new value. |
| Car cards | Hover a paint dot to repaint the card's car; the "From" price follows. Reserve adds the car in that paint. |
| Car page | Configurator: the car drives in, paint swatches repaint it, price + monthly estimate update, "Take it for a spin" drives it off and back. |
| Test drive | A car loops along a road under the booking card. |

All cars are **recolourable SVG drawings** (`html/assets/car-art.js`: sedan, electric sedan, sports coupe, SUV,
hatch/wagon, pickup) so any paint colour works instantly. You can use real photos instead — transparent PNG/WebP,
side view, facing right — per car (and per paint, via variant images in Shopify).

Everywhere: header + footer from one config, live search (press `/`), garage drawer (the cart), full-screen mobile
menu, page-transition curtain, preloader, custom cursor with "Drag / Drive / Go" labels, scroll progress, back-to-top
ring, reveal-on-scroll and split headlines, `prefers-reduced-motion` support.

## Pages (HTML version)

| Page | Highlights |
| --- | --- |
| `index.html` | Hero → marquee → **Road Run** → body types → stats → **Showroom wheel** → features → finance calculator → latest arrivals (filter tabs) → test drive |
| `inventory.html` | Body-type tabs, price-limit slider, fuel filter, sort (price, power, 0–100), search (`?q=`), 2/3-column toggle, cards re-flow with FLIP animation, filters kept in the URL (`?c=suv&sort=power`) |
| `car.html?id=…&paint=2` | Configurator with paint pricing, monthly estimate, count-up specs, highlights, related cars, sticky mobile reserve bar |
| `about.html` | Story, values, quote, marquee, call to action |
| `contact.html` | Test-drive / finance / trade-in form with validation and animated success, showroom details, FAQ |
| `404.html` | "Road closed" with a lost car |

### Run it

Double-click `html/index.html`, or serve the folder:

```bash
cd html && python3 -m http.server 8000   # http://localhost:8000
```

The garage (cart) lives in the browser (localStorage). Reserve/checkout, the test-drive form and the newsletter are
front-end only in the static demo — connect them to Shopify, Formspree or Netlify Forms for real use.

## Re-skin for a new client (about 15 minutes)

1. **`html/assets/brand.js`** — name, logo, navigation, utility links, what the cart is called (`cartLabel: 'Garage'`),
   marquee words, contact details, social links, footer columns, newsletter text.
2. **`html/assets/base.css`** (top of file) — colours (`--ink`, `--accent`, `--night` …), fonts (`--font-heading-family`,
   `--heading-stretch`), radius, max width.
3. **`html/assets/data/catalog.js`** — the cars: name, body style, base price, specs, and **paints with their extra
   cost** (`{ name: 'Volt Lime', hex: '#b6dc1f', extra: 2400 }`). Add `image: 'assets/img/cars/x.png'` to use a photo.
4. **Scenery** — `html/assets/img/road/*.svg` (mountains, city, city lights, lamps). Any wide, transparent image that
   tiles sideways works.
5. Homepage copy lives directly in `index.html` (hero, body types, stats, features, finance, test drive).

## Shopify version

Copy into your theme (Online Store → Themes → ⋯ → Edit code, or `shopify theme push`):

- `shopify/sections/*.liquid` → `sections/`
- `shopify/snippets/*.liquid` → `snippets/`
- `shopify/assets/*` → `assets/`

Then **Add section** in the theme editor:

| Section | Notes |
| --- | --- |
| Car road run | One block per car: product, body drawing, optional photo, tagline, specs, paint colours. |
| Car showroom wheel | Same car blocks; paint swatches + Reserve (adds the variant to the cart). |
| Car hero | Heading (`*word*` = italic accent), buttons, car drawing or photo, paint-dot blocks, spec blocks. |
| Car grid | Any collection; filter tabs by product type. |
| Car finance calculator | Cars from a collection; default deposit, terms, APR. |
| Car configurator | For the **product template** — paint swatches, live price, monthly estimate, Reserve. |
| Car body types | Tiles linking to collections, each with a drawing or photo. |
| Car stats · Car features · Car marquee | Count-up numbers · sticky feature scroll · scrolling words. |
| Car test drive | Posts to Shopify's contact form (arrives in the store's contact email). |

**How products map to cars**

- **Paints = the product option named `Color`, `Colour` or `Paint`.** One paint per value; its price is that variant's
  price, so "Volt Lime +$2,400" is simply a pricier variant. Products with other options too (e.g. Trim) use the first
  variant of each colour.
- **Paint colours**: the option's Shopify **swatches** if set; otherwise the block's *Paint colours* text
  (`Volt Lime: #b6dc1f`, one per line); otherwise a guess from the name ("Midnight Blue" → blue).
- **Variant images** (transparent, side view, facing right) replace the drawing per paint.
- Optional **product metafields** (namespace `custom`) used by the grid, finance and configurator sections, and as
  fallbacks for the blocks: `body_style` (sedan / ev / coupe / suv / hatch / pickup), `tagline`, `power`, `accel`,
  `range`, `top_speed`, `paint_colors` (same `Name: #hex` lines), `model_year`, `fuel`.

Reserve posts to `/cart/add.js`, updates the theme's `#cart-icon-bubble` and publishes Dawn's `cartUpdate` event so
Dawn-style cart drawers refresh. Sections scope their styles under `.sx`, so they don't touch the rest of the theme.
Theme Check passes; its only warnings are for the Google Fonts link (remove it from `snippets/car-assets.liquid` to use
the theme's fonts instead).

## Editing the shared code

`html/assets/` is the source of truth. After changing a shared file, copy it into the theme folder:

```bash
./scripts/sync-shopify-assets.sh
```

HTML-only files: `site.css`, `site.js` (shell), `brand.js`, `marquee.js`, `pages.js`, `data/catalog.js`.
