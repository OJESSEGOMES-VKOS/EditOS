# O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de scripts/plano.py).
# Nenhuma cena, bloco, marca ou flash do aprovado vem junto: o vídeo nasce preto, só com a voz, e o conferir.py reprova
# até o plano existir. Cada cena entra porque a fala NOVA pediu, com a linha "por quê" no plano.md (o nome da tela, a
# palavra dita entre aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/motion-ouro/SKILL.md diz como.
#
# AS TELAS DA CASA (src/cenas.tsx; use só quando a fala nova tiver o mesmo porquê; motion-ouro.md §4):
#   C1  palavra gigante que desliza e vira a frase menor + contador nos anéis (marca contador, obrigatória):
#       a primeira frase com um número dito
#   C2  notebook 3D girando com a linha do tempo montando (marca editor): a fala fala de uma tela de edição
#   C3  anéis concêntricos com cartões 9:16 nascendo por palavra (cartao1..4, melhorei): várias telas ou versões
#   C4  roleta que gira um gomo por item + cartões rolando (roleta1..4): uma lista falada de 3 ou 4 itens
#   C5  celular 3D com este vídeo no Reels e o coração (coracao): a fala é sobre quem está no Instagram agora
#   C6  pico vermelho, o celular de perto (apenas): o auge da dor; no máximo 2 vezes
#   C7  clarão com portas e túnel de molduras (setas e tres só com previas): a virada, uma vez por vídeo
#   C8  frase de impacto nascendo do desfoque com o horizonte de luz subindo: frase de efeito curta, o destaque
#   C9  cursor clica e a pasta de vidro abre com ícones (clique, icone1..4): verbo de ação ("aprender", "baixa")
#   C10 assinatura em ouro que assenta (seta_baixo só se a fala diz "aqui"/"embaixo"): o nome ou o comando final
#   Uma por linha, com o nome dela:  C8 = cena('C8', ini('palavra') - 2, ini('outra') - 2, FLASH_BRANCO, tela='T7')
#
# A TELA NOVA (a que a fala pede e a casa não tem; o normal num tema novo):
#   Nome = livre(comp='Nome', de_q=..., ate_q=..., entrada=FLASH_QUENTE)
#   O desenho mora em src/telas/Nome.tsx (com o kit de src/kit.tsx: Fundo, Palco na zona do objeto y 250-1050, AnelNeon,
#   TracoNeon, Cartao, Icone, Estrela, Seta, surge, marca), registrado em src/telas/index.ts. As marcas que ela pede
#   (marca('nome')) entram em "marcas". O texto continua nos blocos, embaixo do objeto (1ª linha em y 1210).
#
# O TEXTO: toda palavra dita, uma vez, em ordem, nos blocos (embaixo y 1210/1294/1378, 70 px; centro só no destaque).
# Destaque (ouro, CONTORNO, TENSAO, ASSINATURA) só no trecho ligado ao tema (G17, G28).

duracao_q = q(DUR + 2.0)  # a fala mais cerca de 2 s de cauda
escurece_q = None  # [início, fim] da ida ao preto no fecho, em quadros
virada = None  # id da cena em que a trilha sobe
acordes = None
cenas = []
flashes = []
previas = None
marcas = dict()
texto = {}
blocos = []
