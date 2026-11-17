# cena03: Apple One-Take (Plano-sequência Apple)

- **Tipo:** 2D
- **A cena que ele resolve:** revelação de produto ou funcionalidade em um movimento só, sem corte.
- **Quando a fala pede:** "olha o que ele faz", "funciona assim", apresentação de recurso.
- **Completa estes modelos:** anuncio-neon, anuncio-canvas, motion-ouro, prova-print.
- **Material e prova:** print real do produto do dono quando mostrar o produto.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um plano só, sem corte: um objeto vira o próximo, que vira o próximo, até virar a frase final. O fundo claro e liso
deixa toda a atenção na transformação. É "olha como isso funciona" com cara de lançamento.

- **Paleta:** chão `#EEEEEC`, tinta `#111113`, papel `#FBFBF9` e um vermelho `#FF3B30` que só existe num ponto. Um
  degradê azul suave é permitido dentro de um quadro de "conteúdo". Nada mais.
- **Letra:** Inter Tight. A frase final em 700, enorme (~160 px no 4:5), espaçamento bem fechado (-0.04em). Rótulos
  de interface em 600; texto secundário a 50–70%; contador com números de largura fixa.
- **Layout:** tudo centrado num objeto portador. A frase final um pouco acima do meio. Quinto de baixo vazio.
- **Textura:** nenhuma. Profundidade só por sombras em camadas (uma de contato, duas largas), no tamanho do objeto, que
  somem quando ele vira letra.
- **Os movimentos (o vocabulário):**
  - **o portador que muda de forma:** ponto → pílula → cartão → quadrado → celular. Cada estado nasce do anterior por
    geometria (largura, altura, raio), nunca por corte ou fade.
  - **a cor por geometria:** preto vira branco porque a borda escura afina de dentro para fora.
  - **o clique:** um ponteiro chega, aperta (a pílula afunda ~7%) e sai. O toque que dispara a próxima forma.
  - **o conteúdo que vem atrás:** o miolo segue o recipiente ~3 quadros atrasado, em cascata de molas.
  - **o recuo de câmera:** o celular encolhe em curva exponencial (desacelera como câmera de verdade) e vira o "O" da
    frase; o resto da frase desliza com borrão direcional só enquanto anda.
  - **o ponto que sobrevive:** o ponto vermelho passa por todos os estados e pousa como o ponto final.
- **Molas:** entradas com ~10% de passada, grandes mudanças de forma com ~5%. Segurar parado e nítido no fim (≥ 1 s).

## Como variar (o jeito, não a demo)

- **Este estilo se recompõe a cada fala.** O componente é a implementação de referência (a cadeia da demo); a cena
  nova reescreve a cadeia de estados a partir do que a frase diz. Exemplo: "você manda a mensagem, o cliente responde e
  a venda fecha" → ponto → balão de mensagem → balão de resposta → cartão de pedido → a frase final. Outro exemplo,
  "um botão, e o site está no ar" → ponto → botão → navegador → recuo → frase.
- **Número de estados = número de passos ditos** (2 a 5). Fala curta: ponto → um estado → frase. Fala longa: mais
  estados, cada um na palavra que o nomeia, nunca mais que 5 (passa de 6 s).
- **Que movimento cai em que palavra:** o clique cai no verbo de ação (aperta, manda, liga); cada forma nova cai no
  substantivo que ela é; o recuo cai no fecho ("e pronto", "é isso"); a frase final é o fecho dito, curto (1 a 3
  palavras). Se a frase não começa com uma letra redonda (O, Q, C, G, D), o portador fecha no ponto vermelho, que vira o
  ponto final, em vez de virar o "O".
- **Formatos:** em 9:16 o celular pode ficar maior (mais altura livre) e a frase final quebra em duas linhas se passar
  da largura; em 16:9 o portador vira tela de notebook ou cartão largo antes do recuo.

## Nunca

- Corte, fade ou dissolve onde deveria haver transformação de forma.
- Segunda cor de destaque, ou o vermelho em qualquer coisa que não o ponto.
- Vinheta em degradê no fundo (faz faixas); borrão num quadro parado; texto deslizando em velocidade constante.
- Celular ou app com marca real (G25).
- Reusar a cadeia da demo (gravar, relógio, take, "Outro take") ou seus textos: a cadeia sai da fala.
