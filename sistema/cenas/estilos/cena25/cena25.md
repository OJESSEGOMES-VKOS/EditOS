# cena25: Ranking bars (Corrida de barras)

- **Tipo:** 2D
- **A cena que ele resolve:** ranking que muda no tempo, quem passou quem.
- **Quando a fala pede:** "ficou em primeiro", "top 10", "ultrapassou".
- **Completa estes modelos:** documental-dados, minidocumentario, especialista.
- **Material e prova:** PROVA: dados reais com fonte.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um gráfico de corrida limpo, de jornal de dados: uma tabela de números vira uma história de quem passou quem, e
dá para entender sem ler número nenhum.

- **Fundo:** branco que desce para um cinza frio quase invisível (`#FFFFFF` a `#F4F6F9`), com grão fino. Papel de
  relatório, sem enfeite.
- **Uma cor só grita:** a barra herói em laranja-vermelho `#FF5A36`. As outras são tons calmos e apagados (azul
  ardósia `#7F93B5`, sálvia `#9DB89E`, verde-água `#84B5B1`, cinza `#A7AFBC`, rosa seco `#D3A8AE`). Se todas
  brilharem, ninguém sabe para onde olhar.
- **Letras:** Inter Tight do começo ao fim. Título 700 em uma ou duas linhas no alto à esquerda, subtítulo cinza
  `#7B8491` embaixo. Nomes à esquerda das barras (o herói em 800 e mais escuro). Valor logo depois da ponta da
  barra, com números de mesma largura (o do herói em laranja).
- **Layout:** barras horizontais empilhadas com o mesmo respiro, base reta e ponta arredondada, grade clarinha
  `#E6E9EE` com números discretos em cima. O passo do tempo (o ano) mora gigante e quase apagado `#DADFE6` embaixo à
  direita; a frase que narra mora embaixo à esquerda, alinhada com ele.

**Os movimentos (o vocabulário):**
- **Abre parado:** o primeiro quadro já é o gráfico do primeiro passo, legível num olhar.
- **O passo:** a cada ~2/3 de segundo os valores andam juntos para o próximo passo, saída rápida e pouso macio, e os
  números contam junto. Nunca andam em velocidade constante.
- **O dígito que rola:** no rótulo gigante só o caractere que muda sobe por uma máscara e o novo entra com um
  pequeno passo além.
- **A ultrapassagem:** no instante em que duas barras se cruzam elas trocam de lugar com mola. Quem passa sobe com
  uma sombra suave; quem é passado esmaece um instante.
- **A frase que narra:** embaixo, a frase rola para nomear o que acabou de acontecer ("X passa Y").
- **A coroa:** quando o herói chega ao topo, um chip branco salta na barra e ela incha um pouco. É o golpe da cena.
- **A pausa:** depois da coroa, a frase final e tudo parado.

## Como variar (o jeito, não a demo)

- **O número de passos é o da fala.** "Em três anos" são três passos; "de janeiro a junho" são seis meses. Os passos
  podem ser anos, meses, rodadas ou temporadas (`anos` aceita texto). Duas ou três ultrapassagens bastam; corrida sem
  virada não precisa desse estilo.
- **Barras:** quantas a fala cita, de 3 a 8. Cinco nomes ditos são cinco barras, não seis por hábito.
- **Unidade como foi dita:** `unidade` e `prefixo` ("R$ ", " mil", "%"); a grade se calcula do maior valor.
- **As frases que narram** saem da fala: o verbo da ultrapassagem (`palavraPassa`), a da liderança e a final são as
  palavras ditas ("dispara", "vira o jogo"). O chip da coroa só entra se a fala diz a posição.
- **Herói é quem a história segue.** Se a fala fala de quem caiu, o herói é quem caiu (a coroa vira o ponto mais
  baixo, recomponha a legenda).
- **Frase curta:** dois passos e uma troca, 2 a 3 s. **Frase longa:** mais passos, com o mesmo `passoQuadros`; nunca
  passo mais lento para encher.
- **Formatos:** palco 4:5 que escala para 9:16 (sobra em cima e embaixo para a legenda da casa) e 16:9 (cabe pela
  altura; com muitas barras, menos barras). Números sempre os reais, com fonte.

## Nunca

- Barra que teletransporta, anda arrastada ou atravessa a outra com os nomes empilhados.
- Mais de uma cor forte, brilho, barra 3D, contorno ou sombra parada.
- Empresa, logo ou número que pareça real sem ser real.
- Reaproveitar os canais, os anos, os números ou as frases da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida (seis barras, seis anos, herói do 5º ao 1º) quando a fala conta outra
  corrida.
