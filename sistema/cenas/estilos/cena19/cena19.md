# cena19: Timeline (Linha do tempo)

- **Tipo:** 2D
- **A cena que ele resolve:** anos em segundos até o "hoje".
- **Quando a fala pede:** datas, "em 2019", "anos depois", "hoje".
- **Completa estes modelos:** documental-dados, personagem, especialista, minidocumentario.
- **Material e prova:** datas como ditas; fatos com fonte quando não são do dono.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma caminhada pelos anos: a linha do tempo pintada num chão em perspectiva, cada marco levantando o próprio cartão
enquanto a linha azul enche até o "hoje". Anos em segundos, pousando em "onde estamos agora".

- **Paleta:** chão quase branco frio `#F5F6F8` descendo a `#E3E6EB`, grade cinza fraca que some na névoa lá no fundo;
  tinta `#0E1116` no título, nos cartões e nos anos já vividos; cinza `#6A717C` nas linhas pequenas; cinza claro
  `#B7BEC8` no trecho que ainda vem. Um azul elétrico `#2442F5` no preenchimento, nas marcas já passadas, na agulha e no
  cartão do HOJE. O azul é a única cor.
- **Letra:** Schibsted Grotesk 800 bem apertada no título e nos anos grandes pintados no chão, 700 nos títulos dos
  cartões, 500 no detalhe de uma linha. JetBrains Mono 600 espaçada no chapéu (kicker) e no ano de cada cartão.
- **Layout:** bloco de título em cima (marquinha, chapéu em mono, uma linha de título com o fecho em azul). Embaixo, o
  chão: a linha vem do fundo à esquerda até perto, no meio de baixo, com marcas e os anos pintados à esquerda (anos
  de marco grandes e pretos, os outros menores e cinza, os futuros claros). Cada marco é um cartão branco numa haste
  fina: quadradinho, ano, título curto, uma linha. O último é o cartão HOJE, azul cheio, maior e mais perto, com o selo.
- **Textura:** nenhuma. Chão liso, linhas nítidas, sombras macias em camadas nos cartões.
- **Os movimentos (o vocabulário):**
  - **a câmera que caminha os anos:** abre baixa e perto dos primeiros anos e viaja até o hoje num movimento longo e
    suave (sobe, recua, endireita), pousando ~1 s depois da agulha. Nunca rasteja em velocidade constante.
  - **a agulha que puxa o azul:** já anda no quadro 0, acelera nos anos do meio e freia no hoje; cada marca fica azul e
    o ano escurece no instante em que ela passa.
  - **o cartão pop-up:** quando a agulha passa o ano do marco, o ponto da base salta, a haste sobe e o cartão abre da
    haste como livro pop-up, passando ~10%. Uma batida limpa por marco, com folga entre eles.
  - **o pouso do HOJE:** o cartão azul chega por último, com mais peso; o selo encaixa um tempo depois e um anel pinga
    da agulha. Último segundo parado.
- **Ritmo:** agulha ~3 s, câmera ~4 s, o resto é segurar.

## Como variar (o jeito, não a demo)

- **Os marcos são os da fala, com os anos ditos.** "Comecei em 2019 no quarto, em 2021 contratei a primeira pessoa,
  hoje somos doze" são três marcos, não quatro. De 2 a 5 marcos; mais que isso, junte ou escolha os que a fala
  enfatiza. Qualquer intervalo cabe: 3 anos ou 40 (o chão se ajusta e os anos sem marco rareiam).
- **O título é o fecho da história** ("Do quarto a doze pessoas"), com a virada em azul; o chapéu diz de quem e o
  intervalo. O cartão HOJE é a frase do "agora" dita.
- **Que movimento cai em que palavra:** cada cartão abre quando o ano dele é dito (acerte o ritmo da agulha à fala); o
  HOJE pousa no "hoje"/"agora". Fala curta (3 s): 2 ou 3 marcos e linha mais rápida. Fala longa: a agulha anda devagar
  entre marcos, nunca fica parada.
- **Formatos:** em 9:16 o chão ganha altura e o título fica em cima, com a legenda abaixo do último cartão; em 16:9 a
  linha corre mais na horizontal e o título vai para a esquerda.

## Nunca

- Cartão que esmaece chapado, linha que enche em velocidade constante.
- Segunda cor, degradê nos cartões, brilho na linha; câmera ainda derivando no fim; HOJE chegando antes da linha.
- Nome de empresa real, logo ou foto de produto sem ser do dono.
- Reusar os marcos e o título da demo ("De uma garagem a 31 países", "Ateliê Norte") ou os quatro marcos por hábito.
