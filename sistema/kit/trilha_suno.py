"""Trilha instrumental original pelo Suno (via kie.ai), com duração alvo.
uso: .venv/Scripts/python trilha_suno.py "<estilo em inglês>" <saida.mp3> --dur 100 [--titulo "..."] [--evitar "vocals, ..."]
- Sempre instrumental e original: nada de "no estilo de <artista>" nem música de referência enviada.
- O Suno devolve 2 versões; as duas são gravadas (<saida>.mp3 e <saida>-b.mp3). Anota o pedido e o custo em SONS.md."""
import argparse, sys, time
from datetime import date
from pathlib import Path
import requests
from gerar import API, chave


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('estilo')
    ap.add_argument('saida')
    ap.add_argument('--dur', type=float, default=90)
    ap.add_argument('--titulo', default='Trilha')
    ap.add_argument('--evitar', default='vocals, voice, choir, lyrics, singing, spoken word')
    ap.add_argument('--modelo', default='V6')
    a = ap.parse_args()
    k = chave()
    cab = {'Authorization': f'Bearer {k}'}
    corpo = {'model': 'ai-music-api/generate', 'input': {
        'custom_mode': True, 'instrumental': True, 'model': a.modelo, 'title': a.titulo[:80],
        'style': a.estilo[:1000], 'negative_tags': a.evitar, 'duration': max(10, min(360, round(a.dur)))}}
    j = requests.post(f'{API}/api/v1/jobs/createTask', headers=cab, json=corpo, timeout=60).json()
    if j.get('code') != 200:
        sys.exit(f'kie.ai recusou: {j.get("code")} {j.get("msg")}')
    tarefa = j['data']['taskId']
    t0 = time.time()
    while time.time() - t0 < 900:
        d = (requests.get(f'{API}/api/v1/jobs/recordInfo', params={'taskId': tarefa}, headers=cab, timeout=60).json().get('data') or {})
        if d.get('state') == 'fail':
            sys.exit(f'a trilha falhou: {d.get("failCode")} {d.get("failMsg")}')
        faixas = ((d.get('response') or {}).get('data') or []) if d.get('state') == 'success' else []
        if faixas and all(f.get('audio_url') for f in faixas):
            break
        time.sleep(8)
    else:
        sys.exit('a trilha demorou mais de 15 minutos')
    saida = Path(a.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    for n, f in enumerate(faixas[:2]):
        alvo = saida if n == 0 else saida.with_name(saida.stem + '-b' + saida.suffix)
        alvo.write_bytes(requests.get(f['audio_url'], timeout=180).content)
        print(f'{alvo.name}: {f.get("duration")} s')
    log = saida.parent / 'SONS.md'
    novo = not log.exists()
    with log.open('a', encoding='utf-8') as fo:
        if novo:
            fo.write('# Sons gerados\n\n| Arquivo | Tipo | Pedido | Custo | Data |\n|---|---|---|---|---|\n')
        fo.write(f'| {saida.name} (+ -b) | trilha Suno {a.modelo} via kie.ai | {a.estilo.replace("|", "/")[:300]} | {d.get("creditsConsumed")} créditos | {date.today()} |\n')
    print(f'créditos: {d.get("creditsConsumed")}')


if __name__ == '__main__':
    main()
