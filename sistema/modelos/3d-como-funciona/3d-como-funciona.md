# 3d-como-funciona

Vídeo vertical (9:16) de 60 a 110 s que explica como uma coisa funciona **construindo ela na frente de quem
assiste**, em 3D estilizado feito no Blender por código, com narração animada e uma palavra por vez na tela.
Nasceu em 2026-10-20 de 12 referências de Instagram (`referencias/`, origem em `referencias/ORIGEM.md`), medidas em
`analise/` e transcritas em `roteiros/`.

Regras gerais: `REGRAS.md` §0 (G1–G35, reescritas pelo dono em 2026-11-05) mandam acima deste arquivo. A G29 (começo na gravação original) não se aplica: este modelo não tem gravação de pessoa.

Regra do dono, que vale pra este modelo inteiro: **"Você não vai copiar, você vai aprender a forma de utilização para
usar também de outras formas."** O que está aqui é o princípio de cada recurso; os temas, as cenas e as frases nascem
de cada vídeo novo.

## 1. O roteiro (a espinha do modelo)

### A corrente de problema e solução
Todas as 12 referências seguem a mesma corrente, de 2 a 7 elos:

1. **Começo ingênuo:** "Se você [faz o mais simples possível], já tem [a coisa]." A pessoa entende em 3 s e se
   reconhece ("eu faria isso").
2. **Problema concreto:** "Mas [o que dá errado, com imagem física]." Fede, racha, despenca, entorta, derrete.
3. **Solução:** "Então você [coloca/troca/liga] [peça descrita pelo que faz, não pelo nome]."
4. **O nome técnico:** "**Esse é o [nome].**" Frase curta, sozinha. É a recompensa do elo: a pessoa aprende o nome
   depois de entender pra que serve.
5. Volta ao 2: **cada problema nasce da solução anterior** ("agora ela segura a água. Mas quando você esvazia...").
   É isso que prende: a pergunta seguinte é aberta pela resposta anterior.
6. **Fecho:** "Parabéns! Você construiu [a coisa]." (curto, comemorativo; a câmera mostra o objeto inteiro).

Variações vistas e válidas:
- **Você é o objeto** (ref09): "Você é um elefante. Você pesa 6 toneladas..." e a corrente vira "por isso você tem...".
  Serve pra animal, corpo humano, máquina com "personalidade".
- **Respiro de curiosidade** no meio: "Parece estranho, mas quem resolve isso são bactérias." Uma vez por vídeo, na
  virada mais surpreendente.
- **Elo histórico curto** (só se for verdade com fonte): um nome, um ano, um gesto marcante.
- Fecho alternativo sem "parabéns" quando o vídeo é "você é": uma frase-tese ("Ele tem um corpo inteiro construído
  pra aguentar ser grande.").

### Regras de escrita
- **Fala de gente contando, não tabela lida (correção do dono, 2026-11-04):** "está muito robótico, frase genéricas
  chavões, sem conexões... precisa ser fluído como uma fala". Cada bloco abre amarrado no anterior ("Só que a casca
  fecha tudo", "Mas ainda falta explicar uma coisa"); nada de frase solta e seca ("Dá pra ver, sim."); respiros de
  conversa ("Guarda esse detalhe", "aqui vem a parte estranha"). A tabela de elos é o esqueleto; a narração é escrita
  corrida por cima dela e lida em voz alta antes de ir pra voz. Referência aprovada: `oficina/2026-11-04-3d-pipoca/roteiro.txt`.
- **2ª pessoa sempre** ("você cava", "você coloca"). A pessoa está construindo, não assistindo uma aula.
- Frases curtas e faladas, sem termo técnico antes do "Esse é o...". Números só os que dão escala ("seis toneladas,
  o peso de um caminhão"), com fonte.
- Ritmo medido: 2,3 a 2,7 palavras/s; de 180 a 270 palavras pra 70 a 100 s.
- **Fato confere antes de gravar.** Curiosidade errada derruba o canal. Na dúvida, a frase sai.
- CTA opcional depois do "Parabéns" (as refs de quem vende o serviço usam "Comenta VÍDEO..."). Em canal de
  curiosidade, o fecho é o "Parabéns" e acabou.

## 2. A imagem (receita medida nas folhas de `analise/`)

- **Mundo:** 3D estilizado e limpo, formas simples com cantos arredondados, cores reais mas saturadas e claras
  (céu azul claro, grama verde viva, madeira quente, concreto cinza claro), luz de dia suave com sombra macia.
  Nada fotorreal, nada "brinquedo plástico": é maquete bonita.
- **Corte pra mostrar o escondido:** solo em corte lateral (camadas de terra), parede sem a face da frente, casco
  transparente ou aberto. O que interessa sempre está à vista.
- **A câmera conta devagar:** passa a maior parte do tempo parada ou deslizando lento (órbita, aproximação), e a
  **coisa se monta e quebra na frente dela**. A cada elo novo a câmera muda de ponto de vista (corte seco ou viagem
  contínua até o detalhe). Cortes por vídeo: de 2 a 35 (mediana dos intervalos de 0,6 a 26 s); o que manda é o elo.
- **Peça nova entra com mola** (cresce, desce ou desliza até o lugar), no instante em que a fala diz o que ela faz.
- **O problema tem imagem física:** seta grossa vermelho-alaranjada pra força e peso (desce no tempo da palavra),
  linhas onduladas amarelas pra cheiro e calor, cor mudando pra temperatura (cinza → laranja → vermelho brilhante),
  peça entortando ou rachando, faíscas, água vazando, objeto despencando.
- **O nome técnico acende:** na hora do "Esse é o [nome]", a peça nomeada pisca em amarelo-claro emissivo (as outras
  ficam como estão), o nome entra em amarelo no alto do quadro, levemente inclinado, e some quando começa o próximo
  "Mas".
- **Fecho:** a câmera abre e gira devagar mostrando a coisa inteira montada.

## 3. Texto na tela
- **Uma palavra por vez**, no centro, um pouco abaixo do meio (y ≈ 72% da altura), branca, fonte arredondada e
  pesada, contorno escuro fino + sombra. Entra junto com a palavra falada. Tamanho pequeno: ~6% da largura por letra.
- Palavra do **nome técnico** (e as do nome) em **amarelo** no lugar do branco.
- **Rótulo do nome técnico** no alto (y ≈ 15%), amarelo com contorno escuro, girado ~-3°, maior que a palavra
  central; entra com pop no "Esse é", fica até o próximo "Mas".
- Nada mais de texto. Sem título, sem número na tela, sem @.

## 4. Som
- Narração masculina ou feminina animada, clara, sorrindo na voz; a energia sobe no "Mas" e assenta no "Esse é".
- (som: confirmar com o dono se continua padrão, G6) Trilha leve e alegre por baixo (chão medido nas refs: -28 a -39 dB), sem disputar com a voz.
- SFX discretos, só onde há um evento físico visível naquele instante: pop na peça que entra, rangido ou estalo no
  problema, sininho ou brilho no nome técnico, aplauso curto ou "ding" no "Parabéns". Nada de som preso a palavra do
  roteiro nem de "whoosh" de câmera: foi esse o swish alto e sem sentido que o dono reprovou em 2026-10-21.
- Final em -14 LUFS, pico até -1,5 dBTP.

## 5. Como produzir (o caminho no EditOS)
O passo a passo com os comandos está em `moldes/3d-como-funciona/LEIA.md`.

**O padrão aprovado pelo dono (2026-10-22, "ficaram extraordinários"):** submarino, foguete e hidrelétrica, com os
finais em `exemplos/`. Vídeo novo parte do código de um deles: `oficina/2026-10-20-3d-submarino/cena.py`
(veículo, corte de casco, tripulação), `oficina/2026-10-21-3d-foguete/cena.py` (objeto rápido com câmera que segue,
foco por plano) ou `oficina/2026-10-21-3d-hidreletrica/cena.py` (fluxo de água pelo caminho real, mecanismo ligado).
A régua de qualidade é a desses três: um vídeo novo tem a mesma identidade (a cara, o porquê e o como), sem copiar as cenas (G30).

Lições do primeiro par (valem pra todo vídeo do modelo):
- **O rosto da cena é o objeto:** cada plano tem que mostrar a peça da fala inteira e legível. Câmera longe demais
  (fora do prédio) ou perto demais (colada na parede) mata o elo. Objeto comprido em vídeo em pé: plano na diagonal.
- **Corte de maquete mostra o escondido:** casco, parede ou solo sem a face da frente. Peça que precisa aparecer
  dentro de outra exige o corte de verdade (geometria sem a metade da frente), não transparência.
- **Gancho com assunto no quadro 0:** a coisa ingênua do "Se você..." já está na tela no 1º quadro.
- **Problema sem gente sofrendo:** a cabine despenca vazia; quem corre perigo se afasta.
- **Câmera mira o foco que anda junto** (o rig `estudio3d` mira um vazio de foco: ele tem que acompanhar o alvo).
- **Objeto que anda rápido: `K.segue()`** (pontos de câmera a cada 0,4 s mirando o objeto). E a velocidade é de
  maquete, não real: foguete sobe a ~4 m/s e a altitude é contada pelo céu e pelas nuvens passando.
- **Nada de boneco de primitivo** (correção do dono, 2026-10-21): pessoas, árvores, peixes, carros, barcos, casas e
  móveis vêm de modelos CC0 (`kit3d-assets/`, baixados pelo `baixar.py` do Poly Pizza, origem em `ORIGEM.md`).
  `K.pessoa()` (esqueleto + animação: Idle, Walk, Run, Clapping, Sitting, Jump), `K.troca_acao()`, `K.cartola()`,
  `K.asset()`. Escolha olhando a folha de miniaturas (`kit3d-assets/folhas/`). Só a peça explicada (o mecanismo) é
  modelada por código.
- **Vista de trás/dentro: esconda o que tapa** (parede da cozinha, porta aberta, asa da frente, faixa por cima do
  corte) só no intervalo daquela vista, com `hide_render` em degrau.
1. **Roteiro** pela corrente da seção 1, fatos conferidos, passado pelo `/humanizer`. Cada elo vira uma linha de uma
   tabela: fala | o que a cena mostra | a peça que entra | o problema visual | o nome.
2. **Voz:** narração por TTS (padrão: Gemini 2.5 Pro TTS pela kie.ai, voz masculina animada; ver `kit/voz_gemini.py`)
   ou gravação do dono. As palavras com tempo saem do Whisper (`tools/transcribe.py`).
   **A voz sai numa geração só, o texto inteiro (correção do dono, 2026-11-04):** gerar em pedaços muda o timbre e
   parece vozes diferentes. Ficou longa? Acelere a mesma gravação com `atempo` (a pipoca usou 1,2x, aprovada) ou
   enxugue o texto e gere tudo de novo, inteiro. Nunca emende tomadas.
3. **Cena 3D:** um script Blender por vídeo em `oficina/<pasta>/cena.py`, com a biblioteca `estudio3d`
   (`.claude/skills/estudio-3d/scripts/`). Cada elo é preso aos tempos das palavras: a peça entra na palavra que diz
   o que ela faz; o problema acontece na palavra do problema; o nome acende no "Esse é". Render EEVEE em PNG
   (1080x1920, 30 qps).
   **Motor padrão desde 2026-11-04 (decisão do dono, "pode definir isso tudo como nosso motor padrão"):** low poly
   chapado com contorno, o V2 do teste `oficina/2026-11-04-teste-lowpoly/` (tempos em `RESULTADO.md`):
   - EEVEE toon: Shader to RGB em 3 degraus (sombra roxa, meio-tom, luz quente), sol de sombra dura, névoa pela
     distância, 4 amostras; sem motion blur, AO, raytracing ou volume. Contorno por casco invertido.
   - **Todos os quadros, 30 qps fluido** (o dono escolheu o fluido: "é mais gostoso de assistir"). O "de dois em dois"
     só como efeito pedido de propósito.
   - **Sombra:** sem as manchas grandes das copas no chão; fica a sombra de contato embaixo da pessoa e dos objetos
     (é ela que põe o pé no chão).
   - Cenário, pessoa padrão e objetos recorrentes do mentedetransbordo vêm do kit da página
     (`kit3d/mentedetransbordo_kit.py`): a mesma região (mata na borda de uma cidadezinha) vídeo após vídeo. Peça nova
     que se repete entra no kit; o `cena.py` do vídeo cuida das poses, da história e das câmeras.
   - Pessoa sem decimate (quebra a mão); cenário e objetos passam pelo decimate.
   - Conta de referência: ~0,5 s por quadro, ~24 min de render pra 90 s na RTX 3050, local (a Fox fica pra exceção).
   - Pendências do estilo, a resolver no 1º vídeo nele: dedos fechando no objeto segurado, contorno que some nas
     árvores longe, copas longe oliva pela névoa laranja, e o `K.rodar`/checagem ligados ao kit (o teste renderizou
     por fora, sem checagem).
4. **Montagem:** Remotion (`moldes/3d-como-funciona/`): os quadros do Blender, a palavra por vez, o rótulo amarelo,
   a voz, a trilha e os SFX.
5. **Conferência, em 3 portões.** O vídeo só chega ao dono depois de passar pelos três, nesta ordem:
   - **Antes de escrever a cena:** a tabela de elos ganha a coluna "como é na realidade". Onde ficam as peças, pra
     onde cada coisa anda e como a falha acontece de verdade. Estrutura, máquina ou veículo que o vídeo mostra tem a
     forma real pesquisada, não a imaginada.
   - **Antes do render:** a checagem automática da cena (`-- checar`) tem que sair limpa: sem salto, sem
     z-fighting, sem atravessar, frente na direção do movimento, pés no chão. Depois vêm as prévias em baixa dos
     trechos de movimento, olhadas quadro a quadro.
   - **Depois do render:** a revisão de verificador e diretor de `revisao/COMO-REVISAR.md`, com o relatório em
     `revisao/<pasta>.md`, a folha de 1 quadro por segundo e -14 LUFS. Erro grave volta pra cena.

## 6. Correções do dono

### 2026-10-21: a primeira leva reprovada por erro de lógica
Palavra do dono: "são erros lógicos, achei que no quesito lógica você não cometeria erros tão básicos". E: "não
quero precisar de dar essas correções em todo vídeo novo". Cada item abaixo vale pra todo vídeo do modelo.

- **Nada teletransporta.** Peça que entra com mola e também se move (cabine, contrapeso, seta que acompanha) não
  pode ter a entrada brigando com o movimento pelo mesmo canal. A entrada é uma camada por cima do movimento
  (`delta_location` e `delta_scale` no `K.entra`). A checagem acusa qualquer salto de posição entre dois quadros.
- **Nunca duas superfícies no mesmo plano.** Grama sobre terra, base de torre sobre tabuleiro, piso sobre laje:
  ou uma fica pelo menos 5 mm acima, ou a de baixo é cortada. Superfícies no mesmo plano piscam alternando uma e
  a outra (z-fighting).
- **Pessoa:** pés no chão, a frente pra onde anda, a animação de andar só com deslocamento e no passo certo. Nunca
  andar de costas, deslizar parada nem flutuar.
- **Veículo, barco e avião:** a frente sempre na direção do movimento, na pista ou no canal, sem atravessar nada.
  Todo asset tem a "frente" registrada.
- **Estrutura com a forma real.** A torre de ponte não fica no meio da pista, o cabo desce em curva certa de torre
  a torre, e a escala de carro, navio e pessoa é coerente com a obra. Na dúvida, pesquise como a coisa real é.
- **Escala real em metros, decidida antes da cena:** faixa de carro com 3,5 m, vão livre pra navio passar, pé-direito
  de 3 m, pessoa com 1,72 m. A maquete pode ser estilizada, mas as proporções são as da obra real. Estiloso não
  vira errado.
- **Nada fica no ar sem apoio:** se o pilar sai, o que ele segurava cai ou já está seguro por outra peça visível.
- **Nada some sem motivo, e o que foi escondido volta** (correção do dono, 2026-10-21, no elevador): no corte pro
  trecho do Otis os cabos de aço foram escondidos e nunca voltaram. Do 54 s ao "Parabéns" a cabine ficou pendurada
  no nada. Esconder pra uma vista ou pra outro trecho é sempre temporário: o objeto volta quando a cena volta. Só some
  de vez o que tem motivo físico na tela, como quebrar, ser trocado ou cair fora. Antes de entregar, cada peça que
  carrega ou segura outra (cabo, corda, pilar, suporte, tubo) aparece em todos os planos em que a carga aparece.
- **Falha com física real.** Primeiro entorta ou racha, depois cede, e o que cai cai com a gravidade. Nada explode
  sem motivo. A "ponte envergando" foi aprovada; a "ponte explodindo", reprovada.
- **Som só com causa na tela** (seção 4), e no instante físico, não no da palavra. O baque toca quando a peça bate,
  calculado pelo movimento.
- **Corte limpo:** nenhum quadro borrado ou com clarão no corte. Motion blur não pode pegar o salto da câmera.
- **Queda tem chão:** todo movimento de queda para em alguma coisa. Nada afunda pelo piso. Quem perde a corda não
  continua acompanhando a outra ponta.
- **Acessório no lugar:** cartola e chapéu pousam no topo real da cabeça, medido na pose, não no esqueleto
  parado.
- **Palavra repetida no roteiro:** a peça presa a ela aponta qual das vezes é (`'palavra#2'` ou `apos=`). A
  biblioteca recusa a frase ambígua.
- **Mecanismo ligado de verdade:** o fluxo (água, gás, corrente) sai de onde deve e entra onde deve. O tubo encosta na
  peça, a roda gira no sentido em que é empurrada, e o que gira vai devagar o bastante pra não parecer andar pra trás
  (menos de ~40% do passo entre pás por quadro).
- **O foco do plano nunca sai do quadro**, nem no último quadro antes do corte. Objeto que anda tem câmera que anda
  junto.
- **O que se solta sai inteiro:** estágio, peça ou pedaço se move como um corpo só, girando em volta do centro do
  conjunto, e não peça por peça. Destroço que já cumpriu o papel sai de cena, em vez de ficar jogado no plano final.
- **Nada de plano liso no lugar de coisa:** mar de nuvens, mar, céu, chão e montanha têm forma (nuvens fofas com
  sombra, ondas, relevo), nunca uma superfície cinza lisa com horizonte duro. E o herói tem contraste com o fundo:
  avião branco contra céu azul ou contra nuvem sombreada, não contra branco. Achado no avião (2026-10-22), antes
  de chegar ao dono.
- **Corte de maquete sem tampa:** um casco ou cilindro cortado ao meio perde as tampas. Disco cheio cortando o
  interior é defeito.

### 2026-10-27: o gancho é a cena ingênua dando errado, e a conclusão fica pro fim
Palavra do dono, depois do submarino viralizar ("o começo ficou engraçado"): comparando os nove prontos, o que
puxou o submarino foi a primeira frase pôr VOCÊ fazendo uma coisa absurda com o próprio corpo ("entrar num barril
de aço, fechar a tampa e jogar no mar"). Vale pra todo vídeo novo do modelo:

- **A primeira frase é uma ação ingênua com o seu corpo, dita com cara séria, e NÃO diz o nome da coisa.** Nada de
  "já tem um X" no começo. Ex.: "Se você abrir um guarda-chuva e pular do prédio, dá pra descer devagar."
- **Gancho visual nos 5 a 7 primeiros segundos: a cena ingênua acontece de verdade e dá errado de um jeito
  bizarro** (o guarda-chuva vira do avesso; a pessoa no telhado toma o raio e acende feito lâmpada; a banheira
  vira). Cartoon: sem rosto, sem dor, sem sangue; a pessoa levanta e segue. Esse gancho vale acima da regra
  "problema sem gente sofrendo", desde que seja desenho animado.
- **Cada elo é o complemento do anterior, e a conclusão vem só no fim: "Agora você tem um X."** O vídeo inteiro
  é o caminho até a conclusão; por isso cada decisão aparece justificada na tela. O "Esse é o [nome]" das peças
  continua em cada elo; o fecho muda de "Parabéns! Você construiu" pra "Agora você tem".
- **Mais detalhe, não mais tempo:** o roteiro.md ganha o gancho visual descrito quadro a quadro e a coluna "o que
  a cena mostra" com câmera, cor, seta e som de cada elo. A fala continua no teto de 2 min (~300 palavras).
- Primeiros cinco nessa régua: paraquedas, chuveiro elétrico, airbag, para-raios, navio
  (`projetos/operacao-dark-nuvem/roteiros/2026-10-28-3d-*/`).
