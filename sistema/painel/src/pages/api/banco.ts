import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, perfis } from '../../lib/fluxo';
import { chamarAgenteBanco } from '../../lib/agente';
import { anexosDe, carimbo, gravarPedido, MAX_TEXTO } from '../../lib/pedido';

import { ORIGENS } from '../../lib/origem';

export const prerender = false;

// o banco da sala: o arquivo que todo agente lê antes de trabalhar naquele projeto.
// Perfil -> <perfil>/sala.md; Sala de produção ("todos") -> sistema/salas.md (o protocolo de todas as salas).
const MAX_BANCO = 300_000;
function bancoDe(perfil: unknown): { arq: string; pedidos: string } | null {
  if (perfil === 'todos') return { arq: path.join(RAIZ, 'sistema', 'salas.md'), pedidos: path.join(RAIZ, 'sistema', 'salas-pedidos') };
  if (typeof perfil !== 'string' || !perfis().includes(perfil)) return null;
  return { arq: path.join(RAIZ, perfil, 'sala.md'), pedidos: path.join(RAIZ, perfil, 'sala-pedidos') };
}
const ler = (arq: string) => { try { return fs.readFileSync(arq, 'utf-8'); } catch { return ''; } };

export const GET: APIRoute = ({ url }) => {
  const b = bancoDe(url.searchParams.get('perfil'));
  if (!b) return new Response('sala não encontrada', { status: 404 });
  return new Response(JSON.stringify({ texto: ler(b.arq), arquivo: path.relative(RAIZ, b.arq).replace(/\\/g, '/') }),
    { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
};

// "Enviar alteração": grava a edição manual (se houve) e, se veio pedido escrito ou anexo, chama o agente pra aplicar
export const POST: APIRoute = async ({ request }) => {
  if (!ORIGENS.has(request.headers.get('origin') ?? '')) return new Response('origem não permitida', { status: 403 });
  let form: FormData;
  try { form = await request.formData(); } catch { return new Response('corpo inválido', { status: 400 }); }
  const perfil = form.get('perfil');
  const b = bancoDe(perfil);
  if (!b) return new Response('sala não encontrada', { status: 404 });
  const texto = form.get('texto'), base = form.get('base'), prompt = form.get('prompt') ?? '';
  if (typeof prompt !== 'string' || prompt.length > MAX_TEXTO) return new Response('pedido inválido', { status: 400 });
  const anexos = anexosDe(form);
  if (typeof anexos === 'string') return new Response(anexos, { status: 400 });

  let salvo = false;
  if (texto !== null) {
    if (typeof texto !== 'string' || typeof base !== 'string' || texto.length > MAX_BANCO) return new Response('texto inválido', { status: 400 });
    // não atropela: se o banco mudou desde que o editor abriu (um agente gravou, por exemplo), recusa
    if (ler(b.arq).replace(/\r\n/g, '\n') !== base.replace(/\r\n/g, '\n')) return new Response('O banco mudou enquanto você editava. Recarregue e edite de novo.', { status: 409 });
    fs.writeFileSync(b.arq, texto.replace(/\r\n/g, '\n'), 'utf-8');
    salvo = true;
  }
  let agente = false;
  if (prompt.trim() || anexos.length) {
    const dir = path.join(b.pedidos, carimbo());
    await gravarPedido(dir, 'Pedido de alteração no banco da sala', prompt, anexos);
    agente = chamarAgenteBanco(perfil as string, b.arq, dir);
  }
  if (!salvo && !agente && !(prompt.trim() || anexos.length)) return new Response('nada pra enviar', { status: 400 });
  return new Response(JSON.stringify({ salvo, agente }), { headers: { 'content-type': 'application/json' } });
};
