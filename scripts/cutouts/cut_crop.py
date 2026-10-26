# Second method for hard photos: crop tightly around the car, run a salient-object model on the crop.
import sys, numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy import ndimage
SRC = 'html/assets/img/products'
JOBS = {  # file -> crop box (fractions) and model
 'dash-mini-rc-car-black.webp': [.17,.53,.61,.80],
 'dash-mini-rc-car-green.webp': [.17,.54,.60,.80],
 'dash-mini-rc-car-silver.webp': [.17,.54,.60,.81],
 'fang-rc-excavator-default-title.webp': [.10,.06,.86,.73],
 'shadow-rc-drift-car-tarmac-purple.webp': [.13,.47,.83,.81],
}
import os; os.makedirs('scripts/cutouts/raw', exist_ok=True)
model = sys.argv[1] if len(sys.argv) > 1 else 'isnet-general-use'
sess = new_session(model)
only = sys.argv[2:]
for f, b in JOBS.items():
    if only and f not in only: continue
    im = Image.open(f'{SRC}/{f}').convert('RGB'); W, H = im.size
    box = (int(b[0]*W), int(b[1]*H), int(b[2]*W), int(b[3]*H))
    crop = im.crop(box)
    m = np.array(remove(crop, session=sess, only_mask=True)) > 110
    lab, n = ndimage.label(m)
    if n > 1:
        sizes = ndimage.sum(m, lab, range(1, n + 1)); m = lab == (np.argmax(sizes) + 1)
    m = ndimage.binary_fill_holes(m)
    full = np.zeros((H, W), bool); full[box[1]:box[3], box[0]:box[2]] = m
    alpha = Image.fromarray((full * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.copy(); out.putalpha(alpha); out.save(f'scripts/cutouts/raw/{f[:-5]}.png'); print(f, flush=True)
