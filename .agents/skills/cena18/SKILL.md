---
name: cena18
description: >
  Estilo de cena cena18 do EditOS (Zoom na gravação de tela): janela num fundo menta, cursor em curva, zoom macio até o clique e a pílula do passo. Use quando pedirem "cena X na cena18" ou a fala disser "clica aqui".
---

# cena18: Screen-Recording Zoom (Zoom na gravação de tela)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena18/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala dá um passo de tutorial ("clica em X", "abre Y") numa tela real do dono.
- Pedido direto do dono ("cena 3 na cena18", "no zoom de tela") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há print real da tela com origem (G25), ou a fala não manda fazer nada na tela.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena18/cena18.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena18/componente/LEIA.md` (as props do `Cena18.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena18/componente/Cena18.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** a tela recriada fiel vai em `janela` (1000x1100) e o `alvo` é o botão dito; um passo por cena; o clique cai no verbo; `passoTexto` é o passo como foi dito (vazio se não houver passo numerado).
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena18/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Zoom em print esticado, zoom linear ou que quica, cursor em reta.
- Nome ou logo de app real que não seja do dono.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
