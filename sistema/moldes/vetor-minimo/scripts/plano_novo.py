# O PLANO do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco do aprovado). Nasce vazio: o preto e a voz.
# Nenhum personagem, frase ou objeto do aprovado vem junto. A história nasce da fala NOVA (a skill
# .claude/skills/vetor-minimo/SKILL.md e o vetor-minimo.md §3): ache a frase-tese e a frase de virada, escolha a forma
# (A duelo, B escada, C corrente) e, para cada personagem, o OBJETO que a fala dele pede. Cada chegada leva a linha
# "por quê" no plano.md: o nome do objeto (comp) e a palavra dita entre aspas que pediu ele (tools/clone.py cobra).
#
# AS PEÇAS DA CASA:
#   chegada(comp, x0, x1, t0, d, acao)  entra pela borda (x0 -70) e freia até x1 em d s (2,0 a 2,4); acao = o instante
#                                       em que a ação acontece no objeto (a varredura de 0,28 s): ele acende de cru para giz
#     destaque=True  o escolhido acende branco no apenasUm ("só um", "apenas um")
#     voce=True      o último ("você"): fica cru até a acao e acende verde nela, sem esperar a virada
#     previa=0|1     só com prévias de vídeos seus (a tela sobe para o alto)
#   frase(txt, de, dig, ate)  “FALA DITA”, caixa alta, até 7 palavras, uma por vez (1 s + 3 palavras/s de leitura)
#   virada=p(...)  o evento de cor (tudo verde) entre 60 e 76% da duração; apagao=s e moral(...) só com comando na fala
#   'Tela' é o objeto do aprovado (a tela 9:16 que a varredura edita): só quando a fala é sobre vídeos ou telas editadas.
#
# O OBJETO NOVO (o normal num tema novo): src/telas/<Nome>.tsx, desenhado com o kit (src/kit.tsx: COR, coresDe,
# Varredura, mistura, suave, PALCO) centrado em (0,0), em vetor com volume suave, cinza cru antes da acao e aceso depois;
# registrado em src/telas/index.ts. Objetos repetidos são idênticos; a diferença é o que acontece com eles.
#
# Depois: ../../.venv/Scripts/python.exe scripts/plano.py e node scripts/checar.mjs até "sem problemas".
PLANO = dict(
    fala=FALA,
    cauda=0.7,
    apenasUm=None,
    previas=None,
    virada=None,
    apagao=None,
    chegadas=[],
    frases=[],
    moral=[],
)
