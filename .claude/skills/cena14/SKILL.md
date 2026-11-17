---
name: cena14
description: >
  Estilo de cena cena14 do EditOS (Mesa de papéis): provas impressas caem num tapete verde e são marcadas à mão. Use quando pedirem "cena X na cena14", "na mesa de papéis" ou a fala montar um caso com dado ou citação real.
---

# cena14: Paper Desk (Mesa de papéis)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena14/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala apresenta uma prova real (dado, citação, achado com origem) e aponta o ponto dela.
- Pedido direto do dono ("cena 3 na cena14", "na mesa de papéis") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não existe a prova real na mão (G7): volte com a pergunta, nunca invente gráfico ou citação.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena14/cena14.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena14/componente/LEIA.md` (as props do `Cena14.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena14/componente/Cena14.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** um papel por prova dita (1 a 3): gráfico com `pontos` do dado real, citação real com o grifo no trecho lido, etiqueta = palavra-chave dita. O círculo vermelho cai no "olha aqui"; a nota é a palavra dita.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena14/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Papel vetorial sem grão nem sombra; fade; câmera flutuante.
- Mais cor que um vermelho e um amarelo; dado ou fonte inventados.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
