---
name: cena35
description: >
  Estilo de cena cena35 do EditOS (Escala lado a lado): comparação de tamanho com coisas conhecidas numa maquete de argila. Use quando pedirem "cena X na cena35", "na escala" ou a fala disser "do tamanho de", "X vezes maior".
---

# cena35: Scale lineup (Escala lado a lado)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena35/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala compara tamanhos (altura, comprimento) com coisas que todo mundo conhece.
- Pedido direto do dono ("cena 3 na cena35", "no escala lado a lado") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: as medidas não foram ditas, ou a comparação é de valor e não de tamanho (cena16, cena25).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena35/cena35.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena35/componente/LEIA.md` (as props do `Cena35.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena35/componente/Cena35.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `objetos` são os que a fala compara (dois a cinco, do menor ao maior), com as medidas como foram ditas; a escala se ajusta sozinha pela maior altura; objeto sem tipo pronto nasce no `Desenho` como caixas de argila (`bloco` é o genérico).
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena35/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (argila branca, estúdio cinza, rótulos na mesma linha, um recuo só). **Mesma cena?** não (outros objetos, outras medidas, outra quantidade). Se parecer "a pessoa, o ônibus e a torre de novo", volte e recomponha.

## Nunca
- Régua, seta ou colchete; câmera que reenquadra; cor de destaque; monumento ou marca real.
- Medida que a pessoa não disse.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
