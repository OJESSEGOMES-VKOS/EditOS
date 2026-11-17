---
name: cena12
description: >
  Estilo de cena cena12 do EditOS (Explodido): produto em 3D que se abre em camadas, uma batida por vez, cada parte com nome. Use quando pedirem "cena X na cena12", "no explodido" ou a fala disser o que tem dentro.
---

# cena12: Exploded Teardown (Explodido (teardown))

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena12/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala lista as partes de um produto ou "o que tem dentro" (2 a 6 partes).
- Pedido direto do dono ("cena 3 na cena12", "no explodido") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala pede o mecanismo físico funcionando (3D Blender) ou não cita partes.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena12/cena12.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena12/componente/LEIA.md` (as props do `Cena12.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena12/componente/Cena12.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** este estilo se recompõe a cada produto: monte as camadas do produto dito com `Caixa`, uma por parte citada (2 a 6); `partes` = nomes ditos, spec só com dado dito; título = o fecho dito. O teclado do componente é exemplo.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena12/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Fade; todas as camadas juntas; batidas desiguais; linhas-guia cruzadas.
- 3D falso chapado, brilho, fundo carregado; produto com marca sem print de origem (G25).
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
