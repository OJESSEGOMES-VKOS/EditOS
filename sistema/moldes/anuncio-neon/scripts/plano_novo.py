# O começo vazio do anúncio novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de scripts/plano.py).
# Nenhuma cena, bloco ou marca do aprovado vem junto: o vídeo nasce preto, só com a voz, e o conferir.py reprova até o
# plano existir. Cada cena entra porque a fala NOVA pediu, com a linha "por quê" no plano.md (o nome da tela, a palavra
# dita entre aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/anuncio-neon/SKILL.md diz como.
# Antes do plano: a cor do anúncio em src/tema.ts (a linha do C com gira(PADRAO, <cor da marca>)), nunca a do aprovado.
#
# AS TELAS DA CASA (src/cenas.tsx; use só quando a fala nova tiver o mesmo porquê; anuncio-neon.md §4):
#   S1  play de vidro nos anéis que vira o número dito (marcas inicio, cem): um número dito na abertura
#   S2  placa inclinada com um editor ganhando um clipe por palavra (clipe1..5): a fala fala de montar ou editar algo
#   S3  três placas em leque, a do meio acende, check (placa1..3, melhorei): várias versões e a que ficou boa
#   S4  ícone herói de vidro com órbita de ícones (orbita1..4): "qualquer tipo de X", uma lista de usos
#   S5  celular flutuando com o coração (coracao): a fala é sobre quem está no Instagram agora
#   S6  muitas telinhas e a de "um" cresce (apenas, um): "só um", "um desses"
#   S7  avanço rápido nos anéis, prévias com setas e riscos (setas, aceleradas; prévias só de vídeo seu)
#   S8  telinhas em profundidade e as pílulas do destaque (outros, pilula1..3): o termo protagonista (G17, G28)
#   S9  interruptor OFF -> ON e telinhas subindo (usar, videos): um verbo de ligar, ativar, começar a usar
#   S10 o fecho com o comando na pílula sobre anéis (edicao, embaixo): "comenta X", ou o termo da última frase
#   Uma por linha, com o nome dela:  S9 = cena('S9', ini('palavra') - 2, ini('outra') - 2, CORTE, fundo=CLARO)
#
# A TELA NOVA (a que a fala pede e a casa não tem; o normal num anúncio novo):
#   Nome = livre(comp='Nome', de_q=..., ate_q=..., entrada=BORRAO, fundo=ESCURO)
#   O desenho mora em src/telas/Nome.tsx (kit de src/kit.tsx: Fundo, Palco na zona do objeto, Entra, IconeVidro, Placa,
#   Telinha, Aneis, Particulas, Risco, GL, G; cores só de C), registrado em src/telas/index.ts. As marcas que ela pede
#   (marca('nome')) entram em "marcas". O texto continua nos blocos: a legenda em y 1170, um bloco por vez.
#
# O TEXTO: toda palavra dita, uma vez, em ordem, nos blocos (fina 60 px peso 400, forte 80 px peso 800, a 1ª linha em
# y 1170 e as outras a cada 80 a 92 px). Pílula (PILULA) só no termo protagonista e no fecho; CONTADOR no número dito.
# Respiro claro (fundo=CLARO, entrada CORTE) de vez em quando; vermelho só para o ruim.

duracao_q = q(DUR + 0.6)  # a fala e um respiro; o vídeo vai ao preto nos últimos 0,4 s
escurece = True
virada = None  # id da cena em que a trilha sobe
acordes = None  # sem a lista, um acorde por cena
cenas = []
previas = None
marcas = dict()
texto = {}
blocos = []
