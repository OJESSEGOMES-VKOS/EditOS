/* O COMEÇO VAZIO do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco O PLANO de src/Reel.tsx).
 * O vídeo nasce como a gravação crua, num plano só, sem nenhum destaque, transição ou fecho do aprovado. Cada peça entra
 * porque a fala NOVA pediu, com a linha do porquê no plano.md (o nome da peça, a palavra dita entre aspas e o porquê;
 * tools/clone.py cobra). A skill .claude/skills/trailer/SKILL.md diz como escolher. O molde para ao carregar até a
 * legenda (PEDACOS) cobrir a fala: comece por ela, depois só os destaques que a fala pede.
 *
 * Prender à fala: c(i, <palavra>) = o corte 2 quadros antes da palavra i de src/palavras.json (a palavra esperada vai ao
 * lado, entre aspas; se não bate, o molde para e diz a linha).
 *
 * AS PEÇAS DA CASA (cada uma só com o porquê dela na fala nova; modelos/trailer/trailer.md §1 e §4):
 *   PEDACOS     a legenda serifada calma no peito: [índice da 1ª palavra, <texto / 2ª linha>], toda palavra fora dos
 *               destaques, uma vez, por trecho (G11, G14). É a maior parte do vídeo.
 *   BLOCOS      o destaque de 3 vozes por cima da pessoa, só no trecho com um termo protagonista do tema (G17):
 *               {de, ate, camera: [corte, corte], primeira, linhas: [[[voz, tam, <palavras ditas>]], ...]}; vozes inter
 *               (80-86, palavras comuns), playfair (118-132, a palavra de emoção), anton / antonVermelha (250-260, a
 *               palavra-chave; o vermelho só nela). Opcionais: risca (índice da linha negada: o traço vermelho de caneta,
 *               quando a frase nega algo) e carimbo (a palavra-chave enorme atrás do bloco: porquê a confirmar com o dono).
 *   ABERTURA    o gancho em bloco até o 1º corte, só se o gancho tem um número dito (contador de 0 até ele) ou um termo
 *               protagonista: opcional<AberturaDef>({ate, cima: [i, <texto>], contador: [i, <número dito>] ou null,
 *               baixo: [i, <texto>]}). Sem esse porquê, o gancho é a gravação com a legenda (G29).
 *   FECHO_DEF   só se a fala termina num comando (comenta, segue...): opcional<FechoDef>({comando: [i, <comando>],
 *               palavra: [i, <palavra a comentar>]}).
 *   T / CAM     os cortes e a câmera: 1,0 por padrão; 1,3 (corte seco) só numa frase de peso ou numa virada (G6), nunca
 *               por tempo nem ao acaso.
 *   DESFOQUES / FLASHES / CHICOTES   as transições de textura, só onde a fala muda de cena; sem motivo, corte seco.
 *   PREVIAS     só se a fala promete mostrar vídeos da própria pessoa. RESPIROS e VHS: só com ordem do dono (G6).
 * Nunca escreva na tela o que não foi dito (G19), nem o nome do modelo (G33). */

/* trechos: os cortes, 2 quadros antes da palavra, ex.: virada: c(i, <palavra>) */
export const T = {};
/** cortes com desfoque (o plano novo nasce do borrão) */
const DESFOQUES: number[] = [];
/** flash branco no corte */
const FLASHES: number[] = [];
/** chicote: borrão de movimento horizontal que vira a cena seguinte */
const CHICOTES: number[] = [];
/** telas de respiro [de, ate] (opção desligada, G6) */
const RESPIROS: [number, number][] = [];
/** VHS [de, ate], só com a prop efeitos (opção desligada) */
const VHS: [number, number][] = [];
/** janela das prévias (s), só com a prop previas */
export const PREVIAS = opcional<{de: number; ate: number}>(null);
/** abertura em bloco: só com o porquê */
const ABERTURA = opcional<AberturaDef>(null);
/** fecho com o comando: só se a fala termina num comando */
const FECHO_DEF = opcional<FechoDef>(null);

/* câmera: chaves [tempo, zoom, corte seco?]; o padrão é um plano só, sem zoom */
const CAM: [number, number, boolean?][] = [
	[0, 1.0],
	[DURACAO, 1.0],
];

/** destaques: só nos trechos com termo protagonista */
export const BLOCOS: BlocoDef[] = [];
/** legenda: [índice da 1ª palavra, texto do pedaço] (a barra quebra a linha; até 2 linhas) */
const PEDACOS: [number, string][] = [];
