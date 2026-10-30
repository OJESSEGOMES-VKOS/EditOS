"""Perfis do EditOS: cada pessoa que usa o sistema tem uma pasta na raiz do EditOS (`<Nome>/`) com `perfil.md`,
`conteudo/` (os vídeos prontos, uma pasta por vídeo com as versões v1.mp4, v2.mp4...) e `materiais/` (logo, cores,
prints, gravações que o sistema pode usar).

uso (da pasta sistema/):
  .venv/Scripts/python.exe tools/perfil.py                                  mostra o perfil ativo e os perfis
  .venv/Scripts/python.exe tools/perfil.py criar <Nome> [--arroba @x] [--cores "#111 #FFD21F"]
                                                                            cria o perfil e passa a usar ele
  .venv/Scripts/python.exe tools/perfil.py usar <Nome>                      troca o perfil ativo
Perfil ativo: `sistema/perfil-ativo` (uma linha com o nome da pasta). Com um perfil só, ele é o ativo sem precisar do
arquivo. Com mais de um e sem o arquivo, o assistente pergunta qual usar e roda `usar`.
"""
import argparse, datetime, re, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows

SISTEMA = Path(__file__).resolve().parents[1]
RAIZ = SISTEMA.parent
ARQ_ATIVO = SISTEMA / 'perfil-ativo'


def perfis():
    """As pastas da raiz que são perfil (têm perfil.md)."""
    return sorted(p.name for p in RAIZ.iterdir()
                  if p.is_dir() and not p.name.startswith('.') and p.name != 'sistema' and (p / 'perfil.md').exists())


def ativo():
    """O nome do perfil ativo, ou None (nenhum perfil, ou mais de um sem escolha)."""
    todos = perfis()
    if ARQ_ATIVO.exists():
        nome = ARQ_ATIVO.read_text(encoding='utf-8').strip()
        if nome in todos:
            return nome
    return todos[0] if len(todos) == 1 else None


def limpar(nome):
    """O nome como a pessoa disse, só sem os caracteres que o Windows não aceita em pasta."""
    nome = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '', nome).strip().strip('.')
    if not nome or nome.lower() == 'sistema':
        sys.exit('esse nome não serve para pasta de perfil; escolha outro')
    return nome


def usar(nome):
    if nome not in perfis():
        sys.exit(f'não existe o perfil "{nome}". Perfis: {", ".join(perfis()) or "nenhum"}')
    ARQ_ATIVO.write_text(nome + '\n', encoding='utf-8')
    print(f'perfil ativo: {nome}')


def criar(nome, arroba='', cores=''):
    nome = limpar(nome)
    pasta = RAIZ / nome
    if (pasta / 'perfil.md').exists():
        sys.exit(f'o perfil "{nome}" já existe ({pasta})')
    (pasta / 'conteudo').mkdir(parents=True, exist_ok=True)
    (pasta / 'materiais').mkdir(parents=True, exist_ok=True)
    arroba = arroba.strip()
    if arroba and not arroba.startswith('@'):
        arroba = '@' + arroba
    hoje = datetime.date.today().strftime('%d-%m-%y')
    (pasta / 'perfil.md').write_text(
        f'# Perfil: {nome}\n\n'
        f'- Nome: {nome}\n'
        f'- @: {arroba or "(sem @)"}\n'
        f'- Cores: {cores.strip() or "(ainda não definidas)"}\n'
        f'- Criado em: {hoje}\n\n'
        'Seus vídeos prontos ficam em `conteudo/`: uma pasta por vídeo (`<nome-do-video>-DD-MM-AA/`) e, dentro dela, '
        'as versões `v1.mp4`, `v2.mp4`...\n'
        'Logo, cores, prints de resultado e gravações que o sistema pode usar ficam em `materiais/`.\n',
        encoding='utf-8')
    ARQ_ATIVO.write_text(nome + '\n', encoding='utf-8')
    print(f'perfil criado: {pasta}')
    print(f'perfil ativo: {nome}')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('acao', nargs='?', choices=['criar', 'usar'])
    ap.add_argument('nome', nargs='?')
    ap.add_argument('--arroba', default='')
    ap.add_argument('--cores', default='')
    a = ap.parse_args()
    if a.acao and not a.nome:
        sys.exit('diga o nome do perfil')
    if a.acao == 'criar':
        criar(a.nome, a.arroba, a.cores)
    elif a.acao == 'usar':
        usar(limpar(a.nome))
    else:
        todos = perfis()
        print('perfil ativo:', ativo() or ('nenhum (crie o primeiro)' if not todos else 'escolha um (tools/perfil.py usar <Nome>)'))
        print('perfis:', ', '.join(todos) or 'nenhum')
