# cena17: App Mockup (Celular com app)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** mostrar um app/produto como coisa pronta.
- **Quando a fala pede:** "o app", "no celular", lançamento.
- **Completa estes modelos:** anuncio-neon, prova-print, youtube-didatico.
- **Material e prova:** print real da tela do app do dono (G34); nunca tela inventada como se fosse real.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O plano de produto de filme de lançamento: um celular com peso girando para o lugar num estúdio claro, a tela se
montando enquanto ele pousa, e cartões brancos saltando em volta. Faz o produto parecer pronto e caro.

- **Paleta:** fundo de estúdio azul-acinzentado `#dfe6ee` descendo a `#cfd8e2`, um brilho `#f4f7fa` atrás do celular e
  chão um pouco mais escuro; tinta `#0e1116` em números e títulos, cinza `#7a818c` nos rótulos; um acento de produto,
  verde `#0e9f6e` com o claro `#e3f6ee` nos chips. O resto é branco. Com o app do dono, o acento é a cor dele.
- **Letra:** Plus Jakarta Sans em tudo. 800 nos números grandes (dígitos de largura fixa, espaçamento fechado), 700 em
  títulos, 500 no corpo. Frase comum.
- **Layout:** um celular no meio em três quartos (inclinado para trás, girado ~20°, rolado ~3°), com espessura e borda
  de metal. Até três cartões brancos em profundidades diferentes, cada um invadindo um pouco o celular e inclinado
  com ele: um no alto à esquerda, um na borda direita, um embaixo à esquerda.
- **Textura:** grão fino parado no fundo, sombra macia no chão, sombras em camadas nos cartões, uma faixa de luz no
  vidro.
- **Os movimentos (o vocabulário):**
  - **o giro com peso:** no quadro 1 o celular já está, virado demais, e gira até o ângulo final numa mola pesada que
    passa uns graus e assenta; a sombra no chão alarga quando ele encara a câmera e um brilho corre a borda. Peso é o
    que separa produto de figurinha.
  - **a tela que se monta ao pousar:** a aba desliza, o número conta em dígitos fixos até o valor exato, o gráfico
    desenha com o ponto na ponta, o chip salta quando a conta pousa, as linhas sobem de trás da própria borda.
  - **o cartão que nasce de algo:** nenhum cartão aparece: a notificação sai da pílula da câmera e desdobra; o cartão de
    número cresce do próprio chip; o cartão de meta começa como disco em volta do anel e estica.
  - **um de cada vez:** ~0,5 s entre cartões, cada um passando ~10% e assentando.
  - **a flutuação:** no fim, câmera derivando devagar (cartões perto andam mais que o celular) e um balanço leve.
- **Ritmo:** giro e tela em ~1,5 s, cartões em seguida, último segundo parado flutuando.

## Como variar (o jeito, não a demo)

- **A tela é o app real do dono, recriado fiel (G25)**, passado na prop `tela`. A tela de banco da demo é só exemplo:
  sem print com origem, o estilo não entra (plano B: outro estilo ou a casa).
- **Os cartões vêm da fala:** cada coisa dita sobre o produto que merece destaque vira um cartão (zero a três, não
  sempre três). "Chegou um pedido" → notificação; "a gente já vendeu 340" → cartão de número; "falta pouco pra meta" →
  cartão de meta. Cartão sem fala que pediu sai.
- **Que movimento cai em que palavra:** o giro é a entrada (o nome do produto); a contagem pousa no número dito; cada
  cartão salta na palavra que o nomeia. Fala curta (2 s): só o giro e a tela. Fala longa: os cartões espaçam com a
  fala, não a cada 0,5 s fixo.
- **Formatos:** em 9:16 o celular cresce e os cartões ficam acima e abaixo dele (longe da faixa da legenda); em 16:9 o
  celular fica num terço e os cartões se espalham para o lado livre.

## Nunca

- Print chapado colado no celular, ou celular entrando em velocidade constante sem sombra.
- Cartão que esmaece ou todos chegando juntos; fundo escuro com neon.
- Marca real, logo de fabricante, app genérico fingindo ser o do dono.
- Dígitos que mudam de largura contando.
- Reusar a tela de banco e os cartões da demo ("Marina Alves", "Viagem a Lisboa", "Pagamento recebido") ou os três
  cartões por hábito.
