import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Fredoka';

/**
 * 3d-como-funciona: os quadros do Blender + uma palavra por vez + o nome técnico em amarelo no alto + voz, trilha e sons.
 * Receita (modelos/3d-como-funciona/3d-como-funciona.md §3): palavra branca, fonte arredondada pesada, contorno escuro fino e
 * sombra, a ~72% da altura; a palavra do nome técnico em amarelo; o rótulo do nome no alto (~15%), amarelo, girado
 * -3°, entra com mola no nome e sai no próximo "Mas".
 */
export type Palavra = {w: string; de: number; ate: number; termo: boolean};
export type Termo = {texto: string; de: number; ate: number};
export type Som = {arquivo: string; em: number; volume: number};
/** estilo da legenda, escolhido por vídeo (oficina/<pasta>/legenda.txt, lido pelo montar.py); sem o campo = 'padrao' */
export type Legenda = 'padrao' | 'desembaca' | 'tabuleiro' | 'letreiro';
/** bloco do 'tabuleiro': as palavras i0..i1 (índices em palavras) aparecem juntas de `de` até `ate` */
export type Bloco = {i0: number; i1: number; de: number; ate: number};
export type Props = {
	duracao: number;
	fps: number;
	palavras: Palavra[];
	termos: Termo[];
	sons: Som[];
	trilha: {arquivo: string; volume: number};
	voz: string;
	filme: string;
	legenda?: Legenda;
	blocos?: Bloco[];
};

const {fontFamily} = loadFont('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});
const BRANCO = '#FFFFFF';
const AMARELO = '#FFD84D';
const CONTORNO = '#1B1F2A';

const contorno = (px: number) => {
	const s: string[] = [];
	for (let a = 0; a < 360; a += 30) {
		const r = (a * Math.PI) / 180;
		s.push(`${(Math.cos(r) * px).toFixed(1)}px ${(Math.sin(r) * px).toFixed(1)}px 0 ${CONTORNO}`);
	}
	return s.join(', ') + `, 0 ${px * 2.2}px ${px * 3}px rgba(0,0,0,0.45)`;
};

const PalavraAtual: React.FC<{palavras: Palavra[]}> = ({palavras}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	const p = palavras.find((x) => t >= x.de && t < x.ate);
	if (!p) return null;
	const entra = spring({frame: f - Math.round(p.de * fps), fps, config: {damping: 13, stiffness: 260, mass: 0.6}});
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 1920 * 0.715, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					fontFamily,
					fontWeight: 700,
					fontSize: 74,
					lineHeight: 1,
					letterSpacing: '0.005em',
					color: p.termo ? AMARELO : BRANCO,
					textShadow: contorno(4.5),
					transform: `scale(${0.82 + 0.18 * entra})`,
					textTransform: 'capitalize',
				}}
			>
				{p.w.replace(/^[«"“]|[»"”]$/g, '')}
			</div>
		</div>
	);
};

const limpa = (w: string) => w.replace(/^[«"“]|[»"”]$/g, '');

// ---------------------------------------------------------------- geladeira: "desembaça"
// a palavra nasce desfocada, com brilho gelado, e fica nítida em ~0,15 s (vidro embaçado limpando); contorno azul-escuro
const AZUL_ESCURO = '#0B2540';
const contornoCor = (px: number, cor: string) => {
	const s: string[] = [];
	for (let a = 0; a < 360; a += 30) {
		const r = (a * Math.PI) / 180;
		s.push(`${(Math.cos(r) * px).toFixed(1)}px ${(Math.sin(r) * px).toFixed(1)}px 0 ${cor}`);
	}
	return s.join(', ') + `, 0 ${px * 2.2}px ${px * 3}px rgba(0,0,0,0.45)`;
};
const PalavraDesembaca: React.FC<{palavras: Palavra[]}> = ({palavras}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	const p = palavras.find((x) => t >= x.de && t < x.ate);
	if (!p) return null;
	const k = interpolate(t - p.de, [0, Math.min(0.15, (p.ate - p.de) * 0.45)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
	const brilho = `0 0 ${(6 + 22 * k).toFixed(1)}px rgba(200,236,255,${(0.85 * k).toFixed(2)})`;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 1920 * 0.715, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					fontFamily,
					fontWeight: 700,
					fontSize: 74,
					lineHeight: 1,
					letterSpacing: '0.005em',
					color: p.termo ? AMARELO : BRANCO,
					textShadow: brilho + ', ' + contornoCor(4.5, AZUL_ESCURO),
					filter: `blur(${(9 * k).toFixed(2)}px)`,
					opacity: 0.35 + 0.65 * (1 - k),
					transform: `scale(${1.06 - 0.06 * (1 - k)})`,
					textTransform: 'capitalize',
				}}
			>
				{limpa(p.w)}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- ponte: "frase no tabuleiro"
// bloco curto de 2 a 4 palavras numa linha; a falada em branco cheio, as outras em branco 55%; uma barrinha fina por
// baixo corre sob o que já foi dito (o tabuleiro); o bloco troca na pausa da fala (montar.py)
const PalavrasTabuleiro: React.FC<{palavras: Palavra[]; blocos: Bloco[]}> = ({palavras, blocos}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	const b = blocos.find((x) => t >= x.de && t < x.ate);
	if (!b) return null;
	const entra = spring({frame: f - Math.round(b.de * fps), fps, config: {damping: 16, stiffness: 280, mass: 0.5}});
	const ws = palavras.slice(b.i0, b.i1 + 1);
	const letras = ws.reduce((n, w) => n + limpa(w.w).length, 0) + ws.length - 1;
	const tam = letras > 26 ? 54 : letras > 20 ? 62 : 70;
	let atual = -1;
	ws.forEach((w, i) => {
		if (t >= w.de) atual = i;
	});
	return (
		<div style={{position: 'absolute', left: 40, right: 40, top: 1920 * 0.715, display: 'flex', justifyContent: 'center', opacity: entra, transform: `translateY(${(1 - entra) * 14}px)`}}>
			<div style={{display: 'flex', gap: '0.32em', fontFamily, fontWeight: 700, fontSize: tam, lineHeight: 1, whiteSpace: 'nowrap'}}>
				{ws.map((w, i) => {
					const cor = w.termo ? AMARELO : BRANCO;
					const corre = i < atual ? 1 : i > atual ? 0 : interpolate(t, [w.de, Math.max(w.de + 0.08, w.ate)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return (
						<div key={i} style={{position: 'relative', paddingBottom: 14}}>
							<div style={{color: i === atual ? cor : (w.termo ? 'rgba(255,216,77,0.55)' : 'rgba(255,255,255,0.55)'), textShadow: contorno(4), textTransform: 'capitalize'}}>{limpa(w.w)}</div>
							<div style={{position: 'absolute', left: 0, bottom: 0, height: 5, borderRadius: 3, width: `${(corre * 100).toFixed(1)}%`, background: cor, opacity: corre > 0 ? 0.9 : 0, boxShadow: `0 0 0 1.5px ${CONTORNO}`}} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- avião: "letreiro de aeroporto"
// cada letra numa plaquinha escura arredondada que gira (split-flap) por ~0,12 s até parar na letra certa; só a palavra
// atual, nunca o painel inteiro
const GIRO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const PalavraLetreiro: React.FC<{palavras: Palavra[]}> = ({palavras}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	const idx = palavras.findIndex((x) => t >= x.de && t < x.ate);
	if (idx < 0) return null;
	const p = palavras[idx];
	const letras = Array.from(limpa(p.w).replace(/[.!?…]+$/, '').toUpperCase());
	const tam = letras.length > 13 ? 56 : letras.length > 10 ? 64 : 72;
	const df = f - Math.round(p.de * fps);
	return (
		<div style={{position: 'absolute', left: 30, right: 30, top: 1920 * 0.715, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', gap: Math.round(tam * 0.09), fontFamily, fontWeight: 700, fontSize: tam, lineHeight: 1}}>
				{letras.map((c, i) => {
					const para = (p.ate - p.de) < 0.2 ? 1 : 2 + (i >= 6 ? 1 : 0); // ~0,07-0,1 s: só o 1º quadro mostra letra trocada; palavra curta só bate a aba
					const girando = df < para && /[A-Z0-9À-Ü]/.test(c);
					const mostra = girando && df === 0 && para > 1 ? GIRO[(idx * 7 + i * 5) % GIRO.length] : c; // letra errada só no 1º quadro, depois a certa batendo
					const aba = girando ? (df % 2 === 0 ? 0.55 : 0.8) : 1; // a aba de cima batendo
					return (
						<div
							key={i}
							style={{
								position: 'relative',
								width: tam * 0.74,
								height: tam * 1.22,
								borderRadius: tam * 0.12,
								background: 'rgba(20,23,30,0.9)',
								boxShadow: '0 3px 8px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: p.termo ? AMARELO : '#F4F1E8',
								overflow: 'hidden',
							}}
						>
							<span style={{transform: `scaleY(${aba})`}}>{mostra}</span>
							<div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: 'rgba(0,0,0,0.55)'}} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

const Rotulo: React.FC<{termos: Termo[]}> = ({termos}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	const tm = termos.find((x) => t >= x.de - 0.05 && t < x.ate + 0.25);
	if (!tm) return null;
	const entra = spring({frame: f - Math.round(tm.de * fps), fps, config: {damping: 11, stiffness: 220, mass: 0.7}});
	const sai = interpolate(t, [tm.ate, tm.ate + 0.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
	const tam = tm.texto.length > 18 ? 66 : tm.texto.length > 12 ? 76 : 90;
	return (
		<div style={{position: 'absolute', left: 60, right: 60, top: 1920 * 0.13, display: 'flex', justifyContent: 'center', opacity: 1 - sai}}>
			<div
				style={{
					fontFamily,
					fontWeight: 700,
					fontSize: tam,
					lineHeight: 1.05,
					textAlign: 'center',
					whiteSpace: 'pre-line', // "\n" no texto quebra a linha (tatuzão v3, 2026-11-13); sem "\n", igual a antes
					color: AMARELO,
					textShadow: contorno(5.5),
					transform: `rotate(-3deg) scale(${0.6 + 0.4 * entra}) translateY(${(1 - entra) * -30}px)`,
				}}
			>
				{tm.texto.includes(' ')
					? // palavras marcadas com U+2002 (tatuzão v3, 2026-11-13): a fonte comia o espaço; cada palavra vira um bloco
					  // com margem própria e cada "\n" uma linha. Texto sem a marca sai igual a antes.
					  tm.texto.split('\n').map((linha, i) => (
							<div key={i}>
								{linha.split(' ').map((w, j) => (
									<span key={j} style={{display: 'inline-block', margin: '0 0.16em'}}>
										{w}
									</span>
								))}
							</div>
					  ))
					: tm.texto}
			</div>
		</div>
	);
};

export const Explicativo: React.FC<Props> = (p) => {
	const {fps} = useVideoConfig();
	const total = Math.ceil(p.duracao * fps);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<OffthreadVideo src={staticFile(p.filme)} muted style={{width: '100%', height: '100%'}} />
			<Rotulo termos={p.termos} />
			{p.legenda === 'desembaca' ? (
				<PalavraDesembaca palavras={p.palavras} />
			) : p.legenda === 'tabuleiro' ? (
				<PalavrasTabuleiro palavras={p.palavras} blocos={p.blocos ?? []} />
			) : p.legenda === 'letreiro' ? (
				<PalavraLetreiro palavras={p.palavras} />
			) : (
				<PalavraAtual palavras={p.palavras} />
			)}
			<Audio src={staticFile(p.voz)} />
			<Audio
				src={staticFile(p.trilha.arquivo)}
				volume={(f) => p.trilha.volume * interpolate(f, [0, 15, total - 40, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
			{p.sons.map((s, i) => (
				<Sequence key={i} from={Math.max(0, Math.round(s.em * fps))} layout="none">
					<Audio src={staticFile(s.arquivo)} volume={s.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
