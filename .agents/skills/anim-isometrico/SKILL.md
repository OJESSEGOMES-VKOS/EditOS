---
name: anim-isometrico
description: Estilo de animação Maquete isométrica do EditOS: maquete de blocos em isométrico, montada cubo a cubo no céu. Use quando pedirem vídeo animado "isométrico", "maquete de blocos", "estilo SimCity" ou o tema for processo por etapas, sistema ou cidade.
---

# Maquete isométrica: estilo de animação do EditOS

**3D leve.** Uma maquete de blocos flutuando no céu claro, vista em isométrico, que se monta cubo a cubo e balança em perspectiva.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** "como funciona", processo por etapas, sistema, cidade, natureza, produto montado por partes.
- **Pedidos que chamam este estilo:** "isométrico", "maquete de blocos", "estilo SimCity", ou um tema de processo por etapas, sistema ou cidade.
- **Quando não:** Rosto, emoção, história íntima ou assunto sem partes físicas. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** céu claro em degradê (azul bem claro em cima, creme embaixo) com a sombra da maquete no chão. Não muda.
- **Cores:** as de `COR`, alegres e um pouco suaves: água, grama, terra, folha, sol, laranja, nuvem. O estilo escurece os lados de cada cubo sozinho (topo claro, lado esquerdo médio, lado direito escuro).
- **Forma:** tudo é bloco (`Bloco`) numa grade isométrica. Nada de curva: arredondado se faz com bloco menor.
- **Profundidade (3D edição):** a `Maquete` fica num palco em perspectiva (`Palco3D`) que respira, inclina e balança devagar. Sem Blender: roda em qualquer lugar.
- **Letra:** Nunito 900, arredondada, em letreiro que cai do alto e quica palavra por palavra.
- **Movimento:** cada bloco cai do alto e assenta com quique no seu segundo (`em`), em fila. Depois a maquete vive: a água ondula, a nuvem deriva, a chuva cai, a árvore cresce.
- **Transição:** a cortina de losangos isométricos que vira em diagonal e cobre a tela (`Losangos`), no fim da cena. Troque a cor a cada cena.
- **Legenda:** Nunito 900 azul-tinta com halo creme, palavra dita em laranja, a 72% da altura.

**Por quê:** A visão isométrica mostra o sistema inteiro de uma vez, como um mapa que dá pra entender. Montar cubo a cubo deixa claro o que vem antes e o que vem depois.

## As peças
Em `sistema/animacoes/src/estilos/isometrico/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/isometrico'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Bloco` | um cubo da maquete: posição e tamanho na grade, cor e o segundo em que cai (`em`) e some (`some`) |
| `Maquete` | desenha os blocos na ordem certa, com a queda e o palco que balança |
| `iso` | a conta que leva um ponto da grade pra tela, pra desenhar qualquer extra |
| `Letreiro` | texto grande que cai e quica |
| `Losangos` | a transição |
| `mar`, `sol`, `nuvem`, `chuva`, `planta`, `terreno` | desenhos prontos: funções que devolvem listas de blocos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Escreva uma função que devolve `Bloco[]`, como `planta` ou `nuvem`: pense em LEGO grosso, de 3 a 10 blocos por
objeto, com um ou dois tamanhos. Junte todas as listas da cena numa só `Maquete` (ela decide quem fica na frente).
Escalone o `em` de cada bloco pra a coisa se montar na frente de quem assiste. Mantenha tudo numa grade de 8 x 8 e
no máximo uns 7 de altura, pra caber acima da legenda.

**Exemplo trabalhado:** "Como o lixo vira adubo": uma composteira de blocos marrons, cascas como cubinhos verdes caindo dentro, as camadas que mudam de cor com o tempo e uma horta de blocos que cresce do lado. Tudo numa grade de 8 x 8.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo isometrico`, em `animacoes/estilos/fotos/isometrico-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo isometrico` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Duas `Maquete` na mesma cena: uma passa por cima da outra sem respeitar a frente e o fundo.
- Bloco minúsculo demais (menor que 0,15): vira ruído.
- Mais de 6 cores na mesma cena.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
