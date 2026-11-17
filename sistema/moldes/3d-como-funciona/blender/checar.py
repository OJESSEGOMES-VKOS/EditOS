"""checar: a conferência automática do vídeo 3D, antes de gastar uma hora de render. Roda no Blender em segundo plano,
só na CPU (nenhum quadro é renderizado), percorre todos os quadros e grava `<pasta>/conferencia/checagem.txt`.

O que procura (cada achado diz o objeto, o instante e o tamanho do defeito):
- SALTO: objeto visível cuja posição no mundo pula entre dois quadros seguidos, muito acima da velocidade que ele
  tinha nos quadros vizinhos (o "teletransporte"). Um salto colado num corte de câmera é tolerado.
- Z-FIGHTING: faces de objetos diferentes, paralelas, viradas pro mesmo lado, a menos de 3 mm uma da outra e se
  sobrepondo em área (a cintilação de duas superfícies no mesmo plano). Só conta se as duas têm cor diferente
  (duas faces da mesma cor brigando não piscam) e se a câmera enxerga a sobreposição naquele instante (dentro do
  quadro e sem outra peça na frente: face enterrada ou escondida não pisca pra ninguém).
- ATRAVESSAR: peça que se move e entra mais de 8 cm dentro de outro sólido (pontos de uma malha dentro da outra), ou cuja
  trajetória entre duas amostras cruza uma face de um sólido parado (queda sem piso: passa direto pelo chão fino).
- PESSOA/VEÍCULO: frente diferente da direção do movimento (de costas ou de lado), animação Walk/Run parada, Idle ou
  outra animação deslizando, pés fora do chão (mais de 3 cm) ou afundados (mais de 8 cm).

- CÂMERA / CORTE / FANTASMA: salto de câmera fora de um corte declarado, corte declarado que não vira salto em 1
  quadro, quadro de corte com o obturador do motion blur aberto sobre o salto (mistura dos dois planos).
- NOMEADA: peça que acende (`K.acende`) tem que estar na tela, sem nada na frente, no instante em que é nomeada.
- FOCO: o objeto-foco de cada plano (`K.foco`) fica dentro do quadro (10% a 90%) durante o plano.
- RODA: peça com simetria (pás, raios; `K.simetria`) que gira mais de 40% do passo entre pás por quadro parece girar
  pra trás.
- FORA DA CENA: objeto visível a mais de 200 m de onde a câmera trabalha (posição de mundo dobrada por `pai=`).
- VISIBILIDADE: peça que some ou aparece 1 ou 2 quadros antes ou depois de um corte (tem que ser NO quadro do corte:
  `K.esconde_no_corte`). Some antes: o plano velho mostra a parede sumindo; aparece depois: pisca no plano novo.
- ATRAVESSAR (parede fina): peça compacta (até 80 cm) que, vista do centro dela, passa uma parede inteira e sai do
  outro lado (o compressor que fura o fundo de 4 cm e aparece dentro da geladeira). A profundidade até a superfície
  mais próxima nunca passa de meia parede, então só o teste de 8 cm não pegava. Encostar ou afundar sem sair do outro
  lado (a roda pousada na laje) continua com o teste de 8 cm.
- APOIO: peça declarada com `K.apoio` que, visível e fora da entrada, não tem nada embaixo a até 1 cm (flutua). E carga
  declarada com `K.apoio(carga, *suportes)` que aparece no quadro com algum suporte escondido (a cabine do elevador
  pendurada no nada depois que os cabos sumiram).
- SUMIÇO: peça que fica invisível DE VEZ (escondida ou com escala 0 até o fim), sem motivo, e cujo lugar (a caixa dela
  no mundo, no último quadro em que aparecia) volta a ser enquadrado pela câmera depois, sem nada na frente: o vazio
  aparece. Com motivo (`K.some(obj, t, motivo=...)`) vira aviso. Esconder só num intervalo é `K.esconde(obj, t0, t1)`.
  Efeito sem corpo e seta de força não contam.
- TAMPA: disco de tampa esquecido num corte de maquete (polígono de 8+ lados com parte das arestas soltas: a lateral
  foi cortada e a tampa ficou cortando o interior). Use `K.sem_tampas`.
- NARIZ: veículo declarado com `K.veiculo` cujo nariz, em 3D, não aponta pra onde ele anda (com mais de 1 m/s): de ré, de
  lado, ou subindo "de barriga" (a trajetória acima do nariz). O nariz acima da trajetória é o ângulo de ataque e passa
  até o limite declarado (avião rodando na pista).
Efeito sem corpo (`K.sem_corpo`: água, superfície, bolha, onda de som, névoa) não conta como sólido nem como peça que
atravessa. A câmera enxerga através de superfície transparente (vidro, névoa): o defeito atrás do vidro aparece.
Pessoa dentro de veículo que anda (tripulação no submarino) é conferida pelo movimento em relação ao veículo.

Sai com código 1 se houver ERRO (aviso não trava). Uso, dentro da cena: `K.checar(pasta_do_video)`.
"""
import math
import random
import sys
import time
from collections import defaultdict
from pathlib import Path

import bpy
import numpy as np
from bpy_extras import anim_utils
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector
from mathutils.bvhtree import BVHTree

PASSO_AMOSTRA = 12          # quadros entre as amostras pesadas (0,4 s a 30 fps)
SALTO_MIN = 0.05            # m: pulo mínimo pra contar como salto
SALTO_VEZES = 3.0           # e quantas vezes a velocidade dos vizinhos
ZF_DIST = 0.003             # m: planos mais perto que isso brigam
ZF_AREA = 3e-4              # m2: sobreposição mínima (3 cm2: pega até a borda fina de uma faixa)
ZF_NORMAL = 0.9995          # cos: paralelas
ATRAVESSA = 0.08            # m: profundidade que vira erro (abaixo disso é encaixe: corda na roda, peça apoiada)
PE_FLUTUA = 0.03            # m
PE_AFUNDA = 0.08            # m
V_ANDA = 0.15               # m/s: abaixo disso a peça está parada
VEL_PASSO = {'walk': 1.25, 'run': 3.4}   # m/s do ciclo nativo (estimativa: serve pra AVISO de patinação)
FURA = 0.003                # m: parte da peça que passa a parede INTEIRA e sai do outro lado (vista do centro dela)
PECA_MAX = 0.8              # m: só peças compactas entram no teste de parede fina (cabine, rampa e corda ficam de fora)
APOIO_FOLGA = 0.01          # m: folga máxima entre a peça declarada com K.apoio e o que está embaixo
SUMICO_AREA = 0.004         # da área do quadro em NDC (4 = o quadro inteiro): 0,1% do quadro, o lugar vazio já se vê
SUMICO_VISTAS = 2           # amostras (de 3 em 3 quadros) em que o lugar vazio é visto pra contar
TRANSF = {'location', 'rotation_euler', 'rotation_quaternion', 'scale', 'delta_location', 'delta_rotation_euler',
          'delta_scale'}


# ---------------------------------------------------------------- quem se mexe
def _caminhos(o):
    ad = o.animation_data
    if not ad:
        return set()
    out = set()
    if ad.action:
        cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
        if cb:
            out |= {f.data_path.split('[')[0] for f in cb.fcurves}
    if ad.nla_tracks:
        out.add('nla')
    return out


def _camadas(lc, out):
    out[lc.collection.name] = lc
    for c in lc.children:
        _camadas(c, out)
    return out


def _fora_do_render(o, camadas):
    """objeto que nunca vai pro quadro: só mora em coleção excluída ou escondida no render (a forma de osso que o glTF
    importa na coleção 'glTF_not_exported', a esfera dos esqueletos HumanArmature). Não é peça: a checagem ignora."""
    cols = o.users_collection
    if not cols:
        return True
    for c in cols:
        if c == bpy.context.scene.collection:
            return False
        lc = camadas.get(c.name)
        if lc is not None and not lc.exclude and not c.hide_render:
            return False
    return True


class Cena:
    def __init__(self):
        self.sc = bpy.context.scene
        self.fps = self.sc.render.fps
        camadas = _camadas(bpy.context.view_layer.layer_collection, {})
        self.objs = [o for o in bpy.data.objects if o.type in ('MESH', 'EMPTY', 'ARMATURE') and not _fora_do_render(o, camadas)]
        self.renderiza = set(self.objs)          # a forma de osso (fora do render) não é peça em nenhuma conferência
        self._din = {}
        self._raiz = {}
        self._asset = {}
        self._look = {}
        self.malhas = [o for o in self.objs if o.type == 'MESH']
        self.pele = {o for o in self.malhas if any(m.type == 'ARMATURE' for m in o.modifiers)}
        self.dinamicos = [o for o in self.objs if self.dinamico(o)]
        self.sem_corpo = {o for o in self.objs if o.get('sem_corpo')}
        self.estaticos = [o for o in self.malhas if not self.dinamico(o) and o not in self.pele and o not in self.sem_corpo]
        self.atores = [o for o in self.objs if o.get('ator')]
        self.simetricos = [o for o in self.objs if o.get('simetria')]

    def dinamico(self, o):
        if o in self._din:
            return self._din[o]
        r = (bool(_caminhos(o) & (TRANSF | {'nla'})) or o.parent_type == 'BONE'
             or (o.parent is not None and self.dinamico(o.parent)) or o in getattr(self, 'pele', ()))
        self._din[o] = r
        return r

    def portador(self, a):
        """o veículo que carrega o ator: o ancestral mais próximo que se move e tem peça própria (malha filha direta).
        Um vazio que só agrupa atores (o cardume) não carrega ninguém: cada peixe anda por conta própria."""
        x = a.parent
        while x is not None:
            if self.dinamico(x) and any(c.type == 'MESH' for c in x.children):
                return x
            x = x.parent
        return None

    def raiz(self, o):
        if o not in self._raiz:
            r = o
            while r.parent is not None:
                r = r.parent
            self._raiz[o] = r
        return self._raiz[o]

    def unidade(self, o):
        """a peça inteira pra efeito de atravessar: o ator (pessoa/veículo) a que pertence, senão a raiz."""
        x = o
        while x is not None:
            if x.get('ator'):
                return x
            x = x.parent
        return self.raiz(o)

    def asset(self, o):
        """id do modelo pronto (ou do ator) a que o objeto pertence; faces do mesmo modelo não brigam entre si."""
        if o not in self._asset:
            a, x = None, o
            while x is not None:
                if 'acoes' in x.keys() or x.get('ator'):
                    a = x.name
                    break
                x = x.parent
            self._asset[o] = a
        return self._asset[o]

    def look(self, o):
        """cor da primeira superfície, em degraus de 3%: duas faces com o mesmo look não cintilam uma contra a outra."""
        if o not in self._look:
            k = None
            for sl in o.material_slots:
                m = sl.material
                b = m.node_tree.nodes.get('Principled BSDF') if m and m.use_nodes else None
                if b is not None:
                    c = b.inputs['Base Color'].default_value
                    k = (round(c[0] * 30), round(c[1] * 30), round(c[2] * 30), b.inputs['Emission Strength'].default_value > 0.01)
                    break
            self._look[o] = k
        return self._look[o]

    def transparente(self, o):
        for sl in o.material_slots:
            m = sl.material
            if m is None:
                continue
            if getattr(m, 'surface_render_method', 'DITHERED') == 'BLENDED':
                return True
            b = m.node_tree.nodes.get('Principled BSDF') if m.use_nodes else None
            if b is not None and b.inputs['Alpha'].default_value < 0.99:
                return True
        return False

    def visivel(self, o):
        return (not o.hide_render) and abs(o.matrix_world.determinant()) > 1e-6

    def t(self, f):
        return (f - 1) / self.fps


# ---------------------------------------------------------------- geometria avaliada (mundo)
def _malha(o, dg):
    """(vértices no mundo, triângulos, polígonos: loop_start, loop_total, vértice por loop) da malha avaliada."""
    eo = o.evaluated_get(dg)
    me = eo.to_mesh()
    try:
        nv = len(me.vertices)
        co = np.empty(nv * 3, dtype=np.float64)
        me.vertices.foreach_get('co', co)
        mw = np.array(eo.matrix_world, dtype=np.float64)
        W = co.reshape(-1, 3) @ mw[:3, :3].T + mw[:3, 3]
        me.calc_loop_triangles()
        nt = len(me.loop_triangles)
        tri = np.empty(nt * 3, dtype=np.int64)
        me.loop_triangles.foreach_get('vertices', tri)
        npol = len(me.polygons)
        ls = np.empty(npol, dtype=np.int64)
        lt = np.empty(npol, dtype=np.int64)
        me.polygons.foreach_get('loop_start', ls)
        me.polygons.foreach_get('loop_total', lt)
        lv = np.empty(len(me.loops), dtype=np.int64)
        me.loops.foreach_get('vertex_index', lv)
    finally:
        eo.to_mesh_clear()
    return W, tri.reshape(-1, 3), ls, lt, lv


def _faces(W, ls, lt, lv):
    """normal, deslocamento do plano, centro, área e caixa de cada face (no mundo), só as que valem a pena."""
    if len(ls) == 0:
        return None
    P = W[lv]
    nxt = np.arange(len(lv)) + 1
    nxt[ls + lt - 1] = ls
    cr = np.cross(P, P[nxt])
    va = 0.5 * np.add.reduceat(cr, ls)
    area = np.linalg.norm(va, axis=1)
    ok = area >= ZF_AREA
    if not ok.any():
        return None
    n = va[ok] / area[ok, None]
    cen = (np.add.reduceat(P, ls) / lt[:, None])[ok]
    d = (n * cen).sum(1)
    idx = np.nonzero(ok)[0]
    mn = np.minimum.reduceat(P, ls)[ok]
    mx = np.maximum.reduceat(P, ls)[ok]
    return dict(n=n, d=d, c=cen, area=area[ok], mn=mn, mx=mx, poly=idx)


def _clip(sub, clip):
    """interseção de dois polígonos convexos 2D (Sutherland-Hodgman). devolve a lista de pontos."""
    out = list(sub)
    k = len(clip)
    for i in range(k):
        a, b = clip[i], clip[(i + 1) % k]
        ex, ey = b[0] - a[0], b[1] - a[1]
        entra = out
        out = []
        if not entra:
            break
        s = entra[-1]
        for e in entra:
            ds = ex * (s[1] - a[1]) - ey * (s[0] - a[0])
            de = ex * (e[1] - a[1]) - ey * (e[0] - a[0])
            if de >= 0:
                if ds < 0:
                    u = ds / (ds - de)
                    out.append((s[0] + (e[0] - s[0]) * u, s[1] + (e[1] - s[1]) * u))
                out.append(e)
            elif ds >= 0:
                u = ds / (ds - de)
                out.append((s[0] + (e[0] - s[0]) * u, s[1] + (e[1] - s[1]) * u))
            s = e
    return out


def _sobreposicao(pa, pb, n):
    """área e centro (3D) da sobreposição de duas faces coplanares (pa, pb: arrays k x 3), n = normal comum."""
    u = pa[1] - pa[0]
    u = u / (np.linalg.norm(u) + 1e-12)
    v = np.cross(n, u)
    o = pa[0]
    def p2(p):
        q = [(float((x - o) @ u), float((x - o) @ v)) for x in p]
        s = sum(q[i][0] * q[(i + 1) % len(q)][1] - q[(i + 1) % len(q)][0] * q[i][1] for i in range(len(q)))
        return q if s > 0 else q[::-1]
    r = _clip(p2(pa), p2(pb))
    if len(r) < 3:
        return 0.0, None, []
    s = sum(r[i][0] * r[(i + 1) % len(r)][1] - r[(i + 1) % len(r)][0] * r[i][1] for i in range(len(r)))
    cx = sum(p[0] for p in r) / len(r)
    cy = sum(p[1] for p in r) / len(r)
    # pontos de prova pra ver se a câmera enxerga a sobreposição: centro, cantos puxados 15% pro centro e uma grade
    # 40 x 40 sorteada dentro do polígono (a parte visível pode ser só uma nesga)
    pts = [(cx, cy)] + [(cx + (p[0] - cx) * 0.85, cy + (p[1] - cy) * 0.85) for p in r]
    xs, ys = [p[0] for p in r], [p[1] for p in r]
    for i in range(40):
        for j in range(40):
            gx = min(xs) + (max(xs) - min(xs)) * (i + random.random()) / 40
            gy = min(ys) + (max(ys) - min(ys)) * (j + random.random()) / 40
            if all((r[(k + 1) % len(r)][0] - r[k][0]) * (gy - r[k][1]) - (r[(k + 1) % len(r)][1] - r[k][1]) * (gx - r[k][0]) >= 0
                   for k in range(len(r))) or all((r[(k + 1) % len(r)][0] - r[k][0]) * (gy - r[k][1]) - (r[(k + 1) % len(r)][1] - r[k][1]) * (gx - r[k][0]) <= 0
                                                  for k in range(len(r))):
                pts.append((gx, gy))
    pts = [o + u * x + v * y for x, y in pts]
    return abs(s) / 2, pts[0], pts


# ---------------------------------------------------------------- o executor
class Checagem:
    def __init__(self, pasta, cortes=(), entradas=None, acendes=(), focos=(), aparecem=None, selo='', apoios=(),
                 sumicos=None, suportes=(), veiculos=(), no_ar=()):
        self.selo = selo
        self.no_ar = list(no_ar)   # (nome, t0, t1) do K.no_ar: pulo/queda de propósito
        self.veiculos = [v for v in veiculos if bpy.data.objects.get(v[0]) is not None]   # K.veiculo: NARIZ em 3D
        self.apoios = list(apoios)
        self.sumicos = dict(sumicos or {})    # nome -> (t, motivo) do K.some
        self.suportes = list(suportes)        # (carga, [suportes], t0, t1) do K.apoio(carga, *suportes)
        self.apoio_ruins = defaultdict(list)
        self.aparecem = aparecem or {}
        self.focos = list(focos)
        self.acendes = list(acendes)
        self.zf_est = {}
        self.fora = {}
        self.entradas = entradas or {}   # nome da peça -> [(t0, t1)]: a mola da entrada pode afundar um pouco, não conta
        self.pasta = Path(pasta)
        self.C = Cena()
        self.sc = self.C.sc
        self.cortes = [1 + math.floor(t * self.C.fps + 0.5) for t in cortes]
        self.erros = []
        self.avisos = []
        self.dg = None
        self.cache_est = {}          # objeto estático -> geometria
        self.cache_bvh = {}          # assinatura de visíveis -> (bvh, bbox, mapa de triângulos)
        self.zf_vistos = {}
        self.zf_ocultos = {}
        self.zf_sigs = set()
        self.at_vistos = {}
        self.pe_vistos = defaultdict(list)
        self._centro_ant = {}

    # ---- passada por todos os quadros
    def rodar(self):
        sc, C = self.sc, self.C
        f0, f1 = sc.frame_start, sc.frame_end
        seguir = [o for o in C.dinamicos if o.type in ('MESH', 'EMPTY') and o not in C.pele]
        atores = C.atores
        F = f1 - f0 + 1
        P = np.zeros((F, len(seguir), 3))
        V = np.zeros((F, len(seguir)), dtype=bool)
        AP = np.zeros((F, len(atores), 3))
        AF = np.zeros((F, len(atores), 3))
        AV = np.zeros((F, len(atores)), dtype=bool)
        portadores = [C.portador(a) for a in atores]
        APORT = np.zeros((F, len(atores), 3))
        cam = sc.camera
        simetricos = C.simetricos
        SQ = np.zeros((F, len(simetricos), 4))
        SV = np.zeros((F, len(simetricos)), dtype=bool)   # a peça com simetria está visível e com escala (giro medível)
        CP = np.zeros((F, 3))
        CQ = np.zeros((F, 4))
        veics = [bpy.data.objects[v[0]] for v in self.veiculos]
        VP = np.zeros((F, len(veics), 3))               # posição, nariz e "pra cima" (mundo) de cada veículo declarado
        VN = np.zeros((F, len(veics), 3))
        VC = np.zeros((F, len(veics), 3))
        VV = np.zeros((F, len(veics)), dtype=bool)
        self._prepara_sumico()
        self._prepara_suportes()
        cands = self.sum_cands
        VS = np.zeros((F, len(cands)), dtype=bool)     # visibilidade, quadro a quadro, de quem termina o vídeo invisível
        CM = np.zeros((F, 4, 4))                        # matriz da câmera (projeção x vista) de cada quadro
        rx, ry = sc.render.resolution_x, sc.render.resolution_y
        t0 = time.time()
        self._P, self._V, self._i, self._f0 = P, V, 0, f0
        self._idx = {o: j for j, o in enumerate(seguir)}
        for i, f in enumerate(range(f0, f1 + 1)):
            sc.frame_set(f)
            self._i = i
            mc = cam.matrix_world
            CP[i] = mc.translation
            CQ[i] = mc.to_quaternion()
            if cands:
                CM[i] = np.array(cam.calc_matrix_camera(bpy.context.evaluated_depsgraph_get(), x=rx, y=ry)) @ np.array(mc.inverted())
                for k, o in enumerate(cands):
                    VS[i, k] = C.visivel(o)
            if self.sup:
                self._amostra_suportes(f)
            for j, o in enumerate(simetricos):
                SQ[i, j] = o.matrix_world.to_quaternion()
                SV[i, j] = C.visivel(o)
            for j, (o, v) in enumerate(zip(veics, self.veiculos)):
                m3 = o.matrix_world.to_3x3()
                VP[i, j] = o.matrix_world.translation
                VN[i, j] = (m3 @ Vector(v[1])).normalized()
                VC[i, j] = (m3 @ Vector((0.0, 0.0, 1.0))).normalized()
                VV[i, j] = C.visivel(o)
            for j, o in enumerate(seguir):
                mw = o.matrix_world
                P[i, j] = mw.translation
                V[i, j] = C.visivel(o)
            for j, a in enumerate(atores):
                mw = a.matrix_world
                fr = math.radians(a.get('frente_graus', -90.0))
                AV[i, j] = C.visivel(a)
                if portadores[j] is not None:
                    # dentro de um veículo, posição e frente nos EIXOS DO VEÍCULO: o passageiro sentado no avião que
                    # inclina numa curva não "anda de lado" (no mundo, a posição dele gira junto com o avião)
                    inv = portadores[j].matrix_world.inverted()
                    AP[i, j] = inv @ mw.translation
                    AF[i, j] = inv.to_3x3() @ (mw.to_3x3() @ Vector((math.cos(fr), math.sin(fr), 0.0)))
                else:
                    AP[i, j] = mw.translation
                    AF[i, j] = (mw.to_3x3() @ Vector((math.cos(fr), math.sin(fr), 0.0)))
            if i % PASSO_AMOSTRA == 0:
                self.dg = bpy.context.evaluated_depsgraph_get()
                self.amostra(f)
        print(f'CHECAR passada em {time.time() - t0:.0f} s ({F} quadros, {len(seguir)} peças que se movem)')
        self.saltos(seguir, P, V, f0)
        self.camera_e_cortes(CP, CQ, f0)
        self.visibilidade_no_corte()
        self.fecha_apoio()
        self.fecha_suportes()
        self.sumico(VS, CM, f0)
        self.visivel_antes_da_hora()
        self.pecas_nomeadas()
        self.focos_no_quadro()
        self.rodas(SQ, f0, SV)
        self.fora_da_cena(CP)
        self.atores_mov(atores, AP - APORT, AF, AV, f0)
        self.nariz(VP, VN, VC, VV, f0)
        self.tampas_no_corte()
        self.fecha_pes()
        self.varre_estaticos()
        self.fecha_zf()
        self.fecha_atravessar()
        return self.relatorio()

    # ---- salto
    def saltos(self, seguir, P, V, f0):
        C = self.C
        D = np.full((P.shape[0] - 1, P.shape[1]), np.nan)
        par = V[1:] & V[:-1]
        D[par] = np.linalg.norm(P[1:] - P[:-1], axis=2)[par]
        achados = {}
        for i in range(D.shape[0]):
            for j in np.nonzero(D[i] > SALTO_MIN)[0]:
                viz = [D[k, j] for k in (i - 2, i - 1, i + 1, i + 2) if 0 <= k < D.shape[0] and not np.isnan(D[k, j])]
                local = max(viz) if viz else 0.0
                if D[i, j] <= SALTO_MIN + SALTO_VEZES * local:
                    continue
                f = f0 + i + 1
                if f in self.cortes:   # o salto do corte cai no quadro do corte e só nele
                    continue
                o = seguir[j]
                r = C.raiz(o)
                chave = (r.name, f)
                if chave not in achados or achados[chave][0] < D[i, j]:
                    achados[chave] = (D[i, j], o.name, tuple(P[i, j]), tuple(P[i + 1, j]))
        # junta quadros seguidos do mesmo grupo
        por_raiz = defaultdict(list)
        for (r, f), v in achados.items():
            por_raiz[r].append((f, v))
        for r, lst in por_raiz.items():
            lst.sort()
            ult = None
            for f, (d, nome, a, b) in lst:
                if ult is not None and f - ult <= 2:
                    ult = f
                    continue
                ult = f
                self.erros.append((C.t(f), 'SALTO', f'{r}: a peça "{nome}" pula {d:.2f} m de um quadro pro outro '
                                   f'(quadro {f}), de ({a[0]:.2f}, {a[1]:.2f}, {a[2]:.2f}) pra ({b[0]:.2f}, {b[1]:.2f}, {b[2]:.2f}). '
                                   f'Entrada e movimento brigando pelo mesmo canal? Use K.entra (delta) e um só movimento em location.'))

    # ---- câmera: salto fora de corte, corte que não vira salto, quadro fantasma
    def camera_e_cortes(self, CP, CQ, f0):
        C = self.C
        D = np.linalg.norm(CP[1:] - CP[:-1], axis=1)
        dot = np.abs((CQ[1:] * CQ[:-1]).sum(1)).clip(0, 1)
        A = 2 * np.arccos(dot)                      # rad entre quadros seguidos
        n = len(D)
        for i in range(n):
            f = f0 + i + 1                          # salto entre os quadros f-1 e f
            viz_d = max([D[k] for k in (i - 2, i - 1, i + 1, i + 2) if 0 <= k < n] or [0])
            viz_a = max([A[k] for k in (i - 2, i - 1, i + 1, i + 2) if 0 <= k < n] or [0])
            salto = D[i] > 0.3 + 4 * viz_d or A[i] > 0.07 + 4 * viz_a
            if salto and f not in self.cortes:
                self.erros.append((C.t(f), 'CÂMERA', f'salto de câmera fora de um corte declarado (quadro {f}): {D[i]:.2f} m e '
                                   f'{math.degrees(A[i]):.1f} graus de um quadro pro outro. Dois pontos de câmera muito juntos?'))
        for fc in sorted(set(self.cortes)):
            i = fc - f0 - 1
            if not 0 <= i < n:
                continue
            viz_d = max([D[k] for k in (i - 2, i - 1, i + 1, i + 2) if 0 <= k < n] or [0])
            viz_a = max([A[k] for k in (i - 2, i - 1, i + 1, i + 2) if 0 <= k < n] or [0])
            if not (D[i] > 0.3 + 4 * viz_d or A[i] > 0.07 + 4 * viz_a):
                self.erros.append((C.t(fc), 'CORTE', f'o corte declarado no quadro {fc} não vira salto de câmera em 1 quadro '
                                   f'(salto de {D[i]:.2f} m): a câmera viaja em vez de cortar. Conta de tempo diferente entre os planos?'))
                continue
            # o obturador do motion blur não pode abrir sobre o salto: o quadro do corte sairia com fantasma dos 2 planos
            meio = self.sc.render.motion_blur_shutter / 2 if self.sc.render.use_motion_blur else 0.0
            if meio > 0:
                self.sc.frame_set(fc - 1, subframe=1.0 - meio)
                a = Vector(self.sc.camera.matrix_world.translation)
                self.sc.frame_set(fc, subframe=meio)
                b = Vector(self.sc.camera.matrix_world.translation)
                self.sc.frame_set(fc)
                if (a - b).length > 0.3:
                    self.erros.append((C.t(fc), 'FANTASMA', f'o quadro do corte {fc} sai com o obturador aberto sobre o salto da câmera '
                                       f'({(a - b).length:.1f} m): mistura dos dois planos. O corte tem que cair a meio quadro antes do corte.'))

    def visibilidade_no_corte(self):
        """o que some ou aparece perto de um corte troca NO quadro do corte. 1 ou 2 quadros antes, a peça some ainda no
        plano velho (a parede da cozinha sumindo e o céu aparecendo); 1 ou 2 depois, ela pisca no plano novo."""
        if not self.cortes:
            return
        C = self.C
        achados = {}
        for o in bpy.data.objects:
            if o.type not in ('MESH', 'CURVE', 'FONT', 'SURFACE', 'META'):
                continue
            ad = o.animation_data
            if not ad or not ad.action:
                continue
            cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
            fc = next((x for x in cb.fcurves if x.data_path == 'hide_render'), None) if cb else None
            if fc is None:
                continue
            for c in sorted(set(self.cortes)):
                for f in range(c - 2, c + 3):
                    if f == c:
                        continue
                    a, b = fc.evaluate(f - 1) > 0.5, fc.evaluate(f) > 0.5
                    if a != b:
                        achados.setdefault((C.raiz(o).name, f), (c, o.name, b))
        for (r, f), (c, nome, escondido) in sorted(achados.items(), key=lambda kv: kv[0][1]):
            self.erros.append((C.t(f), 'VISIBILIDADE', f'"{nome}" {"some" if escondido else "aparece"} no quadro {f}, {abs(f - c)} quadro(s) '
                               f'{"antes" if f < c else "depois"} do corte (quadro {c}): pisca na tela. Troque no quadro do corte '
                               f'(K.esconde_no_corte, ou K.aparece/K.some no tempo exato do corte).'))

    def _ve(self, dg, origem, q, alvos, tol):
        """a câmera (em origem) enxerga o ponto q de um dos `alvos`? O raio atravessa superfície transparente e efeito
        sem corpo (vidro, névoa, onda): o que está atrás do vidro é visto (e o z-fighting atrás dele pisca na tela)."""
        d = q - origem
        dist = d.length
        if dist < 1e-6:
            return False
        u = d / dist
        o = origem
        for _ in range(8):
            resto = dist - (o - origem).length + 0.05
            if resto <= 0:
                return False
            h = self.sc.ray_cast(dg, o, u, distance=resto)
            if not h[0]:
                return False
            if h[4].name in alvos and (h[1] - q).length < tol:
                return True
            if self.C.transparente(h[4]) or h[4].get('sem_corpo'):
                o = h[1] + u * 1e-3
                continue
            return False
        return False

    def apoio_amostra(self, f):
        """peça declarada com K.apoio: algum dos pontos mais baixos dela tem coisa embaixo a até 1 cm?"""
        C, sc, dg = self.C, self.sc, self.dg
        t = C.t(f)
        for nome, t0, t1 in self.apoios:
            if t < t0 or (t1 is not None and t > t1):
                continue
            if any(a <= t <= b for a, b in self.entradas.get(nome, ())):
                continue
            o = bpy.data.objects.get(nome)
            if o is None:
                continue
            pecas = [x for x in [o] + list(o.children_recursive) if x.type == 'MESH' and x in C.renderiza and C.visivel(x)]
            if not pecas:
                continue
            proprios = {x.name for x in [o] + list(o.children_recursive)}
            W = np.concatenate([_malha(x, dg)[0] for x in pecas])
            if not len(W):
                continue
            baixos = W[np.argsort(W[:, 2])[:24]]
            menor = None
            for p in baixos[::2]:
                origem = Vector((p[0], p[1], p[2] + 0.03))
                for _ in range(8):
                    h = sc.ray_cast(dg, origem, Vector((0, 0, -1)), distance=50.0)
                    if not h[0]:
                        break
                    if h[4].name in proprios or h[4].get('sem_corpo'):
                        origem = h[1] - Vector((0, 0, 1e-4))
                        continue
                    # face virada pra baixo: o raio começou DENTRO do apoio (a peça redonda toca o piso num ponto só e o
                    # passo abaixo dela já entra no piso): está encostada
                    # (só se o topo desse sólido estiver colado no ponto; dentro de uma parede grossa não é apoio)
                    if h[2].z < -0.5:
                        cima = sc.ray_cast(dg, origem, Vector((0, 0, 1)), distance=0.2)
                        if not (cima[0] and cima[4] == h[4] and cima[2].z > 0.5 and cima[1].z <= p[2] + 0.03):
                            break
                        gap = 0.0
                    else:
                        gap = p[2] - h[1].z
                    menor = gap if menor is None else min(menor, gap)
                    break
                if menor is not None and menor <= APOIO_FOLGA:
                    break
            if menor is None or menor > APOIO_FOLGA:
                self.apoio_ruins[nome].append((t, menor))

    def fecha_apoio(self):
        for nome, lst in self.apoio_ruins.items():
            grupos = []
            for t, g in sorted(lst, key=lambda x: x[0]):
                if grupos and t - grupos[-1][-1][0] <= PASSO_AMOSTRA / self.C.fps * 1.5:
                    grupos[-1].append((t, g))
                else:
                    grupos.append([(t, g)])
            for gr in grupos:
                gs = [g for _, g in gr if g is not None]
                quanto = f'{min(gs) * 100:.0f} cm acima do que está embaixo' if gs else 'sem nada embaixo'
                self.erros.append((gr[0][0], 'APOIO', f'"{nome}" flutua: o ponto mais baixo fica {quanto}, de {gr[0][0]:.1f} s a {gr[-1][0]:.1f} s. '
                                   f'Pouse a peça (folga de até {APOIO_FOLGA * 100:.0f} cm) ou ponha um suporte de verdade.'))

    # ---- carga e suportes (K.apoio(carga, *suportes)): o que segura aparece sempre que a carga aparece
    def _prepara_suportes(self):
        self.sup = []
        for carga, nomes, t0, t1 in self.suportes:
            c = bpy.data.objects.get(carga)
            if c is None:
                continue
            cm = [x for x in [c] + list(c.children_recursive) if x.type in ('MESH', 'CURVE')]
            ss = []
            for n in nomes:
                s = bpy.data.objects.get(n)
                if s is not None:
                    ss.append((n, [x for x in [s] + list(s.children_recursive) if x.type in ('MESH', 'CURVE')] or [s]))
            self.sup.append(dict(carga=carga, cm=cm, ss=ss, t0=t0, t1=t1, ruins=defaultdict(list)))

    def _no_quadro(self, objs):
        """a caixa de algum dos objetos cai dentro do quadro da câmera (agora)?"""
        sc = self.sc
        xs, ys = [], []
        for o in objs:
            M = o.matrix_world
            for c in o.bound_box:
                v = world_to_camera_view(sc, sc.camera, M @ Vector(c))
                if v.z > 0:
                    xs.append(v.x)
                    ys.append(v.y)
        return bool(xs) and min(xs) < 1 and max(xs) > 0 and min(ys) < 1 and max(ys) > 0

    def _amostra_suportes(self, f):
        C = self.C
        t = C.t(f)
        for d in self.sup:
            if t < d['t0'] - 1e-6 or (d['t1'] is not None and t > d['t1'] + 1e-6):
                continue
            vis = [x for x in d['cm'] if C.visivel(x)]
            if not vis or not self._no_quadro(vis):
                continue
            for n, sm in d['ss']:
                if not any(C.visivel(x) for x in sm):
                    d['ruins'][n].append(f)

    def fecha_suportes(self):
        C = self.C
        for d in self.sup:
            for n, fs in d['ruins'].items():
                for ini, fim in self._faixas(sorted(fs)):
                    t0, t1 = C.t(ini), C.t(fim)
                    self.erros.append((t0, 'APOIO', f'"{d["carga"]}" aparece no quadro de {t0:.2f} s a {t1:.2f} s sem o suporte "{n}", que está '
                                       f'escondido: a carga fica pendurada no nada. O que segura uma carga aparece em todo plano em que ela '
                                       f'aparece (esconder pra outro trecho é K.esconde, que devolve a peça).'))

    # ---- sumiço: o que some de vez sem motivo e deixa o lugar vazio na frente da câmera
    def _prepara_sumico(self):
        """candidatas: malhas que terminam o vídeo invisíveis (escondidas ou com escala 0). Efeito sem corpo e seta de força
        ficam de fora (fumaça que se desfaz e seta que acaba são o esperado)."""
        C, sc = self.C, self.sc
        sc.frame_set(sc.frame_end)
        self.sum_vis_fim = {o.name: C.visivel(o) for o in bpy.data.objects}
        self.sum_cands = [o for o in C.malhas if not self.sum_vis_fim[o.name] and not o.get('sem_corpo') and not o.get('anotacao')]
        sc.frame_set(sc.frame_start)

    def _dono_sumico(self, o):
        """a peça inteira que sumiu: sobe enquanto o pai também termina invisível (a pessoa, o grupo do limitador)."""
        x = o
        while x.parent is not None and not self.sum_vis_fim.get(x.parent.name, True):
            x = x.parent
        return x

    def _livre(self, dg, origem, q, tol=0.03):
        """nada opaco entre a câmera e o ponto q (vidro, névoa e efeito sem corpo deixam passar)."""
        d = q - origem
        dist = d.length
        if dist < 1e-6:
            return True
        u = d / dist
        o = origem
        for _ in range(8):
            resto = dist - (o - origem).length - tol
            if resto <= 0:
                return True
            h = self.sc.ray_cast(dg, o, u, distance=resto)
            if not h[0]:
                return True
            if self.C.transparente(h[4]) or h[4].get('sem_corpo') or h[4].get('anotacao'):
                o = h[1] + u * 1e-3
                continue
            return False
        return False

    def sumico(self, VS, CM, f0):
        C, sc = self.C, self.sc
        F = VS.shape[0]
        grupos = defaultdict(list)
        for k, o in enumerate(self.sum_cands):
            idx = np.nonzero(VS[:, k])[0]
            if len(idx) and idx[-1] < F - 1:          # apareceu em algum quadro e termina invisível
                grupos[self._dono_sumico(o)].append((o, int(idx[-1])))
        regs = []
        for dono, itens in grupos.items():
            last = max(i for _, i in itens)
            sc.frame_set(f0 + last)
            dg = bpy.context.evaluated_depsgraph_get()
            P = []
            for o, i in itens:
                if i == last:
                    eo = o.evaluated_get(dg)
                    P += [tuple(eo.matrix_world @ Vector(c)) for c in eo.bound_box]
            P = np.array(P)
            mn, mx = P.min(0), P.max(0)
            motivo = None
            for o, _ in itens:
                x = o
                while x is not None and not motivo:
                    motivo = self.sumicos.get(x.name, (None, None))[1] or x.get('some_motivo')
                    x = None if x is dono else x.parent
                if motivo:
                    break
            fr = (0.15, 0.5, 0.85)
            grade = np.array([[mn[0] + (mx[0] - mn[0]) * a, mn[1] + (mx[1] - mn[1]) * b, mn[2] + (mx[2] - mn[2]) * c]
                              for a in fr for b in fr for c in fr])
            cantos = np.array([[x, y, z, 1.0] for x in (mn[0], mx[0]) for y in (mn[1], mx[1]) for z in (mn[2], mx[2])])
            regs.append(dict(dono=dono, last=last, motivo=motivo, grade=grade, cantos=cantos, vistos=[]))
        # em que quadros, depois do sumiço, o lugar cai no quadro com tamanho que se vê
        agenda = defaultdict(list)
        for r in regs:
            cand = []
            for i in range(r['last'] + 1, F):
                clip = r['cantos'] @ CM[i].T
                w = clip[:, 3]
                ok = w > 1e-6
                if not ok.any():
                    continue
                ndc = clip[ok, :2] / w[ok, None]
                (x0, y0), (x1, y1) = ndc.min(0), ndc.max(0)
                if not ok.all():                       # parte da caixa atrás da câmera: ela envolve a câmera
                    x0, y0, x1, y1 = min(x0, -1), min(y0, -1), max(x1, 1), max(y1, 1)
                ax = max(0.0, min(x1, 0.9) - max(x0, -0.9))
                ay = max(0.0, min(y1, 0.9) - max(y0, -0.9))
                if ax * ay >= SUMICO_AREA:
                    cand.append(i)
            for i in cand[::3][:80]:
                agenda[i].append(r)
        # e se a câmera enxerga o lugar vazio (nada opaco na frente de algum ponto da caixa)
        for i in sorted(agenda):
            rs = [r for r in agenda[i] if len(r['vistos']) < SUMICO_VISTAS]
            if not rs:
                continue
            f = f0 + i
            sc.frame_set(f)
            dg = bpy.context.evaluated_depsgraph_get()
            origem = sc.camera.matrix_world.translation.copy()
            for r in rs:
                G = r['grade']
                clip = np.c_[G, np.ones(len(G))] @ CM[i].T
                for k in np.nonzero(clip[:, 3] > 1e-6)[0]:
                    if abs(clip[k, 0] / clip[k, 3]) > 0.95 or abs(clip[k, 1] / clip[k, 3]) > 0.95:
                        continue
                    if self._livre(dg, origem, Vector(G[k].tolist())):
                        r['vistos'].append(f)
                        break
        sc.frame_set(sc.frame_start)
        linhas = defaultdict(list)     # o que some no mesmo quadro, pelo mesmo motivo, vira uma linha só
        for r in regs:
            if len(r['vistos']) >= SUMICO_VISTAS:
                linhas[(r['motivo'] or '', r['last'])].append((r['dono'].name, r['vistos'][0]))
        for (motivo, last), itens in sorted(linhas.items(), key=lambda kv: kv[0][1]):
            nomes = [n for n, _ in itens]
            t_some, t_vis = C.t(f0 + last + 1), C.t(min(f for _, f in itens))
            lista = ', '.join(f'"{n}"' for n in sorted(nomes)[:12]) + (f' e mais {len(nomes) - 12}' if len(nomes) > 12 else '')
            if motivo:
                self.avisos.append((t_some, 'SUMIÇO', f'{lista} some de vez em {t_some:.2f} s ({motivo}) e o lugar volta à câmera a partir de '
                                    f'{t_vis:.2f} s. Confira se o motivo está na tela.'))
            else:
                self.erros.append((t_some, 'SUMIÇO', f'{lista} some de vez em {t_some:.2f} s, sem motivo, e o lugar onde estava volta a '
                                   f'aparecer na câmera a partir de {t_vis:.2f} s, vazio. Esconder pra outro trecho é K.esconde(obj, t0, t1), que '
                                   f'devolve a peça; sumir de vez pede o motivo na tela: K.some(obj, t, motivo="quebrou").'))

    def focos_no_quadro(self):
        """o objeto-foco de cada plano tem que ficar dentro do quadro (10% a 90%) enquanto o plano dura."""
        sc, C = self.sc, self.C
        for nome, t0, t1 in self.focos:
            o = bpy.data.objects.get(nome)
            if o is None:
                continue
            fora = []
            for f in range(1 + math.floor(t0 * C.fps + 0.5), 1 + math.floor(t1 * C.fps + 0.5) + 1, 3):
                sc.frame_set(f)
                if not C.visivel(o):
                    continue
                v = world_to_camera_view(sc, sc.camera, o.matrix_world.translation)
                if not (0.1 <= v.x <= 0.9 and 0.1 <= v.y <= 0.9 and v.z > 0):
                    fora.append(C.t(f))
            if fora:
                self.erros.append((fora[0], 'FOCO', f'o foco do plano, "{nome}", sai do quadro (fora da faixa de 10% a 90%) de {fora[0]:.1f} s a {fora[-1]:.1f} s '
                                   f'({len(fora)} amostras). A câmera perdeu o objeto.'))
        sc.frame_set(sc.frame_start)

    def rodas(self, SQ, f0, SV=None):
        """peça com simetria (n pás/raios) que gira mais de 40% do passo entre pás por quadro parece girar ao contrário."""
        C = self.C
        for j, o in enumerate(C.simetricos):
            n = int(o.get('simetria'))
            passo = 2 * math.pi / n
            dot = np.abs((SQ[1:, j] * SQ[:-1, j]).sum(1)).clip(0, 1)
            ang = 2 * np.arccos(dot)
            # quadro com a peça escondida ou de escala zero (o casco nascendo de escala 0) não tem giro medível
            ruins = [i for i in range(len(ang)) if ang[i] > 0.4 * passo and (f0 + i + 1) not in self.cortes
                     and (SV is None or (SV[i, j] and SV[i + 1, j]))]
            for ini, fim in self._faixas(ruins):
                self.erros.append((C.t(f0 + ini), 'RODA', f'"{o.name}" gira {math.degrees(ang[ini:fim + 1].max()):.0f} graus por quadro, mais de 40% do passo '
                                   f'entre pás ({math.degrees(passo):.0f} graus): parece girar ao contrário. De {C.t(f0 + ini):.1f} s a {C.t(f0 + fim):.1f} s.'))

    def fora_da_cena(self, CP):
        """objeto visível muito longe de onde a câmera trabalha: quase sempre posição de mundo dobrada por `pai=`.
        Peça que se move é conferida pela posição de verdade nos quadros em que está visível (a matriz de uma peça
        escondida no quadro 1 é velha: a nuvem do fim do vídeo aparecia a 1,5 km): só acusa se ela NUNCA passa a menos
        de 200 m de onde a câmera trabalha enquanto está visível (nuvem e paisagem que atravessam a cena passam)."""
        C = self.C
        mn, mx = CP.min(0) - 200, CP.max(0) + 200
        self.sc.frame_set(self.sc.frame_start)
        for o in C.malhas:
            if o in C.pele:
                continue
            j = self._idx.get(o)
            if j is not None:
                vis = self._V[:, j]
                if not vis.any():
                    continue
                Pv = self._P[vis, j]
                dentro = np.all((Pv >= mn) & (Pv <= mx), axis=1)
                if dentro.any():
                    continue
                p = Pv[0]
            else:
                p = np.array(o.matrix_world.translation)
            if np.any(p < mn) or np.any(p > mx):
                self.erros.append((0.0, 'FORA DA CENA', f'"{o.name}" está em ({p[0]:.0f}, {p[1]:.0f}, {p[2]:.0f}), a mais de 200 m de onde a câmera trabalha. '
                                   f'Com `pai=`, `loc` é LOCAL ao pai (não repita a posição de mundo).'))

    def visivel_antes_da_hora(self):
        """peça registrada em K.aparece que está visível antes do tempo de entrada (o `animation_data_clear` de uma cena
        apaga as chaves de visibilidade e a peça aparece no quadro 1)."""
        C, sc = self.C, self.sc
        for nome, t in sorted(self.aparecem.items(), key=lambda kv: kv[1]):
            o = bpy.data.objects.get(nome)
            if o is None:
                continue
            f = 1 + math.floor(t * C.fps + 0.5) - 2
            if f < sc.frame_start:
                continue
            sc.frame_set(f)
            if not o.hide_render:
                self.erros.append((t, 'APARECE', f'"{nome}" está visível em {C.t(f):.2f} s, antes do tempo de entrada ({t:.2f} s): '
                                   f'a chave de visibilidade foi apagada (animation_data_clear?).'))
        sc.frame_set(sc.frame_start)

    # ---- a peça nomeada (acende) está na tela no instante em que é nomeada?
    def pecas_nomeadas(self):
        C, sc = self.C, self.sc
        for objs, t0, t1 in self.acendes:
            f = 1 + math.floor((t0 + 0.1) * C.fps + 0.5)
            sc.frame_set(f)
            dg = bpy.context.evaluated_depsgraph_get()
            todos = []
            for o in objs:
                todos += [x for x in [o] + list(o.children_recursive) if x.type in ('MESH', 'CURVE') and C.visivel(x)
                          and (x.type == 'CURVE' or x in C.renderiza)]
            if not todos:
                self.erros.append((t0, 'NOMEADA', f'a peça "{objs[0].name}" não existe (invisível) quando é nomeada.'))
                continue
            nomes = {x.name for x in todos}
            pts = []
            for x in todos:
                W = _malha(x, dg)[0]
                pts.append(W[::max(1, len(W) // 60)])
            pts = np.concatenate(pts)
            cam = sc.camera
            origem = cam.matrix_world.translation
            vistos = 0
            for p in pts[::max(1, len(pts) // 400)]:
                q = Vector(p)
                v = world_to_camera_view(sc, cam, q)
                if not (0.02 <= v.x <= 0.98 and 0.02 <= v.y <= 0.98 and v.z > 0):
                    continue
                if self._ve(dg, origem, q, nomes, 0.06):
                    vistos += 1
                    if vistos >= 3:
                        break
            if vistos < 3:
                self.erros.append((t0, 'NOMEADA', f'a peça "{objs[0].name}" acende em {t0:.1f} s mas a câmera não enxerga ela (fora do quadro '
                                   f'ou escondida). A peça nomeada tem que estar na tela no "Esse é o...".'))
        sc.frame_set(sc.frame_start)

    # ---- geometria por amostra
    def _geo_est(self, o):
        if o not in self.cache_est:
            W, tri, ls, lt, lv = _malha(o, self.dg)
            self.cache_est[o] = (W, tri, _faces(W, ls, lt, lv), ls, lt, lv)
        return self.cache_est[o]

    def _bvh_estatico(self):
        C = self.C
        vis = [o for o in C.estaticos if C.visivel(o)]
        sig = tuple(id(o) for o in vis)
        if sig not in self.cache_bvh:
            Ws, tris, nomes, off, ver = [], [], [], [], 0
            vis = [o for o in vis if len(self._geo_est(o)[0])]
            for o in vis:
                W, tri, *_ = self._geo_est(o)
                Ws.append(W)
                tris.append(tri + ver)
                nomes.append((sum(len(x) for x in tris[:-1]), o.name))
                ver += len(W)
            if not Ws:
                self.cache_bvh[sig] = None
            else:
                W = np.concatenate(Ws)
                T = np.concatenate(tris)
                caixas = {o.name: (x.min(0), x.max(0)) for o, x in zip(vis, Ws)}
                self.cache_bvh[sig] = (BVHTree.FromPolygons(W.tolist(), T.tolist()), W.min(0), W.max(0), nomes, W, caixas)
            if len(self.cache_bvh) > 12:
                self.cache_bvh.pop(next(iter(self.cache_bvh)))
        return self.cache_bvh[sig]

    def _raizes_dinamicas(self):
        """raiz -> lista de objetos malha visíveis dela (avaliados agora)."""
        C = self.C
        r = defaultdict(list)
        for o in C.malhas:
            if C.dinamico(o) and C.visivel(o):
                r[C.raiz(o)].append(o)
        return r

    def amostra(self, f):
        self.zfight(f)
        self.atravessar_e_pes(f)
        self.parede_fina(f)
        if self.apoios:
            self.apoio_amostra(f)

    @staticmethod
    def _peca(o):
        """a peça a que a malha pertence: o primeiro vazio acima dela (o grupo do compressor, o modelo pronto), ou ela."""
        x = o.parent
        while x is not None:
            if x.type == 'EMPTY':
                return x
            x = x.parent
        return o

    def parede_fina(self, f):
        """peça compacta que, vista do centro dela, passa uma parede inteira e sai do outro lado: furou a parede."""
        C, dg = self.C, self.dg
        est = self._bvh_estatico()
        if not est:
            return
        t = C.t(f)
        pecas = defaultdict(list)
        for o in C.malhas:
            if C.dinamico(o) and C.visivel(o) and o not in C.pele and o not in C.sem_corpo:
                pecas[self._peca(o)].append(o)
        for p, objs in pecas.items():
            if p.get('ator') or any(a <= t <= b for a, b in self.entradas.get(p.name, ())):
                continue
            W = np.concatenate([_malha(o, dg)[0] for o in objs])
            if not len(W):
                continue
            mn, mx = W.min(0), W.max(0)
            tam = float((mx - mn).max())
            if tam > PECA_MAX or tam < 0.03:
                continue
            c = Vector(((mn + mx) / 2).tolist())
            for q in W[::max(1, len(W) // 150)]:
                d = Vector(q.tolist()) - c
                L = d.length
                if L < 0.02:
                    continue
                u = d / L
                hit = est[0].ray_cast(c, u, L)
                if hit[0] is None or hit[1].dot(d) >= 0:
                    continue
                resto = L - hit[3]
                sai = est[0].ray_cast(hit[0] + u * 1e-4, u, resto)
                if sai[0] is None or sai[1].dot(d) <= 0:
                    continue        # entrou e não saiu do outro lado: é encaixe (o teste de 8 cm cuida)
                passa = resto - sai[3]
                if passa > FURA:
                    alvo = self._quem(est[3], hit[2])
                    chave = (p.name, alvo, False)
                    reg = self.at_vistos.get(chave)
                    if reg is None:
                        self.at_vistos[chave] = dict(t0=t, t1=t, prof=passa, p=tuple(q), fura=True)
                    else:
                        reg['t1'] = t
                        reg['prof'] = max(reg['prof'], passa)
                    break

    # ---- z-fighting
    def zfight(self, f):
        C = self.C
        vis = [o for o in C.malhas if o not in C.pele and C.visivel(o)]
        din = [o for o in vis if C.dinamico(o)]
        sig = tuple(id(o) for o in vis if not C.dinamico(o))
        primeira = sig not in self.zf_sigs
        self.zf_sigs.add(sig)
        itens = []
        for o in vis:
            if C.dinamico(o):
                W, tri, ls, lt, lv = _malha(o, self.dg)
                fc = _faces(W, ls, lt, lv)
            else:
                W, tri, fc, ls, lt, lv = self._geo_est(o)
            if fc is not None:
                itens.append((o, W, ls, lt, lv, fc))
        if not itens:
            return
        din_set = set(din)
        n = np.concatenate([x[5]['n'] for x in itens])
        d = np.concatenate([x[5]['d'] for x in itens])
        mn = np.concatenate([x[5]['mn'] for x in itens])
        mx = np.concatenate([x[5]['mx'] for x in itens])
        oid = np.concatenate([np.full(len(x[5]['d']), i) for i, x in enumerate(itens)])
        pid = np.concatenate([x[5]['poly'] for x in itens])
        sgn = np.where(np.abs(n[:, 0]) > 1e-3, np.sign(n[:, 0]), np.where(np.abs(n[:, 1]) > 1e-3, np.sign(n[:, 1]), np.sign(n[:, 2])))
        nc = n * sgn[:, None]            # normal canônica: face de frente e face de trás caem no mesmo plano
        dc = d * sgn
        chave = np.round(nc * 50).astype(np.int64)
        _, kid = np.unique(chave, axis=0, return_inverse=True)
        comp = kid.reshape(-1).astype(np.float64) * 1e4 + dc
        ordem = np.argsort(comp, kind='stable')
        cs = comp[ordem]
        self._zf_tol = max(ZF_DIST, 0.0005 * self._dist_camera())
        fim = np.searchsorted(cs, cs + self._zf_tol, side='right')
        self._din_set = din_set
        # Os mesmos filtros de antes, na mesma ordem e com o mesmo resultado, mas em lote (numpy) em vez de par a par em
        # Python: com modelos prontos pesados (casas de 40 mil faces, árvores) eram milhões de pares por amostra e a
        # checagem da hidrelétrica levava horas. Só os pares que passam por todos os filtros vão pro _par_zf, em ordem.
        obj = [x[0] for x in itens]
        dyn = np.array([o in din_set for o in obj], dtype=bool)
        trn = np.array([C.transparente(o) for o in obj], dtype=bool)
        sem = np.array([o in C.sem_corpo for o in obj], dtype=bool)
        ids_a, ids_l = {}, {}
        aid = np.array([-1 if C.asset(o) is None else ids_a.setdefault(C.asset(o), len(ids_a)) for o in obj], dtype=np.int64)
        lid = np.array([-1 if C.look(o) is None else ids_l.setdefault(C.look(o), len(ids_l)) for o in obj], dtype=np.int64)
        N = len(ordem)
        cnt = np.maximum(0, fim - np.arange(N) - 1)
        ini = 0
        while ini < N:
            acum = np.cumsum(cnt[ini:])
            fim_bloco = ini + max(1, int(np.searchsorted(acum, 2_000_000, side='right')))
            pos = np.arange(ini, min(N, fim_bloco))
            ini = int(pos[-1]) + 1
            c_ = cnt[pos]
            tot = int(c_.sum())
            if tot == 0:
                continue
            A = np.repeat(pos, c_)
            B = A + 1 + (np.arange(tot) - np.repeat(np.cumsum(c_) - c_, c_))
            ia_, ib_ = ordem[A], ordem[B]
            oa_, ob_ = oid[ia_], oid[ib_]
            m = oa_ != ob_
            if not primeira:
                m &= dyn[oa_] | dyn[ob_]
            m &= ~((aid[oa_] >= 0) & (aid[oa_] == aid[ob_]))
            m &= ~(sem[oa_] & sem[ob_])      # dois efeitos translúcidos (fumaça com fumaça, chama com chama) não piscam um contra o outro
            ia_, ib_, oa_, ob_ = ia_[m], ib_[m], oa_[m], ob_[m]
            cosn = (n[ia_] * n[ib_]).sum(1)
            m = np.abs(cosn) >= ZF_NORMAL
            m &= ~((cosn < 0) & ~(trn[oa_] | trn[ob_]))   # faces opostas de sólidos se encostam sem brigar; só as transparentes piscam
            m &= ~((cosn > 0) & (lid[oa_] >= 0) & (lid[oa_] == lid[ob_]))
            m &= ~(np.any(mn[ia_] > mx[ib_] + ZF_DIST, axis=1) | np.any(mn[ib_] > mx[ia_] + ZF_DIST, axis=1))
            for ia, ib in zip(ia_[m].tolist(), ib_[m].tolist()):
                self._par_zf(f, itens, oid, pid, ia, ib, n)

    def _dist_camera(self):
        """distância da câmera ao que ela mira (o braço do rig): em plano aberto a precisão de profundidade é menor."""
        cam = self.sc.camera
        alvo = next((c.target for c in cam.constraints if getattr(c, 'target', None)), None)
        return (cam.matrix_world.translation - alvo.matrix_world.translation).length if alvo else 10.0

    def _par_zf(self, f, itens, oid, pid, ia, ib, n):
        oa, Wa, lsa, lta, lva, _ = itens[oid[ia]]
        ob, Wb, lsb, ltb, lvb, _ = itens[oid[ib]]
        pa = Wa[lva[lsa[pid[ia]]:lsa[pid[ia]] + lta[pid[ia]]]]
        pb = Wb[lvb[lsb[pid[ib]]:lsb[pid[ib]] + ltb[pid[ib]]]]
        na, nb = n[ia], n[ib]
        if np.abs((pb - pa[0]) @ na).max() > self._zf_tol or np.abs((pa - pb[0]) @ nb).max() > self._zf_tol:
            return
        area, centro, provas = _sobreposicao(pa, pb, na)
        if area < ZF_AREA:
            return
        par = tuple(sorted((oa.name, ob.name)))
        t = self.C.t(f)
        if par not in self.zf_est and oa not in self._din_set and ob not in self._din_set:
            self.zf_est[par] = dict(pts=np.array(provas[1:]), oa=oa, ob=ob, area=area, centro=tuple(centro), n=tuple(na),
                                    gap=float(abs((pb[0] - pa[0]) @ na)), vis=[])
        alvo = self.zf_vistos if self._camera_ve(provas, na, (oa.name, ob.name)) else self.zf_ocultos
        reg = alvo.get(par)
        if reg is None:
            alvo[par] = dict(t0=t, t1=t, area=area, centro=tuple(centro), n=tuple(na), gap=float(abs((pb[0] - pa[0]) @ na)))
        else:
            reg['t1'] = t
            if area > reg['area']:
                reg.update(area=area, centro=tuple(centro), n=tuple(na))

    def varre_estaticos(self):
        """os pares de faces coplanares entre peças PARADAS não mudam: a câmera é que passa. Varre os quadros (de 2 em 2)
        e anota em quais a câmera enxerga a sobreposição, pra pegar janelas curtas que a amostragem de 0,4 s perde."""
        if not self.zf_est:
            return
        sc, C = self.sc, self.C
        cam = sc.camera
        rx, ry = sc.render.resolution_x, sc.render.resolution_y
        rng = random.Random(7)
        for f in range(sc.frame_start, sc.frame_end + 1, 2):
            sc.frame_set(f)
            dg = bpy.context.evaluated_depsgraph_get()
            M = np.array(cam.calc_matrix_camera(dg, x=rx, y=ry)) @ np.array(cam.matrix_world.inverted())
            origem = cam.matrix_world.translation
            for par, r in self.zf_est.items():
                if not (C.visivel(r['oa']) and C.visivel(r['ob'])):
                    continue
                P = r['pts']
                clip = np.c_[P, np.ones(len(P))] @ M.T
                w = clip[:, 3]
                ok = (w > 0) & (np.abs(clip[:, 0]) <= w) & (np.abs(clip[:, 1]) <= w)
                idx = np.nonzero(ok)[0]
                if len(idx) == 0:
                    continue
                if len(idx) > 14:
                    idx = rng.sample(list(idx), 14)
                for k in idx:
                    if self._ve(dg, origem, Vector(P[k]), par, 0.03):
                        r['vis'].append(C.t(f))
                        break
        for par, r in self.zf_est.items():
            if r['vis']:
                reg = dict(t0=r['vis'][0], t1=r['vis'][-1], area=r['area'], centro=r['centro'], n=r['n'], gap=r['gap'])
                self.zf_vistos[par] = reg

    def _camera_ve(self, pontos, n, nomes):
        """a câmera, neste quadro, enxerga algum dos pontos (dentro do enquadramento e sem peça na frente)?"""
        cam = self.sc.camera
        origem = cam.matrix_world.translation
        for p in pontos:
            q = Vector(p)
            v = world_to_camera_view(self.sc, cam, q)
            if not (0.0 <= v.x <= 1.0 and 0.0 <= v.y <= 1.0 and v.z > 0.0):
                continue
            if self._ve(self.dg, origem, q, nomes, 0.03):
                return True
        return False

    def fecha_zf(self):
        for dic, lista, quando in ((self.zf_vistos, self.erros, 'a câmera enxerga de {t0:.1f} s a {t1:.1f} s'),
                                   (self.zf_ocultos, self.avisos, 'nenhuma amostra da câmera enxerga (ainda assim separe)')):
            for (a, b), r in dic.items():
                if dic is self.zf_ocultos and (a, b) in self.zf_vistos:
                    continue
                c, n = r['centro'], r['n']
                lista.append((r['t0'], 'Z-FIGHTING', f'"{a}" e "{b}": faces no mesmo plano (distância {r["gap"] * 1000:.1f} mm, normal '
                              f'({n[0]:.2f}, {n[1]:.2f}, {n[2]:.2f})), sobreposição de {r["area"]:.2f} m2 perto de ({c[0]:.2f}, {c[1]:.2f}, {c[2]:.2f}); '
                              + quando.format(**r) + '. Separe por 5 mm ou mais, ou corte uma delas.'))

    # ---- atravessar e pés no chão
    def atravessar_e_pes(self, f):
        C, dg = self.C, self.dg
        est = self._bvh_estatico()
        unidades = defaultdict(list)
        for o in C.malhas:
            if C.dinamico(o) and C.visivel(o) and o not in C.sem_corpo:
                unidades[C.unidade(o)].append(o)
        dinam, mapas = {}, {}
        for u, objs in list(unidades.items()):
            Ws, tris, ver, mapa, ntri = [], [], 0, [], 0
            for o in objs:
                W, tri, *_ = _malha(o, dg)
                if not len(W):
                    continue
                Ws.append(W)
                tris.append(tri + ver)
                mapa.append((ntri, o.name, W.min(0), W.max(0)))
                ntri += len(tri)
                ver += len(W)
            if not Ws:
                unidades.pop(u)
                continue
            W = np.concatenate(Ws)
            dinam[u] = (BVHTree.FromPolygons(W.tolist(), np.concatenate(tris).tolist()), W.min(0), W.max(0), W)
            mapas[u] = mapa
        t = C.t(f)
        for u in list(self._centro_ant):       # quem sumiu (invisível, escala 0) não liga a trajetória de antes com a de agora
            if u not in dinam:
                self._centro_ant.pop(u)
        for u, (bvh, mn, mx, W) in dinam.items():
            if any(a <= t <= b for a, b in self.entradas.get(u.name, ())):
                self._centro_ant.pop(u, None)
                continue
            centro = (mn + mx) / 2
            ant = self._centro_ant.get(u)
            self._centro_ant[u] = (f, centro)
            if est and ant is not None and not any(ant[0] < c <= f for c in self.cortes):
                j = self._idx.get(u)
                if j is not None:      # o caminho de verdade, quadro a quadro (a origem da peça + o desvio até o centro dela)
                    off = centro - self._P[self._i, j]
                    ia = self._i - (f - ant[0])
                    trechos = [(self._P[k - 1, j] + off, self._P[k, j] + off) for k in range(ia + 1, self._i + 1)
                               if self._V[k - 1, j] and self._V[k, j]]    # trecho com a peça invisível não conta
                else:
                    trechos = [(ant[1], centro)]
                for a_, b_ in trechos:
                    d = Vector(b_ - a_)
                    L = d.length
                    if L < 1e-6 or (j is None and L <= 0.05):
                        continue
                    hit = est[0].ray_cast(Vector(a_), d / L, L)
                    if hit[0] is not None:
                        alvo = self._quem(est[3], hit[2])
                        if not (C.asset(u) is not None and C.asset(bpy.data.objects[alvo]) == C.asset(u)):
                            chave = (u.name, alvo, False)
                            if chave not in self.at_vistos:
                                self.at_vistos[chave] = dict(t0=t, t1=t, prof=L, p=tuple(hit[0]), cruza=True)
                        break
            pts = W[::max(1, len(W) // 300)]
            alvos = []
            if est:
                alvos.append((None, est[0], est[1], est[2], est[3]))
            for u2, (b2, mn2, mx2, _) in dinam.items():
                if u2 is not u:
                    alvos.append((u2, b2, mn2, mx2, mapas[u2]))
            for u2, b2, mn2, mx2, mapa in alvos:
                if np.any(mn - 0.05 > mx2) or np.any(mn2 - 0.05 > mx):
                    continue
                ok = np.all(pts >= mn2 - 0.05, axis=1) & np.all(pts <= mx2 + 0.05, axis=1)
                for p in pts[ok]:
                    loc, nor, idx, dist = b2.find_nearest(Vector(p), 0.5)
                    if loc is None:
                        continue
                    if (Vector(p) - loc).dot(nor) < 0:
                        prof = self._profundidade(b2, Vector(p), loc, nor)
                        if prof < ATRAVESSA:
                            continue
                        # só está dentro se estiver dentro da caixa do objeto dono da face (modelo glTF com normal
                        # virada ou malha aberta dá 'dentro' a 25 cm de distância)
                        if u2 is None:
                            alvo = self._quem(mapa, idx)
                            cmn, cmx = est[5][alvo]
                        else:
                            dono = mapa[0]
                            for item in mapa:
                                if item[0] <= idx:
                                    dono = item
                            alvo, cmn, cmx = u2.name, dono[2], dono[3]
                        if np.any(p < cmn - 0.002) or np.any(p > cmx + 0.002):
                            continue
                        if u2 is None and C.asset(u) is not None and C.asset(bpy.data.objects[alvo]) == C.asset(u):
                            continue
                        # confirma pela paridade: raios a partir do ponto contam as faces da PRÓPRIA peça (ímpar =
                        # dentro). A normal da face mais perto erra na quina de um modelo pronto (a mão perto do braço
                        # da poltrona dava 11 cm "dentro" só com o avião inclinado) e em face de normal virada
                        ini, fim = self._faixa_tri(mapa, idx)
                        if not self._dentro_paridade(b2, Vector(p), ini, fim):
                            continue
                        leve = u.get('ator') == 'pessoa' and u2 is not None and u2.get('ator') == 'pessoa'
                        chave = (u.name, alvo, leve)
                        reg = self.at_vistos.get(chave)
                        if reg is None:
                            self.at_vistos[chave] = dict(t0=t, t1=t, prof=prof, p=tuple(p))
                        else:
                            reg['t1'] = t
                            if prof > reg['prof']:
                                reg.update(prof=prof, p=tuple(p))
                        break
        # pés no chão: o chão é o estático mais as peças que se movem (menos as pessoas)
        chao = [est[0]] if est else []
        for u, objs in unidades.items():
            sem = [o for o in objs if o not in C.pele]
            if sem and not u.get('ator'):
                Ws, tris, ver = [], [], 0
                for o in sem:
                    W, tri, *_ = _malha(o, dg)
                    Ws.append(W)
                    tris.append(tri + ver)
                    ver += len(W)
                W = np.concatenate(Ws)
                if not len(W):
                    continue
                chao.append(BVHTree.FromPolygons(W.tolist(), np.concatenate(tris).tolist()))
        for a in C.atores:
            if a.get('ator') != 'pessoa' or not C.visivel(a) or any(x <= t <= y for x, y in self.entradas.get(a.name, ()))                     or any(n == a.name and x <= t <= y for n, x, y in self.no_ar):
                continue
            filhos = [o for o in a.children_recursive if o.type == 'MESH' and o in C.renderiza and C.visivel(o)]
            if not filhos:
                continue
            baixo, xy = 1e9, None
            for o in filhos:
                W, *_ = _malha(o, dg)
                if not len(W):
                    continue
                k = int(np.argmin(W[:, 2]))
                if W[k, 2] < baixo:
                    baixo, xy = W[k, 2], W[k, :2]
            alt = -1e9
            for b in chao:
                hit = b.ray_cast(Vector((xy[0], xy[1], baixo + 0.5)), Vector((0, 0, -1)), 5.0)
                if hit[0] is not None:
                    alt = max(alt, hit[0].z)
            if alt < -1e8:
                continue
            gap = baixo - alt
            if gap > PE_FLUTUA or gap < -PE_AFUNDA:
                self.pe_vistos[a.name].append((t, gap))

    _RAIOS = [Vector(d).normalized() for d in ((0.31, 0.42, 0.85), (-0.52, 0.27, 0.81), (0.18, -0.61, 0.77))]

    @staticmethod
    def _faixa_tri(mapa, idx):
        """os triângulos [ini, fim) do objeto dono do triângulo idx no BVH juntado (estático: (início, nome); da unidade
        que se move: (início, nome, mn, mx))."""
        inis = sorted(item[0] for item in mapa)
        ini = max(i for i in inis if i <= idx)
        maiores = [i for i in inis if i > ini]
        return ini, (maiores[0] if maiores else 1 << 62)

    def _dentro_paridade(self, bvh, p, ini, fim):
        """o ponto está dentro da peça (triângulos [ini, fim) do BVH)? Em 3 raios pra cima, o saldo de faces dela que o
        raio atravessa SAINDO (normal a favor do raio) menos ENTRANDO: positivo = dentro. Aguenta as partes fechadas que
        se sobrepõem na mesma malha (comum em modelo pronto) e a quina. Vale a maioria (raio que raspa numa aresta)."""
        votos = 0
        for d in self._RAIOS:
            o, saldo = p.copy(), 0
            for _ in range(64):
                hit = bvh.ray_cast(o, d)
                if hit[0] is None:
                    break
                if ini <= hit[2] < fim:
                    saldo += 1 if hit[1].dot(d) > 0 else -1
                o = hit[0] + d * 1e-4
            votos += saldo > 0
        return votos >= 2

    @staticmethod
    def _profundidade(bvh, p, loc, nor):
        """quanto o ponto está dentro: distância até a superfície mais próxima (já sabemos que está do lado de dentro)."""
        return (p - loc).length

    @staticmethod
    def _quem(mapa, idx):
        nome = mapa[0][1]
        for ini, n in mapa:
            if ini <= idx:
                nome = n
        return nome

    def fecha_atravessar(self):
        for (a, b, leve), r in self.at_vistos.items():
            p = r['p']
            if r.get('cruza'):
                self.erros.append((r['t0'], 'ATRAVESSAR', f'"{a}" atravessa "{b}" em {r["t0"]:.1f} s: a trajetória entre duas amostras cruza o sólido '
                                   f'perto de ({p[0]:.2f}, {p[1]:.2f}, {p[2]:.2f}). Queda sem piso? Use K.queda.'))
                continue
            if r.get('fura'):
                self.erros.append((r['t0'], 'ATRAVESSAR', f'"{a}" fura "{b}": passa a parede inteira e {r["prof"] * 100:.1f} cm aparecem do outro lado, perto de '
                                   f'({p[0]:.2f}, {p[1]:.2f}, {p[2]:.2f}), de {r["t0"]:.1f} s a {r["t1"]:.1f} s. Afaste a peça ou abra espaço pra ela.'))
                continue
            (self.avisos if leve else self.erros).append((r['t0'], 'ATRAVESSAR', f'"{a}" entra {r["prof"] * 100:.0f} cm dentro de "{b}" perto de ({p[0]:.2f}, {p[1]:.2f}, {p[2]:.2f}), '
                               f'de {r["t0"]:.1f} s a {r["t1"]:.1f} s.'))

    def fecha_pes(self):
        for nome, lst in self.pe_vistos.items():
            lst.sort()
            grupos = []
            for t, g in lst:
                if grupos and t - grupos[-1][-1][0] <= PASSO_AMOSTRA / self.C.fps * 1.5:
                    grupos[-1].append((t, g))
                else:
                    grupos.append([(t, g)])
            for gr in grupos:
                gmax = max((g for _, g in gr), key=abs)
                quem = 'flutua' if gmax > 0 else 'afunda'
                self.erros.append((gr[0][0], 'PÉS', f'"{nome}" {quem}: pés {abs(gmax) * 100:.0f} cm {"acima" if gmax > 0 else "abaixo"} do chão, '
                                   f'de {gr[0][0]:.1f} s a {gr[-1][0]:.1f} s.'))

    # ---- pessoas e veículos: frente x movimento
    def _acoes(self, a):
        arm = next((o for o in [a] + list(a.children_recursive) if o.type == 'ARMATURE'), None)
        faixas = []
        if arm and arm.animation_data:
            for tr in arm.animation_data.nla_tracks:
                for st in tr.strips:
                    faixas.append((st.frame_start, st.frame_end, st.action.name.lower().split('|')[-1], 1.0 / max(1e-6, st.scale)))
        return faixas

    def atores_mov(self, atores, AP, AF, AV, f0):
        fps = self.C.fps
        for j, a in enumerate(atores):
            tipo = a.get('ator')
            faixas = self._acoes(a) if tipo == 'pessoa' else []
            n = AP.shape[0]
            v = np.zeros((n, 2))
            for i in range(n):
                lo, hi = max(0, i - 2), min(n - 1, i + 2)
                v[i] = (AP[hi, j, :2] - AP[lo, j, :2]) * fps / max(1, hi - lo)
            vel = np.linalg.norm(v, axis=1)
            costas, lado, patina, parada, passo = [], [], [], [], []
            for i in range(n):
                if not AV[i, j]:
                    continue
                f = f0 + i
                acao, vanim = None, 1.0
                for (s, e, nome, k) in faixas:
                    if s <= f < e:
                        acao, vanim = nome, k
                andando = acao is not None and ('walk' in acao or 'run' in acao)
                if vel[i] > V_ANDA:
                    fw = AF[i, j, :2]
                    fw = fw / (np.linalg.norm(fw) + 1e-9)
                    c = float(fw @ (v[i] / vel[i]))
                    if c < -0.5:
                        costas.append(i)
                    elif c < 0.82:
                        lado.append(i)
                    if tipo == 'pessoa':
                        if any(nm == a.name and x <= self.C.t(f0 + i) <= y for nm, x, y in self.no_ar):
                            pass
                        elif not andando:
                            patina.append(i)
                        else:
                            nat = VEL_PASSO['run' if 'run' in acao else 'walk'] * vanim
                            if not 0.55 <= vel[i] / nat <= 1.8:
                                passo.append(i)
                elif tipo == 'pessoa' and andando and vel[i] < 0.05:
                    parada.append(i)
            for lista, tag, msg, erro in (
                    (costas, 'DE COSTAS', 'se move com as costas pra frente do movimento (frente do modelo contra a direção do caminho)', True),
                    (lado, 'DE LADO', 'se move de lado (a frente do modelo está a mais de 35 graus da direção do movimento)', True),
                    (patina, 'DESLIZA', 'se desloca sem animação de caminhada (Idle ou outra deslizando pelo chão)', True),
                    (parada, 'ANDA PARADO', 'está com a animação Walk/Run mas não sai do lugar', True),
                    (passo, 'PASSO', 'a velocidade do passo não bate com o deslocamento (patina ou corre em câmera lenta). Estimativa, confira no olho', False)):
                for ini, fim in self._faixas(lista):
                    t0, t1 = self.C.t(f0 + ini), self.C.t(f0 + fim)
                    if erro and fim - ini < 4 and tag != 'ANDA PARADO':
                        continue
                    if tag == 'ANDA PARADO' and fim - ini < 12:
                        continue
                    (self.erros if erro else self.avisos).append((t0, tag, f'"{a.name}" {msg}, de {t0:.1f} s a {t1:.1f} s.'))

    def nariz(self, VP, VN, VC, VV, f0):
        """veículo declarado (K.veiculo): o nariz em 3D contra a velocidade. Decompõe a velocidade nos eixos do veículo
        (nariz, lado, pra cima): de ré, de lado (mais de `de_lado` graus), subindo de barriga (a trajetória mais de
        `sobe_acima` graus acima do nariz) ou o nariz alto demais (mais de `nariz_acima` graus acima da trajetória).
        A janela da velocidade (2 quadros pra cada lado) não atravessa um corte."""
        fps = self.C.fps
        n = VP.shape[0]
        for j, (nome, _, t0, t1, n_acima, s_acima, lado_max) in enumerate(self.veiculos):
            achados = defaultdict(list)
            for i in range(n):
                f = f0 + i
                t = self.C.t(f)
                if t < t0 - 1e-6 or (t1 is not None and t > t1 + 1e-6) or not VV[i, j]:
                    continue
                lo, hi = max(0, i - 2), min(n - 1, i + 2)
                if any(f0 + lo < c <= f0 + hi for c in self.cortes) or not (VV[lo, j] and VV[hi, j]):
                    continue
                v = (VP[hi, j] - VP[lo, j]) * fps / max(1, hi - lo)
                vel = float(np.linalg.norm(v))
                if vel < 1.0:
                    continue
                fw, up = VN[i, j], VC[i, j]
                sd = np.cross(up, fw)
                vf, vs, vu = float(v @ fw), float(v @ sd), float(v @ up)
                if vf <= 0:
                    achados['DE RÉ'].append((i, 180.0))
                    continue
                beta = math.degrees(math.atan2(abs(vs), vf))
                alfa = math.degrees(math.atan2(-vu, vf))      # + = nariz acima da trajetória
                if beta > lado_max:
                    achados['DE LADO'].append((i, beta))
                if alfa < -s_acima:
                    achados['DE BARRIGA'].append((i, -alfa))
                elif alfa > n_acima:
                    achados['NARIZ ALTO'].append((i, alfa))
            msgs = {'DE RÉ': 'anda de ré (a velocidade aponta pra trás do nariz)',
                    'DE LADO': 'anda de lado: a velocidade fica {g:.0f} graus fora do nariz (limite {lim:.0f})',
                    'DE BARRIGA': 'sobe de barriga: a trajetória fica {g:.0f} graus ACIMA do nariz (limite {lim:.0f}). Integre a subida '
                                  'pelo nariz (a trajetória segue o nariz, um pouco abaixo dele)',
                    'NARIZ ALTO': 'o nariz fica {g:.0f} graus acima da trajetória (limite {lim:.0f})'}
            lims = {'DE RÉ': 0.0, 'DE LADO': lado_max, 'DE BARRIGA': s_acima, 'NARIZ ALTO': n_acima}
            for tag, lst in achados.items():
                idx = [i for i, _ in lst]
                gmax = dict(lst)
                for ini, fim in self._faixas(idx):
                    if fim - ini < 4:
                        continue
                    g = max(gmax[i] for i in idx if ini <= i <= fim)
                    ta, tb = self.C.t(f0 + ini), self.C.t(f0 + fim)
                    self.erros.append((ta, 'NARIZ', f'"{nome}" {msgs[tag].format(g=g, lim=lims[tag])}, de {ta:.2f} s a {tb:.2f} s.'))

    @staticmethod
    def _faixas(lista):
        out = []
        for i in lista:
            if out and i - out[-1][1] <= 2:
                out[-1][1] = i
            else:
                out.append([i, i])
        return out

    # ---- tampa esquecida num corte de maquete
    def tampas_no_corte(self):
        """polígono grande (8+ lados) com parte das arestas soltas: a lateral do cilindro foi cortada (meia casca) e o disco
        da tampa ficou, cortando o interior (o submarino de 2026-10-20: cavernas e casco com o disco inteiro). Um disco
        solto de verdade (todas as arestas soltas) e uma tampa inteira (nenhuma solta) não contam. Modelo pronto não conta."""
        C = self.C
        for o in C.malhas:
            if o in C.pele or C.asset(o) is not None or o.get('sem_corpo'):
                continue
            if o.hide_render and not (o.animation_data and o.animation_data.action):
                continue
            me = o.data
            usos = defaultdict(int)
            for p in me.polygons:
                for ek in p.edge_keys:
                    usos[ek] += 1
            for p in me.polygons:
                if p.loop_total < 8:
                    continue
                soltas = sum(1 for ek in p.edge_keys if usos[ek] == 1)
                if 0 < soltas < p.loop_total:
                    t = self.aparecem.get(o.name, 0.0)
                    self.erros.append((t, 'TAMPA', f'"{o.name}": a tampa ({p.loop_total} lados) ficou num corte de maquete: {soltas} arestas dela estão '
                                       f'soltas (a lateral foi cortada e o disco corta o interior). Use K.sem_tampas no que foi cortado.'))
                    break

    # ---- relatório
    def relatorio(self):
        pasta = self.pasta / 'conferencia'
        pasta.mkdir(parents=True, exist_ok=True)
        linhas = [f'checagem de {self.pasta.name}  ({time.strftime("%Y-%m-%d %H:%M")})',
                  f'{self.sc.frame_end} quadros, {self.C.fps} fps, {len(self.C.malhas)} malhas ({len(self.C.dinamicos)} objetos se movem)', '']
        for lista, rot in ((sorted(self.erros), 'ERRO'), (sorted(self.avisos), 'AVISO')):
            for t, tag, msg in lista:
                linhas.append(f'{rot}  {tag:<11} {t:6.2f} s  {msg}')
        ok = not self.erros
        linhas += ['', f'RESULTADO: {"LIMPA" if ok else "FALHOU"} ({len(self.erros)} erros, {len(self.avisos)} avisos)']
        if self.selo:
            linhas.append(f'SELO: {self.selo}')
        txt = '\n'.join(linhas)
        (pasta / 'checagem.txt').write_text(txt, encoding='utf-8')
        print('\n'.join('CHECAR ' + l for l in linhas))
        return ok


def rodar(pasta, cortes=(), entradas=None, acendes=(), focos=(), aparecem=None, selo='', apoios=(), sumicos=None, suportes=(),
          veiculos=(), no_ar=()):
    """roda a checagem inteira e sai do Blender com código 1 se houver erro."""
    ok = Checagem(pasta, cortes, entradas, acendes, focos, aparecem, selo, apoios, sumicos, suportes, veiculos, no_ar).rodar()
    sys.stdout.flush()
    if not ok:
        sys.exit(1)
