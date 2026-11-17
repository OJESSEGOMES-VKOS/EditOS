---
name: minidocumentario
description: >
  Modelo de edição minidocumentario do EditOS: corte de podcast documental com a gravação íntegra e a legenda em três
  níveis, com a palavra-chave gigante em serifa itálica vermelha. Use quando pedirem "edita no minidocumentario",
  "corte de podcast documental" ou "estilo minidoc".
---

# minidocumentario: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no minidocumentario, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/minidocumentario/minidocumentario.md`; o método
comum de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/minidocumentario/referencia/`) é **um exemplo antigo** desse jeito aplicado a uma
fala: a do "100% editado pelo Claude". Ele tinha palco, B-roll e colagem gerados para imitar a referência, hoje
proibidos (M1). Ele nunca é o roteiro, a sequência nem o catálogo de telas do vídeo novo. A personalidade vem das
regras aprendidas das três referências (`minidocumentario.md` §1): a edição está na **legenda** e na **escolha do
ângulo**, não em efeito.

## Quando usar

- **Sim:** conversa de podcast ou fala para a câmera com frases curtas que fecham numa palavra forte, 30 a 60 s. Com
  vários ângulos gravados do set, o modelo corta entre eles; com uma câmera, fica calmo, na legenda.
- **Não:** fala que precisa mostrar coisas que a pessoa não filmou (o `rosto-telas` desenha; aqui nada é desenhado
  nem gerado); fala de impacto com letra de cinema (o `trailer`).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A gravação íntegra é a imagem.** Cor e fundo como vieram (G6), sem recorte, sem fundo desfocado, sem zoom
   fingindo outra câmera. *Por quê:* nas referências a imagem são as câmeras do set; a edição está no texto. *Com uma
   câmera:* um plano do começo ao fim, os únicos cortes são os da decupagem (G5). *Com vários ângulos gravados:* corte
   seco no início da frase: aberto na tese ou no fecho, close no pessoal e forte, médio no fluxo.
2. **A legenda em três níveis é o coração.** **Padrão:** Inter 600, 66 px, branca, 1 a 2 linhas centradas no peito
   (y 1110 e 1193), palavra por palavra, entrando 0,22 s antes de ser dita. **Intermediário:** a palavra de carga em
   vermelho, no tamanho da linha, dentro da frase. **Gigante:** a palavra-chave em Playfair Display Black Italic
   vermelha `#E0030A`, 60 a 83% da largura, letra por letra do borrão, com as pequenas encostadas (a de cima começa na
   borda esquerda dela, a de baixo termina na borda direita).
3. **A gigante só onde a ideia fecha.** O termo-imagem do tema, a conclusão de um argumento, a tese do fecho, quase
   sempre a última palavra forte da frase; no máximo cerca de 1 a cada 10 a 15 s (G17). Branca no predicado depois de
   é/foi/era e em nome de pessoa. *Não:* número de passagem, verbo comum, advérbio, palavra repetida.
4. **Um bloco é um trecho só.** Nenhum bloco atravessa ponto, vírgula, interrogação ou dois-pontos; até 2 linhas de
   legenda; um lugar só no peito; nunca no rosto; nada atravessa um corte.
5. **Marca ou produto dito vai na caixa branca** com a letra preta, da altura da linha.
6. **Corte seco é a regra.** O vazamento de luz vermelho, âmbar e branco (0,3 s) só na virada real da história, 1 a 2
   por vídeo.
7. **Material real ou nada.** B-roll, papel com colagem, prints e outro ângulo só com material do próprio criador
   ligado ao que é dito (G7, M1). Sem material, a legenda resolve.
8. **O fecho:** com chamada, a palavra entre aspas em gigante vermelha fixa e o resto da fala em pequenas acima e
   abaixo; sem chamada, a última palavra forte como gigante.

## As peças (o que já existe em código)

Do molde `sistema/moldes/minidocumentario/` (`src/Reel.tsx`, bloco O PLANO):
- `blocos(prev)`: as linhas `{tipo: 'p', ids, y, al}` (com `verm` e `caixa`) e `{tipo: 'k', id, y, cor}` (a gigante).
- `PLANOS` (`{id, de, ate, mundo, q}`, mundos sem aspas: `rosto`, `arquivo`, `papel`, `palco`, `dividida`; os três
  últimos só com material ou câmera real), `VAZAMENTOS`, `TERCOS` (o terço com nome e @ reais).
- Opções desligadas: fundo desfocado ou recortado, batidas, música, prévias.

**Não há tela livre neste modelo, de propósito.** As referências não têm tela desenhada: a imagem é sempre material
filmado. Desenhar ou gerar uma tela para a fala nova contraria a regra do dono (M1: "nunca imagem gerada recriando a
cena"). A invenção aqui é escolher, na fala nova, o nível de cada palavra e, se houver ângulos, o plano de cada frase.

## A invenção (a ênfase que a fala nova pede)

1. **Leia a fala frase a frase** e marque onde cada argumento fecha.
2. **A gigante** vai no termo-imagem que fecha o argumento (vermelha) ou no predicado / nome (branca).
3. **O intermediário** (vermelho dentro da frase) vai na palavra de carga de uma frase forte sem gigante.
4. **O resto é padrão**, um trecho por bloco.
5. **Ângulos:** só se a gravação tem mais de uma câmera; senão, um plano.

**Exemplo 1 (fala que o aprovado não tem):** *"A minha loja quase fechou em 2020. O que salvou foi uma coisa só:
confiança."* Padrão no gancho (G29). "quase **fechou**" com o intermediário vermelho. Gigante vermelha em "confiança",
com "O que salvou foi uma coisa só:" encostada em cima. Por quê: "fechou" (a carga da frase) e "confiança" (o termo que
fecha o argumento). Nada de palco, monitor ou colagem.

**Exemplo 2:** *"Todo mundo me chamou de louco. Hoje o Pedro trabalha comigo."* "louco" no intermediário; gigante
**branca** em "Pedro" (nome de pessoa, M3). Por quê: "Pedro" (o nome é a resposta).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`.
2. **Toda ênfase tem dono:** no `plano.md`, a linha da cena diz a peça (gigante, intermediário, `VAZAMENTOS`) e a
   palavra dita entre aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/minidocumentario/referencia/folha.jpg`: *mesmo modelo?* (Inter branca
   no peito, Playfair Black Italic vermelha encostada) **sim**; *mesmo vídeo?* (palco, monitor, colagem, as mesmas
   palavras) **não**.

## O caminho (os comandos estão no `minidocumentario.md` §10)

1. Ler esta skill e o `minidocumentario.md`. 2. `tools/novo-video.py minidocumentario <gravação> <AAAA-MM-DD-tema>`:
o plano nasce vazio (um plano de rosto, sem texto). 3. Ler a fala (`src/palavras.json`). 4. Contar as câmeras e o
material real. 5. `plano.md` com o plano de cenas. 6. Montar o bloco O PLANO: legenda padrão primeiro, depois os
níveis. 7. `node scripts/sincronia.mjs` até 0 erros. 8. `tools/clone.py` até `SEM CLONE`. 9. Quadros e folha lado a
lado. 10. Render, mixagem (só a voz), entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Palco, monitor de edição, celulares explodindo ou colagem porque "o modelo tem": sem material real, não existe.
- Imagem gerada, B-roll buscado sem pedido, zoom fingindo câmera, recorte ou fundo trocado (M1, G6, G7).
- Bloco que atravessa vírgula ou ponto, mais de 2 linhas de legenda, texto no rosto, gigante em toda frase.
- Escrever o que não foi dito (G19), nome ou @ que não sejam os reais (G8), o nome do modelo (G33).
