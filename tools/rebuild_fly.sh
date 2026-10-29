#!/bin/zsh
# re-render the furniture fly-in/out, re-assemble the master sequence, re-encode only the affected web frames
set -e
V=/private/tmp/claude-501/-Users-sowmith-Documents-portfolio-portfolio/28cae19b-ef9a-407a-ba40-ed393aff6110/scratchpad/venv/bin/python
ROOT=${0:A:h:h}
cd $ROOT/assets/clips
rm -rf 03_fly_in 07_fly_out
$V fly.py in 03_fly_in 30 02_problem 109 124
$V fly.py out 07_fly_out 26 08_projects 1 12
$V assemble.py | tail -1
cd $ROOT
$V tools/encode_frames.py 118-138 402-425 2>&1 | grep -v -i warning | tail -1
echo REBUILD-DONE
