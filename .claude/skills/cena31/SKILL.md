---
name: cena31
description: >
  Estilo de cena cena31 do EditOS (Cartão que vira): a oferta, o plano ou o preço como um cartão de metal que vira. Use quando pedirem "cena X na cena31", "no cartão que vira" ou a fala disser o plano e o preço.
---

# cena31: Card flip (Cartão que vira)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena31/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala apresenta uma oferta: o plano, o preço, o que a pessoa recebe (até três coisas).
- Pedido direto do dono ("cena 3 na cena31", "no cartão que vira") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala compara planos (isso é a cena28), lista mais de três benefícios, ou o preço não foi dito.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena31/cena31.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena31/componente/LEIA.md` (as props do `Cena31.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena31/componente/Cena31.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** `marca` é a marca real de quem fala (o `perfil.md`); `plano` e `preco` são os ditos; `beneficios` só os que a fala cita (zero a três); a virada (`viradaEm`) cai na palavra do preço ou do plano.
4. **Palavra na tela = palavra dita** (números e nomes como foram ditos, G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena31/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cartão preto de metal com borda, parede clara, um acento laranja, virada com mola). **Mesma cena?** não (outra marca, outro plano, outro número de benefícios). Se parecer "o cartão Norte Pro com outro preço", volte e recomponha.

## Nunca
- Cartão chapado que achata para fingir a virada; dourado, holograma, logo de banco ou bandeira.
- Preço, plano ou benefício que a pessoa não disse.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
