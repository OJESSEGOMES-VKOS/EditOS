# cena04: Retro CRT Glow (TV de tubo (CRT))

- **Tipo:** 2D
- **A cena que ele resolve:** anúncio, "vem aí", estreia, volta ao passado, cara de transmissão.
- **Quando a fala pede:** "atenção", "vem aí", "lá em 2010", "notícia".
- **Completa estes modelos:** imagem-por-palavra, texto-e-objeto, personagem, anuncio-neon.
- **Material e prova:** o sistema faz tudo; só texto dito.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma TV de tubo antiga liga e mostra um título em fósforo quente. É cara de transmissão: "vem aí", estreia, aviso,
volta ao passado. A graça está no ligar e desligar do tubo, não no texto mexendo.

- **Paleta:** preto de tubo `#07090F` com um leve azul-acinzentado de vidro `#0B0E16` no meio; o miolo da letra quase
  branco `#FCFBF8`; o brilho em volta rosa-coral `#FF9A90`; um vermelho pequeno `#F05A4A` só no ponto da linha de
  sistema. A cor mora na névoa do brilho, nunca no miolo da letra.
- **Letra:** título numa letra larga retro-futurista em caixa alta (Syncopate 700), espaçada ~6%, ocupando ~80% da
  largura. Uma linha de sistema em mono técnica (Share Tech Mono), caixa alta espaçada, a ~80% de brilho.
- **Layout:** título centrado um pouco acima do meio; linha de sistema embaixo, presa à esquerda (digitar não a
  empurra), com o ponto vermelho na frente. Nada nos cantos.
- **Textura:** miolo branco-quente dentro de três camadas de brilho; linhas de varredura finas; vinheta que escurece até
  a borda arredondada do tubo (sem moldura desenhada); reflexo diagonal fraco no vidro; franja vermelha e azul nas
  laterais; neve leve.
- **Os movimentos (o vocabulário):**
  - **a linha que acende:** o quadro 1 já é uma linha horizontal acesa no tubo escuro; ela incha uns quadros.
  - **o tubo que abre:** a linha se parte em duas bordas que correm para longe e a imagem desdobra entre elas,
    achatada, passando ~10% e assentando em ~12 quadros. É assim que o título chega; ele nunca esmaece.
  - **o tubo quente:** ao abrir, brilho, franja e balanço de sincronia a mais, que esfriam em ~0,5 s.
  - **a linha de sistema digitada:** uma letra a cada ~1,5 quadro atrás de um cursor de bloco; no fim o ponto vermelho
    acende com um estalo e o cursor pisca com rastro de fósforo.
  - **o zumbido:** no segurar, uma faixa clara rola devagar pela tela e o brilho tremula ~1%. Vida sem mexer no texto.
  - **o tubo que fecha:** a saída é mais rápida que a entrada: a imagem colapsa na linha em ~9 quadros e a linha
    estreita até o estado do começo.
- **Ritmo:** abre em 0,4 s, digita, segura ≥ 2 s, fecha rápido no fim da fala.

## Como variar (o jeito, não a demo)

- **O título é o que a fala anuncia,** em 1 a 3 linhas curtas (uma ideia por linha, quebrada onde a fala respira):
  "AMANHÃ / ÀS 19H", "A VOLTA / DO VHS / EM 2026" (com o que foi dito). O componente encolhe a letra para a linha mais
  longa caber. Palavra de 10+ letras sozinha numa linha: tudo bem; frase de 6+ palavras: não é este estilo.
- **A linha de sistema é opcional** e só existe quando a fala dá um dado de transmissão: a data, o canal, "AO VIVO",
  "EPISÓDIO 3". Sem dado dito, sem linha (o ponto vermelho vai junto).
- **Que movimento cai em que palavra:** o tubo abre na primeira palavra do anúncio; a digitação acompanha o dado
  dito; o tubo fecha no fim da frase, nunca no meio. Duas frases de anúncio seguidas = fecha e abre de novo (um ciclo
  por frase), nunca dois títulos na mesma imagem.
- **Curta (≤ 2 s):** abre e fecha sem linha de sistema. **Longa (6 s):** o segurar fica mais longo com o zumbido; não
  invente acontecimento.
- **Formatos:** o tubo enche qualquer formato (vinheta acompanha). Em 9:16 o título fica no terço do meio, acima da
  legenda; em 16:9 o título cabe numa linha só mais vezes.

## Nunca

- Neon saturado, contorno colorido, moldura ou caixa (a borda do tubo é só vinheta).
- Título esmaecendo: ele chega com a imagem abrindo.
- Glitch pesado, RGB separado ou tremedeira no texto depois de assentado.
- Reusar o título e a linha da demo ("FIQUE LIGADO", "SINAL CAPTURADO") ou pôr linha de sistema que ninguém disse.
