---
name: cena20
description: >
  Estilo de cena cena20 do EditOS (Globo com arcos): globo de pontos escuro, rotas laranja saindo de uma cidade e o número subindo a cada pouso. Use quando pedirem "cena X na cena20" ou a fala falar de alcance.
---

# cena20: Globe arcs (Globo com arcos)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena20/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala diz alcance real, de um lugar para muitos ("já enviamos pra 14 estados", "clientes em 6 países").
- Pedido direto do dono ("cena 3 na cena20", "no globo") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: o alcance não é real ou não tem número dito; para rota de A a B use a cena11.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena20/cena20.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena20/componente/LEIA.md` (as props do `Cena20.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena20/componente/Cena20.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `origem` = a cidade do dono, `destinos` reais (um pouso por degrau), `valores` subindo até o número dito, `unidade` = a palavra dita; gire (`lonInicio`/`lonFim`/`latCentro`) para a origem ficar no alto à esquerda e nada pousar atrás.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena20/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Neon, halo, partícula; mapa chapado ou Terra de satélite.
- Pousar tudo junto ou contar direto ao final; globo lotado de nomes.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
