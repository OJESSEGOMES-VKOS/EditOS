---
name: cena04
description: >
  Estilo de cena cena04 do EditOS (TV de tubo): a TV antiga liga e mostra o título em fósforo quente. Use quando pedirem "cena X na cena04", "na TV de tubo" ou a fala anunciar: vem aí, estreia, ao vivo, volta ao passado.
---

# cena04: Retro CRT Glow (TV de tubo)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena04/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala anuncia algo curto ("vem aí", "amanhã às 19h", estreia, ao vivo) ou volta ao passado com cara de transmissão.
- Pedido direto do dono ("cena 3 na cena04", "na TV de tubo") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a frase passa de ~5 palavras, ou o tom é íntimo e calmo.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena04/cena04.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena04/componente/LEIA.md` (as props do `RetroCRT.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena04/componente/RetroCRT.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `linhas` = o anúncio dito em 1 a 3 linhas curtas de caixa alta; `sistema` só se a fala deu um dado de transmissão (data, canal, "AO VIVO"), senão vazio. Um ciclo abre-segura-fecha por frase; o tubo fecha no fim da fala.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena04/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Neon saturado, contorno colorido, moldura; título que esmaece.
- Glitch ou tremedeira no texto assentado; linha de sistema que ninguém disse.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
