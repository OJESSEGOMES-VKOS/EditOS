---
name: cena05
description: >
  Estilo de cena cena05 do EditOS (Osciloscópio): um traço verde que é sinal e vira a palavra-chave. Use quando pedirem "cena X na cena05", "no osciloscópio" ou a fala tiver um "caiu a ficha", sinal, dado ou música.
---

# cena05: Oscilloscope (Osciloscópio)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena05/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala chega numa palavra-chave depois de um processo ("tentei de tudo... e aí FUNCIONOU"), ou fala de tecnologia, sinal, música.
- Pedido direto do dono ("cena 3 na cena05", "no osciloscópio") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a frase tem várias ideias ou mais de ~10 letras de palavra-chave.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena05/cena05.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena05/componente/LEIA.md` (as props do `Oscilloscope.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena05/componente/Oscilloscope.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `palavra` = a palavra-chave dita (A-Z, 0-9; acento cai); `inicioPalavra` = o quadro em que ela é dita (a curva toda estica ou encolhe junto); `leitura` = um dado dito ou nada. Seno = o problema, figura = o pensar, amortecer = a pausa, letras = a palavra.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena05/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Neon de letreiro, moldura, rótulo nos cantos, mais de uma linha de leitura.
- Letra que aparece do nada ou corte no traço: tudo nasce da mesma linha.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
