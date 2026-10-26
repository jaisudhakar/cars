# Fit every cut-out into the site's car frame (1600x600, tyres on the ground line at 89%) as WebP.
import glob, os
from PIL import Image
W, H = 1600, 600
GROUND = round(H * 214 / 240)
OUT = 'html/assets/img/cutouts'
os.makedirs(OUT, exist_ok=True)
for f in sorted(glob.glob('scripts/cutouts/raw/*.png')):
    im = Image.open(f).convert('RGBA')
    box = im.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    car = im.crop(box)
    scale = min(W * 0.92 / car.width, H * 0.84 / car.height)
    car = car.resize((round(car.width * scale), round(car.height * scale)), Image.LANCZOS)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    out.paste(car, ((W - car.width) // 2, GROUND - car.height), car)
    out.save(f'{OUT}/{os.path.basename(f)[:-4]}.webp', 'WEBP', quality=82, method=6)
print(len(os.listdir(OUT)), sum(os.path.getsize(os.path.join(OUT, x)) for x in os.listdir(OUT)) // 1024, 'KB')
