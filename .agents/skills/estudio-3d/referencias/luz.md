# Luz: a cura nº 1 do "sem vida"

Profundidade e fontes: `fontes-youtube/luz.md` (15 vídeos: Blender Guru, Polyfjord, Gleb
Alexandrov, The Blenderender, Digitalist, Slanted Lens e outros). Aqui: o que usar e os valores
calibrados no laboratório.

## Ordem de construção (fixa)
Escala real → câmera travada → mundo quase 0 → fundo → chave → **medir** → separação (contorno) →
preenchimento mínimo → especular (cartões) → bandeiras → light linking → AgX + look → render A/B.

## Calibração (laboratório, Blender 5.2, AgX, exposição 0)
- `luz.rig()` usa `W = 0,15 × força × escala²`. Escala 0,5 = produto de ~15 cm com luzes a ~0,45 m.
  Sem esse fator, o primeiro teste saiu com 28% de branco estourado (varredura em
  `laboratorio/provas/varredura/`: o ponto certo ficou ~3 stops abaixo do chute).
- **Fundo afastado** (`recuo` 1,2 a 1,4 × escala atrás do produto) e **mais escuro que o herói**:
  o inverso do quadrado escurece o fundo sozinho. Com o fundo colado, a imagem sai lavada
  (contraste 0,05). Afastado e neutro: contraste 0,26.
- **Grade na chave** (`espalhamento` 60° a 75°) e no topo (45°): a luz não derrama no piso e cria
  vinheta natural.
- Mundos low-key passam `intencao='escuro'` ao medidor; o herói ainda precisa de um brilho entre
  0,8 e 0,95.

## Os rigs da biblioteca (`luz.rig(nome, alvo, escala, força)`)
| Rig | Posições (azimute°, elevação°; 0 = câmera) | Pra quê |
|---|---|---|
| `produto` | chave (−45, 30) 4800 K grade 70° · preenchimento (60, 10) 1/4 da chave · contornos (±150, 20) 7000 K réguas · topo (0, 85) | o padrão confiável de produto |
| `softbox_topo` | topo (−25, 65) grande, grade 60° · rebate fraco (40, 5) · contorno (170, 25) | cosmético, comida, clay, pop |
| `contorno_duplo` | réguas finas (±120, 10) 3600 K grade 40° · beijo frontal fraco | luxo, revelação, silhueta |
| `dramatico` | chave dura (−70, 35) grade 25° · contorno (150, 15) | drama, tech sério |
| `janela` | sol 3900 K, ângulo 1,2° · céu 9000 K fraco · `luz.persiana()` | luz natural, editorial |
| `neon` | réguas coloridas opostas (±110, 5) · frente fraca | noite, game, música |

Rigs extras documentados em `fontes-youtube/luz.md` (seção 3): quatro luzes quente/frio do
Archviz (chave 100 W/4500 K, preenchimento 45 W/7500 K, rim 55 W), catálogo com fundo emissivo,
laterais simétricas, teaser de contraluz, e-commerce branco, capa de luz, degradê de catálogo,
strips pra metal, vidro por trás, noite com lua, sol de verão, destaque isolado.

## As ferramentas que mudam o jogo
- **`cartao_reflexo`**: painel emissivo invisível pra câmera que vidro, cromo e laca refletem. Põe a
  **linha clara** que define a forma. Força 4 a 8, perto e de lado. Prefira degradê (borda dura de
  um lado, dissolvendo do outro) quando o reflexo retangular ficar duro.
- **`bandeira`**: painel preto invisível pra câmera. Põe a **linha escura** que desenha a borda do
  vidro (fotografia de vidro: luz clara atrás, preto nos lados). Foi o que deu contorno ao frasco.
- **`persiana`**: lâminas entre o sol e o produto que projetam faixas. A assinatura do editorial de
  cosmético. Lembre de `view_layer.update()` antes de ler a matriz do sol (bug encontrado e
  corrigido na biblioteca).
- **`ligar_luz`** (light linking): o contorno ilumina só o produto, a luz do fundo só o fundo.
  Funciona no Cycles e no EEVEE (4.3+). Só controla a luz direta; o rebote passa.
- **Temperatura nativa:** `light.use_temperature = True; light.temperature = K`. Quente na chave,
  frio no contorno = volume. Cor RGB saturada fica pra neon e pra um filete da cor da marca.

## Diagnóstico (sintoma → causa → correção)
| Sintoma | Causa | Correção |
|---|---|---|
| Lavado, preto cinzento | Standard, mundo forte, fundo colado/claro | AgX + look; mundo ≤ 0,3; afastar e escurecer o fundo |
| Estourado | Luz no chute, emissão alta | baixar força (o rig já calibra); tela ≤ 1,0 |
| Chapado, sem volume | chave no eixo da câmera, preenchimento forte | chave a 45° e elevada; preenchimento a 1/4 |
| Produto some no fundo | sem contorno; fundo do mesmo valor | contorno oposto à chave; fundo de valor oposto |
| Vidro invisível | luz frontal, nada escuro nos lados | luz clara atrás + bandeiras |
| Metal preto | nada pra refletir | cartões/strips em volta |
| Mancha de luz no chão atrás | contorno acendendo o piso | light linking ou grade |
| Escuro sem intenção | escala errada; só preenchimento | escala real; um ponto de 0,9 no herói |
| Luz "de balada" em produto premium | RGB saturado | Kelvin quente/frio |
| Rim some no EEVEE | rig dependia do rebote do Cycles | ligar raytracing/fast GI; ou Cycles |

## Luz em movimento
O espectador precisa ver o **reflexo correndo** pela superfície. Escolha UM mecanismo por plano:
o objeto gira sob luz fixa, ou o rig de luz desliza com o objeto quase parado (animar um vazio pai
das luzes/cartões). Os dois juntos viram bagunça. Passagem de luz revelando o produto: ~30 quadros,
desacelerando sobre ele. Troca de luz escondida no quadro do corte.
