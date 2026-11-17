---
name: cena11
description: >
  Estilo de cena cena11 do EditOS (Rota no mapa 3D): cidade clara em 3D, rota azul até um alfinete e cartão da viagem. Use quando pedirem "cena X na cena11", "no mapa" ou a fala disser onde fica ou de onde até onde.
---

# cena11: 3D Map Route (Rota no mapa 3D)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena11/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala diz onde fica algo ou conta um caminho ("saímos da rodoviária e fomos até a loja").
- Pedido direto do dono ("cena 3 na cena11", "na rota do mapa") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala depende de um mapa real e exato (aí é print fiel), ou não há lugar nenhum dito.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena11/cena11.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena11/componente/LEIA.md` (as props do `Cena11.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena11/componente/Cena11.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `destino` = o lugar dito; `lugares` = só os intermediários ditos (0 a 3); `rota` vira nas ruas na ordem da história; cartão só com tempo dito (`minutos`). O alfinete cai no nome do destino.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena11/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Marca, cidade ou mapa real; câmera girando ou quicando; modo escuro, neon, rota brilhando.
- Fade em rótulo ou cartão.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
