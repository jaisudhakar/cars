/* Product catalog for the static site (home sections, shop, product pages, search).
 * Cut-out photos (background removed, framed for the road) are in assets/img/cutouts/; the original
 * scene photos are in assets/img/products/ and appear as "In the box" on the product page.
 * cutout: true tells the animations these are transparent cars; face: 'left' makes the car drive in
 * from the right (it faces left in the photo).
 *
 * Each product: id, name, category, price (base price), tagline, description, details (feature chips)
 * and paints (colours): { name, hex (swatch colour), extra (price on top of the base), image (cut-out), photo (original) }.
 * Prices are DEMO values — replace them with the client's real prices (or use the Shopify sections,
 * which read prices from the store).
 *
 * The bottom of the file turns colours into the same options/variants shape Shopify uses,
 * so every section works the same way with this file or with Shopify products. */
window.CATEGORIES = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "drift",
    "label": "Drift cars"
  },
  {
    "id": "offroad",
    "label": "Off-road & 4x4"
  },
  {
    "id": "mini",
    "label": "Mini racers"
  },
  {
    "id": "construction",
    "label": "Construction"
  },
  {
    "id": "trucks",
    "label": "Trucks & buses"
  }
];

window.CARS = [
  {
    "id": "ghost",
    "cutout": true,
    "face": "left",
    "name": "Ghost Drift",
    "tagline": "Ten liveries. One sideways attitude.",
    "category": "drift",
    "price": 3499,
    "badge": "Bestseller",
    "description": "A drift car with LED underglow, drift tyres and ten race liveries — from street classics to rally and underground looks.",
    "details": [
      "LED underglow",
      "Drift tyres",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Burnout Red",
        "hex": "#b3121c",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-burnout-red.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-burnout-red.webp"
      },
      {
        "name": "Burnout Yellow",
        "hex": "#f2c21b",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-burnout-yellow.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-burnout-yellow.webp"
      },
      {
        "name": "Rally Green",
        "hex": "#3fa34d",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-rally-green.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-rally-green.webp"
      },
      {
        "name": "Rally Purple",
        "hex": "#7b3fc4",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-rally-purple.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-rally-purple.webp"
      },
      {
        "name": "Street Blue",
        "hex": "#1f5fd1",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-street-blue.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-street-blue.webp"
      },
      {
        "name": "Street Classic Red",
        "hex": "#c9302c",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-street-classic-red.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-street-classic-red.webp"
      },
      {
        "name": "Street Classic White",
        "hex": "#f0f0ee",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-street-classic-white.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-street-classic-white.webp"
      },
      {
        "name": "Street White",
        "hex": "#eef0f2",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-street-white.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-street-white.webp"
      },
      {
        "name": "Underground Black",
        "hex": "#16181b",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-underground-black.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-underground-black.webp"
      },
      {
        "name": "Underground White",
        "hex": "#eceef0",
        "extra": 0,
        "image": "assets/img/cutouts/ghost-rc-drift-car-underground-white.webp",
        "photo": "assets/img/products/ghost-rc-drift-car-underground-white.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "flare-1",
    "cutout": true,
    "face": "left",
    "name": "Flare 1 Drift",
    "tagline": "Retro street drifter.",
    "category": "drift",
    "price": 2999,
    "badge": "New",
    "description": "A retro-styled street drift car with working headlights, spare drift tyres and cones in the box for your first drift course.",
    "details": [
      "Working headlights",
      "Drift tyres",
      "Cones in the box"
    ],
    "paints": [
      {
        "name": "Street Red",
        "hex": "#c8202a",
        "extra": 0,
        "image": "assets/img/cutouts/flare-1-rc-drift-car-street-red.webp",
        "photo": "assets/img/products/flare-1-rc-drift-car-street-red.webp"
      },
      {
        "name": "Street White",
        "hex": "#eef0f2",
        "extra": 0,
        "image": "assets/img/cutouts/flare-1-rc-drift-car-street-white.webp",
        "photo": "assets/img/products/flare-1-rc-drift-car-street-white.webp"
      },
      {
        "name": "Track Pink",
        "hex": "#ef7e8f",
        "extra": 0,
        "image": "assets/img/cutouts/flare-1-rc-drift-car-track-pink.webp",
        "photo": "assets/img/products/flare-1-rc-drift-car-track-pink.webp"
      },
      {
        "name": "Track White",
        "hex": "#f2f2f2",
        "extra": 0,
        "image": "assets/img/cutouts/flare-1-rc-drift-car-track-white.webp",
        "photo": "assets/img/products/flare-1-rc-drift-car-track-white.webp"
      },
      {
        "name": "Underground Blue",
        "hex": "#2a7fd6",
        "extra": 0,
        "image": "assets/img/cutouts/flare-1-rc-drift-car-underground-blue.webp",
        "photo": "assets/img/products/flare-1-rc-drift-car-underground-blue.webp"
      },
      {
        "name": "Underground Silver",
        "hex": "#b9bdc3",
        "extra": 0,
        "image": "assets/img/cutouts/flare-1-rc-drift-car-underground-silver.webp",
        "photo": "assets/img/products/flare-1-rc-drift-car-underground-silver.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "flare-2",
    "cutout": true,
    "face": "left",
    "name": "Flare 2 Drift",
    "tagline": "Wide body. Big glow.",
    "category": "drift",
    "price": 3299,
    "description": "A wide-body drift car with neon underglow and burnout or race finishes.",
    "details": [
      "Neon underglow",
      "Wide body",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Burnout Green",
        "hex": "#4f6b3f",
        "extra": 0,
        "image": "assets/img/cutouts/flare-2-rc-drift-car-burnout-green.webp",
        "photo": "assets/img/products/flare-2-rc-drift-car-burnout-green.webp"
      },
      {
        "name": "Burnout Grey",
        "hex": "#7a7f86",
        "extra": 0,
        "image": "assets/img/cutouts/flare-2-rc-drift-car-burnout-grey.webp",
        "photo": "assets/img/products/flare-2-rc-drift-car-burnout-grey.webp"
      },
      {
        "name": "Burnout Red",
        "hex": "#b3121c",
        "extra": 0,
        "image": "assets/img/cutouts/flare-2-rc-drift-car-burnout-red.webp",
        "photo": "assets/img/products/flare-2-rc-drift-car-burnout-red.webp"
      },
      {
        "name": "Race Black",
        "hex": "#1a1b1e",
        "extra": 0,
        "image": "assets/img/cutouts/flare-2-rc-drift-car-race-black.webp",
        "photo": "assets/img/products/flare-2-rc-drift-car-race-black.webp"
      },
      {
        "name": "Race Grey",
        "hex": "#8a8f96",
        "extra": 0,
        "image": "assets/img/cutouts/flare-2-rc-drift-car-race-grey.webp",
        "photo": "assets/img/products/flare-2-rc-drift-car-race-grey.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "shadow",
    "cutout": true,
    "face": "right",
    "name": "Shadow Drift",
    "tagline": "Muscle-car drifts.",
    "category": "drift",
    "price": 3199,
    "description": "A muscle-car drift machine in asphalt and tarmac finishes, with lights and spare tyres.",
    "details": [
      "Working lights",
      "Spare tyres",
      "Cones in the box"
    ],
    "paints": [
      {
        "name": "Asphalt Black",
        "hex": "#16181b",
        "extra": 0,
        "image": "assets/img/cutouts/shadow-rc-drift-car-asphalt-black.webp",
        "photo": "assets/img/products/shadow-rc-drift-car-asphalt-black.webp"
      },
      {
        "name": "Asphalt Green",
        "hex": "#b6e01f",
        "extra": 0,
        "image": "assets/img/cutouts/shadow-rc-drift-car-asphalt-green.webp",
        "photo": "assets/img/products/shadow-rc-drift-car-asphalt-green.webp"
      },
      {
        "name": "Asphalt Silver",
        "hex": "#c3c7cc",
        "extra": 0,
        "image": "assets/img/cutouts/shadow-rc-drift-car-asphalt-silver.webp",
        "photo": "assets/img/products/shadow-rc-drift-car-asphalt-silver.webp"
      },
      {
        "name": "Tarmac Black",
        "hex": "#16181b",
        "extra": 0,
        "image": "assets/img/cutouts/shadow-rc-drift-car-tarmac-black.webp",
        "photo": "assets/img/products/shadow-rc-drift-car-tarmac-black.webp"
      },
      {
        "name": "Tarmac Purple",
        "hex": "#7a4fc0",
        "extra": 0,
        "image": "assets/img/cutouts/shadow-rc-drift-car-tarmac-purple.webp",
        "photo": "assets/img/products/shadow-rc-drift-car-tarmac-purple.webp"
      },
      {
        "name": "Tarmac Red",
        "hex": "#d03a2a",
        "extra": 0,
        "image": "assets/img/cutouts/shadow-rc-drift-car-tarmac-red.webp",
        "photo": "assets/img/products/shadow-rc-drift-car-tarmac-red.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "night-wolf",
    "cutout": true,
    "face": "right",
    "name": "Night Wolf Drift",
    "tagline": "Art-car liveries after dark.",
    "category": "drift",
    "price": 3599,
    "description": "A street-art livery drift car with bright LED lights for night sessions.",
    "details": [
      "Art livery",
      "LED lights",
      "Spare tyres"
    ],
    "paints": [
      {
        "name": "Hammer Green",
        "hex": "#3c8d3a",
        "extra": 0,
        "image": "assets/img/cutouts/night-wolf-rc-drift-car-hammer-green.webp",
        "photo": "assets/img/products/night-wolf-rc-drift-car-hammer-green.webp"
      },
      {
        "name": "Hammer Red",
        "hex": "#d7262b",
        "extra": 0,
        "image": "assets/img/cutouts/night-wolf-rc-drift-car-hammer-red.webp",
        "photo": "assets/img/products/night-wolf-rc-drift-car-hammer-red.webp"
      },
      {
        "name": "Underground Blue",
        "hex": "#2a7fd6",
        "extra": 0,
        "image": "assets/img/cutouts/night-wolf-rc-drift-car-underground-blue.webp",
        "photo": "assets/img/products/night-wolf-rc-drift-car-underground-blue.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "vortex",
    "cutout": true,
    "face": "right",
    "name": "Vortex Overdrive",
    "tagline": "Pop-up lights, pure 90s.",
    "category": "drift",
    "price": 3799,
    "description": "A 90s-style sports drift car with underglow and spare wheels.",
    "details": [
      "Underglow",
      "Spare wheels",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Grey",
        "hex": "#8d9399",
        "extra": 0,
        "image": "assets/img/cutouts/vortex-overdrive-grey.webp",
        "photo": "assets/img/products/vortex-overdrive-grey.webp"
      },
      {
        "name": "Yellow",
        "hex": "#f2c21b",
        "extra": 0,
        "image": "assets/img/cutouts/vortex-overdrive-yellow.webp",
        "photo": "assets/img/products/vortex-overdrive-yellow.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "flare-legends",
    "cutout": true,
    "face": "right",
    "name": "Flare Legends Edition",
    "tagline": "Built-in gyro for clean slides.",
    "category": "drift",
    "price": 6999,
    "badge": "Pro",
    "description": "The top drift car in the range: a built-in gyroscope keeps every slide controlled, with a pro-style pistol remote.",
    "details": [
      "Gyroscope",
      "Pro remote",
      "Drift tyres"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/flare-legends-edition-rc-drift-car-with-gyroscope-default-title.webp",
        "photo": "assets/img/products/flare-legends-edition-rc-drift-car-with-gyroscope-default-title.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "bhoot",
    "cutout": true,
    "face": "right",
    "name": "Bhoot",
    "tagline": "Smoke, glow and a ghost of a slide.",
    "category": "drift",
    "price": 3999,
    "badge": "L.O.T Original",
    "description": "An L.O.T Cars original drift car in underground finishes, with underglow and spare wheels.",
    "details": [
      "Underglow",
      "Spare wheels",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Underground Black",
        "hex": "#16181b",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-bhoot-underground-black.webp",
        "photo": "assets/img/products/l-o-t-cars-bhoot-underground-black.webp"
      },
      {
        "name": "Underground Blue",
        "hex": "#2a7fd6",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-bhoot-underground-blue.webp",
        "photo": "assets/img/products/l-o-t-cars-bhoot-underground-blue.webp"
      },
      {
        "name": "Underground Green",
        "hex": "#14a37f",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-bhoot-underground-green.webp",
        "photo": "assets/img/products/l-o-t-cars-bhoot-underground-green.webp"
      },
      {
        "name": "Underground Grey",
        "hex": "#9aa0a6",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-bhoot-underground-grey.webp",
        "photo": "assets/img/products/l-o-t-cars-bhoot-underground-grey.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "blitz",
    "cutout": true,
    "face": "right",
    "name": "Blitz",
    "tagline": "Rally colours, drift soul.",
    "category": "drift",
    "price": 3999,
    "badge": "L.O.T Original",
    "description": "An L.O.T Cars original rally-livery drift car with spare tyres and cones.",
    "details": [
      "Rally livery",
      "Spare tyres",
      "Cones in the box"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-blitz-default-title.webp",
        "photo": "assets/img/products/l-o-t-cars-blitz-default-title.webp"
      }
    ],
    "categoryLabel": "RC drift car"
  },
  {
    "id": "zip",
    "cutout": true,
    "face": "right",
    "name": "Zip",
    "tagline": "Classic hatch, pocket size.",
    "category": "mini",
    "price": 2499,
    "badge": "L.O.T Original",
    "description": "A classic hot-hatch in four colours — small enough for the living room, quick enough for the driveway.",
    "details": [
      "Compact size",
      "Working lights",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Black",
        "hex": "#15171a",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-zip-black.webp",
        "photo": "assets/img/products/l-o-t-cars-zip-black.webp"
      },
      {
        "name": "Green",
        "hex": "#2f8f4e",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-zip-green.webp",
        "photo": "assets/img/products/l-o-t-cars-zip-green.webp"
      },
      {
        "name": "Grey",
        "hex": "#8d9399",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-zip-grey.webp",
        "photo": "assets/img/products/l-o-t-cars-zip-grey.webp"
      },
      {
        "name": "Purple",
        "hex": "#5a3fb0",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-zip-purple.webp",
        "photo": "assets/img/products/l-o-t-cars-zip-purple.webp"
      }
    ],
    "categoryLabel": "Mini RC car"
  },
  {
    "id": "dash-mini",
    "cutout": true,
    "face": "right",
    "name": "Dash Mini",
    "tagline": "Desk-sized racer.",
    "category": "mini",
    "price": 1499,
    "description": "A tiny racer with a pistol remote and cones — perfect for tabletop tracks.",
    "details": [
      "Tabletop size",
      "Pistol remote",
      "Cones in the box"
    ],
    "paints": [
      {
        "name": "Black",
        "hex": "#15171a",
        "extra": 0,
        "image": "assets/img/cutouts/dash-mini-rc-car-black.webp",
        "photo": "assets/img/products/dash-mini-rc-car-black.webp"
      },
      {
        "name": "Green",
        "hex": "#2f8f4e",
        "extra": 0,
        "image": "assets/img/cutouts/dash-mini-rc-car-green.webp",
        "photo": "assets/img/products/dash-mini-rc-car-green.webp"
      },
      {
        "name": "Silver",
        "hex": "#c3c7cc",
        "extra": 0,
        "image": "assets/img/cutouts/dash-mini-rc-car-silver.webp",
        "photo": "assets/img/products/dash-mini-rc-car-silver.webp"
      },
      {
        "name": "Street White",
        "hex": "#eef0f2",
        "extra": 0,
        "image": "assets/img/cutouts/dash-mini-rc-car-street-white.webp",
        "photo": "assets/img/products/dash-mini-rc-car-street-white.webp"
      }
    ],
    "categoryLabel": "Mini RC car"
  },
  {
    "id": "nitro-mini",
    "cutout": true,
    "face": "right",
    "name": "Nitro Mini",
    "tagline": "Mini muscle with lights.",
    "category": "mini",
    "price": 1799,
    "description": "A mini muscle car with headlights, a drift circle and five colours.",
    "details": [
      "Working lights",
      "Mini size",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Race Blue",
        "hex": "#2a5fd0",
        "extra": 0,
        "image": "assets/img/cutouts/nitro-mini-rc-car-race-blue.webp",
        "photo": "assets/img/products/nitro-mini-rc-car-race-blue.webp"
      },
      {
        "name": "Race Grey",
        "hex": "#8a8f96",
        "extra": 0,
        "image": "assets/img/cutouts/nitro-mini-rc-car-race-grey.webp",
        "photo": "assets/img/products/nitro-mini-rc-car-race-grey.webp"
      },
      {
        "name": "Tarmac Black",
        "hex": "#16181b",
        "extra": 0,
        "image": "assets/img/cutouts/nitro-mini-rc-car-tarmac-black.webp",
        "photo": "assets/img/products/nitro-mini-rc-car-tarmac-black.webp"
      },
      {
        "name": "Tarmac Green",
        "hex": "#5f7d4f",
        "extra": 0,
        "image": "assets/img/cutouts/nitro-mini-rc-car-tarmac-green.webp",
        "photo": "assets/img/products/nitro-mini-rc-car-tarmac-green.webp"
      },
      {
        "name": "Tarmac Grey",
        "hex": "#8a8f96",
        "extra": 0,
        "image": "assets/img/cutouts/nitro-mini-rc-car-tarmac-grey.webp",
        "photo": "assets/img/products/nitro-mini-rc-car-tarmac-grey.webp"
      }
    ],
    "categoryLabel": "Mini RC car"
  },
  {
    "id": "gator-hammer",
    "cutout": true,
    "face": "right",
    "name": "Gator Hammer",
    "tagline": "Big tyres. No roads needed.",
    "category": "offroad",
    "price": 4499,
    "badge": "L.O.T Original",
    "description": "An L.O.T Cars original off-road 4x4 with chunky tyres and LED light bar.",
    "details": [
      "Big tyres",
      "LED light bar",
      "Off-road"
    ],
    "paints": [
      {
        "name": "Black",
        "hex": "#15171a",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-hammer-black.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-hammer-black.webp"
      },
      {
        "name": "Green",
        "hex": "#2f8f4e",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-hammer-green.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-hammer-green.webp"
      },
      {
        "name": "Orange",
        "hex": "#f06a1d",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-hammer-orange.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-hammer-orange.webp"
      },
      {
        "name": "Red",
        "hex": "#c8202a",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-hammer-red.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-hammer-red.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "gator-marsh",
    "cutout": true,
    "face": "right",
    "name": "Gator Marsh",
    "tagline": "Pickup grip for any terrain.",
    "category": "offroad",
    "price": 4299,
    "badge": "L.O.T Original",
    "description": "An off-road pickup with high clearance and LED lights, in four colours.",
    "details": [
      "High clearance",
      "LED lights",
      "Off-road"
    ],
    "paints": [
      {
        "name": "Black",
        "hex": "#15171a",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-marsh-black.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-marsh-black.webp"
      },
      {
        "name": "Green",
        "hex": "#2f8f4e",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-marsh-green.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-marsh-green.webp"
      },
      {
        "name": "Orange",
        "hex": "#f06a1d",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-marsh-orange.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-marsh-orange.webp"
      },
      {
        "name": "Red",
        "hex": "#c8202a",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-gator-marsh-red.webp",
        "photo": "assets/img/products/l-o-t-cars-gator-marsh-red.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "roxie",
    "cutout": true,
    "face": "right",
    "name": "Roxie",
    "tagline": "Crawl over anything.",
    "category": "offroad",
    "price": 5499,
    "badge": "L.O.T Original",
    "description": "A rock-crawling 4x4 in Explorer and Navigate editions.",
    "details": [
      "Crawler",
      "Detailed body",
      "Off-road"
    ],
    "paints": [
      {
        "name": "Explorer Aqua",
        "hex": "#1fb5b0",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-roxie-explorer-aqua.webp",
        "photo": "assets/img/products/l-o-t-cars-roxie-explorer-aqua.webp"
      },
      {
        "name": "Explorer Yellow",
        "hex": "#f2c21b",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-roxie-explorer-yellow.webp",
        "photo": "assets/img/products/l-o-t-cars-roxie-explorer-yellow.webp"
      },
      {
        "name": "Navigate Blue",
        "hex": "#1e56c8",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-roxie-navigate-blue.webp",
        "photo": "assets/img/products/l-o-t-cars-roxie-navigate-blue.webp"
      },
      {
        "name": "Navigate Red",
        "hex": "#c7262b",
        "extra": 0,
        "image": "assets/img/cutouts/l-o-t-cars-roxie-navigate-red.webp",
        "photo": "assets/img/products/l-o-t-cars-roxie-navigate-red.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "knox",
    "cutout": true,
    "face": "left",
    "name": "Knox Off-Road Truck",
    "tagline": "Desert-ready monster truck.",
    "category": "offroad",
    "price": 4999,
    "description": "A monster truck in Adventure and Explorer editions with roof lights and a dual-stick remote.",
    "details": [
      "Monster tyres",
      "Roof lights",
      "Dual-stick remote"
    ],
    "paints": [
      {
        "name": "Adventure Black",
        "hex": "#1b1c1e",
        "extra": 0,
        "image": "assets/img/cutouts/knox-off-road-rc-truck-adventure-black.webp",
        "photo": "assets/img/products/knox-off-road-rc-truck-adventure-black.webp"
      },
      {
        "name": "Adventure Green",
        "hex": "#4f9a3a",
        "extra": 0,
        "image": "assets/img/cutouts/knox-off-road-rc-truck-adventure-green.webp",
        "photo": "assets/img/products/knox-off-road-rc-truck-adventure-green.webp"
      },
      {
        "name": "Adventure Red",
        "hex": "#d22a22",
        "extra": 0,
        "image": "assets/img/cutouts/knox-off-road-rc-truck-adventure-red.webp",
        "photo": "assets/img/products/knox-off-road-rc-truck-adventure-red.webp"
      },
      {
        "name": "Explorer Black",
        "hex": "#202124",
        "extra": 0,
        "image": "assets/img/cutouts/knox-off-road-rc-truck-explorer-black.webp",
        "photo": "assets/img/products/knox-off-road-rc-truck-explorer-black.webp"
      },
      {
        "name": "Explorer Blue",
        "hex": "#2257c9",
        "extra": 0,
        "image": "assets/img/cutouts/knox-off-road-rc-truck-explorer-blue.webp",
        "photo": "assets/img/products/knox-off-road-rc-truck-explorer-blue.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "bumble",
    "cutout": true,
    "face": "right",
    "name": "Bumble Off-Road",
    "tagline": "First off-roader for kids.",
    "category": "offroad",
    "price": 2499,
    "description": "A tough, kid-friendly off-road buggy with a USB charging cable.",
    "details": [
      "Kid friendly",
      "USB charging",
      "Off-road"
    ],
    "paints": [
      {
        "name": "Forest Green",
        "hex": "#2e7d32",
        "extra": 0,
        "image": "assets/img/cutouts/bumble-off-road-rc-car-forest-green.webp",
        "photo": "assets/img/products/bumble-off-road-rc-car-forest-green.webp"
      },
      {
        "name": "Hunter Green",
        "hex": "#355e3b",
        "extra": 0,
        "image": "assets/img/cutouts/bumble-off-road-rc-car-hunter-green.webp",
        "photo": "assets/img/products/bumble-off-road-rc-car-hunter-green.webp"
      },
      {
        "name": "Ocean Blue",
        "hex": "#1f6fd1",
        "extra": 0,
        "image": "assets/img/cutouts/bumble-off-road-rc-car-ocean-blue.webp",
        "photo": "assets/img/products/bumble-off-road-rc-car-ocean-blue.webp"
      },
      {
        "name": "SUV Purple",
        "hex": "#5b4bb7",
        "extra": 0,
        "image": "assets/img/cutouts/bumble-off-road-rc-car-suv-purple.webp",
        "photo": "assets/img/products/bumble-off-road-rc-car-suv-purple.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "apex",
    "cutout": true,
    "face": "right",
    "name": "Apex 4x4",
    "tagline": "4x4 basher with neon style.",
    "category": "offroad",
    "price": 5999,
    "description": "A 4x4 monster truck with neon graphics, built to jump and bash.",
    "details": [
      "4x4",
      "Big tyres",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/apex-4x4-rc-car-default-title.webp",
        "photo": "assets/img/products/apex-4x4-rc-car-default-title.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "doughty",
    "cutout": true,
    "face": "right",
    "name": "Doughty 4x4",
    "tagline": "Bold graphics, big tyres.",
    "category": "offroad",
    "price": 5999,
    "description": "A 4x4 monster truck with bold graphics and chunky tyres.",
    "details": [
      "4x4",
      "Big tyres",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/doughty-4x4-rc-car-default-title.webp",
        "photo": "assets/img/products/doughty-4x4-rc-car-default-title.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "gazer",
    "cutout": true,
    "face": "right",
    "name": "Gazer 4x4",
    "tagline": "Neon-graphics 4x4.",
    "category": "offroad",
    "price": 5799,
    "description": "A 4x4 basher with neon graphics and big tyres.",
    "details": [
      "4x4",
      "Big tyres",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/gazer-4x4-rc-car-default-title.webp",
        "photo": "assets/img/products/gazer-4x4-rc-car-default-title.webp"
      }
    ],
    "categoryLabel": "Off-road RC"
  },
  {
    "id": "fang",
    "cutout": true,
    "face": "right",
    "name": "Fang Excavator",
    "tagline": "Dig, swing, repeat.",
    "category": "construction",
    "price": 4999,
    "description": "A remote-control excavator that lifts and digs.",
    "details": [
      "Working arm",
      "Tracks",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/fang-rc-excavator-default-title.webp",
        "photo": "assets/img/products/fang-rc-excavator-default-title.webp"
      }
    ],
    "categoryLabel": "RC construction"
  },
  {
    "id": "rift",
    "cutout": true,
    "face": "right",
    "name": "Rift Excavator",
    "tagline": "Heavy-duty digger.",
    "category": "construction",
    "price": 5499,
    "description": "A heavy-duty RC excavator for building-site play.",
    "details": [
      "Working arm",
      "Tracks",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/rift-default-title.webp",
        "photo": "assets/img/products/rift-default-title.webp"
      }
    ],
    "categoryLabel": "RC construction"
  },
  {
    "id": "rumble",
    "cutout": true,
    "face": "right",
    "name": "Rumble Dump Truck",
    "tagline": "Load it, tip it.",
    "category": "construction",
    "price": 3999,
    "description": "An RC dump truck with a tipping bed for sandpit missions.",
    "details": [
      "Tipping bed",
      "Big wheels",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Standard",
        "hex": "#888c92",
        "extra": 0,
        "image": "assets/img/cutouts/rumble-default-title.webp",
        "photo": "assets/img/products/rumble-default-title.webp"
      }
    ],
    "categoryLabel": "RC construction"
  },
  {
    "id": "mac",
    "cutout": true,
    "face": "left",
    "name": "Mac Truck",
    "tagline": "Big rig, small scale.",
    "category": "trucks",
    "price": 3499,
    "description": "An RC semi-truck cab with working lights.",
    "details": [
      "Working lights",
      "Truck cab",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Gray",
        "hex": "#8d9399",
        "extra": 0,
        "image": "assets/img/cutouts/mac-gray.webp",
        "photo": "assets/img/products/mac-gray.webp"
      },
      {
        "name": "Red",
        "hex": "#c8202a",
        "extra": 0,
        "image": "assets/img/cutouts/mac-red.webp",
        "photo": "assets/img/products/mac-red.webp"
      }
    ],
    "categoryLabel": "RC truck"
  },
  {
    "id": "vera",
    "cutout": true,
    "face": "right",
    "name": "Vera Bus",
    "tagline": "Road-trip van vibes.",
    "category": "trucks",
    "price": 2299,
    "description": "A retro camper bus in orange and graffiti-blue.",
    "details": [
      "Retro van",
      "USB charging",
      "Remote included"
    ],
    "paints": [
      {
        "name": "Hammer Orange",
        "hex": "#f0861e",
        "extra": 0,
        "image": "assets/img/cutouts/vera-rc-bus-hammer-orange.webp",
        "photo": "assets/img/products/vera-rc-bus-hammer-orange.webp"
      },
      {
        "name": "Underground Blue",
        "hex": "#2a7fd6",
        "extra": 0,
        "image": "assets/img/cutouts/vera-rc-bus-underground-blue.webp",
        "photo": "assets/img/products/vera-rc-bus-underground-blue.webp"
      }
    ],
    "categoryLabel": "RC truck"
  }
];

/* ---------- build Shopify-style fields (no need to edit below) ---------- */
(function () {
  var cur = document.documentElement.getAttribute('data-currency') || 'INR';
  function money(n) {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n); }
    catch (e) { return '\u20b9' + Math.round(n).toLocaleString('en-IN'); }
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
    c.image = c.paints[0].image;
    c.options = [{ name: 'Colour', values: c.paints.map(function (p) { return p.name; }) }];
    c.variants = c.paints.map(function (p) { return { id: p.id, av: p.av, price: p.price, opts: [p.name] }; });
    c.images = c.paints.map(function (p) { return p.image; });
  });
  window.CATALOG = window.CARS;
  window.CarMoney = money;
})();
