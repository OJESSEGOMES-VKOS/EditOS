---
name: anuncio-canvas
description: >
  Modelo anuncio-canvas do EditOS: anúncio narrado sem apresentador, cada frase vira peças soltas num canvas infinito
  e a câmera passeia sem corte. Use quando pedirem "faz no anuncio-canvas", "anúncio no canvas", "anúncio com câmera
  passeando" ou um anúncio em motion de um produto novo.
---

# anuncio-canvas: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de montar um anúncio no anuncio-canvas, para qualquer produto
e qualquer narração. O arquivo detalhado (números, câmera, opções, comandos) é
`sistema/modelos/anuncio-canvas/anuncio-canvas.md`; o método comum de todas as skills é `sistema/JEITO.md`; as regras
do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O anúncio aprovado (`sistema/modelos/anuncio-canvas/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a
do app de agenda "Marcaí" (fictício), com balões de mensagem, a hora da noite, o relógio parado, o celular, o painel,
o 12 que conta e os neons dos públicos. Ele nunca é o roteiro, a sequência nem o catálogo de peças do anúncio novo.
Quem pede um anúncio da sorveteria dele recebe um anuncio-canvas sobre a sorveteria, não o anúncio do Marcaí com o
nome trocado.

## Quando usar

- **Sim:** anúncio narrado de 15 s a 60 s (produto, serviço, app, oferta), só a voz, com dor, virada (o produto
  aparece), como funciona, ganho e fecho com o nome. Funciona com narração gravada ou gerada com o ok de quem anuncia.
- **Não:** vídeo com a pessoa falando para a câmera (vai para um modelo com rosto, como o `rosto-telas`); anúncio que é
  uma prova atrás da outra em print (o `prova-print` faz melhor); anúncio que pede cortes secos e respiros claros em
  telas fixas (o `anuncio-neon`).

## A personalidade (vale para qualquer anúncio)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **Canvas infinito, câmera que nunca corta.** As peças moram soltas num plano escuro, cada uma no seu ponto e na
   sua profundidade, e a câmera passeia (fluxo, curva ou chicote, sorteio fixo), desacelera no meio da frase e acelera
   entre as frases. *Por quê:* é o anúncio que flui sem tela trocando; a viagem é a transição. *Não:* corte, íris,
   borrão de cena ou estação fixa.
2. **Uma frase por vez, com ar em volta.** Cada frase é um grupo de no máximo 4 ou 5 peças em volta do keyframe dela
   (x de -300 a 320, y de -520 a 460). *Por quê:* a frase da vez é a única coisa no quadro. *Não:* encher de enfeite,
   partícula, selo solto ou borda esfumada.
3. **A palavra é o design.** Cada frase em 2 a 4 linhas de tamanhos misturados: a ligação fina (Sora 400, 52 a 64 px)
   e a palavra de peso grande (Sora 800, 96 a 130 px). Toda palavra nasce no instante em que é dita, de um desfoque com
   deslize curto. *Por quê:* o anúncio é lido sem som também. *Não:* legenda corrida embaixo; texto que não é dito.
4. **O clima é o fundo inteiro.** Fundo liso com uma mancha suave que muda com a frase: marca (escuro com a cor da
   marca), dor (vermelho), noite (azul), claro (respiro). *Por quê:* a cor conta a emoção antes da palavra. *Sim:* dor
   na dor, claro no alívio e no "como funciona". *Não:* vermelho fora da dor.
5. **Um objeto que faz o que a frase diz.** A peça representa o ato, no instante da palavra: o risco vermelho no que
   deu errado, o marca-texto no que dá certo, o check que cai, o número que conta, a coisa que corta. *Por quê:* a
   tela encena, não ilustra (G19). *Não:* objeto parado de enfeite, ou objeto de outra frase.
6. **A virada entra por chicote**, com o ícone de vidro da cor da marca e o nome se montando. Uma vez por anúncio,
   nunca na primeira frase nem no fecho.
7. **Destaques contados.** Pílula só no termo protagonista (uma ou duas no anúncio), glitch só na palavra de dor, no
   tom dor. *Não:* uma pílula por frase.
8. **A cor é de quem anuncia.** A paleta `C` de `src/tema.ts` é a marca dele (logo, site, perfil); sem marca dada, uma
   paleta própria daquele anúncio, nunca o violeta do aprovado. O vermelho fica só para a dor.
9. **O fecho é o nome.** A marca de quem anuncia se monta (o logo real, ou o nome em `Wordmark`), a última frase dita
   entra embaixo e tudo fica até o fim. Oferta embaixo só se foi dita.
10. **Nada se inventa.** Logo, print, preço, prazo, nome de cliente, número: só os reais de quem anuncia. Sem print,
    a tela genérica (`TelaGenerica`) ou um desenho sem dado. Marca de terceiro citada na fala vira só texto.

## As peças (o que já existe em código)

Do molde `sistema/moldes/anuncio-canvas/`:
- **A casa (em `src/Canvas.tsx`):** a câmera e o fundo no tempo (você não mexe), `El` (prende a peça à frase:
  `<El k={frase} x y z rot fica>`), `L` (a linha de palavras ditas: `<L de txt tam cor peso />`), `Pop` (entra com
  mola), `Tela` (liga uma tela pelo nome: `<Tela comp="Nome" />`).
- **O kit da tela nova** (`src/kit.tsx`): `Palco` (a caixa da peça, até 880 x 1000 px, já com a entrada da casa),
  `Cartao` (vidro escuro ou cartão claro), `IconeVidro` com um `G.*` (cal, check, lua, sol, link, sino, cadeado...),
  `Pilula`, `Glitch`, `Risco`, `MarcaTexto`, `Fone` (celular com o print real), `Neon`, `Wordmark`, `Notif` e `Bolha`
  (só conversa ou aviso real), `frente`, `passou`, `w`/`wf` (o tempo da palavra) e as cores em `C`.
- **As telas do aprovado** (exemplos com o porquê, `CASA` em `src/Canvas.tsx` e `anuncio-canvas.md` §4): `Hora2347`,
  `Data15`, `Relogio`, `Campo`, `SinalPago`, `PainelImg`, `Doze`, `Botao`, `Marca`. Uma delas só volta quando a fala
  nova diz a mesma coisa que fez ela existir lá: o relógio de arco vermelho volta se a fala fala de hora perdida; o
  número que conta, se a fala diz um número. As que escrevem texto fixo (23:47, "Sinal pago", "Teste grátis", o
  "marcaı") só com esse texto dito, e a `Marca` nunca num anúncio de outra marca.

## A invenção (a peça que a fala pede e a casa não tem)

É o normal num anúncio novo. Para cada frase:
1. **Ache o objeto.** Qual coisa concreta a frase nomeia? (o pote de sorvete, a fila, o ouvido, a estante).
2. **Ache o verbo.** O que acontece com ela na frase? (derrete, some, é riscado, sobe, nasce, ganha check).
3. **Escolha o tom** da frase (marca, dor, noite, claro) e as linhas: a palavra de peso grande, a ligação fina.
4. **Monte com o kit**, dentro do `<Palco>`: o objeto em vidro ou cartão, o verbo como um movimento da casa (mola,
   risco, marca-texto, check, contagem, anel), preso à palavra dita (`w('palavra')`). Sem texto dentro, ou só o dito.
5. **Escreva em `src/telas/<Nome>.tsx`** da pasta do vídeo, registre em `src/telas/index.ts` e ponha no plano:
   `<El k={3} x={0} y={-150}><Tela comp="Nome" de={w('palavra')} /></El>`.

**Exemplo 1 (anúncio que o aprovado não tem):** *"Seu sorvete derrete antes de chegar? Agora tem a caixa térmica da
Gelato. Chega firme, do jeito que saiu."* (produto ilustrativo). Frase 1, tom dor: um pote de vidro que afunda e
escorre em "derrete", glitch em "derrete". Frase 2, a virada por chicote: o ícone de vidro com a caixa e o nome
"Gelato" se montando. Frase 3, claro: o pote de pé de novo com o check em "firme". Nada de balão, relógio, celular ou
neons do Marcaí.

**Exemplo 2:** *"Três cursos, um preço só: inglês, espanhol e francês."* (ilustrativo). Três cartões de vidro que
entram um por palavra ("inglês", "espanhol", "francês"), cada um num ponto do canvas, e "um preço só" em pílula,
porque é o termo protagonista. O preço só aparece se foi dito.


## O teste do clone (antes do render)

1. `node scripts/conferir.mjs` (na pasta do vídeo) até `0 erros`: o plano é desta fala, nenhuma frase vazia nem com
   menos de 1,5 s, toda tela pedida existe e está registrada, toda palavra pedida e escrita é dita.
2. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`.
3. **Toda peça tem dono:** no `plano.md`, a linha da frase diz o nome da tela (`Onda`, `Estante`...) e a palavra dita
   entre aspas que pediu ela, com o porquê.
4. **Folha lado a lado** com `sistema/modelos/anuncio-canvas/referencia/folha.jpg`: *mesmo modelo?* (canvas sem corte,
   frase com ar, tipografia misturada, fundo que muda de clima, vidro e brilho) **sim**; *mesmo anúncio?* (mesmos
   objetos, textos, cor, ordem) **não**.

## O caminho (os comandos estão no `anuncio-canvas.md` §9)

1. Ler esta skill e o `anuncio-canvas.md`. 2. `tools/novo-video.py anuncio-canvas <narração.mp4> <AAAA-MM-DD-tema>`:
o plano nasce vazio (só o fundo e a câmera, uma frase por ponto final). Apague da pasta do vídeo `public/som.m4a`,
`reserva.png`, `confirmado.png` e `painel.png` (são do aprovado). 3. Ler a fala (`src/palavras.json`) antes de olhar o
exemplo de novo. 4. A paleta de quem anuncia em `src/tema.ts`. 5. `plano.md` com uma linha por frase. 6. O bloco O
PLANO: `FRASES`, `VIRADA`, a `Coreografia`, e as telas novas em `src/telas/`. 7. `conferir.mjs` até `0 erros`.
8. `tools/clone.py` até `SEM CLONE`. 9. Quadros (`scripts/quadros.mjs`) logo depois da 1ª palavra e logo antes da
viagem de cada frase, e a folha lado a lado. 10. Render, `finalizar.sh`, entrega.

## Nunca

- Começar do plano do aprovado, copiar a `Coreografia` de outro vídeo ou trocar só o nome do produto.
- Pôr balões, a hora 23:47, o relógio, o celular, o painel, o 12, os neons ou a marca do Marcaí porque "o modelo
  tem": só com o mesmo porquê na fala nova.
- Inventar logo, print, preço, prazo, nome, depoimento ou número (G10, G19, G25); imitar logo de terceiro.
- Usar o violeta do aprovado num anúncio de outra marca; vermelho fora da dor.
- Corte seco, íris, tela parada; mais de 5 peças numa frase; pílula em toda frase.
- Desenhar fora do `<Palco>`, ou tela nova dentro do molde (ela mora na pasta do vídeo).
- O nome do modelo na tela (G33). Travessão no texto.
