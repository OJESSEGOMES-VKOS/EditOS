# 09. Pipeline Claude + Blender: script, loop visual, MCP e assets

> Alvo: Blender 5.2 LTS (sondado no bpy 5.2.2 LTS). Tudo que tem a marca **[confirmado por sonda no bpy 5.2.2]** foi escrito, executado e conferido nesta pesquisa. O que não deu pra rodar está marcado **[testar no Blender]** ou **[não verificado]**.

Este capítulo é o chão de fábrica do estúdio. Os outros capítulos dizem *o que* um filme bom tem (luz, material, movimento, composição). Este diz *como* a IA monta esse filme sem abrir a interface, como ela se corrige olhando os próprios quadros e onde ela precisa de um humano.

A regra-mãe: **o filme é um programa.** Se o arquivo `.blend` sumir, rodar os scripts de novo tem que reconstruir o mesmo filme, quadro por quadro. Isso é o que separa um estúdio de um teste.

## 1. Resumo em uma tela

| Decisão | Regra | Por quê | Sinal de que deu errado |
|---|---|---|---|
| Caminho principal | Script Python (`bpy`) rodando com `blender -b` | Reprodutível, versionável, a IA consegue ler o próprio código | "Ajustei na mão e não lembro o que mudei" |
| Fonte do tempo | Um único `tempos.json` com planos, quadros e eventos de som | Edição, som e animação batem sem conversa | Um corte cai 3 quadros antes do whoosh |
| Unidade | 1 unidade = 1 m, interface em mm (`scale_length = 1.0`) | Luz em W, DOF e física só ficam certos em metro | Celular de 147 m, luz que precisa de 50.000 W |
| Cor | AgX + look nomeado, nunca Standard | Standard lava e estoura (ver cap. de cor) | Branco chapado, céu ciano sem gradação |
| Animação | Chaves via channelbag com easing explícito | `action.fcurves` não existe mais no 5.x | `AttributeError: 'Action' object has no attribute 'fcurves'` |
| Qualidade | Loop: render de quadros-chave, olhar, medir, corrigir, máximo 4 a 5 voltas | Corrige o que o código não vê | Entregar sem nunca ter olhado um quadro |
| MCP | Só para explorar e ajustar ao vivo; o resultado volta pro script | MCP não deixa rastro reprodutível | Cena boa que ninguém consegue refazer |
| Assets | Só CC0 ou licença registrada em `licencas.csv` | Filme comercial sem risco jurídico | Modelo CC-BY sem crédito no post do cliente |

## 2. Estrutura de projeto recomendada

Cada filme vira uma pasta. O nome da pasta segue `AAAA-MM-DD_cliente_peca` (ex.: `2026-10-02_vkdelivery_reels20s`). Dentro dela:

```text
2026-10-02_vkdelivery_reels20s/
├── briefing.md          # o que o cliente pediu, em palavras dele + perguntas respondidas
├── tratamento.md        # a ideia do filme: mundo, paleta, lente, ritmo, referências
├── tempos.json          # FONTE ÚNICA de tempo: planos, quadros, eventos de som
├── licencas.csv         # todo asset de terceiros: nome, url, licença, crédito exigido
├── base.py              # utilitários do estúdio (cópia versionada do módulo padrão)
├── cena.py              # monta a cena inteira a partir de tempos.json (+ --plano N)
├── render.py            # chama render por plano, com preset (rascunho/prova/final)
├── assets/              # HDRI, texturas, fontes, SVG do logo, glTF do produto
├── qa/
│   ├── medir.py         # brilho, estourado, afundado, contraste (PIL, Python do sistema)
│   ├── folha.py         # folha de contato e lado a lado
│   └── rubrica.md       # a lista que a IA usa pra criticar cada passagem
├── provas/              # quadros-chave de cada iteração: v01_p3_q0105.png
├── render/              # sequências PNG/EXR por plano: p3/p3_0001.png
└── entrega/             # MP4 final por formato: vkdelivery_reels20s_9x16_v03.mp4
```

### 2.1 O papel de cada arquivo

- **`briefing.md`**: o pedido cru e as respostas do cliente. Se faltou dado (cor da marca em HEX, duração, CTA), a IA pergunta antes de abrir o Blender. O que a IA assumiu fica escrito numa seção "Suposições" pra ser confirmado.
- **`tratamento.md`**: decide o mundo (um dos 19 do cap 02; os 7 calibrados na RTX têm prioridade em prazo curto: estúdio premium, luxo escuro, pop candy, vidro e cromo, neon noturno, natureza e luz do sol (luz natural), argila), lente por plano, paleta e o "verbo" de cada plano (sobe, gira, revela, assina). Escreve também o que o filme **não** vai ter (sem cubos flutuando, sem órbita gratuita).
- **`tempos.json`**: veja 2.2. Nenhum número de quadro mora dentro de `cena.py`; ele lê daqui.
- **`base.py`**: o módulo de utilitários desta página (seção 5). Copiar pra dentro do projeto congela a versão que gerou aquele filme.
- **`cena.py`**: só montagem. Cria objetos, materiais, luz, câmera e chaves. Aceita `--plano N` pra montar só o que importa naquele plano e `--so-salvar` pra gravar o `.blend` sem renderizar.
- **`render.py`**: só render. Recebe preset, plano, faixa de quadros e formato. Separar montagem de render permite rodar o mesmo `.blend` em 9:16 e 16:9.
- **`qa/`**: tudo que mede e compara. Roda no Python do sistema porque o Python do Blender não traz Pillow (ver pegadinha 17).

### 2.2 `tempos.json`: a fonte única de tempo

Formato usado pelo estúdio (o arquivo de exemplo completo está em `/home/claude/codigo/pipeline/tempos_exemplo.json`):

```json
{
  "projeto": "exemplo_app_6s",
  "fps": 30,
  "duracao_s": 6.0,
  "formato": "9:16",
  "planos": [
    {"id": 1, "nome": "entrada",   "inicio_s": 0.0, "fim_s": 1.5, "lente_mm": 85, "acao": "celular sobe com BACK"},
    {"id": 2, "nome": "revelacao", "inicio_s": 1.5, "fim_s": 3.5, "lente_mm": 85, "acao": "gira 35 graus"},
    {"id": 3, "nome": "mensagem",  "inicio_s": 3.5, "fim_s": 5.0, "lente_mm": 85, "acao": "3 palavras em cascata"},
    {"id": 4, "nome": "assinatura","inicio_s": 5.0, "fim_s": 6.0, "lente_mm": 85, "acao": "respiro"}
  ],
  "eventos": [
    {"nome": "whoosh_entrada", "t_s": 0.20, "som": "whoosh curto"},
    {"nome": "impacto_pouso",  "t_s": 1.00, "som": "thump grave"},
    {"nome": "click_palavra_1","t_s": 3.60, "som": "click"}
  ],
  "quadros_chave": [16, 40, 105, 165]
}
```

Regras:

1. **Tempo em segundos no arquivo, quadros calculados no código.** `quadro = round(segundos × fps) + 1` (o Blender começa no quadro 1). Assim, mudar de 30 para 25 fps não exige reescrever nada. Por quê: o editor de som pensa em segundos; o Blender pensa em quadros. Sinal de erro: evento de som que "escorrega" quando alguém muda o fps.
2. **Eventos de som são âncoras de animação.** O pouso do celular acontece no quadro do `impacto_pouso`, não perto dele. Um corte ou impacto fora do som por 2 quadros (66 ms a 30 fps) já é perceptível.
3. **`quadros_chave` são os quadros que o loop visual renderiza.** Escolha o pico de cada movimento (ultrapassagem do BACK, meio do giro, última palavra assentada, quadro final), e não o meio do plano. Na seção 6 mostramos que escolher mal esconde defeito.
4. **Durações padrão do estúdio** (a 30 fps): 6 s = 180 quadros, 15 s = 450, 20 s = 600, 30 s = 900, 60 s = 1800.

### 2.3 Convenções de nomes

| Coisa | Padrão | Exemplo |
|---|---|---|
| Objeto herói | `PascalCase` em português | `Celular`, `Tela`, `Logo` |
| Material | `M_` + nome | `M_Corpo`, `M_Tela`, `M_Fundo` |
| Luz | papel da luz | `Principal`, `Preench`, `Contorno`, `Fundo` |
| Câmera | `Cam` ou `Cam_P3` por plano | `Cam_P3` |
| Coleção | `C_` + função | `C_Heroi`, `C_Cenario`, `C_Luz` |
| Coleção de light linking | `Heroi_Luz` | só objetos que o contorno pode tocar |
| Node group | `GN_` (geometria), `CMP_` (compositor) | `GN_Grade`, `CMP_Final` |
| Prova | `vNN_pP_qQQQQ.png` | `v03_p2_q0066.png` |
| Sequência | `render/pP/pP_####.png` | `render/p2/p2_0046.png` |
| Entrega | `cliente_peca_formato_vNN.mp4` | `vkdelivery_reels20s_9x16_v03.mp4` |

Atenção ao nome automático: o Blender acrescenta `.001` quando um nome já existe em outro tipo de dado **do mesmo bloco**. Na sonda, a luz `Fundo` virou `Fundo.001` porque já existia o objeto `Fundo` (o plano de fundo). Busque objetos pelo nome que você deu e confira com `assert` quando o nome importa (ver pegadinha 14).

## 3. Rodando sem interface (headless)

### 3.1 Comandos

| Objetivo | Comando |
|---|---|
| Montar cena e renderizar quadros-chave | `blender -b -P cena.py -- --plano 3 --pct 25` |
| Montar e salvar `.blend` sem render | `blender -b -P cena.py -- --so-salvar` |
| Renderizar animação inteira de um `.blend` | `blender -b projeto.blend -a` |
| Renderizar faixa | `blender -b projeto.blend -s 46 -e 105 -a` |
| Renderizar um quadro | `blender -b projeto.blend -f 105` |
| Trocar saída e motor na linha de comando | `blender -b projeto.blend -o //render/p2/p2_#### -E CYCLES -F PNG -s 46 -e 105 -a` |
| Falhar com código de erro se o script quebrar | `blender -b --python-exit-code 1 -P cena.py -- ...` |
| Rodar sem preferências do usuário | `blender -b --factory-startup -P cena.py` (cuidado com FFmpeg, ver 3.3) |
| Guardar log | `blender -b -P cena.py -- --pct 25 2>&1 \| tee qa/log_v03.txt` |

Fonte: [Manual 5.2, argumentos de linha de comando](https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html) e [renderização pela linha de comando](https://docs.blender.org/manual/en/latest/advanced/command_line/render.html). O conteúdo dessas páginas não abriu nesta pesquisa (só o índice do manual 5.2 carregou), então os detalhes abaixo vêm do comportamento conhecido do Blender e estão marcados quando não foram testados.

### 3.2 Três regras que evitam 80% dos erros

1. **Argumentos são executados na ordem em que aparecem.** `-s`, `-e`, `-o`, `-F` e `-E` precisam vir **antes** de `-a` ou `-f`, senão a renderização já começou quando eles forem lidos. O arquivo `.blend` também precisa vir antes deles. **[testar no Blender]** (comportamento documentado historicamente; a página do 5.2 não abriu).
2. **Tudo que é do seu script vem depois de `--`.** O Blender para de interpretar argumentos ao ver `--`, e `sys.argv` contém a linha inteira. Use o utilitário `parse_args` do `base.py`, que corta em `--`. **[confirmado por sonda no bpy 5.2.2]** (o `cena_exemplo.py` recebe `-- --pct 25` assim).
3. **`#` no caminho de saída vira o número do quadro com zeros.** `//render/p2/p2_####` gera `p2_0046.png`. `//` é relativo ao `.blend`. Na sonda, `render.filepath = '.../seq_####'` gerou `seq_0001.png`, `seq_0002.png`, `seq_0003.png` **[confirmado por sonda no bpy 5.2.2]**.

### 3.3 Logs

- O `print()` do script vai para o terminal. O `base.log()` prefixa o tempo desde o início (`[estudio  45.8s] quadro 165 -> ...`) e usa `flush=True` pra não perder linha se o processo morrer.
- O render imprime uma linha por amostra (`Fra:...`). Filtre com `grep -v "^Fra:"`. Na nuvem sem GPU aparecem avisos `EGL` e `CUEW initialization failed`: são inofensivos (sem driver de vídeo/CUDA).
- Guarde o log de cada iteração em `qa/log_vNN.txt`. Quando um render demora o dobro do anterior, o log mostra qual quadro estourou o tempo.
- **FFmpeg com `--factory-startup` no 5.0:** há um relato de regressão em que o formato FFmpeg sumia nesse modo ([issue #152175](https://projects.blender.org/blender/blender/issues/152175), página não abriu nesta pesquisa) **[não verificado no 5.2]**. Saída segura: renderize PNG e monte o MP4 depois (ver 4.10).

### 3.4 Tempo de render medido (referência para planejar)

| Máquina | Motor | Resolução | Amostras | Tempo por quadro |
|---|---|---|---|---|
| Nuvem (CPU, GL por software) | EEVEE | 320x320 | 16 | ~50 s (com glare no compositor) |
| Nuvem (CPU, GL por software) | EEVEE | 270x480 | 16 | 10 a 24 s (cena do exemplo) |
| Nuvem (CPU) | Cycles + OIDN | 320x320 | 16 | ~6 s |
| Nuvem | Workbench | 320x320 | n/a | ~2,5 s |
| RTX 3050 Laptop (Laboratório) | EEVEE | 540x960 | padrão | 0,37 s |
| RTX 3050 Laptop | EEVEE | 1080x1920 | 16 | ~3 s |
| RTX 3050 Laptop | Cycles OptiX com vidro | 540x960 | n/a | ~7 s |

Conclusão prática: na nuvem, **prova é em 25% da resolução** e no máximo 4 a 6 quadros por iteração. Na máquina de referência, a prova pode ser 50% e o final 100%.

## 4. API Python do Blender 5.x confirmada

Cada bloco abaixo foi rodado no `bpy` 5.2.2 LTS instalado na nuvem (`/home/claude/bvenv/bin/python`). Os scripts das sondas estão em `/home/claude/codigo/pipeline/sondas/` (`sonda_p1.py` a `sonda_p6.py`).

### 4.1 Keyframes e ações em slots (layered/slotted actions)

Desde o 4.4 a ação (Action) guarda animação em **slots** (um por dado animado) dentro de **camadas** e **faixas** (strips). As F-curves moram num **channelbag** ligado a um slot. No 5.0 a API antiga foi removida: `action.fcurves` não existe mais ([notas 4.4, Slotted Actions](https://developer.blender.org/docs/release_notes/4.4/upgrading/slotted_actions/); [notas 5.0 Python API](https://developer.blender.org/docs/release_notes/5.0/python_api/); relato prático em [dev.to, dez LLMs e o Blender 5.0](https://dev.to/rustam335/ask-ten-llms-for-a-blender-50-script-then-run-it-in-blender-50-1pe3)).

```python
import bpy
from bpy_extras import anim_utils

bpy.ops.mesh.primitive_cube_add()
o = bpy.context.active_object
o.location = (0, 0, 0); o.keyframe_insert("location", frame=1)
o.location = (0, 0, 2); o.keyframe_insert("location", frame=30)

act = o.animation_data.action
slot = o.animation_data.action_slot
cb = anim_utils.action_get_channelbag_for_slot(act, slot)
print([(fc.data_path, fc.array_index) for fc in cb.fcurves])
```

Saída da sonda **[confirmado por sonda no bpy 5.2.2]**:

```text
action CubeAction slots [('OBCube', 'Cube', 'OBJECT')]
fcurves [('location', 0), ('location', 1), ('location', 2)]
has action.fcurves False
layers ['Layer'] ['KEYFRAME']
```

O que aprendemos:

- `keyframe_insert` continua funcionando e cria sozinho ação, slot (`OBCube`), camada `Layer` e faixa do tipo `KEYFRAME`.
- O identificador do slot é prefixo do tipo + nome (`OB` + `Cube`).
- `obj.animation_data` tem `action_slot`, `action_slot_handle`, `action_suitable_slots` e `last_slot_identifier`.
- A assinatura no 5.2.2 é `keyframe_insert(data_path, *, index=-1, frame=None, group="", options=set(), keytype='KEYFRAME')`. Opções úteis: `INSERTKEY_NEEDED`, `INSERTKEY_VISUAL`, `INSERTKEY_CYCLE_AWARE`. Tipos de chave: `KEYFRAME`, `BREAKDOWN`, `MOVING_HOLD`, `EXTREME`, `JITTER`, `GENERATED`.

### 4.2 Criar uma ação do zero

Útil quando a mesma animação vai para vários objetos ou quando você quer controle total.

```python
o2 = bpy.data.objects.new("Vazio", None)
bpy.context.scene.collection.objects.link(o2)

a = bpy.data.actions.new("Acao_Manual")
s = a.slots.new(id_type='OBJECT', name="Vazio")   # assinatura: ActionSlots.new(id_type, name)
camada = a.layers.new("Base")
faixa = camada.strips.new(type='KEYFRAME')
cb = faixa.channelbag(s, ensure=True)
fc = cb.fcurves.new("rotation_euler", index=2)
fc.keyframe_points.insert(1, 0.0)
fc.keyframe_points.insert(30, 3.14)

o2.animation_data_create()
o2.animation_data.action = a
o2.animation_data.action_slot = s
bpy.context.scene.frame_set(30)
print(o2.rotation_euler.z)            # 3.140000104904175
```

**[confirmado por sonda no bpy 5.2.2]**: slot criado com identificador `OBVazio`, rotação 3,14 no quadro 30. Também existem e funcionam: `cb.fcurves.ensure("scale", index=0)` (cria se não existir) e `anim_utils.action_ensure_channelbag_for_slot(action, slot)`.

Ordem obrigatória: atribua `animation_data.action` **antes** de `action_slot`. O slot só é aceito se pertence à ação atual.

### 4.3 Interpolação, easing, handles e modificadores de F-curve

A interpolação de um ponto vale **do ponto até o próximo**. Por isso o easing de uma entrada vai na chave de **início**.

```python
fc = cb.fcurves.find("location", index=2)
for k in fc.keyframe_points:
    k.interpolation = 'EXPO'
    k.easing = 'EASE_OUT'
k = fc.keyframe_points[0]
k.interpolation = 'BACK'
k.back = 1.7                     # quanto passa do alvo antes de voltar
k.easing = 'EASE_OUT'
k.handle_left_type = 'AUTO_CLAMPED'

ruido = fc.modifiers.new('NOISE')
ruido.strength = 0.2; ruido.scale = 10; ruido.phase = 3

fx = cb.fcurves.find("location", index=0)
ciclo = fx.modifiers.new('CYCLES')   # mode_before/after = 'REPEAT'
```

Saída **[confirmado por sonda no bpy 5.2.2]**: `BACK EASE_OUT 1.7 AUTO_CLAMPED`; com `back = 1.7` e chave de 0 a 2 m entre os quadros 1 e 30, o objeto estava em z = 2,18 m no quadro 15 (passou 9% do alvo). O modificador NOISE tem `strength`, `scale`, `phase`, `offset`, `depth`, `blend_in`, `blend_out`, `use_restricted_range`. O CYCLES nasce com `mode_before = mode_after = 'REPEAT'`.

Tabela de escolha (detalhes de curva no capítulo de movimento):

| Movimento | Interpolação na chave inicial | Easing | Parâmetro | Por quê |
|---|---|---|---|---|
| Entrada de produto que "pousa" | `BACK` | `EASE_OUT` | `back` 0,9 a 1,15 (3 a 5%) em produto premium e eletrônico; 1,3 a 1,55 (6 a 8%) em UI e mundos pop. Conferir na tabela 6.1 do cap 04 (ver 00 · Padrões da casa) | Passa e volta: dá peso e decisão |
| Giro de revelação | `EXPO` | `EASE_IN_OUT` | n/a | Começa e termina devagar, meio rápido |
| UI deslizando | `QUART` ou `QUINT` | `EASE_OUT` | n/a | Chega rápido e assenta, como iOS |
| Câmera que empurra o filme todo | `SINE` | `EASE_IN_OUT` | 3 a 6% de distância | Vida sem chamar atenção |
| Pulso de ícone em loop | `BEZIER` + modificador `CYCLES` | `AUTO` | n/a | Repetição exata sem copiar chaves |
| Câmera "na mão" | modificador `NOISE` | n/a | `strength` 0,5 a 1 mm, `scale` 20 a 30 | Micro tremor; acima de 2 mm parece erro |

Sinal de erro: se tudo usa `BEZIER` `AUTO` (o padrão), o movimento fica com cara de software (problema 7 da lista do estúdio).

### 4.4 Drivers

```python
d = o2.driver_add("location", 0)
d.driver.type = 'SCRIPTED'
v = d.driver.variables.new()
v.name = 'z'; v.type = 'SINGLE_PROP'
v.targets[0].id = o                      # objeto fonte
v.targets[0].data_path = 'location.z'
d.driver.expression = 'z*2'

d2 = o2.driver_add("scale", 0)
d2.driver.expression = "1+0.1*sin(frame/5)"
```

**[confirmado por sonda no bpy 5.2.2]**: `d.driver.is_valid = True`; a expressão com `frame` e `sin` avaliou (escala 1,09 no quadro 10). Expressões simples (`sin`, `frame`, aritmética, variáveis) são avaliadas pelo avaliador interno do Blender sem executar Python, então funcionam mesmo com scripts automáticos bloqueados. Expressões com funções Python próprias exigem "Auto Run Python Scripts" ligado **[testar no Blender]** com `blender -b` e um `.blend` aberto.

Uso no estúdio: driver liga brilho de emissão da tela à rotação do celular (tela "acende" quando vira para a câmera), ou liga a escala de vários ícones a uma única propriedade de controle.

### 4.5 Geometry Nodes por código

```python
ng = bpy.data.node_groups.new("GN_Grade", 'GeometryNodeTree')
ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')
s = ng.interface.new_socket("Contagem", in_out='INPUT', socket_type='NodeSocketInt')
s.default_value = 5; s.min_value = 1

n = ng.nodes
gi = n.new('NodeGroupInput'); go = n.new('NodeGroupOutput')
grade = n.new('GeometryNodeMeshGrid')          # entradas: Size X, Size Y, Vertices X, Vertices Y
pts = n.new('GeometryNodeMeshToPoints')
inst = n.new('GeometryNodeInstanceOnPoints')
cubo = n.new('GeometryNodeMeshCube'); cubo.inputs['Size'].default_value = (0.2, 0.2, 0.2)
real = n.new('GeometryNodeRealizeInstances')
junta = n.new('GeometryNodeJoinGeometry')
L = ng.links.new
L(gi.outputs['Contagem'], grade.inputs['Vertices X'])
L(gi.outputs['Contagem'], grade.inputs['Vertices Y'])
L(grade.outputs['Mesh'], pts.inputs['Mesh'])
L(pts.outputs['Points'], inst.inputs['Points'])
L(cubo.outputs['Mesh'], inst.inputs['Instance'])
L(inst.outputs['Instances'], real.inputs['Geometry'])
L(real.outputs['Geometry'], junta.inputs['Geometry'])
L(gi.outputs['Geometry'], junta.inputs['Geometry'])
L(junta.outputs['Geometry'], go.inputs['Geometry'])

bpy.ops.mesh.primitive_plane_add(size=0.1)
obj = bpy.context.active_object
mod = obj.modifiers.new("GN", 'NODES')
mod.node_group = ng

# 5.2: valor de entrada do modificador
sid = [it.identifier for it in ng.interface.items_tree if it.name == 'Contagem'][0]
getattr(mod.properties.inputs, sid).value = 4
```

**[confirmado por sonda no bpy 5.2.2]**: a malha avaliada teve 132 vértices (16 cubos × 8 + 4 do plano), batendo com a contagem 4.

**A pegadinha grande do 5.2:** o jeito antigo `mod["Socket_2"] = 4` dá `TypeError: bpy_struct[key] = val: id properties not supported for this type`. No 5.2 os valores de entrada ficam em `mod.properties.inputs.<identificador>.value`; cada entrada também tem `.type` e `.attribute_name` (para ligar a um atributo). A atribuição direta `setattr(mod.properties.inputs, sid, 4)` falha com "read-only": tem que ser `.value`. Confirmado por sonda e também descrito no resumo de mudanças do 5.2 em [Simstim, Blender 5.2 LTS for TDs](https://simstim.org/journal/blender-news). Os identificadores (`Socket_0`, `Socket_1`, `Socket_2`) seguem a ordem de criação, não a ordem visual: a saída Geometry criada em segundo lugar ganhou `Socket_1` e a entrada Contagem ganhou `Socket_2`. Sempre busque pelo `name`.

Para converter um node group feito à mão em código, o add-on [NodeToPython](https://github.com/BrendanParmer/NodeToPython) declara suporte do 4.2 ao 5.2 para Geometry Nodes, shader e compositor.

### 4.6 Texto 3D

```python
c = bpy.data.curves.new("Titulo", type='FONT')
c.body = "VK 5.2"
c.size = 0.3              # altura em metros
c.extrude = 0.02          # profundidade (metade para cada lado)
c.bevel_depth = 0.004     # chanfro arredondado
c.bevel_resolution = 3
c.align_x = 'CENTER'; c.align_y = 'CENTER'
f = bpy.data.fonts.load('/caminho/Poppins-Bold.ttf', check_existing=True)
c.font = f
t = bpy.data.objects.new("Titulo", c)
bpy.context.scene.collection.objects.link(t)
```

**[confirmado por sonda no bpy 5.2.2]**: fonte padrão `Bfont Regular <builtin>`; `fonts.load` carregou `Poppins Bold`; propriedades existentes: `offset`, `space_character`, `space_word`, `space_line`, `body_format`, `resolution_u`, `fill_mode`. O texto convertido teve 6.264 vértices e `bpy.ops.object.convert(target='MESH')` funcionou em modo sem interface.

Regras de estúdio para texto:

- Para negrito/itálico por letra, carregue as variantes em `c.font_bold`, `c.font_italic` e use `body_format` **[testar no Blender]**.
- `extrude` é metade para cada lado do plano. Para letra de 3 cm de altura num filme de produto, `extrude` 1,5 a 2 mm e `bevel_depth` 0,3 a 0,5 mm. Chanfro maior que 1/6 da espessura do traço "incha" a letra.
- Sempre chanfre o texto. Texto sem chanfro não pega contorno de luz e parece adesivo.
- Use `resolution_u` 12 ou mais para letras com curva em close **[testar no Blender]**.
- Fonte só de licença livre para uso comercial (OFL do Google Fonts, ver seção 8).

### 4.7 SVG para logos

**[confirmado por sonda no bpy 5.2.2]**: os operadores `bpy.ops.import_curve.svg` (add-on `io_curve_svg`, ligado por padrão) e `bpy.ops.wm.grease_pencil_import_svg` existem. `bpy.ops.wm.svg_import` **não** existe.

```python
antes = set(bpy.data.objects)
bpy.ops.import_curve.svg(filepath='logo.svg')
novos = [o for o in bpy.data.objects if o not in antes]   # 1 curva por <path>/<circle>
largura_m = 0.120                     # tamanho real do filme: 120 mm na assinatura
xs = [b.co.x for o in novos for sp in o.data.splines for b in sp.bezier_points]
f = largura_m / (max(xs) - min(xs))
for o in novos:
    for sp in o.data.splines:         # 1) escala nos pontos da curva, não no objeto
        for b in sp.bezier_points:
            b.co *= f; b.handle_left *= f; b.handle_right *= f
    o.data.extrude = 0.003            # 2) extrusão em mm reais: 3 mm de cada lado = 6 mm
bpy.ops.object.select_all(action='DESELECT')
for o in novos: o.select_set(True)
bpy.context.view_layer.objects.active = novos[0]
bpy.ops.object.convert(target='MESH')
bpy.ops.object.join()
logo = bpy.context.active_object
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
logo.location = (0, 0, 0)
b = logo.modifiers.new("Chanfro", 'BEVEL')   # 3) chanfro por último, em mm reais
b.width = 0.0004; b.segments = 3; b.limit_method = 'ANGLE'   # 5 a 10% da espessura
```

**[confirmado por sonda no bpy 5.2.2, nuvem]** com esta ordem: SVG de teste saiu com 120,0 × 120,0 × 6,0 mm e escala do objeto 1,0.

Saída da sonda: um SVG de `viewBox` 100 × 100 virou duas curvas (`Curve`, `Curve.001`) dentro de uma coleção com o nome do arquivo (`logo.svg`); o "V" de 80 unidades de largura chegou com **0,0226 m**. Ou seja, o importador usa ~90 DPI: **1 unidade SVG ≈ 0,282 mm**. Depois de converter e juntar: 756 vértices, 24,2 × 24,2 × 5 mm.

Consequências práticas:

1. **Escale primeiro, extrude e chanfre depois.** Leve o logo ao tamanho real do filme (ex.: 120 mm de largura numa assinatura) escalando `co`, `handle_left` e `handle_right` de cada ponto da curva (como no cap 03 §10), não o objeto. Só então defina `extrude` e o chanfro em mm reais. Aplicar `transform_apply(scale)` depois de extrudar multiplica a espessura pelo fator (o cap 03 achou 57 mm em vez de 14 mm) (ver 00 · Padrões da casa).
2. Defina `extrude` **antes** de converter em malha, e **depois** de escalar os pontos; depois de converter, use o modificador Solidify ou extrusão de faces.
3. O importador cria uma curva por forma. Furos (letra "O") só saem certos se o SVG usar `fill-rule` e caminhos compostos corretamente; logo com contornos convertidos em formas no Illustrator/Figma antes de exportar dá menos problema **[testar no Blender]** com logos reais.
4. O caminho Grease Pencil (`wm.grease_pencil_import_svg`) gera um objeto `GREASEPENCIL` (traço 2D), bom para animação de desenho de linha, não para logo sólido.

### 4.8 glTF e FBX

**[confirmado por sonda no bpy 5.2.2]**: com os add-ons padrão (`io_scene_gltf2`, `io_scene_fbx` aparecem ligados), `export_scene.gltf` (GLB de 104 KB com Suzanne + logo), `import_scene.gltf`, `export_scene.fbx` e `import_scene.fbx` (FBX 7400) terminaram com `{'FINISHED'}`. Também existem os importadores nativos `wm.obj_import`, `wm.stl_import`, `wm.usd_import`, `wm.ply_import`, `wm.alembic_import`.

```python
bpy.ops.import_scene.gltf(filepath='assets/produto.glb')
novos = bpy.context.selected_objects          # [testar no Blender] se o importador deixa os novos selecionados; o seguro é comparar set(bpy.data.objects) antes e depois, como no SVG
```

Pontos de atenção:

- No `bpy` da nuvem apareceu `ERROR Draco is not available` e `MeshOptimizer is not available`: as bibliotecas de compressão não vêm no pacote `bpy` do PyPI. No Blender completo elas vêm junto **[testar no Blender]**. GLB com compressão Draco vai falhar na nuvem.
- glTF chega em metros e com eixo Y para cima convertido para Z. FBX de outros programas costuma vir em centímetros (escala 0,01): confira `obj.dimensions` contra a medida real do produto antes de iluminar.
- Material glTF vira Principled BSDF; revise aspereza e chanfro (o glTF raramente tem chanfro modelado).

### 4.9 Compositor por código (5.x)

No 5.0, `scene.node_tree` foi removido e o compositor passou a ser um **node group** ligado em `scene.compositing_node_group` ([issue no ayon-blender sobre a remoção](https://github.com/ynput/ayon-blender/issues/201)). O nó Composite também saiu: a imagem final é o **Group Output** do grupo.

```python
cena = bpy.context.scene
ng = bpy.data.node_groups.new("CMP_Final", 'CompositorNodeTree')
ng.interface.new_socket("Image", in_out='OUTPUT', socket_type='NodeSocketColor')
rl = ng.nodes.new('CompositorNodeRLayers')
glare = ng.nodes.new('CompositorNodeGlare')
glare.inputs['Type'].default_value = 'Bloom'     # 5.x: tipo é um socket de menu
glare.inputs['Threshold'].default_value = 0.8
glare.inputs['Strength'].default_value = 0.5
saida = ng.nodes.new('NodeGroupOutput')
ng.links.new(rl.outputs['Image'], glare.inputs['Image'])
ng.links.new(glare.outputs['Image'], saida.inputs['Image'])
cena.compositing_node_group = ng
```

**[confirmado por sonda no bpy 5.2.2]**:

- `scene.compositing_node_group` começa `None`. Um grupo novo não tem sockets: crie a saída `Image` na interface.
- Existem: `CompositorNodeGlare` (entradas `Image, Type, Quality, Threshold, Smoothness, Clamp, Maximum, Strength, Saturation, Tint, Size, Streaks`), `CompositorNodeLensdist`, `CompositorNodeEllipseMask`, `CompositorNodeViewer`, `CompositorNodeBrightContrast`, `CompositorNodeColorBalance`, `CompositorNodeDefocus`, `CompositorNodeBlur`, `NodeGroupOutput`, e o `ShaderNodeMix` funciona dentro do compositor.
- **Não existem**: `CompositorNodeComposite`, `CompositorNodeMixRGB`, `CompositorNodeFilmGrain`, `CompositorNodeVignette`. Vinheta se faz com `EllipseMask` + `Blur` + `Mix`; grão, com textura de ruído ou no editor.
- Configurações que antes eram propriedades do nó (tipo do glare, por exemplo) agora são **sockets de menu**: `glare.inputs['Type'].default_value = 'Bloom'` (padrão `Streaks`).
- `scene.use_nodes` ainda existe mas gera `DeprecationWarning` ("expected to be removed in Blender 6.0").
- O render com esse compositor rodou e salvou PNG.

O 5.2 acrescentou seis tipos de socket e 35 nós ao compositor ([página do 5.2](https://www.blender.org/download/releases/5-2/)); confira nomes novos com `dir(bpy.types)` antes de usar.

### 4.10 Render: quadro, sequência, PNG, EXR e FFmpeg

No 5.x, `image_settings` ganhou **`media_type`** com três valores: `IMAGE`, `MULTI_LAYER_IMAGE`, `VIDEO`. O `file_format` só aceita formatos do tipo de mídia atual ([PR do ayon-blender explicando a quebra](https://github.com/ynput/ayon-blender/pull/365)).

```python
r = bpy.context.scene.render
ims = r.image_settings

# PNG 16 bits (prova e sequência)
ims.media_type = 'IMAGE'; ims.file_format = 'PNG'
ims.color_mode = 'RGBA'; ims.color_depth = '16'
r.filepath = '/proj/provas/v01_q105.png'
bpy.ops.render.render(write_still=True)

# EXR com compressão DWAA
ims.file_format = 'OPEN_EXR'; ims.color_depth = '16'; ims.exr_codec = 'DWAA'

# EXR multicamada (passes para composição)
ims.media_type = 'MULTI_LAYER_IMAGE'          # file_format vira OPEN_EXR_MULTILAYER

# sequência
ims.media_type = 'IMAGE'; ims.file_format = 'PNG'
scene.frame_start, scene.frame_end = 1, 3
r.filepath = '/proj/render/p1/p1_####'
bpy.ops.render.render(animation=True)

# MP4 H.264
ims.media_type = 'VIDEO'                       # file_format vira FFMPEG sozinho
r.ffmpeg.format = 'MPEG4'; r.ffmpeg.codec = 'H264'
r.ffmpeg.constant_rate_factor = 'HIGH'; r.ffmpeg.ffmpeg_preset = 'GOOD'
r.filepath = '/proj/entrega/peca_'
bpy.ops.render.render(animation=True)          # gerou peca_0001-0012.mp4
```

**[confirmado por sonda no bpy 5.2.2]**:

- `file_format = 'FFMPEG'` com `media_type = 'IMAGE'` falha: `enum "FFMPEG" not found in ('AVIF', 'JPEG', 'OPEN_EXR', 'PNG', 'WEBP', 'BMP', 'CINEON', 'DPX', 'IRIS', 'JPEG2000', 'HDR', 'TARGA', 'TARGA_RAW', 'TIFF')`. Note que **AVIF e WEBP** entraram como formatos de imagem.
- Codecs disponíveis: `AV1, H264, H265, WEBM, DNXHD, DV, FFV1, FLASH, HUFFYUV, MPEG1, MPEG2, MPEG4, PNG, PRORES, QTRLE, THEORA`. Contêineres: `MPEG4, MKV, WEBM, AVI, DV, FLASH, MPEG1, MPEG2, OGG, QUICKTIME`. Qualidade (`constant_rate_factor`): `NONE, LOSSLESS, PERC_LOSSLESS, HIGH, MEDIUM, LOW, VERYLOW, LOWEST, CUSTOM`.
- 12 quadros Cycles a 320x320 viraram `video_0001-0012.mp4` em 77 s.
- Motores aceitos: `BLENDER_EEVEE`, `CYCLES`, `BLENDER_WORKBENCH`. `BLENDER_EEVEE_NEXT` não existe.
- O fps de fábrica é **24**. Declare `render.fps = 30` sempre.

**Regra do estúdio para entrega:** renderize **sequência PNG** (ou EXR se houver composição pesada) e monte o MP4 no fim. Se o render cair no quadro 431, você recomeça do 431, não do 1. Para montar o vídeo, use o próprio Blender (Video Sequencer com a sequência de imagens e saída FFmpeg) ou o `ffmpeg` do sistema com o comando do cap 07 §5.6, que leva `out_color_matrix=bt709` e as marcas bt709 (sem elas o laranja da marca volta R+9 G+7 B-7, cap 07 §5.5): `ffmpeg -y -framerate 30 -i p1_%04d.png -i trilha.wav -map 0:v -map 1:a -shortest -vf "scale=1080:1920:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p" -c:v libx264 -profile:v high -level:v 4.2 -preset slow -crf 17 -maxrate 16M -bufsize 32M -g 15 -keyint_min 15 -sc_threshold 0 -bf 2 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart entrega_redes.mp4` **[testado na nuvem, ffmpeg 6.1.1, cap 07]** (ver 00 · Padrões da casa). `yuv420p` é o que Instagram e WhatsApp aceitam sem recodificar errado.

### 4.11 Tabela-resumo do que mudou e do que funciona

| Tarefa | Código no 5.2 | Status |
|---|---|---|
| F-curves de um objeto | `anim_utils.action_get_channelbag_for_slot(act, slot).fcurves` | confirmado por sonda |
| Ação do zero | `actions.new` → `slots.new(id_type, name)` → `layers.new` → `strips.new(type='KEYFRAME')` → `strip.channelbag(slot, ensure=True)` → `fcurves.new(path, index=)` | confirmado por sonda |
| Easing | `k.interpolation`, `k.easing`, `k.back` | confirmado por sonda |
| Modificador de F-curve | `fc.modifiers.new('NOISE' / 'CYCLES')` | confirmado por sonda |
| Driver | `obj.driver_add(path, idx)` + `variables.new()` | confirmado por sonda |
| Entrada de GN no modificador | `getattr(mod.properties.inputs, sid).value = x` | confirmado por sonda (mudou no 5.2) |
| Texto 3D | `curves.new(type='FONT')`, `fonts.load` | confirmado por sonda |
| SVG | `ops.import_curve.svg` (90 DPI) | confirmado por sonda |
| glTF/FBX | `ops.import_scene.gltf/fbx` | confirmado por sonda (sem Draco no bpy do PyPI) |
| Compositor | `scene.compositing_node_group` + `NodeGroupOutput` | confirmado por sonda |
| Vídeo | `image_settings.media_type = 'VIDEO'` | confirmado por sonda |
| Booleano | solvers `FLOAT`, `EXACT`, `MANIFOLD` (`FAST` saiu) | confirmado por sonda |
| Sequenciador | `sequence_editor.strips` (`sequences` saiu) | confirmado por sonda |
| Suavização automática | `mesh.use_auto_smooth` saiu; existe `ops.object.shade_auto_smooth` | confirmado por sonda |
| Material/mundo novos | já nascem com `node_tree`; `use_nodes` gera aviso de remoção no 6.0 | confirmado por sonda |
| Light linking | `luz.light_linking.receiver_collection = colecao` | confirmado por sonda |

## 5. O módulo `base.py` e a cena de exemplo

Arquivos (todos rodados na nuvem **[confirmado por sonda no bpy 5.2.2]**):

- `/home/claude/codigo/pipeline/base.py`: utilitários.
- `/home/claude/codigo/pipeline/tempos_exemplo.json`: tempo de um filme de 6 s.
- `/home/claude/codigo/pipeline/cena_exemplo.py`: monta a cena a partir do JSON e renderiza 4 quadros-chave + folha de contato.
- `/home/claude/codigo/pipeline/assets_polyhaven.py`: download e montagem de HDRI/textura do Poly Haven (montagem confirmada; download a testar).
- `/home/claude/codigo/pipeline/sondas/`: os scripts das sondas desta página.

### 5.1 O que tem no `base.py`

| Função | O que faz | Valor padrão e por quê |
|---|---|---|
| `log(*partes)` | Imprime com tempo decorrido e `flush` | Log legível em render longo |
| `parse_args(defs)` | Lê só o que vem depois de `--` | `blender -b -P cena.py -- --plano 3` |
| `carregar_tempos(json)` | Lê `tempos.json` e calcula `q_ini`, `q_fim`, `q` dos eventos | Tempo em segundos, quadro calculado |
| `limpar_cena()` | `read_factory_settings(use_empty=True)` e remove órfãos | Cena previsível, já em AgX |
| `unidades_mm()` | Métrico, `scale_length = 1.0`, interface em mm | Física e luz em metro |
| `definir_formato(nome, pct, fps)` | 9:16 (1080x1920), 1:1 (1080x1080), 4:5 (1080x1350), 16:9 (1920x1080) | fps 30 explícito (fábrica é 24) |
| `cor_agx(look)` | AgX + look nomeado + exposição + gamma | `AgX - Medium High Contrast` |
| `preset_render(nivel)` | rascunho (EEVEE 16, 25% na nuvem, 50% na RTX), prova (EEVEE 32, 50%), final_eevee (64, 100%), final_cycles (1024 amostras, limiar 0,01, mínimo 64, OIDN High; presets do cap 07 §3.6) | Um nome em vez de 6 linhas |
| `ativar_optix()` | Liga OptiX nas preferências do Cycles | Falha sem parar o script na nuvem |
| `saida_png/exr/mp4()` | Ajusta `media_type` antes do formato | Evita o erro de enum do 5.x |
| `criar_camera(lente, local, alvo, f_stop)` | Câmera com lente em mm, sensor 36 mm, DOF opcional, mira sem constraint | `clip_start` 1 cm; 5 mm (`clip_start_m=0.005`) só em macro abaixo de 13 cm |
| `mirar(obj, alvo)` | Aponta o eixo -Z do objeto para o alvo | Serve para câmera e luz de área |
| `fcurves_de(id)` | F-curves do slot ativo via channelbag | Substitui `action.fcurves` |
| `chave(obj, path, q, valor, interp, easing, back)` | Insere chave e ajusta o ponto recém-criado | Easing explícito em toda chave |
| `mover(obj, path, q0, q1, v0, v1, ...)` | Duas chaves, easing na primeira | Atalho para 90% dos movimentos |
| `cascata(objs, path, q0, dur, atraso, ...)` | Mesmo movimento com atraso fixo | BACK 1,3 (cerca de 6%, tabela 6.1 do cap 04), atraso 3 a 5 quadros |
| `ruido(obj, path, idx, forca, escala)` | Modificador NOISE | 0,8 mm, escala 25 para câmera |
| `loop(obj, path)` | Modificador CYCLES | Fundo em loop |
| `aplicar_chanfro(obj, largura_m, segmentos, angulo)` | Bevel por ângulo, `harden_normals`, `MITER_ARC`, faces suaves | 0,5 mm mínimo em objeto de mão |
| `material_basico(...)` | Principled com cor, aspereza, metal, coat | Material de prova; o final vem do capítulo de materiais |
| `luz_area(nome, local, alvo, W, tamanho, kelvin, grade)` | Luz de área com temperatura nativa e spread | Mira automática |
| `mundo_cor(cor, forca)` | Fundo de mundo em cor sólida | Mundo escuro, sem cinza padrão |
| `salvar_quadro(q, caminho)` | `frame_set` + PNG + render + log de tempo | Prova de um quadro |
| `folha_contato(caminhos, saida, colunas, rotulos)` | Grade com rótulo (Pillow) | Python do sistema |
| `lado_a_lado(antes, depois, saida)` | Comparação com rótulos | Prova de que a correção melhorou |

### 5.2 Como a cena de exemplo usa o tempo

O `cena_exemplo.py` não tem nenhum número de quadro solto. Ele lê o plano "entrada" do JSON e anima a partir de `q_ini`:

```python
T = B.carregar_tempos(a.tempos)
P = {p["nome"]: p for p in T["planos"]}
pe, pr, pm = P["entrada"], P["revelacao"], P["mensagem"]

B.mover(cel, "location", pe["q_ini"], pe["q_ini"] + 24, (0, 0, -0.18), (0, 0, 0),
        interp="BACK", easing="EASE_OUT", back=1.3)
B.mover(cel, "rotation_euler", pr["q_ini"], pr["q_ini"] + 40, (0, 0, 0),
        (0, 0, math.radians(35)), interp="EXPO", easing="EASE_IN_OUT")
B.cascata(palavras, "scale", pm["q_ini"], 12, 4, (0, 0, 0), (1, 1, 1),
          interp="BACK", back=1.6)
```

Conferência dos valores animados, lidos quadro a quadro **[confirmado por sonda no bpy 5.2.2]**:

| Quadro | Altura do celular | Giro | Escala da 2ª palavra |
|---|---|---|---|
| 1 | -180,0 mm | 0° | 0 |
| 8 | -29,7 mm | 0° | 0 |
| 12 | +2,9 mm (passou do alvo) | 0° | 0 |
| 16 | +11,1 mm (perto do pico da ultrapassagem) | 0° | 0 |
| 25 | 0 (assentou) | 0° | 0 |
| 60 | 0 | 2,2° | 0 |
| 75 | 0 | 34,2° | 0 |
| 113 | 0 | 35° | 0,8 |
| 165 | 0 | 35° | 1,0 |

Repare: o giro EXPO de 40 quadros (46 a 86) faz quase tudo entre os quadros 60 e 75. É isso que o EXPO EASE_IN_OUT deve fazer, mas significa que o quadro-chave 40 escolhido no JSON mostra o celular **antes** do giro, igual ao quadro 16. Lição do loop visual: o quadro-chave do giro deveria ser o **66** (meio da rotação), não o 40.

## 6. O loop visual de qualidade

O código não enxerga. A IA enxerga. O loop é: **renderizar quadros-chave baratos, olhar, medir, criticar contra a rubrica, corrigir o script, repetir.** Nunca se corrige o `.blend` na mão: toda correção vira linha no `cena.py`.

### 6.1 O ciclo

1. **Renderizar** os `quadros_chave` do `tempos.json` em prova (25% na nuvem, 50% na RTX). 4 a 6 quadros por volta.
2. **Montar a folha de contato** (todos os quadros lado a lado, com rótulo de quadro e plano).
3. **Medir** com `qa/medir.py`: brilho médio, desvio (contraste), % estourado (≥ 250), % afundado (≤ 5). Faixa de contraste depende do medidor. `qa.py` do Laboratório: 0,20 a 0,38. Desvio padrão da luma (`medir.py`, `qa_extra.py`): 0,14 a 0,30. Nunca julgue um número pela faixa do outro (ver 00 · Padrões da casa). Estourado < 1,5%.
4. **Olhar** a folha com a rubrica da passagem (6.3). Escrever a crítica em 3 a 6 itens objetivos, cada um com causa provável e correção numérica.
5. **Corrigir o script** só nos itens da crítica. Uma variável por problema, nunca "melhorar tudo".
6. **Renderizar de novo e comparar lado a lado** com a versão anterior. Se não melhorou, desfazer.
7. **Parar** quando a rubrica passar ou no limite de voltas.

### 6.2 Limite de iterações

- **Máximo de 5 voltas por plano** na fase de prova. Se na 5ª ainda falha, o problema é de **ideia** (tratamento, mundo, composição), não de ajuste: volte ao `tratamento.md`.
- **Uma variável por vez quando a métrica oscila.** Se a volta N clareou demais e a N+1 escureceu demais, divida o passo pela metade.
- **Nunca gaste mais de 20% do tempo do projeto em provas de um único plano.**

### 6.3 O que olhar em cada passagem

| Passagem | Pergunta | Olhe em | Sinal de falha |
|---|---|---|---|
| 1. Geometria e câmera | O herói está inteiro, na escala certa, no lugar certo? | Folha de contato inteira | Objeto cortado, atravessando o chão, câmera dentro de algo, proporção errada |
| 2. Exposição e cor | O herói está exposto e separado do fundo? | Medidor + histograma | Afundado > 30%, estourado > 1,5%, média > 0,6 em mundo escuro |
| 3. Luz e forma | Tem direção, contorno e queda de luz? | Arestas e chanfros | Herói chapado, sem linha de luz na borda, fundo mais claro que o herói |
| 4. Material | Lê como o material real? | Close 100% de um quadro | Plástico uniforme, tela como placa, vidro sem reflexo |
| 5. Movimento | Os quadros-chave mostram o pico de cada ação? | Quadros antes/pico/depois de cada movimento | Dois quadros iguais, ação que não aparece, ultrapassagem invisível |
| 6. Mensagem | Em 1 s de olhada, entende o produto e a frase? | Último quadro em 25% do tamanho | Texto ilegível no celular, logo sumido, CTA fora da zona segura |

Zonas seguras do 9:16 (Reels/TikTok) estão no cap 01 §7.4 e no cap 08 §6.4 (máscara universal em 00 · Padrões da casa). Na passagem 6, teste também o quadro reduzido a 270x480: se não lê nessa escala, não lê na tela do celular.

O movimento não se julga só por quadros parados. Depois que as passagens 1 a 4 aprovarem, renderize o plano inteiro em rascunho (25% na nuvem, 50% na RTX, EEVEE 16 amostras), monte um MP4 curto e a IA analisa a sequência de quadros (a cada 2 ou 3 quadros) procurando: parada brusca, velocidade constante sem easing, ultrapassagem que não se vê, câmera que treme demais.

### 6.4 Estudo de caso real: 4 voltas na cena de exemplo

Tudo abaixo aconteceu nesta pesquisa, com o `cena_exemplo.py`, EEVEE 16 amostras, 270x480. Imagens em `/home/claude/provas/`.

**Volta 1** (`pipeline_v1_folha.png`). Métrica do quadro 165: média 0,066, desvio 0,142, **afundado 44,4%**. Crítica da IA olhando a folha:

1. O celular aparece quase quadrado: a metade de baixo está escondida. Causa: um plano de chão em z = 0 corta o celular, que tem centro em z = 0.
2. A câmera está em z = -0,02, **abaixo do chão**: vê o lado de baixo do plano (faixa cinza sem textura na metade inferior).
3. Texto quase invisível (granulado, escuro): a luz principal mira o centro do celular, não o texto 11 a 18 cm abaixo.
4. Tela azul uniforme, placa plana (problema 5 do estúdio).

**Volta 2** (`pipeline_v2_folha.png`). Correções: chão trocado por fundo vertical 35 cm atrás; câmera em z = +0,02 mirando z = -0,05; tela com gradiente; luzes mais fortes; luz de fundo de 25 W. Métrica: **média 0,714**, desvio 0,136, estourado 0,40%. Crítica: o oposto do erro anterior. Fundo lavado lilás-claro, texto branco estourado, gradiente da tela não aparece (só um reflexo). Causa do gradiente: o nó Separate XYZ lia `Y` das coordenadas geradas, mas o plano está no eixo XZ, então Y é constante.

**Volta 3** (`pipeline_v3_folha.png`). Correções: gradiente lendo `Z`; principal 45 para 16 W; preenchimento 12 para 4 W; luz de fundo 25 para 2,5 W; texto com albedo 0,62. Métrica: média 0,61, ainda clara. O gradiente da tela apareceu. Mas cortar a luz de fundo para 1/10 quase não mudou nada, então a causa era outra. **Diagnóstico por isolamento**: renderizar a 10% com uma luz por vez e medir o canto superior do fundo:

| Luz ligada sozinha | Brilho do canto superior | Média da imagem |
|---|---|---|
| nenhuma | 0,000 | 0,034 |
| Principal | 0,319 | 0,219 |
| Preenchimento | 0,038 | 0,109 |
| **Contorno** | **0,469** | 0,417 |
| **ContornoEsq** | **0,785** | 0,394 |
| Fundo | 0,137 | 0,091 |

As duas luzes de contorno, que deveriam tocar só as bordas do celular, eram as que mais clareavam o fundo. Elas estavam a 13 cm da parede. **Observação a testar:** no EEVEE do 5.2.2, mesmo apontadas para o lado oposto da parede, elas iluminaram a parede **[testar no Blender com GPU e no Cycles]**. Independente da causa, a solução de estúdio é a mesma.

**Volta 4** (`pipeline_folha.png`). Correção única: **light linking**. Coleção `Heroi_Luz` com celular, tela e textos; `luz.light_linking.receiver_collection = Heroi_Luz` nas duas luzes de contorno. Teste isolado: canto superior foi de 0,785 para **0,000**. Métrica final do quadro 165: média 0,300, desvio 0,132, estourado 0,13%, afundado 0,07%. Fundo marrom-escuro quente com mancha de luz, linhas de contorno frias nas bordas do celular, gradiente na tela, texto legível.

O que ainda falha e ficaria para a volta 5: o desvio 0,13 está logo abaixo da faixa do desvio padrão da luma (0,14 a 0,30); a faixa 0,20 a 0,38 é do `qa.py` do Laboratório e não vale para o `medir.py`. Nunca julgue um número pela faixa do outro (ver 00 · Padrões da casa); o reflexo do coat na tela faz uma faixa vertical clara que parece defeito; os quadros 16 e 40 mostram a mesma coisa (quadro-chave mal escolhido, ver 5.2). Comparação: `pipeline_antes_depois.png` (v1 contra v4) e `pipeline_iteracoes_q165.png` (as 4 voltas do quadro 165).

Lições que viram regra:

1. **Antes de mexer em intensidade, isole.** Uma luz por vez a 10% de resolução custa segundos e acha o culpado.
2. **Contorno sempre com light linking** (ou bandeira preta) quando o fundo está a menos de 50 cm.
3. **O meio do plano raramente é o quadro certo.** Renderize o pico da ação.
4. **A métrica aponta, o olho decide.** A volta 3 tinha estourado 0% e mesmo assim estava errada (fundo mais claro que o herói).
5. **Bug de geometria primeiro.** Na volta 1, nenhuma correção de luz resolveria um chão cortando o herói.

### 6.5 Código: folha de contato e lado a lado

As duas funções estão no `base.py` e usam Pillow. Como o Python embutido no Blender não traz Pillow, rode a folha com o Python do sistema:

```python
# qa/folha.py  (python3 qa/folha.py provas/v04_q*.png)
import sys, math, os
from PIL import Image, ImageDraw

def folha_contato(caminhos, saida, colunas=4, rotulos=None, largura_cel=360):
    imgs = [Image.open(c).convert("RGB") for c in caminhos]
    w0, h0 = imgs[0].size
    cw, ch = largura_cel, int(h0 * largura_cel / w0)
    faixa, linhas = 28, math.ceil(len(imgs) / colunas)
    folha = Image.new("RGB", (colunas * cw + (colunas + 1) * 8,
                              linhas * (ch + faixa) + (linhas + 1) * 8), (18, 18, 20))
    d = ImageDraw.Draw(folha)
    for i, im in enumerate(imgs):
        x = 8 + (i % colunas) * (cw + 8)
        y = 8 + (i // colunas) * (ch + faixa + 8)
        folha.paste(im.resize((cw, ch)), (x, y))
        d.text((x + 4, y + ch + 6), rotulos[i] if rotulos else os.path.basename(caminhos[i]),
               fill=(230, 230, 230))
    folha.save(saida)

if __name__ == "__main__":
    folha_contato(sys.argv[1:], "provas/folha.png")
```

Fundo da folha em cinza 18/255: escuro o bastante para não enganar o olho sobre a exposição dos quadros (folha branca faz tudo parecer escuro).

Isolamento de luzes (o script que achou o culpado na volta 3), para rodar com `--so-salvar` antes:

```python
bpy.ops.wm.open_mainfile(filepath='cena.blend')
sc = bpy.context.scene; sc.render.resolution_percentage = 10
luzes = [o for o in sc.objects if o.type == 'LIGHT']
for l in luzes: l.hide_render = True
for l in luzes:
    l.hide_render = False
    sc.render.filepath = f'qa/isolado_{l.name}.png'
    bpy.ops.render.render(write_still=True)
    l.hide_render = True
```

### 6.6 Como a IA escreve a crítica

Modelo de crítica que o Claude Code deve produzir a cada volta (vai para `qa/critica_vNN.md`):

```text
Volta 03, plano 2, quadros 46/66/86. Métrica q66: média 0,61 desvio 0,16 estourado 0,0% afundado 0,1%.
1. FUNDO MAIS CLARO QUE O HERÓI (passagem 3). Causa provável: contorno vazando no fundo.
   Correção: isolar luzes a 10%; se confirmar, light linking nos contornos.
2. TEXTO SEM CHANFRO VISÍVEL (passagem 4). Causa: bevel_depth 0,4 mm em letra de 28 mm.
   Correção: bevel_depth 0,6 mm, resolução 3.
Não mexer: lente, tempo, paleta (aprovados na volta 02).
```

Regra: cada item tem **sintoma, passagem da rubrica, causa provável e correção com número**. Itens sem número ("melhorar a luz") são proibidos.

## 7. Blender MCP: o caminho interativo

### 7.1 O que é

MCP (Model Context Protocol) é o protocolo que liga um modelo como o Claude a um programa aberto. Com Blender, um add-on abre um socket local dentro do Blender e um servidor MCP traduz pedidos do Claude em comandos Python executados na cena **ao vivo**, com a interface aberta.

Estado em outubro de 2026:

| Projeto | Quem mantém | Requisito | Ferramentas principais | Licença |
|---|---|---|---|---|
| **MCP for Blender** (antigo `blender-mcp`, de Siddharth Ahuja) | Comunidade | Blender 3.0+ | Inspeção de cena, criar/editar objetos, materiais, `execute_blender_code`, captura de tela, Poly Haven, Sketchfab, Poly Pizza, geração 3D por Hyper3D Rodin e Hunyuan3D | MIT |
| **Blender Lab MCP Server** (oficial) | Blender Lab (desenvolvedores do Blender) | Blender 5.1+ | Análise de cena, resumo de objetos, captura de tela, navegação de viewport, render, execução de código, busca na referência da API Python e no manual | GPL-3.0-or-later |
| **Conector Blender do Claude** | Anthropic + Blender | Claude Desktop | Usa o servidor oficial | n/a |

Fontes: [README do MCP for Blender](https://github.com/ahujasid/blender-mcp/blob/main/README.md); [repositório oficial no projects.blender.org](https://projects.blender.org/lab/blender_mcp) (a página recusou acesso automático nesta pesquisa); [relatório do Blender Lab, 1º tri. 2026](https://www.blender.org/development/blender-lab-activity-report-q1-2026/); [9to5Mac sobre os conectores criativos do Claude, 28/04/2026](https://9to5mac.com/2026/04/28/anthropic-releases-9-new-claude-connectors-for-creative-tools-including-blender-and-adobe/); comparação de terceiros em [StraySpark](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026) e [3D-Agent](https://3d-agent.com/blender-mcp).

Dados que só vieram de fonte de terceiros e precisam de conferência **[não verificado]**: versão 1.0.0 do servidor oficial em 27/04/2026, 26 ferramentas, renomeação do projeto comunitário para "MCP for Blender" em 16/09/2026 e "36 ferramentas". Confirmado em fonte primária: o 9to5Mac cita a Anthropic dizendo que os desenvolvedores do Blender criaram um conector MCP, agora oficialmente disponível para o Claude, capaz de analisar e depurar cenas e criar scripts para aplicar mudanças em lote; e o relatório do Blender Lab descreve o servidor MCP com acesso em linguagem natural à API Python e à documentação, testado com modelos de pesos abertos (llama.cpp).

### 7.2 Instalação (MCP for Blender, comunitário)

Conforme o README:

1. Instalar o `uv` (gerenciador de pacotes Python).
2. Registrar o servidor no cliente. No Claude Code: `claude mcp add blender uvx blender-mcp`. No Claude Desktop, em `claude_desktop_config.json`:

```json
{ "mcpServers": { "blender": { "command": "uvx", "args": ["blender-mcp"] } } }
```

3. Instalar o add-on: `uvx blender-mcp install-addon`, depois ligar em Preferências > Add-ons ("Interface: MCP for Blender").
4. No Blender: tecla `N` na viewport, aba MCP, botão de conectar.
5. Telemetria vem **ligada por padrão**; desligue no add-on ou com `DISABLE_TELEMETRY=true`. Os dados podem ser usados para melhoria e treino, segundo o README.
6. Rode só **uma** instância do servidor por vez.

Para o servidor oficial: siga a página de setup em [projects.blender.org/lab/blender_mcp/wiki/Setup](https://projects.blender.org/lab/blender_mcp/wiki/Setup) **[não verificado: página recusou acesso automático]**; requer Blender 5.1 ou mais novo, então o 5.2 do dono atende. No Claude Desktop, o caminho é ativar o conector Blender na lista de conectores **[testar]**.

### 7.3 Quando vale usar MCP

| Situação | MCP? | Por quê |
|---|---|---|
| Explorar 3 ideias de luz num produto novo | Sim | Ver na viewport em segundos é mais rápido que render de prova |
| Ajuste fino de posição de câmera "no olho" | Sim, e copiar os números para o script | O valor final vai para `cena.py` |
| Diagnosticar cena de cliente (`.blend` recebido) | Sim | Análise de cena e resumo de objetos são o ponto forte do servidor oficial |
| Buscar o nome certo de um parâmetro na API | Sim (servidor oficial tem busca na referência) | Evita API ensinada de memória |
| Montar o filme que vai ser entregue | **Não** | Sem reprodutibilidade |
| Render final, lote de formatos | **Não** | Linha de comando é mais estável e registra log |
| Rodar de madrugada sem ninguém olhando | **Não** | Precisa da interface aberta |

Regra: **MCP explora, script entrega.** Ao fim de uma sessão MCP, a IA transcreve tudo que ficou para o `cena.py` (posição de luz, valores de material, câmera) e roda o script do zero para provar que reproduz a imagem. Um truque: peça ao MCP para imprimir `obj.location[:]`, `obj.rotation_euler[:]` e `luz.data.energy` de tudo que foi mexido, e cole esses números no script.

### 7.4 Limites

1. **Reprodutibilidade:** os comandos ficam espalhados no histórico da conversa. Se o Blender travar, a cena some com eles.
2. **Tempo limite:** operações longas (render Cycles, simulação, importação pesada) podem estourar o tempo de resposta do socket. Renderize pela linha de comando **[testar no Blender]** o limite exato de cada servidor.
3. **Contexto:** cada captura de tela e cada listagem de cena consome contexto do modelo. Cena com centenas de objetos enche a conversa rápido. Peça resumos, não listas completas.
4. **Segurança:** os dois projetos executam código Python gerado pelo modelo **sem proteção**. O README do comunitário avisa que `execute_blender_code` pode ser perigoso e manda salvar antes; a documentação oficial (segundo a StraySpark) recomenda máquina virtual. Python no Blender pode apagar arquivos e acessar a rede. Salve antes, trabalhe numa cópia do projeto e nunca conecte o MCP numa máquina com arquivos de cliente sem backup.
5. **Assets por MCP:** baixar do Sketchfab ou gerar por Hyper3D/Hunyuan3D traz licença e qualidade variáveis. Todo asset que entra precisa de linha no `licencas.csv` (seção 8). Modelo gerado por IA raramente tem topologia limpa para chanfro e close de produto.
6. **Poly Pizza** bloqueia IPs de VPN/datacenter (aviso do README): não funciona da nuvem.

## 8. Assets e licenças

### 8.1 Mapa de licenças para filme comercial

| Fonte | Licença | Uso comercial | Crédito obrigatório | Observação | Fonte |
|---|---|---|---|---|---|
| Poly Haven (HDRI, texturas, modelos) | CC0 | Sim | Não | A API tem termos próprios (8.2) | [polyhaven.com/license](https://polyhaven.com/license) |
| ambientCG | CC0 1.0 | Sim | Não (apreciado) | API mantida por uma pessoa: pode ser instável | [docs.ambientcg.com/license](https://docs.ambientcg.com/license/) |
| BlenderKit | Royalty Free ou CC0 (por asset) | Sim | Não | Royalty Free proíbe revender o asset como asset | [blendkit.com/docs/licenses](https://www.blendkit.com/docs/licenses/) |
| Sketchfab | Varia por modelo (família Creative Commons e licenças da loja) | Depende | CC-BY exige crédito | Download por API exige login OAuth do usuário | [Sketchfab Download API](https://sketchfab.com/developers/download-api) |
| Fab (Quixel Megascans e outros) | Fab Standard License ou CC-BY 4.0 | Sim | Standard: não; CC-BY: sim | Megascans deixou de ser grátis em 2025 (US$ 0,99 por asset no anúncio) | [Fab EULA](https://www.fab.com/eula?lang=en), [CG Channel](https://www.cgchannel.com/2024/10/epic-games-has-made-megascans-free-to-all-but-only-until-the-end-of-2024/) |
| Freesound | CC0, CC-BY ou CC-BY-NC | CC0 e CC-BY sim; **NC não** | CC-BY sim | Filtre por licença antes de baixar | [Freesound FAQ](https://freesound.org/help/faq/) |
| Google Fonts | OFL (maioria) ou Apache 2.0 | Sim (vídeo, logo) | Não para uso em vídeo | Não pode vender a fonte sozinha | [Google Fonts](https://fonts.google.com/) **[conferir a licença de cada família na página dela]** |
| Música comercial (streaming, rádio) | Direitos reservados | **Não** sem licença | n/a | Precisa licença de biblioteca ou trilha original | n/a |

Regra do estúdio: **CC0 primeiro; CC-BY só com crédito combinado com o cliente; NC e "Editorial" nunca em peça paga.** Cada asset de terceiros vira uma linha em `licencas.csv`:

```csv
asset,fonte,url,licenca,credito_exigido,usado_em
brown_photostudio_02,Poly Haven,https://polyhaven.com/a/brown_photostudio_02,CC0,nao,p1-p4 reflexo
```

### 8.2 Poly Haven: API e termos

Endpoints ([repositório da API pública](https://github.com/Poly-Haven/Public-API)): `/types`, `/assets?t=hdris|textures|models&c=categoria`, `/info/{id}`, `/files/{id}`, `/categories/{tipo}`. A estrutura de `/files/{id}` foi lida nesta pesquisa:

- HDRI (`/files/brown_photostudio_02`): chaves `hdri`, `tonemapped`, `colorchart`, `backplates`; `hdri` → `1k`, `2k`, `4k`, `8k`, `16k` → `hdr` / `exr` → `url`, `size`. Ex.: `https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/brown_photostudio_02_1k.exr`.
- Textura (`/files/rusty_metal_02`): chaves `Diffuse`, `nor_dx`, `nor_gl`, `Rough`, `arm`, `AO`, `Displacement`, `spec`, `blend`, `gltf`, `mtlx`; cada mapa → resolução (`1k` a `8k`) → `jpg`/`png`/`exr` → `url`, `size`, `md5`.

**Termos de uso da API** ([ToS](https://github.com/Poly-Haven/Public-API/blob/master/ToS.md)):

1. Livre para qualquer uso, inclusive comercial, sem custo.
2. **Toda chamada precisa de `User-Agent` ou `Referer` único com o nome do seu software.** Sem isso, você está fora dos termos.
3. Se a sua ferramenta mostra conteúdo da API ao usuário, ela precisa deixar claro de onde vem ("Powered by Poly Haven", segundo o README).
4. Financiamento por empresas que dependem da API é **opcional**.
5. Proibido sobrecarregar a API. Regra do estúdio: cache local, nunca baixar o mesmo arquivo duas vezes.

Isso importa: se a ferramenta 3D for distribuída e buscar HDRI do Poly Haven ao vivo, ela precisa do User-Agent próprio e do crédito visível. O asset em si continua CC0 no filme.

### 8.3 Código: baixar e montar HDRI e textura

Arquivo completo: `/home/claude/codigo/pipeline/assets_polyhaven.py`. **Montagem confirmada por sonda no bpy 5.2.2 com arquivo local; download a testar**: a rede da nuvem desta pesquisa bloqueia `api.polyhaven.com` (`Tunnel connection failed: 403`).

```python
API = "https://api.polyhaven.com"
UA = {"User-Agent": "EditOS-Estudio3D/1.0 (pipeline Blender)"}

def baixar_hdri(asset_id, res="2k", fmt="exr"):
    arq = _get_json(f"{API}/files/{asset_id}")
    url = arq["hdri"][res][fmt]["url"]
    return _baixar(url, os.path.join(CACHE, "hdri", os.path.basename(url)))
```

A montagem do mundo usa **Light Path > Is Camera Ray** para a câmera ver uma cor sólida escura enquanto reflexos e iluminação usam o HDRI:

```python
lp = nt.nodes.new("ShaderNodeLightPath")
solido = nt.nodes.new("ShaderNodeBackground")
solido.inputs["Color"].default_value = (0.02, 0.02, 0.025, 1)
mix = nt.nodes.new("ShaderNodeMixShader")
nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs["Fac"])
nt.links.new(bg_hdri.outputs["Background"], mix.inputs[1])
nt.links.new(solido.outputs["Background"], mix.inputs[2])
```

Por quê: HDRI de estúdio aparecendo atrás do produto é o "fundo padrão" (problema 4). O HDRI serve para reflexo e luz ambiente; o fundo do filme é desenhado. Sinal de erro: dá pra reconhecer o estúdio fotográfico do Poly Haven no fundo. Na sonda, `World.visibility` **não existe** no 5.2.2 (só `world.cycles_visibility.camera`, que vale só no Cycles); a solução por Light Path vale para EEVEE e Cycles **[testar no Blender]** o resultado visual no EEVEE.

Na textura, mapas de aspereza e normal recebem `colorspace_settings.name = "Non-Color"`; a normal entra por `ShaderNodeNormalMap`. Use `nor_gl` (convenção OpenGL, a do Blender), nunca `nor_dx`.

### 8.4 ambientCG

API v3 ([documentação](https://docs.ambientcg.com/api/v3/assets/)): `https://ambientcg.com/api/v3/assets` com parâmetros `q`, `type` (`material`, `hdri`, `3d-model`, `decal`...), `technique`, `id`, `sort`, `limit` (1 a 500), `offset`, `include` (campos como downloads e previews). Os parâmetros são os mesmos da busca do site. Aviso do próprio ambientCG: a API é operada por uma pessoa e não tem garantia de estabilidade. Use cache local e baixe os ZIPs uma vez **[testar no Blender]** o formato exato de `include` para links de download.

### 8.5 Sketchfab, BlenderKit e Fab

- **Sketchfab:** a Download API dá glTF, GLB e USDZ (não FBX/OBJ de origem), exige login OAuth do usuário final e restringe cache e redistribuição. Cada modelo tem licença própria: leia no modelo, não na busca. Use quando precisar de um objeto de cena secundário com CC-BY ou CC0.
- **BlenderKit:** funciona por add-on dentro do Blender. Licenças: Royalty Free (uso comercial sem crédito, sem revender o asset) e CC0. Bom para materiais rápidos de prova.
- **Fab:** Megascans em qualidade de cinema; Fab Standard License permite uso em qualquer ferramenta compatível, inclusive Blender, em projeto comercial, sem crédito; proíbe revender ou redistribuir o asset solto.

## 9. O que não se faz por script (e pede humano ou outro caminho)

| Tarefa | Por que o script não resolve | Caminho |
|---|---|---|
| Escultura orgânica fina (rosto, mascote com expressão, comida realista) | Depende de milhares de decisões de pincel | Artista de escultura, asset licenciado ou fotogrametria |
| Modelo de produto com superfícies complexas (frasco de perfume, tênis) | Sem CAD, a malha por primitivas fica "de brinquedo" | Pedir ao cliente o arquivo CAD/STEP ou glTF de fábrica; modelador humano |
| Simulação fina de fluido (bebida derramando, creme) | Exige dezenas de tentativas com simulação lenta | Reservar 2 a 3 dias de tentativa e erro na máquina local, ou trocar por solução estilizada |
| Tecido em close com caimento natural | Idem; o 5.2 trouxe física por nós (XPBD), ainda nova | Testar na RTX com tempo reservado **[testar no Blender]** |
| Julgamento estético final | A IA mede e critica, mas o gosto do cliente e do diretor decide | o dono aprova a folha de contato antes do render final |
| Licenciamento de música | Contrato, não código | Biblioteca licenciada ou trilha original; nunca música de streaming |
| Logo do cliente sem vetor | Vetorizar à mão um logo raster é trabalho de design | Pedir SVG/AI/PDF ao cliente |
| Interface real do app | A tela precisa ser o app dele, não inventada | Pedir capturas em alta ou arquivo do Figma; nunca inventar UI de marca real |
| Voz e locução | Fora do Blender | Locutor ou voz sintética com direito de uso |

## 10. Pegadinhas conhecidas do Blender 5.x

| # | Pegadinha | Erro ou sintoma | Correção | Status |
|---|---|---|---|---|
| 1 | `action.fcurves` removido | `AttributeError` | `anim_utils.action_get_channelbag_for_slot(act, slot).fcurves` | confirmado por sonda |
| 2 | Atribuir slot antes da ação | slot não aceito | `animation_data.action = a` e depois `action_slot = s` | ordem confirmada por sonda |
| 3 | Entrada de GN com `mod["Socket_2"] = x` | `TypeError: id properties not supported` | `getattr(mod.properties.inputs, sid).value = x` (5.2) | confirmado por sonda |
| 4 | Identificador de socket pela ordem visual | valor no socket errado | buscar `identifier` pelo `name` em `ng.interface.items_tree` | confirmado por sonda |
| 5 | `scene.node_tree` | não existe | `scene.compositing_node_group` | confirmado por sonda |
| 6 | Nó `CompositorNodeComposite` | "Node type undefined" | `NodeGroupOutput` + socket `Image` na interface | confirmado por sonda |
| 7 | `CompositorNodeMixRGB`, `FilmGrain`, `Vignette` | "undefined" | `ShaderNodeMix`; vinheta com `EllipseMask` + `Blur` | confirmado por sonda |
| 8 | Tipo do Glare como propriedade | sem efeito ou erro | `glare.inputs['Type'].default_value = 'Bloom'` | confirmado por sonda |
| 9 | `file_format = 'FFMPEG'` direto | enum não encontrado | `media_type = 'VIDEO'` | confirmado por sonda |
| 10 | `BLENDER_EEVEE_NEXT` | enum inválido | `BLENDER_EEVEE` | confirmado por sonda |
| 11 | fps padrão | filme a 24 fps sem querer | `render.fps = 30` sempre | confirmado por sonda |
| 12 | Gestão de cor Standard | imagem lavada | AgX + look; nomes exatos `AgX - Punchy` etc. | confirmado por sonda e Laboratório |
| 13 | `Material.use_nodes`, `World.use_nodes`, `Scene.use_nodes` | `DeprecationWarning` (remoção no 6.0) | não chamar; material novo já nasce com `node_tree` | confirmado por sonda |
| 14 | Nome com `.001` | código acha o objeto errado | conferir `obj.name` depois de criar | confirmado por sonda (`Fundo.001`) |
| 15 | Booleano `FAST` | enum inválido | `FLOAT`, `EXACT` ou `MANIFOLD` | confirmado por sonda |
| 16 | `sequence_editor.sequences` | não existe | `sequence_editor.strips` | confirmado por sonda |
| 17 | Pillow no Python do Blender | `ModuleNotFoundError: PIL` | rodar QA no Python do sistema | confirmado no venv da nuvem |
| 18 | `mesh.use_auto_smooth` | não existe | `bpy.ops.object.shade_auto_smooth()` ou modificador | confirmado por sonda |
| 19 | `World.visibility` | `AttributeError` | Light Path > Is Camera Ray no mundo | confirmado por sonda |
| 20 | SVG importado minúsculo | logo de 2 cm | escalar após importar (1 unidade SVG ≈ 0,282 mm) | confirmado por sonda |
| 21 | `wm.svg_import` | operador não existe | `import_curve.svg` ou `wm.grease_pencil_import_svg` | confirmado por sonda |
| 22 | Draco/MeshOptimizer no `bpy` do PyPI | `ERROR Draco is not available` | usar Blender completo para GLB comprimido | confirmado por sonda |
| 23 | Emissão de tela acima de ~1,3 no AgX | tela desbota | Use 1,0 (ver 00 · Padrões da casa) | Laboratório |
| 24 | `shape_key_add` cria chave com valor 1 | forma já aplicada no quadro 1 | zerar `value` logo após criar | Laboratório |
| 25 | Ler direção do sol sem atualizar | vetor velho | `view_layer.update()` antes | Laboratório |
| 26 | Contorno vazando no fundo próximo | fundo mais claro que o herói | light linking (`receiver_collection`) ou bandeira | confirmado por sonda |
| 27 | Python 3.13 no 5.1+ | add-on com binário compilado quebra | só afeta `.so/.pyd`; scripts puros seguem | [StraySpark](https://www.strayspark.studio/blog/blender-5-1-addon-compatibility-python-313-guide) **[não verificado]** |
| 28 | Easing na chave errada | easing posto na chave final não faz nada no trecho | easing vai na chave inicial do trecho | confirmado por sonda |
| 29 | Prova EEVEE na nuvem | 10 a 50 s por quadro (GL por software) | prova 25%, 4 a 6 quadros por volta | medido |
| 30 | `--factory-startup` + FFmpeg | formato some (relato 5.0) | sequência PNG e montagem depois | [issue #152175](https://projects.blender.org/blender/blender/issues/152175) **[não verificado no 5.2]** |
| 31 | Gradiente por coordenada gerada em plano girado | eixo constante, gradiente some | escolher o eixo em que o objeto tem extensão (Z para plano em XZ) | confirmado na volta 2 |
| 32 | Valor de luz com `Light.use_temperature` | atributo não aparece em `bpy.types.Light` genérico | é propriedade do dado de luz criado (`AreaLight` etc.); funciona em `bpy.data.lights.new(...)` | confirmado por sonda |

Fontes gerais das mudanças: [notas 5.0 Python API](https://developer.blender.org/docs/release_notes/5.0/python_api/), [notas 5.1 Python API](https://developer.blender.org/docs/release_notes/5.1/python_api/), [notas 5.2 Python API](https://developer.blender.org/docs/release_notes/5.2/python_api/), [notas 5.0 compositor](https://developer.blender.org/docs/release_notes/5.0/compositor/). Essas páginas recusaram acesso automático nesta pesquisa (redirecionamento em loop); os itens acima foram conferidos por sonda ou por fonte secundária citada na linha.

Novidades do 5.2 que afetam o pipeline (segundo a [página oficial do 5.2](https://www.blender.org/download/releases/5-2/), lançado em 14/07/2026, suporte até julho de 2028): física por nós com solver XPBD (tecido e cabelo), nó "Sample Sound Frequencies" (animação reativa a áudio direto em Geometry Nodes, ótimo para sincronizar com a trilha sem keyframe), nó "Mesh Bevel" (chanfro procedural), bibliotecas de assets online (materiais, efeitos de compositor, mundos HDR e setups de GN baixados sob demanda), cache de texturas e modo Thin Wall no Principled BSDF. Segundo a [Simstim](https://simstim.org/journal/blender-news): `bpy.data.all_ids`, `gpu.init()` em modo background e opções novas em `bpy.data.file_path_foreach` **[não verificado por sonda]**.

## Fontes

- Blender 5.2 LTS, página oficial: https://www.blender.org/download/releases/5-2/
- Notas de versão 5.0 (Python API): https://developer.blender.org/docs/release_notes/5.0/python_api/ (não abriu nesta pesquisa)
- Notas 5.1 e 5.2 (Python API): https://developer.blender.org/docs/release_notes/5.1/python_api/ , https://developer.blender.org/docs/release_notes/5.2/python_api/ (não abriram)
- Slotted Actions (4.4): https://developer.blender.org/docs/release_notes/4.4/upgrading/slotted_actions/ (não abriu)
- Compositor 5.0: https://developer.blender.org/docs/release_notes/5.0/compositor/ (não abriu)
- Remoção de `scene.node_tree`: https://github.com/ynput/ayon-blender/issues/201
- `media_type` e FFMPEG: https://github.com/ynput/ayon-blender/pull/365
- Quebras de API vistas por LLMs: https://dev.to/rustam335/ask-ten-llms-for-a-blender-50-script-then-run-it-in-blender-50-1pe3
- Resumo de API 5.2 para TDs: https://simstim.org/journal/blender-news
- Python 3.13 no 5.1: https://www.strayspark.studio/blog/blender-5-1-addon-compatibility-python-313-guide
- Manual 5.2, linha de comando: https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html
- NodeToPython: https://github.com/BrendanParmer/NodeToPython
- MCP for Blender (comunitário, MIT): https://github.com/ahujasid/blender-mcp
- Blender Lab MCP (oficial, GPL-3.0-or-later): https://projects.blender.org/lab/blender_mcp
- Relatório Blender Lab 1º tri. 2026: https://www.blender.org/development/blender-lab-activity-report-q1-2026/
- Conectores criativos do Claude: https://9to5mac.com/2026/04/28/anthropic-releases-9-new-claude-connectors-for-creative-tools-including-blender-and-adobe/
- Comparação de MCPs (terceiros): https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026 , https://3d-agent.com/blender-mcp
- Poly Haven, licença dos assets (CC0): https://polyhaven.com/license
- Poly Haven, API e termos: https://github.com/Poly-Haven/Public-API , https://github.com/Poly-Haven/Public-API/blob/master/ToS.md
- ambientCG, licença (CC0) e API: https://docs.ambientcg.com/license/ , https://docs.ambientcg.com/api/v3/assets/
- Sketchfab Download API: https://sketchfab.com/developers/download-api
- BlenderKit, licenças (Royalty Free e CC0): https://www.blendkit.com/docs/licenses/
- Fab Standard License: https://www.fab.com/eula?lang=en ; preços Megascans: https://www.cgchannel.com/2024/10/epic-games-has-made-megascans-free-to-all-but-only-until-the-end-of-2024/
- Freesound, licenças (CC0, CC-BY, CC-BY-NC): https://freesound.org/help/faq/
- FFmpeg e `--factory-startup` (5.0): https://projects.blender.org/blender/blender/issues/152175

## Pendências para o Claude Code

Receitas **[testar no Blender]** na máquina de referência (Blender 5.2 completo, RTX 3050):

1. Rodar `blender -b -P /caminho/cena_exemplo.py -- --pct 50` e comparar tempos com a tabela 3.4; conferir se a ordem `-s -e` antes de `-a` é obrigatória no 5.2.
2. Repetir o isolamento de luzes da seção 6.4 com GPU e no Cycles: a luz de área apontada para o lado oposto ilumina a parede 13 cm atrás? Se sim, é comportamento do EEVEE ou do spread; documentar.
3. Testar `assets_polyhaven.py -- --hdri brown_photostudio_02 --res 2k` e `--textura rusty_metal_02` com rede liberada; conferir o cache e o User-Agent.
4. Testar ambientCG v3 com `include` para pegar o link do ZIP.
5. Importar um GLB com compressão Draco no Blender completo; conferir se o importador glTF deixa os objetos novos selecionados.
6. Importar um logo real em SVG com furos (letras O, A, B) e conferir preenchimento.
7. Driver com função Python própria em `blender -b` com e sem "Auto Run Python Scripts".
8. FFmpeg com `--factory-startup` no 5.2.
9. `font_bold`/`body_format` para palavra em negrito dentro de um texto 3D.
10. Instalar o servidor oficial do Blender Lab e listar as ferramentas expostas, o tempo limite e se a busca na referência da API cobre o 5.2.
11. Montar MP4 a partir da sequência PNG pelo Video Sequencer por script (`sequence_editor.strips.new_image`) **[nome do método não verificado; sondar antes de usar]**.
12. Volta 5 da cena de exemplo: subir contraste para 0,20+, trocar quadros-chave para 12, 66, 113, 165, tirar a faixa de coat da tela.

PENDÊNCIAS YOUTUBE: as listas de vídeos por canal estão no capítulo 11 (`/home/claude/base/11-referencias.md`, seção "PENDÊNCIAS YOUTUBE").
