// Fotos de conferência.  node scripts/quadros.mjs [--previas] [--fundo real|desfoque|recorte] [--pb] 1 13.8 ...  -> conferencia/q_1.00.png (ESCALA=1 para tamanho cheio)
// G6: o fundo vem real, como no render; --fundo recorte pede public/fala_grade.mp4, --fundo desfoque o fala_desfoque.mp4. NOMES=a,b troca os nomes das prévias.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const previas = args.includes('--previas');
const iF = args.indexOf('--fundo');
const fundo = iF >= 0 ? args.splice(iF, 2)[1] : 'real';
const pb = args.includes('--pb');
const tempos = args.filter((a) => !a.startsWith('--')).map(Number);
fs.mkdirSync('conferencia', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const props = {previas, nomesPrevias: (process.env.NOMES || 'rosto-telas,autoridade').split(','), musica: false, fundo, pb};
const comp = await selectComposition({serveUrl: serve, id: 'VitrineStoryPodcast01', inputProps: props});
for (const t of tempos) {
	const out = `conferencia/q_${t.toFixed(2)}${previas ? '_previas' : ''}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
