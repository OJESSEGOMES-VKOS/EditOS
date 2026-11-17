---
name: cena16
description: >
  Estilo de cena cena16 do EditOS (Número com gráfico): número grande que conta junto com a linha e fica laranja na virada. Use quando pedirem "cena X na cena16" ou a fala disser um resultado com série real.
---

# cena16: Stat Chart (Número com gráfico)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena16/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala diz um resultado em número (cresceu, caiu, "depois de X") e existe a série real com fonte por trás dele.
- Pedido direto do dono ("cena 3 na cena16", "no número com gráfico") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há série real com fonte (só o número dito: use outra resposta), ou o número não tem um momento de virada.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena16/cena16.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena16/componente/LEIA.md` (as props do `Cena16.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena16/componente/Cena16.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `serie` = os dados reais, `rotulo` e `fonte` reais, o número final exatamente o dito (G10); `indiceEvento` e a chamada no acontecimento que a fala aponta; `fimLinha` faz o pouso cair no número dito. Queda: `queda`.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena16/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Contador que rola ou passa do número; laranja antes do evento; degradê ou brilho na linha.
- Série inventada ou empresa real sem fonte num vídeo de verdade.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
