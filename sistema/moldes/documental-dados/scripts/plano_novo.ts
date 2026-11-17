// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/plano.ts).
// O vídeo nasce só com a base do modelo: o fundo da família, a narração e a legenda de uma palavra. Nenhuma tela, número,
// barra, nome ou crédito do vídeo de exemplo vem junto. Cada estado entra porque a fala NOVA pediu, com a linha "por quê"
// no plano.md (o nome da peça, a palavra dita entre aspas e o porquê; tools/clone.py cobra). A skill
// .claude/skills/documental-dados/SKILL.md diz como escolher; os números e medidas estão em documental-dados.md §3 a §6.
//
// Tempo: segundos, [índice, "palavra"] (o início dela, conferida contra src/palavras.json) ou [índice, "palavra", ±s].
// String aqui dentro só para texto que vai para a tela (e sempre com as palavras da fala, G19) ou palavra da fala.
//
// O DADO (src/dados.json, a imagem-mãe da família A) é do vídeo: {"fala": a fala dele, "o_que", "unidade", "fontes",
//   "itens": [{nome, valor, grupo}]}. O dado do exemplo que veio com o molde não desenha nada e o checador reprova.
//   Modo só materiais (o padrão, G7): o dado vem da pessoa (planilha, contagem dela, a própria gravação medida); sem dado,
//   "itens": [] e o vídeo vive das telas (família A sem gráfico) ou de um documento dela (família B).
//
// AS PEÇAS (use só com o porquê na fala nova; documental-dados.md §4):
//   telas      cada troca de texto: {de, rotulo?, titulo?} | {de, numeros: [...]} | {de, semana} | B: {de, ligacao, frase}.
//              A 1ª em 0 (o gancho escrito no quadro 0). Título = frase-resumo com as palavras ditas, uma em *itálico*.
//   numeros    o número DITO conta e para na palavra: {valor, de, para: [i, "palavra"], dito: "como foi dito", sub}.
//              Sem número dito, sem contador (G10).
//   semana     cartões que entram um a um: a fala transforma o número numa rotina ("três por dia").
//   barras     estados do gráfico: {t, de?, ate?, nivel (0 apagado, 1 aceso, 1,45 halo), dur, varre?: IGUAL | VALOR}.
//   camera     zoom para ler um detalhe pequeno que a fala nomeia: {t, x, zoom, dur}.
//   marcas     o marcador corre o eixo até a barra do nome dito: {t, barra, nome?, dur}.
//   reguas     "a altura é...": a régua sobe ao lado da barra.
//   divisao    a fala separa em dois grupos ("no Antigo... no Novo").
//   pilha      a fala soma barras para comparar com outra ("que somam 89").
//   apagao     a pergunta-clímax perto de 62% (55 a 75%); null só se o vídeo não tem clímax (motivo no plano.md).
//   documento  família B: {arquivo, largura, altura, y, credito, pontos, fios}; arquivo da pessoa ou de domínio público.
//   credito    a fonte do dado ou da obra, na tela do fecho até o fim (mín. 2,5 s).
//   destaques  índices das palavras protagonistas da legenda (na cor de destaque).
fala = FALA; // a fala transcrita (src/palavras.json); o Reel confere cada [índice, "palavra"] contra ela
cauda = 2.6; // a cama sobe e fecha depois da última palavra
familia = A; // A gráfico vivo (dado com números) ou B arquivo (documento, mapa, obra)
paleta = OURO; // A: OURO; B: PERGAMINHO ou MARROM
inicial = 0.25; // o nível das barras no quadro 0
telas = [];
destaques = [];
barras = [];
