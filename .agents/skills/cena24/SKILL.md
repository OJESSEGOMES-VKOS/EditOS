---
name: cena24
description: >
  Estilo de cena cena24 do EditOS (Antes e depois, cortina): a diferença entre duas versões reais em um segundo. Use quando pedirem "cena X na cena24", "no antes e depois" ou a fala disser "antes era", "ficou assim".
---

# cena24: Before and after slider (Antes e depois, cortina)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena24/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala compara o antes e o depois de uma mesma coisa: site, loja, foto, logo, perfil, número, ambiente.
- Pedido direto do dono ("cena 3 na cena24", "no antes e depois") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não existem as duas versões reais (o estilo é prova; sem material, volta como pergunta), ou a
  comparação é entre duas coisas diferentes (isso é a cena28, Versus).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena24/cena24.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena24/componente/LEIA.md` (as props do `Cena24.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena24/componente/Cena24.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** as duas versões reais entram em `antesImagem` e `depoisImagem` (`janela={false}`
   se for foto); a `manchete` é a fala resumida em uma ou duas linhas; o divisor varre na palavra da virada ("hoje",
   "ficou", "depois"). Fala com vários momentos: uma parada por momento (vários `<Cena24>` em sequência), não uma só.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena24/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cinza frio, tomate, cortina com alça, mola no
  meio). **Mesma cena?** não (outras versões, outros textos, outro número de paradas). Se parecer "a padaria com outro
  site", volte e recomponha.

## Nunca
- Dissolver uma versão na outra, ou fazer o antes de piada.
- Inventar o antes ou o depois: são as versões reais do dono.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
