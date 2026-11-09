# prova-print: a tela prova o que a pessoa diz

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui. As correções do dono (`CORRECOES.md`, PV1 a PV8) já estão escritas
como regra abaixo.

Regras gerais: `REGRAS.md` §0 (G1–G35, reescritas pelo dono em 2026-11-05) mandam acima deste arquivo.

**Estado (2026-11-03): aprovado pelo dono.** O vídeo aprovado é `exemplos/vitrine-prova-print.mp4` (a vitrine com as correções PV4–PV8); dele saem `assinatura.json` e `referencia/`, e o `tools/parece.py` confere a identidade (cor e luz) de todo vídeo novo contra ele, nunca a sequência de telas (G30). As decupagens em `analise/` seguem como a origem das medidas.

**Pendência que depende do Jessé (PV3):** a referência própria definitiva do modelo vem de uma gravação dele
explicando uma ferramenta com prova real (print ou página que ele tenha). Quando ele gravar e aprovar o primeiro vídeo
neste modelo: copiar esse vídeo para `exemplos/`, rodar `tools/assinatura.py prova-print` e
`tools/referencia.py prova-print`, tirar o `--sem-adaptar` da seção 9, trocar os tempos sem prefixo deste arquivo
pelos do vídeo dele e trocar este parágrafo pela linha padrão da referência. A vitrine com a gravação comum é só prova
do sistema, não referência.

**As referências mostram o jeito, não um roteiro (G30, PV3).** São 5 Reels de um criador de fora (Nick Saraev, 9:16,
inglês), medidos no estudo `../../../treinamento/talking-head-explicativo/` (fichas e folhas `zoom-*.jpg` por vídeo) e
confirmados em 2 Reels de outro criador (Joseph). Nenhum quadro, texto, número, marca, cenário ou som deles entra num
vídeo: eles são medida. Os vídeos nem moram nesta pasta (`referencias/ORIGEM.txt` aponta para o treinamento).

| Ref | O que ela ensina aqui |
|---|---|
| ref1 (TV sem anúncio, o forte do lote) | gancho de movimento + prova aos 2 s; história em corrente com um número por elo; palco ↔ vitrine; contador; quebra de medo; pedido de uma palavra |
| ref2 (3 ferramentas de som) | o capítulo "Tool Number One/Two/Three"; rosto fechado na frase da promessa |
| ref3 (clonar apps) | prova que mostra o efeito (reclamação grifada em vermelho → selo de correção); fatura que zera |
| ref4 (5 plugins) | contador sobre a página real em cada número; palavra do pedido na cor da coisa citada |
| ref5 (Claude não ouve) | a causa do problema antes da solução; rosto fechado na dor |

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra):
- Chamada do fim (o que peço para a pessoa comentar):
- As minhas cores (fundo do palco, acento, cor da palavra do pedido), se não quiser a paleta padrão:
- Os prints que eu costumo ter (site, painel, avaliações, GitHub, post):
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da seção 7,
mas não muda a forma de execução (o que cada frase vira, o ritmo, os lugares). Se um pedido daqui mudar a forma, avise
antes de fazer. Quando a pessoa corrigir algo num vídeo e a correção valer para os próximos, ofereça anotar aqui.

---

## 1. A cara do modelo (a forma de execução)

**A frase:** a tela prova o que a pessoa diz. **A pessoa fala no vídeo normal** (a gravação crua, fundo real, legenda no
peito) e, quando um trecho afirma algo que tem prova e é ligado ao tema (G28), corta seco para a vitrine escura sem rosto, onde a
prova real (print, página) é grifada na frase enquanto ela é dita e o número falado sobe num contador; o rosto fechado
(a mesma gravação, mais perto) marca a emoção e o fecho. (Antes de 2026-11-05 o padrão alternava um palco claro com a pessoa
recortada saindo de um cartão; o palco agora é opção, `fundo: 'recorte'`.)

**Os três sinais (mudo, em 1 segundo):**
1. **A pessoa ↔ a prova escura sem rosto**, em corte seco: a pessoa falando no vídeo normal e, no trecho com prova, o
   card sozinho sobre o próprio conteúdo desfocado e escuro.
2. **Prova real dentro de um card com contorno fino**, com o **grifo** de marca-texto correndo na frase dita e a
   **pílula escura do contador** subindo até o número.
3. **A pessoa no vídeo normal** a maior parte do tempo; fechada e grande só em dois momentos (emoção e fecho), com o
   comando do fecho e a palavra do pedido entre aspas. (O cartão de câmera com a cabeça saindo da moldura, PV8, é o palco
   opcional.)

**O encanto** (onde a referência ganha a pessoa): cada afirmação ganha a prova dela no mesmo segundo (ref1 2 s: a
afirmação "está bombando" ganha o post com o número grifado), e a tela muda a cada 1,5 a 4 s sem que a câmera corte
(grifo, contador, troca de card). O que a referência **evita**, e o modelo também: (1) interface genérica no lugar da
coisa real; (2) rosto fechado fora da emoção e do fecho. **As regras gerais mandam acima da referência:** a pessoa falando sem tela é o
normal do vídeo (G6, G19); a prova entra no trecho que afirma algo com prova e pesa no tema (G28), não para preencher toda frase. Tela de prova: usada na referência porque a afirmação precisa ser vista para ser crida; usar quando a fala nova tiver o mesmo porquê (G30).

**A cara padrão** (opção, G31; troque na seção 0): palco claro e frio (`#E9ECEE` com o canto de cima em `#D3E0EA`), um
acento só, azul (`#0284FD` na caixa, `#0682F7` na palavra-chave), vitrine quase preta (`#05070C`, ref1 3,75 s:
`#020813`), contador em `#070C18` com número `#68B7FC`, amarelo `#FDFC76` só na palavra do pedido. Fontes: Inter
(700/800) e Instrument Serif itálica (palavra-chave, a linha da caixa do título, "comenta"). Medidas em `analise/q/`
(ref1 1,00 s; 3,75 s; 19,5 s; 35,5 s).

## 2. Os números do modelo

Medidos com `analise/medir_modos.py` (4 quadros por segundo, YuNet, histograma de corte; `analise/refN_modos.txt`).
Os do `parece.py` (brilho, contraste, saturação) só existem depois do vídeo aprovado do Jessé.

| Ref | Duração | Cortes/min | Mediana da cena | Palco | Vitrine (+ transição) | Capítulo | Com rosto | Rosto no palco (altura, centro) | Rosto fechado (altura, centro) | Maior trecho parado |
|---|---|---|---|---|---|---|---|---|---|---|
| ref1 | 37,0 s | 24,3 | 2,22 s | 36% | 51% (+11%) | 0% | 47% | 23%, 76% | 31%, 37% | 0,87 s |
| ref2 | 35,1 s | 22,2 | 2,35 s | 43% | 26% (+12%) | 16% | 57% | 23%, 75% | 32%, 41% | 1,40 s |
| ref3 | 38,4 s | 15,6 | 3,27 s | 42% | 38% (+10%) | 5% | 55% | 23%, 76% | 31%, 38% | 1,03 s |
| ref4 | 48,6 s | 23,5 | 2,07 s | 38% | 32% (+9%) | 19% | 48% | 22%, 78% | 32%, 44% | 1,37 s |
| ref5 | 36,0 s | 18,4 | 2,93 s | 35% | 45% (+12%) | 6% | 49% | 21%, 77% | 32%, 38% | 0,70 s |

O detector classifica como "rosto" só os quadros com a caixa do rosto >= 30% da altura; o fecho com o fundo cinza no
topo cai em "transição", então o tempo de rosto fechado vem do estudo (os ~3,5 s finais + 1 a 2 s de emoção: 10 a 13%).

As colunas acima são das referências (que alternam palco e vitrine o tempo todo). **A régua do modelo são as regras gerais**
(G6, G19, G28, G30), na tabela abaixo.

| Regra do modelo | Valor | De onde |
|---|---|---|
| A pessoa na tela | **pelo menos 50% do tempo** (pessoa no vídeo normal + rosto fechado; o molde padrão: 67% + 18%) | G19 (na dúvida, só o que está sendo dito); número a confirmar com o dono |
| Vitrine e capítulo | no trecho ou subtrecho com prova e ligado ao tema; a tela sai junto com o trecho (o checador ainda cobra "só no fim de cena no ponto", regra antiga) | G28, G23 |
| Rosto fechado | só emoção (1 a 2 s) e fecho (os ~3,5 s finais); até 3 cenas e até 20% do vídeo | refs: 10 a 13% |
| Rosto fechado: tamanho | caixa do rosto ~32% da altura do quadro, centro ~37 a 44% do topo (no fecho, olhos em y 560 para o comando caber) | refs acima |
| Cortes de modo | poucos: o corte segue a cena que fecha, não a frase; tela (vitrine, capítulo, palco) até 5,5 s; a pessoa dura o que a fala durar | refs + G28 |
| Vitrine seguida (sem rosto) | até 8 s | ref1 8 a 15,5 s (7,5 s) |
| Tela parada | maior trecho parado nas refs: 0,7 a 1,4 s; dentro da cena entra grifo, contador ou a câmera do print viaja | refs acima |
| Legenda | 66 px, até 2 linhas, **um lugar: y 1180**, um bloco por vez; só o palco opcional a sobe para y 940 | G12, G13, G14 |
| Cartão de câmera do palco (opção, `fundo: 'recorte'`) | x 46 a 1034 (91,5%), borda de cima y 1365 (71%), raio 54, sangra pela base; olhos 125 px abaixo da borda; a cabeça passa da borda | ref4 0 a 4 s (PV8) |
| Um elemento por ideia | nenhuma palavra em dois textos ao mesmo tempo (título, contador, comando, legenda) | PV4 (G26) |
| Nada pendurado | texto fixo sai até 1 s depois da última palavra dele e não atravessa a cena (só o comando do fecho fica) | PV5 (G27) |
| Câmera que segue o rosto | zona morta 45 px, alisamento gaussiano sigma 0,6 s; na tela até 90 px/s, tranco até 120 px/s², sem vaivém | PV7 |

## 3. Cenas e ritmo

Quadro de 1080x1920, 30 qps. Cinco modos (a pessoa é o padrão; o palco é opção), sempre em **corte seco 2 quadros antes
da palavra que abre a frase**
(`corte()` em `src/tema.ts`). Entre duas vitrines seguidas o card novo **desliza da direita com borrão** em 0,26 s
(ref3 8,5 s), nunca cortina.

**A pessoa (o padrão, G6).** A gravação crua em tela cheia, como o `adaptar.py` deixou: fundo real, sem zoom, sem
recorte, sem camada nem faixa por cima. Legenda branca com a sombra larga e suave, topo y 1180. É onde a fala corre;
dura o que a cena durar. Com `fundo: 'desfoque'` (só a pedido), o fundo da gravação ganha um desfoque leve de 8 px e a
pessoa recortada (`public/pessoa.webm`) fica nítida por cima.

**Palco claro (opção, `fundo: 'recorte'`, G6)** (ref1 0,25 a 2 s; ref3 22,5 a 26,8 s; ref4 0 a 4 s). A pessoa está,
embaixo; a explicação acontece em cima. Com `fundo: 'real'` o molde para ao carregar se o plano tiver palco.
- Fundo: gradiente de `#D3E0EA` (canto de cima) para `#E9ECEE`. Sem cenário de ninguém (a palmeira da ref1 é do criador).
- **Título-promessa (só no gancho):** linha 1 em Inter 700, 84 px, preta, topo y 250; linha 2 em Instrument Serif itálica,
  108 px, branca, numa caixa azul `#0284FD` de raio 10 que se abre da esquerda (0,25 a 0,6 s), topo y 352 (ref1: linha
  1 ~y 228, caixa y 321 a 455; descido para a zona segura). As duas linhas são **palavras ditas** (G19), a promessa do
  vídeo, até 16 letras cada. Entra aos 0,25 s, cada palavra apagada (38%) acende quando é dita, e **só existe na cena
  do gancho: some no corte dela** (PV5; ref1, ref3 e ref4: o título só no primeiro palco). Enquanto o título está na
  tela, as palavras dele não vão para a legenda e não há contador do mesmo número (PV4).
- **Card da prova:** com o título (só o gancho) x 100 a 980, y 506 a 916 (880x410; ref4 1,5 s: x 117 a 963, y 515 a
  975); sem o título o card sobe e cresce: y 250 a 916 (880x666; os palcos seguintes das refs sobem o card). Raio 26,
  contorno `#1781E2` de 4 px, sombra macia; entra subindo 70 px com mola.
- **Legenda:** topo y 940 (ref4 1,5 s: "AI plugins" y ~1010 a 1090), entre o card da prova e a cabeça.
- **Cartão de câmera** (PV6, PV8; medido na ref4 `DfPuiYyP4Hy` de 0 a 4 s, quadro cheio 1080x1920): cartão de cantos
  arredondados quase da largura da tela, **sem contorno**, sangrando pela base, com a gravação (e o fundo dela) dentro, e
  a **pessoa recortada por cima, só acima da borda de cima: a cabeça sai da moldura**. Ref4: cartão x 52 a 1039 (91,5%
  da largura), borda de cima y 1305 (68%), raio ~55, olhos ~125 px abaixo da borda (y ~1430), topo da cabeça ~165 px
  acima da borda (y ~1140), rosto ~300 px de largura, fundo do palco liso e claro. Aqui: cartão x 46 a 1034, borda y
  1365, raio 54; a gravação em escala 0,92 (o mínimo para cobrir os 988 px do cartão: rosto ~366 px), olhos em y 1490
  (125 px abaixo da borda, como a ref). Medido na vitrine: topo da cabeça em y ~1153 (mediana) e y 1112 no ponto mais
  alto do vídeo, sempre abaixo da legenda de 2 linhas (até y 1096) e 210 a 250 px acima da borda. O recorte é
  `public/pessoa.webm` (`scripts/recorte.py`, RVM sobre a própria gravação), que também mede o topo da cabeça em
  `src/rosto_med.json` (`topo`).
- **A câmera segue o rosto devagar** (PV7): o caminho do centro do rosto passa por uma zona morta de 45 px (o rosto mexe
  dentro dela e a câmera fica) e por um alisamento gaussiano de sigma 0,6 s (`rostoX` em `src/tema.ts`); nunca cola no
  rosto quadro a quadro. No cartão do palco a gravação mal sobra para os lados (escala 0,92), então ali ela quase não
  anda; no rosto fechado é onde o caminho aparece. Medido na vitrine: até 46 px/s e 66 px/s² na tela, sem vaivém.

**Vitrine escura** (ref1 2 a 5,5 s e 8 a 15,5 s; ref3 3,75 a 10,8 s). Sem rosto. É onde mora a prova, e entra **no trecho
com prova** (G24, G28): a frase com a afirmação que tem prova.
- Fundo: o próprio conteúdo do card, ampliado, borrado (46 px) e escurecido (32%), com vinheta.
- **Card grande:** x 80 a 960, y 250 a 1140 (880x890), mesmo contorno e raio (ref1 3,75 s: x 95 a 985, y 212 a 1232).
- **Deriva:** o conteúdo de todo card aproxima 1,2% por segundo (nada fica parado; refs: maior trecho parado 0,7 a 1,4 s).
- **O print aparece de borda a borda na largura útil** (nenhuma linha cortada na direita): vista de ~1100 px de um print
  de 1320 capturado em escala 3, o que dá letra de ~32 a 40 px na tela.
- **Legenda:** branca, topo y 1180.

**Capítulo** (ref2 12 a 14 s, 18,5 a 20,3 s; ref4 4 a 6 s). Só quando a fala enumera ("ferramenta número um").
- Fundo branco. Rótulo dito em Inter 700, 92 px, preto, topo y 250 ("Ferramenta número"); o número dito em Instrument
  Serif itálica 116 px, branca, na caixa azul que se abre da esquerda, topo y 360; o card do item (x 110 a 930, y 520 a
  1140) entra 0,15 s depois. O nome do item vem na legenda (palavra-chave), no lugar de sempre.
- **Nunca parado mais de 1,5 s antes do card entrar** (a ref4 fica 2 s vazia em 14,5 s; a ref2 3,3 s em 25 s: não copiar).

**Rosto fechado** (ref2 11 s; ref5 4 a 5,7 s; os ~3,5 s finais de todas).
- A caixa do rosto a ~32% da altura do quadro (escala = 0,32 x 1920 / (1,3 x largura do rosto medida); refs: 31 a
  32%), olhos em y 670 (centro do rosto a ~37%; refs 37 a 44%); no fecho os olhos sobem para y 560 para o comando caber
  entre o queixo e a legenda. Aproximação contínua de 3% em 3 s. Uma faixa escura na base (de y 900, 0 → 60%) deixa a
  legenda e o comando legíveis sobre as mãos e o microfone no peito (o Joseph faz o mesmo, DejD); é elemento de tela,
  não tratamento de cor da gravação (G6). Só em duas funções: **a frase de emoção** (a dor, o benefício, a virada) e **o
  fecho**. Fora disso, nunca.

**Um elemento por ideia (PV4) e nada pendurado (PV5).** Cada ideia aparece num elemento só: o título do gancho, o
contador, o comando do fecho e a legenda nunca dizem a mesma palavra ao mesmo tempo (número escrito ou falado conta
igual). A palavra que um texto fixo mostra sai da legenda enquanto ele está na tela (`FIXOS` em `src/tema.ts`). O grifo
fica de fora: ele marca a prova no print, não é texto da casa. Texto fixo sai até 1 s depois da fala dele e nunca
atravessa o corte; só o comando do fecho fica até o fim.

**Ritmo (G28).** Nunca uma tela por frase. A pessoa conta a cena; a prova entra no trecho que tem prova, sai junto com ele (G23) e devolve a pessoa
na cena seguinte. Tela (vitrine, capítulo, palco) acima de 5 s quebra num corte entre palavras, de preferência **depois
de uma palavra longa** (> 0,46 s). Ordem típica: pessoa (gancho escrito na legenda desde o quadro 0) → pessoa → vitrine
fechando a cena com a prova → pessoa → rosto na emoção → pessoa → rosto no fecho.

## 4. O repertório (a gramática fala → tela)

| Função da frase | O que a tela faz | Prova nas refs |
|---|---|---|
| **Gancho** (gente fazendo + inimigo comum + "agora") | a pessoa, com o gancho inteiro na legenda desde o quadro 0 (as palavras acendem quando ditas); se o gancho fecha no ponto com uma prova, a vitrine entra no fim dele. (Com o palco opcional: o título-promessa aos 0,25 s, PV4/PV5.) | ref1 0,25 s e 2 s; ref4 0,5 s; G12 |
| Afirmação com prova ligada ao tema | vitrine com o **print real**; **grifo** na frase exata, no instante em que é dita. Afirmação no meio da cena fica na pessoa | ref1 6,5 s; ref3 5,5 a 10,5 s; G28 |
| **Número dito** | **contador**: pílula escura, o número sobe de 0 até **exatamente o número falado** em 0,75 s e para (PV1, G10) | ref1 18,5 s; ref2 15 s; ref4 7,5 s |
| Problema → solução | o defeito grifado em vermelho e a correção colada nele, no mesmo quadro | ref3 18,5 a 22 s |
| Causa do problema | a causa desenhada na própria interface real, com a palavra da fala grifada | ref5 6 a 9 s |
| Passo / elo da corrente | a pessoa conta o elo; a prova entra no elo que fecha com ela (troca de card com deslize só entre duas vitrines seguidas) | ref1 6 a 24 s; G28 |
| Lista ("número um, dois...") | **capítulo** com o rótulo e o número ditos | ref2 12 s, 18,5 s, 25 s |
| Emoção (dor, benefício, virada) | **rosto fechado**, 1 a 2 s (é um zoom: só quando a fala dá o motivo, G6; sem som de zoom) | ref2 11 s; ref5 4 s |
| Quebra de medo ("dá pra desfazer") | o print/interface do desfazer, com o visto | ref1 29 a 33 s |
| **Pedido** | rosto fechado; "comenta" pequeno em serifa itálica e a palavra entre aspas, grande, amarela, **sem brilho** | ref1 33,5 s |
| Frase sem prova nenhuma | **a pessoa** (G19); **nunca prova inventada** nem a gravação dentro do card | (seção 8) |

**Prints e interfaces (G25):** o modelo **não desenha interface**: ele mostra o print real, com origem e data em
`public/ORIGEM.md`. Moldura do card: só o contorno fino e a sombra (a barra de navegador da referência não é
recriada: ela seria interface inventada). O checador acusa print sem origem. Print com nome de terceiro (avaliação,
comentário): desfocar o nome antes de montar.

**Exemplo, não regra (assinatura do criador da referência):** a palmeira no palco, o microfone à mostra no fecho, o
botão azul pulsando (ref5 fecho), o laranja da marca citada na palavra do pedido (ref4).

## 5. Texto na tela

**A legenda** (`src/Legenda.tsx`):
- Inter 700, 66 px, entrelinha 78 px, entreletra -0,025 em; branca na pessoa, na vitrine e no rosto (na pessoa e no
  rosto, só a sombra larga e suave `0 6px 48px rgba(0,0,0,.5)`, G16), preta no capítulo e no palco opcional. Caixa x 60 a
  940 (centro x 500), **um lugar no vídeo** (G12): topo y 1180, um bloco por vez. Só o palco opcional a sobe para y 940
  (entre a prova e a cabeça que sai do cartão, PV8).
- **Palavra-chave** (o termo protagonista: número, nome da ferramenta, o objeto da prova): Instrument Serif itálica,
  1,22 vezes maior, azul `#0682F7` no claro e `#68B7FC` no escuro (ref1 19,5 s).
- **O pedaço inteiro nasce de uma vez** com as palavras ainda não ditas apagadas (38%), e cada uma acende no início
  dela (ref1: "a palavra que ainda vai ser dita aparece apagada e acende"). Com isso o pedaço pode ficar 1,5 s sem
  atrasar a fala (PV2), em vez da troca de 0,3 a 0,8 s da referência.
- **Um bloco = um trecho** (G14): passou de `. , ? ! :`, o bloco acaba; trecho longo vira o menor número de blocos de até
  2 linhas, equilibrados. Quando a legenda está vazia, o bloco pode nascer até 0,5 s antes da 1ª palavra (`ANTECIPA`).
- Fala corrida: bloco que fecha um trecho curto e é empurrado pelo seguinte pode ficar menos de 1,5 s (G14 vence a
  junção); o checador lista esses "aceitos" e só reprova abaixo de 0,4 s. **O corte da cena nunca parte um trecho em
  bloco curto**: o checador reprova e manda mover o corte.
- As palavras que um texto fixo já mostra (o título do gancho, o contador, o comando do fecho) não vão para a legenda
  enquanto ele está na tela (PV4).

**Título-promessa:** seção 3. **Contador:** Inter 800, 168 px, `#68B7FC`, números tabulares; rótulo (palavras ditas)
Inter 700, 46 px, branco, só quando diz algo que nenhum outro elemento da tela diz (PV4); pílula `#070C18`, raio 40;
entra com mola (escala 0,7 → 1) e fica até o corte, no máximo 1 s depois da fala do número (PV5). Os contadores moram em
`CONTADORES` (`src/tema.ts`). **Sem brilho/glow na letra** (G16: a referência usa glow no número e na palavra do
pedido; aqui não).

**Grifo:** marca-texto `rgba(2,132,253,.30)` em multiplicação, raio 6, que se desenha da esquerda para a direita em
0,35 s no início da palavra (ref1 6,5 s). Só na frase dita (ou no trecho do print que diz o mesmo).

**Sempre:** número e frase exatamente como foram ditos (G10, PV1); nome do modelo nunca na tela (G33); nome/@ só reais.

## 6. Transições, som e fecho

- Corte seco entre modos; deslize com borrão entre vitrines; o card do palco entra com mola; a câmera do print só viaja
  (0,6 s, curva suave) **depois** da prova ser lida (2,5 a 3 s, `tempo-de-tela-da-prova`).
- **Fecho** (só se a fala pede comentário): rosto fechado; "comenta" em Instrument Serif itálica 64 px, branca, e a
  palavra do pedido entre aspas em Inter 800, 100 px, amarela `#FDFC76`, topo y 958 (entre o queixo e a legenda); entra
  com mola na palavra. O resto da fala segue na legenda, em y 1180. Palavra do pedido **curta e igual ao objeto do vídeo**
  (ref1 "TV": 34.328 comentários contra 101 do CTA sem palavra, manual R11); o roteiro tira o medo antes do pedido (R10).
- **Som** (`scripts/som.py`): **só com ordem do dono no pedido (G6)**; o padrão é só a voz. Com ordem: só efeitos, sutis, sem música. Corte entre modos = popup grave (mais baixo para o rosto);
  grifo = risco curto de marca-texto; contador = tiques que desaceleram e um toque quando para; a palavra do pedido =
  popup. Mixagem: efeitos 10 dB abaixo, final em -14 LUFS e pico -1 dBTP (`scripts/mixar.sh`).

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Fundo (G6) | **`'real'`**: a pessoa na gravação crua, fundo real, sem recorte nem camada | prop `fundo: 'desfoque'` (desfoque leve de 8 px só no fundo, a pessoa nítida por cima) ou `fundo: 'recorte'` (libera o palco com a cabeça saindo do cartão); os dois pedem `public/pessoa.webm` (`scripts/recorte.py`) e só com pedido |
| Palco claro com cartão de câmera (PV8) | desligado (G6) | cenas `'palco'` em `base()` + `fundo: 'recorte'` |
| Voz no render | ligada | prop `voz: false` |
| Efeitos sonoros | **desligados** (G6: só com ordem do dono) | com ordem: o 3º argumento no `mixar.sh` (sem ele sai só a voz) |
| Música | desligada | não há (herança §8; G6) |
| Paleta (fundo, acento, amarelo do pedido) | a da seção 1 | `C` em `src/tema.ts` |
| Prévias (dois vídeos do próprio criador no card) | desligadas | prop `previas: true`, `public/previa1.mp4` e `previa2.mp4`, `som.py --previas` |
| Capítulo | só quando a fala enumera | cena de modo `'capitulo'` com `<Capitulo>` (`src/ui.tsx`) |
| Título-promessa | desligado (`titulo()` devolve `null`): o gancho vai na legenda, num bloco só (G12) | com o palco opcional: `titulo()` em `src/tema.ts`, só na cena do gancho (PV5) |

## 8. Zona segura, rosto, material e "Com o que o vídeo tiver"

- Todo texto em x 60 a 940 e y 250 a 1500. Prints e cards podem passar de x 940 (não são texto da casa).
- Nenhum texto sobre o rosto: na pessoa e no rosto fechado a legenda e o comando ficam abaixo do queixo (y 1180); no palco
  opcional a cabeça sai do cartão de câmera abaixo da legenda (o checador mede o topo dela). A mão que segura o microfone no peito pode ficar sob a legenda (como nas refs); se a pessoa
  gesticula muito no peito, confira os quadros.
- Herda `../../../.claude/skills/criar-modelo/referencias/heranca.md`. **Sobrescreve:**
  - **§4 "Hook leve: abre com a pessoa, e só depois entra a edição"** e **"nos primeiros 9 s, só o que abre e mais um"**:
    aqui a forma é a prova aos 2 s, então o palco abre com a pessoa no card e o título, mas a vitrine entra cedo (ref1
    2 s; ref3 1,75 s). O gancho escrito desde o quadro 0 continua (o título-promessa aos 0,25 s).
  - **§4 "no máximo ~3 cortes de zoom"**: os cortes deste modelo são troca de modo, não zoom; o rosto fechado (o único
    zoom) fica limitado a 3 cenas, como a herança pede.
  - **§1 "Legenda na altura do peito"**: no palco a legenda fica entre o card da prova e a cabeça (y 940), que é onde a
    ref a põe; na vitrine e no rosto fechado y 1180 (no rosto, é o peito).
  - **§2 "Tela de destaque não carrega texto comum"**: o contador leva um rótulo curto com as palavras ditas junto do
    número (ref1 "stars on GitHub"); é o mesmo trecho da fala, não texto comum de outra frase.

**Com o que o vídeo tiver** (G30):

| Recurso da referência | Só com a gravação da pessoa |
|---|---|
| Pessoa recortada saindo do cartão | **padrão (G6): a pessoa no vídeo normal, sem recorte.** Só a pedido (`fundo: 'recorte'`): recorte da própria gravação (`scripts/recorte.py`, RVM), o cartão com a gravação dentro e a cabeça recortada por cima da borda (PV8) |
| Print/página que prova o que é dito | **pede** ao criador (PEDIDO.md, G7): o print dele, a página pública (busca o sistema), o painel. Sem prova: a frase fica no palco, sem grifo nem contador, e o número dito só na legenda como palavra-chave (nunca prova inventada) |
| Interface recriada executando a ação (terminal, fatura) | só com print real de origem (G25); sem ele, não entra |
| Contador sobre a prova | só quando há prova; sem ela, o número dito fica na legenda (palavra-chave) |
| Capítulo com o card do site | o capítulo com o print, ou o capítulo sozinho por até 1,5 s e a legenda com o nome |
| Segunda câmera / microfone à mostra no fecho | o rosto fechado é a mesma tomada ampliada |
| Glow na palavra do pedido | não entra (G16) |

**O terceiro vídeo (tema chato, fala longa, sem prova):** o modelo continua reconhecível pela prova grifada no trecho com
prova, o contador e o rosto só na emoção/fecho; sem prova, é a pessoa falando (G19). Sem print novo, a vitrine volta ao print que já apareceu em
outro estado (outra vista, outro grifo: a pasta dos modelos aos 6 s e aos 10,6 s da vitrine), e a prova que falta vira
pedido ao criador. Nunca se inventa, e a vitrine nunca põe a própria gravação no card (duplica a pessoa e apaga o
sinal "escuro sem rosto": foi o primeiro defeito da revisão).

## 9. Como fazer um vídeo novo

Os comandos rodam de dentro de `sistema/`, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py prova-print <gravacao.mp4> <AAAA-MM-DD-tema> --sem-adaptar`
   (o `--sem-adaptar` cai depois da aprovação, quando existir `assinatura.json`). Nome que a transcrição errar:
   `--trocar Cloud=Claude`. Ao carregar, o molde para de propósito e pede o rosto novo e as palavras do plano.
2. **Meça o rosto:** `../../.venv/Scripts/python.exe scripts/rosto.py` (na pasta do vídeo). **Recorte só se o dono pediu
   palco ou desfoque** (G6): `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py`
   (grava `public/pessoa.webm` e o topo da cabeça em `src/rosto_med.json`; sem palco no plano o molde não precisa dele).
3. **Junte as provas:** cada afirmação e cada número com prova ganha um print real em `public/` (PNG, de preferência
   capturado estreito e em escala 3 para a letra ficar >= 30 px no card) e uma linha em `public/ORIGEM.md` (página,
   data, o que mostra). O que só o criador tem vira `PEDIDO.md` na pasta do vídeo, com a hora, a frase e o plano B.
4. **Escreva o `plano.md`** frase a frase sobre `src/palavras.json`, abrindo com a decupagem limpa (cortes nas pausas) e o
   plano de cenas: a função de cada cena (seção 4), o modo (a pessoa por padrão; a vitrine só onde a cena fecha forte
   com prova, com a linha "por quê" ligada à fala, G30), o print, o grifo (palavra exata), o contador (número dito).
5. **Monte no código** (na pasta do vídeo):
   - `base()`, `titulo()`, `contadores()` e `comando()` em `src/tema.ts`: uma cena por frase, `[id, modo, corte(w('palavra que abre'))]`, o 4º item
     `true` no fecho. Modos: `'pessoa'` (o padrão, G6), `'vitrine'`, `'capitulo'`, `'rosto'` e `'palco'` (só com
     `fundo: 'recorte'`). Cena `'pessoa'` não precisa de componente em `CENA_COMP`.
   - `src/Cenas.tsx`: `PV` (os prints e a largura deles) e uma cena por id em `CENA_COMP`. Use `<Palco>`, `<Vitrine>`,
     `<Prova vistas={[...]} grifos={[{at: w('palavra'), x, y, w, h}]}>` (coordenadas em px do print) e
     `<ContadorDa c={c} />` (os contadores vêm de `contadores()`: cena, palavras do número como foram ditas, início,
     valor, sufixo, y).
   - `src/Legenda.tsx`: `CHAVE` (palavras-chave). O que sai da legenda (`FIXO`) vem sozinho do título, dos contadores e do
     comando.
   - Para achar o x/y de um grifo: desenhe a caixa no print com Pillow e olhe antes de renderizar.
6. **Confira:** `node scripts/cobertura.mjs` (na pasta do vídeo) até `APROVADO`. Ele cobra: palavras do plano, cobertura
   da legenda, tempo de leitura, 2 linhas, G14, um lugar de legenda, zona segura, nada atravessa corte, **contador =
   número dito**, grifo nascendo numa palavra, print com origem, rosto fechado (até 3 cenas, até 20%), cena até 5,5 s,
   vitrine seguida até 8 s, sem sombra justa na letra, **PV4** (palavra repetida entre elementos simultâneos), **PV5**
   (texto fixo pendurado), a regra antiga da pessoa em 50% e da vitrine só fechando cena no ponto (o checador ainda cobra; a vitrine agora segue a G28),
   **PV6/PV8** (só com palco: topo da cabeça entre a legenda e a borda do cartão, olhos abaixo da borda, rosto centrado
   no cartão, recorte presente) e **PV7** (velocidade, tranco e vaivém da câmera).
7. **Som:** refaça `CORTES`, `GRIFOS`, `CONTADORES` e `EXTRAS` em `scripts/som.py` e rode
   `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo).
8. **Quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 3 6 ...` (na pasta do vídeo).
9. **Render:** `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts ProvaFerramenta01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2`
   (com prévias: `--props='{"previas":true}'`; fundo pedido: `--props='{"fundo":"desfoque"}'`).
10. **Mixe:** `QUEM=<nome> sh ../../tools/com-trava.sh sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 public/sfx.wav` (-14 LUFS).
11. **Prove:** folha de 1 quadro por segundo e a lado a lado (`scripts/lado_a_lado.py`) contra os quadros de
    `analise/q/`. Depois da aprovação, `tools/parece.py`.

## 10. O plano da vitrine (para comparar)

**O molde, desde 2026-11-05, vem com este plano padrão** (a mesma gravação comum):

| Tempo | Fala | Modo | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. Ele foi criado justamente para te mostrar a diferença entre vários modelos que eu criei e melhorei para editar | pessoa | a gravação crua; legenda em y 1180 |
| 8,4 s | qualquer tipo de vídeo usando o Claude. | vitrine (fecha a cena) | o About; grifo "Modelos de edição de vídeo" em "vídeo" e "Claude Code" em "Claude" |
| 10,6 s | Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos. Eu posso até colocar duas prévias rápidas aqui em cima, | pessoa | legenda |
| 17,8 s | aceleradas em três vezes. | vitrine (fecha a cena) | o README (ou as prévias, com `previas: true`); contador 0 → **3 vezes** |
| 19,9 s | Mas se você quiser realmente ver | rosto fechado | punch-in |
| 21,9 s | outros modelos de edição como esse e aprender a como usar isso nos seus vídeos, | pessoa | legenda |
| 26,7 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | rosto fechado | "comenta" + “EDIÇÃO” amarelo fixos |

Pessoa 67%, vitrine 14%, rosto fechado 18%; checador `APROVADO`. A tabela abaixo é a vitrine aprovada em 2026-11-03,
antes da G6 (palco com recorte, `fundo: 'recorte'`; o plano dela está comentado em `base()`).

A gravação comum (`teste-comum/gravacao.mp4`, 30,4 s) não é um vídeo de ferramenta: não tem gancho de movimento,
nem lista, nem quebra de medo. A vitrine prova a forma de execução com o que ela tem, e as provas são **prints reais do
repositório público do próprio Jessé** (`public/ORIGEM.md`). O capítulo não aparece porque a fala não enumera; ele foi
conferido num still à parte (`conferencia/capitulo.png`, texto de exemplo, fora do vídeo).

| Tempo | Fala | Função | Modo / corte | Na tela |
|---|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | gancho + número | palco | título-promessa "100% editado / pelo Claude" aos 0,25 s, cada palavra acende quando é dita e sai da legenda (a legenda mostra só "Esse vídeo está sendo", PV4); o título some no corte de 3,0 s (PV5); README real no card; grifo "O assistente edita." em "editado" e "Claude Code" em "Claude"; sem contador (o 100% já está no título, PV4) |
| 3,0 s | Ele foi criado justamente para te mostrar a | afirmação com prova | corte seco, vitrine | o About do repositório; grifo "Estúdio 2D por Jessé Gomes" em "criado" |
| 5,2 s | diferença entre vários modelos que eu criei e melhorei para editar | afirmação com prova | corte seco, palco | a pasta `sistema/modelos` real; grifo "modelos" no caminho; a câmera desce a lista em "criei" |
| 8,4 s | qualquer tipo de vídeo usando o Claude. | afirmação com prova | corte seco, vitrine | o About; grifo "Modelos de edição de vídeo" em "vídeo" e "Claude Code" em "Claude" |
| 10,6 s | Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos. | afirmação com prova | deslize, vitrine | a pasta real dos modelos: a câmera sobe do meio da lista até o caminho em "apenas"; grifo "modelos" em "modelos" |
| 14,4 s | Eu posso até colocar duas prévias rápidas aqui em cima, | passo | corte seco, palco | as duas prévias (vídeos do Jessé) entram no corte, 0,15 s uma da outra (card nunca vazio; sem prévias: o README) |
| 17,8 s | aceleradas em três vezes. | número | corte seco, vitrine | as prévias grandes; contador 0 → **3 vezes**, chega no 3 junto com "três"; a legenda mostra só "aceleradas em" (PV4) |
| 19,9 s | Mas se você quiser realmente ver | emoção/virada | corte seco, rosto fechado | punch-in |
| 21,9 s | outros modelos de edição como esse | afirmação com prova | corte seco, palco | a pasta dos modelos; grifo "modelos" em "modelos"; a câmera desce em "como" |
| 23,9 s | e aprender a como usar isso nos seus vídeos, | afirmação com prova | corte seco, vitrine | "Como funciona, em 4 passos" do README; grifo "Como funciona," em "como" |
| 26,7 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | pedido | corte seco, rosto fechado | "comenta" + “EDIÇÃO” amarelo fixos; o resto na legenda |


### Medidas da vitrine (2026-11-03, depois de PV4 a PV8)

`oficina/2026-11-03-prova-print-vitrine/out/final.mp4` (render com `previas: true`, mix com `sfx_previas.wav`):
1080x1920, 30 qps, 30,4 s, -14,0 LUFS, pico -1,0 dBTP; checador `APROVADO` (16 pedaços de legenda, 4 curtos aceitos
por fala corrida; PV4 a PV8 zerados). Pelo plano: palco 38%, vitrine 43%, rosto fechado 18%. `medir_modos.py`: 21,7
cortes/min (refs 15,6 a 24,3), mediana de cena 2,48 s (refs 2,07 a 3,27), rosto no palco 24% e centro 80% (refs 21 a
23% e 75 a 78%; antes 22% e 83%), rosto fechado 31% e centro 37% (refs 31 a 32% e 37 a 44%), maior trecho parado 1,83 s.
Cartão de câmera: topo da cabeça em y 1112 no ponto mais alto do vídeo (mediana y 1153), legenda do palco até y 1096,
borda y 1365. Câmera: até 46 px/s, 66 px/s², nenhuma troca de sentido. O detector conta como rosto também o avatar do
print e as pessoas dentro das prévias. Folhas: `conferencia/folha-1qps.jpg` (nova) e `conferencia/moldura-ref-x-nova.jpg`
(ref4 1,5 s ao lado do gancho e de um palco sem título, com as linhas medidas). A `conferencia/lado-a-lado.png` é da
versão anterior (antes de PV4 a PV8).

### Revisão de diretor (antes do dono)

Corrigido nas correções do dono (2026-11-03):
1. **PV4:** o gancho dizia "100% editado pelo Claude" três vezes ao mesmo tempo (título, pílula do contador com rótulo,
   legenda). Agora o título diz, cada palavra acende quando é dita, a legenda mostra só "Esse vídeo está sendo", e o
   contador do 100% saiu (o número já está no título). O mesmo no "três vezes": o contador mostra "3 vezes" e a legenda
   só "aceleradas em". A regra que já existia e não foi aplicada: herança §2 "Letreiro atrás mostra parte da frase sem
   repetir a palavra da legenda (PR8)"; agora é G26 e o checador acusa (teste: com o título até o fim e um contador de
   100% no gancho, o checador dá 2 achados PV4 e 3 PV5).
2. **PV5:** o título-promessa voltava em todo palco até o fim. Agora só existe na cena do gancho e sai no corte de 3,0 s
   (0,16 s depois de "Claude"); os palcos seguintes sobem o card da prova, como as refs.
3. **PV6:** a cabeça era cortada pelo topo do card (escala 0,8, olhos a 190 px do topo). Agora a cabeça inteira sai do
   cartão, com o topo medido no recorte e conferido pelo checador; rosto centrado no cartão (até 40 px do centro).
4. **PV7:** a câmera seguia a média de ±1 s a cada quadro. Agora zona morta de 45 px e alisamento gaussiano de 0,6 s;
   conferido em 4 quadros seguidos a 0,1 s (20,4 a 20,7 s e 6,1 a 6,4 s): o fundo não treme, só a pessoa mexe.
5. **PV8:** o cartão de câmera é o da ref4 (0 a 4 s), medido e reconstruído (seção 3).

Corrigido antes (primeira revisão): a vitrine com a própria gravação no card; o card das prévias vazio; prints cortados
na direita (resta o "Como funciona" aos 26 s e o "4 d" da linha do commit na pasta dos modelos); o About com branco
embaixo; tela parada de 2,47 s; legenda sobre as mãos no rosto fechado (faixa escura); legenda de 1 linha no palco.

Ficou diferente das referências, de propósito: contador e palavra do pedido sem brilho (G16); legenda com tempo de
leitura da casa (PV2); o card sem barra de navegador (G25); o número na tela é o dito (PV1); legenda do palco em 2 linhas
(a ref usa 1), por isso o cartão de câmera fica 60 px mais baixo que na ref4.

Pede o olho do dono (gosto, até 3):
1. **O rosto no cartão é maior que o da ref4** (rosto ~346 px contra ~300; altura 24% contra 22%), porque a gravação
   desta vitrine é fechada (pouco ombro) e precisa de escala 0,92 para cobrir o cartão de ponta a ponta. Recomendação:
   aceitar; na gravação dele, câmera um pouco mais longe (ombros e microfone no quadro, como a ref) resolve sozinho.
2. **O fundo dentro do cartão é a parede da gravação** (bege claro, janela na direita), não o cinza escuro liso da ref4.
   Recomendação: aceitar (G6: nada de tratar a gravação); gravar contra uma parede lisa e mais escura deixa igual.
3. **Texto sobre a mão no peito** no rosto fechado (a mão segura o microfone nesta gravação). Recomendação: a faixa
   escura resolve a leitura; microfone de lapela preso deixa limpo.
