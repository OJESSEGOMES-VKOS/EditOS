# cena01: Glow Orb (Orbe de luz)

- **Tipo:** 2D
- **A cena que ele resolve:** frase curta e calma de efeito, abertura serena, pausa reflexiva.
- **Quando a fala pede:** "respira", "pensa nisso", frase de virada em tom baixo.
- **Completa estes modelos:** pagina-de-livro, vetor-minimo, motion-ouro, pregacao.
- **Material e prova:** o sistema faz tudo; só texto dito.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma luz só, respirando no escuro, e uma frase curta embaixo dela. É silêncio desenhado: a cena existe para a pessoa
parar e ouvir uma frase.

- **Paleta:** chão quase preto e quente `#070304`; halo rosa fundo `#531829` que morre em `#13050B` antes dos cantos;
  orbe rosa `#F696DE` indo ao branco `#FBF6F8`; linhas e letra `#F6EFF2`. Uma cor de luz e nenhuma outra: o brilho é
  do orbe, o resto do quadro fica escuro.
- **Letra:** Outfit 500, frase com ponto final, espaçamento um pouco fechado. Uma linha só, centrada embaixo do orbe.
  Sem negrito, sem caixa alta: o tom é baixo.
- **Layout:** orbe um pouco acima do meio, frase logo abaixo, seis a oito círculos de contorno finos espalhados para as
  bordas (alguns cortados pelo quadro). O quinto de baixo fica vazio.
- **Textura:** só um grão fino mexendo dentro do brilho, para o degradê não fazer faixas.
- **Os movimentos (o vocabulário):**
  - **o respiro fundo:** o orbe recua um tico e infla numa mola que passa uns 10% e assenta. É a entrada; nada aparece
    "do nada".
  - **a respiração lenta:** depois, 2 a 3% de vai e vem a cada 3 s, com a luz um pouco atrasada do corpo. Dá vida no
    segurar sem chamar atenção.
  - **a câmera que chega:** os círculos se aproximam com paralaxe (perto = maior, mais claro, mais rápido) e a chegada
    perde velocidade numa cauda longa. Dá profundidade sem mover a frase.
  - **a letra que nasce da máscara:** cada letra sobe de uma máscara invisível, ~2,5 quadros depois da anterior, com
    pequena passada, enquanto o espaçamento aperta até o lugar. A frase se forma, não aparece.
  - **o anel que se solta:** num segundo tempo do segurar, o orbe expira e o aro dele vira um anel que dobra de tamanho
    e fica em órbita. É a pontuação da cena.
- **Ritmo:** entra em 1 s, a frase assenta em ~2,5 s e segura. Um acontecimento depois do segurar (o anel), não mais.

## Como variar (o jeito, não a demo)

- **A frase é a da fala.** Pegue o pedaço dito que fecha a ideia (3 a 6 palavras: "Ninguém começa pronto.",
  "Faz devagar, mas faz."). Frase de até ~33 letras cabe numa linha; o componente reduz a letra sozinho até o mínimo
  de 56. Mais longa que isso: o estilo não é para ela (use a legenda da casa ou outro estilo), nunca duas linhas.
- **Os tempos seguem a fala, não a demo:** `inicioTexto` cai na primeira palavra dita da frase; `inicioAnel` cai na
  palavra de peso ou na pausa depois do ponto. Fala de 2 s: tire o anel (ponha `inicioAnel` depois do fim). Fala de 6 s:
  o anel vem no meio do segurar.
- **Que movimento cai em que palavra:** o respiro fundo é a entrada da cena; a letra da máscara acompanha a frase
  inteira; o anel marca a virada ("e aí você percebe..."), o número ou a palavra que a pessoa tem que guardar.
- **Formatos:** o miolo é 4:5 centrado e o fundo cobre tudo. Em 9:16 sobra escuro em cima e embaixo (a legenda da casa
  mora abaixo do quinto de baixo, longe da frase); em 16:9 os círculos ficam nas laterais.

## Nunca

- Esmaecer (fade) qualquer coisa: aqui tudo sobe, infla, deriva ou se solta.
- Encher o quadro de rosa, pôr partícula, brilhinho, lens flare ou segunda cor.
- Duas linhas, letra pesada ou arredondada, frase sem ponto final.
- Reusar a frase da demo ("Esteja presente.") nem repetir o tempo da demo quadro a quadro: os tempos nascem da fala.
