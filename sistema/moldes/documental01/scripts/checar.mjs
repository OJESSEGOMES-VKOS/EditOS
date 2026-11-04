// Checador do documental01 (modelos/documental01/documental01.md). uso: node scripts/checar.mjs  (sai 1 se reprovar)
// Lê o plano de verdade (src/plano.json, pelo src/Reel.tsx; para logo se o plano não for desta fala) e confere:
//  - número na tela = número falado (G8 e decisão do dono): cada contador declara o "dito", que tem de estar na fala
//    terminando na palavra onde o contador para, e valer exatamente o número mostrado; contagem de 1 a 2,5 s;
//  - legenda: todas as palavras, em ordem, uma vez só; bloco de no máx. 3 palavras numa linha, >= 0,4 s (0,5 s com 3), nunca
//    atravessa pontuação (G35); nada pisca (vão < 4 quadros entre blocos);
//  - tempo de leitura das telas: rótulo + título ficam >= 1 s + 3 palavras/s; título em no máx. 3 linhas;
//  - zona segura: todo texto em x 60-940 e y 250-1500 (largura estimada pela fonte);
//  - imagem viva: nenhum trecho de mais de 1,5 s sem a imagem ou a tela mudar (fora o apagão), e nenhum de mais de
//    1,0 s sem nada mudar contando a legenda (ref1: algo muda a cada 0,3 a 1 s);
//  - apagão antes do clímax entre 55 e 75% da duração (ref1: 62%);
//  - crédito da fonte na tela (E15); nome do modelo e travessão nunca.
// O temporário vai para ../../.tmp e é apagado mesmo se der erro.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('../../.tmp', `checar-documental01-${process.pid}.mjs`);
fs.mkdirSync(path.dirname(tmp), {recursive: true});
let M;
try {
	await build({
		stdin: {contents: "export * from './src/Reel.tsx';", resolveDir: process.cwd(), loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^(@remotion\/google-fonts\/.*|remotion)$/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: 'export const loadFont = () => ({fontFamily: "X"}); export const AbsoluteFill = null, Img = null, staticFile = (s) => s, useCurrentFrame = () => 0;', loader: 'js'}));
		}}],
	});
	M = await import('file://' + tmp.split(path.sep).join('/'));
} catch (e) {
	console.log('O PLANO NÃO BATE COM A FALA (ou não monta):\n ', String(e.message ?? e).trim());
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!M) process.exit(1);
const {SEM_APAGAO, legMin, PS, TELAS, LEGENDA, APAGAO, CREDITO, DURACAO, FPS, CORPO, Y, ZONA, FAMILIA, EVENTOS_BARRAS, EVENTOS_CAMERA, EVENTOS_MARCAS, EVENTOS_DOC, EXTRAS, limpa, fmt} = M;

const erros = [];
const ok = [];
const Q = 2 / FPS + 1e-6;

/* ---------- número falado (pt-BR por extenso ou em algarismo) */
const UN = {zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13, quatorze: 14, catorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60, setenta: 70, oitenta: 80, noventa: 90, cem: 100, cento: 100, duzentos: 200, duzentas: 200, trezentos: 300, trezentas: 300, quatrocentos: 400, quatrocentas: 400, quinhentos: 500, quinhentas: 500, seiscentos: 600, seiscentas: 600, setecentos: 700, setecentas: 700, oitocentos: 800, oitocentas: 800, novecentos: 900, novecentas: 900};
const ESC = {mil: 1e3, milhao: 1e6, milhoes: 1e6, bilhao: 1e9, bilhoes: 1e9};
const valorDito = (s) => {
	const ws = s.split(/\s+/).map(limpa).filter(Boolean);
	if (ws.length === 1 && /^\d+$/.test(ws[0])) return Number(ws[0]);
	let total = 0, grupo = 0;
	for (const w of ws) {
		if (w === 'e') continue;
		if (/^\d+$/.test(w)) grupo += Number(w);
		else if (w in UN) grupo += UN[w];
		else if (w in ESC) { total += (grupo || 1) * ESC[w]; grupo = 0; }
		else return NaN;
	}
	return total + grupo;
};
const fala = PS.map((p) => limpa(p.text));
for (const [i, t] of TELAS.entries()) {
	for (const n of t.numeros) {
		const dito = n.dito.split(/\s+/).map(limpa).filter(Boolean);
		const k = PS.findIndex((p) => Math.abs(p.start - n.para) <= Q);
		const linha = `tela ${i + 1}: ${fmt(n.valor)} ("${n.dito}")`;
		if (k < 0) { erros.push(`${linha}: o contador para em ${n.para.toFixed(2)} s, fora do início de uma palavra`); continue; }
		const ini = k - dito.length + 1;
		const bate = ini >= 0 && dito.every((w, j) => fala[ini + j] === w);
		const v = valorDito(n.dito);
		if (!bate) erros.push(`${linha}: a fala não diz "${n.dito}" terminando em "${PS[k].text}" (${n.para.toFixed(2)} s)`);
		else if (v !== n.valor) erros.push(`${linha}: "${n.dito}" vale ${v}, e a tela mostra ${n.valor}. Número na tela é o número falado.`);
		else ok.push(`${linha}: falado e mostrado iguais, para em "${PS[k].text}" ${n.para.toFixed(2)} s`);
		const d = n.para - n.de;
		if (n.valor !== n.inicio && (d < 1 - 1e-6 || d > 2.5 + 1e-6)) erros.push(`${linha}: conta em ${d.toFixed(2)} s (1 a 2,5 s)`);
		if (n.de < t.de - 1e-6) erros.push(`${linha}: começa a contar antes da tela entrar`);
	}
	if (t.semana) for (const [j, d] of t.semana.dias.entries()) if (d < t.de - 1e-6) erros.push(`tela ${i + 1}: o dia ${j + 1} da semana entra antes da tela`);
}

/* ---------- legenda */
if (FAMILIA === 'A' || LEGENDA.length) {
	const vistas = LEGENDA.flatMap((b) => b.idx);
	const todas = PS.map((_, i) => i);
	if (vistas.join() !== todas.join()) erros.push(`legenda: as palavras não aparecem todas, em ordem, uma vez só (${vistas.length} de ${PS.length})`);
	let curto = 0, piscas = 0, cruza = 0;
	for (const [j, b] of LEGENDA.entries()) {
		if (b.idx.length > 3) erros.push(`legenda: bloco de ${b.idx.length} palavras`);
		if (b.ate - b.de < legMin(b.idx.length) - 1e-6) { curto++; if (curto <= 6) erros.push(`legenda: "${b.idx.map((i) => PS[i].text).join(' ')}" ${b.de.toFixed(2)}-${b.ate.toFixed(2)} s (mín. ${legMin(b.idx.length).toFixed(2)} s)`); }
		if (b.idx.slice(0, -1).some((i) => /[.,;:!?…]$/.test(PS[i].text))) cruza++;
		const prox = LEGENDA[j + 1];
		if (prox && prox.de - b.ate > 1e-6 && prox.de - b.ate < 4 / FPS) piscas++;
	}
	(curto ? erros : ok).push(`legenda: ${LEGENDA.length} blocos, ${curto} curtos (mín. 0,4 s; 0,5 s com 3 palavras)`);
	if (cruza) erros.push(`legenda: ${cruza} blocos atravessam pontuação (G35)`);
	if (piscas) erros.push(`legenda: ${piscas} vãos menores que 4 quadros (pisca)`);
}

/* ---------- telas: leitura, linhas, zona segura */
const palavras = (s) => (s ?? '').replace(/[*|]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
const larguraSerifa = (s, corpo) => [...s].length * 0.5 * corpo; // Playfair: ~0,5 do corpo por letra (medido nos quadros da vitrine)
for (const [i, t] of TELAS.entries()) {
	const n = palavras(t.rotulo) + palavras(t.titulo) + palavras(t.ligacao) + palavras(t.frase) + t.numeros.length * 2;
	const precisa = 1 + n / 3;
	const fica = t.ate - t.de;
	const nome = (t.titulo ?? t.frase ?? t.rotulo ?? '').replace(/[*|]/g, ' ').replace(/\s+/g, ' ').trim();
	(fica + 1e-6 >= precisa ? ok : erros).push(`tela ${i + 1} "${nome}": ${fica.toFixed(2)} s (precisa ${precisa.toFixed(2)})`);
	if (t.titulo) {
		const linhas = t.titulo.split('|');
		if (linhas.length > 3) erros.push(`tela ${i + 1}: título com ${linhas.length} linhas (máx. 3)`);
		for (const l of linhas) if (larguraSerifa(l.replace(/\*/g, ''), CORPO.titulo) > 2 * (ZONA.dir - 540)) erros.push(`tela ${i + 1}: a linha "${l}" passa de 800 px (sai da zona segura): quebre com "|"`);
	}
	if (t.rotulo && [...t.rotulo].length * 0.82 * CORPO.rotulo > 2 * (ZONA.dir - 540)) erros.push(`tela ${i + 1}: rótulo "${t.rotulo}" largo demais (sai da zona segura)`);
	for (const s of [t.rotulo, t.titulo, t.frase, t.ligacao, ...t.numeros.map((n) => n.sub)]) {
		if (!s) continue;
		if (/documental01/i.test(s)) erros.push(`tela ${i + 1}: nome do modelo escrito`);
		if (/—/.test(s)) erros.push(`tela ${i + 1}: travessão`);
	}
}
if (TELAS[0].de > 0.001) erros.push('a 1ª tela entra depois do quadro 0: o gancho fica escrito desde o começo');
for (const y of [Y.rotulo, Y.titulo, Y.legenda, Y.credito]) if (y < ZONA.topo || y > ZONA.base) erros.push(`camada em y ${y}, fora de 250-1500`);

/* ---------- imagem viva */
const eventosImagem = [
	...TELAS.map((t) => t.de),
	...TELAS.flatMap((t) => t.numeros.flatMap((n) => (n.valor === n.inicio ? [n.de] : Array.from({length: Math.ceil((n.para - n.de) / 0.3) + 1}, (_, k) => Math.min(n.para, n.de + k * 0.3))))),
	...TELAS.flatMap((t) => (t.semana ? t.semana.dias : [])),
	...EVENTOS_BARRAS, ...EVENTOS_CAMERA, ...EVENTOS_MARCAS, ...EVENTOS_DOC,
	...EXTRAS.reguas.flatMap((r) => [r.de, r.ate]),
	...(EXTRAS.divisao ? [EXTRAS.divisao.de, EXTRAS.divisao.ate, ...EXTRAS.divisao.rotulos.map((r) => r.t)] : []),
	...(EXTRAS.pilha ? [EXTRAS.pilha.de, EXTRAS.pilha.de + EXTRAS.pilha.dur, EXTRAS.pilha.ate] : []),
	CREDITO.de, 0, DURACAO,
];
const fim = PS[PS.length - 1].end;
const buraco = (ts, lim, nome) => {
	const s = [...new Set(ts.filter((x) => x >= 0 && x <= fim).map((x) => Math.round(x * 100) / 100))].sort((a, b) => a - b);
	let pior = [0, 0];
	for (let k = 1; k < s.length; k++) {
		const a = s[k - 1], b = s[k];
		if (APAGAO !== null && a >= APAGAO - 0.05 && a <= APAGAO + 2.5) continue; // o apagão respira de propósito
		if (b - a > pior[1] - pior[0]) pior = [a, b];
	}
	const d = pior[1] - pior[0];
	(d <= lim + 1e-6 ? ok : erros).push(`${nome}: maior trecho sem mudança ${d.toFixed(2)} s (${pior[0].toFixed(2)}-${pior[1].toFixed(2)} s; máx. ${lim} s)`);
};
buraco(eventosImagem, 1.5, 'imagem e tela');
buraco([...eventosImagem, ...LEGENDA.map((b) => b.de)], 1.0, 'tudo, com a legenda');

/* ---------- apagão, crédito, duração */
if (APAGAO !== null) {
	const p = APAGAO / DURACAO;
	(p >= 0.55 && p <= 0.75 ? ok : erros).push(`apagão em ${APAGAO.toFixed(2)} s = ${(p * 100).toFixed(0)}% (alvo 55 a 75%)`);
} else if (SEM_APAGAO) ok.push('apagão desligado de propósito ("apagao": null): o motivo tem de estar no plano.md');
else erros.push('sem apagão antes do clímax (documental01.md §3); se o vídeo não tem clímax, escreva o motivo no plano.md e ponha "apagao": null de propósito');
if (!CREDITO.txt || CREDITO.txt.length < 12) erros.push('crédito da fonte ausente: imagem e dado só com fonte na tela');
else (CREDITO.de <= DURACAO - 2.5 ? ok : erros).push(`crédito na tela a partir de ${CREDITO.de.toFixed(2)} s (fica ${(DURACAO - CREDITO.de).toFixed(2)} s; mín. 2,5 s)`);
if ([...CREDITO.txt].length * 0.66 * CORPO.credito > 2 * 2 * (ZONA.dir - 540)) erros.push('crédito longo demais (mais de 2 linhas)');
if (DURACAO < fim) erros.push(`a duração (${DURACAO.toFixed(2)} s) corta a fala, que acaba em ${fim.toFixed(2)} s`);

console.log('OK:\n  ' + ok.join('\n  '));
console.log(erros.length ? 'PROBLEMAS:\n  ' + erros.join('\n  ') : 'sem problemas');
process.exit(erros.length ? 1 : 0);
