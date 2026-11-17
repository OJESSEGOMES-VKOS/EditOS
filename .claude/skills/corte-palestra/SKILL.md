---
name: corte-palestra
description: >
  Modelo corte-palestra do EditOS: um pensamento inteiro recortado de pregação, palestra ou aula, legenda pequena e
  quieta e a palavra-resposta em serifa itálica, rara. Use quando pedirem "edita no corte-palestra", "corte de pregação",
  "corte da palestra", "tira um corte dessa gravação longa".
---

# corte-palestra: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de cortar e editar no corte-palestra, para qualquer gravação.
O arquivo detalhado (números, opções, comandos) é `sistema/modelos/corte-palestra/corte-palestra.md`; o método comum de
todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

A vitrine (`sistema/oficina/2026-11-03-cortepalestra01-vitrine/`, §10 do `corte-palestra.md`) é **um exemplo** desse
jeito aplicado a uma fala: a do "sistema de edição próprio". Ela nunca é o trecho, as páginas nem os destaques do vídeo
novo. Quem compra o EditOS e corta a pregação do pastor dele recebe um corte-palestra sobre aquela pregação, com as
palavras de destaque que aquela fala pede, não as páginas da vitrine com outra voz.

## Quando usar

- **Sim:** uma gravação longa de alguém falando (culto, palestra, aula, live, evento) da qual sai um pensamento inteiro
  de 30 a 75 s, do gancho à resolução. A força é da fala; a edição se contém.
- **Não:** gravação curta que já é o vídeo e pede ênfase a cada frase (vai para o `pregacao` ou o `ojg`); fala que
  precisa de telas, provas ou imagens para se entender (vai para o `rosto-telas`, o `prova-print` ou outro modelo com
  tela); narração sem rosto.

## A personalidade (vale para qualquer gravação)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **O ponto certo é metade do modelo.** O corte começa na 1ª palavra da frase de impacto (até 0,15 s) e acaba na
   palavra que resolve; nada antes, nada depois. *Por quê:* quem chega no feed não ouviu o culto; o corte tem de se
   entender sozinho. *Sim:* gancho de pergunta sobre a vida de quem assiste, ou contradição de uma crença comum.
   *Não:* começar em "então", "como eu disse"; terminar em "amém", "né" ou numa chamada ("comenta", "link da bio": vai
   na legenda do post); costurar frases de lugares diferentes num pensamento que a pessoa não disse.
2. **A gravação entra intacta.** Sem zoom, cor, moldura, transição, recorte da pessoa, efeito sonoro ou música (G6).
   *Por quê:* as referências não mexem em nada, e o silêncio da edição deixa a voz sozinha. Emenda só para tirar tomada
   repetida, tropeço ou aparte.
3. **A legenda é pequena e quieta, num lugar só.** Montserrat 700, 56 px, branca, sem caixa nem contorno, centro a 67% da
   altura (o peito), linhas alinhadas à esquerda dentro da página centrada, a linha se monta palavra por palavra com a
   voz. Até 2 linhas, um trecho por página (G14), página de 1,5 s. *Por quê:* a legenda pequena é o que faz o destaque
   raro pesar; 72 px vira legenda comum.
4. **O destaque é uma palavra em serifa itálica grande, e é raro.** Playfair Display itálica 700, 128 px, no lugar da
   legenda. Na COR (escolhida contra o fundo pelo `scripts/cor.py`) para a palavra da pergunta, a crença negada e a
   resposta; em branco para a resposta em imperativo ou a palavra de peso do gancho. *Denso no gancho* (pelo menos 1),
   *raro no corpo* (no máximo 1 a cada 20 s, mínimo 2), *nenhum no clímax e no fecho*. Na dúvida, não destaca (G17).
5. **A gramática fala → tela** (`corte-palestra.md` §1): gancho de pergunta = bloco que se monta, a resposta na página
   seguinte; gancho de contradição = a palavra de peso em serifa; pergunta retórica + pausa = a pergunta atravessa a
   pausa e a resposta acende na COR; paralelismo = o destaque vai na 2ª vez; tese, explicação, virada pessoal, clímax,
   fecho = só a legenda.
6. **O fecho respira.** A última página fica; a imagem escurece de 0,4 a 1,2 s depois da última palavra e o preto segura
   até 1,6 s (ou segura a imagem, opção). Sem chamada inventada.
7. **Nada de tela inventada.** Este modelo não tem telas da casa nem tela livre: nenhuma ilustração, painel, tela
   dividida ou interface. *Por quê:* a contenção **é** a personalidade; ilustrar uma pregação frase a frase é o oposto do
   que as referências fazem. Por isso o molde não tem `src/telas/` nem palco: a "invenção" aqui é escolher o trecho e a
   palavra.

## As peças (o que já existe em código)

Do molde `sistema/moldes/corte-palestra/`:
- `scripts/ponto.py` (o mapa das frases e as janelas candidatas), `trecho.json` + `scripts/recortar.py` (o recorte, as
  emendas), `scripts/cor.py` (a COR contra o fundo), `scripts/maos.py` (as mãos sob o texto).
- `src/Corte.tsx`: a legenda e o bloco (`PEDACOS`, com `*palavra*` na COR e `_palavra_` branca), `legendaPadrao()` (a
  legenda padrão de qualquer fala, o começo vazio), o fecho que escurece.
- `scripts/cobertura.mjs`: o checador (entrada e saída, toda palavra uma vez, tempo de leitura, G14, densidade do
  destaque, emendas, queixo, mãos, zona segura pixel a pixel).

## A invenção (o trecho e a palavra que a fala nova pede)

Para cada gravação nova:
1. **Ache o pensamento** com o `ponto.py` e leia como quem assiste no feed: a 1ª frase se entende sozinha? a última
   resolve a primeira? a última palavra é forte?
2. **Dê a função de cada frase** (pergunta, resposta, contradição, sentença que vale sozinha, paralelismo, tese, clímax).
3. **Escolha as palavras** pela gramática: o gancho ganha 1 a 3; o corpo, no máximo 1 a cada 20 s, e só a resposta ou a
   sentença de peso da 1ª metade. Cada destaque no `plano.md` com a palavra dita entre aspas e a função.
4. **Escreva `PEDACOS`** a partir da legenda padrão (o checador lista as páginas), pondo só as marcas.

**Exemplo 1 (fala que a vitrine não tem):** uma pregação: *"Você tem orado e nada muda? Ore mais. Tem pedido e não
recebe? Peça de novo."* Gancho de pergunta + resposta em série: página "Você tem / *orado*" (a palavra da pergunta na
COR), página "e nada muda?", página "_Ore mais._" em branco (a resposta em imperativo), e o mesmo para "*pedido*" e
"_Peça de novo._". Por quê: "orado" e "pedido" são a vida de quem assiste; o imperativo é a resposta. Depois disso, 20 s
só de legenda.

**Exemplo 2:** uma aula: *"Todo mundo acha que disciplina é força de vontade. Não é. Disciplina é ambiente."* Gancho de
contradição: "Todo mundo acha que / disciplina é *força de vontade.*" (a crença na COR), "Não é." na legenda, e no corpo,
a resposta "Disciplina é / *ambiente.*". Por quê: "força de vontade" é a crença negada; "ambiente" é a resposta. Nada de
ilustrar um ambiente.


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   acusa página ou palavra da vitrine que a fala nova não diz e plano parecido com o da vitrine. No bloco `O PLANO`,
   entre aspas, só o que foi dito.
2. **Todo destaque tem dono:** no `plano.md`, a linha diz a palavra destacada entre aspas e a função da frase.
3. **Folha lado a lado** com a vitrine (`oficina/2026-11-03-cortepalestra01-vitrine/out/final.mp4` ou a folha dela):
   *mesmo modelo?* (legenda pequena a 67%, serifa itálica rara, gravação intacta, fecho que escurece) **sim**; *mesmo
   vídeo?* (mesmas páginas, palavras, ordem) **não**.

## O caminho (os comandos estão no `corte-palestra.md` §9)

1. Ler esta skill e o `corte-palestra.md`. 2. `tools/novo-video.py corte-palestra <gravação> <AAAA-MM-DD-tema>
--sem-adaptar`: o plano nasce vazio (legenda padrão). 3. `scripts/ponto.py`, `trecho.json`, `scripts/recortar.py`.
4. `scripts/cor.py` → `COR`. 5. `PEDACOS` com os destaques, `plano.md`. 6. `scripts/maos.py`, `scripts/cobertura.mjs` até
`zerado`. 7. `tools/clone.py` até `SEM CLONE`; `tools/decupar.py --conferir`. 8. Quadros e folha lado a lado. 9. Render,
mixagem (só a voz, -14 LUFS), entrega.

## Nunca

- Começar das páginas da vitrine ou copiar o bloco `O PLANO` de outro vídeo.
- Destacar porque "o modelo tem destaque": só a palavra que a gramática pede, e nenhuma no clímax e no fecho.
- Ilustração, tela dividida, zoom, cor, música, efeito sonoro, chamada inventada.
- Tirar a frase do contexto, juntar frases de momentos diferentes, cortar gravação de outra pessoa sem autorização.
- Escrever na tela o que não foi dito (G19); legenda maior que 72 px ou menor que 56 px; mais de 2 linhas na legenda.
- O nome do modelo na tela (G33).
