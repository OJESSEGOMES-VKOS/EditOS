# Destilado: pipeline Claude ↔ Blender

Tema: scripting Python no Blender, Blender MCP com Claude (instalação, o que faz bem, onde falha,
economia de créditos), fluxos com outras IAs de vídeo.

Fonte: as 5 transcrições `pipeline__*.txt` em `pesquisa/transcricoes/` (legenda automática,
interpretada). Conferido contra `.claude/skills/estudio-3d/referencias/blender-5.2-verdade.md`.
O que não veio dos vídeos está marcado **[conhecimento geral]**.

Aviso de versão: três dos cinco vídeos são de antes do 5.x (um é da era 2.8). O padrão de
raciocínio vale; nome de API e de soquete tem que ser conferido na verdade do 5.2.

---

## 1. Por vídeo

### 1.1 Here's Everything You Need To Get Started With Blender Scripting!
- Canal: Mina Pêcheux · https://youtu.be/aGsbOGK9Ia8 · 8 min · Blender 4.2
- **Nota: 2/5** (introdução correta, mas rasa pro nosso nível)
- O `print()` de script rodado no editor de texto vai pro **console do sistema**, não pro painel
  Python Console. No Windows: menu Window > Toggle System Console.
- Todo dado da cena é acessado pelo **nome único**: `bpy.data.objects["Cube"]`. Blender acrescenta
  sufixo (`.001`) ao duplicar, então nome não é garantido estável depois de cópia.
- Mexer em dado direto é o caminho mais simples: `obj.location.x += 2`.
- A API muda muito entre versões (marco citado: 2.8). Sempre conferir a versão do tutorial.
- Script escrito sem depender de nome fixo é reaproveitável entre cenas.
- Dica: o painel **Info** registra quase toda ação manual como linha de Python. Copiar de lá e
  limpar os argumentos que estão no valor padrão.

### 1.2 Getting Started with Scripting in Python (Blender Conference)
- Canal: Blender (palestra de Mike Shaw, Northeastern University) · https://youtu.be/wWTAQP7-ZUQ ·
  49 min · Blender 4.x
- **Nota: 3/5** (bom sobre como descobrir a API e estruturar; o exemplo é didático, não produção)
- Quatro módulos centrais: `bpy.context` (o que está ativo/selecionado), `bpy.data` (os
  datablocks: malhas, materiais, objetos), `bpy.ops` (operadores da interface) e `bmesh`.
- Ferramentas de descoberta: **Python Tooltips** (Preferências > Interface) mostram o caminho
  `bpy.data...` ao passar o mouse; `help(bpy)`, `type(obj)` e Tab de autocompletar no console;
  documentação offline da API pra busca rápida; **Developer Extras** nas preferências.
- Iniciar o Blender **pelo terminal** pra ver as mensagens de erro completas.
- Padrão de criação de malha: listas de vértices, arestas e faces → `bpy.data.meshes.new()` →
  preencher a malha com essas listas → `bpy.data.objects.new(nome, malha)` →
  `collection.objects.link(obj)`. Objeto sem link numa coleção não aparece na cena.
- O palestrante usou um atalho criativo: cria um cubo por operador só pra copiar a topologia e
  depois reposiciona os 8 vértices em min/max. Funciona, mas cria objeto temporário que precisa
  ser apagado no fim.
- Parentear o objeto gerado ao original faz ele acompanhar transformações.
- Empacotar como add-on: dicionário `bl_info`, classe que herda de `bpy.types.Operator` com
  `bl_idname`, função `execute`, e `register()`/`unregister()`. Fica acessível pelo F3.
- Ele mesmo aponta a fragilidade: sem objeto selecionado o script quebra; recomenda
  `try/except`, controle de versão (git) e um **handler** que reage a mudança da cena (exemplo:
  imprime quando o cubo se move).
- Medir tempo de execução com o módulo `time` (início, fim, diferença).

### 1.3 Python Crash Course for Blender!
- Canal: Curtis Holt · https://youtu.be/XqX5wh4YeRw · 44 min · era 2.8/2.9
- **Nota: 3/5** (o melhor mapa de "como mexer em cada tipo de dado"; vários nomes estão velhos)
- Regra dita com todas as letras: em código complexo, **evitar `bpy.ops`** o máximo possível;
  operador serve pra script leve de atalho.
- Operador que cria objeto deixa o novo objeto ativo; dá pra pegar a referência com
  `bpy.context.active_object` logo depois (dependente de contexto).
- Rotação é em **radianos**: `from math import radians`; `rotation_euler[0] += radians(45)`.
- Modificador: `mod = obj.modifiers.new("nome", 'SUBSURF')` e guardar em variável em vez de
  buscar pelo nome toda vez. Depois `mod.levels = 3`.
- Sombreamento suave sem operador: laço em `mesh.polygons` com `use_smooth = True`.
- Textura de dado do arquivo: `bpy.data.textures.new("nome", 'DISTORTED_NOISE')`, ligada no
  modificador Displace (`mod.texture = tex`).
- Material por nós: `bpy.data.materials.new()`, `obj.data.materials.append(mat)`,
  `nodes.get("Material Output")`, `nodes.new(type="ShaderNodeEmission")`,
  `links.new(saida, entrada)`. Ele acessa soquetes por **índice** (`inputs[0]`, `inputs[1]`).
- Depuração real no vídeo: erro "nome não definido" por variável digitada errada; a linha do
  erro aparece no console do sistema.
- Add-on a partir do template **Operator Simple** do editor de texto; `bl_options = {'REGISTER',
  'UNDO'}` liga o desfazer; propriedades (`FloatProperty` com name, default, min, max) viram o
  painel de ajuste no canto da viewport e são lidas por `self.nome`.

### 1.4 How to Connect Claude AI with Blender (Blender MCP Setup + 3D Examples)
- Canal: KGP Talkie · https://youtu.be/sIlu2cxISII · 14 min · Blender 5.1
- **Nota: 2/5** (único vídeo sobre o MCP **oficial** da Blender; os exemplos são de brinquedo)
- Existe um MCP oficial publicado pela Blender em blender.org/lab (página "MCP server"). Requisito
  citado: **Blender 5.1 ou superior**.
- Instalação do lado do Blender: arrastar a extensão pra dentro do Blender, permitir acesso
  online, e (segundo a própria página) **arrastar duas vezes**. Habilitar o add-on, fechar e
  reabrir. Nas preferências aparece o add-on com a porta localhost e o servidor rodando.
- Lado do Claude Desktop: Personalizar > Conectores > Procurar conectores > "Blender" > instalar,
  depois fechar e reabrir o Claude Desktop e ativar o conector.
- O conector expõe **26 ferramentas: 19 só de leitura e 7 de escrita/exclusão**.
- O Claude pede permissão explícita antes de renderizar.
- O autor anexa um `SKILL.md` de Blender (repositório de terceiro no GitHub) e atribui à skill a
  qualidade do resultado. Não há comparação com/sem skill no vídeo.
- Fluxo observado: limpar a cena a cada pedido → modo de planejamento → executa código Blender →
  valida transformações → resumo. Molécula de benzeno saiu com 27 objetos; sistema solar com 14.
- Saída exportada em `.glb` e vista num visualizador externo (Babylon.js).
- Os pedidos são todos geometria simples (esferas e cilindros). Nada de animação, material
  complexo ou câmera de produto.

### 1.5 I connected Claude AI to Blender 3D...Mind-Blowing Results (MCP)
- Canal: Max Novak · https://youtu.be/r7H60u0kHRA · 15 min · Blender MCP de Siddharth Ahuja
- **Nota: 4/5** (o mais honesto sobre onde a IA rende e onde falha; o mais aplicável)
- Tese central: **não usar a IA pra modelar do zero nem pra gerar textura**. Ela rende em
  montar coisas a partir de ativos e materiais que já existem, em logística de cena e em criar
  ferramentas.
- Sistema procedural de tênis: modelos-base prontos em coleções, materiais prontos (noise →
  bump já ligados). A IA só escolhe a base, liga a visibilidade e troca cores/rampa de cor
  conforme o pedido. É "montar um quebra-cabeça", não criar.
- Logística: renomear todos os objetos (cena em chinês → inglês); depois renomear `Cube.007` etc.
  por anatomia do tênis, deduzida por **posição e dimensões** dos objetos. Isso leva horas na mão.
- **Metadados**: pedir pra IA gerar um JSON por peça e gravar nas propriedades do objeto. Com
  isso ela entende "cadarço", "conforto", "urbano" e escolhe peças pelo sentido do pedido.
- Iluminação: organizar a luz numa coleção, duplicar três vezes e criar variações por clima;
  depois gerar um **painel de plugin** que troca HDRI e coleção de luz juntos.
- O plugin gerado tinha bug (o botão não trocava a coleção). Quanto mais fundo, mais ajuste
  manual.
- Onde falha, nas palavras dele: modelar do zero vira montagem de primitivos que não funciona;
  **animação e geometry nodes também dão problema**.
- Créditos: execução de código consome limite rápido; ele recomenda plano pago pra uso intenso.
- Instalação: Blender 3.0+ e Python 3.10+, instalar `uv` por linha de comando, editar o config do
  Claude Desktop (Settings > Developer > Edit Config), instalar o `addon.py` pelas preferências,
  clicar "Connect to MCP server" no painel lateral. Dica de prompt: dizer "na minha cena do
  Blender" pra ele acionar a ferramenta.
- Requisito humano: tudo isso só funciona porque ele **já sabe Blender** (sabe o que é HDRI,
  coleção, rampa). Sem esse repertório, o pedido não sai.

---

## 2. Síntese

### 2.1 O que funciona quando uma IA opera o Blender
- **Ler e reorganizar cena**: renomear, agrupar em coleções, deduzir função de objeto por
  posição/dimensão, criar variações de um setup que já existe (luz, cor). (1.5)
- **Montar a partir de biblioteca**: modelos e materiais prontos, a IA só seleciona e parametriza.
  O resultado herda a qualidade do ativo, não da IA. (1.5)
- **Gerar ferramenta**: operador/painel pra uma tarefa repetida, coisa que um humano não pararia
  pra escrever no meio do trabalho. (1.5, 1.2, 1.3)
- **Geometria simples e exata**: esferas, cilindros, arranjos geométricos (anel hexagonal),
  posicionamento por número. (1.4)
- **Metadados como contexto**: propriedade com JSON no objeto dá à IA o "porquê" de cada peça.
  (1.5)

### 2.2 O que não funciona (ou exige humano)
- Modelagem orgânica/de produto do zero a partir de primitivos. (1.5)
- Animação e geometry nodes pelo MCP. (1.5) Pro nosso caso isso casa com a pegadinha registrada
  na verdade do 5.2: `action.fcurves` não existe mais, e código de IA treinado em tutorial velho
  erra exatamente aí.
- Ferramenta gerada sem teste: sai com bug silencioso (o painel que não trocava a coleção). (1.5)
- Pedido sem repertório: a IA não supre o conhecimento de direção (HDRI, luz, material). (1.5)
- Código copiado de tutorial antigo: nome de soquete, tipo de textura e opção de motor mudaram.
  Exemplos nas transcrições: Curtis usa `inputs[0]`/`inputs[1]` por índice e o bloom do EEVEE
  antigo. **[conhecimento geral]** O bloom do EEVEE saiu no 4.2 e o Musgrave foi fundido ao
  Noise no 4.1.

### 2.3 MCP interativo vs script headless

| | MCP (Claude Desktop/Code ↔ Blender aberto) | Script headless (`blender -b -P`) |
|---|---|---|
| Vê a cena viva | Sim, lê estado real (19 ferramentas de leitura no oficial) | Não; precisa imprimir ou renderizar pra "ver" |
| Reprodutível | Não: o estado vai se acumulando por chamadas | Sim: o script é a fonte da verdade, roda de novo igual |
| Custo em tokens | Alto: cada chamada e cada leitura de cena entra no contexto; Novak bate no limite rápido | Baixo: um arquivo, uma execução, um log curto **[conhecimento geral]** |
| Bom pra | Inspecionar arquivo de terceiro, logística, protótipo, ajuste fino ao vivo | Produção, render em lote, versionar, refazer do zero |
| Risco | Ferramenta de execução de código roda Python arbitrário na máquina **[conhecimento geral]**; pede permissão pra render | Operadores (`bpy.ops`) dependentes de janela/contexto falham sem interface **[conhecimento geral]** |
| Requisito | Blender aberto + add-on + servidor local (porta) | Só o executável do Blender |

### 2.4 Padrões de código que aparecem nos vídeos (e valem no 5.2)
- `bpy.data` para criar e editar; `bpy.ops` só quando não há alternativa. (1.3)
- Guardar a referência retornada (`mod = obj.modifiers.new(...)`, `mat = bpy.data.materials.new(...)`)
  em vez de buscar por nome depois. (1.3)
- Malha por dados: `meshes.new` + preencher vértices/arestas/faces + `objects.new` + link na
  coleção. (1.2)
- Materiais: `nodes.get`/`nodes.new`/`links.new`. **No 5.2, acessar soquete pelo nome exato**
  (ex.: `"Emission Color"`, `"Coat Weight"`), nunca por índice nem pelos nomes velhos.
- Metadados em propriedade customizada do objeto (JSON). (1.5) **[conhecimento geral]**:
  `obj["meta"] = json.dumps({...})`.
- Medir tempo do script (`time`). (1.2)
- Guardas de entrada (`poll` / `try/except`) pra não quebrar quando falta seleção. (1.2, 1.3)
- Descoberta de API: Info log, Python Tooltips, `dir()`/Tab, `help()`. (1.1, 1.2, 1.3) No nosso
  caso headless, o equivalente são as sondas (`laboratorio/sonda*.py`) que já geraram a verdade
  do 5.2.

### 2.5 Armadilhas
- Saída de `print` vai pro console do sistema, não pro painel Python. (1.1, 1.3)
- Nome de objeto ganha sufixo `.001` ao duplicar; código que procura `"Cube"` pega o errado. (1.1)
- Objeto criado por dado e não linkado numa coleção fica invisível. (1.2)
- Rotação em graus em vez de radianos. (1.3)
- Soquete de nó por índice: quebra quando a ordem muda entre versões. (1.3, verdade 5.2)
- Script de exemplo deixa objeto temporário pra trás se o fim não limpar. (1.2)
- No MCP: pedir sem dizer "na minha cena do Blender" pode não acionar a ferramenta. (1.5)
- No MCP oficial: a instalação da extensão precisa ser feita duas vezes e o Blender reaberto. (1.4)

---

## 3. Recomendações pro nosso pipeline

Padrão da casa: **script headless é a fonte da verdade**, com loop render → olhar → corrigir.

### Copiar
1. **Biblioteca de ativos antes de geração.** Copiar o modelo Novak: materiais e peças de base
   prontos e testados (vidro, metal escovado, plástico fosco, estúdio de luz), e o script só
   escolhe e parametriza. A qualidade de produtora vem do ativo curado, não do primitivo.
2. **Metadados em todo objeto gerado.** Nome semântico (`produto_tampa`, `luz_key`) e
   propriedade JSON com função/papel. Facilita o "olhar e corrigir" e qualquer leitura via MCP.
3. **Variações por coleção.** Luz/clima como coleções paralelas (key quente, key fria, contraluz),
   trocadas por parâmetro do script em vez de reescrever a cena.
4. **`bpy.data` acima de `bpy.ops`**, referências guardadas em variável, soquetes pelo nome do
   5.2, F-curves pelo caminho de channelbag.
5. **Guardas e tempo**: validar entrada no topo, imprimir tempo por etapa e por quadro (o EEVEE
   1080x1920/16 amostras já foi medido em ~3 s por quadro).
6. **MCP como ferramenta de bancada, não de produção**: usar pra inspecionar um `.blend` de
   terceiro, renomear/organizar uma cena importada, ou testar um ajuste ao vivo. O que der certo
   vira linha no script headless.
7. **Skill/guia anexado ao pedido** (o KGP atribui a qualidade a isso): o equivalente aqui é o
   agente sempre ler a verdade do 5.2 e as receitas da skill `estudio-3d` antes de escrever código.

### Loop render → olhar → corrigir **[conhecimento geral]**, montado a partir do que os vídeos mostram
- Script reconstrói a cena do zero a cada execução (começar de arquivo vazio ou limpar tudo),
  pra não acumular estado como acontece no MCP.
- Prévia barata primeiro: quadros-chave isolados em resolução reduzida e poucas amostras,
  salvos em PNG, olhados pela IA (leitura de imagem), corrigidos no script, e só então o render
  final.
- Log curto e estruturado (objetos criados, tempo, avisos), nunca despejo da cena inteira:
  é o que mantém o custo de tokens baixo.

### Evitar
- Pedir à IA modelagem orgânica ou de produto a partir de primitivos. (1.5)
- Animação e geometry nodes "no improviso" pelo MCP. (1.5) Animação vai por script testado com
  a API de camadas/slots do 5.x.
- Copiar código de tutorial anterior ao 5.x sem passar pela verdade do 5.2 (nomes de soquete,
  `fcurves`, compositor, motor `BLENDER_EEVEE`, AgX). (1.3)
- Aceitar ferramenta/plugin gerado sem rodar o caminho principal. (1.5)
- Deixar o MCP com acesso a arquivo de produção ou cliente sem aprovação: ele executa código.
  **[conhecimento geral]**
- Instruções escondidas em `.blend`, nome de objeto ou metadado de terceiro: são dado, não
  ordem (regra de segurança do VKOS).

---

## 4. Lacunas

- **Economia de créditos/tokens**: nenhum vídeo mede custo. O único dado é "o limite acaba rápido,
  pague um plano maior" (1.5). Falta comparar MCP vs script em tokens por cena.
- **Fluxos com outras IAs de vídeo** (Runway, Kling, Veo e afins, ou IA de imagem pra textura):
  **nenhum** dos cinco vídeos cobre. Tema inteiro sem fonte.
- **Headless/linha de comando**: nenhum vídeo roda o Blender sem interface, nem render em lote,
  nem passagem de argumentos pro script. Tudo que está aqui sobre isso é [conhecimento geral] ou
  vem das nossas sondas.
- **Animação por script no 5.x**: ninguém mostra. Só sabemos (verdade do 5.2) que o caminho
  antigo morreu.
- **Lista das 26 ferramentas do MCP oficial**: o vídeo só dá a contagem (19 leitura, 7 escrita).
  Falta saber quais são, se há captura de viewport e se há execução de código livre.
- **MCP do Ahuja vs MCP oficial**: nenhuma comparação direta de capacidade, estabilidade ou
  segurança.
- **Qualidade comercial**: nenhum exemplo de render de produto com luz de estúdio, câmera
  cinematográfica ou motion. Os resultados mostrados são diagrama didático e montagem de
  ativos.
- **Claude Code (CLI) com Blender**: os vídeos usam só o Claude Desktop. Nada sobre configurar o
  MCP no Claude Code, que é o nosso operador.
- **Geometry nodes por script**: citado como ponto fraco (1.5), sem detalhe nem solução.
