---
name: cena37
description: >
  Estilo de cena cena37 do EditOS (Rosca de partes): um todo dividido em fatias, com a fatia da história saindo do anel. Use quando pedirem "cena X na cena37", "na rosca" ou a fala disser "X% vai para", "dividido em".
---

# cena37: Donut breakdown (Rosca de partes)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena37/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala divide um todo em partes e uma delas importa mais: "metade vai pro aluguel", "só 10% fica com você".
- Pedido direto do dono ("cena 3 na cena37", "na rosca") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: só tem um número (isso é a cena16 ou a cena30), as partes mudam no tempo (cena25), ou os valores
  não foram ditos nem têm fonte.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena37/cena37.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena37/componente/LEIA.md` (as props do `Cena37.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena37/componente/Cena37.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `fatias[]` são só as partes ditas, com os valores ditos; `heroi` é a fatia que
   a frase defende; `prefixo`/`sufixo` conforme é dinheiro ou porcentagem; `passo` faz cada pouso cair na palavra que
   nomeia a fatia; o título é a frase resumida.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena37/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (branco calmo, tons apagados, um verde,
  varrida com batida, fatia que sai). **Mesma cena?** não (outras partes, outra quantidade, outra fatia herói). Se
  parecer "a cafeteria com outros números", volte e recomponha.

## Nunca
- Mais de uma cor forte, fatia esmaecendo, contador que passa do total.
- Inventar fatia ou valor que a fala não deu.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
