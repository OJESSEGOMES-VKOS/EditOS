// O Escritório da EditOS Online em 3/4 (top-down inclinado, como jogo): parede de fundo vista de frente, piso visto
// de cima, móveis com tampo e frente, sombra no chão e personagens de corpo inteiro. Tudo pintado num canvas pequeno
// (cada ponto é um pixel do jogo) que a página amplia sem borrar. Uma sala por projeto; a primeira é a de produção.

export type SalaMapa = { nome: string; cor: string; producao?: boolean; ativa?: boolean; pilhas?: { cor: string; n: number }[] };
type Caixa = { x: number; y: number; w: number; h: number; barra: { x: number; y: number; w: number; h: number } };

const K = '#241a33'; // contorno
const MADEIRA = { w: '#b57a4c', W: '#8e5a36', v: '#6b4128', h: '#d39a66' };
const TEMAS = {
  noite: {
    topo: '#4a3d75', topoLuz: '#5d4f8f', face: '#3b3160', faceListra: '#362c58', rodape: '#22193a',
    piso: '#5a4568', pisoLinha: '#4d3a5a', pisoLuz: '#634d72', corredor: '#3a3552', corredor2: '#35304b',
    pedra: '#433d5e', pedra2: '#3d3756', ceu: '#1b2d5c', ceu2: '#24387a', astro: '#fff3d6',
    sombra: 'rgba(5, 3, 15, .38)', escuro: 'rgba(8, 5, 25, .22)', luz: 'rgba(255, 214, 140, .16)', tela: 'rgba(125, 200, 255, .28)',
  },
  dia: {
    topo: '#8a7aa6', topoLuz: '#a597bf', face: '#f3e6d8', faceListra: '#ecdccb', rodape: '#a8835f',
    piso: '#e3c49c', pisoLinha: '#d4b088', pisoLuz: '#ecd2ae', corredor: '#d9d4e3', corredor2: '#cfc9dc',
    pedra: '#e4e0ec', pedra2: '#d9d4e3', ceu: '#a9d4fb', ceu2: '#c7e4ff', astro: '#ffffff',
    sombra: 'rgba(60, 40, 80, .2)', escuro: 'rgba(0, 0, 0, 0)', luz: 'rgba(255, 220, 150, .22)', tela: 'rgba(90, 170, 255, .22)',
  },
};
type Tema = typeof TEMAS.noite;

// medidas da planta (em pixels do jogo)
const CAP = 6, FACE = 20, RW = 112, RH = 88, CORR = 26, LW = 100;

let ctx: CanvasRenderingContext2D;
const R = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

// sprite em texto: cada letra é uma cor da paleta; ponto é transparente
function spr(linhas: string[], pal: Record<string, string>, x: number, y: number) {
  linhas.forEach((l, j) => { for (let i = 0; i < l.length; i++) { const c = pal[l[i]]; if (c) R(x + i, y + j, 1, 1, c); } });
}
// móvel em 3/4: tampo (visto de cima) e frente (vista de frente), com contorno
function caixa3(x: number, y: number, w: number, d: number, h: number, tampo: string, luz: string, frente: string, baixo: string) {
  R(x - 1, y - 1, w + 2, d + h + 2, K);
  R(x, y, w, d, tampo); R(x, y, w, 1, luz);
  R(x, y + d, w, h, frente); R(x, y + d, w, 1, baixo); R(x, y + d + h - 1, w, 1, baixo);
}
const sombra = (t: Tema, x: number, y: number, w: number, h = 3) => { R(x + 1, y, w, h, t.sombra); R(x, y + 1, w + 2, h - 2, t.sombra); };

function hash(s: string) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
function misturar(a: string, b: string, f: number) {
  const ca = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), cb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + ca.map((v, i) => Math.round(v * f + cb[i] * (1 - f)).toString(16).padStart(2, '0')).join('');
}
function escurecer(hex: string, f: number) {
  const n = [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * f));
  return `rgb(${n.join(',')})`;
}

// ── o personagem: um bichinho de corpo inteiro, cor e acessório pelo nome do projeto ──
const CORPO = [
  '....kkkkkk....',
  '..kkxxxxxxkk..',
  '.kxxnnxxxxxxk.',
  '.kxnxxxxxxxxk.',
  'kxxxxxxxxxxxXk',
  'kxxenxxxxenxXk',
  'kxxeexxxxeexXk',
  'kxqxxxooxxxqXk',
  'kxxxxxxxxxxxXk',
  '.kXxxxxxxxxXk.',
  '..kkkkkkkkkk..',
  '.kttttttttttk.',
  'kttTttttttTttk',
  'kttTttttttTttk',
  'kttTttttttTttk',
  'kkkkkkkkkkkkkk',
];
const OLHO_FECHADO = ['kxxxxxxxxxxxXk', 'kxxeexxxxeexXk'];
const ACESSORIOS: (string[] | null)[] = [
  ['..kk......kk..', '.kxxk....kxxk.', '.kxqxk..kxqxk.'], // orelhas
  ['.....kyyk.....', '.....kyyk.....', '......kk......'], // antena
  ['......kk......', '.....kXXk.....'], // topete
  null, // fone (desenhado à parte)
  ['....kkkkkk....', '..kkccccccck..', '.kccccccccccccc'], // boné
];
function bichinho(x: number, y: number, nome: string, cor: string, olhosFechados: boolean, quadro: number) {
  const h = hash(nome), aces = h % 5;
  const pal = { k: K, x: cor, X: escurecer(cor, 0.78), n: '#ffffff', e: K, q: '#ff8fa3', o: '#7a2e3a', t: escurecer(cor, 0.55), T: escurecer(cor, 0.45), y: '#ffd36b', c: ['#e26d5a', '#5b9cff', '#6fdcaa'][h % 3] };
  const dy = quadro % 2; // respira/digita
  const corpo = olhosFechados ? CORPO.map((l, i) => (i === 5 ? OLHO_FECHADO[0] : i === 6 ? OLHO_FECHADO[1] : l)) : CORPO;
  spr(corpo.slice(11), pal, x, y + 11);
  spr(corpo.slice(0, 11), pal, x, y + dy);
  if (aces === 3) { R(x + 2, y - 1 + dy, 10, 1, K); R(x + 3, y - 2 + dy, 8, 1, K); R(x - 1, y + 4 + dy, 3, 5, K); R(x + 12, y + 4 + dy, 3, 5, K); R(x, y + 5 + dy, 1, 3, '#5b9cff'); R(x + 13, y + 5 + dy, 1, 3, '#5b9cff'); }
  else if (ACESSORIOS[aces]) spr(ACESSORIOS[aces]!, pal, x, y - ACESSORIOS[aces]!.length + (aces === 4 ? 3 : 0) + dy);
}

// ── peças ──
const PLANTA = [
  '....kk..kk..', '...kllk.kllk', '..kllLkkLllk', '.kllLllllLlk', 'kllLLllLlLlk', 'klLllLLllLLk',
  '.kLllLlldLk.', '..kLdLLdLk..', '...kkLLkk...', '....kppk....', '...kpPppk...', '...kpPppk...', '...kpppPk...', '....kkkk....',
];
const PAL_PLANTA = { k: K, l: '#5fb877', L: '#3f8a56', d: '#2c6a40', p: '#c46a4a', P: '#94472f' };
function planta(t: Tema, x: number, y: number) { sombra(t, x + 2, y + 13, 8); spr(PLANTA, PAL_PLANTA, x, y); }

function estante(t: Tema, x: number, y: number, semente: number) {
  sombra(t, x, y + 34, 20);
  R(x - 1, y - 1, 22, 36, K); R(x, y, 20, 34, MADEIRA.W); R(x, y, 20, 2, MADEIRA.h);
  const livros = ['#e26d5a', '#5b9cff', '#ffc15e', '#6fdcaa', '#c9a6ff', '#ff9ccb', '#f4f1fa'];
  for (let prat = 0; prat < 3; prat++) {
    const py = y + 3 + prat * 10;
    R(x + 1, py, 18, 8, MADEIRA.v);
    let bx = x + 2;
    for (let b = 0; bx < x + 17; b++) {
      const s = (semente + prat * 7 + b * 13) % 97, larg = 2 + (s % 2), alt = 5 + (s % 3);
      if (s % 11 === 0) { bx += 2; continue; }
      R(bx, py + 8 - alt, larg, alt, livros[s % livros.length]); R(bx, py + 8 - alt, larg, 1, 'rgba(255,255,255,.35)');
      bx += larg + (s % 5 === 0 ? 1 : 0);
    }
    R(x, py + 8, 20, 2, MADEIRA.w);
  }
}

function janela(t: Tema, x: number, y: number, noite: boolean) {
  R(x - 1, y - 1, 24, 16, K); R(x, y, 22, 14, '#f4f1fa');
  R(x + 1, y + 1, 20, 12, t.ceu); R(x + 1, y + 1, 20, 4, t.ceu2);
  if (noite) { R(x + 15, y + 3, 3, 3, t.astro); R(x + 5, y + 7, 1, 1, t.astro); R(x + 9, y + 3, 1, 1, t.astro); }
  else { R(x + 4, y + 7, 7, 2, t.astro); R(x + 6, y + 6, 4, 1, t.astro); }
  R(x + 10, y + 1, 2, 12, '#f4f1fa'); R(x + 1, y + 6, 20, 1, '#f4f1fa');
  R(x - 2, y + 14, 26, 2, MADEIRA.w); R(x - 2, y + 15, 26, 1, MADEIRA.v); // parapeito
}

function quadroParede(x: number, y: number, cor: string) {
  R(x - 1, y - 1, 14, 14, K); R(x, y, 12, 12, '#f4f1fa'); R(x + 1, y + 1, 10, 10, cor);
  R(x + 3, y + 4, 6, 1, '#ffffff'); R(x + 3, y + 6, 4, 1, '#ffffff'); R(x + 3, y + 8, 5, 1, 'rgba(255,255,255,.6)');
}
function relogio(x: number, y: number) {
  spr(['..kkk..', '.knnnk.', 'knnknnk', 'knnkkk.', 'knnnnnk', '.knnnk.', '..kkk..'].map((l) => l.padEnd(7, '.')), { k: K, n: '#f4f1fa' }, x, y);
}
function abajur(x: number, y: number, acesa: boolean, t: Tema) {
  if (acesa) { R(x - 6, y - 2, 18, 12, t.luz); R(x - 3, y - 4, 12, 16, t.luz); }
  spr(['..kkkk..', '.kyyyyk.', 'kyyyyyyk', 'kkkkkkkk', '...km...', '...km...', '..kmmk..'], { k: K, y: acesa ? '#ffe08a' : '#d9b860', m: '#6e6487' }, x, y);
}
function caneca(x: number, y: number) { spr(['kkkk.', 'knnkk', 'knnk.k'.slice(0, 5), 'knnkk', '.kk..'], { k: K, n: '#f4f1fa' }, x, y); R(x + 1, y + 1, 2, 1, '#8e5a36'); }
function papeis(x: number, y: number) { R(x - 1, y - 1, 10, 6, K); R(x, y, 8, 4, '#f4f1fa'); R(x + 1, y + 1, 5, 1, '#c9c1d6'); R(x + 1, y + 3, 4, 1, '#c9c1d6'); }
function lixeira(t: Tema, x: number, y: number) { sombra(t, x, y + 8, 6); spr(['kkkkkk', 'kmmmmk', 'kMmMmk', 'kMmMmk', 'kMmMmk', 'kMmMmk', 'kkkkkk'], { k: K, m: '#8a86a0', M: '#6e6487' }, x, y + 1); }

function tapete(x: number, y: number, w: number, h: number, cor: string) {
  R(x - 1, y - 1, w + 2, h + 2, K); R(x, y, w, h, cor);
  R(x + 2, y + 2, w - 4, h - 4, escurecer(cor, 0.85)); R(x + 3, y + 3, w - 6, h - 6, cor);
  for (let i = 3; i < w - 3; i += 4) { R(x + i, y + 3, 2, 1, '#ffffff55'); R(x + i, y + h - 4, 2, 1, '#ffffff55'); }
  for (let i = 1; i < w; i += 3) { R(x + i, y - 2, 1, 1, cor); R(x + i, y + h + 1, 1, 1, cor); } // franja
}

function cadeiraCostas(x: number, y: number, cor: string) {
  R(x - 1, y - 1, 22, 15, K); R(x, y, 20, 13, cor); R(x + 1, y + 1, 18, 2, escurecer(cor, 1.15).replace('rgb', 'rgb'));
  R(x + 2, y + 4, 16, 1, escurecer(cor, 0.8));
}

function balao(x: number, y: number, quadro: number) {
  spr(['.kkkkkkkk.', 'knnnnnnnnk', 'knnnnnnnnk', 'knnnnnnnnk', '.kkknnkkk.', '....kk....'], { k: K, n: '#ffffff' }, x, y);
  for (let i = 0; i <= quadro % 3; i++) R(x + 2 + i * 2, y + 2, 1, 1, K);
}
function zz(x: number, y: number, quadro: number, t: Tema) {
  const c = t === TEMAS.dia ? '#6e6487' : '#d2c9de', o = quadro % 2;
  spr(['zzz', '.z.', 'zzz'], { z: c }, x, y + o); spr(['zz', 'z.', 'zz'].map((l) => l.replace('z.', '.z')), { z: c }, x + 5, y - 4 + o);
}

// ── a sala de um projeto ──
function salaProjeto(t: Tema, s: SalaMapa, rx: number, ry: number, quadro: number, noite: boolean, portaEmCima: boolean) {
  const fy = ry + FACE, h = hash(s.nome);
  quadroParede(rx + 30, ry + 4, s.cor);
  relogio(rx + 45, ry + 5);
  janela(t, rx + 57, ry + 2, noite);
  tapete(rx + 32, fy + 38, 48, 20, misturar(s.cor, t.piso, 0.55));
  estante(t, rx + 5, ry + 8, h);
  if (!portaEmCima) planta(t, rx + 96, fy - 4);
  // mesa de trabalho com o personagem atrás, de frente pra gente
  cadeiraCostas(rx + 46, fy + 4, escurecer(s.cor, 0.6));
  bichinho(rx + 49, fy + 2, s.nome, s.cor, !s.ativa, s.ativa ? quadro : Math.floor(quadro / 2));
  sombra(t, rx + 32, fy + 31, 50, 4);
  caixa3(rx + 32, fy + 16, 50, 10, 12, MADEIRA.w, MADEIRA.h, MADEIRA.W, MADEIRA.v);
  R(rx + 38, fy + 30, 8, 1, MADEIRA.v); R(rx + 68, fy + 30, 8, 1, MADEIRA.v); // gavetas
  R(rx + 41, fy + 31, 2, 1, '#e8c9a0'); R(rx + 71, fy + 31, 2, 1, '#e8c9a0');
  // notebook visto por trás, tela pra pessoa
  if (s.ativa) { R(rx + 46, fy + 2, 20, 14, t.tela); R(rx + 64, fy + 8, 14, 10, t.tela); }
  R(rx + 66, fy + 8, 14, 10, K); R(rx + 67, fy + 9, 12, 8, '#8a86a0'); R(rx + 67, fy + 9, 12, 1, '#b4b0c8');
  R(rx + 72, fy + 12, 2, 2, s.ativa ? '#bfe0ff' : '#6e6487');
  R(rx + 64, fy + 17, 18, 2, K); R(rx + 65, fy + 17, 16, 1, '#b4b0c8'); // base do notebook
  abajur(rx + 35, fy + 9, !!s.ativa || noite, t);
  caneca(rx + 40, fy + 19);
  papeis(rx + 48, fy + 21);
  lixeira(t, rx + 88, fy + 26);
  planta(t, rx + 6, fy + 50);
  // pufe
  sombra(t, rx + 90, fy + 58, 12);
  spr(['..kkkkkkkk..', '.kccccccccck', 'kcCccccccccck'.slice(0, 12), 'kccccccccccck'.slice(0, 12), 'kCCCCCCCCCCk', '.kkkkkkkkkk.'], { k: K, c: escurecer(s.cor, 0.95), C: escurecer(s.cor, 0.7) }, rx + 90, fy + 50);
  if (s.ativa) balao(rx + 64, fy - 8, quadro); else zz(rx + 64, fy - 1, quadro, t);
}

function salaProducao(t: Tema, s: SalaMapa, rx: number, ry: number, quadro: number, noite: boolean) {
  const fy = ry + FACE;
  // quadro branco de produção: uma coluna por etapa, um post-it por vídeo (até 6)
  R(rx + 13, ry + 1, 86, 18, K); R(rx + 14, ry + 2, 84, 16, '#f4f1fa'); R(rx + 14, ry + 17, 84, 1, '#c9c1d6');
  (s.pilhas ?? []).forEach((p, i) => {
    const cx = rx + 17 + i * 16;
    R(cx, ry + 3, 13, 2, p.cor);
    for (let j = 0; j < Math.min(6, p.n); j++) R(cx + (j % 2) * 7, ry + 6 + Math.floor(j / 2) * 4, 5, 3, p.cor);
  });
  R(rx + 40, ry + 19, 30, 2, '#8a86a0'); // aparador de canetas
  planta(t, rx + 4, fy - 4);
  // bebedouro
  sombra(t, rx + 96, fy + 22, 10);
  spr(['..kkkk..', '.kbbbbk.', '.kbBbbk.', '.kbbbbk.', '..kkkk..', 'kkkkkkkk', 'knnnnnnk', 'knrnnbnk', 'knnnnnnk', 'knnnnnnk', 'knnnnnnk', 'kkkkkkkk'], { k: K, b: '#9fd4ff', B: '#d6efff', n: '#e9e6f2', r: '#e26d5a' }, rx + 96, fy + 10);
  // mesa de reunião com cadeiras dos dois lados
  for (const cx of [rx + 34, rx + 52, rx + 70]) cadeiraCostas(cx, fy + 12, '#5a6aa8');
  sombra(t, rx + 24, fy + 46, 64, 4);
  caixa3(rx + 24, fy + 22, 64, 18, 8, MADEIRA.w, MADEIRA.h, MADEIRA.W, MADEIRA.v);
  papeis(rx + 30, fy + 26); papeis(rx + 66, fy + 30);
  R(rx + 46, fy + 25, 14, 9, K); R(rx + 47, fy + 26, 12, 7, s.ativa ? '#9fd4ff' : '#3c4a6a'); // notebook aberto
  caneca(rx + 80, fy + 25);
  for (const cx of [rx + 34, rx + 52, rx + 70]) { sombra(t, cx, fy + 63, 20); cadeiraCostas(cx, fy + 50, '#5a6aa8'); }
  if (s.ativa) balao(rx + 92, fy - 6, quadro);
}

function salaLivre(t: Tema, rx: number, ry: number) {
  const fy = ry + FACE;
  for (const [x, y] of [[rx + 30, fy + 20], [rx + 44, fy + 22], [rx + 37, fy + 10]]) { sombra(t, x, y + 15, 12); caixa3(x, y, 12, 4, 10, '#d9a86b', '#e8c08a', '#b5824e', '#8e5a36'); R(x + 5, y, 2, 4, '#c9c1d6'); }
  planta(t, rx + 90, fy + 40);
}

// ── a recepção da empresa ──
function recepcao(t: Tema, lx: number, ly: number, altura: number, corr: number, quadro: number, noite: boolean) {
  const fy = ly + FACE;
  // letreiro EditOS na parede
  R(lx + 33, ly + 1, 34, 18, K); R(lx + 34, ly + 2, 32, 16, '#ffb84d'); R(lx + 34, ly + 2, 32, 1, '#ffd38a');
  spr(['kkkkkkkkk', 'kkkkkkkkk', 'kkk......', 'kkk......', 'kkkkkkk..', 'kkkkkkk..', 'kkk......', 'kkk......', 'kkkkkkkkk', 'kkkkkkkkk'], { k: '#2a1708' }, lx + 38, ly + 5);
  for (let i = 0; i < 3; i++) R(lx + 51 + i * 4, ly + 9, 2, 6, '#2a1708');
  janela(t, lx + 6, ly + 2, noite); relogio(lx + 82, ly + 5);
  // balcão com a recepcionista (o mascote da casa)
  bichinho(lx + 43, fy + 3, 'editos', '#ffb84d', false, quadro);
  sombra(t, lx + 20, fy + 29, 60, 4);
  caixa3(lx + 20, fy + 14, 60, 8, 14, '#f4f1fa', '#ffffff', '#5b4a6e', '#3a2f52');
  R(lx + 20, fy + 27, 60, 2, '#ffb84d');
  R(lx + 26, fy + 10, 10, 6, K); R(lx + 27, fy + 11, 8, 4, '#3c4a6a');
  caneca(lx + 66, fy + 14);
  planta(t, lx + 4, fy + 2); planta(t, lx + 84, fy + 2);
  // sala de espera: sofá e mesinha
  const sy = corr + CORR + 30;
  if (sy + 30 < ly + altura) {
    sombra(t, lx + 24, sy + 18, 48, 4);
    caixa3(lx + 24, sy, 48, 3, 9, '#8c6bb1', '#a284c4', '#6f4c94', '#5a3d7a');
    caixa3(lx + 22, sy + 10, 52, 6, 5, '#a284c4', '#bba1d6', '#6f4c94', '#5a3d7a');
    caixa3(lx + 20, sy + 4, 4, 8, 9, '#8c6bb1', '#a284c4', '#6f4c94', '#5a3d7a'); caixa3(lx + 72, sy + 4, 4, 8, 9, '#8c6bb1', '#a284c4', '#6f4c94', '#5a3d7a');
    sombra(t, lx + 34, sy + 38, 28, 3);
    caixa3(lx + 34, sy + 28, 28, 6, 4, MADEIRA.w, MADEIRA.h, MADEIRA.W, MADEIRA.v);
    R(lx + 38, sy + 29, 8, 4, '#e26d5a'); R(lx + 39, sy + 30, 6, 1, '#ffffff');
    planta(t, lx + 4, sy + 6); planta(t, lx + 84, sy + 6);
  }
}

// ── a planta inteira ──
// cada cômodo é um bloco solto, com parede própria e sombra, separado dos outros por um vão vazio
const VAO = 12, MARGEM = 6, BARRA = 18; // BARRA: a faixa de informação do lado de fora de cada sala
function bloco(t: Tema, x: number, y: number, w: number, h: number) {
  R(x + 3, y + h + 1, w, 4, t.sombra); // sombra no "chão" do vão
  R(x - 1, y - 1, w + 2, h + 2, K);
  R(x, y, w, h, t.topo);
  R(x, y, w, 1, t.topoLuz); R(x, y, 1, h, t.topoLuz);
}
function paredeFundo(t: Tema, x: number, y: number, w: number) {
  R(x, y, w, FACE, t.face);
  for (let xx = x; xx < x + w; xx += 6) R(xx, y, 3, FACE - 2, t.faceListra);
  R(x, y + FACE - 2, w, 2, t.rodape);
}
// vão de porta numa parede vista de cima (a parede do bloco), mostrando o piso de dentro
function portaNaParede(x: number, y: number, w: number, h: number, piso: string) {
  R(x - 1, y, w + 2, h, K); R(x, y, w, h, piso);
}

export function desenharPlanta(tela: HTMLCanvasElement, salas: SalaMapa[], tema: string, quadro: number) {
  const t: Tema = (TEMAS as Record<string, Tema>)[tema] ?? TEMAS.noite, noite = tema !== 'dia';
  const n = salas.length, cols = Math.min(4, Math.max(1, Math.ceil(n / 2))), linhas = Math.ceil(n / cols);
  const BW = RW + CAP * 2, BH = RH + CAP * 2, CH = CORR + CAP * 2, LBW = LW + CAP * 2;
  // fileiras: pares de salas com um corredor no meio; tudo separado por vãos
  const linhaY: number[] = [], corrY: number[] = [];
  // a barra de cada sala fica do lado de fora, longe do corredor: em cima nas fileiras de cima, embaixo nas de baixo
  let y = MARGEM;
  for (let r = 0; r < linhas; r++) {
    if (r % 2 === 0) y += BARRA;
    linhaY[r] = y; y += BH;
    if (r % 2 === 1) y += BARRA;
    y += VAO;
    if (r % 2 === 0) { corrY.push(y); y += CH + VAO; }
  }
  const X0 = MARGEM + LBW + VAO, larguraSalas = cols * (BW + VAO) - VAO;
  const W = X0 + larguraSalas + MARGEM, H = y - VAO + MARGEM;
  tela.width = W; tela.height = H;
  ctx = tela.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, W, H);

  // recepção: um bloco alto à esquerda, com a porta da rua e a porta pro corredor
  const lbx = MARGEM, lby = linhaY[0], lbh = linhaY[linhas - 1] + BH - lby;
  bloco(t, lbx, lby, LBW, lbh);
  const lx = lbx + CAP, ly = lby + CAP, alturaLobby = lbh - CAP * 2;
  paredeFundo(t, lx, ly, LW);
  R(lx, ly + FACE, LW, alturaLobby - FACE, t.pedra);
  for (let yy = ly + FACE; yy < ly + alturaLobby; yy += 10) for (let xx = lx + ((yy / 10) % 2 ? 5 : 0); xx < lx + LW; xx += 10) R(xx, yy, Math.min(5, lx + LW - xx), Math.min(5, ly + alturaLobby - yy), t.pedra2);
  const c0 = corrY[0] + CAP; // piso do primeiro corredor
  portaNaParede(lbx, c0 + 4, CAP, CORR - 8, t.pedra); R(lx, c0 + 7, 6, CORR - 14, '#6b4330'); // rua + capacho
  for (const cy of corrY) portaNaParede(lx + LW, cy + CAP + 4, CAP, CORR - 8, t.pedra);
  recepcao(t, lx, ly, alturaLobby, c0, quadro, noite);

  // corredores
  for (const cy of corrY) {
    bloco(t, X0, cy, larguraSalas, CH);
    const ix = X0 + CAP, iy = cy + CAP, iw = larguraSalas - CAP * 2;
    R(ix, iy, iw, CORR, t.corredor);
    for (let xx = ix; xx < ix + iw; xx += 8) for (let yy = iy; yy < iy + CORR; yy += 8) if (((xx - ix + yy - iy) / 8) % 2 === 0) R(xx, yy, Math.min(8, ix + iw - xx), Math.min(8, iy + CORR - yy), t.corredor2);
    R(ix + 6, iy + 9, iw - 12, 8, '#8f3b4f'); R(ix + 7, iy + 10, iw - 14, 6, '#b04e5f');
    for (let xx = ix + 10; xx < ix + iw - 10; xx += 6) R(xx, iy + 12, 3, 2, '#d77a7a');
    portaNaParede(X0, iy + 4, CAP, CORR - 8, t.corredor); // vem da recepção
  }

  const caixas: Caixa[] = [];
  for (let k = 0; k < linhas * cols; k++) {
    const r = Math.floor(k / cols), c = k % cols, s = salas[k];
    const bx = X0 + c * (BW + VAO), by = linhaY[r];
    const rx = bx + CAP, ry = by + CAP, fy = ry + FACE, emCima = r % 2 === 1;
    bloco(t, bx, by, BW, BH);
    // parede de fundo (vista de frente) e piso de tábuas (visto de cima)
    paredeFundo(t, rx, ry, RW);
    R(rx, fy, RW, RH - FACE, t.piso);
    for (let yy = fy + 5; yy < ry + RH; yy += 6) R(rx, yy, RW, 1, t.pisoLinha);
    for (let yy = fy; yy < ry + RH; yy += 6) for (let xx = rx + ((yy / 6) % 2 ? 9 : 25); xx < rx + RW; xx += 32) R(xx, yy, 1, 5, t.pisoLinha);
    R(rx, fy, RW, 2, t.escuro);
    // porta: na parede de baixo (fileira de cima) ou na parede de fundo (fileira de baixo), sempre virada pro corredor
    const px = emCima ? rx + 88 : rx + RW / 2 - 8;
    const corr = corrY[Math.floor(r / 2)];
    if (!emCima) {
      portaNaParede(px, ry + RH, 16, CAP, t.piso);
      portaNaParede(px, corr, 16, CAP, t.corredor); R(px + 1, corr + CAP + 1, 14, 4, '#6b4330'); // capacho no corredor
    }
    if (!s) salaLivre(t, rx, ry);
    else if (s.producao) salaProducao(t, s, rx, ry, quadro, noite);
    else salaProjeto(t, s, rx, ry, quadro, noite, emCima);
    if (emCima) { // porta aberta na parede de fundo, dando pro corredor
      R(px - 2, by, 20, CAP + FACE, K); R(px - 1, by, 18, CAP + FACE, MADEIRA.W);
      R(px + 1, by, 14, CAP + FACE, t.corredor); R(px + 1, ry + FACE - 4, 14, 4, t.piso);
      portaNaParede(px, corr + CH - CAP, 16, CAP, t.corredor);
    }
    if (s) caixas.push({ x: rx, y: ry, w: RW, h: RH, barra: { x: bx - 1, y: emCima ? by + BH + 3 : by - BARRA + 1, w: BW + 2, h: BARRA - 4 } });
  }
  return { W, H, caixas };
}
