"""O ponto certo: mapa da gravação longa para escolher o trecho do corte (cortepalestra01.md, seção 3).

Lê base/palavras.json (a gravação INTEIRA, transcrita pelo tools/novo-video.py), quebra em frases numeradas e marca o que
o modelo procura. Não decide sozinho: mostra o mapa e as janelas candidatas; quem escolhe é você, lendo as frases.
Grava base/frases.json (as frases numeradas), que o scripts/recortar.py usa.

uso (na pasta do vídeo):  ../../.venv/Scripts/python.exe scripts/ponto.py [--min 45] [--max 75] [--mostrar 6]

Marcas de cada frase (todas mecânicas, tiradas do texto e dos tempos):
  P  pergunta (termina em "?")                    V  fala com quem assiste (você, seu, sua, te...)
  N  contradição/negação na 1ª palavra (Não, Nunca, Ninguém, Pare, Esqueça) ou "mas" no meio
  S  sentença curta (até 8 palavras): candidata a frase que vale sozinha (R6)
  R5 pergunta seguida de pausa >= 0,6 s (a pergunta retórica que segura a atenção)
  C  começa em continuação (e, então, aí, porque, isso, mas, que, ou...): não serve de 1ª frase
  F  fecha bem: termina em ponto, a palavra final não é fraca (né, amém, tá, então...) e vem pausa >= 0,6 s depois
  Q  tomada quebrada: uma palavra "esticada" (> 1,5 s) é silêncio ou tropeço que o transcritor colou nela; ouça antes
  X  tomada repetida: a frase é refeita logo adiante (quase as mesmas palavras, ou a 1ª parou no meio e a seguinte
     recomeça igual); fica a última tomada. Paralelismo (R7) começa igual mas muda as palavras de peso: não é X. Confira.
A duração conta a fala e as pausas até PAUSA_MAX (1,2 s); pausa maior vira emenda no recortar.py e não conta.
"""
import argparse, json, re, sys, unicodedata
PAUSA_MAX = 1.2  # o mesmo do scripts/recortar.py
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument('--min', type=float, default=45.0, help='duração mínima do corte (s)')
ap.add_argument('--max', type=float, default=75.0, help='duração máxima do corte (s)')
ap.add_argument('--mostrar', type=int, default=6, help='quantas janelas candidatas mostrar')
a = ap.parse_args()

arq = AQUI / 'base' / 'palavras.json'
if not arq.exists():
    sys.exit('falta base/palavras.json: crie o vídeo com tools/novo-video.py (ele transcreve a gravação inteira em base/).')
PS = json.loads(arq.read_text(encoding='utf-8'))


def norm(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9%]', '', s.lower())


VOCE = {'voce', 'voces', 'seu', 'sua', 'seus', 'suas', 'te', 'tu', 'teu', 'tua', 'contigo', 'vc'}
NEGA = {'nao', 'nunca', 'ninguem', 'pare', 'esqueca', 'nada', 'jamais'}
CONT = {'e', 'entao', 'ai', 'porque', 'isso', 'mas', 'que', 'ou', 'tambem', 'inclusive', 'alem', 'bom', 'tipo', 'dai', 'pois'}
FRACA = {'ne', 'amem', 'ta', 'entao', 'ok', 'ai', 'assim', 'entendeu', 'beleza', 'certo', 'tipo', 'aqui', 'gente', 'viu'}

# frases: quebra no . ? ! … colado na palavra
frases, cur = [], []
for i, p in enumerate(PS):
    cur.append(i)
    if re.search(r'[.?!…]["”»)]*$', p['text'].strip()) or i == len(PS) - 1:
        frases.append(cur)
        cur = []
F = []
for n, ids in enumerate(frases):
    ws = [PS[i] for i in ids]
    txt = ' '.join(w['text'].strip() for w in ws)
    nw = [norm(w['text']) for w in ws]
    antes = ws[0]['start'] - PS[ids[0] - 1]['end'] if ids[0] else ws[0]['start']
    depois = PS[ids[-1] + 1]['start'] - ws[-1]['end'] if ids[-1] + 1 < len(PS) else 9.9
    m = []
    if txt.rstrip('"”») ').endswith('?'):
        m.append('P')
        if depois >= 0.6:
            m.append('R5')
    if VOCE & set(nw):
        m.append('V')
    if nw[0] in NEGA or 'mas' in nw[1:]:
        m.append('N')
    if len(ws) <= 8:
        m.append('S')
    if nw[0] in CONT:
        m.append('C')
    if txt.rstrip('"”») ').endswith(('.', '!')) and nw[-1] not in FRACA and depois >= 0.6:
        m.append('F')
    if any(w['end'] - w['start'] > 1.5 for w in ws):
        m.append('Q')
    util = (ws[-1]['end'] - ws[0]['start']) - sum(max(0, b['start'] - x['end'] - PAUSA_MAX) for x, b in zip(ws, ws[1:]))         - sum(max(0, w['end'] - w['start'] - 1.5) for w in ws)
    F.append(dict(n=n + 1, de=ws[0]['start'], ate=ws[-1]['end'], util=round(util, 2), i0=ids[0], i1=ids[-1], antes=round(antes, 2),
                  depois=round(depois, 2), texto=txt, marcas=m, nw=nw))
# tomada repetida: numa das 3 frases seguintes, quase as mesmas palavras (Jaccard >= 0,7), ou esta parou no meio
# ("...", ou é o começo da outra) e a outra recomeça igual (3 primeiras palavras, 1 numa frase de uma palavra só)
for k, f in enumerate(F):
    for g in F[k + 1:k + 4]:
        if 'Q' in g['marcas']:  # a tomada seguinte quebrou: esta pode ser a boa
            continue
        sa, sb = set(f["nw"]), set(g["nw"])
        jac = len(sa & sb) / max(1, len(sa | sb))
        n = min(3, len(f['nw']), len(g['nw']))
        parou = f['texto'].rstrip().endswith(('...', '…')) or f['nw'] == g['nw'][:len(f['nw'])]
        if jac >= 0.7 or (parou and f['nw'][:n] == g['nw'][:n]):
            f['marcas'].append('X')
            f['refeita'] = g['n']
            break
(AQUI / 'base' / 'frases.json').write_text(json.dumps([{k: v for k, v in f.items() if k != 'nw'} for f in F], ensure_ascii=False, indent=1), encoding='utf-8')

dur = PS[-1]['end']
fala = sum(p['end'] - p['start'] for p in PS)
print(f'gravação: {dur:.1f} s, {len(PS)} palavras, {len(F)} frases, {len(PS) / max(fala, 0.1):.2f} palavras/s de fala\n')
print('  #   início    fim  fala  pausa  marcas        frase')
for f in F:
    print(f"{f['n']:3d} {f['de']:7.2f} {f['ate']:6.2f} {f['util']:5.1f} {f['antes']:5.2f}  {' '.join(f['marcas']):12s}  {f['texto']}"
          + (f"   [refeita na #{f['refeita']}]" if 'refeita' in f else ''))

# janelas: começa numa frase que não é continuação nem tomada descartada, acaba numa F; dentro, as tomadas X saem
cands = []
for i, s in enumerate(F):
    if 'C' in s['marcas'] or 'X' in s['marcas'] or 'Q' in s['marcas']:
        continue
    for j in range(i, len(F)):
        e = F[j]
        if 'F' not in e['marcas'] or 'X' in e['marcas'] or 'Q' in e['marcas']:
            continue
        dentro = [f for f in F[i:j + 1] if 'X' not in f['marcas'] and 'Q' not in f['marcas']]
        # duração do corte: das frases mantidas, com a pausa natural entre frases seguidas (até 1,2 s; mais que isso é corte)
        d = sum(f['util'] for f in dentro) + sum(min(b['antes'], PAUSA_MAX) for x, b in zip(dentro, dentro[1:]) if b['n'] == x['n'] + 1)
        if d > a.max:
            break
        if d < a.min:
            continue
        emendas = sum(1 for x, b in zip(dentro, dentro[1:]) if b['n'] != x['n'] + 1 or b['antes'] > PAUSA_MAX)
        gancho = sum(k in s['marcas'] for k in ('P', 'V', 'N')) * 2 + ('S' in s['marcas'])
        corpo = sum('S' in f['marcas'] for f in dentro) + 2 * sum('R5' in f['marcas'] for f in dentro)
        pts = gancho * 3 + corpo - emendas
        cands.append((pts, s['n'], e['n'], d, emendas, gancho, corpo, [f['n'] for f in dentro]))
cands.sort(key=lambda c: (-c[0], c[3]))
print(f'\njanelas de {a.min:.0f} a {a.max:.0f} s (começo sem C, fim em F, tomadas X fora). Pontos = 3 x gancho (P/V/N valem 2, S vale 1)'
      ' + sentenças curtas e pausas retóricas dentro - emendas. Os pontos só ordenam: leia as frases e decida.')
if not cands:
    print('  nenhuma janela: o pensamento mais longo da gravação é mais curto que o mínimo. Rode com --min menor (o corte tem o'
          ' tamanho do pensamento, nunca se enche) ou junte frases à mão no trecho.json.')
for c in cands[:a.mostrar]:
    print(f'  {c[0]:3d} pts  #{c[1]} a #{c[2]}  {c[3]:5.1f} s  {c[4]} emenda(s)  frases {c[7]}')
if cands:
    print(f'\npara cortar a 1ª: escreva trecho.json na pasta do vídeo com {{"frases": {cands[0][7]}}} (ou a sua escolha) e rode'
          ' scripts/recortar.py pela trava.')
