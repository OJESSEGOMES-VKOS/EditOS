"""O plano do vídeo no personagem: o bloco O PLANO (abaixo) vira src/tempos.json, que o render (src/base.ts), o
conferidor (scripts/conferir.py, que roda este script antes de conferir) e o som (scripts/som.py) leem.
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/plano.py

Num vídeo novo o tools/novo-video.py troca o bloco pelo começo vazio (scripts/plano_novo.py): cada frase numa cena Base
(a neutra da casa), legenda montada sozinha. Daí cada cena troca pela que a frase NOVA pede (.claude/skills/personagem).
No molde, o bloco é o do vídeo aprovado e gera o src/tempos.json dele igual, byte a byte.

Prender à fala: w('palavra', n) = quadro em que a n-ésima vez que ela é dita começa; iw(...) = o índice dela;
m('palavra', n) = a marca [índice, "palavra"] que as cenas e o som usam. Palavra que não existe: o script para e diz.
"""
import json, math, re, sys, unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parent.parent
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
FPS = 30
if not PS:
    sys.exit('src/palavras.json está vazio: transcreva a narração antes (tools/novo-video.py)')
q = lambda s: math.floor(s * FPS + 0.5)


def limpa(s):
    s = unicodedata.normalize('NFD', s.lower())
    return re.sub(r'[^a-z0-9%]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))


def iw(palavra, n=1):
    igual = lambda s: re.sub(r'[^\w%]', '', s.lower())  # com acento: "é" não é "e"
    achou = [i for i, p in enumerate(PS) if igual(p['text']) == igual(palavra)]
    if len(achou) < n:
        sys.exit(f'scripts/plano.py: a palavra "{palavra}" ({n}ª vez) não está na fala; a fala diz: '
                 + ' '.join(p['text'] for p in PS))
    return achou[n - 1]


w = lambda palavra, n=1: q(PS[iw(palavra, n)]['start'])
m = lambda palavra, n=1: [iw(palavra, n), PS[iw(palavra, n)]['text']]
FIM = q(PS[-1]['end'])  # o quadro em que a fala acaba
BASE = 'Base'  # a cena neutra da casa (src/Cenas.tsx); o começo vazio usa só ela


def cena(comp, de, linhas=None, verde=None, **extra):
    """uma ilustração: comp = o nome dela em src/Cenas.tsx (CENAS) ou src/telas/ (TELAS); de = o quadro do corte (w(...),
    no início da palavra que abre a frase). A cena vai até a próxima. linhas = a legenda dela ([[ids], ...], até 4);
    sem linhas, a legenda se monta sozinha com as palavras ditas nela. verde = ids da palavra protagonista em verde."""
    return dict(id=comp, de_q=de, _linhas=linhas, _verde=verde, **extra)


from PIL import ImageFont  # noqa: E402

_FONTE = {}
LARG = 860  # largura máxima da linha montada sozinha: a zona tem 880 px em volta do cx 500 (o do vídeo novo), menos o contorno


def larg(ids, fs=66):
    if fs not in _FONTE:
        _FONTE[fs] = ImageFont.truetype(str(AQUI / 'scripts' / 'ComicNeue-Bold.ttf'), fs)
    tx = lambda i: globals().get('TEXTO', {}).get(i, PS[i]['text'].upper())
    return sum(_FONTE[fs].getlength(tx(i)) + len(tx(i)) for i in ids) + (len(ids) - 1) * fs * 0.28


def monta(ids, fs=66):
    """quebra as palavras em linhas de até LARG px, no menor número de linhas e equilibradas (a mais larga o mais estreita
    possível, para a última não ficar com uma palavra solta)"""
    def guloso(lim):
        linhas, atual = [], []
        for i in ids:
            if atual and larg(atual + [i], fs) > lim:
                linhas.append(atual); atual = []
            atual.append(i)
        return linhas + [atual]
    n = len(guloso(LARG))
    lo, hi = max(larg([i], fs) for i in ids), LARG
    while hi - lo > 2:  # a menor largura que ainda dá o mesmo número de linhas
        mid = (lo + hi) / 2
        lo, hi = (lo, mid) if len(guloso(mid)) <= n else (mid, hi)
    return guloso(hi)


def frases():
    """o começo vazio: uma cena por frase, cortada onde o conferidor aceita. Corta depois de . ? !; frase longa demais
    para 4 linhas corta antes, o mais tarde que ainda cabe, de preferência na vírgula ou na pausa. Um corte só vale se o bloco dura >= 1,5 s e
    a última palavra fica >= 0,4 s na tela (personagem.md §5); senão a frase segue junto com a próxima."""
    ok = lambda a, k: (q(PS[k]['start']) - q(PS[a]['start'])) / FPS >= 1.5 and (q(PS[k]['start']) - q(PS[k - 1]['start'])) / FPS >= 0.4
    inis, a = [0], 0
    for i in range(1, len(PS)):
        if re.search(r'[.?!…]["”]?$', PS[i - 1]['text']) and ok(a, i):
            a = i; inis.append(a)
        if len(monta(list(range(a, i + 1)))) > 4:  # passou de 4 linhas: corta no melhor ponto que já cabe
            boas = [k for k in range(a + 1, i + 1) if ok(a, k) and len(monta(list(range(a, k)))) <= 4]
            if boas:
                nota = lambda k: (k - a) + bool(re.search(r'[,;:]$', PS[k - 1]['text'])) + PS[k]['start'] - PS[k - 1]['end']
                a = max(boas, key=nota); inis.append(a)
    return [0 if k == 0 else q(PS[i]['start']) for k, i in enumerate(inis)]


# ================================================================ O PLANO (o vídeo aprovado; num vídeo novo, o tools/novo-video.py põe aqui o scripts/plano_novo.py)
DURACAO = 912
FADE = [897, 912]
CENAS = [
    cena(comp='S1', de=0, linhas=[[0, 1, 2], [3, 4, 5], [6, 7]], o_que='editando na mesa: tela com a linha do tempo e a barra que chega a 100%'),
    cena(comp='S2', de=92, linhas=[[8, 9, 10], [11, 12, 13], [14, 15, 16], [17, 18, 19]], o_que='ele apresenta três cartões de edição diferentes, cada um sob um foco'),
    cena(comp='S3', de=202, linhas=[[20, 21, 22, 23], [24, 25, 26], [27, 28, 29], [30, 31, 32, 33]], o_que='segura o cartão verde aceso; em volta, os tipos de vídeo (microfone, câmera, claquete, celular)'),
    cena(comp='S4', de=321, linhas=[[34, 35, 36], [37, 38, 39], [40]], o_que='na cama, de noite, rolando o feed no celular (luz azul no rosto)'),
    cena(comp='S5', de=377, linhas=[[41, 42, 43], [44, 45, 46], [47]], o_que='cinco cartões apagados, só um aceso sob o foco; ele olha pra esse'),
    cena(comp='S6', de=435, linhas=[[48, 49, 50, 51], [52, 53, 54]], o_que="parede com dois focos; as prévias entram nos quadros em 'duas'; ele olha pra cima"),
    cena(comp='S7', de=514, linhas=[[55, 56, 57], [58], [59, 60, 61]], o_que="mesma parede; ele aponta pra cima em 'aqui', três setas verdes de avanço"),
    cena(comp='S8', de=600, linhas=[[62, 63, 64, 65], [66, 67]], o_que='porta fechada com luz vazando; ele com a mão na maçaneta'),
    cena(comp='S9', de=657, linhas=[[68, 69], [70, 71, 72, 73], [74, 75]], verde=[68, 69, 70, 71], o_que='porta aberta: a sala cheia de cartões verdes acesos; ele em contraluz'),
    cena(comp='S10', de=743, linhas=[[76, 77, 78, 79], [80, 81, 82]], o_que='sentado com o livro aberto brilhando, um cartão de vídeo flutuando em cima'),
    cena(comp='S11', de=803, linhas=[[85, 86, 87, 88], [89, 90, 91, 92], [93, 94, 95]], o_que='ele aponta pra baixo, para a caixa de comentário com comenta "EDIÇÃO"'),
]
PREVIAS = dict(de_q=470, ate_q=600)
MARCAS = dict(barra_cheia=m('100%'), barra_fim=m('editado'), caixa=m('comenta'), risco=m('edição', 2))
TEXTO = {83: 'COMENTA', 84: '“EDIÇÃO”'}
LEGENDA = dict(fs=66, y0=1217, passo=78)
FIXO = dict(cena='S11', linhas=[dict(ids=[83], fs=64, y=948), dict(ids=[84], fs=128, y=1042)])
# ================================================================ fim do plano

# ---------------------------------------------------------------- daqui para baixo, o modelo (não muda por vídeo)
fixos = {i for l in (FIXO or {}).get('linhas', []) for i in l['ids']}
cenas =sorted(CENAS, key=lambda c: c['de_q'])
blocos = []
for k, c in enumerate(cenas):
    c['ate_q'] = cenas[k + 1]['de_q'] if k + 1 < len(cenas) else DURACAO
    linhas, verde = c.pop('_linhas'), c.pop('_verde')
    if linhas is None:
        ids = [i for i, p in enumerate(PS) if c['de_q'] <= q(p['start']) < c['ate_q'] and i not in fixos]
        linhas = monta(ids, LEGENDA["fs"]) if ids else None
        if linhas and len(linhas) > 4:
            print(f'aviso: a cena {k + 1} ({c["id"]}, {c["de_q"] / FPS:.2f} s) tem fala demais para 4 linhas de legenda: corte a cena antes')
    vezes = sum(1 for x in cenas[:k] if x['id'].split('.')[0] == c['id'])
    if vezes:  # a mesma ilustração de novo: o id ganha um número (Base.2), o desenho é o mesmo (src/base.ts, desenho)
        c['id'] = f"{c['id']}.{vezes + 1}"
    if linhas:
        b = dict(id=f'B{len(blocos) + 1}', cena=c['id'], linhas=linhas)
        if verde:
            b['verde'] = verde
        blocos.append(b)
    if 'o_que' in c:
        c['o_que'] = c.pop('o_que')  # o_que por último, como no plano escrito à mão
T =dict(fala=' '.join(p['text'] for p in PS), fps=FPS, duracao_q=DURACAO)
if FADE:
    T['fade_q'] = FADE
T['cenas'] = cenas
if PREVIAS:
    T['previas'] = PREVIAS
if MARCAS:
    T['marcas'] = MARCAS
T['texto'] = {str(k): v for k, v in TEXTO.items()}
T['legenda'] = LEGENDA
T['blocos'] = blocos
if FIXO:
    T['fixo'] = FIXO

d = lambda x: json.dumps(x, ensure_ascii=False)
linhas = ['{']
chaves = list(T)
for j, k in enumerate(chaves):
    v, fim = T[k], ',' if j < len(chaves) - 1 else ''
    if k in ('cenas', 'blocos'):
        linhas += [f'  {d(k)}: ['] + [f'    {d(x)}' + (',' if i < len(v) - 1 else '') for i, x in enumerate(v)] + [f'  ]{fim}']
    elif k == 'marcas':
        it = list(v.items())
        linhas += [f'  {d(k)}: {{'] + [f'    {d(a)}: {d(b)}' + (',' if i < len(it) - 1 else '') for i, (a, b) in enumerate(it)] + [f'  }}{fim}']
    else:
        linhas.append(f'  {d(k)}: {d(v)}{fim}')
linhas.append('}')
(AQUI / 'src' / 'tempos.json').write_bytes(('\r\n'.join(linhas) + '\r\n').encode('utf-8'))
print(f'src/tempos.json: {len(cenas)} cenas, {len(blocos)} blocos, {DURACAO / FPS:.2f} s')
