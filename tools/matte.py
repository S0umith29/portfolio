# cut the character (and desk set) out of the plain studio backdrop so the page can sit any background behind it
# the backdrop is known exactly (assets/anchor/zoomed/backdrop.png), so edges are un-mixed from it: no cream halo
import numpy as np
from PIL import Image, ImageFilter

_bg_cache = {}
def backdrop(size):
    if size not in _bg_cache:
        _bg_cache[size] = np.asarray(Image.open('assets/anchor/zoomed/backdrop.png').convert('RGB').resize(size, Image.LANCZOS)).astype(float)
    return _bg_cache[size]

def matte(img, lo=9, hi=30):
    """RGB PIL image on the studio backdrop -> RGBA PIL image with the backdrop removed."""
    rgb = np.asarray(img.convert('RGB')).astype(float)
    bg = backdrop(img.size)
    diff = np.abs(rgb - bg).max(-1)
    a = np.clip((diff - lo) / (hi - lo), 0, 1)
    m = Image.fromarray((a * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MedianFilter(3))                        # drop compression speckle in the backdrop
    m = m.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
    a = np.asarray(m).astype(float) / 255
    # un-mix the backdrop from semi-transparent edge pixels: fg = (c - (1-a)*bg) / a
    safe = np.maximum(a, 0.05)[..., None]
    fg = np.clip((rgb - (1 - safe) * bg) / safe, 0, 255)
    fg = np.where(a[..., None] > 0.98, rgb, fg)
    fg = np.where(a[..., None] > 0, fg, 0)                          # fully clear pixels: black RGB compresses best
    return Image.fromarray(np.dstack([fg, a * 255]).astype(np.uint8), 'RGBA')


def repair_desk_end(img):
    """The video model smeared the desk's left end in the seated clips; repaint it with the clean grain beside it.
    img: RGB PIL image (any size, 16:9). Returns a new image."""
    W, H = img.size
    a = np.asarray(img.convert('RGB')).copy()
    k = W / 1600                                                     # thresholds below are in 1600-wide units
    oak = (a[..., 0].astype(int) - a[..., 2].astype(int)) > 30
    probe = slice(int(220 * k), int(300 * k))
    rows = [y for y in range(int(700 * k), H) if oak[y, probe].mean() > 0.9]
    if not rows:
        return img                                                    # no desk in this frame
    top = rows[0]
    clean, width = int(200 * k), int(105 * k)
    starts = np.where(oak[min(H - 1, top + int(20 * k)), :clean])[0]
    left = starts[0] if len(starts) else int(95 * k)
    orig = a.copy()
    y0 = top - int(2 * k)
    for x in range(left, clean):
        a[y0:, x] = orig[y0:, x + width]
    seam = int(10 * k)                                               # blend into the original grain: no visible join
    for i, x in enumerate(range(clean - seam, clean)):
        t = (i + 1) / (seam + 1)
        a[y0:, x] = (orig[y0:, x + width] * (1 - t) + orig[y0:, x] * t).astype(np.uint8)
    return Image.fromarray(a)
