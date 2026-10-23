"""Narração pelo Gemini 2.5 Pro TTS (via kie.ai): fala português do Brasil nativo e aceita direção de estilo.
uso: .venv/Scripts/python voz_gemini.py <texto.txt> <saida.wav> [--voz Fenrir] [--estilo "Promo/Hype"]
         [--ritmo Natural] [--perfil "<quem fala>"] [--contexto "<tom geral>"] [--temperatura 1.0]
- Vozes masculinas animadas: Fenrir (empolgado), Puck (alegre). Outras: Charon, Orus, Sadachbia, Algenib...
- Estilos aceitos: Vocal Smile, Newscaster, Whisper, Empathetic, Promo/Hype, Deadpan.
- Ritmos: Natural, Rapid Fire, The Drift, Staccato.
- A chave vem de KIE_API_KEY ou do kit/.env. Sai WAV 24 kHz mono. O tempo de cada palavra sai do Whisper
  (tools/transcribe.py), não daqui. Cada geração fica anotada em VOZES.md na pasta da saída, com o custo."""
import argparse, json, sys, time
from datetime import date
from pathlib import Path
import requests
from gerar import API, chave

MODELO = 'google/gemini-2-5-pro-tts'


def pedir(k, corpo):
    r = requests.post(f'{API}/api/v1/jobs/createTask', headers={'Authorization': f'Bearer {k}'}, json=corpo, timeout=60)
    j = r.json()
    if j.get('code') != 200:  # a kie.ai responde HTTP 200 mesmo no erro
        sys.exit(f'kie.ai recusou: {j.get("code")} {j.get("msg")}')
    return j['data']['taskId']


def esperar(k, tarefa, limite=600):
    t0 = time.time()
    while time.time() - t0 < limite:
        j = requests.get(f'{API}/api/v1/jobs/recordInfo', params={'taskId': tarefa}, headers={'Authorization': f'Bearer {k}'}, timeout=60).json()
        d = j.get('data') or {}
        if d.get('state') == 'success':
            return json.loads(d['resultJson'])['resultUrls'][0], d.get('creditsConsumed'), d.get('costTime')
        if d.get('state') == 'fail':
            sys.exit(f'a voz falhou: {d.get("failCode")} {d.get("failMsg")}')
        time.sleep(4)
    sys.exit('a voz demorou mais de 10 minutos: tente de novo')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('texto')
    ap.add_argument('saida')
    ap.add_argument('--voz', default='Fenrir')
    ap.add_argument('--estilo', default='Promo/Hype')
    ap.add_argument('--ritmo', default='Natural')
    ap.add_argument('--sotaque', default='Neutral')
    ap.add_argument('--perfil', default='Narrador brasileiro de um canal de curiosidades, homem jovem, voz marcante e animada, '
                                        'fala português do Brasil com sotaque paulista neutro, sorri enquanto explica e se '
                                        'empolga a cada descoberta.')
    ap.add_argument('--contexto', default='Narração de vídeo curto de curiosidade para Reels e Shorts, em português do Brasil. '
                                          'Ritmo dinâmico, energia alta, sobe a voz no "Mas" de cada problema e fala o nome '
                                          'técnico com orgulho, como quem revela um segredo.')
    ap.add_argument('--temperatura', type=float, default=1.0)
    a = ap.parse_args()
    texto = Path(a.texto).read_text(encoding='utf-8').strip() if Path(a.texto).exists() else a.texto
    k = chave()
    corpo = {'model': MODELO, 'input': {
        'temperature': a.temperatura,
        'scene': 'Estúdio de gravação silencioso, microfone de perto, voz limpa e presente.',
        'sample_context': a.contexto,
        'speakers': [{'speaker_id': 'Speaker 1', 'voice_name': a.voz, 'accent': a.sotaque,
                      'audio_profile': a.perfil, 'style': a.estilo, 'pace': a.ritmo}],
        'dialogue_turns': [{'speaker_id': 'Speaker 1', 'text': texto}],
    }}
    tarefa = pedir(k, corpo)
    url, creditos, seg = esperar(k, tarefa)
    saida = Path(a.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_bytes(requests.get(url, timeout=120).content)
    log = saida.parent / 'VOZES.md'
    novo = not log.exists()
    with log.open('a', encoding='utf-8') as f:
        if novo:
            f.write('# Vozes geradas (Gemini 2.5 Pro TTS via kie.ai)\n\n| Arquivo | Voz | Estilo | Ritmo | Créditos | Data |\n|---|---|---|---|---|---|\n')
        f.write(f'| {saida.name} | {a.voz} | {a.estilo} | {a.ritmo} | {creditos} | {date.today()} |\n')
    print(f'{saida.name}: {saida.stat().st_size // 1024} KB, {creditos} créditos, {seg} s')


if __name__ == '__main__':
    main()
