# cena32: Receipt (Nota fiscal)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** quanto custou, item por item, até o total.
- **Quando a fala pede:** "gastei", "custou", "o total foi".
- **Completa estes modelos:** documental-dados, prova-print, imagem-por-palavra.
- **Material e prova:** valores como ditos; gasto do dono real.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma nota de papel térmico saindo de uma impressora preta, num estúdio azul-noite, linha por linha, até o total. "Quanto
custou" vira um objeto quase palpável, e o total chega como desfecho.

- **Fundo:** estúdio azul-meia-noite, `#06090F` nas bordas subindo a `#11192B` atrás da nota, com grão fino. Escuro
  para o papel ser a luz da cena.
- **O papel:** branco frio de papel térmico `#F3F5F4`, impressão quase preta `#1C1F25`, cinza `#61666F` para a data e
  a linha tracejada. Borda de cima em zigue-zague de papel rasgado, risquinhos de impressão térmica, curva suave para
  trás e mais escuro perto da fenda. Sem cor de destaque: o branco do papel é o acento.
- **A impressora:** corpo grafite fosco, tampo de vidro preto com reflexo leve do papel, fenda e barra de corte de aço.
  Fica embaixo, a nota ocupa os dois terços de cima.
- **Letras:** IBM Plex Mono em tudo, como impressão de verdade. Nome em cima em caixa alta espaçada (700), data pequena
  e cinza, item à esquerda (500) e valor à direita (600), linha dupla, rótulo do total pequeno e o valor do total com
  o dobro do tamanho de um item. O total é sempre a maior coisa do papel.

**Os movimentos (o vocabulário):**
- **Já imprimindo:** o primeiro quadro tem o nome recém-saído e a câmera alta, a três quartos, já em movimento.
- **O passo de avanço:** cada linha sai da fenda num empurrão curto, e a ponta solta do papel balança e assenta. Uma
  linha só existe saindo da fenda, nunca digitando nem aparecendo. É o ritmo de conta sendo somada.
- **A corrida do total:** a linha dupla e o total saem juntos numa corrida mais longa. É o golpe da cena.
- **O código de barras:** sai por último, fecha o papel.
- **O arco da câmera:** a câmera dá a volta e desce enquanto recua, até a nota inteira e a impressora caberem.
- **A pausa:** o último segundo é parado, com o total legível.

## Como variar (o jeito, não a demo)

- **Os itens são os que a fala cita, na ordem dita, com os valores como foram ditos** (G10): de um a cinco
  (`itens`). Dois itens fazem uma nota curta; o papel encolhe sozinho.
- **Cada linha sai na palavra dela** (`tempos`, em quadros do `palavras.json`), e o total sai na palavra do total
  (`tempoTotal`). Nada de cadência fixa da demo.
- **O nome no topo** é o que a fala dá: o projeto, o mês, "MEU PRIMEIRO CARRO". Nunca uma loja real que não foi dita,
  nunca o layout de nota de uma loja real.
- **A nota não precisa ser de compra:** horas gastas, calorias, tempo perdido por dia. Troque o rótulo do total
  (`rotuloTotal`) pela palavra que a fala usa.
- **Frase curta** (só o total): a nota sai já com o cabeçalho e o total numa corrida só. **Mais de cinco itens:** junte
  em grupos como a pessoa disse ("o resto do equipamento") ou leve a lista para outra cena.
- **Formatos:** o palco é 4:5; em 9:16 sobra azul em cima (a nota pode subir) e embaixo (legenda da casa); em 16:9 a
  impressora fica no centro com mais escuro nas laterais.

## Nunca

- Nota chapada subindo, texto que digita, esmaece ou pula na tela: a linha só nasce saindo da fenda.
- Brilho, confete, faísca, nome ou logo de loja real.
- Mais de cinco itens, ou um item maior que o total.
- Papel reto e duro, ou branco puro sem luz.
- Reaproveitar o "ESTÚDIO ALVO", a câmera, a lente ou os valores da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida (quatro itens a cada 10 quadros) quando a fala pede outra.
