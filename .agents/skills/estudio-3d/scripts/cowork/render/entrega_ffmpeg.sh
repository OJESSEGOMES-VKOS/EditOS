#!/usr/bin/env bash
# ffmpeg 6.1 (testado na nuvem) | status: comandos executados e conferidos com ffprobe | fontes: YouTube https://support.google.com/youtube/answer/1722171 ; TikTok https://ads.tiktok.com/help/article/video-ads-specifications ; libx264/aac https://ffmpeg.org/ffmpeg-codecs.html
# Uso: entrega_ffmpeg.sh <pasta_png> <prefixo> <trilha.wav> <saida_base> [9x16|16x9]
#   pasta_png/prefixo_0001.png ... (sequência PNG 8 ou 16 bits do Blender, já em AgX/sRGB)
set -euo pipefail
PASTA="$1"; PRE="$2"; AUDIO="$3"; OUT="$4"; FMT="${5:-9x16}"
if [ "$FMT" = "16x9" ]; then W=1920; H=1080; PW=1280; PH=720; else W=1080; H=1920; PW=720; PH=1280; fi
COR="-color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv"
ESC="scale=${W}:${H}:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p"

# 1) Redes (Reels / TikTok / Shorts): H.264 High 4.2, 30 fps, yuv420p, GOP 15, AAC 48 kHz 320k
ffmpeg -y -v error -framerate 30 -i "$PASTA/${PRE}_%04d.png" -i "$AUDIO" \
  -map 0:v -map 1:a -shortest -vf "$ESC" \
  -c:v libx264 -profile:v high -level:v 4.2 -preset slow -crf 17 -maxrate 16M -bufsize 32M \
  -g 15 -keyint_min 15 -sc_threshold 0 -bf 2 $COR \
  -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart "${OUT}_redes.mp4"

# 2) YouTube (oficial: MP4, H.264 High, progressivo, GOP fechado de metade do fps, 4:2:0, AAC-LC 48 kHz;
#    1080p30 recomenda 8 Mbps; mandamos 16 Mbps porque o YouTube recodifica e sobra margem)
ffmpeg -y -v error -framerate 30 -i "$PASTA/${PRE}_%04d.png" -i "$AUDIO" \
  -map 0:v -map 1:a -shortest -vf "$ESC" \
  -c:v libx264 -profile:v high -preset slow -b:v 16M -maxrate 20M -bufsize 32M \
  -g 15 -keyint_min 15 -sc_threshold 0 -bf 2 -flags +cgop $COR \
  -c:a aac -b:a 384k -ar 48000 -ac 2 -movflags +faststart "${OUT}_youtube.mp4"

# 3) Mestre para arquivo e edição: ProRes 422 HQ (10 bits 4:2:2) + PCM 24 bits 48 kHz
ffmpeg -y -v error -framerate 30 -i "$PASTA/${PRE}_%04d.png" -i "$AUDIO" -map 0:v -map 1:a -shortest \
  -vf "scale=${W}:${H}:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv422p10le" \
  -c:v prores_ks -profile:v 3 $COR -c:a pcm_s24le -ar 48000 "${OUT}_mestre.mov"

# 4) Prévia leve para aprovação no WhatsApp (720p, teto 2,5 Mbps)
ffmpeg -y -v error -framerate 30 -i "$PASTA/${PRE}_%04d.png" -i "$AUDIO" -map 0:v -map 1:a -shortest \
  -vf "scale=${PW}:${PH}:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -profile:v high -preset medium -crf 23 -maxrate 2500k -bufsize 5M $COR \
  -c:a aac -b:a 128k -ar 48000 -movflags +faststart "${OUT}_previa.mp4"

for f in "${OUT}_redes.mp4" "${OUT}_youtube.mp4" "${OUT}_mestre.mov" "${OUT}_previa.mp4"; do
  echo "== $f ($(du -h "$f" | cut -f1))"
  ffprobe -v error -show_entries stream=codec_name,profile,level,width,height,pix_fmt,r_frame_rate,color_space,color_primaries,color_transfer,sample_rate,channels \
    -of compact=p=0:nk=0 "$f"
done
