---
name: cena46
description: >
  Estilo de cena cena46 do EditOS (Grade azul, como funciona): uma máquina em argila branca cortada, com o fluxo laranja correndo por dentro. Use quando pedirem "cena X na cena46", "na grade azul" ou a fala explicar "como funciona por dentro".
---

# cena46: Blue Grid (Grade azul, como funciona)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena46/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala explica como uma coisa funciona por dentro: o que entra, por onde passa, onde esquenta, o que sai.
- Pedido direto do dono ("cena 3 na cena46", "na grade azul") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala quer mostrar as partes separadas (cena12), ou o mecanismo pede rigor físico e muitas peças
  (o modelo `3d-como-funciona`, no Blender).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena46/cena46.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena46/componente/LEIA.md` (as props do `Cena46.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena46/componente/Cena46.tsx` para o `src/` do vídeo. O turbofan é a demo: para outra máquina,
   troque os perfis das peças, o caminho do fluxo e onde fica o quente (as funções de revolução servem a qualquer peça
   redonda), mantendo grade azul, argila, corte de um quarto e o único quente.
3. **Componha a partir da frase dita:** uma chamada por parte dita, na ordem e na palavra em que é dita (`chamadas`,
   `inicios`); o `titulo` é o nome que a fala dá à coisa; o fluxo é o que a fala diz que corre.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena46/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (grade azul, argila branca cortada, fluxo
  laranja-vermelho, chamadas em fio branco). **Mesma cena?** não (outra máquina, outras partes, outro número de chamadas).
  Se for "o motor de avião de novo" sem a fala pedir, volte e recomponha.

## Nunca
- Peças explodindo para fora, metal realista, marca ou matrícula, tempestade de partículas.
- Lens flare, degradê roxo, brilho no texto.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
