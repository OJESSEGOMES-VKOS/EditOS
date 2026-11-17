---
name: documental-dados
description: >
  Modelo de edição documental-dados do EditOS: narração sem rosto sobre uma prova real (gráfico de dado ou documento)
  que muda no tempo da voz. Use quando pedirem "edita no documental-dados", "vídeo dark com dados", "gráfico que conta
  com a narração" ou um documental com número contando e legenda de uma palavra.
---

# documental-dados: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no documental-dados, para qualquer narração. O
arquivo detalhado (números, posições, peças, comandos) é `sistema/modelos/documental-dados/documental-dados.md`; o
método comum de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo de exemplo (a vitrine `sistema/oficina/2026-11-03-documental01-vitrine/`, "a Bíblia em capítulos") é **uma
aplicação** desse jeito a uma fala. Ele nunca é o roteiro, o dado, a sequência nem o catálogo de telas do vídeo novo.
Quem narra sobre a inflação recebe um documental-dados sobre a inflação, com o dado dela; nunca as barras da Bíblia com
outra voz.

## Quando usar

- **Sim:** narração sem rosto (TTS da página ou a voz de quem publica), 30 s a 70 s, com uma prova real para mostrar:
  números ditos (contagens, anos, preços) ou um documento, mapa ou obra. Narração calma, perto de 2,4 palavras por
  segundo: a legenda é de uma palavra por vez.
- **Não:** fala com rosto (vai para um modelo de rosto); fala rápida (mais de ~3 palavras/s não cabe na legenda de uma
  palavra; a narração é escrita e gravada para este ritmo); tema sem prova nenhuma (vai para o `vetor-minimo` ou o
  `texto-e-objeto`).

## A personalidade (vale para qualquer narração)

1. **Uma imagem-mãe, nenhum corte.** Um gráfico feito por código a partir do dado (família A) ou um documento real
   (família B) fica na tela o vídeo quase todo e muda de estado. *Por quê:* a prova é a protagonista; cortar para outra
   imagem tira o peso dela. *Não:* trocar de imagem por frase (isso é o `personagem` ou o `minidocumentario`).
2. **Nenhum segundo parado.** Dentro da imagem algo muda a cada 0,3 a 1 s, preso a uma palavra dita: a barra acende, o
   marcador corre, o número conta. *Não:* movimento sem palavra (girar, pulsar, brilhar à toa).
3. **Número dito conta e para na palavra.** O contador nasce 1 a 2,5 s antes e chega no valor no início da última
   palavra do número. Na tela só o número como foi dito (G10). *Sem número dito, sem contador.*
4. **Três camadas de texto, sempre no mesmo lugar:** rótulo Poppins em caixa alta espaçada (y 368), título Playfair com
   uma palavra em itálico na cor de destaque (y 410 a 680), legenda de uma palavra em caixa alta (y 1270). O título é a
   frase-resumo com as palavras ditas (G19). O gancho já está escrito no quadro 0.
5. **Uma família de cor e uma cor de destaque.** A: preto e âmbar (`ouro`). B: pergaminho ou marrom, um por capítulo.
6. **Apagão antes do clímax.** Na pergunta curta perto de 62% (55 a 75%) tudo cai para 7%; a resposta acende no escuro.
   Sem clímax na fala, `apagao = null` com o motivo no plano.md.
7. **A fonte na tela.** O crédito do dado ou da obra entra no fecho e fica até o fim. Dado sem fonte não entra.
8. **Som discreto:** a cama sintetizada 16 dB abaixo da voz, um toque grave quando o contador para, um sopro no apagão.

**Os três sinais (mudo, em 1 s):** a prova real no meio da tela, o número grande em serifa contando, a legenda de uma
palavra em caixa alta. Nenhum deles é o tema da Bíblia.

## As peças (o que já existe em código)

Do molde `sistema/moldes/documental-dados/` (`src/Reel.tsx` desenha, `src/plano.ts` é o plano):
- **A imagem-mãe A:** barras de `src/dados.json` (`fala`, `o_que`, `unidade`, `fontes`, `itens` com `nome`, `valor`,
  `grupo`), sobre o eixo a 60% da altura, com reflexo, halo e um fio por unidade.
- **Os estados:** `barras` (acende, apaga, halo, varredura `IGUAL` ou `VALOR`), `marcas` (o marcador corre o eixo até
  o nome dito), `camera` (zoom para ler um detalhe), `reguas`, `divisao`, `pilha`, `apagao`.
- **As telas:** rótulo, título, `numeros` (um ou dois contadores), `semana` (cartões de rotina), e na B `ligacao` + `frase`.
- **A imagem-mãe B:** `documento` (arquivo, pontos que acendem no nome dito, fios que se desenham).
- **O som:** `scripts/som.py` (cama e efeitos pelo plano), `scripts/mixar.sh`.

As telas, os números, as barras com nome e o crédito da vitrine são **exemplos do aprovado com o porquê**
(`documental-dados.md` §10): a semana existe porque a fala transformou 1.189 em "três por dia"; a pilha, porque a fala
somou os evangelhos. Uma delas só volta quando a fala nova faz a mesma coisa.

## O material (G7, três modos; o dono diz qual vale para o vídeo)

- **Só materiais (o padrão):** só o que a pessoa deu. Família A com o dado dela (planilha, contagem que ela fez, a
  própria gravação medida), família B com o documento ou a foto dela. Nada de busca na internet nem imagem gerada.
  Sem dado nenhum: `itens: []` e o vídeo vive das telas (rótulo, título, número dito) sobre o fundo da família; o que
  falta vai para o `PEDIDO.md`, fora da peça.
- **Livre** ("faz o que der"): pode buscar dado aberto (conferido em duas fontes) e obra de domínio público com origem.
- **Indicado** ("materiais e API só"): os materiais mais exatamente o que ele listou.
Em qualquer modo: nunca imagem de IA no lugar de prova, nunca foto de pessoa real sem direito, nunca número sem fonte.

## A invenção (o estado que a fala pede e o exemplo não tem)

Para cada frase, pergunte: qual coisa a frase nomeia ou mede, e o que acontece com ela?
1. **Ache o dado da fala** (a coisa medida) e monte `src/dados.json` com ele e a fonte. O tipo de gráfico segue o dado:
   barras no molde; outro tipo se desenha no `src/Reel.tsx` **da pasta do vídeo**, com as mesmas peças e cores.
2. **Ache o verbo** de cada frase: nomear acende a barra, somar empilha, comparar divide, perguntar apaga, analisar
   corre o marcador, ler de perto dá zoom.
3. **Ponha no plano** (`src/plano.ts`, bloco O PLANO), cada estado preso a uma palavra dita (`[índice, "palavra"]`).

**Exemplo 1 (fala que o exemplo não tem):** *"Em 2010 o pão custava trinta centavos. Hoje custa um real."* Dado da
pessoa (o preço por ano, com a fonte dela) em barras; o marcador corre até 2010 em "2010"; contador 0 → 30 em
"centavos" com sub *centavos*; a varredura `VALOR` acende os anos até "hoje" e o contador vai a 1 em "real". Nada de
Bíblia, semana ou pilha.

**Exemplo 2 (só materiais, sem dado):** *"Meu avô atravessou o país de trem em 1950."* Família B com a foto do bilhete
que a pessoa deu (`documento`), um ponto acende em "trem", o título "Atravessou|o *país.*", o crédito "Acervo da família".


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) sai `SEM CLONE`.
2. **Toda peça tem dono:** no `plano.md`, a linha da cena diz o nome da peça como está no plano (`apagao`, `camera`,
   `marcas`, `reguas`, `divisao`, `pilha`, `documento`) e a palavra dita entre aspas que pediu ela, com o porquê.
3. **O dado é do vídeo:** `node scripts/checar.mjs` reprova `src/dados.json` com a fala de outro vídeo.
4. **Folha lado a lado** com a da vitrine (`oficina/2026-11-03-documental01-vitrine/conferencia/folha-1s.jpg`):
   *mesmo modelo?* (camadas de texto, imagem-mãe, legenda de uma palavra) **sim**; *mesmo vídeo?* (mesmo dado, mesmos
   títulos, mesma ordem) **não**.

## O caminho (os comandos estão no `documental-dados.md` §9)

1. Ler esta skill e o `documental-dados.md`. 2. Roteiro na espinha da §3, o dado com fonte, a narração no ritmo.
3. `tools/novo-video.py documental-dados <narração> <AAAA-MM-DD-tema> --sem-adaptar`: o plano nasce vazio. 4. `src/dados.json`
do vídeo (com `"fala"`). 5. Plano de cenas no `plano.md`, uma linha por estado com a palavra que pediu. 6. O bloco O
PLANO de `src/plano.ts`. 7. `node scripts/checar.mjs` até `sem problemas` (grava `src/plano.json` para o som).
8. `tools/clone.py` até `SEM CLONE`, `tools/decupar.py --conferir`. 9. Quadros e folha lado a lado. 10. Som, render, mixagem.

## Nunca

- Começar do plano da vitrine, copiar o bloco O PLANO de outro vídeo ou deixar o `src/dados.json` do exemplo.
- Número na tela que não foi dito, dado sem fonte, nome que a fala não diz (G10, G19).
- Imagem gerada ou buscada no modo só materiais; foto de pessoa real ou imagem de IA como prova.
- Corte de imagem, tela parada mais de 1,5 s, efeito sonoro chamativo, contorno ou sombra colada na letra.
- O nome do modelo na tela (G33), travessão.
