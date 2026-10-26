# L.O.T Cars — animated RC car store (HTML site + Shopify sections)

A scroll-animated storefront for an RC car shop, built on the same framework as
[`shopify-theme-viral`](https://github.com/jaisudhakar/shopify-theme-viral) (shared motion helpers, site shell,
cart and section pattern), delivered two ways from the same CSS/JS:

| Folder | What it is |
| --- | --- |
| `html/` | Static multi-page site with the client's product photos. Open `html/index.html` — no build step. |
| `shopify/` | Theme sections + snippets + assets to drop into any Shopify theme (Dawn or similar). |
| `reference/` | The "drag the wheel" design reference the Garage wheel is based on. |

All product imagery is the client's own photos (`html/assets/img/products/`, one photo per colour,
82 photos for 25 products). **Prices in `html/assets/data/catalog.js` are demo values** — replace them with the
real prices, or use the Shopify sections, which read prices from the store.

## The animations

| Section | What happens |
| --- | --- |
| **Road Run** (signature) | A pinned neon night track. As you scroll, each product photo drives in from the left (it leans into the motion and leaves light streaks), parks in front of you, then drives off as the next one arrives. While parked it shows name, tagline, price, highlights and its **colours** — pick one and the photo swaps to that colour (and the price follows if colours are priced differently). The neon light tubes, glow and price underline take the colour you pick; the kerb and lane lines slide past; a speedometer follows your scroll speed. A list on the right jumps to any car. |
| **Garage wheel** | The interaction from `reference/showroom-wheel-reference.png`: product photos ride a big arc, drag them or the knurled "Drag the wheel" control (or scroll sideways / arrow keys). Colour swatches swap the front photo; **Add to cart**. |
| **Hero** | The Ghost Drift photo drives in when the page opens and drives off as you scroll; ten colour dots swap between its ten liveries. |
| Category tiles | Photo tiles; a colour fill sweeps in and the photo zooms on hover. |
| Stats band | Counts up the real numbers from the catalog (models, colourways, drift cars, off-road). |
| Feature scroll | Sticky photo panel follows the active point. |
| Product cards | Hover a colour dot to see that colour's photo; Add to cart. |
| Product page | Large photo stage: colour swatches swap the photo, "Take it for a spin" slides it off and back. |
| Help band | Callback form with a looping strip of every product photo. |

Everywhere: header + footer from one config, live search (press `/`, also matches colour names), cart drawer,
full-screen mobile menu, page-transition curtain, preloader, custom cursor with "Drag / Drive / Shop" labels,
scroll progress, back-to-top ring, reveal-on-scroll and split headlines, `prefers-reduced-motion` support.

## Pages (HTML version)

| Page | Highlights |
| --- | --- |
| `index.html` | Hero → marquee → **Road Run** → categories → stats → **Garage wheel** → features → new drops (filter tabs) → help band |
| `inventory.html` | Category tabs, price-limit slider, sort (price, most colours, name), search (`?q=`), 2/3-column toggle, FLIP re-flow, filters kept in the URL (`?c=drift&sort=price-asc`) |
| `car.html?id=ghost&paint=5` | Product page with colour swatches, highlights, related products, sticky mobile add-to-cart bar |
| `about.html` | Story (placeholder text for the client to replace), values, marquee, call to action |
| `contact.html` | Message form with validation and animated success, store details, FAQ (replace answers with real policies) |
| `404.html` | "Track closed" |

### Run it

Double-click `html/index.html`, or serve the folder:

```bash
cd html && python3 -m http.server 8000   # http://localhost:8000
```

The cart lives in the browser (localStorage). Checkout and the forms are front-end only in the static demo —
connect them to Shopify, Formspree or Netlify Forms for real use.

## Update products, prices and branding

1. **`html/assets/data/catalog.js`** — products: name, category, price, tagline, description, highlights and colours
   (`{ name, hex, extra, image }` — `extra` adds to the base price for that colour).
2. **`html/assets/img/products/`** — product photos (square works best; one per colour).
3. **`html/assets/brand.js`** — store name, navigation, contact details, social links, footer, newsletter text.
4. **`html/assets/base.css`** (top of file) — colours and fonts.
5. Homepage copy lives directly in `index.html`.

The site can also run with built-in car drawings instead of photos (leave out `image`), but this client version
uses photos only.

## Shopify version

Copy into your theme (Online Store → Themes → ⋯ → Edit code, or `shopify theme push`):

- `shopify/sections/*.liquid` → `sections/`
- `shopify/snippets/*.liquid` → `snippets/`
- `shopify/assets/*` → `assets/`

Then **Add section** in the theme editor:

| Section | Notes |
| --- | --- |
| Car road run | Scene: neon night track (default) or city. One block per product; photos come from the product and its variant images. |
| Car showroom wheel | Same product blocks; colour swatches + Add to cart (adds the variant to the cart). |
| Car hero | Heading (`*word*` = italic accent), buttons, colour-dot blocks each with their own photo, spec blocks. |
| Car grid | Any collection; filter tabs by product type. |
| Car finance calculator | Cars from a collection; default deposit, terms, APR. |
| Car configurator | For the **product template** — paint swatches, live price, monthly estimate, Reserve. |
| Car body types | Tiles linking to collections, each with a drawing or photo. |
| Car stats · Car features · Car marquee | Count-up numbers · sticky feature scroll · scrolling words. |
| Car test drive | Callback / question form that posts to Shopify's contact form, with a strip of product photos. |

**How products map to cars**

- **Colours = the product option named `Color`, `Colour` or `Paint`.** One swatch per value; its photo is that
  variant's image and its price is that variant's price. Products with other options too use the first variant of
  each colour.
- **Swatch colours**: the option's Shopify **swatches** if set; otherwise the block's *Swatch colours* text
  (`Burnout Red: #b3121c`, one per line); otherwise a guess from the name ("Ocean Blue" → blue).
- **Photos**: the product's featured image, and each variant's image per colour. A built-in drawing is only used for a
  product with no photo at all.
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
