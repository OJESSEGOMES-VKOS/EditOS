---
name: pagina-de-livro
description: >
  Modelo de edição pagina-de-livro do EditOS: a pessoa pensando em voz alta e a palavra-chave gigante, condensada e
  colorida pelo sentido, escrita do lado do rosto. Use quando pedirem "edita no pagina-de-livro", "corte de podcast de
  reflexão" ou "palavra gigante azul e vermelha".
---

# pagina-de-livro: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no pagina-de-livro, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/pagina-de-livro/pagina-de-livro.md`; o método comum
de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/pagina-de-livro/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude", com o fundo escuro recortado, o P&B e uma palavra gigante por frase (feito antes das regras
de 2026-11-05). Ele nunca é o roteiro, a sequência nem a lista de palavras do vídeo novo. Quem grava uma reflexão sobre
dinheiro recebe um pagina-de-livro sobre dinheiro: a palavra gigante é o termo dele, na cor do sentido que ele deu.

## Quando usar

- **Sim:** uma pessoa pensando em voz alta para a câmera (9:16), 15 s a 60 s: reflexão, conselho, um arco de tese,
  custo e virada. Algumas frases fecham num termo que pesa (um sonho, uma perda, uma resposta).
- **Não:** fala que precisa mostrar coisas (o `rosto-telas`); fala de impacto com letra de cinema (o `trailer`); fala
  calma em que nada deve aparecer além da legenda (o `pregacao`).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A página de livro sobre o rosto.** O vídeo normal, fundo e cor reais (G6), e a tela escreve a fala como uma página:
   texto pequeno, fino e branco em volta, e de vez em quando uma palavra gigante. *Por quê:* é o pensamento escrito ao
   lado de quem pensa. *Não:* o estúdio escuro recortado, P&B, vinheta ou âmbar sem ordem (são opções).
2. **A legenda é Poppins 46 branca giz, em zigue-zague.** 1 ou 2 linhas, a 1ª encostada à esquerda e a 2ª à direita, o
   trecho de peso em Poppins 600, cada palavra nascendo do desfoque no tempo da fala, topo em y 1050 no vídeo todo.
   *Por quê:* o zigue-zague é a página; o negrito é a ênfase de quem lê em voz alta. É a maior parte do vídeo.
3. **A palavra gigante é a assinatura.** Anton condensada, caixa alta, com a largura da linha pequena de cima, e a cor é
   o sentido: **azul `#0A64FC` o que se busca** (sonho, valor, ganho), **vermelho `#FD1701` o que dói** (custo, perda,
   limite, erro), **branco** a resposta neutra ou a 2ª palavra forte. Duas do mesmo bloco nunca da mesma cor.
   *Sim:* o termo que importa ao tema (G17), no máximo 3 posições de destaque por vídeo (G13). *Não:* uma por frase,
   advérbio, ligação; na dúvida, legenda.
4. **A palavra se revela letra a letra fora de ordem**, do desfoque, cerca de 30% delas piscam e voltam; na saída pisca
   3 vezes e some (ou some seco no corte). *Por quê:* é a palavra se formando na cabeça de quem fala.
5. **Dois jeitos de pôr o destaque.** **Bloco lateral** (o padrão): o rosto num lado (plano médio 1,45) e o bloco no
   outro, linhas alternando pequena / PALAVRA / pequena. **Palavra central gigante** (topo em 60% da altura): a
   conclusão de uma frase longa. Um bloco por vez: o destaque toma o lugar da legenda, nunca empilhados.
6. **Uma câmera vira vários planos, só com motivo.** Corte seco 2 quadros antes da palavra que o motiva: médio com o
   rosto do lado oposto ao bloco, close na palavra central, aberto numa virada (todo vídeo tem um aberto de 1,5 s ou
   mais). Dentro do plano a câmera fica parada. Nos 9 s iniciais, no máximo o plano que abre e mais um.
7. **Algo novo a cada 0,6 a 1,5 s** (a palavra seguinte nascendo), nunca mais de 2 s parado.
8. **O fecho é a chamada, se a fala tiver chamada:** chicote de 1 quadro, "comenta" pequeno e a palavra entre aspas
   gigante azul, o resto da fala na legenda da 2ª posição (y 1400). Sem chamada, sem chicote: a última frase fecha como
   as outras e o corte seco vem 0,2 s depois.

## As peças (o que já existe em código)

Do molde `sistema/moldes/pagina-de-livro/` (`src/Reel.tsx`, bloco O PLANO):
- `PECAS`: `{tipo: legenda, ...}` (a página, `pos: 1` ou `2`) e `{tipo: bloco, ...}` (o destaque), com as linhas
  `P(i, esq | dir | meio, p('texto'), p('peso', 'b'))` e `K('PALAVRA', i, azul | vermelho | branco, al, {casar})`.
- `CORTE` e `PLANOS` (`{de, zoom, fx, fy}`), `CHICOTE`; ajudas `c(i)`, `antes(i)`, `ler(i)`.
- Opções desligadas: P&B (`pb`), prévias, fundo desfocado ou recortado, música e efeitos.

**Não há tela livre neste modelo, de propósito.** Tudo na tela é a própria fala como página de livro: o aprovado não
tem nenhuma tela de conteúdo. A montagem de apoio com imagens (§6 do `pagina-de-livro.md`) só existe com material real e
pedido. A invenção aqui é escolher, na fala nova, o termo, a cor do sentido e o lado do bloco.

## A invenção (o destaque que a fala nova pede)

1. **Leia o arco da fala:** a tese, o custo, a virada, o fecho.
2. **Ache o termo que importa** em cada parte forte (no máximo 3): o substantivo que carrega a ideia.
3. **Dê a cor pelo sentido que a pessoa deu** (o que ela busca = azul, o que dói = vermelho, a resposta = branco).
4. **Escolha o jeito:** lateral num plano médio com o rosto do outro lado, ou central na conclusão de frase longa.
5. **O resto é legenda**, zigue-zague, o trecho de peso em 600.

**Exemplo 1 (fala que o aprovado não tem):** *"Eu passei dez anos correndo atrás de dinheiro. E perdi o que mais
importava: tempo com a minha filha."* Bloco lateral no gancho: "eu passei dez anos" / DINHEIRO (azul, o que ele
buscava). Corte para o aberto em "E perdi". Central: "o que mais importava" / TEMPO (vermelho, o que doeu) / "com a
minha filha". Por quê: "dinheiro" (o que se busca) e "tempo" (a perda). Nada de "100%", "QUALQUER" ou "EDIÇÃO".

**Exemplo 2:** *"Disciplina não é força de vontade. É sistema."* Central: "disciplina não é força de vontade" em
legenda, depois "É" / SISTEMA (branco: a resposta). Por quê: "sistema" (a conclusão da frase).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`.
2. **Todo destaque tem dono:** no `plano.md`, a linha da cena diz a peça (`bloco` lateral ou central, `CHICOTE`) e a
   palavra dita entre aspas que pediu ela, com o porquê e a cor do sentido.
3. **Folha lado a lado** com `sistema/modelos/pagina-de-livro/referencia/folha.jpg`: *mesmo modelo?* (Poppins fina
   em zigue-zague, Anton condensada colorida, revelação fora de ordem) **sim**; *mesmo vídeo?* (mesmas palavras, mesmas
   cores na mesma ordem) **não**.

## O caminho (os comandos estão no `pagina-de-livro.md` §9)

1. Ler esta skill e o `pagina-de-livro.md`. 2. `tools/novo-video.py pagina-de-livro <gravação> <AAAA-MM-DD-tema>`: o
plano nasce vazio (a gravação num plano aberto, sem palavra gigante). 3. Ler a fala (`src/palavras.json`). 4.
`plano.md` com o arco e o plano de cenas. 5. Montar o bloco O PLANO: legenda primeiro, depois os destaques e os planos.
6. `node scripts/cobertura.mjs` até zerar. 7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha lado a lado. 9.
Render, mixagem (só a voz), entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- "100%", "QUALQUER", "EDIÇÃO" ou o close extremo P&B porque "o modelo tem": só o que a fala nova pede.
- Palavra gigante em toda frase, duas da mesma cor no bloco, legenda e bloco empilhados, texto nos olhos ou na boca.
- Fundo recortado, P&B, brilho azul, âmbar, efeito sonoro ou música sem ordem (G6, G16).
- Outra fonte além de Poppins e Anton; escrever o que não foi dito (G19); o nome do modelo (G33).
