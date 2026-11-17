# Linha do tempo

**Tipo:** 2D
**Cara:** Um fio dourado atravessa uma noite azul-marinho e a câmera viaja por ele de marco em marco; cada marco acende com um ícone em traço de ouro, um nome e um rótulo.
**Bom pra:** história em etapas, passo a passo, processo, evolução de algo, antes e depois, "em N passos".

## Como é

- **Fundo:** noite azul-marinho com um véu de luz no meio e estrelas miúdas que andam mais devagar que a câmera (parece profundidade).
- **Cores:** ouro (`COR.ouro`, com tons claro e escuro), marfim pros nomes e névoa azul. Nada de outra cor: tudo que é desenho é ouro.
- **Traço:** linha de ouro com brilho, que se desenha (`Ouro`). Ícone simples, de placa de museu: contorno e um ou dois detalhes cheios.
- **Letra:** Cinzel nos nomes e no contador (maiúscula clássica), Lora itálica nos rótulos e na legenda.
- **Movimento:** a câmera viaja pelo fio de um marco ao próximo, com um leve recuo no meio da viagem; o marco acende quando ela chega. Os ícones respiram (raio gira, chuva cai, folha balança). Os marcos que já passaram ficam apagados.
- **Transição:** a própria viagem (`Percurso` com `viagem` de 0 a 1). Toda cena desenha a linha inteira, então o corte não aparece; use fusão 0 entre as cenas.
- **Legenda:** Lora itálica 600, marfim, palavra dita em ouro, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Ouro` | traço de ouro que se desenha; `cheio` pinta por dentro |
| `MarcoDados` | o que vai num marco: `nome` (até 3 palavras), `rotulo` (curto: data, número, palavra) e `Icone` |
| `Marco` | o nó, o ícone em cima e o nome e o rótulo embaixo |
| `Percurso` | a linha inteira vista pela câmera: `de`, `para` e `viagem` fazem a transição |
| `Contador` | "PASSO 2 DE 4" no alto |
| `useMedidas` | onde ficam o fio, o ícone, o nome e o rótulo, no vertical e no deitado |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Vapor` | ícones prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Todo ícone é um `Icone`: recebe centro, tamanho, `p` e `t`, e é feito de `Ouro` (listas de pontos, `circulo()` pras
redondas, `reto` pras quinas). Pense em placa de museu: o contorno e um detalhe. Um livro é um retângulo com uma
linha no meio; um carro é uma caixa com duas rodas. Data só se for conferida; se for aproximada, escreva "c." ou a
época, nunca invente o ano.

## Evite

- Mais de 7 marcos num vídeo curto: cada um precisa de uns 2 segundos parado pra ser lido.
- Nome comprido: mais de 3 palavras não cabe; o detalhe vai na legenda.
- Rótulo repetindo a frase da legenda inteira.
- Cor fora do ouro e marfim, ou ícone cheio de detalhe.
