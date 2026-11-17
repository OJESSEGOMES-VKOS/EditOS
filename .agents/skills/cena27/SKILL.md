---
name: cena27
description: >
  Estilo de cena cena27 do EditOS (Contador de dias): desafio, sequência, "30 dias de", construção em público. Use quando pedirem "cena X na cena27", "no contador de dias" ou a fala disser "dia 12", "faz 30 dias que".
---

# cena27: Day counter (Contador de dias)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena27/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala conta uma sequência de dias: desafio, série, hábito, "estou no dia X", "faz N dias que".
- Pedido direto do dono ("cena 3 na cena27", "no contador de dias") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a contagem não é de dias seguidos (dinheiro, seguidores: cena16, cena36), ou a sequência não
  aconteceu de verdade.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena27/cena27.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena27/componente/LEIA.md` (as props do `Cena27.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena27/componente/Cena27.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `ate` é o número dito, `dias` o tamanho do desafio, `mes` e `inicioSemana` os
   do mês real, `palavra` a unidade dita, `rotulo` o que a pessoa faz nas palavras dela. `fimQuadro` leva o pouso
   para o quadro em que o número é falado.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** o pouso cai na palavra do número (os quadros vêm do `palavras.json`), não no quadro 79 da demo.
   Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena27/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (Anton vermelho e preto, hodômetro
  devagar-rápido-devagar, checks à mão, calendário de parede). **Mesma cena?** não (outro número, outro mês, outra
  unidade). Se parecer "o 30 de abril com outro rótulo", volte e recomponha.

## Nunca
- Contador em velocidade constante ou check que esmaece.
- Segunda cor de destaque ou brilho no vermelho.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
