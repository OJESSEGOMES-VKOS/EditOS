// A camada de pixel do EditOS Online: ícones em grade 12x12, o personagem de cada perfil e o céu pontilhado do fundo.
// Tudo é desenhado por código (sem imagem), então fica nítido em qualquer tela e troca de cor com o tema.

const SVG = 'http://www.w3.org/2000/svg';

// cada ícone: 12 linhas de 12 casas; # é pixel aceso
const ICONES: Record<string, string[]> = {
  logo: ['............', '.#########..', '.#########..', '.###........', '.###........', '.#######....', '.#######....', '.###........', '.###........', '.#########..', '.#########..', '............'],
  quadro: ['............', '.###.###.###', '.###.###.###', '.###.###.###', '.###.###.###', '.###.###.###', '.###.###.###', '.###.###.###', '.###.....###', '.###.....###', '.###........', '............'],
  busca: ['............', '...####.....', '..#....#....', '.#......#...', '.#......#...', '.#......#...', '.#......#...', '..#....#....', '...#####....', '........##..', '.........##.', '..........#.'],
  fechar: ['............', '.##......##.', '.###....###.', '..###..###..', '...######...', '....####....', '....####....', '...######...', '..###..###..', '.###....###.', '.##......##.', '............'],
  pasta: ['............', '.####.......', '.#####......', '.##########.', '.#........#.', '.#........#.', '.#........#.', '.#........#.', '.#........#.', '.##########.', '............', '............'],
  filme: ['............', '.##########.', '.#.#....#.#.', '.###....###.', '.#.#....#.#.', '.###....###.', '.#.#....#.#.', '.###....###.', '.#.#....#.#.', '.##########.', '............', '............'],
  doc: ['............', '..######....', '..#....##...', '..#.....##..', '..#.##...#..', '..#......#..', '..#.####.#..', '..#......#..', '..#.####.#..', '..#......#..', '..########..', '............'],
  externo: ['............', '.....######.', '.........##.', '........#.#.', '.......#..#.', '.####.#...#.', '.#...#......', '.#..........', '.#.......#..', '.#.......#..', '.#########..', '............'],
  luz: ['............', '....####....', '...#....#...', '..#......#..', '..#......#..', '..#......#..', '...#....#...', '....#..#....', '....####....', '....#..#....', '....####....', '............'],
  nota: ['............', '.##########.', '.#........#.', '.#.######.#.', '.#........#.', '.#.######.#.', '.#........#.', '.#.####...#.', '.#......###.', '.#.....##...', '.#######....', '............'],
  lixo: ['............', '....####....', '.##########.', '............', '..########..', '..#.#..#.#..', '..#.#..#.#..', '..#.#..#.#..', '..#.#..#.#..', '..#......#..', '...######...', '............'],
  sol: ['.....##.....', '.#...##...#.', '..#......#..', '....####....', '...######...', '##.######.##', '##.######.##', '...######...', '....####....', '..#......#..', '.#...##...#.', '.....##.....'],
  lua: ['............', '.....####...', '...####.....', '..####......', '..###.......', '..###.......', '..###.......', '..####....#.', '..#########.', '...#######..', '.....####...', '............'],
  // as cinco etapas do fluxo
  roteiro: ['............', '........###.', '.......#####', '......###.##', '.....###.##.', '....###.##..', '...###.##...', '..####.#....', '..#.###.....', '.##..#......', '.####.......', '............'],
  produzindo: ['............', '.#.##.##.##.', '.##.##.##.#.', '.##########.', '............', '.##########.', '.#........#.', '.#........#.', '.#........#.', '.#........#.', '.##########.', '............'],
  revisar: ['............', '............', '...######...', '..#......#..', '.#...##...#.', '#...####...#', '#...####...#', '.#...##...#.', '..#......#..', '...######...', '............', '............'],
  pronto: ['............', '............', '..........##', '.........###', '........###.', '.##....###..', '.###..###...', '..######....', '...####.....', '....##......', '............', '............'],
  olho: ['............', '............', '....####....', '..##....##..', '.#...##...#.', '#...####...#', '#...####...#', '.#...##...#.', '..##....##..', '....####....', '............', '............'],
  olhoFechado: ['............', '............', '............', '............', '#..........#', '.#........#.', '..##....##..', '....####....', '..#..#..#..#'.slice(0, 12), '.#...#..#...', '............', '............'],
  predio: ['............', '.##########.', '.#........#.', '.#.##..##.#.', '.#.##..##.#.', '.#........#.', '.#.##..##.#.', '.#.##..##.#.', '.#........#.', '.#...##...#.', '.#...##...#.', '.##########.'],
  publicado: ['............', '..##........', '..########..', '..#########.', '..#########.', '..########..', '..##........', '..##........', '..##........', '..##........', '.####.......', '............'],
};

// junta os pixels acesos de uma grade num único caminho (uma tira por sequência horizontal)
function caminho(linhas: string[], dx = 0, dy = 0) {
  let d = '';
  linhas.forEach((linha, y) => {
    for (let x = 0; x < linha.length; x++) {
      if (linha[x] !== '#') continue;
      let fim = x; while (linha[fim + 1] === '#') fim++;
      d += `M${x + dx} ${y + dy}h${fim - x + 1}v1h-${fim - x + 1}z`; x = fim;
    }
  });
  return d;
}
function svg(lado: number, tam: number) {
  const s = document.createElementNS(SVG, 'svg');
  s.setAttribute('viewBox', `0 0 ${lado} ${lado}`); s.setAttribute('width', String(tam)); s.setAttribute('height', String(tam));
  s.setAttribute('shape-rendering', 'crispEdges'); s.setAttribute('aria-hidden', 'true');
  return s;
}
function traco(d: string, cor: string) {
  const p = document.createElementNS(SVG, 'path'); p.setAttribute('d', d); p.setAttribute('fill', cor); return p;
}

// o estilo App troca o pixel por desenho liso: ícone de traço fino, avatar de letra e céu sem pontilhado
export const ehApp = () => document.documentElement.dataset.estilo === 'app';
const TRACOS: Record<string, string> = {
  logo: 'M7 5h9M7 12h7M7 19h9M7 5v14',
  quadro: 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z',
  busca: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  fechar: 'M6 6l12 12M18 6L6 18',
  pasta: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  filme: 'M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  externo: 'M14 4h6v6M20 4l-9 9M18 14v5H5V6h5',
  luz: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z',
  nota: 'M5 4h14v16H5zM9 8h6M9 12h6M9 16h3',
  sol: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  lua: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  roteiro: 'M4 20l1-4L16 5l3 3L8 19zM14 7l3 3',
  produzindo: 'M4 9h16v10H4zM4 9V5h16v4M8 5l2 4M13 5l2 4',
  revisar: 'M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  pronto: 'M5 12.5l4.5 4.5L19 7.5',
  publicado: 'M6 21V4M6 5h11l-2 4 2 4H6',
  olho: 'M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  olhoFechado: 'M3 10c2.5 3 5.5 4.5 9 4.5s6.5-1.5 9-4.5M7 14l-1.5 2.5M12 15v3M17 14l1.5 2.5',
  predio: 'M4 21V4h16v17M9 8h1M14 8h1M9 12h1M14 12h1M10 21v-4h4v4',
  lixo: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
};

// tam 12 (pixel de 1) ou 24 (pixel de 2): só múltiplos de 12 ficam nítidos. No estilo App vira traço, um pouco maior
export function icone(nome: string, tam = 12) {
  if (ehApp()) {
    const lado = tam === 12 ? 16 : tam === 24 ? 22 : tam;
    const s = document.createElementNS(SVG, 'svg'), p = document.createElementNS(SVG, 'path');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', String(lado)); s.setAttribute('height', String(lado));
    s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.8');
    s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    p.setAttribute('d', TRACOS[nome]); s.append(p);
    return s;
  }
  const s = svg(12, tam); s.append(traco(caminho(ICONES[nome]), 'currentColor')); return s;
}

// o personagem do perfil: um bichinho de 6x6 espelhado, sempre o mesmo para o mesmo nome
const CORES = ['#ffc15e', '#7db8ff', '#6fdcaa', '#c9a6ff', '#ff9a7a', '#6fd6e6', '#ff9ccb'];
function bicho(nome: string) {
  let h = 2166136261;
  for (const c of nome) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const cor = CORES[(h >>> 0) % CORES.length];
  const sorte = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  const g = Array.from({ length: 6 }, () => [0, 1, 2].map(() => sorte() < 0.55));
  g[1][1] = true; g[2][0] = true; g[2][2] = true; g[3][1] = true; g[3][2] = true; g[2][1] = false; // rosto: o olho é o furo
  return { cor, linhas: g.map((l) => [...l, ...[...l].reverse()].map((v) => (v ? '#' : '.')).join('')) };
}
export const corDoPerfil = (nome: string) => bicho(nome).cor;
export function personagem(nome: string, tam = 24) {
  const { cor, linhas } = bicho(nome);
  if (ehApp()) { // avatar de app: quadrado de canto redondo com a inicial
    const a = svg(24, tam), fundo = document.createElementNS(SVG, 'rect'), letra = document.createElementNS(SVG, 'text');
    a.removeAttribute('shape-rendering');
    fundo.setAttribute('width', '24'); fundo.setAttribute('height', '24'); fundo.setAttribute('rx', '7'); fundo.setAttribute('fill', cor);
    letra.setAttribute('x', '12'); letra.setAttribute('y', '16.6'); letra.setAttribute('text-anchor', 'middle'); letra.setAttribute('fill', '#1d1433');
    letra.setAttribute('font-size', '13'); letra.setAttribute('font-weight', '700'); letra.textContent = nome[0].toUpperCase();
    a.append(fundo, letra);
    return a;
  }
  const s = svg(8, tam);
  s.append(traco('M0 0h8v8h-8z', cor), traco(caminho(linhas, 1, 1), '#1d1433'));
  return s;
}

// ── o escritório: cada sala é uma cena de 64x40 pixels. As cores vêm do tema (variáveis --sala-*) ──
const ret = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h-${w}z`;
function cena() {
  const s = document.createElementNS(SVG, 'svg');
  s.setAttribute('viewBox', '0 0 64 40'); s.setAttribute('shape-rendering', 'crispEdges'); s.setAttribute('aria-hidden', 'true');
  s.setAttribute('class', 'cena');
  return s;
}
function grupo(classe: string, ...filhos: Element[]) {
  const g = document.createElementNS(SVG, 'g'); g.setAttribute('class', classe); g.append(...filhos); return g;
}
function salaBase(s: SVGSVGElement) {
  let tabuas = '';
  for (let y = 30; y < 40; y += 3) tabuas += ret(0, y, 64, 1);
  s.append(
    traco(ret(0, 0, 64, 27), 'var(--sala-parede)'),
    traco(ret(0, 0, 64, 1) + ret(0, 26, 64, 1), 'var(--sala-moveis)'),
    traco(ret(0, 27, 64, 13), 'var(--sala-chao)'),
    traco(tabuas, 'var(--sala-chao-2)'),
  );
}

// sala de um perfil: janela, quadro com a cor dele, planta, mesa, e o personagem. Ativa = sessão do Claude mexendo agora
export function sala(nome: string) {
  const { cor, linhas } = bicho(nome);
  const s = cena();
  salaBase(s);
  // janela com o céu do tema
  s.append(traco(ret(5, 5, 16, 13), 'var(--sala-moveis)'), traco(ret(6, 6, 14, 11), 'var(--sala-janela)'),
    traco(ret(12, 6, 1, 11) + ret(6, 11, 14, 1), 'var(--sala-moveis)'), traco(ret(15, 7, 2, 2), 'var(--sala-astro)'));
  // quadro na parede com a cor do perfil
  s.append(traco(ret(46, 6, 11, 9), 'var(--sala-moveis)'), traco(ret(47, 7, 9, 7), cor),
    traco(ret(49, 9, 5, 1) + ret(49, 11, 3, 1), '#1d1433'));
  // planta
  s.append(traco(ret(53, 31, 5, 5), 'var(--sala-moveis)'),
    traco(ret(55, 24, 1, 7) + ret(53, 26, 2, 1) + ret(56, 27, 2, 1) + ret(52, 25, 2, 2) + ret(57, 26, 2, 2) + ret(54, 22, 3, 2), '#4fa56a'));
  // o personagem: cabeça com o rosto do perfil, corpo atrás da mesa
  const corpo = grupo('bicho',
    traco(ret(27, 21, 10, 6), cor), traco(ret(27, 21, 10, 6), 'rgba(29,20,51,.28)'),
    traco(ret(28, 12, 8, 8), cor), traco(caminho(linhas, 29, 13), '#1d1433'));
  s.append(grupo('luz-tela', traco(ret(26, 10, 12, 16), 'var(--sala-brilho)'), traco(ret(24, 13, 16, 13), 'var(--sala-brilho)'), traco(ret(22, 17, 20, 9), 'var(--sala-brilho)')), corpo); // a luz da tela fica atrás do personagem
  // mesa e notebook (de costas pra nós); a tela acende quando tem sessão trabalhando
  s.append(
    traco(ret(24, 24, 16, 4), 'var(--sala-moveis)'), traco(ret(30, 25, 4, 2), 'var(--sala-logo)'),
    traco(ret(16, 27, 32, 2), 'var(--sala-mesa)'), traco(ret(17, 29, 30, 5), 'var(--sala-mesa-2)'),
    traco(ret(17, 34, 2, 4) + ret(45, 34, 2, 4), 'var(--sala-mesa-2)'),
    grupo('zz', traco(ret(39, 8, 3, 1) + ret(40, 9, 1, 1) + ret(39, 10, 3, 1) + ret(43, 4, 2, 1) + ret(43, 5, 1, 1) + ret(43, 6, 2, 1), 'var(--sala-zz)')),
  );
  return s;
}

// a sala de produção: o quadro grande na parede com uma pilha por etapa, do tamanho da quantidade
export function salaProducao(pilhas: { cor: string; n: number }[]) {
  const s = cena();
  salaBase(s);
  s.append(traco(ret(6, 3, 52, 21), 'var(--sala-moveis)'), traco(ret(7, 4, 50, 19), 'var(--sala-quadro)'));
  const maior = Math.max(1, ...pilhas.map((p) => p.n));
  pilhas.forEach((p, k) => {
    const x = 9 + k * 10, alto = p.n ? Math.max(1, Math.round((p.n / maior) * 7)) : 0;
    s.append(traco(ret(x, 5, 7, 1), p.cor));
    let d = '';
    for (let i = 0; i < alto; i++) d += ret(x, 7 + i * 2, 7, 1);
    if (d) s.append(traco(d, p.cor));
  });
  s.append(traco(ret(10, 29, 44, 2), 'var(--sala-mesa)'), traco(ret(11, 31, 42, 3), 'var(--sala-mesa-2)'),
    traco(ret(12, 34, 2, 4) + ret(50, 34, 2, 4), 'var(--sala-mesa-2)'));
  return s;
}

// o céu: uma rampa de cores pontilhada (Bayer 4x4), com o clarão da lua ou do sol e duas névoas de cor.
// As névoas existem pro vidro ter o que refratar: é a cor delas que aparece, desfocada, por trás dos painéis.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
type Nevoa = { cor: string; x: number; y: number; raio: number; forca: number };
const CEU: Record<string, { rampa: string[]; curva: number; astro: number; nevoas: Nevoa[] }> = {
  noite: {
    rampa: ['#0d0a1f', '#120e2b', '#191338', '#231848', '#33205a', '#4a2767', '#6b2f6c', '#93396a', '#bd4c62', '#e0714f', '#f3a258'], curva: 1.9, astro: 0.2,
    nevoas: [{ cor: '#1a4a6e', x: 0.3, y: 0.36, raio: 0.3, forca: 0.5 }, { cor: '#572a8a', x: 0.66, y: 0.58, raio: 0.28, forca: 0.45 }],
  },
  dia: {
    rampa: ['#bcd9f6', '#cbdff8', '#d9e3fa', '#e6e4f8', '#f1e3f1', '#f9e2e6', '#fee0d6', '#ffdcc2', '#ffd3a8', '#ffc88f'], curva: 1.15, astro: 0.3,
    nevoas: [{ cor: '#b9ecdf', x: 0.3, y: 0.4, raio: 0.3, forca: 0.55 }, { cor: '#dcc6ff', x: 0.66, y: 0.6, raio: 0.28, forca: 0.5 }],
  },
  // os céus do estilo App: sem pontilhado, manchas largas de cor pro vidro refratar
  'app-noite': {
    rampa: ['#07070c', '#0b0c1a', '#11112a', '#1a1438', '#261845', '#341b4c'], curva: 1.3, astro: 0.1,
    nevoas: [{ cor: '#1f4fb8', x: 0.24, y: 0.3, raio: 0.42, forca: 0.6 }, { cor: '#8a2f8f', x: 0.74, y: 0.66, raio: 0.4, forca: 0.55 }, { cor: '#b5562a', x: 0.5, y: 1.05, raio: 0.34, forca: 0.5 }],
  },
  'app-dia': {
    rampa: ['#dfeaf8', '#e6eafb', '#eeeafa', '#f6ebf4', '#fbeeea'], curva: 1.1, astro: 0.15,
    nevoas: [{ cor: '#9fcbff', x: 0.24, y: 0.3, raio: 0.42, forca: 0.7 }, { cor: '#ffbfdc', x: 0.74, y: 0.66, raio: 0.4, forca: 0.65 }, { cor: '#ffd9a8', x: 0.5, y: 1.05, raio: 0.34, forca: 0.6 }],
  },
};
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export function pintarCeu(tela: HTMLCanvasElement, tema: string) {
  const liso = ehApp();
  const P = liso ? 8 : 4, w = Math.ceil(innerWidth / P), h = Math.ceil(innerHeight / P);
  const { rampa, curva, astro, nevoas } = CEU[liso ? `app-${tema}` : tema] ?? CEU.noite;
  const cores = rampa.map(rgb), n = cores.length, tintas = nevoas.map((v) => rgb(v.cor));
  tela.width = w; tela.height = h;
  const ctx = tela.getContext('2d')!, img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = y / h, limiar = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
    const dx = (x - w * 0.8) / h, dy = v - 0.16;
    const t = Math.pow(v, curva) + 0.045 * v * Math.sin((x / w) * 6.283 + 1.2) + astro * Math.exp(-(dx * dx + dy * dy) / 0.035);
    const f = Math.min(Math.max(t, 0), 0.999) * (n - 1);
    let c = cores[Math.min(n - 1, Math.floor(f + limiar))];
    if (liso) { const i = Math.floor(f), b = cores[Math.min(n - 1, i + 1)]; c = cores[i].map((a, q) => a + (b[q] - a) * (f - i)); }
    nevoas.forEach((nv, k) => {
      const ax = (x / w - nv.x) * (w / h), ay = v - nv.y;
      const forca = nv.forca * Math.exp(-(ax * ax + ay * ay) / (nv.raio * nv.raio));
      if (liso) c = c.map((a, q) => a + (tintas[k][q] - a) * forca);
      else if (forca > limiar) c = tintas[k];
    });
    img.data.set([c[0], c[1], c[2], 255], (y * w + x) * 4);
  }
  ctx.putImageData(img, 0, 0);
}
