---
name: cena40
description: >
  Estilo de cena cena40 do EditOS (Holograma): o lugar vira maquete azul-gelo no preto e uma coisa em vermelho mostra onde estava e o caminho. Use quando pedirem "cena X na cena40", "no holograma" ou a fala disser onde e por onde.
---

# cena40: Hologram (Holograma)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena40/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala mostra onde algo aconteceu dentro de um lugar e como se moveu: "entrou pelos fundos", "o dinheiro saiu daqui
  e foi parar ali", "o plano era passar por...".
- Pedido direto do dono ("cena 3 na cena40", "no holograma") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o lugar é uma cidade ou país no mapa (cena11, cena41), ou não há um lugar dito.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena40/cena40.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena40/componente/LEIA.md` (as props do `Cena40.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena40/componente/Cena40.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** redesenhe a maquete do lugar dito (`BOXES`, `SITE`) com caixas simples; o
   vermelho é o sujeito da frase; a rota (`ROUTE`) é o caminho dito, ou nenhuma; rótulos só para o que a fala nomeia,
   de zero a três, com o dado dito embaixo.
4. **Palavra na tela = palavra dita** (números, horas e nomes como foram ditos, G10). Nada da demo entra porque "o
   estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena40/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (gelo no preto, um vermelho, fios finos em
  mono, órbita que para). **Mesma cena?** não (outro lugar, outro sujeito, outro caminho). Se for o centro de dados com
  caminhão de novo, volte e refaça a maquete.

## Nunca
- Textura real, logo, rosto, mais de um vermelho, enfeite de painel futurista.
- Inventar lugar, hora ou caminho que a fala não deu.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
