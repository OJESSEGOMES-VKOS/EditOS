// Checador do imagem-por-palavra: carrega src/modelo.ts (com src/plano.json, src/imagens.json, a fala e o rosto) e confere
// as regras da casa e as do modelo (modelos/imagem-por-palavra/imagem-por-palavra.md). Sai com código 1 quando reprova.
// Também grava src/presentes.json (as imagens que existem: o render usa o efeito tipográfico no lugar das que faltam)
// e src/eventos.json (cada evento visual com o seu tempo: o scripts/som.py toca um efeito em cada).
// uso (na pasta do vídeo ou do molde): node scripts/conferir.mjs        node scripts/conferir.mjs --palavras
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = path.resolve(MOLDE, '..', '..');
if (process.argv.includes('--palavras')) {
	const ps = JSON.parse(fs.readFileSync(path.join(MOLDE, 'src', 'palavras.json'), 'utf8'));
	ps.forEach((p, i) => console.log(`${String(i).padStart(3)} ${p.start.toFixed(2).padStart(6)}-${p.end.toFixed(2).padEnd(6)} ${p.text}${/[.,;:!?…]["”’)]*$/.test(p.text) ? '   | fim de trecho' : ''}`));
	process.exit(0);
}
// sem src/maos.json (vídeo novo antes do scripts/maos.py) o modelo carrega vazio e o checador avisa
if (!fs.existsSync(path.join(MOLDE, 'src', 'maos.json'))) fs.writeFileSync(path.join(MOLDE, 'src', 'maos.json'), JSON.stringify({celula: 40, amostras: []}));
// as imagens presentes (antes de carregar o modelo, que não depende disto; o Reel sim)
const IMGS = JSON.parse(fs.readFileSync(path.join(MOLDE, 'src', 'imagens.json'), 'utf8'));
const presentes = Object.values(IMGS).map((v) => v.arquivo).filter((a) => fs.existsSync(path.join(MOLDE, 'public', a)));
fs.writeFileSync(path.join(MOLDE, 'src', 'presentes.json'), JSON.stringify(presentes, null, 0) + '\n');

const TMP = path.join(RAIZ, '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `conferir-sd01-${process.pid}.mjs`);
let M;
try {
	await build({entryPoints: [path.join(MOLDE, 'src', 'modelo.ts')], bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'silent', loader: {'.json': 'json'}});
	M = await import(pathToFileURL(tmp).href);
} catch (e) {
	console.error(e.errors?.length ? e.errors.map((x) => x.text).join('\n') : e.message);
	process.exit(1);
} finally {
	fs.rmSync(tmp, {force: true});
}
const {PS, PLANOS, BLOCOS, PICOS, HEROI, PONTES, FLASHES, NEGATIVOS, EVENTOS, TROCAS, DURACAO, ZONA, ZW, QUEIXO, ZOOM, ORIGEM, TEM_ROSTO, PICO_PX, PICO_ALT, LEG_LH,
	IMGS: IM, ERROS_PLANO, TEM_MAOS, bocaY, maoSobre, caixas, escrita, entra, geometria, largLeg, largPico, fechaTrecho} = M;

// os limites do modelo (imagem-por-palavra.md, seções 2, 3 e 5)
const LIM = {
	minTroca: 0.165,   // 5 quadros: o piso das rajadas (exceção deste modelo; a casa é 0,3 s)
	rajada: 0.3,       // abaixo disto o intervalo é rajada...
	rajadaMax: 3.0,    // ...e uma rajada dura no máximo 3 s (E3)
	janela: 5, minJanela: 4, minJanelaFecho: 3, // nenhuma janela de 5 s com menos de 4 trocas (a última, do fecho, 3)
	trocasMin: 1.8, trocasMax: 2.6,             // trocas por segundo no vídeo (ref1 2,41; ref2 1,52 com o miolo de rosto)
	bloco: 1.5, blocoPiso: 1.2, palavra: 0.4, linhas: 2, // bloco 1,2–1,5 s só entre duas pausas da fala (aviso); abaixo de 1,2 s só um trecho inteiro
	picoMin: 3, picoMax: 12,                     // a trava só onde importa (G17): avisa só se ficarem colados
	palavrasBloco: 9,                            // I-LEGENDA: bloco curto (1–6 palavras nas refs); avisa acima de 9
	card: 4.0,                                   // tempo contínuo em cartão chapado (preto/creme) sem imagem
	pessoaMin: 0.5,                              // G6: a pessoa (o vídeo normal) é a maior parte do vídeo
	margemQueixo: 30,
	mao: 0.15, maoAviso: 0.08,                    // área do texto sobre mão/braço na média do plano da pessoa
};
const erros = [], avisos = [];
const t2 = (x) => x.toFixed(2);
ERROS_PLANO.forEach((e) => erros.push(e));
if (TEM_ROSTO && !TEM_MAOS) avisos.push('sem src/maos.json medido: rode scripts/maos.py (o texto do peito não pode ficar sobre as mãos)');

// 1. a faixa de imagem: emendada, começa no 0, cada plano numa palavra
if (PLANOS[0].i !== 0) erros.push('o 1º plano tem de começar na palavra 0');
PLANOS.forEach((p, k) => {
	if (k && p.i <= PLANOS[k - 1].i) erros.push(`planos[${k}] (${p.de[1]}) não vem depois do anterior`);
	if (['img', 'estilos'].includes(p.tipo) && !p.img) erros.push(`planos[${k}] (${p.tipo}) sem "img"`);
	if (['rajada', 'mosaico'].includes(p.tipo) && !(p.imgs ?? []).length) erros.push(`planos[${k}] (${p.tipo}) sem "imgs"`);
	for (const id of [p.img, ...(p.imgs ?? [])].filter(Boolean)) if (!IM[id]) erros.push(`planos[${k}]: a imagem "${id}" não está em src/imagens.json`);
	if (['rajada', 'mosaico'].includes(p.tipo) && (p.passo ?? 0.2) < LIM.minTroca) erros.push(`planos[${k}]: passo ${p.passo} abaixo de 0,17 s`);
	if (p.tipo === 'pessoa' && !TEM_ROSTO) avisos.push(`planos[${k}]: plano da pessoa sem rosto medido (gravação só de voz? use imagem ou cartão)`);
});
// a imagem corta no começo da palavra que ela ilustra (E2)
PLANOS.filter((p) => p.tipo === 'img' || p.tipo === 'estilos').forEach((p) => {
	const im = IM[p.img];
	if (im && im.palavra[0] !== p.i && !PLANOS.some((q) => q !== p && q.img === p.img && q.i === im.palavra[0])) avisos.push(`plano "${p.img}" em "${PS[p.i].texto}" ilustra outra palavra ("${im.palavra[1]}"): confira se a imagem é a do que está sendo dito`);
});
// imagens que faltam: o plano vira o efeito tipográfico (não trava, mas avisa)
const falta = [...new Set(PLANOS.flatMap((p) => [p.img, ...(p.imgs ?? [])]).filter(Boolean))].filter((id) => IM[id] && !presentes.includes(IM[id].arquivo));
if (falta.length) avisos.push(`faltam ${falta.length} imagens (efeito tipográfico no lugar): ${falta.join(', ')} -> scripts/material.py`);
PONTES.forEach((p) => { if (!presentes.includes(IM[p.img]?.arquivo)) avisos.push(`a ponte "${p.img}" não tem arquivo: não aparece`); });

// 2. o ritmo: piso, rajadas, janelas, média
const tr = [...new Set(TROCAS.map((x) => Math.round(x * 30)))].sort((a, b) => a - b).map((q) => q / 30);
const iv = tr.slice(1).map((x, k) => x - tr[k]);
iv.forEach((d, k) => { if (d < LIM.minTroca) erros.push(`troca a ${t2(tr[k + 1])} s só ${t2(d)} s depois da anterior (piso 0,17 s)`); });
let r0 = null;
for (let k = 0; k <= iv.length; k++) {
	const rapido = k < iv.length && iv[k] < LIM.rajada;
	if (rapido && r0 === null) r0 = tr[k];
	if (!rapido && r0 !== null) {
		const fim = tr[k];
		if (fim - r0 > LIM.rajadaMax + 1e-6) erros.push(`rajada de ${t2(r0)} a ${t2(fim)} s (${t2(fim - r0)} s): no máximo 3 s abaixo de 0,3 s, depois respiro`);
		r0 = null;
	}
}
// G6 (2026-11-05): a pessoa carrega a maior parte do vídeo; a imagem vem em ONDAS (planos seguidos que não são a pessoa),
// no fim das cenas fortes. O ritmo do modelo (trocas por segundo, janelas de 5 s) é cobrado dentro das ondas.
const ONDAS = [];
// I-LEGENDA (2026-11-07): onda é só IMAGEM (img, estilos, rajada, mosaico, paineis). Cartão chapado é palco da tipografia,
// não conta como onda nem pode fingir corte (cartões trocando de cor sem texto novo saíram).
const IMAGEM = new Set(['img', 'estilos', 'rajada', 'mosaico', 'paineis']);
PLANOS.forEach((p) => {
	if (!IMAGEM.has(p.tipo)) return;
	const u = ONDAS[ONDAS.length - 1];
	if (u && Math.abs(u.t1 - p.t0) < 1e-6) u.t1 = p.t1;
	else ONDAS.push({t0: p.t0, t1: p.t1});
});
const janelas = [];
for (const o of ONDAS) {
	const n = tr.filter((x) => x >= o.t0 - 1e-6 && x < o.t1 - 1e-6).length;
	janelas.push(`${t2(o.t0)}-${t2(o.t1)}s:${n}`);
	for (let a = o.t0; a + LIM.janela <= o.t1 + 0.01; a += LIM.janela) {
		const m = tr.filter((x) => x >= a && x < a + LIM.janela).length;
		if (m < LIM.minJanela) erros.push(`janela ${t2(a)}–${t2(a + LIM.janela)} s dentro da onda com ${m} trocas (mínimo ${LIM.minJanela})`);
	}
}
const tOndas = ONDAS.reduce((a, o) => a + o.t1 - o.t0, 0);
const nOndas = tr.filter((x) => ONDAS.some((o) => x >= o.t0 - 1e-6 && x < o.t1 - 1e-6)).length;
const porSeg = tOndas ? nOndas / tOndas : 0; // trocas por segundo DENTRO das ondas de imagem (G6)
if (!ONDAS.length) avisos.push('sem onda de imagem (sem material, G7): a camada de imagem não entrou; o ritmo vem da fala, da trava e do reenquadre');
else if (porSeg < LIM.trocasMin || porSeg > LIM.trocasMax) avisos.push(`${porSeg.toFixed(2)} trocas/s nas ondas de imagem (faixa do modelo ${LIM.trocasMin}–${LIM.trocasMax})`);
if (ONDAS.length && porSeg < 1.4) erros.push(`${porSeg.toFixed(2)} trocas/s nas ondas de imagem: isto não é o imagem-por-palavra (mínimo 1,4 dentro da onda)`);
const med = [...iv].sort((a, b) => a - b)[Math.floor(iv.length / 2)] ?? 0;

// 3. cartão chapado contínuo e pessoa seguida
let c0 = null;
PLANOS.forEach((p, k) => {
	const card = p.tipo === 'card';
	if (card && c0 === null) c0 = p.t0;
	const prox = PLANOS[k + 1];
	if (card && (!prox || prox.tipo !== 'card')) {
		if (p.t1 - c0 > LIM.card + 1e-6) erros.push(`cartão chapado de ${t2(c0)} a ${t2(p.t1)} s (${t2(p.t1 - c0)} s): no máximo ${LIM.card} s seguidos`);
		c0 = null;
	}
});
PLANOS.forEach((p, k) => {
	if (p.tipo === 'pessoa' && k && PLANOS[k - 1].tipo === 'pessoa' && PLANOS[k - 1].plano === p.plano) erros.push(`planos[${k}]: duas telas da pessoa seguidas no mesmo enquadre (o corte não aparece)`);
});
NEGATIVOS.forEach((x) => { if (PLANOS.find((p) => x >= p.t0 && x < p.t1)?.tipo === 'pessoa') erros.push(`negativo em ${t2(x)} s cai na pessoa (G6: nada de efeito de cor na gravação)`); });
if (FLASHES.length > Math.max(1, Math.round(DURACAO / 8))) avisos.push(`${FLASHES.length} flashes: 1 a cada ~8 s no máximo`);

// 4. o texto: cada palavra uma vez, blocos, leitura, linhas, zona, rosto
const vistas = new Map();
BLOCOS.forEach((b) => b.ids.forEach((i) => vistas.set(i, (vistas.get(i) ?? 0) + 1)));
PS.forEach((_, i) => { if (vistas.get(i) !== 1) erros.push(`a palavra ${i} "${PS[i].texto}" aparece ${vistas.get(i) ?? 0} vezes (tem de ser 1)`); });
const textoEm = (t) => PLANOS.find((p) => t >= p.t0 && t < p.t1);
BLOCOS.forEach((b) => {
	const nome = `bloco ${b.k} "${b.ids.map(escrita).join(' ').slice(0, 40)}"`;
	const dur = (b.fixo ? DURACAO : b.t1) - b.t0;
	b.ids.slice(0, -1).forEach((i) => { if (fechaTrecho(i)) erros.push(`${nome}: passa da pontuação em "${PS[i].texto}" (G11/G14: um bloco é um trecho só)`); });
	if (dur < LIM.blocoPiso - 1e-6 && !b.trechoInteiro) erros.push(`${nome}: ${t2(dur)} s na tela (mínimo ${LIM.blocoPiso} s; só um trecho inteiro curto fica menos)`);
	else if (dur < LIM.bloco - 1e-6 && !b.trechoInteiro) avisos.push(`${nome}: ${t2(dur)} s na tela (alvo ${LIM.bloco} s): só vale se a fala não dá outra divisão com cada palavra a 0,4 s`);
	for (const i of b.ids) {
		const naGigante = b.pico && i >= b.pico.de && i <= b.pico.ate; // a gigante entra inteira na 1ª palavra dela
		const fica = (b.fixo ? DURACAO : b.t1) - Math.max(naGigante ? entra(b.pico.de) : entra(i), b.t0);
		if (fica < LIM.palavra - 1e-6) erros.push(`${nome}: "${PS[i].texto}" fica ${t2(fica)} s (mínimo 0,4 s)`);
		if (entra(i) < b.t0 - 1e-6) erros.push(`${nome}: "${PS[i].texto}" entra antes do bloco`);
	}
	if (b.estilo === 'heroi') return;
	if (b.ids.length > LIM.palavrasBloco) avisos.push(`${nome}: ${b.ids.length} palavras no bloco (a identidade é o bloco curto): divida numa quebra se os dois lados ficarem com 1,5 s ou mais`);
	if (b.antes.length + b.depois.length > LIM.linhas) erros.push(`${nome}: ${b.antes.length + b.depois.length} linhas de legenda (máx. 2, G12)`);
	// o bloco não atravessa pessoa/imagem <-> cartão: o texto mudaria de lugar no meio da fala
	const fim = b.fixo ? DURACAO : b.t1;
	const tipos = PLANOS.filter((p) => p.t0 < fim - 1e-6 && p.t1 > b.t0 + 1e-6).map((p) => p.tipo === 'card');
	if (tipos.some((x) => x !== b.cartao)) erros.push(`${nome}: atravessa ${b.cartao ? 'cartão -> pessoa/imagem' : 'pessoa/imagem -> cartão'}: o cartão entra e sai junto com o bloco (G23)`);
	[...b.antes, ...b.depois].forEach((l) => { if (l.w > ZW + 1) erros.push(`${nome}: linha "${l.ids.map(escrita).join(' ')}" com ${Math.round(l.w)} px (cabe ${ZW}); ponha uma quebra`); });
	if (b.pico) {
		const p = b.pico;
		const dentro = b.ids.filter((i) => i >= p.de && i <= p.ate);
		const w = largPico(dentro.map(escrita).join(' '), PICO_PX);
		if (w > ZW + 1) erros.push(`${nome}: o pico "${dentro.map(escrita).join(' ')}" tem ${Math.round(w)} px a ${PICO_PX} px (cabe ${ZW})`);
		if (b.depois.length > 1) erros.push(`${nome}: na trava, no máximo 1 linha depois da gigante`);
		// I-LEGENDA v3: a gigante é do tamanho das referências (60–100% da largura): abaixo de 55% da zona não é a trava
		if (w < 0.55 * ZW) erros.push(`${nome}: a gigante "${dentro.map(escrita).join(' ')}" ocupa ${Math.round((100 * w) / ZW)}% da largura (mínimo 55%): escolha um termo mais longo ou deixe sem gigante`);
	}
	const g = geometria(b);
	const cx = caixas(b);
	const tops = cx.map((c) => c.y0);
	const fundo = Math.max(...cx.map((c) => c.y1));
	if (Math.min(...tops) < ZONA.topo || fundo > ZONA.base) erros.push(`${nome}: fora da zona segura (y ${Math.round(Math.min(...tops))}–${Math.round(fundo)}; zona ${ZONA.topo}–${ZONA.base})`);
	if (cx.some((c) => c.x0 < ZONA.esq - 1 || c.x1 > ZONA.dir + 1)) erros.push(`${nome}: texto fora da zona segura na horizontal`);
	// nenhum texto sobre o rosto: em qualquer plano da pessoa que o bloco atravessa, o topo do texto fica abaixo do queixo
	const topo = Math.min(...tops);
	PLANOS.filter((p) => p.tipo === 'pessoa' && p.t0 < (b.fixo ? DURACAO : b.t1) && p.t1 > b.t0).forEach((p) => {
		const queixo = ORIGEM.y; // o zoom puxa do queixo: ele fica no lugar em todos os enquadres
		// o texto pode encostar no queixo (as referências põem a gigante no peito), nunca na boca nem nos olhos
		const boca = bocaY(ZOOM[p.plano ?? 'aberto']);
		if (topo < boca + 10) erros.push(`${nome}: texto em y ${Math.round(topo)} sobre a boca (boca em ~${Math.round(boca)}, queixo ${Math.round(queixo)}) no plano da pessoa de ${t2(p.t0)} s: plano mais fechado (o rosto sobe) ou menos linhas antes da gigante`);
		const a0 = Math.max(p.t0, b.t0), a1 = Math.min(p.t1, b.fixo ? DURACAO : b.t1);
		const amostra = [];
		for (let t = a0; t < a1; t += 0.25) amostra.push(maoSobre(caixas(b), t, ZOOM[p.plano ?? 'aberto']));
		const m = amostra.reduce((x, y) => x + y, 0) / Math.max(1, amostra.length);
		if (m > LIM.mao) erros.push(`${nome}: ${Math.round(m * 100)}% do texto sobre as mãos no plano da pessoa de ${t2(p.t0)} s (máx. 15%): plano mais fechado, imagem no lugar, ou menos texto ali`);
		else if (m > LIM.maoAviso) avisos.push(`${nome}: ${Math.round(m * 100)}% do texto sobre as mãos no plano da pessoa de ${t2(p.t0)} s: olhe o quadro`);
	});
});
// 5. os picos: lugar no bloco, espaço entre eles, um herói só
const tp = [...BLOCOS.filter((b) => b.pico).map((b) => entra(b.pico.de)), ...(HEROI ? [entra(HEROI.de)] : [])].sort((a, b) => a - b);
tp.slice(1).forEach((x, k) => {
	const d = x - tp[k];
	if (d < LIM.picoMin) avisos.push(`picos em ${t2(tp[k])} e ${t2(x)} s: ${t2(d)} s de distância (pico seguido de pico perde força; alvo 5–8 s)`);
	if (d > LIM.picoMax) avisos.push(`${t2(d)} s sem pico entre ${t2(tp[k])} e ${t2(x)} s (alvo 5–8 s)`);
});
PICOS.forEach((p, k) => {
	const b = BLOCOS.find((x) => x.ids.includes(p.de));
	if (b && !b.ids.includes(p.ate)) erros.push(`picos[${k}] atravessa o fim do bloco`);
	if (b?.estilo === 'heroi') erros.push(`picos[${k}] dentro do herói (o herói já é o pico)`);
	if (p.voz === 'conta') erros.push(`picos[${k}]: "conta" mostra números que a pessoa não disse (G10); use a gigante`);
	if (/[.,;:!?…"“”]/.test(escrita(p.ate).slice(-1)) || /^["“]/.test(escrita(p.de))) erros.push(`picos[${k}]: pontuação ou aspas dentro da gigante (G18): tire no "texto" do plano`);
});
// G12/G13: a legenda padrão tem um lugar (Y1) sobre a pessoa e a imagem; a gigante da trava tem um lugar por tipo de fundo
// (pessoa/imagem: logo abaixo da 1ª linha; cartão: no meio do quadro). No máximo 3 posições de destaque no vídeo.
const posLeg = new Set(BLOCOS.filter((b) => b.estilo !== 'heroi' && !b.fixo && !b.cartao && !b.pico).map((b) => Math.round(geometria(b).antes[0]?.y ?? geometria(b).pico.y)));
if (posLeg.size > 1) erros.push(`a legenda sobre a pessoa começa em ${posLeg.size} alturas (${[...posLeg].join(', ')}): um lugar só (G12)`);
const posPico = new Set(BLOCOS.filter((b) => b.pico).map((b) => `${b.cartao ? 'cartão' : 'pessoa'}:${Math.round(geometria(b).pico.y / 10) * 10}`));
const tiposPico = new Set([...posPico].map((x) => x.split(':')[0]));
if (posPico.size > 3) erros.push(`a gigante em ${posPico.size} posições (${[...posPico].join(', ')}): no máximo 3 (G13)`);
if (tiposPico.has('pessoa') && [...posPico].filter((x) => x.startsWith('pessoa')).length > 1) erros.push(`a gigante sobre a pessoa muda de altura (${[...posPico].join(', ')}): mesmo tipo, mesma posição (G13)`);
// o cartão é palco: só entra com a gigante, o herói ou o comando fixo dentro dele; nunca dois cartões seguidos trocando de cor
PLANOS.forEach((p, k) => {
	if (p.tipo !== 'card') return;
	const dentro = BLOCOS.filter((b) => b.t0 < p.t1 - 1e-6 && (b.fixo ? DURACAO : b.t1) > p.t0 + 1e-6);
	if (!p.porque) erros.push(`planos[${k}] cartão em "${PS[p.i].texto}" sem "porque": o cartão preto é raro (respiro tipográfico pedido pela fala, ou rosto que cobriria o texto); a gigante mora sobre a gravação (I-LEGENDA v3)`);
	if (!dentro.some((b) => b.pico || b.estilo === 'heroi' || b.estilo === 'tarja')) erros.push(`planos[${k}] cartão em "${PS[p.i].texto}" sem tipografia gigante: cartão chapado não é corte de enfeite (I-LEGENDA)`);
	if (k && PLANOS[k - 1].tipo === 'card') erros.push(`planos[${k}]: cartão depois de cartão (trocar a cor do fundo sem texto novo não é corte; I-LEGENDA)`);
});
// 6. o que a casa proíbe na tela
for (const v of [...Object.values(M.PS.map((_, i) => escrita(i)))]) if (/[—–]/.test(v)) erros.push(`travessão na tela: "${v}"`);
if (BLOCOS.some((b) => b.ids.map(escrita).join(' ').toLowerCase().includes('superdopamina'))) erros.push('o nome do modelo está na tela (G20)');

// eventos para o som
fs.writeFileSync(path.join(MOLDE, 'src', 'eventos.json'), JSON.stringify({duracao: DURACAO, fala: PS.map((p) => p.texto).join(' '), eventos: EVENTOS.map((e) => ({t: Math.round(e.t * 1000) / 1000, tipo: e.tipo}))}, null, 0) + '\n');

// relatório
const tempoCard = PLANOS.filter((p) => p.tipo === 'card').reduce((a, p) => a + p.t1 - p.t0, 0);
const tempoPessoa = PLANOS.filter((p) => p.tipo === 'pessoa').reduce((a, p) => a + p.t1 - p.t0, 0);
if (tempoPessoa / DURACAO < LIM.pessoaMin) console.log(`aviso: a pessoa está em ${(100 * tempoPessoa / DURACAO).toFixed(0)}% do vídeo (alvo ${100 * LIM.pessoaMin}%); confira se cada imagem serve à fala e ao tema (G28), não reprova`);
console.log(`duração ${t2(DURACAO)} s | ${PLANOS.length} planos | ${tr.length} trocas, ${porSeg.toFixed(2)}/s dentro das ondas de imagem (${t2(tOndas)} s) | intervalo mediano ${t2(med)} s | menor ${t2(Math.min(...iv))} s`);
console.log(`ondas de imagem (G6): ${janelas.join('  ')}`);
console.log(`pessoa ${(100 * tempoPessoa / DURACAO).toFixed(0)}% | cartão ${(100 * tempoCard / DURACAO).toFixed(0)}% | imagem ${(100 - 100 * (tempoPessoa + tempoCard) / DURACAO).toFixed(0)}% | picos ${tp.map(t2).join(', ')} s | pico ${PICO_PX} px | ${BLOCOS.length} blocos | imagens ${presentes.length}/${Object.keys(IMGS).length}`);
for (const p of PLANOS) console.log(`  ${t2(p.t0).padStart(6)}–${t2(p.t1).padEnd(6)} ${p.tipo.padEnd(8)} ${(p.img ?? p.plano ?? p.fundo ?? (p.imgs ?? []).join('+')).slice(0, 40).padEnd(40)} "${PS[p.i].texto}"`);
avisos.forEach((a) => console.log('AVISO', a));
if (erros.length) {
	erros.forEach((e) => console.log('ERRO ', e));
	console.log(`REPROVADO: ${erros.length} erro(s)`);
	process.exit(1);
}
console.log('APROVADO');
