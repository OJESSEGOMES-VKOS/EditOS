# CONTEXTO COMPARTILHADO DOS PESQUISADORES (leia inteiro antes de começar)

## A missão
Construir o manual operacional de um **estúdio de produção de motion 3D comercial** operado por IA (Claude) no **Blender 5.2**. Esta base é o coração do estúdio 3D do EditOS: a ferramenta de produção 3D de quem usa o sistema.

Quando terminar, uma IA lendo essas páginas precisa conseguir pegar um briefing ("vídeo de 20 s do meu app de delivery pro Reels") e entregar um filme que pareça de produtora, e não um teste de 3D genérico.

**Foco comercial:** serviços (clínica, advocacia, agência, consultoria, serviço local, B2B); apps mobile; sites, SaaS, dashboards; produtos físicos (eletrônicos, cosméticos, perfume, bebida, comida, moda, calçado, embalagem, industriais); marcas (vinheta, revelação de logo, assinatura). Formatos 9:16, 1:1, 4:5, 16:9. Durações 6, 15, 20, 30, 60 s.

**Como a IA opera o Blender:** Claude Code escreve scripts Python (`bpy`) e roda Blender 5.2 sem interface (`blender -b -P cena.py`), renderiza quadros de teste, olha as imagens e corrige. Máquina de referência: RTX 3050 Laptop (Cycles com OptiX, ou EEVEE). Também existe o caminho interativo pelo Blender MCP. Prioridade pro script (reprodutível).

## O problema a resolver (todas as páginas atacam isto com regra concreta)
1. Cor lavada: modo de cor em Standard em vez de AgX.
2. Luz chapada: sem direção, sem contorno, sem contraste.
3. Enfeite sem motivo: cubos/cápsulas/esferas flutuando (clichê nº 1 do 3D de IA).
4. Fundo padrão: estúdio branco/cinza infinito, sempre igual.
5. Interface de app como placa plana: sem vidro, reflexo, profundidade de camadas.
6. Material "plástico de CG": aspereza uniforme, sem imperfeição, arestas vivas sem chanfro.
7. Movimento de software: curvas padrão, sem antecipação nem respiro, câmera girando à toa ou parada.
8. Escuro sem intenção: subexposto, sem contraste no herói.
9. Mesma linguagem em tudo: mesma lente, composição central, paleta, transição.

## A régua de qualidade (obrigatória)
- **Concreto e numérico, nunca genérico.** Ex.: "luz principal de área de 1 m a 45° e 30° acima, 3 a 4× mais forte que o preenchimento; contorno por trás a 135°, 1000 K mais fria que a principal". Lente em mm, tempo em quadros a 30 fps, aspereza, chanfro em mm na escala real, IOR, potência em W, f-stop.
- **Todo "faça" vem com o "por quê" e com o "sinal de que deu errado".**
- **Versão do Blender em tudo que é técnico.** Alvo: Blender 5.x (5.2). Marque **[não verificado]** o que não conseguiu confirmar. Proibido ensinar API ou nome de parâmetro de memória sem marcar.
- **Fonte em tudo.** Cada afirmação técnica relevante cita o link. Conteúdo pago nunca é copiado: destile com suas palavras e dê crédito.
- **Licença de asset sempre explícita** (CC0, CC-BY, uso comercial sim/não).
- **Português do Brasil, simples e profissional.** Termo técnico em inglês entre parênteses na primeira vez: "chanfro (bevel)".
- **Nada de página rasa.** Cada página é capítulo de manual que um diretor de arte júnior conseguiria seguir.
- Marque **[testar no Blender]** onde só um teste confirma (o Claude Code testa depois).
- Onde depender de vídeo do YouTube que você não conseguiu abrir, liste-o em uma seção final "PENDÊNCIAS YOUTUBE" (título, canal, link, o que esperava aprender).

## Regras de estilo de escrita (do dono, inegociáveis)
- **PROIBIDO travessão (:, a) e hífen usado como aparte.** Use ponto, vírgula, dois-pontos ou parênteses. (Hífen dentro de palavra composta ou intervalo numérico tipo "0,3-0,5" é ok, mas prefira "0,3 a 0,5".)
- Sem jargão ("alavancar", "sinergia", "tracionar"), sem promessa tipo "viralizar", sem firula, sem prolixidade, sem bordão.
- Frases claras e diretas. Tabelas quando houver valores comparáveis.

## A verdade do Blender 5.2 já CONFIRMADA (Laboratório do Claude Code, Blender 5.2.2 na RTX 3050): não contradiga sem fonte
- `action.fcurves` não existe mais. F-curves ficam no channelbag: `anim_utils.action_get_channelbag_for_slot(action, slot).fcurves` (módulo `bpy_extras.anim_utils`).
- A cena nasce em AgX. Looks com nome exato: `AgX - Medium High Contrast`, `AgX - Punchy`, `AgX - High Contrast` etc. Standard foi o que lavou os filmes.
- Motor `BLENDER_EEVEE` (o nome `BLENDER_EEVEE_NEXT` não existe). Compositor em `scene.compositing_node_group`.
- Principled BSDF v2: `Specular IOR Level`, `Transmission Weight`, `Coat Weight`, `Sheen Weight`, `Emission Color`, `Thin Film Thickness`.
- Luz com temperatura nativa (`use_temperature`, `temperature`); light linking por coleção.
- RTX 3050 Laptop com OptiX. Cycles com vidro: ~7 s/quadro a 540x960. EEVEE 540x960: 0,37 s/quadro. EEVEE 1080x1920 16 amostras ~3 s/quadro.
- `shape_key_add` cria a chave com valor 1. Emissão acima de ~1,5 estoura no Standard; no AgX a tela desbota acima de ~1,3 de brilho (use 1,0).
- Calibração: o primeiro chute de energia dos rigs estourou (28% branco puro). Correção: energia × 0,15 (~3 stops abaixo). Fundo afastado 1,2 a 1,4× a escala e mais escuro; grade (spread) de 60 a 75° na luz principal. Bandeiras pretas laterais pra contorno em vidro. `view_layer.update()` antes de ler direção do sol.
- Os 7 mundos já testados: estúdio premium, luxo escuro, pop candy, vidro e cromo, neon noturno, luz natural (persiana), argila.
- Medidor `qa.py` acusa ESTOURADO, AFUNDADO, LAVADO, ESCURO, SEM COR, CHAPADO. Faixas boas: contraste 0,20 a 0,38, estourado < 1,5%.
- Celular em escala real 71,5 x 147 x 7,8 mm.

## Sonda confirmada pelo Cowork (bpy 5.2.2 instalado na nuvem, `/home/claude/bvenv/bin/python`)
- `bpy.app.version_string` = "5.2.2 LTS". Cena padrão: motor BLENDER_EEVEE, view_transform AgX.
- Entradas do Principled BSDF no 5.2.2: Base Color, Metallic, Roughness, IOR, Alpha, Thin Wall, Normal, Weight, Diffuse Roughness, Subsurface Weight, Subsurface Radius, Subsurface Scale, Subsurface IOR, Subsurface Anisotropy, Specular IOR Level, Specular Tint, Anisotropic, Anisotropic Rotation, Tangent, Transmission Weight, Coat Weight, Coat Roughness, Coat IOR, Coat Tint, Coat Normal, Sheen Weight, Sheen Roughness, Sheen Tint, Emission Color, Emission Strength, Thin Film Thickness, Thin Film IOR.
- `Material.use_nodes` gera DeprecationWarning ("expected to be removed in Blender 6.0").
- Propriedades de luz: type, use_temperature, color, temperature, specular_factor, diffuse_factor, transmission_factor, volume_factor, exposure, normalize, energy, shadow_soft_size, shape, size, size_y, spread, use_shadow, etc.
- `scene.compositing_node_group` existe; `scene.node_tree` não existe.
- Renderização funciona na nuvem: Cycles (CPU) e EEVEE. Você PODE rodar scripts com `/home/claude/bvenv/bin/python seu_script.py` (o bpy roda como módulo; não precisa de `blender -b`). Use resoluções pequenas (ex. 320x320, 16 a 64 amostras) pra testar. Filtre a saída com `grep -v EGL`. Se confirmar algo por sonda, marque **[confirmado por sonda no bpy 5.2.2]**.

## Formato de saída
- Escreva o capítulo em Markdown no arquivo indicado, em `/home/claude/base/`.
- Use `##` e `###` para seções. Tabelas Markdown padrão. Blocos de código com ```python.
- Cite fontes inline como links Markdown `[nome](url)` e feche com uma seção `## Fontes` (lista com link e, quando for asset, a licença).
- Feche com `## Pendências para o Claude Code` (vídeos do YouTube não acessados e receitas [testar no Blender]).
- Todo código Python `bpy` que escrever também vai salvo em `/home/claude/codigo/<tema>/<nome>.py` com cabeçalho: `# Blender 5.2 | status: confirmado na doc / confirmado por sonda / não verificado / a testar | fonte: ...`.
