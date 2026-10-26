#!/usr/bin/env sh
# Copy the shared CSS/JS (and road scenery) from the HTML site into the Shopify theme folder.
# html/assets is the source of truth; run this after editing any of these files.
set -e
cd "$(dirname "$0")/.."
for f in base.css motion.css motion.js sections.css sections.js \
         car-art.js site-cart.js \
         car-hero.css car-hero.js \
         road-run.css road-run.js \
         car-orbit.css car-orbit.js \
         car-card.js car-sections.css car-sections.js \
         car-config.js pages.css; do
  cp "html/assets/$f" "shopify/assets/$f"
done
# Shopify assets are flat: img/road/city.svg → road-city.svg
for f in html/assets/img/road/*.svg; do
  cp "$f" "shopify/assets/road-$(basename "$f")"
done
echo "Synced $(ls shopify/assets | wc -l | tr -d ' ') files to shopify/assets"
