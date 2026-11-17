---
name: prova-print
description: >
  Modelo de edição prova-print do EditOS: a pessoa fala no vídeo normal e, no trecho que afirma algo com prova, corta
  seco para a vitrine escura com o print real grifado na palavra dita e o contador no número dito. Use quando pedirem
  "edita no prova-print", "a tela prova o que eu digo", "vídeo com print de prova".
---

# prova-print: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no prova-print, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/prova-print/prova-print.md`; o método comum de
todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/prova-print/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude", provada com prints do repositório do EditOS. Ele nunca é o roteiro, a sequência nem o
catálogo de telas do vídeo novo. Quem grava sobre a clínica dele recebe um vídeo prova-print com as provas da clínica
(a página, a avaliação, o painel dele), não o About do EditOS com outra pessoa.

## Quando usar

- **Sim:** uma pessoa falando para a câmera (9:16), 15 s a 90 s, apresentando uma ferramenta, um resultado, um serviço,
  quando **algumas frases afirmam algo que tem prova real** (um print de página, de avaliação, de painel, de post) e
  quem grava tem esse print ou a página é pública.
- **Não:** fala sem nenhuma prova (fica tudo na pessoa: vai para um modelo de rosto, como o `rosto-telas` ou o
  `autoridade`); fala que pede encenar interface ou objeto (o `interface-encenada` e o `rosto-telas` desenham; este modelo
  **não desenha interface**, só mostra o print real).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A pessoa no vídeo normal é a base.** A gravação crua, fundo real, sem zoom nem camada, legenda branca em y 1180.
   *Por quê:* quem afirma é a pessoa; a prova é a visita que confirma. *Sim:* o gancho (sempre, G29), contexto,
   opinião. *Regra:* a pessoa (normal + rosto fechado) é pelo menos metade do vídeo; no aprovado, 85%.
2. **A prova é a vitrine escura, sem rosto, em corte seco.** O card grande (x 80 a 960, y 250 a 1140, raio 26,
   contorno azul `#1781E2` de 4 px) com o **print real** dentro, sobre o próprio print borrado e escurecido. *Por quê:*
   o escuro sem rosto é o sinal mudo de "olha a prova"; duplicar a pessoa no card apaga esse sinal. *Sim:* o trecho
   que afirma algo que o print prova e pesa no tema (G28). *Não:* frase sem prova; prova inventada; a própria gravação
   no card; tela que dura mais de 5,5 s (quebre num corte entre palavras).
3. **O grifo corre na frase do print no instante da palavra dita.** Marca-texto azul a 30%, da esquerda para a
   direita em 0,35 s, `at: w('palavra')`. Vermelho só no defeito (problema → solução). *Por quê:* a pessoa diz, a prova
   acende junto. O grifo marca o trecho do print que diz o mesmo que a fala, nunca uma frase que a fala não sustenta.
4. **O número dito sobe no contador e para nele.** Pílula escura `#070C18`, número Inter 800 em `#68B7FC`, de 0 até
   **exatamente o número falado** em 0,75 s (G10). *Não:* número que só está no print e não foi dito (fica no print).
5. **O rosto fechado só em dois lugares.** A frase de emoção (a dor, o benefício, a virada: 1 a 2 s) e o fecho. Até 3
   cenas e 20% do vídeo. *Por quê:* o zoom marca a emoção; fora dela, vira tique.
6. **O fecho é o pedido de uma palavra.** Rosto fechado; a chamada pequena em Instrument Serif itálica e a palavra do
   pedido entre aspas, grande, amarela `#FDFC76`, **sem brilho**; as duas ditas. *Não:* fala que não pede comentário
   termina na pessoa.
7. **A legenda tem um lugar só e não repete a tela.** Inter 700, 66 px, até 2 linhas, o pedaço nasce inteiro com as
   palavras ainda não ditas apagadas e cada uma acende quando é dita; a palavra-chave em serifa itálica azul. O que o
   contador ou o comando mostram sai da legenda (PV4, G26); texto fixo some até 1 s depois da fala dele (PV5, G27).
8. **Nada parado.** O conteúdo do card aproxima 1,2% por segundo; a câmera do print só viaja (0,6 s) depois da prova
   lida (2,5 a 3 s). Entre duas vitrines seguidas, o card novo desliza da direita com borrão; senão sobe com mola.
9. **Prova real ou nada (G7, G25).** Todo print em `public/` com uma linha em `public/ORIGEM.md` (página, data, o que
   mostra). Sem print, a frase fica na pessoa e o número dito vai na legenda como palavra-chave. Faltou e só quem grava
   tem? Vira `PEDIDO.md`, fora do vídeo. Nome de terceiro num print (avaliação, comentário): desfocado antes.

## As peças (o que já existe em código)

Do molde `sistema/moldes/prova-print/`:
- **A casa:** a pessoa (`Pessoa`), o rosto fechado (`RostoFechado`, cena `ROSTO`), o fecho (cena `ROSTO` com `FECHO` +
  `comando()`), a legenda (`src/Legenda.tsx`, palavras-chave em `chave()`), os contadores (`contadores()`).
- **O kit da tela livre** (`src/ui.tsx`): `Vitrine` (o palco da prova: o card na zona segura sobre o print borrado),
  `Prova` (o print, as `vistas` da câmera e os `grifos`, `cor: 'vermelho'` no defeito), `ImgFundo`, `LARG_VITRINE`,
  `ContadorDa`, `Contador`, `Capitulo` (lista que a fala enumera), `Card`, `Palco` (o palco claro com a cabeça saindo do
  cartão, só com `fundo: 'recorte'`); as cores em `C` de `src/tema.ts`.
- **As telas do aprovado** (`src/Cenas.tsx`, exemplos com o porquê, `prova-print.md` §10): `gancho`, `criado`, `modelos`,
  `editar`, `vendo`, `previas`, `tres`, `outros`, `aprender`. Todas mostram prints do repositório do EditOS: só voltam
  se a fala nova fala do próprio EditOS, com a linha `<tela> = true` no plano.

## A invenção (a prova que a fala pede e a casa não tem)

É o normal num tema novo. Para cada trecho que afirma algo com força para o tema (G28):
1. **Ache a afirmação.** O que a frase diz que alguém pode duvidar? ("é gratuito", "tem 4,9 no Google", "dobrou").
2. **Ache a prova real.** Qual página ou print mostra isso? Do criador (`<perfil>/materiais/`) ou pública (o sistema busca).
   Capture estreito e em escala 3 (letra >= 30 px no card) e anote no `public/ORIGEM.md`. Sem prova: pessoa, e segue.
3. **Ache a palavra.** Em que palavra dita o grifo nasce? Qual número dito sobe no contador?
4. **Monte com o kit**, em `src/telas/<Nome>.tsx`: `<Vitrine>` com `<Prova vistas grifos>`; a câmera abre onde a prova
   mora e só viaja depois de lida. Registre em `src/telas/index.ts` e ponha no plano: `[VITRINE, corte(w('palavra que
   abre')), 'Nome']`. Texto escrito na tela, só o dito (G19); o print é a prova, não texto da casa.

**Exemplo 1 (fala que o aprovado não tem):** *"Minha clínica tem nota quatro vírgula nove no Google. Os pacientes
elogiam o atendimento."* A 1ª frase na pessoa até "nota"; a vitrine entra com o print real do Perfil da Empresa dela; o
contador sobe até 4,9 em "nove"; na 2ª frase o card desliza para o print de uma avaliação, nome do paciente desfocado,
grifo em "atendimento". Por quê: "quatro vírgula nove" e "elogiam" são afirmações que o print prova.

**Exemplo 2:** *"Esse plugin é gratuito e já tem mais de dez mil downloads."* Vitrine com a página pública do plugin;
grifo no "Free" em "gratuito"; o contador sobe até 10.000 em "dez mil", só se a página mostra pelo menos isso. Se não
houver print, a frase fica na pessoa com "dez mil" como palavra-chave na legenda.


## O teste do clone (antes do render)

1. `node scripts/cobertura.mjs` (na pasta do vídeo) até `APROVADO`: ele também grava `src/tempos.json`, o resumo das
   telas que o `tools/clone.py` lê.
2. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`.
3. **Toda tela tem dono:** no `plano.md`, a linha da cena diz o nome da tela como está no plano (`Repositorio`,
   `editar`...) e a palavra dita entre aspas que pediu ela, com o porquê.
4. **Folha lado a lado** com `sistema/modelos/prova-print/referencia/folha.jpg`: *mesmo modelo?* (pessoa ↔ vitrine
   escura, card azul, grifo, legenda, fecho amarelo) **sim**; *mesmo vídeo?* (mesmos prints, textos, ordem) **não**.

## O caminho (os comandos estão no `prova-print.md` §9)

1. Ler esta skill e o `prova-print.md`. 2. `tools/novo-video.py prova-print <gravação> <AAAA-MM-DD-tema>`: o bloco O PLANO
de `src/tema.ts` nasce vazio (a pessoa do começo ao fim). 3. `scripts/rosto.py`. 4. Ler a fala (`src/palavras.json`)
antes de olhar o exemplo de novo. 5. Juntar as provas (print + `ORIGEM.md`; o que falta vira `PEDIDO.md`). 6. Plano de
cenas (`cenas.json` → `tools/decupar.py --plano`), uma linha por cena com a palavra que pediu a tela. 7. Montar o bloco O
PLANO e as telas livres. 8. `cobertura.mjs` até `APROVADO`, `tools/clone.py` até `SEM CLONE`, `tools/decupar.py
--conferir`. 9. Quadros e folha lado a lado. 10. Render, mixagem, entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Pôr o README, o About ou a pasta de modelos do EditOS porque "o modelo tem": só se a fala fala do EditOS.
- Print inventado, interface desenhada no lugar do print, barra de navegador recriada, mockup (G25).
- Contador com número que não foi dito; grifo numa frase que a fala não sustenta (G10, G19).
- A própria gravação dentro do card da vitrine; rosto fechado fora da emoção e do fecho.
- Brilho na letra, sombra colada (G16); texto fora de x 60 a 940 e y 250 a 1500.
- Tela no gancho (G29), tela que fica depois da fala (G27), a mesma informação em dois lugares (G26).
- O nome do modelo na tela (G33).
