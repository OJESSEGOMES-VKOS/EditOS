---
name: cena39
description: >
  Estilo de cena cena39 do EditOS (Desenho plano): a história encenada por um personagem de cabeça grande, cor chapada e gesto exagerado. Use quando pedirem "cena X na cena39", "no desenho plano" ou a fala contar o que aconteceu.
---

# cena39: Flat Cartoon (Desenho plano)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena39/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala conta um acontecido ou um "e se" com alguém dentro: "ele abriu a loja e...", "imagina você recebendo...".
- Pedido direto do dono ("cena 3 na cena39", "no desenho plano") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala precisa de prova real, a pessoa real tem que aparecer, ou o tema é solene (perda, fé, luto).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena39/cena39.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena39/componente/LEIA.md` (as props do `Cena39.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena39/componente/Cena39.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** o lugar, o objeto e a ação vêm do verbo da fala; redesenhe o cenário e o
   objeto com cor chapada e sombra dura, reaproveite corpo, poses, mãos e o cartão. Uma batida por pedaço da frase
   (faz, dá errado, reage), só as que a fala tem. O cartão é a palavra dita que fecha a ideia.
4. **Palavra na tela = palavra dita** (G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena39/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (chapado, cabeça grande, sombra dura, um
  cartão). **Mesma cena?** não (outro lugar, outro objeto, outra ação). Se for o apresentador com o gráfico de novo,
  volte e redesenhe.

## Nunca
- Degradê, brilho, desfoque, contorno grosso, mais de um cartão.
- Personagem conhecido ou pessoa real desenhada.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
