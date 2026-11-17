# cena24: Before and after slider (Antes e depois (cortina))

- **Tipo:** 2D
- **A cena que ele resolve:** reforma, redesign, a diferença em um segundo.
- **Quando a fala pede:** "antes era", "ficou assim", "olha a diferença".
- **Completa estes modelos:** anuncio-neon, prova-print, youtube-didatico (VK: vk-antes-depois).
- **Material e prova:** as duas versões reais do dono.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma cortina vertical que mostra o antes por baixo e o depois por cima, numa vitrine limpa e clara. A graça está em a
diferença ser óbvia num segundo, sem ninguém explicar.

- **Fundo:** cinza frio bem claro, de `#EEF1F6` em cima a `#E6EAF1` embaixo, com grão quase invisível. É neutro de
  propósito: quem tem cor são as duas versões.
- **A manchete:** uma ou duas linhas curtas acima da moldura, Inter Tight 700, quase preta `#121418`, letras
  apertadas, cada linha fechando num ponto tomate `#E4572E`. O tomate é o único acento da cena.
- **A moldura:** uma janela grande e centrada com sombra macia em camadas. Navegador (barra cinza, três bolinhas,
  endereço) quando o assunto é tela; moldura simples arredondada quando é foto (reforma, produto, rosto).
- **O antes e o depois:** as duas versões ocupam o mesmo lugar, uma sobre a outra, sempre material real. O antes é
  datado, nunca ridículo. Cada versão deixa o que importa no seu próprio lado, para o 50/50 final continuar legível.
- **Os rótulos:** pílula escura ANTES à esquerda, pílula clara DEPOIS à direita, Manrope 800 em caixa alta espaçada.
- **O divisor:** linha branca de cima a baixo com uma alça redonda e duas setas.

**Os movimentos (o vocabulário):**
- **Abre no antes:** o primeiro quadro mostra a versão velha quase inteira, divisor encostado na direita. A ideia se
  entende antes de qualquer coisa mexer.
- **A varrida:** o divisor atravessa numa curva que começa e termina macia, com borrão de movimento na velocidade
  alta. É o "olha a diferença".
- **A alça achata:** a cada troca de direção a alça amassa e volta. Dá peso físico à cortina.
- **A volta com mola:** o divisor assenta no meio com um pequeno passo além. É onde as duas versões ficam lado a lado.
- **O detalhe que sobe:** ao assentar, dois ou três elementos do depois sobem uns 12 px em sequência, com um pulinho.
  Chama o olho para o ganho.
- **Aproximação lenta:** cerca de 3% de zoom por baixo de tudo, para a imagem não ficar morta.
- **A pausa final:** o último segundo é parado no lado a lado. Sem ele, ninguém compara.

## Como variar (o jeito, não a demo)

- **A frase manda no tamanho.** "Ficou assim" cabe numa varrida só (abre, varre, assenta). "Antes era assim, depois do
  primeiro mês, e hoje" pede duas ou três paradas do divisor, uma por momento dito; aí use o componente em sequência
  (um `<Cena24>` por par) ou recomponha o `pos()` com uma parada por trecho.
- **O que vai dentro é o que a fala cita.** Site, foto da cozinha, logo, gráfico, rosto antes do tratamento: sempre as
  duas versões reais do dono (`antesImagem`, `depoisImagem`). As páginas desenhadas do componente são só a demo.
- **A manchete é a fala resumida,** não um slogan: as palavras ditas ("Mesma loja. Outro caixa."). Uma linha também
  vale. Número dito ("de 2 para 40 pedidos") vai nos rótulos ou na manchete, igual ao que foi falado.
- **O que sobe no fim** é o ganho que a fala aponta (o preço, o botão, a nota): uma, duas ou três coisas, não sempre
  três cartões.
- **Frase curta:** só a varrida e a pausa, 2 a 3 s. **Frase longa:** mais paradas, nunca a varrida mais lenta.
- **Formatos:** o palco é 4:5 e escala para 9:16 (sobra cinza em cima e embaixo; a legenda da casa mora ali) e para
  16:9 (moldura mais larga, manchete à esquerda se a altura apertar). Nunca estique a imagem real.

## Nunca

- Dissolver uma versão na outra: a cortina revela, nada esmaece.
- Fazer o antes de piada, ou inventar um antes que não existiu.
- Deixar a palavra-chave de qualquer versão debaixo do divisor parado.
- Divisor em velocidade constante ou parando seco.
- Reaproveitar a padaria, o pão, os cartões de produto ou qualquer texto da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida quando a fala pede outra (uma parada, três paradas, outro ganho).
