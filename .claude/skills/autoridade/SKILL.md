---
name: autoridade
description: >
  Modelo de edição autoridade do EditOS: profissional falando com a câmera numa tomada só, legenda limpa em Poppins e
  telas só onde a fala pede. Use quando pedirem "edita no autoridade", "edita minha gravação no autoridade", "no estilo
  do dentista" ou um vídeo de especialista com câmera calma.
---

# autoridade: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no autoridade, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/autoridade/autoridade.md`; o método comum de todas as
skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/autoridade/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude". Ele nunca é o roteiro, a sequência nem o catálogo de telas do vídeo novo. A dentista que
grava sobre clareamento recebe um vídeo autoridade sobre clareamento, não o vídeo dos modelos de edição com outra pessoa.

## Quando usar

- **Sim:** um profissional falando para a câmera (9:16), numa tomada só, 15 s a 90 s, tom de quem sabe o assunto e
  ensina com calma. A pessoa é a prova: o vídeo transmite autoridade porque ela fica na tela a maior parte do tempo.
- **Não:** fala que pede uma tela a cada frase (o `rosto-telas` ou o `interface-encenada` fazem melhor); prova visual
  atrás de prova (`prova-print`); narração sem rosto.

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A pessoa com a legenda limpa é a base.** Gravação crua, fundo e cor reais (G6), Poppins 600 branca de 72 px no
   peito, sombra larga e suave, faixa escura bem leve atrás. *Por quê:* autoridade é a pessoa olhando para a câmera; a
   tela é visita. *Sim:* quase o vídeo todo (o checador cobra 50% ou mais; no molde, 94%). *Não:* tela "para dar ritmo".
2. **A câmera é calma.** Uma tomada, deriva lenta de menos de 1% por segundo saindo do ponto entre os olhos, no máximo 3
   ênfases no vídeo inteiro (o gancho, a virada, o fecho, que abre o quadro). Nunca corte seco de zoom. *Por quê:* quem
   sabe não pula; a calma é a voz do modelo. O flash branco de 4 quadros só na virada da fala ("mas", "e se").
3. **O título é a legenda com destaque.** No gancho e na frase de extremo destaque do tema: o texto normal no mesmo
   tamanho da legenda (72 px), a palavra-âncora em Poppins 800 até 2x, e UMA alternativa (DM Serif ou Great Vibes);
   entra palavra por palavra no instante em que é dita, no mesmo lugar (topo y 1110), até 3 linhas. *Não:* dois títulos
   seguidos sem a legenda entre eles; título sem motivo na fala.
4. **A tela cheia é tipografia com um herói.** Fundo escuro (degradê `#3B2D22` → `#16110D`) ou de cor (a cor do
   cenário), grade de pontos sutil, a frase dita entrando do desfoque em tamanhos misturados e **um objeto que faz o que
   a frase diz** embaixo. Uma ideia por tela, 1 a 2,5 s, aproximação de 1,2% por segundo. *Sim:* a frase de peso que
   descreve uma ação ou um objeto. *Não:* duas telas seguidas; tela de texto parado; gráfico sem pedido.
5. **A dividida guarda a pessoa embaixo.** O vídeo sempre na metade de baixo (olhos a 180 px do topo dela), o painel
   opaco em cima desde o 1º quadro, a linha de 4 px da cor de destaque na divisa, a legenda de 56 px com o pé em y 1500
   e caixa da cor nas palavras-chave. *Sim:* a fala cita algo para mostrar e a pessoa continua importante.
6. **Uma cor de destaque, tirada do cenário.** Os tons de `C` (`src/tema.ts`) saem da parede ou da roupa da gravação
   (no aprovado, caramelo da parede bege). Creme `#F4EFE6` e tinta `#1F160F` nos painéis. Nunca a paleta de quem edita.
7. **O vocabulário de movimento é um só.** A mola que cresce de 80% a 100%, a palavra que vem do desfoque de 4 px
   deslizando 10 px, o traço que se desenha em 0,3 s, o visto que se desenha e acende o item da vez, a barra que cresce.
   Nada de piscar, tremer, girar sem motivo, brilho ou contorno na letra (G16).
8. **A legenda conta a história.** Toda palavra dita uma vez, em ordem, em páginas de até 2 linhas e pelo menos 1,5 s,
   cortadas pelo sentido; só 2 posições no vídeo (o peito e o pé). O que um título, uma tela ou o fecho mostra, a
   legenda pula (`'#n'`).
9. **O fecho só quando a fala pede comentário.** O comando dito e o botão em pílula com a palavra entre aspas que acende
   na cor de destaque, com o quadro abrindo. *Não:* fala sem pedido termina na pessoa com a legenda.

## As peças (o que já existe em código)

Do molde `sistema/moldes/autoridade/`:
- **A casa** (`src/Reel.tsx`): `Fala` (a gravação com a deriva), `Legenda` (as 2 posições), `Titulo`, `TelaCheia` (os dois
  fundos, a tipografia `BlocoTela`), `Dividida` com `FundoPainel`, `Comenta` (o fecho), o flash, e as páginas feitas
  sozinhas (`paginasAuto`).
- **O kit da tela nova** (`src/ui.tsx`): `Palco` (cheia: o herói em x 100–980, y 1000–1600; dividida: o painel de cima),
  `Em`, `Entra`, `Cartao` (9:16 com a borda e, se quiser, o quadro da gravação), `Painel` (creme com cabeçalho tinta),
  `Texto` (as 4 vozes), `Pilula`, `Visto`, `Barra`, `Numero`, `Traco`, `Onda`; cores e movimento em `src/tema.ts`.
- **As peças do aprovado** (exemplos com o porquê, `autoridade.md` §4 e §10): os heróis `Cartoes` (vários vídeos lado a
  lado: "a diferença entre vários modelos"), `Barras` ("criei e melhorei"), `LinhaTempo` (a lâmina em "editar"),
  `Player` ("usar isso nos seus vídeos"); o `CELULAR` ("se você estiver no Instagram agora"), a `LISTA` ("outros
  modelos de edição"), as prévias. Uma delas só volta quando a fala nova diz a mesma coisa que fez ela existir lá.

## A invenção (a tela que a fala pede e a casa não tem)

É o normal num tema novo. Para a frase de peso do tema (G28), e só para ela:
1. **Ache o objeto.** Qual coisa concreta a frase nomeia ou faz? (o dente, a conta, a agenda, a onda do som).
2. **Ache o verbo.** O que acontece com ela? (clareia, cai pela metade, enche, ganha o visto, nasce).
3. **Escolha o modo.** Tela cheia (a frase inteira é o assunto: a tipografia dita em cima, o herói embaixo) ou dividida
   (a pessoa continua importante: o herói no painel de cima).
4. **Monte com o kit**, dentro do `<Palco>`: o objeto, o verbo como um dos movimentos da casa, cada um preso a uma palavra
   dita (`em: {chave: de(i)}`). Texto só o dito, por `textos: {chave: [i, 'palavras ditas']}` (o molde confere).
5. **Escreva `src/telas/<Nome>.tsx` na pasta do vídeo**, registre em `src/telas/index.ts` e ligue no plano: `heroi:
   'Nome'` numa linha de `TELAS`, ou `PAINEIS = [{de: T.x, heroi: 'Nome', em: {...}}];` com o trecho `[T.x, M.painel]`.

**Exemplo 1 (fala que o aprovado não tem):** *"O clareamento a laser deixa o dente até três tons mais branco."* Tela
cheia de cor: "três tons" grande em Poppins 800, "mais branco" em DM Serif; embaixo, um `Cartao` com três faixas de tom
que acendem uma a uma em "três" e uma `Barra` que vai ao branco em "branco". Por quê: "três tons" (o verbo é clarear).

**Exemplo 2:** *"Eu atendo às terças, quintas e sábados."* Dividida: um `Painel` creme, os três dias como itens com o
`Visto` caindo em cada palavra dita, o item da vez aceso na cor de destaque. A legenda conta, o painel mostra (o dia não
aparece escrito duas vezes ao mesmo tempo). Por quê: "terças, quintas e sábados" (uma lista dita item a item).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   acusa texto do aprovado que a fala nova não diz, plano parecido com o do aprovado e peça sem dono na fala. As peças da
   casa são as linhas `TITULOS = ...;`, `TELAS = ...;`, `PAINEIS = ...;`, `LISTA = ...;`, `CELULAR = ...;`, `CTA = ...;`
   e `FLASH = ...;` do bloco do plano (peça desligada = a linha não existe).
2. **Toda peça tem dono:** no `plano.md`, a linha da cena diz o nome da peça como está no plano (`TITULOS`, `TELAS`,
   `PAINEIS`, o herói novo...) e a palavra dita entre aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/autoridade/referencia/folha.jpg`: *mesmo modelo?* (Poppins, legenda no
   peito, câmera calma, fundo escuro ou de cor com grade de pontos, a cor do cenário) **sim**; *mesmo vídeo?* (mesmos
   objetos, textos, ordem) **não**.

## O caminho (os comandos estão no `autoridade.md` §9)

1. Ler esta skill e o `autoridade.md`. 2. `tools/novo-video.py autoridade <gravação> <AAAA-MM-DD-tema>`: o plano nasce
vazio (a pessoa com a legenda automática). 3. `scripts/palavras.py` (ancora as palavras na voz) e o `quadro.jpg`.
4. Ler a fala (`src/palavras_voz.json`) antes de olhar o exemplo de novo. 5. `plano.md`: uma linha por cena com a peça e
a palavra que pediu ela. 6. Montar o bloco do plano em `src/Reel.tsx` e as telas novas. 7. `node scripts/cobertura.mjs`
até zerar (a base acima de 50%, nenhuma tela seguida). 8. `tools/clone.py` até `SEM CLONE`; `tools/decupar.py --conferir`.
9. Quadros e folha lado a lado. 10. Render, mixagem, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco do plano de outro vídeo.
- Pôr os cartões, as barras, a linha do tempo, o celular, a lista de modelos ou o "Comenta EDIÇÃO" porque "o modelo
  tem": só com o mesmo porquê na fala.
- Escrever na tela o que não foi dito, inventar nome, número, marca ou interface (G10, G19, G25).
- Duas telas seguidas, tela por frase, a pessoa fora da tela na maior parte do vídeo.
- Corte seco de zoom, tratamento de cor, recorte ou desfoque de fundo sem ordem (G6).
- Contorno, brilho ou sombra colada na letra, texto fora de x 60–940 e y 250–1500.
- Desenhar fora do `<Palco>`, ou tela nova dentro do molde (ela mora na pasta do vídeo).
- O nome do modelo na tela (G33).
