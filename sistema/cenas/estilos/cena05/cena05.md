# cena05: Oscilloscope (Osciloscópio)

- **Tipo:** 2D
- **A cena que ele resolve:** o "caiu a ficha", tecnologia, sinal, dado, música.
- **Quando a fala pede:** "aí clicou", "o sinal", "frequência", "dado".
- **Completa estes modelos:** motion-ouro, texto-e-objeto, vetor-minimo.
- **Material e prova:** o sistema faz tudo.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um traço verde de osciloscópio que é sinal e vira palavra. Uma linha só, do primeiro ao último quadro: tudo o que
acontece é essa linha mudando de forma. É o "caiu a ficha", o sinal que entra em sintonia.

- **Paleta:** tela `#030805` com uma face de tubo um pouco mais clara no meio `#09150E`, grade `#0D2216`, brilho do
  fósforo `#46FF8C`, miolo do feixe quase branco `#D7FFF3`. Verde e nada mais.
- **Letra:** a palavra É o traço: maiúsculas geométricas monolinha, de pé na linha do zero, altura ~9–11% do quadro.
  Leitura opcional numa mono técnica pequena (Share Tech Mono) em verde apagado, poucas palavras.
- **Layout:** grade de quadrados centrada, com marcas nos dois eixos, que some para as bordas (nunca moldura). O traço
  sai pelos dois lados do quadro como um feixe de verdade. Palavra logo acima do eixo do meio; leitura pequena e
  centrada mais abaixo.
- **Textura:** brilho de fósforo (miolo fino e claro, halo verde macio), rastro de persistência dos últimos quadros
  atrás do que mexe, grão fino no escuro.
- **Os movimentos (o vocabulário):**
  - **o seno que trava:** abre numa onda rolando que "pega o gatilho" e para. É o sinal procurando.
  - **a figura que gira:** a onda dobra numa figura de Lissajous 2:3 que gira devagar. É o sinal "em análise".
  - **o amortecer:** a figura solta, vira onda e morre até a reta como uma mola, passando pelo zero uma vez. Silêncio
    antes da palavra.
  - **as letras que sobem da reta:** da esquerda para a direita, cada letra cresce da linha com ~10% de passada, o
    rastro borrando embaixo. A palavra nasce do sinal, nunca aparece do nada.
  - **o feixe:** um ponto claro corre pela curva enquanto ela ainda é sinal.
- **Ritmo:** sinal ~2,5 s, palavra assentando em ~0,5 s, segurar ≥ 1,5 s.

## Como variar (o jeito, não a demo)

- **A palavra é a palavra-chave dita,** uma só (ou duas curtas, até ~10 letras no total): o nome do que "clicou", um
  número dito ("3X", "100"), um verbo de virada ("FUNCIONOU"). O componente escreve A–Z, 0–9, `!` e `.`, tira o
  acento e reduz a altura para caber.
- **O tempo do sinal segue a fala:** `inicioPalavra` cai no quadro em que a palavra é dita; a curva inteira (seno,
  figura, amortecer) estica ou encolhe junto. Fala curta (até ~1,5 s antes da palavra): o seno vai direto ao
  amortecer, pouco giro. Fala longa (4+ s de explicação antes): a figura gira mais tempo, nunca inventa outra palavra.
- **Que movimento cai em que palavra:** o seno rolando = o problema, a busca, o ruído ("eu tentava de tudo"); a figura
  girando = o meio, o pensar; o amortecer = a pausa antes do "e aí"; as letras = a palavra-chave.
- **A leitura** é opcional: um dado dito (frequência, "AO VIVO", uma data) ou nada; `'tecnica'` só se a fala é de
  tecnologia mesmo.
- **Formatos:** a grade e o traço enchem qualquer formato. Em 9:16 a palavra fica no terço do meio, acima da legenda;
  em 16:9 a palavra pode ter mais letras.

## Nunca

- Brilho de letreiro neon: o halo é curto e verde, o miolo quase branco.
- Moldura em volta da tela, rótulo nos cantos, mais de uma linha de leitura.
- Letra que aparece do nada, corte ou troca de traço: tudo nasce da mesma linha.
- Reusar a palavra da demo ("SINTONIA") ou repetir o tempo da demo quando a fala pede outro.
