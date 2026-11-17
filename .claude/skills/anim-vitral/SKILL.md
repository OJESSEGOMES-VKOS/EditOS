---
name: anim-vitral
description: Estilo de animação Vitral do EditOS: painel de vidro com chumbo que acende caco por caco em cor de joia. Use quando pedirem vídeo animado "vitral", "igreja", "cor de joia" ou o tema for história com clima ou conteúdo solene.
---

# Vitral: estilo de animação do EditOS

**2D.** A tela é um painel de vidro com chumbo; cada coisa acende caco por caco, em cor de joia, com a luz atravessando.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história com clima, curiosidade, conteúdo que pede cor forte e um ar solene.
- **Pedidos que chamam este estilo:** "vitral", "igreja", "cor de joia", ou um tema de história com clima ou conteúdo solene.
- **Quando não:** Dica rápida, tecnologia ou humor. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** a tela inteira é uma malha de cacos de vidro escuros e foscos, presos por chumbo preto. Uma luz passeia por trás e acende de leve os cacos por onde passa. Feixes de luz com poeira descem na diagonal.
- **Cores:** cores de joia, saturadas (`COR`): rubi, âmbar, ouro, esmeralda, folha, safira, celeste, ametista e opala. Cada caco sai um pouco diferente do vizinho.
- **Forma:** ninguém desenha contorno. A coisa nasce quando os cacos que caem dentro dela acendem, do centro pra fora, com um brilho rápido. A borda leva chumbo grosso.
- **Letra:** Cinzel Decorative nos títulos, em vidro colorido contornado de chumbo. Marcellus na legenda.
- **Movimento:** acende, a luz passeia, as peças soltas (gotas, folhas) andam. O vapor e a chuva são cacos que sobem e caem.
- **Transição:** um clarão de sol atravessa o vidro na diagonal no começo de cada cena (`Clarao`).
- **Legenda:** Marcellus, creme, palavra dita em ouro, com sombra escura forte, a 72% da altura.

**Por quê:** A luz atravessando o vidro dá ar solene e bonito, de catedral. Cada caco acendendo cria expectativa até a figura ficar inteira.

## As peças
Em `sistema/animacoes/src/estilos/vitral/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/vitral'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Vidro` | acende um trecho do painel numa cor: recebe uma ou mais formas (listas de pontos) e liga os cacos de dentro |
| `Caco` | uma peça de vidro solta, inteira, com chumbo e reflexo: pra coisa pequena ou que se mexe |
| `Letreiro` | texto em vidro, letra por letra acendendo |
| `Clarao` | a transição: luz que atravessa o vidro |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como quem monta um vitral: uma forma grande e simples, uma cor só por área. Coisa grande e parada vira `Vidro`
(o contorno em pontos, com `circulo()` pras redondas); coisa pequena ou que anda vira `Caco`. Uma casa é um `Vidro`
quadrado âmbar com um `Vidro` triangular rubi em cima. Duas ou três cores por objeto bastam.

**Exemplo trabalhado:** "A construção de uma catedral": as pedras como Vidros cinza, o andaime em Cacos marrons, a rosácea que acende caco por caco quando a fala chega na janela, e o sino âmbar no topo.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo vitral`, em `animacoes/estilos/fotos/vitral-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo vitral` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Detalhe fino: o caco tem uns 66 de largura, forma menor que isso some. Detalhe pequeno vai em `Caco`.
- Usar cor escura pra coisa importante: ela some no painel apagado.
- Símbolo religioso ou janela de igreja: o estilo é a técnica do vidro, não o lugar.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
