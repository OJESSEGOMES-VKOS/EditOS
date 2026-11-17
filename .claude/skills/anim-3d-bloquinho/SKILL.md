---
name: anim-3d-bloquinho
description: Estilo de animação 3D de bloquinho do EditOS: maquete de blocos facetados com contorno escuro, feita no Blender. Use quando pedirem vídeo animado "3D de bloquinho", "3D de blocos" ou o tema for "como funciona" ou máquina por dentro.
---

# 3D de bloquinho: estilo de animação do EditOS

**3D Blender.** Maquete 3D feita de blocos e formas facetadas, cor lisa e forte, sombra em degraus e contorno escuro, como um brinquedo de montar.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** "como funciona", ciclo e processo, máquina por dentro, natureza, pequena história com personagem.
- **Pedidos que chamam este estilo:** "3D de bloquinho", "3D de blocos", ou um tema de "como funciona" ou máquina por dentro.
- **Quando não:** Sem o Blender instalado, ou com pressa: o render é bem mais demorado que o 2D. Ofereça um 3D leve no lugar. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** céu em faixas de cor (dia azul-claro, tarde laranja e roxo, noite azul-escuro). Nada de foto nem textura.
- **Cores:** lisas e saturadas, da tabela `COR` do kit. Cada peça tem uma cor só por face; o 3D vem dos degraus de sombra.
- **Traço:** contorno escuro em volta de cada peça (`contorno`). Peça sem contorno parece solta da cena.
- **Forma:** tudo é bloco, cilindro de poucos lados, cone ou bola facetada. Nada liso nem detalhado.
- **Gente:** o boneco de blocos (`boneco`), de cabeça quadrada, com cor de camisa e calça trocáveis. Nunca pessoa real.
- **Letra:** letreiro 3D curto, cor escura que brilha sozinha, no alto da tela.
- **Movimento:** físico e plausível: as coisas crescem, caem, andam, boiam. Nada teletransporta nem pisca.
- **Câmera:** uma câmera só, que aproxima ou passeia devagar e sempre olha pro assunto.
- **Legenda:** o Blender não faz legenda. Ver `animacoes/blender/GUIA.md`, seção "Narração e legenda".

**Por quê:** Blocos facetados e contorno escuro fazem o 3D parecer brinquedo: claro de ler e simpático. A câmera única e o movimento físico deixam o mecanismo crível.

## As peças
Em `sistema/animacoes/blender/kit_bloquinho.py` (o exemplo inteiro em `animacoes/blender/exemplo_ciclo_da_agua.py`):

| Peça | O que faz |
|---|---|
| `nova_cena` | limpa, põe o tamanho (vertical ou horizontal), 30 qps, céu e sol |
| `bloco`, `cilindro`, `cone`, `bola` | as formas; `ancora='base'` faz crescer do chão |
| `grupo`, `pecas` | junta peças pra mover junto |
| `chao`, `arvore`, `nuvem`, `texto` | prontos de uso comum |
| `boneco`, `andar`, `acenar` | a pessoa de blocos e seus movimentos |
| `contorno` | a borda escura |
| `chaves`, `aparecer`, `sumir`, `balancar`, `cor_em` | o movimento, sempre em segundos |
| `camera` | a câmera que segue um alvo |
| `renderizar` | o quadro de teste, ou o vídeo (com `pasta=`, o fundo3d de um vídeo da oficina) |

## A invenção (o que a fala nova pede e o exemplo não tem)
Monte o objeto com 3 a 8 formas simples, como uma criança montaria com peças de encaixe: carro é um bloco, um bloco
menor em cima e quatro cilindros. Junte num `grupo`, passe `contorno` e anime o grupo.

**Exemplo trabalhado:** "Como funciona um moinho de vento": o chão de grama, a torre de blocos com o telhado em cone, as pás que giram com `chaves` sem suavizar, o saco de grão que sobe por um bloco, o boneco que anda até a porta, e a câmera que passeia devagar. Contorno em tudo.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Tire quadros do vídeo novo e compare com o exemplo (`animacoes/blender/exemplo_ciclo_da_agua.py -- --quadro N`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (passos 0 a 3: perfil, pedido, roteiro, voz) e `sistema/animacoes/blender/GUIA.md`
inteiro. De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo giz` (o giz só empresta a legenda que vai por cima) e o roteiro.
2. `node animacoes/ferramentas/voz.mjs <pasta>`: o `fala.json` que a cena 3D lê com `K.ler_fala`.
3. `oficina/<pasta>/cena3d.py` no molde do GUIA; quadros de teste com
   `QUEM=animacoes sh tools/com-trava.sh "<blender>" -b -P oficina/<pasta>/cena3d.py -- --quadro 6.5` (olhe cada um).
4. Render do fundo pela trava (`... -b -P oficina/<pasta>/cena3d.py`), o `video.tsx` de uma cena que toca o
   `fundo3d.mp4` (GUIA §7), `fotos.mjs` e `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`,
   que entrega no perfil (`SEM_ENTREGA=1` pra rascunho).

## Nunca
- Muita peça pequena: no celular vira ruído.
- Texto pequeno ou longo: até 2 palavras, `tamanho` 1,2 ou mais com a câmera a uns 20 m.
- Câmera girando rápido ou cortando a cada segundo: enjoa e esconde o assunto.
- Assunto principal na faixa de 62% a 82% da altura no vertical (é onde a legenda entra depois).
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
