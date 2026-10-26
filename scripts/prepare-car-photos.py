#!/usr/bin/env python3
"""Fit car photos to the site's car frame.

Every car on the site sits in an 8:3 box with the tyres touching the ground at 89% of the
box height (the same frame as the built-in drawings), so photos and drawings can be swapped
without changing any layout.

Input:  transparent PNG/WebP cut-outs, side view, car facing right (any size).
Output: 1600 x 600 WebP files with the car centred, tyres on the ground line.

    python3 scripts/prepare-car-photos.py raw-photos/ html/assets/img/cars/

Needs Pillow (pip install pillow).
"""
import sys
from pathlib import Path
from PIL import Image

W, H = 1600, 600
GROUND = round(H * 214 / 240)      # tyre contact line, as in car-art.js
MAX_W = round(W * 0.92)            # car length inside the frame
MAX_H = round(H * 0.80)


def fit(src: Path, dst: Path) -> None:
    im = Image.open(src).convert('RGBA')
    box = im.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    if not box:
        print(f'skip {src.name}: no transparent background (remove it first)')
        return
    car = im.crop(box)
    scale = min(MAX_W / car.width, MAX_H / car.height)
    car = car.resize((round(car.width * scale), round(car.height * scale)), Image.LANCZOS)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    out.paste(car, ((W - car.width) // 2, GROUND - car.height), car)
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, 'WEBP', quality=88, method=6)
    print(f'{src.name} -> {dst}')


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    for f in sorted(src.iterdir()):
        if f.suffix.lower() in ('.png', '.webp'):
            fit(f, dst / (f.stem + '.webp'))


if __name__ == '__main__':
    main()
