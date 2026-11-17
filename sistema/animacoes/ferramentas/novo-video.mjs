// Cria a pasta de um vídeo de animação novo na oficina do EditOS, com o roteiro em branco pra preencher.
//
//   node animacoes/ferramentas/novo-video.mjs <nome-curto> --estilo giz [--formato vertical|horizontal|quadrado]
//   (de dentro de sistema/) -> sistema/oficina/<AAAA-MM-DD>-<nome-curto>/roteiro.md
//
// Depois: preencher o roteiro.md, rodar a voz (voz.mjs) e escrever as cenas (video.tsx).
import fs from 'node:fs';
import path from 'node:path';
import {OFICINA, listarEstilos, opcoes, parar} from './comum.mjs';

const {soltos, op} = opcoes();
const nome = (soltos[0] || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
if (!nome) parar('Dê um nome curto pro vídeo. Ex.: node animacoes/ferramentas/novo-video.mjs como-o-aviao-voa --estilo giz');

const estilos = listarEstilos();
const estilo = op.estilo || 'giz';
if (!estilos.includes(estilo)) parar(`Não existe o estilo "${estilo}". Os que existem: ${estilos.join(', ')}.`);
const formato = op.formato || 'vertical';
if (!['vertical', 'horizontal', 'quadrado'].includes(formato)) parar('O formato é vertical, horizontal ou quadrado.');

const hoje = new Date().toISOString().slice(0, 10);
const pasta = `${hoje}-${nome}`;
const dir = path.join(OFICINA, pasta);
if (fs.existsSync(dir)) parar(`Já existe um vídeo com esse nome hoje: oficina/${pasta}/. Escolha outro nome.`);
fs.mkdirSync(dir, {recursive: true});

fs.writeFileSync(
  path.join(dir, 'roteiro.md'),
  `# ${soltos[0]}

- **Estilo:** ${estilo}
- **Formato:** ${formato}

## Ideia

<!-- Em uma ou duas linhas: o que a pessoa vai entender ou sentir no fim do vídeo. -->

## Fala

<!-- Uma frase por linha. É o que será narrado (ou lido na legenda, se o vídeo for sem voz).
     A primeira frase é o gancho: precisa prender em 2 segundos. -->

## Cenas

<!-- Uma linha por cena: quais frases ela cobre (contando do 0) e o que a tela mostra.
     A tela ilustra o que a frase diz, e muda quando o assunto muda. -->

| Cena | Frases | O que a tela mostra |
|---|---|---|
| 1 | 0 | |
`
);

console.log(`✓ oficina/${pasta}/roteiro.md criado (estilo ${estilo}, formato ${formato}).`);
console.log(`  Leia a skill anim-${estilo} e a ficha animacoes/src/estilos/${estilo}/ficha.md antes das cenas.`);
console.log(`  Próximo passo: preencher o roteiro e rodar  node animacoes/ferramentas/voz.mjs ${pasta}`);
