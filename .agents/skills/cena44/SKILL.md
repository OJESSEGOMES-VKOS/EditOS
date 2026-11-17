---
name: cena44
description: >
  Estilo de cena cena44 do EditOS (Silhueta neon): o "e se..." dramático de uma pessoa, silhueta preta com fio de luz coral num quarto de cinema. Use quando pedirem "cena X na cena44", "na silhueta" ou a fala abrir com "e se".
---

# cena44: Neon Silhouette (Silhueta neon)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena44/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- "E se...", momento de clima, uma pessoa num lugar numa hora marcante, POV com tensão.
- Pedido direto do dono ("cena 3 na cena44", "na silhueta") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala é animada e leve (isso é a cena45 ou a cena42), ou pede prova e número com fonte.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena44/cena44.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena44/componente/LEIA.md` (as props do `Cena44.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena44/componente/Cena44.tsx` para o `src/` do vídeo. O quarto com relógio é a demo: para a
   fala nova, troque o lugar, o objeto da virada e a pose, mantendo silhueta, contorno coral, duas luzes e camadas.
3. **Componha a partir da frase dita:** a cabeça vira na palavra da virada; o objeto que muda só entra se a fala tem
   hora ou coisa que muda (`horaAntes`/`horaDepois` como foram ditas); o `rotulo` é uma palavra dita.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena44/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (silhueta com fio coral, luz de cinema,
  camadas, grão). **Mesma cena?** não (outro lugar, outro objeto, outra hora). Se for "a pessoa no notebook às 22h" sem a
  fala pedir, volte e recomponha.

## Nunca
- Rosto detalhado, contorno grosso, tubo de neon, luz piscando na pausa final.
- Personagem ou cena de canal existente.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
