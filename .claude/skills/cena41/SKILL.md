---
name: cena41
description: >
  Estilo de cena cena41 do EditOS (Mapa em relevo vermelho): onde a história aconteceu, num mapa em relevo preto com uma região vermelha e a rota. Use quando pedirem "cena X na cena41", "no mapa vermelho" ou a fala citar lugar e caminho.
---

# cena41: Red Relief (Mapa em relevo vermelho)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena41/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala diz onde uma história aconteceu e, às vezes, para onde foi: "partiram de Lisboa", "o império tomou o sul",
  "a empresa saiu de São Paulo e chegou a...".
- Pedido direto do dono ("cena 3 na cena41", "no mapa vermelho") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o lugar é dentro de um prédio (cena40), a rota é uma viagem moderna de ponto a ponto (cena11), ou o
  alcance é o mundo todo (cena20).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena41/cena41.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena41/componente/LEIA.md` (as props do `Cena41.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena41/componente/Cena41.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** trace o lugar dito no `mapa` (terra, região, capital; destino e rota só se a
   fala tem caminho); `origem` e `destino` são os nomes ditos; o cartão só entra com data ou título dito, e o selo é
   o emblema do assunto, redesenhado em traço gravado.
4. **Palavra na tela = palavra dita** (nomes e datas como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena41/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (relevo preto, grade no mar, um vermelho,
  giz branco, cartão gravado). **Mesma cena?** não (outro lugar, outros nomes, outras batidas). Se for a terra
  fictícia com a torre de novo, volte e recomponha.

## Nunca
- Globo, satélite, mapa chapado, rosto no cartão, segunda cor.
- Inventar lugar, data ou caminho que a fala não deu.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
