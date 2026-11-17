---
name: anim-gravura
description: Estilo de animação Gravura do EditOS: prancha de livro antigo, feita de linhas paralelas de buril. Use quando pedirem vídeo animado "gravura", "enciclopédia antiga", "livro antigo" ou o tema for história, ciência ou "como era antigamente".
---

# Gravura: estilo de animação do EditOS

**2D.** Prancha de livro ilustrado antigo: a cena é uma chapa de talho-doce impressa em papel envelhecido, feita só de linhas paralelas de buril que engrossam no escuro.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história, ciência e natureza com cara de enciclopédia antiga, curiosidade, "como era antigamente".
- **Pedidos que chamam este estilo:** "gravura", "enciclopédia antiga", "livro antigo", ou um tema de história, ciência ou "como era antigamente".
- **Quando não:** Tema moderno de tecnologia, dica rápida ou conteúdo infantil e colorido. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** papel creme envelhecido com manchas e grão. A cena fica numa chapa com a marca da prensa e moldura dupla, sempre acima da legenda.
- **Cores:** uma tinta só, sépia quase preta (`COR.tinta`), sobre o papel. O único toque de cor é o destaque da legenda, ferrugem.
- **Traço:** não existe contorno nem cor chapada. A imagem é um campo de claro e escuro que a `Chapa` grava em três passadas: linhas horizontais que engrossam e se desviam na sombra, hachura a 50° nas sombras e uma terceira passada nas sombras fundas.
- **Movimento:** dentro da chapa as coisas andam devagar (onda, vapor, chuva, planta crescendo) e as linhas acompanham.
- **Letra:** IM Fell English, a letra dos livros antigos: o título da prancha em itálico entre filetes, com o rótulo em versalete ("prancha i").
- **Transição:** o buril passa na diagonal, com um risco de luz, e grava a chapa nova por cima da velha (`Chapa` com `de`). A primeira chapa se imprime de cima pra baixo.
- **Legenda:** IM Fell English, tinta sépia com halo de papel, palavra dita em ferrugem, a 73% da altura.

**Por quê:** A hachura de buril dá cara de documento e de saber antigo: o assunto ganha peso de enciclopédia. Luz e sombra fazem o volume, então a forma fica forte mesmo sem cor.

## As peças
Em `sistema/animacoes/src/estilos/gravura/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/gravura'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `campo`, `Camada` | montam a luz da cena: um fundo e camadas que se tampam |
| `elipse`, `faixa`, `poligono` | as formas que dizem onde cada camada cobre |
| `Chapa` | grava o campo em linhas de buril, com moldura; com `de`, faz a transição |
| `Rotulo` | o título da prancha, acima da chapa |
| `ceu`, `sol`, `nuvem`, `chuva`, `mar`, `planta` | desenhos prontos (camadas), molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em luz e sombra, não em linha. Cada objeto é uma ou mais camadas: onde ele está (`elipse`, `faixa`, `poligono`)
e quão claro ele é ali (1 = papel limpo, 0 = sombra funda). Dê volume clareando o lado da luz e escurecendo a barriga
(veja a `nuvem`). Objeto escuro contra fundo claro lê melhor que cinza contra cinza.

**Exemplo trabalhado:** "Como funcionava o farol de Alexandria": a torre como camadas de luz e sombra na hachura, o fogo no topo como área de papel limpo, os navios escuros no mar de linhas, e a luz como faixas claras que varrem a água.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo gravura`, em `animacoes/estilos/fotos/gravura-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo gravura` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Detalhe menor que umas três linhas de buril (uns 25 de tamanho): some na trama.
- Campo todo no mesmo cinza: a gravura vive do contraste.
- Cor, contorno ou texto dentro da chapa.
- Chapa na faixa da legenda (de 62% pra baixo, no vertical).
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
