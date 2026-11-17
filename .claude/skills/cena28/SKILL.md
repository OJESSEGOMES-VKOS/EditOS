---
name: cena28
description: >
  Estilo de cena cena28 do EditOS (Versus): duas opções lado a lado, critério por critério, com vencedor. Use quando pedirem "cena X na cena28", "no versus" ou a fala disser "X ou Y", "comparando", "qual é melhor".
---

# cena28: Versus (Versus)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena28/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala compara duas opções por critérios e chega a um vencedor (ferramenta, plano, caminho, produto).
- Pedido direto do dono ("cena 3 na cena28", "no versus") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: é a mesma coisa antes e depois (cena24), são mais de duas opções (cena25), ou não há critério nem
  resultado real.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena28/cena28.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena28/componente/LEIA.md` (as props do `Cena28.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena28/componente/Cena28.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `nomeA` e `nomeB` são as opções ditas; `linhas` são os critérios citados, na
   ordem da fala (1 a 4), com o vencedor que a fala conclui; `inicios` põe cada linha na palavra que a cita;
   `formato` escreve a unidade dita.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada linha e o desfecho caem na palavra que os pede (os quadros vêm do `palavras.json`), não
   nos quadros da demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena28/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (fundo escuro dividido, azul contra laranja,
  Anton nos nomes, barras do centro para fora, placa no desfecho). **Mesma cena?** não (outras opções, outro número
  de linhas, outro vencedor). Se parecer "alugar ou comprar com outros nomes", volte e recomponha.

## Nunca
- Esmaecer qualquer coisa, ou barra que não nasce no centro.
- Terceira cor, brilho neon, critério ou número inventado.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
