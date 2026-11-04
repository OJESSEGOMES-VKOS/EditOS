// EditOS online: desenha o fluxo a partir de /api/fluxo e se redesenha quando o servidor avisa que uma pasta mudou.
// Texto vindo das pastas é dado: tudo entra por textContent, nunca por innerHTML.
type Item = {
  perfil: string; nome: string; titulo: string; data: string | null; status: string; videos: string[]; roteiros: string[];
  resumo: string; link: string; insight: string; notas: string;
};
type Fluxo = { perfis: string[]; arrobas: Record<string, string>; status: string[]; itens: Item[] };

const NOMES: Record<string, string> = { roteiro: 'Roteiro', produzindo: 'Produzindo', revisar: 'Revisar', pronto: 'Pronto', publicado: 'Publicado' };
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const CORES = ['#f5b54a', '#5b9cff', '#3ecf8e', '#b195ff', '#ff7a59', '#4dd0e1', '#f472b6'];

let dados: Fluxo = { perfis: [], arrobas: {}, status: [], itens: [] };
let filtro = 'todos';
let busca = '';
let aberto: { perfil: string; nome: string } | null = null;
let versaoVideo: string | null = null;
let versaoRoteiro: string | null = null;

// ── ícones (traço 1,5, 16 px) ──
const ICONES: Record<string, string> = {
  quadro: 'M3 4h4v16H3zM10 4h4v10h-4zM17 4h4v13h-4z',
  busca: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  fechar: 'M6 6l12 12M18 6L6 18',
  pasta: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  filme: 'M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  link: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1',
  externo: 'M14 4h6v6M20 4l-9 9M18 14v5H5V6h5',
  luz: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z',
  nota: 'M5 4h14v16H5zM9 8h6M9 12h6M9 16h3',
  logo: 'M5 5h9M5 12h7M5 19h9M5 5v14M17 9l3 3-3 3',
};
function icone(nome: string, tam = 16) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', String(tam)); s.setAttribute('height', String(tam));
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.6');
  s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', ICONES[nome]); s.append(p);
  return s;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: Record<string, any> = {}, ...filhos: (Node | string | null | false)[]) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null) continue;
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'style') e.setAttribute('style', v);
    else if (k in e && !k.includes('-')) (e as any)[k] = v; else e.setAttribute(k, String(v));
  }
  for (const f of filhos) if (f !== null && f !== false) e.append(f);
  return e;
}
const $ = (id: string) => document.getElementById(id)!;
const cor = (s: string) => `var(--s-${s})`;
const corPerfil = (p: string) => CORES[[...p].reduce((a, c) => a + c.charCodeAt(0), 0) % CORES.length];
const avatar = (p: string, classe = 'avatar') => el('span', { className: classe, style: `background:${corPerfil(p)}` }, p[0].toUpperCase());
const dataCurta = (d: string | null) => { if (!d) return ''; const [dd, mm] = d.split('/'); return `${Number(dd)} ${MESES[Number(mm) - 1]}`; };
const url = (rota: string, i: Item, arquivo: string) =>
  `/api/${rota}?perfil=${encodeURIComponent(i.perfil)}&nome=${encodeURIComponent(i.nome)}&arquivo=${encodeURIComponent(arquivo)}`;
const chave = (i: { perfil: string; nome: string }) => `${i.perfil}/${i.nome}`;
const visiveis = () => dados.itens.filter((i) => (filtro === 'todos' || i.perfil === filtro) && (!busca || `${i.titulo} ${i.perfil} ${i.resumo}`.toLowerCase().includes(busca)));

// ── barra lateral e topo ──
function desenharLado() {
  const conta = (p: string) => dados.itens.filter((i) => p === 'todos' || i.perfil === p).length;
  const item = (p: string) => el('button', { className: 'nav-item', 'aria-current': String(filtro === p), onclick: () => trocarPerfil(p) },
    p === 'todos' ? el('span', { className: 'avatar', style: 'background:var(--f4);color:var(--tinta-2)' }, icone('quadro', 12)) : avatar(p),
    el('span', { className: 'nome' }, p === 'todos' ? 'Todos os perfis' : p), el('span', { className: 'conta' }, String(conta(p))));
  $('nav-todos').replaceChildren(item('todos'));
  $('nav-perfis').replaceChildren(...dados.perfis.map(item));
  const sel = $('seletor-perfil') as HTMLSelectElement;
  sel.replaceChildren(...['todos', ...dados.perfis].map((p) => el('option', { value: p, selected: filtro === p }, p === 'todos' ? 'Todos os perfis' : p)));
}

function desenharTopo() {
  const titulo = $('titulo');
  titulo.replaceChildren(filtro === 'todos' ? 'Todos os perfis' : filtro,
    filtro !== 'todos' && dados.arrobas[filtro] ? el('small', {}, dados.arrobas[filtro]) : '');
  const da = dados.itens.filter((i) => filtro === 'todos' || i.perfil === filtro);
  const n = (s: string) => da.filter((i) => i.status === s).length;
  $('numeros').replaceChildren(
    el('span', {}, el('b', {}, String(n('roteiro') + n('produzindo'))), 'em criação'),
    el('span', {}, el('b', {}, String(n('revisar'))), 'para revisar'),
    el('span', {}, el('b', {}, String(n('pronto'))), 'prontos'),
    el('span', {}, el('b', {}, String(n('publicado'))), 'publicados'));
}

function trocarPerfil(p: string) { filtro = p; desenhar(); }

// ── quadro ──
function desenharQuadro() {
  const itens = visiveis();
  $('quadro').replaceChildren(...dados.status.map((s) => {
    const da = itens.filter((i) => i.status === s);
    const lista = el('div', { className: 'cartoes' }, ...(da.length ? da.map(cartao) : [el('div', { className: 'vazio-col' }, busca ? 'nada com essa busca' : 'nada aqui ainda')]));
    const col = el('section', { className: 'coluna', 'aria-label': NOMES[s] },
      el('div', { className: 'coluna-topo' }, el('span', { className: 'ponto', style: `background:${cor(s)}` }), NOMES[s], el('span', { className: 'conta' }, String(da.length))),
      lista);
    // soltar um cartão aqui muda o status dele
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('alvo'); });
    col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget as Node)) col.classList.remove('alvo'); });
    col.addEventListener('drop', (e) => {
      e.preventDefault(); col.classList.remove('alvo');
      const i = dados.itens.find((x) => chave(x) === e.dataTransfer?.getData('text/plain'));
      if (i && i.status !== s) mudarStatus(i, s);
    });
    return col;
  }));
}

function cartao(i: Item) {
  const ultimo = i.videos[i.videos.length - 1];
  const mini = el('div', { className: 'miniatura' }, ultimo
    ? el('img', { src: url('capa', i, ultimo), alt: '', loading: 'lazy', onerror: (e: Event) => (e.target as HTMLElement).replaceWith(icone('filme', 16)) })
    : icone('doc', 16));
  const c = el('button', {
    className: 'cartao', draggable: 'true', 'aria-current': String(!!aberto && chave(aberto) === chave(i)),
    'aria-label': `${i.titulo}, ${i.perfil}, ${NOMES[i.status]}`, onclick: () => abrir(i),
  }, mini, el('div', { className: 'cartao-corpo' },
    el('div', { className: 'cartao-titulo' }, i.titulo),
    i.resumo && !i.videos.length ? el('div', { className: 'cartao-resumo' }, i.resumo) : null,
    el('div', { className: 'cartao-meta' },
      filtro === 'todos' ? el('span', { className: 'perfil' }, avatar(i.perfil), i.perfil) : null,
      i.videos.length ? el('span', { className: 'mono' }, `v${i.videos.length}`) : null,
      i.data ? el('span', {}, dataCurta(i.data)) : null,
      !i.roteiros.length ? el('span', { title: 'sem roteiro nesta pasta' }, 'sem roteiro') : null,
      i.insight ? el('span', { className: 'icone-txt insight', title: i.insight }, icone('luz', 12), 'insight') : null)));
  c.addEventListener('dragstart', (e) => { e.dataTransfer!.setData('text/plain', chave(i)); e.dataTransfer!.effectAllowed = 'move'; c.classList.add('arrastando'); });
  c.addEventListener('dragend', () => c.classList.remove('arrastando'));
  return c;
}

// ── gravar ──
let avisoTimer: ReturnType<typeof setTimeout> | undefined;
function avisar(texto: string) {
  const a = $('aviso'); a.querySelector('span:last-child')!.textContent = texto; a.classList.add('ver');
  clearTimeout(avisoTimer); avisoTimer = setTimeout(() => a.classList.remove('ver'), 1600);
}
async function salvar(i: Item, campos: Record<string, string>, texto = 'Salvo') {
  const r = await fetch('/api/fluxo', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ perfil: i.perfil, nome: i.nome, ...campos }) });
  avisar(r.ok ? texto : 'Não deu para salvar');
}
function mudarStatus(i: Item, s: string) {
  i.status = s; desenhar(); // otimista: o "ao vivo" confirma em seguida
  salvar(i, { status: s }, `Movido para ${NOMES[s]}`);
}

// ── ficha ──
function abrir(i: Item) {
  if (!aberto || chave(aberto) !== chave(i)) { versaoVideo = null; versaoRoteiro = null; }
  aberto = { perfil: i.perfil, nome: i.nome };
  history.replaceState(null, '', `#${chave(i)}`);
  desenharFicha(true); desenharQuadro();
}
function fechar() {
  aberto = null; history.replaceState(null, '', location.pathname);
  $('ficha').classList.remove('aberta'); $('ficha').setAttribute('aria-hidden', 'true'); desenharQuadro();
}

function secao(icone_: string, titulo: string, acoes: Node | null, ...corpo: Node[]) {
  return el('section', { className: 'secao' },
    el('div', { className: 'secao-cab' }, icone(icone_, 14), titulo, acoes ? el('div', { className: 'acoes' }, acoes) : null), ...corpo);
}

// markdown simples do roteiro: título, lista, citação, negrito. Sem HTML de fora.
function markdown(texto: string) {
  const raiz = el('div', { className: 'leitura' });
  let lista: HTMLUListElement | null = null;
  const inline = (t: string) => {
    const frag = document.createDocumentFragment();
    t.split(/(\*\*[^*]+\*\*)/g).forEach((p) => frag.append(p.startsWith('**') && p.endsWith('**') ? el('strong', {}, p.slice(2, -2)) : p.replace(/[`_]/g, '')));
    return frag;
  };
  for (const linha of texto.replace(/\r\n/g, '\n').split('\n')) {
    const l = linha.trim();
    if (/^[-*•]\s+/.test(l)) { lista ??= raiz.appendChild(el('ul')); lista.append(el('li', {}, inline(l.replace(/^[-*•]\s+/, '')))); continue; }
    lista = null;
    if (!l || l === '---') continue;
    if (l.startsWith('#')) raiz.append(el('h4', {}, inline(l.replace(/^#+\s*/, ''))));
    else if (l.startsWith('>')) raiz.append(el('blockquote', {}, inline(l.replace(/^>\s*/, ''))));
    else raiz.append(el('p', {}, inline(l)));
  }
  return raiz;
}

function desenharFicha(primeiraVez = false) {
  const ficha = $('ficha');
  const i = aberto && dados.itens.find((x) => chave(x) === chave(aberto!));
  if (!i) { if (aberto) fechar(); return; }
  // atualização ao vivo: não atropela quem está digitando nem o vídeo tocando
  const foco = document.activeElement as HTMLElement | null;
  if (!primeiraVez && foco && ficha.contains(foco) && foco.matches('input, textarea')) return;
  const tocando = ficha.querySelector('video') as HTMLVideoElement | null;
  if (!primeiraVez && tocando && !tocando.paused) { desenharEstados(i); return; }

  $('ficha-origem').replaceChildren(avatar(i.perfil), el('span', {}, i.perfil), i.data ? el('span', { className: 'mono' }, `· ${i.data}`) : '');
  $('ficha-titulo').textContent = i.titulo;
  desenharEstados(i);

  const blocos: Node[] = [];
  // vídeo
  if (i.videos.length) {
    const v = versaoVideo && i.videos.includes(versaoVideo) ? versaoVideo : i.videos[i.videos.length - 1];
    const video = el('video', { controls: true, preload: 'metadata', src: url('arquivo', i, v), poster: url('capa', i, v) });
    const pills = el('div', { className: 'versoes' }, ...[...i.videos].reverse().map((x) =>
      el('button', { className: 'versao', 'aria-pressed': String(x === v), onclick: () => { versaoVideo = x; desenharFicha(true); } }, x.replace(/\.mp4$/i, ''))));
    blocos.push(secao('filme', `Vídeo · ${i.videos.length} ${i.videos.length > 1 ? 'versões' : 'versão'}`, null, pills, el('div', { className: 'palco', style: 'margin-top:10px' }, video)));
  }
  // roteiro
  if (i.roteiros.length) {
    const r = versaoRoteiro && i.roteiros.includes(versaoRoteiro) ? versaoRoteiro : i.roteiros[i.roteiros.length - 1];
    const leitura = el('div', {}, el('div', { className: 'sem' }, 'Carregando o roteiro…'));
    fetch(url('arquivo', i, r)).then((x) => x.text()).then((t) => leitura.replaceChildren(markdown(t)));
    const pills = i.roteiros.length > 1 ? el('div', { className: 'versoes', style: 'margin-bottom:10px' }, ...[...i.roteiros].reverse().map((x) =>
      el('button', { className: 'versao', 'aria-pressed': String(x === r), onclick: () => { versaoRoteiro = x; desenharFicha(true); } }, x.replace(/^roteiro-|\.(md|txt)$/g, '')))) : null;
    blocos.push(secao('doc', 'Roteiro', null, ...(pills ? [pills] : []), leitura));
  } else blocos.push(secao('doc', 'Roteiro', null, el('div', { className: 'sem' }, 'Esta pasta ainda não tem roteiro.')));
  // publicação
  const link = el('input', { className: 'campo', type: 'url', id: 'f-link', value: i.link, placeholder: 'Cole o link do post', 'aria-label': 'Link da publicação',
    onchange: (e: Event) => salvar(i, { link: (e.target as HTMLInputElement).value.trim() }) }) as HTMLInputElement;
  const abrirLink = i.link && /^https?:\/\//.test(i.link) ? el('a', { className: 'btn', href: i.link, target: '_blank', rel: 'noopener noreferrer' }, icone('externo', 14), 'Abrir') : null;
  blocos.push(secao('link', 'Publicação', null, el('div', { className: 'linha-campo' }, link, abrirLink),
    el('p', { className: 'dica' }, i.status === 'publicado' ? 'Publicado.' : 'Postou? Cole o link e marque como Publicado.')));
  // insight
  blocos.push(secao('luz', 'Insight', null, el('textarea', { className: 'campo', value: i.insight, 'aria-label': 'Insight',
    placeholder: 'O que este vídeo ensinou e pode virar regra do sistema…', onchange: (e: Event) => salvar(i, { insight: (e.target as HTMLTextAreaElement).value }) })));
  if (i.notas) blocos.push(secao('nota', 'Notas', null, markdown(i.notas)));

  $('ficha-corpo').replaceChildren(...blocos);
  if (primeiraVez) $('ficha-corpo').scrollTop = 0;
  ficha.classList.add('aberta'); ficha.setAttribute('aria-hidden', 'false');
}

function desenharEstados(i: Item) {
  $('estados').replaceChildren(...dados.status.map((s) =>
    el('button', { className: 'estado', 'aria-pressed': String(i.status === s), onclick: () => i.status !== s && mudarStatus(i, s) },
      el('span', { className: 'ponto', style: `background:${cor(s)}` }), NOMES[s])));
}

// ── ligar tudo ──
function desenhar() { desenharLado(); desenharTopo(); desenharQuadro(); desenharFicha(); }
async function recarregar() { dados = await (await fetch('/api/fluxo', { cache: 'no-store' })).json(); desenhar(); }

$('fechar').addEventListener('click', fechar);
$('abrir-pasta').addEventListener('click', () => {
  if (!aberto) return;
  fetch('/api/abrir', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(aberto) }).then((r) => avisar(r.ok ? 'Pasta aberta' : 'Não deu para abrir'));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aberto) fechar();
  if (e.key === '/' && !(document.activeElement as HTMLElement)?.matches('input, textarea')) { e.preventDefault(); ($('busca') as HTMLInputElement).focus(); }
});
$('busca').addEventListener('input', (e) => { busca = (e.target as HTMLInputElement).value.trim().toLowerCase(); desenharQuadro(); });
$('seletor-perfil').addEventListener('change', (e) => trocarPerfil((e.target as HTMLSelectElement).value));

function conectar() {
  const pe = $('vivo');
  const es = new EventSource('/api/eventos');
  es.onopen = () => { pe.classList.add('vivo'); pe.querySelector('span:last-child')!.textContent = 'Ao vivo · sincronizado'; };
  es.onmessage = () => recarregar();
  es.onerror = () => { pe.classList.remove('vivo'); pe.querySelector('span:last-child')!.textContent = 'Reconectando…'; };
}

const [hp, hn] = decodeURIComponent(location.hash.slice(1)).split('/');
if (hp && hn) aberto = { perfil: hp, nome: hn };
recarregar().then(() => { if (aberto) desenharFicha(true); conectar(); });
