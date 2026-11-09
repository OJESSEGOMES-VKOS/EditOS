# Regras de ofício (valem para todo modelo)

O estilo (cor, fonte, layout, ritmo) é de cada modelo e mora no `sistema/modelos/<modelo>/<modelo>.md`, o arquivo único do
modelo, que já traz escritas as regras abaixo que valem para ele. Estas regras servem para criar modelo novo e para
conferir: valem para todos, e um modelo só as quebra se o `<modelo>.md` disser por quê. Todas nasceram de vídeos
reprovados e corrigidos.

## 0. Correções do dono que valem para todos (acima de tudo)
Ficam acima das regras abaixo e do código. As de um modelo só estão escritas como regra no `sistema/modelos/<m>/<m>.md`.
Reescritas do zero pelo dono em 2026-11-05; substituem as G antigas (cópia em `sistema/.tmp/regras-backup/`).

| # | Regra | Data |
|---|---|---|
| G1 | **Confinado.** Todos os arquivos e coisas necessárias criadas ficam dentro da própria pasta do projeto. | 2026-11-05 |
| G2 | **Disco.** Nunca deixar chegar ao nível de encher o disco. | 2026-11-05 |
| G3 | **EditOS.** O sistema é o EditOS; tudo é produzido por ele, aqui dentro dele. | 2026-11-05 |
| G4 | **Computador livre.** Nunca deixar os processos ocuparem o computador ao ponto de travar. | 2026-11-05 |
| G5 | **Decupagem limpa e dinâmica**, com a fala bem em cima, de forma precisa: retirar trechos repetidos por erro; o tempo de cada cena (legenda/timestamp) é extremamente preciso. Teste: dá para decupar só olhando a onda de áudio na timeline, cortando todo o espaço vazio entre as "montanhas" sem encostar nelas. **Correção do dono (2026-11-07):** o corte nunca come o fim da palavra ("era muito apertado" cortado antes de acabar): conferir o fim de cada trecho na onda até o som da última sílaba sumir. | 2026-11-05 |
| G6 | **Qualidade máxima do original.** Mudar o fundo, coloração, color grading, efeitos sonoros, música, recorte do protagonista e qualquer tratamento da gravação só entram com ordem explícita no pedido de edição. **Decisão do dono (2026-11-05):** isso inclui o tratamento da voz (passa-alta, redução de ruído, compressor, normalização -14 LUFS): só com pedido (`novo-video.py --tratar-voz`, `TRATAR_VOZ=1` no mixar). | 2026-11-05 |
| G7 | **Material: três modos**, só materiais (padrão), livre ou indicado. Quem declara é o dono. | 2026-11-05 |
| G8 | **Nome e @ na tela** só os reais, e só quando fizer parte do pedido ou do modelo. | 2026-11-05 |
| G9 | **Tempo do texto.** Legenda que acompanha fala fica o tempo da fala; outro texto, o tempo necessário para ser lido. Por isso a precisão de narração e legenda é extrema. **Correção do dono (2026-11-07, autoridade v1):** nenhum bloco some antes de dar para ler ("né?" passou em meia fração). Subtrecho curto demais para ler no tempo da fala junta com o subtrecho vizinho do MESMO trecho ("Eu nunca tive salário, né?" num bloco só); nunca junta trechos diferentes. | 2026-11-05 |
| G10 | **Números e frases exatamente como ditos**, a não ser com pedido explícito de correção do dono. | 2026-11-05 |
| G11 | **Legenda não se picota ao acaso.** Divide de forma intencional, com contagem parecida de palavras por trecho, sem juntar o fim de uma fala com o começo de outra. Errado: "finalmente chegou. Então quando" / "ele bateu". Certo: "finalmente chegou." / "Então quando ele bateu". | 2026-11-05 |
| G12 | **Legenda padrão** (a que corre da forma mais simples no vídeo, sem destaque): no máximo 2 linhas, de preferência 1, seguindo a G11. Lugar fixo, geralmente a 70% da altura da tela (de cima para baixo), salvo pedido explícito. **Decisão do dono (2026-11-05):** o modelo que tem altura própria de legenda mantém a altura dele. **Correção do dono (2026-11-07):** o tamanho da fonte da legenda padrão é UM só no vídeo inteiro; nunca encolhe nem cresce para caber. Frase longa quebra em blocos, não muda de tamanho. **Correção do dono (2026-11-07, autoridade v2):** num bloco de legenda com destaque, o texto normal ao redor da palavra destacada tem o MESMO tamanho da legenda padrão; só a palavra destacada cresce. **Correção do dono (2026-11-07, fala-escrita v2):** nenhum texto fica MENOR que a legenda padrão (atrapalha a legibilidade e a didática). Variação de tamanho só para cima: até 2 tamanhos maiores, reservados a palavras/termos escolhidos para destaque. | 2026-11-05 |
| G13 | **Legenda especial/de destaque:** no máximo 3 posições no vídeo, e sem variar ao acaso entre elas a todo momento (perde o sentido e confunde). Cada momento respeita o seu momento. **Correção do dono (2026-11-07):** destaques do mesmo tipo (ex.: duas frases-título) ficam sempre na MESMA posição; a posição muda só quando o tipo de destaque muda. | 2026-11-05 |
| G14 | **Trecho e subtrecho.** Um trecho vai até uma pontuação; passou dela, é outro trecho. De uma vírgula a outra é um subtrecho do trecho. É isso que define onde a legenda pode quebrar. | 2026-11-05 |
| G15 | **Zona segura.** Todo texto respeita a zona de segurança das redes sociais. | 2026-11-05 |
| G16 | **Texto limpo:** sem contorno, sombra colada ou brilho, a não ser com pedido explícito do dono. **Decisões do dono (2026-11-05):** a sombra larga e suave (não colada na letra) pode ficar; o brilho neon do anuncio-neon e do motion-ouro é identidade deles e fica ligado. | 2026-11-05 |
| G17 | **Destaque só onde importa**, dentro do trecho ou subtrecho, com relevância no storytelling. Na dúvida, não destaca. Em geral um ponto importante por trecho ou subtrecho, mas não em todos: só no que faz a melhor conexão com o tema do vídeo/corte. | 2026-11-05 |
| G18 | **Acabamento do destaque:** (1) a pontuação fica fora da palavra destacada; (2) as aspas seguem o mesmo padrão; (3) o destaque precisa ler no fundo onde cai, o contraste é necessário; (4) nunca empilhar legenda e destaque em cima do rosto. **Correção do dono (2026-11-07):** citação (fala que a pessoa põe na boca de outro) se diferencia em itálico, no tamanho de um dos destaques do vídeo, e cada bloco da citação abre E fecha aspas. | 2026-11-05 |
| G19 | **A tela mostra o que está sendo dito**, em fala, ilustração ou o que for, desde que explicitamente pedido pelo dono. Na dúvida, só o que está sendo dito, sem quebrar as regras de legenda. Em geral, representar o ato, não relatar. | 2026-11-05 |
| G20 | **Palavra-chave forte** ganha animação própria; selo só para o simples. | 2026-11-05 |
| G21 | **Nada solto em lugar aleatório;** o trecho vira uma tela enxuta e didática. | 2026-11-05 |
| G22 | **Tom.** Ler o tom da fala e editar de acordo com ele. | 2026-11-05 |
| G23 | **Tela cheia sai junto com o corte/trecho/subtrecho**, sem parecer que terminou antes do tempo e ainda mostrar o resto de um trecho que era para ser destaque. **Correção do dono (2026-11-07, especialista v1):** transição só entre trechos diferentes (onde a fala fecha num ponto e começa outra ideia), nunca dentro do mesmo trecho; uma fala só ("Escolhe sempre coisas que te desafiem") fica numa tela só, com o destaque dentro dela. | 2026-11-05 |
| G24 | **Imagem de prova** aparece grande e didática. | 2026-11-05 |
| G25 | **Interface ou aplicativo** na tela é fiel como um print, nunca genérico. | 2026-11-05 |
| G26 | **Um elemento por ideia:** a mesma informação nunca aparece 2 vezes ou mais na tela. | 2026-11-05 |
| G27 | **Nada perdura fora do tempo:** o elemento sai quando a fala passa. | 2026-11-05 |
| G28 | **Composição dentro de um tema.** Cada vírgula define um subtrecho e cada ponto um trecho; cada um tem a própria edição dentro do modelo, de acordo com a relevância ao tema. Trecho totalmente ligado ao tema (conclusão, afirmação, informação etc.) merece destaque. **Correção do dono (2026-11-07):** "tela no fim de trecho/subtrecho" quer dizer: a tela de destaque entra no trecho que tem força para o tema e sai junto com ele. Não é para pôr tela em todo fim de trecho nem em frase sem peso. Tela de destaque é texto (alinhado ao centro), sem gráfico/ilustração, a não ser que a fala peça e o dono queira. | 2026-11-05 |
| G29 | **Começo.** Todo vídeo começa bem dinâmico, na gravação original, dando ênfase ao gancho; tudo voltado para prender a atenção do espectador. | 2026-11-05 |
| G30 | **Modelo não é molde, é inspiração** de como foi construído: o porquê e o como. Correções mandam mais que o modelo. Criar ou editar num modelo não é copiar o mesmo timestamp de estilo de edição: é definir a identidade do vídeo, entender por que tal tela foi usada e decidir onde ela se encaixa no vídeo pedido. Se o vídeo do modelo começa numa tela diferente, os outros só começam assim se o porquê for igual. | 2026-11-05 |
| G31 | **Cores** são as do modelo, ou as do pedido explícito daquela edição. | 2026-11-05 |
| G32 | **O que é passado a um modelo afeta só ele**, a não ser com pedido explícito. | 2026-11-05 |
| G33 | **O nome do modelo e a UI de edição** nunca aparecem na tela. | 2026-11-05 |
| G34 | **O modelo aprende o seu jeito com o uso**, sem se corromper. | 2026-11-05 |
| G35 | **Conteúdo de cliente** segue o vídeo que o cliente aprovou; uma variação só acrescenta. | 2026-11-05 |


## 1. O modelo é inspiração (G30)
- Antes de editar, ler o `<modelo>.md` inteiro e a referência própria em `sistema/modelos/<m>/referencia/` para entender
  o porquê e o como de cada tela, não para copiar a ordem nem o tempo delas.
- Do modelo o vídeo herda a identidade (fonte, cor, estilo de legenda e de destaque). Cada tela do modelo é repertório:
  entra num trecho da fala nova só quando o porquê dela se repete ali.
- A cor e a fonte são as do modelo ou as do pedido explícito (G31). Nada da identidade pessoal de quem edita.
- Dentro de um estilo de cena (`cenaNN`), o visual é o do estilo enquanto ele está na tela (`sistema/cenas/METODO.md`).

## 2. Decupagem (G5)
- Primeiro a decupagem, depois o resto. Cortar todo silêncio entre as falas sem encostar nelas; tirar take repetido.
- Conferir cada corte na onda do áudio e na transcrição. Tempo de palavra e de cena preciso no quadro.
- Zoom, punch-in ou troca de enquadramento só com motivo na fala; nunca aleatório, nunca por tempo, nunca com som.
  Exceção do modelo autoridade (decisão do dono): a deriva lenta continua, sempre como aproximação contínua, nunca corte seco de zoom.

## 3. Legenda (G9 a G16)
- Todas as falas aparecem, cada trecho uma vez só, em ordem. Cada bloco fica o tempo da sua fala.
- Sincronia: cada texto e cada corte entram no início da palavra que os motiva (±2 quadros). Nada atravessa um corte seco.
- Quebra só onde a G11 e a G14 permitem; padrão em 1 linha (máximo 2) no lugar fixo da G12; especial em até 3 posições (G13).

## 4. Destaque (G17, G18)
- Tela ou palavra de destaque só onde o trecho tem relevância para o tema. Na dúvida, não destaca.
- Destaques do mesmo vídeo têm o mesmo tamanho. Destaque não encolhe para caber: abre-se o plano.
- Tela de destaque não carrega texto comum; texto comum que continua depois não começa dentro dela.

## 5. Zona segura (G15)
- Num quadro 1080x1920, todo texto entre y 250 e 1500 e entre x 60 e 940: fora da barra de cima, da legenda do post
  e dos botões da direita.
- O rosto não fica coberto por legenda empilhada com destaque (G18).

## 6. Opções e padrão (G6)
Desligado por padrão, e só entra com ordem explícita no pedido: música, efeitos sonoros (inclusive som de zoom),
mudança de fundo, coloração/color grading, preto e branco, texturas (VHS, glitch), recorte da pessoa, blur de fundo,
qualquer tratamento da gravação e imagem/vídeo de IA no lugar de câmera. O vídeo entra com o fundo e a cor reais.
- Fontes: as do modelo, poucas.
- Chamada para ação: só o comando fica fixo (comenta "EDIÇÃO"); o resto da fala segue na legenda.

## 7. Material (G7)
- O modo do vídeo (só materiais, livre ou indicado) é declarado pelo dono e vai no `cenas.json`.
- Em livre ou indicado: foto com licença aberta (`sistema/kit/buscar.py`), recorte (`sistema/kit/recortar.py`), geração
  (`sistema/kit/gerar.py`). Pessoa real só com foto real licenciada, nunca rosto gerado. Licença anotada no `ORIGEM.md`.
- O que só o dono tem (print, gravação de tela) vira pedido no `PEDIDO.md`, fora da peça. Prova nunca é inventada.

## 8. Conferir com prova
- Cada molde tem um checador (`scripts/`): falas cobertas, tempo, quebra de legenda, posições, zona segura, sincronia.
  Rodar até zerar antes de renderizar.
- Olhar os quadros (folha de 1 quadro por segundo) antes de dizer pronto.
- Áudio: a voz sai como foi gravada (G6). Com pedido de tratamento: -14 LUFS, pico ≤ -1 dBTP. Trilha só com ordem, ~16 dB abaixo da voz.

## 9. Confinado (G1 a G4)
- Tudo mora dentro do EditOS: `sistema/.venv/`, `sistema/node_modules/`, `sistema/tools/.cache/`, `sistema/.tmp/`, `sistema/oficina/`.
- Render com a trava (`sistema/tools/com-trava.sh`), `--concurrency=2`, um render pesado por vez.
