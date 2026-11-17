"""Mede a "vida" de imagens prontas.
blender -b --factory-startup -P qa_cli.py -- img1.png img2.png [--folha saida.png] [--json saida.json]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from estudio3d import qa  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
folha = js = None
if '--folha' in args:
    i = args.index('--folha'); folha = args[i + 1]; del args[i:i + 2]
if '--json' in args:
    i = args.index('--json'); js = args[i + 1]; del args[i:i + 2]
res = [qa.analisar(p) for p in args]
for m in res:
    print(qa.relatorio(m))
if folha:
    qa.folha(args, folha)
if js:
    qa.salvar_json(res, js)
