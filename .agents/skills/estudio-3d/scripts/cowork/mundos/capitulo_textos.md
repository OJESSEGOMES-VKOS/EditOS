# 02 · Mundos Visuais (o motor anti-mesmice)

> Blender 5.2 (sonda: `bpy.app.version_string` = "5.2.2 LTS"). Este capítulo existe para atacar o problema 9 da base ("mesma linguagem em tudo") e, de quebra, os problemas 4 (fundo padrão) e 8 (escuro sem intenção). Os dados de cada mundo também estão em `/home/claude/mundos.json`, que é o arquivo que a IA lê na hora de produzir.

## Por que "mundos"

Quando uma IA monta um filme 3D sem direção de arte, ela escolhe a média de tudo: fundo cinza claro, lente de 50 mm, luz de três pontos, look padrão, transição de fusão. O resultado não é feio, é genérico, e dois filmes seguidos saem iguais. Um produtor humano resolve isso com repertório: ele pensa "esse aqui é um filme de luxo escuro" e a partir daí sabe a lente, a luz, a trilha e o tipo de corte.

Um **mundo visual** é esse repertório empacotado. Ele fecha nove decisões de uma vez:

1. paleta na proporção 60/30/10 (fundo, apoio, acento);
2. configuração de cor (view transform e look do AgX, exposição);
3. materiais com valores do Principled BSDF;
4. rig de luz com posição, tamanho, energia relativa, temperatura e grade (spread);
5. linguagem de câmera (lentes, f-stop, movimentos);
6. assinatura de movimento (curva, timing a 30 fps, overshoot);
7. transição característica;
8. tipografia (família, peso, caixa, tracking);
9. trilha e design de som.

Por que empacotar: se cada decisão for tomada isolada, a IA mistura um look Punchy com uma tipografia de luxo e uma transição de brinquedo, e o filme perde identidade. Com o mundo escolhido, as nove decisões já conversam entre si. Sinal de que deu errado: você consegue trocar o produto do filme por outro de categoria diferente e nada no resto do filme "reclama".

## Como a IA usa este capítulo (fluxo de 7 passos)

1. **Ler o briefing e fixar a categoria** entre as 10 colunas da matriz: app, SaaS, serviço, eletrônico, cosmético, bebida, comida, moda, embalagem, logo. Se o produto cabe em duas (ex.: app de delivery de comida), a categoria é a do que aparece na tela por mais tempo.
2. **Ler `historico_mundos.json`** do cliente e da produtora (último filme entregue).
3. **Sortear o mundo** com `rotacao_mundos.py sortear --categoria <cat>`. O sorteio já exclui ✗ da matriz e qualquer mundo que repita um dos 4 eixos do filme anterior. Se o briefing pede um mundo específico, ele vence o sorteio, mas a regra dos 4 eixos continua valendo para lente, paleta e transição.
4. **Abrir a ficha do mundo** (abaixo ou no JSON) e montar a cena com os valores dela.
5. **Renderizar quadros de teste** (EEVEE 540x960 ou Cycles com poucas amostras) e passar o `qa.py`. Faixas boas: contraste 0,20 a 0,38, estourado abaixo de 1,5%.
6. **Ajustar só o que o qa acusar**, na ordem: exposição, energia da principal, cor do fundo, look. Nunca trocar de mundo no meio para "consertar".
7. **Registrar** com `rotacao_mundos.py registrar`. Projeto não registrado é projeto que vai ser repetido.

## Convenções das fichas

- **Azimute:** 0° é a posição da câmera; +90° é a direita do quadro; 180° é atrás do herói; valores negativos são à esquerda. **Elevação:** 0° na altura do herói, 90° em cima.
- **Energia relativa:** a principal vale 1,0. Watts dependem da escala e da distância, por isso cada ficha traz uma nota com a referência em W quando ela foi medida. Escala de referência das provas: herói de 10 a 15 cm com luzes a 0,35 a 0,9 m. Para o celular em escala real (71,5 x 147 x 7,8 mm) a ordem de grandeza é a mesma.
- **Spread** é a grade (honeycomb) da luz de área, em graus. A propriedade existe na API (`Light.spread`, padrão π rad = 180°) [confirmado por sonda no bpy 5.2.2].
- **Temperatura:** `use_temperature = True` e `temperature` em K [confirmado por sonda no bpy 5.2.2]. Onde a tabela diz "cor RGB", a luz usa `color` com `use_temperature = False`.
- **Looks do AgX disponíveis no 5.2.2** (lista exata devolvida pela sonda): `None`, `AgX - Punchy`, `AgX - Greyscale`, `AgX - Very High Contrast`, `AgX - High Contrast`, `AgX - Medium High Contrast`, `AgX - Base Contrast`, `AgX - Medium Low Contrast`, `AgX - Low Contrast`, `AgX - Very Low Contrast`. View transforms: `Standard`, `ACES 1.3`, `ACES 2.0`, `Khronos PBR Neutral`, `AgX`, `Filmic`, `Filmic Log`, `False Color`, `Raw` [confirmado por sonda no bpy 5.2.2]. Nenhum mundo usa Standard: foi ele que lavou os filmes antigos.
- **Nomes de entradas do Principled BSDF** seguem o 5.2.2: `Coat Weight`, `Transmission Weight`, `Sheen Weight`, `Sheen Tint`, `Sheen Roughness`, `Specular IOR Level`, `Thin Film Thickness`, `Thin Film IOR`, `Subsurface Weight` etc. [confirmado por sonda no bpy 5.2.2]. Referência: [Principled BSDF, manual do Blender 5.2 LTS](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html).
- **Status de cada mundo:** "calibrado pelo Claude Code" (os 7 já testados na RTX 3050), "[testado no bpy 5.2.2 Cycles CPU, nuvem]" (os 3 provados neste capítulo) ou "[testar no Blender]" (valores de direção de arte ainda sem render).

## Calibração herdada e lições da prova na nuvem

### O que os 7 mundos testados pelo Claude Code ensinaram (não contradizer)

Os mundos estúdio premium, luxo escuro, pop candy, vidro e cromo, neon noturno, natureza (luz de persiana) e argila foram rodados no Blender 5.2.2 com a RTX 3050. As fichas deles respeitam estas regras:

| Regra | Valor | Por quê | Sinal de que foi ignorada |
|---|---|---|---|
| Energia baixa | primeiro chute × 0,15 (cerca de 3 stops abaixo) | o primeiro rig estourou 28% do quadro em branco puro | qa.py acusa ESTOURADO, brilho chapado sem textura |
| Fundo afastado e escuro | 1,2 a 1,4× a escala do herói, um tom abaixo do planejado | fundo perto recebe a mesma luz do herói e o contraste some | herói e fundo com a mesma luminância (LAVADO) |
| Grade na principal | spread de 60 a 75° | concentra a luz no herói e não no cenário | fundo mais claro que o produto |
| Bandeiras pretas | planos pretos laterais em vidro e cromo | vidro só existe pelo que reflete; sem preto não há borda | vidro vira bolha cinza sem linha escura |
| Emissão de tela e neon | 1,0 | no AgX a tela desbota acima de cerca de 1,3 | cor da interface lavada, perto do branco |
| Sol por script | `view_layer.update()` antes de ler a direção | a matriz do objeto só atualiza depois do update | sombra apontando para o lado errado |

### O que a prova na nuvem ensinou (3 mundos novos)

Rodei holográfico, papel e recorte e tátil e têxtil no bpy 5.2.2 como módulo, Cycles CPU, 360x360, 32 amostras com denoise, frasco cilíndrico de 40 mm de raio por 120 mm com chanfro de 3 mm e esfera de 30 mm. Script: `/home/claude/codigo/mundos/prova_mundos_novos.py`. Imagens: `/home/claude/provas/mundo_holografico.png`, `mundo_papel.png`, `mundo_textil.png`. [testado no bpy 5.2.2 Cycles CPU, nuvem]

1. **Contorno atrás do herói lava o piso da frente.** No holográfico, os dois contornos coloridos a 150° e -140° atravessavam a área do herói e caíam no chão na frente dele, pintando o primeiro plano de ciano e magenta. Tentei `Light.diffuse_factor = 0` e `visible_diffuse = False` no objeto da luz: o resultado no Cycles não mudou [motivo não verificado]. Fechar o spread para 25° piorou (concentrou o feixe). O que resolveu foi **light linking**: o contorno só ilumina a coleção do herói. Regra: em mundo de fundo escuro, toda luz colorida de contorno usa light linking.
2. **Piso escuro também precisa de `Specular IOR Level` baixo** (0,08 no holográfico). Com 0,5 o piso fosco ainda espelhava os contornos em ângulo rasante.
3. **Filme fino uniforme dá um tom só.** Com `Thin Film Thickness` fixo em 520 nm sobre metal, o frasco ficou só levemente rosado. Ligando um Noise (escala 3) num Map Range de 250 a 750 nm, apareceram as faixas verde e magenta típicas de holograma. Sobre base dielétrica preta o efeito ficou fraco demais; sobre metal claro (`#C4C8D0`, Metallic 1,0, Thin Film IOR 2,0) funcionou.
4. **Papel e têxtil lavam com rebate forte.** Primeira versão do papel: fundo creme `#F4EBDD`, rebate de 4 W, World 0,25: contraste do meu medidor caseiro (p95 menos p5 da luminância) em 0,11 e saturação média 0,10. Correção: fundo kraft `#CDB894`, rebate 1,2 W (cerca de 10% da principal), World 0,08 e exposição -0,3: a saturação subiu para 0,25 e a sombra do sol ficou desenhada. No têxtil, o preenchimento caiu de 3 W para 1 W e o fundo desceu de `#D8CFC2` para `#A89A88`; contraste foi de 0,33 para 0,47 e a penugem (sheen) apareceu na borda da esfera.

O medidor que usei não é o `qa.py` do Claude Code (não estava disponível na nuvem), então os números acima servem para comparar antes e depois, não para comparar com as faixas do qa.py. [testar no Blender] com o qa.py oficial.

```python
# Blender 5.2 | status: confirmado por sonda (bpy 5.2.2, Cycles CPU) | trecho de prova_mundos_novos.py
herois = bpy.data.collections.new("herois")
bpy.context.scene.collection.children.link(herois)
for ob in (frasco, esfera):
    herois.objects.link(ob)
contorno.light_linking.receiver_collection = herois   # o contorno acende só o herói

# filme fino variando: é a variação de espessura que vira arco-íris
nt = mat.node_tree; p = nt.nodes.get("Principled BSDF")
nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 3.0
mr = nt.nodes.new("ShaderNodeMapRange")
mr.inputs["To Min"].default_value = 250; mr.inputs["To Max"].default_value = 750
nt.links.new(nz.outputs["Fac"], mr.inputs["Value"])
nt.links.new(mr.outputs["Result"], p.inputs["Thin Film Thickness"])
```

O filme fino entrou no Principled BSDF na série 4.2 ([pull request #118477](https://projects.blender.org/blender/blender/pulls/118477), [manual 4.2](https://docs.blender.org/manual/en/4.2/render/shader_nodes/shader/principled.html)) e as entradas existem no 5.2.2 [confirmado por sonda no bpy 5.2.2]. Se o filme fino renderiza no EEVEE do 5.2 da mesma forma que no Cycles: [testar no Blender].

## Os mundos

São 19 mundos. Os 16 pedidos de partida mais três próprios: fitas e formas doces (ribbons), arquitetônico com luz dura e monocromático color block. Cada ficha tem tudo que a IA precisa para montar a cena sem inventar.

<<FICHAS>>

## Matriz mundo × categoria

✓ = funciona sem ajuste (peso 3 no sorteio). ~ = funciona com ajuste descrito na ficha (peso 1). ✗ = evitar (peso 0, fora do sorteio).

<<MATRIZ>>

Como ler as células mais discutíveis:

- **Estúdio premium em comida = ✗.** O vazio grafite e a luz fria esfriam o apetite. Comida pede calor de cor (3200 a 4500 K) e textura em close. Se o cliente insiste em "clean", use natureza e luz do sol com fundo de pedra clara.
- **Luxo escuro em serviço = ✓.** Advocacia, consultoria de alto ticket e clínica de estética vendem confiança e exclusividade. O cuidado é não usar ouro em serviço popular: troque o acento dourado por branco quente `#E8D9B5`.
- **Diorama em logo = ✗.** Um diorama precisa de 2 a 3 s só para ser lido; uma revelação de logo de 6 s não tem esse tempo.
- **Orgânico e líquido em logo = ~.** Funciona quando a marca é de bebida ou cosmético (o logo emerge do líquido); vira metáfora gratuita em qualquer outra.
- **Macro em SaaS = ✗.** Não existe superfície física para revelar. Se o SaaS tem hardware (leitor, maquininha), use a coluna eletrônico.
- **Color block em serviço = ✗** quando a cor não é da marca. Se for (ex.: clínica com azul proprietário), vira ~.

## A regra de rotação

### Os 4 eixos

| Eixo | O que é | Como medir | Exemplo |
|---|---|---|---|
| 1. Mundo | o `id` do mundo base (e o do acento, se houver mix) | igualdade de id | `vidro_cromo` |
| 2. Lente dominante | a lente que fica mais de 50% do tempo na tela | mm inteiros | 85 |
| 3. Paleta | a família de matiz do acento | 12 fatias de 30° no círculo de matiz, mais "neutro" se a saturação for menor que 0,18 | "ciano" |
| 4. Transição | a chave da transição principal do filme | igualdade de chave | `wipe_refrativo` |

**Regra:** nenhum dos 4 eixos repete entre filmes consecutivos da produtora. Duas regras de apoio: o mesmo mundo não volta nos últimos 3 filmes do mesmo cliente, e o mesmo look do AgX não aparece 3 vezes seguidas.

Por quê 4 eixos e não só o mundo: dois mundos diferentes filmados com a mesma lente de 85 mm, o mesmo acento laranja e o mesmo corte por fusão parecem o mesmo filme para quem rola o feed. O olho reconhece primeiro a cor dominante, depois o enquadramento (lente) e o ritmo de corte (transição); o "mundo" em si é a última coisa que ele nota. Sinal de que a regra foi quebrada: colocar dois filmes lado a lado em miniatura e não saber qual é qual.

### Sorteio ponderado pela matriz

1. Pegue a coluna da categoria na matriz. ✗ sai do sorteio.
2. Peso inicial: ✓ = 3, ~ = 1.
3. Exclua todo mundo que repetiria um eixo do último filme: mesmo id, mesma família de acento, mesma chave de transição, ou nenhuma lente disponível diferente da lente dominante anterior.
4. Multiplique por 0,3 o peso de qualquer mundo usado nos últimos 5 filmes.
5. Sorteie proporcional ao peso. Escolha a lente dominante entre as lentes do mundo, excluindo a anterior.
6. Se ninguém sobrar, use um mundo ~ com o ajuste da ficha, ou mantenha o mundo e troque o acento de família (nunca a cor da marca: mova a cor da marca para o apoio e use um acento neutro).

**Atenção ao viés quente.** Dos 19 acentos padrão, 6 caem em "laranja" e 5 em "vermelho". Depois de um filme com acento quente, o sorteio fica estreito. Isso é proposital (empurra para frio e neutro), mas quando a cor da marca é quente em todos os filmes de um cliente, a família registrada deve ser a do **acento real usado**, e a variação tem que vir do fundo e do mundo.

### Como a IA registra: `historico_mundos.json`

Um arquivo por produtora (na raiz dos projetos) e, opcionalmente, um por cliente. Esquema:

```json
{
  "versao": 1,
  "projetos": [
    {
      "projeto": "Delivery X, Reels 20 s",
      "data": "2026-10-02",
      "categoria": "app",
      "mundo_base": "vidro_cromo",
      "mundo_acento": "neon_noturno",
      "lente_dominante_mm": 85,
      "paleta": {"fundo": "#0E1116", "acento": "#7CE0FF", "familia": "ciano"},
      "transicao": "wipe_refrativo",
      "look": "AgX - Medium High Contrast",
      "formato": "9:16",
      "duracao_s": 20
    }
  ]
}
```

Comandos (script em `/home/claude/codigo/mundos/rotacao_mundos.py`, Python puro, testado na nuvem):

```bash
python rotacao_mundos.py sortear --categoria app --historico historico_mundos.json
python rotacao_mundos.py registrar --historico historico_mundos.json --categoria app \
  --projeto "Delivery X, Reels 20 s" --mundo vidro_cromo --lente 85 --acento "#7CE0FF" \
  --transicao wipe_refrativo --acento-mundo neon_noturno --formato 9:16 --duracao 20
```

O `registrar` recusa o registro se algum eixo repetir o filme anterior (testei: registrar `neon_noturno` com lente 85 logo depois de `vidro_cromo` com lente 85 devolve "Recusado: repete lente em relação ao filme anterior"). Isso força a IA a mudar a decisão antes de entregar, e não depois.

Função de família de cor usada no script (o eixo 3):

```python
# Blender 5.2 | status: confirmado por execução (Python puro) | trecho de rotacao_mundos.py
import colorsys
def familia_cor(hex_):
    h = hex_.lstrip("#"); r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    if ss < 0.18 or ll > 0.92 or ll < 0.08:
        return "neutro"
    nomes = ["vermelho", "laranja", "amarelo", "lima", "verde", "verde-agua",
             "ciano", "azul", "anil", "violeta", "magenta", "rosa"]
    return nomes[int(((hh * 360) + 15) % 360 // 30)]
```

## Como mixar mundos (base + acento) sem virar bagunça

Mix é útil quando a categoria pede dois tons ao mesmo tempo (ex.: app de delivery noturno: precisão de interface e energia de rua). A regra que evita bagunça:

1. **O mundo base manda em 4 coisas e não divide:** fundo, look do AgX, linguagem de câmera e assinatura de movimento. Se dois mundos disputam o look, o filme perde a cor.
2. **O mundo acento empresta UM eixo só**, escolhido entre: um material (ex.: o vidro do vidro e cromo), uma luz (ex.: o contorno neon), a transição, ou a tipografia. Dois eixos emprestados já viram dois filmes colados.
3. **Proporção de tela 80/20:** o acento aparece em no máximo 20% do tempo ou da área do quadro.
4. **A paleta do acento entra no slot de 10%**, nunca no de 60%. Se o neon do mundo acento pinta o fundo, ele virou base.
5. **Mundos com a mesma temperatura emocional misturam; opostos brigam.** Calmo com calmo (natureza + tátil), preciso com preciso (estúdio premium + brutalista), festivo com festivo (pop candy + fitas).
6. **Registre o mix.** O `mundo_acento` entra no histórico e conta como mundo usado para a regra dos 4 eixos.

### Mixes que funcionam

| Base | Acento | O que o acento empresta | Briefing típico |
|---|---|---|---|
| Vidro e cromo | Neon noturno | contorno magenta e ciano com light linking | app de delivery ou fintech noturna |
| Estúdio premium | Macro cinematográfico | 2 planos de detalhe com luz rasante | eletrônico ou relógio, provar acabamento |
| Natureza e luz do sol | Tátil e têxtil | material (linho, feltro) no apoio | cosmético natural, casa, colchão |
| Luxo escuro | Orgânico e líquido | transição (wipe líquido) | perfume, destilado |
| Diorama isométrico | Pop candy | materiais de plástico brilhante nas peças de destaque | app de consumo, explicação de processo jovem |
| Editorial de revista | Arquitetônico com luz dura | luz (faixa de sol por gobo) | moda, consultoria criativa |
| Color block | Fitas | transição (ribbon wipe) entre as trocas de cor | linha de produto por cor, lançamento de tema de app |
| Brutalista tech | Papel e recorte | tipografia de anotação à mão (Caveat) | ferramenta de desenvolvedor com tom humano |

### Mixes proibidos

| Combinação | Por que falha | Sinal visual |
|---|---|---|
| Luxo escuro + pop candy | exclusividade e brinquedo se anulam | ouro ao lado de plástico rosa, preto virando cinza |
| Argila + vidro e cromo | macio fosco contra espelho frio; os dois pedem luzes opostas | massinha com reflexo nítido, vidro sem bandeira |
| Neon noturno + natureza e luz do sol | noite e dia no mesmo quadro sem motivo narrativo | sombra de sol em cena com poste aceso |
| Retrofuturo + editorial | dois sistemas tipográficos fortes brigando | duas famílias de display no mesmo quadro |
| Holográfico + papel | efeito óptico de luxo em material pobre | papel com arco-íris parece adesivo barato |
| Qualquer mundo + 2 acentos | três linguagens = nenhuma | o espectador não sabe o tom do filme em 2 s |

### Checagem antes de renderizar um mix

1. O look do AgX é um só e é o do base? 
2. O acento empresta um único eixo?
3. O acento ocupa no máximo 20% do tempo ou da área?
4. A cor do acento está no slot de 10%?
5. Tirando o acento, o filme ainda se sustenta como o mundo base? Se não, o acento virou base: troque os papéis e registre de novo.

## Fontes

Estúdios, projetos e filmes (referências visuais citadas nas fichas; todas checadas por busca ou leitura da página em outubro de 2026):

- [Apple Newsroom, Introducing iPhone Air](https://www.apple.com/newsroom/2025/09/introducing-iphone-air-a-powerful-new-iphone-with-a-breakthrough-design/)
- [ManvsMachine, Apple iMac Pro Behind The Scenes (Vimeo)](https://vimeo.com/260280672) · [ManvsMachine no Vimeo](https://vimeo.com/mvsm) · [Flyknit, ManvsMachine](https://mvsm.com/project/flyknit) · [Nike Flyknit (Vimeo)](https://vimeo.com/162826208) · [It's Nice That sobre Flyknit](https://www.itsnicethat.com/articles/man-vs-machine-nike-flyknit-innovation-190416) · [Creative Review, Air Max Day '18](https://www.creativereview.co.uk/air-max-day-18-by-manvsmachine/)
- [Buck, trabalhos 3D](https://buck.co/work/tag/3d) · [Instacart Fresh](https://buck.co/work/instacart-fresh) · [Woolmark](https://buck.co/work/woolmark) · [Lily's Gummy Bears](https://buck.co/work/lilys-gummy-bears) · [Sherwin-Williams](https://buck.co/work/sherwin-williams) · [Truly](https://buck.co/work/truly-flavor-films) · [Pepsi Black](https://buck.co/work/pepsi-black) · [Oura](https://buck.co/work/oura-ring-true-to-you) · [Pixel 4a](https://buck.co/work/google-pixel-4a) · [Nike White Hot](https://buck.co/work/nike-white-hot) · [Spotify Premium](https://buck.co/work/spotify-premium) · [Amazon Echo Buds](https://buck.co/work/amazon-echo-buds) · [Meta Connect 23](https://buck.co/work/meta-connect-23) · [7UP](https://buck.co/work/7up) · [Microsoft Copilot+ PCs](https://buck.co/work/microsoft-copilot-pcs) · [Microsoft Surface Laptop 5](https://buck.co/work/microsoft-surface)
- [Tendril Studio](https://tendril.studio/) · [Figure 02](https://tendril.studio/work/figure02/) · [Hublot MP-10](https://tendril.studio/work/mp-10) · [Hublot Arsham Droplet](https://tendril.studio/work/arsham-droplet) · [IBM z17](https://tendril.studio/work/ibm-z17) · [Alo Handbag](https://tendril.studio/work/alo-handbag) · [Cash App](https://tendril.studio/work/cashapp)
- [Ordinary Folk, trabalhos](https://www.ordinaryfolk.co/work) · [Introducing Spline](https://www.ordinaryfolk.co/project/introducing-spline) · [Equilibrium](https://www.ordinaryfolk.co/project/equilibrium) · [Nightdrive](https://www.ordinaryfolk.co/project/nightdrive) · [Colorscope: Green](https://www.ordinaryfolk.co/project/cnn-green)
- [Hornet](https://www.hellohornet.com/) · [La Mer Global Holiday](https://www.hellohornet.com/projects/la-mer---global-holiday-campaign) · [5 Gum](https://www.hellohornet.com/projects/5-gum---overstimulate-your-senses)
- [Six N. Five](https://sixnfive.com/) · [Umbral](https://sixnfive.com/projects/umbral/) · [Holo-Scandinavian](https://sixnfive.com/projects/holo-scandinavian/) · [Flow](https://sixnfive.com/projects/flow/) · [The Japanese Garden](https://sixnfive.com/projects/the-japanese-garden/) · [Windows 11 Background](https://sixnfive.com/projects/windows-11/) · [Gestalten, Six N. Five sobre realismo e imperfeição](https://gestalten.com/blogs/journal/six-n-five-on-designing-realism-and-its-imperfections)
- [Vucko, trabalhos](https://vucko.co/work) · [Spotify Wrapped 2024](https://vucko.co/work/spotify-wrapped-2024) · [Communication Arts, A Brand's Body Language (Vucko)](https://www.commarts.com/columns/vucko)
- [Oddfellows, trabalhos](https://oddfellows.tv/work) · [Motion Array, Studio Spotlight Oddfellows](https://motionarray.com/learn/motion-design/studio-spotlight-oddfellows/) · [Motion Array, Studio Spotlight ManvsMachine](https://motionarray.com/learn/motion-design/studio-spotlight-manvsmachine/)
- [Blackmeal no Behance](https://www.behance.net/blackmeal?locale=en_US) (pesquisado; o site do estúdio não abriu na nuvem, por isso nenhum projeto dele foi usado como referência de ficha)
- [Bang & Olufsen, Beosound Theatre (Vimeo)](https://vimeo.com/746646949) · [Bang & Olufsen, Beolab 28 (Vimeo)](https://vimeo.com/557990749)
- [Aesop, Harvest Campaign (Vimeo)](https://vimeo.com/461743318)
- [Nothing Phone (3) Trailer (YouTube)](https://www.youtube.com/watch?v=kLmCLaj7NxQ) · [Yonick Studio, Nothing 3a Pro](https://yonick.studio/work/nothing-3a-pro)
- Behance: [Chanel Bleu de Chanel CGI](https://www.behance.net/gallery/127909887/Chanel-Bleu-De-Chanel-3D-CGI-Perfume-Animation) · [ELYSIUM Perfume](https://www.behance.net/gallery/106660823/3D-product-design-animation-ELYSIUM-PERFUME) · [Live Digital Diorama](https://www.behance.net/gallery/165424867/Live-Digital-Diorama-3D-Animation-Loop) · [Isometric Rooms](https://www.behance.net/gallery/107678093/Isometric-Rooms) · [NEON NIGHT](https://www.behance.net/gallery/62430835/NEON-NIGHT) · [3D Iridescent HD Shapes](https://www.behance.net/gallery/188630181/3D-Iridescent-HD-Shapes) · [Animated Iridescent Gradients v.3](https://www.behance.net/gallery/163777045/Animated-Iridescent-Gradients-v3) · [FEDEX RIBBONS](https://www.behance.net/gallery/50059907/FEDEX-RIBBONS) · [Redshift Ribbons (Procedural)](https://www.behance.net/gallery/193448179/Redshift-Ribbons-(Procedural)) (o Behance bloqueia leitura automática; os links vieram de resultado de busca com título e autor)
- [Florian Renner, Retrowave (Vimeo)](https://vimeo.com/117890578) · [Twenty75, 3D Chrome](https://www.twenty75.com/projects/3d-chrome/)
- 80.lv: [Cozy Assembling Bakery Diorama](https://80.lv/articles/cozy-assembling-bakery-diorama-animation-made-in-blender) · [Surreal Papercraft-Style World](https://80.lv/articles/check-out-this-surreal-papercraft-style-world-made-in-blender) · [Rendering 3D Clay Models](https://80.lv/articles/breakdown-rendering-3d-clay-models-in-marmoset-toolbag) · [Gianluca Squillace, Clay Render Breakdown (ArtStation)](https://www.artstation.com/artwork/aGKqz9)

Técnica:

- [Principled BSDF, manual do Blender 5.2 LTS](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html) · [manual 4.2 LTS](https://docs.blender.org/manual/en/4.2/render/shader_nodes/shader/principled.html)
- [Cycles: thin film iridescence no Principled BSDF, PR #118477](https://projects.blender.org/blender/blender/pulls/118477)
- [AgX, repositório de Eary Chow (origem do view transform)](https://github.com/EaryChow/AgX)
- Sonda local: bpy 5.2.2 LTS em `/home/claude/bvenv` (looks, view transforms, propriedades de luz, light linking, filme fino).

Fontes tipográficas citadas (todas SIL Open Font License 1.1, uso comercial permitido, disponíveis no [Google Fonts](https://fonts.google.com/)): Inter, Geist, Cormorant Garamond, Cormorant, Bodoni Moda, Jost, Fredoka, Baloo 2, Unbounded, Manrope, Nunito, Space Grotesk, Sora, JetBrains Mono, Outfit, DM Sans, Space Mono, Doto, Archivo, Fraunces, Instrument Serif, IBM Plex Mono, Bricolage Grotesque, Caveat, Monoton, Righteous, Chakra Petch, Syne, Playfair Display, Quicksand, Lexend, Libre Caslon Display, Work Sans, Big Shoulders Display. A licença de cada família deve ser conferida na página dela no Google Fonts antes da entrega [não verificado família a família nesta sessão].

Texturas citadas: Poly Haven (CC0, uso comercial sim).

## Pendências para o Claude Code

**Receitas [testar no Blender] (RTX 3050, EEVEE e Cycles OptiX):**

1. Renderizar os 9 mundos ainda sem render (diorama, orgânico e líquido, brutalista, macro, retrofuturo, editorial, fitas, arquitetônico, color block) com o cilindro-frasco e a esfera de `prova_mundos_novos.py` e passar o `qa.py` oficial. Ajustar energia relativa e exposição das fichas.
2. Repetir holográfico, papel e têxtil no `qa.py` oficial e no EEVEE (o filme fino no EEVEE do 5.2 não foi verificado).
3. Investigar por que `Light.diffuse_factor = 0` e `Object.visible_diffuse = False` na luz não tiraram a iluminação do piso no Cycles CPU. Hipótese: o piso recebe luz direta (não rebatida) e essas chaves agem em outra parte do caminho da luz [não verificado]. Light linking resolve, mas vale saber o motivo.
4. Diorama: confirmar Strength do sol (chute 2 a 4) e o Orthographic Scale ideal para 9:16.
5. Macro: confirmar que o DOF do Cycles em escala 1:1 com f/2,8 a 15 cm dá a profundidade esperada (sem cara de miniatura).
6. Fitas: validar Curve com Bevel e Twist animado contra Geometry Nodes Curve to Mesh em tempo de render.
7. Color block: medir em que luminância de fundo o AgX começa a desaturar a matiz (testar `#2F6FDE` com exposição -0,5 a +0,5).
8. Gerar uma grade de miniaturas dos 19 mundos (um PNG por mundo, 360x640) para a IA comparar filmes lado a lado na checagem da regra de rotação.

**PENDÊNCIAS YOUTUBE**

| Título | Canal | Link | O que esperava aprender |
|---|---|---|---|
| Nothing Phone (3) Trailer | Nothing | https://www.youtube.com/watch?v=kLmCLaj7NxQ | ritmo de corte, uso de matriz de pontos e luz dura no filme oficial (só o link foi confirmado; vídeo não assistido) |
| Blender Clay render Tutorial (Render Breakdown) | xyz3dlab | https://www.youtube.com/watch?v=CSBStg6pyZM | valores de subsuperfície e iluminação de clay render no Blender |
| AirPods Pro 3 | Apple | https://www.youtube.com/watch?v=EMmKs8vMKhU | estrutura de filme de produto do estúdio premium (lentes, tempo de plano) |
