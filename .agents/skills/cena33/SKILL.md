---
name: cena33
description: >
  Estilo de cena cena33 do EditOS (Iceberg): "tem muito mais do que parece", a ponta e as camadas escondidas. Use quando pedirem "cena X na cena33", "no iceberg" ou a fala disser "o que ninguém vê", "por trás disso".
---

# cena33: Iceberg (Iceberg)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena33/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala mostra um resultado visível e o que existe embaixo dele (o trabalho, os custos, os anos, os erros).
- Pedido direto do dono ("cena 3 na cena33", "no iceberg") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: as camadas não foram ditas, ou são mais de quatro.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena33/cena33.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena33/componente/LEIA.md` (as props do `Cena33.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena33/componente/Cena33.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `resultado` é a ponta dita; `camadas` são as que a fala lista, de uma a quatro, na ordem dita; cada uma acende na palavra dela (`tempos`). Mude o formato do gelo (`ANEIS` e a semente) para o iceberg ser só deste vídeo.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena33/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (céu claro, mar azul limpo, gelo facetado, mergulho e recuo). **Mesma cena?** não (outras camadas, outro número delas, outro gelo). Se parecer "o iceberg das noites viradas com outras palavras", volte e recomponha.

## Nunca
- Gelo chapado, foto-realista ou brilhante; mar escuro; bolha, peixe, raio de luz.
- Camada que a fala não disse.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
