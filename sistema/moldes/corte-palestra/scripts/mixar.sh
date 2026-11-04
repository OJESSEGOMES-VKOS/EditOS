#!/bin/sh
# corte-palestra: só a voz, na frente, sem música e sem efeito (o modelo vem sem cama: a música da ref2 não é referência).
# loudnorm -14 LUFS, alvo de pico -1,5 (o linear do loudnorm passava 0,1 dB do -1 dBTP na vitrine) em duas passadas; a saída tem a duração do vídeo (a voz é completada com silêncio).
# Música é opção do usuário: sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4 (~16 dB abaixo, com ducking).
# uso (na pasta do vídeo, pela trava): QUEM=<nome> sh ../../tools/com-trava.sh sh scripts/mixar.sh out/so-video.mp4 out/final.mp4
set -e
cd "$(dirname "$0")/.."
if [ $# -ge 3 ]; then V="$1"; S="$2"; O="$3"; else V="${1:-out/so-video.mp4}"; S=""; O="${2:-out/final.mp4}"; fi
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
VOZ="[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,apad"
if [ -n "$S" ]; then
  echo "voz + $S"
  set -- -i "$V" -i public/voz.wav -i "$S"
  MIX="$VOZ,asplit=2[voz][chave];[2:a]aresample=48000,apad[tri];[tri][chave]sidechaincompress=threshold=0.06:ratio=2:attack=40:release=400[triduck];[voz][triduck]amix=inputs=2:duration=first:normalize=0,atrim=0:$DUR"
else
  echo "só a voz"
  set -- -i "$V" -i public/voz.wav
  MIX="$VOZ,atrim=0:$DUR"
fi
J=$(ffmpeg -nostdin -hide_banner -nostats "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -nostdin -hide_banner -loglevel error -y "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
ffmpeg -nostdin -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
# a versão nova vai sozinha para <perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4 (fora da oficina, na vitrine ou com SEM_ENTREGA=1, nada)
PY=../../.venv/Scripts/python.exe; [ -x "$PY" ] || PY=../../.venv/bin/python
"$PY" ../../tools/entregar.py . "$O"
