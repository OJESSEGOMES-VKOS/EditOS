---
name: cena22
description: >
  Estilo de cena cena22 do EditOS (Fluxo isométrico): maquete isométrica onde cada etapa brota do chão com etiqueta e algo viaja entre elas. Use quando pedirem "cena X na cena22" ou a fala explicar um processo em etapas.
---

# cena22: Isometric flow (Fluxo isométrico)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena22/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala explica como um sistema ou processo funciona em etapas (2 a 5), com algo que passa de uma para a outra.
- Pedido direto do dono ("cena 3 na cena22", "no fluxo isométrico") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há etapas em ordem, ou a cena pede o mecanismo físico de verdade (aí é 3d-como-funciona, no Blender).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena22/cena22.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena22/componente/LEIA.md` (as props do `Cena22.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena22/componente/Cena22.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** as etapas são as ditas, na ordem e no número da fala; cada uma é um bloco que diz o que ela é, e o que viaja é o que a fala move. O componente é a referência de 3 etapas de entrega: com outro número ou outros objetos, recomponha o diorama no vídeo com as mesmas primitivas.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena22/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Câmera em perspectiva; prédio ou etiqueta que esmaece; etiqueta sobre etiqueta.
- Degradê nos objetos, neon, brilho, cor extra, arco-íris de etapas.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
