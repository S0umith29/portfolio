# fill the hole the monitor's base left in the desk layer (the desk was cut out of a photo with the
# monitor standing on it), so the desk can fly in on its own without a monitor-shaped gap
import numpy as np
from PIL import Image, ImageFilter
p = 'assets/anchor/zoomed/layers/desk.png'
im = np.asarray(Image.open(p).convert('RGBA')).astype(float)
a = im[..., 3]
rows = np.where((a > 200).sum(1) > 50)[0]
top, bottom = rows[0], rows[-1]
left = int(np.median([np.where(a[y] > 200)[0][0] for y in rows]))

# the desk's slanted right end: fit it from rows the base didn't reach, then extend to every row
right = np.array([np.where(a[y] > 200)[0][-1] for y in rows])
lo, hi = np.percentile(right, 50), np.percentile(right, 100)
clean = right >= lo                                                        # rows that reach the true end
k, b = np.polyfit(rows[clean], right[clean], 1)
edge = {y: int(round(k * y + b)) for y in range(top, bottom + 1)}

# the monitor's base (and the shadow it cast) sits in one band at the desk's right end:
# rebuild that whole band from the clean stretch of desk right beside it, then blend the seam
oak = (im[..., 0] - im[..., 2] > 30) & (a > 250)
# only look where the monitor stood: stop short of the slanted right end, which never reads as solid oak
bad_cols = [x for x in range(left, min(edge.values()) - 40) if not oak[top + 4:bottom - 2, x].all()]
if not [x for x in bad_cols if x > left + 200]:
    print('desk layer already repaired, nothing to do'); bad_cols = None
seam = 40
band0 = min(x for x in bad_cols if x > left + 200) - 30 - seam if bad_cols else None            # start in clean wood, left of the base and its shadow
out = im.copy()
for y in (range(top, bottom + 1) if band0 is not None else []):
    width = edge[y] + 1 - band0
    out[y, band0:edge[y] + 1, :3] = im[y, band0 - width:band0, :3]
    out[y, band0:edge[y] + 1, 3] = 255
for i in (range(seam) if band0 is not None else []):                      # cross-fade from the original grain
    t = i / seam
    x = band0 + i
    out[top:bottom + 1, x, :3] = im[top:bottom + 1, x - 0, :3] * (1 - t) + out[top:bottom + 1, x, :3] * t
if band0 is not None: print('rebuilt band from x', band0)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(p)
print('desk rows', top, bottom, '| left', left)

# the chair layer also picked up a faint band of floor shadow along its bottom; the chair only needs
# the backrest above the desk line (the desk always covers the rest), so drop everything else
cp = 'assets/anchor/zoomed/layers/chair.png'
ch = np.asarray(Image.open(cp).convert('RGBA')).copy()
ca = ch[..., 3].astype(int)
ca[top - 4:, :] = 0                                                       # at or below the desk top: always hidden
ca[ca < 70] = 0                                                           # faint shadow haze
body = np.where((ca > 8).sum(0) > 40)[0]                                  # the backrest's own columns
ca[:, :body[0]] = 0; ca[:, body[-1] + 1:] = 0                             # slivers outside it
ch[..., 3] = ca.astype(np.uint8)
Image.fromarray(ch).save(cp)
ys, xs = np.where(ch[..., 3] > 8)
print('chair now spans', xs.min(), ys.min(), xs.max(), ys.max())
