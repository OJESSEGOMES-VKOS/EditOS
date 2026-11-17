---
name: cena23
description: >
  Estilo de cena cena23 do EditOS (Pilha de notificações): tela de bloqueio enchendo de pedidos, a pilha empurrando e o total rolando. Use quando pedirem "cena X na cena23" ou a fala mostrar resultado real chegando.
---

# cena23: Notification stack (Pilha de notificações)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena23/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala mostra resultado real chegando (pedidos, vendas, inscrições, agendamentos) e existe o número real do dono.
- Pedido direto do dono ("cena 3 na cena23", "na pilha de notificações") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há resultado real com origem (G7, G10): plano B é o número dito em outra resposta.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena23/cena23.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena23/componente/LEIA.md` (as props do `Cena23.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena23/componente/Cena23.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `pedidos` = os reais, quantos a fala sustenta (3 a 15); `linhaPedido` e `palavraItens` dizem o que chega; total e contagem batem com a soma; pílula "+N" e pedido atrasado só se a fala pedir.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada entrada cai na palavra que a pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6 (some só se a cena já mostra a fala como imagem).

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena23/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cor, letra, textura, jeito de mexer).
  **Mesma cena?** não (outros textos, outra quantidade de batidas, outra ordem). Se parecer "a demo com outra frase",
  volte e recomponha.

## Nunca
- Cartão que esmaece, dígito que muda de largura, total que pula.
- Moldura de celular, app real de outra marca, roxo ou neon, resultado inventado.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
