# cena40: Hologram (Holograma)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** plano/estratégia num lugar: onde as coisas estavam e o caminho.
- **Quando a fala pede:** "o plano era", "eles entraram por", investigação.
- **Completa estes modelos:** documental-dados, personagem, minidocumentario.
- **Material e prova:** o sistema faz tudo; fatos com fonte.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um lugar inteiro reconstruído como maquete de holograma azul-gelo no preto, como num documentário de investigação. A
câmera rodeia devagar, uma coisa só fica vermelha e uma linha vermelha mostra o caminho que ela fez.

- **Paleta:** preto quase puro `#03070D` com uma névoa azul-marinho `#172734` atrás da maquete. A maquete é azul-gelo
  translúcida: telhados claros `#85C9FB`, paredes um tom abaixo `#69B3E8` afundando em azul escuro `#0C3F78` na base,
  arestas finas em ciano brilhante. Veículos e objetos móveis em vidro azul-marinho com contorno ciano. Um acento só:
  vermelho quente `#CF3538` para a única coisa da história.
- **Letra:** JetBrains Mono. O nome em 600, ~30 px, quase branco `#EEF8FF`, caixa alta espaçada; a hora ou o dado
  embaixo em 400, ~27 px, azul apagado. Cada rótulo pendura num fio branco reto com um anelzinho no ponto.
- **Layout:** a maquete toda, vista do alto em três quartos, enchendo a largura, com preto em cima e embaixo. Os
  rótulos moram nesse preto, nunca em cima da maquete clara.
- **Textura:** pontinhos de gelo nas superfícies, brilho macio nas linhas, chão preto espelhado com reflexo fraco,
  poças de luz ciano debaixo dos veículos e neblina baixa no chão.

**Os movimentos (o vocabulário):**
- **Já ligado e girando:** o primeiro quadro tem a maquete acesa e a câmera já orbitando e entrando.
- **A órbita:** uns 35 graus de volta, descendo um pouco e chegando perto, parando de vez por volta de 4 s. As camadas
  (prédios, veículos, neblina) passam umas pelas outras e dão profundidade.
- **A marcação:** a coisa da história brilha nas arestas, uma linha de varredura quente corre por ela e a deixa
  vermelha, junto com a poça de luz embaixo. É o "este aqui".
- **A rota:** uma linha vermelha se desenha no chão com uma cabeça clara, de onde a coisa veio até onde chegou; um anel
  pousa no fim e o destino fica vermelho.
- **Os rótulos:** o anel acende no ponto, o fio cresce em poucos quadros, as letras sobem de uma máscara com um
  pequeno passo além. Último segundo parado.

## Como variar (o jeito, não a demo)

- **A maquete é o lugar da fala, e ela se redesenha.** O componente monta a cena com caixas no espaço (`BOXES`: x, z,
  altura em unidades do mundo), o terreno (`SITE`), a rota (`ROUTE`) e os pontos de rótulo (`GATE`, `DOCK`). Para um
  lugar novo, copie o componente para a pasta do vídeo e troque essas listas: uma agência bancária vira um prédio,
  o cofre e a rua; um estádio vira a arquibancada em blocos, o túnel e o gramado; um bairro vira as quadras e as ruas.
  Caixas simples bastam: a luz e as arestas fazem o resto. A projeção, os materiais, a varredura, a rota e os rótulos
  continuam iguais.
- **O vermelho é o sujeito da frase:** o carro, a pessoa (um bloco alto e fino), o pacote, o dinheiro. Só um.
- **A rota é o verbo:** "entrou pelo portão e foi até o cofre" é uma rota de dois trechos; "ficou parado ali" não tem
  rota, só a marcação e o anel. Sem caminho dito, sem linha.
- **Rótulos são o que a fala nomeia,** de zero a três, com o nome e a hora ou o dado dito embaixo (G10). Sem nome
  dito, sem rótulo.
- **Batidas pela frase:** frase curta, a órbita e a marcação. Frase com trajeto, marcação, rota e chegada, cada uma
  numa palavra.
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 corta as laterais (maquete mais estreita, rótulos no preto de cima e
  de baixo), em 16:9 corta em cima e embaixo (rótulos ao lado da maquete, ainda no preto).

## Nunca

- Textura realista, rosto, logo, marca de empresa ou de veículo real. É maquete, não foto.
- Mais de uma história em vermelho.
- Enfeite de painel futurista: grade na tela, scanline por cima do quadro, glitch, tremido, partícula, flare.
- Rótulo em cima da maquete clara, ou mais de três.
- Reaproveitar o centro de dados, os caminhões, o portão, a doca ou qualquer texto da demo
  (`componente/textos-demo.json`) quando o lugar é outro.
- Refazer a coreografia da demo batida a batida (varredura, rota em zigue-zague, três rótulos) se a fala pede menos.
