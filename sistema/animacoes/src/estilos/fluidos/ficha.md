# Fumaça e água

**Tipo:** 2D
**Cara:** Tudo é fluido e macio, sem contorno: fumaça que sobe enrolando, fogo que respira, água em faixas de luz.
**Bom pra:** natureza, clima, física, química, tema calmo e contemplativo.

## Como é

- **Fundo:** névoa escura azulada que se mexe devagar, com vinheta nas bordas.
- **Cores:** tons de fumaça e de natureza (`COR`): névoa, fogo e brasa, água e fundo d'água, céu, nuvem, verde e terra.
  O claro é sempre luz dentro da névoa, nunca cor chapada.
- **Traço:** não tem. As formas são manchas de densidade com borda de fumaça (o `fumo`), pintadas numa grade baixa
  que o navegador amacia.
- **Letra:** Cormorant Garamond 700 (serifada clássica), clara, subindo da névoa com desfoque (`Letreiro`).
- **Movimento:** tudo corre o tempo todo: a fumaça enrola, o fogo lambe, a água ondula. Coisa nova surge acendendo
  (`forca` de 0 a 1), nunca entra deslizando.
- **Transição:** a cena se desmancha em névoa (`apaga`) enquanto a próxima nasce por cima (fusão de 0,6 s).
- **Legenda:** Cormorant Garamond 700, creme, palavra dita em âmbar, a 74% da altura, com sombra larga escura.

## As peças

| Peça | O que faz |
|---|---|
| `Fluido` | a tela de fumaça: pinta uma lista de camadas, ponto a ponto; `apaga` devolve tudo à névoa |
| `Camada` | o formato de toda camada: recebe a cor do ponto e devolve a nova |
| `fumo` | o ruído que enrola e anda; use em toda borda |
| `nevoa`, `ceu`, `Chao`, `Vapor` | camadas de base |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |
| `Letreiro` | o texto do estilo |

## Pra desenhar coisa nova

Uma coisa nova é uma camada: calcule a distância do ponto até a forma (círculo, oval, faixa), some um pouco de
`fumo` nessa distância pra a borda virar fumaça, e misture a cor com a densidade (`mistura`). Posição em fração da
tela (x e y de 0 a 1). Coisa sólida que precisa ser reconhecida (pessoa, bicho) entra como silhueta escura chapada
em SVG por cima do fluido.

## Evite

- Forma de quina e detalhe fino: a grade é baixa de propósito, o miúdo some.
- Muitas camadas numa cena (mais de 6 pesa o render).
- Cor saturada chapada: o estilo é luz e névoa.
- Texto pequeno: nada abaixo de 56.
