---
name: cena43
description: >
  Estilo de cena cena43 do EditOS (Tempo profundo): abertura épica, salto de milhões de anos, em janela de cinema com fogo no preto. Use quando pedirem "cena X na cena43", "no tempo profundo" ou a fala disser "daqui a", "há bilhões de anos".
---

# cena43: Deep Time (Tempo profundo)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena43/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- Abertura épica, salto de tempo enorme, "para onde isso vai", "daqui a 10 anos", origem de algo muito antigo.
- Pedido direto do dono ("cena 3 na cena43", "no tempo profundo") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala é do dia a dia, tem lista ou pede prova de print.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena43/cena43.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena43/componente/LEIA.md` (as props do `Cena43.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena43/componente/Cena43.tsx` para o `src/` do vídeo. O buraco negro é a demo: se a fala
   fala de outra coisa (o Sol, galáxias, a Terra), troque a geometria e mantenha a janela, a rampa de fogo, a fumaça e a
   legenda.
3. **Componha a partir da frase dita:** o número rola até o valor dito; a virada (o rasgar, o romper) cai na palavra de
   ação; a `frase` é a fala resumida numa linha.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena43/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (janela de cinema, preto com fogo, legenda
  cinza pequena, tempo freando). **Mesma cena?** não (outro objeto, outro número, outra frase). Se for "o buraco negro de
  novo" sem a fala pedir, volte e recomponha.

## Nunca
- Cor fora da rampa de fogo, lens flare, título grande, planeta com continentes.
- Filmagem, música ou texto de canal existente.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
