# align a generated clip to the key-frame geometry, then zoom it onto the shared backdrop
# usage: process_clip.py frames_dir out_dir s0 dx0 dy0 s1 dx1 dy1
import sys, os, glob, numpy as np
from PIL import Image, ImageFilter
W,H,S_,OX,FEATHER = 2688,1520,0.8,80,200
DESK_LEFT, DESK_TOP = 100, 1430
src_dir, out_dir = sys.argv[1], sys.argv[2]
s0,dx0,dy0,s1,dx1,dy1 = map(float, sys.argv[3:9])
os.makedirs(out_dir, exist_ok=True)
bg = Image.open('anchor/zoomed/backdrop.png').convert('RGBA'); bga = np.array(bg).astype(float)
w,h = int(W*S_), int(H*S_)
am = np.ones((H,W)); am[DESK_TOP-40:, :DESK_LEFT] = 0
am = np.array(Image.fromarray((am*255).astype(np.uint8)).resize((w,h)))/255
ramp = np.linspace(0,1,FEATHER)
am[:FEATHER,:] *= ramp[:,None]; am[:, -FEATHER:] *= ramp[::-1][None,:]
am[:, :FEATHER//2] *= np.linspace(0,1,FEATHER//2)[None,:]
alpha = (am*255).astype(np.uint8)
files = sorted(glob.glob(f'{src_dir}/*.png')); n = len(files)
for i,f in enumerate(files):
    t = i/(n-1); s = s0+(s1-s0)*t; dx = dx0+(dx1-dx0)*t; dy = dy0+(dy1-dy0)*t
    fr = Image.open(f).convert('RGB')
    fw, fh = int(W*s), int(W*s*fr.height/fr.width)
    canvas = Image.new('RGB', (W,H), (243,236,228))
    canvas.paste(fr.resize((fw,fh), Image.LANCZOS), (int((W-fw)/2+dx), int((H-fh)/2+dy)))
    src = np.array(canvas).astype(float)
    # tone-match against the backdrop using the empty top-right patch
    sy, sx = slice(60,400), slice(1900,2550)
    ty, tx = slice(H-h+int(60*S_), H-h+int(400*S_)), slice(OX+int(1900*S_), OX+int(2550*S_))
    src += bga[ty,tx,:3].reshape(-1,3).mean(0) - src[sy,sx].reshape(-1,3).mean(0)
    img = Image.fromarray(np.clip(src,0,255).astype(np.uint8)).resize((w,h), Image.LANCZOS).convert('RGBA')
    arr = np.array(img)
    # keep the subject fully opaque: feather only where the frame is plain backdrop
    under = bga[H-h:, OX:OX+w, :3]
    diff = np.abs(arr[...,:3].astype(float) - under).max(-1)
    fg = np.array(Image.fromarray((np.clip((diff-8)/17,0,1)*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(6)))
    arr[...,3] = np.maximum(alpha, fg)
    layer = Image.new('RGBA',(W,H),(0,0,0,0)); layer.paste(Image.fromarray(arr),(OX,H-h))
    Image.alpha_composite(bg, layer).convert('RGB').resize((1920,1080), Image.LANCZOS).save(f'{out_dir}/{i+1:03d}.jpg', quality=92)
print('frames', n)
