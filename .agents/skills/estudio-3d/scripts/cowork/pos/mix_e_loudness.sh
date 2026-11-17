#!/usr/bin/env bash
# ffmpeg | status: testado na nuvem (ffmpeg do sistema) com sinais sintéticos | fontes:
#   loudnorm (EBU R128 / ITU-R BS.1770): https://ffmpeg.org/ffmpeg-filters.html#loudnorm
#   sidechaincompress: https://ffmpeg.org/ffmpeg-filters.html#sidechaincompress
# Uso: mix_e_loudness.sh trilha.wav voz.wav sfx.wav saida.wav
# 1) duck da trilha sob a voz (sidechain)  2) soma  3) mede  4) normaliza em 2 passadas para -14 LUFS / -1 dBTP
set -e
TRILHA="$1"; VOZ="$2"; SFX="$3"; OUT="$4"
ALVO_I=-14; ALVO_TP=-1; ALVO_LRA=11
ffmpeg -hide_banner -loglevel error -y -i "$TRILHA" -i "$VOZ" -i "$SFX" -filter_complex \
 "[1:a]asplit=2[vz][sc];[0:a][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350:makeup=1[tr];\
  [tr][vz][2:a]amix=inputs=3:normalize=0[m]" -map "[m]" -ar 48000 -c:a pcm_s24le /tmp/_mix_bruto.wav
# passada 1: medir
J=$(ffmpeg -hide_banner -i /tmp/_mix_bruto.wav -af loudnorm=I=$ALVO_I:TP=$ALVO_TP:LRA=$ALVO_LRA:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
get(){ echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
echo "antes: I=$(get input_i) LUFS  TP=$(get input_tp) dBTP  LRA=$(get input_lra)"
# passada 2: aplicar com os valores medidos (modo linear quando possível)
ffmpeg -hide_banner -loglevel error -y -i /tmp/_mix_bruto.wav -af \
 "loudnorm=I=$ALVO_I:TP=$ALVO_TP:LRA=$ALVO_LRA:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
 -ar 48000 -c:a pcm_s24le "$OUT"
# conferência
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A14 "Summary" | grep -E "I:|Peak:|LRA:"
