---
name: anim-oleo
description: Estilo de animação Pintura a óleo do EditOS: quadro a óleo pintado na hora, com pinceladas grossas. Use quando pedirem vídeo animado "pintura a óleo", "quadro", "pintado" ou o tema for história, reflexão, arte, natureza ou lugar.
---

# Pintura a óleo: estilo de animação do EditOS

**2D.** Cada cena é um quadro a óleo pintado na hora, com pinceladas grossas e empasto que seguem a forma das coisas.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história, reflexão, curiosidade com clima, abertura bonita, tema de arte, natureza e lugar.
- **Pedidos que chamam este estilo:** "pintura a óleo", "quadro", "pintado", ou um tema de história, reflexão, arte, natureza ou lugar.
- **Quando não:** Dado técnico, lista, interface ou tema que pede precisão. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** tela de linho crua com a trama do tecido; só aparece antes da primeira pincelada.
- **Cores:** paleta de pintor: ultramar, cobalto, celeste, névoa, ocre, amarelo-nápoles, siena, verde e a sombra violeta (`COR`). Nada de preto puro nem cor de neon.
- **Forma:** formas grandes com luz de um lado e sombra do outro (`bola`), céus e mares em degradê. Não há contorno: o volume vem da tinta.
- **Pincelada:** duas camadas: a massa (pinceladas largas que cobrem tudo) e o detalhe (pinceladas menores por cima). A direção segue o contorno das formas, e cada pincelada tem a crista clara do empasto.
- **Letra:** Playfair Display 900 nos títulos, cor de luz com contorno de sombra (`Assinatura`); Playfair itálico na legenda.
- **Movimento:** dentro do quadro a tinta se move: o reflexo do sol tremula, o mar ondula, a chuva desce, a nuvem incha, a planta cresce.
- **Transição:** a repintura: o quadro novo é pintado por cima do velho, das pinceladas grandes pras pequenas, em 1,8 s (`repintura`).
- **Legenda:** Playfair Display itálico 700, creme com sombra escura forte, palavra dita em amarelo-nápoles, a 72% da altura.

**Por quê:** A pincelada que segue a forma dá clima e emoção de quadro de museu. Sem detalhe fino, cada cena é uma imagem forte e simples.

## As peças
Em `sistema/animacoes/src/estilos/oleo/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/oleo'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Quadro` | pinta o campo com pinceladas; com `antes` e `p`, repinta por cima do quadro anterior |
| `Campo`, `empilha` | o desenho como função "cor da tinta no ponto"; empilhar é juntar desenhos |
| `degrade`, `bola`, `abaixo` | os campos básicos (céu e mar, forma com volume, chão) |
| `Assinatura` | título pintado |
| `repintura(t)` | o `p` da pintura no começo da cena |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos como campos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como um pintor que bloqueia o quadro: duas ou três massas de cor com luz e sombra, um fundo em degradê, e
pronto. Monte com `bola`, `degrade` e `abaixo` empilhados. Forma menor que uma pincelada grande (uns 45 numa tela de
1080) se perde; o detalhe fino não existe neste estilo.

**Exemplo trabalhado:** "A vida de um farol à noite": o céu em degradê azul-escuro, a torre em duas massas de cor, o feixe de luz amarela que gira em pinceladas, e o mar que muda de azul pra prata quando a luz passa.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo oleo`, em `animacoes/estilos/fotos/oleo-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo oleo` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Forma pequena ou fina: vira borrão.
- Duas coisas da mesma cor encostadas: a pincelada não separa o que não tem diferença de luz.
- Texto pequeno ou em cima de área muito clara: título só com a `Assinatura`.
- Repintar a cada segundo: o quadro precisa de tempo parado pra ser visto (a tinta continua viva por dentro).
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
