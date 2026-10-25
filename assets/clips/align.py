# find scale+offset mapping a clip frame onto a key frame (brute force on a small grid, static regions only),
# then report how well the subject matches once the static set is aligned
import sys, numpy as np
from PIL import Image
KW, KH = 672, 380                      # key frame at 1/4 of 2688x1520
SPLIT = int(0.42*KW)                   # left of this: the character; right: monitor/desk (static)
key = np.array(Image.open(sys.argv[2]).convert('L').resize((KW,KH))).astype(float)
fr  = Image.open(sys.argv[1]).convert('L')

def place(s, dx, dy):
    w, h = int(KW*s), int(KW*s*fr.height/fr.width)
    img = np.array(fr.resize((w,h))).astype(float)
    canvas = np.full((KH,KW), np.nan)
    x0 = (KW-w)//2 + dx; y0 = (KH-h)//2 + dy
    ys = slice(max(0,y0), min(KH,y0+h)); xs = slice(max(0,x0), min(KW,x0+w))
    canvas[ys, xs] = img[ys.start-y0:ys.stop-y0, xs.start-x0:xs.stop-x0]
    return canvas

best = None
for s in np.arange(0.96, 1.10, 0.005):
    for dx in range(-30, 31, 2):
        for dy in range(-30, 31, 2):
            c = place(s, dx, dy)
            e = np.nanmean(np.abs(key - c))      # first/last frames should match the whole key frame
            if best is None or e < best[0]: best = (e, s, dx, dy)

e, s, dx, dy = best
subject = np.nanmean(np.abs(key - place(s, dx, dy))[:, :SPLIT])
print('set err %.2f | subject err %.2f | scale %.3f dx %d dy %d (2688-wide px)' % (e, subject, s, dx*4, dy*4))
