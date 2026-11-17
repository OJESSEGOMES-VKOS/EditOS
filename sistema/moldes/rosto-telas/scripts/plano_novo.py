# O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de gerar_tempos.py).
# O vídeo nasce como rosto puro: a gravação crua, enquadramento A e a legenda da casa. Nenhuma tela do aprovado vem
# junto. Cada tela entra porque a fala NOVA pediu, com a linha "por quê" no plano.md (a tela, a palavra dita entre
# aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/rosto-telas/SKILL.md diz como escolher.
#
# Prender à fala: w('palavra', n) = início da n-ésima vez que ela é dita; corte('palavra', n) = 2 quadros antes;
# iw('palavra', n) = o índice dela (para os títulos). Palavra que não existe na fala: o script para e diz a linha.
#
# AS PEÇAS DA CASA (use só quando a fala nova tiver o porquê dela; modelos/rosto-telas/rosto-telas.md §4):
#   BLOCOS/planos  cortes de enquadramento: [0.0, corte('palavra'), ...] e um plano por bloco, 'A' (padrão) ou 'B'
#                  (15% mais perto, só com motivo na fala). Cada trecho de 2 a 5 s; corte na palavra que abre a frase.
#   outros         etiqueta curta ao lado do rosto, sem tela inteira:
#                  dict(de=w('palavra'), sai=corte('próxima') - 0.36, texto='o nome dito')
#   fecho          a fala pede um comentário: o campo de comentário com a palavra digitada em MAIÚSCULA:
#                  dict(comenta=w('comenta'), edicao=w('palavra'), palavra=sem_pontuacao(iw('palavra')).upper(),
#                       aqui=w('aqui'), embaixo=w('embaixo'), mandar=None, dm=None)  (mandar/dm: a DM chega em cima,
#                  só se a fala promete mandar na DM)
#   prompt         a pessoa pede algo a uma IA/caixa de texto: a caixa digita as palavras ditas (PROMPT abaixo)
#   celular        a fala é sobre quem está vendo no Instagram agora (o rosto vira um Reel; titulos.celular)
#   editor         a fala é sobre o próprio ato de editar este vídeo (o rosto vira a prévia; titulos.editor)
#   modelos        a fala cita uma lista de coisas que a pessoa tem ou criou (cartões; nomes = o que foi dito)
#   previas        só com vídeos da própria pessoa (prop previas)
#   silencio       só no som, e só com ordem de efeitos (G6)
#   As que mostram "Claude" fixo (editor, prompt, o chip de modelos.claude) só entram se a fala nomeia o Claude.
#
# A TELA LIVRE (a tela que a fala pede e a casa não tem; o normal num tema novo):
#   livres=[dict(comp='NomeDaTela', modo='dividido', de=corte('palavra'), sai=corte('próxima'),
#                em=dict(chave=w('palavra'), ...), textos=dict(chave='texto dito'), dados=dict(...))]
#   modo 'dividido': painel marfim em cima (até y 880), o rosto embaixo, a legenda vai para a pílula na divisa.
#   modo 'cheia': tela marfim inteira; titulo=dict(i0=iw('1ª palavra'), grupos=[4, 5, ...]) é o texto dito no topo
#     (a legenda some nesse tempo, como no editor); rosto=dict(x=330, y=500, w=420) põe o rosto numa moldura 9:16,
#     sem ele o rosto some.
#   O desenho mora em src/telas/<NomeDaTela>.tsx, com o kit de src/ui.tsx, registrado em src/telas/index.ts.
#   Texto na tela só o que é dito (G19), número como foi dito (G10), nunca o mesmo texto da pílula na mesma hora (G26).

PROMPT = []  # as palavras que a caixa do prompt digita: [('palavra', ocorrência), ...]
BLOCOS = [0.0]
T = dict(
    _leia='Gerado por scripts/gerar_tempos.py a partir de src/palavras.json. Não editar à mão.',
    fps=30,
    duracao=DURACAO,
    video_fim=VIDEO_FIM,
    blocos=BLOCOS,
    planos=['A'],  # um por bloco
    editor=None,
    modelos=None,
    celular=None,
    previas=None,
    outros=None,
    zooms=[],
    prompt=None,  # com PROMPT: dict(de=..., palavras=[w(x, n) for x, n in PROMPT], textos=[sem_pontuacao(iw(x, n)) for x, n in PROMPT], sai=...)
    fecho=None,
    silencio=None,
    titulos=dict(editor=None, celular=None, marcas=[]),  # marcas: palavras do título com marca-texto menta
    livres=[],
)
