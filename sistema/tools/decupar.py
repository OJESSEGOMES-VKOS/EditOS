"""Decupagem: divide a fala de um vídeo em cenas e subcenas, a base dos modos semiautomático e automático (G14, G28,
sistema/cenas/METODO.md §6).

uso (de dentro de sistema/):
  .venv/Scripts/python.exe tools/decupar.py oficina/<pasta>              decupa e mostra a lista numerada
  .venv/Scripts/python.exe tools/decupar.py oficina/<pasta> --refazer    decupa de novo (apaga as respostas já escritas)
  .venv/Scripts/python.exe tools/decupar.py oficina/<pasta> --lista      só mostra a lista (com as respostas)
  .venv/Scripts/python.exe tools/decupar.py oficina/<pasta> --conferir   cobra resposta em toda cena e nome que existe
  .venv/Scripts/python.exe tools/decupar.py oficina/<pasta> --plano      conferir + grava o plano de cenas no plano.md

A regra da demarcação (o dono: "uma vírgula ou um ponto, mesmo que imaginário"):
  cena    termina em ponto (. ? ! …) ou numa pausa longa sem pontuação (ponto imaginário, >= PAUSA_PONTO s);
  subcena termina em vírgula (, ; : —) ou numa pausa média sem pontuação (vírgula imaginária, >= PAUSA_VIRGULA s);
  trecho longo demais sem marca nenhuma (> LONGA s) ganha uma vírgula imaginária na maior pausa de dentro, ou antes
  de um conectivo (e, mas, porque, que, então...) perto do meio;
  pedaço curto demais (1 palavra ou < CURTA s, como "Ah,") se junta ao seguinte da mesma cena: tela não troca no meio
  de uma ideia nem fica pela metade.
Grava <pasta>/cenas.json: a lista de cenas com tempo, fala, a marca que fechou cada uma e a resposta de cada cena
(o assistente escreve as respostas: o pedido do dono no modo semiautomático, a escolha dele no automático).
Também guarda o modo de material do vídeo (G7): material = so-materiais (padrão) | livre | indicado, e em indicado a lista
em material_permitido (ex.: "materiais + API").
E o fundo (G6): fundo = real (padrão: o vídeo normal da pessoa, fundo de verdade) | desfoque (desfoque leve)
| recorte (pessoa recortada sobre outro fundo); desfoque e recorte só a pedido, com as palavras do dono em fundo_pedido.

O --conferir também cobra as telas (G19, G29, G30) (vídeo com a pessoa na tela, src/rosto.json com rosto):
  resposta que começa com "rosto", "legenda", "base", "pessoa" ou "vídeo normal" é o vídeo normal; qualquer outra é TELA;
  toda tela leva no porquê a relevância do trecho ao tema ou o pedido do dono ("pedido do dono: ..."); e a cena 1
  é sempre a gravação original (G29), salvo pedido do dono.
"""
import argparse, json, re, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows

RAIZ = Path(__file__).resolve().parents[1]  # sistema/
PAUSA_PONTO, PAUSA_VIRGULA, LONGA, CURTA = 0.80, 0.45, 6.0, 0.6
PONTO, VIRGULA = re.compile(r'[.?!…]["”»)]*$'), re.compile(r'[,;:—–]["”»)]*$')
# nunca termina um pedaço (artigo, preposição, pronome que pede o que vem depois)
PRESOS = {'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
          'pelo', 'pela', 'com', 'por', 'ao', 'à', 'esse', 'essa', 'este', 'esta', 'desse', 'dessa', 'deste', 'desta',
          'meu', 'minha', 'seu', 'sua', 'nosso', 'nossa', 'mais', 'muito', 'muita', 'pra', 'para', 'que', 'e', 'mas', 'se'}
CONECTIVOS = {'e', 'mas', 'porque', 'que', 'então', 'pra', 'para', 'quando', 'se', 'só', 'aí', 'ou', 'como', 'porém'}

ap = argparse.ArgumentParser()
ap.add_argument('pasta')
ap.add_argument('--refazer', action='store_true')
ap.add_argument('--lista', action='store_true')
ap.add_argument('--conferir', action='store_true')
ap.add_argument('--plano', action='store_true')
a = ap.parse_args()

pasta = Path(a.pasta).resolve()
arq = pasta / 'cenas.json'


def marca(w: dict, prox: dict | None) -> str | None:
    t = w['text'].strip()
    if PONTO.search(t) and not re.fullmatch(r'\d+\.', t if prox is None else ''):
        return '.'
    if VIRGULA.search(t):
        return ','
    if prox is None:
        return '.'
    gap = prox['start'] - w['end']
    return 'pausa.' if gap >= PAUSA_PONTO else 'pausa,' if gap >= PAUSA_VIRGULA else None


def partir_longa(ws: list, i0: int, i1: int) -> list[tuple[int, int]]:
    """Corta um trecho [i0, i1] longo demais em pedaços <= LONGA, na maior pausa ou antes de um conectivo."""
    if ws[i1]['end'] - ws[i0]['start'] <= LONGA or i1 - i0 < 3:
        return [(i0, i1)]
    meio = (ws[i0]['start'] + ws[i1]['end']) / 2
    def nota(k):  # corte antes da palavra k
        antes, depois = ws[k - 1]['text'].strip().lower(), ws[k]['text'].strip()
        if antes in PRESOS or depois[:1] in '.,;:%' or (antes[-1:].isdigit() and depois[:1].isdigit()):
            return -99  # nunca separa artigo do nome nem parte um número ("5 .5")
        gap = ws[k]['start'] - ws[k - 1]['end']
        con = ws[k]['text'].strip().lower().strip('"“') in CONECTIVOS
        return gap * 4 + (0.25 if con else 0) - abs(ws[k]['start'] - meio) / (LONGA * 2)
    k = max(range(i0 + 1, i1), key=nota)
    return partir_longa(ws, i0, k - 1) + partir_longa(ws, k, i1)


def decupar(ws: list) -> list[dict]:
    pedacos, ini = [], 0  # [i0, i1, marca]
    for i, w in enumerate(ws):
        m = marca(w, ws[i + 1] if i + 1 < len(ws) else None)
        if m:
            partes = partir_longa(ws, ini, i)
            pedacos += [[j0, j1, 'longa'] for j0, j1 in partes[:-1]] + [[partes[-1][0], i, m]]
            ini = i + 1
    # curto demais junta com o seguinte da mesma cena (nunca atravessa um ponto)
    out = []
    for p in pedacos:
        if out and out[-1][2] not in ('.', 'pausa.') and (out[-1][1] == out[-1][0] or ws[out[-1][1]]['end'] - ws[out[-1][0]]['start'] < CURTA):
            out[-1][1], out[-1][2] = p[1], p[2]
        else:
            out.append(p)
    if len(out) > 1 and out[-1][1] == out[-1][0] and out[-2][2] not in ('.', 'pausa.'):
        out[-2][1], out[-2][2] = out[-1][1], out[-1][2]; out.pop()
    cenas, n, sub = [], 1, 1
    for i0, i1, m in out:
        cenas.append({'id': f'{n}.{sub}', 'cena': n, 'de': round(ws[i0]['start'], 2), 'ate': round(ws[i1]['end'], 2),
                      'fala': ' '.join(w['text'].strip() for w in ws[i0:i1 + 1]), 'palavras': [i0, i1],
                      'marca': {'.': 'ponto', ',': 'vírgula', 'pausa.': 'ponto imaginário (pausa)',
                                'pausa,': 'vírgula imaginária (pausa)', 'longa': 'vírgula imaginária (trecho longo)'}[m or 'longa'],
                      'resposta': None, 'por_que': None})
        if m in ('.', 'pausa.'):
            n, sub = n + 1, 1
        else:
            sub += 1
    # cena de uma subcena só vira "3", não "3.1"
    for c in cenas:
        if sum(1 for x in cenas if x['cena'] == c['cena']) == 1:
            c['id'] = str(c['cena'])
    return cenas


def seg(x: float) -> str:
    return f'{x:.1f}'.replace('.', ',')


MATERIAL = {'so-materiais': 'só materiais', 'livre': 'livre', 'indicado': 'indicado'}  # G7
FUNDO = {'real': 'real', 'desfoque': 'desfoque leve', 'recorte': 'recorte'}  # G6
ROSTO_RESP = re.compile(r'^\s*(rosto|legenda|base|pessoa|v[íi]deo normal)', re.I)  # G6: o vídeo normal
PEDIDO = re.compile(r'pedido do dono|dono pediu|a pedido', re.I)


def lista(d: dict) -> str:
    linhas = []
    for c in d['cenas']:
        rec = '   ' if '.' in c['id'] and not c['id'].endswith('.1') else ''
        r = f"  →  {c['resposta']}" if c.get('resposta') else ''
        imag = ' (imaginária)' if 'imagin' in c['marca'] else ''
        linhas.append(f"{rec}{c['id']:<5}  {seg(c['de'])}–{seg(c['ate'])} s  {c['fala']}{imag}{r}")
    cab = [f"{len({c['cena'] for c in d['cenas']})} cenas, {len(d['cenas'])} trechos"]
    cab.append('material: ' + MATERIAL.get(d.get('material') or 'so-materiais', '?') + (f" ({d['material_permitido']})" if d.get('material_permitido') else ''))
    cab.append('fundo: ' + FUNDO.get(d.get('fundo') or 'real', '?'))
    for k, nome in (('casa', 'casa'), ('legenda_base', 'legenda base'), ('modo', 'modo')):
        if d.get(k):
            cab.append(f'{nome}: {d[k]}')
    return ' · '.join(cab) + '\n' + '\n'.join(linhas)


MODELOS = {p.name for p in (RAIZ / 'modelos').iterdir() if p.is_dir()}
sys.path.insert(0, str(Path(__file__).resolve().parent))
from nomes import ANTIGOS  # noqa: E402
MODELOS |= {k for k, v in ANTIGOS.items() if v in MODELOS}
ESTILOS = {p.name for p in (RAIZ / 'cenas' / 'estilos').iterdir() if p.is_dir()} if (RAIZ / 'cenas' / 'estilos').is_dir() else set()


def conferir(d: dict) -> list[str]:
    erros = []
    for c in d['cenas']:
        r = (c.get('resposta') or '').strip()
        if not r:
            erros.append(f"cena {c['id']}: sem resposta")
            continue
        nomes = re.findall(r'\b(cena\d{2}|cena\d{2}|[a-z0-9-]+\d{2})\b', r)
        for nm in nomes:
            nm = ANTIGOS.get(nm, nm)
            if nm.startswith('cena') and nm not in ESTILOS:
                erros.append(f"cena {c['id']}: {nm} não existe em cenas/estilos/")
            elif not nm.startswith('cena') and nm not in MODELOS:
                erros.append(f"cena {c['id']}: o modelo {nm} não existe em modelos/")
        if not c.get('por_que'):
            erros.append(f"cena {c['id']}: sem o porquê")
    mat = d.get('material') or 'so-materiais'
    if mat not in MATERIAL:
        erros.append(f"material: '{mat}' não existe (so-materiais, livre ou indicado)")
    elif mat == 'indicado' and not d.get('material_permitido'):
        erros.append("material indicado sem a lista do que pode (material_permitido): pergunte ao dono o que vale")
    elif mat == 'so-materiais':  # nenhuma cena pode depender de coisa gerada ou buscada
        for c in d['cenas']:
            if re.search(r'\b(gerad|kie|busc|online|api\b|banco de imagens)', (c.get('resposta') or '') + ' ' + (c.get('por_que') or ''), re.I):
                erros.append(f"cena {c['id']}: fala de material gerado ou buscado, mas o modo é só materiais (G7)")
    fundo = d.get('fundo') or 'real'
    if fundo not in FUNDO:
        erros.append(f"fundo: '{fundo}' não existe (real, desfoque ou recorte)")
    elif fundo != 'real' and not d.get('fundo_pedido'):
        erros.append(f"fundo {fundo} sem pedido do dono (G6: o padrão é o fundo real; escreva as palavras dele em fundo_pedido)")
    erros += conferir_telas(d)
    for k in ('casa', 'legenda_base'):
        if d.get(k) and d[k] not in MODELOS:
            erros.append(f'{k}: o modelo {d[k]} não existe')
    # a mesma resposta cheia (estilo de cena) em duas cenas seguidas só com motivo escrito
    for x, y in zip(d['cenas'], d['cenas'][1:]):
        if x.get('resposta') and x['resposta'] == y.get('resposta') and re.search(r'\bcena\d\d', x['resposta']) and 'mesma' not in (y.get('por_que') or ''):
            erros.append(f"cenas {x['id']} e {y['id']}: o mesmo estilo seguido sem motivo (escreva 'mesma cena porque...' no porquê)")
    return erros


def com_rosto() -> bool:
    r = pasta / 'src' / 'rosto.json'
    try:
        return any(x and len(x) >= 4 and x[3] > 0 for x in json.loads(r.read_text(encoding='utf-8')))
    except (OSError, ValueError):
        return False


def conferir_telas(d: dict) -> list[str]:
    """G19/G28/G29/G30: toda tela que não é a gravação tem porquê ligado à fala; o vídeo abre na gravação original."""
    cs = d['cenas']
    if not cs or not com_rosto():
        return []  # vídeo sem a pessoa na tela (narração, 3D): a G29 não se aplica
    tela = lambda c: bool((c.get('resposta') or '').strip()) and not ROSTO_RESP.match(c['resposta'])
    pedido = lambda c: bool(PEDIDO.search(c.get('por_que') or ''))
    erros = []
    # G29: o vídeo começa na gravação original, com ênfase no gancho
    for c in cs:
        if c['cena'] == cs[0]['cena'] and tela(c) and not pedido(c):
            erros.append(f"cena {c['id']}: o vídeo abre numa tela (G29: começa na gravação original, dando ênfase ao gancho)")
    # G19/G30: tela fora da gravação só com porquê da fala (relevância ao tema) ou pedido do dono
    for c in cs:
        if tela(c) and len((c.get('por_que') or '').strip()) < 8:
            erros.append(f"cena {c['id']}: tela sem porquê (G19/G30: diga a relevância do trecho ao tema ou o pedido do dono)")
    return erros


def plano(d: dict) -> str:
    t = ['## Plano de cenas', '',
         f"Modo: {d.get('modo') or '-'} · casa: {d.get('casa') or '-'} · legenda base: {d.get('legenda_base') or 'a da casa'}"
         f" · material: {MATERIAL.get(d.get('material') or 'so-materiais', '?')}"
         + (f" ({d['material_permitido']})" if d.get('material_permitido') else '')
         + f" · fundo: {FUNDO.get(d.get('fundo') or 'real', '?')}", '',
         '| Cena | Tempo | Fala | Resposta | Por quê |', '|---|---|---|---|---|']
    for c in d['cenas']:
        t.append(f"| {c['id']} | {seg(c['de'])}–{seg(c['ate'])} s | {c['fala']} | {c['resposta']} | {c['por_que']} |")
    return '\n'.join(t) + '\n'


if a.lista or a.conferir or a.plano:
    if not arq.exists():
        sys.exit(f'não existe {arq}: rode primeiro sem opção para decupar')
    d = json.loads(arq.read_text(encoding='utf-8'))
    print(lista(d))
    if a.conferir or a.plano:
        erros = conferir(d)
        if erros:
            print('\nREPROVADO:\n- ' + '\n- '.join(erros))
            sys.exit(1)
        print('\nAPROVADO: toda cena tem resposta e porquê, todo nome existe, e o fundo e as telas seguem a G6, G19, G29 e G30')
    if a.plano:
        pl = pasta / 'plano.md'
        txt = pl.read_text(encoding='utf-8') if pl.exists() else ''
        bloco = plano(d)
        if '## Plano de cenas' in txt:
            txt = re.sub(r'## Plano de cenas\n.*?(?=\n## |\Z)', lambda _: bloco.rstrip('\n'), txt, count=1, flags=re.S)
        else:
            txt = bloco + ('\n' + txt if txt else '')
        pl.write_text(txt, encoding='utf-8')
        print('plano de cenas gravado em', pl)
    sys.exit(0)

if arq.exists() and not a.refazer:
    sys.exit(f'{arq} já existe (com as respostas). --lista para ver, --refazer para decupar de novo do zero')
pal = pasta / 'src' / 'palavras.json'
if not pal.exists():
    sys.exit(f'não achei {pal}: rode primeiro tools/novo-video.py')
# dois formatos no estúdio: {text,start,end} (preparar.py) e {w,s,e} (vídeos de narração)
ws = [{'text': w.get('text', w.get('w', '')), 'start': w.get('start', w.get('s')), 'end': w.get('end', w.get('e'))}
      for w in json.loads(pal.read_text(encoding='utf-8'))]
ws = [w for w in ws if w['text'].strip()]
d = {'modo': None, 'casa': None, 'legenda_base': None, 'material': 'so-materiais', 'material_permitido': None,
     'fundo': 'real', 'fundo_pedido': None,
     'cenas': decupar(ws)}
arq.write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(lista(d))
print('\ngravado em', arq)
