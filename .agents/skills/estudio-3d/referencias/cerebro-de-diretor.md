# Cérebro de Diretor: como pensar um filme 3D comercial

Este arquivo é o diretor criativo, o diretor de fotografia, o motion designer e o editor numa
cabeça só. Ele decide **o que** fazer e **por quê** antes de qualquer linha de Python. A técnica
mora nos outros arquivos; a direção mora aqui. Se a técnica e a direção brigarem, a direção vence.

Fontes: síntese de 129 vídeos destilados (`fontes-youtube/`), testes do laboratório e conhecimento
de ofício. Onde uma regra vem de um autor, ele está citado entre parênteses.

---

## 1. Por que filme de IA sai sem vida e sempre igual (o diagnóstico)

Toda vez que um filme sair fraco, a causa está nesta lista. Conheça antes de começar.

| Sintoma | Causa raiz | A cura (onde está) |
|---|---|---|
| Cor lavada, branco estourado | View transform `Standard`, ou exposição/luz no chute | AgX + look + medidor (`blender-5.2-verdade.md`, `qa.py`) |
| Luz chapada | Iluminar "porque está escuro" em vez de desenhar uma sombra; chave no eixo da câmera; fundo tão claro quanto o produto | Pergunta da sombra, rig com função por luz, fundo afastado (`luz.md`) |
| Vidro/metal mortos | Superfície que não tem o que refletir | Cartões de reflexo + bandeiras pretas (`luz.md`) |
| Plástico de CG | Aspereza num número só, aresta viva, escala errada | Imperfeição em camadas, chanfro, escala real (`materiais.md`) |
| Enfeite flutuante | Movimento secundário sem causa (cubos, esferas boiando) | Todo secundário nasce de um evento do produto (seção 6) |
| Movimento de software | Curva Bezier automática em tudo; parada entre gestos | Curva pela intenção; nada para dentro do plano (`camera-movimento.md`) |
| Câmera à toa | Giro sem alvo nem motivo | Um gesto por plano, motivado (seção 5) |
| Tudo igual | Primeiro plano que vem à cabeça (frontal, central, 50 mm, girando); mesmo mundo visual sempre | Regra das 3 opções + mundos + registro de rotação (seções 4 e 7) |
| Escuro sem intenção | Escala errada (objeto de 2 m com luz de 15 cm) ou só preenchimento | Escala real + um ponto de brilho perto de 0,9 no herói |
| Filme sem fim | Energia plana do início ao fim; sem recompensa | Curva de energia + recompensa (seção 3) |

O defeito mais caro é o último: **um filme tecnicamente limpo que não diz nada**. Comercial vende
quando cada plano responde "por que eu quero isso?".

---

## 2. O interrogatório do briefing (antes de abrir o Blender)

Faça estas perguntas, uma por vez, e não suponha resposta. O que o dono não souber, você propõe e
ele aprova.

1. **O que é, em uma frase?** (produto, app, serviço). Muda a categoria do playbook.
2. **Pra quem?** Idade, momento, nível de consciência. Muda ritmo e linguagem: público jovem
   aceita corte de 1 s, público 50+ precisa de 2,5 s por ideia.
3. **Onde vai rodar?** Reels/TikTok (9:16, som desligado em 70% das vezes, gancho em 1,5 s), YouTube
   (16:9), site (loop, sem som), anúncio (CTA claro). Muda formato, duração e texto em tela.
4. **Duração?** 6, 15, 20, 30 ou 60 s. Muda a estrutura (seção 3).
5. **A UMA coisa que a pessoa tem que lembrar.** Se o dono der três, peça pra escolher uma. As
   outras viram planos de apoio ou saem.
6. **O diferencial que dá pra MOSTRAR.** "Qualidade" não se filma; "confirma sozinho no WhatsApp"
   se filma. Cada diferencial vira um plano (Arthur Whitehead: um recurso por plano).
7. **O tom em 2 ou 3 palavras.** "Preciso, silencioso, premium" ou "divertido, rápido, colorido".
   Essas palavras decidem mundo, curva e trilha (Nowack). Escreva no tratamento e confira cada
   plano contra elas.
8. **Os ativos que existem:** logo (SVG), telas reais (prints, Figma), fotos ou CAD do produto,
   paleta da marca (`design-guide.md` do cliente). Sem ativo real, nada de inventar marca.
9. **A chamada (CTA).** Seguir, baixar, chamar no WhatsApp, entrar no site. O último plano existe
   pra ela.
10. **Restrições:** profissão regulamentada (conselho de classe), prazo de render, música
    licenciada, o que NÃO pode aparecer.

Saída desta etapa: o **briefing preenchido** (`modelos/briefing.md`).

---

## 3. Da informação à ideia (o conceito)

"Mostrar o app girando" não é ideia. Ideia é a **metáfora visual** que transforma o benefício num
acontecimento físico que se entende sem texto.

Fórmula: **[o problema do cliente] vira [coisa física] que [o produto] resolve na frente da câmera.**

Exemplos por categoria (pontos de partida, não receitas):
- **App de agenda:** fichas de papel bagunçadas caem em câmera lenta; quando o celular acende,
  elas se alinham sozinhas e viram cartões da interface.
- **SaaS financeiro:** moedas e notas soltas orbitam desorganizadas; o painel abre e elas se encaixam
  em colunas do gráfico.
- **App de delivery:** o prato se monta camada por camada no ar, em cima da tela do celular.
- **CRM/atendimento:** balões de mensagem se acumulam numa pilha que ameaça cair; a IA responde e
  a pilha some em ordem.
- **Clínica/serviço de saúde:** a mesma sala vista à noite (vazia, escura) e de manhã (luz de
  janela, cadeira ocupada). A luz conta a história (o showreel "20h14" fez isso).
- **Advocacia/consultoria:** uma pilha de papel vira uma única folha limpa que pousa na mesa.
- **Academia/fitness:** o produto como peso que, a cada repetição, deixa o cenário mais claro.
- **Perfume:** o líquido atravessado por contraluz; o frasco nasce do escuro com só o contorno aceso.
- **Fone de ouvido:** o som como ondas físicas na água ao redor; o fone pousa e a água acalma.
- **Bebida:** a lata atravessa um splash congelado em câmera lenta e cai em velocidade normal no
  impacto.
- **Tênis:** o solado vira terreno; a câmera corre pela sola como se fosse uma pista.
- **Eletrônico:** a vista explodida que mostra quantas peças cabem dentro (só se o interior vende).
- **Cosmético:** a textura do produto (creme, gel) em macro, com luz de janela de fim de tarde.
- **Imobiliária/loja física:** diorama isométrico que se monta peça por peça.
- **Marca/logo:** o logo como fonte de luz que atravessa uma névoa e revela o nome.

Teste da ideia: **dá pra contar o filme em uma frase sem dizer o nome do produto?** Se não dá,
ainda não é ideia.

### A estrutura por duração (30 fps)

| Duração | Batidas |
|---|---|
| **6 s** | 0-1,5 gancho visual (a metáfora já começa) · 1,5-4,5 o produto resolve · 4,5-6 marca + CTA |
| **15 s** | 0-1,5 gancho · 1,5-4 problema/mistério · 4-9 revelação + 1 recurso principal · 9-12 prova/recompensa · 12-15 marca + CTA |
| **20 s** | igual ao de 15 s, com 2 recursos de apoio entre 9 e 15 |
| **30 s** | 0-2 gancho · 2-6 problema · 6-10 revelação · 10-22 três recursos (4 s cada) · 22-26 resultado/recompensa · 26-30 marca + CTA |
| **60 s** | 30 s com respiro: planos de 3-5 s, um momento de silêncio antes do reveal, 2 recompensas |

O comercial de produto em três atos (Aryan e OnlyRJ convergem): **mistério** (silhueta, sai do
escuro) → **detalhe que vende o recurso** (close, luz interna, explodida) → **evento físico e
packshot** (encaixe com onda, quebra e volta). Planos de 60 a 90 quadros.

### A curva de energia

A peça inteira tem arco (Kaizen): abre contida (pouca cor, muito desfoque, revelação parcial), sobe
o ritmo, libera cor e velocidade no terço final e fecha com uma batida física (objeto que bate,
corte seco) e a marca. Energia plana do início ao fim = demo de render.

**Uma recompensa por peça** (Derek Elliott): o clímax é um retorno visível da ação (o check que
aparece, o número que sobe, o coração do curtir, o "Confirmado"). Ele responde o "e daí?".

---

## 4. O tratamento (o documento que um diretor entrega)

Antes de produzir, escreva o tratamento (`modelos/tratamento.md`) com:

1. **A ideia em uma frase** e as **3 palavras de tom**.
2. **O mundo visual** (de `mundos.md`): escolha UM e justifique. Confira o registro de rotação.
3. **Paleta** em hex na proporção 60/30/10, vinda do design-guide do cliente quando existir. O
   mundo dá luz, câmera e movimento; a marca dá a cor.
4. **Luz:** o rig e a frase "esta luz existe para ___" de cada luz.
5. **Materiais-chave:** o herói em uma família (vidro, metal, laca, argila) e o resto em outra.
   Contraste de famílias é hierarquia.
6. **Linguagem de câmera:** lentes, um movimento por plano, transições.
7. **Assinatura de movimento:** as curvas do mundo (`'pousa'`, `'ressalta'`...).
8. **Ritmo e som:** BPM ou batidas, onde entra o riser, onde cai o hit, o sting final.
9. **Tipografia em tela** (se houver): fonte da marca, tempo de leitura (1 s + 3 palavras/s, título
   antes da ação, nunca atravessa corte), zona segura do Reels (nada nos 20% de baixo nem nos 10%
   de cima).

### A regra das 3 opções (anti-mesmice no plano)

Para cada plano, gere **3 opções** que variem em pelo menos **dois eixos** entre:
lente (24 / 35 / 50 / 85 / 135 mm), altura (rasante / olho / de cima / zenital), distância (macro /
médio / aberto), posição no quadro (terço esquerdo / centro / terço direito) e mecanismo de
movimento (câmera / objeto / luz). **Descarte a mais óbvia.** Planos consecutivos não repetem a
mesma combinação. (Os três freelancers do teste do Kaizen fizeram o mesmo plano frontal centrado:
é o que acontece quando ninguém faz esta conta.)

---

## 5. Câmera: um gesto por plano

- **Lente longa pra produto:** 75 a 135 mm, câmera longe, sem distorção (Derek usa 80 mm). 35 mm só
  pra drama, ambiente ou energia (neon, urbano). 24 mm pra flyby.
- **Ângulo de 3/4 ou de baixo**, nunca frontal reto (frontal chapa o volume). Centro do quadro é
  reservado ao plano-herói e ao packshot final; o resto vai num terço, com espaço livre na
  direção do movimento.
- **Um gesto por plano**, pequeno: push-in de 8 a 12% da distância em 3 s, órbita de 10° a 40°.
  Close pede movimento ainda menor.
- **Nada para dentro do plano** (Kaizen): a câmera, o produto ou a luz estão sempre andando. O
  próximo gesto começa antes do anterior terminar; a última chave fica 10 a 20 quadros depois do
  corte. Hold declarado só no packshot e em texto.
- **Transição de produtora:** corte no quadro de maior velocidade, mesma direção dos dois lados,
  curva da saída espelhando a da entrada, motion blur ligado (George Kayesi, Blender To Browser).
- **Direção conservada entre cortes:** quem sai pela esquerda entra pela direita do próximo plano
  andando pra esquerda. Velocidade casada no corte.
- **Foco preso a um alvo** (vazio), nunca solto. Rack focus como revelação: começa no primeiro
  plano e corre até o produto.

---

## 6. Movimento: a curva pela intenção

| Intenção | Curva | Exemplo |
|---|---|---|
| Entra e assenta | `'pousa'` (EXPO ease-out) | celular chegando, cartão pousando |
| Sai de quadro | `'decola'` (EXPO ease-in) | objeto indo embora |
| Peso, objeto caro | `'premium'` (QUINT in-out) | tampa abrindo, giro do herói |
| Câmera | `'camera'` (SINE in-out) ou LINEAR se cortado nas duas pontas | push-in, órbita |
| Força, pop | `'ressalta'` (BACK, overshoot 3 a 8%) | ícone estourando, mundo pop |
| Flutuar, deriva | `'linear'` | o aparelho respirando, o mundo girando |
| Impacto | linear até o contato, sem frear antes | a peça que bate |
| Rolagem de app | flick: saída curta, chegada longa | o polegar jogando o feed |

Regras que matam o "movimento de software":
- **Bezier automática simétrica em tudo é proibida** como acabamento.
- **Stagger:** peças de um conjunto nunca se movem juntas. 2 a 5 quadros entre elas (Smeaf usa 2
  por fileira). Quem tem menos caminho chega antes.
- **Hierarquia:** só o elemento nº 1 do momento tem o movimento grande. O secundário fica com no
  máximo 1/5 da amplitude.
- **Causa antes do efeito:** na UI, o dedo/cursor aparece 4 a 5 quadros antes da reação.
- **Secundário só com causa.** O botão desce porque foi tocado; a peça desliza porque a tampa
  abriu; a partícula nasce no quadro da quebra. **Sem causa, não mexe.** Isto elimina os cubos e
  esferas boiando.
- **Todo plano tem três camadas** (Kaizen): câmera em movimento, luz viva e um movimento
  secundário causado pelo produto.

---

## 7. Luz e material: as perguntas antes de criar

**Luz** (ordem fixa): escala real → câmera travada → mundo quase 0 → fundo → chave → medir →
separação (contorno) → preenchimento mínimo → especular/cartões → light linking limpando → AgX +
look → render A/B.

1. **"Que sombra eu preciso que se leia?"** A luz nasce pra desenhar essa sombra.
2. **"Esta luz existe para ___?"** (volume, separar do fundo, pintar o fundo, especular, destacar o
   logo, proteger os pretos). Sem frase, sem luz.
3. **"Onde está a borda que separa o produto do fundo?"** Contorno é obrigatório em comercial.
4. **"O ponto mais claro do quadro é o produto?"** Se for o chão ou o fundo, o olho vai pra lá.
5. **"O que esta superfície está refletindo?"** Fosco mostra a luz; vidro e metal mostram o
   ambiente. Sem nada pra refletir, sai preto.

**Material:**
1. **Qual a história do objeto?** Novo de caixa (comercial): limpo, nunca estéril; imperfeição só na
   aspereza, que só aparece no reflexo. Usado: desgaste de borda, sujeira de fresta.
2. **Distância da câmera decide o detalhe:** close pede micro-relevo; fundo só variação de cor.
3. **Sutil vence:** se a imperfeição aparece na miniatura, está forte demais.
4. **Motor manda na receita:** Cycles faz Bevel/Pointiness/AO no shader; EEVEE precisa de chanfro
   na malha.

---

## 8. Som (metade do comercial)

Trilha antes da animação: os picos da música são os cortes; os micro-picos, os eventos. Sem
trilha, desenhe a grade (120 BPM = 15 quadros por batida a 30 fps) e corte nela.

Camadas: música (com stems) → ambiência sutil → SFX de ação (um por movimento: whoosh no giro,
clique na UI, hit no encaixe) → riser até o reveal → hit + drop no reveal → **sting final de até 5
notas, ascendente, no tom da marca**. Silêncio ou low-pass antes do momento-chave. Pico do SFX no
quadro de maior velocidade da animação (dá pra calcular pelas F-curves).

---

## 9. O pipeline de estúdio adaptado à IA (com portões)

| Etapa | A IA entrega | Prova | Portão |
|---|---|---|---|
| 1. Briefing | `briefing.md` preenchido | respostas do dono | dono aprova a UMA coisa e o tom |
| 2. Ideia + tratamento | `tratamento.md`: ideia, mundo, paleta, luz, câmera, som | 1 frase que conta o filme | dono aprova a ideia |
| 3. Shot list | `shotlist.md`: plano, quadros, lente, movimento, ação, transição, som | soma dos tempos = duração | coerência com a estrutura |
| 4. Animatic (blocking) | cena em blocos cinza, câmeras e tempos finais, chaves CONSTANT | folha de contato (1 quadro a cada 10) + mp4 rascunho | o filme se entende sem material? |
| 5. Lookdev (style frames) | 2 a 3 quadros-chave com luz e material finais, 50%, Cycles revisão | `qa.py` sem veredito + olho do diretor | dono aprova o visual |
| 6. Polimento do movimento | curvas finais, stagger, secundários, motion blur | quadros intermediários + auditoria das curvas | nenhuma velocidade zero indevida |
| 7. Render | sequência PNG/EXR (nunca vídeo direto) | tempo medido por quadro | nenhum quadro faltando |
| 8. Pós e som | compositor (glare, vinheta, grão), trilha + SFX, mix | `qa.py` no final + escuta no celular | rubrica ≥ nota mínima |
| 9. Entrega | mp4 H.264 + registro do mundo usado | arquivo abre e toca | registro de rotação atualizado |

As duas etapas que nunca se pulam: **animatic antes de beleza** (se o animatic não vende, o
material não salva) e **prova antes de "pronto"** (rubrica + medidor + olho).

---

## 10. Heurísticas de bolso

- Um herói por plano.
- Segure o quadro-herói de 18 a 24 quadros antes de cortar.
- Detalhe antes do todo cria curiosidade; o todo antes do detalhe cria clareza. Escolha.
- Mostrar o tátil vende o físico (botão afundando, tampa encaixando). No SaaS, o tátil é a
  interface reagindo ao clique.
- Quando a UI acende, o fundo apaga (−1 de exposição no fundo).
- A troca de estado muda o mundo inteiro: luz, fundo e emissão respondem.
- Tingir na pós, não na luz: renderize a luz branca e dê a cor da marca no compositor (várias
  versões com um render).
- Fundo é luz sobre superfície, e fica longe.
- Packshot final mais longo que os outros planos (45 a 90 quadros) e com câmera ainda andando.
- Se ficar microscópico (ajuste de 2% em cima de ajuste de 2%), teste um rig radicalmente
  diferente.
