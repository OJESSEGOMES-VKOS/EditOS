// Tira fotos do vídeo sem renderizar ele inteiro, pra conferir antes de gastar
// o tempo do render. Sai uma folha com todos os quadros lado a lado, cada um
// com o segundo dele escrito.
//
// (de dentro de sistema/, pela trava: QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs ...)
//   node animacoes/ferramentas/fotos.mjs <video>              1 foto a cada 2 segundos, numa folha (<pasta>/fotos/)
//   node animacoes/ferramentas/fotos.mjs <video> --cada 1     1 foto por segundo
//   node animacoes/ferramentas/fotos.mjs <video> 3.5 12 20    fotos nesses segundos, em tamanho cheio
//   node animacoes/ferramentas/fotos.mjs --estilo giz         o exemplo de um estilo (animacoes/estilos/fotos/)
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {PUBLICO, RAIZ, SISTEMA, acharVideo, listarEstilos, navegador, opcoes, parar, registrarEstilos, registrarVideos, tmp} from './comum.mjs';

const {soltos, op} = opcoes();
registrarEstilos();
registrarVideos();

let id, saida;
if (op.estilo) {
  if (!listarEstilos().includes(op.estilo)) parar(`Não existe o estilo "${op.estilo}". Veja a lista em animacoes/estilos/INDICE.md.`);
  id = `estilo-${op.estilo}`;
  saida = path.join(RAIZ, 'estilos', 'fotos');
} else {
  const v = acharVideo(soltos.shift());
  if (!fs.existsSync(path.join(v.dir, 'video.tsx'))) parar(`O vídeo ${v.pasta} ainda não tem o video.tsx (as cenas).`);
  id = v.id;
  saida = path.join(v.dir, 'fotos');
}
fs.mkdirSync(saida, {recursive: true});
fs.mkdirSync(PUBLICO, {recursive: true});
process.env.TEMP = process.env.TMP = process.env.TMPDIR = tmp();

const comum = {browserExecutable: navegador(), logLevel: 'error'};

// o exemplo de um estilo é montado sozinho, sem os outros estilos nem os vídeos: um estilo com defeito
// não atrapalha a foto do outro
let entrada = path.join(RAIZ, 'src', 'index.ts');
if (op.estilo) {
  entrada = path.join(RAIZ, 'src', `.entrada-${op.estilo}.tsx`);
  fs.writeFileSync(
    entrada,
    `import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Exemplo} from './estilos/${op.estilo}';
import {FALA_EXEMPLO, FORMATOS, FPS} from './kit';
import {Folha, tamanhoDaFolha} from './kit/Folha';
registerRoot(() => (
  <>
    <Composition id="estilo-${op.estilo}" component={Exemplo} durationInFrames={Math.round(FALA_EXEMPLO.duracao * FPS)} fps={FPS} width={FORMATOS.vertical.largura} height={FORMATOS.vertical.altura} />
    <Composition id="folha" component={Folha} durationInFrames={1} fps={FPS} width={600} height={600} defaultProps={{fotos: [], colunas: 1, largura: 300, altura: 533}} calculateMetadata={({props}) => tamanhoDaFolha(props)} />
  </>
));
`
  );
}
const sobra = path.join(tmp(), `pacote-fotos-${id}`);
const limpar = () => {
  fs.rmSync(sobra, {recursive: true, force: true});
  if (op.estilo) fs.rmSync(entrada, {force: true});
};

let pacote;
try {
  pacote = await bundle({entryPoint: entrada, publicDir: PUBLICO, outDir: sobra});
} catch (e) {
  limpar();
  parar(`O código do vídeo tem um erro e não montou:\n${String(e.message || e).split('\n').slice(0, 14).join('\n')}`);
}
const comp = await selectComposition({serveUrl: pacote, id, ...comum}).catch((e) => parar(`Não achei "${id}" no motor: ${e.message}`));
const duracao = comp.durationInFrames / comp.fps;

const escolhidos = soltos.map(Number).filter(Number.isFinite);
const cada = parseFloat(op.cada) || 2;
const tempos = escolhidos.length
  ? escolhidos.map((t) => Math.min(t, duracao - 0.04))
  : Array.from({length: Math.max(1, Math.floor((duracao - 0.4) / cada) + 1)}, (_, i) => +Math.min(duracao - 0.1, 0.3 + i * cada).toFixed(2));
const nome = op.estilo || 'video';

if (escolhidos.length) {
  for (const t of tempos) {
    const destino = path.join(saida, `${nome}-${String(+t.toFixed(2)).replace('.', '_')}s.jpg`);
    await renderStill({composition: comp, serveUrl: pacote, output: destino, frame: Math.round(t * comp.fps), imageFormat: 'jpeg', jpegQuality: 90, ...comum});
    console.log(`✓ ${path.relative(SISTEMA, destino)}`);
  }
} else {
  // cada quadro pequeno, e a folha montada pelo próprio motor
  const lado = 300;
  const escala = lado / comp.width;
  const fotos = [];
  for (const [i, t] of tempos.entries()) {
    const arq = path.join(tmp(), `foto-${i}.jpg`);
    await renderStill({composition: comp, serveUrl: pacote, output: arq, frame: Math.round(t * comp.fps), imageFormat: 'jpeg', jpegQuality: 80, scale: escala, ...comum});
    fotos.push({t, src: `data:image/jpeg;base64,${fs.readFileSync(arq).toString('base64')}`});
    fs.rmSync(arq);
  }
  const props = {fotos, colunas: Math.min(fotos.length, 6), largura: lado, altura: Math.round(comp.height * escala)};
  const folha = await selectComposition({serveUrl: pacote, id: 'folha', inputProps: props, ...comum});
  const destino = path.join(saida, `${nome}-folha.jpg`);
  await renderStill({composition: folha, serveUrl: pacote, output: destino, inputProps: props, imageFormat: 'jpeg', jpegQuality: 85, ...comum});
  console.log(`✓ ${path.relative(SISTEMA, destino)}  (${fotos.length} fotos, uma a cada ${cada} s; o vídeo tem ${duracao.toFixed(1)} s)`);
}
limpar();
