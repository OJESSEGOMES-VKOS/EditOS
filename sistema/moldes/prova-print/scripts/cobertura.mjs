// Conferidor do prova-print (modelos/prova-print/prova-print.md §8). Sai com código 1 quando reprova e diz
// o que mexer. uso (de dentro da pasta do vídeo ou do molde): node scripts/cobertura.mjs
// Confere:
//  1) toda palavra do plano (w('x', n) / iw(...)) existe na fala;
//  2) toda palavra dita aparece na legenda enquanto é dita (as do comando fixo do fecho contam como cobertas pelo fecho);
//  3) tempo de leitura: pedaço >= 1,5 s (cheio >= 1 s) e cada palavra >= 0,4 s depois de nascer;
//  4) nenhuma palavra duas vezes; 5) no máximo 2 linhas; 6) G11/G14: pedaço não junta fim de frase com começo de outra;
//  7) a legenda em até 2 lugares (G12) e dentro da zona segura (x 60-940, y 250-1500); título-promessa dentro da zona;
//  8) nada atravessa corte (pedaço acaba até o fim da cena);
//  9) contador para no número DITO: a palavra do instante do contador é aquele número (G10, "números como ele disse");
// 10) todo grifo nasce numa palavra da fala (at: w(...)); 11) todo print de prova tem origem em public/ORIGEM.md (G25);
// 12) rosto fechado só em cena 'rosto', no máximo 3 cenas e até 20% do vídeo; nenhuma cena de tela passa de 5,5 s (a
//     'pessoa', o vídeo normal, pode durar o que a fala durar); vitrine seguida (sem rosto) no máximo 8 s;
//     a pessoa (pessoa + rosto fechado) é a maior parte do vídeo (só aviso; a antiga regra "vitrine e capítulo só fechando
//     cena forte" foi abolida); palco só com a prop fundo: 'recorte'; 13) nada de brilho/sombra justa na letra (G16): textShadow só com desfoque >= 30 px;
// 14) PV4: nenhuma palavra/ideia em dois elementos ao mesmo tempo (título, contador, comando, legenda);
// 15) PV5: nenhum texto fixo pendurado: sai até 1 s depois da última palavra dele e não passa da cena (só o comando do fecho fica);
// 16) PV6/PV8: no cartão de câmera a cabeça inteira (topo medido no recorte) sai da moldura, sem bater na legenda, rosto centrado;
// 17) PV7: a câmera que segue o rosto é lenta e sem tremida (velocidade, tranco e vaivém do caminho alisado).
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(MOLDE, 'src');
const PB = JSON.parse(fs.readFileSync(path.join(SRC, 'palavras.json'), 'utf8'));
const limpa = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const fmt = (x) => x.toFixed(2).replace('.', ',');
const FONTES = fs.readdirSync(SRC).filter((f) => /\.tsx?$/.test(f)).map((f) => ({f: `src/${f}`, txt: fs.readFileSync(path.join(SRC, f), 'utf8')}));
const falhas = [];
const falha = (regra, msg) => falhas.push(`[${regra}] ${msg}`);

// 1. palavras do plano
for (const {f, txt} of FONTES)
	txt.split('\n').forEach((l, i) => {
		if (/^\s*(\/\/|\*|\/\*\*)/.test(l)) return;
		for (const m of l.matchAll(/\bi?w\('([^'$]+)'(?:,\s*(\d+))?\)/g)) {
			const n = Number(m[2] ?? 1);
			const tem = PB.filter((p) => limpa(p.text) === limpa(m[1])).length;
			if (tem < n) falha('plano', `${f}:${i + 1}: ${m[0]} pede a ${n}ª vez de "${m[1]}", a fala ${tem ? `só tem ${tem}` : 'não tem'}`);
		}
	});
if (falhas.length) {
	falhas.forEach((x) => console.log(x));
	console.log('REPROVADO: o plano é de outra fala. Refaça base() em src/tema.ts, src/Cenas.tsx e CHAVE/FIXO em src/Legenda.tsx.');
	process.exit(1);
}

// carrega o plano (o mesmo código do vídeo); temporário no .tmp do estúdio
const TMP = path.resolve(MOLDE, '..', '..', '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `cobertura-pf01-${process.pid}.mjs`);
let R;
try {
	await build({
		stdin: {contents: "export * from './src/Legenda.tsx'; export {DURACAO, FPS, CENAS, TITULO, FIXOS, CONTADORES, G, R, CAMINHO} from './src/tema.ts';", resolveDir: MOLDE, loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'silent', jsx: 'automatic', loader: {'.json': 'json'}, absWorkingDir: MOLDE,
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	R = await import(pathToFileURL(tmp).href);
} catch (e) {
	console.error((e.errors?.length ? e.errors.map((x) => `${x.location ? `${path.relative(MOLDE, x.location.file)}:${x.location.line}: ` : ''}${x.text}`).join('\n') : e.message) || String(e));
	process.exitCode = 1;
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!R) process.exit(1);
const {exibicoes, FIXO, LUGAR, DURACAO, FPS, CENAS, TITULO, FIXOS, CONTADORES, G, R: RM, CAMINHO} = R;
const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
const ex = exibicoes();
const cenaDe = (t) => CENAS.find((c) => t >= c.de && t < c.ate) ?? CENAS[CENAS.length - 1];

// 2. cobertura
PB.forEach((p, i) => {
	if (FIXO.has(i)) {
		// a palavra sai da legenda porque um texto fixo a mostra: ele tem de estar na tela quando ela é dita
		if (!FIXOS.some((x) => x.ids.includes(i) && p.start >= x.de - 1e-6 && p.start < x.ate)) falha('cobertura', `"${p.text}" (${fmt(p.start)} s) não está na legenda e o texto fixo que a mostra não está na tela`);
		return;
	}
	let f0 = Math.ceil((p.start + 0.1) * FPS), f1 = Math.floor((p.end - 0.07) * FPS);
	if (f1 < f0) f0 = f1 = Math.round(((p.start + p.end) / 2) * FPS);
	for (let f = f0; f <= f1; f++)
		if (!ex.some((e) => f / FPS >= e.de && f / FPS < e.ate && e.ids.includes(i))) {
			falha('cobertura', `${i} "${p.text}" sem legenda em ${fmt(f / FPS)} s`);
			break;
		}
});
// 3 a 8
const vezes = PB.map(() => 0);
const aceitos = [];
const lugares = new Set();
for (const e of ex) {
	const d = e.ate - e.de;
	const c0 = cenaDe(e.de);
	const fimDeTrecho = /[.,!?:;]$/.test(PB[e.ids[e.ids.length - 1]].text);
	if (d < 1.5) {
		// curto porque o corte da cena caiu no meio do trecho: defeito do plano (mova o corte para a pausa ou a pontuação)
		if (Math.abs(e.ate - c0.ate) < 1e-6 && !fimDeTrecho) falha('leitura', `"${e.texto}" fica ${fmt(d)} s: o corte de ${fmt(c0.ate)} s parte o trecho; mova o corte em base()`);
		// curto porque a fala corre (o próximo trecho já começou): G11/G14 vence; aceito a partir de 0,4 s, e listado
		else if (d < 0.4) falha('leitura', `"${e.texto}" fica ${fmt(d)} s (pisca: mín. 0,4 s)`);
		else aceitos.push(`"${e.texto}" ${fmt(d)} s`);
	}
	// a palavra nasce com o pedaço (apagada, acende quando é dita): o mínimo de 0,4 s conta do nascimento do pedaço
	if (d < 0.4) falha('leitura', `"${e.texto}": palavras na tela por ${fmt(d)} s`);
	if (e.linhas > 2) falha('linhas', `"${e.texto}" com ~${e.linhas} linhas`);
	e.ids.slice(0, -1).forEach((i) => /[.,!?:;]$/.test(PB[i].text) && falha('G11/G14', `"${e.texto}" junta fim de trecho ("${PB[i].text}") com o seguinte`));
	e.ids.forEach((i) => vezes[i]++);
	lugares.add(e.y0);
	if (e.x0 < ZONA.esq || e.x1 > ZONA.dir || e.y0 < ZONA.topo || e.y1 > ZONA.base) falha('zona', `"${e.texto}" x ${Math.round(e.x0)}-${Math.round(e.x1)}, y ${e.y0}-${e.y1}`);
	const c = cenaDe(e.de);
	if (e.ate > c.ate + 1e-6) falha('corte', `"${e.texto}" atravessa o corte de ${fmt(c.ate)} s`);
}
vezes.forEach((v, i) => v > 1 && falha('repete', `${i} "${PB[i].text}" ${v} vezes`));
if (lugares.size > 2) falha('G12', `legenda em ${lugares.size} lugares (máx. 2): ${[...lugares].join(', ')}`);
// título-promessa: 1 linha cada, largura estimada (sans 84 px, serifa 108 px) dentro de x 60-940
for (const [k, fonte, fator] of TITULO ? [['linha1', 84, 0.56], ['linha2', 108, 0.42]] : []) {
	const larg = TITULO[k].length * fonte * fator + (k === 'linha2' ? 60 : 0);
	if (500 - larg / 2 < ZONA.esq - 1 || larg > ZONA.dir - ZONA.esq) falha('zona', `título ${k} "${TITULO[k]}" larga demais (~${Math.round(larg)} px; até 880): encurte`);
}

// 9. contador para no número dito
const NUM = {um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, cem: 100};
const cenasTxt = FONTES.find((x) => x.f === 'src/Cenas.tsx').txt;
for (const k of CONTADORES) {
	const dito = limpa(PB[k.ids[0]].text);
	const num = /^\d+%?$/.test(dito) ? Number(dito.replace('%', '')) : NUM[dito];
	if (num !== k.valor) falha('G10', `contador da cena ${k.cena} vai até ${k.valor}, mas a palavra dita é "${PB[k.ids[0]].text}" (${num ?? 'não é número'}): a tela mostra o número como foi falado`);
}
if (/<Contador\b(?![^>]*de=\{k\.de\})/.test(cenasTxt)) falha('G10', 'contador fora de CONTADORES (src/tema.ts): todo contador nasce lá, com a palavra dita');
// 10. grifo nasce numa palavra
for (const m of cenasTxt.matchAll(/\{at: ([^,]+), x: \d+, y: \d+, w: \d+, h: \d+\}/g)) if (!/^w\(/.test(m[1].trim())) falha('grifo', `grifo com at: ${m[1]} (tem de ser w('palavra dita'))`);
// 11. prints com origem
const origem = fs.existsSync(path.join(MOLDE, 'public', 'ORIGEM.md')) ? fs.readFileSync(path.join(MOLDE, 'public', 'ORIGEM.md'), 'utf8') : '';
for (const m of cenasTxt.matchAll(/src: '([^']+\.(?:png|jpg|webp))'/g)) if (!origem.includes(m[1])) falha('G25', `print ${m[1]} sem origem em public/ORIGEM.md`);
// 12. ritmo e rosto
const rosto = CENAS.filter((c) => c.modo === 'rosto');
const tRosto = rosto.reduce((s, c) => s + c.ate - c.de, 0);
if (rosto.length > 3) falha('rosto', `${rosto.length} cenas de rosto fechado (máx. 3: emoção e fecho)`);
if (tRosto / DURACAO > 0.2) falha('rosto', `rosto fechado em ${Math.round((100 * tRosto) / DURACAO)}% do vídeo (máx. 20%)`);
let seguida = 0;
for (const c of CENAS) {
	if (c.modo !== 'pessoa' && c.ate - c.de > 5.5) falha('ritmo', `cena ${c.id} dura ${fmt(c.ate - c.de)} s (máx. 5,5: quebre num corte entre palavras)`);
	// (a antiga G43 "tela só fechando cena forte" foi abolida em 2026-11-05: onde a tela entra é a G28, pela relevância ao tema)
	seguida = c.modo === 'vitrine' ? seguida + c.ate - c.de : 0;
	if (seguida > 8) falha('ritmo', `vitrine seguida (sem rosto) por ${fmt(seguida)} s até ${c.id} (máx. 8)`);
}
// G6: a pessoa (o vídeo normal + o rosto fechado) é a maior parte do vídeo
{
	const tPessoa = CENAS.filter((c) => c.modo === 'pessoa' || c.modo === 'rosto').reduce((s, c) => s + c.ate - c.de, 0);
	if (tPessoa / DURACAO < 0.5) console.log(`aviso: a pessoa está em ${Math.round((100 * tPessoa) / DURACAO)}% do vídeo (menos de 50%); confira se cada tela serve à fala e ao tema (G28), não reprova`);
}
// 13. G16
for (const {f, txt} of FONTES)
	for (const m of txt.matchAll(/textShadow: '([^']+)'/g)) {
		const blur = Number((m[1].match(/^-?\d+p?x? -?\d+px (\d+)px/) ?? [])[1] ?? 0);
		if (blur < 30) falha('G16', `${f}: textShadow "${m[1]}" desenha a borda da letra (desfoque < 30 px)`);
	}

// 14. PV4: um elemento por ideia. Dois textos na tela ao mesmo tempo não dizem a mesma palavra (número escrito ou falado
// conta igual: "três" = "3"). Os prints (grifo) não entram: são a prova, não texto da casa.
const PARADA = new Set('o a os as de do da dos das em no na nos nas e que um uma pelo pela pelos se eu te para pra com por esse essa isso este esta ele ela aqui'.split(' '));
const NUMS = Object.fromEntries(Object.entries(NUM).map(([k, v]) => [k, String(v)]));
const fichas = (txt) => new Set(txt.split(/\s+/).map((x) => limpa(x).replace(/%$/, '')).map((x) => NUMS[x] ?? x).filter((x) => x && !PARADA.has(x)).map((x) => (x.length > 4 ? x.replace(/s$/, '') : x)));
const naTela = [...FIXOS.map((x) => ({nome: x.nome, texto: x.texto, de: x.de, ate: x.ate})), ...ex.map((e) => ({nome: 'legenda', texto: e.texto, de: e.de, ate: e.ate}))];
for (let a = 0; a < naTela.length; a++)
	for (let b = a + 1; b < naTela.length; b++) {
		const A = naTela[a], B = naTela[b];
		if (Math.min(A.ate, B.ate) - Math.max(A.de, B.de) <= 1 / FPS) continue;
		const fa = fichas(A.texto);
		const rep = [...fichas(B.texto)].filter((x) => fa.has(x));
		if (rep.length) falha('PV4', `${A.nome} "${A.texto}" e ${B.nome} "${B.texto}" dizem "${rep.join(', ')}" ao mesmo tempo (${fmt(Math.max(A.de, B.de))} s): um elemento por ideia; tire a palavra de um deles`);
	}
// 15. PV5: nada pendurado. Texto fixo sai até 1 s depois da última palavra dele e não atravessa a cena; só o comando do
// fecho fica até o fim (é o pedido). O título e os contadores nascem na própria cena.
for (const x of FIXOS) {
	if (x.fecho) continue;
	const fim = Math.max(...x.ids.map((i) => PB[i].end));
	if (x.ate > fim + 1.0 + 1e-6) falha('PV5', `${x.nome} "${x.texto}" fica até ${fmt(x.ate)} s, ${fmt(x.ate - fim)} s depois da fala dele (${fmt(fim)} s): máx. 1 s, some com a fala`);
	if (cenaDe(x.de) !== cenaDe(Math.max(x.de, x.ate - 0.01))) falha('PV5', `${x.nome} "${x.texto}" atravessa o corte de ${fmt(cenaDe(x.de).ate)} s`);
}
if ((cenasTxt.match(/<Titulo\b/g) ?? []).length > 1) falha('PV5', 'o título-promessa aparece em mais de um lugar de src/Cenas.tsx: ele é só da cena do gancho');
// 16. PV6/PV8: o cartão de câmera do palco (só quando o plano tem palco: a opção fundo: 'recorte', G6)
const g = G.rostoPalco;
const temPalco = CENAS.some((c) => c.modo === 'palco');
if (!temPalco) console.log("sem palco no plano (G6: padrão sem recorte); PV6/PV8 não se aplicam");
else if (typeof RM.topo !== 'number') falha('PV6', 'src/rosto_med.json sem o topo da cabeça: rode scripts/recorte.py');
else {
	const topo = g.olhos - g.s * (RM.olhos - RM.topo); // o ponto mais alto da cabeça no vídeo (p2), na tela
	const legBase = G.legendaPalco + 2 * 78;
	if (topo < legBase + 8) falha('PV6', `a cabeça sobe até y ${Math.round(topo)} e bate na legenda do palco (até y ${legBase}): desça o cartão (olhos) ou a escala`);
	if (topo > g.y - 60) falha('PV8', `a cabeça não sai da moldura: topo em y ${Math.round(topo)}, borda do cartão em y ${g.y} (ref4: ~165 px acima)`);
	if (g.olhos - g.y < 90) falha('PV6', `olhos a ${g.olhos - g.y} px da borda do cartão: o rosto fica cortado pela borda (ref4: ~125 px)`);
	console.log(`cartão de câmera: borda y ${g.y}, olhos y ${g.olhos}, topo da cabeça y ${Math.round(topo)} (o mais alto do vídeo; mediana ${Math.round(g.olhos - g.s * (RM.olhos - RM.topo_med))}), legenda do palco até y ${legBase}`);
}
if (temPalco && !fs.existsSync(path.join(MOLDE, 'public', 'pessoa.webm'))) falha('PV8', 'public/pessoa.webm não existe: rode scripts/recorte.py (a cabeça sai da moldura recortada)');
for (const cp of [G.cardPalco, G.cardPalcoTitulo]) if (cp.y + cp.h > G.legendaPalco - 16) falha('zona', `card do palco termina em y ${cp.y + cp.h}, colado na legenda do palco (y ${G.legendaPalco})`);
if (temPalco) {
	let pior = 0;
	CAMINHO.forEach((cx) => {
		const x = Math.min(g.x, Math.max(g.x + g.w - 1080 * g.s, 540 - g.s * cx)); // o mesmo de RostoPalco (src/ui.tsx)
		pior = Math.max(pior, Math.abs(x + g.s * cx - (g.x + g.w / 2)));
	});
	if (pior > 40) falha('PV6', `o rosto sai do centro do cartão até ${Math.round(pior)} px (máx. 40)`);
}
// 17. PV7: a câmera segue o rosto devagar, sem tremer. Medido na tela, na maior escala de rosto do vídeo (o rosto fechado)
{
	const sMax = Math.max(g.s, 1.25);
	const v = CAMINHO.slice(1).map((x, i) => (x - CAMINHO[i]) * sMax * FPS); // px/s na tela
	const vMax = Math.max(...v.map(Math.abs));
	const acc = Math.max(...v.slice(1).map((x, i) => Math.abs(x - v[i]) * FPS)); // px/s²
	let vaivem = 0;
	for (let i = 1; i < v.length; i++) if (Math.sign(v[i]) !== Math.sign(v[i - 1]) && Math.abs(v[i]) > 3) vaivem++;
	if (vMax > 90) falha('PV7', `a câmera corre ${Math.round(vMax)} px/s (máx. 90): alise mais (SIGMA em src/tema.ts)`);
	if (acc > 120) falha('PV7', `a câmera dá tranco de ${Math.round(acc)} px/s² (máx. 120)`);
	if (vaivem / DURACAO > 0.35) falha('PV7', `a câmera troca de sentido ${vaivem} vezes em ${fmt(DURACAO)} s: tremendo (máx. 1 a cada ~3 s)`);
	console.log(`câmera: até ${Math.round(vMax)} px/s, tranco até ${Math.round(acc)} px/s², ${vaivem} trocas de sentido`);
}

const modos = {};
CENAS.forEach((c) => (modos[c.modo] = (modos[c.modo] ?? 0) + c.ate - c.de));
console.log(`${ex.length} pedaços de legenda | ${CENAS.length} cenas | duração ${fmt(DURACAO)} s`);
console.log('tempo por modo: ' + Object.entries(modos).map(([m, s]) => `${m} ${Math.round((100 * s) / DURACAO)}%`).join(', '));
if (aceitos.length) console.log(`${aceitos.length} pedaços curtos aceitos (fala corrida; G11/G14 não deixa juntar trechos): ${aceitos.join(' | ')}`);
falhas.forEach((x) => console.log('  ' + x));
console.log(falhas.length ? `REPROVADO: ${falhas.length} achados.` : 'APROVADO: 0 em todas as regras.');
process.exit(falhas.length ? 1 : 0);
