"""Começa um vídeo novo a partir de um molde, tudo dentro do estúdio.

uso (da raiz do estúdio, que é a pasta sistema/, com o venv do estúdio):
  .venv/Scripts/python.exe tools/novo-video.py <modelo> <gravacao.mp4> <AAAA-MM-DD-tema> [--idioma pt] [--trocar Cloud=Claude] [--sem-voz]
faz:
  1. copia moldes/<modelo>/ para oficina/<AAAA-MM-DD-tema>/ (código, scripts, fontes; sem a mídia do vídeo de origem)
  2. liga node_modules à raiz (junção)
  3. roda tools/preparar.py na gravação e põe a base onde o contrato manda
     (public/fala.mp4, public/voz.wav, src/palavras.json, src/rosto.json)
  4. adapta a gravação ao ponto de partida do modelo (tools/adaptar.py): rosto no tamanho e na altura, luz e cor de
     partida iguais às da gravação em que o modelo foi calibrado. --sem-adaptar pula (só para comparar).
  5. gravação deixada em <perfil>/materiais/ vai para oficina/<AAAA-MM-DD-tema>/entrada/ (a pasta do vídeo fica
     completa e os materiais do perfil, limpos); gravação de outro lugar fica onde está.
Cada versão final sai sozinha em <perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4 (tools/entregar.py, chamado pelo final do molde).
Depois: refazer o plano sobre a fala nova seguindo modelos/<modelo>/<modelo>.md (o arquivo único do modelo), rodar o checador e renderizar.
"""
import argparse, json, shutil, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent
MIDIA_ORIGEM = {'fala.mp4', 'voz.wav', 'previa1.mp4', 'previa2.mp4', 'fala_grade.mp4'}

ap = argparse.ArgumentParser()
ap.add_argument('modelo')
ap.add_argument('gravacao')
ap.add_argument('nome')
ap.add_argument('--idioma', default='pt')
ap.add_argument('--trocar', nargs='*', default=[])
ap.add_argument('--sem-voz', action='store_true')
ap.add_argument('--sem-adaptar', action='store_true')
a = ap.parse_args()

molde = RAIZ / 'moldes' / a.modelo
if not molde.is_dir():
    sys.exit(f'não existe o molde {a.modelo}; veja moldes/')
destino = RAIZ / 'oficina' / a.nome
if destino.exists():
    sys.exit(f'{destino} já existe')


def ignorar(pasta, nomes):
    p = Path(pasta)
    fora = {'node_modules', 'out', 'conferencia', '.tmp', 'trabalho', 'entrada', 'entrega.json'}
    # da raiz do molde não vêm o plano, as props e o manual do vídeo aprovado (o plano do vídeo novo nasce do zero, e as
    # props da vitrine trazem o nome e o @ de quem gravou o aprovado)
    do_aprovado = {'plano.md', 'props-vitrine.json', 'LEIA.md'} if p == molde else set()
    # pessoa.webm (recorte da pessoa) e maos.json (onde as mãos ficam) são da gravação de origem: no vídeo novo nascem de novo
    da_gravacao = {'pessoa.webm'} if p.name == 'public' else ({'maos.json'} if p.name == 'src' else set())
    return [n for n in nomes if n in fora or n in do_aprovado or n in da_gravacao or (p.name == 'public' and n in MIDIA_ORIGEM)]


print('1/4 copiando o molde', a.modelo)
shutil.copytree(molde, destino, ignore=ignorar)

# o vídeo pertence ao perfil em uso quando nasce; a entrega (tools/entregar.py) segue nele mesmo se o perfil mudar
sys.path.insert(0, str(AQUI))
import perfil
if perfil.ativo():
    (destino / 'entrega.json').write_text(json.dumps({'perfil': perfil.ativo()}, ensure_ascii=False) + '\n', encoding='utf-8')

print('2/4 node_modules')
alvo = RAIZ / 'node_modules'
if sys.platform == 'win32':
    subprocess.run(['cmd', '/c', 'mklink', '/J', str(destino / 'node_modules'), str(alvo)], check=True, capture_output=True)
else:
    (destino / 'node_modules').symlink_to(alvo, target_is_directory=True)

print('3/4 preparando a gravação')
cmd = [sys.executable, str(AQUI / 'preparar.py'), a.gravacao, str(destino), '--idioma', a.idioma]
if a.trocar:
    cmd += ['--trocar', *a.trocar]
if a.sem_voz:
    cmd.append('--sem-voz')
subprocess.run(cmd, check=True)
base = destino / 'base'
(destino / 'public').mkdir(exist_ok=True)
(destino / 'src').mkdir(exist_ok=True)
# modelo sem pessoa na tela (a assinatura do aprovado não tem rosto): a gravação de vídeo não vai para public/, só a voz
sig = RAIZ / 'modelos' / a.modelo / 'assinatura.json'
com_rosto = not sig.exists() or 'rosto_aberto' in json.loads(sig.read_text(encoding='utf-8')).get('saida', {})
for nome, para in [('fala.mp4', 'public/fala.mp4'), ('voz.wav', 'public/voz.wav'),
                   ('palavras.json', 'src/palavras.json'), ('rosto.json', 'src/rosto.json')]:
    if nome in ('fala.mp4', 'rosto.json') and not com_rosto:
        continue
    if (base / nome).exists():
        shutil.copy2(base / nome, destino / para)
SEM_TRATAMENTO = {'ojgstyle01'}  # modelos em que a gravação entra crua (ojgstyle01.md OJ1)
if a.sem_adaptar or a.modelo in SEM_TRATAMENTO:
    print('4/4 adaptação pulada (--sem-adaptar ou modelo sem tratamento de imagem)')
else:
    print('4/4 adaptando a gravação ao modelo')
    subprocess.run([sys.executable, str(AQUI / 'adaptar.py'), str(destino), a.modelo], check=True)
grav = Path(a.gravacao).resolve()
if grav.parent.name == 'materiais' and (grav.parent.parent / 'perfil.md').exists() and grav.parent.parent.parent == RAIZ.parent:
    (destino / 'entrada').mkdir(exist_ok=True)
    shutil.move(str(grav), str(destino / 'entrada' / grav.name))
    print('gravação levada para', destino / 'entrada' / grav.name)
print('pronto:', destino)
print('próximo passo: ler modelos/%s/%s.md (o arquivo único do modelo) e seguir a seção "Como fazer um vídeo novo": '
      'refazer o plano no código do vídeo (src/), conferir e renderizar.' % (a.modelo, a.modelo))
