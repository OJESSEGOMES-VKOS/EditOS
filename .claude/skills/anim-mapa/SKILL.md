---
name: anim-mapa
description: Estilo de animação Mapa de rota do EditOS: mapa antigo de pergaminho a pena, rota pontilhada de parada em parada. Use quando pedirem vídeo animado "mapa", "rota", "viagem", "caminho" ou o tema for processo em etapas ou "como uma coisa leva à outra".
---

# Mapa de rota: estilo de animação do EditOS

**2D.** Um mapa antigo de pergaminho desenhado a pena; a explicação vira uma viagem de parada em parada pela rota pontilhada.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** processo em etapas, "como uma coisa leva à outra", rota, linha do tempo, explicação com começo e fim.
- **Pedidos que chamam este estilo:** "mapa", "rota", "viagem", "caminho", ou um tema de processo em etapas ou "como uma coisa leva à outra".
- **Quando não:** Assunto sem sequência, lista solta ou tema moderno de interface. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** pergaminho com manchas e bordas queimadas, parado. Por cima, o mapa: grade de meridianos, um pedaço de litoral e a rosa dos ventos.
- **Cores:** tinta marrom de pena, vermelho de rota e aguadas claras (sépia, ocre, azul, verde) (`COR`). Nada de cor saturada nem de preto puro.
- **Traço:** pena fina com tremor leve (`Pena`). Todo desenho começa com uma aguada que se espalha e depois é contornado a pena; sombra é hachura.
- **Letra:** Cinzel em caixa alta nos nomes de lugar e títulos, EB Garamond itálico nas notas e na legenda.
- **Movimento:** a câmera voa de uma parada à outra pela rota (afasta no meio do caminho, aproxima na chegada), a rota vermelha se completa, o marco X aparece e o desenho da parada se faz.
- **Transição:** a `Viagem`: não há corte, a câmera viaja pelo mesmo mapa. O título abre com o mapa inteiro e a cártula.
- **Legenda:** EB Garamond itálico 600, marrom-escuro com halo de papel, palavra dita em vermelho, a 80% da altura.

**Por quê:** Transformar a explicação em viagem dá começo, meio e fim claros. O mapa é um só pro vídeo inteiro, então a pessoa sempre sabe onde está.

## As peças
Em `sistema/animacoes/src/estilos/mapa/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/mapa'` (e o kit de `'../../animacoes/src/kit'`):

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

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como um cartógrafo: aguada de uma cor, contorno a pena, duas ou três hachuras. Cada etapa da explicação mora
num ponto do mapa; o mapa é um só pro vídeo inteiro e cada cena só muda onde a câmera está e o que já foi desenhado
(veja `OMapa` e `cenaDaParada` no exemplo). Água em mapa antigo é fileira de ondinhas em zigue-zague.

**Exemplo trabalhado:** "O caminho do café até a sua xícara": no mesmo pergaminho, a fazenda na serra (montanhas a pena), o terreiro de secagem, o porto com ondinhas em zigue-zague, a torrefação e a xícara na cidade. A câmera anda de parada em parada pela rota pontilhada.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo mapa`, em `animacoes/estilos/fotos/mapa-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo mapa` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Paradas perto demais: a câmera aproxima 1,75x e o desenho de uma parada não pode invadir a outra.
- Desenho na faixa da legenda (62% a 82% da altura da tela, já com o zoom).
- Rótulo pequeno: no zoom ele cresce, mas no mapa inteiro nada abaixo de 56.
- Símbolo de lugar real, bandeira ou mapa de país de verdade: o mapa é inventado.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
