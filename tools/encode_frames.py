# encode the master character sequence into web frames: every 2nd frame, studio backdrop cut away
# (transparent WebP) so the page can put any sky behind it, and cropped to the region the character
# and desk actually occupy (the rest of the frame is empty sky the page draws itself).
# reads assets/sequence_hd (2560x1440) if present, else assets/sequence (1920x1080)
# writes assets/web/frames/{h,d,m}/NNNN.webp, manifest.json and motion.json
# usage: encode_frames.py [first-last ...]   (web frame ranges to redo; default: all)
import json, os, glob, sys
from multiprocessing import Pool
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from matte import matte, repair_desk_end

STEP = 2
SEQ = 'assets/sequence_hd' if os.path.isdir('assets/sequence_hd') else 'assets/sequence'
# crop as fractions of the full frame: the character never goes right of ~0.62 or above ~0.21
CROP = (0.0, 0.17, 0.68, 1.0)
FADE = 0.06                        # soft right edge (fraction of crop width): furniture glides in from behind the text
SETS = {                           # crop width in px, WebP quality
    'h': (1741, 72),               # full 2560-master detail: high-DPI desktops
    'd': (1280, 72),               # ordinary desktops
    'm': (900, 70),                # phones
}
src = sorted(glob.glob(f'{SEQ}/*.jpg'))[::STEP]
m = json.load(open(f'{SEQ}/manifest.json'))
seg = {s['segment']: s for s in m['segments']}
DESK = (seg['01_sit_down']['start'], seg['06_stand_up']['end'])   # frames where the desk stands still (master indices)

def encode(job):
    i, f = job
    im = Image.open(f).convert('RGB')
    if DESK[0] <= i * STEP <= DESK[1]:
        im = repair_desk_end(im)
    W, H = im.size
    box = (round(CROP[0] * W), round(CROP[1] * H), round(CROP[2] * W), round(CROP[3] * H))
    cut = matte(im).crop(box)
    a = np.asarray(cut).copy()
    w = a.shape[1]; n = int(w * FADE)
    a[:, w - n:, 3] = (a[:, w - n:, 3] * np.linspace(1, 0, n)[None, :]).astype(np.uint8)
    cut = Image.fromarray(a, 'RGBA')
    for k, (cw, q) in SETS.items():
        ch = round(cw * cut.height / cut.width)
        cut.resize((cw, ch), Image.LANCZOS).save(f'assets/web/frames/{k}/{i+1:04d}.webp', 'WEBP', quality=q, method=6)

if __name__ == '__main__':
    for k in SETS: os.makedirs(f'assets/web/frames/{k}', exist_ok=True)
    ranges = [tuple(map(int, r.split('-'))) for r in sys.argv[1:]]
    jobs = [(i, f) for i, f in enumerate(src) if not ranges or any(a <= i <= b for a, b in ranges)]
    with Pool(8) as pool:
        for n_done, _ in enumerate(pool.imap_unordered(encode, jobs), 1):
            if n_done % 60 == 0: print('encoded', n_done, flush=True)
    n = len(src)

    sections = {}
    for s in m['segments']:
        a, b = s['start'] // STEP, s['end'] // STEP
        lo, hi = sections.get(s['section'], (a, b))
        sections[s['section']] = (min(lo, a), max(hi, b))
    json.dump({'count': n, 'crop': CROP, 'sets': {k: v[0] for k, v in SETS.items()},
               'sections': {k: {'start': v[0], 'end': v[1]} for k, v in sections.items()}},
              open('assets/web/frames/manifest.json', 'w'), indent=1)

    # per-frame motion (mean abs change to the next frame) so the page knows where idle breathing looks calm
    bg = None
    prev, motion = None, []
    for i in range(n):
        fr = Image.open(f'assets/web/frames/m/{i+1:04d}.webp').convert('RGBA').resize((240, 165))
        if bg is None: bg = Image.new('RGBA', fr.size, (242, 234, 225, 255))
        a = np.asarray(Image.alpha_composite(bg, fr).convert('L')).astype(float)
        if prev is not None: motion.append(round(float(np.abs(a - prev).mean()), 2))
        prev = a
    motion.append(motion[-1])
    json.dump(motion, open('assets/web/frames/motion.json', 'w'), separators=(',', ':'))
    print('frames', n, 'from', SEQ, '| motion: median %.2f  p90 %.2f' % (np.median(motion), np.percentile(motion, 90)))
