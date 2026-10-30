---
name: criar-modelo
description: >
  Cria um modelo de edição novo no EditOS a partir de vídeos de referência, ou funde e refina modelos existentes.
  Decide se é modelo novo ou variação, decupa as referências medidas, extrai a forma de execução, escreve o
  <modelo>.md com a herança da casa, constrói o molde Remotion com checador, prova com a gravação comum, faz a
  revisão de diretor e só então leva ao dono. Use quando a pessoa disser /criar-modelo, "cria um modelo com essas
  referências", "transforma esses vídeos em modelo", "junta esses modelos", "refina o modelo X" ou deixar uma pasta
  nova com vídeos em sistema/modelos/.
---

# /criar-modelo: de vídeos de referência a um modelo que ensina uma forma de execução

Um modelo **não é uma cara**. É uma **forma de execução**: o que a tela faz com cada tipo de frase, como a câmera
se comporta, como o texto nasce, onde o som entra, e o que acontece quando só existe a pessoa falando. A cara (cores,
fontes, cartões) é consequência e é opção. Quem cria um modelo copiando a cara entrega um template; quem extrai a
forma entrega uma capacidade que funciona com qualquer gravação. É isso que o dono pediu (G32): *"criar um modelo não
é copiar, é aprender uma forma de execução. Nem sempre vou ter um B-roll ou uma imagem ou várias cenas, e daí faz
com o que tiver."*

Leia antes: `CLAUDE.md`, `REGRAS.md` inteiro (G1 a G33), `sistema/moldes/CONTRATO.md`, `sistema/tools/PROTOCOLO-decupagem-curto.md`,
e as três referências desta skill: `referencias/heranca.md` (o que todo modelo nasce sabendo),
`referencias/como-pensar-um-modelo.md` (os testes que separam modelo de template) e `referencias/interface-fiel.md`
(toda interface recriada é fiel como um print, nunca o mockup genérico repetido).

## Os portões
Nada passa de uma etapa pra outra sem o que ela entrega escrito. E **nada chega ao dono sem a revisão de diretor da
etapa 7**: ele não revisa quadro a quadro, e cada defeito que chega nele custa confiança no sistema inteiro.

| # | Etapa | Sai | Portão |
|---|---|---|---|
| 0 | Triagem | `sistema/modelos/<m>/TRIAGEM.md`: novo, variação ou fusão, e por quê | decisão escrita |
| 1 | Referências | `referencias/ref1..N.mp4` + `ORIGEM.txt` | formatos e durações anotados |
| 2 | Decupagem | `analise/refN_decupagem.md` por referência, medida | receita visual + gatilhos completos |
| 3 | A forma de execução | a frase de uma linha + a gramática fala→tela + "com o que o vídeo tiver" | passa nos testes de `como-pensar-um-modelo.md` |
| 4 | O `<modelo>.md` | arquivo único, com herança declarada e sobrescritas justificadas | checklist §10 da herança |
| 5 | O molde | `sistema/moldes/<m>/` com checador | checador zerado no próprio molde |
| 6 | A vitrine | `sistema/oficina/AAAA-MM-DD-<m>-vitrine/out/final.mp4` + folhas | checador zerado, -14 LUFS |
| 7 | Revisão de diretor | relatório honesto com a folha lado a lado | o que pede o olho do dono está nomeado |
| 8 | Aprovação | `exemplos/`, `assinatura.json`, `referencia/`, catálogo | só com o "ok" do dono |

### Etapa 0: triagem (o passo que faltava)
Antes de medir qualquer coisa, assista às referências uma vez e responda por escrito em `TRIAGEM.md`:
1. **A forma de execução em uma frase.** "A fala se escreve na tela palavra a palavra e a pessoa alterna com cartões
   chapados em corte seco" é uma forma. "Vídeo dinâmico com legendas bonitas" não é.
2. **O teste do clone.** Leia a frase de uma linha de cada modelo do catálogo (está na seção 1 do `<m>.md` de cada
   um). Se a frase nova cabe em algum deles, não é modelo novo: é **variação** (entra como opção ou família naquele
   `<m>.md`) ou é **fusão** (as referências se juntam às dele). Dois modelos que saem parecidos custam o dobro e
   confundem o aluno: foi o que aconteceu com dynamiclyrics01 e dynamiccuts01, que viraram o dynamic01.
3. **Quantas referências e de quantos criadores.** Uma referência só não dá modelo: dá exemplo. O que é comum a
   criadores diferentes vira regra; o que é de um só vira opção ou assinatura.
4. **O nome**, no padrão da casa: minúsculo, sem espaço nem acento, terminando em `01`.
Mostre a triagem ao dono só se a resposta for "variação" ou "fusão" e isso mudar o pedido dele. Se for modelo novo,
siga.

### Etapa 1: referências
`sistema/modelos/<m>/referencias/ref1.mp4 … refN.mp4`, com `ORIGEM.txt` (de onde veio cada uma, data, quem baixou). Anote
formato, duração e qps de cada uma (`ffprobe`). Referência é **medida, nunca material**: nenhum quadro, texto ou
som dela entra em vídeo nosso.

### Etapa 2: decupagem medida
Para cada referência: `sistema/.venv/Scripts/python.exe sistema/tools/medir_curto.py sistema/modelos/<m>/referencias/refN.mp4
sistema/modelos/<m>/analise/refN`. Depois o `PROTOCOLO-decupagem-curto.md` à risca, com as duas metades no mesmo peso:
a **receita visual medida** (hex de quadro cheio, tamanho da letra em % da altura, posição em %, ritmo em
trocas/min, maior trecho parado) e os **gatilhos** (quando a fala faz X, a tela faz Y, com hora de prova). Regra de
honestidade: só o que você viu e mediu; "não deu pra ver" é uma seção, não uma vergonha.

### Etapa 3: extrair a forma de execução
É a etapa que separa modelo de template. Siga `referencias/como-pensar-um-modelo.md` e escreva, antes do `.md`:
- **A frase de uma linha** (da triagem, agora confirmada pela medição).
- **A gramática fala→tela**: para cada função de frase (gancho, problema, prova, passo, virada, fecho), o que a tela
  faz neste modelo. É daqui que o vídeo novo nasce da fala nova, e não do roteiro da referência.
- **Os três sinais de reconhecimento**: o que faz alguém reconhecer o modelo em 1 segundo, mudo. Se precisar de mais
  de três, o modelo não tem identidade; se um deles for "a cor", procure outro, porque cor é opção (G33).
- **"Com o que o vídeo tiver"**: a tabela recurso da referência → o que o modelo faz só com a gravação da pessoa.
  B-roll vira reenquadramento ou cartão; imagem de prova vira número dito grande; segunda câmera vira corte da mesma
  tomada. Se um recurso não tem equivalente, ele é opção, não regra.
- **De onde vem o encanto.** Pergunte onde a referência realmente ganha a pessoa. Quase sempre é ritmo, contenção
  e sincronia, não o efeito mais chamativo. O modelo precisa reproduzir o encanto, não o inventário de efeitos.

### Etapa 4: o `<modelo>.md`
Um arquivo só, na estrutura dos outros (0 Do seu jeito · 1 A cara · 2 Os números · 3 Cenas e ritmo · 4 Repertório ·
5 Texto na tela · 6 Transições e fecho · 7 Opções · 8 Zona segura, material e "Com o que o vídeo tiver" · 9 Como
fazer um vídeo novo · 10 O plano da vitrine). Na seção de regras: **"herda `heranca.md`"** e a lista do que
sobrescreve, cada item com o motivo ligado à forma de execução. Paletas como opção, uma padrão só porque o molde
precisa renderizar algo. Crie `CORRECOES.md` e `CORRECOES-origem.md` vazios com o cabeçalho padrão. Todo número do
`.md` foi medido; "aproximadamente" só com a medida ao lado.

### Etapa 5: o molde
`sistema/moldes/<m>/` nascido do molde mais parecido do catálogo (CONTRATO: `node_modules` como junção, caminhos relativos,
`scripts/` com som, mixagem, quadros de conferência). O checador cobre, no mínimo: tempo de leitura, nada atravessa
corte, zona segura, texto fora do rosto (e das mãos, quando a pessoa gesticula no peito), máximo de zooms por tela,
máximo de tempo contínuo em cartão, legenda em no máximo 2 posições, nada pisca. O que a herança proíbe, o checador
acusa. Nenhum tratamento de cor na gravação, nem como opção (G33). Sem `public/pessoa.webm` ou `src/maos.json` do
vídeo de origem (o `novo-video.py` já os ignora).

### Etapa 6: a vitrine
A gravação comum é `sistema/teste-comum/gravacao.mp4` (base em `sistema/teste-comum/base/`), porque a prova é **parecer o modelo com
outra gravação**, não com a da referência. `sistema/tools/novo-video.py <m> sistema/teste-comum/gravacao.mp4 AAAA-MM-DD-<m>-vitrine
--sem-adaptar` (antes da aprovação ainda não existe `assinatura.json`; anote no `.md` que o `--sem-adaptar` cai
depois). Plano frase a frase, render com `QUEM=<m> sh sistema/tools/com-trava.sh … --concurrency=2`, mix -14 LUFS (a vitrine é prova do sistema, não conteúdo de ninguém: pasta terminada em `-vitrine` não cai no `<perfil>/conteudo/`). Folhas em
`conferencia/`: 1 quadro por segundo e a **lado a lado** (referência em cima, vitrine embaixo, um par por recurso).
Um render por vez; apague quadros intermediários sem valor de prova (G29).

### Etapa 7: revisão de diretor (antes do dono)
Olhe as duas folhas como quem vai reprovar. Procure, nesta ordem: texto sobre rosto ou mãos; cartão ou tela com letra
pequena e vazio; trecho longo parado; abertura sem a pessoa ou sem o gancho; fala que não bate com a tela; ritmo fora
da faixa das referências; qualquer coisa que pisca, teleporta ou some. Meça: duração, LUFS, pico, trocas/min, % em
cartão, maior trecho em cartão. Compare com as referências nos mesmos números. Corrija o que for defeito. O que for
**decisão de gosto** vai nomeado pro dono, em até três itens, com a sua recomendação em cada um.

O relatório pro dono tem, nesta ordem: o que o modelo ensina em 3 linhas; como se resolve só com a gravação; os
números medidos; os caminhos (`.md`, molde, vitrine, folhas, checador); as medidas da vitrine; o que ficou diferente
das referências e por quê; e o que pede o olho dele. Sem enfeite e sem "ficou ótimo": ele decide.

### Etapa 8: aprovação
Com o "ok": a vitrine vai pra `sistema/modelos/<m>/exemplos/vitrine-<m>.mp4`; `sistema/tools/assinatura.py <m>`;
`sistema/tools/referencia.py <m>`; o `--sem-adaptar` sai do `.md`; o modelo entra na contagem do `LEIA.md` e, se for do
catálogo, deixa de ser excluído no `sistema/tools/gerar-aberto.py`. Correção do dono na aprovação entra no `CORRECOES.md`
com data e as palavras dele, e no `<m>.md` como regra. Se a correção vale pra todo modelo, vai pra `REGRAS.md` §0 e
pra `heranca.md`. Commit e aberto só com ordem.

## Fusão e refino (quando a triagem diz "não é novo")
- **Fusão:** uma pasta só, referências renumeradas com `ORIGEM.txt` preservando a origem, decupagens movidas, um
  `.md` com o repertório inteiro e as diferenças como opções ou famílias, um molde, uma vitrine. Os antigos deixam de
  existir (nada fica em dois lugares). Registre a decisão como correção datada.
- **Refino:** mexe no `.md` e no molde existentes; o vídeo aprovado não muda (prova por hash). Vitrine nova só se a
  forma de execução mudou; aí volta à etapa 7.

## O que nunca muda
1. Forma de execução antes da cara; cara é opção.
2. Tudo medido; nada "por impressão".
3. Funciona só com a gravação da pessoa, ou não é modelo.
4. Herança ligada por padrão; sobrescrita só com motivo escrito.
5. Revisão de diretor antes do dono, sempre.
6. Nome do modelo nunca na tela; nome/@ só reais; referência é medida, não material.
7. Tudo confinado na pasta; um render por vez; disco limpo.
