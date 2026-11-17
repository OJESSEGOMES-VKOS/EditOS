/**
 * O plano do vídeo (documental-dados.md §9): a história desta fala em cima da imagem-mãe. O src/Reel.tsx desenha a partir
 * daqui e o scripts/checar.mjs grava a cópia src/plano.json (lida pelo scripts/som.py). Num vídeo novo, o
 * tools/novo-video.py troca o bloco entre as linhas "O PLANO" e "fim do plano" pelo scripts/plano_novo.ts (o começo
 * vazio): o plano do vídeo de exemplo nunca vem junto.
 * Dentro do bloco, string só para texto que vai para a tela ou palavra da fala (o tools/clone.py lê toda string como
 * texto de tela); família, paleta e varredura usam as constantes abaixo.
 */
import PB from './palavras.json';

export const A = 'A', B = 'B'; // família: A gráfico vivo, B arquivo
export const OURO = 'ouro', PERGAMINHO = 'pergaminho', MARROM = 'marrom'; // paletas (G31)
export const IGUAL = 'igual', VALOR = 'valor'; // varredura das barras: em passo igual ou em proporção ao valor
/** a fala transcrita deste vídeo, como está em src/palavras.json */
export const FALA = (PB as {text: string}[]).map((p) => p.text).join(' ');
/** um tempo: segundos, [índice, "palavra"] (o início dela) ou [índice, "palavra", mais segundos] */
type Tempo = number | [number, string] | [number, string, number];
type Obj = Record<string, unknown>;

let fala: string, cauda: number, familia: string, paleta: string;
let inicial: number | undefined, legenda: boolean | undefined;
let telas: Obj[], destaques: number[] | undefined, barras: Obj[] | undefined, apagao: Tempo | null | undefined;
let camera: Obj[] | undefined, marcas: Obj[] | undefined, reguas: Obj[] | undefined, divisao: Obj | null | undefined;
let pilha: Obj | null | undefined, documento: Obj | null | undefined, credito: {de: Tempo; txt: string} | undefined;

// ================================================================ O PLANO (num vídeo novo, nasce do scripts/plano_novo.ts)
fala = "Isso não é um gráfico qualquer, é a Bíblia inteira, livro por livro. Cada barra é um livro, de Gênesis a Apocalipse, e a altura é quantos capítulos ele tem. Gênesis tem 50, Obadias, um só. Somando todas, são 66 livros e 1.189 capítulos. 929 no Antigo Testamento, 260 no Novo. Parece muito? Três capítulos por dia e cinco no domingo e você lê tudo em um ano. E o livro mais longo de todos? Salmos, 150 capítulos, mais que os quatro evangelhos juntos, que somam 89. A Bíblia não é grande demais para você. É um ano, três capítulos por dia. Salve esse vídeo e comece amanhã em Gênesis 1.";
cauda = 2.6;
familia = A;
paleta = OURO;
inicial = 0.25;
telas = [
	{de: 0, titulo: "Não é um gráfico|*qualquer.*"},
	{de: [8, "Bíblia"], titulo: "É a *Bíblia*|inteira."},
	{de: [13, "Cada"], rotulo: "como ler", titulo: "Cada barra|é um *livro.*"},
	{de: [22, "e", -0.1], rotulo: "a altura", titulo: "Quantos|*capítulos.*"},
	{de: 12.0, numeros: [{valor: 50, de: 12.0, para: [32, "50,"], dito: "50", sub: "*Gênesis*"}]},
	{de: [33, "Obadias"], numeros: [{valor: 1, inicio: 1, de: [34, "um"], para: [34, "um"], dito: "um", sub: "*Obadias*"}]},
	{de: 16.6, rotulo: "somando tudo", numeros: [{valor: 66, de: 16.6, para: [39, "66"], dito: "66", sub: "*livros*"}, {valor: 1189, de: [40, "livros"], para: [42, "1.189"], dito: "1.189", sub: "*capítulos*"}]},
	{de: [43, "capítulos."], numeros: [{valor: 929, de: [43, "capítulos."], para: [44, "929"], dito: "929", sub: "no *Antigo*"}, {valor: 260, de: 24.0, para: [48, "260"], dito: "260", sub: "no *Novo*"}]},
	{de: [51, "Parece"], rotulo: "parece muito?", semana: {dias: [[53, "Três"], [53, "Três", 0.15], [53, "Três", 0.3], [53, "Três", 0.45], [53, "Três", 0.6], [53, "Três", 0.75], [58, "cinco"]], valores: [3, 3, 3, 3, 3, 3, 5], rotulos: ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"]}},
	{de: [68, "E"], titulo: "O mais *longo?*"},
	{de: 34.74, numeros: [{valor: 150, de: 34.74, para: [76, "150"], dito: "150", sub: "*capítulos*"}, {valor: 89, de: 39.6, para: [86, "89."], dito: "89", sub: "nos 4 *evangelhos*"}]},
	{de: [87, "A"], titulo: "Não é grande|*demais.*"},
	{de: [96, "um"], titulo: "*Um ano.*"},
	{de: [102, "Salve"], rotulo: "salve esse vídeo", titulo: "e comece *amanhã.*"},
];
destaques = [8, 14, 24, 32, 33, 39, 42, 44, 48, 53, 58, 67, 72, 75, 76, 82, 86, 92, 97, 109];
barras = [
	{t: [0, "Isso"], nivel: 1, dur: 0.8, varre: IGUAL},
	{t: [4, "gráfico"], nivel: 1.18, dur: 0.5},
	{t: [6, "é"], nivel: 1, dur: 0.4},
	{t: [10, "livro"], nivel: 1.3, dur: 1.2, varre: IGUAL},
	{t: [13, "Cada"], nivel: 0.3, dur: 0.4},
	{t: [14, "barra"], de: 0, ate: 0, nivel: 1.4, dur: 0.3},
	{t: [19, "Gênesis"], de: 1, ate: 65, nivel: 1, dur: 0.9, varre: IGUAL},
	{t: [27, "capítulos"], de: 0, ate: 0, nivel: 1.45, dur: 0.3},
	{t: [33, "Obadias"], nivel: 0.15, dur: 0.5},
	{t: [33, "Obadias"], de: 30, ate: 30, nivel: 1.5, dur: 0.5},
	{t: [36, "Somando"], nivel: 0.25, dur: 0.4},
	{t: [40, "livros"], nivel: 1, dur: 1.22, varre: VALOR},
	{t: [42, "1.189"], nivel: 1.12, dur: 1.0},
	{t: [43, "capítulos."], de: 39, ate: 65, nivel: 0.22, dur: 0.5},
	{t: 24.0, de: 39, ate: 65, nivel: 1, dur: 0.5},
	{t: 24.0, de: 0, ate: 38, nivel: 0.4, dur: 0.5},
	{t: [51, "Parece"], nivel: 0.18, dur: 0.5},
	{t: [62, "você"], nivel: 1, dur: 1.26, varre: VALOR},
	{t: [75, "Salmos,"], de: 18, ate: 18, nivel: 1.45, dur: 0.4},
	{t: [78, "mais"], de: 39, ate: 42, nivel: 0.6, dur: 0.3},
	{t: [81, "quatro"], de: 39, ate: 42, nivel: 0.9, dur: 0.3},
	{t: [82, "evangelhos"], de: 39, ate: 42, nivel: 1.25, dur: 0.4},
	{t: [87, "A"], nivel: 1, dur: 0.9, varre: IGUAL},
	{t: [96, "um"], nivel: 0.3, dur: 0.3},
	{t: [96, "um", 0.3], nivel: 1, dur: 1.6, varre: VALOR},
	{t: [102, "Salve"], nivel: 0.15, dur: 0.5},
	{t: [109, "Gênesis"], de: 0, ate: 0, nivel: 1.45, dur: 0.3},
	{t: [110, "1.", 0.2], de: 1, ate: 65, nivel: 0.7, dur: 2.3, varre: VALOR},
];
apagao = [68, "E"];
camera = [
	{t: [22, "e", -0.1], x: 132, zoom: 1.8, dur: 0.8},
	{t: [33, "Obadias"], x: 503.6, zoom: 1.7, dur: 0.8},
	{t: [36, "Somando"], x: 540, zoom: 1, dur: 0.7},
	{t: [91, "grande"], x: 540, zoom: 0.88, dur: 1.0},
	{t: [102, "Salve"], x: 540, zoom: 1, dur: 1.0},
];
marcas = [
	{t: [17, "livro,"], barra: 0, dur: 0.25},
	{t: [19, "Gênesis"], barra: 0, nome: "GÊNESIS", dur: 0.15},
	{t: [20, "a", -0.4], barra: 65, nome: "APOCALIPSE", dur: 0.6},
	{t: 12.0, barra: 0, nome: "GÊNESIS", dur: 0.5},
	{t: [33, "Obadias"], barra: 30, nome: "OBADIAS", dur: 0.6},
	{t: 16.6, barra: null},
	{t: [75, "Salmos,"], barra: 18, nome: "SALMOS", dur: 0.3},
	{t: [87, "A"], barra: null},
	{t: [106, "comece"], barra: 0, dur: 0.4},
	{t: [109, "Gênesis"], barra: 0, nome: "GÊNESIS 1", dur: 0.15},
];
reguas = [
	{de: [24, "altura"], ate: 12.0, barra: 0},
	{de: [77, "capítulos,", 0.4], ate: [86, "89."], barra: 18},
];
divisao = {de: [43, "capítulos."], ate: 27.0, depois: 38, rotulos: [{t: [46, "Antigo"], txt: "ANTIGO TESTAMENTO", grupo: 0}, {t: [50, "Novo."], txt: "NOVO", grupo: 1}]};
pilha = {de: [84, "que"], ate: 41.45, itens: [39, 40, 41, 42], junto: 18, dur: 0.9};
credito = {de: [102, "Salve"], txt: "Dados: capítulos contados na Almeida e na King James, livro a livro (66 livros, 1.189 capítulos)"};
// ================================================================ fim do plano

const PLANO = {fala, cauda, familia, paleta, inicial, legenda, telas, destaques, barras, apagao, camera, marcas, reguas, divisao, pilha, documento, credito};
export default PLANO;
