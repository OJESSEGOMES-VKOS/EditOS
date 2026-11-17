---
name: cena25
description: >
  Estilo de cena cena25 do EditOS (Corrida de barras): ranking que muda no tempo, quem passou quem. Use quando pedirem "cena X na cena25", "na corrida de barras" ou a fala contar quem cresceu e ultrapassou.
---

# cena25: Ranking bars (Corrida de barras)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena25/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala conta uma disputa de números no tempo: quem cresceu, quem passou quem, quem virou o primeiro.
- Pedido direto do dono ("cena 3 na cena25", "na corrida de barras") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há os números reais com fonte, ou é um número só (cena16) ou uma divisão de um todo (cena37).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena25/cena25.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena25/componente/LEIA.md` (as props do `Cena25.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena25/componente/Cena25.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** as barras são os nomes que a fala cita, os passos (`anos`) são os períodos
   ditos, a unidade é a dita (`unidade`, `prefixo`); o herói é quem a história segue; as frases que narram usam os
   verbos ditos. Ajuste `passoQuadros` para a ultrapassagem principal cair na palavra que a anuncia.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena25/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (branco limpo, uma barra laranja, troca com
  mola, rótulo gigante apagado). **Mesma cena?** não (outros nomes, outra quantidade de barras e passos, outra virada).
  Se parecer "a corrida dos canais com outros nomes", volte e recomponha.

## Nunca
- Número inventado ou sem fonte; mais de uma cor forte.
- Barra que pula de lugar sem mola ou que anda em velocidade constante.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
