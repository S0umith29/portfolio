#!/bin/zsh
# usage: evalclip.sh <clip.mp4> <start_key.png> <end_key.png> <workdir>
# prints first/last-frame alignment (scale, offset, residual error) against the key frames
set -e
clip=$1; k0=$2; k1=$3; wd=$4
V=/private/tmp/claude-501/-Users-sowmith-Documents-portfolio-portfolio/28cae19b-ef9a-407a-ba40-ed393aff6110/scratchpad/venv/bin/python
HERE=${0:A:h}
rm -rf $wd && mkdir -p $wd
ffmpeg -v error -i $clip $wd/%03d.png
last=$(ls $wd | tail -1)
echo "frames: $(ls $wd | wc -l | tr -d ' ')  $(ffprobe -v error -show_entries stream=width,height,r_frame_rate -of csv=p=0 $clip)"
echo -n "start: "; $V $HERE/align.py $wd/001.png $k0
echo -n "end:   "; $V $HERE/align.py $wd/$last $k1
