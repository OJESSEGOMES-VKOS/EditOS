# Teatrinho de papel

**Tipo:** 3D leve
**Cara:** Um palco de brinquedo com cortina vermelha, onde tudo é recorte de cartolina em vareta, em camadas.
**Bom pra:** história contada pra criança, fábula, explicação com começo, meio e fim, curiosidade leve.

## Como é

- **Fundo:** plateia escura e quente, com as cabeças do público em sombra lá embaixo. O palco ocupa a parte de cima.
- **Palco:** moldura de madeira com filete dourado, bandô vermelho com franja, ribalta com lâmpadas que tremem.
- **Cenário:** céu pintado no fundo e recortes em camadas a distâncias diferentes; o palco vira um pouco, e as camadas
  andam uma contra a outra (é isso que dá a profundidade).
- **Cores:** cartolina viva e chapada (`COR`): amarelo, laranja, vermelho, azuis, verdes, branco. Todo recorte ganha
  borda branca de papel, grão e sombra no cenário de trás.
- **Letra:** Rye no cartaz (letra de cartaz de circo antigo), Alfa Slab One na legenda.
- **Movimento:** as coisas entram como num teatrinho de verdade: sobem do chão na vareta, entram de lado, caem do
  alto pendurado em fio. Depois balançam, giram ou boiam.
- **Transição:** a cortina abre no começo da cena e fecha no fim (`cortinaDe`).
- **Legenda:** Alfa Slab One, creme, palavra dita em amarelo, a 72% da altura, abaixo do palco.

## As peças

| Peça | O que faz |
|---|---|
| `Palco` | a boca de cena: recebe as camadas e desenha moldura, ribalta e cortina |
| `Camada` | uma camada do cenário numa distância (`z` negativo vai pro fundo) |
| `Ceu` | o céu pintado do fundo, sempre a primeira camada |
| `Recorte` | qualquer forma vira cartolina com borda branca e sombra; `vareta` põe a haste |
| `Cartaz` | o texto: placa que desce do alto em dois fios e balança |
| `cortinaDe` | a transição: quanto a cortina está fechada naquele segundo |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Pense como quem recorta cartolina com tesoura: um contorno simples, uma ou duas cores por cima, e pronto. Ponha as
formas dentro de um `Recorte` (ele dá a borda e a sombra) e escolha a entrada: subir na vareta, entrar de lado ou
cair do alto. Coisa do fundo vai numa `Camada` de `z` negativo; o que é o assunto da cena fica na camada da frente.

## Evite

- Degradê e detalhe fino dentro do recorte: papel é chapado.
- Mais de três camadas além do céu: o palco fica bagunçado.
- Pôr assunto fora da boca de cena: o que fica fora da moldura não aparece.
- Texto solto sem cartaz: no teatrinho, texto é placa pendurada.
