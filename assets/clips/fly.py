# render the furniture fly-in (from the right, behind the text column) and fly-out (to the left),
# with the character taken from real video frames so he keeps breathing instead of freezing
# usage: fly.py in|out out_dir N person_frames_dir first last   (frames played forward then back, ping-pong)
import sys, os, glob, numpy as np
from PIL import Image, ImageFilter
mode, out_dir, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
pdir, first, last = sys.argv[4], int(sys.argv[5]), int(sys.argv[6])
OUT = (1920, 1080)
Z = '../anchor/zoomed'
os.makedirs(out_dir, exist_ok=True)
bg = np.asarray(Image.open(f'{Z}/backdrop.png').convert('RGB').resize(OUT)).astype(float)
L = {k: Image.open(f'{Z}/layers/{k}.png').convert('RGBA').resize(OUT, Image.LANCZOS) for k in ['chair','desk','monitor']}
W = OUT[0]
STAGGER = {'chair': 0.0, 'desk': 0.12, 'monitor': 0.22}

def ease_out_back(t, k=1.2):
    t -= 1; return 1 + (k+1)*t**3 + k*t**2
def ease_in_cubic(t): return t**3
def offset(name, p):
    q = np.clip((p - STAGGER[name]) / (1 - STAGGER[name]), 0, 1)
    if mode == 'in': return (1 - ease_out_back(q)) * W
    return -ease_in_cubic(q) * W * 0.85

# ping-pong over the chosen person frames so the character idles naturally
src = sorted(glob.glob(f'{pdir}/*.jpg'))[first-1:last]
cycle = src + src[-2:0:-1]
def person(i):
    im = Image.open(cycle[i % len(cycle)]).convert('RGB')
    a = np.asarray(im).astype(float)
    diff = np.abs(a - bg).max(-1)                                  # plain backdrop -> easy matte
    m = Image.fromarray((np.clip((diff-10)/18, 0, 1)*255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))     # pull the edge in: no backdrop fringe
    rgba = im.convert('RGBA'); rgba.putalpha(m)
    return im.convert('RGBA'), rgba

def moved(name, p):
    layer = Image.new('RGBA', OUT, (0,0,0,0)); dx = int(offset(name, p))
    layer.paste(L[name], (dx, 0), L[name]); return layer

for i in range(N):
    p = i/(N-1)
    frame, him = person(i)
    frame = Image.alpha_composite(frame, moved('chair', p))        # chair slides in behind him
    frame = Image.alpha_composite(frame, him)
    frame = Image.alpha_composite(frame, moved('desk', p))
    frame = Image.alpha_composite(frame, moved('monitor', p))
    frame.convert('RGB').save(f'{out_dir}/{i+1:03d}.jpg', quality=92)
print(mode, N, 'person frames', len(src))
