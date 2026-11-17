# cena08: Risograph (Risografia)

- **Tipo:** 2D
- **A cena que ele resolve:** momento leve, artesanal, convite, chamada de evento.
- **Quando a fala pede:** "vem", "dia X", "evento", tom brincalhão.
- **Completa estes modelos:** anuncio-canvas, vetor-minimo, pagina-de-livro.
- **Material e prova:** o sistema faz tudo.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um pôster de duas tintas impresso em risografia que se monta em stop motion. Feito à mão, leve, de evento e de convite:
o oposto do digital liso.

- **Paleta:** papel frio `#EDEFEE` (nunca creme), rosa fluorescente `#FF48B0`, azul médio `#3255A4`. Onde as duas
  tintas se cruzam nasce um violeta fundo (~`#32186F`) por multiplicação; ele nunca é escolhido à mão.
- **Letra:** grotesca pesada em caixa alta (Bricolage Grotesque 800), espaçada ~5%, grande o bastante para atravessar
  o pôster. Uma palavra curta vazada numa forma, deixando o papel aparecer.
- **Layout:** pôster em pé: palavra-herói no alto, dois círculos sobrepostos no meio, a segunda palavra sobre uma
  faixa de listras diagonais e uma fila de pontos que cresce da esquerda para a direita. Margens largas de papel;
  quinto de baixo vazio.
- **Textura:** cada tinta é uma chapa: densidade manchada com pontinhos de papel, borda um pouco rasgada, meio-tom em
  retícula (cada tinta no seu ângulo), as chapas alguns pixels fora de registro (franja rosa de um lado, azul do
  outro), papel com nuvem e fibra.
- **Os movimentos (o vocabulário):**
  - **em dois:** tudo anima segurando cada desenho 2 quadros, e cada desenho é uma impressão nova (o grão muda, o
    registro mexe 1–2 px). É o que faz parecer papel, não tela.
  - **o carimbo:** a forma cai grande (110–116%) com uns graus de giro, passa ~9% para baixo e assenta em 4–5 passos.
  - **o deslize:** a forma entra de fora do quadro numa mola com 8–12% de passada.
  - **a montagem em ordem de leitura:** um elemento por vez, 4–6 quadros entre eles. O quadro 1 já tem tinta.
  - **o deslize de registro:** as duas chapas chutam 20–30 px para lados opostos e voltam passando do ponto; a palavra
    de duas tintas vira uma cópia rosa e uma azul e se junta de novo. É a batida da cena.
  - **as listras andando:** um rastejar lento nas listras mantém o pôster vivo no segurar.
- **Ritmo:** monta em ~1,2 s, segura ≥ 1 s, deslize de registro, segura ≥ 1 s.

## Como variar (o jeito, não a demo)

- **As palavras são as da fala, em caixa alta:** a herói é a palavra que a pessoa tem que guardar (o nome do evento,
  o tema, o convite: "SÁBADO", "OFICINA"); a vazada é uma palavra curta dita (1 a 4 letras: "DIA", "10H", "JÁ"); a da
  faixa é o complemento dito ("NO CENTRO", "INSCRIÇÕES ABERTAS"). Só a herói é obrigatória: frase de duas palavras
  usa herói e faixa; de uma palavra, só herói, círculos e pontos.
- **Que movimento cai em que palavra:** cada carimbo cai na palavra dita que ele imprime; o deslize de registro
  (`inicioSlip`) cai na palavra de impacto ou no "e aí"; sem palavra de impacto, ele fica depois que a fala fecha.
- **Formas:** os dois círculos e a faixa são a gramática do pôster, não do tema. Se a fala pede um objeto (um ingresso,
  uma seta, um disco), desenhe-o como chapa (rosa, azul ou as duas) com a mesma textura e entre com carimbo ou
  deslize; nada de ícone liso.
- **Curta (2 s):** herói carimbada e o deslize, sem faixa. **Longa (6 s):** mais um elemento (a fila de pontos, um
  segundo carimbo de texto dito), nunca mais tintas.
- **Formatos:** 9:16 empilha com mais ar entre herói e círculos; 16:9 vira pôster deitado (herói à esquerda,
  círculos à direita, faixa embaixo).

## Nunca

- Papel creme ou osso; terceira tinta; degradê que não seja retícula.
- Movimento liso de 30 qps ou borrão de movimento: é uma pilha de impressões.
- Borda vetorial limpa, cor digital chapada sem grão.
- Reusar "TINTA EM MOVIMENTO" ou montar sempre os mesmos três textos e o mesmo tempo da demo.
