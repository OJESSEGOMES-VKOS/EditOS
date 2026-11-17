---
name: anim-origami
description: Estilo de animação Origami do EditOS: triângulos de papel colorido que se dobram na frente de quem assiste. Use quando pedirem vídeo animado "origami", "papel dobrado" ou o tema for explicação leve, infantil ou passo a passo.
---

# Origami: estilo de animação do EditOS

**2D.** Mesa de papel creme com vincos; cada coisa é montada com triângulos de papel colorido que se dobram na frente de quem assiste.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** explicação leve, conteúdo infantil, curiosidade, passo a passo com cara de feito à mão.
- **Pedidos que chamam este estilo:** "origami", "papel dobrado", ou um tema de explicação leve, infantil ou passo a passo.
- **Quando não:** Tema sombrio, interface ou assunto sem forma física. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** papel creme com fibra e os vincos de uma folha já dobrada (as duas diagonais e as duas medianas). Não muda de cor.
- **Cores:** papel chapado, cada cor com face clara e face na sombra (`COR`): amarelo, laranja, azul, celeste, verde, branco, terra e vermelho. Nada de gradiente nem de contorno preto.
- **Forma:** tudo é triângulo. Objeto é um punhado de triângulos grandes, alternando face clara e escura pra dar o vinco.
- **Movimento:** cada triângulo se dobra sobre uma aresta (mostra o verso branco no meio da dobra e assenta colorido), um depois do outro. Depois de montado, flutua de leve (`balanca`).
- **Letra:** Fraunces 800, em etiquetas de papel que se desdobram.
- **Transição:** uma folha creme entra dobrando pela diagonal e cobre a mesa (`Folha`), no fim da cena.
- **Legenda:** Fraunces 800, tinta marrom-escura com halo de papel, palavra dita em laranja queimado, a 80% da altura.

**Por quê:** Ver a coisa se dobrar triângulo por triângulo é o próprio passo a passo. O vinco e a sombra dão volume sem complicar.

## As peças
Em `sistema/animacoes/src/estilos/origami/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/origami'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `tri`, `mover`, `leque` | montam a lista de triângulos (`Tri[]`) de um objeto |
| `Dobras` | dobra os triângulos um a um (`p`), desmonta (`desfaz`) e flutua (`balanca`) |
| `Etiqueta` | texto numa tira de papel que se desdobra |
| `Folha` | a transição: uma folha dobra por cima e limpa a mesa |
| `sol`, `nuvem`, `gota`, `mar`, `planta`, `Chuva` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como quem dobra papel: o objeto em 3 a 10 triângulos grandes. Desenhe em volta de (0,0), em unidades de uma
tela de 1080, e passe por `mover(tris, x, y, u)`. Casa é um quadrado (2 triângulos) e um telhado (2 triângulos);
redondo é um `leque`. Alterne `sombra` pra o vinco aparecer.

**Exemplo trabalhado:** "Como a borboleta sai do casulo": a lagarta como uma fileira de triângulos verdes, o casulo como um leque marrom que se fecha, e as asas que se desdobram em triângulos laranja e pretos.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo origami`, em `animacoes/estilos/fotos/origami-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo origami` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Triângulo pequeno demais: abaixo de uns 30 de lado ele some na dobra.
- Curva, círculo liso ou contorno: quebra a cara de papel.
- Mais de uns 40 triângulos montando ao mesmo tempo: vira confusão.
- Texto solto sem etiqueta, e nada abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
