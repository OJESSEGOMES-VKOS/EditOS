---
name: cena01
description: >
  Estilo de cena cena01 do EditOS (Orbe de luz): frase curta e calma, abertura serena, pausa pra pensar. Use quando pedirem "cena X na cena01", "no orbe de luz" ou a fala pedir respiro e tom baixo.
---

# cena01: Glow Orb (Orbe de luz)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena01/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala fecha numa frase curta e calma (3 a 6 palavras) que a pessoa tem que guardar: abertura serena, "pensa nisso", virada em tom baixo.
- Pedido direto do dono ("cena 3 na cena01", "no orbe de luz") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a frase é longa, tem número ou lista, ou o tom é de urgência e venda.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena01/cena01.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena01/componente/LEIA.md` (as props do `GlowOrb.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena01/componente/GlowOrb.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** escolha o pedaço dito que fecha a ideia (até ~33 letras, uma linha, com ponto final) para `frase`; `inicioTexto` na primeira palavra dele; o anel (`inicioAnel`) na palavra de peso ou na pausa, ou fora da cena se ela for curta.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena01/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Fade, partícula, brilhinho, segunda cor, quadro inteiro rosa.
- Duas linhas ou frase sem ponto final.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
