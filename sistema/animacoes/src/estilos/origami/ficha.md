# Origami

**Tipo:** 2D
**Cara:** Mesa de papel creme com vincos; cada coisa é montada com triângulos de papel colorido que se dobram na frente de quem assiste.
**Bom pra:** explicação leve, conteúdo infantil, curiosidade, passo a passo com cara de feito à mão.

## Como é

- **Fundo:** papel creme com fibra e os vincos de uma folha já dobrada (as duas diagonais e as duas medianas). Não muda de cor.
- **Cores:** papel chapado, cada cor com face clara e face na sombra (`COR`): amarelo, laranja, azul, celeste, verde, branco, terra e vermelho. Nada de gradiente nem de contorno preto.
- **Forma:** tudo é triângulo. Objeto é um punhado de triângulos grandes, alternando face clara e escura pra dar o vinco.
- **Movimento:** cada triângulo se dobra sobre uma aresta (mostra o verso branco no meio da dobra e assenta colorido), um depois do outro. Depois de montado, flutua de leve (`balanca`).
- **Letra:** Fraunces 800, em etiquetas de papel que se desdobram.
- **Transição:** uma folha creme entra dobrando pela diagonal e cobre a mesa (`Folha`), no fim da cena.
- **Legenda:** Fraunces 800, tinta marrom-escura com halo de papel, palavra dita em laranja queimado, a 80% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `tri`, `mover`, `leque` | montam a lista de triângulos (`Tri[]`) de um objeto |
| `Dobras` | dobra os triângulos um a um (`p`), desmonta (`desfaz`) e flutua (`balanca`) |
| `Etiqueta` | texto numa tira de papel que se desdobra |
| `Folha` | a transição: uma folha dobra por cima e limpa a mesa |
| `sol`, `nuvem`, `gota`, `mar`, `planta`, `Chuva` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Pense como quem dobra papel: o objeto em 3 a 10 triângulos grandes. Desenhe em volta de (0,0), em unidades de uma
tela de 1080, e passe por `mover(tris, x, y, u)`. Casa é um quadrado (2 triângulos) e um telhado (2 triângulos);
redondo é um `leque`. Alterne `sombra` pra o vinco aparecer.

## Evite

- Triângulo pequeno demais: abaixo de uns 30 de lado ele some na dobra.
- Curva, círculo liso ou contorno: quebra a cara de papel.
- Mais de uns 40 triângulos montando ao mesmo tempo: vira confusão.
- Texto solto sem etiqueta, e nada abaixo de 56 de tamanho.
