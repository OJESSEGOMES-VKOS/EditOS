---
name: anim-teatro-de-sombras
description: Estilo de animação Teatro de sombras do EditOS: bonecos recortados em preto num pano iluminado por lamparina. Use quando pedirem vídeo animado "teatro de sombras", "sombra chinesa" ou o tema for lenda, história antiga ou conto com mistério.
---

# Teatro de sombras: estilo de animação do EditOS

**2D.** Um pano iluminado por uma lamparina, com bonecos recortados em preto que chegam de longe até ficar nítidos.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** lenda, história antiga, fábula, conto com clima, curiosidade contada em tom de mistério.
- **Pedidos que chamam este estilo:** "teatro de sombras", "sombra chinesa", ou um tema de lenda, história antiga ou conto com mistério.
- **Quando não:** Dado técnico, cor como informação ou conteúdo alegre de produto. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** pano de algodão com luz quente no meio (creme, laranja, ferrugem) que tremula como chama, fibra do
  tecido e borda escura. Embaixo o pano escurece, pra legenda ler.
- **Cores:** uma só pra tudo que se mexe: a sombra (`PRETO`). Quem pinta é a luz atrás do pano.
- **Bonecos:** silhueta chapada, com furos de renda que vazam a luz (`furos`) e vareta saindo pra baixo.
- **Profundidade:** o boneco longe do pano fica desfocado, mais claro e um pouco maior; encostado, fica nítido.
- **Letra:** Cinzel em caixa alta, no letreiro (recortado em preto) e na legenda.
- **Movimento:** chega de longe e encosta no pano, depois balança, gira ou corre. A câmera fica parada.
- **Transição:** o boneco se afasta e desfoca no fim da cena (`longeDe`), e a cena seguinte entra numa fusão curta.
  `Sopro` baixa a luz quando a passagem pede mais peso.
- **Legenda:** Cinzel 700, creme com sombra preta, palavra dita em âmbar, a 72% da altura, sobre a parte escura.

**Por quê:** A figura chegando de longe até ficar nítida cria suspense, e a silhueta com renda dá clima de história antiga contada à luz de vela.

## As peças
Em `sistema/animacoes/src/estilos/teatro-de-sombras/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/teatro-de-sombras'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Boneco` | qualquer forma vira sombra; `longe` de 0 a 1 desfoca, `vareta` põe a haste |
| `furos` | caminho de furos redondos pra vazar a luz no boneco |
| `Letreiro` | o texto: palavras recortadas numa tábua de sombra |
| `longeDe` | o quanto o boneco está longe naquele segundo (chega e se afasta) |
| `Sopro` | a luz baixa, por cima de tudo |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense no contorno que a coisa faz contra a luz: ela tem que ser reconhecida só pela silhueta. Desenhe de perfil,
com um caminho de formas simples, e fure dois ou três pontos com `furos` pra dar a renda. Ponha dentro de um
`Boneco`, com vareta, e faça ele chegar de longe com `longeDe`.

**Exemplo trabalhado:** "A lenda do boto": o rio como faixa ondulada, o boto de perfil que chega de longe, a festa com bandeirinhas recortadas, e o rapaz de chapéu que surge onde o boto estava.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo teatro-de-sombras`, em `animacoes/estilos/fotos/teatro-de-sombras-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo teatro-de-sombras` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Cor no boneco: só a sombra é preta, a luz faz o resto.
- Desenho de frente: de frente quase nada se reconhece em silhueta. Prefira o perfil.
- Assunto na parte de baixo: ali o pano escurece e a sombra some.
- Muitos bonecos nítidos ao mesmo tempo: deixe o secundário um pouco longe (desfocado).
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
