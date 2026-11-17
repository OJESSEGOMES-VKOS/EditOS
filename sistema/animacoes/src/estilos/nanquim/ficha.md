# Rabisco de nanquim

**Tipo:** 2D
**Cara:** Papel creme com fibra; tudo é pincelado em tinta preta, com aguada cinza, hachura de pena e um carimbo vermelho.
**Bom pra:** história contada, reflexão, curiosidade, explicação com personagem simples.

## Como é

- **Fundo:** papel creme com fibra comprida e os cantos escurecidos. Não muda de cor.
- **Cores:** tinta preta quase sempre. Aguada cinza ou azul bem clara pra preencher, vermelho só pra um ponto de destaque (sol, carimbo, palavra dita). Nada de cor viva chapada.
- **Traço:** pincelada de cerdas (`Pincel`): grossa no meio, fina nas pontas, com as cerdas de fora secando antes do fim. Sempre se desenha, nunca aparece pronta.
- **Cor por dentro:** aguada (`Aguada`), mancha de tinta diluída com borda mais escura, ou hachura de pena (`Hachura`) pra sombra.
- **Gente:** personagem-palito (`Palito`), cabeça redonda e corpo em quatro pinceladas, com braços e passo animáveis.
- **Letra:** Shippori Mincho, que chega borrada e assenta como tinta secando.
- **Movimento:** desenha, espera um instante e ganha vida (balança, sobe, chove). Câmera parada.
- **Transição:** uma folha nova de papel passa por cima, com borda de pincel (`FolhaNova`), no fim da cena.
- **Legenda:** Shippori Mincho 800 em tinta preta com halo de papel, palavra dita em vermelho, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Tinta` | a camada que dá a borda de tinta bebendo no papel; todo desenho vai dentro dela |
| `Pincel` | uma pincelada de cerdas que se desenha por uma lista de pontos |
| `Aguada` | mancha de tinta diluída que cresce, pra pintar por dentro |
| `Hachura` | riscos de pena dentro de uma forma (sombra); precisa de `id` único |
| `Respingo` | pingos de tinta, pra dar batida ou fechar um desenho |
| `Palito` | personagem-palito com braços (`bracos`) e passo (`passo`) |
| `Escrito` | texto que chega borrado e assenta |
| `Selo` | carimbo vermelho com uma ou duas letras, pra assinar um título |
| `FolhaNova` | a transição: folha nova passando por cima |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## Pra desenhar coisa nova

Pense como quem pinta com um pincel só: poucos gestos largos. O contorno sai em uma ou duas `Pincel`, a cor entra
em `Aguada` por baixo, e a sombra (se precisar) em `Hachura`. Casa é um quadrado e um telhado de duas pinceladas;
árvore é um caule e três pinceladas de folha. Pessoa é sempre o `Palito`.

## Evite

- Muito detalhe: cinco ou seis pinceladas por objeto bastam. O vazio do papel faz parte da cara.
- Cor chapada ou forte: o vermelho aparece uma vez por cena, no máximo.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Encher a folha: cada cena recebe uma folha nova.
