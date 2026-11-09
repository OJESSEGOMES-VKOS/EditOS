"""Conferência do texto (BRIEF + lições de 2026-10-12), lendo src/tempos.json e src/palavras.json.
uso: ../../.venv/Scripts/python.exe scripts/conferir.py   (sai 1 se algo falhar; não grava nada)
- antes de tudo: o plano é desta fala ("fala" igual a src/palavras.json, sem contar maiúscula, acento e pontuação), os
  ids existem, cada marca cai na palavra que diz e a duração cobre a fala; se não, para dizendo o que refazer e a linha;
- toda palavra da fala aparece uma vez só, nasce no start dela (±2 quadros) e fica >= 0,4 s depois de nascer;
- bloco >= 1,5 s, máx. 4 linhas, dentro da cena dele (nada atravessa troca);
- zona segura 9:16: y 250-1500, x 60-940 (largura medida com a Sora do vídeo, scripts/Sora.ttf, no peso da linha);
- G12 (REGRAS.md, 2026-11-05): legenda padrão num lugar só (uma altura de início de bloco) e um bloco por vez (dois
  blocos nunca se sobrepõem no tempo); destaques (pílulas) todos do mesmo tamanho. A antiga "pílula só no fim de cena
  forte, no máximo 2" foi abolida: onde destacar é a G17 (relevância ao tema), decidida no plano, não aqui;
- nenhum trecho > 2,5 s sem palavra nova ou troca de cena (fora o fecho, a última cena);
- texto na tela: nenhum travessão, nenhum nome de modelo.
Adaptado do conferir.py do motion-ouro.
"""
import json, re, sys, unicodedata
from pathlib import Path
from PIL import ImageFont

AQUI = Path(__file__).resolve().parent.parent
BRUTO = (AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8')
T = json.loads(BRUTO)
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))


def linha(chave):
    """linha do src/tempos.json onde a chave aparece, para a mensagem dizer onde mexer"""
    i = BRUTO.find(chave)
    return BRUTO[:i].count('\n') + 1 if i >= 0 else '?'


onde = lambda nome: linha(f'"{nome}"')  # a chave ou o id entre aspas


def limpa(s):
    s = unicodedata.normalize('NFD', s.lower())
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))


def pare(msg):
    print('O PLANO NÃO BATE COM A FALA\n  ' + msg.replace('\n', '\n  '))
    sys.exit(1)


# ---------------------------------------------------------------- 1. o plano é desta fala?
plano = [w for w in map(limpa, T.get('fala', '').split()) if w]
fala = [w for w in (limpa(p['text']) for p in PS) if w]
if plano != fala:
    k = next((i for i, (a, b) in enumerate(zip(plano, fala)) if a != b), min(len(plano), len(fala)))
    pare(f"src/tempos.json foi feito para outra fala (campo \"fala\", linha {onde('fala')}): na palavra {k + 1} o plano tem "
         f"\"{plano[k] if k < len(plano) else '(fim)'}\" e src/palavras.json tem \"{fala[k] if k < len(fala) else '(fim)'}\".\n"
         f"Refaça o plano sobre a fala nova: \"cenas\" (linha {onde('cenas')}), \"blocos\" (linha {onde('blocos')}), \"marcas\", \"texto\", \"acordes\" e \"duracao_q\" em src/tempos.json e as telas em src/cenas.tsx (modelos/anuncio-neon/anuncio-neon.md §9),\n"
         f"e cole no campo \"fala\" o texto da fala nova: {' '.join(p['text'] for p in PS)}")
n = len(PS)
fora = []
for b in T['blocos']:
    fora += [f"bloco {b['id']} (linha {onde(b['id'])}): id {i}" for l in b['linhas'] for i in l['ids'] if not 0 <= i < n]
    if b['cena'] not in {c['id'] for c in T['cenas']}:
        fora.append(f"bloco {b['id']} (linha {onde(b['id'])}): a cena {b['cena']} não existe em \"cenas\"")
for nome, (i, palavra) in (T.get('marcas') or {}).items():
    if not 0 <= i < n:
        fora.append(f"marca \"{nome}\" (linha {onde(nome)}): id {i}")
    elif limpa(PS[i]['text']) != limpa(palavra):
        fora.append(f"marca \"{nome}\" (linha {onde(nome)}): a palavra {i} é \"{PS[i]['text']}\", não \"{palavra}\"")
if fora:
    pare(f"a fala tem {n} palavras (ids 0 a {n - 1}) e o plano aponta para o que não existe:\n" + '\n'.join(fora))
if T['duracao_q'] / T['fps'] < PS[-1]['end']:
    pare(f"\"duracao_q\" (linha {onde('duracao_q')}) = {T['duracao_q']} corta a fala, que acaba em {PS[-1]['end']:.2f} s")

# ---------------------------------------------------------------- 2. tempo, posição e zona segura
CX = 500  # centro da zona segura (x 60-940)
FPS = T['fps']
cenas = {c['id']: c for c in T['cenas']}
erros, nasc = [], []
vezes = [0] * len(PS)
q = lambda s: round(s * FPS)
txt = lambda i: T['texto'].get(str(i), PS[i]['text'])
fontes = {}
PESOS = {400: 'Regular', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold'}
def largura(s, fs, peso):
    k = (fs, peso)
    if k not in fontes:
        f = ImageFont.truetype(str(AQUI / 'scripts' / 'Sora.ttf'), fs); f.set_variation_by_name(PESOS[peso]); fontes[k] = f
    ls = -0.045 if fs > 90 else -0.025  # letter-spacing do src/texto.tsx
    return fontes[k].getlength(s) + ls * fs * len(s)

tops, pilulas = set(), set()
for b in T['blocos']:
    c = cenas[b['cena']]
    de = b.get('de_q', c['de_q']); ate = b.get('ate_q', c['ate_q'])
    ids = [i for l in b['linhas'] for i in l['ids']]
    pri = max(de, q(PS[ids[0]]['start']))
    if (ate - pri) / FPS < 1.5 - 1e-6: erros.append(f"{b['id']}: bloco {(ate - pri) / FPS:.2f} s (< 1,5): junte com o bloco vizinho")
    if len(b['linhas']) > 4: erros.append(f"{b['id']}: {len(b['linhas'])} linhas")
    if ate > c['ate_q'] or de < c['de_q']: erros.append(f"{b['id']}: atravessa a troca da cena {c['id']}")
    leg = [l for l in b['linhas'] if not l.get('tipo') and l['y'] >= 1100]
    if leg: tops.add(leg[0]['y'])
    for l in b['linhas']:
        s = ' '.join(txt(i) for i in l['ids']); fs = l['fs']
        w = largura(s, fs, l['peso'])
        if l.get('tipo') == 'pilula': w += 2 * 0.42 * fs + 8; pilulas.add(fs)
        x0 = CX - w / 2; x1 = CX + w / 2
        meia = fs * (0.62 if l.get('tipo') != 'pilula' else 0.85)
        y0 = l['y'] - meia; y1 = l['y'] + meia
        if x0 < 60 or x1 > 940: erros.append(f"{b['id']}: '{s}' x {x0:.0f}-{x1:.0f} fora da zona: quebre a linha ou diminua o fs")
        if y0 < 250 or y1 > 1500: erros.append(f"{b['id']}: '{s}' y {y0:.0f}-{y1:.0f} fora da zona")
        if '—' in s: erros.append(f"{b['id']}: travessão em '{s}'")
        for i in l['ids']:
            vezes[i] += 1
            n = max(de, q(PS[i]['start']))
            d = n - PS[i]['start'] * FPS
            if abs(d) > 2: erros.append(f"{b['id']}: '{txt(i)}' nasce {n / FPS:.2f} s, dita {PS[i]['start']:.2f} ({d:+.1f} q): o bloco começa tarde demais")
            if (ate - n) / FPS < 0.4 - 1e-6: erros.append(f"{b['id']}: '{txt(i)}' fica {(ate - n) / FPS:.2f} s (< 0,4): estique o bloco ou passe a palavra para o bloco seguinte")
            nasc.append(n)
for i, v in enumerate(vezes):
    if v != 1: erros.append(f"palavra {i} '{PS[i]['text']}' aparece {v}x")
if len(tops) > 1: erros.append(f"legenda em {len(tops)} alturas {sorted(tops)}: G12, um lugar só (o padrão é y 1170)")
# G12: um bloco por vez
ini = lambda b: b.get('de_q', cenas[b['cena']]['de_q'])
fim = lambda b: b.get('ate_q', cenas[b['cena']]['ate_q'])
fecho = T['cenas'][-1]['id']
pilula = lambda b: any(l.get('tipo') == 'pilula' for l in b['linhas'])
# o comando fixo do fecho (bloco com pílula na última cena) é o único que fica junto da legenda
blocos = sorted((b for b in T['blocos'] if not (b['cena'] == fecho and pilula(b))), key=ini)
for a, b2 in zip(blocos, blocos[1:]):
    if ini(b2) < fim(a): erros.append(f"{a['id']} e {b2['id']}: dois blocos na tela ao mesmo tempo (G12: um bloco por vez)")
if len(pilulas) > 1: erros.append(f"destaques de tamanhos diferentes: {sorted(pilulas)}")
ev = sorted(set(nasc + [c['de_q'] for c in T['cenas']]))
for a, b2 in zip(ev, ev[1:]):
    if b2 <= T['cenas'][-1]['de_q'] and (b2 - a) / FPS > 2.5: erros.append(f"{a / FPS:.2f}-{b2 / FPS:.2f} s sem evento novo")
todo = ' '.join(txt(i) for i in range(len(PS))).lower()
for nome in ('anunciomotion', 'sofistmotion', 'profissional0', 'modelodinamico', 'superpodcast'):
    if nome in todo: erros.append(f"nome de modelo no texto: {nome}")
print(f"{len(erros)} erros | alturas da legenda {sorted(tops)} | pílulas {sorted(pilulas)}")
for e in erros: print('  ' + e)
sys.exit(1 if erros else 0)
