# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | sonda: sinal da distorção (+ = barril) e efeito do Fit
import bpy
s=bpy.context.scene
s.render.engine='BLENDER_WORKBENCH'; s.render.resolution_x=200; s.render.resolution_y=200
img=bpy.data.images.new("g",200,200); img.generated_type='COLOR_GRID'
for d,fit in [(0.1,False),(-0.1,False),(0.1,True),(-0.1,True)]:
    ng=bpy.data.node_groups.new("L","CompositorNodeTree"); ng.interface.new_socket("Image",in_out="OUTPUT",socket_type="NodeSocketColor")
    im=ng.nodes.new("CompositorNodeImage"); im.image=img
    ld=ng.nodes.new("CompositorNodeLensdist"); ld.inputs["Distortion"].default_value=d; ld.inputs["Fit"].default_value=fit
    o=ng.nodes.new("NodeGroupOutput")
    ng.links.new(im.outputs["Image"],ld.inputs["Image"]); ng.links.new(ld.outputs["Image"],o.inputs[0])
    s.compositing_node_group=ng; s.render.use_compositing=True
    s.render.filepath=f"/home/claude/provas/pos/ld_{d}_{fit}.png"; bpy.ops.render.render(write_still=True)
