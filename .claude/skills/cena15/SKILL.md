---
name: cena15
description: >
  Estilo de cena cena15 do EditOS (Manchete grifada): a matéria real voa em 3D, a câmera chega no parágrafo e o marca-texto grifa a linha. Use quando pedirem "cena X na cena15", "na manchete" ou a fala citar uma notícia.
---

# cena15: Headline Highlight (Manchete grifada)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena15/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala afirma algo que tem fonte publicada ("saiu no jornal", "a matéria diz") e lê ou parafraseia o trecho.
- Pedido direto do dono ("cena 3 na cena15", "na manchete grifada") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não existe o print real da matéria com origem (G25, G7).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena15/cena15.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena15/componente/LEIA.md` (as props do `Cena15.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena15/componente/Cena15.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** manchete, veículo, data e parágrafo copiados do print real; o grifo só no trecho que a fala lê (1 a 3 linhas, `inicioGrifo` na palavra dita); post só se a fala cita uma reação real. Partes vazias somem.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena15/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Print chapado com retângulo amarelo; grifo retangular perfeito; fade; zoom linear.
- Veículo, pessoa, logo, manchete ou número inventados.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
