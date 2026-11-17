# Mapa de rota

**Tipo:** 2D
**Cara:** Um mapa antigo de pergaminho desenhado a pena; a explicação vira uma viagem de parada em parada pela rota pontilhada.
**Bom pra:** processo em etapas, "como uma coisa leva à outra", rota, linha do tempo, explicação com começo e fim.

## Como é

- **Fundo:** pergaminho com manchas e bordas queimadas, parado. Por cima, o mapa: grade de meridianos, um pedaço de litoral e a rosa dos ventos.
- **Cores:** tinta marrom de pena, vermelho de rota e aguadas claras (sépia, ocre, azul, verde) (`COR`). Nada de cor saturada nem de preto puro.
- **Traço:** pena fina com tremor leve (`Pena`). Todo desenho começa com uma aguada que se espalha e depois é contornado a pena; sombra é hachura.
- **Letra:** Cinzel em caixa alta nos nomes de lugar e títulos, EB Garamond itálico nas notas e na legenda.
- **Movimento:** a câmera voa de uma parada à outra pela rota (afasta no meio do caminho, aproxima na chegada), a rota vermelha se completa, o marco X aparece e o desenho da parada se faz.
- **Transição:** a `Viagem`: não há corte, a câmera viaja pelo mesmo mapa. O título abre com o mapa inteiro e a cártula.
- **Legenda:** EB Garamond itálico 600, marrom-escuro com halo de papel, palavra dita em vermelho, a 80% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Pena` | traço de pena que se desenha |
| `Aguada` | mancha de tinta diluída que se espalha, base de todo desenho |
| `Rotulo` | letreiro de mapa (Cinzel) ou nota (Garamond itálico, `nota`) |
| `Rota` | caminho pontilhado vermelho que se completa com `p` |
| `Parada` | o marco: círculo a pena com X vermelho |
| `Rosa` | a rosa dos ventos |
| `Viagem` | a câmera que voa de um ponto do mapa a outro (a transição) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos a pena, molde pros novos |

## Pra desenhar coisa nova

Pense como um cartógrafo: aguada de uma cor, contorno a pena, duas ou três hachuras. Cada etapa da explicação mora
num ponto do mapa; o mapa é um só pro vídeo inteiro e cada cena só muda onde a câmera está e o que já foi desenhado
(veja `OMapa` e `cenaDaParada` no exemplo). Água em mapa antigo é fileira de ondinhas em zigue-zague.

## Evite

- Paradas perto demais: a câmera aproxima 1,75x e o desenho de uma parada não pode invadir a outra.
- Desenho na faixa da legenda (62% a 82% da altura da tela, já com o zoom).
- Rótulo pequeno: no zoom ele cresce, mas no mapa inteiro nada abaixo de 56.
- Símbolo de lugar real, bandeira ou mapa de país de verdade: o mapa é inventado.
