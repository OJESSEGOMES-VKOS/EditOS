# Neon

**Tipo:** 2D
**Cara:** Parede de tijolo escura à noite onde cada desenho é um letreiro de tubo de neon que acende piscando.
**Bom pra:** vídeo noturno, música, bar e comida, lista de destaque, assunto com clima de cidade e de festa.

## Como é

- **Fundo:** tijolo quase preto com vinheta escura nas bordas. Não muda.
- **Cores:** só as dos tubos (`COR`): rosa, ciano, azul, amarelo, laranja, verde, lilás e branco. Sempre claras e saturadas; a cor escura é só a parede.
- **Traço:** tubo grosso de ponta redonda em quatro camadas: halo largo borrado, brilho, o tubo e um fio branco quente no meio. Nunca forma cheia: neon é linha.
- **Movimento:** o tubo se estende e acende piscando como lâmpada velha (`acende`), depois fica zumbindo de leve. Coisa viva mexe devagar (raio gira, onda corre, chuva cai).
- **Letra:** Tilt Neon, branca com halo da cor do letreiro.
- **Transição:** o apagão, a parede escurece aos trancos no fim da cena.
- **Legenda:** Tilt Neon branca com halo rosa, palavra dita em rosa claro, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Tubo` | um caminho SVG vira tubo de neon; `p` estende, `luz` acende |
| `tubo` | atalho: lista de pontos vira o caminho de um tubo |
| `acende` | o piscar de lâmpada ligando, a partir de um segundo |
| `Letreiro` | texto em neon que acende piscando |
| `Apagao` | a transição: escurece aos trancos |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Pense como quem dobra um tubo de vidro: o contorno do objeto em uma ou duas linhas contínuas, cada parte de uma cor.
Use `circulo()` com `tubo(..., true)` pra redondo e caminho SVG com `q` pra curva. Cada parte acende um pouco depois
da outra (`ini` crescendo), que é o que dá o charme.

## Evite

- Muito tubo junto: mais de 5 ou 6 na tela vira borrão de luz.
- Tubo encostado em tubo: deixe espaço escuro entre as linhas.
- Preencher forma com cor: neon é só contorno.
- Texto comprido no letreiro: até 4 palavras, nunca abaixo de 56.
