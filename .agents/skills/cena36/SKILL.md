---
name: cena36
description: >
  Estilo de cena cena36 do EditOS (Troféu do marco): marco atingido, a placa de prata gira e o odômetro vira para o número. Use quando pedirem "cena X na cena36", "no troféu" ou a fala disser "chegamos a", "bati X".
---

# cena36: Milestone trophy (Troféu do marco)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena36/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala anuncia um marco real e já atingido: clientes, seguidores, anos, faturamento do mês.
- Pedido direto do dono ("cena 3 na cena36", "no troféu do marco") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o número é meta futura, não foi dito, ou a fala tem dois marcos (aí são duas cenas).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena36/cena36.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena36/componente/LEIA.md` (as props do `Cena36.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena36/componente/Cena36.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `meta` é o número dito (como foi dito), `palavra` a unidade dita em caixa alta, `prefixo` se a fala diz dinheiro; a virada (`viradaEm`) cai na palavra do número.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena36/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (prata no verde profundo, odômetro cromado que freia e vira). **Mesma cena?** não (outro número, outra unidade, virada em outro tempo). Se parecer "os 100.000 seguidores com outro número", volte e recomponha.

## Nunca
- Prêmio de plataforma (play, vermelho, logo); dourado; confete, brilho, partícula.
- Número que pula, passa da meta ou que a pessoa não atingiu.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
