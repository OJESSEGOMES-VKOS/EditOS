import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { RAIZ } from './fluxo';

// mandar um vídeo pro celular pelo mesmo Wi-Fi: um servidorzinho separado na rede de casa (porta 4701) que só
// entrega o vídeo de um link com código aleatório, por 15 minutos. O painel continua só neste computador (localhost).
// Sem link válido não sai nada; quando o último link vence, o servidorzinho desliga sozinho.
const PORTA = 4701;
const VALIDADE = 25_000; // o QR troca a cada 10 s; cada link aceita o primeiro acesso por 25 s
const BAIXANDO = 10 * 60_000; // depois do primeiro acesso, só aquele celular continua, por 10 min
// guardado no processo (e não no módulo) pra sobreviver ao recarregar do código no modo dev
const g = globalThis as unknown as { __celular?: { links: Map<string, { arq: string; vence: number; ip?: string }>; servidor: http.Server | null; atender?: http.RequestListener } };
const estado = (g.__celular ??= { links: new Map(), servidor: null });
const links = estado.links;

function limpar() {
  const agora = Date.now();
  for (const [k, v] of links) if (v.vence < agora) links.delete(k);
  if (!links.size && estado.servidor) { estado.servidor.close(); estado.servidor = null; }
}
setInterval(limpar, 60_000).unref();

// o diário do celular: cada acesso que chega (ou é recusado), pra saber se o celular alcança o PC
const DIARIO = path.join(RAIZ, 'sistema', '.tmp', 'celular.log');
function anotar(linha: string) {
  try { fs.mkdirSync(path.dirname(DIARIO), { recursive: true }); fs.appendFileSync(DIARIO, `${new Date().toISOString()} ${linha}\n`); } catch { /* sem diário */ }
}

// os endereços deste PC na rede de casa (Wi-Fi e cabo, sem rede virtual). Mais de um ligado ao mesmo roteador
// (ex.: placa interna no 5G + adaptador USB no 2,4G) confunde o roteador e o celular não chega: o painel avisa.
export function ipsDaRede(): string[] {
  const ips: string[] = [];
  for (const [nome, lista] of Object.entries(os.networkInterfaces()))
    for (const a of lista ?? [])
      if (a.family === 'IPv4' && !a.internal && /^(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))\./.test(a.address) && !/vethernet|virtual|vmware|wsl|hyper-v|docker/i.test(nome))
        ips.push(a.address);
  return ips;
}

// o endereço deste PC na rede de casa (prefere o Wi-Fi, ignora rede virtual)
export function ipDaRede(): string | null {
  const cand: { nome: string; ip: string }[] = [];
  for (const [nome, lista] of Object.entries(os.networkInterfaces()))
    for (const a of lista ?? [])
      if (a.family === 'IPv4' && !a.internal && /^(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))\./.test(a.address) && !/vethernet|virtual|vmware|wsl|hyper-v|docker/i.test(nome))
        cand.push({ nome, ip: a.address });
  return (cand.find((c) => /wi-?fi|wlan|sem fio/i.test(c.nome)) ?? cand[0])?.ip ?? null;
}

function atender(req: http.IncomingMessage, res: http.ServerResponse) {
  limpar();
  const cod = (req.url ?? '').match(/^\/v\/([a-f0-9]{32})(?:\/[^/?]*)?$/)?.[1];
  const l = cod ? links.get(cod) : undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
  const quem = req.socket.remoteAddress ?? '';
  if (l && !l.ip) { l.ip = quem; l.vence = Date.now() + BAIXANDO; }
  anotar(`${req.method} de ${quem} ${!l ? 'link vencido ou inválido' : l.ip !== quem ? `recusado (o link é de ${l.ip})` : `ok ${req.headers.range ?? 'inteiro'}`}`);
  if (!l || l.ip !== quem || !fs.existsSync(l.arq)) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Link vencido. Gere outro QR no painel.'); return; }
  const total = fs.statSync(l.arq).size;
  const base = {
    'content-type': 'video/mp4', 'accept-ranges': 'bytes', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff',
    'content-disposition': `attachment; filename="${path.basename(l.arq).replace(/[^\w.-]/g, '_')}"`,
  };
  const faixa = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (faixa) {
    const ini = faixa[1] ? Number(faixa[1]) : 0;
    const fim = faixa[2] ? Math.min(Number(faixa[2]), total - 1) : total - 1;
    if (ini > fim || ini >= total) { res.writeHead(416, { 'content-range': `bytes */${total}` }).end(); return; }
    res.writeHead(206, { ...base, 'content-length': String(fim - ini + 1), 'content-range': `bytes ${ini}-${fim}/${total}` });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(l.arq, { start: ini, end: fim }).pipe(res);
    return;
  }
  res.writeHead(200, { ...base, 'content-length': String(total) });
  if (req.method === 'HEAD') { res.end(); return; }
  fs.createReadStream(l.arq).pipe(res);
}

estado.atender = atender;

function ligar(ip: string): Promise<void> {
  if (estado.servidor) return Promise.resolve();
  return new Promise((ok, falha) => {
    // o servidor chama sempre a versão atual do atendente (o código pode recarregar sem o servidor reiniciar)
    const s = http.createServer((req, res) => estado.atender!(req, res));
    // anota também a conexão que chega e a que quebra antes de pedir o vídeo (ex.: o celular tentando https)
    s.on('connection', (sock) => anotar(`conexão de ${sock.remoteAddress}`));
    s.on('clientError', (e, sock) => { anotar(`pedido quebrado de ${sock.remoteAddress}: ${(e as Error).message}`); sock.destroy(); });
    s.once('error', falha);
    s.listen(PORTA, ip, () => { estado.servidor = s; ok(); });
  });
}

// cria o link de um vídeo (caminho já validado por quem chama)
export async function linkProCelular(arq: string) {
  const ip = ipDaRede();
  if (!ip) throw new Error('Este PC não está numa rede Wi-Fi de casa.');
  await ligar(ip);
  const cod = crypto.randomBytes(16).toString('hex');
  links.set(cod, { arq, vence: Date.now() + VALIDADE });
  const outros = ipsDaRede().filter((x) => x !== ip);
  return { outros, url: `http://${ip}:${PORTA}/v/${cod}/${encodeURIComponent(path.basename(arq))}` };
}
