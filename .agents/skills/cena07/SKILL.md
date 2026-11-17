---
name: cena07
description: >
  Estilo de cena cena07 do EditOS (Editorial azul): frase-manifesto, título ou virada como capa de revista em movimento. Use quando pedirem "cena X na cena07", "no editorial azul" ou a fala fechar numa frase forte.
---

# cena07: Blue Editorial (Editorial azul)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena07/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala fecha numa frase-manifesto curta e forte, num título ou numa virada de capítulo.
- Pedido direto do dono ("cena 3 na cena07", "no editorial azul") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a frase passa de ~6 pedaços, tem número para provar, ou o tom é calmo e íntimo.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena07/cena07.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena07/componente/LEIA.md` (as props do `BlueEditorial.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena07/componente/BlueEditorial.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** parta a frase dita em 2 a 6 pedaços onde ela respira (`partes`, minúsculas, como foi dito); enorme = palavra de peso, pequena = ligação; `tempos` na palavra dita. O movimento de cada parte vem do lugar dela na capa, não da demo (`demo-coreografia.tsx` é só da demo).
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena07/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Roxo, marinho, degradê, brilho, terceira família, maiúsculas.
- Grade modular, rótulo numerado, simetria centrada; fade ou dissolve.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
