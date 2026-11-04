# documental01: a prova real que se transforma no tempo da narração

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**Ainda sem vídeo aprovado.** A vitrine (prova do modelo) está em
`oficina/2026-11-03-documental01-vitrine/out/final.mp4` e espera o "ok" do dono. Depois da aprovação ela vira
`referencia/referencia.mp4` (com `folha.jpg` e `mapa.json`) e os tempos entre parênteses, como (6 s), passam a apontar
para ela. Até lá, os tempos entre parênteses apontam para a vitrine; "ref1 12 s" aponta para as referências medidas em
`analise/refN_decupagem.md`.

**A referência mostra o jeito do modelo, não um roteiro para copiar.** Siga a cara, os números e as regras; as telas,
os textos e os números do vídeo novo nascem da fala nova e do dado novo.

Uso: vídeo dark, só narração, sem rosto, das páginas da Operação Dark: **jovemdapalavra** (bíblica), **umjovemprofessor**
(ensino) e **umjovemprospero** (finanças). Serve para qualquer narração que tenha uma prova real para mostrar.

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra):
- Minha foto de perfil (nome do arquivo na pasta do estúdio):
- Chamada do fim (o que peço para a pessoa fazer):
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da seção 7,
mas não muda a cara do modelo (cores, fontes, posições, ritmo). Se um pedido daqui mudar a cara, avise antes de fazer.
Quando a pessoa corrigir algo num vídeo e a correção valer para os próximos, ofereça anotar aqui, nas palavras dela.

---

## 1. A cara do modelo

**A forma em uma frase:** uma prova real (gráfico feito de dado aberto, ou documento, mapa e pintura de domínio
público) fica na tela o vídeo quase todo e se transforma no tempo da narração: cada número dito nasce contando e para
na palavra, cada nome dito acende o seu ponto, e o texto mora em três camadas fixas.

- **Uma imagem-mãe, nenhum corte.** A mesma imagem muda de estado o vídeo todo: acende, dá zoom para ler um detalhe,
  apaga, volta (ref1: 1 corte em 66 s; vitrine: 0).
- **Nenhum segundo parado.** Dentro da imagem algo muda a cada 0,3 a 1 s, preso à palavra (contador, barra que acende,
  marcador que corre, palavra da legenda). Maior trecho sem mudança na imagem: 1,5 s, fora o apagão.
- **Número que conta e para na palavra.** O número falado nasce contando e chega no valor na última palavra dele.
- **Três camadas de texto, sempre no mesmo lugar:** rótulo pequeno em caixa alta espaçada (y 368), título em serifa
  com uma palavra em itálico na cor de destaque (y 410 a 680), legenda de uma palavra por vez (y 1270).
- **Uma família de cor e uma cor de destaque.** Preto e âmbar na família A; pergaminho e marrom na B.
- **Apagão antes do clímax:** a imagem escurece quase toda na pergunta curta perto de 62%, e a resposta acende no
  escuro.
- **Fonte pequena e honesta na tela:** o crédito do dado ou da obra, no fim (e embaixo de cada obra, na família B).

**Os três sinais (mudo, em 1 s):** (1) uma imagem de dado ou documento real ocupando o meio da tela, com um eixo ou
moldura; (2) um número grande em serifa contando; (3) a legenda de uma palavra só, em caixa alta pesada, sob a imagem.
Nenhum deles é a cor.

### As duas famílias (uma por vídeo)
| | **A. Gráfico vivo** (régua: ref1; a da vitrine) | **B. Arquivo** (régua: ref2, sem os defeitos dela) |
|---|---|---|
| Quando | a fala tem números de verdade (contagens, anos, preços, quantidades) | a fala é história, personagem, lugar, documento |
| Imagem-mãe | gráfico feito por código a partir de dado aberto (`src/dados.json`, com as fontes), sobre um eixo a 60% da altura | obra de domínio público, mapa ou página (`public/`), com pontos e fios que se desenham |
| Fundo | preto `#000000` puro | pergaminho (`#E7D7C1` → `#C7A880`) ou marrom (`#3C1F16` → `#24110E`), **um por capítulo, não por tela** |
| Texto | rótulo + título + legenda de uma palavra | rótulo + frase-chave em duas linhas (ligação em itálico pequena + frase grande em serifa negrito, que nasce do desfoque em 0,3 s); sem legenda corrida |
| Câmera | parada; zoom só para ler um detalhe | parada; viagem lenta no mapa de um lugar ao outro; aproximação lenta na obra |
| Crédito | dado: no fim | obra: embaixo de cada uma (autor, obra, ano) + lista no fim |

### Herança e o que este modelo sobrescreve
**Herda `.claude/skills/criar-modelo/referencias/heranca.md`** (e as regras G1 a G37 do `REGRAS.md`, acima de tudo).
Sobrescreve só isto, cada item pela forma de execução:
| Regra da herança | Aqui | Por quê |
|---|---|---|
| §1 Legenda: tempo de leitura 1 s + 3 palavras/s por bloco; 2 posições | legenda de **uma palavra por vez** (até 3 curtas quando a fala corre), bloco >= 0,4 s (0,5 s com 3), nunca atravessa pontuação (G35); **uma** posição só (y 1270) | a legenda é a batida da voz, palavra a palavra (ref1, o padrão do dono); quem se lê com calma é o título, e ele cumpre 1 s + 3 palavras/s (o checador cobra os dois) |
| §1 Legenda na altura do peito | y 1270 (66%), logo abaixo do eixo | não há pessoa; 66% é a medida da ref1 e fica dentro da zona segura |
| §4 Hook leve: abre com a pessoa | abre com a **imagem-mãe** já na tela e o gancho escrito no quadro 0 | não há pessoa: a imagem é o protagonista |
| §4 Zoom: no máximo ~3 cortes de zoom | zoom de câmera só para ler um detalhe, quantos o roteiro pedir (vitrine: 3 idas) | o zoom aqui é leitura do dado (ref1 3,7 s), nunca ênfase; o texto não entra nele |
| §6 Uma frase = uma cena | **uma imagem para o vídeo todo**, que muda de estado a cada frase | é a forma: 1 corte em 66 s (ref1) |
| §7 Fotos reais nas bordas, nunca protagonistas | a prova real (obra, mapa, documento) **é** a protagonista, na família B | é o que o modelo mostra; só domínio público, com crédito na tela |
| §8 Efeitos sonoros: popup em cada elemento | só um toque grave quando o contador para e um sopro no apagão; a cama vem ligada | as três referências não têm efeito audível e todas têm cama (13 a 16 dB abaixo) |

### O que separa o documental01 dos vizinhos (nenhum deles foi alterado)
| Modelo | A forma dele | O que separa |
|---|---|---|
| **youtubedark01** | um bonequinho vive cada frase; uma ilustração parada por frase, corte a cada 2 a 6 s | lá a cena é encenação desenhada e troca por corte; aqui não há personagem nem corte: uma prova real que muda de estado a cada 0,3 a 1 s, com número contando e fonte na tela |
| **ilustrations01** | metáfora de bonecos palito no preto, plano único, virada de cor a 60–76% | o mais parecido na estrutura (plano único, preto, uma cor que julga, apagão/virada a ~62%), mas lá a tela prova uma **atitude** sem dado e sem legenda; aqui a tela é **dado, nome e fonte**, com legenda de uma palavra e três camadas de texto |
| **modelodinamico02** | tipografia cinética: o texto é o design, objeto herói por tela, fundo alterna a cada tela, corte a cada 1,5 a 2,5 s | aqui o texto é contido (três camadas pequenas e fixas), quem fala é a imagem, não há corte e o fundo só troca por capítulo (família B) |
| **3d-explicativo** | maquete 3D que se monta na corrente problema/solução; proíbe número na tela | aqui o número com contador é o centro, e a imagem é dado ou documento real, não maquete |

## 2. Os números do modelo (o `parece.py` confere depois da aprovação)

| Item | Vitrine (família A) | ref1 (A) | ref2 (B) | O que é |
|---|---|---|---|---|
| Brilho (0 a 255) | 6,5 | 21 | 202 | A: quase tudo preto. B: o pergaminho domina |
| Contraste | 36 | 126 | 54 | |
| Saturação | 54 | 62 | 69 | |
| Temperatura | +1,0 | +5,5 | +17,6 | quente, puxado pelo âmbar |
| Cortes | 0 | 1 em 66 s | 3 cenas, 19 telas em 110 s | plano único |
| Palavras/s | 2,4 (122 palavras em 50,3 s) | 2,4 | 2,4 | ref3: 2,6 |
| Apagão | 62% | 62% | não tem | pergunta-clímax |
| Cama sob a voz | -31 a -32 dB nas pausas contra -17,3 dB da fala (14 a 15 dB abaixo); -19,5 dB no fecho | -13 a -16 dB abaixo | -13 a -16 dB abaixo | medido nas pausas |
| Som final | -14,0 LUFS, pico -1,0 dB | | | |

Não há rosto para medir. O `parece.py` só compara a família do vídeo aprovado (A); vídeo na família B se confere
pela folha lado a lado com a ref2 até existir um aprovado B.

## 3. Roteiro, cenas e ritmo

**O que este formato conta:** um fato verificável que muda o jeito de olhar uma coisa conhecida ("Isso não é um
gráfico qualquer, é a Bíblia inteira"). Tamanho: **50 a 70 s**, **2,4 a 2,6 palavras por segundo**.

**A espinha (cada passo vira um estado da imagem):**
1. **Gancho que muda o olhar sobre a imagem já na tela** (0 a 3 s). A imagem e o título do gancho estão no quadro 0.
2. **Ensinar a ler a imagem antes do 1º número** ("cada barra é um livro... a altura é quantos capítulos", 5 a 12 s):
   o marcador corre o eixo, a régua mede a altura.
3. **Um exemplo concreto logo depois da regra** (Gênesis 50, Obadias 1, 12 a 16 s): zoom para ler o detalhe.
4. **Escada de números subindo, terminando numa coisa do dia a dia** (66 → 1.189 → 929/260 → "três por dia, cinco no
   domingo, um ano", 16 a 32 s). Número grande sozinho não se sente; tempo de vida e rotina, sim.
5. **Apagão e pergunta curta perto de 62%** (ref1 62%, vitrine 62%; aceita 55 a 75%): "E o livro mais longo de
   todos?" (32,6 s).
6. **A resposta acende no escuro** e se compara com uma coisa conhecida (Salmos 150 x os quatro evangelhos 89).
7. **A tese só depois das provas, em par de contraste**, com a imagem voltando ao estado da abertura (laço): "não é
   grande demais... é um ano" (42 s).
8. **Uma ação, ligada à página** (salvar, seguir, comentar uma palavra), com o crédito da fonte na tela.

**Regras de roteiro:** toda frase traz um dado, um nome ou um exemplo (tirar a frase tem que mudar a tela); fato com
duas fontes conferidas antes de gravar; nada de frase de transição vazia.

**Ritmo (medido):** uma troca de tela (título) a cada 2 a 7 s (vitrine: 14 telas em 52,6 s; ref1: ~16 em 66 s); dentro
da tela, algo muda a cada 0,3 a 1 s. O checador cobra: nenhum trecho de mais de 1,5 s sem a imagem ou a tela mudar
(fora o apagão) e nenhum de mais de 1,0 s sem nada mudar, contando a legenda.

## 4. A imagem-mãe e o repertório de estados

**Família A, gráfico vivo** (o molde traz o gráfico de barras; outro tipo de gráfico se desenha no `src/Reel.tsx` com
as mesmas peças):
| Estado | O que a fala faz | Medida no molde |
|---|---|---|
| varredura que acende | o gancho nomeia a imagem; a escada soma tudo | barras acendem da esquerda para a direita em 0,8 a 1,3 s (`varre: "igual"`); na soma, em proporção ao valor (`varre: "valor"`) |
| marcador que corre o eixo | "de Gênesis a Apocalipse" | ponto no eixo + fio + pílula com o nome (Poppins 600, 20 px, caixa alta) que chega na palavra |
| régua | "a altura é..." | traço da cor de destaque ao lado da barra, sobe em 0,6 s |
| zoom para ler | o exemplo pequeno (Obadias, 1) | câmera 1,7 a 1,8x no ponto, 0,8 s, e volta; o texto não entra no zoom |
| a barra é feita das unidades | (sempre) | um fio escuro a cada unidade (cada capítulo) dentro da barra: some longe, aparece no zoom |
| destaque com brilho | o nome dito | a barra do nome sobe para nível 1,45 (halo âmbar) e as outras caem para 0,15 a 0,3 |
| divisão em grupos | "no Antigo... no Novo" | linha tracejada entre os grupos + rótulo de cada grupo na palavra dele |
| pilha (soma) | "que somam 89" | cópias das barras somadas viajam e se empilham ao lado da comparada (soma real, sem número a mais) |
| apagão | a pergunta-clímax | tudo cai para 7% em 0,5 s; a cama desce |
| laço | a tese | a varredura da abertura de novo |
| semana/rotina | a escada termina no dia a dia | 7 cartões (96 x 116 px) que entram na palavra, o último na cor de destaque |

**Família B, arquivo:** a obra/mapa entra em `public/` com origem anotada, numa moldura centrada (largura e altura no
plano), com sombra larga. Sobre ela: **pontos** que acendem no nome dito (círculo da cor de destaque + nome em itálico)
e **fios** que se desenham de um ponto a outro no tempo da fala (rota, ligação). A câmera viaja de um ponto ao outro
em vez de cortar; o zoom fica preso no topo da obra (ela cresce para baixo e nunca cobre a frase em y 400–640). Obra de
600 x 800 a partir de y 660 deixa o crédito dentro da zona segura. Crédito em itálico 22 px embaixo da obra, numa
faixa da cor do papel; o nome de cada ponto também ganha a faixa (nunca contorno na letra, G37). Troca de capítulo: troca de fundo (pergaminho ↔ marrom)
com a frase-chave nova.

**Exemplos das referências (não são regra):** o leque de arcos da ref1 (obra de Harrison e Römhild, 2007), os
medalhões dourados e o vitral da ref2, as fotos de político e o carimbo da ref3.

## 5. O texto na tela

- **Fontes:** Playfair Display (serifa de alto contraste: título, número, sub e frase-chave) e Poppins (rótulo,
  legenda, pílula, crédito). Duas fontes, como a ref1.
- **Rótulo:** Poppins 500, 30 px, caixa alta, espaçamento 0,24 em, `#D1B79B`, centro em y 368 (19,2%, medido na ref1).
  Diz o assunto da tela, nunca um número ainda não falado.
- **Título:** Playfair 400, 96 px, creme `#F3E8D6`, topo em y 410, até 3 linhas (vitrine: 2), centrado em x 540 com
  largura máx. 800 (botões do Instagram à direita). **Uma palavra em itálico 600 na cor de destaque `#D6B38D`**.
  É a frase-resumo da tela, com as palavras da fala (G2): nunca outra pergunta que não a da voz (DC2).
- **Número:** Playfair 600, 190 px (um número) ou 130 px (dois lado a lado, centros em x 330 e 730), creme, com sub
  em itálico 50 px (40 px com dois) na cor de destaque. Formato brasileiro (1.189).
- **Número na tela é o número falado (DC1, G8).** O plano declara o "dito" de cada contador; o checador confere que a
  fala diz aquilo terminando na palavra onde o contador para e que vale exatamente o número mostrado. "Cinco vezes"
  falado nunca vira "5,4×" na tela; "63 mil" falado nunca vira "63.779".
- **Contador:** começa 1 a 2,5 s antes e chega no valor no início da última palavra do número (ease de saída).
- **Legenda:** Poppins 800, 78 px, caixa alta, branca, centro em y 1270 (66%), **uma palavra por vez** (até 3 curtas
  juntas quando a fala corre), a palavra protagonista na cor de destaque. Sem sombra nem contorno (G37); o reflexo
  escuro embaixo do eixo garante a leitura.
- **Troca de tela:** a tela velha sai nos 0,15 s antes da palavra da nova e a nova entra em 0,2 s nela (a ref1
  dissolve em ~0,3 s); as duas nunca se sobrepõem.
- **Crédito:** Poppins 400, 19 px, caixa alta, `#8C7C68`, em y 1432 (74,6%), até 2 linhas, a partir da chamada final
  até o fim (vitrine: 5,7 s; mín. 2,5 s).
- **Nunca escreva o nome do modelo na tela. Nunca travessão.**

## 6. Transições, som e fecho

- **Não há corte.** A história anda dentro da imagem-mãe (família B: troca de fundo por capítulo, no máximo 3 vezes).
- **Apagão:** a imagem cai para 7% na pergunta; o título da pergunta entra no escuro; a resposta acende o seu ponto.
- **Fecho:** a imagem escurece (15%), o comando da página em rótulo + título ("SALVE ESSE VÍDEO / e comece
  *amanhã.*"), o ponto do fecho acende (Gênesis 1), o crédito sobe. Só o comando fica fixo (herança §2).
- **Som (vem ligado, `scripts/som.py`):** cama grave sintetizada (ré menor, acordes de 8 s, pad abafado e um sino
  baixo a cada 2 s), **16 dB abaixo da voz**; no apagão fica só o grave; depois da última palavra a cama sobe ~10 dB e
  fecha. Efeitos: um toque grave curto quando cada contador para e um sopro no apagão. Nada chamativo (as três
  referências não têm efeito audível sobre a voz).
- **Mixagem:** `scripts/mixar.sh`, -14 LUFS, pico -1 dBTP.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Família | A (gráfico vivo) | `"familia": "B"` + `"documento"` no plano |
| Paleta | `ouro` (A) | `"paleta": "pergaminho"` ou `"marrom"` (B); cores são gosto do usuário (G33) |
| Legenda de uma palavra | ligada na A, desligada na B | `"legenda": false/true` |
| Cama e efeitos | ligados | mixar sem `public/trilha.wav` e/ou `public/efeitos.wav` |
| Apagão | ligado | `"apagao": null` só se o vídeo não tem clímax (escrever o motivo no `plano.md`) |
| Zoom para ler | quando há detalhe pequeno | `"camera"` no plano |

## 8. Zona segura, material e "Com o que o vídeo tiver"

- Todo texto em x 60–940 e y 250–1500 (1080x1920). O gráfico pode ir de borda a borda (não é texto); o crédito nunca
  (a ref1 vaza: não copiar).
- **Voz:** narração por TTS, a voz da página (`kit/voz_gemini.py --modelo google/gemini-3-8-flash-tts`, escolhidas
  pelo dono no teste de vozes `oficina/2026-10-30-teste-vozes/`):
  | Página | Voz | Estilo (`--contexto`) |
  |---|---|---|
  | jovemdapalavra | Sulafat | "Português do Brasil. Mulher, voz suave e reverente, narração de documentário serena e firme, ritmo natural sem arrastar." |
  | umjovemprospero | Orus (ou Alnilam) | "Português do Brasil. Homem jovem confiante, conselho de finanças direto, sem pressa." |
  | umjovemprofessor | ainda não escolhida (o `branding.md` da página manda escolher entre os testes): pergunte ao dono | |
  | mentedetransbordo | Puck | "Português do Brasil. Voz alegre e curiosa, como quem conta uma descoberta." |
  O TTS calmo deixa pausas de ~1 s entre frases (a Sulafat saiu a 2,1 palavras/s): encurte as pausas para 0,4 a 0,6 s
  e, se faltar, `atempo` até 1,05 para cair em 2,3 a 2,6 palavras/s (vitrine: §10).
- **Dado e imagem:** só de fonte real ou livre. Dado: base aberta conferida em **duas fontes**, com as fontes em
  `src/dados.json` e no crédito. Obra: domínio público marcado (Wikimedia Commons ou acervo aberto), origem em
  `ORIGEM.md` do vídeo. Pessoa real, foto de banco genérica e imagem de IA no lugar de prova não entram.

### Com o que o vídeo tiver
| Recurso da referência | O que o modelo faz só com a narração e um dado |
|---|---|
| gráfico de arcos de 344 mil ligações (ref1) | **equivalente com a casa:** o gráfico do dado que a fala usa, por código (barras no molde; outro tipo, com as mesmas peças) |
| pintura e iluminura de museu (ref2) | **opção com material livre:** obra de domínio público com origem; sem obra, a família A com o dado da fala, ou a frase-chave sobre o fundo de capítulo |
| mapa com rota (ref2) | **equivalente com a casa:** pontos e fios sobre um mapa de domínio público; sem mapa, os lugares como pontos num eixo de tempo (família A) |
| foto de arquivo, foto de pessoa (ref3) | **não entra** (prova inventada ou direito de imagem) |
| carimbo, grifo à mão (ref3) | **equivalente com a casa:** o destaque com brilho no ponto dito, uma vez por bloco |
| voz do criador | **TTS da página** (tabela acima) ou a gravação de quem publica |
| cama musical licenciada | **cama sintetizada** do `scripts/som.py` |
| a fala sem nenhum número (tema só de história) | família B com a frase-chave; sem obra, os nomes como pontos acendendo num eixo do tempo |

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio (`sistema/`), menos onde está escrito "na pasta do vídeo"
(`oficina/<AAAA-MM-DD-tema>/`). ffmpeg completo: `tools/.cache/ffmpeg/` (ponha no PATH antes do `novo-video.py`; o do
Remotion não tem os filtros do `preparar.py`).

1. **Roteiro e dado:** escreva a fala seguindo a espinha da §3 e confira cada número em duas fontes. Monte o
   `src/dados.json` (itens com `nome`, `valor`, `grupo`, e as `fontes`) ou separe a obra/mapa de domínio público.
2. **Voz:** `kit/.venv/Scripts/python.exe kit/voz_gemini.py fala.txt voz.wav --modelo google/gemini-3-8-flash-tts --voz
   <a da página> --contexto "<o estilo da página>"` (tabela da §8). Encurte as pausas longas (ver §8). Escreva os
   números por extenso no texto da voz; a transcrição os devolve em algarismo.
3. **Crie o vídeo:** `QUEM=<nome> sh tools/com-trava.sh .venv/Scripts/python.exe tools/novo-video.py documental01
   <voz.wav> <AAAA-MM-DD-tema> --sem-adaptar` (o `--sem-adaptar` cai depois da aprovação, quando existir a
   `assinatura.json`). Confira `src/palavras.json`: número que a transcrição partiu ("1" + ".189") se junta num item só
   (mesmo `start` do primeiro, `end` do último).
4. **O plano em `src/plano.json`** (e o `plano.md` frase a frase na pasta do vídeo). O molde para enquanto o plano não
   bater com a fala e diz a palavra que difere. Um tempo é `segundos`, `[índice, "palavra"]` ou `[índice, "palavra",
   ±segundos]`.
   - `"fala"`, `"cauda"` (2,6 s: a cama sobe no fim), `"familia"`, `"paleta"`, `"inicial"` (nível das barras no
     quadro 0, 0,25).
   - `"telas"`: cada uma com `de` e `rotulo`, e `titulo` ("texto com *itálico*", "|" quebra a linha) ou `numeros`
     (`valor`, `inicio`, `de`, `para`, `dito`, `sub`) ou `semana` (`dias`, `valores`, `rotulos`) ou, na B, `ligacao` +
     `frase`. A 1ª tela começa em 0 (o gancho escrito no quadro 0).
   - `"barras"`: `t`, `de`/`ate` (índices), `nivel` (0 apagado, 1 aceso, 1,45 com halo), `dur`, `varre`.
   - `"apagao"`, `"camera"` (`t`, `x`, `zoom`, `dur`), `"marcas"` (`t`, `barra` ou `null`, `nome`, `dur`),
     `"reguas"`, `"divisao"`, `"pilha"`, `"documento"` (B: `arquivo`, `largura`, `altura`, `y`, `credito`, `pontos`,
     `fios`), `"destaques"` (índices das palavras protagonistas na legenda) e `"credito"`.
5. **Confira:** `node scripts/checar.mjs` (na pasta do vídeo) até `sem problemas`. Ele confere número falado =
   mostrado, contagem de 1 a 2,5 s, legenda completa (bloco >= 0,4 s, nunca atravessa pontuação), tempo de leitura das
   telas (1 s + 3 palavras/s), zona segura, imagem viva (1,5 s / 1,0 s), apagão entre 55 e 75%, crédito na tela,
   nome do modelo e travessão.
6. **Quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10 20 30 40` (na pasta do vídeo;
   `ESCALA=1` para tamanho cheio).
7. **Som:** `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo).
8. **Render:** `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts Documental01 out/so-video.mp4
   --codec=h264 --crf=16 --concurrency=2`.
9. **Mix:** `QUEM=<nome> sh ../../tools/com-trava.sh sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 public/trilha.wav
   public/efeitos.wav` (-14 LUFS, -1 dBTP; entrega sozinha no `conteudo/` do perfil).
10. **Prova:** `.venv/Scripts/python.exe tools/parece.py oficina/<v>/out/final.mp4 documental01` (depois da aprovação)
    e a folha: `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4 [conferencia/pares.json]`.

**Terceiro vídeo, tema chato, sem número forte:** use a família B com a frase-chave por capítulo e os nomes como
pontos; se nem obra houver, a linha do tempo dos nomes (família A com `valor` = ano) já é prova real. Se não houver
prova nenhuma, este não é o modelo: use o ilustrations01 (tese de atitude) ou o modelodinamico02 (tipografia).

## 10. O plano da vitrine (para comparar)

Tema da página jovemdapalavra: **a Bíblia em capítulos** (52,6 s, voz Sulafat). Dado conferido em duas fontes,
contado por código livro a livro: Almeida (`github.com/thiagobodruk/biblia`, `json/aa.json`) e King James
(`github.com/aruljohn/Bible-kjv`): 66 livros, 1.189 capítulos, 929 no Antigo e 260 no Novo, Gênesis 50, Obadias 1,
Salmos 150, os quatro evangelhos 28 + 16 + 24 + 21 = 89; "3 por dia e 5 no domingo" = 23 por semana x 52 = 1.196 >=
1.189 (um ano).

| Tempo | Fala | A imagem | Texto |
|---|---|---|---|
| 0 s | Isso não é um gráfico qualquer, | barras a 25% no quadro 0, acendem em varredura (0,25 s); halo no "gráfico" | "Não é um gráfico / *qualquer.*" |
| 2,8 s | é a Bíblia inteira, livro por livro. | varredura de brilho barra a barra em "livro por livro" | "É a *Bíblia* / inteira." |
| 5,2 s | Cada barra é um livro, de Gênesis a Apocalipse, | tudo a 30%; Gênesis acende; marcador corre de GÊNESIS a APOCALIPSE acendendo as barras | COMO LER / "Cada barra / é um *livro.*" |
| 9,2 s | e a altura é quantos capítulos ele tem. | zoom 1,8x no começo; régua sobe ao lado de Gênesis | A ALTURA / "Quantos / *capítulos.*" |
| 12 s | Gênesis tem 50, | contador 0 → 50 até "50" (13,5 s) | 50 / *Gênesis* |
| 14,3 s | Obadias, um só. | zoom 1,7x em Obadias, as outras a 15%; "1" em "um" | 1 / *Obadias* |
| 16,6 s | Somando todas, são 66 livros e 1.189 capítulos. | volta ao todo; 0 → 66 (17,8 s); varredura por valor e 0 → 1.189 (19,6 s) | SOMANDO TUDO / 66 *livros* · 1.189 *capítulos* |
| 21,1 s | 929 no Antigo Testamento, 260 no Novo. | linha entre os grupos; Antigo aceso, depois Novo; rótulos na palavra | 929 no *Antigo* · 260 no *Novo* |
| 27,2 s | Parece muito? Três capítulos por dia e cinco no domingo e você lê tudo em um ano. | tudo a 18%; 6 cartões "3" e o "5" do domingo; as barras enchem em ordem até "ano" (32,3 s) | PARECE MUITO? / a semana |
| 32,6 s | E o livro mais longo de todos? | **apagão (62%)** | "O mais *longo?*" |
| 34,7 s | Salmos, 150 capítulos, mais que os quatro evangelhos juntos, que somam 89. | Salmos acende com halo e pílula; 0 → 150; régua; os evangelhos acendem e se empilham ao lado (89) | 150 *capítulos* · 89 nos 4 *evangelhos* |
| 42 s | A Bíblia não é grande demais para você. | laço: a varredura da abertura; câmera recua 0,88x | "Não é grande / *demais.*" |
| 44,8 s | É um ano, três capítulos por dia. | as barras enchem de novo, em ordem | "*Um ano.*" |
| 46,9 s | Salve esse vídeo e comece amanhã em Gênesis 1. | tudo a 15%; marcador em Gênesis, "GÊNESIS 1" e halo na palavra | SALVE ESSE VÍDEO / "e comece *amanhã.*"; crédito |
