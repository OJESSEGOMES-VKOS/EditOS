// Checador do especialista: lê o plano de src/Reel.tsx e confere as regras da casa (herança) e as do modelo.
// uso (na pasta do vídeo ou do molde): node scripts/checar.mjs      -> APROVADO, ou a lista do que mexer (sai com 1)
// Confere (2026-11-07, correções do dono):
//  - toda palavra na tela enquanto é dita, cada uma uma vez só;
//  - G9: página >= 1,5 s (abaixo só aviso se fecha trecho ou >= 1,2 s) e nunca < 0,45 s; gigante >= 0,4 s; máx. 2 linhas;
//  - G11/G14: nenhum bloco atravessa fim de trecho; G18: citação abre e fecha aspas em cada página, gigante sem pontuação;
//  - G13: cada tipo (legenda, citação, gigante, par linha de cima + gigante) sempre no mesmo centro; gigante com UM tamanho;
//  - zona segura x 60–940, y 250–1500; nenhum texto no rosto (queixo com a câmera); mãos sob o texto (aviso);
//  - G23: fusão só no corte entre trechos (a fala anterior fecha em . ! ? ...), nunca em cima de palavra;
//  - cortes de zoom no máximo 1 a cada 10 s; topo da cabeça dentro do quadro; texto no quadro 0 (G29).
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.resolve(MOLDE, '..', '..', '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `checar-especialista-${process.pid}.mjs`);
let R;
try {
	await build({
		stdin: {contents: "export * from './src/Reel.tsx'; export {default as PB} from './src/palavras.json';", resolveDir: MOLDE, loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'silent', jsx: 'automatic', loader: {'.json': 'json'}, absWorkingDir: MOLDE,
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	R = await import(pathToFileURL(tmp).href);
} catch (e) {
	console.error((e.errors?.length ? e.errors.map((x) => x.text).join('\n') : e.message) || String(e));
	process.exitCode = 1;
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!R) process.exit(1);

const {PS, exibicoes, MODOS, FUSOES, DURACAO, rostoEm, CORTES_ZOOM, PAGINAS, Y_TEXTO, GIG} = R;
if (process.argv.includes('--tempos')) {
	console.log(JSON.stringify({duracao: DURACAO, preto: R.PRETO, entradas: MODOS.filter((m) => m.de > 0).map((m) => m.de), claroes: [], traco: R.TRACO_T ?? null, reenquadres: []}));
	process.exit(0);
}
const erros = [], avisos = [];
const f2 = (x) => x.toFixed(2).replace('.', ',');
const EX = exibicoes();
const FIM = /[.,;:!?…]$/;
// 1. cobertura e repetição
PS.forEach((p, i) => {
	const els = EX.filter((e) => e.ids.includes(i));
	if (els.length > 1) erros.push(`palavra ${i} "${p.texto}" aparece em ${els.length} textos (${els.map((e) => e.nome).join(' | ')})`);
	if (!els.length) { erros.push(`palavra ${i} "${p.texto}" (${f2(p.de)} s) não aparece na tela`); return; }
	let a = p.de + 0.1, b = p.ate - 0.07;
	if (b < a) a = b = (p.de + p.ate) / 2;
	for (let t = a; t <= b + 1e-6; t += 1 / 30) {
		if (!els.some((e) => t >= e.de && t < e.ate)) { erros.push(`palavra ${i} "${p.texto}" é dita em ${f2(t)} s mas não está na tela (${els[0].nome}: ${f2(els[0].de)}–${f2(els[0].ate)} s)`); break; }
	}
});
// 2. leitura, linhas, aspas, pontuação
const centros = {};
for (const e of EX) {
	const d = e.ate - e.de;
	const ult = e.ids[e.ids.length - 1];
	const fechaTrecho = ult === PS.length - 1 || FIM.test(PS[ult].texto);
	e.ids.slice(0, -1).forEach((i) => { if (FIM.test(PS[i].texto) && e.tipo !== 'cima') erros.push(`"${e.nome}" atravessa o fim de trecho em "${PS[i].texto}" (G11/G14)`); });
	if (e.tipo === 'legenda' || e.tipo === 'citacao') {
		if (d < 0.45) erros.push(`página "${e.nome}" fica ${f2(d)} s: some antes de dar para ler (G9). Junte com a vizinha do mesmo trecho`);
		else if (d < 1.5) (fechaTrecho || d >= 1.2 ? avisos : erros).push(`página "${e.nome}" fica ${f2(d)} s (régua 1,5 s)${fechaTrecho ? ', mas fecha um trecho' : ''}`);
		if (e.linhas > 2) erros.push(`página "${e.nome}" com ${e.linhas} linhas (máx. 2)`);
	}
	if (e.tipo === 'citacao' && !(e.nome.startsWith('“') && e.nome.endsWith('”'))) erros.push(`citação "${e.nome}" não abre e fecha aspas (G18)`);
	if (e.tipo === 'gigante') {
		if (d < 0.39) erros.push(`gigante "${e.nome}" fica ${f2(d)} s (mín. 0,4 s)`);
		if (/[.,;:!?…"“”]/.test(e.nome.replace(/[.,;:!?…]+$/, ''))) erros.push(`gigante "${e.nome}" com pontuação dentro (G18)`);
	}
	const chave = e.tipo === 'gigante' ? `gigante${EX.some((x) => x.tipo === 'cima' && x.de === e.de) ? '+cima' : ''}` : e.tipo;
	(centros[chave] ??= new Set()).add(Math.round(e.yc));
	if (Math.abs((e.y0 + e.y1) / 2 - e.yc) > 12) erros.push(`"${e.nome}" fora do centro da sua posição (${Math.round(e.yc)})`);
	if (e.x0 < 59 || e.x1 > 941 || e.y0 < 250 || e.y1 > 1500) erros.push(`"${e.nome}" sai da zona segura (x ${Math.round(e.x0)}–${Math.round(e.x1)}, y ${Math.round(e.y0)}–${Math.round(e.y1)})`);
	for (let t = e.de; t < e.ate; t += 0.1) {
		const r = rostoEm(t);
		if (r && e.y0 < r.queixo + 8) { erros.push(`"${e.nome}" encosta no rosto em ${f2(t)} s (queixo y ${Math.round(r.queixo)}, texto em ${Math.round(e.y0)})`); break; }
	}
}
for (const [k, s] of Object.entries(centros)) if (s.size > 1) erros.push(`destaque do tipo ${k} em ${s.size} posições (G13: o mesmo tipo fica sempre no mesmo lugar)`);
const tipos = Object.keys(centros).filter((k) => k !== 'legenda');
if (tipos.length > 4) erros.push(`${tipos.length} tipos de destaque (${tipos.join(', ')}): poucos e padronizados`);
// 3. mãos (aviso)
const MAOS = path.join(MOLDE, 'src', 'maos.json');
if (fs.existsSync(MAOS)) {
	const M = JSON.parse(fs.readFileSync(MAOS, 'utf8'));
	const C = M.celula;
	for (const e of EX.filter((x) => x.tipo !== 'legenda')) {
		const am = M.amostras.filter(([t]) => t >= e.de && t < e.ate);
		if (!am.length) continue;
		const fr = am.map(([, rows]) => { let tot = 0, mao = 0; for (let r = Math.floor(e.y0 / C); r <= Math.floor(e.y1 / C); r++) for (let c = Math.floor(e.x0 / C); c <= Math.floor(e.x1 / C); c++) { tot++; if ((rows[r] >> c) & 1) mao++; } return mao / tot; });
		const media = fr.reduce((a, b) => a + b, 0) / fr.length;
		if (media > 0.2) avisos.push(`"${e.nome}": ${Math.round(media * 100)}% da caixa com mão embaixo; confira no quadro`);
	}
}
// 4. transições (G23)
FUSOES.forEach((k) => {
	const i = PS.findIndex((p) => p.de > k);
	if (i > 0 && (PS[i - 1].ate > k + 0.034 || PS[i].de < k - 0.034)) erros.push(`fusão em ${f2(k)} s cai em cima de uma palavra`);
	if (i <= 0 || !/[.!?…]$/.test(PS[i - 1].texto)) erros.push(`transição em ${f2(k)} s não está entre dois trechos (a fala anterior não fecha em ponto): G23`);
});
const maxCortes = Math.max(3, Math.ceil(DURACAO / 10));
if (CORTES_ZOOM.length > maxCortes) erros.push(`${CORTES_ZOOM.length} cortes de zoom (máx. ${maxCortes})`);
for (let t = 0; t < DURACAO; t += 0.25) { const r = rostoEm(t); if (r && r.topo < 0) { avisos.push(`em ${f2(t)} s a cabeça encosta no topo`); break; } }
if (!EX.some((e) => e.de <= 0.001)) erros.push('nada escrito no quadro 0 (G29)');
console.log(`duração ${f2(DURACAO)} s | ${MODOS.length} modos | ${FUSOES.length} transições (fusão 0,3 s) | gigante ${GIG} px | tipos: ${Object.keys(centros).join(', ')} | ${PAGINAS.length} páginas`);
avisos.forEach((a) => console.log('aviso:', a));
if (erros.length) { erros.forEach((e) => console.log('ERRO:', e)); console.log(`REPROVADO (${erros.length})`); process.exitCode = 1; } else console.log('APROVADO');
