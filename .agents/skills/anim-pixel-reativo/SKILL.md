---
name: anim-pixel-reativo
description: Estilo de animação Pixel reativo do EditOS: fliperama de 16 bits onde os sprites pulam a cada palavra dita. Use quando pedirem vídeo animado "pixel reativo", "fliperama", "game no ritmo" ou o tema for curiosidade rápida ou tecnologia.
---

# Pixel reativo: estilo de animação do EditOS

**2D.** Fliperama de 16 bits à noite: sprites de quadradinhos que pulam a cada palavra dita, como se a fala fosse a batida do jogo.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** curiosidade rápida, tecnologia, lista e passo a passo com energia, público jovem.
- **Pedidos que chamam este estilo:** "pixel reativo", "fliperama", "game no ritmo", ou um tema de curiosidade rápida ou tecnologia.
- **Quando não:** Tema sério, delicado ou lento. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** céu violeta-noite em seis faixas de degrau, com xadrez entre elas, estrelas de um pixel que piscam e a moldura de gabinete (preto grosso com filete amarelo). Não muda de cor.
- **Cores:** só a paleta fechada `COR`: amarelo, laranja, vermelho, azuis do mar, ciano do vapor, verdes, terra e cinzas. Cor fora dela quebra a cara.
- **Forma:** sprites escritos como linhas de letras (`SPRITES`), cada letra uma cor. Nada de curva lisa: tudo cai na grade do pixel (12 numa tela de 1080).
- **A reação à fala (a marca do estilo):** `pulso(fala, tv)` vale 1 quando uma palavra começa e cai rápido. Os sprites pulam nessa batida, a crista do mar salta, o chão treme e sai faísca. Com `atraso`, um sprite pula logo depois do outro e a cena ganha ritmo de jogo.
- **Movimento:** aos degraus de pixel. Coisa que cresce cresce em escala inteira ou bloco a bloco.
- **Letra:** Press Start 2P no rótulo da caixa (FASE 1), Jersey 10 (pixel encorpado, lê bem no celular) no texto da caixa e na legenda (a Press Start não tem acento).
- **Transição:** a varredura, faixas pretas que entram alternando os lados e fecham a tela no fim da cena, e abrem no começo da próxima.
- **Legenda:** Jersey 10, branca com contorno preto duro e degrau embaixo, palavra dita em amarelo, a 72% da altura.

**Por quê:** Os sprites pulando na fala viram a batida do vídeo: energia de jogo e atenção presa. Poucas cores por sprite mantêm a leitura.

## As peças
Em `sistema/animacoes/src/estilos/pixel-reativo/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/pixel-reativo'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `pulso`, `batidas` | a batida da fala: pulso de 0 a 1 em cada palavra, e quantas palavras já foram ditas |
| `Sprite`, `medida` | desenha um sprite de letras na grade; `troca` recolore, `virar` espelha |
| `Faisca` | quatro pixels que saltam na batida |
| `Caixa` | caixa de texto do jogo que se digita (HTML, fora da `Tela`) |
| `Varredura` | a transição em faixas |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Chao`, `Planta` | desenhos prontos, molde dos novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Escreva o objeto como um sprite de 8 a 12 colunas: cada linha uma string, cada letra uma cor de `COR`, ponto pra
vazio. Uma cor de corpo, uma de sombra e uma de brilho bastam. Ligue o objeto principal ao `pulso` pra ele pular na
fala, e os secundários ao `pulso` com `atraso`.

**Exemplo trabalhado:** "Como funciona a memória do computador": um chip de sprite que pula em cada palavra, blocos de dado que entram em fila, uma lâmpada que acende no "lembra" e um X vermelho no "apaga".

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo pixel-reativo`, em `animacoes/estilos/fotos/pixel-reativo-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo pixel-reativo` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Sprite grande demais com detalhe: 12 colunas já é muito. Aumente com `e`, não com mais linhas.
- Pulo em tudo ao mesmo tempo: o principal pula forte, o resto pouco ou com atraso.
- Texto na tela fora da `Caixa`, ou abaixo de 56 de tamanho.
- Cor nova, degradê ou borda suave: quebram o pixel.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
