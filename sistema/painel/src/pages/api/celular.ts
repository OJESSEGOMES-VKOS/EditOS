import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import { pastaDoItem, nomeSeguro } from '../../lib/fluxo';
import { linkProCelular } from '../../lib/celular';

import { ORIGENS } from '../../lib/origem';

export const prerender = false;

// gera o QR de um vídeo pra baixar no celular pelo mesmo Wi-Fi
export const POST: APIRoute = async ({ request }) => {
  if (!ORIGENS.has(request.headers.get('origin') ?? '')) return new Response('origem não permitida', { status: 403 });
  const c = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const pasta = pastaDoItem(String(c.perfil ?? ''), String(c.nome ?? ''));
  const video = String(c.video ?? '');
  if (!pasta || !nomeSeguro(video) || path.extname(video).toLowerCase() !== '.mp4' || !fs.existsSync(path.join(pasta, video)))
    return Response.json({ erro: 'Vídeo não encontrado.' }, { status: 404 });
  try {
    const { url, outros } = await linkProCelular(path.join(pasta, video));
    const qr = await QRCode.toDataURL(url, { margin: 2, width: 360, errorCorrectionLevel: 'M' });
    return Response.json({ url, qr, outros });
  } catch (e) {
    return Response.json({ erro: (e as Error).message }, { status: 500 });
  }
};
