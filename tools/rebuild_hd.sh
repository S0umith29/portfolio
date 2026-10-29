#!/bin/zsh
# rebuild the master character sequence at 2560x1440 straight from the raw 2K clips (assets/sequence_hd)
# the 1080p build in assets/sequence and assets/clips is left untouched
set -e
V=/private/tmp/claude-501/-Users-sowmith-Documents-portfolio-portfolio/28cae19b-ef9a-407a-ba40-ed393aff6110/scratchpad/venv/bin/python
ROOT=${0:A:h:h}
WORK=${TMPDIR:-/tmp}/portfolio-hd-raw
export SEQ_W=2560
mkdir -p $ROOT/assets/clips_hd $WORK

# clips generated from the zoomed key frames: already aligned (scale 1, offset 0), so only tone-match + resize
zclip() {
  local name=$1
  rm -rf $WORK/$name $ROOT/assets/clips_hd/$name && mkdir -p $WORK/$name
  ffmpeg -v error -i $ROOT/assets/clips/raw/$name.mp4 $WORK/$name/%03d.png
  (cd $ROOT/assets/clips_hd && $V ../clips/process_zclip.py $WORK/$name $name 1 0 0 1 0 0)
}
for c in 00_wave 02_problem 04_build 05_result 06_stand_up 08_projects 09_background 10_websites 11_contact; do zclip $c & done

# the sit-down clip was generated at the tight framing: align (as measured before) and zoom out
(
  rm -rf $WORK/01_sit_down $ROOT/assets/clips_hd/01_sit_down && mkdir -p $WORK/01_sit_down
  ffmpeg -v error -i $ROOT/assets/clips/raw/01_sit_down_minimax_raw.mp4 $WORK/01_sit_down/%03d.png
  cd $ROOT/assets && $V clips/process_clip.py $WORK/01_sit_down clips_hd/01_sit_down 0.995 0 8 1.010 0 0
) &
wait

cd $ROOT/assets/clips_hd
rm -rf 03_fly_in 07_fly_out
$V ../clips/fly.py in 03_fly_in 30 02_problem 109 124
$V ../clips/fly.py out 07_fly_out 26 08_projects 1 12
SEQ_OUT=../sequence_hd $V ../clips/assemble.py | tail -1
echo HD-SEQUENCE-DONE
