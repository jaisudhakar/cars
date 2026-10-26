# Car cut-outs

The animations use cut-out photos (background, remote, cones and tyres removed) so each car can drive on
the track. They are made from the original photos in `html/assets/img/products/`. Run from the repository root:

```bash
python3 -m venv .venv && .venv/bin/pip install "rembg[cpu]" scipy pillow
.venv/bin/python scripts/cutouts/cut_sam.py                       # all products (or pass product ids / file names)
.venv/bin/python scripts/cutouts/cut_crop.py isnet-general-use    # second method for the hard photos
.venv/bin/python scripts/cutouts/fit_to_frame.py                  # -> html/assets/img/cutouts/*.webp
```

- `cut_sam.py` — Segment Anything with a box around the car and "not the car" points on the remote.
  `BOX` holds one box per product scene; `FIX` holds per-photo corrections.
- `cut_crop.py` — for small or dark cars: crops tightly around the car and runs a salient-object model.
  (The Fang excavator's tracks were merged back in from the `cut_sam.py` result by hand.)
- `fit_to_frame.py` — places every cut-out in a 1600×600 frame with the tyres on the same ground line,
  so all cars line up on the road.
- `face.json` — photos where the car faces left; those cars drive in from the right.

The first run downloads the models (about 380 MB).
