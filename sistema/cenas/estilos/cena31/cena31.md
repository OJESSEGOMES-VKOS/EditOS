# cena31: Card flip (Cartão que vira)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** oferta, plano, preço, o que você recebe.
- **Quando a fala pede:** "o plano", "por R$", "você recebe".
- **Completa estes modelos:** anuncio-neon, anuncio-canvas, prova-print.
- **Material e prova:** oferta e preço reais do dono.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um cartão preto de metal, com espessura de verdade, flutuando num estúdio claro. Ele vira e mostra o que a oferta é.
A oferta deixa de ser texto e vira um objeto que dá vontade de segurar.

- **Fundo:** parede de estúdio cinza bem claro, `#EEF0F3` em cima a `#E0E3E8` embaixo, mais clara atrás do cartão.
  Neutra para o preto do cartão mandar.
- **O cartão:** preto titânio `#15171A`, deitado, ocupando uns 80% da largura, levemente inclinado para mostrar a
  borda. Acabamento acetinado com reflexo que escorrega, risco escovado fino e borda polida que acende de lado.
  Sombra macia na parede.
- **Letras:** Manrope. A frente leva só a marca (700) e, no máximo, uma linha pequena em caixa alta espaçada. O verso
  leva o nome do plano enorme (800, um terço da altura do cartão) e o preço embaixo, com o período menor e mais leve.
  Pouca coisa e grande: é isso que faz parecer caro.
- **Cor:** prata-branco `#F3F5F7` nas letras do cartão, quase preto `#121417` nos benefícios e um único acento,
  laranja `#FF5A1F`, só no símbolo da marca e nos círculos de visto.
- **Benefícios:** até três linhas curtas embaixo do cartão, alinhadas à esquerda num bloco centrado, Manrope 700 grande
  (56), cada uma com um círculo laranja.

**Os movimentos (o vocabulário):**
- **O giro lento:** o primeiro quadro já mostra a frente a três quartos, girando devagar, com um brilho atravessando e
  a câmera chegando perto. Apresenta o objeto.
- **A virada:** 180 graus com mola, como um peteleco: acelera, sobe na direção da câmera, mostra a borda polida no meio
  e pousa no verso com um passinho além. Borrão de movimento real, nunca achatar de lado. É a revelação.
- **O segundo brilho:** passa pelo verso no pouso, e a sombra na parede estreita e amacia enquanto o cartão sobe.
- **O cartão sobe:** desliza para cima e abre espaço.
- **Os vistos:** cada benefício entra um quarto de segundo depois do outro: o círculo salta, o visto se desenha, a
  palavra sobe de dentro de uma máscara.
- **A pausa:** o último segundo é parado. A oferta precisa ser lida.

## Como variar (o jeito, não a demo)

- **O objeto muda com o assunto, o gesto fica.** O cartão serve para plano, assinatura, ingresso, convite, cartão de
  fidelidade, crachá de evento. O que vai nele é o que a fala nomeia: a marca real do dono, o plano e o preço ditos.
  Ingresso pode ganhar formato mais estreito (mude `CW`/`CH` no componente); o metal preto, a borda e a virada ficam.
- **Quantos benefícios a fala citar:** zero, um, dois ou três (`beneficios`). Fala que só diz o preço termina no verso,
  sem lista; aí a cena fica mais curta.
- **A virada cai na palavra do preço ou do plano** (`viradaEm`, em quadros). O giro lento cobre o que vem antes.
- **Frase curta** ("é R$ 29 por mês"): giro curto, virada, pausa. **Frase longa** com quatro ou mais itens: o resto vai
  para a fala ou para outra cena; o cartão nunca leva lista.
- **Comparar planos** não é este estilo (é a cena28 ou dois cartões em cenas seguidas, um por plano dito).
- **Formatos:** o palco é 4:5. Em 9:16 sobra parede em cima e embaixo (a legenda da casa mora embaixo dos benefícios);
  em 16:9 o cartão fica no centro e a lista pode ir para a direita dele se a altura apertar.

## Nunca

- Cartão chapado que achata de lado para fingir a virada: tem que ter espessura, borda e perspectiva.
- Dourado, purpurina, holograma de arco-íris, logo de banco ou bandeira real, chip, número de cartão.
- Letra miúda no cartão, mais de três benefícios, benefício que só aparece esmaecendo.
- Preço ou plano que a pessoa não disse.
- Reaproveitar a marca Norte, o plano Pro, o preço ou os benefícios da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida quando a fala pede outra (sem lista, um benefício, virada mais tarde).
