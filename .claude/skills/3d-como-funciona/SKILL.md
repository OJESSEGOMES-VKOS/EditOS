---
name: 3d-como-funciona
description: Vídeo vertical em 3D (Blender) que explica como uma coisa funciona montando ela na frente de quem assiste, elo por elo, do gancho absurdo ao "Agora você tem um X". Use quando pedirem "como funciona X em 3D", "explica essa máquina em 3D", "vídeo 3D de curiosidade" ou "edita no 3d-como-funciona".
---

# 3d-como-funciona: a coisa se monta na frente de quem assiste

Esta skill segue o método de `sistema/JEITO.md` (o jeito, não o clone). O arquivo que manda é
`sistema/modelos/3d-como-funciona/3d-como-funciona.md`: leia inteiro antes do primeiro passo, com as correções do
dono (§6). As regras G de `REGRAS.md` §0 mandam acima dele (a G29, começo na gravação, não vale: não há pessoa
gravada). A base técnica é a skill `estudio-3d` (biblioteca `estudio3d`, regras de Blender 5.2) e o motor visual
padrão é a skill `low-poly-toon`.

## Quando usar

- A pessoa quer explicar uma máquina, uma obra, um corpo ou um sistema ("como funciona o freio ABS", "por que o
  avião não cai", "como a água chega na torneira").
- Não há gravação de rosto: é narração (voz por TTS ou gravada) sobre uma maquete 3D feita por código.
- Não serve pra filme de produto ou de app (isso é o `estudio-3d`) nem pra vídeo de rosto com telas (os modelos de
  edição com gravação).

## A personalidade (o que faz o vídeo ser deste modelo, com o porquê)

| Regra | Por quê | Quando sim / quando não |
|---|---|---|
| **A primeira frase põe VOCÊ fazendo uma coisa ingênua e absurda com o próprio corpo, com cara séria, e não diz o nome da coisa.** ("Se você abrir um guarda-chuva e pular do prédio, dá pra descer devagar.") | O que puxou o vídeo que mais rodou foi a cena absurda; o nome no começo entrega o fim e mata a curiosidade. | Sempre. O nome da coisa só aparece no fecho. |
| **Nos 5 a 7 primeiros segundos a cena ingênua acontece e dá errado de um jeito bizarro, em desenho animado** (o guarda-chuva vira do avesso, a banheira vira). | O gancho é visual: quem rola o feed entende sem som. | Cartoon: sem rosto, sem dor, sem sangue; a pessoa levanta e segue. |
| **Corrente de problema e solução, de 2 a 7 elos, cada um nascendo da solução anterior** ("agora segura a água. Mas quando você esvazia..."). Cada elo leva a ponte lógica pro seguinte. | A resposta de um elo abre a pergunta do próximo: é isso que prende até o fim. Elo solto vira lista. | Sempre. Explicação resumida foi reprovada ("nível de explicação 1/10"): o funcionamento completo, com detalhe, até 2 min. |
| **"Esse é o [nome]."** frase curta e sozinha, depois que a pessoa entendeu pra que a peça serve. A peça pisca em amarelo, o nome entra em amarelo no alto, inclinado. | O nome técnico é a recompensa do elo, não a porta de entrada. | Em cada elo que tem peça com nome. Sem termo técnico antes dele. |
| **A conclusão só no fim: "Agora você tem um X."** E tem que ser verdade (a tuneladora entrega um túnel, não um metrô). | O vídeo inteiro é o caminho até ela; cada decisão aparece justificada na tela antes. | Sempre. Em "você é um elefante" o fecho pode ser uma frase-tese. |
| **Fala de gente contando, 2ª pessoa, corrida.** Cada bloco amarrado no anterior; nada de frase seca nem chavão. 2,3 a 2,7 palavras/s. | Tabela lida em voz alta soa robótica; foi reprovado assim. | A tabela de elos é o esqueleto; a narração é escrita por cima dela e lida em voz alta antes da voz. |
| **Maquete em corte que mostra o escondido** (casco sem a metade da frente, parede tirada, solo em camadas). | O que interessa tem que estar à vista; transparência embola. | Peça dentro de outra exige o corte de verdade, sem tampa no corte. Peça pequena (câmara, válvula) vira maquete isolada grande, de lado, e a câmera mergulha até ela. |
| **A câmera conta devagar e a coisa se monta e quebra na frente dela.** A cada elo, um ponto de vista novo (corte seco ou viagem). | O rosto da cena é o objeto: cada plano mostra a peça da fala inteira e legível. | Objeto rápido: câmera que segue (`K.segue`). Objeto comprido em vídeo em pé: plano na diagonal. |
| **Lógica física sem exceção:** nada teletransporta, pisca, anda de costas, flutua sem apoio ou explode sem motivo; falha primeiro entorta ou racha, depois cede, e cai com a gravidade até um chão. | Foram os erros que derrubaram a primeira leva ("erros lógicos tão básicos"). | Sempre. A checagem automática cobra boa parte; o resto é o olho do diretor. |
| **Gente, bicho, árvore, carro, casa e móvel vêm de modelo pronto CC0 (`kit3d-assets/`); só o mecanismo explicado é feito por código.** | Boneco de primitivo foi reprovado; o mecanismo por código é o que se explica com precisão. | Escolha olhando `kit3d-assets/folhas/`. Falta o modelo? `tools/baixar-assets-3d.py` ou o `kit3d-assets/baixar.py` (busca nova, só CC0). |
| **Texto na tela: uma palavra por vez** (centro, ~72% da altura, branca com contorno; o nome em amarelo) e o rótulo amarelo no alto. Nada mais. | O texto acompanha a fala sem competir com a maquete. | Sem título, número, @ ou selo. |
| **Som só com causa na tela, no instante físico** (pop na peça que entra, estalo no problema, brilho no nome). Final em -14 LUFS. | O swish alto e sem motivo foi reprovado. | Trilha só com ordem do dono (G6). |

## As peças (o que já existe e serve a qualquer tema)

- **`sistema/moldes/3d-como-funciona/blender/kit3d.py` (o `K`)**: `Fala` (frase → tempo; `'frase#2'` pra 2ª vez),
  `cena`, `mundo_dia`, `mat`, `bloco`/`cilindro`/`esfera`/`barra`/`grupo`, `entra` (mola por cima do movimento),
  `acende` (o nome técnico), `seta`, `tremer`, `queda`/`t_impacto` (queda com piso, 1 g), `pessoa`/`anda`/
  `troca_acao`/`na_cabeca`/`na_osso` (Idle, Walk, Run, Clapping, Sitting, Jump), `asset` (modelo CC0), `veiculo`
  (o nariz), `camera` (pontos no tempo, viagem ou `'corte'`), `segue`, `esconde`/`esconde_no_corte`/`some`,
  `apoio`, `foco`, `simetria`, `sem_corpo`, `sem_tampas`, `encolhe`/`sai`, `evento` e o portão `rodar`.
- **`blender/checar.py`**: a conferência sem render (salto, z-fighting, atravessar, pessoa de costas, pé fora do
  chão, foco fora do quadro, roda que parece girar pra trás, tampa no corte, apoio, sumiço, nariz). `K.rodar`
  recusa o render se ela não estiver LIMPA pra versão exata da cena.
- **`blender/cena_vazia.py`**: o começo vazio de todo vídeo novo (mundo, câmera aberta, portão; nenhum elo).
- **`ferramentas/`**: `alinhar.py` (roteiro + tempo das palavras), `sons.py` (gera os efeitos em `public/sons/`;
  rode uma vez se a pasta estiver vazia), `montar.py`, `finalizar.py` (Remotion, -14 LUFS, conferência).
- **`src/Explicativo.tsx`**: a montagem (filme, palavra por vez, rótulo amarelo, voz, sons).
- **Os dois motores visuais:** a maquete clara (`K.mundo_dia`, o padrão aprovado em 2026-10-22) e o low poly toon
  (skill `low-poly-toon`, o padrão desde 2026-11-04, ~0,5 s por quadro). No toon, a cor vem de `LP.mat` e o nome
  técnico acende com `LP.brilha` (o `K.acende` só funciona na maquete clara).
- **A biblioteca `estudio3d`** (skill `estudio-3d`): materiais, luz, curvas, câmera, medidor.

O que é **só dos exemplos** (submarino, foguete, hidrelétrica e os que vieram depois): o barril jogado no mar, os
tanques de lastro, a contagem de altitude pelas nuvens, a represa, cada lugar, cada fala, a ordem dos elos e o tempo
de cada um. Nada disso volta num vídeo novo, a não ser que a fala nova diga a mesma coisa que fez aquilo existir.

## A invenção (como explicar um mecanismo que nenhum exemplo tem)

Para cada elo, responda em uma linha antes de escrever código: **o que a peça faz, onde ela fica na coisa real, pra
onde cada coisa anda e como a falha acontece de verdade**. Pesquise a forma real (estrutura, máquina, veículo) e
anote a fonte. A cena nasce dessas respostas, nunca de um exemplo.

**Exemplo 1: a descarga do vaso sanitário** (assunto sem nenhum exemplo parecido).
- Gancho: "Se você jogar um balde de água no vaso, tudo some pelo cano." Cena: a pessoa CC0 (`bathroom`, `toilet`)
  vira o balde, a água sobe, transborda no chão e ela escorrega em desenho animado.
- Elos: (1) o cano liga direto no esgoto, então o cheiro sobe: linhas onduladas amarelas saindo do ralo. (2) Você
  dobra o cano em S, a curva guarda água e tampa o cheiro: corte lateral da louça mostrando o S cheio. "Esse é o
  sifão." (3) Mas balde toda vez cansa: uma caixa atrás guarda a água. (4) Mas a caixa enche e transborda: uma boia
  sobe com o nível e fecha a entrada. "Essa é a boia." (5) Ao puxar, a tampa do fundo abre, a água desce de uma vez
  e o S cheio puxa tudo pelo efeito sifão. "Agora você tem uma descarga."
- O que é invenção: a louça em corte (o S é feito por código: é o mecanismo), a água como `K.sem_corpo` que desce
  pela gravidade e entra onde deve, a boia presa num braço que gira no pivô real. Nenhuma peça dos exemplos.

**Exemplo 2: a caneta esferográfica** (mecanismo pequeno, câmera macro).
- Gancho: "Se você molhar um palito na tinta, dá pra escrever." Cena: o palito escreve meia letra e borra o papel
  inteiro.
- Elos: (1) um tubo guarda a tinta, mas ela escorre toda de uma vez: poça. (2) Na ponta, uma bolinha de metal tampa
  o tubo e só deixa sair a tinta que ela leva ao rolar: maquete isolada da ponta, gigante, de lado, a esfera girando
  no sentido em que o papel empurra. "Essa é a esfera." (3) Mas a tinta precisa descer até a bolinha: o furinho no
  corpo deixa o ar entrar no lugar da tinta que saiu. "Esse é o respiro." "Agora você tem uma caneta."
- O que é invenção: a escala (a câmera mergulha da caneta inteira até a ponta ampliada, regra da peça pequena), a
  tinta como fluxo contínuo de um caminho só, a esfera com giro coerente (menos de ~40% do passo por quadro). A mão
  e a mesa vêm de modelo pronto ou ficam fora do quadro.

## O teste do clone (obrigatório antes do render)

1. **Toda peça e todo plano têm dono na fala:** cada bloco do `cena.py` cita a palavra do roteiro que o pediu. Bloco
   sem palavra sai.
2. **Lado a lado com um exemplo** (folha do vídeo novo ao lado da de um aprovado): *é o mesmo modelo?* (maquete em
   corte, palavra por vez, nome amarelo, câmera que conta devagar, lógica física) tem que ser **sim**. *É o mesmo
   vídeo?* (mesmo lugar, mesma sequência de elos, mesmo gancho, mesma câmera em cada elo) tem que ser **não**.
3. Se o EditOS tiver `tools/clone.py`, rode `tools/clone.py oficina/<pasta>` e só siga com `SEM CLONE`.
4. Um assunto novo ganha cenas e mecanismo próprios: os beats do submarino (descer, encher tanque, subir) não viram
   receita de "como funciona o elevador".

## O caminho (comandos de dentro de `sistema/`, todo pesado pela trava)

1. **Roteiro** em `oficina/AAAA-MM-DD-3d-tema/roteiro.md`: a tabela de elos (fala | o que a cena mostra, com câmera,
   cor, seta e som | a peça que entra | o problema visual | o nome | **como é na realidade**, com fonte). Portão 1:
   a coluna da realidade preenchida antes de qualquer cena. A fala corrida vai em `roteiro.txt` (até ~300 palavras).
2. **Voz numa geração só, o texto inteiro** (`kit/voz_gemini.py roteiro.txt voz.wav`, ou a gravação do dono).
   Longa demais: `atempo` na mesma gravação ou enxugue e gere tudo de novo; nunca emende tomadas. Confira com
   `tools/transcribe.py voz.wav tr --language pt`, depois `moldes/3d-como-funciona/ferramentas/alinhar.py <pasta>`.
3. **Cena:** `cp moldes/3d-como-funciona/blender/cena_vazia.py oficina/<pasta>/cena.py`; escolha o motor (`MOTOR`);
   construa elo por elo. `B="$(.venv/Scripts/python.exe tools/blender.py)"`, então
   `QUEM=3d sh tools/com-trava.sh "$B" -b --factory-startup -P oficina/<pasta>/cena.py -- previa 2 7 20`.
4. **Portão 2, antes do render:** `-- checar` até `RESULTADO: LIMPA`; cada junta mecânica conferida de frente, de
   lado e de cima (≥ 480 px); prévias por elo em resolução cheia, olhadas quadro a quadro.
5. **Render:** `-- eventos`, depois `-- render` (EEVEE, PNG, 30 qps). Avise o tempo antes (meça um quadro).
6. **Montagem:** `ferramentas/sons.py` uma vez se `public/sons/` estiver vazia; `ferramentas/finalizar.py <pasta>`.
7. **Portão 3, depois do render:** revisão de verificador (todo defeito com tempo e causa) e de diretor (faz sentido
   físico? o elo está bem encenado?), em folhas de até 24 quadros por imagem num tamanho em que o defeito aparece,
   mais -14 LUFS. Erro grave volta pra cena.
8. **Entrega:** `.venv/Scripts/python.exe tools/entregar.py oficina/<pasta> out/<pasta>.mp4`.

## Nunca

- Nunca começar de um `cena.py` de outro vídeo: o começo é o `cena_vazia.py`.
- Nunca o nome da coisa na primeira frase, nem a conclusão antes do fim.
- Nunca fato sem fonte: curiosidade errada derruba o canal. Na dúvida, a frase sai.
- Nunca boneco de primitivo, rosto, sangue ou dor real.
- Nunca peça que some sem motivo, carga sem apoio, superfície no mesmo plano de outra, queda sem chão.
- Nunca render sem checagem limpa; nunca "pronto" sem as três conferências.
- Nunca som sem causa na tela, nem trilha, cor ou tratamento sem ordem (G6).
