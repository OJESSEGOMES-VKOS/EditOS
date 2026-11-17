# cena16: Stat Chart (Número com gráfico)

- **Tipo:** 2D
- **A cena que ele resolve:** resultado financeiro ou de dado: o número sobe com a linha e o momento da virada.
- **Quando a fala pede:** número dito + "cresceu", "caiu", "depois de X".
- **Completa estes modelos:** documental-dados, prova-print, especialista, minidocumentario.
- **Material e prova:** PROVA: número exatamente como dito; série real com fonte, ou só o número dito.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O gráfico de documentário de negócios: fundo de terminal, um número enorme, uma linha, e um único momento que mudou
tudo. O número **é** a linha: ele mostra o valor que está embaixo da ponta, então conta junto com ela.

- **Paleta:** quase preto `#0A0B0D`, grade branca a ~7%; branco `#F4F5F6` no número e nos títulos, cinza `#8B9098`
  nos rótulos, cinza escuro `#4A4F57` na fonte. Linha branca suave `#E9EBEE` antes do evento e laranja `#FF5B1F`
  depois. O laranja é a única cor, e só existe a partir do evento.
- **Letra:** Inter Tight 800 no número herói (enorme, apertado, dígitos de largura fixa; prefixo pequeno e alto,
  unidade a 2/3). Rótulo e chamada em Inter Tight 500/600, frase comum. Tudo que é dado (datas, eixo, cabeçalho,
  fonte) em IBM Plex Mono, caixa alta, um pouco espaçado.
- **Layout:** cabeçalho fino com fio embaixo; rótulo de uma linha; o número ocupando a metade de cima; chip laranja
  do delta e a data viva na mesma linha; o gráfico na metade de baixo, com anos na base, valores à direita, faixa
  hachurada nos meses sem dado e uma chamada com linha-guia no evento. Fonte no rodapé.
- **Textura:** nenhuma. Preto chapado, linhas finas, um véu branco sob a linha que some para baixo.
- **Os movimentos (o vocabulário):**
  - **a linha que puxa o número:** desenha da esquerda para a direita já no quadro 0, com o ponto na frente, o véu
    logo atrás e um cursor tracejado; o número segue o valor da ponta (anda devagar no plano, dispara na subida,
    freia no final). Nada de dígito rolando ou pulando: é dado, não caça-níquel.
  - **a virada:** no índice do evento o ponto incha, fica laranja, a linha engrossa e vira laranja, um anel marca o
    ponto, a linha-guia sobe e a chamada sobe em três linhas, uma depois da outra.
  - **o pouso:** quando a conta chega ao valor final, o chip do delta salta com passada pequena; um anel pinga na ponta
    e a etiqueta do valor sai do eixo. Depois, mais de um segundo parado.
- **Ritmo:** a linha leva ~3,4 s, com freio antes do evento e aceleração depois; o resto da cena é segurar.

## Como variar (o jeito, não a demo)

- **Tudo nasce da fala e da fonte real.** O número final é exatamente o dito (G10); a série é a real, com fonte no
  rodapé, ou o estilo não entra (só o número dito vai para outra resposta). O evento é o que a fala diz que mudou o
  jogo ("depois que eu abri a loja online"), com a data real.
- **Quantas batidas:** a curva da linha vem da série, não da demo. Série de 12 meses ou de 10 anos funciona (o eixo
  se ajusta; `mesesEixo` é o tamanho da série se não disser). Sem evento dito: ponha o evento no ponto que a fala
  aponta como virada ou tire a chamada (`eventoLinha` vazio, título curto).
- **Que movimento cai em que palavra:** a linha começa no começo da frase; a virada cai na palavra do acontecimento;
  o pouso do número cai no número dito (ajuste `fimLinha`). Queda é a mesma linguagem com o chip ▼ (`queda`).
- **Frase curta (2 a 3 s):** reduza `fimLinha` e corte o cabeçalho; **longa:** a linha anda devagar e a chamada fica
  mais tempo.
- **Formatos:** em 9:16 o número fica em cima e o gráfico ganha altura, com a legenda da casa abaixo do rodapé; em
  16:9 o número vai para a esquerda e o gráfico para a direita (recomponha o palco).

## Nunca

- Contador que rola, treme de largura ou passa do número real.
- Arco-íris de séries, degradê na linha, brilho atrás dela; laranja antes do evento.
- Empresa, logotipo ou número real sem fonte; série inventada num vídeo de verdade.
- Reusar os textos e a série da demo ("VERANA PAY", "Cartão Verana chega", "321%") nem a mesma curva com outro rótulo.
