---
name: youtube-didatico
description: >
  Modelo youtube-didatico do EditOS: a pessoa falando, a câmera que vira janela e a tela de gelo que responde à fala,
  com um acento amarelo só. Use quando pedirem "edita no youtube-didatico", "no youtubeedition01" ou "vídeo didático
  estilo YouTube".
---

# youtube-didatico: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no youtube-didatico, para qualquer fala. O arquivo
detalhado (números, medidas, opções, comandos) é `sistema/modelos/youtube-didatico/youtube-didatico.md`; o método comum
de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/youtube-didatico/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude", em que o criador mostra os próprios modelos. Ele nunca é o roteiro, a sequência nem o
catálogo de telas do vídeo novo. Quem grava sobre a clínica dele recebe um vídeo youtube-didatico sobre a clínica, não a
grade de modelos com outra pessoa.

## Quando usar

- **Sim:** uma pessoa explicando para a câmera (9:16 ou 16:9), tom de aula curta ou tutorial, de 15 s a vídeo longo,
  quando algumas frases têm uma coisa para mostrar, provar ou desenhar (um conceito, um passo, um número com prova, uma
  comparação, uma lista).
- **Não:** fala emocional do começo ao fim (rosto puro, outro modelo); prova atrás de prova em print (`prova-print`);
  ação no computador encenada com interface (`interface-encenada`); vídeo que pede legenda corrida de verdade e nada
  mais (um modelo de legenda).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A pessoa é a base.** Cheio ou punch-in, a gravação com o fundo real (G6), rosto na tela 97% do tempo. *Por quê:* é
   aula com gente, não slide. *Sim:* o gancho (sempre, G29), opinião, conselho, emoção. *Não:* telas somando mais de 1/3
   do vídeo (o checador cobra).
2. **A câmera vira janela, com motivo.** Punch-in de 1,12 a 1,2 na frase-chave, na troca de ideia ou para esconder um
   corte; o plano gira (-14°, borrão) até o cartão do canto quando a tela de gelo entra, e volta reto. *Não:* zoom
   aleatório, zoom com som, punch em toda frase.
3. **A tela de gelo responde à frase no mesmo segundo.** Fundo `#F8F8F8`, a coisa por cima, o rosto no cartão de
   370x500 no canto de baixo à direita. Ela entra porque a frase precisa da coisa para ser entendida (a gramática da
   seção 4 do `.md`: dêitico → a coisa; conceito → palavra e ícone; processo → tracejado da esquerda para a direita;
   comparação → dois lados; negação → risco vermelho; conta → itens entrando; número com prova → o contador até o
   número dito). *Na dúvida:* esta frase é crucial para entender? Se não, rosto.
4. **Um acento só, amarelo `#FCDC00`.** A palavra-chave na frente da pessoa, o fio, o contorno, o ponto, a seta. Tinta
   `#0A0A0A` no gelo, branco na frente da pessoa, vermelho `#FC0000` só no que é negado. Nada de outra cor.
5. **Tipografia grande, sem legenda corrida.** Inter Tight 900/800/700, caixa alta, entreletra apertada. Só a frase de
   efeito (com o punch), o título de capítulo (com o fio) e a palavra do pedido. *Não:* parágrafo na tela.
6. **O jeito de entrar é um só.** Do borrão para nítido em 0,2 s, subindo e crescendo de 94% a 100%, cada palavra quando
   é dita; cartões com borrão de movimento de baixo. A tela de gelo aproxima até 104% enquanto fica. Nada pisca, treme
   ou brilha.
7. **O texto é o que foi dito.** Número e nome como foram falados (G10), nada escrito que a pessoa não disse (G19),
   nunca o mesmo texto em dois lugares na mesma hora (G26), nunca o nome do modelo (G33).
8. **O fecho é o pedido quando a fala pede.** "comenta X": degradê escuro na base, o comando em branco, a palavra
   gigante em amarelo e a seta. Fala sem pedido termina no rosto, 0,7 s depois da última palavra.

## As peças (o que já existe em código)

Do molde `sistema/moldes/youtube-didatico/`:
- **A casa** (`src/Video.tsx`, ligada no bloco O PLANO de `src/plano.ts`): a câmera e as poses (`POSE.cheio`, `punch`,
  `cartao`, `reel`, `baixo`), `FRASES` (frase de efeito na frente), `TITULOS` (capítulo com fio), `LISTA` (a conta no
  gelo), `CTA` (o pedido), e as que pedem material do criador: `GRADE`/`GRADES`, `MONTAGEM`, `PREVIAS`, `ESTE`, `REEL`.
- **O kit da tela livre** (`src/ui.tsx`): `Palco` (a área da grade, x 55 a 1025, y 90 a 1248, acima do cartão do rosto;
  todo desenho mora dentro dele), `Entra`, `Cartao`, `Palavras`, `Rotulo`, `Ponto`, `Fio`, `Risco`, `Contorno`,
  `Tracejado`, `Numero`, `Icone` (com `ICONES`, ou um caminho SVG próprio no mesmo traço), e as cores em `COR`.
- **As telas do aprovado** (exemplos com o porquê, `youtube-didatico.md` §12): a grade dos próprios vídeos, a montagem,
  a tela de reels, o título de capítulo, as prévias, o contorno "este aqui", o pedido. Uma delas só volta quando a fala
  nova diz a mesma coisa que fez ela existir lá: a grade, se a pessoa aponta os vídeos prontos dela (e os vídeos estão
  em `public/ex/`); a tela de reels, se cita a página ou a rede.

## A invenção (a tela que a fala pede e a casa não tem)

É o normal num tema novo. Para cada frase que é crucial para entender:
1. **Ache a função** (seção 4 do `.md`): mostrar, provar, explicar (conceito, metáfora, processo, comparação, conta,
   negação), listar, dar peso, chamar.
2. **Ache o objeto e o verbo.** Qual coisa a frase nomeia, e o que acontece com ela (é riscada, entra, segue a seta,
   ganha o contorno, conta até o número).
3. **Monte com o kit**, dentro do `<Palco>`: cartões brancos no gelo, ícone de traço, a palavra dita em 900, o ponto e o
   fio amarelos, cada movimento preso a uma palavra dita (`em`). O rosto vai para o cartão do canto no `de` (chave
   `[T.x, POSE.cartao, 0.38, true]`) e volta no `ate`.
4. **Escreva em `src/telas/<Nome>.tsx` da pasta do vídeo**, registre em `src/telas/index.ts` e ponha no bloco:
   `LIVRES = [{comp: 'Nome', de: T.a, ate: T.b, em: {...}, textos: {...}}];`.

**Exemplo 1 (fala que o aprovado não tem):** *"Pra fazer pão de fermentação natural, você mistura, espera doze horas e
assa."* Processo: três cartões brancos com ícone (tigela, relógio, forno) ligados pelo `Tracejado`, cada um entrando na
palavra dele ("mistura", "espera", "assa"); o `Numero` conta até 12 em "doze". O rosto no cartão do canto. Por quê: a
frase é um processo em etapas. Nada de grade, montagem ou reels.

**Exemplo 2:** *"A maioria acha que precisa de câmera cara. Não precisa."* A 1ª frase no rosto (opinião); na 2ª, o
ícone da câmera num cartão ganha o `Risco` vermelho em "Não", com a palavra "NÃO PRECISA" em 900. Por quê: negação
(seção 4: o ícone riscado). 1,5 s de tela e volta ao rosto com punch-in.


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Rode
   antes o `node scripts/checar.mjs` na pasta do vídeo: ele grava em `src/tempos.json` as telas livres que o clone.py
   confere.
2. **Toda tela tem dono:** no `plano.md`, a linha da cena diz o nome da parte ou da tela como está no plano (`FRASES`,
   `CTA`, `Processo`...) e a palavra dita entre aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/youtube-didatico/referencia/folha.jpg`: *mesmo modelo?* (gelo, tinta e
   amarelo, Inter Tight pesada, cartão do rosto no canto, jeito de entrar) **sim**; *mesmo vídeo?* (grade, montagem,
   reels, os mesmos textos e a mesma ordem) **não**.

## O caminho (os comandos estão no `youtube-didatico.md` §11)

1. Ler esta skill e o `youtube-didatico.md`. 2. `tools/novo-video.py youtube-didatico <gravação> <AAAA-MM-DD-tema>`: o
bloco O PLANO nasce vazio (só a pessoa, plano cheio). 3. Ler a fala (`src/palavras.json`) antes de olhar o exemplo de
novo. 4. Plano de cenas (`cenas.json` → `tools/decupar.py --plano`), uma linha por cena com a palavra que pediu a tela.
5. Montar o bloco O PLANO (os tempos `T`, as `chaves` e as partes) e as telas livres. 6. `node scripts/checar.mjs` até
`sem problemas`. 7. `tools/clone.py` até `SEM CLONE` e `tools/decupar.py --conferir`. 8. Quadros e folha lado a lado.
9. Render, mixagem, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Pôr a grade, a montagem, as prévias ou a tela de reels porque "o modelo tem": só com o mesmo porquê na fala e o
  material real do criador.
- Escrever na tela o que não foi dito, inventar número, marca ou interface (G10, G19, G25); interface recriada só a partir
  de print real.
- Outra cor de acento, legenda corrida por padrão, contorno ou brilho na letra, texto fora de x 60 a 940 e y 250 a 1500
  (a grade e a tela livre moram no `Palco`).
- Tela no gancho (G29), tela que fica depois da fala (G27), a mesma informação em dois lugares (G26), telas somando mais
  de 1/3 do vídeo.
- Desenhar fora do `<Palco>`, ou tela nova dentro do molde (ela mora na pasta do vídeo).
- O nome do modelo na tela (G33).
