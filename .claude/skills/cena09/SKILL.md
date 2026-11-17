---
name: cena09
description: >
  Estilo de cena cena09 do EditOS (Grade suíça): princípio, regra ou manifesto em letra preta pesada sobre grade, com campo vermelho e círculo. Use quando pedirem "cena X na cena09", "na grade suíça" ou a fala soar como lei.
---

# cena09: Swiss Grid (Grade suíça)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena09/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala crava uma regra, um princípio ou uma frase de posicionamento curta ("Preço não é valor.").
- Pedido direto do dono ("cena 3 na cena09", "na grade suíça") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a frase passa de 3 linhas curtas, é emotiva ou calma, ou pede imagem do assunto.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena09/cena09.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena09/componente/LEIA.md` (as props do `SwissGrid.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena09/componente/SwissGrid.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** quebre a frase dita em 1 a 3 linhas onde ela respira (`linhas`); legendas numeradas só se a fala enumera; o campo vermelho abre na palavra de força; o caminho do círculo pode mudar de célula, sempre na grade.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena09/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Texto centralizado ou borda fora da linha da grade.
- Segunda cor, degradê, sombra, brilho, grão, fade.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
