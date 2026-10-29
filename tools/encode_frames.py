# encode assets/sequence (1920x1080 jpg, 24fps) into web frames: every 2nd frame, desktop + mobile sizes,
# with the studio backdrop cut away (transparent WebP) so the page can put a day or night background behind it.
# writes assets/web/frames/{d,m}/NNNN.webp, manifest.json and motion.json
# usage: encode_frames.py [first-last ...]   (web frame ranges to redo; default: all)
import json, os, glob, sys
from multiprocessing import Pool
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from matte import matte, repair_desk_end

STEP = 2
SIZES = {'d': (1600, 900, 70), 'm': (960, 540, 68)}
src = sorted(glob.glob('assets/sequence/*.jpg'))[::STEP]
m = json.load(open('assets/sequence/manifest.json'))
seg = {s['segment']: s for s in m['segments']}
DESK = (seg['01_sit_down']['start'], seg['06_stand_up']['end'])   # frames where the desk stands still (master indices)

def encode(job):
    i, f = job
    im = Image.open(f).convert('RGB')
    if DESK[0] <= i * STEP <= DESK[1]:
        im = repair_desk_end(im)
    for k, (w, h, q) in SIZES.items():
        matte(im.resize((w, h), Image.LANCZOS)).save(f'assets/web/frames/{k}/{i+1:04d}.webp', 'WEBP', quality=q, method=6)

if __name__ == '__main__':
    for k in SIZES: os.makedirs(f'assets/web/frames/{k}', exist_ok=True)
    with Pool(8) as pool:
        ranges = [tuple(map(int, r.split('-'))) for r in sys.argv[1:]]
        jobs = [(i, f) for i, f in enumerate(src) if not ranges or any(a <= i <= b for a, b in ranges)]
        for n_done, _ in enumerate(pool.imap_unordered(encode, jobs), 1):
            if n_done % 60 == 0: print('encoded', n_done, flush=True)
    n = len(src)

    sections = {}
    for s in m['segments']:
        a, b = s['start'] // STEP, s['end'] // STEP
        lo, hi = sections.get(s['section'], (a, b))
        sections[s['section']] = (min(lo, a), max(hi, b))
    json.dump({'count': n, 'width': SIZES['d'][0], 'height': SIZES['d'][1], 'alpha': True,
               'sections': {k: {'start': v[0], 'end': v[1]} for k, v in sections.items()}},
              open('assets/web/frames/manifest.json', 'w'), indent=1)

    # per-frame motion (mean abs change to the next frame) so the page knows where idle breathing looks calm
    bg = Image.new('RGBA', (240, 135), (242, 234, 225, 255))
    prev, motion = None, []
    for i in range(n):
        fr = Image.open(f'assets/web/frames/m/{i+1:04d}.webp').convert('RGBA').resize((240, 135))
        a = np.asarray(Image.alpha_composite(bg, fr).convert('L')).astype(float)
        if prev is not None: motion.append(round(float(np.abs(a - prev).mean()), 2))
        prev = a
    motion.append(motion[-1])
    json.dump(motion, open('assets/web/frames/motion.json', 'w'), separators=(',', ':'))
    print('frames', n, '| motion: median %.2f  p90 %.2f' % (np.median(motion), np.percentile(motion, 90)))
