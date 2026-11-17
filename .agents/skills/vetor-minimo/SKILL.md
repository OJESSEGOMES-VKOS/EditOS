---
name: vetor-minimo
description: >
  Modelo vetor-minimo do EditOS: sem rosto, uma cena mínima de bonecos palito no preto, plano único, a mesma ação
  repetida até a cor virar o resultado, frases curtas digitadas e a moral no fim. Use quando pedirem "edita no
  vetor-minimo", "faz no vetor-minimo" ou "a metáfora dos bonecos palito".
---

# vetor-minimo: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de contar no vetor-minimo, para qualquer fala. O arquivo
detalhado (números, paleta, formas, comandos) é `sistema/modelos/vetor-minimo/vetor-minimo.md`; o método comum de todas
as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/vetor-minimo/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a dos
"modelos de edição", em que cada boneco segura uma tela 9:16 que a varredura edita. Ele nunca é a história, a fila nem
o objeto do vídeo novo. Quem narra sobre constância na academia recebe bonecos com halteres, não cinco bonecos com
telas de vídeo e outra voz.

## Quando usar

- **Sim:** uma tese de uma frase sobre atitude ou um processo (constância, tentar de novo, escolher, criar), narrada,
  de 8 a 35 s, que vira uma comparação ou uma corrente de passos com um resultado que dá razão a um lado.
- **Não:** lista, tutorial passo a passo com detalhe, notícia, prova com print (o `prova-print`), fala que precisa de
  rosto (o `rosto-telas`).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **Plano único, câmera parada, nenhum corte.** A história anda dentro de um quadro só. *Por quê:* o silêncio visual
   faz o pequeno evento gritar. *Não:* corte, zoom, troca de cena (só o deslize lateral de 1 s para uma 2ª cena).
2. **Preto puro, objetos pequenos, letra pequena.** Fundo `#000`, chão invisível que só existe pelo reflexo, cada
   personagem ou objeto entre 7 e 21% da largura, muito vazio em volta. *Não:* vinheta, textura, objeto grande.
3. **Personagens idênticos.** Bonecos palito brancos com volume suave; a única diferença entre eles é o que fazem e o
   que acontece com o objeto que seguram. *Não:* rosto, pessoa real, roupa, cor por personagem.
4. **A mesma ação repetida em compasso** até a diferença virar resultado. Na forma C, cada um chega pela borda e freia
   longo (2,0 a 2,4 s), e no instante da ação a varredura passa no objeto dele: o cinza cru vira giz aceso. *Por quê:*
   a repetição é o que faz o resultado ser lido como consequência.
5. **A cor é o juiz.** Tudo é branco e cinza até a virada; na virada (entre 60 e 76% da duração), verde aceso com halo.
   Vermelho só para o erro, azul só para quem persiste. *Não:* cor de enfeite, mais de duas cores vivas juntas.
6. **O objeto que se segura é a frase.** Cada personagem segura o objeto que a ideia dele nomeia (o fone para "ouvidos",
   a caixa para "biblioteca", o haltere para "treino"), desenhado em vetor com volume suave, cru antes da ação e aceso
   depois. *Por quê:* a metáfora precisa ser lida sem legenda. *Não:* a tela 9:16 só "porque o modelo tem".
7. **Uma frase curta por vez,** entre aspas tipográficas, em caixa alta pequena (Didact Gothic 34 px), digitada com a
   letra crescendo, em y 600, 4 a 7 palavras ditas. A narração não vira legenda corrida.
8. **O fecho.** Com comando na fala: apagão de 0,15 s e a moral em 2 linhas no preto (o comando com a palavra entre
   aspas). Sem comando: segura o resultado 3 a 4 s, sem texto.

## As peças (o que já existe em código)

Do molde `sistema/moldes/vetor-minimo/`:
- **A casa** (`src/Reel.tsx`): o palco (preto, chão em y 1190, reflexo, halos), o boneco palito com passo, freio,
  respiro e olhar, a digitação das frases e da moral, a virada, o apagão, o "escolhido" (`apenasUm`) e as prévias.
- **O kit do objeto** (`src/kit.tsx`): `COR` (a paleta), `coresDe(e)` (cru, aceso, verde, apagado), `Varredura`, as curvas
  (`suave`, `saida`, `vaiVem`, `mistura`) e `PALCO` (o tamanho máximo: 140 x 190, centrado em 0,0 acima da cabeça).
- **O objeto do aprovado** (exemplo com o porquê): `Tela`, a tela 9:16 que a varredura edita, cada uma de um jeito.
  Ela existe porque a fala era sobre modelos de edição de vídeo. Só volta quando a fala nova é sobre vídeos ou telas
  editadas.

## A invenção (o objeto que a fala pede e a casa não tem)

É o normal num tema novo. Para cada ideia da fala:
1. **Ache o objeto** que a ideia nomeia, simples o bastante para ser lido pequeno (fone, caixa, haltere, semente).
2. **Ache a ação:** o que muda nele no instante da palavra (acende, abre, cresce, nasce).
3. **Desenhe em `src/telas/<Nome>.tsx` da pasta do vídeo**, com o kit: centrado em (0,0), cru (`COR.c2`, `COR.c3`)
   antes da ação, aceso (`coresDe(e).aceso`) depois, com o halo de borda (`brilho`) e a `Varredura`. Registre em
   `src/telas/index.ts` e use no plano: `chegada(comp='Nome', ..., acao=p('palavra'))`.

**Exemplo 1 (fala que o aprovado não tem):** *"Todo mundo começa a treinar. Poucos voltam na segunda semana."* Forma A
(duelo): dois bonecos lado a lado com o mesmo haltere cru; os dois erguem no compasso; um desacelera e para; o outro
segue, e na virada ("poucos") o haltere dele acende verde. Objeto novo `Haltere`.

**Exemplo 2:** *"Uma semente não vira árvore no primeiro dia."* Forma C: três bonecos chegam com um vaso; em cada
chegada o broto do vaso cresce um pouco mais (a ação é crescer); na virada a árvore do último acende verde. Objeto novo
`Vaso`.


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   acha o objeto de cada chegada pelo `comp='Nome'` e cobra o dono dele na fala.
2. **Todo objeto tem dono:** no `plano.md`, a linha da chegada diz o nome do objeto (`Fone`, `Caixa`...) e a palavra dita
   entre aspas que pediu ele, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/vetor-minimo/referencia/folha.jpg`: *mesmo modelo?* (preto, bonecos,
   reflexo, frase digitada, verde na virada) **sim**; *mesmo vídeo?* (mesmo objeto, mesmas frases, mesma fila) **não**.

## O caminho (os comandos estão no `vetor-minimo.md` §9)

1. Ler esta skill e o `vetor-minimo.md`. 2. `tools/novo-video.py vetor-minimo <gravação> <AAAA-MM-DD-tema>`: o plano
nasce vazio (preto e voz). 3. Ler a fala (`src/palavras.json`), achar a frase-tese e a de virada, escolher a forma.
4. `plano.md` com a história e uma linha por chegada (objeto + palavra). 5. O bloco O PLANO de `scripts/plano.py` e
os objetos em `src/telas/`; rodar `scripts/plano.py`. 6. `node scripts/checar.mjs` até `sem problemas`.
7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha lado a lado. 9. Som, render, mixagem, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- A tela 9:16 editada, as prévias ou o "apenas um" "porque o modelo tem": só com o mesmo porquê na fala.
- Corte, câmera que anda, fundo que não é preto, objeto grande, personagem com rosto.
- Frase que não foi dita, mais de 7 palavras, legenda corrida, texto fora de x 60 a 940 (G19).
- Cor viva antes da virada, fora do "você" e do erro (vermelho).
- Objeto novo dentro do molde (ele mora na pasta do vídeo). O nome do modelo na tela (G33).
