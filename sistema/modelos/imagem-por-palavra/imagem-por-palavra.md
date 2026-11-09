# imagem-por-palavra: uma imagem por palavra, a legenda fica, o pico explode

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde (`moldes/imagem-por-palavra/`), vale o que está aqui.

**Correção de 2026-11-07 (I-LEGENDA, I-RITMO):** a legenda, a trava e o sistema de imagem foram reescritos como regra na §1, a partir das referências; vale acima de tudo o que sobrar de antes nas seções seguintes. **Estado (2026-11-03): em prova, aguardando o olho do dono.** Ainda não há vídeo aprovado, então ainda não existem
`referencia/`, `exemplos/` nem `assinatura.json`, e o `tools/parece.py` não roda. Até a aprovação, a régua é: as duas
decupagens em `analise/refN_decupagem.md` (quadros medidos em `analise/q/`, folhas `analise/refN_tl_*.png`), o estudo do
lote em `treinamento/super-edicao-dopamina/` e a vitrine `oficina/2026-11-03-imagem-por-palavra-vitrine/out/final.mp4`.
**A referência própria definitiva é pendência:** a vitrine foi feita com a gravação comum de 30 s (só ~16 s com imagem,
para poupar crédito); o vídeo aprovado que vira `referencia/` tem de ser um vídeo do @ojessegomes inteiro no modelo, com
roteiro escrito para ser ilustrado (§9, passo 1). Quando o dono aprovar: copiar o aprovado para
`exemplos/vitrine-imagem-por-palavra.mp4`, rodar `tools/assinatura.py imagem-por-palavra` e `tools/referencia.py
imagem-por-palavra`, tirar o `--sem-adaptar` da §9 e trocar este parágrafo pela linha padrão da referência.

Regras gerais: `REGRAS.md` §0 (G1–G35, reescritas pelo dono em 2026-11-05) mandam acima deste arquivo.

**O modelo é inspiração, não molde (G30).** Ensina a forma (a imagem que entra na palavra, a legenda que fica enquanto a
imagem passa, o pico que explode) e o porquê de cada recurso. Num vídeo novo, cada recurso só entra onde a fala nova tem
o mesmo porquê; a ordem e os tempos das referências e da vitrine nunca se copiam. Padrão sem pedido: a pessoa na gravação
original, com o fundo real, sem recorte, troca de fundo, máscara, blur nem cor mexida (G6); vinheta, grão e estilos só
nas imagens. **A maior parte do vídeo é a pessoa** (o checador cobra pelo menos 50%); a imagem vem em ondas onde a fala
tem palavras concretas ligadas ao tema (G28). O vídeo abre na gravação original, dinâmico, com o gancho (G29).

**Uso:** a vitrine de edição do @ojessegomes, o nível máximo de estímulo, vertical 1080x1920.

**As referências mostram o jeito, não um roteiro (G30).** São dois vídeos de criadores de fora (ref1 @editbymmh,
minidocumentário narrado, 16:9; ref2 @sam.john.creates, criador falando + motion, 4:3). Nenhum texto, imagem, tema,
número, marca, som ou cor delas entra num vídeo: elas são medida.

Herda `.claude/skills/criar-modelo/referencias/heranca.md` e o `REGRAS.md` (G1–G35). Sobrescreve só o que está na
tabela "O que este modelo sobrescreve", no fim da §6, cada item com o motivo.

| Ref | De onde | O que ela ensina aqui |
|---|---|---|
| ref1 | painel "Final output" do post de @editbymmh (85 s) | a regra-mãe: imagem nova no início da palavra que ela ilustra, a cada 1–3 palavras (2,41 trocas/s, mediana 0,37 s); a legenda pequena que fica enquanto as imagens passam; picos tipográficos a cada ~6 s; número que pula de ordem; tarja que revela; momento-herói; estilos trocando; objeto-ponte; fecho que desacelera |
| ref2 | @sam.john.creates (49 s) | o mesmo com uma pessoa falando: fundo troca e o texto continua; palavra enorme na cor do sentido; a palavra faz o que diz; respiro com a pessoa no miolo; mosaico antes da chamada; a palavra do pedido grande no fim |

---

## 0. Do seu jeito (o dono preenche e vai somando)

- Meu nome e @ (só onde o modelo mostra; hoje nenhum lugar mostra):
- Chamada do fim (o que peço para a pessoa fazer):
- Paleta (noite, creme-lima, sangue) ou as minhas cores:
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo. A paleta e qualquer cor solta escrita aqui valem sem pedir licença
(`"paleta"` e `"cores"` no `src/plano.json`). O resto da cara (fonte, posições, tamanhos, ritmo) só muda avisando antes.
Quando o dono corrigir algo e valer para os próximos vídeos, anote aqui nas palavras dele e no `CORRECOES.md`.

---

## 1. A cara do modelo (as regras aprendidas das referências; I-LEGENDA e I-RITMO)

Isto é o que faz alguém reconhecer o imagem-por-palavra sem abrir as referências. Cada regra traz o porquê, quando usar
e quando não usar; aplique pelo sentido da fala, nunca pela ordem ou pelos tempos das referências (G30). Onde uma regra
do dono (`REGRAS.md` §0) pede outra coisa, a regra do dono vence e o ponto está marcado. Duas camadas: **(a) a legenda e
a pessoa**, que valem com qualquer material, e **(b) a faixa de imagem**, que só existe quando há material (G7).

### (a) A legenda e a pessoa (valem sempre, mesmo só com a gravação)

1. **A legenda é o pedaço que está sendo dito, nunca a frase empilhada.** Porquê: nas duas referências a tela mostra 1 a
   4 palavras por vez (ref1 "the most", "in America", "the entire global economy"; ref2 "with", "like this", "on your
   timeline"), e o pedaço cresce palavra a palavra até a fala virar a esquina; quem assiste lê junto com a voz. Como:
   blocos curtos, cada palavra estalando na voz (aparece em 2 quadros, assenta de 0,9 a 1,0 em 0,1 s, nasce 1 quadro
   antes do som), no lugar já reservado (nada empurra nada). Quando não dá: fala corrida sem pausa. Aí a G9 vence
   (bloco >= 1,5 s, palavra >= 0,4 s na tela; subtrecho curto demais junta com o vizinho do mesmo trecho) e o bloco
   cresce até 2 linhas. **Diferença por regra do dono:** nas referências o pedaço troca a cada 0,3 a 0,8 s; aqui os
   blocos têm de 4 a 11 palavras porque o mínimo é 1,5 s.
2. **Um tamanho só, sans pesada, centrada, no meio-baixo do quadro.** Inter Tight 900, 68 px, entreletra -0,02 em,
   branca com a sombra larga e suave (G16), centrada (ref1 legenda pesada branca no centro; ref2 sans pesada). Sobre a
   pessoa e a imagem: o topo da 1ª linha 40 px abaixo do queixo (até y 1340; `"queixo"` no plano quando o detector
   exagera), até 2 linhas (G12). Nada fica menor que isto. **Diferença por regra do dono:** nas referências o pedaço
   solto fica no meio do quadro; em 9:16 com o rosto da pessoa o meio é o rosto, por isso ele desce para o peito.
3. **A trava: o termo que importa ao tema vira GIGANTE por cima da gravação, com as pequenas encostadas.** Porquê: é a
   cara das duas referências (ref1 "the most / powerful / person", "called / Aladdin", "By / 2007"; ref2 "workflows",
   "directly", "keyframe"): a palavra ocupa 60 a 100% da largura e fica por cima da pessoa ou da imagem, que continua
   visível atrás. Como: Inter Tight 900, escrita como foi dita, entreletra -0,04 em, **entre 55% e 92% da largura útil**
   (o checador reprova abaixo de 55%), um tamanho de gigante no vídeo (o maior em que a mais longa cabe; v3: 157 px);
   entra com soco na voz (1,35 para 1,0 em 0,14 s, foco do borrão) e cresce 3% até o fim do bloco. As palavras de antes
   ficam em cima, alinhadas à esquerda dela (ou centradas se forem mais largas), as de depois embaixo, alinhadas à
   direita; no máximo 2 linhas pequenas no total e 1 depois. Quando: o termo do trecho com relevância ao tema (G17), um
   por bloco, ~1 a cada 5–8 s: o número dito, o nome do que se compara, a palavra da virada, o comando do fim. Termo
   curto demais para 55% da largura ("link") ganha a expressão inteira dita ("link da bio") ou fica sem gigante. Quando
   não: palavra de ligação, frase sem peso; na dúvida, legenda padrão. Pontuação e aspas fora da gigante (G18:
   `"texto": {"40": "prompts"}`). Branca como na ref1; a cor de destaque só onde a palavra carrega alerta ou emoção
   (ref2). O contador 1, 10, 100 saiu (G10).
4. **Onde a trava mora: sobre o peito, numa altura fixa.** A gigante tem o topo fixo no vídeo (G13: logo acima da última
   linha da zona, y 1500), as pequenas em cima dela podem encostar no queixo, **nunca na boca nem nos olhos** (o checador
   mede a boca ~0,18 da altura do rosto acima do queixo, já com o zoom). Duas linhas antes da gigante só num plano mais
   fechado (fechado ou close: o zoom puxa do queixo, o rosto sobe e abre lugar). Com material, a trava cai por cima da
   imagem no mesmo lugar.
5. **Cartão preto é raro.** Só com `"porque"` escrito no plano (o checador reprova sem): respiro tipográfico pedido pela
   fala, ou rosto que cobriria o texto (na v3, o fim, quando o Jessé encosta o rosto na câmera). Entra e sai com o trecho
   (G23), no máximo 4 s, sempre com a gigante dentro; nunca cartão depois de cartão trocando de cor, nem tarja em
   palavra comum. (A v2 de 2026-11-07 pôs toda gigante num cartão preto e escondeu a pessoa: errado.)
6. **A pessoa como foi gravada, em corte seco, a maior parte do vídeo.** Nada de cor, recorte, fundo trocado (G6).
   Reenquadre (aberto 1,0 / fechado 1,25 / close 1,5, puxado do queixo) só com motivo na fala: começo de explicação,
   pergunta para quem assiste, a frase que muda de assunto; nunca por tempo, nunca com som. Sem material, o reenquadre
   e a trava no cartão são o pulso do vídeo.
7. **Abertura:** a gravação original com o gancho escrito na voz (G29). Nada escrito antes de ser dito (o "gancho apagado
   desde o quadro 0" saiu: não existe nas referências).
8. **Fecho:** a palavra do pedido como gigante da trava ("link"; "EDIÇÃO" em maiúscula quando foi dita como comando),
   sem aspas dentro; a fala restante encostada nela.

### (b) A faixa de imagem (quando há material; o ritmo das referências)

9. **Uma imagem por palavra concreta, no quadro da palavra.** Porquê: a recompensa "ele disse touro, vi o touro" (ref1
   2,41 trocas/s; ref2 1,52). Como: corte seco no 1º quadro da palavra que a imagem ilustra (1 quadro antes do som); a
   imagem fica até a próxima palavra concreta (0,17 a 0,6 s; mediana 0,25–0,45 s), em tela cheia e sempre andando
   (empurra 1,00 para 1,08, recua, gira ±1,6°, desliza ±26 px), com vinheta. Palavra de ligação não ganha imagem: a
   anterior segue.
10. **A legenda atravessa o corte de imagem (E4).** A imagem troca por baixo e o bloco de texto fica parado no lugar dele,
    crescendo na voz. É isto que deixa a imagem a 0,2–0,4 s e o texto no tempo de ler (G9). O bloco só troca no fim do
    trecho ou numa quebra; a trava cai por cima das imagens (ref1 "powerful" sobre a foto), no mesmo lugar da trava
    sobre a pessoa.
11. **Ondas, não o vídeo inteiro.** A onda entra no trecho ligado ao tema que tem o que ilustrar (lista, número,
    promessa) e devolve a pessoa no começo da cena seguinte. Dentro dela: rajada (0,17–0,25 s, no máximo 3 s), respiro
    (0,5–1,5 s), cruzeiro (0,3–0,6 s); o fecho desacelera. Dentro da onda, 1,8 a 2,6 trocas/s e nenhuma janela de 5 s
    com menos de 4 (o checador mede só nas ondas de imagem; cartão não conta como onda). Prova medida em 2026-11-07 com
    quadros da própria gravação no lugar das imagens: `.tmp/reconstruindo/imagem-por-palavra/teste-b/`.
12. **Sem material, nada de imagem fingida.** G7 no modo só materiais: nada gerado nem buscado. O plano não aponta para
    imagem que não existe (o efeito tipográfico de reserva, fundos alternando com ●■▲, não substitui imagem). O vídeo
    fica com a camada (a): a pessoa, a legenda curta, a trava no cartão e o reenquadre; a falta vai para
    `material/PEDIDO.md` e para o recado.

**Os três sinais de reconhecimento, mudo, em 1 segundo:** (1) o texto curto e centrado que se escreve na voz enquanto a
tela muda por baixo; (2) a gigante com as pequenas encostadas nos cantos; (3) com material, a imagem trocando a cada
palavra concreta.

**Antes de entregar, confira lado a lado** quadros do vídeo com quadros das referências (`scripts/lado_a_lado.py` ou
folha em `.tmp/`): quem conhece as referências reconheceria a legenda? Se virou legenda de rodapé (frase inteira, sem
gigante, cartões sem palavra), refaça o plano.

**O que separa dos vizinhos** (lidos, nenhum alterado; triagem em `TRIAGEM.md`):

| Modelo | A frase dele | O que separa |
|---|---|---|
| fala-escrita | a fala se escreve na tela, corte seco pessoa / cartão chapado; o pulso vem do reenquadramento | os dois têm a trava; lá não há imagem nenhuma e o texto troca junto com a tela. Aqui a imagem troca a ~2/s **por baixo** de um texto que fica (quando há material) |
| interface-encenada | a tela encena a frase com interface de verdade, microação a cada 0,5–1 s | lá a unidade é a **frase** (um card de interface por frase); aqui é a **palavra** (uma imagem por palavra concreta), sem interface |
| trailer | podcast cinematográfico: tratamento quente na pessoa, destaques tipográficos por cima dela, ~4 cortes/min | lá o ritmo vem do texto sobre um plano longo e há cor na gravação; aqui a imagem por palavra e a gravação crua |
| minidocumentario | cada frase ganha a imagem do que está sendo dito, mundos em corte seco | o parente mais perto, mas **10x mais lento** (uma imagem por frase, a legenda zera a cada plano). Aqui uma imagem a cada 1–3 palavras e a legenda **atravessa** o corte |
| ojg | o estilo do Jessé: gravação crua, a legenda é a protagonista, nenhum efeito nem som | lá a legenda corre sem trava nem cartão; aqui a trava gigante e, com material, a imagem por palavra |

Não misturar: o que se ensina aqui (piso de 0,17 s, legenda que atravessa o corte de imagem) fica só neste modelo (G32).

**O encanto (de onde vem a dopamina, ref1 §3 da ficha):** a recompensa de reconhecimento 3 vezes por segundo, sem perder
o fio porque o texto não troca junto; o contraste entre rajada e respiro; a gigante que soca na voz. **O que as
referências evitam (e o modelo também):** a mesma densidade o vídeo inteiro; legenda grande disputando com a imagem;
plano parado; tela de texto sem imagem por muito tempo.

## 2. Os números do modelo

Medidos nas duas referências (as de 16:9 e 4:3 traduzidas para 1080x1920) e fixados aqui. A vitrine é a §10.

| Item | Nas referências | No modelo (1080x1920) |
|---|---|---|
| Trocas de imagem | `tools/ritmo.py`: **ref1 2,41/s**, ref2 1,52/s (`medir_curto`: 108,7 e 58,5 cenas/min) | **1,8 a 2,6 por segundo dentro das ondas de imagem** ( o checador conta corte, estilo, imagem da rajada e ladrilho dentro das ondas; avisa fora, reprova abaixo de 1,4). O `ritmo.py` mede o vídeo inteiro, com a pessoa: use-o só no trecho da onda |
| Intervalo entre trocas | ref1 mediana 0,37 s (p25 0,17, p75 0,57); ref2 0,60 s | mediana **0,25–0,45 s** |
| Rajada | ref1 20–25 s: 0,17–0,25 s por plano por 1 a 3 s; ref2 0–7 s | **piso 0,17 s (5 quadros)**; abaixo de 0,3 s só em rajada de **no máximo 3 s**, depois respiro |
| Janela de 5 s | ref1 4 a 16 cenas; ref2 2 a 8 | **dentro de uma onda de 5 s ou mais, nenhuma janela com menos de 4 trocas** (fora das ondas é a pessoa, G6) |
| Trava (a gigante) | ref1 "powerful", "Aladdin", "2007" 33–100% da largura; ref2 "workflows", "directly" ~60% sobre a pessoa | **sobre a gravação, 55–92% da largura útil** (o checador reprova abaixo de 55%), um tamanho no vídeo (v3: 157 px), topo fixo no peito; só no termo que importa ao tema |
| Momento-herói | ref1 12,2–15,2 s, um no vídeo | **no máximo um por vídeo**, ~2 s, na frase-promessa, se a fala tiver uma |
| Legenda (o pedaço dito) | ref1: 1–4 palavras, pesada, branca, no centro; ref2: sans pesada, centrada | **68 px** Inter Tight 900, entreletra -0,02 em, centrada, topo da 1ª linha 40 px abaixo do queixo (até y 1340; sem rosto, 1000), até 2 linhas (entrelinha 75 px); bloco >= 1,5 s, palavra >= 0,4 s (G9) |
| Tempo em cartão chapado | ref1 tela preta 1,5 s (26,0–27,5); ref2 cartões de 0,5–1 s | **no máximo 4,0 s seguidos** |
| Pessoa | ref2 55% com rosto; ref1 narrado | **pelo menos 50% do tempo** (G6; o checador reprova abaixo): a abertura, o corpo das frases e os reenquadramentos secos; a imagem vem em ondas onde a fala tem o que ilustrar. Molde: 54% |
| Fecho | ref1 75–85 s: 4–5 trocas por 5 s, planos de 0,5–0,7 s | desacelera: a última janela pode ter 3 trocas |
| Luz e cor da gravação | — | **as da gravação**: o modelo não mexe (G6) |

## 3. Cenas e ritmo

**Os planos da faixa de imagem** (`"planos"` no `src/plano.json`, cada um começa numa palavra: `"de": [índice, "palavra"]`):

| Tipo | Como é | Quando a fala pede |
|---|---|---|
| `img` | imagem em tela cheia, sempre andando (`mov`: empurra 1,00→1,08, recua, gira ±1,6°, desliza ±26 px), vinheta e faixa escura embaixo para a legenda | toda palavra concreta (objeto, lugar, ação, gente sem rosto) |
| `rajada` | várias imagens em sequência, `passo` 0,17–0,25 s | lista, "qualquer tipo de", enumeração, "tudo isso" |
| `estilos` | a mesma imagem trocando de estilo a cada 0,17 s (natural, duotone, P&B, negativo, arquivo) | verbo de movimento, velocidade, "de novo", "aceleradas" (E10) |
| `mosaico` | ladrilhos 2 colunas entrando um a um (`passo` ≥ 0,17 s); `escuro` (0–1) escurece por cima | "vários", "muitos", quantidade; recapitulação; o fundo do fecho (`passo` 0,5, `escuro` 0,62) |
| `paineis` | dois painéis com a própria gravação a 3x; `sobe` desliza para cima numa palavra | "duas", comparação, prévia, "aqui em cima" |
| `pessoa` | a gravação, `plano` aberto 1,0 / fechado 1,25 / close 1,5, o zoom puxado do queixo (só com motivo na fala, nunca aleatório, G6) | o gancho, a opinião, o respiro depois de uma rajada ou do herói |
| `card` | cartão chapado `preto`, `creme` ou `destaque`, com luz que anda devagar e grão | o pico de tela cheia, a tarja, o herói, o fecho |

**Quem decide o corte é a palavra:** a imagem entra no 1º quadro da palavra que ela ilustra (o corte cai 1 quadro antes
do `start`, E2). Dentro de uma rajada o passo é fixo. Palavra de ligação ("de", "que", "o") não ganha imagem: a imagem da
palavra concreta anterior segue até a próxima.

**Onde a onda entra (G28):** no trecho ligado ao tema que tem o que ilustrar (a lista, o número, a promessa), e no
fecho. Usada nas referências porque dá a recompensa de reconhecimento ("ele disse touro, vi o touro"); usar quando a
fala nova tiver palavras concretas com esse porquê. A onda começa numa pausa ou palavra concreta e devolve a pessoa no começo da cena
seguinte. Dentro dela: rajada (0,17–0,25 s) por no máximo 3 s → respiro (0,5–1,5 s: um cartão, uma imagem mais longa)
→ ritmo de cruzeiro (0,3–0,6 s). O fecho desacelera.

**A pessoa (G6):** é a maior parte do vídeo. Abre o vídeo na gravação original, com o gancho na legenda (G29), e conta
o corpo das frases, com reenquadramentos secos (enquadres diferentes a cada corte). Mão alta sobre o
texto num trecho da pessoa: plano mais fechado; se não resolver, a onda começa ali, desde que seja a parte forte da
frase.

## 4. Repertório

Cada item abaixo é uma tela ou recurso com o seu porquê (a coluna "gatilho"): usar só quando a fala nova tiver o mesmo
porquê (G30).

**Os picos** (`"picos"` no plano; no máximo um por bloco e só onde o termo importa ao tema, G17; no máximo 1 linha de
legenda antes e 1 depois):

| Voz | Como é | Gatilho |
|---|---|---|
| `conta` | número que **pula de ordem** (1 → 10 → 100) | **fora do padrão** (mostra números não ditos, G10; o checador reprova). Só com pedido explícito do dono |
| `gigante` | a trava (§1 regra 3): a palavra entra com soco (1,35 → 1,0 em 0,14 s, foco do borrão) e cresce 3% até o fim do bloco; as pequenas encostam nos cantos | o termo protagonista: nome, conceito, número dito (como foi dito), a palavra da virada, o comando do fim (padrão) |
| `digita` | letra a letra com cursor | ano, código, nome de produto |
| `fixo` | o comando do fecho, no meio do cartão, fica até o fim; a fala segue embaixo | "comenta X" (heranca §2: só o comando fixo; aspas fora da gigante, G18) |

**Número na tela = número falado (G10).** "100%" dito → "100%" na tela (os saltos terminam nele).
Número dito por extenso ("três") fica por extenso: o pico `gigante` mexe a palavra, não troca a grafia.

**Os efeitos** (do catálogo de 26 do manual do lote; o que está pronto no molde):

| Efeito | No molde | Gatilho | Prova |
|---|---|---|---|
| Corte-palavra | `img` | toda palavra concreta | ref1 16,0–19,8 |
| Legenda (o pedaço dito) | automático | sempre | ref1 10,0–12,0; ref2 11,3–12,3 |
| Rajada | `rajada` | lista | ref1 20–25 |
| Estilos trocando | `estilos` | verbo de movimento | ref1 41,5–42,7 |
| Pico + contador por saltos | `picos` | número, protagonista | ref1 28,5–29,3; ref2 12,0 |
| Tarja que revela | `"tarja": [[i, "palavra"]]` (o bloco inteiro) | virada ("mas", "só que"), segredo | ref1 26,2–27,3 |
| Mosaico que se monta | `mosaico` | quantidade, recapitulação | ref1 27,7–29,2; ref2 42,3 |
| Momento-herói | `"heroi": {de, ate, caixa}` | a frase-promessa, uma por vídeo | ref1 12,2–15,2 |
| Objeto-ponte | `"ponte"` (PNG recortado, atravessa os cortes) | troca de assunto, rajada (o objeto fica, o fundo troca) | ref1 0,2–3,7; ref2 13,8–15,8 |
| Flash com luz | `"flash"` | entrada de pico forte, troca de bloco (no máximo 1 a cada ~8 s) | ref1 2,67 |
| Negativo relâmpago | `"negativo"` (desligado) | choque, nunca na pessoa | ref1 74,8 |
| Dois painéis | `paineis` | "duas", prévia | — (da casa) |
| Varredura/fade de saída | automático no fim | último 0,5 s | ref1 82,7–83,3 |
| Empurrão lento | toda `img` | sempre | ref1 (quase todas as fotos) |

**Ainda não estão no molde** (desenhe em `src/Reel.tsx` só se a fala pedir, e passe pelo olho do dono): gráfico vivo
(rosca/linha), número maior que a tela, HUD de análise, caixas de rastreamento, partículas, recorte da pessoa com
profundidade (precisa de máscara por quadro: `scripts/maos.py` já roda o RVM e é o caminho), silhueta de cor (só com
imagem, nunca a pessoa: G6), PIP redondo, tela em perspectiva (só interface fiel, G25), palavra esticada, cursor falso,
ícone-pontuação (existe só no efeito tipográfico de reserva, §8), mosaico de recapitulação com contador.

## 5. Texto na tela

- **Fonte:** Inter Tight (OFL), 900 na legenda, na gigante e no herói (a sans pesada das referências). Larguras
  medidas da própria fonte (`scripts/larguras.py` → `src/larguras.json`), usadas para quebrar linhas e conferir a zona.
- **A legenda (o pedaço dito, §1 regras 1 e 2):** Inter Tight 900, 68 px, entreletra -0,02 em, branca `#F7F5F0` com sombra larga e suave
  (`0 6px 42px rgba(0,0,0,.5)`); nada de contorno, sombra colada ou brilho (G16). Sobre cartão creme, tinta `#0E0F12`.
  Cada palavra nasce 1 quadro antes da voz, no lugar já reservado, e estala (2 quadros, 0,9 → 1,0 em 0,1 s). Nada
  empurra nada, nada aparece antes de ser dito.
- **Um bloco é um pedaço do trecho (G9, G11, G14):** o bloco troca sozinho no ponto; na vírgula ou no meio, só com
  `"quebras"` no plano, e só onde os dois lados ficam com >= 1,5 s e a última palavra com >= 0,4 s. No máximo **2
  linhas**, de preferência 1 (G12). O checador avisa bloco com mais de 9 palavras (a identidade é o bloco curto).
- **Lugar:** sobre a pessoa e a imagem, a 1ª linha 40 px abaixo do queixo (`"queixo"` no plano quando o detector exagera),
  fixa no vídeo; a gigante da trava com o topo fixo no peito (§1 regra 4). No cartão (raro), a pilha centrada em y 900. Posições de destaque
  (G13): a trava sobre a pessoa/imagem, a trava no cartão, o herói; mesmo tipo, mesma posição.
- **A trava (§1 regras 3 e 4):** a gigante por cima da gravação e as pequenas encostadas; no máximo 2 linhas pequenas
  e 1 depois. Pontuação e aspas fora da gigante (G18); escrita como foi dita (G10).
- **O herói:** o bloco inteiro em 124 px, digitado letra a letra (~0,035 s por letra), a câmera recua de 1,55× a 1,0 e o
  bloco assenta em 3D (rotateY −18° → 0, rotateX 9° → 0), desfoque de movimento enquanto anda; as palavras de `caixa`
  em caixa invertida creme com letra tinta.
- **A tarja:** cada palavra do bloco é uma barra branca até ser dita e se abre em texto (0,16 s) em tela preta.
- Nunca o nome do modelo na tela (G33). Nunca travessão. Nome e @ só os reais de quem fala, e só quando dados (G8).

## 6. Transições, som e fecho

- **Corte seco** em toda troca. O flash (luz branca quente que some em 0,2 s) marca a entrada de um pico forte ou a troca
  de bloco, no máximo 1 a cada ~8 s.
- **Fecho:** desacelera e recapitula (E17). O fundo é o mosaico das imagens que já passaram, escurecido, um ladrilho a
  cada 0,5 s; a chamada vira o pico `fixo` no centro (o comando, a palavra entre aspas em MAIÚSCULA, até o fim); a fala
  restante segue na legenda. Os últimos 0,5 s fundem ao preto.
- **Som (E18): desligado por padrão, só com ordem explícita do dono (G6).** Nas referências o som por evento existe
  porque é metade da dopamina; quando o dono pedir, `scripts/final.py` toca um efeito em cada evento do
  `src/eventos.json` (o checador grava): corte = toque grave curto ("popup" grave, heranca §8, não swoosh); estilo =
  blip; rajada = sopro curto; ladrilho = tique; pico = subida + impacto grave; contador = tique por salto + sino; herói =
  teclas; tarja = estalo, com a cama sumindo 0,35 s antes da 1ª revelação; flash = subida + impacto; ponte = sopro de
  entrada e saída. **Cama contínua** (grave e ar, sem melodia) ~22 LU abaixo da voz, abaixando 4 dB sob ela: o piso nunca
  cai a silêncio entre frases (ref1 -24,8 dB, ref2 -22,7 dB de chão). Efeitos ~13 LU abaixo da voz. Final -14 LUFS,
  pico ≤ -1 dBTP. **Música só com ordem explícita** (G6): `--trilha <wav>` (16 LU abaixo da voz, com ducking).

### O que este modelo sobrescreve (e por quê)

| Regra herdada | Aqui | Motivo ligado à forma de execução |
|---|---|---|
| REGRAS §3 / memória: evento a cada 0,3–0,7 s (piso 0,3 s) | **piso 0,17 s em rajadas de no máximo 3 s**, só para imagem | é a assinatura medida (ref1 25% dos intervalos abaixo de 0,17 s; rajadas em 20–25 s). **Exceção deste modelo, não da casa** |
| REGRAS §3 "nada atravessa um corte seco" | **a legenda atravessa o corte de imagem**; nunca atravessa o fim do trecho | E4: corte de imagem ≠ corte de texto. É o que deixa a imagem a 0,2 s e o texto no tempo de ler (G9 vale para o texto) |
| heranca §4 "nos primeiros 9 s, só o que abre e mais um" (S4) | a 1ª imagem pode entrar no 1º número/palavra concreta (~1,5–2 s) | a densidade é a forma; o quadro 0 é a pessoa na gravação original, com o gancho na legenda (G29) |
| heranca §4 "no máximo ~3 cortes de zoom no vídeo" | reenquadramento seco da pessoa como respiro, no máximo 3 planos dela seguidos | sem imagem, o reenquadramento é o B-roll do modelo (§8) |
| heranca §5 "sem preto e branco"; "efeito no fundo desligado" | P&B, duotone, negativo e arquivo **só nas imagens**, 0,17 s cada, no `estilos` | E10/E14: a mesma ação em estilos é recurso da referência; a gravação da pessoa nunca recebe filtro (G6) |
| REGRAS §3 bloco ≥ 1,5 s | aceita **1,2–1,5 s** (aviso) só quando a fala não deixa outra divisão do trecho com cada palavra a 0,4 s | fala rápida de vitrine; o bloco fica o tempo da fala (G9) e nasce com a voz |
| heranca §8 "efeitos sutis" | quando o dono pedir som (G6): um efeito por evento (~2 por segundo), ~13 LU abaixo da voz | E18: o som é metade da dopamina; a voz continua na frente |

## 7. Opções (o que vem ligado e o que é escolha)

**Paletas: as do modelo, ou as do pedido explícito daquela edição (G31).** O molde precisa renderizar uma, por isso há uma padrão.

| Papel | **Noite** (padrão, ref1) | Creme e Lima (ref2) | Sangue (ref2 22 s) |
|---|---|---|---|
| Preto do cartão | `#060507` | `#0E0F12` | `#0B090A` |
| Creme do cartão | `#F0EEEA` | `#F0EEEA` | `#E6E2DE` |
| Tinta (texto no creme) | `#0E0F12` | `#0E0F12` | `#130F11` |
| Texto | `#F7F5F0` | `#F7F5F0` | `#F4F0EC` |
| Destaque (pico, duotone) | laranja `#FD7D00` | lima `#C9DA3C` | vermelho `#D8322B` |

Cores soltas no plano (`"cores": {"destaque": "#..."}`) ou na prop (`--props='{"paleta":"creme-lima"}'`).

| Opção | Padrão | Como mudar |
|---|---|---|
| Tratamento de cor na gravação | **não existe** (G6) | só com ordem explícita |
| Efeitos sonoros e cama | **desligados** (G6) | só com ordem explícita do dono: `scripts/final.py --sons` |
| Tratamento da voz | **desligado** (G6: voz crua) | só com pedido: `scripts/final.py --tratar-voz` |
| Música | desligada (G6) | `scripts/final.py out/so-video.mp4 out/final.mp4 --trilha public/trilha.wav` |
| Negativo relâmpago | desligado | `"negativo": [[i, "palavra"]]` (nunca na pessoa) |
| Flash | ligado nos picos fortes | `"flash": []` desliga |
| Objeto-ponte | ligado se houver o PNG | `"ponte": []` desliga |
| Imagem gerada por IA | **desligada** (regra absoluta do material, herança §0) | só liga se o dono pedir para aquele vídeo |

## 8. Zona segura, rosto, mãos, material e "Com o que o vídeo tiver"

- Todo texto em x 60–940 e y 250–1500 (o checador mede com as larguras reais da fonte). O rosto nunca fica coberto: o
  texto mora abaixo do queixo mais baixo medido, e o zoom puxa do queixo (ele não sai do lugar). **As mãos:** a pessoa
  costuma segurar o microfone no peito; `scripts/maos.py` mede mão e braço a cada 0,25 s (RVM + cor da pele) e o checador
  reprova acima de 15% do texto sobre elas na média de um plano da pessoa (avisa acima de 8%). O que fazer: imagem no
  lugar da pessoa naquele trecho, plano mais fechado, ou o pico num cartão.
- **O material (o gargalo):** ~2 imagens por segundo de fala com imagem (~150 por 85 s). A ordem é fixa:
  1. **Roteiro escrito para ser ilustrado** (R9): cada frase com 2 a 4 palavras concretas. Frase abstrata sem nenhuma vira
     respiro (a pessoa) ou é reescrita.
  2. **A lista palavra → imagem ANTES de editar:** `src/imagens.json` (id → `palavra` [índice, "palavra"], `arquivo`,
     `fonte`, `prompt`). `scripts/material.py --lista` confere contra a fala e escreve `material/LISTA.md`.
  3. **Material conforme o modo do vídeo** (G7, herança §0): `fonte: "usuario"` é o padrão (modo só materiais). Gerar ou
     buscar **só nos modos livre ou indicado com isso listado**, declarados por ele para aquele vídeo; aí, `scripts/material.py --gerar` → kie.ai (Nano Banana 2.1, 1K, 9:16, ~4 créditos por imagem,
     ~40 s cada), com o estilo da casa no prompt (foto cinematográfica, pretos fundos, luz única, **sem texto, sem logo,
     sem marca**). Foto vira JPG q88 (~200–400 KB). `fonte: "kie+recorte"` recorta o fundo (objeto-ponte).
     `fonte: "livre"` = foto com licença aberta (`kit/buscar.py`, anotada no `ORIGEM.md`); `fonte: "usuario"` = arquivo
     do dono. **Nunca** filme, noticiário, foto de imprensa ou logo de terceiro (ref1 usa; nós não). Gente real só de
     foto real; IA só figurante sem rosto (silhueta, mãos, de costas).
  4. **O que faltar não vira imagem fingida (§1 regra 12):** sem o arquivo, o plano daquela palavra fica com a pessoa
     (ou a trava no cartão, se o termo importa ao tema); a falta vai para `material/PEDIDO.md` e para o recado. O efeito
     tipográfico de reserva do molde (fundo alternando preto/creme com ●■▲) só aparece se o plano apontar para imagem
     ausente por engano: o render não trava, mas isso não é entrega.
  Imagem pode repetir em outra palavra (mosaico, recap, estilos): reaproveitar é barato e dá unidade.
- **Custo da prova** (só quando o dono pediu geração): gere só o trecho que vai provar o modelo (~15–20 s); o resto vai com a pessoa, cartões
  e reaproveitamento.

### Com o que o vídeo tiver

| O que a referência faz | Só com a gravação da pessoa (sem nenhuma imagem) |
|---|---|
| imagem nova por palavra concreta (ref1 2,41/s) | **nada fingido** (§1 regra 12): a pessoa em corte seco com reenquadre motivado e a trava gigante por cima dela no termo forte |
| rajada de imagens de uma lista | a lista fica na legenda, palavra a palavra na voz; se a lista é o ponto do tema, o item que importa vira a gigante |
| mosaico, estilos trocando | dois painéis da própria gravação a 3x; estilos não entram (G6: nada de filtro na pessoa) |
| objeto-ponte 3D | o pico tipográfico atravessa o corte (o número segue enquanto o fundo troca) |
| B-roll de prova, gráfico de dados | o número dito como pico `conta`; prova de verdade só se o usuário der (vira pedido) |
| narração sem rosto (ref1) | o modelo funciona igual: sem `fala.mp4` com rosto, os planos `pessoa` viram cartões; a legenda e os picos não mudam |
| trilha e pacotes de efeito | só com ordem explícita (G6): a cama e os efeitos sintetizados do `final.py` (sem licença de terceiro) |

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio (`sistema/`), menos onde está escrito "na pasta do vídeo" (`oficina/<v>/`).

1. **Roteiro escrito para ser ilustrado** (R9; vale a skill `orquestrador-conteudo`): gancho de contradição resolvido na
   2ª frase, a frase-promessa (vai virar o herói), viradas marcadas ("mas", "só que"), números ditos em comparação, fecho
   com "você". Em cada frase, marque as palavras que viram imagem.
2. **Crie o vídeo:** `QUEM=<nome> sh tools/com-trava.sh .venv/Scripts/python.exe tools/novo-video.py imagem-por-palavra <gravacao.mp4> <AAAA-MM-DD-tema> --trocar Cloud=Claude --sem-adaptar`.
   O `--sem-adaptar` é obrigatório enquanto o modelo não tem `assinatura.json`. **Apague `public/img/`** que veio do molde
   (são as imagens da vitrine; o `material.py` lista as órfãs). Sem `ffmpeg` completo no PATH o `preparar.py` cai no filtro
   de voz (ver pendências); a gravação comum já tem a base pronta em `teste-comum/base/`.
3. **Meça as mãos** (na pasta do vídeo): `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/maos.py`.
4. **Liste a fala** (na pasta do vídeo): `node scripts/conferir.mjs --palavras` (marca os fins de trecho).
5. **A lista palavra → imagem** em `src/imagens.json`, depois
   `../../kit/.venv/Scripts/python.exe scripts/material.py --lista` e, aprovada a lista,
   `QUEM=<nome> sh ../../tools/com-trava.sh ../../kit/.venv/Scripts/python.exe scripts/material.py` (gera só o que falta;
   `--folha` monta `material/folha.jpg` para olhar). Escreva o `roteiro.md` na pasta do vídeo (vai junto na entrega).
6. **O plano** em `src/plano.json`: `"planos"` (a faixa de imagem, §3), `"quebras"` (onde um trecho longo vira outro
   bloco), `"picos"` (§4; só onde o termo importa, G17), `"heroi"` (no máximo um), `"tarja"`, `"ponte"`, `"flash"`, `"texto"` (grafia na tela:
   `{"84": "“EDIÇÃO”"}`), `"paleta"`, `"cores"`.
7. **Confira** (na pasta do vídeo): `node scripts/conferir.mjs` até `APROVADO`. Confere: plano bate com a fala; piso de
   0,17 s e rajadas ≤ 3 s; **a pessoa em pelo menos 50% do vídeo (G6); trocas/s e janelas de 5 s medidas dentro das
   ondas de imagem**; cartão ≤ 4 s seguidos; enquadres diferentes entre planos da pessoa; negativo fora da pessoa; cada palavra uma vez; bloco ≤ 2 linhas, ≥ 1,5 s (1,2 com aviso), palavra ≥ 0,4 s,
   sem passar da pontuação; pico no lugar e no tamanho; zona segura; texto fora do rosto e das mãos; 2 posições de
   legenda; travessão e nome do modelo. Grava `src/presentes.json` e `src/eventos.json`.
8. **Olhe quadros** (na pasta do vídeo): `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 0 1.5 ...`
   (um pacote só; saem em `conferencia/`). Olhe o quadro 0, um logo depois de cada pico, o herói, a tarja e o fecho.
9. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSuperDopamina01 out/so-video.mp4 --codec=h264 --crf=18 --concurrency=2`.
10. **Som e final** (na pasta do vídeo): `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/final.py out/so-video.mp4 out/final.mp4`
    (padrão G6: a voz crua, sem filtro nem normalização; `--tratar-voz` trata com pedido; `--sons` liga efeitos e cama
    com pedido; entrega em `<perfil>/conteudo/` pelo `tools/entregar.py`, ou `SEM_ENTREGA=1`).
11. **Prove:** folha de 1 qps (`.venv/Scripts/python.exe tools/folha.py oficina/<v>/out/final.mp4 --fps 1 --saida oficina/<v>/conferencia/folha-1qps.jpg`),
    ritmo (`.venv/Scripts/python.exe tools/ritmo.py oficina/<v>/out/final.mp4`, olhando só as ondas: 1,8–2,6 cortes/s).
    A folha lado a lado (`scripts/lado_a_lado.py`) serve para conferir a forma, nunca para copiar a sequência (G30).
    Depois da aprovação do modelo, também `tools/parece.py` (números técnicos).

**O terceiro vídeo (tema chato, fala longa, sem prova):** a densidade dentro das ondas não sobe sozinha. Se o roteiro não
tem palavras concretas nos trechos ligados ao tema, a onda fica abaixo de 1,8 trocas/s: o checador avisa. Volte ao
passo 1 e reescreva as frases para ter o que ilustrar; número sem fonte não vira pico.

## 10. A vitrine (repertório, não roteiro)

A vitrine mostra onde cada recurso entrou e por quê. Num vídeo novo, o recurso só entra onde a fala nova tiver o mesmo
porquê; nunca se copia a ordem nem os tempos (G30). Porquês desta vitrine: pico **diferença** porque é o termo da
promessa; mosaico em "vários" porque a fala diz quantidade; rajada em "qualquer tipo de vídeo" porque é lista; herói em
"apenas um desses modelos" porque é a frase-promessa; estilos em "aceleradas" porque é verbo de velocidade; mosaico
escurecido com o comando fixo porque a fala pede comentário.

**O molde, desde a correção de 2026-11-05, vem com o plano corrigido** (`src/plano.json`, mesmas imagens): pessoa de 0 a 4,1 s
(gancho na legenda, sem o pico "100%", que caía no meio da frase); onda 1 de 4,1 a 9,5 s, a parte forte da frase longa
("te mostrar a diferença entre vários modelos que eu criei e melhorei para editar qualquer tipo de vídeo": "mostrar",
cartão creme com o pico **diferença**, mosaico em "vários", "criei", "melhorei", "editar", a rajada com a claquete); pessoa
de 9,5 a 12,5 s; o herói no cartão preto fechando a frase (12,5 a 14,5 s); pessoa de 14,5 a 17,8 s (sem os painéis nem o
"raio", que caíam no meio da frase); onda de "aceleradas em três vezes." (estilos e o pico **três vezes.**); pessoa de 20
a 25,8 s (sem a tarja do "Mas" nem o mosaico de recapitulação); a onda do fecho ("nos seus vídeos," em estilos e o mosaico
escurecido com **“EDIÇÃO”**). Pessoa 54%, 2,49 trocas/s dentro das ondas, checador `APROVADO`. A tabela abaixo é a
vitrine antiga (antes de 2026-11-05): abria num cartão e tinha pico em todo bloco, o que hoje não vale (G29, G17).

`oficina/2026-11-03-imagem-por-palavra-vitrine/` (a gravação comum de 30 s do Jessé, `teste-comum/gravacao.mp4`, base de
`teste-comum/base/`). Paleta noite. 20 imagens geradas (18 fotos + raio + a claquete recortada), cobrindo 1,7–19,9 s; o
resto vai com a pessoa, cartões e reaproveitamento.

| Tempo | Fala | Faixa de imagem | Texto |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | pessoa fechado → cartão preto com flash em "100%" → imagem "editado" → pessoa close | gancho na legenda; **100%** pula 1% → 10% → 100% (pico de tela cheia: tira o número de cima da mão com o microfone) |
| 3,1 s | Ele foi criado justamente para | "criado" (gira), "alvo" em "justamente" | legenda |
| 4,6 s | te mostrar a diferença entre vários modelos | "mostrar" → cartão creme com flash em "diferença" → mosaico de 6 em "vários" | **diferença** (pico) |
| 6,7 s | que eu criei e melhorei | "criei", "melhorei" | legenda (bloco de 1,33 s: a fala não deixa outra divisão) |
| 8,1 s | para editar qualquer tipo de vídeo usando o Claude. | "editar" → **rajada** de 5 tipos de vídeo a 0,2 s com a **claquete** atravessando → pessoa | legenda parada enquanto a rajada passa |
| 10,7 s | Inclusive, / se você estiver no Instagram agora, | pessoa fechado → "você" → "celular" → "relógio" | dois blocos (trechos) |
| 12,6 s | você está vendo apenas um desses modelos. | cartão preto | **herói** digitado, "apenas um" em caixa invertida |
| 14,5 s | Eu posso até colocar duas / prévias rápidas aqui em cima, | pessoa close → "colocar" → dois painéis a 3x → "raio" em "rápidas" → painéis sobem em "cima" | legenda |
| 17,9 s | aceleradas em três vezes. | "aceleradas" em estilos trocando → cartão preto com flash | **três vezes.** (pico) |
| 20,0 s | Mas se você quiser realmente ver | cartão preto | **tarja que revela** |
| 21,9 s | outros modelos de edição como esse e aprender | mosaico de recapitulação (8 imagens já vistas) → "editar" em estilos em "edição" → pessoa | legenda |
| 24,8 s | a como usar isso nos seus vídeos, | "aprender" → "editado" → "podcast" em estilos | legenda |
| 26,8 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | mosaico de recapitulação escurecido (6 imagens, 0,5 s cada) até o fim, fade | comando fixo **“EDIÇÃO”**; o resto na legenda |
