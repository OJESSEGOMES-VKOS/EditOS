# Blender 5.2 | status: fórmula geométrica (câmera pinhole do Blender) conferida por sonda no bpy 5.2.2 com world_to_camera_view | fonte: https://en.wikipedia.org/wiki/Hyperfocal_distance ; manual Blender (Sensor Fit) https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst
"""
Calcula a distância câmera-produto para o produto ocupar uma fração da altura do quadro
e a profundidade de campo (DOF) com círculo de confusão c.

Sensor Fit AUTO (padrão): os 36 mm valem para o MAIOR lado da imagem.
  9:16 (vertical): altura do sensor = 36 mm, largura = 20,25 mm
  16:9 (horizontal): largura = 36 mm, altura = 20,25 mm
Distância: d = h_obj * f / (fração * h_sensor)
DOF no Blender (Cycles): lente fina sobre projeção pinhole. Abertura = f/N em metros
  (intern/cycles/blender/camera.cpp: aperturesize = lens*1e-3 / (2*fstop)), sem "respiração" de foco.
  Borrão no sensor de um ponto à distância b com foco em s: c = f^2 |b - s| / (N b s)
  => H = f^2/(N c) ; perto = s H/(H + s) ; longe = s H/(H - s)
  (Lente real, Wikipedia: H = f^2/(N c) + f e (s - f) no lugar de s. Diferença só aparece em macro.)
Uso: python3 calc_lente_dof.py            (imprime tabelas Markdown)
"""
import sys

LENTES = [24, 35, 50, 85, 100, 135]
PRODUTOS = {"celular 15 cm": 150.0, "frasco 12 cm": 120.0}
FORMATOS = {"9:16": 36.0, "16:9": 36.0 * 9 / 16}   # altura útil do sensor em mm (AUTO, 36 mm)
FSTOPS = [2.8, 5.6, 8.0, 16.0]
C = 0.03  # mm


def distancia_mm(h_obj, f, h_sensor, fracao=0.6):
    return h_obj * f / (fracao * h_sensor)


def dof_mm(f, N, s, c=C):
    """Modelo do Cycles (pinhole + disco de abertura). Tudo em mm."""
    H = f * f / (N * c)
    perto = s * H / (H + s)
    longe = s * H / (H - s) if s < H else float("inf")
    return perto, longe, longe - perto


def dof_lente_real_mm(f, N, s, c=C):
    H = f * f / (N * c) + f
    perto = s * (H - f) / (H + s - 2 * f)
    longe = s * (H - f) / (H - s) if s < H else float("inf")
    return perto, longe, longe - perto


def borrao_fundo_px(f, N, s, b, resolucao=1920, sensor=36.0):
    """Diâmetro (px) do disco de borrão de um ponto do fundo em b (mm) com foco em s (mm)."""
    c = f * f * abs(b - s) / (N * b * s)
    return c / sensor * resolucao


def tabela_distancias():
    print("| Lente | Celular 9:16 | Celular 16:9 | Frasco 9:16 | Frasco 16:9 |")
    print("|---|---|---|---|---|")
    for f in LENTES:
        cel = [distancia_mm(150, f, FORMATOS[k]) for k in ("9:16", "16:9")]
        fr = [distancia_mm(120, f, FORMATOS[k]) for k in ("9:16", "16:9")]
        print(f"| {f} mm | {cel[0]/10:.1f} cm | {cel[1]/10:.1f} cm | {fr[0]/10:.1f} cm | {fr[1]/10:.1f} cm |".replace(".", ","))


def tabela_dof():
    print("| Caso | Lente | Distância | f/2,8 | f/5,6 | f/8 | f/16 |")
    print("|---|---|---|---|---|---|---|")
    for nome, h in PRODUTOS.items():
        for fmt, hs in FORMATOS.items():
            for f in (35, 50, 85, 100):
                s = distancia_mm(h, f, hs)
                cel = []
                for N in FSTOPS:
                    p, l, t = dof_mm(f, N, s)
                    cel.append(f"{t:.0f} mm")
                print(f"| {nome} {fmt} | {f} mm | {s/10:.1f} cm | " + " | ".join(cel).replace(".", ",") + " |")


if __name__ == "__main__":
    tabela_distancias(); print(); tabela_dof()
