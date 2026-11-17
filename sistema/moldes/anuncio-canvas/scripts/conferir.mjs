// Conferidor do anuncio-canvas: o plano (o bloco marcado do plano em src/Canvas.tsx) e as telas novas (src/telas/) contra a fala
// e as regras do modelo (modelos/anuncio-canvas/anuncio-canvas.md e a skill .claude/skills/anuncio-canvas/SKILL.md).
// uso (na pasta do vídeo ou do molde): node scripts/conferir.mjs   → "0 erros" (código 0) ou a lista do que mexer (código 1)
// Confere: 1) o plano carrega (FALA bate com src/palavras.json, FRASES cobrem a fala em ordem, VIRADA no lugar);
// 2) o plano não está vazio e toda frase tem pelo menos uma peça; 3) frase de pelo menos 1,5 s; 4) toda <Tela comp="X" />
// existe (da casa ou em src/telas/) e todo src/telas/*.tsx está registrado no src/telas/index.ts; 5) toda palavra pedida
// por w('x', n) e wf('x', n) no plano e nas telas novas é dita n vezes; 6) toda linha escrita (<L txt>, Pilula, Glitch)
// é dita naquela ordem a partir do "de"; 7) nenhum travessão e nenhum nome de modelo no texto.
// Avisa (não reprova): mais de 5 peças numa frase, texto de balão ou notificação que a fala não diz, sem VIRADA,
// pouca fala escrita na tela. A zona segura não dá para medir sem a câmera: confira nos quadros (§9).
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(MOLDE, 'src');
const fmt = (x) => x.toFixed(2).replace('.', ',');
const erros = [], avisos = [];
const canvas = fs.readFileSync(path.join(SRC, 'Canvas.tsx'), 'utf8');
const linhas = canvas.split(/\r?\n/);
const ini = linhas.findIndex((l) => l.includes('O PLANO') && /^\s*(\/\/|\/\*)/.test(l));
const fim = linhas.findIndex((l, i) => i > ini && /fim do plano/i.test(l));
if (ini < 0 || fim < 0) {
	console.log('REPROVADO: src/Canvas.tsx perdeu as linhas "O PLANO" e "fim do plano"; devolva os marcadores em volta do plano.');
	process.exit(1);
}
// o código do plano sem os comentários de linha (o começo vazio traz exemplos de peça nos comentários)
const bloco = linhas.slice(ini + 1, fim).filter((l) => !/^\s*\/\//.test(l)).join('\n');
const pastaTelas = path.join(SRC, 'telas');
const arqTelas = fs.existsSync(pastaTelas) ? fs.readdirSync(pastaTelas).filter((n) => n.endsWith('.tsx')) : [];
const fonteTelas = arqTelas.map((n) => ({n, txt: fs.readFileSync(path.join(pastaTelas, n), 'utf8')}));

// 1. carrega o plano de verdade (com o remotion de mentira; as fontes do Google não carregam)
const TMP = path.resolve(MOLDE, '..', '..', '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `conferir-anuncio-canvas-${process.pid}.mjs`);
const publico = fs.existsSync(path.join(MOLDE, 'public')) ? fs.readdirSync(path.join(MOLDE, 'public')).map((name) => ({name})) : [];
let M;
try {
	await build({
		stdin: {contents: "export {FRASES, VIRADA, NOMES_TELAS} from './src/Canvas.tsx'; export {P} from './src/tema.ts';", resolveDir: MOLDE, loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'silent', jsx: 'automatic', loader: {'.json': 'json'}, absWorkingDir: MOLDE,
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^(@remotion\/.*|remotion)$/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: `export const loadFont = () => ({fontFamily: 'x'}); export const Easing = {bezier: () => (x) => x}; export const interpolate = () => 0, spring = () => 0, useCurrentFrame = () => 0, staticFile = (s) => s, AbsoluteFill = null, Audio = null, Img = null; export const getStaticFiles = () => ${JSON.stringify(publico)};`, loader: 'js'}));
		}}],
	});
	M = await import(pathToFileURL(tmp).href);
} catch (e) {
	const msg = (e.errors?.length ? e.errors.map((x) => `${x.location ? `${path.relative(MOLDE, x.location.file)}:${x.location.line}: ` : ''}${x.text}`).join('\n') : e.message) || String(e);
	console.log('O PLANO NÃO CARREGA:\n' + msg.trim());
	console.log('REPROVADO: corrija o que está acima (o plano é de outra fala ou o código não monta).');
	process.exit(1);
} finally {
	fs.rmSync(tmp, {force: true});
}
const {FRASES, VIRADA, NOMES_TELAS, P} = M;
const PB = P.palavras;
const limpa = (s) => s.toLowerCase().replace(/[.,!?~]/g, ''); // a mesma do src/tema.ts (w, wf, seq)
const fala = PB.map((p) => limpa(p.texto));
const iniF = (k) => PB[FRASES[k][0]].de, fimF = (k) => PB[FRASES[k][1]].ate;

// 2. plano vazio e frase sem peça
const pecas = [...bloco.matchAll(/<El\b[^>]*\bk=\{(\d+)\}/g)].map((m) => Number(m[1]));
if (!pecas.length) erros.push('o plano está vazio: a Coreografia não tem nenhuma peça. Monte uma frase de cada vez sobre a fala nova (a skill anuncio-canvas, "A invenção").');
else
	FRASES.forEach((f, k) => {
		const n = pecas.filter((x) => x === k).length;
		const txt = PB.slice(f[0], f[1] + 1).map((p) => p.texto).join(' ');
		if (!n) erros.push(`a frase ${k} ("${txt}") não tem nenhuma peça na Coreografia: toda frase dita aparece`);
		if (n > 5) avisos.push(`a frase ${k} tem ${n} peças (o modelo pede no máximo 4 ou 5, contando cada linha de texto)`);
	});
for (const k of new Set(pecas)) if (k >= FRASES.length) erros.push(`<El k={${k}}>: não existe a frase ${k} (FRASES vai de 0 a ${FRASES.length - 1})`);

// 3. tempo de leitura da frase
FRASES.forEach((f, k) => {
	if (k < FRASES.length - 1 && fimF(k) - iniF(k) < 1.5) erros.push(`a frase ${k} dura ${fmt(fimF(k) - iniF(k))} s: junte com a vizinha (nenhuma frase com menos de 1,5 s, §5)`);
});
if (VIRADA === null) avisos.push('sem VIRADA: num anúncio, a frase em que o produto aparece é a virada (entra por chicote)');

// 4. telas: as pedidas existem e as desenhadas estão registradas
const pedidas = [...bloco.matchAll(/comp=["'](\w+)["']/g)].map((m) => m[1]);
const existem = new Set([...NOMES_TELAS.casa, ...NOMES_TELAS.video]);
for (const c of new Set(pedidas)) if (!existem.has(c)) erros.push(`<Tela comp="${c}" />: não existe. Desenhe src/telas/${c}.tsx com o kit e registre em src/telas/index.ts`);
for (const {n} of fonteTelas) {
	const nome = n.replace(/\.tsx$/, '');
	if (!NOMES_TELAS.video.includes(nome)) erros.push(`src/telas/${n} não está registrada em src/telas/index.ts (TELAS)`);
	else if (!pedidas.includes(nome)) avisos.push(`a tela nova ${nome} está registrada e o plano não usa`);
}
const casaUsadas = [...new Set(pedidas)].filter((c) => NOMES_TELAS.casa.includes(c) && !NOMES_TELAS.video.includes(c));

// 5. palavras pedidas por w() e wf() no plano e nas telas novas
const conta = (x) => fala.filter((p) => p === limpa(x)).length;
for (const [onde, txt] of [['o plano', bloco], ...fonteTelas.filter(({n}) => pedidas.includes(n.replace(/\.tsx$/, ''))).map(({n, txt}) => [`src/telas/${n}`, txt])])
	for (const m of txt.matchAll(/\bwf?\(\s*['"]([^'"]+)['"](?:\s*,\s*(\d+))?\s*\)/g)) {
		const n = Number(m[2] ?? 1), tem = conta(m[1]);
		if (tem < n) erros.push(`${onde}: ${m[0]} pede a ${n}ª vez que se diz "${m[1]}", e a fala ${tem ? `só tem ${tem}` : 'não tem nenhuma'}`);
	}

// 6. as linhas escritas são ditas, em ordem, a partir do "de" (o mesmo leitor do seq do src/tema.ts)
const escritas = [];
const seqOk = (de, texto) => {
	let cur = PB.findIndex((x) => x.de >= de - 0.08);
	for (const tk of texto.split(' ')) {
		if (tk.startsWith('~')) continue;
		let k = cur;
		while (k >= 0 && k < PB.length && limpa(PB[k].texto) !== limpa(tk)) k++;
		if (k < 0 || k >= PB.length) return tk;
		cur = k + 1;
	}
	return null;
};
for (const m of bloco.matchAll(/<L\s+de=\{([\d.]+)\}\s+txt="([^"]+)"/g)) {
	escritas.push(m[2]);
	const falta = seqOk(Number(m[1]), m[2]);
	if (falta) erros.push(`<L de={${m[1]}} txt="${m[2]}">: a fala não diz "${falta}" nessa ordem depois de ${m[1]} s (escreva as palavras como foram ditas e o "de" no início da 1ª)`);
}
for (const m of bloco.matchAll(/<(Pilula|Glitch)\s+texto="([^"]+)"/g)) {
	escritas.push(m[2]);
	const falta = m[2].split(/\s+/).find((x) => !fala.includes(limpa(x)));
	if (falta) erros.push(`<${m[1]} texto="${m[2]}">: a fala não diz "${falta}" (G19: na tela, só o que é dito)`);
}
for (const m of bloco.matchAll(/<(Bolha|Notif)\b[^>]*?\b(?:texto|titulo)="([^"]+)"/g))
	if (m[2].split(/\s+/).some((x) => !fala.includes(limpa(x)))) avisos.push(`<${m[1]}> com "${m[2]}": texto que a fala não diz; só entra se for real de quem anuncia (print, conversa real)`);

// 7. travessão e nome do modelo em todo texto (plano e telas novas)
const textos = [...escritas, ...[...bloco.matchAll(/(?:texto|titulo|txt)="([^"]+)"/g)].map((m) => m[1]), ...fonteTelas.flatMap(({txt}) => [...txt.matchAll(/>\s*([^<>{}\n]*[A-Za-zÀ-ú][^<>{}\n]*)\s*</g)].map((m) => m[1]))];
for (const s of new Set(textos)) {
	if (/—/.test(s)) erros.push(`travessão no texto "${s}"`);
	if (/anuncio-canvas|anúncio-canvas/i.test(s)) erros.push(`nome do modelo no texto "${s}"`);
}

const ditas = new Set(escritas.flatMap((s) => s.split(/\s+/).map(limpa)));
const cobre = fala.filter((x) => ditas.has(x)).length / fala.length;
if (pecas.length && cobre < 0.6) avisos.push(`só ${Math.round(cobre * 100)}% das palavras ditas estão escritas em linha, pílula ou glitch (o modelo escreve a frase da vez; peça sem texto é exceção)`);

console.log(`${FRASES.length} frases, ${pecas.length} peças, virada ${VIRADA ?? 'nenhuma'}; telas da casa: ${casaUsadas.join(', ') || 'nenhuma'}; telas novas: ${[...new Set(pedidas)].filter((c) => NOMES_TELAS.video.includes(c)).join(', ') || 'nenhuma'}`);
for (const a of avisos) console.log('aviso: ' + a);
for (const e of erros) console.log('ERRO: ' + e);
console.log(erros.length ? `REPROVADO: ${erros.length} erros. Corrija e rode de novo.` : '0 erros. Agora confira nos quadros a zona segura e a leitura de cada frase (§9).');
process.exit(erros.length ? 1 : 0);
