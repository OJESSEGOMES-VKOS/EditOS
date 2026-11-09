#!/bin/sh
# Fila de render do estúdio: espera a trava .tmp/render.lock ficar livre, cria a sua, roda o comando e apaga só a sua.
# uso: QUEM=<nome> sh tools/com-trava.sh <comando...>   (rodar de qualquer pasta dentro do estúdio)
# No fim (deu certo ou não) apaga o que o Remotion deixou no .tmp DURANTE esta trava: a cópia da pasta public
# (remotion-*-assets*, ~100 MB por render ou still), o pacote (remotion-webpack-bundle-*) e o perfil do navegador.
# Sem essa limpeza, cada `remotion still` deixava uma cópia da mídia e o disco enchia.
# 2026-11-05: (1) só apaga o que nasceu depois desta trava (a marca .tmp/.trava-<pid>): antes apagava todo pacote do
# .tmp e derrubava render de fora da fila com "bundle does not exist"; (2) a trava é tirada com rmdir em várias
# tentativas: no Windows o rm -rf às vezes apagava o dono.txt e deixava a pasta, e a fila inteira parava.
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
TRAVA="$RAIZ/.tmp/render.lock"
mkdir -p "$RAIZ/.tmp"
export TEMP="$RAIZ/.tmp" TMP="$RAIZ/.tmp"
until mkdir "$TRAVA" 2>/dev/null; do echo "trava ocupada, esperando..."; sleep 20; done
MARCA="$RAIZ/.tmp/.trava-$$"
: > "$MARCA"
echo "${QUEM:-agente} $$ $(date)" > "$TRAVA/dono.txt"
limpar() {
  # só quem tem a trava renderiza pela fila: o que nasceu depois da marca é deste comando
  if [ -f "$MARCA" ]; then
    find "$RAIZ/.tmp" -maxdepth 1 \( -name 'remotion-v*-assets*' -o -name 'remotion-webpack-bundle-*' \
         -o -name 'puppeteer_dev_chrome_profile-*' -o -name 'react-motion-render*' \) -newer "$MARCA" \
         -exec rm -rf {} + 2>/dev/null
    find "$RAIZ/.tmp" -maxdepth 1 -type f -name '*.tmp' -size 0 -newer "$MARCA" -delete 2>/dev/null
    rm -f "$MARCA"
  fi
  # a trava: primeiro o dono.txt, depois a pasta vazia, com novas tentativas (antivírus ou indexador segurando)
  i=0
  while [ -d "$TRAVA" ] && [ $i -lt 15 ]; do
    rm -f "$TRAVA/dono.txt" 2>/dev/null
    rmdir "$TRAVA" 2>/dev/null || { i=$((i + 1)); sleep 1; }
  done
  [ -d "$TRAVA" ] && echo "com-trava: não consegui apagar $TRAVA; apague a pasta vazia à mão" >&2
}
trap limpar EXIT
trap 'exit 130' INT TERM
# contenção: enquanto o comando roda, tudo o que é pesado fica em prioridade ociosa e longe dos últimos núcleos,
# pra o computador do dono continuar usável (tools/contencao.ps1). Para sozinho quando este script acabar.
WINPID=$(cat /proc/$$/winpid 2>/dev/null)
if command -v powershell.exe >/dev/null 2>&1 && [ -n "$WINPID" ]; then
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w "$RAIZ/tools/contencao.ps1")" -Enquanto "$WINPID" >/dev/null 2>&1 &
fi
"$@"
