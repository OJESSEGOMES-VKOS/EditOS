# Câmera e movimento: o destilado

Base de conhecimento do "Estúdio Claude + Blender 3D" sobre animação de câmera de produto,
rigs multi-câmera, Graph Editor, curvas e easing, os 12 princípios aplicados, timing,
transições 3D e efeitos de motion graphics.

- **Fonte:** 13 transcrições `camera_motion__*` em `pesquisa/transcricoes/` (legenda automática,
  interpretada).
- **Alvo:** Blender 5.2 operado por Python. Tudo que é API foi conferido contra
  `.claude/skills/estudio-3d/referencias/blender-5.2-verdade.md`. O que não está lá vem marcado
  `[verificar na sonda]`.
- **Convenção:** o que não saiu das fontes e é conhecimento meu vem marcado `[conhecimento geral]`.
  Valor sem marca saiu de um vídeo, e a fonte vem entre parênteses.
- **Siglas das fontes:** KZ (Kaizen), GK (George Kayesi, câmera), GKt (George Kayesi, textura),
  BtB (Blender To Browser), OM (madebyomkar), DK (Ducky 3D), WM (Wintermute), CB (CBaileyFilm),
  RK (Ryan King), BK (BrianKouhi), PP1 (Pierrick Picaut, princípios), PP2 (Pierrick Picaut,
  truques), AB (Alan Becker).

---

## 1. Por vídeo

As notas medem o valor **para este tema** (câmera comercial de produto operada por script), não a
qualidade geral do vídeo.

### 1.1 How to Make Smooth Camera Animations in Blender
- **Canal:** Blender To Browser · https://youtu.be/dFK3C83k4Wo · **Nota 5** · **Versão:** 4.x
  (usa light linking, que existe desde o 4.0)
- Câmera **parenteada a um empty por plano**. A câmera não gira: gira o empty, e a câmera
  descreve um arco limpo em volta do produto. Um empty e uma câmera por plano, cada par na sua
  própria coleção ("shot one", "shot two").
- Lente de **90 mm** num produto (cadeira) sobre fundo infinito (plano com a borda de trás
  extrudada e chanfrada, maior que o necessário pra câmera não ver a borda quando gira).
- O plano tem duas partes, **entrada** e **saída**. A entrada é um push-in lento, do quadro 1 ao
  40/50 (a câmera começa um pouco recuada e chega na posição final). A saída é uma rotação do
  empty em Z.
- Números que ele anota pra manter tudo consistente: **rotação da transição 40°**, **duração da
  transição 20 quadros**, **a transição começa 40 quadros depois do início do plano**, **cada
  plano dura 50 quadros**. A primeira tentativa foi 30° em 15 quadros. Ele achou curta e fraca e
  subiu pra 40° em 20.
- Easing feito no Graph Editor: trava X/Y pra mexer só no canal de rotação Z, liga *Normalize*,
  aperta Home e **escala os dois handles no eixo X** (handle mais longo é aceleração mais forte e
  meio mais rápido). O aviso dele: handle esticado demais deixa o meio rápido demais. O ajuste é
  no olho, tocando.
- **O corte vai no ponto de maior velocidade**, que é o meio da transição (quadro 50 numa
  transição de 40 a 60). A câmera 2 é amarrada ao marcador do quadro 50 com Ctrl+B, e a câmera 1
  ao quadro 1.
- A entrada do plano 2 é o **espelho** da saída do plano 1: rotação de **-40° até 0°** nos quadros
  40 a 60, com o mesmo easing colado (ele usa o add-on gratuito *Relative Ease* pra copiar e colar
  o easing).
- **A câmera nunca para.** Depois da entrada ela segue girando: chave de +10° no quadro 90, e a
  próxima saída soma mais 40° (total 50°) nos 20 quadros seguintes.
- Defeito que ele mostra e corrige: na emenda entre o fim da entrada e o drift aparece uma
  **"lombada"** na curva (desacelera até quase parar e volta a andar). A correção é girar os
  handles da chave do meio até a lombada sumir.
- Pra mostrar as costas do produto ele faz uma **cópia completa da cena** (*Full Copy*) e gira o
  produto lá, sem refazer câmeras. Luz: duas áreas, direita e esquerda, e a da esquerda com
  **light linking** só no modelo, pra não mexer nas sombras.

### 1.2 This Camera Animation Trick Changed My Life
- **Canal:** George Kayesi · https://youtu.be/Ff4f9JdBcEE · **Nota 5** · **Versão:** 3.x (EEVEE
  legado, Ctrl+Tab alternando timeline e graph)
- **Rig de três níveis:** `Empty Main` (topo) → `Empty Camera` (filho) → câmera (neta). O Empty
  Main gira em Z (órbita), o Empty Camera gira em X (inclinação, o "tilt over") e a câmera anda
  no próprio eixo local (dolly). Cada nível faz um tipo de transição.
- Câmera a **-50 cm em Y** do empty, **35 mm**, escala dos empties aplicada (Ctrl+A). O rig é
  copiado e colado nas outras cenas e só a altura (Z) do Empty Camera é ajustada por produto.
- Cada cena tem **150 quadros**, e o After Effects monta tudo em **30 fps**: 4 cenas × 150 = 600
  quadros = 20 s.
- **Cena 1, transição por órbita:** câmera Y de -50 → -40 cm (quadros 1 → 150, um push-in de 10 cm
  na cena inteira). Empty Camera X de -30° → 5° (1 → 150). Empty Main Z de -30° (1) → 20° (120)
  → **+90° em cima disso no 150**. As duas últimas chaves são a saída.
- **O truque do handle (saída):** no Graph Editor, com Normalize ligado, ele pega o handle
  direito da chave 120 e arrasta na horizontal (G, X) **até o quadro da chave final**. A curva sai
  da 120 quase parada e acelera forte até o fim, um ease-in exagerado. Depois **empurra as duas
  chaves 5 quadros pra frente**. Assim a cena acaba (quadro 150) antes da curva terminar, ainda
  em alta velocidade.
- **Cena 2, entrada espelhada:** Empty Main Z de **-90° → 0°** nos quadros 1 → 30. O handle
  esquerdo da chave 30 é arrastado na horizontal até o quadro 1 (ease-out exagerado: entra
  rápido e assenta devagar). Depois as chaves vão **5 quadros pra trás**, então no quadro 1 a
  câmera já está em alta velocidade. A saída da cena 1 girou 90° anti-horário, a entrada da cena
  2 continua 90° anti-horário: **mesma direção, mesma magnitude.**
- **Transição por inclinação (cena 2 → 3):** Empty Camera X chega a **-90°** no quadro 150 (saída
  entre 120 e 150, mesmo truque, +5). A cena 3 entra com Empty Camera X de **105° → 15°** nos
  quadros 1 → 30 (truque de entrada, -5).
- **Transição por dolly (cena 3 → 4):** câmera Y -25 cm (1) → -30 cm (120) → **-70 cm (150)**, um
  recuo rápido de 40 cm em 30 quadros. A cena 4 entra com câmera Y de **-15 → -50 cm** em 1 → 30,
  recuando também. Direção conservada.
- Quando ele põe uma chave nova no meio (Empty Main Z = 30° no 120 da cena 2), a chave vizinha
  perde a suavidade. A correção é **handle Auto Clamped** e refazer o arraste do handle.
- Render: PNG RGBA com **Film > Transparent** e **motion blur ligado em todas as cenas** (ele
  insiste nisso antes de renderizar). No AE, fundo sólido com vinheta (Circle, raio 700, feather
  300) e **a cor de fundo muda em 1 s centrado no corte** (de 4s15f a 5s15f, com o corte em 5s).
  Brilho/contraste 5/50.
- Animação secundária: os empties dos dois celulares sobem e descem em Z ao longo dos 150
  quadros, cada um pro seu lado.

### 1.3 How to do Product Animations in Blender [Multiple Camera Setup]
- **Canal:** Kaizen · https://youtu.be/A1dNYYiJu30 · **Nota 5** · **Versão:** 2.9x (provável
  24 fps, não dito)
- A receita dele são três coisas: **produto, música e luz**, mais bons ângulos. A música dirige
  os cortes.
- Fluxo de trabalho: no Video Sequencer, adiciona o áudio, liga **Display Waveform**, põe o
  playhead no começo de cada pico e aperta **M** pra criar marcador. Marcadores do exemplo:
  **48, 92, 137, 181, 225/226** e o fim no **380**. Isso dá planos de ~44 a 45 quadros e um plano
  final longo (~200 quadros).
- **Toda câmera tem um ponto focal:** um empty esfera ("first fp", "second fp"...) e na câmera um
  constraint **Track To** apontando pra ele. O mesmo empty vira o **objeto de foco do DoF**. Girar
  câmera na mão (R R) é chato e impreciso.
- **Movimentos sutis**, principalmente em close: mover a câmera demais ou rápido demais parece
  falso. Cada plano tem um único movimento simples: deslize lateral (G X), recuo no eixo local
  (G Z), subida.
- **Interpolação LINEAR na câmera** (T > Linear em todas as chaves de cada plano). O padrão
  Bézier, segundo ele, "não é o que você quer" nesse tipo de animação.
- Close dos botões com lente de **43 mm**, câmera chegando perto pelo eixo local pra o tecido
  felpudo não entrar no quadro.
- **Troca de câmera por marcador:** câmera ativa + Ctrl+B na timeline amarra a câmera ao
  marcador. Câmeras podem ser **reaproveitadas** em marcadores posteriores (ele recicla a 3ª, a
  2ª, a 5ª...) sem criar nada novo.
- **Rig de luz:** um empty "lighting control" com todas as luzes parenteadas. Girar esse empty
  levemente durante um plano faz os reflexos correrem pelo produto (ele fez isso nos planos 2 e
  3, enquanto a câmera desliza pelas letras).
- **Trocar a luz escondida no corte:** chave da luz no quadro 136, nova rotação no 137 (o quadro
  do corte). A luz muda em um quadro, no mesmo quadro em que a câmera muda, e ninguém percebe.
  Ele usa isso pra deixar a luz certa pra cada ângulo.
- **Transição por desfoque (rack focus):** no close do tecido o empty de foco começa colado na
  câmera (tudo borrado) e é animado até o tecido no fim do plano. Nenhum movimento de câmera, só
  o foco. O final é um flyby lateral longo (G X + G Z) terminando num ângulo bonito do produto
  inteiro.

### 1.4 Product Reveal Animation Blender using Lights
- **Canal:** madebyomkar · https://youtu.be/_nl4kcb05sQ · **Nota 4** · **Versão:** 3.x (Filmic)
- Mundo **preto, força 0**. A revelação vem só da luz.
- Luz de **área**, girada até formar um **contorno (rim) na borda** do produto, e escalada em X
  (retangular) pra iluminar só um lado. Cor azul. Duplicada e espelhada pro outro lado (R Z).
- **Rig por constraint em vez de duas animações:** a luz esquerda recebe **Copy Location** com
  alvo na direita, **Invert** no eixo e **Offset** ligado. Animando só a luz direita em Z, a
  esquerda anda espelhada.
- Animação: luz direita fora do produto (cena escura) no quadro 1 → passa pelo produto → sai
  (escuro de novo) no quadro 60, depois encurtado pra **30 quadros a 30 fps (1 s)**.
- **O problema mostrado:** a luz cruza o produto rápido demais e o momento bonito dura um quadro.
  A correção: chave nova no quadro em que a luz começa a aparecer (**quadro 11**), com pivô
  *Individual Centers*, e **R e S no handle pra achatar a curva** naquele trecho. A luz desacelera
  justo onde ilumina o produto.
- Compositor: **Glare em Fog Glow, tamanho 6**. Motion blur ligado, **Filmic + High Contrast**,
  40 amostras.
- **Transição de produto a produto pelo preto:** renderiza o estojo e o fone com a mesma luz e
  corta no editor no momento escuro entre os dois. A passagem da luz vira a transição.

### 1.5 How to use Blender's Graph Editor like a Professional Animator
- **Canal:** BrianKouhi · https://youtu.be/vKgO3NsYORo · **Nota 4** · **Versão:** 4.x
- Keying set de Location + Rotation + Scale + propriedades customizadas, e *Show Sliders* nos
  canais.
- Preferências > Animação: **Only Show Selected F-Curve Keyframes** ligado e **opacidade das
  curvas não selecionadas em ~15%**. No menu View: *Only Selected Keyframes Handles*.
- **Normalize sempre ligado:** força todas as curvas entre -1 e 1 pra caber na tela (o valor do
  eixo deixa de ser o real).
- Mover com precisão: **G X 1** anda 1 quadro, **G Y 5** sobe 5 unidades. Escalar e girar
  **a partir do cursor 2D** (Pivot = 2D Cursor, Shift + botão direito posiciona).
- **Shift+E > Make Cyclic** pra loop. **V** troca o tipo de handle: Free, Aligned, Vector, Auto,
  **Auto Clamped**, que "aperta" a curva e evita esquisitices. Ele diz que T muda a
  "extrapolação", mas T é interpolação. Extrapolação é Shift+E.
- **X > Clean Keyframes** remove chaves estáticas que não mudam a curva (pode criar um soluço em
  curva cíclica, que se conserta à mão). **[** e **]** selecionam tudo antes/depois do playhead.
- No painel N > Modifiers: **Noise pra camera shake** (scale, offset, depth, strength) com
  **Restrict Frame Range** (exemplo: só do quadro 10 ao 20) e **Stepped Interpolation** pra
  simular animação "em dois".
- **Euler Filter** (Channel > Discontinuity Euler Filter) conserta rotação que deu voltas demais
  (700° vira ~60°, mesma orientação). Checkbox do canal **muta** a curva pra isolar uma parte.
  Marcadores com nome (M, duplo clique) pra marcar "estiramento máximo" etc.

### 1.6 How to Use the Graph Editor for Beginners
- **Canal:** Ryan King Art · https://youtu.be/sc64wS-gukU · **Nota 3** · **Versão:** 3.x/4.x
- Leitura do gráfico: **horizontal é tempo, vertical é valor**. Chave mais cedo é movimento mais
  rápido, valor maior é ir mais longe.
- **Parada seca:** arraste o handle de chegada pra trás, até a curva chegar inclinada. O cubo
  acelera e para de uma vez, sem assentar.
- **Recuo antes de ir (antecipação pelo handle):** arraste o handle de saída pra **baixo** do valor
  inicial e a curva mergulha no negativo. O objeto anda pra trás antes de ir pra frente.
- T: Bézier (suave), **Linear** (velocidade constante, "robótico", bom pra loop), **Constant**
  (pula de valor, bom pra blocking) e Bounce (quica no fim, mais útil numa queda).
- Modificador **Noise:** scale, strength, phase, offset, influence. Ele usa pra câmera na mão.
- Modificador **Limits** sobre o Noise, com a curva achatada: liga e desliga entre mínimo e
  máximo. Serve pra luz piscando.
- **Restrict Frame Range** com **Blend In / Blend Out:** o ruído entra e sai suave numa janela
  (no exemplo, a partir do ~32). Modificadores podem ser copiados e colados entre canais.
- Ícones do canal: cadeado (trava), checkbox (desliga o efeito), chave inglesa (desliga os
  modificadores da curva) e olho (só esconde da vista).

### 1.7 Animation For Beginners! Learn to Animate like a PRO in blender
- **Canal:** CBaileyFilm (animador de longa-metragem) · https://youtu.be/AEAc_lLjOMc · **Nota 4**
  · **Versão:** 4.x (a opção de chaves só da curva selecionada já mora nas preferências)
- Cor dos campos: **amarelo** = chave neste quadro, **verde** = há chave em outro quadro,
  **laranja** = valor mudou e não foi gravado (será perdido ao mexer o playhead). Auto key é
  rápido, mas pode apagar uma chave boa sem querer.
- Preferências do Graph Editor: opacidade das curvas não selecionadas lá embaixo e *Only Show
  Selected F-Curve Keyframes*. **S em uma chave escala os handles** e muda a velocidade.
- **Handles a zero (S 0) no contato:** queda que para seco no chão e quica de novo. É o
  "hard stop" de qualquer impacto.
- **No longa-metragem, o grosso é feito em chaves "stepped" (Constant):** poses claras primeiro,
  timing ajustado arrastando chaves na timeline, e só depois spline. Ele muda a interpolação
  padrão pra Constant enquanto faz o blocking.
- **Rig mínimo:** empty (círculo) com pivô na base do objeto, objeto parenteado. Squash
  escalando o empty em Z, e o objeto amassa contra o chão, não contra o centro.
- Timing: selecionar um bloco de chaves e **S a partir do playhead** comprime todas
  proporcionalmente. Um **breakdown** perto da pose de destino faz o objeto sair rápido e chegar
  devagar.
- Ao passar pra Bézier **a animação "perde o soco"** porque tudo vira ease. A correção é S 0 nas
  chegadas ao chão e **girar os handles pra apontarem pra próxima chave**, tirando a
  "lombada" em que a curva sobe, mergulha e sobe de novo. A curva certa é um arco limpo, sem
  ondulação.

### 1.8 The principles of animation in Blender
- **Canal:** Pierrick Picaut · https://youtu.be/QqBxR1QuemQ · **Nota 4** · **Versão:** 2.9x/3.x
- Animação é "dar vida", não "mover coisa". Ele separa motion design de animação, sem dizer que
  motion design não pode ter vida.
- **Blocking em Constant** (T), pra o computador não inventar o meio. Senão fica "boiando".
  Poses-chave, depois breakdowns (ferramenta Breakdowner pra começar, ajuste à mão), depois os
  intermediários no Graph Editor.
- **Timing ≠ spacing.** Timing é quando acontece: no exemplo, a bola bate na parede no quadro
  **10**, no chão no **22**, chega ao topo no **26** e na outra parede no **30**. Spacing é a
  distância percorrida entre quadros, que dá a velocidade. Os dois aparecem no **motion path**.
- Arcos: quase nada vivo anda em linha reta. *Calculate Motion Path* fica nas propriedades do
  objeto, com cor, espessura e a opção de mostrar só em volta do quadro atual.
- **Só passe pra spline quando o blocking já mostra tudo:** antecipação, overshoot, extremos,
  contatos e breakdowns definidos, timing sólido, arcos legíveis.
- **Microantecipação de 1 a 2 quadros** em cima da antecipação, empurrando muito a pose. Serve
  pra impacto com timing curto.
- **Não use ease antes de impacto.** Bola caindo acelera até bater, soco acelera até acertar.
  Bézier dá ease de graça, e é por isso que precisa de cuidado.
- **Twinning** (simetria de pose ou de timing) em geral se evita, por exemplo defasando os pés por
  1 a 2 quadros na aterrissagem. Mas simetria pode comunicar força, domínio e controle.
- Frame rate: 24 fps no cinema (divide por 2, 4, 6 e 8) e 30 fps em jogo. Animar "em dois" se
  faz no NLA com modificador Stepped.

### 1.9 My tricks to make great animations in Blender
- **Canal:** Pierrick Picaut · https://youtu.be/VYwJHvHt8OY · **Nota 3** · **Versão:** 4.x
  recente (motion path em espaço de câmera)
- **Todo quadro tem que fazer sentido e, de preferência, ser bonito.** Nunca deixe o computador
  decidir o que acontece entre as chaves.
- O blocking dele tinha uma pose feita à mão **quase a cada 2 quadros** antes de virar spline.
- Linha de ação clara em toda pose, e a evolução dela no tempo controlada. Linha que muda sem
  motivo faz a animação perder o sentido.
- Silhueta legível: um lado complexo, o outro simples.
- Arcos e spacing limpos. **Quebrar o arco só de propósito** (impacto, mudança brusca de direção,
  vibração).
- **Ponto de interesse:** ao animar pra câmera, não perca o rastro do que importa (olhos, mãos,
  objeto-chave).
- **Motion path em espaço de câmera** (opção nova): mostra o caminho que o ponto faz **na tela**,
  não no mundo 3D. É o jeito de conferir se o produto desenha um arco limpo no quadro enquanto a
  câmera também se move.

### 1.10 12 Principles of Animation (Official Full Series)
- **Canal:** AlanBeckerTutorials · https://youtu.be/uDqjIdI4bF4 · **Nota 4** (conceitual, não é
  Blender) · **Versão:** n/a
- **Squash/stretch conserva volume:** estica e afina, amassa e alarga. Quanto mais amassa, mais
  mole parece (balão de água × bola de boliche). O estiramento máximo é logo antes do impacto,
  não na queda inteira.
- **Antecipação** pode ter vários níveis (antecipar a própria antecipação, como o arremessador de
  beisebol). E pode servir pra enganar: leva o olho pra um lado e a coisa acontece do outro.
- **Encenação (staging):** longe pra ação grande, perto pra expressão. Ação principal no **centro
  ou num terço** do quadro. Espaço livre do lado pra onde o sujeito olha. **Uma ação termina antes
  da outra começar.** Pausas pra o público processar.
- **Texto na tela fica o tempo de lê-lo em voz alta três vezes.**
- Pose a pose em hierarquia: **chaves → extremos → breakdowns → intermediários**, aperfeiçoando
  cada nível antes de descer.
- **Follow-through/overlap:** a ponta do apêndice é a última a chegar e a que passa mais longe na
  parada. Drag mostra massa (antena de TV × pena).
- **Slow in/slow out:** quase tudo começa devagar, acelera e termina devagar. Sem isso fica
  mecânico. **Exceção:** sem desaceleração na colisão (bola no chão, bala saindo da arma). No 3D,
  movimento muito rápido pode ser feito com curvas muito extremas.
- **Arco no 3D:** X em velocidade constante e Y com slow in/out dá o arco da bola.
- **Timing muda o significado:** o mesmo movimento de cabeça com 0 intermediários é um golpe
  violento, com 1 é uma pancada, 2 um tique, 3 uma esquiva, 4 "sai daí", 5 "vem cá", 6 ver algo
  desejado, 7 tentar ver melhor, 8 procurar na prateleira, 9 avaliar com calma e 10 alongar um
  músculo.
- **Exagero:** em movimento rápido precisa ser maior pra ser notado (ou ficar mais tempo na tela).
  Empurre até passar do ponto e depois volte.

### 1.11 Blender Motion Graphics - 5 Easy Effects in 15 Minutes
- **Canal:** Wintermute Digital · https://youtu.be/AONniAlLjLg · **Nota 3** · **Versão:** 2.8x
- **Câmera ortográfica de cima** pra motion graphics 2D: o que é paralelo continua paralelo e
  duplicar não muda a escala aparente.
- **Espiral quadrada:** anel quadrado + vértice com modificador **Screw** (ângulo **0° → 360°**,
  quadros **0 → 60**) + Solidify + Boolean Intersect pra recortar o anel aos poucos.
- **Stagger:** duplicar o conjunto e **deslocar as chaves alguns quadros** na Dope Sheet. Ele
  recomenda que as chaves finais terminem **mais ou menos juntas**.
- **Rastro em curva:** modificador **Curve** e animação da posição em X (o objeto corre pela
  curva). Escala em X animada estica o rastro ao longo do caminho. Resolução da curva e
  Subdivision aumentadas pra não serrilhar.
- **Explosão radial (starburst):** cubos em Array dobrados num círculo, vértices externos num
  vertex group, modificador **Hook** pra um círculo vazio com **strength 0 → 1 → 0**.
- **Fade por shader:** Mix entre Emission e Transparent, fator **0 → 1** animado (blend mode
  Alpha Blend no EEVEE antigo). Material separado (single user) pra cada cópia ter timing
  próprio.
- **Wipe de painéis em cascata:** 5 planos com Hook de forças diferentes pra um único empty.
  Animar só o empty, e cada painel chega numa hora.
- **Wipe de painel dividido:** plano maior que o quadro da câmera, cortado ao meio (faca K),
  metades **saem do quadro até o quadro 20**, parenteadas a um empty. Cópias deslocadas no tempo
  pra cascata, em cores análogas.
- Ele admite não conhecer os princípios de timing de motion graphics. Os efeitos valem, os tempos
  não são referência.

### 1.12 Pixel Glitch Scan Animation In Blender | Digital Logo Wipe
- **Canal:** Ducky 3D · https://youtu.be/-RQoBcc8K9c · **Nota 3** · **Versão:** 3.x/4.1 (EEVEE
  legado, "Alpha Clip")
- Wipe de logo **feito só no shader:** Mix Shader (Transparent embaixo, Emission em cima), com o
  fator vindo de um **Gradient Texture em coordenadas de objeto** passando por um ColorRamp.
- Glitch: **Voronoi 4D, F2, randomness 0**, ajustando **W** e escala até virar "pixel". Cada
  textura com seu Mapping.
- **Mix Color** com Object no B controla **a largura** da faixa de glitch (fator na direita ignora
  o glitch, na esquerda é só glitch).
- Faixas RGB na borda do wipe: ColorRamp em **Constant** com vermelho, verde e azul puros, e um
  segundo ramp invertido pra as cores não se misturarem.
- Animação: **interpolação padrão LINEAR nas preferências**, Mapping X do lado invisível ao
  visível em **40 quadros**. O wipe anda em velocidade constante.
- Acabamento: Glare com **streaks 2, iterações 3**, color modulation alta e mix baixo, mais **Lens
  Distortion com dispersion e jitter** (ruído orgânico). Saída MP4 "perceptually lossless". Na
  versão completa ele pôs camera shake, chão metálico e volume.

### 1.13 Texture Transition Effect
- **Canal:** George Kayesi · https://youtu.be/j5uHDT6dxzs · **Nota 3** · **Versão:** 3.x/4.x
  (bloom do EEVEE antigo)
- Troca de textura no próprio objeto: dois Principled (laranja e azul) num Mix Shader, com o
  fator vindo de **Noise 4D → ColorRamp** (paradas próximas = borda dura).
- **Borda luminosa:** Emission amarela com força alta, num segundo Mix, usando o mesmo ramp como
  fator. Paradas mais próximas dão um brilho mais fino.
- **Controle por empty:** Mix Color com **Gradient Texture** no B, e o Texture Coordinate em modo
  **Object = o empty**. Mover o empty em X anda a transição, girar muda o ângulo e escalar deixa a
  borda mais dramática.
- Precisa do Node Wrangler (Ctrl+T monta Mapping + Texture Coordinate). Bloom pra ver o brilho
  (no 5.2: Glare no compositor, ver seção 2.3).

---

## 2. Síntese

### 2.1 Regras consolidadas

Formato de cada regra: **regra**, por quê, valores, sinal de erro, fonte.

**R1. Toda câmera tem um alvo ou um pivô, nunca rotação solta.**
- **Por quê:** girar a câmera na mão dá arcos tortos e enquadramento instável. Um empty no centro
  de interesse transforma a órbita num arco perfeito e deixa o foco amarrado.
- **Valores:** Track To (`TRACK_NEGATIVE_Z`, up `UP_Y`) pra um empty esfera (KZ), ou câmera
  parenteada a um empty que gira (BtB, GK). O mesmo empty é o `dof.focus_object`.
- **Sinal de erro:** o produto "escorrega" no quadro durante uma órbita, ou o horizonte entorta
  sem intenção.
- **Fonte:** KZ, BtB, GK.

**R2. Separe o movimento em níveis do rig: órbita, inclinação e dolly.**
- **Por quê:** cada eixo vira um controle independente, com curva própria e fácil de ajustar.
  Mexer um não estraga o outro.
- **Valores:** `Empty Main` gira Z (órbita), `Empty Camera` gira X (tilt), câmera anda no Y
  local (dolly). Câmera a -0,5 m, 35 mm (GK).
- **Sinal de erro:** uma única curva de localização tentando fazer arco + aproximação. O arco vira
  uma reta torta.
- **Fonte:** GK.

**R3. Um movimento por plano, pequeno, e menor ainda no close.**
- **Por quê:** movimento grande ou rápido em close parece falso. O plano comercial tem uma única
  ideia de câmera.
- **Valores:** push-in de 10 cm em 150 quadros (GK). Drift de ~10° em 30 quadros entre transições
  (BtB). Deslize lateral curto por plano de ~44 quadros (KZ).
- **Sinal de erro:** a câmera faz duas ou três coisas no mesmo plano (girar + subir + aproximar),
  ou o close tremula de tão rápido.
- **Fonte:** KZ, BtB, GK, AB (uma ação de cada vez).

**R4. A câmera nunca para dentro do plano.**
- **Por quê:** câmera parada num comercial parece frame congelado, e o freio (velocidade zero)
  no meio do plano mata a energia.
- **Valores:** depois da entrada, siga girando até a próxima saída (+10° em 30 quadros, BtB).
  Planos com dois keys em LINEAR (KZ). Push-in contínuo de 150 quadros por baixo de tudo (GK).
- **Sinal de erro:** velocidade zero (derivada nula) num quadro que não é pausa intencional. É a
  "lombada" que o BtB conserta.
- **Fonte:** BtB, KZ, GK.

**R5. Corte no pico de velocidade, com motion blur ligado.**
- **Por quê:** no pico de velocidade o quadro está borrado. O olho não lê a mudança de ângulo e
  liga os dois movimentos num só gesto.
- **Valores:** corte no meio de uma transição de 20 quadros (quadro 50 numa de 40 a 60, BtB).
  Saída com ease-in exagerado empurrada **+5 quadros** e entrada com ease-out exagerado puxada
  **-5 quadros**, pra os dois lados do corte estarem rápidos (GK). `render.use_motion_blur = True`
  (GK e OM insistem).
- **Sinal de erro:** a câmera desacelera até parar exatamente no corte (ease padrão de duas
  pontas). O corte vira um "pulo" seco.
- **Fonte:** BtB, GK.

**R6. Conserve direção e magnitude através do corte.**
- **Por quê:** se a saída gira pra um lado e a entrada continua pro mesmo lado e na mesma
  velocidade, o espectador sente um movimento contínuo, não dois planos.
- **Valores:** saída +40° e entrada -40° → 0° (BtB). Saída +90° anti-horário e entrada -90° → 0°
  (GK). Dolly de recuo de 40 cm na saída e recuo de 35 cm na entrada (GK).
- **Sinal de erro:** rotação invertida no corte (gira pra esquerda, entra girando pra direita),
  ou velocidades muito diferentes dos dois lados.
- **Fonte:** BtB, GK.

**R7. O easing da entrada é o espelho do easing da saída.**
- **Por quê:** velocidade igual dos dois lados do corte. O BtB literalmente copia e cola o easing
  (add-on Relative Ease).
- **Valores:** saída = ease-in forte (handle direito da chave inicial esticado na horizontal até o
  quadro da chave final). Entrada = ease-out forte (handle esquerdo da chave final esticado até o
  quadro da chave inicial) (GK).
- **Sinal de erro:** no corte a velocidade dá um degrau visível (acelera ou freia de repente).
- **Fonte:** GK, BtB.

**R8. Emenda entre trechos tem tangente contínua (sem lombada).**
- **Por quê:** quando uma chave está entre dois trechos em movimento, handle quebrado ou achatado
  cria um freio e uma retomada que o olho percebe como tranco.
- **Valores:** handle **Auto Clamped** ao inserir chave no meio (GK). Girar os handles da chave do
  meio até sumir a lombada (BtB). Girar o handle pra apontar pra próxima chave (CB).
- **Sinal de erro:** na curva, um "S" ou um patamar perto da chave. No vídeo, um soluço de
  velocidade.
- **Fonte:** BtB, GK, CB.

**R9. Sem ease antes de impacto. Contato é parada seca.**
- **Por quê:** coisa caindo acelera até bater. Desacelerar antes do contato parece que o objeto
  "pousou" de paraquedas.
- **Valores:** handles a zero no contato (S 0, CB) = tipo **Vector** no Python. Arrastar o handle
  de chegada pra trás (RK).
- **Sinal de erro:** produto que "cai" e assenta macio, sem peso. Logo que encosta e freia
  devagar.
- **Fonte:** CB, PP1, AB, RK.

**R10. Bloqueie em Constant, confira poses, só então spline.**
- **Por quê:** o padrão Bézier inventa o meio e "tira o soco". Profissional de longa decide as
  poses e o timing primeiro.
- **Valores:** interpolação padrão Constant no blocking (CB). Pose quase a cada 2 quadros num shot
  de ação (PP2). Spline só quando antecipação, overshoot, extremos e contatos estão definidos
  (PP1).
- **Sinal de erro:** chaves só no começo e no fim, e um meio "boiando".
- **Fonte:** CB, PP1, PP2.

**R11. A luz anda devagar onde o olho precisa ler.**
- **Por quê:** a passagem de luz sobre o produto é o momento bonito. Em velocidade constante ela
  dura um quadro.
- **Valores:** chave extra no quadro em que a luz começa a tocar o produto (quadro 11 de 30) e
  curva achatada nesse trecho (OM). Rotação leve do rig de luz durante o deslize de câmera (KZ).
- **Sinal de erro:** um clarão de um quadro, ou reflexo parado num plano que deveria ter brilho
  correndo.
- **Fonte:** OM, KZ.

**R12. Troca de luz se esconde no corte.**
- **Por quê:** cada ângulo pede uma luz, e mudar a luz em um quadro, junto com a câmera, é
  invisível.
- **Valores:** chave da luz no quadro do corte menos 1 e a nova no quadro do corte (136/137, KZ).
- **Sinal de erro:** a luz "gira" visivelmente no começo de um plano.
- **Fonte:** KZ.

**R13. Corte e movimento seguem a música.**
- **Por quê:** a batida é o roteiro de montagem. O espectador sente o corte como certo.
- **Valores:** marcadores no início de cada pico da forma de onda. Planos de ~44 a 45 quadros no
  exemplo, e plano final longo (~200) pra o produto inteiro (KZ).
- **Sinal de erro:** corte meio quadro antes ou depois do golpe da música.
- **Fonte:** KZ.

**R14. Organicidade vem de ruído controlado, não de mão tremendo.**
- **Por quê:** câmera perfeita demais denuncia o software. Um ruído sutil, numa janela e com
  entrada suave, imita operador.
- **Valores:** modificador Noise na curva da câmera, com Restrict Frame Range e Blend In/Out
  (RK, BK). Valores de amplitude não aparecem nas fontes (ver Lacunas e a receita 7).
- **Sinal de erro:** tremor do quadro 1 ao último na mesma intensidade, ou tremor num close macro
  (fica nauseante).
- **Fonte:** RK, BK.

**R15. Wipe em velocidade constante, gesto de câmera com ease.**
- **Por quê:** o wipe gráfico (shader, painéis) lê como varredura mecânica e pede LINEAR. Câmera e
  objeto físico pedem aceleração.
- **Valores:** wipe de glitch linear em 40 quadros (DK). Painel dividido sai do quadro em 20
  quadros (WM).
- **Sinal de erro:** wipe que acelera e freia no meio da tela (parece travar).
- **Fonte:** DK, WM. A divisão em si é inferência minha sobre dois vídeos `[conhecimento geral]`.

**R16. Cascata (stagger) termina junta.**
- **Por quê:** começos defasados dão ritmo, finais alinhados dão fechamento.
- **Valores:** deslocar as chaves de cada cópia alguns quadros, mantendo as chaves finais mais ou
  menos no mesmo tempo (WM). O GK usa 5 quadros de deslocamento no corte.
- **Sinal de erro:** o último elemento chega sozinho muito depois de todos.
- **Fonte:** WM.

**R17. Texto e logo ficam na tela o tempo de serem lidos.**
- **Por quê:** encenação. O espectador não pode precisar ver duas vezes.
- **Valores:** o tempo de ler em voz alta três vezes (AB). A memória da casa tem uma regra mais
  operacional: 1 s + 3 palavras/s.
- **Sinal de erro:** a tagline sai antes de terminar de ser lida.
- **Fonte:** AB e a memória `video-texto-sobreposto-didatico`.

**R18. Encenação: longe pra ação grande, perto pra detalhe, sujeito no centro ou no terço.**
- **Por quê:** controle do olhar.
- **Valores:** ação principal no centro ou num terço, espaço livre na direção do olhar ou do
  movimento (AB). Close para textura/botão, aberto para o produto inteiro no fim (KZ).
- **Sinal de erro:** dois elementos disputando o olhar, ou o produto colado na borda do lado pra
  onde anda.
- **Fonte:** AB, KZ.

**R19. Confira arcos na tela, não no mundo.**
- **Por quê:** com câmera e produto se movendo, o que importa é o desenho no quadro.
- **Valores:** motion path em espaço de câmera (PP2). Por script dá pra projetar a posição do
  produto na câmera quadro a quadro com `world_to_camera_view` `[conhecimento geral]`.
- **Sinal de erro:** o produto desenha um zigue-zague ou um "cotovelo" na tela.
- **Fonte:** PP2.

**R20. Exagero proporcional à velocidade.**
- **Por quê:** num movimento rápido o olho só pega um quadro extremo.
- **Valores:** empurrar até passar do ponto e voltar (AB). Microantecipação de 1 a 2 quadros
  (PP1).
- **Sinal de erro:** o "pop" do produto que ninguém nota.
- **Fonte:** AB, PP1.

### 2.2 Conflitos entre as fontes

1. **Câmera LINEAR (KZ) × câmera com ease (GK, BtB).** O KZ manda LINEAR em todas as chaves de
   câmera. O GK e o BtB esculpem ease forte nas transições.
   - **Resolução:** não brigam, servem a coisas diferentes. Dentro de um plano que é cortado nas
     duas pontas, LINEAR evita frear no corte (R4/R5). Transição sem corte aparente pede ease
     espelhado (R7). Plano isolado com início e fim visíveis (abertura, plano final) pede ease
     `[conhecimento geral]`.
   - A emenda LINEAR → ease cria lombada se o ease começar do zero (R8).
2. **Interpolação padrão:** Linear (DK, pra wipe) × Constant (CB, pra blocking) × Bézier (padrão do
   Blender). No script não existe padrão: **declare a interpolação em toda chave**.
3. **Corte na mesma cena (KZ e BtB, câmeras amarradas a marcadores) × cenas separadas montadas no
   AE (GK, PNG com alpha) × corte no escuro de uma luz (OM).**
   - Pro Claude, a mesma cena com marcadores é a mais auditável (um render só, sem editor externo).
   - Cenas separadas são melhores quando cada produto tem luz e set próprios.
4. **Twinning:** evitar (AB, PP1) × simetria intencional comunica força e controle (PP1).
   - Em produto premium, simetria de câmera e timing pode ser escolha de marca.
   - Em cascata de elementos, quebre por 1 a 2 quadros `[conhecimento geral]`, que é o mesmo número
     do PP1 pra pés.
5. **Câmera ortográfica (WM, mograph 2D) × perspectiva (todos os de produto).** Ortográfica só pra
   grafismo chapado. Produto sempre em perspectiva.
6. **Normalize:** BK quer sempre ligado, CB usa quando precisa. Pra script não importa. Pra
   análise numérica use os valores reais (o normalize engana sobre a amplitude).

### 2.3 Do antigo para o 5.2

| Nos vídeos (antigo) | No Blender 5.2 por Python |
|---|---|
| `obj.animation_data.action.fcurves` | **Não existe.** `anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot).fcurves` |
| T > Linear / Bézier / Constant / Bounce | `kp.interpolation = 'LINEAR' \| 'BEZIER' \| 'CONSTANT' \| 'BOUNCE' \| 'EXPO' \| 'BACK' \| 'ELASTIC' ...` mais `kp.easing = 'AUTO' \| 'EASE_IN' \| 'EASE_OUT' \| 'EASE_IN_OUT'`. Vale pro trecho que **começa** na chave |
| Arrastar handle na horizontal (GK) | `kp.handle_right_type = 'FREE'` (ou `'ALIGNED'`) e depois `kp.handle_right = (x, y)` |
| V > Auto Clamped / Vector | `kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'` ou `'VECTOR'`, depois `fc.update()` |
| S 0 no handle (CB) | handles `'VECTOR'` na chave de contato (ou FREE com handles sobre a própria chave) |
| Ctrl+B na timeline | `m = scene.timeline_markers.new("c2", frame=50); m.camera = cam2` `[conhecimento geral; verificar na sonda]` |
| Shift+E Make Cyclic | `fc.modifiers.new('CYCLES')` `[conhecimento geral]` |
| Painel N > Modifiers > Noise | `mod = fc.modifiers.new('NOISE')`: `scale`, `strength`, `phase`, `offset`, `depth`, `blend_type`, `use_restricted_range`, `frame_start`, `frame_end`, `blend_in`, `blend_out` `[conhecimento geral; verificar na sonda]` |
| Stepped (animar "em dois") | `fc.modifiers.new('STEPPED')` com `frame_step = 2` `[conhecimento geral]` |
| Filmic + High Contrast (OM) | **AgX** + look `'AgX - High Contrast'` (ou `'AgX - Punchy'`). Não troque pra Standard/Filmic |
| EEVEE "Blend Mode: Alpha Clip/Alpha Blend" (DK, WM) | O EEVEE novo usa `material.surface_render_method = 'DITHERED'` ou `'BLENDED'` `[conhecimento geral; verificar na sonda]` |
| Bloom do EEVEE legado (GKt) | Não existe no EEVEE novo. Use o nó **Glare** no compositor, que mora em `scene.compositing_node_group` (não em `scene.node_tree`). O Glare ganhou modo Bloom e parâmetros como sockets nas versões 4.x/5.x `[verificar na sonda]` |
| "Use Nodes" no compositor (DK) | `scene.compositing_node_group` (um `CompositorNodeTree`) |
| `BLENDER_EEVEE_NEXT` | `'BLENDER_EEVEE'` |
| Only Show Selected F-Curve Keyframes no menu View | Agora nas Preferências > Animação (CB). Irrelevante pra script |
| Light linking (BtB) | `obj.light_linking.receiver_collection` / `blocker_collection` |
| DoF com objeto de foco (KZ) | `cam.data.dof.use_dof`, `focus_object`, `aperture_fstop`, `aperture_blades`, `aperture_ratio` |
| Motion path em espaço de câmera (PP2) | Existe na UI 4.x. Nome da propriedade em Python `[verificar na sonda]` |

---

## 3. Tabela de timing (30 fps)

Valores **das fontes** em quadros como foram dados. Quando o fps original não foi dito, a coluna
"a 30 fps" mantém a mesma duração em segundos supondo 24 fps no original. O que é meu está
marcado.

| Ação | Fonte (quadros, fps) | A 30 fps | Observação |
|---|---|---|---|
| Passagem de luz revelando o produto (rim light) | 30 q a 30 fps (OM) | **30 q** (1 s) | Começou com 60 e ele achou longo. Chave extra no q11 pra desacelerar sobre o produto |
| Transição de órbita entre planos (saída + entrada) | 20 q, 40° (BtB, fps não dito) | **20 a 25 q** | 15 q/30° foi curto demais pra ele. Corte no meio |
| Saída ou entrada de transição (cada metade, versão cenas separadas) | 30 q a 30 fps, deslocada ±5 (GK) | **30 q** | Saída 120→150, entrada 1→30 |
| Tempo do plano antes da transição começar | 40 q (BtB) | **40 a 50 q** | |
| Duração total de um plano na montagem rápida | 50 q (BtB) | **50 a 62 q** | |
| Plano guiado pela música | ~44 a 45 q (KZ, provável 24 fps) | **~55 q** (~1,8 s) | Na prática manda a batida |
| Plano final (produto inteiro, flyby) | ~200 q (KZ, q181→380) | **~250 q** (~8 s) | O plano mais longo fecha o filme |
| Cena de produto com movimento completo | 150 q a 30 fps (GK) | **150 q** (5 s) | Push-in de 10 cm na cena inteira |
| Drift contínuo entre transições | 10° em 30 q (BtB) | **10° em 30 a 38 q** | Garante que a câmera não para |
| Troca de luz escondida | 1 q, no quadro do corte (KZ) | **1 q** | Chave em corte-1 e no corte |
| Rack focus como transição | 1 plano (~44 q, KZ) | **~55 q** | Foco de colado na câmera até o sujeito |
| Wipe gráfico de logo (glitch) | 40 q, linear (DK) | **40 q** | |
| Wipe de painel dividido | 20 q (WM) | **20 q** | O autor admite não dominar timing |
| Espiral 360° (screw) | 60 q (WM) | **60 q** | |
| Mudança de cor de fundo no corte | 30 q, centrada no corte (GK, AE a 30 fps) | **30 q** (15 + 15) | |
| Deslocamento de cascata entre elementos | "alguns quadros" (WM); 5 q (GK, no corte) | **2 a 5 q** `[conhecimento geral]` | |
| Microantecipação | 1 a 2 q (PP1) | **1 a 2 q** | Acima de uma antecipação normal |
| Defasagem anti-twinning | 1 a 2 q (PP1) | **1 a 2 q** | |
| Bola: parede → chão → topo → parede | q10, q22, q26, q30 (PP1, provável 24) | 12 → 28 → 33 → 38 | Mostra spacing: subida do chão ao topo em 4 q |
| Texto/tagline na tela | ler 3× em voz alta (AB) | **30 + 10 q por palavra** (memória: 1 s + 3 palavras/s) | Use a regra da casa como piso |
| Escada de significado (AB) | 0 a 10 intermediários | 0 q = impacto; 1 a 2 q = pancada/tique; 3 a 5 q = gesto direcionado; 6 a 8 q = interesse; 9 a 10 q = calma | Leitura "um intermediário = um quadro" é suposição minha `[conhecimento geral]` |
| Produto assentando com overshoot (settle) | sem fonte | **12 a 18 q** `[conhecimento geral]` | |
| Hold final de logo/packshot | sem fonte | **45 a 90 q** `[conhecimento geral]` | Respiro antes do fim |
| Turntable 360° de produto | sem fonte | **240 a 360 q** (8 a 12 s) `[conhecimento geral]` | Mais rápido que isso vira giro de vitrine barata |
| Whip pan (giro rápido de câmera) | sem fonte | **6 a 10 q** `[conhecimento geral]` | Com motion blur |

---

## 4. Vocabulário de movimentos de câmera

O "o que comunica" é `[conhecimento geral]` salvo quando indicado. O "como montar" usa o rig da R2
quando cabe.

| Movimento | O que comunica | Como montar no Blender |
|---|---|---|
| **Push-in (dolly in)** | Aproximação, importância, "olha isso" | Câmera anima o Y local (filha do empty), poucos cm por segundo (GK: 10 cm em 150 q). LINEAR se o plano é cortado, ease se é o plano de abertura |
| **Pull-out (dolly out)** | Revelação do contexto, fechamento | Inverso do push-in. O KZ faz "pan out" puxando G Z no eixo local. Saída de transição do GK: recuo de 40 cm em 30 q |
| **Truck (deslize lateral)** | Varredura de detalhe, leitura de texto gravado | Câmera anda no X (KZ desliza pelas letras em relevo). Alvo em Track To fixo ou ausente, conforme queira paralaxe |
| **Pedestal / crane (sobe e desce)** | Grandiosidade, mudar de "olho no olho" pra "visto de cima" | Câmera anda em Z. KZ sobe um pouco no plano aberto de cima |
| **Órbita (arc)** | Volume do produto, ourivesaria, "dá a volta nele" | Rotação Z do `Empty Main` com a câmera parenteada (BtB, GK). Ângulo pequeno por plano (10° a 40°) |
| **Tilt over (inclinação por cima)** | Transição de "frente" pra "cima" do objeto | Rotação X do `Empty Camera` (GK: até -90° na saída, 105° → 15° na entrada) |
| **Flyby** | Velocidade, final heroico | Deslocamento grande em X + Z com Track To no centro (KZ, plano final de ~200 q) |
| **Rack focus** | Mudar o assunto, transição suave, revelar textura | `dof.focus_object` = empty, animar o empty de perto da câmera até o sujeito (KZ). f-stop baixo pra o efeito ler (valor sem fonte, ver receita 5) |
| **Whip / giro de transição** | Energia, troca de assunto sem corte aparente | Saída com ease-in e entrada com ease-out espelhadas, corte no pico, motion blur (GK, BtB) |
| **Câmera na mão (handheld)** | Realismo, urgência, "filmado" | Noise nas curvas de rotação/posição com restrição e blend (RK, BK) |
| **Turntable** | Catálogo, vitrine | Objeto ou empty girando em LINEAR com modificador Cycles. Câmera parada ou com drift mínimo `[conhecimento geral]` |
| **Plano de cima ortográfico** | Grafismo, layout, "motion design" | `cam.data.type = 'ORTHO'`, câmera em vista de topo (WM) |
| **Zoom (mudar a lente)** | Estranhamento, ênfase "televisiva" | Animar `cam.data.lens`. Nenhuma fonte usa. Prefira dolly `[conhecimento geral]` |
| **Dolly zoom (vertigo)** | Choque, revelação dramática | Dolly pra trás e lente aumentando ao mesmo tempo pra manter o tamanho do sujeito. Sem fonte `[conhecimento geral]` |
| **Roll (rotação no eixo da lente)** | Dinamismo, desequilíbrio | Rotação no Z local da câmera, poucos graus. Sem fonte `[conhecimento geral]` |
| **Luz que anda (câmera parada)** | Revelação premium, "brilho correndo" | Rig de luz: empty pai girando (KZ) ou par espelhado por Copy Location invertido (OM) |

**Lentes citadas nas fontes:** 35 mm (rig orbital, GK), 43 mm (close de botões, KZ), 90 mm
(produto inteiro com fundo infinito, BtB). **Nenhuma fonte deu f-stop.**

---

## 5. Transições sem corte (ou com corte invisível)

Honestidade: as técnicas 1 a 4 **têm** corte, mas o corte some no borrão, no escuro ou no
desfoque. As técnicas 6 a 9 são transições de verdade dentro de um plano.

### 5.1 Órbita espelhada com corte no pico (BtB)
1. Câmera A filha do empty A, câmera B filha do empty B, os dois no mesmo timeline.
2. A: push-in de entrada (q1 → q40), depois **saída**: empty A Z de 0° → +40° nos q40 → q60, com
   ease-in-out de handles longos.
3. B: **entrada** com empty B Z de -40° → 0° nos q40 → q60, com o mesmo easing. Depois drift +10°
   até o q90, e saída de +40° (q90 → q110).
4. Marcadores: q1 → câmera A, **q50 → câmera B** (o meio, velocidade máxima).
5. A emenda q60 (fim da entrada) → drift precisa de tangente contínua (R8).
6. Motion blur ligado.
- **Resultado:** o espectador vê A acelerando até o meio e B desacelerando a partir dele, como um
  único giro.

### 5.2 Órbita/tilt/dolly entre cenas separadas (GK)
1. Cada cena com o rig de 3 níveis.
2. **Saída** (últimos 30 q da cena): a chave inicial ganha o handle direito esticado na horizontal
   até o quadro da chave final (ease-in máximo). Desloque as duas chaves +5 q.
3. **Entrada** (primeiros 30 q da cena seguinte): a chave final ganha o handle esquerdo esticado
   até o quadro da chave inicial (ease-out máximo). Desloque -5 q.
4. Mesma direção e magnitude: órbita +90°/+90°, tilt para baixo/para baixo, dolly de recuo/recuo.
5. Render PNG com alpha e motion blur. Junte as sequências uma depois da outra no editor e mude a
   cor do fundo em 30 q centrados no corte.

### 5.3 Corte pelo escuro (OM)
1. Mundo preto, força 0, luz de área como rim.
2. A luz entra, revela e sai: q1 escuro → q30 escuro (1 s a 30 fps).
3. Renderize produto A e produto B com a mesma passagem.
4. Corte quando a tela está escura. A passagem da luz faz a ponte.

### 5.4 Rack focus como ponte (KZ)
1. Plano novo começa com o empty de foco colado na câmera: tudo borrado.
2. Anime o empty até a superfície-alvo ao longo do plano.
3. O plano anterior pode terminar com foco indo pra longe `[conhecimento geral]`, e o corte cai no
   borrão.

### 5.5 Troca de luz no quadro do corte (KZ)
1. Rig de luz no empty pai.
2. Chave de rotação no quadro do corte menos 1 (valor antigo) e no quadro do corte (valor novo).
3. Não é transição em si, é o que deixa a transição limpa: cada ângulo nasce com a luz certa.

### 5.6 Wipe de glitch por shader (DK)
1. Material: Mix Shader (Transparent / Emission), fator = Gradient (Object coords) → ColorRamp.
2. Glitch: Voronoi 4D F2, randomness 0, W ajustado. Largura da faixa por Mix Color com Object.
3. Faixas RGB na borda: ColorRamp em Constant.
4. Anime o X do Mapping do gradiente em **40 q LINEAR**, do lado invisível ao visível.
5. Compositor: Glare (streaks 2, iterações 3), Lens Distortion com dispersion e jitter.

### 5.7 Troca de textura por empty (GKt)
1. Dois Principled num Mix, fator = Noise 4D → ColorRamp, combinado com Gradient por Mix Color.
2. Texture Coordinate em modo Object apontando pro empty.
3. Borda: Emission amarela forte num segundo Mix.
4. Anime o empty em X (ou rotação/escala). A transição atravessa o produto.

### 5.8 Painéis em cascata / painel dividido (WM)
1. Câmera ortográfica de cima. Plano maior que o quadro, cortado ao meio, metades parenteadas a um
   empty.
2. Metades saem do quadro até o q20.
3. Duplique com outra cor (análogas), desloque as chaves de cada camada alguns quadros e alinhe os
   finais.
4. Versão em cascata: 5 planos com Hook de forças diferentes pra um único empty animado.

### 5.9 Fade por shader (WM)
1. Mix Emission/Transparent com fator 0 → 1 animado.
2. Material single-user em cada cópia pra timings independentes.

---

## 6. Receitas para testar no Blender 5.2

Bloco comum (cole antes de qualquer receita):

```python
import bpy, math
from bpy_extras import anim_utils

scene = bpy.context.scene
scene.render.fps = 30
scene.render.use_motion_blur = True          # R5
scene.render.motion_blur_shutter = 0.5

def fcurve(obj, path, index):
    ad = obj.animation_data
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    return cb.fcurves.find(path, index=index)

def key(obj, path, index, frame, value, interp='BEZIER', easing='AUTO'):
    getattr(obj, path)[index] = value
    obj.keyframe_insert(path, index=index, frame=frame)
    fc = fcurve(obj, path, index)
    for kp in fc.keyframe_points:
        if int(round(kp.co.x)) == frame:
            kp.interpolation = interp      # vale pro trecho que COMEÇA nesta chave
            kp.easing = easing
            return kp

def stretch_out(kp_a, kp_b):
    """Ease-in máximo (GK): handle direito de A na horizontal até o quadro de B."""
    kp_a.handle_right_type = 'FREE'
    kp_a.handle_right = (kp_b.co.x, kp_a.co.y)

def stretch_in(kp_a, kp_b):
    """Ease-out máximo (GK): handle esquerdo de B na horizontal até o quadro de A."""
    kp_b.handle_left_type = 'FREE'
    kp_b.handle_left = (kp_a.co.x, kp_b.co.y)

def bind(cam, frame, name):
    m = scene.timeline_markers.new(name, frame=frame)
    m.camera = cam                            # [verificar na sonda]
```

### Receita 1: rig orbital de três níveis (GK)
1. `Empty Main` (esfera) na base do produto. `Empty Camera` (esfera) filho dele, Z ajustado à
   altura do centro do produto. Câmera filha do `Empty Camera` a **Y = -0,50 m**, rotação
   (90°, 0, 0) pra olhar pro empty, **lens = 35**. Escala dos empties = 1.
2. Cena de **150 q**. Câmera `location[1]`: -0,50 (q1) → -0,40 (q150), LINEAR.
3. `Empty Camera` `rotation_euler[0]`: -30° (q1) → 5° (q150), BEZIER.
4. `Empty Main` `rotation_euler[2]`: -30° (q1) → 20° (q120) → **110° (q150)**.
5. Saída: `stretch_out(kp120, kp150)` e depois desloque as duas chaves +5 q (`kp.co.x += 5`,
   `kp.handle_left.x += 5`, `kp.handle_right.x += 5`).
6. **Conferir:** renderizar os q1, 75, 140 e 150. No q150 o quadro deve estar borrado de
   movimento, e em nenhum quadro de 1 a 120 a câmera parece parada.

### Receita 2: transição por órbita espelhada na mesma cena (BtB), versão handles
1. Empty A e câmera A (lens **90**) apontando pro produto. Empty B e câmera B apontando pra outra
   área do produto.
2. Câmera A, push-in: `location` local Y de -0,15 m mais longe (q1) → posição final (q40).
3. Empty A Z: 0° (q40) → **+40° (q60)**. Handles FREE com comprimento horizontal de **~60% do
   trecho** nas duas pontas (equivale ao "escalar handles em X" do BtB) `[valor de partida meu]`.
4. Empty B Z: **-40° (q40) → 0° (q60)**, mesmo formato. Depois **+10° (q90)** e **+50° (q110)**.
5. `bind(camA, 1, "A")` e `bind(camB, 50, "B")`.
6. Na chave q60 do empty B: `handle_left_type = handle_right_type = 'AUTO_CLAMPED'` e depois
   `fc.update()` (tira a lombada, R8).
7. **Conferir:** rodar a auditoria da receita 12 nos q40 a q110. A velocidade no q49 (câmera A) e
   no q50 (câmera B) deve ser parecida, e nenhuma velocidade zero entre o q50 e o q110.

### Receita 3: a mesma transição com easing nativo (teste A/B contra a receita 2)
1. **Variante A (sobreposta, corte no meio):** empty A q40 → q60 com `interp='EXPO'`,
   `easing='EASE_IN_OUT'`. Empty B igual, de -40° → 0°. Corte no q50.
2. **Variante B (sequencial, estilo GK):** empty A de 0° → 40° nos q30 → q50 com `'EXPO'`,
   `'EASE_IN'` (velocidade máxima no fim). Empty B de -40° → 0° nos q50 → q70 com `'EXPO'`,
   `'EASE_OUT'` (velocidade máxima no começo). Corte no q50.
3. Testar também `'QUART'` e `'CUBIC'` no lugar de `'EXPO'`. EXPO deve ser o mais "whip", CUBIC o
   mais macio `[conhecimento geral]`.
4. **Conferir:** comparar as três (handles, A e B) renderizando q44 a q56 em sequência. A melhor é
   a que parece um gesto só.

### Receita 4: multi-câmera guiada por música (KZ)
1. Áudio no sequencer (`scene.sequence_editor`) e marcadores nos picos. No exemplo: **1, 48, 92,
   137, 181, 225, fim 380** (refazer conforme a música).
2. Por plano: câmera nova + empty esfera "FPn" + `Track To` (`TRACK_NEGATIVE_Z`, `UP_Y`) +
   `dof.use_dof = True` e `dof.focus_object = FPn`.
3. Cada plano tem **um** movimento, chaves só em `location` e **LINEAR**. Deslocamentos pequenos:
   ~5 a 10% da distância câmera-produto `[conhecimento geral]`.
4. Close dos botões com **lens 43**.
5. `bind(camN, frame_do_marcador, "N")`. Reaproveite câmeras em marcadores posteriores.
6. Rig de luz: empty pai de todas as luzes, rotação Z leve (~5° a 10° `[conhecimento geral]`) nos
   planos de deslize.
7. Troca de luz: chave no quadro do corte menos 1 (valor atual) e no quadro do corte (novo valor).
   A chave do corte-1 com `interp='CONSTANT'` resolve num quadro.

### Receita 5: rack focus de transição (KZ)
1. Câmera do close com `dof.use_dof = True`, `focus_object = FP`.
2. `aperture_fstop = 1.4` a `2.0` pra o desfoque ler `[conhecimento geral; nenhuma fonte deu
   f-stop]`. `aperture_blades = 7` `[conhecimento geral]`.
3. FP a ~2 cm da câmera no primeiro quadro do plano → na superfície do tecido no último quadro.
   BEZIER com `EASE_OUT` (chega e assenta) `[conhecimento geral]`.
4. **Conferir:** primeiro quadro sem nenhuma área nítida, último quadro com a trama nítida.

### Receita 6: revelação por passagem de luz (OM)
1. `world` preto, força 0. View transform **AgX**, look `'AgX - High Contrast'` (não Filmic).
2. Luz de área `RECTANGLE` (size X > size Y), girada pra raspar a borda do produto, cor azulada
   (`use_temperature` com temperatura alta, ex. 9000 K `[conhecimento geral]`).
3. Luz espelho: constraint `COPY_LOCATION` com alvo na primeira, `invert_z = True` (o eixo da
   passagem) e `use_offset = True`.
4. Luz principal Z: fora (escuro) no q1 → fora do outro lado no **q30**. Chave extra no **q11**
   (onde começa a tocar o produto), com handles achatados, ou seja, o trecho q11 → q20 avançando
   pouco `[valor q20 meu]`.
5. Compositor (`scene.compositing_node_group`): Glare tipo Fog Glow, tamanho 6 (ou o equivalente no
   5.2) `[verificar na sonda]`.
6. **Conferir:** o produto deve ficar iluminado por pelo menos 8 a 10 quadros, nunca um clarão de
   um quadro.

### Receita 7: câmera na mão sutil (RK, BK)
1. Na câmera (ou no `Empty Camera`): `rotation_euler[0]` e `[2]` com modificador NOISE.
2. Parâmetros de partida: `scale = 25`, `strength = 0.006` (rad, ~0,35°), `phase` diferente em cada
   eixo (ex. 0 e 7), `depth = 1` `[conhecimento geral, as fontes não dão valores]`.
3. `use_restricted_range = True`, `frame_start`/`frame_end` no plano desejado,
   `blend_in = blend_out = 10` q.
4. Em close macro, metade da força `[conhecimento geral]`.
5. **Conferir:** o produto não sai do terço onde foi posto. Se sair, a força está alta.

### Receita 8: pouso com parada seca e overshoot controlado (CB, AB, PP1)
1. Produto Z: alto (q1) → chão (q12), interp `'QUAD'` ou `'CUBIC'` com `easing='EASE_IN'`
   (acelera até o chão, R9).
2. Na chave do contato (q12): handles `'VECTOR'`.
3. Squash no rig de base (empty com pivô no chão): escala Z 0,9 / XY 1,05 no q12 → 1,0 no q16,
   conservando volume (AB) `[valores meus]`.
4. Alternativa pra assentar com overshoot: trecho q12 → q24 com `'BACK'` e `easing='EASE_OUT'`
   (passa um pouco e volta) `[conhecimento geral]`.
5. **Conferir:** nenhum quadro antes do contato com velocidade menor que o anterior.

### Receita 9: turntable em loop (BK)
1. Empty pai do produto: Z 0° (q1) → 360° (q301), `'LINEAR'`.
2. `fc.modifiers.new('CYCLES')`.
3. Câmera parada com drift de push-in de 3 a 5% em LINEAR `[conhecimento geral]`.
4. **Conferir:** q1 e q301 idênticos, sem soluço no loop.

### Receita 10: wipe de painéis em cascata (WM)
1. Câmera `ORTHO` de topo. 5 planos colados, cada um com vertex group nos 2 vértices de cima e
   Hook pra um único empty, com strengths 1,0 / 0,8 / 0,6 / 0,4 / 0,2 `[valores meus]`.
2. Empty: posição "escondido" (q1) → "mostrado" (q20).
3. Variante de cor: duplicar com cor análoga e deslocar as chaves 3 q por camada, mantendo os
   finais próximos (R16).
4. Interp `'QUART'` `EASE_OUT` pro painel chegar rápido e assentar `[conhecimento geral]`.

### Receita 11: transição de textura por empty (GKt)
1. Material com Mix Shader entre dois Principled. Fator = Mix Color (A = Noise 4D → ColorRamp, B =
   Gradient), Texture Coordinate `object = empty`.
2. Segundo Mix com Emission (amarela, força 20 `[valor meu]`) usando o mesmo ramp, pra borda
   brilhar.
3. Empty X: um lado do produto (q1) → outro lado (q40) em LINEAR (R15).
4. Glare no compositor no lugar do bloom legado.

### Receita 12: auditoria numérica da curva (anti-"movimento de software")
```python
def audit(obj, path, index, f0, f1, cuts=()):
    fc = fcurve(obj, path, index)
    vals = [fc.evaluate(f) for f in range(f0, f1 + 1)]
    vel = [b - a for a, b in zip(vals, vals[1:])]
    out = []
    for i in range(1, len(vel)):
        f = f0 + i
        if vel[i - 1] * vel[i] < 0:
            out.append(f"q{f}: inverte direção (overshoot ou lombada?)")
        if abs(vel[i]) < 1e-5 and abs(vel[i - 1]) > 1e-4:
            out.append(f"q{f}: câmera PAROU")
    for c in cuts:
        i = c - f0
        if 0 < i < len(vel):
            out.append(f"corte q{c}: velocidade {vel[i-1]:.4f} -> {vel[i]:.4f}")
    return out
```
- **Use em toda câmera antes de renderizar.** Parada não intencional reprova (R4), inversão fora
  de um BACK proposital reprova (R8), e a velocidade no corte tem que ser alta (R5).
- No corte entre duas câmeras, compare a velocidade angular do empty A no corte-1 com a do empty
  B no corte. A diferença deve ficar abaixo de ~30% `[conhecimento geral]`.

---

## 7. Contribuição pro Cérebro de Diretor

Diretrizes que o Claude deve seguir sempre que montar câmera e movimento:

1. **Antes de animar, escreva a decupagem:** plano, lente, movimento único, duração em quadros,
   tipo de entrada e saída (corte seco, corte no pico, escuro, desfoque) e a batida da música, se
   houver. Sem decupagem não tem keyframe.
2. **Monte o rig antes da câmera:** empty-alvo (Track To ou pivô) e rig de 3 níveis quando houver
   órbita. Nunca rotação solta.
3. **Um gesto por plano, pequeno.** Close pede movimento menor ainda.
4. **Nenhuma velocidade zero dentro do plano**, salvo hold declarado (packshot final, texto).
5. **Corte no pico, direção conservada, easing espelhado, motion blur ligado.** É a fórmula da
   transição de produtora.
6. **Interpolação declarada em toda chave.** LINEAR pra drift cortado nas duas pontas e pra wipe
   gráfico. Ease forte pra transição e pra plano de abertura/fecho. VECTOR no contato. BACK só
   quando quiser assentar com overshoot.
7. **A luz é câmera também:** brilho correndo durante o deslize, passagem de luz desacelerada sobre
   o produto, troca de luz escondida no corte.
8. **Blocking primeiro:** chaves em CONSTANT, render de contact sheet (1 quadro a cada 5 a 10),
   aprovação, depois spline. "Todo quadro tem que fazer sentido" (PP2) vira teste: amostrar
   quadros intermediários e olhar.
9. **Prova numérica antes de render:** rodar a auditoria (receita 12) em toda curva de câmera e
   luz-chave.
10. **Encenação:** produto no centro ou num terço, espaço livre na direção do movimento, aberto pra
    contexto e close pra detalhe. O filme fecha no produto inteiro, num plano mais longo.
11. **Texto respeita leitura** (regra da casa, 1 s + 3 palavras/s), título antes da ação.
12. **Organicidade dosada:** ruído com janela e blend, nunca constante do primeiro ao último quadro.

**Sinais de "movimento de software" a vetar:**
- Bézier padrão em todas as chaves, freando em cada corte.
- Câmera que gira sem alvo nem motivo.
- Plano inteiro parado.
- Transição de câmera em direção oposta à do plano anterior.
- Luz estática num produto brilhante.
- Pouso que desacelera antes do chão.
- Wipe que acelera e freia no meio.
- Ruído do primeiro ao último quadro.
- Texto que sai antes de ser lido.

---

## 8. Lacunas

1. **f-stop:** nenhuma das 13 fontes dá abertura de diafragma, distância de foco ou número de
   lâminas. Os valores das receitas são meus e precisam de teste.
2. **Lente:** só três valores (35, 43, 90 mm). Falta critério de lente por tipo de plano (macro,
   médio, aberto) e por formato vertical 9:16.
3. **fps:** dois vídeos-chave (KZ e BtB) não dizem o fps. As durações foram convertidas supondo 24.
4. **Amplitude de câmera na mão:** RK e BK mostram o Noise, mas não dão valores de scale e
   strength pra câmera de produto.
5. **Follow Path / câmera em curva**, speed ramp, dolly zoom, zoom e roll: nenhuma fonte cobre.
6. **Settle e overshoot de produto** (o "pousar com peso"): só princípios gerais (AB, CB), nenhum
   valor de quadros ou amplitude.
7. **Nenhuma fonte é Blender 5.2.** Nomes a confirmar por sonda:
   - `TimelineMarker.camera`;
   - parâmetros do modificador NOISE;
   - `surface_render_method`;
   - parâmetros do nó Glare no 5.2;
   - propriedade do motion path em espaço de câmera.
8. **Sincronia com som** além de marcador no pico (whoosh na transição, hit no pouso): não
   abordado.
9. **Composição em 9:16 e safe zones de rede social:** nenhuma fonte trata. Todas são 16:9.
10. **Os 12 princípios** chegam por AB e PP1 voltados a personagem. A tradução pra câmera e produto
    (antecipação de câmera, follow-through de câmera) é inferência minha. Ninguém mostra uma câmera
    com antecipação explícita (recuo de poucos quadros antes de um push-in), e vale testar.
