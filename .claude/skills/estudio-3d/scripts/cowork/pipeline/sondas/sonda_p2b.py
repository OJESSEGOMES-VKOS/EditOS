# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) | fonte: sonda propria
import bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
ng=bpy.data.node_groups.new("G",'GeometryNodeTree')
ng.interface.new_socket("Geometry",in_out='INPUT',socket_type='NodeSocketGeometry')
s=ng.interface.new_socket("Contagem",in_out='INPUT',socket_type='NodeSocketInt')
bpy.ops.mesh.primitive_plane_add(); o=bpy.context.active_object
m=o.modifiers.new("GN",'NODES'); m.node_group=ng
print([a for a in dir(m) if not a.startswith('__')])
p=m.properties
print(type(p), [a for a in dir(p) if not a.startswith('__')])
try: print(p.keys())
except Exception as e: print("keys err",e)
for k in ('Socket_1',):
    try: p[k]=4; print("set via properties[]", p[k])
    except Exception as e: print("err",e)
    try: print(getattr(p,k))
    except Exception as e: print("getattr err",e)
ins=p.inputs
print(type(ins), [a for a in dir(ins) if not a.startswith('__')])
try:
    print(len(ins))
    for i in ins: print("IN", i, [a for a in dir(i) if not a.startswith('__')])
except Exception as e: print("iter err",e)
try:
    x=ins['Contagem']; print("by name", x)
except Exception as e: print("name err",e)
try: print(ins.Socket_1)
except Exception as e: print("attr err",e)
s1=ins.Socket_1
print([a for a in dir(s1) if not a.startswith('__')])
for a in ('value','default_value'):
    if hasattr(s1,a): print(a, getattr(s1,a))
try:
    s1.value=4; print("set value", s1.value)
except Exception as e: print("e",e)
try: setattr(ins,'Socket_1',4); print('setattr ok', ins.Socket_1)
except Exception as e: print('setattr err', e)
