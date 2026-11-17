---
name: personagem
description: >
  Modelo de edição personagem do EditOS: canal sem rosto, um bonequinho (feijão creme) vive o que a narração diz, uma
  ilustração parada por frase sob luz dourada. Use quando pedirem "edita no personagem", "vídeo com bonequinho",
  "canal dark com personagem" ou narração ilustrada sem rosto.
---

# personagem: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no personagem, para qualquer narração. O arquivo
detalhado (números, cores, posições, opções, comandos) é `sistema/modelos/personagem/personagem.md`; o método comum de
todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/personagem/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude". Ele nunca é o roteiro, a sequência nem o catálogo de cenas do vídeo novo. Quem compra o
EditOS e narra sobre a padaria dele recebe o bonequinho vivendo a padaria, não a mesa de edição, os cartões e a porta
do vídeo do Claude com outra voz.

## Quando usar

- **Sim:** narração sem rosto (gravada ou gerada), tom de ensino ou de lista com tese, Short de 30 a 50 s ou vídeo longo,
  quando cada frase pode virar uma situação que alguém vive (acordar, pagar, esperar, escolher, abrir uma porta).
- **Não:** quando a pessoa precisa aparecer (vai para um modelo de rosto, como o `rosto-telas`); quando a fala é prova
  real atrás de prova, dado ou documento (o `documental-dados` faz melhor); quando não há voz nenhuma, só música: aí é a
  família A (curta animado, `personagem.md` §1 e §3), outro tipo de trabalho.

## A personalidade (vale para qualquer narração)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **Uma ilustração parada por frase, que encena a frase ao pé da letra.** Corte seco no início da palavra que abre a
   frase; a cena dura a frase inteira. *Por quê:* quem ouve "ele esperou" vê alguém esperando; a imagem confirma a voz
   sem distrair. *Sim:* sempre. *Não:* duas ideias na mesma cena, nem cena que muda no meio da frase.
2. **O feijão creme é quem vive tudo.** Um personagem sem nome, sem roupa de marca, com quem qualquer um se identifica
   (pele `#EDE6D6`, olhos de ponto, traço escuro). As poses dizem a emoção da frase (olhos, boca, braços). *Por quê:* o
   canal não tem apresentador; o bonequinho é o espelho de quem assiste. *Não:* desenhar uma pessoa real como se fosse
   ela.
3. **Escuro com luz dourada de cima.** Fundo preto, parede com o chão em linha, um ou mais fachos de luz dourada com
   poeira, grão de filme por cima. *Por quê:* é o que faz o vídeo ser reconhecido no primeiro segundo, mudo. *Não:*
   fundo claro, cor chapada, cenário colorido.
4. **Verde neon só no objeto-chave da frase.** Um objeto por cena acende em `#3dff8a` com brilho: o que a frase diz que
   importa. A palavra protagonista da legenda pode ir em verde quando a cena mostra a mesma coisa. *Por quê:* o olho vai
   direto ao que a frase diz. *Não:* dois objetos verdes, verde decorativo.
5. **Vermelho uma vez só, no risco da chamada.** Sem chamada na fala, não há vermelho no vídeo.
6. **Câmera parada; o movimento é um acontecimento pequeno preso a uma palavra.** A barra que enche no "100%", o cartão
   que acende no nome dele, a porta que se abre no "ver". Nada de zoom, pan, tremida ou brilho piscando.
7. **Metáforas simples e do dia a dia.** Porta (oportunidade), livro aceso (ensino), feixe de luz (o que importa),
   balança (escolha), ampulheta (espera), corrente ou pedra (fardo), semente (o que cresce sem aparecer), caminho que
   bifurca (decisão), espelho (autoexame). Use quando a frase é abstrata e não tem objeto próprio.
8. **A legenda conta a história.** Comic Neue 700, caixa alta, branca, um lugar só (terço de baixo, 1ª linha em y 1217,
   até 4 linhas), cada palavra estala no quadro em que é dita, o bloco dura a cena e some no corte. Toda palavra uma vez.
9. **O ritmo:** uma cena nova a cada 2 a 6 s (no aprovado, 11 cenas em 30 s, cerca de 18 cortes por minuto). Frase
   longa demais para 4 linhas vira duas cenas, cortadas na vírgula.
10. **O fecho:** a última cena vai até o fim e escurece nos últimos 15 quadros. Se a fala pede comentário, o comando
    fica fixo na caixa de comentário desenhada, com o risco vermelho sob a palavra.

## As peças (o que já existe em código)

Do molde `sistema/moldes/personagem/`:
- **A casa:** a cena `Base` (ele em pé sob o foco, olhando quem assiste; é o começo vazio), a `Legenda`, o comando
  `Fixo` (FIXO no plano), as `Previas` (PREVIAS, só com vídeos da própria pessoa), o grão, o escurecer do fim.
- **O kit da cena livre** (`src/kit.tsx`): `Fundo` (parede e chão), `Luz` (o facho dourado), `Poeira`, `Boneco` com
  `emPe(x, escala, {olhos, boca, olhar, mF/mT})`, `SENTADO`, `anima`/`mix` (poses-chave), `Mesa`, `Cama`, `Janela`,
  `Luminaria`, `Cadeira`, `Notebook`, `Cartao` (`apagado`, `giz`, `verde`, `ouro`), `Icone` (microfone, câmera,
  claquete, celular), `Avanco` (setas), as cores `C`, `NEON_VERDE`, `NEON_OURO`, e `marca('nome')`, `tw`, `E`, `lerp`.
- **As cenas do aprovado** (exemplos com o porquê, `personagem.md` §4): S1 a S11 (mesa de edição com a barra, três
  cartões, cartão verde com tipos de vídeo, cama com o celular, um cartão aceso entre cinco, parede das prévias, porta
  fechada, porta aberta para a sala de cartões, livro aceso, caixa de comentário) e N2 a N4. Uma delas só volta quando a
  fala nova diz a mesma coisa que fez ela existir: S4 (na cama rolando o feed) volta se a fala diz "se você está no
  Instagram agora"; S1 só se a fala é sobre editar este vídeo. As que mostram cartões de "modelos de edição" só entram
  se a fala fala de modelos de edição.

## A invenção (a cena que a frase pede e a casa não tem)

É o normal num tema novo. Para cada frase:
1. **Ache a situação.** Quem vive a frase e onde? (ele no caixa da padaria, ele diante de duas portas, ele com a conta
   na mão). Frase abstrata: uma das metáforas da regra 7.
2. **Ache o objeto-chave**, o que acende em verde (a conta, a porta certa, a semente).
3. **Ache o acontecimento** e a palavra que solta ele (a barra cai na "metade", a porta abre no "entra", a semente brota
   no "cresce"). Vira uma marca: `MARCAS = dict(metade=m('metade'))`.
4. **Desenhe com o kit** em `src/telas/<Nome>.tsx` da pasta do vídeo, no traço da casa (giz `#e9e6df` nos objetos,
   móveis `#2a2b31`), registre em `src/telas/index.ts` e ponha no plano: `cena(comp='Nome', de=w('palavra'))`.
   Texto dentro da cena, só o que é dito (G19); de preferência nenhum, a legenda já conta.

**Exemplo 1 (fala que o aprovado não tem):** *"Todo mês sobrava a conta de luz. Depois que eu troquei as lâmpadas,
ela caiu pela metade."* Cena 1: ele sentado à mesa, sob a luminária, com um papel de conta na mão (a conta em giz) e a
cara cansada. Cena 2: a mesma mesa, a conta acende em verde e a barra do valor encolhe de 1 para 0,5 na marca
"metade"; ele sorri. Por quê: "conta" (o objeto) e "metade" (o acontecimento). Nada de mesa de edição nem cartões.

**Exemplo 2:** *"Você tem duas escolhas: continuar igual ou começar hoje."* Uma cena: ele diante de um caminho que
bifurca, uma placa apagada à esquerda e a da direita acendendo em verde no "hoje". Por quê: "duas escolhas" (a
bifurcação é a metáfora de decisão da casa).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`.
2. **Toda cena tem dono:** no `plano.md`, a linha da cena diz o nome dela como está no plano (`Ouvido`, `Base`...) e a
   palavra dita entre aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/personagem/referencia/folha.jpg`: *mesmo modelo?* (preto e ouro, o feijão,
   o verde num objeto só, a legenda) **sim**; *mesmo vídeo?* (mesas, cartões, portas, mesma ordem) **não**.

## O caminho (os comandos estão no `personagem.md` §9)

1. Ler esta skill e o `personagem.md`. 2. A narração num vídeo preto e `tools/novo-video.py personagem <narração.mp4>
<AAAA-MM-DD-tema>`: o plano nasce vazio (uma Base por frase). 3. Ler a fala (`src/palavras.json`) antes de olhar o
exemplo de novo. 4. Plano de cenas no `plano.md`, uma linha por cena com a palavra que pediu ela. 5. Montar o bloco O
PLANO de `scripts/plano.py` e desenhar as cenas em `src/telas/`. 6. `scripts/conferir.py` (gera o `src/tempos.json` e
confere) até `0 erros`. 7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha lado a lado. 9. Render, finalizar, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Pôr a mesa de edição, os cartões de modelos, a porta da sala de cartões ou o livro aceso porque "o modelo tem": só
  com o mesmo porquê na fala.
- Escrever na tela o que não foi dito, inventar nome, número, marca ou interface (G10, G19, G25).
- Câmera que anda, zoom, cor clara de fundo, mais de um objeto verde, vermelho sem chamada.
- Desenhar pessoa real, ou cena nova dentro do molde (ela mora na pasta do vídeo).
- O nome do modelo na tela (G33). Som, música e efeitos só com ordem do dono (G6).
