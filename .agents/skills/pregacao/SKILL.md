---
name: pregacao
description: >
  Modelo de edição pregacao do EditOS: a voz e o rosto mandam, legenda corrida no peito e ênfase só nos picos (frase
  que se monta, tela creme, Comenta). Use quando pedirem "edita no pregacao", "corte de pregação", "edita minha
  pregação" ou um corte falado sóbrio de fé, reflexão ou tese.
---

# pregacao: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no pregacao, para qualquer fala. O arquivo detalhado
(números, tamanhos, opções, comandos) é `sistema/modelos/pregacao/pregacao.md`; o método comum de todas as skills é
`sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/pregacao/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do "100%
editado pelo Claude". Ele nunca é o roteiro, a sequência nem a lista de ênfases do vídeo novo. Quem grava uma pregação
sobre perdão recebe um pregacao sobre perdão: a frase-bloco é a tese dele, a tela creme é a frase protagonista dele.

## Quando usar

- **Sim:** uma pessoa falando para a câmera (9:16 ou 16:9), 20 s a 90 s, quando a força está na voz: pregação,
  reflexão, testemunho, uma tese defendida. A fala tem 1 a 3 picos; o resto é ouvir.
- **Não:** fala que precisa mostrar coisas (vai para o `rosto-telas`); fala com muitos termos de impacto que pedem letra
  de cinema (o `trailer`); conversa de podcast com câmeras (o `minidocumentario`).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A fala é a estrela.** Quase todo o vídeo é a pessoa com o fundo real (G6) e a legenda corrida. *Por quê:* a edição
   amplifica, não disputa. No aprovado, rosto na tela 88% do tempo, cerca de 10 cortes por minuto (planos longos).
   *Não:* preto e branco, fundo tingido, recortado ou desfocado, efeito sonoro: só com ordem do dono.
2. **A legenda corrida no peito.** Inter 800, 60 px, branco quente `#F3EDE4`, sem caixa nem contorno, páginas de até 2
   linhas, cada palavra nascendo num fade suave junto com a voz, logo abaixo do queixo, uma posição só no vídeo todo.
   *Por quê:* a voz pede leitura sem susto. Sem palavra colorida na legenda.
3. **Uma cor de ênfase só: o vermelho `#FF2424`**, e uma letra de ênfase só: a Instrument Serif itálica, na palavra de
   peso. Todo o resto é Inter branca.
4. **A frase-bloco que se monta** é o pico: a frase da tese cresce palavra por palavra em tamanhos misturados (ligação
   menor, peso maior) e a última palavra de peso é a maior, em serifa itálica vermelha. Até 4 linhas, logo abaixo do
   queixo, sai em chicote borrado junto com o corte. *Sim:* o gancho (G29: abre na gravação, com a frase mais forte) e
   a virada que fecha uma cena forte. *Não:* em toda frase; virada no meio da frase fica na legenda.
5. **A tela creme** é a frase protagonista do tema, uma vez: fundo creme chapado `#EDE3D3`, tinta escura, a palavra de
   peso em vermelho escuro `#C8141B`, entra em dissolve de 6 quadros. *Sim:* a frase que resume a pregação. *Não:*
   fala coadjuvante; nunca branco sobre o creme.
6. **Destaque só no termo protagonista** (o assunto), nunca advérbio, verbo solto ou ligação. A legenda é exatamente
   o que foi dito: nunca invente versículo, citação ou nome de igreja.
7. **Câmera parada, corte seco na troca de frase.** Zoom 1,0 por padrão; aproximar (até 1,18) só na frase de peso ou
   na virada (G6), nunca por tempo.
8. **Fecha no preto.** Com o comando dito ("comenta X"), o comando e a palavra entre aspas em serifa vermelha com o
   traço de pincel ficam fixos até o fim, e a imagem dissolve para o preto; sem comando, dissolve depois da última
   palavra.

## As peças (o que já existe em código)

Do molde `sistema/moldes/pregacao/` (`src/Corte.tsx`, bloco O PLANO):
- `PEDACOS` (a legenda corrida), `ABERTURA` (frase-bloco do gancho), `DESTAQUE` (tela creme), `VIRADA` (frase-bloco da
  virada), `COMANDO` (o Comenta), `T` (os trechos: bloco1, base1... cta, fecho), `ZOOM`, `LEG_Y_PLANO`.
- Opções desligadas: `LETREIRO` (precisa recortar a pessoa), prévias, fundo desfocado ou tingido.

**Não há tela livre neste modelo, de propósito.** O pregacao é a pessoa e a palavra dela: o aprovado não tem nenhuma
tela de conteúdo, e o modelo pede que nada dispute com a voz. A invenção aqui é escolher, na fala nova, a frase da tese,
a frase protagonista e a palavra de peso de cada uma. (As "telas criadas com ilustração em traço" do `pregacao.md` §4
têm o porquê a confirmar com o dono; não entram sem pedido.)

## A invenção (a ênfase que a fala nova pede)

1. **Ache a tese** (a frase que a pessoa quer que fique) e a **palavra de peso** dela (o termo protagonista).
2. **Gancho:** a frase mais forte dos primeiros segundos vira a `ABERTURA`, com a palavra de peso no fim, a maior,
   serifa vermelha. Se o gancho não tem frase forte, `ABERTURA = null` e o vídeo abre na legenda.
3. **Frase protagonista:** a que resume o tema vai para a tela creme (`DESTAQUE`), até 4 linhas, palavra de peso em
   vermelho escuro. Fala rápida antes dela: leve a frase inteira para o creme.
4. **O resto é legenda**, página a página, trecho a trecho, toda palavra uma vez.
5. **Comando no fim?** `COMANDO` com a palavra dita entre aspas e `pincel: true`; sem comando, só o preto.

**Exemplo 1 (fala que o aprovado não tem):** *"Perdoar não é esquecer. Perdoar é escolher não cobrar mais a dívida."*
Abertura: "Perdoar não é" (Inter) / "esquecer." (serifa vermelha, a maior). Tela creme na 2ª frase: "Perdoar é
escolher / não cobrar mais a" / "dívida." em vermelho escuro. Por quê: "esquecer" (o gancho nega o senso comum) e
"dívida" (a frase protagonista, a tese). Nada de "Claude", "modelos" ou "100%".

**Exemplo 2:** *"Deus não te chamou para ser perfeito, mas para ser fiel. Comenta FIEL que eu oro por você."*
Abertura em "perfeito,"; virada não vira bloco (é meio de frase), fica na legenda; comando "Comenta" / “fiel” com
pincel. Por quê: "perfeito" (o gancho), "comenta" (a fala pede o comentário).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`.
2. **Toda ênfase tem dono:** no `plano.md`, a linha da cena diz o nome do momento como está no plano (`ABERTURA`,
   `DESTAQUE`, `VIRADA`, `COMANDO`) e a palavra dita entre aspas que pediu ele, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/pregacao/referencia/folha.jpg`: *mesmo modelo?* (legenda Inter branca no
   peito, serifa vermelha, creme, preto no fim) **sim**; *mesmo vídeo?* (mesmas frases em destaque, mesma ordem) **não**.

## O caminho (os comandos estão no `pregacao.md` §9)

1. Ler esta skill e o `pregacao.md`. 2. `tools/novo-video.py pregacao <gravação> <AAAA-MM-DD-tema>`: o plano nasce
vazio (a pessoa num plano, sem ênfase). 3. Ler a fala (`src/palavras.json`) antes de olhar o exemplo. 4. `plano.md`
com o plano de cenas. 5. Montar o bloco O PLANO: legenda primeiro, depois os picos. 6. `node scripts/cobertura.mjs`
até zerar. 7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha lado a lado. 9. Render, mixagem (só a voz), entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Abrir com "Esse vídeo está sendo 100%..." ou pôr "modelos" no creme porque "o modelo tem".
- Mais de uma tela creme, ênfase em toda frase, palavra colorida na legenda, branco sobre o creme.
- Preto e branco, fundo tingido ou recortado, letreiro atrás da pessoa, efeito sonoro ou música sem ordem (G6).
- Inventar versículo, citação, nome (G19); o nome do modelo na tela (G33); contorno ou brilho (G16).
