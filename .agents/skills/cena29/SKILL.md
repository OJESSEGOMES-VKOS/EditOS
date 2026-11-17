---
name: cena29
description: >
  Estilo de cena cena29 do EditOS (Produto girando, 3D edição): o produto gira num estúdio grafite e as especificações saltam em fios finos. Use quando pedirem "cena X na cena29", "no produto girando" ou a fala apresentar um produto e seus números.
---

# cena29: Product turntable (Produto girando)

Um estilo de cena do EditOS (3D edição: perspectiva em CSS no Remotion, sem Blender). A cena inteira ganha a linguagem
visual dele enquanto a fala dela dura. O estilo é um **jeito de construir**, não uma cena pronta: a demo
(`cenas/estilos/cena29/demo.mp4`) é uma aplicação a uma frase, nunca o roteiro da cena nova.

## Quando usar
- A fala apresenta um produto físico e diz um a quatro números dele ("tem 40 horas de bateria", "pesa meio quilo").
- Pedido direto do dono ("cena 3 na cena29", "no produto girando") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há foto real do produto, a fala mostra o que tem dentro (cena12), ou é app e tela (cena17,
  cena21).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena29/cena29.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena29/componente/LEIA.md` (as props do `Cena29.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena29/componente/Cena29.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena (`duracao` em quadros).
3. **Troque o objeto:** redesenhe o `Produto` com a forma do produto real (a partir da foto do dono), mantendo a conta
   de luz, o grafite, o prato, o reflexo e a câmera. O cilindro só serve se o produto for um cilindro.
4. **Componha a partir da frase dita:** `nome` como foi dito; `chamadas` são os números ditos (1 a 4), cada uma
   apontando (`y`) para a parte do produto de que fala; `inicios` põe cada chamada na palavra do número.
5. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
6. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha. A legenda da casa segue o `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena29/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (estúdio grafite, giro lento que pousa, fios
  finos, Manrope e DM Mono). **Mesma cena?** não (outro objeto, outros números, outra quantidade de chamadas). Se
  parecer "a caixa de som com outro nome", volte e recomponha.

## Nunca
- Abrir, desmontar ou girar rápido o produto; fundo colorido, brilho, partícula.
- Especificação inventada ou produto que não é o real.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
