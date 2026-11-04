"""Nome antigo -> nome novo (renomeação de 2026-11-03). "edita no youtubeedition01" continua valendo."""
import json
from pathlib import Path

ANTIGOS = json.loads((Path(__file__).with_name('nomes-antigos.json')).read_text(encoding='utf-8'))


def resolver(nome: str) -> str:
    return ANTIGOS.get(nome, nome)
