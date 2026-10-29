# align a clip that was generated from the zoomed key frames, tone-match it to the backdrop, write SEQ_W-wide frames (default 1920x1080)
# usage: process_zclip.py frames_dir out_dir s0 dx0 dy0 s1 dx1 dy1   (offsets in 2688-wide px, from align.py)
import sys, os, glob, numpy as np
from PIL import Image
W, H, OUT = 2688, 1520, (int(os.environ.get('SEQ_W', 1920)), int(os.environ.get('SEQ_W', 1920)) * 9 // 16)
src_dir, out_dir = sys.argv[1], sys.argv[2]
s0,dx0,dy0,s1,dx1,dy1 = map(float, sys.argv[3:9])
os.makedirs(out_dir, exist_ok=True)
bg = Image.open('../anchor/zoomed/backdrop.png').convert('RGB')
bga = np.array(bg).astype(float)
files = sorted(glob.glob(f'{src_dir}/*.png')); n = len(files)
for i, f in enumerate(files):
    t = i/(n-1); s = s0+(s1-s0)*t; dx = dx0+(dx1-dx0)*t; dy = dy0+(dy1-dy0)*t
    fr = Image.open(f).convert('RGB')
    fw, fh = int(W*s), int(W*s*fr.height/fr.width)
    canvas = bg.copy()
    canvas.paste(fr.resize((fw,fh), Image.LANCZOS), (int((W-fw)/2+dx), int((H-fh)/2+dy)))
    arr = np.array(canvas).astype(float)
    patch = (slice(80,500), slice(1900,2600))          # empty backdrop, top right
    arr += bga[patch].reshape(-1,3).mean(0) - arr[patch].reshape(-1,3).mean(0)
    Image.fromarray(np.clip(arr,0,255).astype(np.uint8)).resize(OUT, Image.LANCZOS).save(f'{out_dir}/{i+1:03d}.jpg', quality=95)
print(out_dir, 'frames', n)
