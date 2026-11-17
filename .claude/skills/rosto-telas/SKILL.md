---
name: rosto-telas
description: >
  Modelo de edição rosto-telas do EditOS: a pessoa em rosto cheio e telas claras de papel que encenam o que ela diz.
  Use quando pedirem "edita no rosto-telas", "edita minha gravação no rosto-telas", "no estilo do vídeo 100% editado
  pelo Claude" ou um vídeo falado com telas marfim e menta.
---

# rosto-telas: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no rosto-telas, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/rosto-telas/rosto-telas.md`; o método comum de
todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/rosto-telas/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude". Ele nunca é o roteiro, a sequência nem o catálogo de telas do vídeo novo. Quem compra o
EditOS e grava sobre a padaria dele recebe um vídeo rosto-telas sobre a padaria, não o vídeo do Claude com outra pessoa.

## Quando usar

- **Sim:** uma pessoa falando para a câmera (9:16), fala de 15 s a 90 s, tom de explicação ou de convite, quando
  algumas frases têm uma coisa concreta que dá para mostrar (um número, uma lista, um antes e depois, um objeto, uma
  ação). O rosto conta, a tela mostra.
- **Não:** narração sem rosto (vai para um modelo narrado); fala emocional do começo ao fim, em que tela atrapalha
  (vai para um modelo de rosto puro, como o `pregacao`); vídeo que é prova visual atrás de prova (o `prova-print` faz
  melhor).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **O rosto cheio é a base.** Gravação crua, fundo real, enquadramento A (zoom 1,06, olhos em y 660), fixo dentro do
   trecho. *Por quê:* quem fala é a pessoa; a tela é visita. *Sim:* o gancho (sempre, G29), opinião, emoção, transição
   de ideia. *Não:* deixar a pessoa sem rosto mais de 6 s seguidos. O plano B (15% mais perto) só com motivo na fala.
2. **A tela é papel marfim, já preenchida.** Fundo `#F0EEE6` com grade de pontos, cartões `#FBF9F4` de raio 26 com
   sombra macia, tinta `#0A0A0A`. O painel desce pronto em 0,4 s e sai junto com o corte (G23); nunca cortina aberta,
   nunca preto (o preto não dá contraste com o vídeo). *Por quê:* a tela clara parece um caderno limpo ao lado da
   pessoa e ganha do fundo do vídeo.
3. **Dois jeitos de a tela entrar, e só dois.**
   - **Dividido:** painel em cima (até y 960), a pessoa embaixo, a legenda vira a pílula verde-escura na divisa.
     *Sim:* a frase tem um objeto e a pessoa continua importante (o normal). *No aprovado:* 43% do tempo.
   - **Cheia:** a tela toma tudo e **o título no topo é o próprio texto dito** (Geist 800, 74 px, letras apertadas),
     a legenda some; a pessoa pode morar numa moldura 9:16 dentro da tela. *Sim:* quando a frase fala do próprio vídeo,
     do aparelho, de algo que acontece "dentro" da tela. *Não:* em fala rápida com frase curta (o título vira palavra
     solta).
4. **Um objeto por tela, e ele faz o que a frase diz.** Não é uma ilustração parada: a barra enche no "quitado", o ✓
   cai item a item na lista, a orelha é riscada no "não tem ouvidos". Cada movimento está preso a uma palavra dita
   (`w('palavra')`). *Por quê:* a tela representa o ato, não relata (G19). *Não:* dois objetos de frases diferentes na
   mesma tela; uma tela por frase.
5. **O vocabulário de movimento é um só.** Entra com mola (sobe, cresce de 60% e gira até 10° no cartão), ✓ menta que
   estala, barra verde que enche, marca-texto menta que corre por baixo da palavra, risco que atravessa, anéis que
   saem. Nada de piscar, girar sem motivo, tremer, brilhar.
6. **A legenda conta a história.** Toda palavra dita aparece uma vez, em ordem: Geist 800, branca, sem tarja, a palavra
   que está sendo dita em menta `#7ED9B2`, logo abaixo do queixo; na pílula quando dividido; no título quando cheia.
   Página de pelo menos 1,5 s, até 2 linhas. Só esses 3 lugares no vídeo todo.
7. **Cor com função.** Menta só como preenchimento e marca-texto (nunca texto sobre marfim), verde no que dá certo,
   vermelho-tijolo `#C8553D` só no que é negado ou riscado, laranja `#D97757` só no que é do Claude.
8. **Texto grande e pouco.** Nada menor que 56 px (a pílula). Texto na tela só o que foi dito (G19), número como foi
   dito (G10), e nunca o mesmo texto da pílula na mesma hora (G26): no dividido, a pílula conta e o painel mostra.
9. **O ritmo.** Trechos de 2 a 5 s entre cortes, uma tela de 2 a 8 s, cerca de 1 tela a cada 5 a 8 s de fala, e o rosto
   cheio é a maior parte. No aprovado, 22 cortes por minuto. Nenhuma tela vem sem porquê só para "ter ritmo".
10. **O fecho é o do Instagram quando a fala pede comentário.** O campo de comentário com a foto real e a palavra
    digitada em MAIÚSCULA. *Não:* fala que não pede comentário termina no rosto.

## As peças (o que já existe em código)

Do molde `sistema/moldes/rosto-telas/`:
- **A casa:** `Rosto` (A/B, dividido, moldura), `Legenda` (os 3 lugares), `Painel` (o dividido), `Titulo` (o título
  que é o texto dito).
- **O kit da tela livre** (`src/ui.tsx`): `Palco` (a zona segura do modo; toda tela livre desenha dentro dele),
  `Entra`, `Cartao`, `Frase`, `MarcaTexto`, `Chip`, `ItemCheck`, `Barra`, `Numero`, `Risco`, `Icone`, `Ondas`,
  `Bolinha` (o ✓ menta), `Etiqueta`; as cores em `C` de `src/tema.ts`.
- **As telas do aprovado** (exemplos com o porquê, `rosto-telas.md` §4): editor, cartões, celular, prévias, etiqueta
  ao lado do rosto (`outros`), caixa do prompt, fecho. Uma delas só volta quando a fala nova diz a mesma coisa que fez
  ela existir lá: o celular volta se a pessoa fala "se você está no Instagram agora"; o editor, se fala do próprio ato
  de editar este vídeo. As que escrevem "Claude" fixo só entram se a fala nomeia o Claude.

## A invenção (a tela que a fala pede e a casa não tem)

É o normal num tema novo. Para cada frase com força para o tema (G28):
1. **Ache o objeto.** Qual coisa concreta a frase nomeia ou faz? (a conta, a orelha, a estante, o forno, a agenda).
2. **Ache o verbo.** O que acontece com ela na frase? (cai pela metade, é riscada, enche, ganha ✓, nasce).
3. **Escolha o modo.** Dividido (o normal) ou cheia (só quando o texto dito no topo funciona como título).
4. **Monte com o kit**, dentro do `<Palco>`: o objeto em papel, o verbo como um dos movimentos da casa, cada um preso a
   uma palavra dita (`em`). Sem texto, ou com o texto dito que a pílula não está mostrando.
5. **Escreva em `src/telas/<Nome>.tsx` da pasta do vídeo**, registre em `src/telas/index.ts` e ponha no plano:
   `livres=[dict(comp='Nome', modo='dividido', de=corte('...'), sai=corte('...'), em=dict(...))]`.

**Exemplo 1 (fala que o aprovado não tem):** *"Minha conta de luz era trezentos reais. Depois do painel solar, caiu
pela metade."* Na 1ª frase, rosto cheio (o gancho). Na 2ª, dividido: um `Cartao` de conta de luz em papel com o
`Numero` contando até 300 em "trezentos"; em "metade", a `Barra` do valor esvazia de 1 para 0,5 e o número vai a 150,
com `MarcaTexto` menta. Por quê: "metade" (o verbo da frase é cair). Nada de editor, celular ou cartões de modelos.

**Exemplo 2:** *"Na padaria a gente faz três fornadas por dia: às seis, ao meio-dia e às cinco."* Dividido com três
relógios de papel lado a lado (`Cartao` com um `Icone` de relógio), os ponteiros já na hora dita; cada relógio entra
com mola na palavra da hora ("seis", "meio-dia", "cinco") e ganha a `Bolinha` ✓. Sem texto no painel: a pílula já diz
as horas (G26). Por quê: "três fornadas" (uma lista dita item a item).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   acusa texto do aprovado que a fala nova não diz, plano parecido com o do aprovado e tela sem dono na fala.
2. **Toda tela tem dono:** no `plano.md` (o plano de cenas do `tools/decupar.py`), a linha da cena diz o nome da tela
   como está no plano (`Ouvidos`, `outros`, `fecho`...) e a palavra dita entre aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/rosto-telas/referencia/folha.jpg`: *mesmo modelo?* (cor, letra,
   legenda, jeito de entrar e sair) **sim**; *mesmo vídeo?* (mesmos objetos, textos, ordem) **não**.

## O caminho (os comandos estão no `rosto-telas.md` §9)

1. Ler esta skill e o `rosto-telas.md`. 2. `tools/novo-video.py rosto-telas <gravação> <AAAA-MM-DD-tema>`: o plano
nasce vazio (rosto puro). 3. Ler a fala (`src/palavras.json`) antes de olhar o exemplo de novo. 4. Plano de cenas
(`cenas.json` → `tools/decupar.py --plano`), uma linha por cena com a palavra que pediu a tela. 5. Montar o bloco O
PLANO e as telas livres. 6. `gerar_tempos.py`, `rosto.py`, `MIN_PAGINA = 1.5`, `cobertura.mjs` até `APROVADO`.
7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha lado a lado. 9. Render, mixagem, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Pôr o editor "Claude Code", o celular, os cartões de modelos ou a caixa do Claude porque "o modelo tem": só com o
  mesmo porquê na fala.
- Escrever na tela o que não foi dito, inventar nome, número, marca ou interface (G10, G19, G25).
- Tela preta, contorno, brilho, sombra colada, texto menor que 56 px.
- Tela no gancho (G29), tela que fica depois da fala (G27), a mesma informação em dois lugares (G26).
- Desenhar fora do `<Palco>`, ou tela nova dentro do molde (ela mora na pasta do vídeo).
- O nome do modelo na tela (G33).
