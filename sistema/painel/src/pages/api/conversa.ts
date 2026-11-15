import type { APIRoute } from 'astro';
import { pastaDaSala, pastaDaConversa, listar, estado, enviar, renomear, excluir, MAX_FALA, MODELOS, FORCAS } from '../../lib/conversa';
import { ORIGENS } from '../../lib/origem';
import { anexosLivresDe } from '../../lib/pedido';

export const prerender = false;

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

// as conversas da sala.
// GET ?perfil=x             a lista (nome, quando, quantas falas)
// GET ?perfil=x&conversa=k  uma conversa inteira
// POST formulário           manda uma fala (perfil, conversa vazia = nova, texto, anexos)
// POST JSON                 { perfil, conversa, acao: 'renomear', nome } ou { perfil, conversa, acao: 'excluir' }
export const GET: APIRoute = ({ url }) => {
  const perfil = url.searchParams.get('perfil'), chave = url.searchParams.get('conversa');
  if (!pastaDaSala(perfil)) return new Response('sala não encontrada', { status: 404 });
  if (chave === null) return json({ conversas: listar(perfil!) });
  if (!pastaDaConversa(perfil, chave)) return new Response('conversa não encontrada', { status: 404 });
  return json(estado(perfil!, chave));
};

export const POST: APIRoute = async ({ request }) => {
  if (!ORIGENS.has(request.headers.get('origin') ?? '')) return new Response('origem não permitida', { status: 403 });
  if (!(request.headers.get('content-type') ?? '').startsWith('multipart/form-data')) {
    let corpo: Record<string, unknown>;
    try { corpo = await request.json(); } catch { return new Response('corpo inválido', { status: 400 }); }
    const { perfil, conversa, acao, nome } = corpo;
    if (!pastaDaConversa(perfil, conversa)) return new Response('conversa não encontrada', { status: 404 });
    const erro = acao === 'renomear' && typeof nome === 'string' ? renomear(perfil as string, conversa as string, nome)
      : acao === 'excluir' ? excluir(perfil as string, conversa as string) : 'pedido inválido';
    return erro ? new Response(erro, { status: 400 }) : json({ conversas: listar(perfil as string) });
  }
  let form: FormData;
  try { form = await request.formData(); } catch { return new Response('corpo inválido', { status: 400 }); }
  const perfil = form.get('perfil'), chave = form.get('conversa') || null, texto = form.get('texto') ?? '';
  const modelo = form.get('modelo'), forca = form.get('forca');
  if (typeof modelo !== 'string' || !Object.hasOwn(MODELOS, modelo) || typeof forca !== 'string' || !FORCAS.has(forca)) return new Response('modelo ou força inválidos', { status: 400 });
  if (!pastaDaSala(perfil)) return new Response('sala não encontrada', { status: 404 });
  if (chave !== null && typeof chave !== 'string') return new Response('conversa inválida', { status: 400 });
  const anexos = anexosLivresDe(form);
  if (typeof anexos === 'string') return new Response(anexos, { status: 400 });
  if (typeof texto !== 'string' || texto.length > MAX_FALA || (!texto.trim() && !anexos.length)) return new Response('mensagem inválida', { status: 400 });
  const r = await enviar(perfil as string, chave, texto.trim(), anexos, modelo, forca);
  return 'erro' in r ? new Response(r.erro, { status: 409 }) : json(estado(perfil as string, r.chave));
};
