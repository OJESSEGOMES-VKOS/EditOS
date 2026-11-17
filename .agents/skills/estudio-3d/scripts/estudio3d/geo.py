"""Geometria base: bloco arredondado com chanfro, cilindro, chanfrar, UV planar.

Regra: nada sai com aresta viva. No mundo real toda aresta tem raio (0,3 a 2 mm num produto).
A aresta chanfrada pega um fio de luz, e é esse fio que faz o olho acreditar.
"""
import math

import bmesh
import bpy

from .nucleo import ligar


def chanfrar(o, largura=0.0012, segmentos=4, angulo=30.0, suavizar=True):
    """chanfro em metros (0,0012 = 1,2 mm). Limite por ângulo: só quebra arestas de verdade."""
    if suavizar and o.type == 'MESH':
        o.data.shade_smooth()
    b = o.modifiers.new('chanfro', 'BEVEL')
    b.width = largura
    b.segments = segmentos
    b.limit_method = 'ANGLE'
    b.angle_limit = math.radians(angulo)
    b.harden_normals = True
    b.miter_outer = 'MITER_ARC'
    wn = o.modifiers.new('normais', 'WEIGHTED_NORMAL')
    wn.keep_sharp = True
    wn.mode = 'FACE_AREA'
    return o


def _contorno(w, h, r, n=12):
    r = max(0.0, min(r, w / 2 - 1e-5, h / 2 - 1e-5))
    w2, h2 = w / 2, h / 2
    pts = []
    for cx, cy, a0 in ((w2 - r, h2 - r, 0), (-w2 + r, h2 - r, 90), (-w2 + r, -h2 + r, 180), (w2 - r, -h2 + r, 270)):
        if r <= 1e-6:
            pts.append((cx, cy))
            continue
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def _uv_planar(me, w, h):
    uv = me.uv_layers.new(name='UVMap')
    for loop in me.loops:
        co = me.vertices[loop.vertex_index].co
        uv.data[loop.index].uv = (co.x / w + 0.5, co.y / h + 0.5)


def bloco(nome, w, h, esp, raio=0.0, chanfro=None, mat=None, segs=12):
    """bloco de cantos arredondados, deitado no plano XY com a face de cima em z=esp/2.
    w,h,esp em metros. chanfro None = 15% da espessura (limitado a 2 mm)."""
    me = bpy.data.meshes.new(nome)
    bm = bmesh.new()
    pts = _contorno(w, h, raio, segs)
    vs = [bm.verts.new((x, y, -esp / 2)) for x, y in pts]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in ext['geom']:
        if isinstance(v, bmesh.types.BMVert):
            v.co.z += esp
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    _uv_planar(me, w, h)
    o = ligar(bpy.data.objects.new(nome, me))
    chanfrar(o, chanfro if chanfro is not None else min(0.002, esp * 0.15))
    if mat:
        me.materials.append(mat)
    return o


def placa_face(nome, w, h, raio=0.0, mat=None, segs=12):
    """só a face (tela, rótulo, decalque), com UV 0-1 cobrindo w x h."""
    me = bpy.data.meshes.new(nome)
    bm = bmesh.new()
    vs = [bm.verts.new((x, y, 0)) for x, y in _contorno(w, h, raio, segs)]
    bm.faces.new(vs)
    bm.to_mesh(me)
    bm.free()
    _uv_planar(me, w, h)
    o = ligar(bpy.data.objects.new(nome, me))
    if mat:
        me.materials.append(mat)
    return o


def cilindro(nome, raio, altura, mat=None, segs=96, chanfro=None, base_em_zero=True):
    me = bpy.data.meshes.new(nome)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs,
                          radius1=raio, radius2=raio, depth=altura)
    if base_em_zero:
        for v in bm.verts:
            v.co.z += altura / 2
    bm.to_mesh(me)
    bm.free()
    o = ligar(bpy.data.objects.new(nome, me))
    chanfrar(o, chanfro if chanfro is not None else min(0.003, raio * 0.04), angulo=40)
    if mat:
        me.materials.append(mat)
    return o


def torno(nome, perfil, mat=None, segs=128, chanfro=0.0):
    """sólido de revolução (frasco, garrafa, copo, tampa). perfil = [(raio, z), ...] de baixo pra
    cima, começando e terminando no eixo (raio 0) pra fechar. Desenhe o perfil real do produto."""
    me = bpy.data.meshes.new(nome)
    bm = bmesh.new()
    anel_ant = None
    aneis = []
    for r, z in perfil:
        anel = []
        for i in range(segs):
            a = 2 * math.pi * i / segs
            anel.append(bm.verts.new((r * math.cos(a), r * math.sin(a), z)))
        aneis.append(anel)
    for a, b in zip(aneis, aneis[1:]):
        for i in range(segs):
            j = (i + 1) % segs
            q = [a[i], a[j], b[j], b[i]]
            try:
                bm.faces.new(q)
            except ValueError:
                pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = ligar(bpy.data.objects.new(nome, me))
    me.shade_smooth()
    if chanfro:
        chanfrar(o, chanfro, angulo=35)
    if mat:
        me.materials.append(mat)
    return o


def ciclorama(nome='ciclorama', largura=8.0, profundidade=6.0, altura=4.0, raio=1.2, mat=None):
    """fundo infinito de estúdio: piso que vira parede numa curva (sem linha do horizonte).
    O produto fica no piso, ~1 m à frente do começo da curva."""
    me = bpy.data.meshes.new(nome)
    bm = bmesh.new()
    perfil = [(-profundidade, 0.0)]
    for i in range(25):
        a = -math.pi / 2 + (math.pi / 2) * i / 24
        perfil.append((raio * math.cos(a), raio + raio * math.sin(a)))
    perfil.append((raio, altura))
    # perfil em (y, z); a parede fica em y = +raio (atrás do produto)
    linhas = []
    for x in (-largura / 2, largura / 2):
        linhas.append([bm.verts.new((x, y, z)) for (y, z) in perfil])
    for i in range(len(perfil) - 1):
        bm.faces.new([linhas[0][i], linhas[1][i], linhas[1][i + 1], linhas[0][i + 1]])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    o = ligar(bpy.data.objects.new(nome, me))
    if mat:
        me.materials.append(mat)
    return o


def gelo_cubo(nome, lado=0.026, lascas=0.25, fraturas=1, bolhas=40, mat_gelo=None, mat_bolha=None, mat_fratura=None, semente=None):
    """cubo de gelo de verdade (receita v2, 2026-10-03): cubo com cantos LASCADOS (cada canto cortado
    por uma faceta de tamanho diferente), facetas planas e vivas (sombreamento flat + chanfro de 0,3 mm),
    1-2 planos de fratura dentro (pegam reflexo e quebram a transparência) e uma trilha de bolhas
    finas no miolo (o 'véu' de gelo de freezer, feito de bolhas, nunca de volume leitoso).
    O gelo só se lê se tiver o que REFRATAR atrás: use fundo com faixas de luz desfocadas, nunca preto liso."""
    import random as _r
    rnd = _r.Random(semente)
    me = bpy.data.meshes.new(nome)
    bm = bmesh.new()
    h = lado / 2
    for sx in (-1, 1):
        for sy in (-1, 1):
            for sz in (-1, 1):
                c = (sx * h * rnd.uniform(0.94, 1.0), sy * h * rnd.uniform(0.94, 1.0), sz * h * rnd.uniform(0.9, 1.0))
                k = rnd.uniform(0.08, lascas)   # quanto o canto foi lascado
                for eixo in range(3):
                    p = list(c)
                    p[eixo] -= (sx, sy, sz)[eixo] * lado * k
                    bm.verts.new(p)
    bmesh.ops.convex_hull(bm, input=bm.verts)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = False
    o = ligar(bpy.data.objects.new(nome, me))
    bv = o.modifiers.new('aresta', 'BEVEL'); bv.width = 0.0003; bv.segments = 2
    bv.limit_method = 'ANGLE'; bv.harden_normals = True
    if mat_gelo:
        me.materials.append(mat_gelo)
    for i in range(fraturas):
        fm = bpy.data.meshes.new(f'{nome}_fratura{i}')
        w = lado * rnd.uniform(0.18, 0.3)   # rachadura pequena e irregular (grande vira teia)
        n = 9
        pts = [(w * math.cos(a) * rnd.uniform(0.4, 1.0), w * math.sin(a) * rnd.uniform(0.4, 1.0), rnd.uniform(-1, 1) * w * 0.08) for a in [k * 2 * math.pi / n for k in range(n)]]
        fm.from_pydata(pts, [], [list(range(n))])
        fo = ligar(bpy.data.objects.new(f'{nome}_fratura{i}', fm), pai=o)
        fo.location = (rnd.uniform(-h, h) * 0.3, rnd.uniform(-h, h) * 0.3, rnd.uniform(-h, h) * 0.3)
        fo.rotation_euler = (rnd.uniform(0, math.pi), rnd.uniform(0, math.pi), rnd.uniform(0, math.pi))
        if mat_fratura:
            fm.materials.append(mat_fratura)
    for i in range(bolhas):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=rnd.uniform(0.00012, 0.0004), segments=8, ring_count=6,
                                             location=(rnd.gauss(0, lado * 0.06), rnd.gauss(0, lado * 0.06), rnd.uniform(-h * 0.7, h * 0.7)))
        b = bpy.context.object; b.name = f'{nome}_b{i}'; b.parent = o
        if mat_bolha:
            b.data.materials.append(mat_bolha)
    return o
