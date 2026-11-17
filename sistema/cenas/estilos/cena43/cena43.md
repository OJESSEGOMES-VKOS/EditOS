# cena43: Deep Time (Tempo profundo)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** abertura épica, saltos de milhões de anos.
- **Quando a fala pede:** "há 4 bilhões de anos", "no começo", "o universo".
- **Completa estes modelos:** documental-dados, personagem, motion-ouro.
- **Material e prova:** datas com fonte.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um plano de documentário do espaço, numa janela de cinema: uma coisa enorme acontecendo devagar, e uma legenda cinza
pequena dizendo quando. O peso vem do silêncio visual: quase tudo é preto, e só a coisa que importa pega fogo.

- **A janela:** barras pretas sólidas em cima e embaixo (96 px no palco 4:5). A imagem mora numa faixa, como filme.
- **Paleta:** espaço quase preto `#070504` com pontinhos brancos de força diferente. Todo o resto é uma rampa só de
  fogo: brasa `#613821` nas bordas, laranja queimado `#B26D3C` no corpo, âmbar `#EEB86F` no claro e quase branco
  `#FCFADA` no mais denso. O anel de luz é `#FFF1E0`. Nenhuma outra cor.
- **Textura:** gás é fumaça, não areia: corpo deslocado por ruído, grãos finos brilhando por cima, brilho macio em volta
  do que é quente.
- **Letra:** uma linha só de legenda, Source Sans 3 regular, 30 px, cinza claro `#B6B6B4`, centrada na barra de baixo.
  Nada de título grande.

**Os movimentos (o vocabulário):**
- **Já está acontecendo:** o primeiro quadro mostra a coisa em movimento (o disco girando, a estrela perto). Não há
  abertura nem entrada.
- **A câmera que chega e gira:** aproximação lenta com um leve giro, poeira passando na frente da lente.
- **O esticar e o rasgar:** o objeto que sofre a ação estica e, num instante marcado, se rompe e vira um fluxo. É a
  virada da cena.
- **O fluxo que fecha:** o que se soltou percorre um caminho e fecha uma forma (anel, espiral). O desenho termina sozinho.
- **O número que rola:** o ano (ou a medida) sobe rolando e pousa no valor dito; a frase entra depois de um traço fino.
- **O tempo que freia:** tudo desacelera até parar; o último segundo é uma fotografia.

## Como variar (o jeito, não a demo)

- **O objeto é o que a fala conta.** O componente desenha um buraco negro rasgando uma estrela (a demo). Uma fala sobre
  o Sol ficando gigante, duas galáxias se encontrando, a Terra se formando ou a Pangeia se partindo pede o mesmo
  tratamento com outro desenho: copie o `Cena43.tsx` e troque a geometria (o disco, o caminho `STREAM`, a estrela),
  mantendo a janela, a rampa de fogo, a fumaça com grãos e a legenda. Cada assunto novo é desenho próprio.
- **Fora do espaço:** a mesma linguagem serve a "daqui a 10 anos" ou "há 3 bilhões de anos": o que muda é o que pega
  fogo no meio do preto (um planeta seco, um vulcão visto de cima). Sempre uma coisa só.
- **As batidas seguem a frase.** "Daqui a um bilhão de anos" é só o número rolando sobre a cena viva. "Um buraco negro
  alcança a estrela e a despedaça" pede o esticar, o rasgar e o fluxo. Uma frase com dois saltos de tempo pede duas
  cenas cortadas secas, cada uma com seu número.
- **A legenda é a fala:** `rotuloAno` e o número como foram ditos ("Daqui a", "há"), `frase` resumida da fala. Sem número
  dito, sem número (`anoFinal` vazio).
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 as barras crescem e a coisa fica no meio; em 16:9 a janela fica larga
  e baixa, que é o formato natural do cinema. A legenda fica sempre dentro da barra de baixo.

## Nunca

- Planeta com continentes, globo, lens flare, raios de luz cruzando o quadro, título grande.
- Qualquer cor além do preto, branco, cinza e da rampa de fogo.
- Estrela (ou objeto) que só some esmaecendo: ela é puxada, rasgada, transformada.
- Usar filmagem, música, nome ou texto de canal existente.
- Reaproveitar o buraco negro, a estrela ou a legenda da demo (`componente/textos-demo.json`) quando a fala não fala
  disso, ou repetir a coreografia da demo batida a batida.
