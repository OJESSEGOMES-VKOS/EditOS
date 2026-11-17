---
name: imagem-por-palavra
description: >
  Modelo de edição imagem-por-palavra do EditOS: a pessoa falando, a legenda curta que se escreve na voz, a palavra
  gigante encostada nas pequenas e, com material, uma imagem por palavra concreta. Use quando pedirem "edita no
  imagem-por-palavra", "no superdopamina" ou "uma imagem a cada palavra".
---

# imagem-por-palavra: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no imagem-por-palavra, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/imagem-por-palavra/imagem-por-palavra.md`; o método
comum de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O modelo ainda não tem vídeo aprovado. Os exemplos são a vitrine (`oficina/2026-11-03-superdopamina01-vitrine/`, a fala
do "100% editado pelo Claude" com 20 fotos geradas) e a v3 só com a gravação (`oficina/2026-11-07-rc-imagem-por-palavra-v3/`).
Os dois mostram o jeito aplicado a uma fala. Nenhum é o roteiro, a sequência nem a lista de imagens do vídeo novo: quem
grava sobre a padaria dele recebe a padaria em imagem-por-palavra, não a claquete, o fogo e o futebol da vitrine.

## Quando usar

- **Sim:** uma pessoa falando para a câmera (9:16), fala de 20 s a 90 s, com palavras concretas que dá para mostrar
  (um nome, um lugar, um objeto, uma ação) e um ou dois termos que carregam o tema. O vídeo de mais estímulo da casa.
- **Também sim, sem material nenhum:** o modelo funciona só com a gravação (camada (a), abaixo). O pulso vem da trava
  gigante e do reenquadre.
- **Não:** fala emocional do começo ao fim (tela e gigante atrapalham: `pregacao`); vídeo que é prova atrás de prova
  (`prova-print`); fala que pede encenar a frase com interface (`interface-encenada`); uma imagem por frase, devagar
  (`minidocumentario`).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

**(a) A legenda e a pessoa, que valem com qualquer material**
1. **A pessoa como foi gravada é a base.** Fundo real, sem cor, sem recorte (G6), em corte seco. Pelo menos 50% do vídeo
   (o checador cobra); no normal, 70 a 90%. *Por quê:* quem fala é a pessoa; a imagem é recompensa, não papel de parede.
   *Sim:* o gancho inteiro (G29), opinião, a virada dita na cara. O reenquadre (aberto 1,0 / fechado 1,25 / close 1,5,
   puxado do queixo) só com motivo na fala: começo de explicação, pergunta para quem assiste, troca de assunto.
2. **A legenda é o pedaço que está sendo dito, não a frase empilhada.** Inter Tight 900, 68 px, branca, centrada, logo
   abaixo do queixo, um lugar só. Cada palavra estala na voz, no lugar já reservado. Bloco de 1,5 s, até 2 linhas, nunca
   passa do ponto (G9, G14). *Por quê:* quem assiste lê junto com a voz e não perde o fio quando a imagem troca.
3. **A trava: o termo que importa ao tema vira gigante por cima da gravação, com as pequenas encostadas.** As de antes em
   cima, alinhadas à esquerda dela; as de depois embaixo, alinhadas à direita; topo fixo no peito. 55 a 92% da largura,
   um tamanho no vídeo, entra com soco na voz. *Sim:* uma por trecho forte, ~1 a cada 5 a 8 s: o número dito, o nome do
   que se compara, a palavra da virada, o comando do fim. *Não:* palavra de ligação, frase sem peso, pontuação dentro.
   *Conta antes:* a gigante só cabe se as pequenas do bloco somam no máximo 2 linhas (1 depois). Termo de duas palavras
   longas não cabe a 55%: escolha a palavra que carrega a ideia ("extrema" em "com extrema precisão").
4. **Cartão preto é raro.** Só com `porque` no plano: respiro tipográfico pedido pela fala, ou rosto que cobriria o texto.
   Sempre com a gigante, o herói ou a tarja dentro; no máximo 4 s.
5. **O fecho:** a palavra do pedido como gigante ("ÁUDIO", "link"), em maiúscula quando foi dita como comando.

**(b) A faixa de imagem, que só existe com material**
6. **Uma imagem por palavra concreta, no quadro da palavra.** Corte seco 1 quadro antes do som; a imagem fica até a
   próxima palavra concreta (0,17 a 0,6 s) e anda sempre (empurra, recua, gira, desliza). *Por quê:* a recompensa "ele
   disse orelha, vi a orelha". Palavra de ligação não ganha imagem.
7. **A legenda atravessa o corte de imagem.** A imagem troca por baixo; o bloco fica parado no lugar dele.
8. **Em ondas, não o vídeo todo.** A onda entra no trecho ligado ao tema que tem o que mostrar, com 1,8 a 2,6 trocas por
   segundo dentro dela (o checador reprova abaixo de 1,4), e devolve a pessoa na cena seguinte. Uma imagem sozinha só
   passa se for curta (até ~0,7 s): imagem longa e solta não é deste modelo.
9. **Sem material, nada fingido.** Sem arquivo, a palavra fica com a pessoa ou com a trava; a falta vai para o
   `material/PEDIDO.md` e para o recado.

**Os três sinais, mudo, em 1 segundo:** o texto curto e centrado que se escreve na voz; a gigante com as pequenas nos
cantos; com material, a imagem trocando a cada palavra concreta.

## O material (G7, os três modos)

O dono (ou quem compra) diz o modo de cada vídeo; sem dizer nada, vale **só materiais**.
- **Só materiais (o padrão):** só o que a pessoa deu: fotos dela, prints com origem, logo, documentos, quadros da própria
  gravação. Nada gerado, nada buscado. Print, logo e documento entram com `"caber": true` na lista: inteiros, num quadro
  acima da legenda, sem cortar (foto 9:16 cobre a tela). Pouco material? Ondas curtas onde ele existe, e o resto é a
  camada (a).
- **Livre** ("faz o que der"): os materiais mais busca de foto com licença aberta (`kit/buscar.py`) e geração
  (`scripts/material.py --gerar`, ~4 créditos por imagem; gente real só de foto real).
- **Indicado** ("materiais e API só"): os materiais mais exatamente o que ele listou.
O modo vai no `cenas.json`; nos modos livre e indicado o recado lista o que foi gerado ou buscado.

## As peças (o que já existe em código)

Do molde `sistema/moldes/imagem-por-palavra/` (a lógica em `src/modelo.ts`, o desenho em `src/Reel.tsx`):
- **A legenda e a trava** (automáticas a partir da fala; `quebras` e `picos` no plano). `quebrasPadrao()` divide a fala
  sozinha em blocos curtos (o começo vazio já usa).
- **Os planos da faixa:** `PESSOA` (ABERTO/FECHADO/CLOSE), `IMG` (foto que cobre, ou print inteiro com `caber`),
  `RAJADA` (lista dita), `ESTILOS` (verbo de velocidade, só em imagem), `MOSAICO` (quantidade, recapitulação, o fundo do
  fecho), `PAINEIS` (a própria gravação a 3x em "duas", prévia), `CARD` (raro).
- **Os picos e efeitos:** `GIGANTE`, `DIGITA` (ano, código, nome de produto), o herói (a frase-promessa, um por vídeo), a
  tarja (a virada que revela), a ponte (PNG recortado que atravessa os cortes), o flash (pico forte, 1 a cada ~8 s).
- **As paletas** NOITE (padrão), CREME_LIMA, SANGUE, e cores soltas (§0 e §7 do `imagem-por-palavra.md`).

Este modelo não tem tela livre desenhada em código, de propósito: a linguagem dele é foto por palavra e tipografia, não
ilustração. A invenção aqui é escolher a palavra, a imagem do material e o termo da trava.

## A invenção (o vídeo que o exemplo não tem)

Para cada trecho da fala nova (G28):
1. **Ache as palavras concretas** do trecho ligado ao tema. Tem material da pessoa para elas? Então a onda entra ali.
2. **Ache o termo do trecho.** É o que importa ao tema? Vira a gigante, se o bloco der lugar (conte as linhas).
3. **Decida o enquadre** pelo que a frase faz (explica, pergunta, vira).
4. **Escreva** a lista em `src/imagens.json` (cada imagem presa à palavra dela) e o bloco O PLANO de `src/plano.ts`,
   com `w('palavra')`.

**Exemplo 1 (só materiais, a prova de 2026-11-17):** a fala do earshot ("o seu Claude não tem ouvidos... um repositório
gratuito... ele vai analisar o seu vídeo... criar algo novo"), com o que a pasta do vídeo tinha: o logo e a orelha do
filme de lançamento, os prints do repositório, a leitura que o earshot fez e quadros da gravação. O gancho inteiro na
gravação; a orelha em "super ouvidos" e os quadros da gravação se montando em "editar os seus vídeos"; o logo em
"earshot" e o print em "repositório"; a leitura em "analisar" e os quadros em "vídeo"; o print em "criar algo". Trava em
"extrema", "sonoros", "própria" e "ÁUDIO". Pessoa em 82%. Nada de claquete, fogo, futebol, herói ou cartão da vitrine.

**Exemplo 2 (sem material nenhum):** *"Eu abri a padaria com dois mil reais. Hoje são três fornadas por dia."* Pessoa
fechado no gancho; reenquadre para close em "Hoje"; trava "dois mil" na 1ª frase (o número dito, G10) e "fornadas" na
2ª. Nenhuma imagem: a falta (foto do forno, da vitrine) vai para o `PEDIDO.md`. Com as fotos, uma onda curta em "três
fornadas": as três fotos do forno a 0,25 s cada.

## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele lê o
   bloco O PLANO de `src/plano.ts`: texto entre aspas ali dentro é só o que é dito.
2. **Toda peça tem dono:** no `plano.md`, a linha da cena nomeia a peça (`picos`, `heroi`, `tarja`, `ponte`, `flash`) e a
   palavra dita entre aspas que pediu ela, com o porquê. Cada imagem tem dono pela `palavra` em `src/imagens.json` (o
   checador recusa imagem presa a outra fala: as do aprovado não entram nem esquecidas).
3. **Folha lado a lado** com a vitrine: *mesmo modelo?* (legenda, trava, ritmo da imagem) **sim**; *mesmo vídeo?*
   (mesmas imagens, textos, ordem) **não**.

## O caminho (os comandos estão no `imagem-por-palavra.md` §9)

1. Ler esta skill e o `imagem-por-palavra.md`. 2. `tools/novo-video.py imagem-por-palavra <gravação> <AAAA-MM-DD-tema>
--sem-adaptar`: o plano nasce vazio (a pessoa e a legenda curta). 3. Esvaziar `src/imagens.json` (`{}`) e apagar
`public/img/` e `material/` que vieram do molde. 4. Ler a fala (`node scripts/conferir.mjs --palavras`) antes de olhar o
exemplo de novo. 5. `scripts/maos.py` (mãos no peito mudam onde o texto cabe). 6. A lista de imagens do material da
pessoa e o bloco O PLANO. 7. `node scripts/conferir.mjs` até `APROVADO`. 8. Cenas (`cenas.json` → `tools/decupar.py
--plano`), `tools/clone.py` até `SEM CLONE`. 9. Quadros e folha lado a lado. 10. Render, final, entrega.

## Nunca

- Começar do plano da vitrine ou copiar o bloco O PLANO de outro vídeo; deixar as imagens do aprovado na pasta.
- Gerar ou buscar imagem sem o dono dizer o modo livre ou indicado (G7); imagem fingida (o efeito tipográfico de
  reserva) como entrega.
- Imagem ou cartão no gancho (G29: abre na gravação original; a trava por cima dela pode); imagem sem palavra dita que a peça; gigante em palavra de ligação.
- Filtro, cor, recorte ou fundo trocado na pessoa (G6); estilos e negativo só nas imagens.
- Texto na tela que não foi dito, número diferente do dito, nome do modelo na tela (G10, G19, G33).
