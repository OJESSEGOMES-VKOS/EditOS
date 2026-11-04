"""Entrega a versão nova de um vídeo no conteúdo do perfil: `<Perfil>/conteudo/<nome-do-video>-DD-MM-AA/vN.mp4`.

uso (de qualquer pasta): python tools/entregar.py <pasta-do-video> [video.mp4=out/final.mp4] [--perfil Nome] [--nome tema-DD-MM-AA]
Os finais dos moldes (scripts/mixar.sh, scripts/finalizar.sh, scripts/final.py) chamam sozinhos no fim.
- Só entrega vídeo da oficina (`sistema/oficina/<AAAA-MM-DD-tema>/`); o molde rodando a própria prova e a vitrine de
  modelo (pasta terminada em `-vitrine`) passam direto: são prova do sistema, não conteúdo de ninguém.
- A pasta no conteúdo é o nome da oficina com a data no fim: `2026-10-29-tema` vira `tema-29-10-26`.
- A primeira entrega grava `<pasta-do-video>/entrega.json` (perfil e pasta); as seguintes seguem nele, mesmo que o
  perfil ativo mude depois.
- Copia o mp4 oficial como ele é (um arquivo por versão, nada de cópia leve). Número = maior vN da pasta + 1. Se o
  arquivo é igual à última versão entregue, não duplica.
- O roteiro da pasta do vídeo (o primeiro que existir de ROTEIROS) vai junto como `roteiro-vN.<ext>`, ao lado do
  `vN.mp4` que ele gerou; só ganha cópia nova quando muda.
- SEM_ENTREGA=1 no ambiente pula (rascunho que ninguém vai ver).
"""
ROTEIROS = ['roteiro.md', 'roteiro.txt', 'plano.md']
import argparse, datetime, filecmp, json, os, re, shutil, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
sys.path.insert(0, str(Path(__file__).resolve().parent))
import perfil as P  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument('pasta')
ap.add_argument('video', nargs='?', default='out/final.mp4')
ap.add_argument('--perfil')
ap.add_argument('--nome')
a = ap.parse_args()

if os.environ.get('SEM_ENTREGA') == '1':
    print('entrega pulada (SEM_ENTREGA=1)')
    sys.exit(0)
pasta = Path(a.pasta).resolve()
if pasta.parent != (P.SISTEMA / 'oficina').resolve() or pasta.name.endswith('-vitrine'):
    print(f'entrega: {pasta.name} não é conteúdo de um perfil (molde ou vitrine), nada a entregar')
    sys.exit(0)
video = Path(a.video) if Path(a.video).is_absolute() else pasta / a.video
if not video.exists():
    video = Path(a.video).resolve()
if not video.is_file():
    sys.exit(f'entrega: não achei o vídeo {a.video}')

reg = pasta / 'entrega.json'
dados = json.loads(reg.read_text(encoding='utf-8')) if reg.exists() else {}
perfil = a.perfil or dados.get('perfil') or P.ativo()
if not perfil:
    sys.exit('entrega: ' + ('nenhum perfil ainda; faça a entrevista de entrada (skill comecar) e rode de novo'
                            if not P.perfis() else
                            f'há mais de um perfil ({", ".join(P.perfis())}); escolha com tools/perfil.py usar <Nome>'))
if perfil not in P.perfis():
    sys.exit(f'entrega: o perfil "{perfil}" não existe. Perfis: {", ".join(P.perfis()) or "nenhum"}')
nome = a.nome or dados.get('pasta')
if not nome:
    m = re.match(r'(\d{4})-(\d{2})-(\d{2})-(.+)$', pasta.name)
    nome = f'{m[4]}-{m[3]}-{m[2]}-{m[1][2:]}' if m else f'{pasta.name}-{datetime.date.today():%d-%m-%y}'

destino = P.RAIZ / perfil / 'conteudo' / nome
destino.mkdir(parents=True, exist_ok=True)
versoes = sorted((int(m[1]), f) for f in destino.glob('v*.mp4') if (m := re.fullmatch(r'v(\d+)\.mp4', f.name)))
if versoes and filecmp.cmp(video, versoes[-1][1], shallow=False):
    n = versoes[-1][0]
    print(f'entrega: igual à {versoes[-1][1].name} já entregue em {destino}, nada a fazer')
else:
    n = versoes[-1][0] + 1 if versoes else 1
    shutil.copy2(video, destino / f'v{n}.mp4')
    print(f'entregue: {destino / f"v{n}.mp4"}')

# o roteiro vai junto do vídeo: roteiro-vN.<ext> ao lado do vN.mp4, só quando mudou desde o último entregue
roteiro = next((pasta / r for r in ROTEIROS if (pasta / r).is_file()), None)
if roteiro:
    anteriores = sorted((int(m[1]), f) for f in destino.glob('roteiro-v*.*')
                        if (m := re.fullmatch(r'roteiro-v(\d+)\.\w+', f.name)))
    if not (anteriores and filecmp.cmp(roteiro, anteriores[-1][1], shallow=False)):
        shutil.copy2(roteiro, destino / f'roteiro-v{n}{roteiro.suffix}')
        print(f'roteiro: {destino / f"roteiro-v{n}{roteiro.suffix}"}')
# o painel (EditOS online): vídeo novo entregue sai de "roteiro"/"produzindo" e vai para "revisar"
ficha = destino / 'ficha.md'
if ficha.exists():
    t = ficha.read_text(encoding='utf-8')
    t2 = re.sub(r'^status: *(roteiro|produzindo) *$', 'status: revisar', t, count=1, flags=re.M)
    if t2 != t:
        ficha.write_text(t2, encoding='utf-8')
        print('ficha: status -> revisar')
if dados != {'perfil': perfil, 'pasta': nome}:
    reg.write_text(json.dumps({'perfil': perfil, 'pasta': nome}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
