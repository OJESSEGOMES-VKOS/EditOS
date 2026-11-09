#!/bin/sh
# O render já sai com o som (public/som.m4a ou, sem ele, só a narração). Aqui só o loudnorm -14 LUFS / -1 dBTP em duas
# passadas, vídeo copiado, do tamanho do vídeo. Música é opção: só entra se estiver mixada no som.m4a.
# uso: sh scripts/finalizar.sh out/video.mp4 out/final.mp4
set -e
# G6 + decisão do dono (2026-11-05): a voz sai como foi gravada; passa-alta, compressor e loudnorm só com TRATAR_VOZ=1
if [ "${TRATAR_VOZ:-0}" = 1 ]; then TRAT="highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2"; TRAT70="highpass=f=70"; else TRAT=anull; TRAT70=anull; fi
cd "$(dirname "$0")/.."
V="${1:-out/video.mp4}"; O="${2:-out/final.mp4}"
[ -f "$V" ] || { echo "não achei o vídeo $V (renderize antes)"; exit 1; }
J=$(ffmpeg -nostdin -hide_banner -nostats -i "$V" -af "loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
if [ "${TRATAR_VOZ:-0}" = 1 ]; then LN2="loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"; else LN2=anull; fi
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$V" -af "${LN2},aresample=48000" \
  -map 0:v -map 0:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
ffmpeg -nostdin -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
# a versão nova vai sozinha para <perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4 (tools/entregar.py; fora da oficina ou com
# SEM_ENTREGA=1 não faz nada)
PY=../../.venv/Scripts/python.exe; [ -x "$PY" ] || PY=../../.venv/bin/python
"$PY" ../../tools/entregar.py . "$O"
