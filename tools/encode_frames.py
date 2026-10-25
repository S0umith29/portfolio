# encode assets/sequence (1920x1080 jpg, 24fps) into web frames: every 2nd frame, desktop + mobile sizes
# writes assets/web/frames/{d,m}/NNNN.webp and assets/web/frames/manifest.json
import json, os, glob
from PIL import Image
STEP = 2
SIZES = {'d': (1600, 900, 72), 'm': (960, 540, 70)}
src = sorted(glob.glob('assets/sequence/*.jpg'))
m = json.load(open('assets/sequence/manifest.json'))
for k, (w, h, q) in SIZES.items():
    os.makedirs(f'assets/web/frames/{k}', exist_ok=True)
    for i, f in enumerate(src[::STEP]):
        Image.open(f).resize((w, h), Image.LANCZOS).save(f'assets/web/frames/{k}/{i+1:04d}.webp', 'WEBP', quality=q, method=6)
n = len(src[::STEP])
sections = {}
for s in m['segments']:
    a, b = s['start']//STEP, s['end']//STEP
    lo, hi = sections.get(s['section'], (a, b))
    sections[s['section']] = (min(lo, a), max(hi, b))
json.dump({'count': n, 'width': SIZES['d'][0], 'height': SIZES['d'][1],
           'sections': {k: {'start': v[0], 'end': v[1]} for k, v in sections.items()}},
          open('assets/web/frames/manifest.json', 'w'), indent=1)
print('frames', n)

# per-frame motion (mean abs change to the next frame) so the page knows where idle breathing looks calm
import numpy as np
prev, motion = None, []
for i in range(n):
    a = np.asarray(Image.open(f'assets/web/frames/m/{i+1:04d}.webp').convert('L').resize((240, 135))).astype(float)
    if prev is not None: motion.append(round(float(np.abs(a - prev).mean()), 2))
    prev = a
motion.append(motion[-1])
json.dump(motion, open('assets/web/frames/motion.json', 'w'), separators=(',', ':'))
print('motion: median %.2f  p90 %.2f' % (np.median(motion), np.percentile(motion, 90)))
