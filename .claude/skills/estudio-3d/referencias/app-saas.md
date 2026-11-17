# Playbook: app, site, sistema e SaaS

Profundidade: `fontes-youtube/app-saas.md` (11 vídeos: Derek Elliott 3D UX/UI, Polygon Runway,
kutson liquid glass, Motion Nations, Vane Motion, MiGo e outros).

## A tela é um sanduíche, não uma placa
Por que tela de IA parece imagem colada: uma camada só, sem vidro, sem reflexo, sem profundidade.
O que a biblioteca já resolve (`dispositivos`):
- `celular()`: medidas reais, moldura de metal chanfrada que pega luz, vidro (coat) sobre a
  imagem refletindo o estúdio, ilha dinâmica, módulo de câmera atrás.
- `notebook()`: base, teclado, trackpad, tampa com dobradiça animável (`piv['tampa']`).
- `cartao()`: card de UI com espessura (3-6 mm), modos `emite` (tela), `impresso` (objeto fosco
  iluminado pela cena) e `vidro` (vidro fosco com a UI atrás).
- `pilha_explodida()`: camadas da interface em profundidade, pra "abrir" a tela.

A pergunta de toda cena de tela: **quantas camadas tem e o que separa cada uma?** Menos de três
camadas com materiais diferentes é placa: volta pra bancada.

## Telas: de onde vêm
1. **Print real do cliente** (o melhor: é prova). Celular 1170x2532, notebook 1600x1000.
2. **HTML fotografado** quando o cliente não tem tela pronta ou quando a tela precisa ser animada
   em estados (antes/depois). Fotografe com Edge sem janela (comando no `SKILL.md`). Dados de
   exemplo levam "ilustrativo" e nomes genéricos.
3. **Camadas separadas** (cards, ícones, botões em PNG ou SVG do Figma) quando a UI vai explodir em
   profundidade: cada parte vira um `cartao()`.

Calibrado no laboratório: brilho da tela **~1,0** com AgX (a 1,6 o verde do "Confirmado" sumia);
reflexo do vidro 0,6.

## Regras de movimento de UI
- **Causa antes do efeito:** dedo ou cursor 4-5 quadros antes da reação. Nada gira ou rola sem
  gatilho.
- **Rolagem é flick:** dispara e desacelera longo. Nunca ease-in-out "elevador".
- **Entrada rápida que assenta** (`pousa`), filhos atrasados 2-5 quadros (`anima.escalonar`).
- **Troca de estado muda o mundo:** luz, fundo e emissão respondem junto (Polygon Runway baixa a
  luz de 1500 W pra 15 W no toggle).
- **Quando a UI acende, o fundo apaga** (−1 de exposição no fundo).
- **Nunca deixe o aparelho parado:** deriva linear leve + câmera respirando.
- **Cartões curvam e assentam:** entram envergados (Simple Deform Bend) e endireitam em ~25-30
  quadros.
- **Uma recompensa por peça:** o check, o número que sobe, o "Confirmado".

## Vidro de interface (liquid glass)
Vidro só existe com três coisas: **espessura chanfrada, desenho atrás pra distorcer e um brilho que
anda pela borda**. Faltou uma, não chame de vidro. No Cycles, mate a sombra escura do painel de
vidro (mix com Transparent pelo Is Shadow Ray). Brilho de borda: luz de área em Follow Path na
curva da borda, light linking só nos painéis (kutson).

## Estrutura de 15 s (app, 9:16)
| s | O que acontece |
|---|---|
| 0-1 | Celular entra (escala/queda/giro, `pousa`), conteúdo envergado endireita |
| 1-1,5 | Assenta; deriva e câmera respirando |
| 1,5-3 | Dedo toca; primeiro flick |
| 3-5 | Pausa de leitura; segundo flick até o item que importa |
| 5-6,5 | Recursos estouram em sequência (overshoot) |
| 6,5-8 | Troca de estado: luz, fundo e emissão mudam junto |
| 8-10 | Camadas saem da tela em profundidade; fundo escurece; brilho corre no vidro |
| 10-11,5 | Recompensa (check/número) |
| 11,5-15 | Logo + CTA, câmera ainda andando |

## Estrutura de 30 s (SaaS, 16:9)
| s | O que acontece |
|---|---|
| 0-2 | Gancho: o problema como objeto físico (a metáfora) |
| 2-6 | O caos cresce; cartões de recurso estouram |
| 6-10 | Notebook abre (`premium`), rack focus, faixa de luz passando pela tela |
| 10-15 | Prova: a tela real do sistema; cursor clica, a UI reage |
| 15-18 | Painéis saem da tela em camadas para frente do notebook |
| 18-22 | Recursos; toggle muda o estado e a luz da cena |
| 22-26 | Resultado num painel de vidro (o número/benefício) |
| 26-30 | Logo e CTA; câmera assenta mas não para |

Sinais de amador neste tema: tela como imagem colada · tudo com o mesmo brilho · rolagem
ease-in-out · tudo entrando junto · vidro preto · sombra escura sob painel de vidro · aparelho
parado entre ações · transição que para seco.
