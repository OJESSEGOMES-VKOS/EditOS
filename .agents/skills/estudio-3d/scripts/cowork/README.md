# Código · Estúdio Claude + Blender 3D

Todo o Python `bpy` (e shell) escrito ou testado pelo Cowork em 02/10/2026. Alvo: Blender 5.2. Cada arquivo começa com um cabeçalho `# Blender 5.2 | status: ... | fonte: ...`.

**Atenção aos caminhos:** os scripts foram rodados na nuvem do Cowork com o bpy 5.2.2 como módulo Python (`/home/claude/bvenv/bin/python script.py`). Na máquina de referência, rode com `blender -b -P script.py` e troque os caminhos `/home/claude/...` pela pasta do projeto. A nuvem não tem GPU: tempos e enums de dispositivo valem só para CPU.

| Pasta | Arquivo | Status (cabeçalho) |
|---|---|---|
| camera | `calc_lente_dof.py` | fórmula geométrica (câmera pinhole do Blender) conferida por sonda no bpy 5.2.2 com world_to_camera_view |
| camera | `folha.py` | testado na nuvem |
| camera | `prova_pushin_orbita.py` | executado no bpy 5.2.2 EEVEE (nuvem, GL por software) |
| camera | `rigs_camera.py` | confirmado por sonda no bpy 5.2.2 (teste_rigs.py mede cada rig) |
| camera/sondas | `sonda_2.py` | sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 |
| camera/sondas | `sonda_3.py` | sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 |
| camera/sondas | `sonda_cam.py` | sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 |
| camera | `teste_rigs.py` | executado no bpy 5.2.2 (nuvem) |
| direcao | `animatic_blocking.py` | confirmado por sonda no bpy 5.2.2 (EEVEE, 30 fps, marcadores de camera, folha de contato) |
| luz | `rigs_luz.py` | nomes de propriedade confirmados por sonda no bpy 5.2.2; os 9 rigs, cartoes, bandeiras, transluz, light linking, nevoa e animacao testados no bpy 5.2.2 Cycles CPU (nuvem); mundo_hdri_reflexo a testar |
| luz | `teste_antes_depois.py` | testado no bpy 5.2.2 Cycles CPU, nuvem |
| luz | `teste_cor_marca.py` | testado no bpy 5.2.2 Cycles CPU, nuvem |
| luz | `teste_rigs.py` | testado no bpy 5.2.2 Cycles CPU, nuvem (exposicao de cada rig) |
| luz | `teste_volume.py` | testado no bpy 5.2.2 Cycles CPU e EEVEE, nuvem |
| materiais | `compensar_agx.py` | testado no bpy 5.2.2 Cycles CPU, nuvem |
| materiais | `materiais.py` | confirmado por sonda (nomes de entradas e nós no bpy 5.2.2) e testado em render Cycles CPU na nuvem |
| materiais | `medir.py` | testado na nuvem (Python puro, numpy/PIL) |
| materiais | `teste_cor_marca.py` | testado no bpy 5.2.2 Cycles CPU, nuvem |
| materiais | `teste_estilizados.py` | testado no bpy 5.2.2 (EEVEE e Cycles CPU), nuvem |
| materiais | `teste_grade.py` | testado no bpy 5.2.2 Cycles CPU, nuvem |
| materiais | `teste_imperfeicao.py` | testado no bpy 5.2.2 Cycles CPU, nuvem |
| movimento | `curvas.py` | confirmado por sonda no bpy 5.2.2 (channelbag, interpolation, easing, back, handles FREE, NOISE) |
| movimento | `grafico_velocidade.py` | testado na nuvem |
| movimento | `teste_motion_blur.py` | executado no bpy 5.2.2 (EEVEE e Cycles CPU, nuvem) |
| movimento | `transicoes.py` | confirmado por sonda no bpy 5.2.2 (marcador com câmera troca scene.camera no frame_set; distâncias por projeção) |
| movimento | `velocidade_curvas.py` | confirmado por sonda no bpy 5.2.2 |
| mundos | `gerar_capitulo.py` | confirmado por execucao (Python puro) |
| mundos | `mundos_dados.py` | dados de direcao de arte (valores de luz/material: 7 mundos calibrados pelo Claude Code na RTX 3050; 3 testados no bpy 5.2.2 Cycles CPU na nuvem; demais a testar) |
| mundos | `prova_mundos_novos.py` | confirmado por sonda (bpy 5.2.2 LTS, Cycles CPU, nuvem) |
| mundos | `rotacao_mundos.py` | confirmado por execucao (Python puro, sem bpy) |
| pipeline | `assets_polyhaven.py` | importacao confirmada por sonda no bpy 5.2.2 com arquivo local; download a testar (rede da nuvem bloqueia api.polyhaven.com) |
| pipeline | `base.py` | confirmado por sonda no bpy 5.2.2 (cena_exemplo.py roda este modulo inteiro) |
| pipeline | `cena_exemplo.py` | confirmado por sonda no bpy 5.2.2 (rodado na nuvem, EEVEE 270x480) |
| pipeline | `gerar_referencias.py` | script de dados (sem bpy) |
| pipeline/sondas | `sonda_p1.py` | confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) |
| pipeline/sondas | `sonda_p2.py` | confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) |
| pipeline/sondas | `sonda_p2b.py` | confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) |
| pipeline/sondas | `sonda_p3.py` | confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) |
| pipeline/sondas | `sonda_p4.py` | confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) |
| pipeline/sondas | `sonda_p5.py` | confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) |
| pipeline/sondas | `sonda_p6.py` | confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) |
| pipeline | `tempos_exemplo.json` | dados |
| playbooks | `_util.py` | confirmado por sonda no bpy 5.2.2 |
| playbooks | `condensacao_gn.py` | confirmado por sonda no bpy 5.2.2 |
| playbooks | `giro_plataforma.py` | confirmado por sonda no bpy 5.2.2 |
| playbooks | `logo_svg.py` | confirmado por sonda no bpy 5.2.2 (import, extrusão e chanfro rodaram) |
| playbooks | `rolagem_tela.py` | confirmado por sonda no bpy 5.2.2 |
| playbooks | `splash_mantaflow.py` | nomes confirmados por sonda no bpy 5.2.2; BAKE FALHOU no bpy-módulo da nuvem (erro interno Manta 'LevelsetGrid has no setConst'), a testar no Blender 5.2 completo |
| playbooks | `splash_sdf_gn.py` | confirmado por sonda no bpy 5.2.2 (nós existem e a malha é gerada) |
| playbooks | `tecido_cloth.py` | confirmado por sonda no bpy 5.2.2 (simulação avança quadro a quadro no bpy-módulo) |
| playbooks | `tela_camadas_explodidas.py` | confirmado por sonda no bpy 5.2.2 (roda e renderiza em Cycles CPU) |
| playbooks | `vapor_volume.py` | confirmado por sonda no bpy 5.2.2 |
| playbooks | `vista_explodida.py` | confirmado por sonda no bpy 5.2.2 |
| pos | `compositor_acabamento.py` | confirmado por sonda no bpy 5.2.2 (nós, menus e render na nuvem) |
| pos | `compositor_assets.py` | confirmado por sonda no bpy 5.2.2 (assets do compositing_nodes_essentials.blend; render na nuvem) |
| pos | `eventos_de_som.py` | confirmado por sonda no bpy 5.2.2 (channelbag + avaliação por quadro) |
| pos | `grade_de_batidas.py` | testado (aritmética) |
| pos | `mix_e_loudness.sh` | testado na nuvem (ffmpeg do sistema) com sinais sintéticos |
| pos | `sonda_lens_distortion.py` | confirmado por sonda no bpy 5.2.2 |
| qc | `movimento_qa.py` | confirmado por sonda no bpy 5.2.2 (cena de teste na nuvem) |
| qc | `qa_extra.py` | testado na nuvem em PNGs do bpy 5.2.2 |
| render | `entrega_ffmpeg.sh` | comandos executados e conferidos com ffprobe |
| render | `folha_amostras.py` | testado na nuvem |
| render | `presets.py` | validado no bpy 5.2.2 da nuvem (sem GPU: enums de dispositivo/denoiser vêm só com CPU/OIDN; OptiX a testar na RTX 3050) |
| render | `sonda_passes.py` | sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 |
| render | `teste_amostras.py` | executado no bpy 5.2.2 Cycles CPU (nuvem, 2 núcleos Xeon 2,1 GHz) |
