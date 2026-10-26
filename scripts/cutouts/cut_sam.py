import os, sys, json, re
import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session
from scipy import ndimage

SRC = 'html/assets/img/products'   # original photos
OUT = 'scripts/cutouts/raw'
os.makedirs(OUT, exist_ok=True)
# box (fractions x1,y1,x2,y2) around the car, plus "not the car" points (remote etc.)
BOX = {
 'ghost': ([.24,.41,.90,.75], [(.25,.25),(.12,.35)]),
 'flare-1': ([.17,.37,.93,.74], [(.12,.30),(.22,.18)]),
 'flare-2': ([.17,.37,.93,.74], [(.12,.30),(.22,.18)]),
 'shadow': ([.18,.39,.87,.71], [(.82,.25),(.75,.40)]),
 'night-wolf': ([.00,.36,.77,.74], [(.80,.35),(.75,.22)]),
 'vortex': ([.22,.42,.92,.72], [(.12,.30),(.25,.22)]),
 'flare-legends': ([.13,.43,.86,.80], [(.72,.30),(.68,.40)]),
 'bhoot': ([.14,.44,.75,.71], [(.80,.38),(.88,.65)]),
 'blitz': ([.20,.45,.88,.75], [(.10,.45),(.08,.60)]),
 'zip': ([.09,.42,.72,.72], [(.62,.30),(.64,.42)]),
 'dash-mini': ([.19,.53,.63,.75], [(.55,.35),(.52,.62)]),
 'nitro-mini': ([.07,.53,.58,.78], [(.60,.30),(.52,.45)]),
 'gator-hammer': ([.19,.34,.92,.80], [(.10,.35),(.15,.55)]),
 'gator-marsh': ([.19,.36,.92,.80], [(.10,.35),(.15,.55)]),
 'roxie': ([.09,.28,.79,.74], [(.82,.30),(.78,.45)]),
 'knox': ([.11,.22,.81,.75], [(.85,.75),(.80,.68)]),
 'bumble': ([.00,.33,.99,.90], [(.85,.15),(.65,.12)]),
 'apex': ([.07,.39,.79,.75], [(.88,.60)]),
 'doughty': ([.07,.39,.80,.75], [(.88,.60)]),
 'gazer': ([.07,.39,.80,.75], [(.88,.60)]),
 'fang': ([.04,.08,.84,.71], [(.25,.82),(.15,.75)]),
 'rift': ([.36,.18,.95,.80], [(.20,.68),(.30,.62)]),
 'rumble': ([.03,.27,.57,.72], [(.75,.60)]),
 'mac': ([.19,.41,.66,.75], [(.72,.35),(.66,.25)]),
 'vera': ([.02,.15,.99,.63], [(.15,.85)]),
}
# per-photo fixes: file -> (box, not-car points, extra car points)
FIX = {
 'ghost-rc-drift-car-underground-white.webp': ([.23,.41,.94,.78], [(.25,.25),(.12,.35),(.15,.85)], [(.45,.62),(.75,.58),(.88,.62),(.30,.66)]),
 'dash-mini-rc-car-black.webp': ([.19,.55,.59,.78], [(.62,.60),(.55,.40),(.75,.68)], [(.30,.68),(.45,.70),(.25,.62),(.53,.70)]),
 'dash-mini-rc-car-green.webp': ([.19,.56,.58,.78], [(.62,.60),(.55,.40),(.75,.68)], [(.30,.68),(.45,.70),(.25,.62),(.53,.70)]),
 'dash-mini-rc-car-silver.webp': ([.19,.56,.58,.79], [(.62,.60),(.55,.40),(.75,.68)], [(.30,.68),(.45,.70),(.25,.63),(.53,.70)]),
 'dash-mini-rc-car-street-white.webp': ([.16,.57,.60,.81], [(.60,.55),(.55,.40),(.75,.72)], [(.30,.68),(.45,.72),(.25,.70),(.52,.74)]),
 'nitro-mini-rc-car-race-blue.webp': ([.09,.54,.58,.78], [(.62,.64),(.55,.40),(.80,.70)], [(.25,.68),(.40,.70),(.50,.68),(.15,.60)]),
 'nitro-mini-rc-car-race-grey.webp': ([.09,.54,.58,.78], [(.62,.64),(.55,.40),(.80,.70)], [(.25,.68),(.40,.70),(.50,.68),(.15,.60)]),
 'shadow-rc-drift-car-tarmac-purple.webp': ([.15,.49,.75,.78], [(.80,.40),(.08,.88),(.30,.40),(.40,.88)], [(.30,.62),(.50,.62),(.65,.67),(.60,.55)]),
 'vortex-overdrive-yellow.webp': ([.22,.41,.93,.72], [(.12,.30),(.25,.22),(.12,.65)], [(.40,.55),(.60,.52),(.80,.60),(.40,.66)]),
 'fang-rc-excavator-default-title.webp': ([.04,.08,.86,.72], [(.25,.86),(.12,.80),(.68,.58)], [(.35,.50),(.30,.66),(.60,.25),(.75,.40),(.15,.62),(.50,.66)]),
 'rift-default-title.webp': ([.36,.16,.96,.81], [(.20,.68),(.35,.62),(.15,.30)], [(.82,.62),(.70,.75),(.55,.40),(.48,.30),(.88,.74)]),
 'night-wolf-rc-drift-car-hammer-red.webp': ([.05,.36,.77,.78], [(.80,.35),(.85,.50)], [(.30,.60),(.50,.55),(.65,.65),(.12,.60),(.20,.42)]),
}
cat = open('html/assets/data/catalog.js').read()
cars = json.loads(re.search(r'window.CARS = (\[.*?\]);\n', cat, re.S).group(1))
only = sys.argv[1:]
sess = new_session('sam')

def bbox(m):
    ys, xs = np.where(m)
    return (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None
def iou(a, b):
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    inter = ix * iy; u = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter / u if u else 0

for c in cars:
    for p in c['paints']:
        f = p['photo'].split('/')[-1]
        if only and c['id'] not in only and f not in only: continue
        box, negs = BOX[c['id']]
        pos = []
        if f in FIX: box, negs, pos = FIX[f]
        im = Image.open(f'{SRC}/{f}').convert('RGB')
        W, H = im.size
        bx = [box[0]*W, box[1]*H, box[2]*W, box[3]*H]
        prompt = [{'type': 'rectangle', 'data': [int(v) for v in bx], 'label': 1},
                  {'type': 'point', 'data': [int((bx[0]+bx[2])/2), int(bx[1] + (bx[3]-bx[1])*0.55)], 'label': 1}]
        prompt += [{'type': 'point', 'data': [int(x*W), int(y*H)], 'label': 0} for x, y in negs]
        prompt += [{'type': 'point', 'data': [int(x*W), int(y*H)], 'label': 1} for x, y in pos]
        masks = sess.predict(im, sam_prompt=prompt)
        best, score = None, -1
        for mk in masks:
            m = np.array(mk.convert('L').resize((W, H))) > 127
            b = bbox(m)
            if b is None: continue
            s = iou(b, bx)
            if s > score: best, score = m, s
        m = best
        # keep the largest blob, fill holes
        lab, n = ndimage.label(m)
        if n > 1:
            sizes = ndimage.sum(m, lab, range(1, n + 1))
            m = lab == (np.argmax(sizes) + 1)
        m = ndimage.binary_fill_holes(m)
        alpha = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
        rgba = im.copy(); rgba.putalpha(alpha)
        rgba.save(f'{OUT}/{f[:-5]}.png')
        print(f, round(score, 2), flush=True)
