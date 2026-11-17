---
name: cena08
description: >
  Estilo de cena cena08 do EditOS (Risografia): pôster de duas tintas que se imprime em stop motion. Use quando pedirem "cena X na cena08", "na risografia" ou a fala for leve, de convite, evento ou chamada.
---

# cena08: Risograph (Risografia)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena08/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala é leve e artesanal: convite, chamada de evento, data, lançamento descontraído.
- Pedido direto do dono ("cena 3 na cena08", "na risografia") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o tema é sério, técnico ou de prova com número.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena08/cena08.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena08/componente/LEIA.md` (as props do `Risograph.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena08/componente/Risograph.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `palavra1` = a palavra-herói dita (caixa alta); `palavra2` (vazada, 1 a 4 letras) e `palavra3` (na faixa) só se a fala tiver; `inicioSlip` na palavra de impacto. Objeto que a fala pede vira chapa rosa/azul com a mesma textura, entrando com carimbo ou deslize.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena08/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Papel creme, terceira tinta, degradê sem retícula.
- Movimento liso ou borrão; borda vetorial limpa sem grão.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
