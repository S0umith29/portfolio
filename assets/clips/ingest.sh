#!/bin/zsh
# usage: ingest.sh <name> <url> <start_key> <end_key>   (keys: standing | seated | standing_desk, zoomed versions)
# downloads a clip, scores both joins against the zoomed key frames, and writes aligned frames to <name>/
set -e
name=$1; url=$2
V=/private/tmp/claude-501/-Users-sowmith-Documents-portfolio-portfolio/28cae19b-ef9a-407a-ba40-ed393aff6110/scratchpad/venv/bin/python
Z=../anchor/zoomed
key() { case $1 in standing) echo $Z/anchor_standing.png;; *) echo $Z/$1.png;; esac }
WD=/private/tmp/claude-501/-Users-sowmith-Documents-portfolio-portfolio/149b9042-67c8-4eb5-b31b-dd3fcaec469e/scratchpad/raw_$name
mkdir -p raw && curl -s -o raw/$name.mp4 "$url"
rm -rf $WD && mkdir -p $WD && ffmpeg -v error -i raw/$name.mp4 $WD/%03d.png
last=$(ls $WD | tail -1)
a=$($V align.py $WD/001.png $(key $3)); b=$($V align.py $WD/$last $(key $4))
echo "$name start: $a"; echo "$name end:   $b"
p() { echo $1 | sed -E 's/.*scale ([0-9.]+) dx (-?[0-9]+) dy (-?[0-9]+).*/\1 \2 \3/'; }
$V process_zclip.py $WD $name ${=$(p "$a")} ${=$(p "$b")}
