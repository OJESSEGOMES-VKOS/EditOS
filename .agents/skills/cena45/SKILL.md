---
name: cena45
description: >
  Estilo de cena cena45 do EditOS (Rabisco em primeira pessoa): "sua vida como...", a situação piorando e a cara branca reagindo, em marcador marrom pintado. Use quando pedirem "cena X na cena45", "no rabisco POV" ou a fala disser "sua vida de".
---

# cena45: POV Doodle (Rabisco em primeira pessoa)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena45/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- "Sua vida como...", "quando você...", emoção exagerada em primeira pessoa, rotina que vai piorando.
- Pedido direto do dono ("cena 3 na cena45", "no rabisco POV") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o tom é sério ou solene, ou a cena pede prova real.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena45/cena45.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena45/componente/LEIA.md` (as props do `Cena45.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena45/componente/Cena45.tsx` para o `src/` do vídeo. Calendário e copos são da demo e
   começam desligados (`diaFinal` vazio, `copos` 0): desenhe o que a fala nova acumula e conta, mantendo traço, paleta,
   cabeça e sobrancelhas.
3. **Componha a partir da frase dita:** a `legenda` é a frase dita resumida; o contador vai até o número dito; a careta
   cai na palavra da virada; o olhar para a câmera no "você".
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena45/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (marcador marrom, parede apagada, cabeça
  branca, sobrancelhas atuando, grão). **Mesma cena?** não (outra situação, outros objetos, outro número). Se for "o
  fundador com café de novo", volte e recomponha.

## Nunca
- Traço fino ou preto, cor saturada, fundo branco, rosto detalhado.
- Personagem ou cena de canal existente.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
