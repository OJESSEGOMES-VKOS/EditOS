---
name: texto-e-objeto
description: >
  Modelo texto-e-objeto do EditOS: só a voz, a frase escrita palavra por palavra em tamanhos misturados e um objeto
  que faz o que ela diz, no preto quente e no laranja. Use quando pedirem "edita no texto-e-objeto", "faz no
  texto-e-objeto", "tipografia cinética" ou narração sem rosto com texto grande.
---

# texto-e-objeto: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no texto-e-objeto, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/texto-e-objeto/texto-e-objeto.md`; o método comum de
todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/texto-e-objeto/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"vídeo editado 100% pelo Claude Code". Ele nunca é o roteiro, a sequência nem o catálogo de heróis do vídeo novo. Quem
narra sobre a padaria dele recebe um texto-e-objeto sobre a padaria (o forno, a fornada, o relógio), não a faísca do
Claude, a grade de 160 vídeos e o carimbo "TESTE #01" com outra voz.

## Quando usar

- **Sim:** narração sem rosto (ou uma gravação da qual só a voz entra), de 15 s a 60 s, fala de ideia ou de anúncio
  com frases que têm palavra forte e, de vez em quando, uma coisa concreta para mostrar. O texto é o design.
- **Não:** fala em que a pessoa precisa aparecer (vai para um modelo com rosto, como o `rosto-telas`); fala muito
  rápida e longa, em que o texto não teria 1,5 s por tela; vídeo que é prova atrás de prova (o `prova-print`).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **O texto é o design.** A frase dita aparece inteira, palavra por palavra, no tempo da voz, num bloco grande no
   centro, nunca como legenda embaixo. *Por quê:* sem rosto, a palavra escrita é quem fala. *Sim:* toda palavra dita
   (G12, legenda conta a história). *Não:* texto que não foi dito (G19), número diferente do dito (G10).
2. **Tamanhos misturados no mesmo bloco.** A ligação pequena (56 a 90 px, Inter 700) e a palavra de peso enorme (110 a
   330 px, Inter 900, apertada). Uma linha, um tamanho e uma fonte. *Por quê:* o olho lê primeiro o assunto. *Sim:* só o
   assunto vira grande. *Não:* advérbio ou ligação grande; mais de 4 linhas.
3. **Dois fundos que se alternam a cada tela,** preto quente e laranja, sempre em degradê radial, começando no escuro.
   *Por quê:* a troca de fundo é o corte do modelo; ela marca a ideia nova. *Não:* fundo chapado, outra cor.
4. **A palavra nasce do desfoque,** 40 px à direita, nítida em 5 quadros, 0,04 s antes de ser dita. Tudo que entra na
   tela (palavra ou herói) entra assim ou com mola. *Não:* piscar, girar sem motivo, tremer.
5. **A palavra de efeito** vai em cursiva com rastro desfocado (a que tem emoção) ou em serifa itálica (a que tem peso
   elegante), e quatro efeitos de palavra fazem o verbo dela: `CORTA` (partir), `SUBLINHA`, `MOLDURA` (enquadrar),
   `ANEL` (destacar). *Sim:* uma palavra por tela, no máximo. *Não:* efeito por enfeite.
6. **Um herói por tela quando a frase pede um objeto, e ele faz o que a frase diz.** No centro ou embaixo do bloco,
   sempre em movimento, cada movimento preso a uma palavra dita (`naTela(c, 'palavra')`), pintado com as cores do fundo
   da própria tela (`cores(c.fundo)`: no escuro, acento laranja; no laranja, acento creme). *Por quê:* a tela encena a
   frase, não ilustra (G19). *Sim:* frase com uma coisa concreta (a conta, a orelha, o forno). *Não:* frase de efeito de
   palavra (ela já é a imagem); herói que nasce pronto; dois heróis na tela.
7. **A câmera nunca para:** a tela inteira aproxima 1,5% por segundo. Corte seco com troca de fundo; íris só nas 2 ou 3
   viradas de assunto.
8. **O ritmo.** Uma tela a cada 1,5 a 2,5 s, cortando nas pausas da fala; cada tela pelo menos 1,5 s e cada palavra
   pelo menos 0,4 s depois de nascer (o `cobertura.mjs` manda). No aprovado, cerca de 26 cortes por minuto.
9. **O fecho segue a fala.** Fala que pede para seguir ("já me segue aqui"): a assinatura da casa, a foto num anel e o @
   (só os reais). Fala que pede outra coisa (comentar, clicar no link): um herói que aponta para lá. Sem pedido: a
   última frase segura 1,24 s e acaba.

## As peças (o que já existe em código)

Do molde `sistema/moldes/texto-e-objeto/`:
- **A casa:** o bloco de texto (`Bloco`, `Pal` com os efeitos), os dois fundos, a câmera, a íris (`src/Reel.tsx`), a
  voz e o tempo de cada palavra (`tempoDe`, as linhas são as palavras ditas na ordem).
- **O kit do herói** (`src/kit.tsx`): `Palco` (a área livre embaixo do bloco, y 820 a 1500; o herói desenha dentro
  dele), `cores(c.fundo)`, `naTela` e `diz` (a palavra nesta tela), `surge` e `cresce` (as duas entradas da casa),
  `mola`, `tw`, `E`, `Faisca`, as fontes `SANS`, `SCRIPT`, `SERIF`, `MONO` e as cores `C`.
- **Os heróis do aprovado** (exemplos com o porquê, `texto-e-objeto.md` §5): Cem, Arquivo, Mira, Converge, Prompt,
  Pastas, Cento, Frame, Orbita, Fichas, Guias, Carimbo, Um, Barra, Dial, Assinatura. Cada um só volta quando a fala
  nova diz a mesma coisa que fez ele existir: a faísca se a fala nomeia o Claude, o mostrador se diz "calibrando". Os
  que escrevem texto fixo (Prompt com "Claude", Orbita e Fichas com os tópicos do aprovado, Carimbo "TESTE #01")
  só com essa fala.

## A invenção (o herói que a fala pede e a casa não tem)

É o normal num tema novo. Para cada frase com uma coisa concreta:
1. **Ache o objeto.** Qual coisa a frase nomeia ou faz? (a orelha, a estante, o forno, o relógio).
2. **Ache o verbo.** O que acontece com ela? (é riscada, se fecha, sai da fileira, nasce barra a barra).
3. **Monte com o kit**, dentro do `<Palco>`: o objeto em forma simples e cheia (traço grosso de ponta redonda,
   retângulo de canto redondo), com as cores de `cores(c.fundo)`, cada movimento preso a uma palavra dita. Sem texto,
   ou só o texto dito.
4. **Escreva em `src/telas/<Nome>.tsx` da pasta do vídeo**, registre em `src/telas/index.ts` e ponha no plano:
   `heroi: <Heroi comp="Nome" />`. Um herói pode servir a duas telas seguidas fazendo coisas diferentes (`diz(c, ...)`).

**Exemplo 1 (fala que o aprovado não tem):** *"Na padaria a gente faz três fornadas por dia."* Tela no laranja: "Na
padaria a gente faz / **três** / *fornadas* / por dia"; herói `Fornadas`: três pães em forma de cúpula entram com mola,
um em "três", um em "fornadas", um em "dia", e a boca do forno brilha no acento. Por quê: "três fornadas" (uma conta dita
item a item).

**Exemplo 2:** *"Minha conta de luz caiu pela metade."* Tela no escuro: "Minha conta de luz / caiu pela / **metade**";
herói `Conta`: um papel creme com uma barra grossa que encolhe até a metade em "metade", e o efeito `CORTA` em "metade".
Por quê: "caiu pela metade" (o verbo é cair).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   acha cada herói do plano pelo `comp="Nome"` e cobra o dono dele na fala.
2. **Toda tela com herói tem dono:** no `plano.md`, a linha da tela diz o nome do herói como está no plano (`Orelha`,
   `Estante`...) e a palavra dita entre aspas que pediu ele, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/texto-e-objeto/referencia/folha.jpg`: *mesmo modelo?* (fundos, letra,
   tamanhos misturados, herói em movimento) **sim**; *mesmo vídeo?* (mesmos heróis, textos, ordem) **não**.

## O caminho (os comandos estão no `texto-e-objeto.md` §9)

1. Ler esta skill e o `texto-e-objeto.md`. 2. `tools/novo-video.py texto-e-objeto <gravação> <AAAA-MM-DD-tema>`: o
plano nasce vazio (uma tela escura sem texto). 3. Ler a fala (`src/palavras.json`), achar as pausas. 4. `plano.md`:
uma linha por tela, com o herói e a palavra que pediu ele. 5. Montar o bloco O PLANO de `src/Cenas.tsx` e os heróis em
`src/telas/`. 6. `node scripts/cobertura.mjs` até `APROVADO`. 7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha
lado a lado. 9. Som, render, mixagem, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Pôr a faísca do Claude, a grade de vídeos, as fichas de regras, o carimbo ou o prompt "porque o modelo tem": só com
  o mesmo porquê na fala.
- Escrever na tela o que não foi dito, inventar nome, número, marca ou interface (G10, G19, G25).
- Herói com cor fixa (some no outro fundo), herói fora do `<Palco>`, herói nascendo pronto.
- Fundo chapado, mais de 4 linhas, tela de menos de 1,5 s, palavra grande passando de x 940.
- Tela nova dentro do molde (ela mora na pasta do vídeo). O nome do modelo na tela (G33).
