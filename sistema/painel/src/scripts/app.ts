// EditOS Online: desenha o fluxo a partir de /api/fluxo e se redesenha quando o servidor avisa que uma pasta mudou.
// Texto vindo das pastas é dado: tudo entra por textContent, nunca por innerHTML.
import { icone, personagem, pintarCeu, sala, salaProducao, ehApp, corDoPerfil } from './pixel';
import { desenharPlanta } from './escritorio';

type Item = {
  perfil: string; nome: string; titulo: string; data: string | null; status: string; videos: string[]; roteiros: string[];
  resumo: string; link: string; insight: string; notas: string; sessao: number | null; pedidos: number; etapas: string[]; mudou?: number; agendado?: string;
};
type Fluxo = { perfis: string[]; arrobas: Record<string, string>; status: string[]; itens: Item[]; arquivados?: Item[]; bancos?: Record<string, string[]> };

const NOMES: Record<string, string> = { roteiro: 'Roteiro', produzindo: 'Produzindo', revisar: 'Revisar', pronto: 'Pronto', publicado: 'Publicado' };
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

let dados: Fluxo = { perfis: [], arrobas: {}, status: [], itens: [] };
let filtro = 'todos';
let busca = '';
let aberto: { perfil: string; nome: string } | null = null;
let versaoVideo: string | null = null;
let versaoRoteiro: string | null = null;

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

// ── privacidade: o olho esconde o nome dos projetos, trocando as letras como numa criptografia ──
let privado = false;
try { privado = localStorage.getItem('editos-privado') === '1'; } catch { /* sem armazenamento */ }
const GLIFOS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&';
function cifra(s: string) {
  let h = 2166136261;
  return [...s].map((c, i) => { h = Math.imul(h ^ (c.charCodeAt(0) + i * 31), 16777619); return GLIFOS[(h >>> 0) % GLIFOS.length]; }).join('');
}
const NOME = (s: string) => (privado ? cifra(s) : s);
const ARROBA = (a: string) => (privado && a ? `@${cifra(a.slice(1))}` : a);
const nomeEl = (s: string, className = '') => el('span', { className: `cifra ${className}`.trim() }, NOME(s));
// a troca anima: cada letra gira por símbolos aleatórios e assenta da esquerda pra direita
function animarCifras() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const alvos = [...document.querySelectorAll<HTMLElement>('.cifra')].map((e) => ({ e, fim: e.textContent ?? '' }));
  let passo = 0;
  const giro = setInterval(() => {
    passo++;
    for (const { e, fim } of alvos) e.textContent = [...fim].map((c, i) => (i < (passo / 14) * fim.length ? c : GLIFOS[Math.floor(Math.random() * GLIFOS.length)])).join('');
    if (passo >= 14) clearInterval(giro);
  }, 35);
}
const cor = (s: string) => `var(--s-${s})`;
const avatar = (p: string, tam = 24) => el('span', { className: 'avatar' }, personagem(NOME(p), tam));
const dataCurta = (d: string | null) => { if (!d) return ''; const [dd, mm] = d.split('/'); return `${Number(dd)} ${MESES[Number(mm) - 1]}`; };
const url = (rota: string, i: Item, arquivo: string) =>
  `/api/${rota}?perfil=${encodeURIComponent(i.perfil)}&nome=${encodeURIComponent(i.nome)}&arquivo=${encodeURIComponent(arquivo)}`;
const chave = (i: { perfil: string; nome: string }) => `${i.perfil}/${i.nome}`;
const visiveis = () => dados.itens.filter((i) => (filtro === 'todos' || i.perfil === filtro) && (!busca || `${i.titulo} ${i.perfil} ${i.resumo}`.toLowerCase().includes(busca)));

// ── barra lateral e topo ──
function desenharLado() {
  const conta = (p: string) => dados.itens.filter((i) => p === 'todos' || i.perfil === p).length;
  const item = (p: string) => el('button', { className: 'nav-item', 'aria-current': String(filtro === p), onclick: () => trocarPerfil(p) },
    p === 'todos' ? el('span', { className: 'avatar todos' }, icone('quadro', 12)) : avatar(p),
    p === 'todos' ? el('span', { className: 'nome' }, 'Todos os perfis') : nomeEl(p, 'nome'), el('span', { className: 'conta-n' }, String(conta(p))));
  $('nav-todos').replaceChildren(item('todos'));
  $('nav-perfis').replaceChildren(...dados.perfis.map(item));
  const sel = $('seletor-perfil') as HTMLSelectElement;
  sel.replaceChildren(...['todos', ...dados.perfis].map((p) => el('option', { value: p, selected: filtro === p }, p === 'todos' ? 'Todos os perfis' : NOME(p))));
}

function desenharTopo() {
  const titulo = $('titulo');
  titulo.replaceChildren(filtro === 'todos' ? 'Todos os perfis' : nomeEl(filtro),
    filtro !== 'todos' && dados.arrobas[filtro] ? el('small', { className: 'cifra' }, ARROBA(dados.arrobas[filtro])) : '');
  const da = dados.itens.filter((i) => filtro === 'todos' || i.perfil === filtro);
  const n = (s: string) => da.filter((i) => i.status === s).length;
  $('numeros').replaceChildren(
    el('span', {}, el('b', {}, String(n('roteiro') + n('produzindo'))), 'em criação'),
    el('span', {}, el('b', {}, String(n('revisar'))), 'para revisar'),
    el('span', {}, el('b', {}, String(n('pronto'))), 'prontos'),
    el('span', {}, el('b', {}, String(n('publicado'))), 'publicados'));
  // a barra mostra de relance onde os vídeos estão: um trecho por etapa, do tamanho da quantidade
  const barra = $('distribuicao');
  barra.setAttribute('aria-label', dados.status.map((s) => `${NOMES[s]}: ${n(s)}`).join(', '));
  barra.replaceChildren(...dados.status.filter(n).map((s) => el('span', { style: `flex:${n(s)};background:${cor(s)}`, title: `${NOMES[s]}: ${n(s)}` })));
}

function trocarPerfil(p: string) { filtro = p; desenhar(); }

// ── quadro ──
function desenharQuadro() {
  const itens = visiveis();
  $('quadro').replaceChildren(...dados.status.map((s) => {
    const da = itens.filter((i) => i.status === s);
    const lista = el('div', { className: 'cartoes' }, ...(da.length ? da.map(cartao) : [el('div', { className: 'vazio-col' }, busca ? 'nada com essa busca' : 'nada aqui ainda')]));
    const col = el('section', { className: 'coluna', 'aria-label': NOMES[s] },
      el('div', { className: 'coluna-topo' }, el('span', { style: `color:${cor(s)}` }, icone(s, 24)), NOMES[s], el('span', { className: 'conta' }, String(da.length))),
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

// sessão do Claude mexendo agora: últimos 10 minutos
const TRABALHANDO = 10 * 60 * 1000;
const trabalhando = (i: Item) => !!i.sessao && Date.now() - i.sessao < TRABALHANDO;
function haQuanto(t: number) { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'agora' : `há ${m} min`; }

function cartao(i: Item) {
  const ultimo = i.videos[i.videos.length - 1];
  const mini = el('div', { className: 'miniatura' }, ultimo
    ? el('img', { src: url('capa', i, ultimo), alt: '', loading: 'lazy', onerror: (e: Event) => (e.target as HTMLElement).replaceWith(icone('filme', 24)) })
    : icone('doc', 24));
  const c = el('button', {
    className: trabalhando(i) ? 'cartao ativo' : 'cartao', draggable: 'true', 'aria-current': String(!!aberto && chave(aberto) === chave(i)),
    'aria-label': `${i.titulo}, ${NOME(i.perfil)}, ${NOMES[i.status]}`, onclick: () => abrir(i),
  }, mini, el('div', { className: 'cartao-corpo' },
    trabalhando(i) ? el('div', { className: 'trabalhando', title: 'Uma sessão do Claude está mexendo neste vídeo' }, el('span', { className: 'ponto-vivo' }), `Claude aqui · ${haQuanto(i.sessao!)}`) : null,
    el('div', { className: 'cartao-titulo' }, i.titulo),
    i.resumo && !i.videos.length ? el('div', { className: 'cartao-resumo' }, i.resumo) : null,
    el('div', { className: 'cartao-meta' },
      filtro === 'todos' ? el('span', { className: 'perfil' }, avatar(i.perfil, 16), nomeEl(i.perfil)) : null,
      i.videos.length ? el('span', { className: 'pixel' }, `v${i.videos.length}`) : null,
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
    el('div', { className: 'secao-cab' }, icone(icone_, 12), titulo, acoes ? el('div', { className: 'acoes' }, acoes) : null), ...corpo);
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

  $('ficha-origem').replaceChildren(avatar(i.perfil), nomeEl(i.perfil), i.data ? el('span', { className: 'pixel' }, `· ${i.data}`) : '');
  $('ficha-titulo').textContent = i.titulo;
  desenharEstados(i);

  const blocos: Node[] = [];
  // vídeo
  if (i.videos.length) {
    const v = versaoVideo && i.videos.includes(versaoVideo) ? versaoVideo : i.videos[i.videos.length - 1];
    const video = el('video', { controls: true, preload: 'metadata', src: url('arquivo', i, v), poster: url('capa', i, v) });
    const pills = el('div', { className: 'versoes' }, ...[...i.videos].reverse().map((x) =>
      el('button', { className: 'versao', 'aria-pressed': String(x === v), onclick: () => { versaoVideo = x; desenharFicha(true); } }, x.replace(/\.mp4$/i, ''))));
    blocos.push(secao('filme', `Vídeo · ${i.videos.length} ${i.videos.length > 1 ? 'versões' : 'versão'}`, null, pills, el('div', { className: 'palco' }, video)));
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
  const abrirLink = i.link && /^https?:\/\//.test(i.link) ? el('a', { className: 'btn', href: i.link, target: '_blank', rel: 'noopener noreferrer' }, icone('externo', 12), 'Abrir') : null;
  blocos.push(secao('publicado', 'Publicação', null, el('div', { className: 'linha-campo' }, link, abrirLink),
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
    el('button', { className: 'estado', style: `--cor:${cor(s)}`, 'aria-pressed': String(i.status === s), onclick: () => i.status !== s && mudarStatus(i, s) },
      icone(s, 24), NOMES[s])));
}

// ── ligar tudo ──
// ── escritório: uma sala por perfil. Clicar entra no fluxo daquele perfil ──
function desenharEscritorio() {
  const etapas = (lista: Item[]) => dados.status.map((s) => ({ s, n: lista.filter((i) => i.status === s).length }));
  const chips = (lista: Item[]) => el('div', { className: 'sala-etapas' }, ...etapas(lista).filter((e) => e.n && e.s !== 'publicado').map((e) =>
    el('span', { title: NOMES[e.s] }, el('span', { style: `color:${cor(e.s)}` }, icone(e.s, 12)), el('b', {}, String(e.n)), NOMES[e.s].toLowerCase())));
  const entrar = (p: string) => () => { filtro = p; desenhar(); alternar('fluxo', true); };

  const producao = el('button', { className: 'sala sala-producao', type: 'button', onclick: entrar('todos'), 'aria-label': 'Sala de produção: abrir o fluxo de todos os perfis' },
    ehApp() ? el('div', { className: 'sala-topo' }, el('span', { className: 'sala-selo' }, icone('quadro', 24))) : salaProducao(etapas(dados.itens).map((e) => ({ cor: cor(e.s), n: e.n }))),
    el('div', { className: 'placa' },
      el('div', { className: 'placa-nome' }, ehApp() ? null : icone('quadro', 12), 'Sala de produção'),
      el('div', { className: 'placa-sub' }, 'O quadro de todos os perfis'), chips(dados.itens)));

  const ativas = new Set<string>();
  const salas = dados.perfis.map((p) => {
    const lista = dados.itens.filter((i) => i.perfil === p);
    const agora = lista.find(trabalhando);
    if (agora) ativas.add(p);
    const ultimo = lista[0];
    return el('button', { className: agora ? 'sala ativa' : 'sala', type: 'button', onclick: entrar(p), 'aria-label': `Sala ${NOME(p)}: abrir o fluxo deste perfil` },
      ehApp() ? el('div', { className: 'sala-topo' }, avatar(p, 48)) : sala(p),
      el('div', { className: 'placa' },
        el('div', { className: 'placa-nome' }, ehApp() ? null : avatar(p, 16), nomeEl(p)),
        el('div', { className: 'placa-sub' }, dados.arrobas[p] ? nomeEl(dados.arrobas[p].slice(1)) : `${lista.length} vídeos`),
        chips(lista),
        el('div', { className: agora ? 'placa-agora ligado' : 'placa-agora' },
          agora ? el('span', { className: 'ponto-vivo' }) : null,
          agora ? `Claude trabalhando em “${agora.titulo}”` : ultimo ? `Sala quieta · último: ${ultimo.titulo}` : 'Sala vazia')));
  });
  $('salas').replaceChildren(producao, ...salas);
  $('escritorio-resumo').textContent = ativas.size
    ? `${ativas.size} ${ativas.size > 1 ? 'salas trabalhando' : 'sala trabalhando'} agora · ${dados.perfis.length} perfis`
    : `Tudo quieto · ${dados.perfis.length} perfis · ${dados.itens.length} vídeos`;
  desenharMapa();
}

// ── o Escritório visto de cima: a planta é desenho; por cima, um botão por sala (teclado e leitor de tela) ──
const tela = Object.assign(document.createElement('canvas'), { className: 'planta' });

// ── navegar no escritório: arrastar (com inércia), rolar, Ctrl + rolar pra zoom. Tudo desliza num laço de quadros:
// o mouse só muda o ALVO, e a vista anda até ele a cada quadro. Zoom 1 = o tamanho que cabe na janela (o máximo) ──
const ZOOM_MIN = 0.3;
const vista = { z: 1, x: 0, y: 0, base: 0, razao: 2, cw: 0, ch: 0, pronta: false };
const alvo = { z: 1, x: 0, y: 0 };
const embalo = { x: 0, y: 0 }; // velocidade que sobra depois de soltar o arrasto
let laco = 0, arrastando = false;

function medir() {
  const caixa = $('mapa-rolagem');
  vista.cw = caixa.clientWidth; vista.ch = caixa.clientHeight;
  vista.razao = Number($('mapa').style.getPropertyValue('--razao') || 2);
}
function prender(v: { z: number; x: number; y: number }) { // nunca deixa o escritório sumir
  const w = vista.base * v.z, h = w / vista.razao, folga = 120;
  v.x = Math.min(vista.cw - folga, Math.max(folga - w, v.x));
  v.y = Math.min(vista.ch - folga, Math.max(folga - h, v.y));
}
function pintarVista() {
  const m = $('mapa');
  m.style.transform = `translate3d(${vista.x}px, ${vista.y}px, 0) scale(${vista.z})`;
  $('zoom-valor').textContent = `${Math.round(alvo.z * 100)}%`;
}
function animar() {
  laco = 0;
  if (!arrastando && (embalo.x || embalo.y)) {
    alvo.x += embalo.x; alvo.y += embalo.y;
    embalo.x *= 0.9; embalo.y *= 0.9;
    if (Math.hypot(embalo.x, embalo.y) < 0.2) embalo.x = embalo.y = 0;
  }
  prender(alvo);
  const k = arrastando ? 1 : 0.2; // no arrasto o mapa gruda no dedo; o resto desliza
  vista.z += (alvo.z - vista.z) * k; vista.x += (alvo.x - vista.x) * k; vista.y += (alvo.y - vista.y) * k;
  const parado = Math.abs(alvo.z - vista.z) < 0.0005 && Math.abs(alvo.x - vista.x) < 0.3 && Math.abs(alvo.y - vista.y) < 0.3 && !embalo.x && !embalo.y;
  if (parado) Object.assign(vista, alvo);
  pintarVista();
  if (!parado) laco = requestAnimationFrame(animar);
}
const mexer = () => { if (!laco) laco = requestAnimationFrame(animar); };
function centralizar(suave = false) {
  medir();
  if (!vista.cw) return;
  vista.base = Math.max(680, Math.min(vista.cw, vista.ch * vista.razao));
  $('mapa').style.width = `${vista.base}px`;
  alvo.z = Math.min(1, vista.cw / vista.base);
  alvo.x = (vista.cw - vista.base * alvo.z) / 2;
  alvo.y = (vista.ch - (vista.base * alvo.z) / vista.razao) / 2;
  embalo.x = embalo.y = 0;
  if (!suave || !vista.pronta) Object.assign(vista, alvo);
  vista.pronta = true;
  pintarVista(); mexer();
}
const zoomMax = () => (salaFoco ? 2.4 : 1); // a visão focada aproxima mais que o zoom manual
function zoomEm(novo: number, cx: number, cy: number) {
  const z = Math.min(zoomMax(), Math.max(ZOOM_MIN, novo));
  alvo.x = cx - ((cx - alvo.x) * z) / alvo.z;
  alvo.y = cy - ((cy - alvo.y) * z) / alvo.z;
  alvo.z = z;
  mexer();
}
{
  const caixa = $('mapa-rolagem');
  caixa.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = caixa.getBoundingClientRect();
    const passo = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // rodinha em linhas ou em pixels
    if (e.ctrlKey) zoomEm(alvo.z * Math.exp(-passo * 0.0018), e.clientX - r.left, e.clientY - r.top);
    else { alvo.x -= e.shiftKey ? passo : e.deltaX; alvo.y -= e.shiftKey ? 0 : passo; mexer(); }
  }, { passive: false });
  // arrastar: só vira arrasto depois de 4 px, pra o clique na sala continuar funcionando
  let inicio: { x: number; y: number; vx: number; vy: number; id: number } | null = null, arrastou = false;
  let ultimo = { x: 0, y: 0, t: 0 };
  caixa.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('.zoom')) return;
    inicio = { x: e.clientX, y: e.clientY, vx: alvo.x, vy: alvo.y, id: e.pointerId }; arrastou = false;
    embalo.x = embalo.y = 0; ultimo = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  });
  caixa.addEventListener('pointermove', (e) => {
    if (!inicio || e.pointerId !== inicio.id) return;
    const dx = e.clientX - inicio.x, dy = e.clientY - inicio.y;
    if (!arrastou && Math.hypot(dx, dy) < 4) return;
    if (!arrastou) { arrastou = true; arrastando = true; caixa.classList.add('arrastando'); caixa.setPointerCapture(e.pointerId); }
    const dt = Math.max(1, e.timeStamp - ultimo.t);
    embalo.x = ((e.clientX - ultimo.x) / dt) * 16; embalo.y = ((e.clientY - ultimo.y) / dt) * 16; // px por quadro
    ultimo = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    alvo.x = inicio.vx + dx; alvo.y = inicio.vy + dy; mexer();
  });
  const soltar = (e: PointerEvent) => {
    if (arrastando && e.timeStamp - ultimo.t > 80) embalo.x = embalo.y = 0; // parou antes de soltar: sem embalo
    inicio = null; arrastando = false; caixa.classList.remove('arrastando'); mexer();
  };
  caixa.addEventListener('pointerup', soltar); caixa.addEventListener('pointercancel', soltar);
  caixa.addEventListener('click', (e) => { if (arrastou) { e.stopPropagation(); e.preventDefault(); arrastou = false; } }, true);
  const meio = () => [vista.cw / 2, vista.ch / 2] as const;
  $('zoom-mais').addEventListener('click', () => zoomEm(alvo.z * 1.3, ...meio()));
  $('zoom-menos').addEventListener('click', () => zoomEm(alvo.z / 1.3, ...meio()));
  $('zoom-centro').addEventListener('click', () => centralizar(true));
  addEventListener('resize', () => { if (abertos.includes('escritorio')) centralizar(); });
}
let quadroMapa = 0;
// a vida do escritório: 2 quadros por segundo, só com a janela aberta e o movimento permitido
setInterval(() => {
  if (!abertos.includes('escritorio') || laco || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  quadroMapa++;
  desenharPlanta(tela, mapaSalas(), raiz.dataset.tema || 'noite', quadroMapa);
}, 500);
function mapaSalas() {
  const etapas = dados.status.map((s) => ({ cor: cor(s), n: dados.itens.filter((i) => i.status === s).length }));
  return [{ nome: 'producao', cor: '#ffb84d', producao: true, pilhas: etapas, ativa: dados.itens.some(trabalhando) },
    ...dados.perfis.map((p) => ({ nome: p, cor: corDoPerfil(p), producao: false, pilhas: [], ativa: dados.itens.some((i) => i.perfil === p && trabalhando(i)) }))];
}
function desenharMapa() {
  const salasMapa = mapaSalas();
  const { W, H, caixas } = desenharPlanta(tela, salasMapa, raiz.dataset.tema || 'noite', quadroMapa);
  const mapa = $('mapa');
  mapa.style.setProperty('--razao', String(W / H));
  const pct = (v: number, t: number) => `${(v / t) * 100}%`;
  const portas = salasMapa.map((s, k) => {
    const b = caixas[k], p = s.producao ? 'todos' : s.nome;
    const lista = dados.itens.filter((i) => p === 'todos' || i.perfil === p);
    const agora = lista.find((i) => trabalhando(i) || i.pedidos > 0) ?? (dados.bancos?.[p]?.length ? { titulo: 'o banco da sala' } as Item : undefined);
    const em = (st: string) => lista.filter((i) => i.status === st).length;
    const nome = s.producao ? 'Sala de produção' : `Sala ${NOME(p)}`;
    const entrar = () => focar(p);
    { // a sala e a barra dela juntas: é isso que o foco enquadra
      const x0 = Math.min(b.x, b.barra.x), y0 = Math.min(b.y, b.barra.y);
      const x1 = Math.max(b.x + b.w, b.barra.x + b.barra.w), y1 = Math.max(b.y + b.h, b.barra.y + b.barra.h);
      mapaCaixas[p] = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }
    const caixa = (c: { x: number; y: number; w: number; h: number }) => `left:${pct(c.x, W)};top:${pct(c.y, H)};width:${pct(c.w, W)};height:${pct(c.h, H)}`;
    // a sala em si: área de clique (o teclado e o leitor de tela usam a barra, pra não ter dois botões iguais)
    const sala_ = el('button', { className: agora ? 'porta ativa' : 'porta', type: 'button', tabindex: '-1', 'aria-hidden': 'true', style: caixa(b), onclick: entrar });
    // a barra da sala: luz de status (verde piscando = Claude trabalhando; vermelha apagada = parada), nome e números
    const numeros = ['roteiro', 'produzindo', 'revisar'].filter(em).map((st) =>
      el('span', { className: 'barra-num', title: NOMES[st] }, el('span', { style: `color:${cor(st)}` }, icone(st, 12)), String(em(st))));
    const barra = el('button', {
      className: agora ? 'sala-barra ativa' : 'sala-barra', type: 'button', style: caixa(b.barra), onclick: entrar,
      'aria-label': `${nome}, ${agora ? `Claude trabalhando em ${agora.titulo}` : 'parada'}: ${em('roteiro')} em roteiro, ${em('produzindo')} produzindo, ${em('revisar')} para revisar. Abrir o fluxo.`,
      title: agora ? `Claude trabalhando em “${agora.titulo}”` : 'Sala parada',
    },
      el('span', { className: 'luz-status', 'aria-hidden': 'true' }),
      s.producao ? icone('quadro', 12) : avatar(p, 16),
      s.producao ? el('span', { className: 'barra-nome' }, 'Sala de produção') : nomeEl(p, 'barra-nome'),
      el('span', { className: 'barra-numeros' }, ...numeros));
    // as notificações do agente: cada passo dele vira um aviso do lado de fora da barra (acima nas salas de cima, abaixo nas de baixo)
    const comPedido: { titulo: string; etapas: string[]; chave_: string }[] = lista.filter((i) => i.pedidos && i.etapas.length).map((i) => ({ titulo: i.titulo, etapas: i.etapas, chave_: chave(i) }));
    const doBanco = dados.bancos?.[p];
    if (doBanco?.length) comPedido.unshift({ titulo: 'Banco da sala', etapas: doBanco, chave_: `banco/${p}` });
    const emCima = b.barra.y < b.y;
    const avisos = comPedido.length ? el('div', {
      className: emCima ? 'sala-avisos em-cima' : 'sala-avisos', 'aria-live': 'polite',
      style: `left:${pct(b.barra.x, W)};width:${pct(b.barra.w, W)};${emCima ? `bottom:${pct(H - b.barra.y, H)}` : `top:${pct(b.barra.y + b.barra.h, H)}`}`,
    }, ...comPedido.flatMap((i) => (s.producao ? i.etapas.slice(-1) : i.etapas).map((t, n, lista_) => {
      const novo = n === lista_.length - 1, k = `${i.chave_}|${t}`;
      const a = el('div', { className: novo ? 'aviso-agente novo' : 'aviso-agente' }, novo ? el('span', { className: 'ponto-vivo' }) : null,
        el('span', {}, comPedido.length > 1 || s.producao ? `${i.titulo}: ${t}` : t));
      if (novo && !avisosVistos.has(k)) { avisosVistos.add(k); a.classList.add('entra'); }
      return a;
    }))) : null;
    return [sala_, barra, avisos];
  });
  mapaW = W;
  const f = salaFoco ? mapaCaixas[salaFoco] : null;
  mapa.replaceChildren(tela, ...portas.flat().filter((x): x is HTMLElement => !!x), ...(f ? [el('div', { className: 'foco', 'aria-hidden': 'true', style: `left:${pct(f.x, W)};top:${pct(f.y, H)};width:${pct(f.w, W)};height:${pct(f.h, H)}` })] : []));
  desenharPainel();
  if (abertos.includes('escritorio') && !vista.pronta) centralizar();
  const ativas = salasMapa.filter((s) => s.ativa && !s.producao).length;
  $('mapa-legenda').textContent = ativas
    ? `${ativas} ${ativas > 1 ? 'salas com o Claude trabalhando' : 'sala com o Claude trabalhando'} agora. Clique numa sala para abrir o fluxo dela.`
    : 'Ninguém trabalhando agora. Clique numa sala para abrir o fluxo dela.';
}

function desenhar() { desenharLado(); desenharTopo(); desenharQuadro(); desenharFicha(); desenharEscritorio(); }
// só redesenha se algo mudou de verdade: redesenhar os cartões todos é o que pesa no Fluxo
let ultimoJson = '';
async function recarregar() {
  const txt = await (await fetch('/api/fluxo', { cache: 'no-store' })).text();
  if (txt === ultimoJson) return;
  ultimoJson = txt; dados = JSON.parse(txt); desenhar();
}

$('fechar').addEventListener('click', fechar);
$('abrir-pasta').addEventListener('click', () => {
  if (!aberto) return;
  fetch('/api/abrir', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(aberto) }).then((r) => avisar(r.ok ? 'Pasta aberta' : 'Não deu para abrir'));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aberto) fechar();
  else if (e.key === 'Escape' && (verItem || verBanco || verConversa)) fecharVer();
  else if (e.key === 'Escape' && salaFoco) desfocar();
  if (e.key === '/' && abertos.includes('fluxo') && !(document.activeElement as HTMLElement)?.matches('input, textarea')) { e.preventDefault(); ($('busca') as HTMLInputElement).focus(); }
});
$('busca').addEventListener('input', (e) => { busca = (e.target as HTMLInputElement).value.trim().toLowerCase(); desenharQuadro(); });
$('seletor-perfil').addEventListener('change', (e) => trocarPerfil((e.target as HTMLSelectElement).value));

function conectar() {
  const pe = $('vivo');
  const es = new EventSource('/api/eventos');
  es.onopen = () => { pe.classList.add('ligado'); pe.querySelector('span:last-child')!.textContent = 'Ao vivo'; pe.title = 'Sincronizado com as pastas do EditOS'; };
  es.onmessage = () => recarregar();
  es.onerror = () => { pe.classList.remove('ligado'); pe.querySelector('span:last-child')!.textContent = 'Reconectando…'; pe.title = ''; };
}

// ── o sistema: ícones fixos, tema (noite ou dia), relógio e céu ──
// os ícones que moram no HTML: redesenhados quando o estilo muda (pixel no Jogo, traço no App)
function iconesFixos() {
  $('marca-icone').replaceChildren(icone('logo', 24));
  $('busca-icone').replaceChildren(icone('busca', 12));
  $('janela-icone').replaceChildren(icone('quadro', 12));
  $('fechar').replaceChildren(icone('fechar', 12));
  $('abrir-pasta').replaceChildren(icone('pasta', 12), 'Abrir pasta');
  document.querySelectorAll<HTMLElement>('[data-icone]').forEach((e) => e.replaceChildren(icone(e.dataset.icone!, 12)));
  document.querySelectorAll('.janela-fechar').forEach((e) => e.replaceChildren(icone('fechar', 12)));
}
iconesFixos();

// ── a sala focada: aproxima a sala, escurece o resto e abre o fluxo dela no painel do lado ──
let salaFoco: string | null = null, mapaW = 1;
const avisosVistos = new Set<string>(); // só o aviso novo de verdade entra com animação
const mapaCaixas: Record<string, { x: number; y: number; w: number; h: number }> = {};
function focar(p: string) {
  salaFoco = p;
  const painel = $('painel-sala');
  painel.classList.add('aberto'); painel.setAttribute('aria-hidden', 'false');
  desenharMapa();
  enquadrar();
  ($('painel-fechar') as HTMLElement | null)?.focus({ preventScroll: true });
}
// centraliza a sala focada no espaço que sobra ao lado dos painéis abertos
function enquadrar() {
  if (!salaFoco) return;
  medir();
  const ver = $('painel-ver'), larg = $('painel-sala').offsetWidth + (ver.classList.contains('aberto') ? ver.offsetWidth : 0);
  const c = mapaCaixas[salaFoco], f = vista.base / mapaW, pw = vista.cw - larg > 300 ? larg : 0;
  alvo.z = Math.min(zoomMax(), (vista.cw - pw - 64) / (c.w * f), (vista.ch - 64) / (c.h * f));
  alvo.x = (vista.cw - pw) / 2 - (c.x + c.w / 2) * f * alvo.z;
  alvo.y = vista.ch / 2 - (c.y + c.h / 2) * f * alvo.z;
  embalo.x = embalo.y = 0;
  mexer();
}
function desfocar() {
  if (!salaFoco) return;
  salaFoco = null;
  fecharVer(false);
  const painel = $('painel-sala');
  painel.classList.remove('aberto'); painel.setAttribute('aria-hidden', 'true');
  desenharMapa(); centralizar(true);
}
let painelAba: 'painel' | 'fluxo' = 'painel';
function desenharPainel() {
  if (!salaFoco) return;
  const p = salaFoco, todos = p === 'todos';
  const lista = dados.itens.filter((i) => todos || i.perfil === p);
  const agora = lista.find(trabalhando);
  const banco = dados.bancos?.[p];
  const aba = (id: 'painel' | 'fluxo', rotulo: string, ic: string) => el('button', {
    className: 'painel-aba', type: 'button', role: 'tab', 'aria-selected': String(painelAba === id),
    onclick: () => { if (painelAba !== id) { painelAba = id; desenharPainel(); $('painel-corpo').scrollTop = 0; } },
  }, icone(ic, 12), rotulo);
  $('painel-cab').replaceChildren(
    el('div', { className: 'painel-linha' },
      el('span', { className: agora || banco ? 'luz-status ligada' : 'luz-status', 'aria-hidden': 'true' }),
      todos ? icone('quadro', 12) : avatar(p, 24),
      el('div', { className: 'painel-titulo' },
        todos ? el('strong', {}, 'Sala de produção') : el('strong', {}, nomeEl(p)),
        el('small', {}, agora ? `Claude trabalhando em “${agora.titulo}”` : banco ? 'Agente atualizando o banco da sala' : `Sala parada · ${lista.length} vídeos`)),
      el('button', { className: 'btn-icone', id: 'painel-fechar', type: 'button', 'aria-label': 'Fechar a sala (Esc)', title: 'Fechar (Esc)', onclick: desfocar }, icone('fechar', 12))),
    el('div', { className: 'painel-abas', role: 'tablist', 'aria-label': 'Vistas da sala' }, aba('painel', 'Painel', 'predio'), aba('fluxo', 'Fluxo', 'quadro')));
  $('painel-corpo').replaceChildren(...(painelAba === 'painel' ? resumoDaSala(p, lista) : fluxoDaSala(lista, todos)));
  desenharVer();
}

// aba Painel: o estado geral da sala e o banco dela
function resumoDaSala(p: string, lista: Item[]): Node[] {
  const todos = p === 'todos';
  const n = (s: string) => lista.filter((i) => i.status === s).length;
  const ultimo = [...lista].sort((a, b) => Math.max(b.mudou ?? 0, b.sessao ?? 0) - Math.max(a.mudou ?? 0, a.sessao ?? 0))[0];
  const nomeBanco = todos ? 'salas.md' : 'sala.md';
  return [
    el('section', { className: 'painel-bloco' },
      el('h3', {}, 'Visão geral'),
      el('div', { className: 'painel-numeros' }, ...dados.status.map((s) =>
        el('div', { className: 'painel-num', title: NOMES[s] }, el('span', { style: `color:${cor(s)}` }, icone(s, 12)), el('b', {}, String(n(s))), el('small', {}, NOMES[s])))),
      ultimo ? el('p', { className: 'painel-ultimo' }, 'Último movimento: ', el('b', {}, ultimo.titulo), todos ? ` · ${NOME(ultimo.perfil)}` : '', ultimo.data ? ` · ${dataCurta(ultimo.data)}` : '') : null),
    el('section', { className: 'painel-bloco' },
      el('h3', {}, 'Arquivos da sala'),
      el('div', { className: 'arquivo-linha' },
        el('button', { className: 'arquivo-icone', type: 'button', 'aria-pressed': String(verBanco === p), title: 'Abrir o banco da sala', onclick: () => abrirBanco(p) },
          el('span', { className: 'arquivo-desenho' }, icone('doc', 48)), el('span', { className: 'arquivo-nome' }, nomeBanco)),
        el('div', { className: 'arquivo-info' },
          el('strong', {}, todos ? 'Protocolo das salas' : 'Banco da sala'),
          el('small', {}, todos ? 'As regras que valem pra todas as salas.' : 'O que todo agente lê antes de trabalhar neste projeto: voz, estilo, fórmula, o que foi aprovado e reprovado.'),
          el('button', { className: 'btn', type: 'button', onclick: () => abrirBanco(p) }, icone('roteiro', 12), 'Editar')))),
    todos ? null : blocoConversas(p),
  ].filter(Boolean) as Node[];
}

// aba Fluxo: os vídeos da sala por etapa
// cada etapa recolhe e abre com um clique; a escolha fica guardada no navegador
let recolhidas = new Set<string>();
try { recolhidas = new Set(JSON.parse(localStorage.getItem('editos-recolhidas') ?? '[]')); } catch { /* padrão: tudo aberto */ }
// mais novo em cima: a data do nome da pasta (DD/MM/AA); sem data, a última mexida no disco
function quandoDe(i: Item): number {
  const m = i.data?.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  return m ? Date.UTC(2000 + +m[3], +m[2] - 1, +m[1]) : (i.mudou ?? 0);
}
function fluxoDaSala(lista: Item[], todos: boolean): Node[] {
  const arquivados = (dados.arquivados ?? []).filter((i) => todos || i.perfil === lista[0]?.perfil || i.perfil === salaFoco);
  return [...dados.status, ...(arquivados.length ? ['arquivados'] : [])].map((s) => {
    const da = (s === 'arquivados' ? arquivados : lista.filter((i) => i.status === s)).slice().sort((a, b) => quandoDe(b) - quandoDe(a));
    const marca = s === 'arquivados' ? 'arquivados-aberto' : s; // Arquivados começa recolhido; as etapas, abertas
    const fechada = s === 'arquivados' ? !recolhidas.has(marca) : recolhidas.has(s);
    return el('section', { className: fechada ? 'painel-etapa recolhida' : 'painel-etapa' },
      el('h3', {}, el('button', { className: 'etapa-cab', type: 'button', 'aria-expanded': String(!fechada), onclick: () => {
        if (s === 'arquivados') { if (fechada) recolhidas.add(marca); else recolhidas.delete(marca); } else if (fechada) recolhidas.delete(s); else recolhidas.add(s);
        try { localStorage.setItem('editos-recolhidas', JSON.stringify([...recolhidas])); } catch { /* só nesta visita */ }
        desenharPainel();
      } }, el('span', { className: 'seta', 'aria-hidden': 'true' }, fechada ? '▸' : '▾'), s === 'arquivados' ? el('span', { style: 'color:var(--tinta-3)' }, icone('pasta', 12)) : el('span', { style: `color:${cor(s)}` }, icone(s, 12)), s === 'arquivados' ? 'Arquivados' : NOMES[s], el('span', { className: 'conta' }, String(da.length)))),
      ...(fechada ? [] : da.length ? da.map((i) => el('button', { className: trabalhando(i) ? 'painel-item ativo' : 'painel-item', type: 'button', 'aria-pressed': String(!!verItem && chave(verItem) === chave(i)), onclick: () => abrirVer(i) },
        el('span', { className: 'painel-mini' }, i.videos.length
          ? el('img', { src: url('capa', i, i.videos[i.videos.length - 1]), alt: '', loading: 'lazy', onerror: (e: Event) => (e.target as HTMLElement).replaceWith(icone('filme', 12)) })
          : icone('doc', 12)),
        el('span', { className: 'painel-texto' },
          el('span', { className: 'painel-nome' }, i.titulo),
          el('small', {}, [todos ? NOME(i.perfil) : '', i.videos.length ? `v${i.videos.length}` : '', i.data ? dataCurta(i.data) : '', trabalhando(i) ? 'Claude aqui' : ''].filter(Boolean).join(' · ')))))
        : [el('p', { className: 'painel-vazio' }, 'nada aqui')]),
      s === 'arquivados' && !fechada ? el('p', { className: 'painel-vazio' }, 'Roteiros cujo vídeo já está em Pronto ou Publicado. Ficam guardados aqui, fora do fluxo.') : '');
  });
}

// ── a caixa de escrever de todo o painel (conversa, Refazer, Produzir, banco da sala) ──
// cresce sozinha com o texto (sem alça de arrastar), arquivo arrastado pra cima dela vira anexo e aparece acima dela,
// Ctrl + V cola print, Ctrl + Enter envia
type Rascunho = { texto: string; anexos: File[] };
// a altura acompanha o texto até o teto do CSS (max-height); passou disso, a própria caixa rola
function crescer(t: HTMLTextAreaElement) {
  t.style.height = 'auto';
  t.style.height = `${t.scrollHeight + 2}px`;
}
document.addEventListener('input', (e) => { const t = e.target as HTMLElement; if (t instanceof HTMLTextAreaElement && t.classList.contains('campo')) crescer(t); });
document.addEventListener('focusin', (e) => { const t = e.target as HTMLElement; if (t instanceof HTMLTextAreaElement && t.classList.contains('campo')) crescer(t); });
const iconeDoArquivo = (a: File) => (a.type.startsWith('video') ? 'filme' : a.type.startsWith('image') ? 'luz' : a.type.startsWith('audio') ? 'nota' : 'doc');
type OpcoesEscrita = { placeholder: string; rotulo: string; aceitar?: (f: File) => boolean; recusa?: string; aoEnviar?: () => void };
function campoEscrita(r: Rascunho, o: OpcoesEscrita) {
  const lista = el('ul', { className: 'anexos' });
  const desenharAnexos = () => lista.replaceChildren(...r.anexos.map((a, n) => el('li', { title: `${a.name} · ${TAM(a.size)}` },
    icone(iconeDoArquivo(a), 12), el('span', {}, a.name), el('small', {}, TAM(a.size)),
    el('button', { className: 'btn-icone', type: 'button', 'aria-label': `Tirar ${a.name}`, onclick: () => { r.anexos.splice(n, 1); desenharAnexos(); } }, icone('fechar', 12)))));
  const juntar = (arqs: FileList | File[] | null | undefined) => {
    const todos = [...(arqs ?? [])], bons = o.aceitar ? todos.filter(o.aceitar) : todos;
    if (bons.length < todos.length) avisar(o.recusa ?? 'Arquivo recusado');
    if (r.anexos.length + bons.length > 20) { avisar('No máximo 20 anexos por mensagem'); return; }
    r.anexos.push(...bons); desenharAnexos();
  };
  const texto = el('textarea', { className: 'campo', rows: 1, value: r.texto, 'aria-label': o.rotulo, placeholder: o.placeholder,
    oninput: (e: Event) => { r.texto = (e.target as HTMLTextAreaElement).value; } }) as HTMLTextAreaElement;
  // arrastar arquivo por cima da caixa acende a caixa; soltar anexa
  texto.addEventListener('dragover', (e) => { if (e.dataTransfer?.types.includes('Files') && !texto.disabled) { e.preventDefault(); texto.classList.add('alvo'); } });
  texto.addEventListener('dragleave', () => texto.classList.remove('alvo'));
  texto.addEventListener('drop', (e) => { texto.classList.remove('alvo'); if (e.dataTransfer?.files.length) { e.preventDefault(); juntar(e.dataTransfer.files); } });
  texto.addEventListener('paste', (e) => { const arqs = e.clipboardData?.files; if (arqs?.length) { e.preventDefault(); juntar(arqs); } });
  texto.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && o.aoEnviar) { e.preventDefault(); o.aoEnviar(); } });
  // pra quem prefere clicar: o clipe abre a escolha de arquivos
  const entrada = el('input', { type: 'file', multiple: true, hidden: true, onchange: (e: Event) => { const i = e.target as HTMLInputElement; juntar(i.files); i.value = ''; } }) as HTMLInputElement;
  const clipe = el('button', { className: 'btn-icone', type: 'button', 'aria-label': 'Anexar arquivos', title: 'Anexar arquivos (ou arraste pra caixa de texto)', onclick: () => entrada.click() }, icone('pasta', 12)) as HTMLButtonElement;
  desenharAnexos();
  requestAnimationFrame(() => crescer(texto));
  return { texto, clipe, juntar, nos: [lista, texto, entrada] as Node[] };
}
const SO_MIDIA = { aceitar: (f: File) => /^(image|video|audio)\//.test(f.type), recusa: 'Aqui só imagem, vídeo ou áudio' };

// ── o banco da sala na aba da direita: o texto editável à mão + o pedido pro agente ──
let verBanco: string | null = null;
let bancoAberto: { perfil: string; base: string; texto: string; arquivo: string; pedido: Rascunho } | null = null;
async function abrirBanco(p: string) {
  const ver = $('painel-ver'), jaAberta = ver.classList.contains('aberto');
  verItem = null; rascunho = null; verBanco = p; verConversa = null; verDesenhado = ''; $('painel-ver').classList.remove('conversando');
  const r = await fetch(`/api/banco?perfil=${encodeURIComponent(p)}`).then((x) => (x.ok ? x.json() : null)).catch(() => null);
  if (verBanco !== p) return;
  if (!r) { avisar('Não deu para abrir o banco'); fecharVer(); return; }
  bancoAberto = { perfil: p, base: r.texto, texto: r.texto, arquivo: r.arquivo, pedido: { texto: '', anexos: [] } };
  ver.classList.add('aberto'); ver.setAttribute('aria-hidden', 'false');
  desenharPainel();
  if (!jaAberta) enquadrar();
}
function desenharBanco() {
  const b = bancoAberto;
  if (!b || b.perfil !== verBanco) return;
  if (verDesenhado === `banco|${b.perfil}`) return; // não redesenha por cima de quem está editando
  verDesenhado = `banco|${b.perfil}`;
  const todos = b.perfil === 'todos';
  const editor = el('textarea', { className: 'campo editor-banco', value: b.texto, spellcheck: false, 'aria-label': 'Texto do banco da sala',
    oninput: (e: Event) => { b.texto = (e.target as HTMLTextAreaElement).value; } });
  const pedido = campoEscrita(b.pedido, { placeholder: 'Quer que o agente mude algo? Escreva como falaria no chat (opcional). Arraste imagens, vídeos ou áudios pra cá…', rotulo: 'Pedido pro agente', ...SO_MIDIA, aoEnviar: () => enviar.click() });
  const enviar = el('button', { className: 'btn aprovar', type: 'button', onclick: async () => {
    const mudouTexto = b.texto !== b.base, temPedido = !!(b.pedido.texto.trim() || b.pedido.anexos.length);
    if (!mudouTexto && !temPedido) { avisar('Nada mudou ainda'); return; }
    enviar.disabled = true; enviar.lastChild!.textContent = 'Enviando…';
    const f = new FormData(); f.append('perfil', b.perfil);
    if (mudouTexto) { f.append('texto', b.texto); f.append('base', b.base); }
    f.append('prompt', b.pedido.texto);
    for (const a of b.pedido.anexos) f.append('anexo', a, a.name);
    const res = await fetch('/api/banco', { method: 'POST', body: f }).catch(() => null);
    enviar.disabled = false; enviar.lastChild!.textContent = 'Enviar alteração';
    if (!res?.ok) { avisar(res ? await res.text() : 'Não deu para enviar'); return; }
    const { salvo, agente } = await res.json();
    if (salvo) b.base = b.texto;
    b.pedido = { texto: '', anexos: [] }; verDesenhado = ''; desenharBanco();
    avisar(agente ? (salvo ? 'Salvo e pedido enviado pro agente' : 'Pedido enviado pro agente') : 'Banco salvo');
  } }, icone('pronto', 12), el('span', {}, 'Enviar alteração'));
  $('painel-ver').replaceChildren(
    el('div', { className: 'painel-cab' },
      el('div', { className: 'painel-linha' }, icone('doc', 12),
        el('div', { className: 'painel-titulo' }, el('strong', {}, todos ? 'Protocolo das salas' : 'Banco da sala'), el('small', {}, todos ? b.arquivo : b.arquivo.replace(b.perfil, NOME(b.perfil)))),
        el('button', { className: 'btn-icone', id: 'ver-fechar', type: 'button', 'aria-label': 'Fechar a aba (Esc)', title: 'Fechar (Esc)', onclick: () => fecharVer() }, icone('fechar', 12)))),
    el('div', { className: 'ver-corpo' },
      el('p', { className: 'dica' }, 'Edite o texto à mão, se quiser. O pedido abaixo é opcional: o agente aplica no banco depois de salvar sua edição.'),
      editor,
      el('div', { className: 'caixa-refazer' }, ...pedido.nos,
        el('div', { className: 'ver-acoes' }, enviar, pedido.clipe, el('button', { className: 'btn', type: 'button', onclick: () => fecharVer() }, 'Fechar'))),
    ));
}

// ── as conversas da sala na aba da direita: cada sala guarda várias, cada uma com nome (uma sessão do Claude cada) ──
type Fala = { quem: 'jesse' | 'sala'; texto: string; quando: string; anexos?: string[]; modelo?: string; forca?: string };
type Conversa = { chave: string; nome: string; inicio: string; modelo?: string; forca?: string; mensagens: Fala[]; rodando: boolean; andamento: { ferramentas: number; ultima: string } | null };
type ResumoConversa = { chave: string; nome: string; inicio: string; ultima: string; falas: number; rodando: boolean };
// verConversa = a sala com a aba de conversa aberta; conversaChave = qual conversa (null = uma nova, ainda sem fala)
let verConversa: string | null = null, conversaChave: string | null = null, conversa: Conversa | null = null, vigiaConversa = 0;
const conversasDaSala: Record<string, ResumoConversa[]> = {};
let fala: Rascunho = { texto: '', anexos: [] }; // o que o Jessé está escrevendo e anexando, guardado entre redesenhos
// o modelo e a força de cada resposta: o Jessé escolhe; a conversa lembra a última escolha, e a conversa nova herda a última usada
const MODELOS: [string, string][] = [['sonnet', 'Sonnet 5.5'], ['opus', 'Opus 5.5'], ['fable', 'Fable 5.2']];
const FORCAS: [string, string][] = [['low', 'Baixa'], ['medium', 'Média'], ['high', 'Alta']];
const NOME_MODELO = Object.fromEntries(MODELOS), NOME_FORCA = Object.fromEntries(FORCAS);
let escolha = { modelo: 'opus', forca: 'medium' };
try { const e = JSON.parse(localStorage.getItem('editos-conversa-escolha') ?? 'null'); if (NOME_MODELO[e?.modelo] && NOME_FORCA[e?.forca]) escolha = e; } catch { /* padrão */ }
const quandoCurto = (iso: string) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

// a lista da sala chega do servidor; a conversa não dispara a atualização ao vivo do quadro, então a página pede
async function lerListaConversas(p: string) {
  const r = await fetch(`/api/conversa?perfil=${encodeURIComponent(p)}`, { cache: 'no-store' }).then((x) => (x.ok ? x.json() : null)).catch(() => null);
  if (!r) return;
  conversasDaSala[p] = r.conversas;
  if (salaFoco === p && painelAba === 'painel') desenharPainel();
}
// o bloco "Conversas da sala" no painel, abaixo dos arquivos
function blocoConversas(p: string): Node {
  const lista = conversasDaSala[p];
  if (!lista) lerListaConversas(p);
  return el('section', { className: 'painel-bloco' },
    el('h3', {}, 'Conversas da sala'),
    el('p', { className: 'painel-ultimo' }, 'Converse com o responsável por esta sala. Ele só conhece este projeto e já começa lendo o banco da sala.'),
    lista?.length ? el('div', { className: 'conversas' }, ...lista.map((c) => el('button', {
      className: c.rodando ? 'painel-item ativo' : 'painel-item', type: 'button', 'aria-pressed': String(verConversa === p && conversaChave === c.chave),
      onclick: () => abrirConversa(p, c.chave) },
      el('span', { className: 'painel-mini' }, icone('nota', 12)),
      el('span', { className: 'painel-texto' }, el('span', { className: 'painel-nome' }, c.nome),
        el('small', {}, [quandoCurto(c.ultima), `${c.falas} ${c.falas === 1 ? 'fala' : 'falas'}`, c.rodando ? 'respondendo' : ''].filter(Boolean).join(' · ')))))) : null,
    el('button', { className: 'btn aprovar', type: 'button', 'aria-pressed': String(verConversa === p && !conversaChave), onclick: () => abrirConversa(p, null) },
      icone('nota', 12), lista?.length ? 'Nova conversa' : 'Iniciar conversa'));
}

async function lerConversa(p: string, chave: string) {
  const r = await fetch(`/api/conversa?perfil=${encodeURIComponent(p)}&conversa=${encodeURIComponent(chave)}`, { cache: 'no-store' }).then((x) => (x.ok ? x.json() : null)).catch(() => null);
  if (verConversa !== p || conversaChave !== chave) return;
  if (!r) { avisar('Não deu para abrir a conversa'); fecharVer(); return; }
  const terminou = conversa?.rodando && !r.rodando;
  if (!conversa && r.modelo && NOME_MODELO[r.modelo]) escolha = { modelo: r.modelo, forca: NOME_FORCA[r.forca] ? r.forca : escolha.forca };
  conversa = r; desenharConversa();
  if (terminou) lerListaConversas(p);
  clearTimeout(vigiaConversa);
  if (r.rodando) vigiaConversa = window.setTimeout(() => lerConversa(p, chave), 1500); // enquanto a sala responde, confere de novo
}
function abrirConversa(p: string, chave: string | null) {
  const ver = $('painel-ver'), jaAberta = ver.classList.contains('aberto');
  if (verConversa !== p || conversaChave !== chave) fala = { texto: '', anexos: [] };
  verItem = null; rascunho = null; verBanco = null; bancoAberto = null; verConversa = p; conversaChave = chave; conversa = null; verDesenhado = '';
  clearTimeout(vigiaConversa);
  ver.classList.add('aberto'); ver.setAttribute('aria-hidden', 'false');
  desenharPainel();
  if (!jaAberta) enquadrar();
  if (chave) lerConversa(p, chave);
}
async function falarNaConversa(p: string, texto: string, anexos: File[]) {
  const f = new FormData(); f.append('perfil', p); f.append('conversa', conversaChave ?? ''); f.append('texto', texto);
  f.append('modelo', escolha.modelo); f.append('forca', escolha.forca);
  for (const a of anexos) f.append('anexo', a, a.name);
  const r = await fetch('/api/conversa', { method: 'POST', body: f }).catch(() => null);
  if (!r?.ok) { avisar(r ? await r.text() : 'Não deu para enviar'); return false; }
  const novo: Conversa = await r.json();
  if (verConversa === p) { conversaChave = novo.chave; conversa = novo; verDesenhado = ''; desenharConversa(); lerConversa(p, novo.chave); }
  lerListaConversas(p);
  return true;
}
async function mexerNaConversa(p: string, chave: string, corpo: Record<string, unknown>) {
  const r = await fetch('/api/conversa', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ perfil: p, conversa: chave, ...corpo }) }).catch(() => null);
  if (!r?.ok) { avisar(r ? await r.text() : 'Não deu certo'); return false; }
  conversasDaSala[p] = (await r.json()).conversas;
  return true;
}
async function renomearConversa(p: string, chave: string, atual: string) {
  const nome = prompt('Nome desta conversa:', atual);
  if (nome === null || !nome.trim() || nome.trim() === atual) return;
  if (!(await mexerNaConversa(p, chave, { acao: 'renomear', nome }))) return;
  if (conversa?.chave === chave) conversa.nome = nome.trim();
  verDesenhado = ''; desenharPainel(); avisar('Conversa renomeada');
}
async function excluirConversa(p: string, chave: string, nome: string) {
  if (!confirm(`Excluir a conversa "${nome}"? As falas e os anexos dela são apagados de vez.`)) return;
  if (!(await mexerNaConversa(p, chave, { acao: 'excluir' }))) return;
  fecharVer(); avisar('Conversa excluída');
}
function desenharConversa() {
  const p = verConversa, chave = conversaChave, c = conversa;
  if (!p) return;
  const assinatura = `conversa|${p}|${chave ?? 'nova'}|${c ? `${c.nome}|${c.mensagens.length}|${c.rodando}|${c.andamento?.ferramentas ?? ''}` : 'carregando'}`;
  if (assinatura === verDesenhado) return; // não apaga o que o Jessé está digitando à toa
  verDesenhado = assinatura;
  const lista = el('div', { className: 'conversa-lista', role: 'log', 'aria-live': 'polite' },
    ...(chave && !c ? [el('div', { className: 'sem' }, 'Abrindo a conversa…')]
      : !c?.mensagens.length ? [el('p', { className: 'dica' }, 'Conversa nova. O responsável pela sala já começa sabendo a voz, o estilo aprovado e o que foi reprovado neste projeto. Ela ganha um nome com o começo da sua primeira mensagem, e você renomeia quando quiser.')]
      : c.mensagens.map((m) => el('div', { className: `fala fala-${m.quem}` },
        el('small', {}, [m.quem === 'jesse' ? 'Você' : 'Sala', m.quem === 'sala' && m.modelo ? `${NOME_MODELO[m.modelo] ?? m.modelo}${m.forca ? `, ${(NOME_FORCA[m.forca] ?? m.forca).toLowerCase()}` : ''}` : '', quandoCurto(m.quando)].filter(Boolean).join(' · ')),
        m.quem === 'sala' ? markdown(m.texto) : m.texto ? el('p', {}, m.texto) : null,
        m.anexos?.length ? el('ul', { className: 'fala-anexos' }, ...m.anexos.map((a) => el('li', {}, icone('pasta', 12), a.replace(/^\d{2}-/, '')))) : null))),
    c?.rodando ? el('div', { className: 'ver-fila' }, el('span', { className: 'ponto-vivo' }),
      c.andamento?.ferramentas ? `A sala está trabalhando · ${c.andamento.ferramentas} passos · agora: ${c.andamento.ultima}` : 'A sala está pensando…') : null);
  const mandar = async () => {
    if ((!fala.texto.trim() && !fala.anexos.length) || conversa?.rodando) return;
    const enviada = fala; fala = { texto: '', anexos: [] };
    if (!(await falarNaConversa(p, enviada.texto, enviada.anexos))) { fala = enviada; verDesenhado = ''; desenharConversa(); }
  };
  const escrita = campoEscrita(fala, { placeholder: c?.rodando ? 'Espere a sala responder…' : 'Escreva pra sala. Arraste ou cole imagens, áudios e arquivos aqui…', rotulo: 'Sua mensagem pra sala', aoEnviar: mandar });
  const campo = escrita.texto;
  // a barrinha de 3 pontos (modelo e força): clica no ponto ou no nome, ou usa as setas do teclado
  const seletor = (rotulo: string, opcoes: [string, string][], chaveEscolha: 'modelo' | 'forca') => {
    const barra = el('div', { className: 'barra3', role: 'radiogroup', 'aria-label': rotulo });
    const pintar = () => {
      const i = opcoes.findIndex(([v]) => v === escolha[chaveEscolha]);
      barra.style.setProperty('--n', String(Math.max(0, i)));
      barra.querySelectorAll<HTMLButtonElement>('button').forEach((b, k) => { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    };
    const escolher = (k: number) => {
      escolha = { ...escolha, [chaveEscolha]: opcoes[k][0] };
      try { localStorage.setItem('editos-conversa-escolha', JSON.stringify(escolha)); } catch { /* só nesta visita */ }
      pintar();
    };
    barra.append(el('span', { className: 'barra3-trilho', 'aria-hidden': 'true' }), ...opcoes.map(([, nome], k) => el('button', {
      type: 'button', role: 'radio', className: 'barra3-ponto', onclick: () => escolher(k),
      onkeydown: (e: KeyboardEvent) => {
        const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
        if (!d) return;
        e.preventDefault(); const n = Math.min(opcoes.length - 1, Math.max(0, k + d)); escolher(n); (barra.querySelectorAll('button')[n] as HTMLButtonElement).focus();
      } }, el('i', { 'aria-hidden': 'true' }), el('span', {}, nome))));
    pintar();
    return el('div', { className: 'seletor-ia' }, el('span', { className: 'seletor-rotulo' }, rotulo), barra);
  };
  const enviarBtn = el('button', { className: 'btn aprovar', type: 'button', title: 'Enviar (Ctrl + Enter)', onclick: mandar }, icone('pronto', 12), 'Enviar', el('kbd', {}, 'Ctrl + Enter')) as HTMLButtonElement;
  if (c?.rodando) { campo.disabled = true; enviarBtn.disabled = true; escrita.clipe.disabled = true; }
  const corpo = el('div', { className: 'ver-corpo conversa' }, lista,
    el('div', { className: 'caixa-refazer caixa-conversa' }, ...escrita.nos,
      el('div', { className: 'ver-acoes' }, escrita.clipe, seletor('Modelo', MODELOS, 'modelo'), seletor('Força', FORCAS, 'forca'), el('span', { className: 'espaco' }), enviarBtn)));
  // soltar arquivo em qualquer lugar da conversa também anexa (a caixa de texto acende)
  corpo.addEventListener('dragover', (e) => { if (e.dataTransfer?.types.includes('Files') && !conversa?.rodando) { e.preventDefault(); campo.classList.add('alvo'); } });
  corpo.addEventListener('dragleave', (e) => { if (!corpo.contains(e.relatedTarget as Node)) campo.classList.remove('alvo'); });
  corpo.addEventListener('drop', (e) => { if (e.defaultPrevented) return; e.preventDefault(); campo.classList.remove('alvo'); if (!conversa?.rodando) escrita.juntar(e.dataTransfer?.files); });
  // renomear e excluir só existem pra conversa que já tem nome (depois da primeira fala)
  const acoes = c && chave ? [
    el('button', { className: 'btn-icone', type: 'button', 'aria-label': 'Renomear a conversa', title: 'Renomear', onclick: () => renomearConversa(p, chave, c.nome) }, icone('roteiro', 12)),
    el('button', { className: 'btn-icone', type: 'button', 'aria-label': 'Excluir a conversa', title: 'Excluir', onclick: () => excluirConversa(p, chave, c.nome) }, icone('lixo', 12)),
  ] : [];
  $('painel-ver').classList.add('conversando');
  $('painel-ver').replaceChildren(
    el('div', { className: 'painel-cab' },
      el('div', { className: 'painel-linha' }, avatar(p, 24),
        el('div', { className: 'painel-titulo' }, el('strong', {}, c?.nome || 'Conversa nova'), el('small', {}, `${NOME(p)}${c ? ` · começou ${quandoCurto(c.inicio)}` : ''}`)),
        ...acoes,
        el('button', { className: 'btn-icone', id: 'ver-fechar', type: 'button', 'aria-label': 'Fechar a aba (Esc)', title: 'Fechar (Esc)', onclick: () => fecharVer() }, icone('fechar', 12)))),
    corpo);
  lista.scrollTop = lista.scrollHeight;
  if (!c?.rodando) campo.focus({ preventScroll: true });
}

// ── Refazer: o pedido de alteração, com texto e anexos arrastados, que vai pro agente da sala ──
let rascunho: Rascunho | null = null;

// ── Publicar: confirma título, descrição e quando, e manda pro YouTube pelo Buffer (nada sai sem este clique) ──
type Pub = { redes: string[]; titulo: string; descricao: string; legenda: string; privacidade: string; categoria: string; quando: string; data: string; paraCriancas: boolean; feitoComIA: boolean };
let publicando: Pub | null = null;
const novaPublicacao = (i: Item): Pub => ({ redes: [], titulo: i.titulo.charAt(0).toUpperCase() + i.titulo.slice(1), descricao: '', legenda: '', privacidade: 'public', categoria: '', quando: 'agora', data: '', paraCriancas: false, feitoComIA: false });
const CATEGORIAS_YT: [string, string][] = [['27', 'Educação'], ['22', 'Pessoas e blogs'], ['24', 'Entretenimento'], ['1', 'Filmes e animação'], ['29', 'Sem fins lucrativos e ativismo'], ['28', 'Ciência e tecnologia'], ['26', 'Guias e estilo'], ['25', 'Notícias e política'], ['23', 'Comédia'], ['10', 'Música']];
const NOME_REDE: Record<string, string> = { youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook' };
function caixaPublicar(i: Item, video: string) {
  const p = publicando!;
  const caixa = el('div', { className: 'caixa-refazer caixa-publicar' }, el('div', { className: 'sem' }, 'Conferindo a conexão com o Buffer…'));
  fetch(`/api/publicar?perfil=${encodeURIComponent(i.perfil)}`).then((r) => r.json()).then((s: { pronto: boolean; faltando: string[]; redes: string[] }) => {
    if (!s.pronto) {
      caixa.replaceChildren(el('p', {}, el('b', {}, 'Ainda não dá pra publicar deste perfil. '), `Falta configurar: ${s.faltando.join(', ')}.`),
        el('p', { className: 'dica' }, 'O passo a passo está no LEIA.md do painel, seção "Publicar".'));
      return;
    }
    if (!p.redes.length) p.redes = [...s.redes]; // começa com todas as redes conectadas marcadas
    const campo = (rotulo: string, filho: HTMLElement) => el('label', { className: 'pub-campo' }, el('span', {}, rotulo), filho);
    const liga = <T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(e: T, k: keyof Pub) => {
      e.addEventListener(e instanceof HTMLInputElement && e.type === 'checkbox' ? 'change' : 'input', () => {
        (p as any)[k] = e instanceof HTMLInputElement && e.type === 'checkbox' ? e.checked : e.value;
        mostrar();
      });
      return e;
    };
    const marca = (k: keyof Pub, texto: string) => el('label', { className: 'pub-marca' }, liga(el('input', { type: 'checkbox', checked: (p as any)[k] }) as HTMLInputElement, k), texto);
    const sel = (k: keyof Pub, ops: [string, string][]) => liga(el('select', { className: 'campo' }, ...ops.map(([v, t_]) => el('option', { value: v, selected: (p as any)[k] === v }, t_))) as HTMLSelectElement, k);
    // as redes: uma marcação por canal conectado
    const redes = el('div', { className: 'pub-redes', role: 'group', 'aria-label': 'Onde publicar' }, ...s.redes.map((r) => {
      const cx = el('input', { type: 'checkbox', checked: p.redes.includes(r) }) as HTMLInputElement;
      cx.addEventListener('change', () => { p.redes = cx.checked ? [...p.redes, r] : p.redes.filter((x) => x !== r); mostrar(); });
      return el('label', { className: 'pub-rede' }, cx, NOME_REDE[r] ?? r);
    }));
    const titulo = liga(el('input', { className: 'campo', value: p.titulo, maxLength: 100 }) as HTMLInputElement, 'titulo');
    const blocoYT = el('div', { className: 'pub-bloco' },
      el('strong', { className: 'pub-sub' }, 'YouTube'),
      campo('Título (até 100 caracteres)', titulo),
      campo('Descrição', liga(el('textarea', { className: 'campo', rows: 3, value: p.descricao, maxLength: 5000, placeholder: 'Descrição do vídeo no YouTube (opcional)' }) as HTMLTextAreaElement, 'descricao')),
      el('div', { className: 'pub-linha' },
        campo('Categoria', sel('categoria', [['', 'Escolha…'], ...CATEGORIAS_YT])),
        campo('Visibilidade', sel('privacidade', [['public', 'Público'], ['unlisted', 'Não listado'], ['private', 'Privado']]))),
      marca('paraCriancas', 'Feito para crianças'));
    const blocoReels = el('div', { className: 'pub-bloco' },
      el('strong', { className: 'pub-sub' }, 'Instagram e Facebook (Reels)'),
      campo('Legenda (até 2.200 caracteres)', liga(el('textarea', { className: 'campo', rows: 4, value: p.legenda, maxLength: 2200, placeholder: 'Legenda do Reels, com hashtags se quiser' }) as HTMLTextAreaElement, 'legenda')));
    const dataCampo = campo('Data e hora', liga(el('input', { className: 'campo', type: 'datetime-local', value: p.data }) as HTMLInputElement, 'data'));
    const aviso = el('p', { className: 'dica pub-aviso' });
    function mostrar() {
      blocoYT.hidden = !p.redes.includes('youtube');
      blocoReels.hidden = !p.redes.some((r) => r !== 'youtube');
      dataCampo.hidden = p.quando !== 'data';
      aviso.textContent = p.redes.includes('youtube') && p.privacidade !== 'public' && p.redes.length > 1
        ? 'Atenção: "Privado" e "Não listado" valem só pro YouTube. No Instagram e no Facebook o Reels sai público.' : '';
    }
    mostrar();
    const enviar = el('button', { className: 'btn aprovar', type: 'button', onclick: async () => {
      if (!p.redes.length) { avisar('Marque ao menos uma rede'); return; }
      if (p.redes.includes('youtube') && !p.titulo.trim()) { titulo.focus(); avisar('Escreva o título do YouTube'); return; }
      if (p.redes.includes('youtube') && !p.categoria) { avisar('Escolha a categoria do YouTube'); return; }
      if (p.quando === 'data' && !p.data) { avisar('Escolha a data e a hora'); return; }
      const ondeTxt = p.redes.map((r) => NOME_REDE[r]).join(', ').replace(/, ([^,]*)$/, ' e $1');
      const quandoTxt = p.quando === 'agora' ? 'AGORA' : p.quando === 'fila' ? 'no próximo horário da fila do Buffer' : `em ${new Date(p.data).toLocaleString('pt-BR')}`;
      if (!confirm(`Publicar este vídeo de ${NOME(i.perfil)} no ${ondeTxt} ${quandoTxt}?`)) return;
      enviar.disabled = true; enviar.lastChild!.textContent = 'Enviando o vídeo…';
      const r = await fetch('/api/publicar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
        perfil: i.perfil, nome: i.nome, video, redes: p.redes, titulo: p.titulo, descricao: p.descricao, legenda: p.legenda, privacidade: p.privacidade, categoria: p.categoria,
        quando: p.quando, dueAt: p.quando === 'data' ? new Date(p.data).toISOString() : undefined, paraCriancas: p.paraCriancas, feitoComIA: p.feitoComIA, confirmado: true,
      }) }).catch(() => null);
      enviar.disabled = false; enviar.lastChild!.textContent = 'Publicar';
      if (!r) { avisar('Não deu pra falar com o painel'); return; }
      const res = await r.json().catch(async () => ({ falhas: [await r.text()], certos: [] }));
      if (res.falhas?.length) {
        // mostra na própria caixa o que deu errado (o aviso rápido some depressa)
        aviso.textContent = `${res.certos?.length ? `Foi pro ${res.certos.join(' e ')}. ` : ''}Não foi: ${res.falhas.join(' · ')}`;
        avisar(res.certos?.length ? 'Publicado em parte' : 'Não deu para publicar');
        return;
      }
      publicando = null; verDesenhado = '';
      avisar(p.quando === 'agora' ? `Enviado pro ${ondeTxt}` : 'Agendado no Buffer');
    } }, icone('publicado', 12), el('span', {}, 'Publicar'));
    caixa.replaceChildren(
      el('strong', { className: 'pub-titulo' }, `Publicar · ${NOME(i.perfil)} · ${video.replace(/\.mp4$/i, '')}`),
      campo('Onde', redes),
      blocoYT, blocoReels,
      el('div', { className: 'pub-linha' },
        campo('Quando', sel('quando', [['agora', 'Agora'], ['fila', 'Próximo horário da fila do Buffer'], ['data', 'Escolher data e hora']])), dataCampo),
      marca('feitoComIA', 'Avisar que o vídeo tem conteúdo gerado por IA'),
      aviso,
      el('div', { className: 'ver-acoes' }, enviar, el('button', { className: 'btn', type: 'button', onclick: () => { publicando = null; verDesenhado = ''; desenharVer(); } }, 'Cancelar')),
      el('p', { className: 'dica' }, 'O vídeo sobe pro armazém da Cloudflare e o Buffer posta nas redes marcadas. "Agora" move pra Publicado; fila e data ficam em Pronto até sair.'));
  }).catch(() => caixa.replaceChildren(el('div', { className: 'sem' }, 'Não deu pra falar com o painel.')));
  return caixa;
}
const TAM = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);
function caixaRefazer(i: Item, tipo: 'refazer' | 'produzir' = 'refazer') {
  const produzir = tipo === 'produzir';
  const r = rascunho!;
  const { texto, nos, clipe } = campoEscrita(r, { placeholder: produzir ? 'Alguma observação pra produção? (opcional) Arraste imagens, vídeos ou áudios pra cá…' : 'O que você quer mudar? Escreva como falaria no chat. Arraste imagens, vídeos ou áudios pra cá…', rotulo: 'O que mudar', ...SO_MIDIA, aoEnviar: () => enviar.click() });
  const enviar = el('button', { className: 'btn aprovar', type: 'button', onclick: async () => {
    if (!produzir && !r.texto.trim() && !r.anexos.length) { texto.focus(); avisar('Escreva o que mudar'); return; }
    enviar.disabled = true; enviar.lastChild!.textContent = 'Enviando…';
    const f = new FormData(); f.append('perfil', i.perfil); f.append('nome', i.nome); f.append('texto', r.texto); f.append('tipo', tipo);
    for (const a of r.anexos) f.append('anexo', a, a.name);
    const res = await fetch('/api/refazer', { method: 'POST', body: f }).catch(() => null);
    if (!res?.ok) { enviar.disabled = false; enviar.lastChild!.textContent = produzir ? 'Confirmar produção' : 'Refazer'; avisar(res ? await res.text() : 'Não deu para enviar'); return; }
    const { agente } = await res.json();
    rascunho = null; i.status = 'produzindo'; i.pedidos++; verDesenhado = ''; desenhar();
    avisar(agente ? (produzir ? 'Produção iniciada pelo agente da sala' : 'Pedido enviado pro agente da sala') : 'Pedido guardado (agente não encontrado)');
  } }, icone(produzir ? 'produzindo' : 'roteiro', 12), el('span', {}, produzir ? 'Confirmar produção' : 'Refazer'));
  setTimeout(() => { texto.focus({ preventScroll: true }); texto.closest('.caixa-refazer')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
  return el('div', { className: 'caixa-refazer' }, ...nos,
    el('div', { className: 'ver-acoes' }, enviar, clipe, el('button', { className: 'btn', type: 'button', onclick: () => { rascunho = null; verDesenhado = ''; desenharVer(); } }, 'Cancelar')),
    el('p', { className: 'dica' }, produzir ? 'O roteiro fica aprovado, o vídeo passa pra Produzindo e o agente da sala produz o vídeo completo. A v1 chega em Revisar.' : 'O vídeo volta pra Produzindo e o agente da sala faz a próxima versão.'));
}

// ── mandar pro celular: QR com link do vídeo na rede de casa (15 min) ──
let celular: { chave: string; estado: 'carregando' | 'pronto' | 'erro'; url?: string; qr?: string; erro?: string; outros?: string[] } | null = null;
let celularRelogio = 0;
async function pedirCelular(i: Item, v: string) {
  const k = `${chave(i)}/${v}`;
  clearTimeout(celularRelogio);
  if (celular?.chave === k) { celular = null; verDesenhado = ''; desenharVer(); return; }
  celular = { chave: k, estado: 'carregando' }; verDesenhado = ''; desenharVer();
  await novoQr(i, v, k);
}
// troca o QR a cada 10 s enquanto a caixa estiver aberta e a aba visível (o link velho vence sozinho)
async function novoQr(i: Item, v: string, k: string) {
  try {
    const r = await fetch('/api/celular', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ perfil: i.perfil, nome: i.nome, video: v }) });
    const j = await r.json();
    if (celular?.chave !== k) return;
    celular = r.ok ? { chave: k, estado: 'pronto', ...j } : { chave: k, estado: 'erro', erro: j.erro ?? 'Não deu pra gerar o link.' };
  } catch { if (celular?.chave === k) celular = { chave: k, estado: 'erro', erro: 'O painel não respondeu.' }; }
  if (celular?.chave !== k) return;
  const img = document.querySelector<HTMLImageElement>('.caixa-celular .qr');
  if (img && celular.qr) img.src = celular.qr; else { verDesenhado = ''; desenharVer(); }
  if (celular.estado === 'pronto') celularRelogio = window.setTimeout(() => {
    if (celular?.chave === k && document.querySelector('.caixa-celular')) novoQr(i, v, k); else celular = null;
  }, 10_000);
}
function caixaCelular() {
  const c = celular!;
  if (c.estado === 'carregando') return el('div', { className: 'caixa-celular' }, el('p', { className: 'dica' }, 'Gerando o QR…'));
  if (c.estado === 'erro') return el('div', { className: 'caixa-celular' }, el('p', { className: 'pub-aviso' }, c.erro ?? ''));
  return el('div', { className: 'caixa-celular' },
    el('img', { className: 'qr', src: c.qr ?? '', alt: 'QR code pra baixar o vídeo no celular', width: 220, height: 220 }),
    el('div', {},
      el('strong', {}, 'Aponte a câmera do celular'),
      el('p', { className: 'dica' }, 'O celular precisa estar no mesmo Wi-Fi deste PC. O QR troca a cada 10 segundos e o vídeo baixa direto.'),
      c.outros?.length ? el('p', { className: 'pub-aviso' }, `Este PC está ligado na rede por mais de uma conexão ao mesmo tempo (${[c.url?.match(/\/\/([\d.]+):/)?.[1], ...c.outros].filter(Boolean).join(' e ')}). Isso costuma impedir o celular de chegar: desligue uma delas (por exemplo o adaptador Wi-Fi USB) e gere o QR de novo.`) : null,
      el('p', { className: 'dica' }, 'No iPhone, depois de baixar: abra o vídeo em Arquivos e toque em Compartilhar → Salvar vídeo.')));
}

// ── a aba do item: roteiro pra ler, ou o vídeo num player com Aprovar e Publicar ──
let verItem: { perfil: string; nome: string } | null = null, verDesenhado = '';
function abrirVer(i: Item) {
  const ver = $('painel-ver'), jaAberta = ver.classList.contains('aberto');
  if (!verItem || chave(verItem) !== chave(i)) { rascunho = null; publicando = null; }
  verItem = { perfil: i.perfil, nome: i.nome }; verBanco = null; bancoAberto = null; verConversa = null; conversaChave = null; verDesenhado = '';
  $('painel-ver').classList.remove('conversando');
  ver.classList.add('aberto'); ver.setAttribute('aria-hidden', 'false');
  desenharPainel(); // marca o item escolhido e desenha a aba
  if (!jaAberta) enquadrar();
  ($('ver-fechar') as HTMLElement | null)?.focus({ preventScroll: true });
}
function fecharVer(reenquadrar = true) {
  if (!verItem && !verBanco && !verConversa) return;
  verItem = null; verBanco = null; bancoAberto = null; verConversa = null; conversaChave = null; verDesenhado = ''; clearTimeout(vigiaConversa);
  const ver = $('painel-ver');
  ver.classList.remove('aberto', 'conversando'); ver.setAttribute('aria-hidden', 'true'); ver.replaceChildren();
  if (reenquadrar) { desenharPainel(); enquadrar(); }
}
function desenharVer() {
  if (verConversa) { desenharConversa(); return; }
  if (verBanco) { desenharBanco(); return; }
  if (!verItem) return;
  const i = [...dados.itens, ...(dados.arquivados ?? [])].find((x) => chave(x) === chave(verItem!));
  if (!i) { fecharVer(); return; }
  // a atualização ao vivo só redesenha se algo do item mudou: não interrompe o vídeo tocando
  const assinatura = [chave(i), i.status, i.videos.join(), i.roteiros.join(), i.titulo, privado, i.pedidos, i.agendado].join('|');
  if (assinatura === verDesenhado) return;
  verDesenhado = assinatura;
  const temVideo = i.videos.length > 0 && ['revisar', 'pronto', 'publicado'].includes(i.status);
  const cab = el('div', { className: 'painel-cab' },
    el('div', { className: 'painel-linha' },
      el('span', { style: `color:${cor(i.status)}` }, icone(temVideo ? 'filme' : 'doc', 12)),
      el('div', { className: 'painel-titulo' }, el('strong', {}, i.titulo),
        el('small', {}, [NOME(i.perfil), NOMES[i.status], i.data ? dataCurta(i.data) : ''].filter(Boolean).join(' · '))),
      el('button', { className: 'btn-icone', id: 'ver-fechar', type: 'button', 'aria-label': 'Fechar a aba (Esc)', title: 'Fechar (Esc)', onclick: () => fecharVer() }, icone('fechar', 12))));
  const corpo = el('div', { className: 'ver-corpo' });
  if (i.pedidos) corpo.append(el('div', { className: 'ver-fila' }, el('span', { className: 'ponto-vivo' }),
    `${i.pedidos > 1 ? `${i.pedidos} pedidos` : 'Pedido'} de alteração com o agente da sala. A versão nova chega aqui sozinha.`));
  if (temVideo) {
    const v = i.videos[i.videos.length - 1];
    corpo.append(
      el('div', { className: 'ver-palco' }, el('video', { controls: true, preload: 'metadata', src: url('arquivo', i, v), poster: url('capa', i, v), 'aria-label': `Vídeo ${v}` })),
      el('div', { className: 'ver-acoes' },
        i.status === 'revisar'
          ? el('button', { className: 'btn aprovar', type: 'button', onclick: () => mudarStatus(i, 'pronto') }, icone('pronto', 12), 'Aprovar')
          : el('span', { className: 'btn', 'aria-disabled': 'true' }, icone('pronto', 12), i.status === 'publicado' ? 'Publicado' : 'Aprovado'),
        i.status !== 'publicado' ? el('button', { className: 'btn', type: 'button', 'aria-expanded': String(!!rascunho), onclick: () => { rascunho = rascunho ? null : { texto: '', anexos: [] }; verDesenhado = ''; desenharVer(); } }, icone('roteiro', 12), 'Refazer') : null,
        i.status === 'publicado'
          ? null
          : el('button', { className: 'btn', type: 'button', 'aria-expanded': String(!!publicando), onclick: () => { publicando = publicando ? null : novaPublicacao(i); rascunho = null; verDesenhado = ''; desenharVer(); } }, icone('publicado', 12), 'Publicar'),
        el('button', { className: 'btn', type: 'button', 'aria-expanded': String(celular?.chave === `${chave(i)}/${v}`), title: 'Baixar no celular pelo mesmo Wi-Fi', onclick: () => pedirCelular(i, v) }, icone('filme', 12), 'Celular'),
        el('button', { className: 'btn-icone', type: 'button', 'aria-label': 'Abrir a pasta do vídeo no Explorer', title: 'Abrir no Explorer (com o vídeo selecionado)',
          onclick: () => fetch('/api/abrir', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ perfil: i.perfil, nome: i.nome, arquivo: v }) })
            .then((r) => avisar(r.ok ? 'Pasta aberta no Explorer' : 'Não deu para abrir a pasta')).catch(() => avisar('Não deu para abrir a pasta')) }, icone('pasta', 12))),
      celular?.chave === `${chave(i)}/${v}` ? caixaCelular() : '',
      i.agendado ? el('div', { className: 'ver-fila' }, icone('publicado', 12), i.agendado === 'fila do Buffer' ? 'Na fila do Buffer: sai no próximo horário da fila.' : `Agendado no Buffer pra ${new Date(i.agendado).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}.`) : '',
      rascunho ? caixaRefazer(i) : '',
      publicando ? caixaPublicar(i, v) : '',
      el('p', { className: 'dica' }, `${v.replace(/\.mp4$/i, '')} · ${i.videos.length > 1 ? `${i.videos.length} versões, mostrando a última` : 'versão única'}`));
  } else if (i.roteiros.length) {
    const leitura = el('div', {}, el('div', { className: 'sem' }, 'Carregando o roteiro…'));
    fetch(url('arquivo', i, i.roteiros[i.roteiros.length - 1])).then((x) => (x.ok ? x.text() : Promise.reject())).then((t) => leitura.replaceChildren(markdown(t)))
      .catch(() => leitura.replaceChildren(el('div', { className: 'sem' }, 'Não deu para abrir o roteiro.')));
    // roteiro aprovado: manda o agente produzir o vídeo completo (só antes de existir produção em andamento)
    const arquivado = (dados.arquivados ?? []).some((x) => chave(x) === chave(i));
    const podeProduzir = i.status === 'roteiro' && !i.pedidos && !arquivado;
    if (arquivado) corpo.append(el('div', { className: 'ver-fila' }, icone('pasta', 12), 'Arquivado: o vídeo deste roteiro já está em Pronto ou Publicado.'));
    corpo.append(
      ...(podeProduzir ? [el('div', { className: 'ver-acoes', style: 'margin:0 0 14px' },
        el('button', { className: 'btn aprovar', type: 'button', 'aria-expanded': String(!!rascunho), onclick: () => { rascunho = rascunho ? null : { texto: '', anexos: [] }; verDesenhado = ''; desenharVer(); } }, icone('produzindo', 12), 'Iniciar produção')),
        rascunho ? caixaRefazer(i, 'produzir') : null].filter(Boolean) as Node[] : []),
      leitura);
  } else corpo.append(el('div', { className: 'sem' }, 'Esta pasta ainda não tem roteiro.'));
  corpo.append(el('div', { className: 'ver-acoes' }, el('button', { className: 'btn', type: 'button', onclick: () => { const p = salaFoco!; filtro = p; desfocar(); desenhar(); alternar('fluxo', true); abrir(i); } }, icone('quadro', 12), 'Abrir a ficha no fluxo')));
  $('painel-ver').replaceChildren(cab, corpo);
}
// clique no vazio do mapa com uma sala focada: volta pra vista geral
$('mapa-rolagem').addEventListener('click', (e) => {
  if (salaFoco && !(e.target as HTMLElement).closest('.porta, .sala-barra, .zoom')) desfocar();
});

// ── programas: abrir e fechar janelas. A escolha fica guardada no navegador ──
const PROGRAMAS = ['fluxo', 'escritorio'];
let abertos: string[] = []; // a casa é o escritório: programa só abre quando pedido
try { const s = JSON.parse(localStorage.getItem('editos-abertos') ?? 'null'); if (Array.isArray(s)) abertos = s.filter((p) => PROGRAMAS.includes(p)); } catch { /* padrão */ }
function aplicarProgramas() {
  for (const p of PROGRAMAS) {
    const aberto_ = abertos.includes(p);
    ($(`app-${p}`) as HTMLElement).hidden = !aberto_;
    $(`btn-${p}`).setAttribute('aria-pressed', String(aberto_));
  }
  ($('area') as HTMLElement).hidden = abertos.length > 0;
  ($('busca-caixa') as HTMLElement).hidden = !abertos.includes('fluxo'); // a busca é do fluxo
  if (abertos.includes('escritorio') && !vista.pronta && dados.perfis.length) centralizar();
  try { localStorage.setItem('editos-abertos', JSON.stringify(abertos)); } catch { /* só nesta visita */ }
}
function alternar(p: string, abrir = !abertos.includes(p)) {
  abertos = abrir ? [p] : abertos.filter((x) => x !== p); // um programa por vez, em tela cheia
  if (!abrir && p === 'fluxo' && aberto) fechar();
  aplicarProgramas();
}
$('btn-fluxo').addEventListener('click', () => alternar('fluxo'));
$('btn-escritorio').addEventListener('click', () => alternar('escritorio'));
document.querySelectorAll<HTMLElement>('[data-abre]').forEach((e) => e.addEventListener('click', () => alternar(e.dataset.abre!, true)));
document.querySelectorAll<HTMLElement>('[data-fecha]').forEach((e) => e.addEventListener('click', () => alternar(e.dataset.fecha!, false)));
aplicarProgramas();

const raiz = document.documentElement;
function aplicarTema(tema: string) {
  raiz.dataset.tema = tema;
  const outro = tema === 'noite' ? 'dia' : 'noite';
  const b = $('tema'); b.replaceChildren(icone(outro === 'dia' ? 'sol' : 'lua', 12));
  b.setAttribute('aria-label', `Mudar para o tema ${outro}`); b.title = `Tema ${outro}`;
  pintarCeu($('ceu') as HTMLCanvasElement, tema);
  if (dados.perfis.length) desenharMapa();
}
$('tema').addEventListener('click', () => {
  const tema = raiz.dataset.tema === 'noite' ? 'dia' : 'noite';
  try { localStorage.setItem('editos-tema', tema); } catch { /* sem armazenamento: o tema vale só nesta visita */ }
  aplicarTema(tema);
});
aplicarTema(raiz.dataset.tema || 'noite');

function aplicarPrivado() {
  const b = $('privado');
  b.replaceChildren(icone(privado ? 'olhoFechado' : 'olho', 12));
  b.setAttribute('aria-pressed', String(privado));
  b.setAttribute('aria-label', privado ? 'Mostrar o nome dos projetos' : 'Esconder o nome dos projetos');
  b.title = privado ? 'Nomes escondidos (clique pra mostrar)' : 'Esconder o nome dos projetos';
}
$('privado').addEventListener('click', () => {
  privado = !privado;
  try { localStorage.setItem('editos-privado', privado ? '1' : '0'); } catch { /* só nesta visita */ }
  aplicarPrivado(); desenhar(); animarCifras();
});
aplicarPrivado();

// o estilo: Jogo (pixel) ou App (vidro liso). O tema noite/dia vale nos dois
function aplicarEstilo(estilo: string, desenharTudo = true) {
  raiz.dataset.estilo = estilo;
  document.querySelectorAll<HTMLElement>('[data-vai]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vai === estilo)));
  iconesFixos(); aplicarTema(raiz.dataset.tema!); aplicarPrivado();
  if (desenharTudo) desenhar();
}
document.querySelectorAll<HTMLElement>('[data-vai]').forEach((b) => b.addEventListener('click', () => {
  try { localStorage.setItem('editos-estilo', b.dataset.vai!); } catch { /* só nesta visita */ }
  aplicarEstilo(b.dataset.vai!);
}));
aplicarEstilo(raiz.dataset.estilo || 'jogo', false);
let esperaCeu: ReturnType<typeof setTimeout> | undefined;
addEventListener('resize', () => { clearTimeout(esperaCeu); esperaCeu = setTimeout(() => pintarCeu($('ceu') as HTMLCanvasElement, raiz.dataset.tema!), 150); });

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
function relogio() {
  const d = new Date(), dois = (n: number) => String(n).padStart(2, '0');
  $('relogio').textContent = `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}  ${dois(d.getHours())}:${dois(d.getMinutes())}`;
  $('relogio').setAttribute('datetime', d.toISOString());
}
// o selo de trabalhando some sozinho: só redesenha enquanto há selo pra apagar (antes redesenhava tudo a cada 20 s)
relogio(); setInterval(() => {
  relogio();
  if (dados.itens.some((i) => i.sessao && Date.now() - i.sessao < TRABALHANDO + 30000)) { desenharQuadro(); desenharEscritorio(); }
}, 20000);

const [hp, hn] = decodeURIComponent(location.hash.slice(1)).split('/');
if (hp && hn) aberto = { perfil: hp, nome: hn };
recarregar().then(() => { if (aberto) desenharFicha(true); conectar(); });
