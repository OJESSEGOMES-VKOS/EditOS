---
name: anuncio-neon
description: >
  Modelo de edição anuncio-neon do EditOS: anúncio narrado sem apresentador, objetos de vidro e neon na cor da marca
  sobre preto, respiros claros e legenda em linhas fina e forte. Use quando pedirem "edita no anuncio-neon", "faz o
  anúncio no anuncio-neon" ou um anúncio em motion de vidro e neon.
---

# anuncio-neon: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no anuncio-neon, para qualquer anúncio narrado. O
arquivo detalhado (números, paleta, posições, opções, comandos) é `sistema/modelos/anuncio-neon/anuncio-neon.md`; o
método comum de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima.

O anúncio aprovado (`sistema/modelos/anuncio-neon/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude", em menta. Ele nunca é o roteiro, a sequência, o catálogo de telas nem a cor do anúncio
novo. Quem pede um anúncio da clínica dele recebe um anuncio-neon da clínica, na cor da clínica, com os objetos da
clínica, não o anúncio dos modelos de edição com outro produto encaixado.

## Quando usar

- **Sim:** anúncio narrado (só a voz) de 15 s a 45 s para um produto, serviço ou ferramenta, em que cada frase tem um
  ato concreto para encenar (ligar, abrir, escolher, crescer, travar), com fecho de comando ("comenta X", "clica").
- **Não:** a pessoa falando para a câmera (modelo com rosto); prova real em print atrás de print (`prova-print`);
  manifesto sem produto, em tom de estúdio (o `motion-ouro`).

## A personalidade (vale para qualquer anúncio)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A cor é de cada anúncio.** Uma linha em `src/tema.ts` (`gira(PADRAO, cor)`) leva a paleta inteira para a cor da
   marca de quem anuncia; sem marca, uma cor própria do anúncio, viva no preto. *Por quê:* a gramática é do modelo, a
   cor é do cliente. *Nunca:* o menta `#3CF2A4` do aprovado, as cores do negócio de quem edita, dois anúncios seguidos
   com a mesma identidade. Tela nova pinta só com `C` (o conferidor reprova hex escrito na tela).
2. **Fundo preto listrado com a luz da marca vazando, e respiros claros em corte seco.** *Por quê:* o claro de vez em
   quando dá ar e marca a virada de ideia. *Sim:* 2 ou 3 respiros num anúncio de 30 s. *Não:* claro seguido de claro.
3. **Objeto de vidro e neon que faz o que a frase diz.** Ícone herói de vidro com volume, placas inclinadas com
   telinhas, anéis, partículas, check. Cada movimento preso à palavra (`marca('nome')`): a pasta abre em "usar", a
   estante apaga em "nada". *Por quê:* a tela encena o ato (G19). *Não:* desenho parado que só ilustra o assunto.
4. **Vermelho só para o ruim.** Proibido, risco, luz da dor e glitch ficam no vermelho, que não gira com a marca.
5. **Toda a fala vira legenda numa altura só.** A 1ª linha em y 1170, as outras a cada 80 a 92 px; linhas que alternam
   fina (Sora 400, 60 px) e forte (Sora 800, 80 px); a palavra-chave na cor da marca com brilho. Um bloco por vez, de
   1,5 s, palavra de 0,4 s, até 4 linhas. *Por quê:* o anúncio é lido no mudo; a legenda conta tudo (G12).
6. **A pílula só no termo protagonista e no fecho.** Contorno brilhante escrito letra por letra, sobre anéis, todas do
   mesmo tamanho. *Por quê:* é o destaque do vídeo inteiro (G17, G28). *Não:* uma pílula por frase.
7. **Câmera viva e três trocas.** Corte seco com batida de zoom (escuro ↔ claro), borrão e íris com anel na cor da
   marca. Nada parado; uma ideia nova a cada 0,7 a 1,5 s.
8. **Nunca se inventa produto.** As telinhas são desenho genérico; produto de verdade só do print real de quem anuncia
   (G25). Nome, número, preço, selo, depoimento: só os verdadeiros, ou vira pedido.
9. **O fecho é o comando.** "comenta" e a palavra entre aspas na pílula sobre os anéis, a seta em "embaixo"; sem
   comando na fala, a pílula leva o termo protagonista da última frase. Vai ao preto no fim.

## As peças (o que já existe em código)

Do molde `sistema/moldes/anuncio-neon/`:
- **A casa:** a legenda e a pílula (`src/texto.tsx`, do plano), as trocas (corte, borrão, íris), a câmera viva, a ida
  ao preto, a trilha e os efeitos sintetizados do plano (`scripts/som.py`), a paleta `C` que gira.
- **O kit da tela nova** (`src/kit.tsx`): `Fundo` (escuro com a luz da marca, `claro` para o respiro, `tom="dor"` para
  o ruim), `Palco` (a zona do objeto, y 250 a 1080, centro em x 500), `Entra` (a mola da casa na palavra),
  `IconeVidro`, `Placa`, `Telinha`, `Aneis`, `Particulas` (com `explode`), `Risco`, `MarcaTexto`, `Glitch`, `Ecg`,
  os glifos `GL` e `G` (play, mic, câmera, check, calendário...), `pop`, `pulso`, `marca`, `mola`, `tw`, `C`.
- **As telas do aprovado** (S1 a S10, exemplos com o porquê, `anuncio-neon.md` §4): play que vira número, editor na
  placa, placas em leque, ícone com órbita, celular do Instagram, telinhas com "apenas um", prévias, pílulas com
  telinhas, interruptor, fecho. Uma delas só volta quando a fala nova tem o mesmo porquê: o interruptor volta se a
  fala diz "liga", "ativa", "começa a usar"; o play que vira número, se a abertura diz um número.

## A invenção (a tela que a fala pede e a casa não tem)

É o normal num anúncio novo. Para cada frase:
1. **Ache o objeto** (o que a frase nomeia: a agenda, o dente, a pasta, a orelha) e **o verbo** (abre, liga, sobe,
   apaga, trava).
2. **Monte no vidro e neon da casa** dentro do `<Palco>`: um `IconeVidro` com um glifo de linha, uma `Placa` com
   `Telinha`, `Aneis`, `Particulas`, o check `G.check`; o verbo como um movimento da casa, na `marca` da palavra.
3. **Escreva em `src/telas/<Nome>.tsx` da pasta do vídeo** (`export const Nome: TelaNova = ({c}) => ...`, `c.de` e
   `c.ate` em segundos), registre em `src/telas/index.ts` e ponha no plano:
   `Nome = livre(comp='Nome', de_q=..., ate_q=..., entrada=BORRAO, fundo=ESCURO)`, com as marcas em `marcas`.

**Exemplo 1 (anúncio que o aprovado não tem):** *"Sua agenda vive vazia na segunda? Com o lembrete automático, o
paciente confirma sozinho."* 1ª frase: tela nova `Agenda`, um `IconeVidro` com o glifo `G.cal` e as telinhas da semana
em placas, a de segunda apagada no `tom="dor"`. 2ª frase: respiro claro, tela nova `Lembrete`, a placa do celular
recebe a notificação em "lembrete" e o check acende em "confirma". Por quê: "vazia" (o ruim) e "confirma" (o ganho).

**Exemplo 2:** *"São três passos: você escolhe, paga e recebe em casa."* Tela nova `Passos`: três ícones de vidro em
fila, cada um entra com mola na palavra do passo e uma linha de luz da marca liga um ao outro. A pílula não entra:
"três passos" não é o termo protagonista.


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   lê o bloco O PLANO de `scripts/plano.py`: a tela da casa é a linha `S9 = cena('S9', ...)`, a nova é
   `livre(comp='Nome', ...)`. Use as constantes (`BORRAO`, `CLARO`, `PILULA`...), nunca a palavra entre aspas.
2. **Toda tela tem dono:** no `plano.md`, a linha da cena diz o nome da tela como está no plano e a palavra dita entre
   aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/anuncio-neon/referencia/folha.jpg`: *mesmo modelo?* (vidro e neon no
   preto, respiros claros, legenda fina e forte em y 1170, pílula no fecho) **sim**; *mesmo vídeo?* (mesma cor,
   objetos, textos, ordem) **não**.

## O caminho (os comandos estão no `anuncio-neon.md` §9)

1. Ler esta skill e o `anuncio-neon.md`. 2. `tools/novo-video.py anuncio-neon <narração> <AAAA-MM-DD-tema>`: o plano
nasce vazio. 3. A cor do anúncio em `src/tema.ts`. 4. Ler a fala e escrever o `plano.md` com o plano de cenas. 5. O
bloco O PLANO de `scripts/plano.py` e as telas novas; rodar `scripts/plano.py`. 6. `scripts/conferir.py` até `0 erros`.
7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha lado a lado. 9. `scripts/som.py`, render, `finalizar.sh`.

## Nunca

- Começar do plano do aprovado, copiar o bloco O PLANO de outro vídeo ou editar `src/tempos.json` à mão.
- O menta do aprovado, as cores de quem edita, hex escrito numa tela nova.
- Editor na placa, leque de modelos, celular do Instagram, prévias ou interruptor porque "o modelo tem".
- Inventar produto, print, número, preço, selo, cliente ou depoimento (G10, G19, G25).
- Pílula por frase, legenda em outra altura, dois blocos ao mesmo tempo (G12, G17).
- Tela nova dentro do molde, ou objeto fora do `<Palco>`. O nome do modelo na tela (G33). Travessão.
