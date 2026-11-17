# cena36: Milestone trophy (Troféu do marco)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** marco atingido: seguidores, clientes, anos.
- **Quando a fala pede:** "chegamos a", "100 mil", "bati a meta".
- **Completa estes modelos:** prova-print, ojg, anuncio-neon.
- **Material e prova:** PROVA: número real do dono.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma placa de prata polida num pedestal de pedra preta sobe e gira para a câmera num estúdio verde-escuro, e o número
do marco sobe em rodas de odômetro cromadas até virar tudo de uma vez. É o prêmio genérico de qualquer conquista: a
festa é o metal e o reflexo, nada mais.

- **Estúdio:** verde profundo, uma poça de `#144234` atrás da placa caindo por `#09221B` até quase preto `#030D0A` nas
  bordas, com grão fino. O verde só vem da sala e do reflexo; a placa em si não tem cor.
- **A placa:** prata polida com bordas espelhadas e espessura de verdade, um painel preto acetinado embutido na frente,
  pedestal de pedra quase preta. Grande, centrada, quase de frente, vista um pouco de cima.
- **Dentro do painel:** de cima para baixo, uma estrela cromada pequena, um fio cromado, o número, outro fio e a
  palavra, com muito preto em volta. Nada mais na tela.
- **Letras:** o número em Barlow Semi Condensed 700, cada algarismo numa casa de largura fixa, em cromo com relevo. A
  palavra em Montserrat 600, caixa alta pequena e bem espaçada, também em cromo.
- **Luz:** faixas de luz altas que varrem o metal conforme ele gira, topo da face mais claro, um fio de brilho em
  cada borda arredondada.

**Os movimentos (o vocabulário):**
- **Já subindo:** no primeiro quadro a placa está baixa e virada para o lado, subindo e girando, com as rodas já
  rodando.
- **O giro que pousa:** ela acelera ao virar de frente e pousa um pouco antes de 2 s, passando um tiquinho do
  esquadro e voltando. As faixas de luz deslizam no caminho. É a entrada do troféu.
- **O odômetro que freia:** a contagem corre e desacelera perto da meta; as rodas param no 9 uma a uma da esquerda para
  a direita, a última se arrasta. É o suspense honesto, sem pular número.
- **A virada:** todas as rodas viram juntas para o número cheio, com um quique só. A roda da frente fica vazia até a
  virada trazer o 1. É o golpe da cena.
- **A pausa:** a câmera chega um pouco mais perto e assenta; o último segundo é parado.

## Como variar (o jeito, não a demo)

- **O número é o que a pessoa disse,** como foi dito (G10): 1.000 clientes, 10 anos, R$ 10.000 no mês (`meta`,
  `prefixo`). A palavra é a unidade dita, em caixa alta (`palavra`). Número redondo é o que este estilo quer; número
  quebrado ("1.237") também funciona, sem a graça da virada.
- **A virada cai na palavra do número** (`viradaEm`, em quadros do `palavras.json`). O resto da coreografia se ajusta
  em volta.
- **Outro objeto, mesmo gesto:** para um marco que não é contagem (o primeiro prêmio, a formatura, o 1º lugar), a placa
  pode trocar o odômetro por uma palavra grande em cromo; o metal, o verde, o giro que pousa e a pausa ficam. A
  estrela pode virar outro símbolo simples em cromo, se a fala pedir (um troféu, uma casa).
- **Frase curta:** só o giro e a virada, 2 a 3 s. **Dois marcos na fala:** duas cenas, nunca dois números na mesma
  placa.
- **Formatos:** palco 4:5; em 9:16 sobra verde em cima e embaixo (legenda da casa embaixo, branca); em 16:9 a placa
  fica no centro.

## Nunca

- Copiar prêmio de plataforma: nada de botão de play, vermelho ou logo.
- Brilho, confete, faísca, raio de luz, explosão de partícula.
- Número que pula direto para o fim, passa da meta no caminho ou muda de largura ao contar.
- Dourado ou fundo carregado.
- Número que a pessoa não disse ou ainda não atingiu.
- Reaproveitar "100.000 SEGUIDORES" da demo (`componente/textos-demo.json`) quando a fala diz outro marco.
- Refazer a coreografia da demo batida a batida quando a fala pede outra (virada mais cedo, sem contagem, outro
  símbolo).
