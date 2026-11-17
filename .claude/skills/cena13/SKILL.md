---
name: cena13
description: >
  Estilo de cena cena13 do EditOS (Aguada de nanquim): paisagem que se pinta no papel de arroz, título vertical e selo vermelho. Use quando pedirem "cena X na cena13", "no nanquim" ou a fala abrir um capítulo calmo.
---

# cena13: Ink Wash (Aguada de nanquim)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena13/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala abre um capítulo ou uma história calma ("a história de", "parte dois", viagem, comida, cultura).
- Pedido direto do dono ("cena 3 na cena13", "no nanquim") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o tom é urgente, de venda ou de dado; ou a fala é longa demais para um cartão de título.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena13/cena13.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena13/componente/LEIA.md` (as props do `Cena13.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena13/componente/Cena13.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `titulo` = o nome dito (1 ou 2 colunas); frase e capítulo só se ditos; barco e figura só se a fala é viagem ou alguém sozinho; elemento novo pedido pela fala nasce como aguada com frente irregular ou traço que cresce. O carimbo cai no fecho.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena13/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Fade ou dissolve como revelação; degradê digital, vetor duro, sombra, brilho.
- Vermelho além de ponto de cor; título deitado no meio; ideograma de enfeite.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
