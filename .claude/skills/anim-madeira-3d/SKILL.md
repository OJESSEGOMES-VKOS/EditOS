---
name: anim-madeira-3d
description: Estilo de animação Madeira 3D do EditOS: brinquedos de madeira torneada num disco que gira devagar. Use quando pedirem vídeo animado "madeira", "brinquedo de madeira", "artesanal" ou o tema for infantil, família ou explicação calma.
---

# Madeira 3D: estilo de animação do EditOS

**3D edição.** Brinquedos de madeira torneada e pintada num disco que gira devagar, tinta fosca com o veio aparecendo, cantos arredondados e sombra macia.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** infantil, explicação calma, família, educação, produto artesanal, "como funciona" com aconchego.
- **Pedidos que chamam este estilo:** "madeira", "brinquedo de madeira", "artesanal", ou um tema de infantil, família ou explicação calma.
- **Quando não:** Tecnologia de ponta, clima noturno ou tema urgente. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** estúdio creme, parede que vira chão sem quina, luz suave do alto. Não muda.
- **Palco:** um disco de madeira crua (`Giradisco`). Os brinquedos ficam em cima dele.
- **Volume:** 3D calculado no Remotion: cada peça tem posição no mundo, a câmera **gira sem parar** em volta do disco
  (devagar), a luz vem do alto à esquerda e toda peça faz sombra macia e borrada no chão.
- **Material:** madeira pintada fosca (sem reflexo de plástico), com o veio da madeira (o filtro `madeira-3d-veio`)
  por cima de tudo. Peças torneadas: bola, pino, cone, cubo de canto arredondado.
- **Cores:** tinta de brinquedo um pouco apagada (`COR`): vermelho, amarelo, azul, celeste, verde, laranja, creme;
  `pinho` e `nogueira` são a madeira crua.
- **Coisas no ar** (sol, nuvem) ficam espetadas num pino de nogueira, como brinquedo de encaixe.
- **Letra:** Bree Serif, tanto na `Placa` (título com espessura) quanto na legenda e nos blocos de alfabeto.
- **Movimento:** peças brotam com mola, ondas sobem e descem, e o giro da câmera nunca para.
- **Transição:** uma tábua de madeira desce pela tela e leva a cena (`Tabua`, dentro do `Giradisco`).
- **Legenda:** Bree Serif marrom com contorno creme, palavra dita em vermelho, a 72% da altura.

**Por quê:** Brinquedo de madeira passa aconchego e cuidado. O disco que gira mostra o assunto de vários lados sem corte, e o veio da madeira dá textura sem poluir.

## As peças
Em `sistema/animacoes/src/estilos/madeira-3d/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/madeira-3d'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `useCam(t, giro, cy, vel)` | a câmera que gira em volta do disco |
| `Giradisco` | o disco, a ordem das peças, as sombras, o veio, a entrada e a tábua da saída |
| `bolaM`, `pino`, `cone`, `cubo` | as peças torneadas; `cubo` com `letra` vira bloco de alfabeto |
| `Placa`, `Tabua` | título de madeira e a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em brinquedo de madeira de loja de artesanato: tudo é bola, pino, cone ou cubo encaixado. Pessoa é um pino com
uma bola de cabeça; casa é um cubo com um cone; carro é um cubo comprido (dois cubos) com quatro bolas pretas. Posição
no mundo `[x, y, z]`, y pra cima, chão do disco em 0, disco com raio 350. Coisa no ar vai espetada num `pino`.

**Exemplo trabalhado:** "Como o pão é feito": um saco de farinha (cubo) e uma bola de massa no disco, um pino de padeiro com bola de cabeça que sova, a massa que cresce, o forno de cubo com cone de chaminé e o pão que sai dourado.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo madeira-3d`, em `animacoes/estilos/fotos/madeira-3d-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo madeira-3d` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Brilho de plástico ou cor neon: a madeira é fosca e a tinta é calma.
- Peça fora do disco (raio maior que 350): ela some no giro.
- Parar a câmera: o giro lento é a assinatura do estilo.
- Texto pequeno: nada abaixo de 56. Texto no topo, nunca na faixa da legenda.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
