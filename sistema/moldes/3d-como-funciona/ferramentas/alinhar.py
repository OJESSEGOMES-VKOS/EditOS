"""Junta o texto do roteiro (a grafia certa) com o tempo das palavras do Whisper.
uso: ../../.venv/Scripts/python.exe alinhar.py <pasta-do-video>
lê   <pasta>/roteiro.txt e <pasta>/tr/transcript.json
grava <pasta>/palavras.json  [{"w": "palavra como no roteiro", "s": início, "e": fim, "i": índice}]
Palavra do roteiro sem par no Whisper (raro) herda o tempo dividido do trecho vizinho. Para se a voz trocou mais
de 3% das palavras: aí a narração não bate com o roteiro e precisa ser refeita."""
import difflib, json, re, sys, unicodedata
from pathlib import Path

pasta = Path(sys.argv[1])
norm = lambda s: re.sub(r'[^\w]', '', unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower())
num = {'10': 'dez', '20': 'vinte', '1854': '1854', '30': 'trinta', '32': 'trinta e dois', '36': 'trinta e seis',
       '49': 'quarenta e nove', '100': 'cem', '300': 'trezentos', '2': 'duas', '1': 'um', '4': 'quatro', '25': 'vinte e cinco',
       '50': 'cinquenta', '70': 'setenta', '78': 'setenta e oito', '200': 'duzentos', '400': 'quatrocentos',
       '5500': 'cinco mil e quinhentos', '30000': 'trinta mil', '1797': 'mil setecentos e noventa e sete'}
FORMA = {'para': 'pra', 'pro': 'pro', 'praa': 'pra', 'hora': 'ora'}  # o dito vale na legenda: 'pra' lido como 'para' não é erro; 'ora' e 'hora' soam igual
ro = (pasta / 'roteiro.txt').read_text(encoding='utf-8').split()
brutas = []  # o Whisper às vezes parte o milhar em duas palavras ("5" "500"): junta de volta em "5500"
for x in json.loads((pasta / 'tr' / 'transcript.json').read_text(encoding='utf-8'))['words']:
    if brutas and x['text'].strip().startswith('-'):  # "guarda -chuva": o Whisper parte no hífen
        brutas[-1] = {'text': brutas[-1]['text'].strip() + x['text'].strip(), 'start': brutas[-1]['start'], 'end': x['end']}
    elif brutas and re.fullmatch(r'\d{1,3}', norm(brutas[-1]['text'])) and re.fullmatch(r'\d{3}', norm(x['text'])):
        brutas[-1] = {'text': norm(brutas[-1]['text']) + norm(x['text']), 'start': brutas[-1]['start'], 'end': x['end']}
    else:
        brutas.append(x)
wh = []  # número por extenso no roteiro: o Whisper escreve "32", que vira "trinta e dois" com o tempo dividido
for x in brutas:
    partes = num.get(norm(x['text']), x['text']).split()
    d = (x['end'] - x['start']) / len(partes)
    wh += [{'text': p, 'start': x['start'] + d * k, 'end': x['start'] + d * (k + 1)} for k, p in enumerate(partes)]
a = [FORMA.get(norm(x), norm(x)) for x in ro]
b = [FORMA.get(norm(num.get(norm(x['text']), x['text'])), norm(num.get(norm(x['text']), x['text']))) for x in wh]
out = [None] * len(ro)
trocas = 0
for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    if op == 'equal':
        for k in range(i2 - i1):
            out[i1 + k] = (wh[j1 + k]['start'], wh[j1 + k]['end'])
            if norm(ro[i1 + k]) == 'pra' and norm(wh[j1 + k]['text']) == 'para':  # legenda mostra o que foi dito
                ro[i1 + k] = re.sub(r'(?i)pra', lambda m: 'Para' if m.group(0)[0].isupper() else 'para', ro[i1 + k], count=1)
    elif i2 > i1:
        so_grafia = set(a[i1:i2]) <= {'pra', 'pro'} and set(b[j1:j2]) <= {'pra', 'para', 'o', 'a', 'os', 'as'} and j2 > j1
        trocas += 0 if so_grafia else max(i2 - i1, j2 - j1)  # "pro" lido como "para o" é o dito, não voz errada
        if j2 > j1:  # troca: distribui o tempo do trecho dito entre as palavras do roteiro
            s, e = wh[j1]['start'], wh[j2 - 1]['end']
        else:  # palavra do roteiro que o Whisper engoliu: espreme entre vizinhas
            s = wh[j1 - 1]['end'] if j1 > 0 else 0.0
            e = wh[j1]['start'] if j1 < len(wh) else s + 0.2
        n = i2 - i1
        for k in range(n):
            out[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
if trocas > 0.03 * len(ro):
    sys.exit(f'{trocas} palavras não batem com o roteiro ({trocas / len(ro):.0%}): refaça a narração.')
pal = [{'w': w, 's': round(t[0], 3), 'e': round(t[1], 3), 'i': i} for i, (w, t) in enumerate(zip(ro, out))]
(pasta / 'palavras.json').write_text(json.dumps(pal, ensure_ascii=False, indent=0), encoding='utf-8')
print(f'{pasta.name}: {len(pal)} palavras, {trocas} ajustadas, fim em {pal[-1]["e"]:.2f} s')
