---
name: anim-mesa-de-jogo
description: Estilo de animação Mesa de jogo do EditOS: mesa de feltro vinho, cartas que viram, fichas e ouro. Use quando pedirem vídeo animado "mesa de jogo", "cartas", "baralho" ou o tema for probabilidade, conta, mistério ou "parece mentira".
---

# Mesa de jogo: estilo de animação do EditOS

**2D.** Mesa de feltro vinho à noite, sob a luminária; tudo aparece pintado na face de cartas que viram, com fichas e ouro em folha.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** curiosidade, probabilidade, conta, mistério, revelação e "parece mentira".
- **Pedidos que chamam este estilo:** "mesa de jogo", "cartas", "baralho", ou um tema de probabilidade, conta, mistério ou "parece mentira".
- **Quando não:** Tema infantil, saúde ou fé; e nunca pra fazer propaganda de aposta. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** feltro vinho com a luz da luminária no alto, trama de pano, borda de madeira escura e poeira dourada flutuando. Não muda.
- **Cores:** vinho, creme de papel, a tinta do baralho (vermelho e preto), petróleo no verso das cartas, ouro em folha (`COR`). Água em azul claro, folha em verde fechado.
- **Forma:** chapada, sem contorno de mão, como o naipe impresso numa carta. Os desenhos usam os próprios naipes: o sol tem raios de ouros, a chuva são copas de ponta-cabeça, a folha é uma espada.
- **Letra:** Anton em ouro em folha nos títulos (com brilho que passa), Playfair itálico em creme nos rótulos, Archivo 800 na legenda.
- **Movimento:** carta cai e bate na mesa com mola, vira em 3D levantando do feltro, acende em ouro; ficha bate e quica; a câmera respira e empurra devagar.
- **Transição:** o rodo do crupiê entra pela direita e varre a cena pra fora da mesa (`Rodo`).
- **Legenda:** Archivo 800, creme, palavra dita em ouro, a 71% da altura, com sombra escura.

**Por quê:** Carta virando é revelação: cada fato chega como uma surpresa. Fichas e cartas fazem número e chance virar coisa que dá pra contar.

## As peças
Em `sistema/animacoes/src/estilos/mesa-de-jogo/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/mesa-de-jogo'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Carta` | a peça principal: carta que vira (`vira`), levanta (`alt`) e acende (`brilho`); a face é um SVG de 200 x 280 onde vai o desenho |
| `Naipe` | copas, espadas, ouros ou paus, em qualquer cor: o tijolo de todo desenho |
| `Ficha`, `Pilha` | ficha de pôquer que bate (com número curto dentro) e pilha de cenário |
| `Ouro` | texto de título em ouro em folha que bate na mesa |
| `Rotulo` | texto de apoio em creme itálico |
| `Estouro` | faíscas de ouro na hora da revelação |
| `Rodo` | a transição: envolve a cena e varre tudo pra fora |
| `bate` | a mola de quem cai na mesa (use pra escala e pra `alt`) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense no objeto como a figura impressa numa carta: duas ou três formas chapadas, na tinta do baralho, de preferência
montadas com naipes (`Naipe`) e círculos. Desenhe dentro da face da `Carta` (coordenadas de 200 x 280) e revele
virando a carta na palavra que fala dele. Quantidade se mostra com fichas ou com uma fileira de cartas.

**Exemplo trabalhado:** "A chance de ganhar na Mega-Sena": uma fileira de cartas que vai sumindo pra mostrar o tamanho da chance, uma ficha dourada solitária em cima da mesa, e a carta final que vira mostrando o número conferido da chance (com fonte).

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo mesa-de-jogo`, em `animacoes/estilos/fotos/mesa-de-jogo-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo mesa-de-jogo` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Desenho com contorno e sombreado: aqui é tinta chapada de baralho.
- Carta pequena demais: a principal tem pelo menos 260 de largura, senão o desenho da face some.
- Mesa cheia: no máximo três cartas em destaque e duas pilhas de cenário.
- Texto abaixo de 56 de tamanho.
- Carta de marca ou figura de baralho de terceiros (valete, rei desenhados): use só canto e naipe.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
