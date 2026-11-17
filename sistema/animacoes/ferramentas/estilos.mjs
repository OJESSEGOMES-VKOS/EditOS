// Refaz o catálogo de estilos (estilos/INDICE.md) a partir da ficha de cada
// estilo, e a lista que o motor enxerga. Rode depois de criar ou mexer num estilo.
//
//   node animacoes/ferramentas/estilos.mjs   (de dentro de sistema/)
import fs from 'node:fs';
import path from 'node:path';
import {RAIZ, listarEstilos, registrarEstilos} from './comum.mjs';

const ids = registrarEstilos();
const linhas = [];
const semFicha = [];
// o 3D completo não é um estilo do motor: mora em blender/, mas entra no catálogo
const fichas = [...ids.map((id) => [id, path.join(RAIZ, 'src', 'estilos', id, 'ficha.md')]), ['3d-bloquinho', path.join(RAIZ, 'blender', 'ficha.md')]];
for (const [id, arq] of fichas) {
  if (!fs.existsSync(arq)) {
    if (id !== '3d-bloquinho') semFicha.push(id);
    continue;
  }
  const txt = fs.readFileSync(arq, 'utf8');
  const nome = (txt.match(/^#\s+(.+)$/m) || [, id])[1].trim();
  const campo = (rotulo) => ((txt.match(new RegExp(`^\\*\\*${rotulo}:\\*\\*\\s*(.+)$`, 'm')) || [, ''])[1] || '').trim();
  linhas.push(`| \`${id}\` | ${nome} | ${campo('Tipo')} | ${campo('Cara')} | ${campo('Bom pra')} |`);
}

const md = `# Os estilos de animação do EditOS

${linhas.length} estilos. Cada um tem a ficha completa em \`src/estilos/<id>/ficha.md\`, o código em
\`src/estilos/<id>/index.tsx\` e um exemplo que conta a mesma história curta (o ciclo da água), pra dar pra
comparar um com o outro.

Cada estilo tem uma skill: \`.claude/skills/anim-<id>/SKILL.md\` (na raiz do EditOS). O caminho de um vídeo está em
\`animacoes/LEIA.md\`.

Pra ver um estilo (de dentro de \`sistema/\`, pela trava): \`QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs --estilo <id>\`
(folha de fotos) ou \`... node animacoes/ferramentas/render.mjs --estilo <id>\` (o vídeo do exemplo).

**Tipo:** 2D é desenho plano. 3D leve tem profundidade e sai direto do motor, sem programa extra. 3D Blender é 3D
completo e precisa do Blender instalado (só no computador).

| id | Nome | Tipo | Cara | Bom pra |
|---|---|---|---|---|
${linhas.join('\n')}
`;
fs.writeFileSync(path.join(RAIZ, 'estilos', 'INDICE.md'), md);
console.log(`✓ animacoes/estilos/INDICE.md com ${linhas.length} estilos.`);
if (semFicha.length) console.log(`  Sem ficha.md (ficaram fora do catálogo): ${semFicha.join(', ')}`);
if (listarEstilos().length !== ids.length) console.log('  Atenção: há pasta de estilo sem index.tsx.');
