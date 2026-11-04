// Checador do especialista: lê o plano de src/Reel.tsx e confere as regras da casa (herança) e as do modelo.
// uso (na pasta do vídeo ou do molde): node scripts/checar.mjs      -> APROVADO, ou a lista do que mexer (sai com 1)
// Confere:
//  - toda palavra na tela enquanto é dita (o branco do clarão pode esconder até 0,3 s), cada uma uma vez só;
//  - página de legenda >= 1,5 s (abaixo disso só aviso se ela fecha um trecho, G35) e nunca < 0,45 s (nada pisca);
//    grupo da palavra gigante >= 0,4 s; no máximo 2 linhas por página e por cursiva;
//  - G35: nenhum bloco atravessa pontuação de fim de trecho (. , ; : ! ?);
//  - UMA posição de texto (centro em Y_TEXTO) e a 2ª só depois do fecho; zona segura x 60–940, y 250–1500;
//  - nenhum texto no rosto (queixo medido com a câmera, a cada 0,1 s); mãos sob o texto (src/maos.json, aviso);
//  - modos: 0,9 a 4,5 s; clarões a cada >= 7,5 s (aviso) e >= 5 s (erro); trecho de base >= 2 s (aviso < 4,5 s);
//    traço no máximo 1; cortes de zoom no máximo 1 a cada 10 s; topo da cabeça dentro do quadro.
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

const {PS, exibicoes, MODOS, CLAROES, CLARAO, DURACAO, PRETO, Y_TEXTO, Y_LEG2, FECHO, ZONA, rostoEm, CORTES_ZOOM, TRECHOS, PAGINAS} = R;
if (process.argv.includes('--tempos')) {
	// para o scripts/som.py: os tempos do plano (um plano só, em src/Reel.tsx)
	console.log(JSON.stringify({duracao: DURACAO, preto: PRETO, entradas: MODOS.filter((m) => m.de > 0).map((m) => m.de), claroes: CLAROES, traco: R.TRACO_T ?? null, reenquadres: CORTES_ZOOM.filter((c) => !MODOS.some((m) => Math.abs(m.de - c) < 1e-6))}));
	process.exit(0);
}
const erros = [], avisos = [];
const f2 = (x) => x.toFixed(2).replace('.', ',');
const EX = exibicoes();
const FIM = /[.,;:!?…]$/;

// 1. cobertura e repetição
const noClarao = (t) => CLAROES.some((k) => t >= k - 0.05 && t < k + 0.3);
PS.forEach((p, i) => {
	const els = EX.filter((e) => e.ids.includes(i));
	if (els.length > 1) erros.push(`palavra ${i} "${p.texto}" aparece em ${els.length} textos (${els.map((e) => e.nome).join(' | ')}): cada palavra uma vez só`);
	if (!els.length) { erros.push(`palavra ${i} "${p.texto}" (${f2(p.de)} s) não aparece na tela: ponha num pedaço ou num modo`); return; }
	let a = p.de + 0.1, b = p.ate - 0.07;
	if (b < a) a = b = (p.de + p.ate) / 2; // palavra curta: confere o meio dela
	for (let t = a; t <= b + 1e-6; t += 1 / 30) {
		if (noClarao(t)) continue;
		if (!els.some((e) => t >= e.de && t < e.ate)) { erros.push(`palavra ${i} "${p.texto}" é dita em ${f2(t)} s mas não está na tela (${els[0].nome}: ${f2(els[0].de)}–${f2(els[0].ate)} s)`); break; }
	}
});
// 2. tempo de leitura, linhas, G35
for (const e of EX) {
	const d = e.ate - e.de;
	const ult = e.ids[e.ids.length - 1];
	const fechaTrecho = ult === PS.length - 1 || FIM.test(PS[ult].texto);
	e.ids.slice(0, -1).forEach((i) => { if (FIM.test(PS[i].texto) && !(e.tipo === 'fecho')) erros.push(`"${e.nome}" atravessa o fim de trecho em "${PS[i].texto}" (G35): acabe o bloco nessa palavra`); });
	if (e.tipo === 'legenda') {
		if (d < 0.45) erros.push(`página "${e.nome}" fica ${f2(d)} s: pisca (mín. 0,45 s). Junte com a vizinha do mesmo trecho`);
		else if (d < 1.5) (fechaTrecho ? avisos : erros).push(`página "${e.nome}" fica ${f2(d)} s (régua 1,5 s)${fechaTrecho ? ', mas fecha um trecho (G35)' : ''}`);
		if (e.linhas > 2) erros.push(`página "${e.nome}" com ${e.linhas} linhas (máx. 2)`);
	}
	if (e.tipo === 'gigante' && R.escalaGig(e.nome) < 0.8) erros.push(`palavra gigante "${e.nome}" encolhe para ${Math.round(R.escalaGig(e.nome) * 100)}% para caber (mín. 80%: destaques do mesmo tamanho): separe o grupo`);
	if (e.tipo === 'gigante' && d < 0.39) erros.push(`palavra gigante "${e.nome}" fica ${f2(d)} s (mín. 0,4 s): junte com a vizinha`);
	if (e.tipo === 'cursiva' && e.linhas > 2) erros.push(`cursiva "${e.nome}" com ${e.linhas} linhas (máx. 2)`);
	// 3. posição e zona
	const centro = (e.y0 + e.y1) / 2;
	const depoisFecho = FECHO && e.tipo === 'legenda' && e.ids[0] > FECHO.cursiva[0];
	if (!depoisFecho && e.tipo !== 'fecho' && Math.abs(centro - Y_TEXTO) > 12) erros.push(`"${e.nome}" centrado em y ${Math.round(centro)}, fora da posição única do texto (${Y_TEXTO})`);
	if (depoisFecho && Math.abs(e.y0 - Y_LEG2) > 2) erros.push(`"${e.nome}" depois do fecho fora da 2ª posição (${Y_LEG2})`);
	if (e.x0 < ZONA.esq - 1 || e.x1 > ZONA.dir + 1 || e.y0 < ZONA.topo || e.y1 > ZONA.base) erros.push(`"${e.nome}" sai da zona segura (x ${Math.round(e.x0)}–${Math.round(e.x1)}, y ${Math.round(e.y0)}–${Math.round(e.y1)}; zona x 60–940, y 250–1500)`);
	// 4. rosto
	for (let t = e.de; t < e.ate; t += 0.1) {
		const r = rostoEm(t);
		if (r && e.y0 < r.queixo + 8) { erros.push(`"${e.nome}" encosta no rosto em ${f2(t)} s (queixo em y ${Math.round(r.queixo)}, texto começa em ${Math.round(e.y0)})`); break; }
	}
}
if (FECHO && EX.some((e) => e.tipo === 'legenda' && e.ids[0] > FECHO.cursiva[0] && e.y0 < EX.find((x) => x.tipo === 'fecho').y1)) erros.push('a legenda depois do fecho bate no fecho: encurte o fecho ou use 1 linha');
// posições de legenda
const ys = new Set(EX.filter((e) => e.tipo === 'legenda').map((e) => Math.round((e.y0 + e.y1) / 2 / 20)));
if (ys.size > 2 && !FECHO) avisos.push(`legenda em ${ys.size} alturas de centro (páginas de 1 e 2 linhas centradas na mesma linha contam como uma posição)`);
// 5. mãos (aviso): fração da caixa do texto com mão embaixo
const MAOS = path.join(MOLDE, 'src', 'maos.json');
if (fs.existsSync(MAOS)) {
	const M = JSON.parse(fs.readFileSync(MAOS, 'utf8'));
	const C = M.celula;
	for (const e of EX.filter((x) => x.tipo !== 'legenda')) {
		const amostras = M.amostras.filter(([t]) => t >= e.de && t < e.ate);
		if (!amostras.length) continue;
		const fr = amostras.map(([, rows]) => {
			let tot = 0, mao = 0;
			for (let r = Math.floor(e.y0 / C); r <= Math.floor(e.y1 / C); r++) for (let c = Math.floor(e.x0 / C); c <= Math.floor(e.x1 / C); c++) { tot++; if ((rows[r] >> c) & 1) mao++; }
			return mao / tot;
		});
		const media = fr.reduce((a, b) => a + b, 0) / fr.length;
		if (media > 0.2) avisos.push(`"${e.nome}": ${Math.round(media * 100)}% da caixa com mão embaixo; confira no quadro se a mão some atrás da letra`);
	}
} else avisos.push('sem src/maos.json: rode ../../.venv/Scripts/python.exe scripts/maos.py para conferir as mãos sob o texto');
// 6. modos, clarões, base, zoom, cabeça
for (const m of MODOS) {
	const d = m.k + 0.2 - m.de;
	if (d < 0.9 || d > 4.5) erros.push(`modo ${m.nome} dura ${f2(d)} s (faixa da ref1: 0,9 a 4,5 s)`);
}
CLAROES.slice(1).forEach((k, j) => {
	const iv = k - CLAROES[j];
	if (iv < 5) erros.push(`clarões a ${f2(iv)} s um do outro (${f2(CLAROES[j])} e ${f2(k)} s): mín. 5 s, régua ~10 s`);
	else if (iv < 7.5) avisos.push(`clarões a ${f2(iv)} s um do outro (ref1: 7,5 a 13,9 s)`);
});
const bases = [];
let ini = 0;
for (const m of MODOS) { if (m.de - ini > 0.05) bases.push([ini, m.de]); ini = m.k + 0.3; }
bases.push([ini, FECHO ? FECHO.de : DURACAO - PRETO]);
for (const [a, b] of bases) {
	if (b - a < 2) avisos.push(`trecho de base de ${f2(a)} a ${f2(b)} s com só ${f2(b - a)} s: a base precisa respirar (ref1: 4,7 a 8,8 s)`);
	else if (b - a < 4.5) avisos.push(`trecho de base de ${f2(a)} a ${f2(b)} s com ${f2(b - a)} s (ref1: 4,7 a 8,8 s)`);
}
const tracos = (fs.readFileSync(path.join(MOLDE, 'src', 'Reel.tsx'), 'utf8').match(/^const TRACO[^\n]*/m) || [''])[0];
if (/\]\s*\[/.test(tracos)) erros.push('mais de um traço: o traço vermelho é uma vez no vídeo');
const maxCortes = Math.max(3, Math.ceil((DURACAO) / 10));
if (CORTES_ZOOM.length > maxCortes) erros.push(`${CORTES_ZOOM.length} cortes de zoom (máx. ${maxCortes}: um a cada ~10 s, só na entrada de modo e na troca de plano)`);
for (let t = 0; t < DURACAO; t += 0.25) {
	const r = rostoEm(t);
	if (r && r.topo < 0) { avisos.push(`em ${f2(t)} s a cabeça encosta no topo (topo estimado y ${Math.round(r.topo)}): baixe ZOOM_MODO ou o reenquadre`); break; }
}
if (!EX.some((e) => e.de <= 0.001)) erros.push('nada escrito no quadro 0: o gancho entra na tela desde o início (herança, G23)');
const tempoModo = MODOS.reduce((s, m) => s + (m.k + 0.2 - m.de), 0);
const tempoClarao = CLAROES.length * CLARAO.dur;
console.log(`duração ${f2(DURACAO)} s | ${MODOS.length} modos (${Math.round((100 * tempoModo) / DURACAO)}% do tempo) | ${CLAROES.length} clarões (${Math.round((100 * tempoClarao) / DURACAO)}%) | ${CORTES_ZOOM.length} cortes de zoom | texto no centro y ${Y_TEXTO} (${Math.round((100 * Y_TEXTO) / 1920)}%) | ${PAGINAS.length} páginas`);
avisos.forEach((a) => console.log('aviso:', a));
if (erros.length) {
	erros.forEach((e) => console.log('ERRO:', e));
	console.log(`REPROVADO (${erros.length})`);
	process.exitCode = 1;
} else console.log('APROVADO');
