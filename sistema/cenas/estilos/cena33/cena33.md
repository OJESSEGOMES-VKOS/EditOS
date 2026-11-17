# cena33: Iceberg (Iceberg)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** "tem muito mais do que parece": camadas escondidas.
- **Quando a fala pede:** "por trás", "o que ninguém vê", "a ponta do iceberg".
- **Completa estes modelos:** personagem, motion-ouro, documental-dados, minidocumentario.
- **Material e prova:** o sistema faz tudo; camadas = palavras ditas.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O gráfico do iceberg feito como plano de câmera de verdade: a ponta pequena acima da água, o mergulho, e a massa enorme
de gelo facetado embaixo, com as camadas acendendo uma a uma. "Tem muito mais do que parece" vira uma imagem só.

- **Céu e mar:** céu claro `#F2F8FC` subindo a `#CFE5F4`. O mar começa água-marinha clara `#A6DDEF` na superfície e
  desce por `#5BAEDA` e `#2C74B1` até `#205A93`. Mesmo no fundo é azul limpo, nunca escuro e turvo: o assunto é
  descoberta, não medo.
- **O gelo:** low-poly de faces chapadas e bordas limpas, branco `#FFFFFF` onde pega sol e azul suave `#A5CBE6` na
  sombra. Embaixo d'água ele pega a cor do mar conforme afunda, mas fica sempre mais claro que a água em volta, para a
  forma continuar lida.
- **A linha d'água:** um traço branco firme. Nas divisas entre camadas, uma linha tracejada branca atravessa o mar e um
  contorno branco abraça o gelo.
- **Letras:** Figtree 700 em torno de 40 px, azul-marinho `#0C2A4A`, dentro de pílulas brancas com sombra macia. A da
  ponta fica ao lado dela; as das camadas ficam centradas no gelo, uma por camada.
- **Textura:** nenhuma além das facetas. Sem raio de luz, bolha, peixe ou partícula.

**Os movimentos (o vocabulário):**
- **Começa na ponta:** primeiro quadro já mostra a ponta, a pílula do que todo mundo vê e a massa apagada sob a água
  clara. A câmera já desce e gira devagar em volta do gelo.
- **O mergulho:** a câmera cai na água; a superfície fosca sobe como uma cortina e a lente passa para baixo em cerca de
  um segundo. É a virada do "mas por baixo...".
- **O recuo longo:** a câmera recua descendo pela face do gelo numa curva longa, até a superfície virar uma linha reta e
  o iceberg inteiro caber.
- **A camada acende:** ao passar por cada camada, a pílula dela entra com mola e um passinho além; o contorno se desenha
  pela frente do gelo e a linha tracejada corre até as bordas.
- **A pausa:** os últimos ~20 quadros são parados, com tudo legível.

## Como variar (o jeito, não a demo)

- **As camadas são as que a fala lista,** na ordem que ela diz, de uma a quatro (`camadas`). Duas camadas deixam o gelo
  em duas faixas; quatro, em quatro. A ponta é o resultado dito (`resultado`).
- **Cada camada acende na palavra dela** (`tempos`, em quadros do `palavras.json`). O mergulho cai na palavra da virada
  ("mas", "por baixo", "o que ninguém vê").
- **Outro assunto, mesmo objeto:** o estilo é o iceberg, e ele serve a qualquer "por baixo tem mais" (o salário e os
  custos, o vídeo de 1 minuto e as horas de edição, o sucesso e os anos antes). Mude o formato do gelo mexendo nos
  anéis de `ANEIS` (ponta mais alta, massa mais larga ou mais funda) e a semente do sorteio, para cada vídeo ter o seu.
  A rota da câmera (descer, mergulhar, recuar) é a frase do estilo; o tempo dela segue a fala.
- **Frase curta** (ponta e uma camada): mergulho e uma pílula, 2 a 3 s. **Frase longa:** no máximo quatro camadas; o
  resto fica na fala.
- **Formatos:** palco 4:5. Em 9:16 sobra céu em cima e mar embaixo (bom para a legenda da casa, no mar, em branco); em
  16:9 o iceberg fica no centro e as pílulas podem ir para os lados dele.

## Nunca

- Iceberg chapado de clipart, foto-realista ou brilhante.
- Raio de luz, lens flare, bolha, peixe, partícula; mar escuro e turvo.
- Pílula que esmaece ou fica boiando fora do gelo.
- Camada que a fala não disse.
- Reaproveitar "O resultado", "Noites viradas", "O sistema" ou qualquer texto da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida (sempre três camadas nos mesmos tempos) quando a fala pede outra.
