// corte-palestra: fotos de conferência.  node scripts/quadros.mjs 1 13.9 ... -> conferencia/q_1.00.png (ESCALA=1 para tamanho cheio)
// pesado: rode pela trava (QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs ...)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const tempos = process.argv.slice(2).map(Number);
fs.mkdirSync('conferencia', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl: serve, id: 'CortePalestra', inputProps: {}});
for (const t of tempos) {
	const out = `conferencia/q_${t.toFixed(2)}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: {}, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
