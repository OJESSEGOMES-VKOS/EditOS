---
name: cena19
description: >
  Estilo de cena cena19 do EditOS (Linha do tempo): os anos pintados num chão em perspectiva, cada marco abrindo um cartão até o HOJE azul. Use quando pedirem "cena X na cena19" ou a fala contar anos até o agora.
---

# cena19: Timeline (Linha do tempo)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena19/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala cobre anos em segundos e pousa no "hoje": história da empresa, "minha jornada", de onde até onde.
- Pedido direto do dono ("cena 3 na cena19", "na linha do tempo") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala não tem anos ditos, ou tem mais de 5 marcos que não dá para juntar.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena19/cena19.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena19/componente/LEIA.md` (as props do `Cena19.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena19/componente/Cena19.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `pontos` = os marcos ditos (2 a 5) com os anos reais, o último é o HOJE; `titulo` é o fecho da história com a virada em `tituloAzul`; cada cartão abre quando o ano dele é dito. Qualquer intervalo de anos cabe.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena19/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Cartão que esmaece, linha que enche em velocidade constante, câmera ainda andando no fim.
- Segunda cor, degradê, brilho; marca ou foto de produto que não seja do dono.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
