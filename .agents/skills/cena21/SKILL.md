---
name: cena21
description: >
  Estilo de cena cena21 do EditOS (Notebook revela): notebook prata abre num estúdio claro, a tela acende no site do dono e o nome sobe. Use quando pedirem "cena X na cena21" ou a fala lançar um site ou sistema.
---

# cena21: Laptop reveal (Notebook revela)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena21/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala apresenta ou lança um site, SaaS ou portfólio do dono e existe print real dele (G25).
- Pedido direto do dono ("cena 3 na cena21", "no notebook") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há print real com origem, ou o produto não é uma página.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena21/cena21.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena21/componente/LEIA.md` (as props do `Cena21.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena21/componente/Cena21.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** a página recriada fiel vai em `tela` e o `alvo` é o botão citado; `produto` e `linha` são o nome e a frase ditos; rolar e clicar só entram se a fala mostra uma ação. A página de agenda do componente é só exemplo.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena21/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Notebook chapado sem reflexo nem sombra; corte seco do preto para a página.
- Tela cheia de letra miúda, brilho, formas flutuando, logo de fabricante.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
