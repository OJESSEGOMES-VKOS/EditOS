# cena20: Globe arcs (Globo com arcos)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** alcance: de um lugar para muitos.
- **Quando a fala pede:** "no mundo todo", "X países", "clientes em".
- **Completa estes modelos:** documental-dados, anuncio-neon, prova-print.
- **Material e prova:** número e lugares como ditos; prova real se for resultado.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um globo de pontos escuro, de site de fintech: rotas saem de uma cidade em arcos laranja, cada uma pousa com uma onda e
um pino, e um número grande sobe um degrau a cada pouso. "Estamos em todo lugar" num plano só, calmo.

- **Paleta:** azul-marinho fundo `#0E1830` caindo a quase preto `#05070C` nas bordas, com grão para não fazer faixas;
  oceano `#0A1426` com borda fina azul fria (borda, não brilho); terra feita de milhares de pontinhos quase brancos
  frios `#C9D6EE` em intensidades levemente diferentes; rotas num laranja quente `#FF8A3D`, mais claro na ponta enquanto
  desenham; pinos brancos com anel escuro. O laranja é a única cor que grita.
- **Letra:** Inter Tight. Número grande em 600 (~200 px, dígitos de largura fixa) com a unidade ao lado em 500 a um
  terço do tamanho, na mesma linha de base, em azul-acinzentado. Em cima, rótulo pequeno em JetBrains Mono caixa alta
  espaçada, azul apagado. Nome de cidade pequeno, só na origem e em até dois destinos.
- **Layout:** texto centrado em cima; globo grande e centrado embaixo, quase da largura do quadro; a origem no alto à
  esquerda do globo para as rotas abrirem em leque pela face toda. Quinto de baixo vazio.
- **Textura:** nítido e calmo. Os pontos achatam em elipses e apagam perto da borda: é isso que vende o 3D.
- **Os movimentos (o vocabulário):**
  - **o globo que já gira:** no quadro 1 o globo está girando e a primeira rota já saiu. Gira ~40° para leste numa
    desaceleração longa, com a câmera chegando um pouco; os dois param juntos, macios. Sem tranco.
  - **a rota que voa:** cada rota decola pelo caminho mais curto (viagem longa voa mais alto), acelera e freia ao
    pousar. Uma nova a cada ~1/4 de segundo.
  - **o pouso que conta:** a cada pouso, um anel fino ondula uma vez, o pino salta com passada leve e o número troca para
    o próximo valor (o dígito velho sobe e some, o novo sobe e assenta). A última e mais longa pousa no número final.
  - **o segurar:** o último segundo é completamente parado.

## Como variar (o jeito, não a demo)

- **A origem, os destinos e o número são os da fala, reais.** "A gente já mandou pra 14 estados" → origem na cidade do
  dono, destinos reais, número final 14. Quantos pousos houver, tantos valores (um degrau por pouso), nunca contar
  direto ao final. Escolha `lonInicio`/`lonFim`/`latCentro` para a origem ficar no alto à esquerda e nenhum destino
  pousar atrás do globo.
- **Brasil e não o mundo:** o mesmo globo, com o centro no Brasil e um giro menor; mapa com estados é outro estilo (use
  o `cena11` para rota de A a B).
- **Que movimento cai em que palavra:** o primeiro pouso cai no começo da frase do alcance; o número final no número
  dito; a unidade é a palavra dita ("países", "cidades", "clientes"). Fala curta: 3 a 5 rotas; longa: até ~12, nunca
  todas de uma vez.
- **Nomes na tela:** origem e no máximo dois destinos que a fala cita.
- **Formatos:** em 9:16 o globo fica maior embaixo e o número em cima, legenda abaixo do globo; em 16:9 o número vai
  para a esquerda e o globo para a direita.

## Nunca

- Neon, halo brilhante, lens flare, rastro de partícula; mapa chapado fingindo globo ou Terra de satélite.
- Pousar tudo junto ou contar direto ao número final.
- Rota pousando atrás do globo ou globo lotado de nomes.
- Reusar a origem, as cidades e o número da demo (Lisboa, Luanda, Singapura, "38 países", "PEDIDOS ENVIADOS").
