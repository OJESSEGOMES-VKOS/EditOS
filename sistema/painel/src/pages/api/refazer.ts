import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { lerFicha, escreverFicha, pastaDoItem, RAIZ } from '../../lib/fluxo';
import { chamarAgente } from '../../lib/agente';
import { anexosDe, carimbo, gravarPedido, MAX_TEXTO } from '../../lib/pedido';

import { ORIGENS } from '../../lib/origem';

export const prerender = false;

// o pedido de alteração vindo do painel: texto + anexos (imagem, vídeo, áudio) arrastados na caixa.
// Grava em <pasta do vídeo>/refazer/<quando>/ (pedido.md + anexos), volta o vídeo pra "produzindo" e chama o agente.
export const POST: APIRoute = async ({ request }) => {
  if (!ORIGENS.has(request.headers.get('origin') ?? '')) return new Response('origem não permitida', { status: 403 });
  let form: FormData;
  try { form = await request.formData(); } catch { return new Response('corpo inválido', { status: 400 }); }
  const perfil = form.get('perfil'), nome = form.get('nome'), texto = form.get('texto') ?? '';
  const tipo = form.get('tipo') === 'produzir' ? 'produzir' : 'refazer';
  const pasta = pastaDoItem(perfil, nome);
  if (!pasta) return new Response('item não encontrado', { status: 404 });
  if (typeof texto !== 'string' || texto.length > MAX_TEXTO) return new Response('texto inválido', { status: 400 });
  const anexos = anexosDe(form);
  if (typeof anexos === 'string') return new Response(anexos, { status: 400 });
  if (tipo === 'refazer' && !texto.trim() && !anexos.length) return new Response('pedido vazio', { status: 400 });
  if (tipo === 'produzir' && !fs.readdirSync(pasta).some((a) => /^roteiro-v\d+\.(md|txt)$/i.test(a))) return new Response('Esta pasta ainda não tem roteiro', { status: 400 });

  const dir = path.join(pasta, 'refazer', carimbo());
  await gravarPedido(dir, tipo === 'produzir' ? 'Roteiro aprovado: iniciar produção' : 'Pedido de alteração', tipo === 'produzir' && !texto.trim() ? 'Roteiro aprovado. Produzir o vídeo completo.' : texto, anexos);
  const ficha = path.join(pasta, 'ficha.md');
  const { campos, notas } = lerFicha(ficha);
  campos.status = 'produzindo';
  escreverFicha(ficha, campos, notas);

  const chamado = chamarAgente(perfil as string, path.relative(RAIZ, dir).replace(/\\/g, '/'), tipo);
  return new Response(JSON.stringify({ agente: chamado }), { headers: { 'content-type': 'application/json' } });
};
