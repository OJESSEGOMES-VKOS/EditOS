---
name: cena32
description: >
  Estilo de cena cena32 do EditOS (Nota fiscal): quanto custou, item por item, até o total, numa nota térmica saindo da impressora. Use quando pedirem "cena X na cena32", "na nota fiscal" ou a fala somar gastos.
---

# cena32: Receipt (Nota fiscal)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena32/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala soma custos ou quantidades item por item até um total ("gastei X em Y, Z em W, no total...").
- Pedido direto do dono ("cena 3 na cena32", "no nota fiscal") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: é um número só (cena16 ou cena30), ou os valores não foram ditos.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena32/cena32.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena32/componente/LEIA.md` (as props do `Cena32.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena32/componente/Cena32.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `itens` são os que a fala cita, na ordem dita, com os valores como foram ditos; cada linha sai na palavra dela (`tempos`) e o total na palavra do total (`tempoTotal`); `loja` é o nome que a fala dá (o projeto, o mês), nunca uma loja real não dita.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena32/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (estúdio azul-noite, papel térmico, mono, linha saindo da fenda). **Mesma cena?** não (outros itens, outra quantidade, outro total). Se parecer "a nota do estúdio com outros preços", volte e recomponha.

## Nunca
- Texto que digita ou aparece: a linha só nasce saindo da fenda.
- Mais de cinco itens, valor inventado, nome ou layout de loja real.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
