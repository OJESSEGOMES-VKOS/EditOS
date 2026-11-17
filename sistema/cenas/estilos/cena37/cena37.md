# cena37: Donut breakdown (Rosca de partes)

- **Tipo:** 2D
- **A cena que ele resolve:** divisão de um todo em fatias; a fatia da história se destaca.
- **Quando a fala pede:** "X% vai para", "dividido em", "a maior parte".
- **Completa estes modelos:** documental-dados, prova-print, especialista, youtube-didatico.
- **Material e prova:** percentuais como ditos; com fonte quando não são do dono.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma rosca grossa que vai se fechando como um ponteiro dando a volta no relógio, num papel branco e calmo. Tudo é
quieto e acinzentado, menos a fatia de que a fala trata: ela é a única cor forte e, no fim, sai do anel.

- **Fundo:** branco que desce para um cinza frio quase nada (`#FFFFFF` a `#F3F5F8`). Limpo, de relatório bem feito.
- **Cores:** as fatias comuns em tons apagados (azul ardósia `#4C6C9C`, petróleo `#2E9195`, sálvia `#A4BB9B`, cinza
  `#A7AFBC`, rosa velho `#D49CA3`); a fatia da história em verde firme `#12A150`. O anel vazio é `#E6E9EF`. Uma cor
  alta só, porque o olho tem que saber para onde ir.
- **Letras:** Sora 700 no título, no número do meio e nos valores (larga e amigável); Inter Tight 600 nos nomes e na
  linha de contexto, em cinza `#7B8491`. Algarismos tabulares sempre, para o número não tremer.
- **Layout:** título curto no alto à esquerda com uma linha cinza de contexto; o anel no meio; dentro dele o total e
  uma palavra cinza; embaixo a legenda em duas colunas (quadradinho, valor em negrito, nome em cinza).
- **Textura:** só um grão fino. Bordas nítidas. A única sombra é a da fatia que sai.

**Os movimentos (o vocabulário):**
- **A varrida em sequência:** cada fatia corre a partir do meio-dia, com mola, e a próxima começa antes da anterior
  pousar. Parece uma mão só dando a volta.
- **A batida:** quando uma fatia pousa, o anel estufa uns pixels para fora. Dá peso ao pouso.
- **A linha que salta:** a linha da legenda da fatia aparece no pouso, o quadradinho e o valor com um pulinho, o
  nome subindo de dentro de uma máscara.
- **A soma:** o número do meio soma só o que já pousou, sem passar do total real.
- **A fatia sai:** com o anel fechado, a fatia da história se descola uns 26 px, engrossa e ganha sombra; as outras
  clareiam (troca de cor, não esmaecer) e a linha dela ganha a pílula verde. Depois tudo para.

## Como variar (o jeito, não a demo)

- **As fatias são as que a fala cita,** de 2 a 7 (`fatias[]`), com os valores como foram ditos (G10). Três fatias
  ditas, três fatias na tela; nunca completar com fatias inventadas para "parecer cheio".
- **A fatia da história é a que a frase defende** (`heroi`), não sempre a última nem sempre o lucro. Pode ser a
  maior ("metade vai pro aluguel") ou a menor ("sobram 3%").
- **Número, porcentagem ou dinheiro:** `prefixo="R$"` para dinheiro, `sufixo="%"` para porcentagem, nada para
  quantidade. O total do meio é a soma; se a fala não deu um total que feche, use porcentagem.
- **Ritmo:** frase curta com poucas fatias, `passo` maior (cada pouso numa palavra); frase longa com muitas, `passo`
  menor. Cada pouso pode cair na palavra que nomeia aquela fatia.
- **Título** é a pergunta ou a afirmação da fala ("Pra onde vai o seu salário"); o contexto diz de onde vem o dado
  (a fonte, quando não é do dono).
- **Formatos:** o palco é 4:5 e escala para 9:16 (sobra branco em cima e embaixo para a legenda da casa) e 16:9 (sobra
  nas laterais; com tempo, ponha a legenda das fatias à direita do anel em vez de embaixo).

## Nunca

- Fatia neon, arco-íris ou mais de uma cor forte.
- Fatia que aparece esmaecendo, contador que rola, treme de largura ou passa do total.
- Rótulo cruzando outro ou entrando no anel.
- Número que parece conta real de empresa sem fonte.
- Reaproveitar a cafeteria, as categorias ou qualquer texto da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida: seis fatias, lucro por último, só porque a demo era assim.
