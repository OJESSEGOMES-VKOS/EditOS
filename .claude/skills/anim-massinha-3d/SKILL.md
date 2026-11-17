---
name: anim-massinha-3d
description: Estilo de animação Massinha 3D do EditOS: bonecos e objetos de massinha num estúdio de mesa. Use quando pedirem vídeo animado "massinha", "claymation", "de massinha" ou o tema for explicação simpática, família ou produto.
---

# Massinha 3D: estilo de animação do EditOS

**3D leve.** Bonecos e objetos de massinha num estúdio de mesa, estufados, com brilho de luz de estúdio e sombra macia no chão.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** explicação simpática, público infantil e família, produto, curiosidade do dia a dia.
- **Pedidos que chamam este estilo:** "massinha", "claymation", "de massinha", ou um tema de explicação simpática, família ou produto.
- **Quando não:** Tema grave, dado técnico preciso ou clima de mistério. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** o fundo infinito de estúdio de foto, pêssego claro, parede e chão numa curva só, com um clarão suave da luz principal no alto à esquerda. Não muda de cor.
- **Volume (a marca do estilo):** toda peça passa pelo `Barro`, um filtro que transforma a forma em relevo e acende a luz de estúdio nele: a borda escurece arredondando, o lado de baixo à direita fica na sombra, o alto à esquerda ganha brilho, e um grão fino dá a textura de dedo. É volume de verdade calculado pela luz, não sombra pintada.
- **Peças que se fundem:** formas que se tocam dentro do mesmo `Barro` viram uma peça só (a nuvem são quatro bolas). Peças separadas (o sol e os raios) ficam em `Barro`s separados.
- **Sombra:** toda peça tem a sua sombra de contato, macia e quente, no chão (`Sombra`). Coisa que flutua deixa uma sombra mais fraca.
- **Cores:** massinha viva e leitosa (`COR`): laranja, amarelo, azuis, celeste, branco, cinza, verdes, terra, rosa. Nada de preto.
- **Movimento:** squash & stretch. A peça nasce do chão esticando, passa do ponto e assenta (`Molde`); respira de leve; pingo estica caindo e achata no chão.
- **Letra:** Fredoka (redonda, gordinha). No título ela vira massinha também (`Letra` dentro do `Barro`).
- **Transição:** a amassada, a peça é achatada contra o chão no fim da cena (o `Molde` com `dur`), com uma fusão curta pra próxima.
- **Legenda:** Fredoka 700, marrom-chocolate com halo creme, palavra dita em laranja-tijolo, a 74% da altura, em cima do chão claro.

**Por quê:** A massinha parece feita à mão e é engraçada por natureza: abaixa a guarda de quem assiste. O brilho e a sombra no chão dão peso de objeto real.

## As peças
Em `sistema/animacoes/src/estilos/massinha-3d/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/massinha-3d'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Barro` | o volume de massinha: luz, brilho e grão em tudo que vai dentro |
| `Bola`, `Cobrinha` | as duas formas básicas da massinha: bola (ou ovo) e rolinho |
| `Sombra` | a sombra de contato no chão, fora do `Barro` |
| `Molde` | nasce esticando do chão e é amassado no fim |
| `Letra` | texto gordinho que vira massinha dentro do `Barro` |
| `CHAO` | a altura do chão (58% da tela) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como quem modela com a mão: bolas, ovos e rolinhos grudados. Uma casa é um bloco (caminho cheio de cantos
redondos) com um telhado de cobrinha; uma pessoa é um ovo de corpo, uma bola de cabeça e quatro rolinhos. Ponha cada
parte de cor diferente no seu `Barro`, a `Sombra` no chão embaixo e um `Molde` pra ela nascer.

**Exemplo trabalhado:** "Por que o sorvete derrete": uma casquinha de rolinhos bege, a bola de sorvete rosa que escorre em cobrinhas, um sol de massinha amarelo que chega perto, e um termômetro de rolinho que sobe.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo massinha-3d`, em `animacoes/estilos/fotos/massinha-3d-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo massinha-3d` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Peça fina ou detalhe pequeno: some no volume. Nada mais fino que uns 30 numa tela de 1080.
- Duas cores no mesmo `Barro` encostadas: elas se fundem num relevo só; separe em dois.
- Peça sem sombra no chão: perde o peso e parece adesivo.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
