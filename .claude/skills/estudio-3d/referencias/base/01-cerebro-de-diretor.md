# 01 · Cérebro de Diretor

> Para que serve este capítulo: antes de qualquer linha de `bpy`, a IA precisa pensar como diretor de comercial. Este capítulo transforma um briefing solto ("faz um vídeo do meu app") em decisões fechadas: uma ideia, uma estrutura em quadros, um mundo visual, um shot list e um animatic aprovado. Tudo que vem depois (luz, material, animação, render) só executa o que foi decidido aqui.
>
> Versão de referência: Blender 5.2.2 LTS. Valores de fábrica citados aqui foram lidos por sonda no bpy 5.2.2 instalado na nuvem **[confirmado por sonda no bpy 5.2.2]**. Taxa de quadros padrão deste manual: **30 fps**. Conversão rápida: 1 s = 30 quadros (q); 0,5 s = 15 q; 1,5 s = 45 q.

---

## 0. A tese do capítulo em 10 linhas

1. Filme de produtora não começa no Blender. Começa numa frase: a UMA coisa que a pessoa tem que lembrar.
2. A UMA coisa vira uma **ideia visual** (metáfora com função), não um enfeite.
3. A ideia vira **estrutura em batidas** com quadros contados (gancho, tensão, revelação, prova, assinatura, CTA).
4. A estrutura vira **tratamento** (o mundo, a luz, a lente, o ritmo, o som) e **shot list** (cada plano com quadros, lente em mm, movimento, transição e som).
5. O shot list vira **animatic em blocos cinza** renderizado em EEVEE baixo, com folha de contato. Só depois disso existe luz e material.
6. Cada etapa tem um **arquivo de prova** e um **portão de aprovação**. Nada pula portão.
7. O produto é o herói. Um herói por plano, sempre visível, sempre grande o bastante (números na seção 7).
8. Movimento só existe com motivo. Câmera parada por preguiça e câmera girando à toa são o mesmo erro.
9. Texto na tela tem tempo mínimo de leitura calculado, e mora dentro da zona segura da plataforma.
10. A mesmice do 3D de IA tem causas técnicas conhecidas (padrões de fábrica do Blender) e uma causa criativa (ausência de ideia). As duas têm cura (seção 8).

---

## 1. O interrogatório do briefing

Um diretor de comercial nunca abre o software com um briefing de uma linha. Ele interroga. A agência ou o cliente costuma mandar algo como "vídeo de 20 s pro Reels do nosso app de delivery". Isso responde 2 de 12 perguntas. As outras 10 decidem o filme.

A regra para a IA: **se a resposta não veio no briefing e muda o filme, pergunte antes de assumir.** Se não for possível perguntar (fluxo automático), assuma a opção mais segura, escreva a suposição em uma linha no topo do tratamento com a marca `[SUPOSIÇÃO]` e siga. O dono deste manual dita muita coisa por áudio transcrito: frases cortadas e nomes trocados são comuns, então confirme nomes próprios, números e a CTA por escrito.

### 1.1 As 12 perguntas, por que importam e o que mudam no filme

| # | Pergunta | Por que importa | O que muda no filme | Sinal de que faltou perguntar |
|---|---|---|---|---|
| 1 | **O que é o produto, em uma frase, e o que ele faz que a pessoa sente?** | Sem isso não existe herói. "App de delivery" é categoria; "comida chega quente em 30 min" é benefício. | Define o herói de cada plano e o momento de revelação. | O filme mostra a tela do app girando e ninguém sabe o que ele resolve. |
| 2 | **Pra quem é?** (idade, contexto, nível de familiaridade com a categoria) | A mesma ideia é contada de jeito diferente para um CFO e para um universitário com fome às 23 h. | Ritmo (público jovem de feed aguenta cortes de 12 a 20 q; executivo B2B pede planos de 45 a 75 q), paleta, tom do texto, trilha. | Ritmo de TikTok em vídeo para diretor financeiro, ou institucional lento no Reels. |
| 3 | **Onde vai rodar?** (Reels, TikTok, Shorts, YouTube in-stream, site, TV, telão de evento) | Cada lugar tem proporção, zona segura, comportamento de som e tolerância de duração diferentes. | Proporção (9:16, 4:5, 1:1, 16:9), zona segura de texto, se o filme precisa funcionar mudo, tamanho mínimo do produto. | CTA e logo escondidos atrás dos botões do Reels. Legenda cortada no TikTok. |
| 4 | **Qual a duração? Vai ter versões?** (6, 15, 20, 30, 60 s; cortes derivados) | A duração decide quantas ideias cabem. 6 s cabe uma. 30 s cabe uma com três provas. | Número de planos, batidas, se existe tensão antes da revelação. Se houver versões, filme o 30 s pensando em quais planos sobrevivem no 15 s e no 6 s. | Cortar o 30 s pela metade e chamar de 15 s. O Google desaconselha isso para 6 s: história e duração de plano não se traduzem ([Google, bumper ads](https://www.thinkwithgoogle.com/_qs/documents/1633/au-youtube-bumper-ads-best-practices-video-editing.pdf)). |
| 5 | **Qual é a UMA coisa que a pessoa tem que lembrar?** | É a pergunta mais importante. Comercial com três mensagens não deixa nenhuma. O próprio Google pede "fazer uma coisa bem" no formato curto ([Google](https://www.thinkwithgoogle.com/_qs/documents/1633/au-youtube-bumper-ads-best-practices-video-editing.pdf)). | Vira a frase de assinatura, o plano-herói e a metáfora. Todo plano que não serve à UMA coisa sai. | O cliente pede "mostrar todas as funções". O filme vira tour de interface. |
| 6 | **Qual é o diferencial frente ao concorrente?** | O que é igual ao concorrente não vende. | Escolhe qual prova entra (a função única, não a função comum). | O filme do seu app de delivery serve para qualquer app de delivery. |
| 7 | **Qual é o tom da marca?** (3 adjetivos + 1 "não somos") | Tom define luz, cor, velocidade e som antes de qualquer referência. "Premium, calmo, preciso; não somos divertidos" já descarta pop candy. | Mundo visual (seção 2.4), curva de animação (suave e longa vs. elástica e curta), trilha. | Marca de advocacia com bolinhas quicando. Marca de energético com câmera lenta solene. |
| 8 | **Quais ativos existem?** Logo em vetor (SVG/AI/PDF), manual de marca (cores em HEX, fontes), telas reais do app em alta (PNG 1x/3x ou Figma), fotos do produto, **CAD** (STEP, OBJ, FBX, GLB), embalagem planificada (dieline), vídeo de tela gravado. | Ativo bom é metade do realismo. Sem CAD, o produto físico vai ser modelado por foto, o que custa tempo e erra proporção. | Decide se dá para fazer close extremo (precisa de CAD ou modelagem fiel), se a tela do app será real ou maquete, se o logo pode ser extrudado. | Logo vetorizado a partir de JPG pixelado. Tela de app inventada que o cliente reprova. Celular com proporção errada (o real tem 71,5 x 147 x 7,8 mm). |
| 9 | **Qual é a CTA exata?** (texto literal, destino, se há preço ou cupom) | A CTA é a última coisa lida e a mais copiada. Palavra errada aqui é retrabalho de render. | Duração do último bloco (mínimo 2 s, seção 3), tamanho do texto, se entra som de assinatura. | "Baixe agora" quando o objetivo era "peça pelo WhatsApp". |
| 10 | **Quais são as restrições?** Legais (regulação do setor: saúde, bebida alcoólica, financeiro), de marca (cores proibidas, não mostrar concorrente), técnicas (prazo, máquina), de plataforma. | Restrição descoberta depois do render custa o filme inteiro. | Corta conceitos. Ex.: clínica odontológica (pessoa jurídica) não pode publicar "antes e depois" pela Resolução CFO 196/2019 ([CFO](https://website.cfo.org.br/resolucao-cfo-196-2019/)). | Conceito aprovado e depois barrado pelo jurídico. |
| 11 | **Qual é o objetivo de negócio?** (lembrança de marca, instalação, venda, agendamento) | Filme de lembrança pede marca cedo e assinatura forte; filme de conversão pede prova e CTA fortes. | Peso de cada batida. Objetivo de conversão encurta tensão e alonga prova e CTA. | Filme bonito que ninguém sabe o que fazer depois de ver. |
| 12 | **Tem som? Locução? Trilha licenciada?** | No Reels o som costuma estar ligado, mas grande parte do consumo em Meta acontece sem som ([Benly, sem fonte oficial](https://benly.ai/learn/meta-ads/creative-best-practices) **[não verificado]**); 95% do tempo assistido no YouTube é com som ([Google ABCD](https://www.thinkwithgoogle.com/_qs/documents/8472/ABCD_Complete_V7b_HR_1.pdf)). | Se há locução, o ritmo segue a locução (o animatic usa locução guia). Se não há, o filme precisa funcionar mudo: texto na tela carrega a mensagem. | Filme que só faz sentido com locução rodando mudo no feed. |

### 1.2 Formato de saída do interrogatório (a IA preenche e entrega)

```text
BRIEFING · <cliente> · <data>
Produto em 1 frase:            ...
Benefício sentido:             ...
Público (quem, quando vê):     ...
Onde roda / proporção:         ... (ex.: Reels 9:16, 1080x1920, 30 fps)
Duração / versões:             ... (ex.: 20 s principal; 6 s derivado)
A UMA coisa:                   "..." (máx. 8 palavras)
Diferencial:                   ...
Tom (3 adjetivos + 1 não):     ...
Ativos recebidos:              logo SVG [sim/não] · telas [sim/não] · CAD [sim/não] · fotos [sim/não] · fontes [sim/não]
CTA literal:                   "..." → destino
Restrições:                    ...
Objetivo de negócio:           ...
Som:                           locução [sim/não] · trilha [licença?] · precisa funcionar mudo [sim/não]
[SUPOSIÇÃO] ...                (uma linha por suposição feita sem resposta)
```

**Portão 0:** o cliente (ou o dono) confirma este bloco por escrito. Sem isso, não existe conceito.

---

## 2. Da informação à ideia

### 2.1 Por que "mostrar o app" não é ideia

"Mostrar o app" descreve o conteúdo, não o filme. Mil apps de delivery já fizeram um celular girando com a tela acesa. Ideia é a **imagem que só este produto justifica** e que a pessoa consegue contar para alguém em uma frase: "é aquele em que as coisas bagunçadas se arrumam sozinhas quando a tela atualiza".

A pesquisa de retórica visual em publicidade ajuda a escolher o tipo de imagem. Phillips e McQuarrie descrevem três estruturas para juntar duas coisas numa imagem: **justaposição** (lado a lado), **fusão** (as duas viram um objeto só) e **substituição** (uma aparece no lugar da outra, que fica implícita). A complexidade de leitura sobe nessa ordem: justaposição é a mais fácil, substituição a mais difícil ([Phillips e McQuarrie, resumo](https://www.academia.edu/1093616/Beyond_visual_metaphor_A_new_typology_of_visual_rhetoric_in_advertising)). Um estudo de 2023 testou o efeito e encontrou que imagens de leitura mais fácil foram preferidas mesmo com 5 s de exposição, contra a ideia de que "um pouco de enigma agrada" ([Frontiers in Communication, 2023](https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2023.1266813/full)).

**Consequência prática para vídeo curto:** no feed a pessoa decide em segundos. A metáfora precisa ser lida em **até 1,5 s (45 q)** sem texto explicando. Prefira **transformação visível** (fusão que acontece na frente do espectador) a enigma parado. Substituição só com produto de marca muito conhecida.

### 2.2 Método em 7 passos (a IA executa nesta ordem)

1. **Escreva a UMA coisa como verbo + resultado.** "Organiza o caos." "Chega quente." "Deixa a pele lisa." Proibido adjetivo vazio ("inovador", "completo").
2. **Liste o antes e o depois físicos.** Que objeto, textura ou espaço representa o problema? E a solução? Ex.: caos = papéis soltos, fios embolados, peças fora do lugar; ordem = pilha alinhada, grade, encaixe.
3. **Escolha o verbo visual** que leva do antes ao depois: alinhar, encaixar, derreter, congelar, florescer, dobrar, desdobrar, encher, esvaziar, acender, apagar, condensar, revelar por trás de vidro, montar, desmontar.
4. **Amarre o verbo ao produto.** A transformação precisa ser **causada** pelo produto (a tela atualiza e os objetos se alinham; a tampa abre e o som congela). Se o produto só assiste à transformação, a ideia é decorativa.
5. **Teste de função dos objetos.** Para cada objeto que não é o produto, responda: "o que ele representa e o que acontece com ele?". Se a resposta for "deixa bonito", ele sai. É a cura direta do clichê nº 1 (cubos, cápsulas e esferas flutuando sem motivo).
6. **Teste do 1,5 s e do mudo.** Descreva o primeiro quadro-chave da transformação em uma frase de até 12 palavras sem citar o texto da tela. Se precisar de texto para entender, simplifique.
7. **Escolha o mundo visual** (seção 2.4) que serve ao tom da marca e à transformação. O mundo vem depois da ideia, nunca antes.

**Sinal de que deu errado:** o conceito pode ser trocado de produto sem perder nada ("esferas cromadas flutuando ao redor do frasco" serve para qualquer frasco). Ou o conceito só funciona com locução explicando.

### 2.3 Banco de conceitos por categoria (15 por categoria, cada um com execução em 3D)

Regra do banco: cada conceito tem um **verbo visual** e uma **causa ligada ao produto**. Nenhum tem enfeite flutuante sem função. A coluna "Execução em 3D" descreve o plano-chave em Blender.

#### 2.3.1 App mobile

| # | Conceito | Execução em 3D (plano-chave) |
|---|---|---|
| 1 | O app organiza o caos | Recibos, chaves, post-its e moedas espalhados numa mesa; a cada toque na tela, um grupo desliza e se alinha numa grade de 4 colunas com ease-out de 12 q; câmera de cima, 50 mm. |
| 2 | A notificação vira objeto | A notificação sai da tela como placa de vidro de 3 mm, cai na mão aberta do usuário (ou numa bandeja) e mostra o conteúdo real; shape key de "pouso" com 4 q de compressão. |
| 3 | A fila some | Bonecos de argila numa fila longa; o app aceita o pedido e a fila inteira desliza para dentro da tela como cartas sendo recolhidas; diorama isométrico, lente 85 mm para achatar. |
| 4 | O dinheiro tem caminho | Moedas rolam por uma canaleta que se monta peça a peça conforme o usuário arrasta o dedo; a canaleta termina no cofre da tela. |
| 5 | Mapa que vira rua | O mapa 2D da tela se ergue em relevo (extrusão animada de 0 a 2 cm) e a câmera entra nele até o nível da rua; transição por match cut da tela para a cidade. |
| 6 | O botão pesa | O botão principal do app é um botão físico de cerâmica com 8 mm de curso; o polegar aperta, o mundo ao redor reage (a luz muda de quente para fria). |
| 7 | Camadas da interface | A tela se separa em 4 lâminas de vidro afastadas 15 mm em Z, câmera passa por entre elas mostrando cada camada (fundo, card, botão, notificação). |
| 8 | Hábito empilhado | Cada dia de uso adiciona um bloco de madeira numa torre; 30 dias = torre alta; a tela mostra o contador batendo. |
| 9 | Tempo devolvido | Um relógio de areia; quando a tarefa é concluída no app, a areia volta para cima; luz natural de janela. |
| 10 | A conversa encaixa | Balões de mensagem como peças de quebra-cabeça de acrílico que se encaixam e formam o logo. |
| 11 | O celular como janela | A tela é uma janela real: a câmera atravessa o vidro e entra num mundo que reage ao que a interface mostra (playlist, viagem, treino). |
| 12 | Peso tirado das costas | Uma mochila de pedras de argila; cada função resolvida tira uma pedra que vira um ícone e entra na tela. |
| 13 | Um toque, uma reação em cadeia | O toque derruba um dominó que dispara uma sequência física (dominó, bola, gangorra) que termina com o pedido na porta. |
| 14 | Do vazio ao cheio | Prateleira vazia; ao rolar o feed do app, produtos caem em seus lugares com quique de 2 ciclos. |
| 15 | O app acende a casa | Maquete de casa às escuras; cada ícone tocado acende um cômodo (luz de área por cômodo, 2700 K). |

#### 2.3.2 SaaS e web (dashboard, plataforma)

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | Papéis viram gráfico | Notas fiscais caem e se empilham exatamente na altura das barras do gráfico do dashboard ao fundo; pilhas de 0 a 100% em 24 q cada, defasadas 4 q. |
| 2 | Planilhas derretem | Uma pilha de planilhas impressas amolece (deformação por lattice) e escorre para dentro de um card limpo do dashboard. |
| 3 | O dado tem luz | Cada número do dashboard emite luz que ilumina um objeto físico correspondente (caixa = estoque, moeda = caixa). |
| 4 | Fios desembolados | Um emaranhado de cabos (integrações) se desfaz e se conecta em portas ordenadas atrás do monitor; curvas animadas com taper. |
| 5 | Equipe sincronizada | Metrônomos fora de ritmo numa mesa; quando o software entra, todos entram em sincronia (fenômeno físico real de sincronização). |
| 6 | Janela de vidro em camadas | A interface explodida em 5 painéis de vidro fosco com profundidade; câmera em travelling lateral, foco que muda de painel a painel. |
| 7 | O relatório se monta sozinho | Blocos tipográficos de metal (tipos móveis) caem e compõem o relatório em segundos. |
| 8 | Ponte entre ilhas | Ilhas de dados separadas (diorama) unidas por uma ponte que se constrói peça por peça quando o fluxo é ativado. |
| 9 | O alarme antes do fogo | Uma vela perto de um papel; o painel acende alerta e uma tampa de vidro cobre a vela antes do fogo pegar. |
| 10 | O labirinto vira linha reta | Labirinto de paredes cinza; o software abre as paredes e o caminho vira um corredor reto até o resultado. |
| 11 | Engrenagens no lugar | Engrenagens soltas rolando; o produto encaixa cada uma e o mecanismo gira; som mecânico em sincronia. |
| 12 | O cursor como herói | O cursor do mouse vira objeto 3D de acrílico que arrasta elementos reais de um mundo para outro. |
| 13 | Do rascunho ao final | Um wireframe de linhas a lápis ganha material camada por camada (linha, cinza, cor, vidro) conforme o recurso de IA trabalha. |
| 14 | A pilha de abas | Dezenas de abas de navegador como cartões empilhados; um gesto as funde num único card do produto. |
| 15 | Mapa de calor real | Um piso de casa com marcas de pegada que acendem conforme o analytics mostra o caminho do usuário. |

#### 2.3.3 Serviço (clínica, advocacia, consultoria, agência, serviço local)

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | O nó desfeito | Uma corda com nó cego (o problema jurídico) se solta sozinha conforme o advogado "puxa" o fio certo; macro, 100 mm. |
| 2 | Livro pop-up | O serviço contado como livro pop-up de papel: cada virada de página levanta uma cena (agendamento, atendimento, resultado). |
| 3 | A agenda respira | Calendário lotado e apertado; com o serviço, os blocos se espaçam e ganham ar; luz natural. |
| 4 | Chave certa | Molho de 30 chaves; só uma entra na fechadura e gira; metáfora de diagnóstico preciso. |
| 5 | Planta da casa que cresce | Maquete de imóvel que se monta andar por andar (construtora, arquitetura). |
| 6 | A balança se equilibra | Balança de pratos desequilibrada; o serviço coloca o peso certo e ela nivela com 2 oscilações amortecidas. |
| 7 | O mapa de rotas da consultoria | Tabuleiro com caminhos confusos; peças se reorganizam num caminho claro até a bandeira. |
| 8 | Porta aberta | Uma porta pesada que se abre sozinha revelando um espaço claro e acolhedor (serviço que recebe bem). |
| 9 | Peças de dominó em pé | Peças caídas se reerguem em sequência reversa (recuperação, reabilitação). |
| 10 | A lupa que acha o erro | Documento enorme; a lupa passeia e um erro pequeno acende em vermelho, depois se corrige (contabilidade, auditoria). |
| 11 | A planta da agência | Um vaso com broto que cresce em timelapse conforme os números do cliente sobem (agência de marketing), sem promessa de número. |
| 12 | O caminho iluminado | Corredor escuro; luzes de piso acendem em sequência guiando o cliente até a sala (atendimento guiado). |
| 13 | Ferramenta guardada no lugar | Painel de ferramentas com contornos vazios; cada ferramenta volta ao seu contorno (organização, manutenção). |
| 14 | O relógio para de correr | Ponteiros girando rápido desaceleram até o ritmo normal quando o serviço resolve (tranquilidade). |
| 15 | Bairro em miniatura | Diorama do bairro com a fachada do negócio local; um pino de mapa cai e marca o endereço (serviço local). |

#### 2.3.4 Produto físico eletrônico (fone, celular, relógio, caixa de som, periférico)

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | O silêncio congela o mundo | Esferas de aço quicando numa membrana de alto-falante; o cancelamento de ruído liga e elas param no ar. |
| 2 | Vista explodida que respira | O produto se desmonta em camadas reais (CAD) afastadas 8 a 20 mm e volta a montar com encaixe audível. |
| 3 | A bateria enche um copo | Um copo de vidro enche de luz líquida conforme a carga sobe de 0 a 100%. |
| 4 | Resistência à água | O produto atravessa uma lâmina de água em câmera lenta; gotas escorrem da superfície revestida. |
| 5 | O som vira forma | Ondas sonoras visualizadas como lâminas de papel que se dobram ao ritmo do grave. |
| 6 | Encaixe magnético | Duas peças se atraem de 10 cm de distância e encaixam com estalo; o ímã é o herói. |
| 7 | Tela que acorda | Produto no escuro total; a tela acende e é a única luz da cena (key de emissão sobre o rosto ou mão). |
| 8 | Peso de pena | O produto pousa numa balança de cozinha ao lado de uma pena; o ponteiro mal se mexe. |
| 9 | Precisão de relojoeiro | Câmera macro passa por engrenagens e circuitos reais até sair pela face do relógio. |
| 10 | Carrega pelo ar | Partículas de luz com função (energia) correm da base para o aparelho, não em volta dele. |
| 11 | O clique perfeito | Macro de uma tecla descendo 4 mm com som gravado; o mundo atrás pulsa uma vez a cada clique. |
| 12 | Cor que nasce do material | Pó de pigmento cai sobre o produto cinza e o colore na cor da edição. |
| 13 | Proteção visível | Objeto cai de 1 m sobre a capa; a onda de impacto aparece como anel no material e some. |
| 14 | O cabo some | Fios embolados atrás da mesa se recolhem para dentro do produto sem fio. |
| 15 | Dia inteiro em 3 s | O sol cruza a cena (luz natural animada, 6 h a 22 h) e a bateria ainda está alta. |

#### 2.3.5 Cosmético e perfume

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | A nota vira matéria | Cada nota do perfume (bergamota, couro, baunilha) aparece como material real que se dissolve no vidro do frasco. |
| 2 | Textura em macro | Uma gota de sérum cai e se espalha num vidro, mostrando a viscosidade; 100 mm, f/2,8, câmera lenta. |
| 3 | A pele lisa como superfície | Uma superfície de areia com ondulações é alisada por uma passada de creme. |
| 4 | Frasco esculpido pela luz | Só o contorno do frasco aparece por luz de recorte; a forma se revela por uma faixa de luz que varre de baixo para cima. |
| 5 | Ingrediente inteiro | A flor ou fruta real gira lentamente e se transforma no frasco (fusão animada por shape key ou remesh). |
| 6 | A fragrância tem rastro | Um véu de tecido fino segue o caminho do borrifo no ar e pousa sobre um ombro de gesso. |
| 7 | Hidratação que enche | Uma esfera murcha de borracha volta a ficar cheia e lisa quando o creme toca. |
| 8 | Proteção solar como sombra | Uma pérola exposta ao sol forte; o produto cria uma sombra em forma de escudo sobre ela. |
| 9 | Batom que constrói a cor | A bala do batom sobe do estojo e deixa um traço que vira a paleta inteira da coleção. |
| 10 | O frasco como arquitetura | Câmera atravessa o frasco como se fosse um prédio de vidro; luz de catedral. |
| 11 | Camadas da fórmula | Líquidos de cores diferentes descem em camadas num tubo e se misturam no tom final. |
| 12 | Gota que vira joia | A gota de óleo para em macro e reflete o ambiente como um diamante (dispersão em Cycles). |
| 13 | Toque de seda | Um tecido de seda desliza sobre o frasco e escorrega pelo vidro; simulação de tecido simples. |
| 14 | Ritual de manhã | Luz de janela atravessando persiana, rotina em 4 produtos alinhados que acendem em sequência com o sol. |
| 15 | O cheiro em cor | Fumaça colorida contida dentro de uma redoma de vidro; ao levantar a redoma, a cor ocupa o quadro. |

#### 2.3.6 Bebida

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | O frio que se ouve | A lata sai do gelo, a condensação se forma em timelapse, o abrir da lata é o clímax sonoro. |
| 2 | A onda da fruta | Uma fatia de fruta cai num lago do líquido e a coroa de respingo forma o logo por um quadro. |
| 3 | Sede no deserto | Areia seca rachada; a lata pousa e a rachadura se fecha ao redor dela. |
| 4 | Gás com função | Bolhas sobem e empurram as letras do slogan para cima até a tampa. |
| 5 | Energia acende a cidade | A lata no centro de uma maquete noturna; ao abrir, as janelas acendem em onda (neon noturno). |
| 6 | Garrafa esculpida em gelo | A garrafa nasce de um bloco de gelo que derrete e revela o vidro. |
| 7 | O despejo perfeito | Plano de despejo (pour) em câmera lenta, líquido iluminado por trás com luz de 4000 K, espuma subindo no copo. |
| 8 | Café que acorda o dia | Xícara no escuro; o primeiro gole acende a manhã pela janela. |
| 9 | Ingredientes em queda | Ingredientes reais caem em câmera lenta numa ordem que conta a receita. |
| 10 | Brinde em sincronia | Duas latas se tocam; o toque gera uma onda de luz que varre o fundo. |
| 11 | A cor do sabor | O fundo inteiro é o líquido; a lata emerge de dentro da própria bebida. |
| 12 | Tampa que estoura confete funcional | Na abertura, o que sai são as frutas do sabor (não confete genérico). |
| 13 | Vapor como desenho | O vapor do chá desenha o símbolo da marca e se desfaz. |
| 14 | Gelo como música | Cubos de gelo caem no copo seguindo as batidas da trilha (cada batida, um cubo). |
| 15 | Rótulo que se monta | Elementos do rótulo (ilustrações) saem do papel e voltam para a lata em ordem. |

#### 2.3.7 Comida

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | Camadas que caem no lugar | O hambúrguer se monta caindo ingrediente por ingrediente com quique curto, câmera lateral de 85 mm. |
| 2 | O queijo que puxa | Macro do queijo esticando entre duas metades; cabo de rig com curva longa. |
| 3 | O calor viaja | Vapor que sai da cozinha percorre um mapa e chega à porta ainda quente. |
| 4 | Ingrediente de origem | Câmera sai do campo (diorama), passa pela colheita e termina no prato. |
| 5 | Crocância que se ouve | Mordida em macro com migalhas voando; som é o herói. |
| 6 | O prato se arruma | Ingredientes crus espalhados se organizam em empratamento de chef com movimentos de 8 q cada. |
| 7 | Receita em fatias | O produto é cortado por uma lâmina invisível e mostra o interior em corte limpo. |
| 8 | Fome às 23 h | Cozinha escura com geladeira vazia; uma caixa pousa no balcão e acende a cozinha. |
| 9 | Chocolate que derrete em forma | Uma barra derrete e escorre formando o logo. |
| 10 | Massa que cresce | Timelapse de fermentação: a massa sobe e vira o pão da marca. |
| 11 | Pizza que se completa | Fatias faltando voltam ao lugar uma a uma, cada uma com um sabor. |
| 12 | Frescor que respira | Folhas verdes com gotas de água, ventilador suave, luz natural fria de manhã. |
| 13 | Tempero que dá cor | Pó de tempero cai sobre um prato cinza e dá cor a ele. |
| 14 | Embalagem que abre como presente | A caixa se desdobra sozinha e o produto sobe de dentro. |
| 15 | A mesa da família | Mesa vazia que se enche de pratos em sequência rápida até a cena completa. |

#### 2.3.8 Moda e calçado

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | O tênis desmontado | Cabedal, entressola e solado se separam em vista explodida e voltam com encaixe. |
| 2 | Pegada que ganha vida | Pegadas na areia molhada acendem uma a uma até o tênis aparecer. |
| 3 | Tecido que respira | Malha em macro mostra os poros abrindo e o ar passando (partículas com função: ar). |
| 4 | Amortecimento visível | Uma bola de boliche cai sobre a entressola e quica como numa cama elástica. |
| 5 | A peça se costura | Linhas costuram a peça no ar, ponto a ponto, até a roupa completa. |
| 6 | Cabide vazio | Cabide no centro; a peça cai do alto e se assenta com simulação de tecido. |
| 7 | Do esboço ao produto | Desenho a lápis no papel se ergue e ganha material até virar o calçado real. |
| 8 | A cor da coleção | Bobinas de linha de cores diferentes desenrolam e tingem a peça. |
| 9 | O passo em câmera lenta | Pisada lateral a 120 fps simulados, solado dobrando. |
| 10 | Resistência à chuva | Gotas batem no tecido e escorrem sem molhar. |
| 11 | Tênis no pedestal | Pedestal giratório de museu com plaqueta; editorial de revista. |
| 12 | A peça que se dobra sozinha | A roupa se dobra numa embalagem perfeita (logística, e-commerce). |
| 13 | Caixa de sapato como palco | A tampa abre e o interior da caixa é um mundo em miniatura da coleção. |
| 14 | Tramas que se encaixam | Fios de cores diferentes entrelaçam e formam o padrão do tecido. |
| 15 | O mesmo look, 4 cidades | O mesmo calçado num pedestal; o mundo ao redor troca a cada 12 q (rua, praia, escritório, noite). |

#### 2.3.9 Embalagem

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | A caixa se desdobra | A dieline plana se dobra sozinha até virar a embalagem (animação de dobra por bones ou shape keys). |
| 2 | Abertura em camadas | Tampa, papel de seda e produto aparecem em 3 tempos (unboxing ideal). |
| 3 | Embalagem como vitrine | Câmera entra por uma janela recortada da caixa e encontra o produto dentro. |
| 4 | Material sustentável | Papelão se desfaz em fibras que voltam a ser árvore (cuidado: só com prova real de sustentabilidade). |
| 5 | Pilha de prateleira | Dezenas de embalagens caem em grade perfeita formando uma prateleira de mercado. |
| 6 | Laço que se desfaz | Fita de cetim se desata sozinha com simulação de tecido. |
| 7 | Detalhes de acabamento | Macro em hot stamping, verniz localizado e relevo; luz rasante a 10° para mostrar textura. |
| 8 | Embalagem que protege | Uma esfera de aço cai sobre a caixa e a caixa absorve sem amassar. |
| 9 | Família de produtos | A embalagem se multiplica em sabores, cada uma deslizando 1 posição. |
| 10 | Rótulo envolvente | O rótulo plano se enrola ao redor do frasco como bandeira. |
| 11 | Peça a peça | Os elementos gráficos da arte sobem do papel e voltam (relevo animado). |
| 12 | Caixa que vira expositor | A caixa abre e se transforma num display de balcão. |
| 13 | Viagem da caixa | A caixa viaja por esteira, caminhão e porta em diorama. |
| 14 | Cor que vaza | A cor da marca escorre de dentro da caixa ao abrir. |
| 15 | Silhueta reconhecível | Só a silhueta em contraluz; um passo de luz revela a frente. |

#### 2.3.10 Marca e logo (vinheta, revelação, assinatura)

| # | Conceito | Execução em 3D |
|---|---|---|
| 1 | Logo montado pelo produto | Peças do produto real se juntam e formam o logo por 18 q, depois se desfazem. |
| 2 | Revelação por sombra | Objetos sem sentido aparente projetam, sob uma luz específica, a sombra exata do logo. |
| 3 | Logo como fechadura | Uma chave entra e gira, revelando o logo como a própria fechadura. |
| 4 | Gravação a laser | Um feixe grava o logo numa placa de metal com faíscas e fumaça leve. |
| 5 | Logo de líquido | O logo nasce como líquido que escorre e solidifica (shape key de líquido a sólido). |
| 6 | Letras que caem no lugar | Letras extrudadas caem de alturas diferentes e se assentam com quique de 2 ciclos. |
| 7 | Logo de luz | Neon do logo acende letra por letra com tremido de 3 q no início. |
| 8 | Logo de papel | O logo é dobrado em origami e se desdobra para a forma plana final. |
| 9 | Logo como objeto de mesa | O símbolo vira objeto físico (peso de papel de vidro) que a câmera contorna. |
| 10 | Assinatura por match cut | O último objeto do filme tem a mesma forma do símbolo e funde nele. |
| 11 | Logo em tecido | O símbolo bordado aparece por tecido que se estica sobre ele. |
| 12 | Logo que respira | O símbolo pulsa 1 vez em sincronia com o som de assinatura (sonic logo). |
| 13 | Logo em relevo de argila | O símbolo é esculpido em argila por uma ferramenta invisível em timelapse. |
| 14 | Logo atrás do vidro | O logo aparece através de vidro canelado que fica nítido conforme a câmera se aproxima. |
| 15 | Logo na arquitetura | O símbolo é a planta de um prédio visto de cima no diorama; câmera sobe até revelar. |

### 2.4 Os 16 mundos visuais e quando usar cada um

O mundo é a combinação de fundo, luz, paleta e materiais que veste a ideia. Os 7 primeiros já foram testados no laboratório do Claude Code (ver `_CONTEXTO.md`). Os outros 9 são propostos e precisam de teste **[testar no Blender]**. Os 16 mundos daqui são os 16 primeiros do cap 02 (que tem 19, com fichas completas); status de teste: ver cap 02 (ver 00 · Padrões da casa).

| Mundo | Tom de marca que pede | Luz base | Paleta | Lente típica | Evite quando |
|---|---|---|---|---|---|
| Estúdio premium | Tecnologia, saúde, B2B sério | Área grande a 45°, contorno a 135° | Neutros quentes + 1 cor da marca | 85 a 100 mm | Marca jovem e barulhenta |
| Luxo escuro | Perfume, relógio, bebida destilada, fone premium | Recorte forte, fundo a 2 a 3 stops abaixo | Preto, dourado ou cobre, 1 acento | 100 mm macro | Produto escuro sem contorno possível |
| Pop candy | App de consumo, snack, moda jovem | Suave e alta, sombras curtas | 3 cores saturadas + branco | 35 a 50 mm | Financeiro, saúde séria |
| Diorama isométrico | Delivery, logística, cidade, SaaS de processos | Sol a 50° + céu suave | Pastel com 1 cor forte | 85 a 135 mm (achata) ou ortográfica | Produto físico pequeno que precisa de close |
| Argila | Serviço, educação, saúde acolhedora | Suave, janela grande | Terracota, creme, verde sálvia | 50 mm | Luxo, tecnologia de ponta |
| Vidro e cromo | SaaS, fintech, interface de app, eletrônico | Faixas de luz (strip) + bandeiras pretas | Frio, azul ou violeta, reflexos | 50 a 85 mm | Marca rústica, comida |
| Orgânico líquido | Bebida, cosmético, skincare | Contraluz para o líquido | Cor do produto dominante | 100 mm macro | Serviço sem objeto físico |
| Brutalista tech | Dev tools, cibersegurança, B2B técnico | Dura, lateral, sombras longas | Concreto, preto, 1 neon | 24 a 35 mm | Marca acolhedora |
| Macro cinematográfico | Eletrônico, relógio, cosmético, comida | Pequena e precisa, f-stop pela tabela 3.3 do cap 04 | Da marca | 100 mm, foco curto | Interface de app (texto ilegível em macro) |
| Papel e recorte | Serviço local, educação, saúde, ONG | Suave com sombra curta e definida | Papéis coloridos foscos | 50 mm | Produto de luxo |
| Retrofuturo | Música, games, bebida energética | Néon + bruma | Laranja, magenta, ciano | 35 mm | Saúde, jurídico |
| Neon noturno | Energético, delivery noturno, games | Emissores + chão molhado | Escuro com 2 neons complementares | 35 a 50 mm | Marca diurna, infantil |
| Natureza e luz do sol (luz natural) | Casa, café, cosmético natural, serviço | Sol pela janela (persiana) | Quente, verdes | 50 mm | Tecnologia fria |
| Holográfico | Cripto, IA, beleza futurista | Iridescência (Thin Film) | Arco-íris filtrado | 85 mm | Marca conservadora |
| Editorial de revista | Moda, calçado, perfume, lançamento | Flash duro com sombra marcada | Fundo de papel colorido sólido | 85 mm | Interface de app |
| Tátil têxtil | Moda, casa, cosmético, bebê | Rasante a 10 a 20° | Tons de tecido | 100 mm | Eletrônico frio |

**Regra:** um filme usa **um** mundo. Mudança de mundo dentro do filme só se for a própria ideia (antes cinza e depois colorido, por exemplo).

---

## 3. Narrativa de comercial por duração

### 3.1 As seis batidas

Toda duração usa as mesmas seis funções. O que muda é quanto tempo cada uma recebe e se ela pode ser fundida com a vizinha.

| Batida | Função | Pergunta que responde | Regra de ouro |
|---|---|---|---|
| **Gancho** | Parar o polegar | "Por que eu paro aqui?" | Movimento ou contraste já no quadro 1. Nada de fade do preto. O Meta e o TikTok tratam os 3 primeiros segundos como janela de decisão ([TikTok, consumer electronics](https://ads.tiktok.com/business/creativecenter/quicktok/online/creative-tips-consumer-electronics/pc/en); [TikTok Ads Help](https://ads.tiktok.com/help/article/creative-best-practices?lang=en)). |
| **Tensão** | Criar o problema ou a curiosidade | "O que está errado ou o que vai acontecer?" | O estado "antes" da metáfora. Curto. |
| **Revelação** | Mostrar o produto como causa da mudança | "O que resolve?" | O produto aparece inteiro e grande. É o plano-herói. |
| **Prova** | Mostrar que é verdade | "Como eu sei?" | Uma função real por prova, com tela ou detalhe real. |
| **Assinatura** | Fixar a marca | "Quem é?" | Logo + frase da UMA coisa. Som de assinatura. |
| **CTA** | Dizer o que fazer | "E agora?" | Texto literal, legível, dentro da zona segura, mínimo 2 s. O Google pede cerca de 2 s de fechamento no bumper de 6 s ([Google](https://www.thinkwithgoogle.com/_qs/documents/1633/au-youtube-bumper-ads-best-practices-video-editing.pdf)). |

Dois fatos de pesquisa que mexem em todas as durações:

- **Marca cedo.** A Kantar mediu anúncios de 15 s que empataram com os de 30 s em impacto de marca; os fatores comuns foram marca presente nos **2 primeiros segundos** e produto em foco nos **10 primeiros** ([Kantar, 2026](https://www.kantar.com/north-america/company-news/kantar-super-bowl-ad-study-15-second-ads-match-30-second-spots)). O Google pede produto ou marca nos primeiros 5 s e dois ou mais planos nos primeiros 5 s ([Google ABCD](https://www.thinkwithgoogle.com/_qs/documents/8472/ABCD_Complete_V7b_HR_1.pdf)). A System1 achou +13% de lembrança de marca com logo cedo, e que o logo pequeno no canto preserva a emoção melhor que o logo grande na abertura ([System1](https://system1group.com/blog/this-isnt-another-just-stick-a-logo-on-it-piece)).
- **Tradução para 3D:** marca cedo não significa logo gigante no quadro 1. Significa: o produto com a marca visível, ou um selo pequeno de marca no canto superior dentro da zona segura, até o quadro 60 (2 s).

### 3.2 Tabelas de batidas com quadros a 30 fps

Notação: intervalo em segundos e em quadros (q), com o quadro inicial 1. "Planos" é a faixa típica de número de cortes.

#### 6 s (180 q) · uma ideia, sem tensão

| Batida | Segundos | Quadros | O que acontece |
|---|---|---|---|
| Gancho + revelação (fundidos) | 0 a 1,5 | 1 a 45 | A transformação já começa com o produto no quadro. |
| Prova única | 1,5 a 4 | 46 a 120 | Uma prova só, o melhor detalhe. |
| Assinatura + CTA | 4 a 6 | 121 a 180 | Logo, frase de até 5 palavras, CTA. Segurar o último quadro pelo menos 15 q. |

Planos: 2 a 4. Sem espaço para tensão; o "antes" vira no máximo 15 q dentro do gancho. Faça como série de 3 a 5 variações em vez de um corte do filme longo ([Google](https://www.thinkwithgoogle.com/_qs/documents/1633/au-youtube-bumper-ads-best-practices-video-editing.pdf)).

#### 15 s (450 q) · uma ideia, uma prova forte

| Batida | Segundos | Quadros | O que acontece |
|---|---|---|---|
| Gancho | 0 a 1,5 | 1 a 45 | Imagem de contraste ou movimento forte, produto ou marca visível até q60. |
| Tensão | 1,5 a 4 | 46 a 120 | O "antes" da metáfora. 1 a 2 planos. |
| Revelação | 4 a 8 | 121 a 240 | A transformação causada pelo produto. Plano-herói com segura de 30 a 60 q no pico (mínimo 24 q; 12 a 18 q só dentro de plano curto de gancho) (ver 00 · Padrões da casa). |
| Prova | 8 a 11,5 | 241 a 345 | 1 prova (ou 2 curtas). Tela real ou detalhe real. |
| Assinatura | 11,5 a 13 | 346 a 390 | Logo + frase. |
| CTA | 13 a 15 | 391 a 450 | CTA literal, 2 s. |

Planos: 5 a 8. Gancho e tensão podem ter planos de 30 a 45 q; revelação e packshot, 60 a 120 q (ver 00 · Padrões da casa).

#### 20 s (600 q) · uma ideia, duas provas

| Batida | Segundos | Quadros |
|---|---|---|
| Gancho | 0 a 1,5 | 1 a 45 |
| Tensão | 1,5 a 5 | 46 a 150 |
| Revelação | 5 a 10 | 151 a 300 |
| Prova 1 e 2 | 10 a 15 | 301 a 450 |
| Assinatura | 15 a 17,5 | 451 a 525 |
| CTA | 17,5 a 20 | 526 a 600 |

Planos: 8 a 12.

#### 30 s (900 q) · uma ideia, três provas, um respiro

| Batida | Segundos | Quadros | O que acontece |
|---|---|---|---|
| Gancho | 0 a 1,5 | 1 a 45 | Igual ao 15 s. |
| Tensão | 1,5 a 7 | 46 a 210 | O problema ganha 2 a 3 planos, pode ter um pequeno arco. |
| Revelação | 7 a 13 | 211 a 390 | Revelação com respiro: plano lento de 60 a 90 q depois da transformação. |
| Prova 1, 2, 3 | 13 a 23 | 391 a 690 | Três provas de ~3,3 s; ritmo rápido-lento-rápido entre elas. |
| Assinatura | 23 a 27 | 691 a 810 | Packshot + frase. |
| CTA | 27 a 30 | 811 a 900 | CTA com 3 s. |

Planos: 8 a 14 (ver 00 · Padrões da casa).

#### 60 s (1800 q) · história com virada

| Batida | Segundos | Quadros |
|---|---|---|
| Gancho | 0 a 2 | 1 a 60 |
| Contexto e problema | 2 a 15 | 61 a 450 |
| Virada e revelação | 15 a 25 | 451 a 750 |
| Provas (4 a 5, com respiros) | 25 a 46 | 751 a 1380 |
| Clímax (a imagem mais forte do filme) | 46 a 52 | 1381 a 1560 |
| Assinatura | 52 a 56 | 1561 a 1680 |
| CTA | 56 a 60 | 1681 a 1800 |

Planos: 18 a 30. No 60 s cabe um personagem ou um lugar com arco; no 15 s, não.

### 3.3 Como o 15 s difere do 30 s (não é metade)

| Aspecto | 15 s | 30 s |
|---|---|---|
| Tensão | 1 a 2 planos, só o suficiente para existir o "antes" | Pode ter mini-arco de 2 a 3 planos |
| Provas | 1 forte | 3, com variação de ritmo |
| Respiro | Uma segura de 30 a 60 q no plano-herói (mínimo 24 q) | Um plano lento inteiro de 60 a 90 q depois da revelação |
| Primeiro corte | Antes do q45 | Antes do q60 |
| Câmera | Movimentos curtos, 1 por plano | Pode ter um plano longo com movimento composto (travelling + panorâmica) |
| Texto | 2 a 3 frases no filme todo | 4 a 6 frases |
| Derivação | O 15 s é **filmado pensando no 6 s**: 2 planos dele precisam funcionar sozinhos | O 30 s é **filmado pensando no 15 s**: marque no shot list os planos que sobrevivem (coluna "Corte 15") |

**Sinal de erro:** o 15 s tem a mesma tensão do 30 s e a revelação acontece depois do segundo 8. Ou o 30 s é só o 15 s com planos mais lentos.

### 3.4 Ritmo dentro das batidas

- **Rápido, lento, rápido.** Gancho e tensão com planos de 12 a 45 q; revelação com plano de 60 a 120 q; provas voltam a 30 a 60 q; assinatura desacelera. O contraste de duração é o que dá sensação de ritmo; planos todos iguais cansam.
- **Corte no movimento.** Corte quando algo está em movimento, não no repouso; o olho atravessa o corte acompanhando a ação.
- **Batida da trilha.** A 120 BPM, uma batida dura 0,5 s = 15 q; um compasso de 4 tempos = 60 q. Escolha BPM antes do animatic e alinhe cortes a múltiplos de 15 q. A 100 BPM, batida = 18 q; a 128 BPM, batida = 14,06 q (arredonde alternando 14 e 15).

---

## 4. O tratamento (treatment)

### 4.1 O que é e para que serve

Tratamento é o documento que o diretor entrega antes de produzir para provar que entendeu o briefing e mostrar o filme que vai fazer. Em comercial de live action ele costuma ter de 6 a 20 páginas em PDF diagramado, escrito em primeira pessoa no presente, com uma declaração curta do diretor, o conceito, o mundo visual com referências comentadas, o tom e o ritmo, a abordagem de câmera e o som ([Storyflow](https://storyflow.so/blog/how-to-write-a-directors-treatment); [The Collective Pitch](https://thecollectivepitch.com/portfolio/commercial-director-treatment-guide-to-winning/); [Robin Piree](https://robinpiree.com/blog/commercial-treatment-template)). Uma regra boa desse universo: **10 referências precisas valem mais que 40 soltas**, e cada referência leva uma legenda dizendo o que pegar dela ([Storyflow](https://storyflow.so/blog/how-to-write-a-directors-treatment)).

No estúdio operado por IA o tratamento tem uma segunda função: é o **contrato técnico** que o script vai seguir. Por isso cada seção termina com valores numéricos que viram parâmetros de `bpy`.

### 4.2 Modelo pronto para preencher

```markdown
# TRATAMENTO · <Cliente> · <Produto> · <duração> · <proporção> · v<n>

## 1. Em uma frase
A UMA coisa: "<máx. 8 palavras>"
O filme: <1 frase descrevendo a transformação>. Ex.: "Recibos espalhados se alinham sozinhos a cada toque na tela."

## 2. Declaração do diretor (até 80 palavras, 1ª pessoa, presente)
Por que esta ideia, para este público, neste lugar.

## 3. Estrutura
| Batida | Segundos | Quadros | O que o espectador vê | O que o espectador sente |

## 4. Mundo visual
Mundo: <um dos 16 mundos>
Fundo: <material, cor HEX, distância em relação ao herói (1,2 a 1,4× a escala)>
Referências (máx. 10): <imagem> · "pegar daqui: <só o que serve>"

## 5. Paleta
Dominante (60%): HEX · Secundária (30%): HEX · Acento (10%): HEX (geralmente a cor da marca)
Proibido: <cores que a marca não usa>

## 6. Luz
Esquema: <ex.: principal de área 1 m a 45° e 30° acima; preenchimento 3 a 4× mais fraco; contorno a 135°, 1000 K mais frio>
Temperatura: principal ___ K · contorno ___ K
Contraste-alvo do qa.py: 0,20 a 0,38 · estourado < 1,5%
Transformação de cor: AgX · look: <ex.: AgX - Medium High Contrast>

## 7. Materiais
Herói: <material real com aspereza (roughness) em faixa, ex. alumínio anodizado 0,25 a 0,35, chanfro 0,5 mm>
Secundários: <...>
Imperfeição: <impressão digital, poeira, micro-riscos: onde e quanto>

## 8. Linguagem de câmera
Lentes permitidas: <ex.: 35, 85, 100 mm> (nunca 50 mm por padrão)
Altura da câmera: <ex.: na altura do produto, 0 a 10° de inclinação>
Movimentos permitidos: <ex.: travelling lento, push-in, órbita de no máximo 30°>
Profundidade de campo: <f-stop por tipo de plano>
Composição: <terços, simetria quebrada, espaço negativo para texto>

## 9. Ritmo e movimento
BPM da trilha: ___ (batida = ___ q)
Curva padrão: <ex.: ease-out forte nas entradas, ease-in-out em câmera>
Segura no herói: 30 a 60 q (mínimo 24 q)

## 10. Som
Trilha: <estilo, BPM, licença>
Efeitos-chave: <lista com o quadro em que acontecem>
Locução: <sim/não, texto>
Assinatura sonora: <sim/não, quadro>

## 11. Tipografia e texto na tela
Fonte: <nome, licença> · Peso: ___
Frases (com quadros de entrada e saída calculados pela fórmula da seção 7.3)
Zona segura: <plataforma, px>

## 12. Entregas
Proporções: ___ · Resolução: ___ · fps: 30 · Codec: ___ · Versões: ___

## 13. Suposições e riscos
[SUPOSIÇÃO] ... · Risco: ... · Plano B: ...
```

**Portão 2 (tratamento):** aprovação por escrito. A partir daqui, mudar o mundo visual ou a ideia é refazer o filme; mudar uma cor é ajuste.

**Sinal de erro:** o tratamento tem adjetivos ("luz dramática", "câmera dinâmica") e nenhum número. Se não dá para virar parâmetro de script, não está pronto.

---

## 5. Shot list e animatic

### 5.1 Shot list: o modelo

O shot list de cinema tem número da cena e do plano, descrição, tamanho do plano, ângulo, equipamento, movimento, lente, taxa de quadros e notas ([StudioBinder](https://www.studiobinder.com/blog/how-to-make-a-shot-list/)). Para comercial 3D por IA, adapte: tire "elenco" e "equipamento", inclua quadros exatos, transição, som e a prova de que o plano funciona.

| Coluna | O que preencher | Exemplo |
|---|---|---|
| # | Número do plano, dois dígitos | 04 |
| Batida | Gancho, tensão, revelação, prova, assinatura, CTA | Revelação |
| Entrada / saída (q) | Quadro inicial e final na timeline do filme | 121 / 210 |
| Duração | Quadros e segundos | 90 q (3,0 s) |
| Enquadramento | Plano geral (PG), plano médio (PM), primeiro plano (PP), close, detalhe (macro), packshot | PP |
| Altura do herói | % da altura do quadro ocupada pelo produto no quadro-chave | 45% |
| Lente | Distância focal em mm (sensor de 36 mm) | 85 mm |
| f-stop | Abertura quando houver profundidade de campo | f/4 |
| Ângulo | Altura e inclinação da câmera | Altura do produto, 5° para baixo |
| Movimento | Tipo, distância e curva | Push-in de 12 cm, ease-in-out |
| Ação | O que o herói e o mundo fazem | Recibos se alinham em grade |
| Transição de saída | Corte seco, match cut, corte no movimento, wipe por objeto, cross dissolve | Match cut (forma do card) |
| Som | Efeito no quadro exato, trilha, locução | "tic" no q150; batida no q165 |
| Texto | Frase e quadros de entrada e saída | "Tudo no lugar" q160 a 210 |
| Corte 15 / Corte 6 | Se o plano sobrevive nas versões curtas | 15: sim · 6: sim |

### 5.2 O shot list como dado (a IA escreve isto antes do script de cena)

O shot list mora num arquivo `shotlist.json` (ou dicionário Python) que o script lê. Assim o animatic, o render final e a planilha para o cliente saem da mesma fonte.

```python
# shotlist de exemplo (dados, não depende de versão do Blender)
SHOTS = [
  {"n": "01", "batida": "gancho", "q_in": 1, "q_out": 45, "lente": 85, "fstop": 2.8,
   "cam_ini": (0.0, -0.9, 0.10), "cam_fim": (0.0, -0.6, 0.10), "alvo": (0, 0, 0.07),
   "altura_heroi_alvo": (40, 60), "transicao": "corte no movimento", "som": "whoosh curto q40"},
  # ...
]
```

### 5.3 Animatic em blocos cinza (blocking)

Animatic é o storyboard em movimento, cortado no tempo da trilha ou da locução, usado para aprovar ritmo, enquadramento e fluxo antes do trabalho caro ([Dream Farm Studios](https://dreamfarmstudios.com/blog/animatic-in-a-nutshell-the-storyboard-made-animated/); [Rokoko, previs](https://www.rokoko.com/insights/previs-what-is-previsualization)). Estúdios de animação de produto colocam o animatic como portão de aprovação do cliente antes de luz e material ([Sprout Studios](https://sprout.cc/blog/3d-product-animation-process/)). Em 3D, a forma mais honesta de animatic é a **pré-visualização (previs) em blocos cinza**: geometria simples em escala real, câmeras e tempos finais, sem luz bonita nem material.

**Por que cinza:** cor e brilho escondem problema de composição. Se o plano funciona em cinza, vai funcionar com luz. Se só funciona com luz bonita, a composição está fraca.

**Regras do blocking:**

1. **Escala real em metros.** Celular 0,0715 x 0,0078 x 0,147 m. Errar escala quebra profundidade de campo, velocidade de câmera e física depois.
2. **Herói em cinza claro (0,8), apoios em cinza médio (0,5), chão em 0,35, mundo em 0,18.** Contraste de valor já mostra se o herói se destaca.
3. **Uma câmera por plano**, trocada por marcadores na timeline (`timeline_markers` com `.camera`). Assim o arquivo único já é o filme cortado.
4. **Tempos finais.** Os quadros do animatic são os do filme. Se o animatic tem 600 q, o filme tem 600 q.
5. **Movimento só em 2 chaves por plano** (início e fim) com a curva pretendida. Polimento vem depois.
6. **Trilha guia** importada no Sequencer (ou só o BPM anotado), para checar cortes na batida.
7. **Render barato:** EEVEE, 270x480 (1/4 de 1080x1920), 8 amostras. No laboratório, EEVEE a 540x960 levou 0,37 s/quadro na RTX 3050 (`_CONTEXTO.md`); a 1/4 de resolução, o filme de 20 s inteiro sai em poucos minutos.

### 5.4 Como a IA faz o animatic por script

O script `/home/claude/codigo/direcao/animatic_blocking.py` foi rodado no bpy 5.2.2 da nuvem e funcionou **[confirmado por sonda no bpy 5.2.2]**. Ele:

- cria a cena em escala real com blocos cinza;
- cria uma câmera por plano com lente em mm, `TRACK_TO` num alvo e duas chaves de posição;
- amarra cada câmera a um marcador da timeline;
- força 30 fps (o padrão de fábrica é 24, ver seção 8);
- renderiza o primeiro, o do meio e o último quadro de cada plano em EEVEE a 270x480;
- **mede a altura do herói em % do quadro** em cada quadro renderizado (com `world_to_camera_view` sobre a caixa delimitadora) e avisa se ele saiu do quadro;
- monta uma **folha de contato** (3 colunas: início, meio, fim; 1 linha por plano) em PNG, para a IA e o cliente olharem o filme inteiro numa imagem.

Trecho central:

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

def altura_heroi(obj, cam):
    pts = [world_to_camera_view(sc, cam, obj.matrix_world @ Vector(c)) for c in obj.bound_box]
    ys = [p.y for p in pts]; xs = [p.x for p in pts]
    dentro = min(xs) >= 0 and max(xs) <= 1 and min(ys) >= 0 and max(ys) <= 1
    return round((max(ys) - min(ys)) * 100, 1), dentro

mk = sc.timeline_markers.new(nome, frame=inicio); mk.camera = co   # troca de câmera por marcador
```

Saída real do teste (4 planos, 255 q):

```text
QA 01_gancho f1:   herói ocupa 38.7% da altura; inteiro no quadro=True
QA 01_gancho f45:  herói ocupa 58.1% da altura; inteiro no quadro=True
QA 02_tensao f46:  herói ocupa 14.1% da altura; inteiro no quadro=True   <- pequeno demais
QA 03_revelacao f195: herói ocupa 31.7% da altura
QA 04_packshot f255:  herói ocupa 40.9% da altura
```

O plano 02 do teste (35 mm a 0,9 m) deixou o celular com 14% da altura: a folha de contato mostrou na hora o que a regra da seção 7 proíbe. É exatamente para isso que o animatic existe.

**Como a IA lê a folha de contato (checklist visual):**

1. O herói é a coisa mais clara ou mais contrastada de cada célula?
2. A altura do herói está dentro da faixa do shot list (o log diz)?
3. Entre o último quadro de um plano e o primeiro do seguinte, o olho continua no mesmo lugar do quadro (continuidade de foco de atenção) ou o corte é intencionalmente um salto?
4. Há dois planos seguidos com a mesma lente e o mesmo ângulo? (Corte "pulado", parece erro.)
5. A área de texto planejada (zona segura) está livre de objetos importantes?

**Portão 4 (animatic):** aprovação de ritmo, enquadramento e duração. Depois dele, mudar duração de plano custa pouco; mudar enquadramento custa luz refeita.

---

## 6. O pipeline de estúdio adaptado à IA

Produtoras de motion trabalham em etapas com portões: briefing, roteiro, storyboard, style frames (quadros de estilo), animação, locução, som depois do corte travado (picture lock) e exportação em várias proporções ([Runner Studio](https://runner.studio/blog/this-is-the-workflow-every-motion-design-studio-uses/); [School of Motion](https://schoolofmotion.com/blog/guide-completing-motion-design-project)). Style frames são imagens paradas que fixam a estética do filme (paleta, luz, textura) antes da animação ([Boords](https://boords.com/blog/what-are-style-frames-definition-and-examples)). A School of Motion sugere 2 a 3 variações de style frame ([School of Motion](https://schoolofmotion.com/blog/guide-completing-motion-design-project)).

A IA segue o mesmo caminho, com uma diferença: **cada etapa gera um arquivo de prova que a própria IA olha antes de pedir aprovação.** A IA nunca diz "está bom" sem ter aberto a imagem.

| # | Etapa | O que a IA entrega | Prova (arquivo) | Portão de aprovação | Sinal de que pulou etapa |
|---|---|---|---|---|---|
| 0 | Briefing | Bloco do interrogatório preenchido | `00_briefing.md` | Cliente confirma por escrito | Perguntas respondidas no meio do render |
| 1 | Conceito | 3 conceitos (seção 2.2), cada um com 1 frase e 1 quadro-chave descrito | `01_conceitos.md` + 1 render de rascunho por conceito (opcional) | Cliente escolhe 1 | Conceito escolhido "por padrão" |
| 2 | Tratamento | Modelo da seção 4.2 preenchido | `02_tratamento.md` | Aprovação do mundo, paleta, lentes, som | Mundo decidido durante a luz |
| 3 | Shot list | Tabela da seção 5.1 + `shotlist.json` | `03_shotlist.md`, `shotlist.json` | Revisão de batidas e quadros (soma = duração) | Soma dos planos ≠ duração |
| 4 | Blocking / animatic | Cena cinza, câmeras, tempos finais | `04_folha_contato.png`, `04_animatic.mp4` (270x480), log de altura do herói | Ritmo e enquadramento aprovados | Câmera mudando depois da luz pronta |
| 5 | Layout de câmera | Câmeras refinadas: lente, altura, profundidade de campo, curvas de câmera | `05_layout.mp4` em EEVEE 540x960 | Movimento de câmera travado | Câmera "procurando" o produto |
| 6 | Lookdev (style frames) | 2 a 3 style frames em Cycles nos quadros-chave (gancho, revelação, packshot) com luz e material finais | `06_styleframe_A.png`, `_B`, `_C` em 1080x1920 + relatório do `qa.py` | Cliente escolhe 1 look | Look decidido em cima do render final |
| 7 | Luz | Rig de luz aplicado a todos os planos, continuidade entre planos | `07_luz_folha.png` (1 quadro por plano, resolução média) + `qa.py` por plano | Contraste 0,20 a 0,38 e estourado < 1,5% em todos | Plano 3 mais claro que o 2 sem motivo |
| 8 | Polimento da animação | Curvas finais: antecipação, segura, overshoot, defasagem | `08_anim.mp4` EEVEE em resolução cheia | Movimento aprovado (picture lock) | Objetos chegando todos no mesmo quadro |
| 9 | Render | Sequência EXR ou PNG 16 bits, Cycles ou EEVEE conforme o mundo | Pasta `09_render/` + 3 quadros conferidos a 100% | Sem ruído, sem cintilação (flicker) entre quadros | Ruído visível em área escura |
| 10 | Composição | Grão, vinheta, aberração leve, correção final, texto e logo | `10_comp_quadros.png` (gancho, herói, CTA) | Texto dentro da zona segura, legível | Texto sobre área de interface da plataforma |
| 11 | Som | Trilha, efeitos sincronizados ao quadro, mixagem | `11_mix.wav` + lista de efeitos com quadro | Efeitos batendo no quadro certo (±1 q) | Som de "tic" 4 q atrasado |
| 12 | Entrega | Arquivos por plataforma | `12_entrega/` com nome padrão | Conferência com o checklist de entrega | Arquivo 16:9 enviado para o Reels |

**Regras do pipeline para a IA:**

- **Nunca pule do 3 para o 9.** O erro mais caro de filme de IA é render final de cena sem animatic aprovado.
- **Volte uma etapa, não três.** Se o cliente reprova a luz (7), refaça a partir do 6 (lookdev), não do 2.
- **Rascunho rápido, final lento.** Etapas 4 e 5 em EEVEE baixo; etapa 6 em Cycles só nos 2 a 3 quadros-chave; etapa 9 é a única que renderiza tudo em qualidade.
- **Nome de arquivo com etapa e versão:** `cliente_produto_20s_9x16_e06_styleframeB_v03.png`.

---

## 7. Heurísticas de diretor

### 7.1 As 24 regras

| # | Regra | Número | Por quê | Sinal de que deu errado |
|---|---|---|---|---|
| 1 | **Um herói por plano** | 1 objeto mais claro, mais nítido e mais contrastado | O olho escolhe em menos de meio segundo; dois heróis dividem a atenção | Na folha de contato, você não sabe para onde olhar |
| 2 | **Movimento sempre motivado** | Toda câmera que se move responde a uma ação ou revela algo | Movimento sem motivo parece software ("órbita de demonstração") | A câmera gira 360° em volta do produto parado |
| 3 | **Produto nunca coberto** | Nenhum objeto na frente de mais de 15% do herói no quadro-chave | Herói coberto não é lido | O logo do produto fica atrás de um elemento decorativo |
| 4 | **Produto nunca pequeno demais** | Plano geral: mínimo 20% da altura do quadro. Packshot 9:16: 40 a 55% da altura (ver 00 · Padrões da casa). Packshot 4:5: 45 a 65%. Packshot 16:9: 55 a 75%. Referência de e-commerce: produto ocupando 85% da foto principal na Amazon ([Snappyit](https://snappyit.ai/blog/amazon-product-image-requirements)) | No celular o quadro inteiro tem poucos centímetros; produto pequeno some. No 9:16 o packshot tem que caber nos 979 px verticais da zona segura (51% da altura) | Log do animatic acusa herói abaixo de 20% (o teste deu 14% no plano 02) |
| 5 | **Close pode cortar, mas não descaracterizar** | Em detalhe, o herói pode passar de 100% do quadro desde que 1 traço reconhecível (logo, curva, botão) esteja visível | Detalhe sem identificação parece banco de imagem | Macro bonito de superfície que poderia ser de qualquer produto |
| 6 | **Ritmo rápido, lento, rápido** | Planos de 12 a 45 q, depois 60 a 120 q, depois 30 a 60 q | Contraste de duração cria sensação de ritmo | Todos os planos com 2 s exatos |
| 7 | **Segure o quadro-herói** | Hold do herói: 24 q no mínimo (0,8 s), 30 a 60 q no plano de revelação principal; 12 a 18 q só em segura dentro de plano curto de gancho (ver 00 · Padrões da casa). Animação clássica segura poses-chave por 6 a 12 q a 24 fps ([Animation Mentor](https://www.animationmentor.com/blog/timing-the-12-basic-principles-of-animation/)); a 30 fps e com produto para ler, dobre | O espectador precisa de tempo para registrar a forma | O produto chega e já sai; ninguém lembra como ele é |
| 8 | **Texto com tempo mínimo de leitura** | Fórmula na seção 7.3 | Texto que some antes de ser lido é ruído | Você precisa pausar o vídeo para ler a frase |
| 9 | **Texto e logo dentro da zona segura** | Tabela da seção 7.4 | A interface da plataforma cobre bordas | CTA atrás do botão de curtir |
| 10 | **Marca nos 2 primeiros segundos** | Produto com marca visível ou selo de canto até o q60 ([Kantar](https://www.kantar.com/north-america/company-news/kantar-super-bowl-ad-study-15-second-ads-match-30-second-spots)) | Lembrança de marca sobe com marca cedo | A marca só aparece no último plano |
| 11 | **Dois planos nos 5 primeiros segundos** | 2 ou mais cortes até o q150 ([Google ABCD](https://www.thinkwithgoogle.com/_qs/documents/8472/ABCD_Complete_V7b_HR_1.pdf)) | Ritmo inicial segura atenção | Um plano único de 6 s abrindo o filme |
| 12 | **Primeiro quadro já em movimento** | Nada de fade do preto; quadro 1 com ação ou contraste forte | No feed o quadro 1 é a miniatura e o gancho | Os primeiros 15 q são preto |
| 13 | **Lente com intenção** | Grande angular (24 a 35 mm) para escala e espaço; normal (50 mm) só quando a ideia pede neutralidade; tele (85 a 135 mm) para produto, compressão e fundo limpo; macro (100 mm) para detalhe. Lentes mais longas distorcem menos e isolam o produto ([Tom Crowl](https://tomcrowl.com/best-focal-length-for-product-photography/)) | 50 mm é o padrão de fábrica do Blender (sonda), por isso é a lente da mesmice. 50 mm é permitido como lente de contexto ou de respiro, desde que não seja a lente dominante do filme (eixo 2 da regra de rotação do cap 02) (ver 00 · Padrões da casa) | Todos os planos do filme com 50 mm |
| 14 | **Varie lente entre planos vizinhos** | Diferença mínima de 1,5× na focal ou de 30° no ângulo entre cortes consecutivos | Cortes muito parecidos parecem pulo de edição | Corte de 50 mm para 55 mm no mesmo eixo |
| 15 | **Composição fora do centro, salvo intenção** | Herói em um terço (x = 33% ou 67%) e espaço negativo do lado para onde ele "olha" ou se move; centro só em packshot ou simetria assumida | Centro em todo plano deixa o filme estático | Herói no centro exato em todos os planos |
| 16 | **Espaço reservado para texto** | O shot list marca onde o texto entra; essa área fica com fundo de baixa textura | Texto sobre detalhe vira mancha | Frase em cima de reflexo estourado |
| 17 | **Antecipação e respiro** | Antecipação de 3 a 6 q antes de movimento grande; overshoot de 3 a 8% (tabela 6.1 do cap 04), zero nos mundos luxo escuro e estúdio premium, com volta em 6 a 10 q (ver 00 · Padrões da casa) | Movimento físico tem preparação e acomodação | Objeto sai do repouso a velocidade máxima |
| 18 | **Defasagem (offset) em grupos** | Objetos de um grupo começam com 2 a 4 q de diferença | Tudo ao mesmo tempo parece máquina | Dez recibos se movendo em uníssono |
| 19 | **Corte no movimento** | Corte quando a ação está entre 30% e 70% do seu caminho | O movimento carrega o olho pelo corte | Corte em quadro parado entre duas ações paradas |
| 20 | **Continuidade de direção** | Se o objeto sai pela direita, entra pela esquerda no plano seguinte | Inverter direção sem motivo confunde o espaço | O produto "volta" de onde veio |
| 21 | **Contraste de valor do herói** | Herói pelo menos 2 stops mais claro ou mais escuro que o fundo atrás dele, ou separado por contorno | Separação de figura e fundo; cura do "escuro sem intenção" | Produto preto em fundo preto sem contorno |
| 22 | **Luz conta a direção do tempo** | Luz principal com direção clara (45° lateral típico); a mesma direção ao longo do filme salvo virada da história | Luz sem direção = luz chapada | Sombra apontando para lados diferentes em planos seguidos |
| 23 | **Câmera com peso** | Movimento de câmera com ease-in-out de pelo menos 15 q em cada ponta; push-in de 1 a 3 cm/s (sutil) a 5 a 7 cm/s (dramático) com o celular a 60 cm; a regra é em % da distância (5 a 15% em 3 a 5 s), não em cm absolutos (ver 00 · Padrões da casa) | Câmera real tem massa; parar de repente parece erro | A câmera arranca e freia em 1 quadro |
| 24 | **Imperfeição controlada** | Pelo menos 1 imperfeição por material herói (impressão digital, poeira, micro-risco, variação de aspereza de ±0,05) | Superfície perfeita é a assinatura de CG | O produto parece um render de catálogo de 2010 |

### 7.2 A régua de "por que este plano existe"

Antes de manter qualquer plano no shot list, a IA responde em uma linha: **"Este plano mostra ___ para que o espectador entenda/sinta ___."** Se a segunda lacuna for vazia ou repetir o plano anterior, o plano sai.

### 7.3 Texto na tela: fórmula de tempo mínimo de leitura

Referência mais sólida disponível: a Netflix limita legendas em português do Brasil a **17 caracteres por segundo** para adultos e **13 para crianças**, com evento mínimo de 5/6 de segundo (25 q a 29,97 fps) e máximo de 7 s ([Netflix PT-BR](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215600497-Portuguese-Brazil-Timed-Text-Style-Guide); [Netflix templates](https://partnerhelp.netflixstudios.com/hc/en-us/articles/219375728-Timed-Text-Style-Guide-Subtitle-Templates)). Legenda é lida por quem já está assistindo e sabe onde ela aparece. Texto de anúncio compete com imagem em movimento e aparece em lugar variável, então este manual usa um limite mais conservador de **12 caracteres por segundo** e soma **0,5 s para o olho achar o texto** (valor de trabalho deste manual, derivado; **[não verificado]** em estudo específico de anúncio).

```text
quadros_minimos = max( 36 , ceil( 30 × ( 0,5 + caracteres ÷ 12 ) ) , ceil( 30 × ( palavras ÷ 2,5 + 0,5 ) ) )
caracteres = letras + espaços + pontuação da frase
palavras = palavras da frase, número contando como 2
teto: 7 s (210 q) por frase; acima disso, divida a frase
```

| Frase | Caracteres | Quadros mínimos | Segundos |
|---|---|---|---|
| "Peça em 3 toques" | 16 (5 palavras) | 75 | 2,5 |
| "Seu dinheiro, num só lugar" | 26 | 80 | 2,7 |
| "Agende pelo WhatsApp hoje" | 25 | 78 | 2,6 |
| "Silêncio de verdade" | 19 | 63 | 2,1 |
| "Gelada do primeiro ao último gole" | 33 | 98 | 3,3 |

Outras regras de texto:

- **Animação de entrada não conta no tempo de leitura.** Se a frase entra em 8 q, o cronômetro começa quando ela fica estável.
- **Máximo de 6 a 10 palavras por frase de gancho; CTA de 2 a 4 palavras** (referência de agência, [MBADV](https://www.mbadv.agency/tiktok-ads/creative-best-practices) **[não verificado]**). A ajuda do TikTok fala em exibir "5 a 10 palavras por segundo" quando há texto ([TikTok Ads Help](https://ads.tiktok.com/help/article/creative-best-practices?lang=en)); esse número é alto demais para leitura confortável em português e aqui é tratado como teto de densidade, não como meta.
- **Uma frase por vez na tela.** Duas frases simultâneas dividem a leitura.
- **Altura mínima da letra em 1080x1920:** altura da fonte (não da maiúscula): ≥ 44 px no apoio, ≥ 66 px em título e CTA (cap 08 §6.1) (ver 00 · Padrões da casa).

### 7.4 Zonas seguras em px

Medidas para quadro de 1080x1920 (9:16). "Livre" significa sem texto, logo ou elemento essencial.

| Plataforma | Topo | Base | Esquerda | Direita | Área segura resultante | Fonte |
|---|---|---|---|---|---|---|
| **Instagram/Facebook Reels (anúncio)** | 269 px (14%) | 672 px (35%) | 65 px (6%) | 65 px (6%) | x 65 a 1015; y 269 a 1248 (950 x 979 px) | Texto do Meta citado em [Solid Labs](https://www.solidlabs.com/social-safe-zones) e [Strike Social](https://strikesocial.com/blog/maximize-ad-visibility-and-cut-through-the-noise-with-safe-zone-guides/): "deixe pelo menos 14% do topo, 35% da base e 6% de cada lado livres" |
| **TikTok (In-Feed)** | 240 px | 660 px | 120 px | 120 px acima do meio; 300 px abaixo do meio | x 120 a 960 (acima de y 960); x 120 a 780 (abaixo); y 240 a 1260 | Medido no gabarito oficial por [Solid Labs](https://www.solidlabs.com/social-safe-zones); o TikTok diz que a área varia com legenda e formato e oferece gabaritos para baixar ([TikTok Ads Help](https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads?redirected=1)) |
| **YouTube Shorts** | 192 px (10%) | 480 px (25%) | 0 | 108 px (10%) | x 0 a 972; y 192 a 1440 | Google citado em [Solid Labs](https://www.solidlabs.com/social-safe-zones) |
| **Máscara universal do estúdio (vale para os três)** | 380 px | 672 px | 120 px | 140 px acima de y 960; 300 px abaixo (gabarito TikTok) | x 120 a 940 (x 120 a 780 abaixo de y 960); y 380 a 1248; centro óptico da área útil y ≈ 814 | União dos piores casos (ver 00 · Padrões da casa) **[não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre]** |

Valores divergentes circulam em blogs (Reels com base de 300 a 320 px em [Outfy](https://www.outfy.com/blog/instagram-safe-zone/); TikTok com base de 864 px em [Strike Social](https://strikesocial.com/blog/maximize-ad-visibility-and-cut-through-the-noise-with-safe-zone-guides/)). A diferença vem de orgânico versus anúncio e de legenda longa. **Para anúncio, use a máscara única.** Para post orgânico curto, a base de 672 px ainda é a escolha segura.

Consequências de direção no 9:16:

- O **centro óptico da área segura do Reels fica em y ≈ 758 px**, não em 960. Packshot e CTA sobem cerca de 200 px em relação ao centro geométrico.
- O terço inferior do quadro (y > 1248) é para **imagem sem informação**: chão, reflexo, sombra, continuação do cenário. Nunca o logo.
- **4:5 (1080x1350):** o Meta não publica margens para o feed 4:5 ([Solid Labs](https://www.solidlabs.com/social-safe-zones)). Valor de trabalho deste manual: margem de 54 px (5%) em todos os lados e CTA acima de y 1200 **[não verificado]**.
- **16:9 (1920x1080):** sem interface por cima no in-stream comum, mas o botão de pular e o cartão do anunciante ocupam cantos inferiores; mantenha texto 10% longe das bordas (192 px laterais, 108 px vertical), como sugere o guia de anúncios do YouTube resumido por [V Digital Services](https://www.vdigitalservices.com/the-ultimate-guide-to-youtube-ad-format/) **[não verificado na fonte oficial]**.

Gabarito por script: na composição, a IA pode desenhar um retângulo vermelho de 50% de opacidade fora da área segura num render de conferência (nunca no final) e olhar a imagem. **[testar no Blender]**: overlay via nó de máscara de caixa (Box Mask) no `scene.compositing_node_group`.

---

## 8. O diagnóstico da mesmice

### 8.1 Por que filme de IA sai sempre igual

Duas causas se somam. A **causa técnica**: a IA aceita os padrões de fábrica do Blender, e todo filme nasce da mesma cena padrão. A **causa criativa**: sem ideia, a IA preenche o vazio com o repertório médio do 3D da internet (esferas flutuando, órbita em volta do produto, estúdio cinza).

Padrões de fábrica lidos por sonda no bpy 5.2.2 **[confirmado por sonda no bpy 5.2.2]**:

| Configuração | Valor de fábrica |
|---|---|
| Taxa de quadros | 24 fps |
| Resolução | 1920 x 1080 (16:9, horizontal) |
| Intervalo | quadros 1 a 250 |
| Câmera | 50 mm, sensor 36 mm, profundidade de campo desligada (f/2,8 se ligada), em (7,36; -6,93; 4,96) olhando para a origem |
| Interpolação de chave nova | Bézier, alças (handles) Auto Clamped |
| Mundo | cinza uniforme (0,051) sem HDRI |
| Luz | 1 luz pontual de 1000 W |
| Material | cinza 0,8 com aspereza 0,5 |
| Cor | AgX, look "None" |
| Motor | EEVEE, 64 amostras |

### 8.2 Causa, sintoma e cura

| Causa | Sintoma no filme | Cura concreta |
|---|---|---|
| **Taxa de quadros de fábrica (24 fps)** | Tempos do shot list (feitos a 30) não batem; movimento com cadência diferente do resto do feed | `scene.render.fps = 30` na primeira linha do script de cena; conferir `frame_end = duração × 30` |
| **Resolução de fábrica 16:9** | Filme de Reels composto na horizontal e cortado depois; herói fora da área segura | Definir proporção antes do blocking: 1080x1920 (9:16), 1080x1350 (4:5), 1080x1080 (1:1), 1920x1080 (16:9). Compor para a proporção principal |
| **Lente de 50 mm** | Todos os planos com a mesma perspectiva "de olho"; nada parece fotografado | Lente vem do shot list: 85 a 100 mm para produto, 24 a 35 mm para espaço, 100 mm macro para detalhe. 50 mm é permitido como lente de contexto ou de respiro, desde que não seja a lente dominante do filme (eixo 2 da regra de rotação do cap 02) (ver 00 · Padrões da casa) |
| **Câmera na posição padrão (de cima, 3/4, a ~10 m)** | Ângulo de "visualização de software", produto visto de cima | Câmera na altura do produto (0 a 10° de inclinação) para objeto pequeno; de cima (90°) só em diorama ou flat lay assumido |
| **Composição central** | Herói no centro em todos os planos; filme estático | Terços na maioria dos planos; centro só em packshot e simetria intencional; no 9:16, centro óptico da área útil em y ≈ 814 (máscara universal, seção 7.4) |
| **Profundidade de campo desligada** | Tudo nítido do primeiro plano ao fundo; parece maquete digital | Ligar DoF com f/4 a f/5,6 em produto de frente no 9:16 e f/8 a f/16 com produto em ângulo (tabela 3.3 do cap 04); f/2,8 só quando a parte mole for escolha escrita no shot list. Foco num empty na superfície que vende; desligar só em diorama (onde nitidez total é o estilo) (ver 00 · Padrões da casa) |
| **Curvas padrão (Bézier, Auto Clamped)** | Todo movimento com a mesma aceleração suave e simétrica; nada tem peso, antecipação nem chegada | Definir curva por intenção: ease-out forte (alça longa na chegada) para objetos que pousam; antecipação de 3 a 6 q; overshoot de 3 a 8% (tabela 6.1 do cap 04); câmera com ease-in-out longo. Ver capítulo de animação. **[testar no Blender]** os valores de alça |
| **Mundo cinza uniforme** | Reflexos vazios; metal e vidro parecem plástico | Ambiente com contraste: HDRI de estúdio com caixas de luz ou fundo modelado com faixas emissivas e bandeiras pretas (ver capítulo de luz) |
| **HDRI de estúdio genérico** | Todo produto refletindo o mesmo softbox redondo | Construir reflexos com planos de área nomeados (faixa vertical de 10 x 100 cm, por exemplo) e bandeiras pretas; HDRI só como base com força baixa |
| **Luz pontual única de 1000 W** | Luz chapada, sem contorno, sombra dura sem intenção | Esquema de 3 luzes no mínimo (principal de área, preenchimento 3 a 4× mais fraco, contorno a 135° mais frio), energia nos watts absolutos da tabela do cap 05 §4.1; se partir de um chute próprio, comece 2 a 3 stops abaixo (× 0,15 a 0,35) e confira no `qa.py` (ver 00 · Padrões da casa) |
| **Material cinza 0,5 de aspereza** | "Plástico de CG": aspereza uniforme, sem imperfeição, arestas vivas | Material real com faixa de aspereza, mapa de variação de ±0,05, chanfro em escala real (0,3 a 1 mm em produto de mão), impressão digital ou poeira |
| **Look "None"** | Contraste médio genérico | Escolher look AgX no tratamento (ex.: `AgX - Medium High Contrast`) e medir com `qa.py` |
| **Fundo branco ou cinza infinito** | Todos os filmes no mesmo vazio | Escolher um dos 16 mundos (seção 2.4); fundo afastado 1,2 a 1,4× a escala e mais escuro que o herói |
| **Ausência de imperfeição** | Superfícies perfeitas, movimento perfeito, quadro perfeitamente estável | Imperfeição controlada: material (regra 24), câmera com tremor de 0,05 a 0,15° de pico, ciclo de 30 a 45 q, com `strength = radians(pico) / 0,33` (cap 04 §5.5) em plano de mão (ver 00 · Padrões da casa), grão na composição |
| **Enfeite sem função** | Cubos, cápsulas e esferas flutuando ao redor do produto | Teste de função (seção 2.2, passo 5): todo objeto representa algo e sofre a transformação |
| **Órbita como movimento padrão** | Câmera girando 360° em volta do produto | Movimento escolhido pelo shot list; órbita de no máximo 30 a 45° e só para revelar uma face específica |
| **Mesma transição em tudo** | Todo corte é dissolve ou zoom | Repertório: corte seco, corte no movimento, match cut por forma, wipe por objeto em primeiro plano. Máximo 1 dissolve por filme |
| **Ausência de ideia** | O filme poderia ser de qualquer marca | Método da seção 2.2 antes de abrir o Blender; o conceito tem que falhar se o produto for trocado |

**Teste final da mesmice:** coloque a folha de contato deste filme ao lado da do filme anterior do estúdio. Se três ou mais itens se repetem (mesma lente, mesmo mundo, mesma composição, mesma transição, mesma paleta), mude pelo menos dois deles, salvo se o cliente pediu continuidade de campanha.

---

## 9. Os 5 exemplos completos

Os cinco filmes abaixo vão do briefing ao shot list final. Marcas e números de produto são fictícios; onde o exemplo depende de afirmação do cliente (prazo, tempo de entrega, período grátis), ela aparece como `[SUPOSIÇÃO]` porque em trabalho real precisa de confirmação. Todos a 30 fps. Abreviações de enquadramento: PG (plano geral), PM (plano médio), PP (primeiro plano), DET (detalhe/macro), PACK (packshot).

### 9.1 Exemplo 1 · App de delivery · 20 s · Reels 9:16

**Briefing recebido:** "Vídeo de 20 s pro Reels do Rango, nosso app de delivery de Governador Valadares. Quero mostrar o app."

**Interrogatório respondido**

| Pergunta | Resposta |
|---|---|
| Produto / benefício | App de delivery local; a comida chega quente |
| Público | 18 a 35 anos, pedem à noite pelo celular |
| Onde roda | Reels e Stories, anúncio; 1080x1920 |
| Duração | 20 s; derivar 6 s |
| A UMA coisa | "Chega quente." |
| Diferencial | Entrega média abaixo de 30 min com bolsa térmica `[SUPOSIÇÃO]` |
| Tom | Próximo, rápido, bem-humorado; não somos "fast food barulhento" |
| Ativos | Logo SVG, telas reais do app (PNG 3x), sem CAD (celular modelado em escala real) |
| CTA | "Peça no app" → loja de apps |
| Restrições | Não citar concorrente; afirmação de tempo precisa ser comprovável |
| Objetivo | Instalação |
| Som | Trilha licenciada 120 BPM (batida = 15 q); sem locução; funciona mudo |

**Conceito:** "O calor viaja." O vapor que sai da cozinha percorre a cidade seguindo exatamente a rota desenhada na tela do app e chega à porta ainda subindo. O vapor tem função (é o calor), a rota é a interface real.

**Mundo:** diorama isométrico (cidade de Valadares estilizada em miniatura), noite azul com janelas quentes.

**Tratamento resumido**

- Paleta: azul noite #1E2A4A (60%), creme quente #F3E3C3 (30%), laranja da marca #FF6A2B (10%).
- Luz: lua como sol frio de 7500 K a 50°, janelas e cozinha em área de 2700 K; vapor com contraluz quente.
- Materiais: casas em gesso pintado (aspereza 0,7 a 0,85, chanfro 1 mm na escala da miniatura), celular em alumínio anodizado 0,3 com vidro de tela em camadas.
- Câmera: 85 a 135 mm no diorama (achata como isométrico), 100 mm f/8 nos detalhes, 85 mm f/5,6 nos primeiros planos; nada de 50 mm.
- Ritmo: cortes na batida (múltiplos de 15 q); revelação com segura de 30 q.
- Som: chiado de frigideira, "tic" de toque, whoosh contínuo do vapor, abrir de caixa, assinatura "plim".
- Marca cedo: logo na caixa de pizza no plano 01 e selo do Rango no canto (x 800 a 940, y 390 a 460) de q1 a q60.
- Texto na máscara universal de 9:16 (x 120 a 940, y 380 a 1248) (ver 00 · Padrões da casa).

**Shot list**

| # | Batida | q in a q out | Dur. | Enquadr. | Herói % | Lente | Movimento | Ação | Transição | Som | Texto | C6 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Gancho | 1 a 45 | 45 q (1,5 s) | DET | 60% (caixa) | 100 mm f/8 | Push-in 4 cm, ease-out | Tampa da caixa com logo abre; vapor sobe e se curva para fora do quadro como uma seta | Corte no movimento | Chiado + batida q1 | (selo de marca) | Sim |
| 02 | Tensão | 46 a 90 | 45 q | PM | 25% (pessoa) | 35 mm | Travelling lateral 15 cm | Apê de diorama, 23 h, pessoa de argila no sofá, geladeira aberta vazia | Corte seco na batida (q90) | Zumbido da geladeira | sem texto | Não |
| 03 | Tensão | 91 a 150 | 60 q | PP | 45% (celular) | 85 mm f/5,6 | Push-in 3 cm | Polegar toca "Pedir" na tela real; o pin do mapa pulsa | Match cut: pin da tela → pin do diorama | "Tic" q120 | sem texto | Não |
| 04 | Revelação | 151 a 240 | 90 q | PG | 30% (restaurante + rota) | 135 mm | Grua sobe 20 cm, ease-in-out 20 q | O vapor sai do restaurante e percorre as ruas; a rota acende no chão igual à linha da tela; segura 30 q no fim | Corte no movimento | Trilha entra cheia q151; whoosh | sem texto | Sim |
| 05 | Revelação | 241 a 300 | 60 q | PM | 30% (moto) | 85 mm | Travelling acompanhando a moto | Moto de argila segue o rastro de vapor; vapor e moto viram a esquina juntos | Wipe por prédio em primeiro plano | Moto curta + batida | sem texto | Não |
| 06 | Prova 1 | 301 a 390 | 90 q | PP | 45% (celular) | 85 mm f/5,6 | Travelling lateral 6 cm | Tela real com tempo estimado e mapa ao vivo; tela separada em 3 lâminas de vidro afastadas 15 mm | Corte seco | "Tic" de atualização q330 | "Chega quente em 30 min" q303 a 390 (88 q; mínimo 87 q: 6 palavras, o 30 conta como 2) | Não |
| 07 | Prova 2 | 391 a 450 | 60 q | DET | 55% (caixa) | 100 mm f/8 | Push-in 5 cm | Porta abre, caixa entregue, tampa abre e o mesmo vapor do plano 01 sobe (rima visual) | Corte no movimento | Abrir de caixa + chiado volta | sem texto | Não |
| 08 | Assinatura | 451 a 525 | 75 q | PACK | 42% (celular) | 85 mm f/5,6 | Deriva de 1 cm | Celular em pé com logo na tela, caixa ao lado com vapor; tudo dentro da área segura | Corte seco | "Plim" q460 | "Rango. Chega quente." q458 a 525 (68 q; mínimo 65 q) | Sim |
| 09 | CTA | 526 a 600 | 75 q | PACK | 42% | 85 mm | Parado | Botão "Peça no app" aparece com overshoot 3%; segura até o fim | Fim | Trilha resolve q585 | "Peça no app" q530 a 600 (71 q; mínimo 51 q) | Sim |

Soma: 45 + 45 + 60 + 90 + 60 + 90 + 60 + 75 + 75 = **600 q (20 s)**. Quadros de texto conferidos pela regra única da seção 7.3 (o maior entre caracteres e palavras) (ver 00 · Padrões da casa). Corte de 6 s: planos 01 (45) + 04 encurtado (75) + 08 encurtado (30) + 09 (30) = 180 q.

### 9.2 Exemplo 2 · SaaS · dashboard financeiro · 30 s · 16:9

**Briefing recebido:** "Vídeo de 30 s do Caixa Claro, nosso software de gestão financeira para pequenas empresas, para YouTube e site."

**Interrogatório respondido**

| Pergunta | Resposta |
|---|---|
| Produto / benefício | Dashboard que junta contas, notas e extratos; o dono vê o caixa sem planilha |
| Público | Donos de PME e gestores financeiros, 30 a 55 anos, veem no desktop e no YouTube |
| Onde roda | YouTube in-stream e página inicial do site; 1920x1080 |
| Duração | 30 s; derivar 15 s |
| A UMA coisa | "Seu caixa inteiro numa tela." |
| Diferencial | Conciliação bancária automática e alerta de vencimento `[SUPOSIÇÃO]` |
| Tom | Preciso, calmo, confiável; não somos "startup descolada" |
| Ativos | Logo SVG, Figma do dashboard, fontes da marca |
| CTA | "Teste grátis por 14 dias" `[SUPOSIÇÃO]` + endereço do site |
| Restrições | Sem promessa de lucro; dados fictícios na tela |
| Objetivo | Cadastro no teste |
| Som | Locução opcional; trilha de 100 BPM (batida = 18 q) |

**Conceito:** "Papéis viram gráfico." A bagunça de notas, extratos e planilhas impressas levanta da mesa e se empilha exatamente na altura das barras do dashboard. O papel é o problema; o empilhamento é a solução causada pelo produto.

**Mundo:** vidro e cromo (interface em lâminas de vidro sobre uma mesa escura de escritório), com papel real como contraste tátil.

**Tratamento resumido**

- Paleta: grafite #16181D (60%), branco papel #F2F0EA (30%), verde da marca #2BD07F (10%).
- Luz: faixas verticais de 10 x 100 cm para reflexo no vidro, bandeiras pretas laterais, principal a 45° de 4500 K, contorno a 135° de 6500 K.
- Materiais: vidro do dashboard com Transmission Weight 1, aspereza 0,05 a 0,15 por camada, borda com chanfro de 2 mm; papel com Sheen leve e dobras por deformação.
- Câmera: 35 mm para mesa e espaço, 85 mm para provas; DoF f/5,6 em provas (primeiro plano) e f/8 em detalhe.
- Ritmo: tensão em 3 planos curtos, revelação com plano-respiro de 90 q.
- Som: papel, calculadora, clique de conferido, alerta suave; marca sonora no logo.

**Shot list**

| # | Batida | q in a q out | Dur. | Enquadr. | Herói % | Lente | Movimento | Ação | Transição | Som | Texto | C15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Gancho | 1 a 45 | 45 q | PM | 30% (nota em queda) | 35 mm | Parado | Notas fiscais caem em câmera lenta; uma passa rente à lente | Corte no movimento | Papel + batida q1 | Selo do logo no canto superior esquerdo q1 a q60 | Sim |
| 02 | Tensão | 46 a 108 | 63 q | PG | 60% (mesa) | 24 mm, 30° acima | Push-in 30 cm | Mesa coberta de papéis, planilhas, post-its | Corte seco | Ambiente de escritório | sem texto | Não |
| 03 | Tensão | 109 a 162 | 54 q | DET | 50% (fita) | 100 mm f/8 | Travelling lateral 8 cm | Fita da calculadora sai sem parar | Corte seco | Calculadora | sem texto | Não |
| 04 | Tensão | 163 a 210 | 48 q | PP | 55% (monitor) | 35 mm | Push-in 10 cm | Monitor com 14 abas de planilha piscando | Match cut: tela do monitor → primeira lâmina de vidro | Clique de abas | sem texto | Sim |
| 05 | Revelação | 211 a 300 | 90 q | PG | 65% (dashboard) | 35 mm | Travelling 25 cm, ease-in-out 20 q | Dashboard surge em 5 lâminas de vidro; papéis da mesa sobem e se empilham na altura de cada barra, defasados 4 q | Corte no movimento | Whoosh + trilha cheia q211 | sem texto | Sim |
| 06 | Revelação | 301 a 390 | 90 q | PM | 60% | 50 mm (neutro de propósito: respiro) f/4 | Travelling lateral 20 cm; foco muda de camada | Dashboard completo; segura 24 q no fim | Corte seco | Respiro da trilha | "Seu caixa inteiro numa tela" q305 a 388 (84 q; mínimo 83 q) | Sim |
| 07 | Prova 1 | 391 a 480 | 90 q | PP | 50% (cards) | 85 mm f/5,6 | Push-in 6 cm | Extrato de papel e lançamento de vidro se aproximam e encaixam; marca de conferido verde acende | Corte seco | Clique de encaixe q440 | "Conciliação automática" q400 a 470 (71 q; mínimo 70 q) | Sim |
| 08 | Prova 2 | 481 a 585 | 105 q | PG | 40% (linha) | 35 mm | Travelling acompanhando a linha | A linha do fluxo de caixa sai da tela e corre sobre a mesa como trilho de luz até o "futuro" | Corte no movimento | Tom ascendente | "Caixa dos próximos 90 dias" q485 a 585 (101 q; mínimo 87 q: 6 palavras, o 90 conta como 2). A frase original "Veja o caixa dos próximos 90 dias" (33 car., 8 palavras) pedia 111 q e foi encurtada | Não |
| 09 | Prova 3 | 586 a 690 | 105 q | PP | 50% (card) | 85 mm f/5,6 | Push-in 8 cm | Card de vencimento acende âmbar; a nota "vencendo" é puxada da pilha para o topo | Corte seco | Alerta suave q590 | "Avisa antes de vencer" q600 a 670 (71 q; mínimo 68 q) | Não |
| 10 | Assinatura | 691 a 750 | 60 q | PM | 55% (notebook) | 85 mm f/5,6 | Parado | Mesa limpa: notebook com dashboard e uma pilha única alinhada | Corte seco | Respiro | sem texto | Sim |
| 11 | Assinatura | 751 a 810 | 60 q | PACK | 40% (logo) | 85 mm | Deriva 1 cm | Logo em vidro sobre a mesa; reflexo da faixa de luz passa uma vez | Corte seco | Marca sonora q755 | "Caixa Claro" | Sim |
| 12 | CTA | 811 a 900 | 90 q | PACK | 40% | 85 mm | Parado | Logo + CTA + endereço | Fim | Trilha resolve | "Teste grátis por 14 dias" q812 a 900 (89 q; mínimo 87 q: 6 palavras, o 14 conta como 2) | Sim |

Soma: 45 + 63 + 54 + 48 + 90 + 90 + 90 + 105 + 105 + 60 + 60 + 90 = **900 q (30 s)**. Corte de 15 s: planos marcados C15 encurtados (01, 04, 05, 06, 07, 10, 11, 12) para somar 450 q. Note no plano 08 como a fórmula da seção 7.3 obrigou a encurtar a frase e a alongar o plano: é a regra funcionando (ver 00 · Padrões da casa).

Zona de texto no 16:9: 10% das bordas (x 192 a 1728, y 108 a 972); texto sempre no terço esquerdo, herói no direito.

### 9.3 Exemplo 3 · Serviço local · clínica odontológica · 15 s · 4:5

**Briefing recebido:** "Vídeo de 15 s pra clínica, feed do Instagram, quadradinho em pé."

**Interrogatório respondido**

| Pergunta | Resposta |
|---|---|
| Produto / benefício | Clínica geral; agendamento pelo WhatsApp e atendimento no horário |
| Público | Adultos de 25 a 50 anos que adiam dentista por medo e por espera |
| Onde roda | Feed do Instagram 4:5 (1080x1350); anúncio local |
| Duração | 15 s |
| A UMA coisa | "Sem espera." |
| Diferencial | Agenda confirmada pelo WhatsApp e atendimento no horário `[SUPOSIÇÃO]` |
| Tom | Acolhedor, claro, leve; não somos "clínica fria de hospital" |
| Ativos | Logo, fotos da fachada, cores da marca; sem fotos de pacientes |
| CTA | "Agende pelo WhatsApp" |
| Restrições | Resolução CFO 196/2019: clínica (pessoa jurídica) não publica "antes e depois"; evitar instrumentos e materiais identificáveis; sem promessa de resultado; incluir nome e CRO do responsável técnico ([CFO](https://website.cfo.org.br/resolucao-cfo-196-2019/)). Confirmar texto legal com o CRO/UF **[não verificado em detalhe]** |
| Objetivo | Agendamentos |
| Som | Trilha leve de 90 BPM (batida = 20 q); funciona mudo |

**Conceito:** "A espera dobra e some." A clínica é contada num livro pop-up de papel. A sala de espera lotada se fecha como pop-up quando a mensagem de confirmação se desdobra. O papel é a linguagem do acolhimento e permite falar de saúde sem instrumento, sem boca e sem antes e depois.

**Mundo:** papel e recorte.

**Tratamento resumido**

- Paleta: branco gelo #F6F4EE (60%), azul-claro da marca #8EC5E6 (30%), coral #FF8A6B (10%).
- Luz: janela grande suave de 5000 K a 60°, sombras curtas e definidas (o recorte precisa de sombra para existir), preenchimento a 1/3.
- Materiais: papel com Sheen Weight 0,2 a 0,3, aspereza 0,8, espessura real de 0,3 mm e borda levemente irregular; dobras com vinco visível.
- Câmera: 35 mm de cima a 35° para o livro, 85 mm para detalhes; DoF f/5,6 (papel tem que ser nítido).
- Animação: bonecos de papel animados "em dois" (troca de pose a cada 2 q) para textura de stop motion; câmera suave a 30 fps.
- Marca cedo: o filme abre na capa do livro com o logo em relevo.
- Texto legal: "Resp. técnico: Dr(a). Nome · CRO/UF 00000" fixo de q333 a q450 (118 q, pela fórmula da seção 7.3 com 41 caracteres).

**Shot list**

| # | Batida | q in a q out | Dur. | Enquadr. | Herói % | Lente | Movimento | Ação | Transição | Som | Texto |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Gancho | 1 a 45 | 45 q | PM | 60% (livro) | 35 mm, 35° acima | Desce 8 cm | Capa com logo abre de supetão; a página levanta uma sala de espera de papel lotada | Corte no movimento | Página virando forte q1 | sem texto |
| 02 | Tensão | 46 a 120 | 75 q | PP | 45% (relógio) | 85 mm f/5,6 | Push-in 3 cm | Relógio de papel com ponteiros girando rápido; boneco batendo o pé (em dois) | Corte seco na batida (q120) | Tique-taque acelerado | sem texto |
| 03 | Revelação | 121 a 180 | 60 q | PP | 50% (balão) | 85 mm f/5,6 | Parado | Celular de papel; balão verde de mensagem se desdobra em pop-up: "Confirmado: 14h" | Corte no movimento | "Plim" q140 | (texto dentro do balão, 16 car., 55 q: q125 a 180) |
| 04 | Revelação | 181 a 240 | 60 q | PM | 55% (porta) | 35 mm | Push-in 10 cm | Página vira; cadeiras da sala de espera deitam e somem no livro; sobra uma porta aberta com luz quente; segura 24 q | Corte seco | Papel fechando + respiro | sem texto |
| 05 | Prova 1 | 241 a 300 | 60 q | PM | 45% (consultório) | 50 mm f/5,6 (neutro) | Travelling lateral 5 cm | Consultório de papel claro com janela, cadeira estilizada sem instrumentos | Corte no movimento | Trilha leve | "Atendimento no horário marcado" q245 a 335 (90 q) |
| 06 | Prova 2 | 301 a 345 | 45 q | PP | 40% (boneco) | 85 mm | Parado | Boneco de papel sai pela porta com passo leve (sem antes e depois) | Corte seco | Passos de papel | (continua) |
| 07 | Assinatura | 346 a 385 | 40 q | PACK | 50% (livro) | 85 mm | Parado | Livro fecha; logo em relevo na capa | Corte seco | Livro fechando q346 | Texto legal a partir de q333 |
| 08 | CTA | 386 a 450 | 65 q | PACK | 50% | 85 mm | Parado | Logo + botão de WhatsApp de papel | Fim | Trilha resolve | "Agende pelo WhatsApp" q386 a 450 (65 q) |

Soma: 45 + 75 + 60 + 60 + 60 + 45 + 40 + 65 = **450 q (15 s)**. Zona de texto no 4:5 (valor de trabalho): 54 px de margem; CTA acima de y 1200.

### 9.4 Exemplo 4 · Produto pequeno e brilhante · fone sem fio · 15 s · 9:16

**Briefing recebido:** "Lançamento do fone Aura, 15 s pra Reels e TikTok. Tem que parecer caro."

**Interrogatório respondido**

| Pergunta | Resposta |
|---|---|
| Produto / benefício | Fone intra-auricular com cancelamento de ruído ativo; o barulho some |
| Público | 22 a 40 anos, trabalham em lugar barulhento, compram tecnologia premium |
| Onde roda | Reels e TikTok, anúncio; 1080x1920 |
| Duração | 15 s |
| A UMA coisa | "O mundo some quando você quer." |
| Diferencial | Cancelamento de ruído com um toque `[SUPOSIÇÃO]` |
| Tom | Preciso, silencioso, premium; não somos "gamer neon" |
| Ativos | CAD do fone e do estojo (STEP), logo SVG, cor preto fosco com detalhe champanhe |
| CTA | "Compre na loja oficial" |
| Restrições | Não mostrar marca de celular; não citar decibéis sem laudo |
| Objetivo | Venda no lançamento |
| Som | Som é parte da ideia: ruído alto, corte para silêncio; funciona mudo pelo congelamento visual |

**Conceito:** "O silêncio congela o mundo." Esferas de aço de 4 mm quicam sobre uma membrana de alto-falante que vibra (o ruído visível). Quando o cancelamento liga, todas param no ar. As esferas têm função: elas são o barulho.

**Mundo:** luxo escuro com linguagem de macro cinematográfico.

**Tratamento resumido**

- Paleta: preto fosco #0C0C0E (70%), aço #8A8F96 (20%), champanhe #C9A86A (10%).
- Luz: principal de área de 30 cm a 45°, contorno a 135° a 6500 K contra principal de 5000 K, faixa estreita de 4 x 60 cm para desenhar o brilho do estojo, bandeiras pretas laterais; fundo 2 a 3 stops abaixo do herói.
- Materiais: estojo em plástico fosco com aspereza 0,45 a 0,55 e variação ±0,05, logo em metal champanhe (Metallic 1, aspereza 0,25), chanfro de 0,5 mm; esferas com Metallic 1, aspereza 0,08 a 0,15 e micro-riscos.
- Câmera: 100 mm macro f/8 nos detalhes, 85 mm nos planos médios, f/5,6 nos primeiros planos (conferir num recorte a 100%); micro-tremor de 0,1° só no plano 01.
- Animação: esferas com física simulada (rigid body) ou chaves com quique; congelamento exato no q180; a tampa abre com overshoot de 3%.
- Som: cidade alta até q179; silêncio absoluto q180 a q190; depois só grave baixo.

**Shot list**

| # | Batida | q in a q out | Dur. | Enquadr. | Herói % | Lente | Movimento | Ação | Transição | Som | Texto |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Gancho | 1 a 45 | 45 q | DET | estojo desfocado ao fundo 25%; esferas em primeiro plano | 100 mm f/8 | Parado + micro-tremor 0,1° | Esferas quicam sobre membrana preta que vibra; estojo com logo desfocado atrás | Corte no movimento | Cidade alta + batida | Selo de marca q1 a q60 |
| 02 | Tensão | 46 a 90 | 45 q | PM | 35% (estojo) | 85 mm f/4 | Push-in 3 cm | Estojo fechado no centro da membrana, esferas batendo nele | Corte seco | Cidade + impactos metálicos | sem texto |
| 03 | Tensão | 91 a 120 | 30 q | DET | 70% (estojo cortado) | 100 mm f/8 | Parado | Uma esfera bate na tampa e ricocheteia rente à lente | Corte no movimento | Impacto forte q100 | sem texto |
| 04 | Revelação | 121 a 165 | 45 q | PP | 45% | 100 mm f/5,6 | Push-in 2 cm | Tampa abre com overshoot 3%, luz champanhe sai de dentro | Corte seco | "Tac" magnético q125 | sem texto |
| 05 | Revelação | 166 a 240 | 75 q | PP | 40% (fone) | 100 mm f/8 | Push-in lento 3 cm entre as esferas paradas | Fone sobe do estojo; anel de luz acende; no q180 todas as esferas param no ar; segura 24 q | Corte no movimento | Silêncio absoluto q180 a q190; grave baixo | sem texto |
| 06 | Prova 1 | 241 a 300 | 60 q | DET | 80% (fone) | 100 mm f/8 | Giro do fone 25° | Faixa de luz varre a grade do microfone | Corte seco | Grave baixo | "Cancelamento ativo" q241 a 300 (60 q) |
| 07 | Prova 2 | 301 a 345 | 45 q | PM | 35% | 85 mm f/4 | Parado | Esferas descem devagar, como dentro da água, e pousam sem som | Corte no movimento | Silêncio + 1 nota | "Silêncio de verdade" q301 a 363 (63 q) |
| 08 | Assinatura | 346 a 380 | 35 q | PACK | 45% (estojo + fones) | 85 mm f/5,6 | Parado | Estojo aberto com os dois fones; logo champanhe | Corte seco | Assinatura grave q346 | (continua) |
| 09 | CTA | 381 a 450 | 70 q | PACK | 45% | 85 mm | Deriva 1 cm | Mesmo packshot; CTA entra | Fim | Nota final | "Compre na loja oficial" q381 a 450 (70 q) |

Soma: 45 + 45 + 30 + 45 + 75 + 60 + 45 + 35 + 70 = **450 q (15 s)**. Packshot com 45% da altura cabe na área segura do Reels (979 px = 51%), centrado em y ≈ 758.

### 9.5 Exemplo 5 · Produto com líquido · lata de bebida · 20 s · 9:16

**Briefing recebido:** "20 s do Brisa, nosso refrigerante de limão com gás, pro Reels. Quero que dê sede."

**Interrogatório respondido**

| Pergunta | Resposta |
|---|---|
| Produto / benefício | Refrigerante de limão; refresca no calor |
| Público | 18 a 35 anos, Minas Gerais, verão |
| Onde roda | Reels e TikTok; 1080x1920 |
| Duração | 20 s |
| A UMA coisa | "Frio que se ouve." |
| Diferencial | Gás mais intenso e limão de verdade `[SUPOSIÇÃO]` |
| Tom | Fresco, intenso, solar; não somos "bebida de festa" |
| Ativos | Arte do rótulo planificada (dieline), logo SVG, lata padrão de 350 ml (Ø ~66 mm, altura ~122 mm **[não verificado]**: medir a lata real) |
| CTA | "Encontre no mercado" |
| Restrições | Bebida não alcoólica (se fosse alcoólica, regras do CONAR e advertências obrigatórias **[não verificado]**) |
| Objetivo | Lembrança de marca no verão |
| Som | O som é o herói: estalo do gelo, "tss" da abertura, gás |

**Conceito:** "O frio que se ouve." Um mundo quente e parado é quebrado pela lata que nasce de dentro da própria bebida, gela à vista (condensação em timelapse) e explode em som na abertura.

**Mundo:** orgânico líquido.

**Tratamento resumido**

- Paleta: amarelo-limão #E9F27A (50%), verde-folha #3E8E41 (25%), branco gelo #EAF6FA (15%), prata da lata (10%).
- Luz: contraluz de 4000 K atrás do líquido para acender a cor, principal de área a 45° de 5500 K, contorno frio de 7000 K para desenhar a lata; sol duro de 5500 K só no plano de calor.
- Materiais: lata em alumínio (Metallic 1, aspereza 0,2 a 0,3 com anisotropia leve no sentido do giro), rótulo impresso com aspereza 0,35; gotas de condensação com IOR 1,33; líquido com Transmission Weight 1, IOR 1,34 e cor por absorção (volume).
- Líquido: evitar simulação pesada na RTX 3050; superfície por malha com modificador de onda ou deslocamento animado, coroa de respingo por shape keys ou partículas, condensação por instâncias de gotas com escala animada **[testar no Blender]**. Render em Cycles nos planos de líquido.
- Câmera: 100 mm macro f/8 nos detalhes, 85 mm nos médios, 35 mm só no plano de calor (conferir num recorte a 100%).

**Shot list**

| # | Batida | q in a q out | Dur. | Enquadr. | Herói % | Lente | Movimento | Ação | Transição | Som | Texto |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Gancho | 1 a 45 | 45 q | DET | 90% (lata cortada) | 100 mm f/8 | Tilt para baixo acompanhando a gota | Gota de condensação escorre e atravessa o logo | Corte no movimento | Gelo estalando q1 | (logo na lata = marca cedo) |
| 02 | Tensão | 46 a 105 | 60 q | PG | sem herói (superfície do líquido) | 35 mm rasante | Travelling 20 cm | Superfície amarela quase parada sob sol duro; ondulação lenta; distorção de calor **[testar]** | Corte seco | Cigarra, calor | sem texto |
| 03 | Tensão | 106 a 150 | 45 q | DET | 50% (fatia) | 100 mm f/8 | Parado | Fatia de limão cai e a coroa de respingo sobe em câmera lenta | Corte no movimento | Respingo q120 | sem texto |
| 04 | Revelação | 151 a 225 | 75 q | PM | 45% (lata) | 85 mm f/4 | Grua sobe acompanhando | A lata emerge de dentro do líquido, que escorre por ela; contraluz acende o líquido; segura 30 q | Corte seco | Trilha entra; líquido escorrendo | sem texto |
| 05 | Revelação | 226 a 300 | 75 q | PP | 60% | 100 mm f/5,6 | Travelling lateral 6 cm | Timelapse: a lata seca se cobre de gotículas em 60 q; gotas maiores escorrem | Corte no movimento | Chiado gelado crescente | "Gelada do primeiro ao último gole" q230 a 328 (98 q) |
| 06 | Prova 1 | 301 a 345 | 45 q | DET | 70% (topo da lata) | 100 mm f/8 | Parado | Dedo puxa o anel; névoa fria sai | Corte no movimento | "Tss" q312 (o herói sonoro) | (continua até q328) |
| 07 | Prova 2 | 346 a 405 | 60 q | PM | 50% (copo) | 85 mm f/4 | Parado | Despejo em copo com gelo, contraluz, bolhas subindo | Corte no movimento | Gelo no copo + líquido | sem texto |
| 08 | Prova 3 | 406 a 450 | 45 q | DET | 80% (bolhas) | 100 mm f/8 | Push-in 2 cm | Bolhas sobem e desaceleram | Corte seco | Gás | sem texto |
| 09 | Assinatura | 451 a 525 | 75 q | PACK | 45% (lata + copo) | 85 mm f/5,6 | Deriva 1 cm | Lata e copo com gotas; logo legível | Corte seco | Assinatura sonora q455 | "Brisa. Frio que se ouve." q451 a 525 (75 q) |
| 10 | CTA | 526 a 600 | 75 q | PACK | 45% | 85 mm | Parado | CTA entra | Fim | Trilha resolve | "Encontre no mercado" q532 a 600 (69 q) |

Soma: 45 + 60 + 45 + 75 + 75 + 45 + 60 + 45 + 75 + 75 = **600 q (20 s)**.

---

## Fontes

Plataformas e eficácia criativa

- [Google Ads Help · About the ABCDs of effective video ads](https://support.google.com/google-ads/answer/14783551?hl=en)
- [Think with Google · ABCD playbook (PDF)](https://www.thinkwithgoogle.com/_qs/documents/8472/ABCD_Complete_V7b_HR_1.pdf)
- [Think with Google · 4 Best Practices for YouTube Bumper Ads (PDF)](https://www.thinkwithgoogle.com/_qs/documents/1633/au-youtube-bumper-ads-best-practices-video-editing.pdf)
- [TikTok Ads Help · Creative best practices for performance ads](https://ads.tiktok.com/help/article/creative-best-practices?lang=en)
- [TikTok Ads Help · Auction In-Feed Ads (especificações e gabaritos de zona segura)](https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads?redirected=1)
- [TikTok Creative Center · Creative Tips for Consumer Electronics](https://ads.tiktok.com/business/creativecenter/quicktok/online/creative-tips-consumer-electronics/pc/en)
- [Kantar · Super Bowl Ad Study: 15-second ads match 30-second spots (2026)](https://www.kantar.com/north-america/company-news/kantar-super-bowl-ad-study-15-second-ads-match-30-second-spots)
- [Kantar · How attention impacts media and creative effectiveness](https://www.kantar.com/inspiration/advertising-media/how-attention-impacts-media-and-creative-effectiveness)
- [System1 · This isn't another "just stick a logo on it" piece](https://system1group.com/blog/this-isnt-another-just-stick-a-logo-on-it-piece)
- [Benly · Meta Ads Creative Best Practices (secundária, sem fonte oficial)](https://benly.ai/learn/meta-ads/creative-best-practices)
- [MBADV · TikTok Ad Creative Best Practices (secundária)](https://www.mbadv.agency/tiktok-ads/creative-best-practices)

Zonas seguras

- [Solid Labs · Social Media Safe Zones (cita o texto do Meta e mede o gabarito do TikTok)](https://www.solidlabs.com/social-safe-zones)
- [Strike Social · Safe Zone Guide for TikTok, YouTube Shorts and Meta Reels](https://strikesocial.com/blog/maximize-ad-visibility-and-cut-through-the-noise-with-safe-zone-guides/)
- [AdNabu · Meta Safe Zones for Ads](https://blog.adnabu.com/meta-ads/meta-safe-zones/)
- [Outfy · Instagram Safe Zone Guide](https://www.outfy.com/blog/instagram-safe-zone/)
- [Recharm · TikTok Video Ad Specs](https://www.recharm.com/blog/tiktok-video-ad-specs)
- [V Digital Services · YouTube ad format guide](https://www.vdigitalservices.com/the-ultimate-guide-to-youtube-ad-format/)

Leitura de texto

- [Netflix · Portuguese (Brazil) Timed Text Style Guide](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215600497-Portuguese-Brazil-Timed-Text-Style-Guide)
- [Netflix · Timed Text Style Guide: Subtitle Templates](https://partnerhelp.netflixstudios.com/hc/en-us/articles/219375728-Timed-Text-Style-Guide-Subtitle-Templates)

Tratamento, shot list, animatic e pipeline

- [Storyflow · How to Write a Director's Treatment](https://storyflow.so/blog/how-to-write-a-directors-treatment)
- [The Collective Pitch · Commercial Director Treatment guide](https://thecollectivepitch.com/portfolio/commercial-director-treatment-guide-to-winning/)
- [Robin Piree · Commercial Treatment Templates](https://robinpiree.com/blog/commercial-treatment-template)
- [SVCHKR · How to write and design a director's treatment](https://svchkr.com/blog/my-experience/from-vision-to-final-render/)
- [StudioBinder · How to Make a Shot List](https://www.studiobinder.com/blog/how-to-make-a-shot-list/)
- [Dream Farm Studios · Animatic in a nutshell](https://dreamfarmstudios.com/blog/animatic-in-a-nutshell-the-storyboard-made-animated/)
- [Rokoko · What is previs](https://www.rokoko.com/insights/previs-what-is-previsualization)
- [School of Motion · A Guide to Completing Your Motion Design Project](https://schoolofmotion.com/blog/guide-completing-motion-design-project)
- [Runner Studio · The workflow every motion design studio uses](https://runner.studio/blog/this-is-the-workflow-every-motion-design-studio-uses/)
- [Boords · What are Style Frames](https://boords.com/blog/what-are-style-frames-definition-and-examples)
- [Sprout Studios · 3D Product Animation Process](https://sprout.cc/blog/3d-product-animation-process/)

Ideia, animação e câmera

- [Phillips e McQuarrie · Beyond Visual Metaphor (resumo)](https://www.academia.edu/1093616/Beyond_visual_metaphor_A_new_typology_of_visual_rhetoric_in_advertising)
- [Frontiers in Communication · estudo de metáfora visual e fluência (2023)](https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2023.1266813/full)
- [Animation Mentor · Timing: The 12 Basic Principles of Animation](https://www.animationmentor.com/blog/timing-the-12-basic-principles-of-animation/)
- [Tom Crowl · Best focal length for product photography](https://tomcrowl.com/best-focal-length-for-product-photography/)
- [Snappyit · Amazon Product Image Requirements (85% do quadro)](https://snappyit.ai/blog/amazon-product-image-requirements)

Regulação

- [CFO · Resolução CFO-196/2019](https://website.cfo.org.br/resolucao-cfo-196-2019/)

Sonda própria

- Valores de fábrica do Blender 5.2.2 LTS e teste do animatic: sonda rodada em `/home/claude/bvenv/bin/python` (bpy 5.2.2) nesta pesquisa. Script: `/home/claude/codigo/direcao/animatic_blocking.py`.

Nenhum asset de terceiros (modelo, textura, HDRI) foi usado neste capítulo; não há licença a declarar.

---

## Pendências para o Claude Code

**[testar no Blender]**

1. Rodar `/home/claude/codigo/direcao/animatic_blocking.py` com `blender -b -P` no Blender 5.2 da máquina (RTX 3050) e medir o tempo por quadro a 270x480; conferir se a troca de câmera por marcador funciona no render de animação (`render.render(animation=True)`), não só em quadro único.
2. Gerar o vídeo do animatic (FFmpeg pelo próprio Blender: `scene.render.image_settings.file_format` e `ffmpeg`) e conferir nomes das propriedades no 5.2.
3. Gabarito de zona segura no compositor (`scene.compositing_node_group` com Box Mask) para render de conferência em 1080x1920 e 1080x1350.
4. Valores de alça (handles) para "ease-out forte", antecipação de 3 a 6 q e overshoot de 2 a 5% usando o channelbag (`anim_utils.action_get_channelbag_for_slot`), comparando com o Auto Clamped de fábrica numa folha de contato.
5. Micro-tremor de câmera de 0,1 a 0,3° (modificador de ruído em F-curve) sem parecer erro.
6. Os 9 mundos ainda não testados (diorama isométrico, orgânico líquido, brutalista tech, macro cinematográfico, papel e recorte, retrofuturo, holográfico, editorial de revista, tátil têxtil): um style frame de cada com o `qa.py`.
7. Exemplo 5: líquido sem simulação pesada (malha com deslocamento animado, coroa de respingo por shape keys, condensação por instâncias) e tempo de Cycles por quadro na RTX 3050.
8. Exemplo 3: animação "em dois" (troca de pose a cada 2 q) com interpolação CONSTANT em 30 fps.
9. Medir no celular real o tamanho mínimo legível de texto em 1080x1920 (valor de trabalho: altura de maiúscula 48 px no corpo, 64 px na CTA).

**[não verificado]** que precisa de fonte oficial

- Texto oficial do Meta sobre zona segura do Reels (14% topo, 35% base, 6% lados) foi lido em citação secundária; a página do Meta bloqueou a leitura automática.
- Margens do feed 4:5 e do 16:9 in-stream são valores de trabalho deste manual.
- A fórmula de leitura (12 caracteres/s + 0,5 s) é derivada da Netflix, não medida em anúncio.
- Detalhes do texto legal obrigatório para clínica (CRO/UF) e regras do CONAR para bebida alcoólica.

**PENDÊNCIAS YOUTUBE**

- "Motion Design Process: Art Direction & Style Frames", The Futur (listado em [Class Central](https://www.classcentral.com/course/youtube-motion-design-process-art-direction-style-frames-109064)). Esperava aprender: quantos style frames uma produtora apresenta, como o diretor de arte comenta cada um e como o portão de aprovação é conduzido.
