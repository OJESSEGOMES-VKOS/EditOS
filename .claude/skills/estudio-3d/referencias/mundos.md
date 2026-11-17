# Mundos visuais: o motor anti-mesmice

Um mundo é um pacote coerente de **fundo + luz + cor + lente + assinatura de movimento**. Ele
existe porque a IA, sozinha, converge sempre para o mesmo estúdio cinza com o produto girando no
centro. Escolha um mundo por filme, conscientemente, e registre em `registro.md`.

**Quem manda em quê:** a marca do cliente (design-guide) manda na paleta; o mundo manda na luz,
câmera e movimento. Se a paleta da marca brigar com o mundo, troque de mundo, não de marca.

## Os 7 mundos testados (prontos em `mundos.aplicar`)

Provas em `laboratorio/provas/frasco/` e `provas/app/`, todas com o mesmo frasco ou app em cada
mundo e medidas pelo `qa.py`.

| Mundo | Sensação | Serve | Não serve | Lente | Curvas | Medido |
|---|---|---|---|---|---|---|
| `estudio_premium` | caro, confiável, preciso | eletrônico, app, SaaS, cosmético clean | comida, marca barulhenta | 85 mm f/5,6 | pousa / decola / camera | contraste 0,28, OK |
| `luxo_escuro` | mistério, alto ticket | perfume, joia, relógio, bebida premium, carro | app de massa, infantil | 100 mm f/2,8 | premium (lento) | low key intencional, OK |
| `pop_candy` | divertido, jovem, energia | app de consumo, snack, bebida colorida, beleza divertida | jurídico, saúde séria, luxo | 50 mm f/8 | ressalta (overshoot) | contraste 0,28, colorido 42 |
| `vidro_cromo` | futuro, tech, IA | fintech, IA, cripto, SaaS futurista, produto de vidro/metal | orgânico, artesanal | 70 mm f/4 | pousa / premium | contraste alto, reflexo no piso |
| `neon_noturno` | noite, urbano, beat | game, música, evento, app noturno | saúde, jurídico, cor real | 35 mm f/2,8 | pousa / firme (rápido) | low key intencional, OK |
| `luz_natural` | humano, editorial, sol | serviço local, saúde, casa, café, cosmético editorial | tech futurista, luxo noturno | 50 mm f/2,8 | suave + câmera na mão | faixas de persiana, OK |
| `argila` | amigável, didático | explicar serviço/processo, app amigável, educação | luxo, realismo de material | 65 mm f/5,6 | ressalta (brinquedo) | contraste 0,22, OK |

Assinatura de cada mundo (o que torna ele reconhecível):
- **estudio_premium:** ciclorama cinza-neutro afastado (o fundo cai pro escuro), contornos frios,
  chave quente com grade, bandeiras pretas desenhando a borda do vidro.
- **luxo_escuro:** piso espelhado escuro, só duas réguas de contorno quentes (3600 K) desenham o
  objeto, reflexo dourado no chão. Nada salta: travelling lento, luz que varre.
- **pop_candy:** ciclorama colorido com vinheta natural da softbox (o centro claro, as bordas caem),
  pedestal em cor complementar, AgX Punchy. Entradas com mola.
- **vidro_cromo:** piso espelhado azul-noite, três cartões de reflexo fazendo linhas no vidro e
  metal. Reflexos correm, o objeto quase não se mexe.
- **neon_noturno:** réguas magenta e ciano opostas, névoa leve, piso molhado. Cortes no beat.
- **luz_natural:** sol de fim de tarde (3900 K) atravessando uma persiana (as faixas são a
  assinatura), fundo bege, câmera na mão sutil.
- **argila:** tudo fosco e arredondado, luz macia de cima, paleta pastel terrosa, câmera mais alta
  (18°).

## Os 12 mundos montados da ficha (testados na RTX, 2026-10-02)

Fichas completas (paleta, materiais, luz, câmera, movimento, transição, tipografia, som, quando
usar e referências reais) em `base/02-mundos-visuais.md`; dados em `scripts/estudio3d/mundos.json`.
`mundos.aplicar('<id>')` monta qualquer um. Provas com o frasco + fotômetro em
`laboratorio/provas/frasco/folha_novos_v2.png` (o diorama com cena própria ortográfica).

| Mundo | Sensação | Medido (qa.py) | Observação do laboratório |
|---|---|---|---|
| `diorama_isometrico` | maquete, processo em miniatura | claro intencional, OK | exige câmera ortográfica e cena de blocos; sol a 45° **da câmera** |
| `organico_liquido` | fluido, natural, petróleo | escuro intencional, OK | contraluz é a principal |
| `brutalista_tech` | duro, gráfico, concreto | OK após fotômetro (22% → 0% estourado) | luz pequena e dura |
| `macro_cinematografico` | detalhe, textura, mistério | escuro intencional, OK | luz rasante revela relevo |
| `papel_recorte` | artesanal, editorial, sol duro | claro intencional, OK | sol forte + céu fraco |
| `retrofuturo` | anos 80, pôr do sol, cromo | OK | o céu de 3 cores é luz e cenário (piso aberto, sem parede) |
| `holografico` | iridescente, futuro, tech | OK | contornos magenta e ciano com light linking |
| `editorial_revista` | moda, beleza, revista | OK após fotômetro (18% → 0%) | beauty dish frontal alto |
| `tatil_textil` | toque, conforto, tecido | OK de primeira | luz rasante faz o sheen aparecer |
| `fitas_ribbons` | movimento, fluxo, fitas | escuro intencional, OK | contraluz pra borda das fitas |
| `arquitetonico_luz_dura` | arquitetura, sol de janela | OK | a parede com abertura projeta o retângulo de luz |
| `color_block` | cor chapada, pop gráfico | OK | luz branca na chave, preenchimento na cor do mundo |

## Catálogo ampliado (fichas no destilado, a montar conforme a demanda)

`fontes-youtube/estilos.md` traz 17 mundos com ficha completa: fitas doces ortográficas, enxame de
pontos, plexus de vidro, escultura de volume, mosaico de botões (SaaS/app), luz volumétrica
através do logo, metal incandescente, fatias, purpurina vermelha e dourada, tecido, diorama
isométrico, fábrica em loop, produto brinquedo, cartoon, natureza com match cut e pintura viva.
Quando um briefing pedir um desses, monte a partir da ficha e, se ficar bom, transforme em entrada
nova em `scripts/estudio3d/mundos.py` (com prova no laboratório).

### Escolha por briefing

| Briefing | 1ª escolha | Alternativa | Evitar |
|---|---|---|---|
| App de consumo, marca jovem | pop_candy | argila, mosaico (catálogo) | luxo_escuro |
| SaaS B2B, sistema, painel | estudio_premium | vidro_cromo | neon_noturno |
| IA, dados, fintech | vidro_cromo | plexus (catálogo) | argila |
| Serviço local, clínica, saúde | luz_natural | argila | neon_noturno |
| Explicar processo/serviço | argila | diorama (catálogo) | luxo_escuro |
| Perfume, joia, bebida premium | luxo_escuro | luz_natural (editorial) | pop_candy |
| Cosmético, skincare | luz_natural | estudio_premium, fitas doces (catálogo) | neon_noturno |
| Eletrônico, gadget | estudio_premium | vidro_cromo, produto brinquedo | argila |
| Game, música, evento | neon_noturno | volumétrica (catálogo) | luz_natural |
| Abertura de marca / logo | luxo_escuro ou volumétrica | fatias (catálogo) | argila |

## A regra de rotação (registro.md)

- Dois filmes seguidos **do mesmo cliente** nunca no mesmo mundo.
- Dois filmes seguidos **do estúdio** nunca com o mesmo par (mundo, lente).
- Duas peças seguidas não repetem o par (luz, paleta) nem o par (gerador de forma, motor de
  movimento) (`fontes-youtube/estilos.md`, os 8 eixos de variação).
- Ao entregar, anote em `registro.md`: data, cliente, mundo, lente principal, curva assinatura.

## Os 8 eixos de variação (troque no mínimo 3 entre peças seguidas)

1. Gerador de forma (objeto modelado, instâncias, fitas, pontos, fatias, diorama).
2. Motor do movimento (keyframe com personalidade, mola, noise em loop, proximidade, simulação,
   speed ramp).
3. Família de material do herói (vidro, metal, laca, argila, tela, tecido).
4. Luz (o rig).
5. Câmera e lente (24 a 135 mm, ortográfica, dutch).
6. Paleta.
7. Ritmo (loop calmo, revelação + respiro, montagem curta no beat).
8. Pós (limpo, glare suave, cinema com letterbox e grão).
