"""Acha o Blender desta máquina e imprime o caminho (o 3D do EditOS precisa do Blender 5.2 ou mais novo).

uso (de dentro de sistema/): .venv/Scripts/python.exe tools/blender.py            -> imprime o caminho
                             .venv/Scripts/python.exe tools/blender.py --conferir -> diz a versão e se serve
No shell:  B="$(.venv/Scripts/python.exe tools/blender.py)" && QUEM=3d sh tools/com-trava.sh "$B" -b --factory-startup -P cena.py -- ...

Ordem da busca:
1. a variável BLENDER (o caminho do executável);
2. o arquivo sistema/blender-caminho.txt (uma linha com o caminho; vale pra instalação fora do lugar padrão);
3. `blender` no PATH;
4. os lugares padrão: Windows (Program Files/Blender Foundation/Blender X.Y/blender.exe, a versão mais nova),
   macOS (/Applications/Blender.app) e Linux (/usr/bin, /snap/bin, ~/blender*/blender).
Não achou: sai com erro e explica como instalar (blender.org/download, versão 5.2 ou mais nova).
"""
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

SISTEMA = Path(__file__).resolve().parents[1]
MINIMA = (5, 2)


def _versao_da_pasta(p):
    m = re.search(r'Blender (\d+)\.(\d+)', str(p))
    return (int(m.group(1)), int(m.group(2))) if m else (0, 0)


def candidatos():
    if os.environ.get('BLENDER'):
        yield Path(os.environ['BLENDER'])
    arq = SISTEMA / 'blender-caminho.txt'
    if arq.is_file():
        linha = arq.read_text(encoding='utf-8').strip().strip('"')
        if linha:
            yield Path(linha)
    no_path = shutil.which('blender')
    if no_path:
        yield Path(no_path)
    for base in (os.environ.get('ProgramFiles', r'C:\Program Files'), os.environ.get('ProgramW6432', ''),
                 os.environ.get('LOCALAPPDATA', '')):
        if base and (Path(base) / 'Blender Foundation').is_dir():
            yield from sorted((Path(base) / 'Blender Foundation').glob('Blender */blender.exe'),
                              key=_versao_da_pasta, reverse=True)
    yield Path('/Applications/Blender.app/Contents/MacOS/Blender')
    yield Path('/usr/bin/blender')
    yield Path('/snap/bin/blender')
    yield from sorted(Path.home().glob('blender*/blender'), reverse=True)


def achar():
    for c in candidatos():
        if c.is_file():
            return c
    return None


def versao(b):
    try:
        r = subprocess.run([str(b), '--version'], capture_output=True, text=True, timeout=60)
        m = re.search(r'Blender (\d+)\.(\d+)', r.stdout)
        return (int(m.group(1)), int(m.group(2))) if m else None
    except (OSError, subprocess.TimeoutExpired):
        return None


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
    b = achar()
    if not b:
        sys.exit('Não achei o Blender. Instale o Blender 5.2 ou mais novo (blender.org/download) ou escreva o caminho do '
                 'executável em sistema/blender-caminho.txt (ou na variável BLENDER).')
    if '--conferir' in sys.argv:
        v = versao(b)
        ok = v is not None and v >= MINIMA
        print(f'{b}\nversão: {".".join(map(str, v)) if v else "não consegui ler"} -> '
              + ('serve' if ok else f'precisa da {MINIMA[0]}.{MINIMA[1]} ou mais nova'))
        sys.exit(0 if ok else 1)
    print(b.as_posix())
