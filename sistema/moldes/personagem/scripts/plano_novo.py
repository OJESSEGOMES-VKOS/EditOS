# O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de scripts/plano.py).
# O vídeo nasce com uma cena Base por frase (ele em pé sob o foco, olhando quem assiste) e a legenda montada sozinha.
# Nenhuma cena do aprovado vem junto. Cada frase troca a Base pela ilustração que a fala NOVA pede, com a linha "por quê"
# no plano.md (o nome da cena, a palavra dita entre aspas e o porquê; tools/clone.py cobra). A skill
# .claude/skills/personagem/SKILL.md diz como escolher e como desenhar.
#
# Prender à fala: w('palavra', n) = quadro do início da n-ésima vez que ela é dita (o corte); m('palavra', n) = a marca
# [índice, "palavra"] de um acontecimento dentro da cena. Palavra que não existe: o script para e mostra a fala.
#
# AS PEÇAS (use só quando a fala nova tiver o porquê delas; modelos/personagem/personagem.md §4 e §5):
#   CENAS     uma ilustração parada por frase: cena(comp='Nome', de=w('palavra que abre a frase')). Sempre comp= com o
#             nome entre aspas (o tools/clone.py lê assim). linhas=[[ids], ...] fixa a legenda; sem linhas, ela se monta
#             sozinha (até 4 linhas). verde=[ids] pinta a palavra protagonista quando a cena mostra a mesma coisa.
#             A cena nova mora em src/telas/<Nome>.tsx (o kit em src/kit.tsx, o registro em src/telas/index.ts).
#             As cenas do aprovado (S1 a S11) e os exemplos N2 a N4 só voltam quando a fala diz a mesma coisa que fez
#             elas existirem (S4, na cama rolando o feed, volta se a fala diz "se você está no Instagram agora").
#   MARCAS    os instantes dos acontecimentos dentro das cenas: dict(nome=m('palavra')). O som (scripts/som.py, só com
#             ordem do dono, G6) toca efeito em barra_cheia, barra_fim e risco.
#   TEXTO     grafia na tela de uma palavra, pelo índice: {84: '“EDIÇÃO”'} (o sentido nunca muda; número como dito, G10)
#   FIXO      a fala pede comentário: o comando fixo na caixa de comentário (a cena do fecho desenha a caixa):
#             dict(cena='NomeDaCenaDoFecho', linhas=[dict(ids=[iw('comenta')], fs=64, y=948),
#                                                    dict(ids=[iw('palavra')], fs=128, y=1042)])
#             e MARCAS caixa=m('comenta'), risco=m('palavra'). Sem chamada na fala: FIXO = None, e não há vermelho.
#   PREVIAS   dois vídeos da própria pessoa nos quadros da parede: só se a fala fala de "prévias" e ela tiver os vídeos
#             (dict(de_q=..., ate_q=...) e a prop previas no render).
#   FADE      escurece nos últimos 15 quadros (o fecho do modelo).
DURACAO = FIM + 15  # a última cena vai até o fim e respira meio segundo
FADE = [DURACAO - 15, DURACAO]
CENAS = [cena(comp=BASE, de=de) for de in frases()]
PREVIAS = None
MARCAS = {}
TEXTO = {}
LEGENDA = dict(fs=66, y0=1217, passo=78, cx=500)  # cx 500: o centro da área útil (os 140 px da direita são dos botões)
FIXO = None
