---
name: cena38
description: >
  Estilo de cena cena38 do EditOS (Mundo que brilha): uma ideia invisível vira um mundinho ilustrado que se abre e acende. Use quando pedirem "cena X na cena38", "no mundo que brilha" ou a fala explicar algo abstrato.
---

# cena38: Glow World (Mundo que brilha)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena38/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala explica uma coisa que não se vê (como a IA pensa, como o juro cresce, como o corpo se defende) e uma imagem
  bonita ajuda a entender.
- Pedido direto do dono ("cena 3 na cena38", "no mundo que brilha") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: a fala pede prova real (print, número com fonte), ou o tom é sério demais para um mundo ilustrado.

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena38/cena38.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena38/componente/LEIA.md` (as props do `Cena38.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena38/componente/Cena38.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita:** escolha o objeto que é a metáfora da fala e redesenhe o centro (cor chapada,
   dois ou três tons, risco de luz, pontinhos, sem contorno); mantenha céu, ilha, base, cabos e camadas. Uma etapa por
   pedaço da frase (chega, abre, acende, liga), só as que a fala diz. `rotulo` é a palavra dita que nomeia a ideia.
4. **Palavra na tela = palavra dita** (G10). Nada da demo entra porque "o estilo tem".
5. **Tempos na fala:** cada movimento cai na palavra que o pede (os quadros vêm do `palavras.json`), não nos quadros da
   demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena38/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (violeta, chapado, luz de dentro, camadas,
  uma pílula). **Mesma cena?** não (outro objeto, outro de dentro, outras etapas). Se for o cristal rosa de novo com
  outra palavra, volte e redesenhe.

## Nunca
- Contorno, cara de render 3D, partícula, flare, mais de uma pílula.
- Copiar personagem ou cena de canal conhecido.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
