# Destilado: LUZ (Estúdio Claude + Blender 3D)

Fonte: as 15 transcrições `luz__*` em `pesquisa/transcricoes/`, lidas na íntegra em 2026-10-02.
Legenda automática com erros foi interpretada (ex.: "ring light" = rim light, "eight millimeters"
= 80 mm, "skill" = scale). Tudo que não veio dos vídeos está marcado **[conhecimento geral]**.
A verdade do Blender 5.2 vem de `.claude/skills/estudio-3d/referencias/blender-5.2-verdade.md`.

Legenda de nota: 5 = muda o jeito de trabalhar, com valores; 1 = quase nada aproveitável.

---

## 1. Por vídeo

### 1.1 Fundamentals of Lighting in Blender
- Canal: Blender Guru | https://youtu.be/ENnEYoUpFfU | 43 min
- **Nota: 5** | Versão: Blender 4.2+ (EEVEE novo com GI por raytracing; troca pra Cycles no meio)
- O mundo começa com força 0: luz ambiente cinza "de todos os lados" mata o controle.
- Sombra é o que faz o cérebro entender a forma. Sol de cima, a pino, deixa impossível saber se um
  recorte é ressalto ou buraco; girar a luz alguns graus resolve.
- A segunda luz (o lado de sombra) nasce como duplicata da primeira e **cai muito de potência**: com
  as duas iguais (460 W cada no exemplo) a forma some. Ele chama a regra "preenchimento = metade da
  chave" de bobagem: ajuste no olho até o lado escuro ficar legível mas claramente em sombra.
- Luz depende do ponto de vista: de frente vira flash chapado. **Trave a câmera antes de iluminar.**
- Objeto sem chão parece falso e flutuando; o chão também rebate luz e enche as sombras. Objeto claro
  pede chão escuro (base color quase preto, não preto puro) pra silhueta ler; chão com roughness alta
  pra matar reflexo indesejado.
- Lei do inverso do quadrado: dobrou a distância, chega 1/4 da luz. Use isso pra **guiar o olho**:
  luz perto do ponto de interesse, o resto cai sozinho. Pra iluminação uniforme (render de modelo),
  suba a luz pontual bem alto e aumente a potência; o sol ele evita porque achata.
- Tamanho da luz (raio) decide **qual nível de detalhe aparece**: pequena realça arranhão, rebite e
  textura; grande mostra a forma e esconde detalhe. Objeto duro de quinas pede "suave, mas não muito".
- Temperatura (Kelvin) pra parecer luz natural: ~1500 K vela, 2000 a 2500 K incandescente, luz do dia
  no meio, céu azulado acima. Cor livre (RGB) pra mundo urbano/sci-fi. Cor diferente entre luzes
  também ajuda a separar faces do objeto.
- Polimento: mover a chave poucos graus pra que topo e lateral tenham luminâncias diferentes (faces
  iguais em brilho se fundem). **Nunca ajuste uma luz com as outras ligadas**: isole.
- Rim light: posicionada do lado oposto da câmera, de modo a pegar o reflexo no topo da tampa.
- Técnica de "esculpir": começa toda luz como pontual (posição, tamanho, cor) e depois troca pra spot
  para escurecer o que não importa (chão da frente, cantos); spot também serve pra rim não tocar o chão.
- Lente 80 mm em vez de 50 mm para caixa/produto: menos distorção, forma mais legível; acima disso
  começa a parecer ortográfica.
- Fluxo de decisão: render no slot 3, muda, render no slot 4, alterna. De vez em quando joga fora e
  tenta um rig radicalmente diferente pra sair do micro-ajuste.

### 1.2 How to Make Studio Lighting in Blender
- Canal: Blender Guru | https://youtu.be/5UCc3Z_-ibs | 23 min
- **Nota: 5** | Versão: 2.83 (Filmic era o padrão)
- Câmera 100 mm para móvel/produto (50 mm exagera o que está perto); produto girado ~20° no Z para sair
  do frontal; enquadrar com shift X/Y em vez de inclinar a câmera (evita linhas convergindo).
- Mundo a 0. Primeira luz (pontual) puxada para o lado até a curva do encosto ganhar sombra. Luz de
  frente esconde a sombra atrás do objeto e mata o volume.
- Em objeto reflexivo, **a posição do reflexo importa mais que a luz em si** (cromo é só reflexo).
  Ele subiu a luz pra o brilho não cair na borda de baixo e exagerar o lábio do assento.
- Fundo infinito: plano, extrude a borda de trás pra cima, modificador Bevel com muitos segmentos,
  shade smooth; aumentar o offset se a linha ainda aparecer.
- Fundo com degradê desigual = luz perto demais. Solução: **afastar a luz e subir a potência**; a
  queda entre o pé e o topo do fundo fica pequena e o fundo fica uniforme.
- Exposição: View Transform "False Color". Cinza = exposição correta; ciano = 1 stop abaixo; verde =
  1 acima; amarelo/vermelho = estourando. Regra dele: precisa existir cinza em algum lugar do modelo.
- Cor lavada: o look padrão equivale a contraste médio; ele usa **sempre High Contrast** (Very High é
  demais). Exposure da cena é o mesmo que mexer em todas as luzes ao mesmo tempo.
- Luz de detalhe: pontual escondida atrás do fundo pra bater só na perna da cadeira sem sujar o fundo.
  "Toda luz precisa de um porquê."
- Cor: fique no branco ou em quente/frio do corpo negro; RGB saturado (rosa, azul forte) dá cara
  urbana. Ele deixou uma luz levemente fria. Fundo pastel dessaturado é tendência e conta história.
- Render 200 amostras + denoise; passe de AO com distância 0,2 m (o padrão de 10 m é absurdo)
  multiplicado a 30 a 40% no compositor para "assentar" o objeto nos cantos.

### 1.3 How to create a professional Studio Lighting in Blender 3.0
- Canal: Blender for Archviz | https://youtu.be/CCmV1X8t2SQ | 10 min
- **Nota: 5** (o único com todos os números de um rig de 4 luzes) | Versão: 3.0
- Câmera a 45° do objeto, 80 mm (compara com 22 mm, que agiganta o que está perto); shift em vez de
  rotação.
- Mundo preto. **Chave: área a ~45° do objeto, 100 W, tamanho 0,8 m, 4500 K** (via nó Blackbody).
- **Preenchimento: duplicata da chave, 45 W, 7500 K** (chave quente, sombra fria = complementar).
  Razão chave:preenchimento ≈ 2,2:1 (~1,1 stop).
- **Luz de fundo: área só para o fundo, 100 subindo para 200 W, com "cast shadow" desligado** (as
  sombras dela criavam artefatos no canto).
- **Rim: área atrás do objeto, a ~45°, 55 W**, ajustada com as outras escondidas (isolar).
- Cor do fundo: pegou a cor da madeira com conta-gotas e escolheu a complementar na roda de cores.
- Reflexo especular indesejado no fundo: roughness do fundo perto de 1.
- Fecho: look de None para High Contrast (Filmic).

### 1.4 The Only Product Lighting Video You'll Ever Need
- Canal: The Blenderender | https://youtu.be/yPekIQMoKYM | 16 min
- **Nota: 4** | Versão: 4.0
- Mundo 0. **Rig 1 (três pontos):** chave área girada RX 90°, RZ 45°; rim = duplicata **exatamente
  oposta (RZ 180°)**, esticada no Z pra cobrir o objeto inteiro e **mantida pequena/dura** porque o
  papel dela é desenhar contorno; preenchimento = espelho da chave no X, **maior (mais suave) e
  mais fraco**, afastado pelo eixo normal até sobrar sombra.
- Cinema filma do lado da sombra (o lado oposto à chave): a câmera olha a face que não recebe a luz
  principal. Mais cinematográfico.
- Chão preto espelhado (metallic 1, roughness 0) + parede de fundo vertical com **Emission branca
  força 1,3** = fundo branco com reflexo do produto. Reflexo da rim no fundo removido por **light
  linking em modo excluir** (a rim ilumina tudo menos aquele plano).
- **Rig 2:** duas áreas laterais simétricas (RY 90°, espelhadas com escala X −1 no cursor 3D), mais
  uma área atrás e acima; fundo iluminado por um Sun linkado só ao fundo (light linking incluir).
- **Rig 3:** só contraluz (área RX −90° atrás) ou duas contraluzes a 45° de cada lado por trás, com
  um preenchimento grande e fraco na frente se quiser abrir sombra.
- Bandeiras: planos opacos entre luz e objeto escurecem um lado (o "negative fill" da fotografia).
- Luz em degradê feita no nó da luz: Gradient Texture → Color Ramp → Strength, spread baixo.
- Ele afirma que afastar a luz deixa mais suave. **Errado** (ver Conflitos).

### 1.5 8 Lighting Tricks I Wish I Knew Earlier (Product Lighting)
- Canal: Digitalist | https://youtu.be/ZYk3OOf-gBk | 10 min
- **Nota: 5** | Versão: 4.x
- Câmera 120 mm (produto como ele é, sem distorção); pivô no cursor 3D central para girar luz em
  volta do produto.
- Chave: área na frente, inclinada, afastada. **Preenchimento sem luz:** plano rebatedor ao lado do
  objeto com visibilidade de câmera e de sombra desligadas (cartão branco invisível). Sobe o plano se
  aparecer linha de corte.
- Contraluz para rim com **light linking excluindo o chão** (senão mancha o piso).
- Quina viva não pega luz: bevel. Shader Bevel raio 0,02 é rápido mas falha de perto; **modificador
  Bevel 5 segmentos, 0,03** é o certo. Sem bevel não existe filete de luz nas arestas.
- Produto real: chave 25 W; contraluz 5 W (≈5:1), girada até o topo ganhar degradê e não um branco
  chapado.
- **Teaser:** só contraluzes, duas simétricas atrás, chão excluído. Esconde o produto e vende mistério.
- **E-commerce fundo branco:** área grande e forte em cima + uma área **pequena e fraca** só para
  criar o ponto especular (luz grande demais não gera reflexo legível) + uma luz atrás estourando o
  fundo para branco.
- **Vidro:** área atrás com textura de degradê elíptico no Emission/Color da luz (use nodes). Borda
  dura branca vira degradê suave. Não é físico, mas fica bonito.
- **Metal:** mesma ideia; áreas altas e estreitas com degradê, duas atrás (uma de cada lado) e duas na
  frente, para não sobrar preto demais na garrafa metálica.
- HDRI com parcimônia: em produto você quer controle total.
- **Sol** para produto fosco de cor chapada (protetor solar, verão): sombra dura; ângulo do sol maior
  suaviza. Gobo num spot (textura na cor da luz) + raio maior para amaciar a projeção.

### 1.6 How to Light Products like a Pro in Blender
- Canal: Denzel Modeste | https://youtu.be/LBx0y3ZVwt8 | 11 min
- **Nota: 4** | Versão: 3.x/4.x (Cycles)
- A técnica do fotógrafo de produto: **iluminação em degradê** com planos emissivos.
- Plano escalado 5x, girado 90° no X, atrás/acima do produto, material Emission com degradê;
  **visibilidade de câmera desligada** no plano. Força de emissão ~5.
- Objeto cilíndrico (lente Sony 90 mm de referência) leva **dois degradês** (topo e base): reforça que é
  cilindro e dá o visual de catálogo.
- Garrafa de vinho: primeiro plano com **linha dura que se dissolve em degradê** define o contorno da
  garrafa; segundo plano com degradê duplo dá ao mesmo tempo o brilho frontal e o filete de borda
  (rim) que separa do fundo preto.
- O lado que ficou sem borda (rótulo sumindo no preto) foi resolvido com fundo + uma pontual colorida
  (vermelha, combinando com o tema) criando filete de cor.
- Resultado com dois planos e uma pontual. Node group "strip box" dele controla largura, queda e
  posição do degradê sem mover o plano.

### 1.7 Laws of Light: How to Light Glass
- Canal: The Slanted Lens (fotografia real) | https://youtu.be/M9NlA7yzFrw | 6 min
- **Nota: 5** (princípio de vidro mais claro de todos) | Versão: n/a (estúdio físico)
- Luz direto no vidro: ele "engole", só gera pontinhos especulares, some.
- **Vidro se define pelo que está atrás dele.** Superfície branca iluminada atrás = vidro aparece.
- **Quanto menor a área branca atrás, mais fortes as linhas pretas laterais** que desenham o vidro.
  Área branca grande apaga as bordas.
- Setup 1: feixe estreito numa cartolina branca atrás + bandeiras pretas à esquerda e direita.
- Setup 2: acrílico fosco ~1,2 x 1,2 m atrás, luz atravessando por trás; **difusão dupla** para não
  ver o hot spot da fonte. Pode curvar o acrílico em ferradura em volta.
- Setup 3: softbox atrás apontado para a câmera, potência bem baixa (você olha direto pra fonte),
  com defletor interno; não subir demais para manter a linha preta no topo também.
- Regra-mãe: branco atrás clareia o interior, preto em volta desenha as bordas (inclusive em cima).

### 1.8 Tutorial: Cinematic Lighting in Blender
- Canal: Polyfjord | https://youtu.be/si7UAgvBd4Y | 14 min
- **Nota: 4** | Versão: 3.1 (Cycles)
- Mentalidade: não "minha cena está escura, adiciono luz"; sim "**minha cena precisa de sombra para
  mostrar a forma**". Posiciona a luz para gerar o máximo de sombra informativa.
- **Rig de uma luz só** (ele usa em ~80% do trabalho): área grande, acima e **um pouco atrás** do
  ponto de interesse, inclinada. Luz cai como "capa" nos ombros, rebate no chão e volta.
- Área emite só em 180°: a borda do hemisfério desenha uma linha dura no fundo. Corrigir girando a área.
- Dentro x fora: luz entre câmera e objeto (lado de dentro) = revela tudo, chapado. Luz entre objeto
  e fundo (lado de fora) = mistério, silhueta. O cinema ilumina majoritariamente de fora.
- O rebote do Cycles faz boa parte do trabalho; no EEVEE o mesmo rig perde força.
- Fundo infinito com bevel, mundo 0, base color do fundo abaixada (fundo mais escuro).

### 1.9 Professional Product Lighting in Blender 4.0 (Masterclass parte 3)
- Canal: The Blenderender | https://youtu.be/-WXnwW6Bnvw | 9 min
- **Nota: 4** | Versão: 4.0
- **Escala real é pré-requisito de luz.** Lata importada com 1,92 m: área mal iluminava. Reduzida a
  15 cm, **10 W já iluminam**. Queda de luz e DoF dependem de metros reais.
- Na escala errada, para ter o mesmo desfoque ele precisaria de f/0,8; na escala certa f/2,8 resolve.
- Rim: segunda área girada 180°, recuada até "sentar" na borda da lata; tamanho decide mais duro ou
  mais suave.
- **Preenchimento de proteção para o grade:** área gigante, **8 m, 30 W**, em ângulo, só para os pretos
  não esmagarem. Quase invisível, mas deixa margem na correção de cor.
- Fundo infinito com bevel; composição em terços; DoF focando na lata central.

### 1.10 Master Cinematic Lighting Techniques in Blender (cena noturna)
- Canal: Animatable | https://youtu.be/hw_I9gJH8VE | 9 min
- **Nota: 3** | Versão: 3.x/4.x
- HDRI resolve dia, mas é pouco editável (só rotação no Z e força); de noite fica chapado ou ilegível.
- Troca por Sky Texture procedural: sol (lua) ligado como luz direcional fraca que vira rim; ar ↑
  alaranja, poeira ↑ difunde, ozônio ↑ azula.
- Chave: área na **mesma direção da lua**, reforçando localmente (parece que a lua é mais forte).
- Preenchimento: área por cima, mais fraca e **com a mesma cor do ambiente (azul do céu)**. Se a cor
  for outra, parece uma segunda fonte inventada.
- Contraluz alaranjada motivada por um poste imaginário fora de quadro: introduz a cor complementar.
- Gobos de folhas e cáusticas de água (add-on) para textura de sombra.

### 1.11 Master Lighting in Blender Under 6 Minutes
- Canal: RenderRides | https://youtu.be/XcJyW5iBKlU | 6 min
- **Nota: 3** | Versão: 4.x
- Ferramentas: pontual (raio amacia), sol (angular diameter amacia), spot (raio, blend da borda,
  tamanho do cone), área (spread foca ou espalha), malha emissiva, mundo/HDRI, IES, gobo, volume,
  light/shadow linking.
- **Escalar tamanho e potência junto com a distância mantém o mesmo visual**; tamanho relativo é que
  manda na dureza da sombra.
- Forma da fonte aparece no reflexo: retangular = brilho alongado (janela, strip); redonda = ponto.
- Esquemas: três pontos; high key; low key; split (chave a 90°, meio objeto em sombra); Rembrandt;
  butterfly (luz acima e um pouco à frente); chiaroscuro.
- Tipos: não motivada, motivada (fonte crível fora de quadro), prática (fonte visível em cena).
- Mostrou uma tabela de temperaturas e potências na tela que **não está na transcrição** (lacuna).

### 1.12 Blender Light Linking Is FINALLY HERE!
- Canal: Architecture Topics | https://youtu.be/KodvsIpPeG0 | 6 min
- **Nota: 3** | Versão: 3.6 beta (Cycles)
- Light linking no objeto-luz: aba Shading > Light Linking; cria coleção nova ou usa uma existente;
  ícone por objeto liga/desliga (incluir/excluir).
- **Só controla luz direta:** a esfera ainda ganha laranja rebatido do cubo linkado.
- Shadow linking: mesma lógica, decide quem projeta sombra daquela luz.
- Caso de uso: realçar a espada sem queimar a parede atrás. 1000 W numa área de cena pequena é demais.

### 1.13 Make Objects Ignore Light Source
- Canal: Default Cube | https://youtu.be/WacqnIJj4Jw | 3 min
- **Nota: 3** | Versão: 4.0/4.1 (Cycles)
- Coleções "lit" e "unlit"; a luz recebe a coleção; dá pra inverter. Cada luz tem seu próprio link.
- O resíduo de luz no objeto excluído vem do rebote indireto (zerando bounces some).
- Shadow linking: o macaco deixa de projetar sombra no plano sem mexer na luz.
- "É como light groups, mas no viewport."

### 1.14 How To Light YOUR Scenes in Blender 3.4+
- Canal: BTB Animations | https://youtu.be/XNMq8mt_ISI | 4 min
- **Nota: 2** | Versão: 3.4 (EEVEE Legacy)
- Use referência (Pinterest/Instagram). Área é a luz "de cinema".
- Luz prática: cursor 3D na luminária do modelo, área nasce no lugar; temperatura para casar com a
  referência.
- EEVEE Legacy: contact shadows (não existe mais no EEVEE novo [conhecimento geral]).
- Segunda luz: pontual duplicada, mais baixa, raio grande, potência menor, levemente saturada.
- Grade: curvas, pretos com toque de azul/verde (sem exagero), mundo azul-escuro bem fraco.

### 1.15 Cinematic Lighting in Blender | Promo Video
- Canal: Gleb Alexandrov | https://youtu.be/XTrZyOXeqZg | 6 min
- **Nota: 1** | Versão: 3.x (promo de curso)
- O diagnóstico clássico de render "sem emoção": chapado, parece foto do dia a dia.
- Lista de ingredientes: lado da chave, direção da sombra, luz maior e mais suave, níveis balanceados.
- Guardar a faixa dinâmica alta do Cycles (EXR) antes do pós; light groups para reequilibrar luzes no
  compositor sem renderizar de novo. Sem valores.

---

## 2. Síntese: regras consolidadas

Formato: **Regra** | por quê | valores | sinal de erro | fonte.

1. **Mundo a zero antes de tudo.**
   Por quê: luz ambiente uniforme vem de todas as direções e mata sombra e direção.
   Valor: World Strength 0 (ou cor preta). Exceção: um mínimo de ambiente colorido quando a cena pede
   (noite azul, item 14).
   Sinal de erro: objeto visível com zero luzes na cena; sombras cinza-lavadas em vez de escuras.
   Fonte: Guru (1.1, 1.2), Archviz, Blenderender (1.4, 1.9), Denzel, Polyfjord.

2. **Escala real em metros antes de acender qualquer luz.**
   Por quê: queda (inverso do quadrado), tamanho relativo da fonte e profundidade de campo são físicos.
   Valor: lata 15 cm acende com área de 10 W; produto de mesa 0,1 a 0,5 m; móvel ~1 m.
   Sinal de erro: precisa de potência absurda (milhares de W) ou f/0,8 para ter bokeh.
   Fonte: Blenderender 1.9; RenderRides.

3. **Trave a câmera antes de iluminar.**
   Por quê: luz depende do ponto de vista; o mesmo rig visto de outro ângulo vira flash.
   Sinal de erro: rig lindo no viewport, chapado no render.
   Fonte: Guru 1.1.

4. **Sombra é o objetivo, não o efeito colateral.** Posicione a luz para desenhar sombra na forma.
   Por quê: o cérebro lê volume pela sombra; sem ela não se distingue ressalto de buraco.
   Valor: chave fora do eixo da câmera, tipicamente 45° na horizontal e elevada; nunca colada à câmera.
   Sinal de erro: objeto "de papel", faces com o mesmo brilho, sem sombra própria.
   Fonte: Guru 1.1/1.2, Polyfjord, Gleb.

5. **A segunda luz é muito mais fraca e não tem razão fixa.**
   Valores observados: 100 W : 45 W (≈2,2:1, Archviz); 25 W : 5 W chave:contraluz (Digitalist);
   Guru rejeita "metade" e manda ajustar no olho até o lado escuro ler mas continuar escuro.
   Sinal de erro: duas luzes de mesma potência = forma achatada.
   Fonte: Guru 1.1, Archviz, Digitalist, Blenderender 1.4.

6. **Tamanho da fonte decide dureza e o nível de detalhe mostrado.**
   Por quê: fonte grande "vê" o objeto por mais ângulos, borra a sombra e esconde textura.
   Valores: chave de produto ~0,8 m (Archviz); preenchimento gigante 8 m (Blenderender);
   rim pequena e dura (Blenderender); especular de e-commerce = área pequena (Digitalist).
   Sinal de erro: arranhões e rebarbas gritando (fonte pequena demais) ou produto sem textura e sem
   brilho (fonte grande demais).
   Fonte: Guru 1.1/1.2, Archviz, Digitalist, RenderRides.

7. **Fonte maior, longe e forte = queda menor = fundo uniforme. Fonte perto = foco por queda.**
   Por quê: dobrou a distância, 1/4 da luz.
   Valores: escalar tamanho e potência junto com a distância mantém o visual (RenderRides).
   Sinal de erro: fundo com mancha clara perto da luz e escuro no topo (luz perto demais); ou objeto
   todo com mesma prioridade quando você queria um ponto focal.
   Fonte: Guru 1.1/1.2, RenderRides.

8. **Separação de fundo vem de rim/contraluz ou de contraste de valor (claro sobre escuro).**
   Valores: rim oposta à chave (RZ 180°) ou atrás a ~45°; 55 W com chave 100 W (Archviz); 5 W com
   chave 25 W (Digitalist). Objeto claro em chão escuro; cor do fundo complementar à do objeto.
   Sinal de erro: a sombra do objeto tem a mesma cor do fundo e a silhueta some.
   Fonte: Guru 1.1, Archviz, Blenderender 1.4, Digitalist, Denzel, Animatable.

9. **Luz para o fundo é uma luz separada, sem sombra, e não toca o produto.**
   Valores: área de 100 a 200 W só no fundo com cast shadow desligado (Archviz); Sun linkado só ao
   fundo (Blenderender 1.4); luz atrás do produto estourando para branco no e-commerce (Digitalist).
   Sinal de erro: fundo escuro e "sujo" atrás de produto bem iluminado; ou sombras duplas.
   Fonte: Archviz, Blenderender 1.4, Digitalist, Guru 1.2.

10. **Light linking para luzes "de função".** Rim e contraluz não podem acender o chão; luz de
    fundo não pode tocar o produto; luz de destaque só no objeto.
    Por quê: separa a função de cada luz sem bandeiras físicas.
    Limite: só luz direta; rebote ainda contamina (zerar bounces resolve, mas muda o resto).
    Sinal de erro: mancha de contraluz no piso; reflexo da rim no fundo branco.
    Fonte: Digitalist, Blenderender 1.4, Architecture Topics, Default Cube, RenderRides.

11. **Metal e vidro se iluminam pelo que refletem/mostram atrás, não pela luz que recebem.**
    Metal: precisa de algo claro e grande para refletir (áreas altas e estreitas, com degradê); sem
    isso fica preto. Vidro: superfície clara atrás e preto dos lados; quanto menor a área branca,
    mais forte a linha preta que desenha a borda.
    Sinal de erro: metal preto/cinza morto; vidro invisível ou só com pontinhos brancos.
    Fonte: Slanted Lens, Digitalist, Denzel, Guru 1.2.

12. **Degradê na fonte em vez de retângulo duro.** O reflexo de uma área lisa é um retângulo branco
    com borda seca; com degradê ele vira faixa que modela o cilindro.
    Valores: plano Emission ~5 com degradê (Denzel); Gradient Texture → Color Ramp na luz (Blenderender
    1.4, Digitalist).
    Sinal de erro: reflexo "janela recortada" na garrafa ou na lata.
    Fonte: Denzel, Digitalist, Blenderender 1.4.

13. **Quina viva não segura luz: bevel.**
    Valores: modificador Bevel 5 segmentos, 0,03 m (no produto do Digitalist).
    Sinal de erro: aresta sem filete de brilho; caixa parece CG.
    Fonte: Digitalist.

14. **Cor de luz: temperatura para natural, RGB para estilizado; contraste quente x frio.**
    Valores: chave 4500 K + preenchimento 7500 K (Archviz); 7500 K no Geolights (Blenderender 1.4);
    Kelvin de referência do Guru. Preenchimento noturno = cor do céu (Animatable).
    Sinal de erro: luzes saturadas (rosa, azul forte) num produto premium dão cara de balada.
    Fonte: Guru 1.1/1.2, Archviz, Animatable, BTB.

15. **Toda luz tem um porquê e é ajustada sozinha.** Isole (esconda as outras), ajuste, religue.
    Fonte: Guru 1.1/1.2, Archviz, Polyfjord.

16. **Contraste no color management, não no "puxa a luz".**
    Os vídeos (Filmic) mandam trocar o look padrão por High Contrast. Exposure global = todas as luzes.
    Exposição conferida com False Color: precisa haver cinza (0 EV) no produto.
    Fonte: Guru 1.2, Archviz.

17. **Preenchimento de proteção para o grade.** Uma área enorme e fraca impede pretos esmagados.
    Valor: 8 m, 30 W (Blenderender 1.9). Sinal de erro: áreas em preto 0 que não voltam no grade.

18. **HDRI só como apoio em produto.** Controle total vem de luzes. HDRI ajuda reflexo e realismo
    de dia, falha de noite e em produto de marca.
    Fonte: Digitalist, Animatable, RenderRides.

### Conflitos entre fontes
- **Distância x suavidade.** Blenderender (1.4) diz que afastar a luz deixa a sombra mais suave. Guru,
  RenderRides e a física dizem o contrário: afastar mantendo o tamanho deixa a fonte **relativamente
  menor = mais dura**. O que suaviza é aumentar o tamanho (ou aproximar). Vale a física.
- **Razão de preenchimento.** Archviz usa ~2:1 por número; Guru chama a regra de metade de bobagem.
  Para uma IA sem olho, o número é ponto de partida e a prova é o False Color + a leitura das faces
  (receita 9).
- **Nomes key/fill/rim.** Guru evita os nomes ("toda luz tem uma função"); os demais usam três pontos.
  Não conflita no resultado.
- **Sol.** Guru e Blenderender evitam (chapa); Digitalist usa de propósito para produto fosco, colorido,
  de verão. Regra: sol é escolha de estilo (dureza, verão), não iluminação padrão.
- **Fundo branco x preto.** Guru: objeto claro em chão escuro para silhueta. Digitalist/Blenderender:
  e-commerce em branco. Os dois valem; no branco a separação tem que vir de sombra de contato e de
  borda escura/reflexo, não de rim clara.

### Versão antiga → Blender 5.2
| Nos vídeos | No 5.2 |
|---|---|
| Filmic + look High Contrast | Cena nasce em **AgX**. Equivalentes: `AgX - Medium High Contrast` ou `AgX - High Contrast`; `AgX - Punchy` para mais saturação [conhecimento geral sobre o efeito do Punchy]. Nunca `Standard`. |
| Nó Blackbody na luz (use nodes) | Temperatura nativa: `light.use_temperature = True; light.temperature = 4500`. |
| "Cast shadow" da luz | `light.use_shadow = False` [conhecimento geral; confirmar por sonda]. |
| Visibilidade de raio (camera/shadow) | `obj.visible_camera = False`, `obj.visible_shadow = False` [conhecimento geral; confirmar]. |
| Light linking (3.6 beta, 4.0 Cycles) | `obj.light_linking.receiver_collection` e `blocker_collection` no objeto da luz (confirmado). Incluir/excluir por objeto fica no vínculo de cada objeto da coleção [conhecimento geral: `collection.collection_objects[...].light_linking.link_state`; confirmar por sonda]. EEVEE novo também suporta light linking [conhecimento geral; testar]. |
| Gradiente/gobo pelo nó da luz | Nós na luz funcionam no **Cycles** [conhecimento geral: EEVEE ignora nós de luz]. Para EEVEE, usar **plano emissivo com degradê** (método Denzel), que vale nos dois motores. |
| EEVEE Legacy contact shadows | Não existe; o EEVEE novo usa `use_raytracing`, `shadow_ray_count`, `shadow_step_count`. |
| Denoise e AO pelo `scene.node_tree` | Compositor em `scene.compositing_node_group`. |
| Área com spread | `light.spread` (grade/colmeia) existe no 5.2; formas `SQUARE`, `RECTANGLE`, `DISK`, `ELLIPSE`. |

---

## 3. Rigs nomeados

Convenção: câmera olhando para +Y a partir de −Y; ângulo 0° = posição da câmera; positivo = sentido
anti-horário visto de cima; "elevação" = acima do horizonte do produto. Ângulos marcados como
"extraído" vieram dos vídeos; os demais são a leitura do que foi mostrado.

### R1. Estúdio quatro luzes quente/frio (Archviz)
Para: móvel, objeto de madeira/tecido, produto físico "premium caloroso".
- Câmera: 45° do objeto, 80 mm, shift em vez de tilt.
- Chave: área, ~45° lateral (extraído), elevada, tamanho 0,8 m, 100 W, 4500 K.
- Preenchimento: área do lado oposto, 45 W, 7500 K, mesmo tamanho.
- Fundo: área apontada só para o fundo, 100 a 200 W, sem sombra.
- Rim: área atrás do objeto a ~45° (extraído), 55 W.
- Fundo infinito com cor complementar ao objeto; roughness do fundo ~1; look de contraste alto.

### R2. Três pontos de produto com fundo emissivo refletido (Blenderender 1.4)
Para: eletrodoméstico, gadget, garrafa; visual "catálogo limpo com reflexo no piso".
- Chave: área RX 90°, RZ 45° (extraído).
- Rim: duplicata em RZ 180° (oposta à chave), escalada no Z para cobrir a altura, pequena/dura.
- Preenchimento: espelho da chave no X global, maior e mais fraca.
- Piso: plano preto metallic 1, roughness 0 (pode subir roughness para reflexo mais borrado).
- Fundo: plano vertical Emission branca 1,3. Rim com light linking **excluindo** o fundo.
- A câmera fica do lado da sombra (oposto à chave) para ficar cinematográfico.

### R3. Laterais simétricas + topo traseiro (Blenderender 1.4, rig 2)
Para: produto alto e simétrico (garrafa, frasco, smartphone em pé); contorno dos dois lados.
- Duas áreas laterais a 90° (RY 90°, extraído), mesma distância (espelho no cursor 3D).
- Uma área atrás e acima, esticada.
- Fundo iluminado por Sun linkado só ao fundo (incluir).

### R4. Teaser de contraluz (Digitalist; Blenderender rig 3)
Para: revelação, lançamento, "o que é isso?", logo metálico, carro.
- Duas áreas atrás do produto, simétricas, ~45° de cada lado por trás (extraído no Blenderender).
- Chão excluído por light linking. Sem chave frontal. Opcional: preenchimento grande e fraco na frente.

### R5. E-commerce fundo branco (Digitalist)
Para: foto de loja, app de produto, SaaS "limpo".
- Área grande e forte acima do produto (difusa).
- Área pequena e fraca só para gerar o ponto especular.
- Área atrás estourando o fundo infinito para branco.
- Alternativa: parede Emission 1,3 (R2).

### R6. Rig de uma luz "capa de luz" (Polyfjord)
Para: personagem, mascote, objeto escultural; clima cinematográfico com um só controle.
- Uma área grande acima e um pouco atrás do ponto de interesse (lado de fora), inclinada para não
  desenhar a linha dos 180° no fundo.
- Depende do rebote do Cycles; fundo escuro.

### R7. Degradê de catálogo (Denzel)
Para: lente, cilindro metálico, garrafa, latinha, perfume.
- Plano Emission escalado 5x, girado 90° no X, atrás/acima, invisível para a câmera, força ~5, com
  degradê; borda dura de um lado dissolvendo do outro.
- Cilindro: dois degradês (alto e baixo).
- Segundo plano com degradê duplo do outro lado: brilho frontal + filete de borda.
- Lado ainda cego: pontual colorida com a cor da marca para filete.

### R8. Metal com strips (Digitalist)
Para: garrafa térmica, lata, peça cromada, logo metálico.
- Áreas altas e estreitas (escalar muito no Z) com degradê na cor/força: duas atrás (uma de cada
  lado) e duas na frente. O metal precisa ter o que refletir em toda a volta para não ficar preto.

### R9. Vidro por trás (Slanted Lens + Digitalist)
Para: copo, garrafa transparente, frasco, tela de vidro.
- Fonte clara **atrás** do vidro (área ou plano emissivo), pequena o bastante para sobrar preto dos lados.
- Bandeiras pretas (planos pretos) à esquerda e direita para desenhar as bordas; manter preto também
  acima.
- Fonte com degradê/difusão (nada de hot spot); potência baixa porque a câmera olha para ela.
- Nada de chave frontal forte no vidro.

### R10. Noite com lua (Animatable)
Para: cena externa noturna, mood.
- Sky Texture: lua fraca como direcional e rim.
- Chave: área na mesma direção da lua.
- Preenchimento: área acima, fraca, azul igual ao céu.
- Contraluz laranja motivada (poste fora de quadro).

### R11. Sol de verão (Digitalist)
Para: produto fosco, cor chapada, verão, bebida, protetor.
- Sun com sombra dura; ângulo maior para amaciar.
- Spot com gobo (folhas, janela) e raio aumentado para a projeção não ficar serrilhada.

### R12. Destaque isolado (Architecture Topics; Guru 1.2)
Para: chamar o olho para um detalhe (logo, botão, rótulo).
- Área ou pontual perto do detalhe, light linking incluindo só aquele objeto; ou luz escondida atrás
  do fundo, batendo só na peça.

---

## 4. Receitas para testar no Blender 5.2

Valores de potência valem para **objeto de ~0,2 a 0,3 m de altura no centro, luzes a ~1,5 a 2 m**,
Cycles. São pontos de partida derivados dos vídeos; a prova é o render e a receita 9.
Todas começam com: `scene.world` força 0, `view_settings.view_transform = 'AgX'`,
`view_settings.look = 'AgX - Medium High Contrast'`, escala real, câmera travada.

**Receita 1. Base de produto quente/frio (R1)**
1. Câmera 80 mm, a 45° do produto, levemente acima; produto girado 20° no Z.
2. Fundo infinito: plano 4 x 4 m, borda traseira extrudada 2 m, Bevel 12 segmentos, offset 0,4 m,
   shade smooth, roughness 0,9, base color complementar ao produto e escura (valor ~0,05 a 0,15).
3. Chave: AREA `RECTANGLE` 0,8 x 0,8 m, a 45° à esquerda da câmera, 35° de elevação, 2 m do produto,
   apontada para ele (Track To), `use_temperature=True`, 4500 K. Começar em 100 W e conferir False Color.
4. Preenchimento: AREA 1,2 m, 45° à direita, 15° de elevação, 45% da potência da chave, 7500 K.
5. Fundo: AREA 1 m atrás do produto, apontada para a curva do fundo, 2x a chave, `use_shadow=False`,
   light linking excluindo o produto.
6. Rim: AREA `RECTANGLE` 0,3 x 1 m, a 135° (atrás e do lado oposto à chave), 30° de elevação, 55% da
   chave, light linking excluindo o fundo.
7. Render A/B ligando e desligando cada luz (uma por vez).

**Receita 2. Catálogo com reflexo no piso (R2)**
1. Piso plano preto: Base Color 0,01, Metallic 1, Roughness 0,05 a 0,2.
2. Parede vertical 3 m atrás: Emission branca, Strength 1,3; `visible_shadow=False`.
3. Chave: AREA 0,6 m, RX 90°, RZ 45°; preenchimento espelhado no X, 1,5 m de tamanho, 1/3 da potência.
4. Rim: duplicata da chave em RZ 180°, escala Z 3x (cobre a altura), tamanho X pequeno (0,15 m).
5. Light linking da rim: coleção com a parede em modo excluir.
6. Câmera do lado oposto à chave.

**Receita 3. Teaser de contraluz (R4)**
1. Fundo preto (base color 0,02), roughness 0,8.
2. Duas AREA `RECTANGLE` 0,2 x 1,2 m, atrás do produto, a 150° e 210°, mesma distância (espelho).
3. Light linking das duas excluindo o chão.
4. Sem luz frontal. Opcional: AREA 3 m na frente, 5% da potência das contraluzes.
5. Animar a câmera ou as luzes devagar para o filete "correr" pela borda [conhecimento geral].

**Receita 4. E-commerce branco (R5)**
1. Fundo infinito branco (base color 0,9).
2. AREA 2 x 2 m acima, 70° de elevação, forte (referência: o produto em cinza/verde no False Color).
3. AREA `DISK` 0,1 m, ~30° lateral, 10% da potência da grande: só o ponto especular.
4. AREA atrás do produto apontada para a parede, forte o bastante para o fundo chegar a branco sem
   estourar o produto; light linking excluindo o produto.
5. Sombra de contato: conferir que o produto tem sombra embaixo (senão flutua).

**Receita 5. Degradê de catálogo para cilindro (R7)**
1. Plano 1 x 2,5 m atrás e acima do produto, girado 90° no X, `visible_camera=False`.
2. Material: Texture Coordinate (Generated) → Separate XYZ (Z) → Color Ramp (preto 0,0 → branco 0,6,
   corte duro de um lado) → Emission Strength 5.
3. Segundo plano igual do outro lado com degradê duplo (Color Ramp preto-branco-preto).
4. Produto cilíndrico: conferir duas faixas de brilho (alto e baixo) e filete nas bordas.
5. Funciona em Cycles e EEVEE (é material, não nó de luz).

**Receita 6. Metal com strips (R8)**
1. Quatro AREA `RECTANGLE` 0,15 x 1,5 m: duas atrás (±150°) e duas na frente (±40°).
2. Em Cycles, cada uma com nó de luz Gradient Texture (Quadratic/Spherical) → Color Ramp → cor; em
   EEVEE, trocar por planos emissivos com degradê (receita 5).
3. Ambiente com algum valor (World 0,05 a 0,1 cinza, ou HDRI de estúdio fraco) para o metal não ter
   preto absoluto onde nada é refletido [conhecimento geral].
4. Conferir: o metal mostra faixas claras definidas e áreas escuras com borda, não um cinza uniforme.

**Receita 7. Vidro por trás (R9)**
1. Vidro: Transmission Weight 1, Roughness 0, IOR 1,45 a 1,5.
2. Plano emissivo atrás do vidro (0,3 x 0,6 m, mais estreito que a "moldura" do quadro), strength 3 a 5,
   com degradê vertical suave.
3. Dois planos pretos (base color 0, roughness 1) à esquerda e à direita do vidro, fora de quadro,
   fechando até as bordas do vidro ficarem com linha preta nítida.
4. Testar o tamanho do plano claro: menor = borda preta mais grossa.
5. Sem área frontal apontada para o vidro.

**Receita 8. Uma luz "capa" (R6)**
1. Uma AREA 2 x 2 m acima do produto e 0,5 m atrás dele, inclinada ~30° para a câmera.
2. Girar até a linha do hemisfério (180°) sair do fundo visível.
3. Fundo escuro. Cycles com bounces padrão.
4. Conferir: topo/"ombros" claros, frente em meia-sombra, rebote suave no chão.

**Receita 9. Medição de exposição e razão (para a IA, que não tem olho)**
1. Render de teste com `view_transform = 'False Color'`.
2. Exigir: produto com zona cinza (0 EV) no lado da chave; lado de sombra em ciano a azul (1 a 2 stops
   abaixo) e não preto; nenhum vermelho no produto fora do brilho especular; rim pode ir a verde/amarelo.
3. Voltar para AgX antes do render final.
4. Alternativa numérica [conhecimento geral]: amostrar a luminância média de duas regiões (lado chave e
   lado sombra) no EXR e mirar 2:1 a 4:1 para comercial claro, 8:1 ou mais para dramático.

**Receita 10. Preenchimento de proteção (Blenderender 1.9)**
1. AREA 8 m, 30 W, em ângulo de frente/lado, longe.
2. Conferir que nenhum ponto relevante do produto fica em preto 0 no False Color.

**Receita 11. Isolar um destaque (R12)**
1. AREA `DISK` 0,2 m a 0,5 m do logo, potência baixa.
2. `light_obj.light_linking.receiver_collection = col_logo` (coleção só com o logo).
3. Conferir que parede e chão não mudaram (comparar render com e sem).

---

## 5. Diagnóstico: olhar um quadro e achar o erro da luz

| Sintoma no quadro | Causa provável | Correção |
|---|---|---|
| Cor lavada, preto cinzento, tudo sem punch | View transform `Standard`, ou mundo cinza ligado, ou look sem contraste | AgX + `AgX - Medium High Contrast`; World força 0 (regras 1 e 16) |
| Cor saturada estourando para branco/amarelo puro nas luzes | `Standard` ou exposição alta | AgX; baixar Exposure ou potência; False Color sem vermelho no produto |
| Objeto chapado, sem volume, faces com o mesmo brilho | Chave no eixo da câmera ou duas luzes iguais | Chave a ~45° e elevada; preenchimento bem mais fraco; mover chave até topo e lateral terem brilhos diferentes |
| Produto "recortado em papel" sobre o fundo, silhueta some | Sem rim/contraluz; fundo com mesmo valor da sombra do objeto | Rim oposta à chave; fundo mais escuro (objeto claro) ou mais claro (objeto escuro); cor complementar |
| Cena escura sem intenção (tudo meio-tom escuro, nada brilha) | Escala errada (luz fraca demais para o tamanho) ou só preenchimento | Conferir escala em metros; ter um ponto de 0 EV e uma área clara de destaque; low key é escolha, precisa de uma área bem iluminada |
| Pretos esmagados sem detalhe no lado da sombra | Nenhum preenchimento nem rebote | Área enorme e fraca (8 m/30 W) ou cartão rebatedor invisível |
| Sombra dura, serrilhada, cara de CG | Fonte pequena demais (ou pontual com raio 0) | Aumentar tamanho/raio; aproximar a área |
| Produto sem textura e sem brilho, "plástico de massinha" | Fonte grande demais e sem especular | Diminuir a chave ou somar uma área pequena para o especular |
| Fundo com mancha clara embaixo e topo escuro | Luz perto demais do fundo (inverso do quadrado) | Afastar a luz e subir potência, ou luz dedicada ao fundo |
| Linha dura cortando o fundo infinito | Borda do hemisfério da área (180°) ou bevel insuficiente | Girar a área; mais segmentos/offset no bevel + smooth |
| Mancha de luz no chão atrás do produto | Contraluz/rim acendendo o piso | Light linking excluindo o chão, ou spot |
| Reflexo retangular duro em garrafa/lata | Área lisa sem degradê | Degradê na fonte (plano emissivo ou nó de luz no Cycles); área estreita e alta |
| Metal preto ou cinza morto | Nada claro para refletir | Strips em volta (R8); ambiente mínimo; HDRI fraco |
| Vidro invisível ou só pontinhos brancos | Luz frontal no vidro; nada claro atrás | Fonte clara atrás + bandeiras pretas laterais (R9) |
| Vidro sem contorno, "lavado" | Área clara atrás grande demais | Diminuir a área clara para sobrar preto nas bordas |
| Arestas sem filete de luz | Quina sem bevel | Modificador Bevel (5 seg, 0,03 m no exemplo) |
| Objeto parece flutuar | Sem chão, sem sombra de contato | Chão/fundo; AO 0,2 m multiplicado 30 a 40% no compositor |
| Luz colorida parece "de balada" em produto premium | RGB saturado em vez de Kelvin | Kelvin quente/frio (4500/7500); cor da marca só num filete |
| Preenchimento parece uma segunda fonte inventada | Cor do preenchimento diferente do ambiente | Mesma cor do ambiente/céu (Animatable) |
| Viewport bonito, render chapado | Câmera mudou depois de iluminar | Travar câmera; relit no ângulo final |
| Rim que some no EEVEE ou rig de uma luz fraco no EEVEE | O rig dependia do rebote do Cycles; nós de luz ignorados | Ligar raytracing do EEVEE; trocar nó de luz por plano emissivo; ou Cycles para o plano final |

---

## 6. Contribuição pro Cérebro de Diretor

O que o diretor deve **pensar** antes de criar a primeira luz:

1. **Primeiro a pergunta da sombra.** "Que forma eu preciso que se leia?" A luz nasce para desenhar
   essa sombra. Iluminar "porque está escuro" é o vício que gerou os testes sem vida.
2. **Cada luz tem um nome de função, não de manual.** Antes de criar: "esta luz existe para ___"
   (desenhar volume, separar do fundo, pintar o fundo, criar o especular, destacar o logo, proteger os
   pretos). Se não completa a frase, não cria.
3. **Escolha de rig pela sensação + material:**
   - Revelação/lançamento/mistério → R4 (contraluz) ou R6 (capa).
   - Confiável, limpo, SaaS/app/loja → R5 (branco) ou R2 (catálogo com reflexo).
   - Premium caloroso, objeto físico → R1 (quente/frio).
   - Metal/cromo/logo metálico → R8 + degradê; vidro → R9; cilindro → R7.
   - Verão/energia/cor chapada → R11 (sol + gobo).
4. **Ordem fixa de construção:** escala → câmera travada → mundo 0 → fundo → chave → medir (False
   Color) → separação (rim/fundo) → preenchimento mínimo → especular/destaques → light linking
   limpando contaminações → AgX + look → render A/B.
5. **Hierarquia de brilho no quadro:** o ponto mais claro e de maior contraste é onde o olho vai.
   Deve ser o produto/logo, nunca o fundo ou o chão. Use queda (luz perto) e spot para escurecer o resto.
6. **Contorno é obrigatório em comercial.** Todo quadro precisa responder: "onde está a borda que
   separa o produto do fundo?" (filete claro, fundo de valor oposto, ou cor complementar).
7. **Luz é dependente de câmera; em motion, pense no movimento.** Se a câmera gira, o rig precisa
   funcionar no arco inteiro ou a luz anda junto [conhecimento geral; os vídeos só tratam quadro fixo].
8. **Material dita a luz.** Fosco mostra a luz; metal e vidro mostram o ambiente. Pergunte "o que esta
   superfície vai refletir?" antes de "de onde vem a luz?".
9. **Auto-crítica com prova:** render A/B em slots, uma luz por vez, False Color, e um "rig radicalmente
   diferente" quando os ajustes ficarem microscópicos.

## 7. Lacunas

- **Nenhum vídeo de fotografia real de metal** (cartões de reflexo, strip boxes, tendas de difusão para
  cromo). Só o de vidro (Slanted Lens). Metal veio só de Blender (Digitalist, Denzel).
- **Potência sem tabela por escala.** Os valores (10 W numa lata de 15 cm; 25/5 W; 100/45/55/200 W
  num móvel) não formam uma regra; a tabela de temperatura e potência do RenderRides aparece só na tela.
  Precisa de sonda própria: potência x distância x tamanho para produto de 0,2 m em Cycles e EEVEE.
- **HDRI de estúdio** (rotação para posicionar reflexo, força, HDRI só para reflexo via Light Path)
  não foi tratado com valores.
- **Light linking por Python** e o EEVEE 5.2 com light linking não aparecem em nenhum vídeo; os
  caminhos `link_state`, `use_shadow`, `visible_camera` estão marcados para confirmar por sonda.
- **Luz animada** (strip passando pelo produto para um brilho "varrer" o metal, luz que acompanha a
  câmera em órbita) não aparece; é central para motion comercial.
- **AgX não aparece em nenhum vídeo** (todos usam Filmic ou falam de "None/High Contrast"). O mapeamento
  dos looks do AgX para os looks do Filmic é tradução, precisa de teste visual.
- **Spread da área** foi citado sem valor útil (Blenderender "reduz para 1"); falta medir o efeito de
  spread baixo (luz colimada, tipo grade) na separação de fundo.
- **Volumetria/névoa para raios de luz** e **gobos** foram citados sem parâmetros.
- **Razão chave/preenchimento medida** em EV: só a Archviz dá números; a receita 9 propõe a medição,
  mas o alvo (2:1 a 4:1) é conhecimento geral.
- O vídeo do Gleb Alexandrov é promo e não traz técnica; o curso em si seria fonte forte sobre luz
  cinematográfica e light groups.
