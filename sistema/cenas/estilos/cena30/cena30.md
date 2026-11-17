# cena30: Money stack (Pilha de dinheiro)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** número grande de dinheiro que dá pra visualizar.
- **Quando a fala pede:** "R$ 1 milhão", "faturou", "custou".
- **Completa estes modelos:** documental-dados, imagem-por-palavra, personagem, especialista.
- **Material e prova:** valor exatamente como dito; resultado do dono só com prova.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um número de dinheiro que dá para enxergar: maços arrumados caem camada por camada num palete, num estúdio claro, e
o número embaixo sobe um degrau a cada camada até pousar no total. Calmo, limpo, quase de museu.

- **Fundo:** estúdio cinza frio bem claro (`#F3F5F7` em cima a `#E3E7EB` no chão), uma luz grande e macia no alto à
  esquerda (a torre tem um lado claro, um lado sombreado e sombra macia no chão). Nada mais na sala.
- **O dinheiro:** maços cinza-esverdeados `#CFDCCF` com borda de papel nos lados e uma cinta branca `#EEF2EF` com dois
  fios verdes no meio. A nota é inventada: borda fina e duas rosetas, sem rosto, sem selo, sem cor de moeda real.
- **O palete:** ardósia fosca `#5C6774`. Nada de ouro, marrom ou brilho.
- **Letras:** Plus Jakarta Sans. O número em 800, ~140 px, tinta quase preta `#101B16`, com algarismos de largura
  fixa; vira verde fundo `#0E7A4C` ao pousar. Uma linha pequena acima, em 700, cinza-esverdeado `#5B6A63`.
- **Layout:** a torre centrada nos dois terços de cima, vista de 3/4 (frente com cinta, ponta de papel e topo), o
  rótulo e o número centrados embaixo do palete, o quinto de baixo vazio.

**Os movimentos (o vocabulário):**
- **Abre com uma camada:** câmera baixa no palete, uma camada no chão e a próxima já caindo.
- **A queda:** os maços caem de cima com gravidade, um pouco tortos, em ondinha rápida dentro da camada, e cada um
  amassa de leve ao bater.
- **A pilha acelera:** as camadas vêm em sequência rápida, apertando no meio, enquanto a câmera sobe e se afasta para
  o 3/4 herói e assenta.
- **O hodômetro por camada:** o número rola um degrau a cada camada que pousa. Nunca corre na frente dos maços.
- **O pouso:** na última camada o dígito da frente entra, o número dá um soquinho e fica verde. Depois, tudo parado.

## Como variar (o jeito, não a demo)

- **O total é o valor dito,** exatamente (`total`, `prefixo`). Escolha `camadas` para o degrau ser redondo e legível:
  R$ 50 mil em 5 camadas de 10 mil; R$ 2,4 milhões em 12 de 200 mil. O degrau sempre bate com a soma.
- **O rótulo é a fala resumida** ("Quanto ele faturou em março", "O que custou a obra"), não "como é 1 milhão".
- **Valor pequeno, torre baixa:** 3 a 5 camadas, câmera quase sem subir; valor enorme: mais camadas, mais rápidas, a
  câmera sobe mais. A altura da torre conta o tamanho; não estique uma pilha pequena.
- **O pouso cai na palavra do número.** Ajuste `duracao` para o verde acender quando o valor é falado.
- **Dinheiro que sai** (custo, dívida): o mesmo estilo serve, e o verde do pouso pode virar um vermelho sóbrio
  (`corFinal`) se a fala é perda. Uma cor de pouso só.
- **Formatos:** palco 4:5 escalado; em 9:16 sobra estúdio em cima (a torre cresce para lá) e a legenda da casa fica
  embaixo do número; em 16:9 a torre à esquerda e o número à direita, se a altura apertar.

## Nunca

- Nota real: rosto, selo, arte ou cor de cédula de verdade.
- Nota solta voando, pilha bagunçada, chuva de dinheiro.
- Contar direto até o total, ou o número na frente dos maços: um degrau por camada.
- Sala cheia, luz dramática, ouro ou brilho.
- Resultado do dono sem prova, ou valor arredondado diferente do dito.
- Reaproveitar o "como é R$ 1 milhão" e as dez camadas da demo (`componente/textos-demo.json`) quando a fala é outra.
