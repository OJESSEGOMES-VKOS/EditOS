# Máquina

**Tipo:** 2D
**Cara:** Vídeo montado por uma lista: em cada cena um desenho em traço de ouro se desenha sozinho no alto e a frase dita fica escrita embaixo em serifada itálica creme, sobre gravura escura com poeira dourada subindo.
**Bom pra:** citação, texto que é a peça (regra, lista de passos, conselho), série de vídeos iguais em formato, vídeo rápido de fazer com cara solene.

## Como é

- **Fundo:** gravura escura (marrom quase preto em degradê radial), linhas finas de buril em diagonal a 7%, poeira de ouro subindo devagar e o canto fechado em sombra. Não muda.
- **Cores:** ouro (`#e8c170`) no desenho e nos títulos, creme na frase. Nenhuma outra.
- **Desenho:** traço de ouro de grossura única com brilho, de placa de museu: contorno e um ou dois detalhes, numa caixa de 1000 x 1000. Os traços se desenham em sequência (um a cada 0,23 s) e o desenho cresce de leve enquanto a cena dura.
- **Letra:** Cinzel 700 no título, nos rótulos e no fecho; Cormorant Garamond itálico 600 na frase.
- **Montagem:** em pé, desenho em cima e frase embaixo; deitado, desenho à esquerda e frase à direita (`useCaixas`).
- **Abertura:** o título e o subtítulo já escritos no quadro 0, com o primeiro desenho apagado atrás. **Fecho:** um símbolo que se desenha no centro e uma linha curta.
- **Transição:** a cena apaga nos últimos 0,4 s e a próxima se desenha do zero.
- **Legenda:** **desligada**: a frase dita já está escrita na cena (a `Maquina` monta assim).

## As peças

| Peça | O que faz |
|---|---|
| `Maquina` | o vídeo inteiro a partir de dados: `fala`, `titulo`, `subtitulo`, `cenas` ({frases, desenho, rotulo}) e `fecho` |
| `DESENHOS` | a biblioteca de traços genéricos (luz, sol, mar, nuvem, chuva, planta, montanha, casa, estrelas, pessoa, livro, relógio, lâmpada, coração, seta, ciclo) |
| `Ouro` | desenha uma lista de traços em sequência |
| `Desenho`, `Texto`, `Abertura`, `Fecho` | as partes de cada cena, se quiser montar à mão |
| `raios`, `ondas`, `estrela`, `circ` | ajudantes pra escrever traços novos na caixa de 1000 x 1000 |
| `useCaixas` | onde mora o desenho e o texto em cada formato |

## Pra desenhar coisa nova

O vídeo é dado, não cena: escreva a fala (a frase 0 é o título), monte a lista de cenas (quais frases cada uma cobre
e qual desenho) e passe pra `Maquina`. Desenho que falta é uma entrada nova num objeto `desenhos` no próprio
`video.tsx`: uma lista de strings de `<path>` na caixa de 1000 x 1000, cada string um gesto que se desenha. Pense
em placa de museu: uma bicicleta são dois `circ` e três retas; um carro, uma caixa com dois `circ`. Até 6 traços
por desenho. Fala longa (mais de 18 palavras) vira duas cenas.

## Evite

- Desenho com mais de 6 traços ou com preenchimento: aqui é linha de ouro.
- Ligar a legenda: a frase já está escrita.
- Cena sem desenho que diga a frase: se não existe, desenhe; `luz` é só o último recurso.
- Frase com mais de 18 palavras numa cena só.
