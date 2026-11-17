// Checador do youtube-didatico. uso: node scripts/checar.mjs   (sai 1 se reprovar)
// Lê o plano de verdade (src/plano.ts, montado com o esbuild) e confere, com e sem prévias:
// - o plano é desta fala (cada tempo amarrado a uma palavra; senão para dizendo qual);
// - texto falado (ATRAS + FRASES juntos quando se sobrepõem, e o CTA): bloco >= 1,5 s e >= 1 s + 3 palavras/s,
//   cada palavra >= 0,4 s na tela depois de entrar, no máximo 4 linhas;
// - títulos e rótulos (nomes): >= 1 s + 3 palavras/s (um nome conta como uma palavra);
// - conta no gelo (LISTA): cada item >= 1 s + 3 palavras/s depois de entrar, a conta inteira >= 1 s + 3 palavras/s, 1 a 5
//   itens na ordem da fala, e o rosto no cartão (POSE.cartao) durante a conta;
// - nada atravessa um corte seco (chave de câmera sem transição ou troca da montagem);
// - telas livres (LIVRES): registradas em src/telas/index.ts, de < ate, o rosto no cartão (POSE.cartao) durante a tela,
//   nenhuma outra tela de gelo por cima, o texto delas >= 1 s + 3 palavras/s, nada atravessa corte, e nunca o mesmo
//   texto de FRASES, TITULOS ou do pedido na mesma hora (G26);
// - a soma das telas (grade, conta, livres, reels, montagem) fica em até 1/3 do vídeo (sem prévias): a pessoa é a base;
// - a duração cobre a fala.
// Também grava src/tempos.json com as telas livres do plano (o tools/clone.py lê de lá quais telas livres o vídeo usa).
// Sem legenda corrida neste modelo; as posições são as do desenho (modelos/youtube-didatico/youtube-didatico.md, seção 5), por isso a zona segura não é medida aqui.
// No fim, imprime o comando da trilha com os toques deste plano.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('../../.tmp', `checar-youtube-didatico-${process.pid}.mjs`);
fs.mkdirSync(path.dirname(tmp), {recursive: true});
let P;
try {
	await build({
		entryPoints: ['src/plano.ts'],
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^remotion$/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: 'const f = () => (x) => x; export const Easing = {inOut: f, bezier: f, cubic: (x) => x, sin: (x) => x}; export const OffthreadVideo = null, staticFile = (s) => s;', loader: 'js'}));
		}}],
	});
	P = await import('file://' + tmp.replace(/\\/g, '/'));
} catch (e) {
	console.log('O PLANO NÃO BATE COM A FALA (ou não monta):\n ', String(e.message ?? e).trim());
	process.exitCode = 1;
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!P) process.exit(1);

const {LISTA = null, LIVRES = [], ATRAS, FRASES, TITULOS, GRADE, GRADES, MONTAGEM, REEL, ESTE, PREVIAS, CTA, DURACAO_Q, PS, chaves} = P;
const FPS = 30;
const fim = DURACAO_Q / FPS;
const erros = [];
const n = (s) => s.trim().split(/\s+/).length;

const conferir = (previas) => {
	const cortes = chaves(previas).filter(([t, , d]) => d === 0 && t > 0).map(([t]) => t);
	for (const [a, b] of MONTAGEM?.planos ?? []) cortes.push(a, b);
	// texto falado: [nome, de, ate, linhas, tempos de entrada de cada palavra]
	let fala = [
		...ATRAS.map((a) => [`atrás "${a.linhas.join(' ')}"`, a.de, a.ate, a.linhas.length, a.linhas.flatMap((l, i) => Array(n(l)).fill(a.de + i * 0.1))]),
		...FRASES.map((f) => [`frase "${[...f.linha1, ...f.linha2].map((p) => p[0]).join(' ')}"`, f.de, f.ate, 2, [...f.linha1, ...f.linha2].flatMap(([p, t]) => Array(n(p)).fill(t))]),
	].sort((x, y) => x[1] - y[1]);
	const juntos = [];
	for (const b of fala) {
		const u = juntos[juntos.length - 1];
		if (u && b[1] < u[2]) juntos[juntos.length - 1] = [`${u[0]} + ${b[0]}`, u[1], Math.max(u[2], b[2]), u[3] + b[3], [...u[4], ...b[4]]];
		else juntos.push(b);
	}
	if (CTA) juntos.push([`pedido "${CTA.antes} ${CTA.chave[0]} ${CTA.depois[0]}"`, CTA.de, fim, 3, [CTA.de, ...Array(n(CTA.chave[0])).fill(CTA.chave[1]), ...Array(n(CTA.depois[0])).fill(CTA.depois[1])]]);
	const nomes = [
		...TITULOS.map((d) => [`título "${d.linhas.join(' ')}"`, d.de, d.ate]),
		...GRADES.map((g) => [`nomes da grade (${g.de.toFixed(2)} s)`, g.par ? g.par.varios + 0.3 : g.de + 0.37, g.ate]).filter(() => GRADE.length),
		...(REEL ? [['@ da tela de reels (com a prop arroba)', REEL.de + 0.15, REEL.ate]] : []),
		...(ESTE ? [[`rótulo "${ESTE.rotulo}"`, ESTE.de, ESTE.ate]] : []),
		...(previas && PREVIAS ? [['nomes das prévias', PREVIAS.entra + 0.12, PREVIAS.ate]] : []),
		...(LISTA ? [[`conta "${LISTA.itens.map((x) => x[0]).join(' ')}"`, LISTA.itens[0][1], LISTA.ate, LISTA.itens.reduce((s, [p]) => s + n(p), 0)], ...LISTA.itens.map(([p, t0]) => [`item "${p}"`, t0, LISTA.ate, n(p)])] : []),
	];
	const modo = previas ? 'com prévias' : 'sem prévias';
	const linha = (nome, de, ate, precisa, ok) => console.log(`  ${nome.padEnd(46).slice(0, 46)} ${de.toFixed(2).padStart(6)}-${ate.toFixed(2).padStart(6)}  ${(ate - de).toFixed(2)} s / ${precisa.toFixed(2)} s  ${ok ? 'OK' : 'REPROVA'}`);
	console.log(modo);
	for (const [nome, de, ate, linhas, ps] of juntos) {
		const precisa = Math.max(1.5, 1 + ps.length / 3);
		const ok = ate - de >= precisa - 0.01;
		linha(nome, de, ate, precisa, ok);
		if (!ok) erros.push(`${modo}: ${nome} fica ${(ate - de).toFixed(2)} s, precisa de ${precisa.toFixed(2)} s: segure até uma palavra depois ou junte com a frase seguinte`);
		const curta = ps.find((t) => ate - t < 0.4 - 1e-6);
		if (curta !== undefined) erros.push(`${modo}: ${nome}: uma palavra entra em ${curta.toFixed(2)} s e fica só ${(ate - curta).toFixed(2)} s (< 0,4)`);
		if (linhas > 4) erros.push(`${modo}: ${nome}: ${linhas} linhas (máx. 4)`);
		const c = cortes.filter((x) => de < x && x < ate - 1e-6);
		if (c.length) erros.push(`${modo}: ${nome} atravessa o corte seco em ${c.map((x) => x.toFixed(2)).join(', ')} s`);
	}
	for (const [nome, de, ate, np = 1] of nomes) {
		const precisa = 1 + np / 3;
		const ok = ate - de >= precisa - 0.01;
		linha(nome, de, ate, precisa, ok);
		if (!ok) erros.push(`${modo}: ${nome} fica ${(ate - de).toFixed(2)} s (precisa de ${precisa.toFixed(2).replace('.', ',')} s)`);
		const c = cortes.filter((x) => de < x && x < ate - 1e-6);
		if (c.length) erros.push(`${modo}: ${nome} atravessa o corte seco em ${c.map((x) => x.toFixed(2)).join(', ')} s`);
	}
	if (LISTA) {
		const its = LISTA.itens;
		if (its.length < 1 || its.length > 5) erros.push(`a conta tem ${its.length} itens (de 1 a 5; mais que isso, divida em duas telas)`);
		its.forEach(([p, t0], k) => {
			if (t0 < LISTA.de || t0 >= LISTA.ate) erros.push(`a conta: "${p}" entra em ${t0.toFixed(2)} s, fora da tela (${LISTA.de.toFixed(2)}-${LISTA.ate.toFixed(2)} s)`);
			if (k && t0 < its[k - 1][1]) erros.push(`a conta: "${p}" entra antes do item anterior (a ordem é a da fala)`);
		});
		for (const x of [LISTA.de + 0.4, (LISTA.de + LISTA.ate) / 2, LISTA.ate - 0.05]) {
			const ch = chaves(previas).filter(([t]) => t <= x).pop();
			if (!ch || ch[1].w !== 370) erros.push(`${modo}: a conta (${LISTA.de.toFixed(2)}-${LISTA.ate.toFixed(2)} s) pede o rosto no cartão: uma chave [${LISTA.de.toFixed(2)}, POSE.cartao, 0.38, true] e nenhuma outra pose até ${LISTA.ate.toFixed(2)} s`);
			if (!ch || ch[1].w !== 370) break;
		}
	}
	// telas livres: a tela de gelo inventada para a fala nova
	const reg = fs.existsSync('src/telas/index.ts') ? new Set(fs.readFileSync('src/telas/index.ts', 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '').match(/\b[A-Z]\w*\b/g) ?? []) : new Set();
	const gelo = [...GRADES.map((g) => ['a grade', g.de, g.ate]), ...(LISTA ? [['a conta', LISTA.de, LISTA.ate]] : []), ...(REEL ? [['a tela de reels', REEL.de, REEL.ate]] : []), ...(previas && PREVIAS ? [['as prévias', PREVIAS.de, PREVIAS.ate]] : [])];
	const textosNa = (de, ate) => [
		...FRASES.filter((f) => f.de < ate && de < f.ate).flatMap((f) => [...f.linha1, ...f.linha2].map((p) => p[0])),
		...TITULOS.filter((d) => d.de < ate && de < d.ate).flatMap((d) => d.linhas),
		...(CTA && CTA.de < ate ? [CTA.antes, CTA.chave[0], CTA.depois[0]] : []),
	].join(' ');
	const lim = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]+/g, ' ').trim();
	LIVRES.forEach((L, k) => {
		const nome = `livre ${k} (${L.comp})`;
		if (!reg.has(L.comp)) erros.push(`${nome}: a tela "${L.comp}" não está registrada em src/telas/index.ts`);
		if (!(L.de < L.ate)) { erros.push(`${nome}: o "de" (${L.de}) tem de vir antes do "ate" (${L.ate})`); return; }
		for (const [o, a, b] of gelo) if (a < L.ate && L.de < b) erros.push(`${modo}: ${nome} (${L.de.toFixed(2)}-${L.ate.toFixed(2)} s) cai em cima d${o.slice(0, 1) === 'a' ? '' : 'e '}${o} (${a.toFixed(2)}-${b.toFixed(2)} s): uma tela de gelo por vez`);
		for (const o of LIVRES.slice(k + 1)) if (o.de < L.ate && L.de < o.ate) erros.push(`${nome} e a livre ${o.comp} ficam na tela ao mesmo tempo: uma tela de gelo por vez`);
		for (const x of [L.de + 0.4, (L.de + L.ate) / 2, L.ate - 0.05]) {
			const ch = chaves(previas).filter(([t]) => t <= x).pop();
			if (!ch || ch[1].w !== 370) { erros.push(`${modo}: ${nome} (${L.de.toFixed(2)}-${L.ate.toFixed(2)} s) pede o rosto no cartão: uma chave [${L.de.toFixed(2)}, POSE.cartao, 0.38, true] e nenhuma outra pose até ${L.ate.toFixed(2)} s`); break; }
		}
		const txt = Object.values(L.textos ?? {}).join(' ').trim();
		const ini = Math.min(L.de, ...Object.values(L.em ?? {}).filter((v) => typeof v === 'number' && v >= L.de));
		if (txt) {
			const precisa = Math.max(1.33, 1 + n(txt) / 3);
			const ok = L.ate - ini >= precisa - 0.01;
			linha(`${nome} "${txt}"`, ini, L.ate, precisa, ok);
			if (!ok) erros.push(`${modo}: ${nome}: o texto "${txt}" fica ${(L.ate - ini).toFixed(2)} s (precisa de ${precisa.toFixed(2)} s): segure a tela até uma palavra depois`);
			// cada texto que entra na palavra dele (em.<mesma chave>) fica pelo menos 1 s + 3 palavras/s (rótulo: 1,33 s)
			for (const [k2, x] of Object.entries(L.textos ?? {})) {
				const t0 = L.em?.[k2];
				if (typeof t0 !== 'number' || !x.trim()) continue;
				const p2 = 1 + n(x) / 3;
				if (L.ate - t0 < p2 - 0.01) erros.push(`${modo}: ${nome}: "${x}" entra em ${t0.toFixed(2)} s e fica só ${(L.ate - t0).toFixed(2)} s (precisa de ${p2.toFixed(2)} s): segure a tela ou junte com o texto de antes`);
			}
			const outro = lim(textosNa(L.de, L.ate));
			const repete = Object.values(L.textos ?? {}).filter((x) => lim(x).length > 2 && ` ${outro} `.includes(` ${lim(x)} `));
			if (repete.length) erros.push(`${nome} escreve ${repete.map((x) => `"${x}"`).join(', ')} e a frase, o título ou o pedido mostram o mesmo na mesma hora (G26)`);
		} else linha(nome, L.de, L.ate, 0, true);
		for (const [nm, v] of Object.entries(L.em ?? {})) if (typeof v === 'number' && (v < L.de - 0.01 || v >= L.ate)) erros.push(`${nome}: em.${nm} (${v.toFixed(2)} s) fora da tela (${L.de.toFixed(2)}-${L.ate.toFixed(2)} s)`);
		const c = cortes.filter((x) => L.de < x && x < L.ate - 1e-6);
		if (c.length) erros.push(`${modo}: ${nome} atravessa o corte seco em ${c.map((x) => x.toFixed(2)).join(', ')} s`);
	});
	if (!previas) {
		const telas = [...GRADES.map((g) => g.ate - g.de), ...(LISTA ? [LISTA.ate - LISTA.de] : []), ...(REEL ? [REEL.ate - REEL.de] : []), ...LIVRES.map((L) => L.ate - L.de), ...(MONTAGEM ? [MONTAGEM.planos[MONTAGEM.planos.length - 1][1] - MONTAGEM.planos[0][0]] : [])].reduce((s, x) => s + x, 0);
		console.log(`  telas (grade, conta, livres, reels, montagem): ${telas.toFixed(1)} s de ${fim.toFixed(1)} s (${Math.round((100 * telas) / fim)}%; até 33%)`);
		if (telas > fim / 3 + 0.05) erros.push(`as telas somam ${Math.round((100 * telas) / fim)}% do vídeo (até 1/3): a pessoa é a base; tela só onde a fala precisa da coisa para ser entendida`);
	}
};
conferir(false);
if (PREVIAS) conferir(true);
const ultima = PS[PS.length - 1].end;
// para o tools/clone.py: quais telas livres o plano usa (o bloco do plano é TypeScript; o clone.py lê as livres daqui)
fs.writeFileSync('src/tempos.json', JSON.stringify({_leia: 'Gravado por scripts/checar.mjs: as telas livres do plano, para o tools/clone.py. Não editar à mão.', livres: LIVRES.map((L) => ({comp: L.comp, de: L.de, ate: L.ate}))}, null, 1) + '\n');
if (fim < ultima) erros.push(`a duração (${fim.toFixed(2)} s) corta a fala, que acaba em ${ultima.toFixed(2)} s`);

console.log(erros.length ? 'PROBLEMAS:\n  ' + erros.join('\n  ') : 'sem problemas');
const f2 = (x) => String(Math.round(x * 100) / 100);
const sopros = [...GRADES.map((g) => g.de), ...(REEL ? [REEL.de] : []), ...(LISTA ? [LISTA.de] : [])].sort((a, b) => a - b);
const toques = [...ATRAS.slice(0, 1).map((a) => a.de), ...TITULOS.map((d) => d.de), ...(CTA ? [CTA.chave[1]] : [])].sort((a, b) => a - b);
console.log(`trilha (opcional) deste plano: ../../.venv/Scripts/python.exe scripts/trilha.py${sopros.length ? ' --sopros ' + sopros.map(f2).join(' ') : ''}${toques.length ? ' --toques ' + toques.map(f2).join(' ') : ''}`);
process.exit(erros.length ? 1 : 0);
