# stitch all segments into one frame sequence with short crossfades at every join
# writes ../sequence/NNNN.jpg, ../sequence/manifest.json (frame range per segment) and a preview mp4
import os, glob, json, shutil, numpy as np
from PIL import Image
SEGMENTS = [   # (folder, storyboard section)
    ('00_wave', 'hero'), ('02_problem', 'problem'), ('03_fly_in', 'problem'),
    ('01_sit_down', 'build'), ('04_build', 'build'), ('05_result', 'result'),
    ('06_stand_up', 'result'), ('07_fly_out', 'projects'), ('08_projects', 'projects'),
    ('09_background', 'background'), ('10_websites', 'websites'), ('11_contact', 'contact'),
]
XF = 4                                  # crossfade length in frames
OUT = '../sequence'
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
seq, manifest = [], []
for folder, section in SEGMENTS:
    frames = sorted(glob.glob(f'{folder}/*.jpg'))
    if seq:                              # blend the last XF frames already placed with this segment's first XF
        for k in range(XF):
            a = np.asarray(seq[-XF+k]).astype(float); b = np.asarray(Image.open(frames[k])).astype(float)
            w = (k+1)/(XF+1)
            seq[-XF+k] = Image.fromarray((a*(1-w) + b*w).astype(np.uint8))
        frames = frames[XF:]
    start = len(seq)
    seq += [Image.open(f).convert('RGB') for f in frames]
    manifest.append({'segment': folder, 'section': section, 'start': start, 'end': len(seq)-1})
for i, im in enumerate(seq): im.save(f'{OUT}/{i+1:04d}.jpg', quality=95)
json.dump({'fps': 24, 'frames': len(seq), 'segments': manifest}, open(f'{OUT}/manifest.json','w'), indent=1)
os.system(f'ffmpeg -v error -y -framerate 24 -i {OUT}/%04d.jpg -pix_fmt yuv420p -crf 18 ../sequence_preview.mp4')
print('frames', len(seq))
