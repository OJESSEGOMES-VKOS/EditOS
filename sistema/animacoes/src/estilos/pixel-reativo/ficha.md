# Pixel reativo

**Tipo:** 2D
**Cara:** Fliperama de 16 bits à noite: sprites de quadradinhos que pulam a cada palavra dita, como se a fala fosse a batida do jogo.
**Bom pra:** curiosidade rápida, tecnologia, lista e passo a passo com energia, público jovem.

## Como é

- **Fundo:** céu violeta-noite em seis faixas de degrau, com xadrez entre elas, estrelas de um pixel que piscam e a moldura de gabinete (preto grosso com filete amarelo). Não muda de cor.
- **Cores:** só a paleta fechada `COR`: amarelo, laranja, vermelho, azuis do mar, ciano do vapor, verdes, terra e cinzas. Cor fora dela quebra a cara.
- **Forma:** sprites escritos como linhas de letras (`SPRITES`), cada letra uma cor. Nada de curva lisa: tudo cai na grade do pixel (12 numa tela de 1080).
- **A reação à fala (a marca do estilo):** `pulso(fala, tv)` vale 1 quando uma palavra começa e cai rápido. Os sprites pulam nessa batida, a crista do mar salta, o chão treme e sai faísca. Com `atraso`, um sprite pula logo depois do outro e a cena ganha ritmo de jogo.
- **Movimento:** aos degraus de pixel. Coisa que cresce cresce em escala inteira ou bloco a bloco.
- **Letra:** Press Start 2P no rótulo da caixa (FASE 1), Jersey 10 (pixel encorpado, lê bem no celular) no texto da caixa e na legenda (a Press Start não tem acento).
- **Transição:** a varredura, faixas pretas que entram alternando os lados e fecham a tela no fim da cena, e abrem no começo da próxima.
- **Legenda:** Jersey 10, branca com contorno preto duro e degrau embaixo, palavra dita em amarelo, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `pulso`, `batidas` | a batida da fala: pulso de 0 a 1 em cada palavra, e quantas palavras já foram ditas |
| `Sprite`, `medida` | desenha um sprite de letras na grade; `troca` recolore, `virar` espelha |
| `Faisca` | quatro pixels que saltam na batida |
| `Caixa` | caixa de texto do jogo que se digita (HTML, fora da `Tela`) |
| `Varredura` | a transição em faixas |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Chao`, `Planta` | desenhos prontos, molde dos novos |

## Pra desenhar coisa nova

Escreva o objeto como um sprite de 8 a 12 colunas: cada linha uma string, cada letra uma cor de `COR`, ponto pra
vazio. Uma cor de corpo, uma de sombra e uma de brilho bastam. Ligue o objeto principal ao `pulso` pra ele pular na
fala, e os secundários ao `pulso` com `atraso`.

## Evite

- Sprite grande demais com detalhe: 12 colunas já é muito. Aumente com `e`, não com mais linhas.
- Pulo em tudo ao mesmo tempo: o principal pula forte, o resto pouco ou com atraso.
- Texto na tela fora da `Caixa`, ou abaixo de 56 de tamanho.
- Cor nova, degradê ou borda suave: quebram o pixel.
