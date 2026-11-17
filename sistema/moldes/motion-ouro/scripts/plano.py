"""O PLANO do vídeo no motion-ouro: este script escreve src/tempos.json (o arquivo que o vídeo, o conferir.py e o
som.py leem). Nunca edite src/tempos.json à mão: mude o bloco "O PLANO" abaixo e rode de novo.

uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/plano.py   (depois: scripts/conferir.py)

O vídeo novo nasce com o bloco "O PLANO" vazio (scripts/plano_novo.py, posto aqui pelo tools/novo-video.py): cada cena
entra porque a fala nova pediu (.claude/skills/motion-ouro/SKILL.md e modelos/motion-ouro/motion-ouro.md §4 e §9).

As ajudas para prender o plano à fala (src/palavras.json):
  i('palavra', n)   índice da n-ésima vez que a palavra é dita (para os "ids" das linhas)
  ids(a, b)         os índices de a até b, inclusive (ids(i('Ele'), i('para')))
  p('palavra', n)   uma marca: [índice, 'palavra']
  ini('palavra', n) o quadro em que a palavra começa; fim('palavra', n) o quadro em que ela acaba; q(segundos) em quadros
  FALA o texto da fala; DUR o fim da última palavra (s); FPS 30
As peças do plano:
  cena('C3', de_q, ate_q, ENTRADA, tela='T8')   uma tela da casa (C1 a C10, src/cenas.tsx); escreva uma por linha:
                                                C3 = cena('C3', ...)   (o tools/clone.py lê o nome da linha)
  livre(comp='Nome', de_q=..., ate_q=..., entrada=ENTRADA)   uma tela nova, desenhada em src/telas/Nome.tsx
  flash(q, BRANCO | QUENTE | SOL)
  bloco('B1', 'C3', EMBAIXO | CENTRO | FECHO, linhas=[linha(ids, fs, y, ouro=[...], tipo=GIGANTE | CONTADOR | CONTORNO | ASSINATURA)],
        de_q=..., ate_q=..., estilo=TENSAO, encolhe_q=...)
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

# as entradas de cena, as cores de flash, as posições, os tipos de linha e o estilo
CORTE, FLASH_BRANCO, FLASH_QUENTE, ATRAVESSAR = 'corte', 'flash-branco', 'flash-quente', 'atravessar'
PRETO_SECO, CORTE_SECO, CLARAO_PORTAS, CLARAO_QUENTE = 'preto-seco', 'corte-seco', 'clarao-portas', 'clarao-quente'
BRANCO, QUENTE, SOL = 'branco', 'quente', 'sol'
EMBAIXO, CENTRO, FECHO = 'embaixo', 'centro', 'fecho'
GIGANTE, CONTADOR, CONTORNO, ASSINATURA = 'gigante', 'contador', 'contorno', 'assinatura'
TENSAO = 'tensao'


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


def cena(id, de_q, ate_q, entrada, tela=None):
    return {'id': id, 'de_q': de_q, 'ate_q': ate_q, **({'tela': tela} if tela else {}), 'entrada': entrada}


def livre(comp, de_q, ate_q, entrada, tela=None):
    return cena(comp, de_q, ate_q, entrada, tela or 'nova')


flash = lambda q_, cor: {'q': q_, 'cor': cor}


def linha(ids_, fs, y, **kw):
    return {'ids': list(ids_), 'fs': fs, 'y': y, **kw}


def bloco(id, cena_, pos, linhas, **kw):
    return {'id': id, 'cena': cena_, 'pos': pos, **kw, 'linhas': linhas}


fala, duracao_q, escurece_q, virada, acordes, cenas, flashes, previas, marcas, texto, blocos = (None,) * 11

# O PLANO (o do vídeo aprovado: a fala "100% editado pelo Claude"; num vídeo novo o tools/novo-video.py troca este bloco pelo scripts/plano_novo.py)
fala = 'Esse vídeo está sendo 100% editado pelo Claude. Ele foi criado justamente para te mostrar a diferença entre vários modelos que eu criei e melhorei para editar qualquer tipo de vídeo usando o Claude. Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos. Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. Mas se você quiser realmente ver outros modelos de edição como esse e aprender a como usar isso nos seus vídeos, comenta edição aqui embaixo que eu vou te mandar na sua DM agora.'
duracao_q = 951
escurece_q = [918, 932]
virada = 'C7'
acordes = [0.0, 3.07, 6.0, 8.1, 10.7, 12.57, 'C7', 17.14, 20.0, 24.0, 'C10']
C1 = cena('C1', 0, 92, CORTE, tela='T1+T3')
C2 = cena('C2', 92, 137, FLASH_BRANCO, tela='T2')
C3 = cena('C3', 137, 243, ATRAVESSAR, tela='T8')
C4 = cena('C4', 243, 316, FLASH_QUENTE, tela='T6')
C5 = cena('C5', 321, 377, PRETO_SECO, tela='T2')
C6 = cena('C6', 377, 435, CORTE_SECO, tela='T4')
C7 = cena('C7', 435, 600, CLARAO_PORTAS, tela='T9+T10+T3')
C8 = cena('C8', 600, 720, FLASH_BRANCO, tela='T7')
C9 = cena('C9', 720, 803, FLASH_QUENTE, tela='T5')
C10 = cena('C10', 803, 951, CLARAO_QUENTE, tela='T20+T10')
cenas = [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]
flashes = [flash(92, BRANCO), flash(243, QUENTE), flash(435, SOL), flash(600, BRANCO), flash(720, QUENTE), flash(803, QUENTE)]
previas = dict(de_q=470, ate_q=600)
marcas = dict(
    contador=p('100%'),
    editor=p('criado'),
    cartao1=p('diferença'),
    cartao2=p('vários'),
    cartao3=p('modelos'),
    cartao4=p('criei'),
    melhorei=p('melhorei'),
    roleta1=p('qualquer'),
    roleta2=p('tipo'),
    roleta3=p('de'),
    roleta4=p('vídeo', 2),
    coracao=p('Instagram'),
    apenas=p('apenas'),
    setas=p('aqui'),
    tres=p('três'),
    clique=p('aprender'),
    icone1=p('a', 2),
    icone2=p('como', 2),
    icone3=p('usar'),
    icone4=p('isso'),
    seta_baixo=p('aqui', 2),
)
texto = {84: '“EDIÇÃO”'}
blocos = [
    bloco('B1', 'C1', CENTRO, linhas=[
        linha([0, 1, 2, 3], 68, 770, tipo=GIGANTE, gigante=[0, 1]),
        linha([4], 210, 960, tipo=CONTADOR),
        linha([5, 6, 7], 68, 1150, ouro=[7]),
    ]),
    bloco('B2', 'C2', EMBAIXO, linhas=[
        linha([8, 9, 10], 70, 1210),
        linha([11, 12], 70, 1294),
    ]),
    bloco('B3', 'C3', CENTRO, linhas=[
        linha([13, 14, 15, 16], 64, 852),
        linha([17, 18, 19], 64, 928, ouro=[19]),
        linha([20, 21, 22], 64, 1004),
        linha([23, 24], 64, 1080),
    ]),
    bloco('B4', 'C4', EMBAIXO, linhas=[
        linha([25, 26, 27], 70, 1210),
        linha([28, 29, 30], 70, 1294),
        linha([31, 32, 33], 70, 1378, ouro=[33]),
    ]),
    bloco('B5', 'C5', EMBAIXO, linhas=[
        linha([34, 35, 36], 70, 1210),
        linha([37, 38, 39], 70, 1294),
        linha([40], 70, 1378),
    ]),
    bloco('B6', 'C6', EMBAIXO, estilo=TENSAO, linhas=[
        linha([41, 42, 43], 70, 1210),
        linha([44, 45, 46], 70, 1294),
        linha([47], 70, 1378),
    ]),
    bloco('B7', 'C7', EMBAIXO, ate_q=512, linhas=[
        linha([48, 49, 50, 51], 70, 1210),
        linha([52, 53, 54], 70, 1294),
    ]),
    bloco('B8', 'C7', EMBAIXO, de_q=514, linhas=[
        linha([55, 56, 57], 70, 1210),
        linha([58, 59], 70, 1294),
        linha([60, 61], 70, 1378),
    ]),
    bloco('B9', 'C8', CENTRO, encolhe_q=650, linhas=[
        linha([62, 63, 64], 76, 880),
        linha([65, 66, 67], 76, 970),
    ]),
    bloco('B10', 'C8', CENTRO, linhas=[
        linha([68, 69], 104, 800, tipo=CONTORNO),
        linha([70, 71], 104, 920, tipo=CONTORNO),
        linha([72, 73], 64, 1050),
    ]),
    bloco('B11', 'C9', EMBAIXO, linhas=[
        linha([74, 75, 76], 70, 1210),
        linha([77, 78, 79], 70, 1294),
        linha([80, 81, 82], 70, 1378),
    ]),
    bloco('B12', 'C10', FECHO, linhas=[
        linha([83], 72, 740),
        linha([84], 150, 890, tipo=ASSINATURA),
    ]),
    bloco('B13', 'C10', FECHO, linhas=[
        linha([85, 86, 87, 88, 89], 54, 1075),
        linha([90, 91, 92, 93, 94, 95], 54, 1145),
    ]),
]
# fim do plano

# ---------------------------------------------------------------- grava src/tempos.json (a mesma forma de sempre)
T = {'fala': fala or FALA, 'fps': FPS, 'duracao_q': duracao_q or q(DUR + 2.0)}
for k, v in (('escurece_q', escurece_q), ('virada', virada), ('acordes', acordes)):
    if v is not None:
        T[k] = v
T['cenas'] = list(cenas or [])
T['flashes'] = list(flashes or [])
if previas:
    T['previas'] = previas
T['marcas'] = dict(marcas or {})
T['texto'] = {str(k): v for k, v in (texto or {}).items()}
T['blocos'] = list(blocos or [])
j = lambda x: json.dumps(x, ensure_ascii=False)
L = ['{']
for k, v in T.items():
    if k in ('cenas', 'flashes'):
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
