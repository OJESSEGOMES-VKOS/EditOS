"""O plano do vetor-minimo: escreve src/plano.json (o que o vídeo, o checador e o som leem) a partir do bloco O PLANO.

uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/plano.py   e depois   node scripts/checar.mjs
O bloco entre "O PLANO" e "fim do plano" é o único lugar que se edita. No molde ele é o plano do vídeo aprovado (um
exemplo); num vídeo novo o tools/novo-video.py troca o bloco pelo scripts/plano_novo.py (o começo vazio).

Ajudantes do bloco:
  p('palavra', n=1, mais=None)  o tempo da n-ésima vez que a palavra é dita ([índice, "palavra"]; com mais, [.., +s])
  chegada(comp, x0, x1, t0, d, acao=None, ...)   um personagem que entra e freia, segurando o objeto comp
      comp: o objeto que ele segura. 'Tela' é o da casa (a tela 9:16 que a varredura edita); um objeto novo mora em
      src/telas/<Nome>.tsx, registrado em src/telas/index.ts. acao: o instante da ação no objeto (a varredura).
      Extras: previa=0|1 (a tela que vira prévia), destaque=True (acende no apenasUm), voce=True (o último, verde na ação)
  frase(txt, de, dig, ate)       uma fala de personagem, “ENTRE ASPAS”, caixa alta, até 7 palavras ditas
  moral(txt, de, dig)            uma linha da moral, depois do apagão
"""
import json, re, sys, unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parents[1]
PB = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
if not PB:
    sys.exit('src/palavras.json está vazio: rode tools/novo-video.py com a gravação da narração')


def limpa(s):
    s = unicodedata.normalize('NFD', s)
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in s if not unicodedata.combining(c)).lower())


FALA = ' '.join(x['text'] for x in PB)
FIM = PB[-1]['end']  # fim da última palavra (s)


def p(palavra, n=1, mais=None):
    achou = [i for i, x in enumerate(PB) if limpa(x['text']) == limpa(palavra)]
    if len(achou) < n:
        sys.exit(f'O PLANO pede a {n}ª vez que se diz "{palavra}", e a fala {"só tem " + str(len(achou)) if achou else "não tem nenhuma"}')
    i = achou[n - 1]
    return [i, palavra] if mais is None else [i, palavra, mais]


def chegada(comp, x0, x1, t0, d, acao=None, **extra):
    return dict(x0=x0, x1=x1, t0=t0, d=d, edita=acao, **extra, comp=comp)


def frase(txt, de, dig, ate):
    return dict(txt=txt, de=de, dig=dig, ate=ate)


def moral(txt, de, dig):
    return dict(txt=txt, de=de, dig=dig)


# O PLANO (no molde é o do vídeo aprovado, forma C, vetor-minimo.md §10; num vídeo novo, o dele)
PLANO = dict(
    fala=FALA,
    cauda=0.7,
    apenasUm=p('um'),
    previas=dict(ergue=p('duas'), sobe=p('prévias'), desce=p('Mas')),
    virada=p('outros'),
    apagao=26.55,
    chegadas=[
        chegada(comp='Tela', x0=360, x1=810, t0=-0.2, d=2.4, acao=p('Claude'), destaque=True),
        chegada(comp='Tela', x0=-70, x1=660, t0=2.95, d=2.23, acao=p('diferença'), previa=1),
        chegada(comp='Tela', x0=-70, x1=510, t0=p('diferença'), d=2.2, acao=p('melhorei'), previa=0),
        chegada(comp='Tela', x0=-70, x1=360, t0=p('melhorei'), d=2.0, acao=p('Claude', 2)),
        chegada(comp='Tela', x0=-70, x1=210, t0=p('Mas'), d=2.0, acao=p('usar'), voce=True),
    ],
    frases=[
        frase('“100% EDITADO PELO CLAUDE”', de=p('100%'), dig=0.6, ate=p('a', 1, -0.4)),
        frase('“A DIFERENÇA ENTRE VÁRIOS MODELOS”', de=p('a'), dig=0.4, ate=p('qualquer', 1, -0.4)),
        frase('“QUALQUER TIPO DE VÍDEO”', de=p('qualquer'), dig=0.35, ate=p('apenas', 1, -0.4)),
        frase('“APENAS UM DESSES MODELOS”', de=p('apenas'), dig=0.35, ate=15.8),
        frase('“OUTROS MODELOS DE EDIÇÃO COMO ESSE”', de=p('outros'), dig=0.45, ate=26.55),
    ],
    moral=[
        moral('COMENTA “EDIÇÃO”', de=p('comenta'), dig=0.4),
        moral('AQUI EMBAIXO', de=p('aqui', 2), dig=0.35),
    ],
)
# fim do plano

saida = AQUI / 'src' / 'plano.json'
saida.write_text(json.dumps(PLANO, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'{saida.relative_to(AQUI)}: {len(PLANO["chegadas"])} chegadas, {len(PLANO["frases"])} frases, {len(PLANO["moral"])} linhas de moral')
print('agora: node scripts/checar.mjs')
