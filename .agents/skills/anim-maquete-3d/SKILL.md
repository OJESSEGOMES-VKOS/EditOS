---
name: anim-maquete-3d
description: Estilo de animação Maquete 3D do EditOS: diorama em miniatura com peças de plástico e desfoque tilt-shift. Use quando pedirem vídeo animado "maquete", "miniatura", "diorama" ou o tema for como funciona por partes, cidade ou geografia.
---

# Maquete 3D: estilo de animação do EditOS

**3D edição.** Diorama em miniatura numa mesa, visto de cima em ângulo, com peças de plástico em cores de brinquedo e o desfoque de tilt-shift que deixa tudo pequeno.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** explicar como uma coisa funciona por partes, processo, geografia, cidade, natureza, "o mundo em miniatura".
- **Pedidos que chamam este estilo:** "maquete", "miniatura", "diorama", ou um tema de como funciona por partes, cidade ou geografia.
- **Quando não:** Rosto, emoção, tema sem partes físicas ou que pede clima dramático. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** uma sala clara fora de foco, com luzinhas borradas e o tampo de madeira da mesa embaixo.
- **Palco:** um bloco de terreno (terra dos lados, grama ou mar na tampa) em cima da mesa. Tudo acontece em cima dele.
- **Volume:** 3D de verdade calculado no Remotion: cada peça tem posição no mundo, a câmera olha de cima (uns 33 graus) e gira devagar, a luz vem do alto à esquerda (face do lado mais clara, a outra mais escura) e cada peça faz sombra macia no chão.
- **Material:** plástico pintado brilhante: bola com reflexo branco, tubo com faixa de luz, bloco com quina arredondada.
- **Cores:** de brinquedo, saturadas e limpas (`COR`): grama, mar, areia, sol, laranja, vermelho, rosa, terra, tronco.
- **Coisas no ar** (sol, nuvem) ficam presas numa haste fininha, como em maquete de verdade.
- **Tilt-shift:** a faixa de cima e a de baixo da tela ficam desfocadas; o foco é a faixa do meio, onde está a maquete.
- **Letra:** Lilita One em relevo (camadas empilhadas, como letreiro de plástico) nos títulos; Nunito 900 na legenda.
- **Movimento:** peças brotam com mola (`elastico`), pingos e vapor em loop, câmera girando bem devagar.
- **Transição:** a maquete pousa na entrada e sobe sumindo na saída (dentro da `Maquete`).
- **Legenda:** Nunito 900 branca com contorno escuro, palavra dita em amarelo, a 72% da altura.

**Por quê:** O tilt-shift faz tudo parecer pequeno e controlável, como brinquedo: o assunto grande fica fácil de entender. A câmera de cima mostra as partes trabalhando juntas.

## As peças
Em `sistema/animacoes/src/estilos/maquete-3d/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/maquete-3d'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `useCam(t, giro, cy)` | a câmera de cima que gira devagar |
| `Maquete` | ordena as peças do fundo pra frente, põe as sombras, o tilt-shift e a entrada/saída |
| `terreno` | a mesa e o bloco de terreno (tampa de grama, mar, areia...) |
| `bloco`, `bola`, `tubo`, `cone`, `haste` | as formas 3D: caixa, esfera, cilindro, cone e a haste que segura coisas no ar |
| `Letreiro` | texto em relevo de plástico |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Monte o objeto como um brinquedo de peças: casa é um `bloco` com um `cone` em cima; carro é um `bloco` com quatro
`bola` pretas; pessoa é um `tubo` com uma `bola` de cabeça. Posição sempre no mundo (`[x, y, z]`, y pra cima, chão
em 0, terreno de -280 a 280). Coisa que voa vai numa `haste`. Passe `chao` na bola principal pra ganhar sombra.

**Exemplo trabalhado:** "Como a água chega na sua casa": uma represa de blocos azuis, a estação de tratamento (blocos com tanques redondos), os canos como tubos, a caixa-d’água num pino alto e a casa de bloco com cone. A água anda como bolinhas azuis pelos tubos.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo maquete-3d`, em `animacoes/estilos/fotos/maquete-3d-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo maquete-3d` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Desenho plano em SVG por cima da maquete: tudo que é objeto entra como peça 3D.
- Objeto fora do terreno ou alto demais (acima de y 450 sai do foco do tilt-shift).
- Mais de umas 40 peças numa cena: polui e pesa.
- Texto pequeno: nada abaixo de 56. Texto mora no topo (Letreiro), nunca na faixa da legenda.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
