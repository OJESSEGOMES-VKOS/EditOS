---
name: cena42
description: >
  Estilo de cena cena42 do EditOS (Rabisco de nanquim): a pergunta virando uma historinha desenhada a nanquim fino, com pessoa de palito. Use quando pedirem "cena X na cena42", "no rabisco" ou a fala contar "como era", "o que acontece quando".
---

# cena42: Ink Doodle (Rabisco de nanquim)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena42/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- Canal sem rosto ou trecho que pede imaginar: "como era antes de...", "o que você faria se...", uma situação do dia a dia.
- Pedido direto do dono ("cena 3 na cena42", "no rabisco") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a cena pede prova real (print, número com fonte) ou o tom é solene.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena42/cena42.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena42/componente/LEIA.md` (as props do `Cena42.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena42/componente/Cena42.tsx` para o `src/` do vídeo. Ele é a referência (o ponto de
   ônibus): para a fala nova, troque o palco, os objetos e as poses, mantendo o filtro de tremor, as espessuras, a
   cabeça redonda e as cores chapadas.
3. **Componha a partir da frase dita:** um gesto por verbo, o objeto citado pula na hora em que é dito, o risco vermelho
   só no "não"/"sem"; o rótulo é a pergunta dita, em poucas palavras.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena42/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (nanquim fino tremido, cabeça branca, cor
  chapada, vermelho só na piada). **Mesma cena?** não (outro lugar, outros objetos, outros gestos). Se parecer "o moço do
  banco de novo", volte e recomponha.

## Nunca
- Contorno grosso, sombra, degradê, rosto detalhado, mais de um rótulo.
- Copiar personagem ou mascote de canal existente.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
