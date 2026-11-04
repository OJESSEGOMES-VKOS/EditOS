// Checador do cortepalestra01 (modelos/cortepalestra01/cortepalestra01.md). Sai com código 1 se algo falhar.
// Confere: o corte começa na 1ª palavra e a última frase respira 1 a 2 s; toda palavra escrita enquanto é dita, uma vez,
// em ordem; página >= 1,5 s e palavra >= 0,4 s na tela; legenda até 2 linhas e um trecho só (G35), bloco até 4 linhas;
// uma posição de texto; destaque denso no gancho e raro no corpo; nada atravessa uma emenda do recorte; texto abaixo do
// queixo medido; e, pixel a pixel, a zona segura (renderiza só os textos, prop soTexto, a cada 0,2 s).
// Usa a trava <estúdio>/.tmp/render.lock sozinho: NÃO rode dentro do com-trava.sh.
// uso (na pasta do vídeo): node scripts/cobertura.mjs
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('.tmp-cobertura.mjs');
let M;
try {
	await build({
		stdin: {contents: "export {palavrasNaTela, exibicoes, queixoEntre, ZONA, Y_CENTRO, FIM_VIDEO, FIM_FALA, EM, P} from './src/Corte.tsx';", resolveDir: process.cwd(), loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	M = await import('file://' + tmp.replace(/\\/g, '/'));
} catch (e) {
	fs.rmSync(tmp, {force: true});
	console.error(String(e?.message ?? e).split('\n')[0]);
	process.exit(1);
} finally {
	fs.rmSync(tmp, {force: true});
}
const {palavrasNaTela, exibicoes, queixoEntre, ZONA, Y_CENTRO, FIM_VIDEO, FIM_FALA, EM, P} = M;
const PS = P.palavras, FPS = 30, f2 = (x) => x.toFixed(2);
const erros = [];
const acusa = (titulo, lista, dica) => {
	console.log(`${lista.length} ${titulo}`);
	lista.forEach((x) => console.log('  ' + x));
	if (lista.length) { erros.push(titulo); if (dica) console.log('  -> ' + dica); }
};

/* o ponto certo: entra na 1ª palavra, sai respirando */
const ponto = [];
if (PS[0].de > 0.15) ponto.push(`a 1ª palavra começa em ${f2(PS[0].de)} s: o corte entra na 1ª palavra da frase de impacto (no máximo 0,15 s antes)`);
if (P.folga < 1 || P.folga > 2) ponto.push(`FOLGA ${P.folga} s: a última frase respira de 1 a 2 s`);
acusa('problemas de entrada/saída do corte', ponto, 'refaça o trecho.json (scripts/ponto.py) ou acerte a FOLGA em src/Corte.tsx');

/* toda palavra na tela enquanto é dita */
const buracos = [];
PS.forEach((p, i) => {
	let a = Math.ceil((p.de + 0.1) * FPS), b = Math.floor((p.ate - 0.07) * FPS);
	if (b < a) a = b = Math.round(((p.de + p.ate) / 2) * FPS);
	const faltam = [];
	for (let f = a; f <= b; f++) if (!palavrasNaTela(f / FPS).includes(i)) faltam.push(f2(f / FPS));
	if (faltam.length) buracos.push(`${i} "${p.texto}" (${p.de}-${p.ate} s) sem texto em ${faltam.join(', ')}`);
});
acusa(`de ${PS.length} palavras com buraco`, buracos, 'ponha a palavra numa página de PEDACOS');

const ex = exibicoes();
const curtos = [];
for (const e of ex) {
	if (e.ate - e.de < 1.5) curtos.push(`"${e.nome}" ${f2(e.ate - e.de)} s`);
	for (const i of e.is) if (e.ate - PS[i].de < 0.4) curtos.push(`"${PS[i].texto}" em "${e.nome}" só ${f2(e.ate - PS[i].de)} s`);
}
acusa('páginas ou palavras abaixo do tempo de leitura (página 1,5 s, palavra 0,4 s)', curtos, 'junte a página curta com a vizinha do mesmo trecho, ou segure-a (3º campo da página)');

const vezes = PS.map(() => 0);
ex.forEach((e) => e.is.forEach((i) => vezes[i]++));
acusa('palavras exibidas mais de uma vez', vezes.flatMap((v, i) => (v > 1 ? [`${i} "${PS[i].texto}" ${v}x`] : [])));

/* linhas e trecho (G35, heranca 1) */
const forma = [];
for (const e of ex) {
	if (e.tipo === 'legenda' && e.linhas > 2) forma.push(`legenda "${e.nome}" com ${e.linhas} linhas (máx. 2)`);
	if (e.tipo === 'destaque' && e.linhas > 4) forma.push(`bloco "${e.nome}" com ${e.linhas} linhas (máx. 4)`);
	const ws = e.texto.split(' ');
	ws.slice(0, -1).forEach((w, k) => {
		const p = /[.,?!:;]["”»)]*$/.exec(w);
		// no bloco, a pergunta e a resposta dela formam uma página (o gancho de pergunta-e-resposta, seção 4): só o "?" passa
		if (p && !(e.tipo === 'destaque' && w.endsWith('?'))) forma.push(`"${e.nome}": "${w}" fecha um trecho e "${ws[k + 1]}" começa outro na mesma página (G35)`);
	});
}
acusa('páginas fora da forma', forma, 'quebre a página no ponto/vírgula; legenda até 2 linhas, bloco até 4');

/* destaque: denso no gancho, raro no corpo */
const gancho = ex.filter((e) => e.de < P.ganchoAte).flatMap((e) => e.destaques);
const corpo = ex.filter((e) => e.de >= P.ganchoAte).flatMap((e) => e.destaques.map((d) => `${d.txt} (${f2(PS[d.i].de)} s)`));
const durCorpo = FIM_FALA - P.ganchoAte;
const maxCorpo = Math.max(2, Math.floor(durCorpo / 20));
console.log(`destaques: ${gancho.length} no gancho (até ${P.ganchoAte} s), ${corpo.length} no corpo (${f2(durCorpo)} s, máx. ${maxCorpo}): ${corpo.join(', ')}`);
const dens = [];
if (!gancho.length) dens.push('o gancho não tem destaque: a palavra da pergunta, a contradição ou a resposta acendem ali');
if (corpo.length > maxCorpo) dens.push(`${corpo.length} destaques no corpo: o máximo é ${maxCorpo} (1 a cada 20 s, no mínimo 2); fica só a palavra-resposta`);
acusa('problemas de densidade do destaque', dens);

/* emendas e rosto */
const emenda = ex.flatMap((e) => EM.filter((m) => m > e.de + 0.05 && m < e.ate - 0.05).map((m) => `"${e.nome}" (${f2(e.de)}-${f2(e.ate)} s) atravessa a emenda em ${f2(m)} s`));
acusa('páginas atravessando emenda do recorte', emenda, 'termine a página na emenda (3º campo) ou comece a próxima página na 1ª palavra depois dela');
const rosto = ex.flatMap((e) => {
	const q = queixoEntre(e.de, e.ate);
	return q && e.topo < q + 20 ? [`"${e.nome}" (topo y ${Math.round(e.topo)}) cobre o queixo (y ${Math.round(q)})`] : [];
});
acusa('textos sobre o rosto', rosto, `desça o centro (Y_CENTRO ${Y_CENTRO}) até onde o pé ainda caiba em y ${ZONA.base}, ou tire uma linha do bloco`);
/* mãos (lição do dynamic01, G13): quanto do tempo de cada página o texto cai sobre a mão medida (src/maos.json, de
 * scripts/maos.py). Pregador gesticula no peito: a legenda pode passar pela mão de relance (as referências passam), mas o
 * destaque não fica a maior parte do tempo dele em cima dela. Largura do texto estimada (Montserrat 0,62 em, Playfair 0,5 em). */
let maos = null;
try { maos = JSON.parse(fs.readFileSync('src/maos.json', 'utf8')); } catch {}
const naMao = [];
if (!maos) console.log('aviso: sem src/maos.json (rode scripts/maos.py pela trava) — a conferência das mãos não rodou');
else {
	const C = maos.celula;
	for (const e of ex) {
		const larg = Math.max(...e.nome.split(' / ').map((l) => l.split(' ').reduce((s, w) => s + (/^[*_]/.test(w) || /[*_]$/.test(w) ? w.length * 64 : w.length * 35 + 14), 0)));
		const x0 = Math.floor((500 - larg / 2) / C), x1 = Math.ceil((500 + larg / 2) / C), y0 = Math.floor(e.topo / C), y1 = Math.ceil(e.pe / C);
		const am = maos.amostras.filter(([t]) => t >= e.de && t < e.ate);
		const com = am.filter(([, ls]) => ls.slice(y0, y1).some((l) => { for (let x = x0; x < x1; x++) if ((l / 2 ** x) % 2 >= 1) return true; return false; })).length;
		const fr = am.length ? com / am.length : 0;
		if (fr > 0) console.log(`  mão sob "${e.nome}": ${Math.round(fr * 100)}% do tempo`);
		if (e.tipo === 'destaque' && fr > 0.5) naMao.push(`bloco "${e.nome}" fica ${Math.round(fr * 100)}% do tempo sobre a mão`);
	}
}
/* aviso, não reprovação (cortepalestra01.md, seção 8): a posição fixa a 67% é a forma do modelo, e nas duas referências
 * a mão e o microfone de quem prega passam sob a legenda. O que reprova é ler mal: o cor.py confere o contraste. Se a mão
 * cobre o destaque o tempo todo, olhe os quadros e, se a palavra some, troque o destaque de palavra. */
console.log(`${naMao.length} destaques sobre a mão a maior parte do tempo (aviso: confira nos quadros se a palavra lê)`);
naMao.forEach((x) => console.log('  ' + x));
console.log(`1 posição de texto: centro em y ${Y_CENTRO}`);
[...ex].sort((a, b) => a.de - b.de).forEach((e) => console.log(`  ${f2(e.de)}-${f2(e.ate)} ${e.tipo} [${e.linhas} l, y ${Math.round(e.topo)}-${Math.round(e.pe)}] ${e.nome}`));

/* zona segura: pixels de texto fora da zona */
const {bundle} = await import('@remotion/bundler');
const {renderStill, selectComposition} = await import('@remotion/renderer');
const {spawnSync} = await import('node:child_process');
const RAIZ = path.resolve('../..');
const PY = ['Scripts/python.exe', 'bin/python'].map((x) => path.join(RAIZ, '.venv', x)).find((x) => fs.existsSync(x));
const TRAVA = path.join(RAIZ, '.tmp', 'render.lock');
process.env.TEMP = process.env.TMP = path.join(RAIZ, '.tmp');
fs.mkdirSync(path.join(RAIZ, '.tmp'), {recursive: true});
for (;;) {
	try { fs.mkdirSync(TRAVA); fs.writeFileSync(path.join(TRAVA, 'dono.txt'), `cortepalestra01-cobertura ${process.pid} ${new Date()}\n`); break; } catch { console.log('trava ocupada, esperando...'); await new Promise((r) => setTimeout(r, 20000)); }
}
const dir = path.resolve('.tmp-zona');
let fora = [], falhou = null;
try {
	fs.rmSync(dir, {recursive: true, force: true});
	fs.mkdirSync(dir);
	const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
	const props = {soTexto: true};
	const comp = await selectComposition({serveUrl: serve, id: 'CortePalestra', inputProps: props});
	for (let f = 0; f < comp.durationInFrames; f += 6)
		await renderStill({composition: comp, serveUrl: serve, output: path.join(dir, `s_${String(f).padStart(5, '0')}.png`), frame: f, inputProps: props, imageFormat: 'png', scale: 0.5});
	const py = `
import sys, glob, os
from PIL import Image
d, t, b, e, r = sys.argv[1], *map(int, sys.argv[2:])
for f in sorted(glob.glob(os.path.join(d, '*.png'))):
    a = Image.open(f).convert('RGBA').getchannel('A').point(lambda v: 255 if v > 128 else 0)
    bb = a.getbbox()
    if not bb: continue
    x0, y0, x1, y1 = [v * 2 for v in bb]
    if y0 < t or y1 > b or x0 < e or x1 > r:
        print(f"{os.path.basename(f)} texto em x {x0}-{x1}, y {y0}-{y1}")
`;
	const res = spawnSync(PY, ['-c', py, dir, String(ZONA.topo), String(ZONA.base), String(ZONA.esq), String(ZONA.dir)], {encoding: 'utf8'});
	if (res.status !== 0) throw new Error(res.stderr);
	fora = res.stdout.trim().split('\n').filter(Boolean);
} catch (e) {
	falhou = e;
} finally {
	for (const n of fs.readdirSync(path.join(RAIZ, '.tmp')))
		if (/^(remotion-v.*-assets|remotion-webpack-bundle-|puppeteer_dev_chrome_profile-)/.test(n)) fs.rmSync(path.join(RAIZ, '.tmp', n), {recursive: true, force: true});
	fs.rmSync(TRAVA, {recursive: true, force: true});
	fs.rmSync(dir, {recursive: true, force: true});
}
if (falhou) {
	console.error('a conferência da zona segura não rodou: ' + String(falhou?.message ?? falhou).split('\n')[0]);
	process.exit(1);
}
acusa(`quadros com texto fora da zona segura (y ${ZONA.topo}-${ZONA.base}, x ${ZONA.esq}-${ZONA.dir}; quadro = nº/30 s)`, fora, "quebre a linha longa em duas (' / ') ou divida a página");
console.log(erros.length ? `\nREPROVADO: ${erros.join('; ')}` : '\nzerado');
process.exit(erros.length ? 1 : 0);
