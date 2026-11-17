---
name: motion-ouro
description: >
  Modelo de edição motion-ouro do EditOS: narração sem rosto em motion de estúdio, preto, ouro e neon, um objeto
  desenhado por frase e o texto embaixo. Use quando pedirem "edita no motion-ouro", "faz no motion-ouro", "motion
  sofisticado narrado", "Ouro na Noite" ou narração em motion preto e dourado.
---

# motion-ouro: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no motion-ouro, para qualquer narração. O arquivo
detalhado (números, cores, posições, opções, comandos) é `sistema/modelos/motion-ouro/motion-ouro.md`; o método comum
de todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/motion-ouro/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do
"100% editado pelo Claude". Ele nunca é o roteiro, a sequência nem o catálogo de telas do vídeo novo. Quem compra o
EditOS e narra sobre a padaria dele recebe um motion-ouro sobre a padaria (o forno, a fornada, o pão), não o vídeo dos
modelos de edição com outra voz.

## Quando usar

- **Sim:** narração sem apresentador (só a voz), de 10 s a 60 s, que apresenta uma coisa (anúncio de produto) ou
  defende uma ideia (manifesto), e em que cada frase tem uma coisa concreta para desenhar. Tom sério, de estúdio.
- **Não:** vídeo com a pessoa falando para a câmera (vai para um modelo com rosto, como o `rosto-telas`); tutorial
  passo a passo com tela de computador (o `youtube-didatico`); prova atrás de prova em print (o `prova-print`); tom
  leve e colorido (outro registro).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **Ouro na Noite, uma família de cor só.** Preto `#000` com névoa quente, poeira dourada e fachos; o objeto em ouro
   `#F2BE3A` e fogo `#F48907`; texto quase branco `#FFFFF7`. *Por quê:* o vazio preto faz o ouro brilhar como peça de
   estúdio. *Não:* outra cor de destaque; o vermelho `#E0030A` só no pico da tensão, no máximo 2 vezes.
2. **Neon de verdade.** Todo traço tem núcleo quase branco `#FFFEDD` e halo colorido largo (3, 12 e 30 px). *Por quê:*
   sem o núcleo o ouro fica chapado e o vídeo perde o contraste que o define. *Não:* traço de uma cor só, sem halo.
3. **Uma tela desenhada por cena, objeto em cima e texto embaixo.** O objeto mora em y 250 a 1050; o texto começa em
   y 1210 e desce a cada 84 px, até 3 linhas de 70 px (4 de 64 px quando a fala corre). *Por quê:* o olho acha o
   texto sempre no mesmo lugar (G12) e o objeto tem o quadro todo para brilhar. *Sim:* toda frase com coisa concreta.
   *Não:* texto no centro fora do trecho de destaque (G13, G28); frase sem objeto ganha só a tipografia, sem enfeite.
4. **O objeto faz o que a frase diz, preso à palavra.** A orelha se desenha e é riscada em "não tem ouvidos", a pasta
   abre em "usar", a agulha varre em "analisar", o anel trava em "precisamente". Cada movimento nasce no quadro da
   palavra (as marcas do plano). *Por quê:* a tela representa o ato, não ilustra o assunto (G19).
5. **Nada parado.** A câmera aproxima, gira ou desliza de leve; o objeto flutua; um evento novo (palavra, anel, estrela,
   barra) a cada 0,3 a 0,7 s. *Não:* trecho de 2,5 s sem nada novo (o conferidor cobra).
6. **Toda palavra dita aparece uma vez, em ordem, do desfoque para o foco.** Inter 700, 7 quadros de desfoque de 16 px
   com escala 1,14 → 1. Bloco de 1,5 s, palavra de 0,4 s, até 4 linhas; nenhum texto atravessa uma troca. *Por quê:* a
   narração é a história; o texto conta junto, no tempo de ler.
7. **Destaque só no termo do tema.** Ouro com halo numa palavra, contorno neon que se escreve no termo protagonista,
   assinatura em ouro no nome ou no comando final. *Por quê:* destaque em tudo é destaque em nada (G17, G28). Na
   dúvida, não destaca.
8. **Trocas com luz.** Flash branco ou quente de 2 quadros subindo e 10 descendo, clarão com portas na virada (uma vez),
   preto seco de respiro, corte seco para o vermelho. *Não:* transição de software (deslizar, cubo, zoom genérico).
9. **O ritmo.** Uma tela a cada 1,5 a 5 s; fala acima de 2,7 palavras/s não se aperta (o tempo de leitura vence).
10. **O fecho é a assinatura em ouro que assenta.** O nome, a marca ou a palavra do comando ("comenta X") em ouro com
    volume, que assenta em branco, e a seta a lápis só se a fala diz "aqui" ou "embaixo". Vai ao preto no fim.

## As peças (o que já existe em código)

Do molde `sistema/moldes/motion-ouro/`:
- **A casa:** o texto (`BlocoView`, com ouro, contorno, tensão, contador, gigante, assinatura), os flashes, o clarão,
  a vinheta, a ida ao preto e a trilha e os efeitos sintetizados do plano (`scripts/som.py`).
- **O kit da tela nova** (`src/kit.tsx`): `Fundo` (preto, névoa, fachos, poeira, câmera que aproxima), `Palco` (a zona
  do objeto, y 250 a 1050, com o objeto crescendo e flutuando), `Entra` (desfoque para foco com mola), `TracoNeon`
  (qualquer caminho em neon da casa, desenhado de 0 a 1), `AnelNeon`, `Estrela`, `Seta` (lápis), `Cartao` (tela 9:16
  de vidro), `Pasta` (vidro dourado que abre), `Ladrilho` e `Icone` (ícones de linha), `Celular`, `Notebook`,
  `Roleta`, `Cursor`, `pulso`, `marca`, `tw`, `E`, `COR`.
- **As telas do aprovado** (C1 a C10, exemplos com o porquê, `motion-ouro.md` §4): contador nos anéis, notebook,
  cartões nos anéis, roleta, celular do Reels, pico vermelho, túnel com prévias, horizonte com a frase de efeito,
  pasta com cursor, assinatura do fecho. Uma delas só volta quando a fala nova diz a mesma coisa que fez ela existir
  lá: o celular volta se a fala é sobre quem está no Instagram agora; a roleta, se a fala lista itens; o horizonte e o
  contorno neon, no termo protagonista.

## A invenção (a tela que a fala pede e a casa não tem)

É o normal num tema novo. Para cada frase:
1. **Ache o objeto.** Qual coisa concreta a frase nomeia? (a orelha, a pasta, a onda do som, a estante, o forno).
2. **Ache o verbo.** O que acontece com ela? (é riscada, acende, abre, varre, nasce barra a barra, trava).
3. **Desenhe em neon da casa** dentro do `<Palco>`: o objeto em `TracoNeon`/`AnelNeon`/vidro dourado, o verbo como um
   dos movimentos da casa (desenhar, acender, abrir, varrer, estourar a estrela), cada um num `marca('nome')`.
4. **Escreva em `src/telas/<Nome>.tsx` da pasta do vídeo** (`export const Nome: TelaNova = ({f, c}) => ...`), registre
   em `src/telas/index.ts` e ponha no plano: `Nome = livre(comp='Nome', de_q=..., ate_q=..., entrada=FLASH_QUENTE)` e
   as marcas que ela pede em `marcas`. O texto continua nos blocos, embaixo.

**Exemplo 1 (fala que o aprovado não tem):** *"Minha conta de luz era trezentos reais. Depois do painel solar, caiu
pela metade."* 1ª frase: tela nova `Conta`, o número no contador dos anéis (o `CONTADOR` da casa conta até o dito). 2ª
frase: tela nova `Painel`, um painel solar em `TracoNeon` que acende célula a célula em "solar" e uma barra de ouro que
cai até a metade em "metade", com a estrela no fim. Por quê: "metade" (o verbo da frase é cair). Nada de notebook,
celular ou cartões de modelos.

**Exemplo 2:** *"Na padaria a gente faz três fornadas por dia: às seis, ao meio-dia e às cinco."* Tela nova `Fornadas`:
três relógios em `AnelNeon` com os ponteiros em `TracoNeon` já na hora dita, cada um entrando (`Entra`) na palavra da
hora; o texto embaixo diz as horas. Por quê: "três fornadas" (uma lista dita item a item). A roleta da casa também
serviria a uma lista; o relógio ganha porque a lista é de horas.


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   lê o bloco O PLANO de `scripts/plano.py`: a tela da casa é a linha `C8 = cena('C8', ...)`, a nova é
   `livre(comp='Nome', ...)`. Use as constantes do plano (`FLASH_QUENTE`, `EMBAIXO`...), nunca a palavra entre aspas, e
   não copie as anotações `tela='T1+T3'` do aprovado.
2. **Toda tela tem dono:** no `plano.md`, a linha da cena diz o nome da tela como está no plano (`Orelha`, `C8`...) e a
   palavra dita entre aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/motion-ouro/referencia/folha.jpg`: *mesmo modelo?* (preto e ouro em
   neon, texto embaixo, trocas de luz) **sim**; *mesmo vídeo?* (mesmos objetos, textos, ordem) **não**.

## O caminho (os comandos estão no `motion-ouro.md` §9)

1. Ler esta skill e o `motion-ouro.md`. 2. `tools/novo-video.py motion-ouro <narração> <AAAA-MM-DD-tema>`: o plano
nasce vazio (preto, só a voz). 3. Ler a fala (`src/palavras.json`) antes de olhar o exemplo de novo. 4. `plano.md` com o
plano de cenas, uma linha por cena com a palavra que pediu a tela. 5. Montar o bloco O PLANO de `scripts/plano.py` e as
telas novas; rodar `scripts/plano.py`. 6. `scripts/conferir.py` até `0 erros`. 7. `tools/clone.py` até `SEM CLONE`.
8. Quadros e folha lado a lado. 9. `scripts/som.py`, render, `finalizar.sh`, entrega.

## Nunca

- Começar do plano do aprovado, copiar o bloco O PLANO de outro vídeo ou editar `src/tempos.json` à mão.
- Pôr notebook, celular do Reels, cartões de modelos, roleta ou túnel porque "o modelo tem": só com o mesmo porquê.
- Escrever na tela o que não foi dito, inventar nome, número, marca, logo, depoimento ou interface (G10, G19, G25).
- Outra cor de destaque, traço sem núcleo branco, fundo chapado, vermelho fora da tensão.
- Texto no centro fora do destaque, dois blocos na tela ao mesmo tempo, texto atravessando a troca (G12, G13).
- Tela nova dentro do molde (ela mora na pasta do vídeo), ou objeto fora do `<Palco>`.
- O nome do modelo na tela (G33). Travessão no texto.
