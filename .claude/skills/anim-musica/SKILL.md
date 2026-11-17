---
name: anim-musica
description: Estilo de animação Música visual do EditOS: noite de pontos de luz que pulsam numa batida. Use quando pedirem vídeo animado "visualizer", "música visual", "no ritmo" ou o tema for clima, ritmo, revelação ou vídeo com trilha.
---

# Música visual: estilo de animação do EditOS

**2D.** Noite funda feita de pontos de luz que pulsam numa batida; as coisas se formam de poeira de luz e o mar de pontos sobe quando a fala fica forte.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** clima, ritmo, revelação, curiosidade, vídeo com trilha marcante ou sem narração.
- **Pedidos que chamam este estilo:** "visualizer", "música visual", "no ritmo", ou um tema de clima, ritmo, revelação ou vídeo com trilha.
- **Quando não:** Explicação técnica longa ou tema que precisa de muitos rótulos. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** degradê de noite (quase preto em cima e embaixo, azul-anil e roxo no meio) com um céu de estrelas. A cada batida um grupo de estrelas acende forte e apaga.
- **Cores:** só luz: branco, ouro, azul, lilás, rosa e verde (`COR`). Tudo tem núcleo branco e halo colorido. Nada de cor chapada.
- **Forma:** nada tem contorno sólido. A coisa é poeira de luz que se junta (`Poeira`), fio de luz que se desenha (`Luz`) ou fileira de pontos que ondula (`OndaDePontos`).
- **Letra:** Josefin Sans: fina e bem espaçada nos rótulos, grossa nos títulos, sempre com brilho.
- **Movimento:** tudo respira na batida (`batida`, 100 por minuto, saída do relógio). A força das ondas e do brilho vem da `energia` da fala (cada palavra dita levanta, depois cai). Não usa arquivo de som: se a pessoa mandar trilha, combine o `BPM` com ela.
- **Transição:** um clarão de luz que nasce no centro e apaga (`Clarao`), no começo da cena.
- **Legenda:** Josefin Sans 700, branca com halo dourado, palavra dita em ouro, a 72% da altura.

**Por quê:** Tudo respira junto com a batida: o vídeo vira sensação, não só explicação. As formas que nascem de poeira de luz fazem a revelação pesar.

## As peças
Em `sistema/animacoes/src/estilos/musica/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/musica'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `batida(t)` | número da batida e o `pulso` (1 na batida, cai rápido): ligue em tamanho, brilho e cor |
| `energia(fala, tv)` | a força da fala agora, de 0 a 1: faz o papel do volume |
| `Brilho` | um ponto de luz redondo |
| `Luz` | fio de luz que se desenha, com halo |
| `Poeira` | grãos de luz que se juntam numa forma (`deY` diz de que altura eles saem) |
| `OndaDePontos` | fileiras de pontos que ondulam; `forca` levanta as ondas |
| `Letreiro` | texto de luz que sobe e acende |
| `Clarao` | a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em constelação: coisa cheia vira `Poeira` (escreva uma função que devolve pontos de dentro da forma, como
`pontosDeNuvem`); coisa fina vira `Luz` (uma lista de pontos). Uma casa é um quadrado e um triângulo de `Luz`; uma
árvore é um tronco de `Luz` e uma copa de `Poeira`. Toda coisa recebe o `pulso` da batida pra respirar junto.

**Exemplo trabalhado:** "Por que a música arrepia": um coração de Luz que pulsa na batida, uma onda de som em Poeira que sobe quando a fala fica forte, a pele como uma linha de pontos que se arrepia, e o cérebro como uma constelação que acende.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo musica`, em `animacoes/estilos/fotos/musica-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo musica` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Cor sólida, preenchimento chapado ou contorno escuro: aqui tudo é luz.
- Muito grão: mais de uns 150 pontos numa forma deixa pesado e embola.
- Texto fino pequeno: o rótulo fino só a partir de 56; título grosso.
- Pulso forte em tudo ao mesmo tempo: escolha o que bate na batida (estrelas, sol, chuva) e deixe o resto respirar.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
