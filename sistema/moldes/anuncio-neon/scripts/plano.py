"""O PLANO do vídeo no anuncio-neon: este script escreve src/tempos.json (o arquivo que o vídeo, o conferir.py e o
som.py leem). Nunca edite src/tempos.json à mão: mude o bloco "O PLANO" abaixo e rode de novo.

uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/plano.py   (depois: scripts/conferir.py)

O vídeo novo nasce com o bloco "O PLANO" vazio (scripts/plano_novo.py, posto aqui pelo tools/novo-video.py): cada cena
entra porque a fala nova pediu (.claude/skills/anuncio-neon/SKILL.md e modelos/anuncio-neon/anuncio-neon.md §4 e §9).

As ajudas para prender o plano à fala (src/palavras.json):
  i('palavra', n)   índice da n-ésima vez que a palavra é dita (para os "ids" das linhas)
  ids(a, b)         os índices de a até b, inclusive (ids(i('Ele'), i('para')))
  p('palavra', n)   uma marca: [índice, 'palavra']
  ini('palavra', n) o quadro em que a palavra começa; fim('palavra', n) o quadro em que ela acaba; q(segundos) em quadros
  FALA o texto da fala; DUR o fim da última palavra (s); FPS 30
As peças do plano:
  cena('S3', de_q, ate_q, CORTE | BORRAO | IRIS, fundo=ESCURO | CLARO)   uma tela da casa (S1 a S10, src/cenas.tsx);
                                                uma por linha: S3 = cena('S3', ...)   (o tools/clone.py lê o nome da linha)
  livre(comp='Nome', de_q=..., ate_q=..., entrada=CORTE, fundo=ESCURO)   uma tela nova, desenhada em src/telas/Nome.tsx
  bloco('B1', 'S3', linhas=[linha(ids, fs, y, peso=400 | 800, marca=[...], tipo=CONTADOR | PILULA)], de_q=..., ate_q=...)
Use as constantes em maiúscula (nunca a palavra entre aspas): o tools/clone.py confunde texto entre aspas com texto de tela.
"""
import json, re, sys, unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parent.parent
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
if not PS:
    sys.exit('src/palavras.json está vazio: transcreva a fala antes (tools/novo-video.py)')
FPS = 30
FALA = ' '.join(x['text'] for x in PS)
DUR = PS[-1]['end']

# as entradas de cena, os fundos e os tipos de linha
CORTE, BORRAO, IRIS = 'corte', 'borrao', 'iris'
ESCURO, CLARO = 'escuro', 'claro'
CONTADOR, PILULA = 'contador', 'pilula'


def limpa(s):
    s = unicodedata.normalize('NFD', s.lower())
    return re.sub(r'[^a-z0-9%]', '', ''.join(c for c in s if not unicodedata.combining(c)))


def i(palavra, n=1):
    k = 0
    for j, x in enumerate(PS):
        if limpa(x['text']) == limpa(palavra):
            k += 1
            if k == n:
                return j
    sys.exit(f'scripts/plano.py: o plano pede a {n}ª vez que se diz "{palavra}", e a fala {"só tem " + str(k) if k else "não tem nenhuma"}. '
             'O plano é sempre da fala de src/palavras.json.')


ids = lambda a, b: list(range(a, b + 1))
p = lambda palavra, n=1: [i(palavra, n), palavra]
q = lambda s: round(s * FPS)
ini = lambda palavra, n=1: q(PS[i(palavra, n)]['start'])
fim = lambda palavra, n=1: q(PS[i(palavra, n)]['end'])


def cena(id, de_q, ate_q, entrada, fundo=ESCURO):
    return {'id': id, 'de_q': de_q, 'ate_q': ate_q, 'fundo': fundo, 'entrada': entrada}


def livre(comp, de_q, ate_q, entrada, fundo=ESCURO):
    return cena(comp, de_q, ate_q, entrada, fundo)


def linha(ids_, fs, y, peso=400, **kw):
    return {'ids': list(ids_), 'fs': fs, 'peso': peso, 'y': y, **kw}


def bloco(id, cena_, linhas, **kw):
    return {'id': id, 'cena': cena_, **kw, 'linhas': linhas}


fala, duracao_q, escurece, virada, acordes, cenas, previas, marcas, texto, blocos = (None,) * 10

# O PLANO (o do vídeo aprovado: a fala "100% editado pelo Claude"; num vídeo novo o tools/novo-video.py troca este bloco pelo scripts/plano_novo.py)
fala = 'Esse vídeo está sendo 100% editado pelo Claude. Ele foi criado justamente para te mostrar a diferença entre vários modelos que eu criei e melhorei para editar qualquer tipo de vídeo usando o Claude. Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos. Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. Mas se você quiser realmente ver outros modelos de edição como esse e aprender a como usar isso nos seus vídeos, comenta edição aqui embaixo que eu vou te mandar na sua DM agora.'
duracao_q = 930
escurece = True
virada = 'S7'
acordes = [0.0, 'S3', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10']
S1 = cena('S1', 0, 92, CORTE, fundo=ESCURO)
S2 = cena('S2', 92, 137, CORTE, fundo=CLARO)
S3 = cena('S3', 137, 243, CORTE, fundo=ESCURO)
S4 = cena('S4', 243, 321, BORRAO, fundo=ESCURO)
S5 = cena('S5', 321, 377, BORRAO, fundo=ESCURO)
S6 = cena('S6', 377, 435, CORTE, fundo=CLARO)
S7 = cena('S7', 435, 600, IRIS, fundo=ESCURO)
S8 = cena('S8', 600, 743, BORRAO, fundo=ESCURO)
S9 = cena('S9', 743, 803, CORTE, fundo=CLARO)
S10 = cena('S10', 803, 930, IRIS, fundo=ESCURO)
cenas = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]
previas = dict(de_q=470, ate_q=600)
marcas = dict(
    inicio=p('Esse'),
    cem=p('100%'),
    clipe1=p('Ele'),
    clipe2=p('foi'),
    clipe3=p('criado'),
    clipe4=p('justamente'),
    clipe5=p('para'),
    placa1=p('diferença'),
    placa2=p('vários'),
    placa3=p('modelos'),
    melhorei=p('melhorei'),
    orbita1=p('qualquer'),
    orbita2=p('tipo'),
    orbita3=p('vídeo', 2),
    orbita4=p('usando'),
    coracao=p('Instagram'),
    apenas=p('apenas'),
    um=p('um'),
    setas=p('aqui'),
    aceleradas=p('aceleradas'),
    outros=p('outros'),
    pilula1=p('modelos', 3),
    pilula2=p('de', 2),
    pilula3=p('edição'),
    usar=p('usar'),
    videos=p('vídeos'),
    edicao=p('edição', 2),
    embaixo=p('embaixo'),
)
texto = {84: '“EDIÇÃO”'}
blocos = [
    bloco('B1', 'S1', linhas=[
        linha([0, 1, 2, 3], 60, 1170, peso=400),
        linha([4], 300, 760, peso=700, tipo=CONTADOR),
        linha([5, 6, 7], 80, 1262, peso=800, marca=[7]),
    ]),
    bloco('B2', 'S2', linhas=[
        linha([8, 9, 10], 80, 1170, peso=800),
        linha([11, 12], 60, 1262, peso=400),
    ]),
    bloco('B3', 'S3', linhas=[
        linha([13, 14, 15, 16], 60, 1170, peso=400),
        linha([17, 18, 19], 80, 1258, peso=800, marca=[19]),
        linha([20, 21, 22], 60, 1346, peso=400),
        linha([23, 24], 80, 1432, peso=800),
    ]),
    bloco('B4', 'S4', linhas=[
        linha([25, 26, 27], 60, 1170, peso=400),
        linha([28, 29, 30], 80, 1262, peso=800),
        linha([31, 32, 33], 60, 1354, peso=400, marca=[33]),
    ]),
    bloco('B5', 'S5', linhas=[
        linha([34, 35, 36], 60, 1170, peso=400),
        linha([37, 38, 39], 80, 1258, peso=800),
        linha([40], 60, 1346, peso=400),
    ]),
    bloco('B6', 'S6', linhas=[
        linha([41, 42, 43], 60, 1170, peso=400),
        linha([44, 45], 80, 1262, peso=800),
        linha([46, 47], 60, 1354, peso=400),
    ]),
    bloco('B7', 'S7', ate_q=514, linhas=[
        linha([48, 49, 50, 51], 60, 1170, peso=400),
        linha([52, 53, 54], 80, 1258, peso=800),
    ]),
    bloco('B8', 'S7', de_q=514, linhas=[
        linha([55, 56, 57], 60, 1170, peso=400),
        linha([58, 59], 60, 1250, peso=400),
        linha([60, 61], 80, 1342, peso=800),
    ]),
    bloco('B9', 'S8', ate_q=657, linhas=[
        linha([62, 63, 64, 65], 60, 1170, peso=400),
        linha([66, 67], 60, 1250, peso=400),
    ]),
    bloco('B10', 'S8', de_q=657, linhas=[
        linha([68, 69], 84, 790, peso=700, tipo=PILULA),
        linha([70, 71], 84, 950, peso=700, tipo=PILULA),
        linha([72, 73, 74, 75], 60, 1170, peso=400),
    ]),
    bloco('B11', 'S9', linhas=[
        linha([76, 77, 78, 79], 60, 1170, peso=400),
        linha([80, 81, 82], 80, 1258, peso=800),
    ]),
    bloco('B12', 'S10', linhas=[
        linha([83], 60, 760, peso=400),
        linha([84], 84, 880, peso=700, tipo=PILULA),
    ]),
    bloco('B13', 'S10', de_q=837, linhas=[
        linha([85, 86, 87, 88, 89], 60, 1170, peso=400),
        linha([90, 91, 92, 93, 94, 95], 60, 1250, peso=400),
    ]),
]
# fim do plano

# ---------------------------------------------------------------- grava src/tempos.json (a mesma forma de sempre)
T = {'fala': fala or FALA, 'fps': FPS, 'duracao_q': duracao_q or q(DUR + 0.6)}
for k, v in (('escurece', escurece), ('virada', virada), ('acordes', acordes)):
    if v is not None:
        T[k] = v
T['cenas'] = list(cenas or [])
if previas:
    T['previas'] = previas
T['marcas'] = dict(marcas or {})
T['texto'] = {str(k): v for k, v in (texto or {}).items()}
T['blocos'] = list(blocos or [])
j = lambda x: json.dumps(x, ensure_ascii=False)
L = ['{']
for k, v in T.items():
    if k == 'cenas':
        L.append(f'  "{k}": [' + (''.join(f'\n    {j(x)},' for x in v)).rstrip(',') + ('\n  ' if v else '') + '],')
    elif k == 'marcas':
        L.append('  "marcas": {' + (''.join(f'\n    {j(n)}: {j(m)},' for n, m in v.items())).rstrip(',') + ('\n  ' if v else '') + '},')
    elif k == 'blocos':
        partes = []
        for b in v:
            cab = j({x: y for x, y in b.items() if x != 'linhas'})[:-1]
            partes.append(f'    {cab}, "linhas": [' + ','.join(f'\n      {j(l)}' for l in b['linhas']) + '\n    ]}')
        L.append('  "blocos": [' + (('\n' + ',\n'.join(partes) + '\n  ') if partes else '') + ']')
    else:
        L.append(f'  "{k}": {j(v)},')
L.append('}')
(AQUI / 'src' / 'tempos.json').write_text('\n'.join(L) + '\n', encoding='utf-8', newline='\n')
print(f"src/tempos.json: {len(T['cenas'])} cenas, {len(T['blocos'])} blocos, {len(T['marcas'])} marcas, {T['duracao_q']} quadros"
      + ('' if T['cenas'] else '  (plano vazio: monte as cenas pela fala)'))
