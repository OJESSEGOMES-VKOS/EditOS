---
name: interface-encenada
description: >
  Modelo interface-encenada do EditOS: rosto cheio e, no trecho que pede, uma interface de verdade (creme e terracota)
  encenando a frase. Use com "edita no interface-encenada", "edita minha gravação no interface-encenada", "no
  modelodinamico01" ou vídeo falado com telas de app.
---

# interface-encenada: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no interface-encenada, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/interface-encenada/interface-encenada.md`; o método
comum de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/interface-encenada/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a
do "100% editado pelo Claude", com a pasta de modelos, o catálogo e o prompt. Ele nunca é o roteiro, a sequência nem o
catálogo de telas do vídeo novo. Quem grava sobre a planilha da loja dele recebe a planilha da loja encenada, não as
pastas de modelos do aprovado com outra pessoa.

## Quando usar

- **Sim:** uma pessoa falando para a câmera (9:16), de 15 s a 90 s, quando algumas frases descrevem um ato numa tela
  (abrir, digitar, mandar, escolher, arrastar, receber, comentar): a interface de verdade mostra o ato no mesmo segundo.
- **Não:** fala sem nenhum ato de tela (vai para um modelo de rosto, como o `pregacao`, ou para o `rosto-telas`, que
  encena objetos em papel); vídeo que é prova atrás de prova (o `prova-print`); narração sem rosto.

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **O rosto cheio é a base.** A gravação crua, fundo real, sem zoom, a legenda no peito. *Por quê:* quem fala é a
   pessoa; a interface é a prova do ato. *Sim:* o gancho (sempre, G29), opinião, emoção, frase sem ato de tela. *Medida:*
   a maior parte do vídeo (o molde aprovado tem 70%; o conferidor reprova abaixo de 50%). O punch-in de 1,2 só na virada
   ("mas", "só que").
2. **A tela é uma interface de verdade, não um ícone.** Janela de app, campo de prompt, pasta e arquivo, celular, folha
   de comentários. *Por quê:* o modelo encena o que se faz na tela; ícone genérico e selo não encenam nada. *Não:*
   inventar marca, nome ou interface de app real sem print com origem (G25); o desenho é a janela da casa.
3. **Creme com grade e um acento só.** Fundo `#F1ECE3` com grade de 60 px, cards papel `#FBF8F2` ou escuro `#161616`
   (raio 18 a 26, sombra macia), tinta `#161412`, **terracota `#D97757`** como único acento (verde `#2FB765` só no que deu
   certo, azul `#3B82F6` só na seleção com alças). Letras: Geist, Instrument Serif itálica (título e palavra-chave), Geist
   Mono (interface e etiqueta).
4. **Quatro modos, corte seco entre eles.** Rosto cheio (o padrão); **palco** (título de 1 linha em serifa itálica
   terracota no topo, o card no meio, o rosto num card embaixo); **dividido** (a interface em cima, o rosto embaixo, a
   legenda vira etiqueta mono na divisa); **motion** (um visual grande, sem câmera; o fecho). Zero quadro de transição: o
   corte cai 2 quadros antes da palavra que abre a frase.
5. **Um card por trecho que pede a interface, não por frase (G28).** Dentro dele, uma microação a cada 0,5 a 1 s, cada
   uma presa a uma palavra dita: a linha nasce, o cursor clica, a pasta entra, o item ganha ✓, o botão fica verde.
   *Não:* dois objetos de frases diferentes no mesmo card; troca de conteúdo no lugar só com o chicote (o novo entra da
   direita com borrão, o velho sai para a esquerda).
6. **O vocabulário de movimento é um só.** Entra subindo com mola ou desliza em ~8 quadros; pop de escala 0,6 a 1; o
   traço de pincel terracota sob o título; a caixa de seleção com alças no escolhido. Nada de piscar, girar sem motivo,
   brilhar.
7. **A legenda é a espinha.** Toda palavra dita, uma vez, em ordem, palavra por palavra, até 2 linhas, um lugar por modo
   (peito y 1200, palco y 1210, etiqueta da divisa, motion y 1290 ou topo no fecho). A palavra-chave (o termo
   protagonista) em serifa itálica terracota 1,3x; a palavra do pedido em MAIÚSCULA com alças.
8. **Texto na tela só o que é dito (G19), sem repetir a legenda na mesma hora (G26).** O título do palco é texto dito e
   segura a seção; o card mostra o objeto e o ato, a legenda conta. Número como foi dito (G10).
9. **O fecho é a interface do pedido**, só quando a fala pede um comentário: a folha de comentários, a palavra dita
   digitada e publicada; a DM chega só se a fala promete mandar. Sem pedido, o vídeo acaba no rosto.
10. **Som:** sem música; efeitos (o popup grave, clique, tecla) só com ordem do dono (G6).

## As peças (o que já existe em código)

Do molde `sistema/moldes/interface-encenada/`:
- **A casa:** `RostoCheio`, `RostoPerto`, a `Legenda` (os lugares por modo), `Titulo` (o título do palco), `CardPalco`,
  `RostoPalco`, `Dividido`, `Troca` (o chicote), `Selecao` (as alças), `Cursor`, `ChipClaude` (a faísca, só se a fala
  nomeia o Claude), e o fecho `comenta` (parametrizado pela fala nova).
- **O kit da tela livre** (`src/ui.tsx`): `Palco` (a zona segura do modo; toda tela livre desenha dentro dele), `Entra`,
  `Janela` (app papel ou escuro), `Linha` (item em mono que desliza e acende), `Pasta`, `Arq`, `Check`, `Digita`,
  `Enviar`, `Contador` (até o número dito), `Grifo`; as cores em `C` de `src/tema.ts`. A moldura do modo (título, card,
  rosto embaixo, divisa) é da casa: a tela livre só desenha o miolo (`src/Livres.tsx`).
- **As telas do aprovado** (exemplos com o porquê, `interface-encenada.md` §10): `gancho`, `criado`, `modelos`,
  `instagram`, `nome`, `previas`, `outros`, `comenta`. Uma delas só volta quando a fala nova diz a mesma coisa; as que
  escrevem os nomes de modelos, pastas e o comando do aprovado não entram num tema novo: a interface parecida vira tela
  livre com o texto da fala nova.

## A invenção (a interface que a fala pede e a casa não tem)

É o normal num tema novo. Para cada trecho com um ato de tela que tem força para o tema (G28):
1. **Ache o ato.** Que coisa a pessoa faz ou recebe numa tela? (manda, digita, escolhe, abre, aprova, chega).
2. **Ache a interface.** Onde esse ato mora? (uma janela, um campo, uma lista, um celular, uma linha do tempo).
3. **Escolha o modo.** Palco (o normal: a seção tem um nome dito que vira título), dividido (a pessoa continua
   importante) ou motion (o visual é grande e a pessoa sai por pouco tempo).
4. **Monte com o kit**, dentro do `<Palco>`: a interface na língua da casa, cada microação presa a uma palavra dita
   (`em`). Sem texto no card, ou só o texto dito que a legenda não está mostrando naquela hora.
5. **Escreva em `src/telas/<Nome>.tsx` da pasta do vídeo**, registre em `src/telas/index.ts` e ponha no plano:
   `livres = [{comp: 'Nome', modo: 'palco', de: corte(w('...')), titulo: 'dito', em: {...}}]`. A tela vai até a cena
   seguinte (um `rosto`, quase sempre).

**Exemplo 1 (fala que o aprovado não tem):** *"Toda segunda eu mando o orçamento pro cliente pelo WhatsApp, e em dez
minutos ele aprova."* Na 1ª metade, rosto cheio. Em "mando", dividido: uma `Janela` papel com a conversa; o arquivo do
orçamento (`Arq`) desliza para dentro em "mando", o `Enviar` fica verde em "WhatsApp"; em "aprova", o `Check` estala na
mensagem que chega. Sem nome de contato nem número inventado. Por quê: "mando" e "aprova" (o ato é mandar e receber).

**Exemplo 2:** *"Eu organizei a semana em três colunas: gravar, editar e postar."* Palco com o título "três colunas"
(dito); no card papel, três colunas que entram com mola nas palavras "gravar", "editar" e "postar", sem texto dentro (a
legenda diz os nomes), e a barra de seleção terracota desce de uma para a outra. Por quê: "organizei" (uma lista dita
item a item numa tela).


## O teste do clone (antes do render)

1. `node scripts/cobertura.mjs` (na pasta do vídeo) até `APROVADO`: ele também grava `src/tempos.json`, que o clone usa.
2. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele acusa
   texto do aprovado que a fala nova não diz, plano parecido com o do aprovado e tela sem dono na fala.
3. **Toda tela tem dono:** no `plano.md`, a linha da cena diz o nome da tela como está no plano (`Repositorio`,
   `comenta`...) e a palavra dita entre aspas que pediu ela, com o porquê.
4. **Folha lado a lado** com `sistema/modelos/interface-encenada/referencia/folha.jpg`: *mesmo modelo?* (creme,
   terracota, serifa itálica, legenda, cortes secos) **sim**; *mesmo vídeo?* (as pastas de modelos, o catálogo, o prompt,
   a mesma ordem) **não**.

## O caminho (os comandos estão no `interface-encenada.md` §9)

1. Ler esta skill e o `interface-encenada.md`. 2. `tools/novo-video.py interface-encenada <gravação> <AAAA-MM-DD-tema>`:
o plano nasce vazio (rosto cheio). 3. `scripts/rosto.py`. 4. Ler a fala (`src/palavras.json`) antes de olhar o exemplo
de novo. 5. Plano de cenas (`cenas.json` → `tools/decupar.py --plano`) e o `plano.md`, uma linha por cena com a palavra
que pediu a tela. 6. O bloco O PLANO de `src/tema.ts` e as telas livres. 7. `cobertura.mjs` até `APROVADO`.
8. `tools/clone.py` até `SEM CLONE`, `tools/decupar.py --conferir`. 9. Quadros e folha lado a lado. 10. Render,
mixagem, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Pôr as pastas de modelos, o catálogo, o prompt `/interface-encenada` ou a janela "Claude Code" porque "o modelo tem":
  só com o mesmo porquê na fala, e com o texto da fala nova.
- Escrever na tela o que não foi dito; inventar nome, número, marca ou interface de app real (G10, G19, G25).
- Tela no gancho (G29), uma tela por frase, tela que deixa o rosto em minoria, a mesma informação na legenda e no card
  ao mesmo tempo (G26).
- Ícone genérico, selo, brilho, contorno, cor fora da paleta (o creme e o terracota são do modelo, nunca da roupa).
- Desenhar fora do `<Palco>`, ou tela nova dentro do molde (ela mora na pasta do vídeo).
- O nome do modelo na tela (G33).
