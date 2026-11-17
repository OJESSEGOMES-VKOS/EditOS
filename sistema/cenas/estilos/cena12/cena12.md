# cena12: Exploded Teardown (Explodido (teardown))

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** o que tem dentro, as partes de um produto.
- **Quando a fala pede:** "por dentro", "é feito de", "as camadas".
- **Completa estes modelos:** anuncio-neon, prova-print, motion-ouro; para mecanismo físico real, 3d-como-funciona (Blender).
- **Material e prova:** produto do dono: foto/modelo dele; senão objeto genérico assumido.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um produto de verdade, em 3D, que se abre em camadas uma batida por vez, e cada parte ganha nome quando pousa. É o
"o que tem dentro" com ritmo de relógio: cada batida pede um clique de som.

- **Paleta:** fundo grafite com luz suave atrás do produto (`#2A2D33` no meio caindo a `#0A0A0C` nas bordas). Texto
  quase branco `#ECEEF1`, specs em cinza `#A3A8B0`. Um laranja `#FF5A2A` para os números das partes, a barra do título
  e uma peça de destaque. O produto tem os materiais dele (plástico, metal, placa verde), sem estilizar.
- **Letra:** IBM Plex Sans 600 no nome da parte, 700 no título (curto, frase comum); IBM Plex Mono nos números e na
  spec de uma linha. Linha de spec do título em mono caixa alta, espaçada.
- **Layout:** produto à esquerda do centro, vista alta de três quartos, camadas com vãos iguais. Coluna de rótulos
  à direita: número laranja de dois dígitos, nome, spec curta, com uma linha-guia fina cinza até um ponto branco na
  borda da peça. Título embaixo à esquerda. Quinto de baixo vazio.
- **Textura:** luz de estúdio macia, sombras reais entre as camadas, um brilho no metal, grão fraco no fundo. Sem
  contorno, sem brilho na letra.
- **Os movimentos (o vocabulário):**
  - **o recuo que abre espaço:** o quadro 1 é o produto montado, grande e centrado; no primeiro segundo a câmera recua
    e desliza o produto para a esquerda, abrindo lugar para os rótulos.
  - **a camada que salta:** as camadas sobem de cima para baixo, uma a cada 1/3 de segundo, numa mola rápida (~10% de
    passada) que assenta antes da próxima. Batidas iguais: é o que dá satisfação.
  - **a linha-guia que nasce da peça:** quando a camada chega, a linha sai do ponto na peça até a coluna.
  - **o rótulo que sobe da máscara:** número, nome e spec sobem com pequena passada.
  - **a órbita lenta:** a câmera gira ~10° no plano inteiro e freia no fim.
  - **o título por último:** a barra laranja estica, as palavras sobem uma a uma, depois a spec. Segura mais de 1 s.

## Como variar (o jeito, não a demo)

- **Este estilo se recompõe a cada produto.** O teclado é o exemplo; produto novo = camadas novas (a peça `Caixa`
  monta qualquer bloco 3D), uma camada por parte que a fala cita. "O tênis tem solado, entressola, palmilha e cabedal"
  → 4 camadas, 4 rótulos. A quantidade sai da fala (2 a 6), nunca 6 porque a demo tem 6.
- **Rótulo = parte dita; spec só com dado dito** (material, medida, número). Sem dado, spec curta descritiva tirada da
  fala ou nenhuma. Título = o fecho dito, curto.
- **Que movimento cai em que palavra:** cada camada salta no nome da sua parte (ou, se a fala lista rápido, no ritmo
  fixo de 10 quadros); a peça laranja de destaque é a que a fala diz ser a principal; o título cai no fecho.
- **Fala curta (2–3 s):** 2 a 3 camadas e sem título. **Longa:** até 6 camadas e o título.
- **Formatos:** em 9:16 os rótulos podem descer para baixo do produto em coluna, acima da legenda da casa; em 16:9 o
  produto fica no terço esquerdo e a coluna ganha ar.

## Nunca

- Fade em peça ou rótulo; todas as camadas ao mesmo tempo; batidas desiguais.
- Linhas-guia que se cruzam ou rótulo em cima do produto.
- 3D falso com recorte chapado; brilho, lens flare, fundo carregado.
- Produto com marca real recriado sem print de origem (G25).
- Reusar o teclado, as partes ou os textos da demo ("21 teclas, aberto", PBT...) num produto que não é aquele.
