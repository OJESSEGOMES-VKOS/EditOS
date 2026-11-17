"""O teste do clone (sistema/JEITO.md §5): o vídeo novo é do mesmo modelo, mas não é o vídeo aprovado com outra gravação.

uso (de dentro de sistema/):
  .venv/Scripts/python.exe tools/clone.py oficina/<pasta> [--molde <modelo>]
confere:
  (a) texto na tela que veio do aprovado e a fala nova não diz: as strings do bloco "O PLANO" e das telas livres
      (src/telas/*.tsx) do vídeo novo que também estão no plano do aprovado (ou no texto fixo de uma tela da casa,
      scripts/clone.json do molde) e têm palavra que não está em src/palavras.json;
  (b) plano igual ou quase igual ao do aprovado: o código do bloco parecido demais, ou as mesmas telas da casa na mesma
      ordem do aprovado;
  (c) tela sem dono na fala: toda tela usada (as da casa ligadas no plano e cada tela livre) precisa de uma linha no
      plano.md (ou no cenas.json) com o nome dela e a palavra dita entre aspas que pediu ela. Ex. de linha:
        | 2 | 2,7–9,7 s | mas ele não tem ouvidos | tela livre Ouvidos (dividido) | "ouvidos": a orelha riscada ... |
  (d) estilo de cena: palavra da demo do estilo (cenas/estilos/<id>/componente/textos-demo.json) no código do vídeo sem
      a fala dizer, ou a coreografia da demo (demo-coreografia) usada num vídeo.
Sai `SEM CLONE` (código 0) ou a lista do que mexer (código 1).
O molde do vídeo vem do molde.json (tools/novo-video.py grava) ou do adaptacao.json; --molde força. Funciona com todo
molde cujo script do plano tem as linhas "O PLANO" e "fim do plano"; sem elas, confere só o que dá e diz o que faltou.
"""
import argparse, difflib, json, re, sys, unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
RAIZ = Path(__file__).resolve().parents[1]  # sistema/
sys.path.insert(0, str(Path(__file__).resolve().parent))
from nomes import resolver  # noqa: E402  nome antigo continua valendo

ap = argparse.ArgumentParser()
ap.add_argument('pasta')
ap.add_argument('--molde')
a = ap.parse_args()
pasta = (RAIZ / a.pasta).resolve() if not Path(a.pasta).is_absolute() else Path(a.pasta)
if not pasta.is_dir():
    sys.exit(f'não achei a pasta {a.pasta}')


def ler_json(p: Path):
    try:
        return json.loads(p.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return None


nome = a.molde or (ler_json(pasta / 'molde.json') or {}).get('molde') or (ler_json(pasta / 'adaptacao.json') or {}).get('modelo')
if not nome:
    sys.exit('não sei de qual molde este vídeo nasceu (sem molde.json nem adaptacao.json): rode com --molde <modelo>')
nome = resolver(nome)
molde = RAIZ / 'moldes' / nome
if not molde.is_dir():
    sys.exit(f'não existe o molde {nome} em moldes/')


def limpa(s: str) -> str:
    s = unicodedata.normalize('NFD', s)
    return re.sub(r'[^a-z0-9%]+', ' ', ''.join(c for c in s if not unicodedata.combining(c)).lower()).strip()


def bloco(raiz: Path):
    """(arquivo, texto do bloco entre "O PLANO" e "fim do plano") do script do plano, ou (None, None)"""
    for arq in sorted([*(raiz / 'scripts').glob('*'), *(raiz / 'src').glob('*')]):
        if arq.suffix not in ('.py', '.ts', '.tsx', '.mjs', '.js') or arq.name.startswith('plano_novo'):
            continue
        linhas = arq.read_text(encoding='utf-8', errors='replace').splitlines()
        ini = next((i for i, l in enumerate(linhas) if re.match(r'\s*(#|//|/\*|\*)[\s=\-*]*O PLANO', l)), None)  # só a linha-marcador
        fim = next((i for i, l in enumerate(linhas) if ini is not None and i > ini and 'fim do plano' in l.lower()), None)
        if ini is not None and fim is not None:
            return arq, '\n'.join(linhas[ini + 1:fim])
    return None, None


def sem_comentario(txt: str) -> str:
    txt = re.sub(r'/\*[\s\S]*?\*/', '', txt)  # comentário de bloco do JS/TS
    out = []
    for l in txt.splitlines():
        if re.match(r'\s*_\w+\s*=', l):  # _leia='...' e afins: anotação, não texto de tela
            continue
        l = re.sub(r"""(?<!['"])(#|//).*$""", '', l) if not re.search(r"""['"][^'"]*(#|//)""", l) else l
        if l.strip():
            out.append(l)
    return '\n'.join(out)


def literais(txt: str) -> set[str]:
    """as strings do código (sem comentário nem docstring), menos as que não viram texto na tela"""
    txt = re.sub(r"('''|\"\"\")[\s\S]*?\1", '', txt)
    ss = set(re.findall(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"", sem_comentario(txt)))
    out = set()
    for x, y in ss:
        s = (x or y).strip()
        if len(s) < 2 or not re.search(r'[A-Za-zÀ-ú]', s) or s in ('A', 'B', 'dividido', 'cheia') or s.startswith('_') \
                or re.fullmatch(r'[\w-]+\.\w{2,4}', s):  # nome de arquivo (voz.wav)
            continue
        if re.fullmatch(r'[A-Z][A-Za-z0-9]*', s) and s.lower() not in FALA:  # nome de componente (comp='Ouvidos')
            continue
        out.add(s)
    return out


def textos_jsx(txt: str) -> set[str]:
    """o texto escrito direto no JSX das telas livres (entre > e <) e as strings que não parecem CSS"""
    out = {m.strip() for m in re.findall(r'>\s*([^<>{}\n]*[A-Za-zÀ-ú][^<>{}\n]*)\s*<', txt) if m.strip()}
    return {s for s in out if not re.search(r'=>|&&|\|\||;|[()\[\]]', s)}


FALA_LISTA = [p.get('text') or p.get('w') or '' for p in (ler_json(pasta / 'src' / 'palavras.json') or [])]
FALA = {w for p in FALA_LISTA for w in limpa(p).split()}
if not FALA:
    sys.exit(f'{a.pasta}/src/palavras.json está vazio: transcreva a fala antes (tools/novo-video.py)')
dito = lambda s: all(w in FALA for w in limpa(s).split())

cfg = ler_json(molde / 'scripts' / 'clone.json') or {}
arq_novo, bl_novo = bloco(pasta)
arq_apr, bl_apr = bloco(molde)
achados, avisos = [], []
if bl_apr is None:
    avisos.append(f'o molde {nome} não tem o bloco do plano marcado ("O PLANO" ... "fim do plano"): (a) e (b) ficaram de fora; '
                  'marque o bloco no script do plano do molde para o teste completo')
if bl_novo is None and bl_apr is not None:
    sys.exit(f'o vídeo não tem mais as linhas "O PLANO" e "fim do plano" no script do plano: devolva os marcadores')

# as telas da casa ligadas no plano novo (chave=dict(...) ou chave=valor que não é None) e as livres
casa = cfg.get('telas') or []
usadas = []
if bl_novo is not None:
    for t in casa:
        m = re.search(rf'^\s*(?:export\s+)?(?:const\s+|let\s+)?{t}\s*(?::[^=\n]+)?=\s*(.+)$', sem_comentario(bl_novo), re.M)
        if m and not re.match(r'(None|null|false|False|\[\s*\]|opcional\s*(<[^>]*>)?\(\s*null\s*\)|\(\s*\)\s*=>\s*\[\s*\])', m.group(1).strip()):
            usadas.append(t)
        elif re.search(rf"""(comp|heroi)\s*[=:]\s*\{{?\s*['"]{re.escape(t)}['"]""", sem_comentario(bl_novo)):  # <Tela comp="X" /> da casa
            usadas.append(t)
    if not casa:
        avisos.append(f'moldes/{nome}/scripts/clone.json não diz quais são as telas da casa: (c) conferiu só as telas livres')
tempos = ler_json(pasta / 'src' / 'tempos.json') or {}
livres = [L.get('comp') for L in tempos.get('livres', []) if isinstance(L, dict)]
if bl_novo is not None:
    livres = sorted((set(livres) | set(re.findall(r"(?:comp|heroi)\s*[=:]\s*\{?\s*['\"](\w+)['\"]", sem_comentario(bl_novo)))) - set(casa))

# (a) texto que veio do aprovado e a fala nova não diz
if bl_apr is not None:
    do_aprovado = {limpa(s): s for s in literais(bl_apr)}
    for t in usadas:
        for s in (cfg.get('fixos') or {}).get(t, []):
            do_aprovado[limpa(s)] = s
    na_tela = literais(bl_novo or '')
    for t in usadas:
        na_tela |= set((cfg.get('fixos') or {}).get(t, []))
    telas_dir = pasta / 'src' / 'telas'
    for arq in sorted(telas_dir.glob('*.tsx')) if telas_dir.is_dir() else []:
        na_tela |= textos_jsx(arq.read_text(encoding='utf-8', errors='replace'))
    for s in sorted(na_tela):
        if limpa(s) in do_aprovado and not dito(s):
            achados.append(f'(a) "{s}" é texto do aprovado e a fala nova não diz isso: tire da tela ou troque pelo que é dito')
        elif not dito(s) and len(limpa(s)) > 2 and s not in livres and not re.fullmatch(r'#[0-9A-Fa-f]{3,8}|[a-z_]+|.*[/=].*', s):
            avisos.append(f'texto na tela que a fala não diz: "{s}" (G19: confira se é mesmo o que é dito)')

# (b) plano igual ou quase igual ao do aprovado
if bl_apr is not None and bl_novo is not None:
    cod = lambda t: re.sub(r'\s+', ' ', sem_comentario(t))
    r = difflib.SequenceMatcher(None, cod(bl_apr), cod(bl_novo), autojunk=False).ratio()
    if r >= 0.7:
        achados.append(f'(b) o bloco do plano está {round(r * 100)}% igual ao do aprovado: o plano nasce da fala nova (comece do scripts/plano_novo)')
    tap = ler_json(molde / 'src' / 'tempos.json') or {}

    def ordem(T):
        def ini(v):
            if isinstance(v, dict):
                nums = [x for x in v.values() if isinstance(x, (int, float)) and not isinstance(x, bool)]
                return min(nums) if nums else None
            return None
        xs = [(ini(T.get(t)), t) for t in casa if ini(T.get(t)) is not None]
        return [t for _, t in sorted(xs)]
    o_apr, o_novo = ordem(tap), ordem(tempos)
    comuns = [t for t in o_novo if t in o_apr]
    if o_apr and len(comuns) >= 3 and len(comuns) >= 0.6 * len(o_apr) and comuns == [t for t in o_apr if t in comuns]:
        achados.append(f'(b) as telas da casa repetem as do aprovado na mesma ordem ({" > ".join(comuns)}): cada tela entra onde a fala nova pede')

# (d) estilos de cena: o componente copiado para o src/ do vídeo traz as palavras da demo como padrão
#     (cenas/estilos/<id>/componente/textos-demo.json). Elas não podem aparecer no resto do código do vídeo se a fala não diz.
src = pasta / 'src'
if src.is_dir():
    arqs_video = [f for f in src.rglob('*') if f.is_file() and f.suffix in ('.tsx', '.ts', '.json', '.py')
                  and f.name not in ('palavras.json', 'tempos.json')]
    for td in sorted((RAIZ / 'cenas' / 'estilos').glob('*/componente/textos-demo.json')):
        comps = {f.name for f in td.parent.glob('*.tsx') if f.name not in ('demo.tsx',)}
        copiados = [f for f in arqs_video if f.name in comps]
        if not copiados:
            continue
        cena = td.parent.parent.name
        resto = '\n'.join(f.read_text(encoding='utf-8', errors='replace') for f in arqs_video if f.name not in comps)
        for s in (ler_json(td) or {}).get('textos', []):
            if isinstance(s, str) and len(limpa(s)) > 2 and s in resto and not dito(s):
                achados.append(f'(d) "{s}" é palavra da demo da {cena} e a fala nova não diz isso: a cena se compõe da frase dita')
        if 'demo-coreografia' in resto:
            achados.append(f'(d) o vídeo usa a coreografia da demo da {cena}: componha pela ficha (Como variar)')

# (c) toda tela tem dono na fala: uma linha com o nome da tela e a palavra dita entre aspas
linhas = []
if (pasta / 'plano.md').exists():
    linhas += (pasta / 'plano.md').read_text(encoding='utf-8').splitlines()
for c in (ler_json(pasta / 'cenas.json') or {}).get('cenas', []):
    linhas.append(f"{c.get('resposta') or ''} | {c.get('por_que') or ''}")
for t in usadas + livres:
    ok = False
    for l in linhas:
        if not re.search(rf'\b{re.escape(t)}\b', l, re.I):
            continue
        aspas = re.findall(r'["“]([^"”]+)["”]', l)
        if any(dito(q) for q in aspas):
            ok = True
            break
    if not ok:
        achados.append(f'(c) a tela "{t}" não tem dono na fala: no plano.md (ou cenas.json), uma linha com "{t}" e a palavra '
                       'dita entre aspas que pediu ela, e o porquê. Sem porquê, a tela sai ou vira rosto puro')

print(f'molde {nome}; telas da casa no vídeo: {", ".join(usadas) or "nenhuma"}; telas livres: {", ".join(livres) or "nenhuma"}')
for x in avisos:
    print('aviso:', x)
if achados:
    print('\nCLONE? corrija:')
    ta = [x for x in achados if x.startswith('(a)')]
    for x in ta[:12] + [x for x in achados if not x.startswith('(a)')]:
        print('-', x)
    if len(ta) > 12:
        print(f'- (a) ... e mais {len(ta) - 12} textos do aprovado')
    sys.exit(1)
print('\nSEM CLONE')
