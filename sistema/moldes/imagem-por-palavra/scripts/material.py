"""O material do imagem-por-palavra: a lista palavra -> imagem ANTES de editar, e a imagem de cada palavra.

O gargalo deste modelo é a imagem (~2 por segundo de fala). Por isso a ordem é fixa:
  1. a lista (src/imagens.json): cada imagem com a palavra que ela ilustra ([índice, "palavra"] de src/palavras.json),
     o arquivo, a fonte ("kie", "kie+recorte", "livre", "usuario") e o prompt (só para "kie");
  2. `material.py --lista`: confere a lista contra a fala e escreve material/LISTA.md (a tabela que o dono pode ler);
  3. `material.py --gerar` (SÓ se o modo de material do vídeo, em cenas.json, for livre ou indicado com API: G24): gera pela kie.ai (kit/gerar.py, Nano Banana 2.1 em 1K, 9:16) SÓ o que falta, converte foto para
     JPG (q 88) e recorta o fundo das "kie+recorte" (kit/recortar.py --modelo geral). Nada de imagem de filme,
     noticiário ou de terceiros: "livre" é foto com licença aberta (kit/buscar.py, anotada no ORIGEM.md) e
     "usuario" é arquivo do dono (cai no PEDIDO.md se faltar). Gente real só de foto real; IA só figurante sem rosto;
  4. o que faltar NÃO trava o vídeo: o plano que aponta para uma imagem ausente vira o efeito tipográfico (o fundo
     troca, o texto continua: modelo.md §8) e a falta vai para material/PEDIDO.md.
uso (na pasta do vídeo):
  ../../kit/.venv/Scripts/python.exe scripts/material.py --lista       (só a tabela, grátis)
  ../../kit/.venv/Scripts/python.exe scripts/material.py               (gera o que falta)
  ../../kit/.venv/Scripts/python.exe scripts/material.py --so editado,alvo   (só essas)
  ../../kit/.venv/Scripts/python.exe scripts/material.py --folha       (folha de conferência em material/folha.jpg)
O recorte é pesado: rode o passo 3 pela trava (QUEM=<nome> sh ../../tools/com-trava.sh ...).
"""
import argparse, json, re, subprocess, sys, unicodedata
from pathlib import Path

from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parent.parent
KIT = AQUI.parents[1] / 'kit'
PYK = KIT / '.venv' / 'Scripts' / 'python.exe'
if not PYK.exists():
    PYK = KIT / '.venv' / 'bin' / 'python'
ESTILO = ('photorealistic cinematic photograph, 35mm film look, rich deep blacks, strong single light source, '
          'vertical 9:16 composition with the subject in the upper two thirds, no text, no letters, no numbers, '
          'no logos, no watermark, no brand names')
IMGS = json.loads((AQUI / 'src' / 'imagens.json').read_text(encoding='utf-8'))
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
limpa = lambda s: re.sub(r'[^a-z0-9%]', '', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn'))
(AQUI / 'material').mkdir(exist_ok=True)


def conferir():
    erros = []
    for k, v in IMGS.items():
        i, w = v['palavra']
        if i >= len(PS) or limpa(PS[i]['text']) != limpa(w):
            erros.append(f'{k}: palavra [{i}, "{w}"] não bate com a fala')
        if v.get('fonte', 'kie').startswith('kie') and not v.get('prompt'):
            erros.append(f'{k}: fonte kie sem prompt')
    return erros


def lista():
    linhas = ['# Lista palavra -> imagem', '', 'Feita antes de editar (imagem-por-palavra.md §8). Status: ✓ tem o arquivo, '
              '✗ falta (o plano usa o efeito tipográfico no lugar até chegar).', '',
              '| Hora | Palavra | Imagem | Fonte | Status | O que mostra |', '|---|---|---|---|---|---|']
    for k, v in sorted(IMGS.items(), key=lambda kv: kv[1]['palavra'][0]):
        i = v['palavra'][0]
        ok = (AQUI / 'public' / v['arquivo']).exists()
        linhas.append(f"| {PS[i]['start']:.2f} s | {PS[i]['text']} | `{k}` | {v.get('fonte', 'kie')} | {'✓' if ok else '✗'} | "
                      f"{(v.get('prompt') or v.get('nota') or '').replace('|', '/')[:110]} |")
    (AQUI / 'material' / 'LISTA.md').write_text('\n'.join(linhas) + '\n', encoding='utf-8')
    print('material/LISTA.md:', len(IMGS), 'imagens,', sum((AQUI / 'public' / v['arquivo']).exists() for v in IMGS.values()), 'prontas')


def gerar(so):
    falta = []
    for k, v in IMGS.items():
        if so and k not in so:
            continue
        destino = AQUI / 'public' / v['arquivo']
        if destino.exists():
            continue
        fonte = v.get('fonte', 'kie')
        if not fonte.startswith('kie'):
            falta.append((k, v))
            continue
        bruto = AQUI / 'material' / 'geradas' / f'{k}.png'
        bruto.parent.mkdir(parents=True, exist_ok=True)
        if not bruto.exists():
            prompt = f"{v['prompt']}. {ESTILO}" if fonte == 'kie' else v['prompt'] + '. no text, no logos'
            r = subprocess.run([str(PYK), str(KIT / 'gerar.py'), prompt, str(bruto), '--formato', '9:16'], text=True,
                               capture_output=True, encoding='utf-8', errors='replace')
            print(k, (r.stdout or r.stderr).strip().splitlines()[-1:] or '')
            if not bruto.exists():
                falta.append((k, v))
                continue
        destino.parent.mkdir(parents=True, exist_ok=True)
        if fonte == 'kie+recorte':
            r = subprocess.run([str(PYK), str(KIT / 'recortar.py'), str(bruto), str(bruto.parent), '--modelo', 'geral'],
                               text=True, capture_output=True, encoding='utf-8', errors='replace')
            rec = bruto.with_name(f'{k}_recorte.png')
            if not rec.exists():
                print(k, 'recorte falhou:', (r.stderr or r.stdout)[-300:])
                falta.append((k, v))
                continue
            im = Image.open(rec)
            im.thumbnail((900, 900))
            im.save(destino)
        else:
            Image.open(bruto).convert('RGB').save(destino, quality=88)
        print(k, '->', destino.relative_to(AQUI), f'{destino.stat().st_size // 1024} KB')
    pedido = AQUI / 'material' / 'PEDIDO.md'
    if falta:
        txt = ['# Pedido de material', '', 'Estas imagens não saíram. O vídeo segue com o efeito tipográfico no lugar '
               '(o fundo troca, a legenda continua). Para trocar, deixe o arquivo com o nome indicado em `public/img/` '
               'e rode o material de novo.', '']
        for n, (k, v) in enumerate(falta, 1):
            i = v['palavra'][0]
            txt.append(f"{n}. `{v['arquivo']}`: {PS[i]['start']:.2f} s, palavra \"{PS[i]['text']}\". "
                       f"{v.get('prompt') or v.get('nota') or ''} (fonte {v.get('fonte', 'kie')})")
        pedido.write_text('\n'.join(txt) + '\n', encoding='utf-8')
        print('faltam', len(falta), '-> material/PEDIDO.md')
    elif pedido.exists():
        pedido.unlink()
    orfas = [p.name for p in (AQUI / 'public' / 'img').glob('*') if f'img/{p.name}' not in {v['arquivo'] for v in IMGS.values()}]
    if orfas:
        print('imagens em public/img que a lista não usa (de outro vídeo? apague):', ', '.join(orfas))


def folha():
    ims = [(k, AQUI / 'public' / v['arquivo']) for k, v in sorted(IMGS.items(), key=lambda kv: kv[1]['palavra'][0])]
    cw, ch, col = 216, 384, 7
    lin = (len(ims) + col - 1) // col
    f = Image.new('RGB', (col * cw, lin * (ch + 22)), (24, 24, 24))
    d = ImageDraw.Draw(f)
    for n, (k, p) in enumerate(ims):
        x, y = (n % col) * cw, (n // col) * (ch + 22)
        if p.exists():
            im = Image.open(p).convert('RGBA')
            im.thumbnail((cw, ch))
            f.paste(im, (x + (cw - im.width) // 2, y + (ch - im.height) // 2), im)
        d.text((x + 4, y + ch + 4), k + ('' if p.exists() else ' (falta)'), fill=(255, 220, 90))
    f.save(AQUI / 'material' / 'folha.jpg', quality=85)
    print('material/folha.jpg', f.size)


ap = argparse.ArgumentParser()
ap.add_argument('--lista', action='store_true')
ap.add_argument('--folha', action='store_true')
ap.add_argument('--so', default='')
ap.add_argument('--gerar', action='store_true')  # só se o modo de material do vídeo permitir (G24)
a = ap.parse_args()
e = conferir()
if e:
    sys.exit('A lista não bate com a fala:\n  ' + '\n  '.join(e))
if a.folha:
    folha()
elif a.lista:
    lista()
elif a.gerar:
    cj = AQUI / 'cenas.json'
    cfg = json.loads(cj.read_text(encoding='utf-8')) if cj.exists() else {}
    modo, ok = cfg.get('material') or 'so-materiais', cfg.get('material_permitido') or ''
    if not (modo == 'livre' or (modo == 'indicado' and re.search(r'api|kie|gera|ia\b', ok, re.I))):
        sys.exit(f"material: o modo deste vídeo é '{modo}' e não permite gerar imagem (G24). Só o dono muda: "
                 "'material' no cenas.json para livre, ou indicado com a API na lista.")
    gerar({x for x in a.so.split(',') if x})
    lista()
else:
    lista()
    print('nada gerado: só material do dono. Gerar pela kie.ai só nos modos livre ou indicado com API (G24, --gerar).')
