# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: _CONTEXTO.md (channelbag), API bpy 5.2.2
# Utilidades comuns dos playbooks. Copie junto com os outros scripts.
import bpy
from bpy_extras import anim_utils

def fcurves(ob):
    """F-curves do objeto no 5.x (action.fcurves não existe mais)."""
    ad = ob.animation_data
    if not ad or not ad.action:
        return []
    return anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot).fcurves

def interpolar(ob, modo='BEZIER', alca='AUTO_CLAMPED', easing=None):
    for fc in fcurves(ob):
        for k in fc.keyframe_points:
            k.interpolation = modo
            if modo == 'BEZIER':
                k.handle_left_type = k.handle_right_type = alca
            if easing:
                k.easing = easing

def gn_grupo(nome):
    ng = bpy.data.node_groups.new(nome, 'GeometryNodeTree')
    ng.interface.new_socket("Geometry", in_out='INPUT', socket_type='NodeSocketGeometry')
    ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')
    gi = ng.nodes.new('NodeGroupInput'); go = ng.nodes.new('NodeGroupOutput')
    return ng, gi, go
