# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | fonte: 05-luz.md
# Mede quanto cada transformacao de visualizacao desvia uma cor de marca (hex) em emissao 1,0.
import bpy, numpy as np
s = bpy.context.scene
try: s.view_settings.view_transform = 'xx'
except Exception as e: print('VIEW_TRANSFORMS', str(e)[str(e).find('('):])
bpy.ops.wm.read_factory_settings(use_empty=True)
s = bpy.context.scene
s.render.engine = 'CYCLES'; s.cycles.device = 'CPU'; s.cycles.samples = 1; s.cycles.use_denoising = False
s.render.resolution_x = s.render.resolution_y = 16
def hex2lin(h):
    c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
bpy.ops.mesh.primitive_plane_add(size=2); pl = bpy.context.active_object
m = bpy.data.materials.new('E')
if m.node_tree is None: m.use_nodes = True
nt = m.node_tree; nt.nodes.clear()
em = nt.nodes.new('ShaderNodeEmission'); out = nt.nodes.new('ShaderNodeOutputMaterial')
nt.links.new(em.outputs[0], out.inputs[0]); pl.data.materials.append(m)
cd = bpy.data.cameras.new('C'); cd.type = 'ORTHO'; cd.ortho_scale = 1
cam = bpy.data.objects.new('C', cd); s.collection.objects.link(cam); cam.location = (0, 0, 1); s.camera = cam
s.world = bpy.data.worlds.new('W')
for hx in ('E63946', '1D3557', 'FFB703', '2A9D8F', 'FFFFFF'):
    em.inputs['Color'].default_value = (*hex2lin(hx), 1)
    linha = []
    for vt, lk in (('Standard', 'None'), ('Khronos PBR Neutral', 'None'), ('AgX', 'None'), ('AgX', 'AgX - Punchy'), ('Filmic', 'None')):
        s.view_settings.view_transform = vt; s.view_settings.look = lk
        s.render.filepath = '/tmp/claude-0/cor.png'
        bpy.ops.render.render(write_still=True)
        px = np.array(bpy.data.images.load(s.render.filepath, check_existing=False).pixels[:]).reshape(-1, 4)[0, :3]
        linha.append('%s%s=#%02X%02X%02X' % (vt, '' if lk == 'None' else '+Punchy', *[round(v * 255) for v in px]))
    print('COR', hx, ' | '.join(linha))
