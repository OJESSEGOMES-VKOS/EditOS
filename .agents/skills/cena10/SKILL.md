---
name: cena10
description: >
  Estilo de cena cena10 do EditOS (Lápis à planta técnica): rabisco a lápis que a tinta azul vira planta, com cotas. Use quando pedirem "cena X na cena10", "na planta técnica" ou a fala for da ideia ao produto.
---

# cena10: Pencil to Blueprint (Lápis à planta técnica)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena10/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala conta que algo saiu de um rascunho e virou coisa real ("desenhei no guardanapo e hoje é a loja"), processo, projeto, engenharia.
- Pedido direto do dono ("cena 3 na cena10", "no lápis à planta") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há um objeto simples para desenhar de perfil, ou a fala pede o mecanismo físico por dentro (aí é 3D Blender).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena10/cena10.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena10/componente/LEIA.md` (as props do `PencilBlueprint.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena10/componente/PencilBlueprint.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** desenhe o objeto dito com `linha()`/`elipse()` em `tracos` (15 a 30 traços, na ordem de mão); a inundação cai na virada ("virou", "hoje"); cotas só com número dito (0 a 3); rótulo = o antes e depois dito, em caixa alta.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena10/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Corte ou fade do rascunho para a planta; brilho nas linhas; mais de 3 cotas.
- Medida inventada; lápis ou mão na tela; letra cursiva.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
