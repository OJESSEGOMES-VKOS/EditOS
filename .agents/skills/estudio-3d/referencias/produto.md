# Playbook: produto físico, líquido, serviço e logo

Profundidade: `fontes-youtube/produto-liquido.md` (16 vídeos: Derek Elliott, Aryan, OnlyRJ,
Polygon Runway, Mafriend, Malin.mp4 e outros) e `fontes-youtube/estilos.md` (logo).

## O modelo do produto
- **Real primeiro:** CAD, glTF ou FBX do cliente (importar e aplicar escala). Sem modelo, modele
  pelo **perfil real** com `geo.torno` (frasco, garrafa, lata, copo, tampa) e `geo.bloco`
  (caixas, aparelhos), com as medidas do produto em metros.
- **Anime o vazio pai, não a malha** (troca de modelo não quebra a animação).
- Escala aplicada antes de chanfro e textura.

## Comercial de produto em três atos (60-90 quadros por plano)
1. **Mistério:** silhueta com só o contorno aceso, ou o produto saindo do escuro colado na câmera.
2. **Detalhe que vende o recurso:** close (75-135 mm), luz interna trocando por corte, explodida
   (só se o interior vende).
3. **Evento físico e packshot:** encaixe com onda na água, a peça que bate, quebra e volta. Packshot
   longo com câmera andando.

## Planos clássicos por categoria
**Perfume/cosmético:** hero 4:5 com contraluz atravessando o líquido (vende cor e pureza) · gobo de
janela ou folhagem (vende sofisticação; mundo `luz_natural`) · close no rótulo dourado com luz
dedicada ao logo · frasco sobre pedra/vidro fosco com piso glossy · temperatura única quente
(4000 K) em luz e metais.
**Fone de ouvido:** giro 360 em loop com aceleração no miolo (redes) · recorte nos aros metálicos
por baixo/atrás · close no couro com sheen.
**Óculos/gadget:** sobe girando e acelera nos últimos 20 quadros com push-in · close 75 mm na lente
· quebra e volta com estilhaços · filete de luz na cor da marca.
**Eletrônico pequeno:** teaser de silhueta · sai do escuro · macro com LED trocando de cor no corte ·
encaixe na base com onda · explodida com speed ramp.
**Mecânico/CAD:** montado → explodido → pausa → montado, peças desfasadas, micro-rotação no meio.
**Bebida/lata:** lata inclinada (X −18°, Z −25°) atravessando splash em câmera lenta · despejo com
cor da bebida · laço de líquido em espiral com câmera orbitando · ingrediente explodindo em órbita
· hero com condensação e contraluz quente.

## Líquido e splash
Splash comercial é **coreografia, não física**: gravidade zero, força com intensidade em degraus
(0, −2, −0,2, −9), câmera lenta por time scale (1 → 0,2 → 1), qualidade vinda da malha (upres 3-4,
raio de partícula 1,5-1,7). Física real só no despejo. **Confirmar no 5.2** os nomes da simulação de
fluido (Mantaflow) antes de usar (pendente no laboratório). Alternativa barata e controlável: líquido
por Boolean com esfera deslocada (receita 14 de `fontes-youtube/direcao.md`).

## Serviço (sem produto físico)
Dar corpo ao intangível com a **metáfora** (cérebro, seção 3): a sala à noite e de manhã, a pilha de
papel que vira uma folha, o diorama do processo. Mundos que funcionam: `luz_natural` (humano),
`argila` (didático), diorama isométrico (catálogo). Profissão regulamentada: sóbrio, sem promessa,
sem antes/depois quando o conselho proíbe (pesquise as regras atuais do conselho).

## Revelação de logo (assinatura)
Técnicas com passo a passo em `fontes-youtube/estilos.md` (seção 3): luz volumétrica através do
logo, fatias (um grafo gera dezenas de revelações: a melhor contra a mesmice), partículas que viram
o logo (força que vai a zero), tecido rasgando, glitch por shader, varredura de luz no relevo.
Regras: o logo em SVG real do cliente (`bpy.ops.import_curve.svg`, extrusão 1-3% da largura,
chanfro); tingir na pós (luz branca, cor da marca no compositor); **deixar o logo sentar 1 s
parado** no fim; gire o cenário em volta do logo, não o logo.
