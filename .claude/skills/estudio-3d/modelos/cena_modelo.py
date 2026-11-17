"""Cena modelo do Estúdio Claude + Blender 3D. Copie para a pasta do projeto e adapte.

Uso (de dentro da pasta do projeto; `blender` = o caminho que `sistema/tools/blender.py` imprime):
  blender -b --factory-startup -P cena.py -- animatic        folha de contato rápida (EEVEE, 25%)
  blender -b --factory-startup -P cena.py -- lookdev 1.5 6   style frames nos tempos dados (Cycles, 50%)
  blender -b --factory-startup -P cena.py -- final           sequência completa em render/ (PNG)
  blender -b --factory-startup -P cena.py -- salvar          só grava cena.blend pra abrir na mão

Estrutura recomendada do projeto:
  cena.py  telas/ (HTML+PNG das telas)  conferencia/ (provas)  render/ (quadros)  audio/  out/ (mp4)
"""
import os
import sys

def _acha_biblioteca():
    """a biblioteca estudio3d: a variável ESTUDIO3D, se existir; senão sobe as pastas a partir desta cena até achar
    `.claude/skills/estudio-3d/scripts` (a cena mora em sistema/oficina/<pasta>/, dentro do EditOS)."""
    if os.environ.get('ESTUDIO3D'):
        return os.environ['ESTUDIO3D']
    p = os.path.dirname(os.path.abspath(__file__))
    while True:
        alvo = os.path.join(p, '.claude', 'skills', 'estudio-3d', 'scripts')
        if os.path.isdir(alvo):
            return alvo
        if os.path.dirname(p) == p:
            raise SystemExit('não achei .claude/skills/estudio-3d/scripts acima desta cena; defina ESTUDIO3D')
        p = os.path.dirname(p)


RAIZ_SKILL = _acha_biblioteca()
sys.path.insert(0, RAIZ_SKILL)
import bpy  # noqa: E402
from estudio3d import AVISOS, anima, dispositivos as D, geo, materiais as M, mundos, nucleo, qa  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['animatic']
modo = args[0]

# ------------------------------------------------------------------ 1. o filme (do tratamento)
FORMATO, SEGUNDOS = '9:16', 6
MUNDO = 'estudio_premium'          # de referencias/mundos.md (confira registro.md)
ALVO = (0, 0, 0.09)                # onde o herói mora (m)
ESCALA_MUNDO = 0.5                 # 0,5 = produto de ~15 cm; 1 = ~30-40 cm; 2 = ~1 m

motor = 'eevee' if modo == 'animatic' else 'cycles'
qual = {'animatic': 'rascunho', 'lookdev': 'revisao', 'final': 'final', 'salvar': 'revisao'}[modo]
sc = nucleo.cena_nova(FORMATO, segundos=SEGUNDOS, motor_nome=motor, qualidade=qual)
ficha = mundos.aplicar(MUNDO, alvo=ALVO, escala=ESCALA_MUNDO)
cv = ficha['curvas']

# ------------------------------------------------------------------ 2. o herói
# troque por: D.celular(tela=...), D.notebook(tela=...), geo.torno(perfil_real...), import de glTF etc.
heroi = D.celular(tela=None, corpo='titanio')
heroi.location = ALVO

# ------------------------------------------------------------------ 3. a coreografia (da shot list)
anima.chave(heroi, 'location', [(0.2, (0, 0.02, ALVO[2] - 0.12)), (1.3, ALVO), (SEGUNDOS, (0, 0, ALVO[2] + 0.006))], cv['entra'])
anima.chave(heroi, 'rotation_euler', [(0.2, nucleo.graus(-20, 0, -35)), (1.3, nucleo.graus(-4, 0, 12)),
                                      (SEGUNDOS, nucleo.graus(-4, 0, 18))], cv['entra'])

cm = ficha['camera']
cam = anima.Camera(alvo=ALVO, distancia=0.62, angulo=-14, inclinacao=cm['inclinacao'],
                   lente=cm['lente'], fstop=cm['fstop'], distancia_por_lente=True)
d0 = -cam.braco.location.y
cam.dolly(0.0, SEGUNDOS, d0 * 1.12, d0 * 0.94, cv['camera'])
cam.orbita(0.0, SEGUNDOS, -14, -4, cv['camera'])
cam.na_mao(0.0025, 50)

# ------------------------------------------------------------------ 4. prova e render
conf = os.path.join(AQUI, 'conferencia')
intencao = ficha.get('intencao')
if modo == 'animatic':
    tempos = [i / 3 for i in range(int(SEGUNDOS * 3))]  # 3 quadros por segundo
    pngs = [m['arquivo'] for m in qa.render_quadros(tempos, conf, 'anim', escala=25, intencao=intencao)]
    qa.folha([os.path.join(conf, p) for p in pngs], os.path.join(conf, 'folha_animatic.png'), colunas=6)
elif modo == 'lookdev':
    tempos = [float(x) for x in args[1:]] or [SEGUNDOS * 0.3, SEGUNDOS * 0.9]
    qa.render_quadros(tempos, conf, 'look', escala=50, intencao=intencao)
elif modo == 'final':
    sc.render.image_settings.file_format = 'PNG'
    sc.render.filepath = os.path.join(AQUI, 'render', 'f_')
    bpy.ops.render.render(animation=True)
    # depois: ffmpeg -framerate 30 -i render/f_%04d.png -i audio/trilha.wav -c:v libx264 -pix_fmt yuv420p -crf 16 -shortest out/filme.mp4
nucleo.salvar(os.path.join(AQUI, 'cena.blend'))
print('AVISOS:', AVISOS)
