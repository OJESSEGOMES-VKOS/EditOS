---
name: cena34
description: >
  Estilo de cena cena34 do EditOS (Conversa em 3D): história contada em mensagens, balões saltando num chão quadriculado claro. Use quando pedirem "cena X na cena34", "na conversa" ou a fala contar uma troca de mensagens.
---

# cena34: Text thread (Conversa em 3D)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena34/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala conta uma conversa (DM, mensagem de cliente, depoimento) com frases curtas.
- Pedido direto do dono ("cena 3 na cena34", "no conversa em 3D") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a mensagem é longa (mais de cinco palavras por balão), ou o print real existe e a prova pede ele (aí é o print, G25).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena34/cena34.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena34/componente/LEIA.md` (as props do `Cena34.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena34/componente/Cena34.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `mensagens` são as que a fala conta (uma a cinco), com as palavras ditas ou lidas; `chave` só no momento que pesa, se existir; cada balão salta na palavra dele (`tempos`).
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena34/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (chão claro quadriculado, balões brancos e azuis flutuando, câmera que sobe). **Mesma cena?** não (outras mensagens, outra quantidade, chave em outro lugar ou nenhuma). Se parecer "a conversa do 1 milhão com outro texto", volte e recomponha.

## Nunca
- Moldura de celular, barra de status, nome, cor ou ícone de aplicativo real.
- Mensagem inventada; balão que esmaece ou desliza de lado.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
