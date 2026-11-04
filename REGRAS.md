# Regras de ofício (valem para todo modelo)

O estilo (cor, fonte, layout, ritmo) é de cada modelo e mora no `sistema/modelos/<modelo>/<modelo>.md`, o arquivo único do
modelo, que já traz escritas as regras abaixo que valem para ele. Estas regras servem para criar modelo novo e para
conferir: valem para todos, e um modelo só as quebra se o `<modelo>.md` disser por quê. Todas nasceram de vídeos
reprovados e corrigidos.

## 0. Correções do dono que valem para todos (acima de tudo)
Ficam acima das regras abaixo e do código. As de um modelo só estão escritas como regra no `sistema/modelos/<m>/<m>.md`.
Correção mais nova vence a mais velha. G22 e G23 vêm primeiro porque mandam no resto, e a G40 (2026-11-03) diz o
alcance delas: valem para a identidade do vídeo; as cenas se decidem uma a uma (`sistema/cenas/METODO.md`):

| # | Regra | Data |
|---|---|---|
| G22 | O padrão de cada modelo é tudo o que está no vídeo aprovado dele mais as correções do dono; as correções ficam acima das regras do modelo. Desde a G40, "padrão" é a identidade (tratamento, rosto, legenda, tipografia, cores, som, ritmo) e o repertório de respostas do modelo; quais respostas entram em cada cena se decide cena a cena. | 2026-10-13 17:15 |
| G23 | O vídeo novo num modelo tem que parecer o vídeo aprovado daquele modelo desde o 1º segundo (na identidade: o que o `parece.py` mede; G40). | 2026-10-10 16:13 e 2026-10-13 16:49 |
| G1 | Todo texto fica na tela o tempo de ser lido; nunca jogar texto rápido demais. | 2026-09-30 00:06; 2026-10-03 15:14; 2026-10-12 08:54 |
| G2 | A tela mostra o que está sendo dito; nada de elemento com outro texto. | 2026-10-05 11:43 |
| G3 | Representar o ato, não relatar. | 2026-10-05 11:43 |
| G4 | Palavra-chave forte ganha animação/ilustração própria no instante; badge só para o simples. | 2026-10-05 11:43 |
| G5 | Nada de elemento solto em lugar aleatório; o trecho vira tela ilustrada, enxuta e didática. | 2026-10-05 11:43 |
| G6 | Ler o tom da fala e editar a respeito dele. | 2026-10-05 11:43 |
| G7 | Sem cortina aberta: tela cheia sai junto com o corte. | 2026-10-05 11:43 |
| G8 | Número e frase exatamente como foram ditos. | 2026-10-05 10:49 e 11:43 |
| G9 | Imagem de prova grande e devagar para ser entendida. | 2026-10-05 11:43 |
| G10 | Decupagem limpa: tirar take repetido e conferir cada corte pela transcrição. | 2026-10-05 11:43 e 15:11 |
| G11 | Cor: identidade própria da peça/modelo, nunca as cores da marca do dono; cor que combina em contraste com o vídeo. | 2026-10-05 11:08; 2026-10-10 16:13; 2026-10-13 16:09 |
| G12 | O que se ensina num modelo fica só nele (não contamina os outros). | 2026-10-05 16:35 e 23:17 |
| G13 | Lições técnicas de um modelo valem nos outros (o que é ofício, não estilo). | 2026-10-07 12:42 |
| G14 | A legenda conta a história: todas as falas, em ordem, sem embolar. | 2026-10-12 08:22 e 08:54 |
| G15 | Legenda padrão em no máximo 2 posições no vídeo inteiro. | 2026-10-12 08:54 |
| G16 | Legenda padrão na altura de leitura da regra (peito), nunca rebaixada ao pé. | 2026-10-12 09:36 e 09:39 |
| G17 | Em 9:16, todo texto respeita as margens das redes (zona segura). | 2026-10-12 09:39 |
| G18 | No máximo 4 linhas por bloco de texto. | 2026-10-12 08:54 e 09:08 |
| G19 | Destaque só no termo protagonista da fala. | 2026-10-12 08:54 |
| G20 | Nunca escrever o nome do modelo na tela. | 2026-10-12 09:08, 10:33, 10:38, 10:55 |
| G21 | Cor de fundo, preto e branco, efeitos, música e imagem de IA no lugar de câmera são escolha do usuário. | 2026-10-12 09:08, 10:00, 10:33, 10:38 |
| G24 | **Material: três modos, e o dono diz qual vale para o vídeo.** **Só materiais (o padrão, quando ele não disse nada):** só o que está na pasta de materiais indicada daquele vídeo (`<perfil>/materiais/`, `entrada/`); nada gerado, nada buscado; faltou, vira efeito tipográfico, a pessoa ou reaproveitamento, e a falta vai para o `PEDIDO.md`. **Livre** ("faz o que der com tudo"): os materiais, mais o que o sistema consegue buscar, recortar e gerar, API incluída (kie.ai e as que estiverem configuradas); o que ainda faltar vira `PEDIDO.md`. **Indicado** ("materiais e API só", "materiais e busca online"): os materiais mais exatamente o que ele listou, e nada além; sem lista clara, volta como pergunta. O modo vale só para aquele vídeo, fica em `cenas.json` (`material`, `material_permitido`) e o `decupar.py --conferir` cobra. Em qualquer modo: prova nunca inventada (G34), nada de terceiros na entrega (G27), chave nunca em arquivo, e o que foi gerado ou buscado vem listado no recado final, com o custo quando houver. | 2026-10-07 15:28; 2026-11-03 |
| G25 | Cada modelo entende a autenticidade do usuário com o uso, sem corromper o modelo. | 2026-10-10 14:20 |
| G26 | Conteúdo padronizado de cliente segue o vídeo que o cliente aprovou; variação nova só acrescenta. | 2026-10-09 17:27 |
| G27 | Entrega enxuta: o modelo se sustenta sem referências de terceiros; o vídeo de apresentação vira a referência. | 2026-10-10 12:30 |
| G28 | Tudo confinado na pasta do projeto (fixo e temporário). | 2026-10-09 08:50 |
| G29 | Não encher o disco do dono durante o trabalho. | 2026-10-13 13:11 |
| G30 | Produzir no estúdio 2D, não na Máquina de Conteúdo/VK Studio (salvo pedido). | 2026-10-09 15:36; 2026-10-13 15:56 |
| G31 | Nome/@ na tela só os reais de quem fala; nunca nome de exemplo. | 2026-10-13 16:43; 2026-10-12 10:33 |
| G32 | Criar um modelo é aprender uma forma de execução, não copiar a referência. O modelo tem que funcionar com o que o vídeo tiver: só a gravação da pessoa, sem B-roll, sem imagem, sem várias cenas, e seguir as instruções do dono. | 2026-10-22 ("criar um modelo não é copiar, é aprender uma forma de execução. Nem sempre vou ter um B-ROLL ou uma imagem ou várias cenas, e daí faz com o que tiver e as instruções mesmo") |
| G33 | Nenhum tratamento de cor na gravação da pessoa: isso o usuário faz à mão, antes. As cores dos elementos do tema (cartões, texto, destaques) também são gosto e ajuste do usuário; o modelo traz paletas prontas como opção, não como regra. | 2026-10-22 ("Esquece esse trem de tratamento de adjustment de cores na gravação, pois isso o usuário faz manualmente, e as cores das coisas em si do tema é de acordo com o gosto e ajuste do usuário também") |
| G37 | Texto nunca leva contorno, sombra justa ou brilho (glow) colado na letra: isso faz a palavra parecer recortada e colada, não em cima da imagem. Sobre fundo borrado ou chapado, o texto entra limpo. Se a leitura sobre a gravação realmente pedir ajuda, use só uma sombra larga e bem suave (desfoque grande, pouca opacidade, sem desenhar a borda da letra), nunca da mesma cor do fundo. | 2026-10-30 (no "vídeos" do hook: "tem uma borda/sombra preta ao redor justa, aí ficou esquisito e desconexo, parecendo que foi recortado. Já vi isso outras vezes, corrija isso (retire) em todos"; na tela de papel: "uma sensação de recorte na letra e não que ela está em cima … ali não precisa de glow ou coisa do tipo, pois o fundo já está borrado") |
| G36 | O trabalho do estúdio nunca trava o computador do dono. Todo processo pesado roda com contenção (prioridade ociosa no processador e na placa, núcleos livres pro dono, um pesado por vez, sem começar outro com pouca RAM; e o Blender limitado a 40% do tempo de placa enquanto o dono mexe no computador, no máximo 90% quando ele sai por 1 min, nunca 100%), pelo `sistema/tools/com-trava.sh` ou com o vigia `sistema/tools/contencao.ps1`. | 2026-10-29 ("Tá travando o PC todo, você precisa colocar contenções no nosso sistema EditOS para não travar o computador quando estivermos fazendo algo, se não é impossível trabalhar assim"; e, sobre a placa: "precisamos de uma forma de limitar a placa, pois isso causou vários problemas") |
| G35 | Um bloco de legenda é um trecho só: nunca junta o fim de uma frase com o começo de outra. Passou de ponto, vírgula, interrogação, exclamação ou dois-pontos, o bloco acaba, some, e o próximo trecho entra num bloco novo. No máximo 2 linhas por bloco; trecho longo vira blocos menores do mesmo trecho. | 2026-10-29 ("Eu não quero um final de uma frase com o começo de outra, isso é ridículo … Não quero 3 linhas de legenda, principalmente em partes diferentes do texto. Só faz sentido se for do mesmo trecho, e claramente se passou do ponto ou vírgula não são do mesmo trecho") |
| G34 | Interface, tela de app, site ou aparelho recriados na tela são **fiéis como um print**: proporção, tipografia, ícones, cores, estados e conteúdo reais daquela interface, de ponta a ponta. Nunca a versão simplificada e genérica que se repete de modelo em modelo (o mesmo celular 3D, o mesmo cartão branco com ícone). O procedimento está em `.claude/skills/criar-modelo/referencias/interface-fiel.md`. | 2026-10-23 ("quando for para criar alguma interface, a intenção é que seja o máximo parecido possível, como se fosse um print … não tem por que ficar copiando esses mesmos modelinhos 3D de telas, de frames, tudo simplesmente igual quando você poderia estar fazendo algo muito mais detalhista e voltado mais parecido com a realidade") |
| G38 | Um elemento por ideia na tela: a mesma informação nunca aparece em dois elementos ao mesmo tempo (título, selo, contador, comando e legenda dizendo o mesmo). A legenda não repete o que o texto grande já mostra. O checador de cada molde acusa repetição entre elementos simultâneos. | 2026-11-03 (prova-print PV4: "Esse frame é bizarro: a MESMA COISA sendo colocada 3x na tela de forma diferente, wtf. Já temos tantas regras do tipo e você cometeu algo tão besta.") |
| G39 | Nada pendurado: selo, título ou texto de gancho some quando a fala dele passa; nenhum elemento fica na tela além do seu trecho (só o comando do fecho fica até o fim). | 2026-11-03 (prova-print PV5: "O '100% editado pelo Claude' ficou até o final do vídeo, totalmente desnecessário.") |
| G40 | **O vídeo é uma composição de cenas, não o modelo copiado.** Decupar a fala em cenas (cada trecho até a vírgula ou o ponto, ou alguns cortes que contam uma coisa só) e decidir a edição de cada cena para deixá-la mais interessante e didática: rosto puro, uma resposta do modelo da casa, a resposta de outro modelo ou um estilo de cena (`cenaNN`). O modelo escolhido é a casa (identidade do vídeo inteiro); o plano de cenas abre o `plano.md`. Pedido do dono para uma cena ("cena 3 na cena07") manda nela. Método inteiro: `sistema/cenas/METODO.md`. | 2026-11-03 (o dono, editor: "Você precisa enxergar um vídeo como uma composição, cada frase dentro de uma vírgula ou ponto [...] é considerado uma cena [...] e daí eu construo a edição daquela cena, e nesse caso eu decido se faz sentido ou não") |
| G41 | A tela só troca onde a fala fecha um pedaço: cena até o ponto, subcena até a vírgula (ou a pausa que faz as vezes deles, o ponto e a vírgula imaginários). `tools/decupar.py` demarca e numera; no modo semiautomático o dono escolhe cena a cena pela lista ("1 - cena04; 2 - tela da casa"), no automático o assistente escolhe e entrega a lista junto. "Legenda padrão em <modelo>" vale o vídeo todo, menos na zona de um modelo ou estilo que mostra a fala como imagem, com uma legenda por vez e troca só no limite de cena (`cenas/METODO.md` §6). | 2026-11-03 |

Como se confere G23: `sistema/tools/parece.py` (luz, cor, enquadramento e ritmo contra `sistema/modelos/<m>/assinatura.json`) e a
folha lado a lado que ele grava. Os conferidores de regra dos moldes não provam G23.

## 1. O vídeo parece as referências do modelo
- Antes de editar, ler o `<modelo>.md` inteiro e estudar a referência própria do modelo em `sistema/modelos/<m>/referencia/`:
  o vídeo aprovado, a folha de 1 quadro por segundo e o mapa medido.
- A receita visual é medida (posição e tamanho em % do quadro, fonte, hex, movimento); seguir a medida, não o gosto.
- Comparar quadro a quadro com as referências antes de entregar (folha lado a lado em `conferencia/`).
- A cor e a fonte são as do modelo. Nada da identidade pessoal de quem edita.
- Exceção (G40): dentro da cena que usa um estilo de cena (`cenaNN`), o visual é o do estilo enquanto ele está
  na tela; a legenda e o resto do vídeo seguem a casa (`sistema/cenas/METODO.md` §4).

## 2. A tela mostra o que está sendo dito
- Texto na tela são as palavras ditas (ou nenhuma). Número e frase exatamente como foram falados.
- Representar, não relatar: se a fala diz "está editando", a tela mostra o ato de editar.
- Palavra-chave forte ganha ilustração própria no instante exato; nada de elemento solto em lugar aleatório.
- Imagem de prova grande e devagar o bastante para ser entendida. Prova nunca é inventada.

## 3. A legenda conta a história
"Quando a legenda se bagunça, é como embolar os acontecimentos."
- Todas as falas aparecem (nos modelos com legenda), cada trecho uma vez só.
- Tempo de leitura: bloco ≥ 1,5 s e cada palavra ≥ 0,4 s depois de aparecer. A régua ideal é 1 s + 3 palavras/s;
  com fala rápida, juntar em frases maiores em vez de picar. Nada pisca.
- No máximo 4 linhas por bloco.
- Legenda padrão em no máximo 2 posições fixas no vídeo todo, na altura de leitura medida do modelo (em geral o
  peito). Nunca no pé do quadro. Troca de posição só quando um destaque ocupa o lugar.
- Sincronia: cada texto e cada corte entram no início da palavra que os motiva (±2 quadros).
- Nada atravessa um corte seco. Toda peça só aparece a partir do seu tempo de entrada.
- Sem "cortina aberta": tela cheia que cobre o vídeo sai junto com o corte.

## 4. Destaque só no protagonista
- Tela ou palavra de destaque é para o termo protagonista da fala (o assunto: "outros modelos de edição"), nunca
  advérbio ou ligação ("realmente").
- Tela de destaque não carrega texto comum; texto comum que continua depois não começa dentro dela.
- Destaques do mesmo vídeo têm o mesmo tamanho. Destaque não encolhe para caber: abre-se o plano.
- Nunca escrever o nome do modelo na tela.
- Nome, @ ou cargo na tela são sempre os reais de quem fala na gravação, e só quando o dono do vídeo os dá. Sem
  eles, o elemento fica desligado. Nunca nome de exemplo, inventado ou de outra pessoa sobre o rosto de alguém.

## 5. Zona segura (9:16, Reels/TikTok/Shorts)
- Todo texto entre y 250 e 1500 e entre x 60 e 940 (num quadro 1080x1920): fora da barra de cima, da legenda do post
  e dos botões da direita.
- O rosto não fica coberto por texto.

## 6. Opções e padrão
O padrão de cada modelo é o vídeo aprovado mais as correções (G22). Pelas correções G21 ficam desligados por padrão,
e o usuário liga se quiser: música, cor de fundo alterada, preto e branco, efeitos de textura (VHS, glitch) e
imagem/vídeo gerado por IA no lugar de outra câmera. O tratamento de imagem que faz a cara do modelo segue o vídeo
aprovado (no trailer o tratamento quente, no pagina-de-livro o fundo escuro do `efeitoFundo`): ligado. Os
efeitos sonoros do próprio modelo ficam ligados.
- Fontes: o limite é o de cada modelo (pagina-de-livro: 2 fontes e 1 variação de peso; autoridade: 1 principal e
  2 alternativas). Na dúvida, poucas fontes, as do vídeo aprovado.
- Chamada para ação: só o comando fica fixo, com a palavra a comentar entre aspas (comenta "EDIÇÃO"); o resto da
  fala segue na legenda.

## 7. Material
- Fazer sozinho tudo o que dá: buscar foto com licença aberta (`sistema/kit/buscar.py`), recortar (`sistema/kit/recortar.py`),
  gerar objeto/cenário (`sistema/kit/gerar.py`). Pessoa real só com foto real licenciada, nunca rosto gerado.
- O que só o criador tem (print específico, gravação de tela) vira um pedido numerado, com a hora, a frase e um plano
  B honesto. O resto do vídeo segue enquanto isso.
- Licença anotada sempre (`ORIGEM.md`); crédito na descrição quando a licença pede.

## 8. Conferir com prova
- Cada molde tem um checador (`scripts/`): falas cobertas, tempo, repetição, posições, zona segura, sincronia.
  Rodar até zerar antes de renderizar.
- Olhar os quadros (folha de 1 quadro por segundo) antes de dizer pronto.
- Áudio final: voz na frente, trilha ~16 dB abaixo, -14 LUFS, pico ≤ -1 dBTP.

## 9. Confinado
- Tudo o que o estúdio usa e gera mora dentro dele: `sistema/.venv/`, `sistema/node_modules/`, `sistema/tools/.cache/`, `sistema/.tmp/`, `sistema/oficina/`.
- Render com a trava (`sistema/tools/com-trava.sh`), `--concurrency=2`, um render pesado por vez.
