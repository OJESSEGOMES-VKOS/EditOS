# cena18: Screen-Recording Zoom (Zoom na gravação de tela)

- **Tipo:** 2D
- **A cena que ele resolve:** passo de tutorial: "clica aqui, depois aqui".
- **Quando a fala pede:** "clica", "abre", "cola", "aqui em cima".
- **Completa estes modelos:** prova-print, youtube-didatico, rosto-telas, autoridade.
- **Material e prova:** gravação de tela do dono.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O zoom de tutorial bem produzido: a janela do programa flutua num fundo menta, o cursor vai até o botão certo e a
câmera chega junto, macia, até o clique. Transforma "clica aqui" em algo que parece filmado.

- **Paleta:** fundo menta claro `#E3EFE9` no alto à esquerda, `#B8D7D6` à direita, `#9CC4BD` embaixo, com grão. A
  janela é escura: `#1B1C20`, barra `#212227`, painéis `#26272C`–`#2A2B31`, fios `#33353B`; texto `#ECEEF1` e rótulo
  `#9A9FA8`. Um acento só: o azul do botão principal `#3D7BFA` (e o vermelho `#FF5A4E` da agulha, se houver linha do
  tempo). Com a tela real do dono, valem as cores dela; o fundo menta fica.
- **Letra:** Inter na interface (600 em títulos, botões e valores; 500 em rótulos); JetBrains Mono só em tempo e
  tamanho de arquivo. Pílula do passo em Inter 600, tinta quase preta em pílula branca, número num círculo preto.
- **Layout:** plano aberto com a janela inteira e bastante fundo em volta, cantos redondos, sombra funda. Plano
  fechado: a janela sai pela esquerda e por baixo, o alvo no terço de baixo à direita, e o canto de cima à direita
  ainda mostra fundo (nunca se perde a ideia de tela). A pílula do passo no meio de baixo, acima do quinto final.
- **Textura:** grão só no fundo; a interface é nítida, desenhada em tamanho cheio, nunca print esticado.
- **Os movimentos (o vocabulário):**
  - **o plano aberto primeiro:** no quadro 1 a janela e o cursor já estão lá, para ler antes de mexer.
  - **o cursor conduz:** anda numa curva (nunca reta) e freia no botão. Mão de gente, não robô.
  - **a câmera segue:** começa um tempo depois e aproxima ~2x numa mola só, sem quique, pousando logo depois do cursor;
    borrão de movimento só enquanto anda.
  - **o clique físico:** o botão escurece quando o cursor chega, o cursor afunda, o botão aperta a 95% e volta, e um
    anel branco salta do ponto com uma onda fraca passando.
  - **a pílula do passo:** entra por último, crescendo com passada leve; o número salta um tempo depois. Depois segura
    mais de um segundo.
- **Ritmo:** cursor ~1 s, zoom ~1,3 s, clique em ~1,5 s, pílula em ~2 s, o resto é segurar.

## Como variar (o jeito, não a demo)

- **A tela é a do dono, recriada fiel (G25),** passada em `janela` (desenhada em 1000x1100), e o `alvo` é o botão que
  a fala manda clicar. A janela de exportar vídeo da demo é só exemplo: sem print real com origem, o estilo não entra.
- **Um passo por cena.** "Clica em Configurações, depois em Pagamentos" são duas cenas no estilo (ou uma cena com dois
  zooms bem separados, nunca zooms brigando). Cada passo: cursor, zoom, clique, pílula.
- **A pílula diz o passo como foi dito** ("Abra Pagamentos"), com o número da ordem na fala; sem passo numerado, deixe
  `passoTexto` vazio e fique só no clique.
- **Que movimento cai em que palavra:** o cursor sai no começo da frase; o clique cai no verbo ("clica", "aperta",
  "escolhe"); a pílula no fim da frase. Fala curta: corte a pílula. Fala longa: segure o plano aberto um pouco mais
  antes do cursor sair.
- **Formatos:** em 9:16 o plano fechado pode ser mais apertado (o alvo maior) e a pílula sobe para longe da legenda; em
  16:9 a janela inteira cabe com folga e o zoom é menor (~1,6x).

## Nunca

- Zoom num print chapado (texto fica mole no fim); zoom linear; cursor em reta e velocidade constante.
- Zoom que quica ou passa, ou vários zooms pequenos brigando.
- Nome ou logo de app real, arquivo de pessoa real, interface genérica fingindo ser a do dono.
- Reusar a janela e os textos da demo ("Exportar", "Resumo do fim de semana v3", "Clique em Exportar").
