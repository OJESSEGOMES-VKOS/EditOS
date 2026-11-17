// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/plano.ts).
// O vídeo nasce como a camada (a) do modelo: a pessoa na gravação original, aberto, com a legenda curta da casa (o pedaço
// dito, 68 px, abaixo do queixo). Nenhuma imagem, gigante, herói ou cartão do aprovado vem junto. Cada peça entra porque a
// fala NOVA pediu, com a linha "por quê" no plano.md (a peça, a palavra dita entre aspas e o porquê; tools/clone.py cobra).
// A skill .claude/skills/imagem-por-palavra/SKILL.md diz como escolher. Antes de tudo: src/imagens.json = {} e public/img/
// apagada (as imagens do aprovado; o checador recusa imagem presa a outra fala).
//
// Prender à fala: w('palavra', n) = [índice, palavra] da n-ésima vez que ela é dita; INICIO = a 1ª palavra.
// Palavra que não existe na fala: o plano para e diz qual. Dentro deste bloco, texto entre aspas é só o que é dito.
//
// AS PEÇAS (use só quando a fala nova tiver o porquê; modelos/imagem-por-palavra/imagem-por-palavra.md §1, §3 e §4):
//   planos   a faixa de baixo, emendada, cada plano começa numa palavra:
//            {de: w('palavra'), tipo: PESSOA, plano: FECHADO}   reenquadre seco (ABERTO/FECHADO/CLOSE) só com motivo
//                na fala: começo de explicação, pergunta para quem assiste, troca de assunto. Sem material é o pulso do vídeo.
//            {de: w('palavra'), tipo: IMG, img: 'id', mov: EMPURRA}   a imagem da palavra concreta (da lista src/imagens.json,
//                material da pessoa no modo padrão, G7); RECUA/GIRA/DESLIZA variam o movimento
//            RAJADA (imgs, passo 0.17–0.25) numa lista dita; ESTILOS (img) num verbo de velocidade; MOSAICO (imgs, passo,
//                escuro) em quantidade ou recapitulação; PAINEIS em "duas"/prévia (a própria gravação a 3x)
//            {de: w('palavra'), tipo: CARD, fundo: PRETO, porque: 'motivo'}   raro: respiro tipográfico pedido pela fala ou
//                rosto que cobriria o texto, sempre com a gigante, o herói ou a tarja dentro, no máximo 4 s
//            A onda de imagem entra no trecho ligado ao tema que tem o que ilustrar e devolve a pessoa na cena seguinte;
//            a pessoa fica com pelo menos 50% do vídeo.
//   quebras  [w('palavra')] onde um trecho longo vira outro bloco (os dois lados com 1,5 s ou mais); quebrasPadrao() faz
//            sozinha a legenda curta (bloco de 1,5 s, palavra de 0,4 s, 2 linhas, de preferência na vírgula)
//   picos    a trava: {de: w('termo'), ate: w('fim do termo'), voz: GIGANTE} no termo que importa ao tema (G17), ~1 a cada
//            5–8 s, 55–92% da largura; o comando do fim com fixo: true. DIGITA para ano, código, nome de produto.
//   heroi    {de, ate, caixa: [índices]}: a frase-promessa, no máximo um por vídeo
//   tarja    [w('mas')]: a virada que revela (o bloco inteiro)
//   ponte    [{img: 'id', de, ate}]: um PNG recortado da pessoa que atravessa os cortes na troca de assunto
//   flash    [w('palavra')]: a entrada de um pico forte, no máximo 1 a cada ~8 s
//   negativo nunca na pessoa (G6); desligado por padrão
//   texto    {índice: 'grafia'}: a grafia na tela do que foi dito (aspas fora da gigante, G18; número como foi dito, G10)
//   paleta   NOITE (padrão), CREME_LIMA ou SANGUE; cores = cores soltas por cima (§0 e §7)
//   queixo   a altura do queixo (px) quando o detector exagera; picoPx = tamanho fixo da gigante (o normal é calcular)
paleta = NOITE;
cores = {};
planos = [
	{de: INICIO, tipo: PESSOA, plano: ABERTO}, // o gancho na gravação original (G29)
];
quebras = quebrasPadrao(); // a legenda curta da casa, sozinha; troque por quebras escolhidas, ex. [w('que'), w('para', 2)]
picos = None;
heroi = None;
tarja = None;
ponte = None;
flash = None;
negativo = None;
texto = None;
queixo = None;
picoPx = None;
