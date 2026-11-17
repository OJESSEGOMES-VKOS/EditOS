# Maquete isométrica

**Tipo:** 3D leve
**Cara:** Uma maquete de blocos flutuando no céu claro, vista em isométrico, que se monta cubo a cubo e balança em perspectiva.
**Bom pra:** "como funciona", processo por etapas, sistema, cidade, natureza, produto montado por partes.

## Como é

- **Fundo:** céu claro em degradê (azul bem claro em cima, creme embaixo) com a sombra da maquete no chão. Não muda.
- **Cores:** as de `COR`, alegres e um pouco suaves: água, grama, terra, folha, sol, laranja, nuvem. O estilo escurece os lados de cada cubo sozinho (topo claro, lado esquerdo médio, lado direito escuro).
- **Forma:** tudo é bloco (`Bloco`) numa grade isométrica. Nada de curva: arredondado se faz com bloco menor.
- **Profundidade (3D edição):** a `Maquete` fica num palco em perspectiva (`Palco3D`) que respira, inclina e balança devagar. Sem Blender: roda em qualquer lugar.
- **Letra:** Nunito 900, arredondada, em letreiro que cai do alto e quica palavra por palavra.
- **Movimento:** cada bloco cai do alto e assenta com quique no seu segundo (`em`), em fila. Depois a maquete vive: a água ondula, a nuvem deriva, a chuva cai, a árvore cresce.
- **Transição:** a cortina de losangos isométricos que vira em diagonal e cobre a tela (`Losangos`), no fim da cena. Troque a cor a cada cena.
- **Legenda:** Nunito 900 azul-tinta com halo creme, palavra dita em laranja, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Bloco` | um cubo da maquete: posição e tamanho na grade, cor e o segundo em que cai (`em`) e some (`some`) |
| `Maquete` | desenha os blocos na ordem certa, com a queda e o palco que balança |
| `iso` | a conta que leva um ponto da grade pra tela, pra desenhar qualquer extra |
| `Letreiro` | texto grande que cai e quica |
| `Losangos` | a transição |
| `mar`, `sol`, `nuvem`, `chuva`, `planta`, `terreno` | desenhos prontos: funções que devolvem listas de blocos |

## Pra desenhar coisa nova

Escreva uma função que devolve `Bloco[]`, como `planta` ou `nuvem`: pense em LEGO grosso, de 3 a 10 blocos por
objeto, com um ou dois tamanhos. Junte todas as listas da cena numa só `Maquete` (ela decide quem fica na frente).
Escalone o `em` de cada bloco pra a coisa se montar na frente de quem assiste. Mantenha tudo numa grade de 8 x 8 e
no máximo uns 7 de altura, pra caber acima da legenda.

## Evite

- Duas `Maquete` na mesma cena: uma passa por cima da outra sem respeitar a frente e o fundo.
- Bloco minúsculo demais (menor que 0,15): vira ruído.
- Mais de 6 cores na mesma cena.
- Texto pequeno: nada abaixo de 56 de tamanho.
