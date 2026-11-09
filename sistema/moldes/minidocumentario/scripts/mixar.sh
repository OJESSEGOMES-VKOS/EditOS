#!/bin/sh
# Voz na frente; loudnorm -14 LUFS / -1 dBTP em duas passadas. A saída tem a duração do vídeo: a voz é completada com
# silêncio e nada corta o fim.
# - Padrão (música desligada, REGRAS §6): voz + as batidas e o sopro dos vazamentos (public/efeitos.wav, do
#   scripts/trilha.py), se existir.
# - Com a trilha (cama + batidas, do scripts/trilha.py): -6 dB com ducking, ~16 dB abaixo da voz. Foi assim na vitrine.
# uso: sh scripts/mixar.sh out/so-video.mp4 out/final.mp4                     (voz + efeitos)
#      sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4   (com a música)
set -e
# G6 + decisão do dono (2026-11-05): a voz sai como foi gravada; passa-alta, compressor e loudnorm só com TRATAR_VOZ=1
if [ "${TRATAR_VOZ:-0}" = 1 ]; then TRAT="highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2"; TRAT70="highpass=f=70"; else TRAT=anull; TRAT70=anull; fi
cd "$(dirname "$0")/.."
if [ $# -ge 3 ]; then V="$1"; S="$2"; O="$3"; else V="${1:-out/so-video.mp4}"; S=""; O="${2:-out/final.mp4}"; fi
# G6 (REGRAS.md): efeito sonoro só com ordem explícita no pedido; liga com EFEITOS=1
if [ -z "$S" ] && [ "${EFEITOS:-0}" = 1 ] && [ -f public/efeitos.wav ]; then S=public/efeitos.wav; fi
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
if [ -n "$S" ]; then
  # o som é feito para a duração deste vídeo; outra duração quer dizer que ele é de outra fala (o plano do som não foi refeito)
  DS=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$S")
  awk -v a="$DUR" -v b="$DS" 'BEGIN { d = a - b; exit (d < -0.1 || d > 0.1) }' || { echo "$S tem $DS s e o vídeo $DUR s: o som é de outra fala. Refaça o plano do som e rode scripts/trilha.py (modelos/minidocumentario/minidocumentario.md, Como fazer um vídeo novo)."; exit 1; }
fi
VOZ="[1:a]aresample=48000,${TRAT},apad"
if [ -n "$S" ]; then
  echo "voz + $S"
  set -- -i "$V" -i public/voz.wav -i "$S"
  MIX="$VOZ,asplit=2[voz][chave];[2:a]aresample=48000,volume=-6dB,apad[tri];\
[tri][chave]sidechaincompress=threshold=0.06:ratio=2:attack=40:release=400[triduck];\
[voz][triduck]amix=inputs=2:duration=first:normalize=0,atrim=0:$DUR"
else
  echo "só a voz"
  set -- -i "$V" -i public/voz.wav
  MIX="$VOZ,atrim=0:$DUR"
fi
J=$(ffmpeg -nostdin -hide_banner -nostats "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
if [ "${TRATAR_VOZ:-0}" = 1 ]; then LN2="loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"; else LN2=anull; fi
ffmpeg -nostdin -hide_banner -loglevel error -y "$@" -filter_complex "$MIX,${LN2},aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
ffmpeg -nostdin -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
# a versão nova vai sozinha para <perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4 (tools/entregar.py; fora da oficina ou com
# SEM_ENTREGA=1 não faz nada)
PY=../../.venv/Scripts/python.exe; [ -x "$PY" ] || PY=../../.venv/bin/python
"$PY" ../../tools/entregar.py . "$O"
