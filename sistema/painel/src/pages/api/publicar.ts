import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { lerFicha, escreverFicha, pastaDoItem, nomeSeguro } from '../../lib/fluxo';
import { canaisDoPerfil, faltando, subirVideo, criarPost, REDES, type Rede, type Publicacao } from '../../lib/publicar';

import { ORIGENS } from '../../lib/origem';

export const prerender = false;
const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const NOME_REDE: Record<Rede, string> = { youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook' };

// o painel pergunta se dá pra publicar este perfil, em quais redes, e o que falta configurar. Nunca devolve chave.
export const GET: APIRoute = ({ url }) => {
  const perfil = url.searchParams.get('perfil') ?? '';
  const f = faltando(perfil);
  return json({ pronto: f.length === 0, faltando: f, redes: Object.keys(canaisDoPerfil(perfil)) });
};

// "Publicar": só com o clique de confirmação do Jessé (a regra do CLAUDE.md: publicar exige aprovação humana explícita)
const CATEGORIAS = new Set(['1', '2', '10', '15', '17', '19', '20', '22', '23', '24', '25', '26', '27', '28', '29']);
const ruim = (t: string) => new Response(t, { status: 400 });
export const POST: APIRoute = async ({ request }) => {
  if (!ORIGENS.has(request.headers.get('origin') ?? '')) return new Response('origem não permitida', { status: 403 });
  let c: Record<string, unknown>;
  try { c = await request.json(); } catch { return ruim('corpo inválido'); }
  const pasta = pastaDoItem(c.perfil, c.nome);
  if (!pasta) return new Response('item não encontrado', { status: 404 });
  const perfil = c.perfil as string, nome = c.nome as string;
  const falta = faltando(perfil);
  if (falta.length) return ruim(`Falta configurar: ${falta.join(', ')}.`);
  if (c.confirmado !== true) return ruim('publicação sem confirmação');

  // validação de fronteira: tudo que vem do navegador é dado
  const canais = canaisDoPerfil(perfil);
  const redes = Array.isArray(c.redes) ? [...new Set(c.redes)].filter((r): r is Rede => (REDES as readonly unknown[]).includes(r) && !!canais[r as Rede]) : [];
  if (!redes.length || redes.length !== (c.redes as unknown[]).length) return ruim('Escolha ao menos uma rede conectada.');
  const video = typeof c.video === 'string' && nomeSeguro(c.video) && /^v\d+.*\.mp4$/i.test(c.video) ? c.video : null;
  if (!video || !fs.existsSync(path.join(pasta, video))) return ruim('vídeo não encontrado');
  const texto = (k: string, max: number) => (typeof c[k] === 'string' ? (c[k] as string) : '');
  const titulo = texto('titulo', 100).trim(), descricao = texto('descricao', 5000), legenda = texto('legenda', 2200);
  if (/[<>]/.test(titulo + descricao)) return ruim('Título e descrição do YouTube não podem ter < ou >.');
  if (descricao.length > 5000) return ruim('A descrição do YouTube pode ter até 5.000 caracteres.');
  if (legenda.length > 2200) return ruim('A legenda pode ter até 2.200 caracteres.');
  const privacidade = ['public', 'unlisted', 'private'].includes(c.privacidade as string) ? (c.privacidade as Publicacao['privacidade']) : 'public';
  const categoria = CATEGORIAS.has(c.categoria as string) ? (c.categoria as string) : '';
  if (redes.includes('youtube')) {
    if (!titulo || titulo.length > 100) return ruim('O título do YouTube precisa ter de 1 a 100 caracteres.');
    if (!categoria) return ruim('Escolha a categoria do YouTube.');
  }
  const quando = ['agora', 'fila', 'data'].includes(c.quando as string) ? (c.quando as Publicacao['quando']) : null;
  if (!quando) return ruim('quando inválido');
  let dueAt: string | undefined;
  if (quando === 'data') {
    const d = new Date(c.dueAt as string);
    if (Number.isNaN(d.getTime()) || d.getTime() < Date.now() + 60_000) return ruim('Escolha uma data e hora no futuro.');
    dueAt = d.toISOString();
  }

  let url: string;
  try { url = await subirVideo(path.join(pasta, video), perfil, nome); }
  catch (e) { return new Response(`Não deu pra subir o vídeo pro armazém: ${(e as Error).message}`, { status: 502 }); }

  // um post por rede; se uma falhar, as outras seguem e o painel conta qual deu certo
  const pub: Publicacao = { url, quando, dueAt, feitoComIA: c.feitoComIA === true, titulo, descricao, privacidade, categoria, paraCriancas: c.paraCriancas === true, legenda };
  const resultados = await Promise.all(redes.map(async (r) => {
    try { const p = await criarPost(r, canais[r]!, pub); return { rede: r, ok: true as const, id: p.id, dueAt: p.dueAt }; }
    catch (e) { return { rede: r, ok: false as const, erro: (e as Error).message }; }
  }));
  const certos = resultados.filter((r) => r.ok);
  if (certos.length) {
    // a ficha guarda os posts do Buffer. "Agora" com tudo certo vira Publicado; fila ou data ficam em Pronto com a data
    const ficha = path.join(pasta, 'ficha.md');
    const { campos, notas } = lerFicha(ficha);
    campos.buffer = [...(campos.buffer ? campos.buffer.split(' ') : []), ...certos.map((r) => `${r.rede}:${r.id}`)].join(' ');
    campos.agendado = quando === 'agora' ? '' : (certos.find((r) => r.dueAt)?.dueAt ?? 'fila do Buffer');
    if (quando === 'agora' && certos.length === resultados.length) campos.status = 'publicado';
    else if (campos.status !== 'publicado') campos.status = 'pronto';
    escreverFicha(ficha, campos, notas);
  }
  const falhas = resultados.filter((r) => !r.ok).map((r) => `${NOME_REDE[r.rede]}: ${'erro' in r ? r.erro : ''}`);
  return json({ ok: falhas.length === 0, certos: certos.map((r) => NOME_REDE[r.rede]), falhas }, certos.length ? 200 : 502);
};
