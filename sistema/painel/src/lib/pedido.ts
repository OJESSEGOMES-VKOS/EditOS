import fs from 'node:fs';
import path from 'node:path';

// um pedido escrito no painel (texto + anexos arrastados): validação e gravação, usado pelo Refazer e pelo banco da sala
const TIPOS = /^(image|video|audio)\//;
const MAX_ARQ = 500 * 1024 * 1024, MAX_ANEXOS = 20;
export const MAX_TEXTO = 20000;

export function anexosDe(form: FormData): File[] | string {
  const anexos = form.getAll('anexo').filter((a): a is File => a instanceof File);
  if (anexos.length > MAX_ANEXOS) return 'anexos demais';
  for (const a of anexos) if (!TIPOS.test(a.type) || a.size > MAX_ARQ) return `anexo recusado: ${a.name}`;
  return anexos;
}

export function carimbo() {
  const d = new Date(), d2 = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${d2(d.getMonth() + 1)}-${d2(d.getDate())}-${d2(d.getHours())}${d2(d.getMinutes())}${d2(d.getSeconds())}`;
}

// a conversa da sala aceita qualquer arquivo (pdf, planilha, texto, zip...), não só mídia
export function anexosLivresDe(form: FormData): File[] | string {
  const anexos = form.getAll('anexo').filter((a): a is File => a instanceof File);
  if (anexos.length > MAX_ANEXOS) return 'anexos demais';
  for (const a of anexos) if (a.size > MAX_ARQ) return `anexo grande demais: ${a.name}`;
  return anexos;
}

// grava os anexos em <dir> (nome de arquivo vindo de fora é dado: só letras, números, ponto e traço)
export async function salvarAnexos(dir: string, anexos: File[]) {
  fs.mkdirSync(dir, { recursive: true });
  const nomes: string[] = [];
  for (const [n, a] of anexos.entries()) {
    const ext = (path.extname(a.name).toLowerCase().match(/^\.[a-z0-9]{1,5}$/) ?? [''])[0];
    const base = path.basename(a.name, path.extname(a.name)).normalize('NFD').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'anexo';
    const arq = `${String(n + 1).padStart(2, '0')}-${base}${ext}`;
    fs.writeFileSync(path.join(dir, arq), Buffer.from(await a.arrayBuffer()));
    nomes.push(arq);
  }
  return nomes;
}

// grava <dir>/pedido.md + anexos
export async function gravarPedido(dir: string, titulo: string, texto: string, anexos: File[]) {
  const nomes = await salvarAnexos(dir, anexos);
  fs.writeFileSync(path.join(dir, 'pedido.md'), [
    '---', 'status: pendente', `pedido: ${new Date().toISOString()}`, '---',
    `# ${titulo} (pelo EditOS Online)`, '', texto.trim() || '(sem texto, ver anexos)', '',
    ...(nomes.length ? ['## Anexos', ...nomes.map((x) => `- ${x}`)] : []), '',
  ].join('\n'), 'utf-8');
}
