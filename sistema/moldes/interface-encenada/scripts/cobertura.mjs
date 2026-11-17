// Conferidor do interface-encenada: confere o plano contra a fala e a legenda contra as regras de ofício (REGRAS.md §3 e §5).
// Sai com código 1 quando reprova e diz o que mexer (arquivo:linha).
// uso (de dentro da pasta do vídeo ou do molde): node scripts/cobertura.mjs
// Confere: 1) toda palavra do plano (w('palavra', n) e iw(...) em src/) existe na fala; 2) toda palavra dita aparece na
// legenda enquanto é dita; 3) pedaço >= 1,5 s e palavra >= 0,4 s depois de nascer; 4) nenhuma palavra duas vezes; 5) no
// máximo 2 linhas; 6) um lugar por modo (MODELO §2); 7) legenda e títulos dentro da zona segura (x 60-940, y 250-1500).
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(MOLDE, 'src');
const PB = JSON.parse(fs.readFileSync(path.join(SRC, 'palavras.json'), 'utf8'));
const limpa = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const fmt = (x) => x.toFixed(2).replace('.', ',');
const FONTES = fs.readdirSync(SRC).filter((f) => /\.tsx?$/.test(f)).map((f) => ({f: `src/${f}`, linhas: fs.readFileSync(path.join(SRC, f), 'utf8').split('\n')}));
const onde = (trecho) => {
	for (const {f, linhas} of FONTES) {
		const i = linhas.findIndex((l) => l.includes(trecho));
		if (i >= 0) return `${f}:${i + 1}`;
	}
	return 'src/';
};
let reprova = false;

/** declarações de topo de um arquivo (const/function): nome -> {de: 1ª linha, linhas} */
const declaracoes = (linhas) => {
	const out = new Map();
	let atual = null;
	linhas.forEach((l, i) => {
		const m = l.match(/^(?:export )?(?:const|function) (\w+)/);
		if (m) out.set(m[1], (atual = {de: i, linhas: []}));
		if (atual) atual.linhas.push(l);
	});
	return out;
};
/** o que é alcançável a partir das raízes (por nome citado), para não cobrar palavra de cena/herói que o plano não usa */
const alcancaveis = (mapa, raizes) => {
	const vistos = new Set(), fila = [...raizes];
	while (fila.length) {
		const n = fila.pop();
		if (vistos.has(n) || !mapa.has(n)) continue;
		vistos.add(n);
		const txt = mapa.get(n).linhas.join('\n');
		for (const outro of mapa.keys()) if (!vistos.has(outro) && new RegExp(`\\b${outro}\\b`).test(txt)) fila.push(outro);
	}
	return vistos;
};
// 1. as palavras do plano existem na fala (lista todas de uma vez, com a linha). Em src/Cenas.tsx só conta o código das
// cenas que base() usa (src/tema.ts); cena fora de base() não é cobrada.
const faltam = [];
const tema = FONTES.find((x) => x.f === 'src/tema.ts').linhas.join('\n');
// as telas da casa que o plano liga: no bloco do plano de src/tema.ts, cada uma é uma linha `<id> = ...` (rosto e perto
// são o rosto cheio e o punch-in; as livres moram em src/telas/, não em Cenas.tsx)
const BLOCO = tema.match(/\n[^\n]*O PLANO[^\n]*\n([\s\S]*?)\n[^\n]*fim do plano/)?.[1] ?? '';
if (!/O PLANO/.test(tema) || !/fim do plano/.test(tema)) {
	console.log('REPROVADO: src/tema.ts perdeu as linhas "O PLANO" e "fim do plano" (o bloco do plano): devolva os marcadores.');
	process.exit(1);
}
const usadas = [...BLOCO.matchAll(/^(\w+) = (?!null)/gm)].map((m) => m[1]);
const cenasTxt = FONTES.find((x) => x.f === 'src/Cenas.tsx').linhas;
const comp = Object.fromEntries([...cenasTxt.join('\n').matchAll(/^\t(\w+): (\w+),$/gm)].map((m) => [m[1], m[2]]));
const mapa = declaracoes(cenasTxt);
const vivas = alcancaveis(mapa, usadas.map((id) => comp[id]).filter(Boolean));
const conta = (f, i) => f !== 'src/Cenas.tsx' || [...mapa].some(([n, d]) => vivas.has(n) && i >= d.de && i < d.de + d.linhas.length);
for (const {f, linhas} of FONTES)
	linhas.forEach((l, i) => {
		if (!conta(f, i) || /^\s*(\/\/|\*|\/\*)/.test(l)) return; // comentário não é plano
		for (const m of l.matchAll(/\bi?w\('([^'$]+)'(?:,\s*(\d+))?\)/g)) {
			const n = Number(m[2] ?? 1);
			const tem = PB.filter((p) => limpa(p.text) === limpa(m[1])).length;
			if (tem < n) faltam.push(`${f}:${i + 1}: ${m[0]} pede a ${n}ª vez que se diz "${m[1]}", e a fala ${tem ? `só tem ${tem}` : 'não tem nenhuma'}`);
		}
	});
console.log(`${faltam.length} palavras do plano que a fala não tem`);
faltam.forEach((x) => console.log('  ' + x));
if (faltam.length) {
	console.log('REPROVADO: o plano é de outra fala. Refaça o bloco "O PLANO" de src/tema.ts para a fala nova (comece do scripts/plano_novo.ts; modelos/interface-encenada/interface-encenada.md, seção 9).');
	process.exit(1);
}

// carrega o plano (o mesmo código do vídeo); o temporário mora no .tmp do estúdio e sai sempre, mesmo com erro
const TMP = path.resolve(MOLDE, '..', '..', '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `cobertura-${process.pid}.mjs`);
let R;
try {
	await build({
		stdin: {contents: "export * from './src/Legenda.tsx'; export {DURACAO, FPS, LIVRES, montaCenas} from './src/tema.ts';", resolveDir: MOLDE, loader: 'ts'},
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
const {exibicoes, MIN_PEDACO, LUGAR, DURACAO, FPS, montaCenas} = R;
const L_MIN = onde('export const MIN_PEDACO');
const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};

for (const previas of [false, true]) {
	const modo = previas ? 'com prévias' : 'sem prévias';
	const ex = exibicoes(previas);
	// 2. cobertura: cada palavra escrita na tela enquanto é dita (do início + 0,1 s ao fim menos os 2 quadros do corte)
	const buracos = [];
	PB.forEach((p, i) => {
		let f0 = Math.ceil((p.start + 0.1) * FPS), f1 = Math.floor((p.end - 0.07) * FPS);
		if (f1 < f0) f0 = f1 = Math.round(((p.start + p.end) / 2) * FPS);
		const sem = [];
		for (let f = f0; f <= f1; f++) if (!ex.some((e) => f / FPS >= e.de && f / FPS < e.ate && e.ids.includes(i) && f / FPS >= PB[i].start - 0.02)) sem.push(fmt(f / FPS));
		if (sem.length) buracos.push(`${i} "${p.text}" sem legenda em ${sem.join(', ')} s`);
	});
	// 3 a 5. tempo de leitura, repetição, linhas
	const curtos = [], linhas = [];
	for (const e of ex) {
		const d = e.ate - e.de;
		// pedaço cheio (juntar() parou em MAX_LINHAS porque a fala é rápida): basta 1 s, e as palavras dele não têm o mínimo de 0,4 s
		if (d < (e.cheio ? 1 : 1.5)) curtos.push(`"${e.texto}" fica ${fmt(d)} s${e.cheio ? ' (cheio: mín. 1 s)' : ''}`);
		for (const i of e.ids) if (!e.cheio && e.ate - PB[i].start < 0.4) curtos.push(`"${PB[i].text}" em "${e.texto}" fica ${fmt(e.ate - PB[i].start)} s`);
		if (e.linhas > 2) linhas.push(`"${e.texto}" com ~${e.linhas} linhas`);
	}
	const vezes = PB.map(() => 0);
	ex.forEach((e) => e.ids.forEach((i) => vezes[i]++));
	const repetidas = vezes.flatMap((v, i) => (v > 1 ? [`${i} "${PB[i].text}" ${v} vezes`] : []));
	// 6. lugar por modo; 7. zona segura
	const lugares = {};
	ex.forEach((e) => (lugares[e.modo] ??= new Set()).add(e.y0));
	const fora = ex.filter((e) => e.x0 < ZONA.esq || e.x1 > ZONA.dir || e.y0 < ZONA.topo || e.y1 > ZONA.base).map((e) => `"${e.texto}" (${e.modo}) em ${fmt(e.de)} s: x ${Math.round(e.x0)}-${Math.round(e.x1)}, y ${Math.round(e.y0)}-${Math.round(e.y1)}`);
	console.log(`\n${modo}: ${ex.length} pedaços de legenda`);
	console.log(`${buracos.length} palavras sem legenda`); buracos.forEach((x) => console.log('  ' + x));
	console.log(`${curtos.length} curtos (mín. 1,5 s por pedaço e 0,4 s por palavra)${curtos.length ? `: com MIN_PEDACO = ${MIN_PEDACO} (${L_MIN}); ponha 1.5 para os pedaços se juntarem; se ainda sobrar, a cena acaba cedo demais (mude o corte no bloco "O PLANO" de src/tema.ts)` : ''}`);
	curtos.slice(0, 12).forEach((x) => console.log('  ' + x)); if (curtos.length > 12) console.log(`  ... e mais ${curtos.length - 12}`);
	console.log(`${repetidas.length} palavras exibidas mais de uma vez`); repetidas.forEach((x) => console.log('  ' + x));
	console.log(`${linhas.length} pedaços com mais de 2 linhas${linhas.length ? ": diminua MIN_PEDACO" : ""}`); linhas.forEach((x) => console.log('  ' + x));
	console.log(`lugares da legenda por modo (MODELO §2, um por modo): ${Object.entries(lugares).map(([m, ys]) => `${m} ${[...ys].join('/')}`).join(', ')}`);
	const varios = Object.entries(lugares).filter(([m, ys]) => ys.size > 1 && m !== 'motion'); // motion: em cima só no fecho (MODELO §2, ref3)
	console.log(`${fora.length} pedaços fora da zona segura (x ${ZONA.esq}-${ZONA.dir}, y ${ZONA.topo}-${ZONA.base})${fora.length ? `: suba a legenda do modo (LUGAR em ${onde('export const LUGAR')}) ou encurte o pedaço` : ''}`);
	fora.slice(0, 12).forEach((x) => console.log('  ' + x)); if (fora.length > 12) console.log(`  ... e mais ${fora.length - 12}`);
	if (buracos.length || curtos.length || repetidas.length || linhas.length || varios.length || fora.length) reprova = true;
}

// 7. títulos do palco (src/ui.tsx Titulo) das cenas vivas: topo 205 com duas linhas (fora da zona: num vídeo novo, título de 1 linha), 255 com uma
const titulos = [];
for (const {f, linhas} of FONTES)
	linhas.forEach((l, i) => {
		if (!conta(f, i)) return; // só títulos de cenas que base() usa (o mesmo filtro da checagem 1)
		const m = l.match(/<Titulo serif="([^"]*)"(?: sans="([^"]*)")?/);
		if (!m) return;
		const topo = m[2] ? 205 : 255;
		const larg = Math.max(m[1].length * 112 * 0.45, (m[2] ?? '').length * 96 * 0.55);
		if (topo < ZONA.topo || 540 + larg / 2 > ZONA.dir) titulos.push(`${f}:${i + 1}: título "${m[1]}${m[2] ? ' / ' + m[2] : ''}" y ${topo}, x ${Math.round(540 - larg / 2)}-${Math.round(540 + larg / 2)}`);
	});
console.log(`\n${titulos.length} títulos fora da zona segura${titulos.length ? ' (o topo de 2 linhas é 205 em src/ui.tsx, Titulo; encurte o título ou use uma linha)' : ''}`);
titulos.forEach((x) => console.log('  ' + x));
if (titulos.length) reprova = true;
// 8. as telas livres: registradas, título dito e de 1 linha, de 1,5 a 8 s, e o texto do card que a legenda não mostra na
// mesma hora (G26)
const ditas = new Set(PB.map((p) => limpa(p.text)));
const palavrasDe = (s) => s.split(/\s+/).map(limpa).filter(Boolean);
const regArq = path.join(SRC, 'telas', 'index.ts');
const regTxt = fs.existsSync(regArq) ? fs.readFileSync(regArq, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '') : '';
const registradas = new Set((regTxt.match(/TELAS\s*(?::[^=]*)?=\s*\{([^}]*)\}/)?.[1] ?? '').split(',').map((x) => x.split(':')[0].trim()).filter(Boolean));
const cenas0 = montaCenas(false);
const ex0 = exibicoes(false);
const livres = [];
cenas0.filter((c) => c.livre).forEach((c) => {
	const L = c.livre, nome = `livres (${L.comp}, ${fmt(c.de)}-${fmt(c.ate)} s)`;
	if (!registradas.has(L.comp)) livres.push(`${nome}: a tela "${L.comp}" não está registrada em src/telas/index.ts`);
	if (L.titulo) {
		if (!palavrasDe(L.titulo).every((p) => ditas.has(p))) livres.push(`${nome}: o título "${L.titulo}" tem palavra que a fala não diz (G19)`);
		if (L.titulo.length > 14) livres.push(`${nome}: o título "${L.titulo}" tem ${L.titulo.length} letras (1 linha de serifa 112 px cabe até 14, seção 3)`);
	}
	if (c.ate - c.de < 1.5) livres.push(`${nome}: a tela fica ${fmt(c.ate - c.de)} s (mín. 1,5 s)`);
	if (c.ate - c.de > 8) livres.push(`${nome}: a tela fica ${fmt(c.ate - c.de)} s (tela longa: quebre num corte ou volte ao rosto, seção 3)`);
	const naLegenda = new Set(ex0.filter((e) => e.de < c.ate && e.ate > c.de).flatMap((e) => e.texto.split(/\s+/).map(limpa)));
	for (const [k, txt] of Object.entries(L.textos ?? {})) {
		const ws = palavrasDe(String(txt));
		if (!ws.every((p) => ditas.has(p))) livres.push(`${nome}: textos.${k} "${txt}" tem palavra que a fala não diz (G19)`);
		else if (ws.length && ws.every((p) => naLegenda.has(p))) livres.push(`${nome}: textos.${k} "${txt}" e a legenda mostram as mesmas palavras na mesma hora (G26): deixe a legenda contar e a tela mostrar o objeto`);
	}
});
console.log(`\n${livres.length} problemas nas telas livres`);
livres.forEach((x) => console.log('  ' + x));
if (livres.length) reprova = true;
// 9. o rosto cheio é a maior parte (G6, G19; seção 3)
const rostoT = cenas0.filter((c) => c.modo === 'rosto').reduce((s, c) => s + c.ate - c.de, 0);
console.log(`rosto cheio em ${Math.round((rostoT / DURACAO) * 100)}% do vídeo (sem prévias; mín. 50%)`);
if (rostoT / DURACAO < 0.5) {
	console.log('  o rosto cheio tem de ser a maior parte: tire uma tela ou encurte (tela só no trecho que pede a interface, G28)');
	reprova = true;
}
// para o tools/clone.py: as telas da casa ligadas (com o início) e as livres deste plano, em src/tempos.json
const tempos = {_leia: 'Gerado por scripts/cobertura.mjs a partir do plano de src/tema.ts, para o tools/clone.py. Não editar à mão.', livres: cenas0.filter((c) => c.livre).map((c) => ({comp: c.livre.comp, de: c.de}))};
for (const c of cenas0) if (!c.livre && c.id !== 'rosto' && c.id !== 'perto') tempos[c.id] = {de: c.de};
fs.writeFileSync(path.join(SRC, 'tempos.json'), JSON.stringify(tempos, null, 1) + '\n');
console.log(`\nduração ${fmt(DURACAO)} s`);
console.log(reprova ? 'REPROVADO: corrija o que está acima e rode de novo.' : 'APROVADO: 0 em todas as regras.');
process.exit(reprova ? 1 : 0);
