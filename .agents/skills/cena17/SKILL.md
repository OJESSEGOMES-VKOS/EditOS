---
name: cena17
description: >
  Estilo de cena cena17 do EditOS (Celular com app): celular com peso girando num estúdio claro, tela montando e cartões saltando. Use quando pedirem "cena X na cena17" ou a fala mostrar o app do dono como pronto.
---

# cena17: App Mockup (Celular com app)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena17/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala apresenta um app ou produto digital do dono como coisa pronta e existe print real dele para recriar fiel (G25).
- Pedido direto do dono ("cena 3 na cena17", "no celular com app") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há print real com origem, ou o app é de outra marca.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena17/cena17.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena17/componente/LEIA.md` (as props do `Cena17.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena17/componente/Cena17.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** a tela recriada fiel vai em `tela`; cada destaque dito vira um cartão (0 a 3: notificação, número, meta), saltando na palavra que o nomeia; o giro é a entrada. A tela de banco do componente é só exemplo.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena17/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Print chapado colado; cartão que esmaece ou todos juntos; fundo escuro com neon.
- Logo de fabricante, app genérico fingindo ser o do dono.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
