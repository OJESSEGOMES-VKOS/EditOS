---
name: cena06
description: >
  Estilo de cena cena06 do EditOS (Página de revista com nota): página impressa que se monta e uma caneta vermelha anota. Use quando pedirem "cena X na cena06", "na revista" ou a fala citar, ler ou opinar com calma.
---

# cena06: Magazine Layout and Note (Página de revista com nota)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena06/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala cita uma frase, lê um trecho, ou dá uma opinião ponderada e reage a ela ("leia de novo", "isso aqui").
- Pedido direto do dono ("cena 3 na cena06", "na página de revista") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o tom é urgente e de venda, ou não existe reação de quem fala para virar a nota.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena06/cena06.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena06/componente/LEIA.md` (as props do `MagazineNote.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena06/componente/MagazineNote.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `titulo` = a ideia dita em 1 ou 2 linhas (a 2ª, a virada); `nota` = a reação de quem fala, curta, em 1 ou 2 linhas; coluna, número e legenda só com texto da fala; `foto` = material do dono (o mar pintado é da demo).
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena06/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Papel creme, sombra, dobra, moldura na foto; fade.
- Nota revelada como máquina de escrever: ela segue o traço.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
