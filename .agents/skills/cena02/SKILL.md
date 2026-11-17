---
name: cena02
description: >
  Estilo de cena cena02 do EditOS (Vidro fosco): ideia contada como uma busca ou um passo num app, com opções e uma escolha. Use quando pedirem "cena X na cena02", "no vidro fosco" ou a fala pesquisar e escolher.
---

# cena02: Frosted Glass UI (Vidro fosco)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena02/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala pergunta, pesquisa ou compara opções e escolhe uma ("eu procurei X e achei três jeitos; o melhor é...").
- Pedido direto do dono ("cena 3 na cena02", "no vidro fosco") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não existe pergunta nem escolha na fala, ou ela mostra um app real (aí é print fiel, G25).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena02/cena02.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena02/componente/LEIA.md` (as props do `FrostedGlass.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena02/componente/FrostedGlass.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `busca` = o que a fala pergunta, nas palavras dela; `linhas` = as opções ditas (1 a 4, a quantidade da fala); `escolhida` = a que ela escolhe. Fala curta: só a barra digitando. Cada linha cai quando o item é dito.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena02/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Painel ou linha que esmaece; neon; bokeh de bolinhas iguais; vidro leitoso que não lê.
- Marca ou interface de app real no vidro.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
