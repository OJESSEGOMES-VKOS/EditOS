# Destilado: DIREÇÃO (processo, storyboard, princípios, animação de produto)

Fonte: 12 transcrições `direcao__*` em `pesquisa/transcricoes/`. Legenda automática interpretada.
Corrigido contra `.claude/skills/estudio-3d/referencias/blender-5.2-verdade.md`.
O que vem de mim e não dos vídeos está marcado **[conhecimento geral]**.

Ranking rápido de utilidade pro nosso problema (vídeo comercial que hoje sai "sem vida"):
1. Kaizen (CTq1-fOARWA) e Derek Elliott (lZPedlX6CMw): os dois mais valiosos. Processo real de produto.
2. Arthur Whitehead (sPwcnNh2DmA), Smeaf (H6tblQaWx0I), Pierrick Picaut (KNZ0x1bXwNs), Nowack (9DhC0QYij5I).
3. O resto é base conceitual ou fraco.

---

## 1. Por vídeo

### 1.1 I Hired 3D Artists to make the SAME Animation in Blender
- Canal: Kaizen · https://youtu.be/CTq1-fOARWA · **Nota 5/5** · Blender (versão não dita)
- É uma aula de crítica: três freelancers (US$ 160 a 180 cada) animam o mesmo gadget com o mesmo
  modelo, briefing e trilha. Os defeitos apontados são exatamente os nossos.
- **Defeito 1, a mesmice:** dois dos três fizeram o MESMO plano de abertura (laranja e branco, frontal).
  Sem câmera com perspectiva, o plano frontal "fica chapado". Ângulo de 3/4 com perspectiva resolve.
- **Defeito 2, detalhe perdido:** "nunca perca detalhe do produto". Suba a luz até o produto inteiro ler.
  Luz alaranjada e ângulo pouco lisonjeiro escondendo a porta USB-C é erro: chegue perto, de lado.
- **Defeito 3, fundo incoerente:** um plano com cenário diferente dos outros quebra a peça. O fundo
  (a superfície onde o produto pousa) precisa se repetir entre os planos.
- **Defeito 4, o movimento para:** a cada gesto o objeto chega a parada total e só então começa o
  próximo. Regra dele: em animação de produto nada chega a parada total. O próximo movimento entra
  ANTES do anterior terminar (girar, e antes de parar já vem o zoom).
- **O que funcionou:** continuar a rotação de um plano no plano seguinte; botões sendo apertados
  ("deixa o aparelho tátil"); cabos de carga encaixando; nunca existir quadro parado.
- **Processo dele:** briefing → referências → storyboard rascunho. Se a trilha já existe, os picos
  (drop, "boom") viram os cortes; se não existe, a trilha é feita depois em cima da animação.
  Projeto real: 8 planos, o último é a marca.
- **No Blender:** importa a trilha, cria marcador em cada batida (tecla M sobre a timeline), cria uma
  câmera por plano e liga câmera ao marcador (Ctrl+B com a câmera ativa). A troca de câmera sai sozinha.
- **Truque do "nunca parado":** a última chave de qualquer movimento (objeto, luz ou câmera) fica DEPOIS
  do fim do plano. Assim o plano termina ainda em movimento.
- **Fluxo entre planos:** se o plano 1 entra pela esquerda, o plano 2 continua pela esquerda (fluido)
  ou opõe pela direita (choca). Manter a direção é o padrão.
- **Os 3 elementos obrigatórios de todo plano:** (1) movimento de câmera, (2) luz dinâmica,
  (3) movimento secundário sutil (rotação leve, botão clicando, peça deslizando). "Quanto mais sutil,
  melhor fica." Dá algo novo pra notar na segunda e terceira vez.
- **Fundo:** um plano atrás do produto com uma point light parentada, ligado à câmera de cada plano
  (degradê sutil controlável e animável por plano). Liga e desliga os planos de fundo por câmera.
- **Arco de cor:** quase tudo preto e branco, animação contida e muita profundidade de campo
  ("revelação misteriosa"); no final explode a cor (fundo com o laranja dos botões, cópias do corpo em
  movimento sutil), a tela acende (emissão com chave, vídeo feito no After Effects) e corte seco pra logo.

### 1.2 Product Animation in Blender: Phone
- Canal: Derek Elliott · https://youtu.be/lZPedlX6CMw · **Nota 5/5** · **Blender 2.8, EEVEE legado**
  (vários ajustes de render dele não existem mais no 5.2; ver Síntese)
- Começou pela MÚSICA. Trilha original de 20 s encomendada com "lugares bons pra sincronizar".
  A sincronia com a música é metade do "acabamento de comercial".
- Peça inteira: 20 s a 30 fps = 600 quadros. Cada plano entre batidas: **68 quadros**. Conta: olhar os
  picos da onda, decidir o corte, converter pelo fps. Alternativa: render a mais e cortar na edição.
- Os planos que dependem de sincronia fina são animados na posição real da timeline (ex.: "double
  reveal" de 205 a 271, separando os aparelhos no pico da onda; "color swaps" de 409 a 600).
- **Cenário:** fundo infinito (plano dobrado, shade smooth). **World strength 0** para controle total.
- **Primeira luz sempre uma point light** na borda do fundo infinito, forte: faz o degradê do fundo
  e serve de contraluz (recorte nas bordas quando o aparelho gira).
- **Chão:** especular baixo, roughness 0,9, quase branco (não branco total, pra a luz poder subir).
- **Lente: 80 a 82 mm** para tirar a distorção de perspectiva do produto. Câmera afastada.
- **Luzes de área em disco**, várias, potência alta ("vocês deixam o valor baixo demais, não custa
  nada subir"). Objetivo: nada estourado e nada escuro. Lado escuro? Duplica uma luz e gira.
  Luz menor = reflexo mais nítido. Luz extra embaixo só no plano em que a base aparece.
- **Produto liso (telefone) não tem interesse próprio: a luz é o que dá interesse.** O reflexo que
  passa pela logo e pela lente durante o giro é o espetáculo.
- **Luzes paradas, objeto mexendo** (imita estúdio real). E usar quase as mesmas luzes em todos os
  planos, pra aprender o que cada uma faz.
- **Plano flutuante:** rotação e translação com interpolação **linear** (atravessa o quadro a
  velocidade constante, "flutuando"). Foco num empty animado junto, também linear.
- **Profundidade de campo:** f-stop baixo demais "é exagero"; usou **f/4** no geral e um pouco menor
  no plano fechado das lentes.
- **Ação que encaixa:** interpolação **quadrática com ease out** (T → Quadratic, Ctrl+E → Ease Out):
  sai rápido e assenta. Exponencial dá um giro mais rápido; ele prefere quadrática, "mais estável".
- **Vista explodida das câmeras:** separa as peças (L, P), parenta ao corpo, chave final no lugar
  certo, chave inicial deslocada em Y; uma peça que atravessa ganha também um pouco de Z.
- **Botão de trava:** shape key de 0 a 1 em poucos quadros, exatamente na batida.
- **Composição:** guia de terços ligado na câmera. Deixar o produto fora do centro em alguns planos
  pra sobrar espaço de texto.
- **Troca de cor:** duas RGB no material do chão alternando; chave de cor com salto de 1 quadro
  (troca instantânea). Mix Shader entre plástico laranja e metal, com chave no fator. Final: uma caixa
  que estava fora de quadro "bate" de cima na última batida.
- **Lição de rig:** dois objetos em ângulo esquisito? Parenta num empty e anima o empty (menos curvas).
- Saída: FFmpeg QuickTime, qualidade "perceptually lossless".

### 1.3 3D Product Commercial Tutorial | C4D & Octane
- Canal: Arthur Whitehead · https://youtu.be/sPwcnNh2DmA · **Nota 4/5** · Cinema 4D + Octane + After Effects
- **Antes de abrir o 3D:** lista de ~10 recursos do produto que o cliente quer vender. Isso vira a
  estrutura de cenas (o que entra e em que ordem), mais a melhor transição entre cada uma.
- Look development + storyboard definem cor, estilo e ritmo antes da modelagem caprichada.
- **Animação acima de tudo:** "se a animação desaba, o resto não salva". Estrutura e ordem de cenas
  vêm antes de material bonito. O erro comum é ir direto pro brilho.
- **Curva da câmera:** sempre lento → rápido → lento, encadeado; foco preso a um alvo (nunca solto).
- **Continuidade de velocidade entre cortes:** se o plano A acelera no fim, o plano B começa acelerado.
  Corte entre um fim rápido e um início lento é o que deixa a peça incongruente.
- **Animar o null, não a geometria:** a peça mora dentro de um null; a chave vai no null. Trocar o
  modelo não quebra a animação. Um arquivo-mestre do modelo referenciado em todas as cenas (xref).
- Render do produto e do fundo separados, profundidade de campo aplicada na pós (economia de amostras
  e menos fireflies). Render cru propositalmente chapado, contraste e cor na pós.
- **Armadilha nº 1 apontada:** render subexposto. Ele sempre sobe a exposição do produto na pós.
- Partículas na pós seguindo os dados da câmera 3D, pra dar profundidade.
- Material: branco brilhante simples; o detalhe caro foi um metal com riscado **radial** (anisotropia
  em círculo) pra criar a linha de brilho que corre enquanto produto e câmera giram.
- Luzes de estúdio em degradê + HDRI de céu só no fundo. 45 s, cortes na batida.

### 1.4 Pro Animation Is EASY Now (Try This!)
- Canal: Smeaf · https://youtu.be/H6tblQaWx0I · **Nota 4/5** · Blender 3.x (2023)
- Três planos de um teclado mecânico; mostra que "plano difícil" é truque simples.
- **"Líquido" sem simulação:** esfera subdividida como Boolean cortando o topo do teclado; Displace
  com textura Clouds na esfera. Plano de **3 a 4 s**: esfera começa grande e intersectando, termina no
  fim do teclado escalada a zero, com uma **rotação sutil** (é a rotação que faz parecer fluido).
  Câmera acompanha com as mesmas curvas.
- **Curva em S:** todas as chaves em Bezier (T), pivô em "Individual Origins", escala (S) nas chaves
  no Graph Editor: alonga as alças de cada chave e acentua a aceleração e a frenagem.
- **Vista explodida em onda:** quadro 1 → **quadro 33**. Cada fileira de teclas termina **2 quadros**
  depois da anterior (fileira 1: 33, fileira 5: +8). Peças de baixo chegam ANTES (pés de borracha
  terminam em ~25, peso de latão em ~26). Câmera recua no 33. Depois, curvas em S em tudo.
- **Campo de instâncias:** cópias do produto como Collection Instance (leves); um empty-mestre
  gira devagar e todas giram juntas; cada cópia desce uma distância diferente (sem rigidez); o herói no
  centro gira em X. Plano em câmera lenta, sem curva trabalhada.

### 1.5 8 Tips to improve your animation fast
- Canal: Pierrick Picaut · https://youtu.be/KNZ0x1bXwNs · **Nota 4/5** · Blender (vale pra qualquer software)
- **Pose de apoio** (analogia com aresta de apoio na subdivisão): quando o bloqueio fica bom mas o
  spline "amolece", insira uma chave quase igual à pose anterior, um pouco empurrada, logo antes da
  mudança de direção. O spline mantém o estalo.
- Antecipação é pose-chave, não enfeite: carrega energia antes de soltar.
- **Impacto/contato: não desacelere antes de bater.** Curva quebrada no impacto, não suavizada.
- **Overshoot** (passar do ponto e voltar) pra ação com força.
- **Motion path é a ferramenta mais importante:** mostra espaçamento (pontos mais afastados = mais
  rápido) e arcos; procure tremidos no caminho e corrija.
- Exercício: fazer um cubo quicar só pelo Graph Editor pra entender o formato da curva.

### 1.6 5 Tips I Wish I Knew Before I Started Motion Design
- Canal: Nowack Design · https://youtu.be/9DhC0QYij5I · **Nota 4/5** · After Effects (princípios gerais)
- Regras de design gráfico valem em cada quadro: ritmo, contraste, hierarquia. Quem não compõe um
  quadro não compõe mil.
- **Tema por palavras-chave:** escolha 2 ou 3 palavras e volte a elas a cada efeito ou movimento.
  "Áspero" pede fps menor, textura, movimento picado; "tecnologia" pede movimento liso, calculado.
- **Conduzir o olhar com movimento:** a animação começa no centro e puxa para a esquerda, onde a
  próxima informação vai aparecer. Quando ela surge, o olho já está lá. Uma informação por vez.
- **Nem tudo precisa mexer.** Mexer = virar o mais importante da tela naquele instante. Animar um
  detalhe de baixa hierarquia quebra a hierarquia. Defina o foco primeiro, anime de cima pra baixo.

### 1.7 How To Storyboard For Motion Design
- Canal: Motion Array Tutorials · https://youtu.be/3k7Tj6tcUIs · **Nota 3/5** · After Effects
- Storyboard = mapa das batidas, não flipbook. Três perguntas por quadro: **o quê** (formas visíveis),
  **quando** (o que avança), **como** (transição pro próximo).
- Até um loop de 5 s precisa contar algo. Exemplo: círculo → triângulo → quadrado → barra de
  progresso → título, metáfora de "complexidade crescente" igual ao tema da aula.
- Escrever a ação ao lado do desenho é obrigatório (voz, intenção). Post-its pra reordenar.
- Depois da estrutura, quadros de estilo (style frames) no visual final antes de animar.
- Nível de detalhe proporcional a quem aprova: cliente grande pede board detalhado.

### 1.8 Beginner's Guide To Storyboarding for Animation
- Canal: Alanhuynhworks · https://youtu.be/gD2gEZWCNmo · **Nota 3/5** · (Toon Boom Storyboard Pro citado)
- Storyboard (os planos) ≠ animatic (os planos montados na timeline com tempo, música e fala).
- "Storyboard é a fase em que o erro é barato." Refazer uma cena 6+ vezes é normal.
- Estudar cinema pra aprender soluções (cita Every Frame a Painting e o livro Framed Ink, de
  Mateu-Mestre, pelo uso de massas de sombra como clareza).
- Exercício de 3 painéis sem fala: (1) detalhe em teleobjetiva pela janela de uma família feliz e
  quente; (2) plano aberto do outro lado da rua com caminhão em primeiro plano e um vulto olhando;
  (3) o vulto inteiro em sombra. Lente, primeiro plano, sombra e ORDEM de revelação criam a tensão.
- A solução criativa veio de se imaginar dentro da cena (a mão da criança que se estica pro alto).

### 1.9 10 Motion Design Principles Every Animator Needs
- Canal: Joshua Craigie · https://youtu.be/Cz-GcIITNrs · **Nota 3/5** · After Effects (logos)
- Timing e espaçamento: mesma distância a 24, 12 e 6 fps; menos quadros = mais seco.
- Easing: linear "chato", ease in, ease out, easy ease. Massa: bola de tênis (estala, quica alto),
  futebol (equilibrada), boliche (lenta, amassa mais, quica pouco).
- Antecipação de poucos quadros; arcos (plote o arco primeiro); squash and stretch contido;
  follow-through/overlap (nada para de uma vez, vale pra UI); exagero com freio;
  secundária = um movimento causando outro.
- Apelo: o mesmo diamante flutuando ganha vida com cor vibrante, **varredura de luz e brilho de
  estrela**; sem isso é "cinza flutuando". (É o retrato do nosso problema.)

### 1.10 The 12 Principles of Animation with Emanuele Colombo
- Canal: Skillshare · https://youtu.be/EqMi1AzbFqs · **Nota 2/5**
- Resumo correto dos 12 princípios de Thomas e Johnston (1981). Úteis aqui: **staging** (direcionar
  atenção ao elemento mais importante), **pose a pose** (extremos primeiro, meio depois) e **solid
  drawing** (forma com volume). Nada novo além do 1.9.

### 1.11 The Ultimate Apple Style Animation Guide
- Canal: NaughtyyJuan · https://youtu.be/5j4HmfgPCDI · **Nota 2/5** · After Effects, 2D; muita autopromoção
- Fundo branco, preto ou cinza bem claro; cores contidas. Fonte SF Pro Display: Bold no título,
  Regular/Medium no apoio. Cantos arredondados. Muito respiro, nada apertado.
- Layout centrado "pra prender o olho" (conflita com Derek e Nowack, ver Síntese).
- Animação sutil, lisa e RÁPIDA. Texto sobe com máscara; palavra por palavra em cascata (AE: Range
  Selector por palavras, forma Ramp Up, Ease High -50, Ease Low 100).
- Glassmorphism só funciona sobre fundo com conteúdo (sobre fundo liso fica invisível). Sombra muito
  sutil. Som suave acompanhando o movimento.
- Não cobre o 3D da Apple (só menciona). Serve pela gramática de texto e respiro.

### 1.12 Blender Product Design & Animation Tutorial - Apple Watch
- Canal: Aryan · https://youtu.be/ntoHWeCi3QA · **Nota 2/5 pra direção** · EEVEE legado (3.x)
- 90% é modelagem. O que interessa de direção:
- Referências: PureRef sempre por cima; buscar fotos de vários ângulos e VÍDEOS do produto (Amazon)
  antes de animar.
- **Reflexo de estúdio na tela:** fileira de área lights atrás, parentadas num empty, que desliza de
  um lado ao outro em 120 quadros (linear). O reflexo varre a tela do relógio.
- Câmera começa colada e recua em 120 quadros, linear; produto gira junto.
- **Rack de abertura:** foco na tela, f-stop muito baixo (0,2 a 0,4) no quadro 0, sobe até o quadro 40
  e o resto do relógio entra em foco. (Valor dependente da escala da cena.)
- **Revelação do fundo:** plano preto atrás + área light forte que desce de fora de quadro até
  iluminar o fundo ao longo do plano.
- Tela com vídeo como textura (Cyclic + Auto Refresh), ligado também na emissão.
- Configurações de render citadas (Bloom, AO, SSR do EEVEE) são do EEVEE legado: no 5.2 não existem
  assim (ver Síntese).

---

## 2. Síntese do tema: regras consolidadas

### R1. Comece pela lista de recursos e pela música, não pelo Blender
- **Regra:** antes de qualquer cena, liste os recursos/benefícios a mostrar (um por plano) e defina a
  trilha (ou, sem trilha, a duração e as batidas). O storyboard sai disso.
- **Por quê:** estrutura e ordem de cenas é o que separa comercial de "demo de render". Mudar no
  storyboard custa minutos; na animação, dias.
- **Valores:** ~10 recursos para 45 s (Arthur); 8 planos com a marca no último (Kaizen); 20 s, 600
  quadros, blocos de 68 quadros (Derek).
- **Sinal de erro:** planos que mostram "o produto girando" sem dizer qual recurso; ordem que poderia
  ser embaralhada sem perda.
- **Fontes:** Arthur, Kaizen, Derek, Motion Array, Alan Huynh.

### R2. Corte na batida; ligue câmeras a marcadores
- **Regra:** marcador em cada pico da trilha, uma câmera por plano, câmera ligada ao marcador.
  Eventos pequenos (botão, separação, troca de cor) caem exatamente num pico.
- **Por quê:** a sincronia "conecta com o espectador" e é o que deixa a peça com cara de produtora.
- **Valores:** quadros por batida = 60 × fps ÷ BPM [conhecimento geral]. A 30 fps e 120 BPM,
  15 quadros por batida. Shape key do botão: 0 → 1 em ~3 a 4 quadros cravados na batida.
- **Sinal de erro:** corte meio quadro antes/depois do pico; tudo acontece "no meio" entre batidas.
- **Fontes:** Kaizen, Derek, Arthur.
- **5.2:** marcador com câmera é `scene.timeline_markers.new(name, frame=N)` e `marker.camera = cam`.
  A trilha no VSE vira `scene.sequence_editor.strips.new_sound(...)` (no 5.x a coleção se chama
  `strips`; `sequences` é o nome antigo) **[conhecimento geral, confirmar por sonda]**.

### R3. Nada chega à parada total
- **Regra:** o produto, a câmera ou a luz estão sempre em movimento. O próximo gesto começa antes do
  anterior terminar. A última chave de cada movimento fica depois do fim do plano.
- **Por quê:** a parada seguida de recomeço é o "movimento de software" que denuncia amador.
- **Valores:** última chave 10 a 20 quadros além do corte [conhecimento geral, a calibrar]; sobreposição
  de gestos de ~25 a 40% da duração do gesto anterior [conhecimento geral].
- **Sinal de erro:** no Graph Editor, curvas que chegam horizontais (tangente zero) dentro do plano e
  ficam planas antes de outra subir.
- **Fontes:** Kaizen (regra central), Arthur (lento-rápido-lento encadeado), Joshua (overlap).
- **Conflito aparente:** Smeaf e Derek usam ease out que "assenta". Não é contradição: assentar no fim
  da PEÇA ou no encaixe final é permitido; no meio de um plano, o assentamento já emenda no próximo.

### R4. Escolha a curva pela intenção do plano
- **Regra:** três famílias, não uma.
  1. **Flutuação/plano de contemplação:** linear (velocidade constante), Derek e Aryan.
  2. **Encaixe/ação que chega:** quadrática ease out (sai rápido, assenta), Derek; exponencial quando
     quiser estalo mais seco.
  3. **Gesto de câmera ou objeto com peso:** Bezier em S com alças alongadas, Smeaf e Arthur.
- **Por quê:** curva padrão automática (Bezier auto, ease in-out simétrico) em tudo é exatamente o
  "movimento de software". Ver o ponto 3 da seção 4.
- **Valores (5.2):** `kp.interpolation='QUAD'; kp.easing='EASE_OUT'` (vale pro trecho que começa nessa
  chave); linear `'LINEAR'`; expo `'EXPO'`. F-curves via channelbag (`anim_utils.action_get_channelbag_for_slot`),
  `action.fcurves` não existe.
- **Sinal de erro:** tudo começa devagar e termina devagar no mesmo ritmo; um "flutuar" com ease
  (parece que freia sem motivo).
- **Fontes:** Derek, Smeaf, Arthur, Joshua, Pierrick.

### R5. Impacto não desacelera; ação forte passa do ponto
- **Regra:** contato/batida: velocidade máxima até o contato, curva quebrada ali. Ação com força:
  overshoot e volta. Antes de mudança de direção brusca, chave de apoio pra o spline não amolecer.
- **Valores:** overshoot de 3 a 8% da distância, volta em 4 a 8 quadros [conhecimento geral].
  Chave de apoio a 1 a 2 quadros antes da troca de direção, com 90 a 95% da pose [conhecimento geral,
  a partir do princípio do Pierrick].
- **Sinal de erro:** objeto "pousa" sem peso; a caixa final que deveria bater parece estacionar.
- **Fontes:** Pierrick, Joshua, Derek (caixa que "bate" na última batida).

### R6. Escalonamento (stagger) dá vida a montagens e explosões
- **Regra:** peças de um conjunto nunca se movem juntas. Offset fixo por camada, e quem tem menos
  caminho chega antes.
- **Valores:** 33 quadros de animação, +2 quadros por fileira (Smeaf); peças de baixo terminam ~8
  quadros antes das de cima. Instâncias caindo com distâncias diferentes.
- **Sinal de erro:** bloco inteiro se move rígido como um objeto só.
- **Fontes:** Smeaf, Derek (lentes), Joshua (overlap).

### R7. Todo plano tem câmera em movimento, luz viva e um movimento secundário
- **Regra:** os 3 elementos do Kaizen em todo plano. Secundário sutil e motivado (botão apertando,
  peça deslizando, tela acendendo), nunca enfeite flutuante sem causa.
- **Por quê:** é o que sustenta segunda e terceira assistida. E responde direto ao nosso defeito
  "enfeites flutuantes sem motivo": o secundário precisa ser CAUSADO pelo produto (Joshua: "um
  movimento causando outro").
- **Sinal de erro:** objetos decorativos boiando que não reagem a nada; câmera estática olhando um
  produto que só gira no próprio eixo.
- **Fontes:** Kaizen, Joshua, Nowack (nem tudo deve mexer).
- **Conflito (luz animada):** Kaizen e Aryan animam luz (luz dinâmica, rig varrendo reflexo). Derek
  evita animar lâmpada pra imitar estúdio real e faz o reflexo andar movendo o OBJETO. Resolução: o
  que o espectador precisa ver é o **reflexo correndo pela superfície**. Escolha UM mecanismo por
  plano (objeto gira sob luz fixa, ou rig de luz desliza com objeto quase parado). Os dois juntos
  viram bagunça.

### R8. Nem tudo se mexe: movimento é hierarquia
- **Regra:** antes de animar, ordene o que importa. Só o item nº 1 do momento tem o movimento maior.
- **Valores:** um foco primário por plano; secundário com amplitude ≤ 1/5 do primário [conhecimento geral].
- **Sinal de erro:** olho não sabe onde pousar; elementos menores "gritam" por estarem animados.
- **Fontes:** Nowack, Skillshare (staging), Apple Style (respiro).

### R9. Conduza o olho e a direção entre cortes
- **Regra:** o movimento de um plano aponta pra onde o próximo vai acontecer. Direção de entrada
  mantida entre planos consecutivos (esquerda segue esquerda). Velocidade casada no corte (Arthur).
- **Sinal de erro:** cada plano começa com o produto no centro, parado, vindo de lugar nenhum.
- **Fontes:** Nowack, Kaizen, Arthur.

### R10. Composição: centro é exceção, não regra
- **Regra:** use guia de terços; tire o produto do centro quando houver texto, ou pra variar o
  ritmo entre planos. Centro reservado para o plano-herói e o fechamento de marca.
- **Conflito:** o vídeo "Apple Style" (2D, AE) manda centralizar sempre. Derek descentra pra dar espaço
  ao texto; Kaizen critica o plano frontal sem perspectiva. Para 3D comercial, Derek e Kaizen vencem;
  a centralização vale para a tela de texto/UI 2D e para o packshot final.
- **5.2:** `cam.data.show_composition_thirds = True` (guia visível na câmera) [conhecimento geral].
- **Fontes:** Derek, Kaizen, Apple Style, Nowack.

### R11. Lente longa e ângulo de 3/4 para produto
- **Regra:** produto em lente longa e câmera afastada para tirar distorção; ângulo com perspectiva
  (3/4, de lado, de baixo) para não chapar; chegar perto do detalhe que vende.
- **Valores:** 80 a 82 mm (Derek). Teleobjetiva para detalhe que "espia" (Alan Huynh).
- **Sinal de erro:** câmera frontal reta, cantos do produto esticados por grande-angular.
- **Fontes:** Derek, Kaizen, Alan Huynh.

### R12. Luz: nada perdido, nada estourado, e potência sem medo
- **Regra:** a primeira luz é uma point light na borda do fundo (degradê + recorte). Depois áreas
  em disco de potências diferentes, preenchendo onde escureceu. Mundo em zero para controle.
  Subexposição é o erro mais comum.
- **Valores:** World strength 0; chão quase branco roughness 0,9; luz menor = reflexo mais nítido.
  Luz de baixo só se a base aparece.
- **Sinal de erro:** lado do produto morrendo no preto sem recorte; histograma encostado na esquerda;
  "cor lavada" por exposição baixa compensada com saturação.
- **Fontes:** Derek, Kaizen, Arthur.
- **5.2:** manter **AgX** (nunca trocar para Standard). Subir exposição pelo `view_settings.exposure`
  ou pela potência, não pela saturação. Temperatura nativa da luz (`use_temperature`) pra esquema
  quente/frio que o Kaizen elogiou num dos freelancers.

### R13. Fundo coerente, revelado aos poucos
- **Regra:** o mesmo cenário (ou a mesma família) em todos os planos. Degradê de fundo controlado
  por uma luz própria; animar essa luz pra revelar o fundo é uma entrada barata e elegante.
- **Valores:** plano de fundo + point light parentada, um por câmera (Kaizen); área light forte
  descendo de fora de quadro ao longo do plano (Aryan); RGB alternada no chão com troca em 1 quadro (Derek).
- **Sinal de erro:** um plano com outro cenário/temperatura no meio da peça.
- **Fontes:** Kaizen, Aryan, Derek.

### R14. Profundidade de campo com moderação, foco sempre preso a um alvo
- **Regra:** foco num empty (animado junto com o produto) ou no objeto; f-stop moderado. Rack focus
  pode abrir a revelação.
- **Valores:** Derek f/4 (mais baixo só em close). Aryan 0,2 a 0,4 → mais alto no quadro 40.
  **Conflito** explicado pela escala: f-stop no Blender depende do tamanho real da cena; um relógio de
  4 cm em escala real pede f-stop menor para o mesmo desfoque [conhecimento geral]. Regra prática:
  modelar o produto em escala real e começar em f/2,8 a f/4.
- **Sinal de erro:** tudo borrado menos uma fatia; foco "nadando" porque não está preso.
- **5.2:** `dof.use_dof`, `aperture_fstop`, `focus_object`, `aperture_blades` (bokeh) existem.
- **Fontes:** Derek, Aryan, Arthur, Kaizen.

### R15. Arco de cor e de energia na peça inteira
- **Regra:** a peça tem curva: abre contida (P&B, misteriosa, muito desfoque), sobe, e explode em cor
  e velocidade no final, fechando com corte seco na marca.
- **Fontes:** Kaizen (P&B → cor → logo), Derek (sequência final de troca de cor + objeto batendo).
- **Sinal de erro:** os 20 s todos no mesmo nível de energia e cor.

### R16. Riguem tudo por pais: anima o empty, não a malha
- **Regra:** produto dentro de um empty; chave no empty. Grupos em ângulo estranho também.
- **Por quê:** troca de modelo não quebra a animação; menos curvas pra afinar.
- **Fontes:** Arthur, Derek, Aryan.

### R17. Tema por palavras-chave define o tipo de movimento
- **Regra:** 2 ou 3 palavras por projeto; elas decidem fps, curva e textura.
  Tecnologia/SaaS = liso, calculado, sem tremor. Artesanal = fps menor, picado, textura.
- **Fontes:** Nowack.

### O que é de versão antiga e como fica no 5.2
| Vídeo ensina | No Blender 5.2 |
|---|---|
| EEVEE: caixa **Bloom** (Derek, Aryan) | Não existe no EEVEE atual. Brilho vem do compositor: nó **Glare** tipo Bloom em `scene.compositing_node_group` [conhecimento geral: Bloom saiu no 4.2] |
| **Screen Space Reflections** (sem ele "fica idiota") | `scene.eevee.use_raytracing = True` (reflexo por raytracing) |
| **Ambient Occlusion** e **Soft Shadows** | Não há caixa de AO; GI rápido em `use_fast_gi`. Sombra suave pelo tamanho da luz + `shadow_ray_count` / `shadow_step_count` |
| Material: Blend Mode **Alpha Blend/Hashed**, Shadow Mode | `material.surface_render_method = 'DITHERED'` ou `'BLENDED'` [conhecimento geral, confirmar] |
| **Auto Smooth** nas normais | Removido no 4.1: modificador "Smooth by Angle" ou `shade_auto_smooth` [conhecimento geral] |
| Principled: "Specular", "Transmission" | `Specular IOR Level`, `Transmission Weight` |
| Add-on **Images as Planes** | Agora nativo (Add > Image > Mesh Plane) [conhecimento geral] |
| `action.fcurves` (implícito em scripts antigos) | channelbag via `anim_utils` |
| Cena em Standard/Filmic | AgX por padrão, manter |

---

## 3. Receitas para testar no Blender (Claude Code roda e valida)

Todas em escala real (1 unidade = 1 m), 30 fps, AgX `Base Contrast` salvo indicação.

1. **Estúdio-base Derek.** Fundo infinito: plano 6×6 m com a borda de trás dobrada em curva (bevel
   raio 1 m, 16 segmentos), shade smooth. Material do chão: Base Color 0,8 / Roughness 0,9 /
   Specular IOR Level 0,2. `world` com Strength 0. Point light 1,5 m acima da borda do fundo, atrás do
   produto, 800 W, raio 0,1. Câmera 80 mm a ~1,2 m de um celular de 15 cm. **Validar:** fundo em
   degradê visível; recorte de luz nas bordas laterais; nenhum pixel do produto abaixo de 5% de luminância.
2. **Preenchimento em disco.** Adicionar 3 área lights `DISK`: chave 45° frontal-esquerda, tamanho
   0,6 m, 150 W, temperatura 5600 K; preenchimento lado oposto 1,2 m, 40 W, 6500 K; recorte traseiro
   alto 0,3 m, 200 W, 4500 K. **Validar:** render do produto girando 360° em 72 quadros sem nenhum lado
   preto chapado; comparar com a versão só com a point light.
3. **Câmeras ligadas a marcadores.** Marcadores em 0, 68, 136, 204; uma câmera por marcador;
   `marker.camera = cam_i`. **Validar:** render de quadros 67/68/69 troca de câmera exatamente no 68.
4. **Nunca parado.** Plano de 68 quadros: produto gira 40° em Z, chave final no quadro **80** (12 além
   do corte), interpolação Bezier. **Validar:** derivada da F-curve no quadro 68 diferente de zero
   (ler `fc.evaluate(67)` e `fc.evaluate(68)`; diferença > 0,1°).
5. **Três curvas lado a lado.** Mesmo deslocamento de 0,3 m em 30 quadros em três cópias: (a) `LINEAR`,
   (b) `QUAD` + `EASE_OUT`, (c) Bezier com alças `FREE` alongadas para 1,6× o padrão (S acentuado).
   **Validar:** motion path (ou posições por quadro em CSV) mostra espaçamento constante em (a),
   largo→curto em (b), curto→largo→curto acentuado em (c).
6. **Explosão em onda (Smeaf).** 5 fileiras de cubinhos-tecla sobem 0,08 m de quadro 1 a 33; fim da
   fileira k = 33 + 2·(k−1); placa de base termina no 25; todas `QUAD` `EASE_OUT`; câmera recua 15% da
   distância de 1 a 33. **Validar:** nos quadros 33 a 41 ainda há fileiras em movimento (onda visível).
7. **Encaixe com overshoot.** Lente desce em Y de 0,05 m até 0 em 10 quadros (`EXPO` `EASE_OUT`),
   passa 0,003 m do ponto no quadro 10, volta a 0 no 16 (`QUAD` `EASE_IN_OUT`). **Validar:** assenta
   com estalo; comparar contra versão só com ease out.
8. **Botão na batida.** Shape key "pressionado" (face do botão −0,6 mm em Z); valor 0 no quadro N−1,
   1 no N+2, 0 no N+6 (zerar o valor logo após `shape_key_add`, que nasce em 1). N = quadro de um pico
   de áudio. **Validar:** pico da onda e quadro N batem.
9. **Varredura de reflexo (escolher UM mecanismo).** (a) rig de 4 área lights retangulares 0,1×0,8 m,
   500 W, parentadas a um empty que desliza 2 m em X em 120 quadros `LINEAR`, produto quase parado;
   (b) luzes fixas, produto gira 25° em 120 quadros `LINEAR`. **Validar:** nos dois, a linha de brilho
   atravessa a tela/corpo inteiro; qual das duas lê melhor.
10. **Rack de revelação.** Foco preso ao empty sobre a tela; f/1,4 no quadro 0, f/4 no quadro 40
    (Bezier); `aperture_blades = 7`. **Validar:** quadro 0 só a tela nítida, quadro 40 produto inteiro legível.
11. **Revelação do fundo.** Plano preto (Base 0,02) 3 m atrás; área light 2×2 m, 1500 W, começa 3 m
    acima fora de quadro e desce até 0,5 m acima do chão entre quadros 0 e 90. **Validar:** fundo
    passa de preto a degradê; produto não muda de exposição (luz não deve vazar nele; se vazar, usar
    light linking `receiver_collection` só com o fundo).
12. **Fundo por câmera (Kaizen).** Plano 4×4 m parentado à câmera a 3 m atrás do produto no eixo
    óptico; point light 300 W parentada ao plano a 0,5 m dele. **Validar:** degradê centrado atrás do
    produto em todo enquadramento da câmera em movimento.
13. **Troca de cor seca.** Nó RGB do chão com chaves em interpolação `CONSTANT`: laranja até o quadro
    N, grafite no N+1; Mix Shader do corpo (plástico ↔ metal) com fator 1 → 0 no mesmo quadro.
    **Validar:** troca em 1 quadro, sem transição borrada.
14. **"Líquido" por Boolean.** Esfera UV (subdiv 3) com Displace (Clouds, tamanho 0,25, força 0,05),
    Boolean Difference no topo do produto; esfera de escala 1,4 → 0 ao longo de 105 quadros (3,5 s),
    rotação 0 → 35° no último trecho; Bezier em S; câmera segue com as mesmas curvas.
    **Validar:** recorte de borda orgânica, sem artefato de Boolean em render final.
15. **Campo de instâncias.** Coleção do produto → 12 Collection Instances ao redor do herói; empty-mestre
    gira 15° em Z em 150 quadros `LINEAR`; cada instância desce entre 0,1 e 0,4 m (valores diferentes);
    herói gira 20° em X. **Validar:** nenhum par de instâncias com o mesmo deslocamento.
16. **Continuidade de direção e velocidade.** Plano A: produto sai pela esquerda acelerando
    (`QUAD` `EASE_IN`). Plano B em duas variantes: (B1) produto se move no sentido oposto
    (da esquerda pra direita), começando devagar (`QUAD` `EASE_IN`); (B2) produto segue se movendo
    da direita pra esquerda, como em A, começando rápido (`QUAD` `EASE_OUT`). **Validar:**
    assistir os dois cortes: A→B2 deve parecer um movimento só; A→B1 deve parecer um tranco.
17. **Brilho moderno (substituto do Bloom).** Compositor: Render Layers → Glare (tipo Bloom, threshold
    1,0, tamanho médio) → Composite, em `scene.compositing_node_group`. **Validar:** só a tela emissiva
    e os highlights especulares brilham; corpo do produto inalterado.

---

## 4. Contribuição pro Cérebro de Diretor

1. **O roteiro de produto nasce de uma lista de recursos, e cada plano prova UM.** Recurso sem plano
   não entra; plano sem recurso sai. Ordem: problema/mistério → recurso principal → recursos de apoio
   → variações (cores, versões) → marca. (Arthur, Kaizen, Derek.)
2. **A música é o roteiro de tempo.** Trilha antes da animação. Picos = cortes; micro-picos = eventos
   (botão, separação, troca de cor). Sem trilha, desenhar a grade de batidas mesmo assim (ex.: 120 BPM,
   15 quadros por batida) e cortar nela.
3. **A causa raiz do "movimento de software" é a curva automática simétrica em tudo e a parada entre
   gestos.** O antídoto é escolher a curva pela intenção (linear flutua, quad-out encaixa, S carrega
   peso, impacto não freia) e emendar gestos: o próximo começa antes do anterior terminar.
4. **A causa raiz do "enfeite flutuante sem motivo" é movimento secundário sem causa.** Todo
   secundário precisa nascer do produto (o botão desce porque o dedo/a batida mandou, a peça desliza
   porque a tampa abriu). Se não há causa, não mexe. Movimento é hierarquia.
5. **A causa raiz da "luz chapada" num produto liso:** quem dá interesse ao produto simples é o reflexo
   que corre por ele. Planeje em todo plano onde a linha de brilho entra e onde sai.
6. **A causa raiz da mesmice:** pegar o primeiro plano que vem à cabeça (frontal, centrado, produto
   girando). Os três freelancers do Kaizen convergiram pro mesmo plano. Regra anti-mesmice para o
   Claude: para cada plano, gerar 3 opções que variam em PELO MENOS dois eixos entre
   {lente (35/50/85/135 mm), altura (baixo/olho/zenital), distância (macro/médio/aberto),
   posição no quadro (terço esq./centro/terço dir.), mecanismo de movimento (câmera/objeto/luz)} e
   descartar a mais óbvia. Planos consecutivos não repetem a mesma combinação.
7. **Curva de energia da peça:** abrir contido e misterioso (P&B, desfoque, revelação parcial), subir
   o ritmo, liberar cor e velocidade no terço final, fechar com uma batida física (objeto que bate,
   corte seco) e a marca. Peça com energia plana parece demo.
8. **Mostrar o tátil vende o físico.** Botões apertando, encaixes, cabos conectando, tampas abrindo:
   o espectador "sente" o produto. Para SaaS, o equivalente é a interface reagindo (clique → estado muda).
9. **Ordem de revelação é narrativa.** Detalhe antes do todo cria curiosidade; todo antes do detalhe
   cria clareza. Escolha conscientemente por plano (Alan Huynh: teleobjetiva no detalhe, depois o aberto).
10. **Tema em 2 ou 3 palavras decide o movimento.** "Preciso, silencioso, premium" pede linear e
    quad-out longo, pouco exagero; "divertido, enérgico" pede overshoot, squash, cortes curtos.
    Escrever as palavras no briefing e conferir cada plano contra elas.
11. **Continuidade é o que transforma planos em comercial:** mesmo cenário, mesmas luzes base, direção
    de saída = direção de entrada, velocidade casada no corte.
12. **Animação antes de beleza.** Validar o animatic (blocos cinza, luz simples, tempo final) antes de
    gastar render com material. Se o animatic não vende, o material não salva.
13. **Pensar comercial:** o cliente compra "agenda cheia/mais venda", e o filme vende quando cada plano
    responde "por que eu quero isso?". Reflexo bonito sem recurso não vende; recurso sem reflexo não
    encanta. Os dois juntos.

---

## 5. Lacunas (o que o tema precisa e nenhum vídeo cobriu)

- **Formato vertical 9:16** e o gancho dos primeiros 1 a 2 s para Reels/TikTok: nenhum vídeo trata.
- **Duração por plano por plataforma:** só o número do Derek (68 quadros ≈ 2,3 s). Falta régua (ex.:
  1,5 a 3 s em social, planos-herói mais longos em site).
- **Gramática de lentes completa** para produto (macro, 35 mm dramático, dolly zoom, órbita): só 80 mm
  e "teleobjetiva para detalhe".
- **Motion blur:** nenhum valor de obturador. Testar `render.motion_blur_shutter` 0,5 (180°) vs 0,25.
- **SaaS, app e site em 3D:** como animar interface em tela 3D (UI reagindo, cursor, telas flutuando
  com motivo). Só "vídeo na tela como textura".
- **Logo em 3D:** nenhuma revelação de marca detalhada (só "corte seco para a logo").
- **Tipografia em 3D / texto integrado ao plano:** só o 2D do vídeo Apple.
- **Estilo Apple real em 3D:** o vídeo "Apple" é 2D. Falta quebra de um filme da Apple (lente, luz,
  velocidade, cor).
- **Gradação de cor e paleta de comercial:** só "subir exposição e contraste na pós". Falta como
  sair do "lavado" com AgX (looks, balanço de branco, contraste por luz).
- **Sound design:** só "som suave combina com movimento suave". Falta whoosh/impacto sincronizado.
- **Animatic dentro do Blender** (Grease Pencil, viewport render, playblast com áudio): ninguém mostra.
- **Critérios de aprovação objetivos** (checklist de diretor por plano): esta destilação propõe, mas
  nenhum vídeo dá.
- **Processo de aprovação com cliente** (rodadas, o que mostrar em cada etapa): só "evitar ida e volta".
