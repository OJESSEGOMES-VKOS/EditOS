---
name: cena30
description: >
  Estilo de cena cena30 do EditOS (Pilha de dinheiro, 3D edição): um valor em dinheiro vira uma torre de maços que cresce camada por camada. Use quando pedirem "cena X na cena30", "na pilha de dinheiro" ou a fala disser "faturou", "custou", "R$ X mil".
---

# cena30: Money stack (Pilha de dinheiro)

Um estilo de cena do EditOS (3D edição: caixas em CSS 3D no Remotion, sem Blender). A cena inteira ganha a linguagem
visual dele enquanto a fala dela dura. O estilo é um **jeito de construir**, não uma cena pronta: a demo
(`cenas/estilos/cena30/demo.mp4`) é uma aplicação a uma frase, nunca o roteiro da cena nova.

## Quando usar
- A fala diz um valor em dinheiro que vale a pena enxergar (faturamento, custo, patrimônio, prejuízo).
- Pedido direto do dono ("cena 3 na cena30", "na pilha de dinheiro") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o valor é do dono e não tem prova, o número é pequeno demais para virar torre, ou a fala compara
  valores no tempo (cena16, cena25).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena30/cena30.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena30/componente/LEIA.md` (as props do `Cena30.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena30/componente/Cena30.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena (`duracao`).
3. **Componha a partir da frase dita:** `total` é o valor exatamente como dito; `camadas` dá um degrau redondo (o
   tamanho da torre conta o tamanho do valor); `rotulo` é a fala resumida; `corFinal` verde para ganho, um vermelho
   sóbrio se a fala é perda.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** o pouso verde cai na palavra do valor (os quadros vêm do `palavras.json`). Formato do vídeo
   (9:16, 4:5, 16:9): veja "Como variar" na ficha. A legenda da casa segue o `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena30/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (estúdio claro, maços com cinta, palete
  ardósia, número que rola por camada e pousa colorido). **Mesma cena?** não (outro valor, outra altura de torre,
  outro rótulo). Se parecer "o milhão da demo com outro número", volte e recomponha.

## Nunca
- Cédula real, nota voando, ouro, brilho.
- Número que corre na frente das camadas ou valor diferente do dito.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
