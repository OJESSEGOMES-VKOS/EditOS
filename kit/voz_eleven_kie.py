"""Narração pelo ElevenLabs através da kie.ai (créditos da kie, não do plano ElevenLabs).
uso: .venv/Scripts/python voz_eleven_kie.py <texto.txt> <saida.mp3> [--voz <id>] [--modelo turbo|multi]
       [--estabilidade 0.35] [--similaridade 0.8] [--estilo 0.45] [--velocidade 1.05]
- turbo = elevenlabs/text-to-speech-turbo-2-5 com idioma forçado em português (pronúncia brasileira melhor);
  multi = elevenlabs/text-to-speech-multilingual-v2 (sem forçar idioma).
- Vozes masculinas animadas do catálogo da kie: TX3LPaxmHKxFdv7VOQHJ (Liam, criador de conteúdo), vBKc2FfBKJfcZNyEt1n6
  (Finn, jovem e empolgado), LG95yZDEHg6fCZdQjLqj (Phil, locutor explosivo), qXpMhyvQqiRxWQs4qSSB (Horatius).
- Confira sempre com o Whisper (tools/transcribe.py) antes de usar. Anota em VOZES.md na pasta da saída.
"""
import argparse, json, sys, time
from datetime import date
from pathlib import Path
import requests
from gerar import API, chave

MODELOS = {'turbo': 'elevenlabs/text-to-speech-turbo-2-5', 'multi': 'elevenlabs/text-to-speech-multilingual-v2'}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('texto')
    ap.add_argument('saida')
    ap.add_argument('--voz', default='TX3LPaxmHKxFdv7VOQHJ')
    ap.add_argument('--modelo', default='turbo', choices=list(MODELOS))
    ap.add_argument('--estabilidade', type=float, default=0.35)
    ap.add_argument('--similaridade', type=float, default=0.8)
    ap.add_argument('--estilo', type=float, default=0.45)
    ap.add_argument('--velocidade', type=float, default=1.05)
    a = ap.parse_args()
    texto = Path(a.texto).read_text(encoding='utf-8').strip() if Path(a.texto).exists() else a.texto
    k = chave()
    cab = {'Authorization': f'Bearer {k}'}
    inp = {'text': texto, 'voice': a.voz, 'stability': a.estabilidade, 'similarity_boost': a.similaridade,
           'style': a.estilo, 'speed': max(0.7, min(1.2, a.velocidade)), 'timestamps': False}
    if a.modelo == 'turbo':
        inp['language_code'] = 'pt'
    j = requests.post(f'{API}/api/v1/jobs/createTask', headers=cab, json={'model': MODELOS[a.modelo], 'input': inp}, timeout=60).json()
    if j.get('code') != 200:
        sys.exit(f'kie.ai recusou: {j.get("code")} {j.get("msg")}')
    tarefa = j['data']['taskId']
    t0 = time.time()
    while time.time() - t0 < 600:
        d = requests.get(f'{API}/api/v1/jobs/recordInfo', params={'taskId': tarefa}, headers=cab, timeout=60).json().get('data') or {}
        if d.get('state') == 'success':
            url = json.loads(d['resultJson'])['resultUrls'][0]
            break
        if d.get('state') == 'fail':
            sys.exit(f'a voz falhou: {d.get("failCode")} {d.get("failMsg")}')
        time.sleep(3)
    else:
        sys.exit('a voz demorou mais de 10 minutos')
    saida = Path(a.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_bytes(requests.get(url, timeout=120).content)
    log = saida.parent / 'VOZES.md'
    novo = not log.exists()
    with log.open('a', encoding='utf-8') as f:
        if novo:
            f.write('# Vozes geradas\n\n| Arquivo | Motor | Voz | Ajustes | Créditos | Data |\n|---|---|---|---|---|---|\n')
        f.write(f'| {saida.name} | {MODELOS[a.modelo]} (kie) | {a.voz} | est {a.estabilidade} sim {a.similaridade} estilo {a.estilo} vel {a.velocidade} | {d.get("creditsConsumed")} | {date.today()} |\n')
    print(f'{saida.name}: {saida.stat().st_size // 1024} KB, {d.get("creditsConsumed")} créditos')


if __name__ == '__main__':
    main()
