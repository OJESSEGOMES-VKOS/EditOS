---
name: anim-pixel
description: Estilo de animação Pixel de videogame do EditOS: jogo antigo de 16 bits com texto numa caixa de diálogo. Use quando pedirem vídeo animado "pixel", "8 bits", "16 bits", "videogame" ou o tema for curiosidade ou tecnologia.
---

# Pixel de videogame: estilo de animação do EditOS

**2D.** Jogo antigo de 16 bits: tudo feito de quadradinhos, céu em faixas pontilhadas e texto digitado numa caixa de diálogo.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** curiosidade, tecnologia, passo a passo com cara de fase de jogo, público jovem.
- **Pedidos que chamam este estilo:** "pixel", "8 bits", "16 bits", "videogame", ou um tema de curiosidade ou tecnologia.
- **Quando não:** Tema delicado, luto ou peça de marca sofisticada. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** céu em cinco faixas de azul, com pontilhado em xadrez entre uma e outra, e chão azul-marinho embaixo (onde mora a legenda).
- **Cores:** só a paleta fechada `COR` (azuis, branco, amarelo, laranja, verdes, terra, cinzas). Cor fora dela quebra a cara.
- **Forma:** blocos quadrados numa grade (`PX`, 10 numa tela de 1080). Nada de curva lisa, nada de borda suave.
- **Movimento:** aos saltos de pixel. Tudo que anda passa pela grade, então move em degraus, como no jogo. Coisa que nasce se monta bloco a bloco.
- **Letra:** Press Start 2P na caixa de diálogo e nos títulos; Pixelify Sans na legenda.
- **Transição:** o mosaico, blocos grandes que cobrem a tela na diagonal no fim da cena e descobrem a próxima.
- **Legenda:** Pixelify Sans 700, branca com contorno escuro duro, palavra dita em amarelo, a 72% da altura.

**Por quê:** A caixa de diálogo e a fase de jogo transformam a explicação em aventura conhecida. O pixel grande lê bem pequeno.

## As peças
Em `sistema/animacoes/src/estilos/pixel/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/pixel'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Pixels` | a camada de quina dura; todo retângulo solto vai dentro dela |
| `Sprite` | desenho feito de texto (cada letra uma cor), que se monta na diagonal com `p` |
| `Disco` | círculo cheio de blocos, que cresce do centro |
| `Digitado` | texto de jogo que se digita letra a letra, com o ▼ piscando no fim |
| `CaixaDialogo` | a caixa azul de borda branca do RPG, que abre de cima pra baixo |
| `Mosaico` | a transição: `entra` no começo da cena, `sai` no fim |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Desenhe como um `Sprite`: uma lista de linhas de texto, cada letra uma cor, ponto é vazio. Pense em 6 a 14 pixels
de largura e aumente com `escala`. Forma redonda é `Disco`; faixa reta é `rect` dentro de `Pixels`, com a posição
passada pela grade. Pessoa é um boneco de silhueta simples (cabeça, tronco, pernas), nunca personagem de jogo que existe.

**Exemplo trabalhado:** "Como a internet chega no seu celular": o celular de sprite, a torre de antena que solta ondas de pixels, o cabo no fundo do mar como faixa reta, e a caixa de diálogo que digita "conectado!".

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo pixel`, em `animacoes/estilos/fotos/pixel-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo pixel` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Personagem, tela, fonte ou som de jogo que já existe.
- Movimento liso e curvas suaves: aqui tudo anda em degrau.
- Sombra borrada, degradê liso, transparência demais.
- Texto pequeno: Press Start é larga, use frases curtas (até 16 letras por linha) e nunca abaixo de 56.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
