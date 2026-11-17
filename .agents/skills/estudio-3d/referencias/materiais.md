# Materiais: tirar a cara de plástico de CG

Profundidade e árvores de nós completas: `fontes-youtube/materiais.md` (18 vídeos: Kaizen, Ryan
King Art, Blender Guru, DECODED, Christopher Fraser, CG Boost, Extra 3D e outros).

## As 6 leis
1. **Aspereza nunca é um número.** Toda superfície tem pelo menos 2 camadas de variação (ruído fino
   + mancha), sutis (±10 a 35%). `materiais.imperfeicao()` faz isso em toda receita.
2. **Grunge cru na aspereza parece molhado.** Comprima a faixa (Map Range), nunca 0 a 1.
3. **Aresta viva é o selo do CG.** Chanfro na malha (`geo.chanfrar`, 0,3 a 2 mm num produto) e,
   no Cycles, nó Bevel na normal pros fios pequenos.
4. **Escala real ou nada.** Ruído de relevo grande demais vira gelatina. Relevo de rótulo: 0,125,
   não 0,2 ("letra de balão").
5. **Sutil vence.** Se a imperfeição aparece na miniatura, está forte. Comercial = novo de caixa:
   imperfeição só no reflexo.
6. **Material e luz se aprovam juntos.** Vidro e metal só existem pelo que refletem (`luz.md`).

## Receitas da biblioteca (valores Principled v2, Blender 5.2)
| Receita | Valores-chave | Nota |
|---|---|---|
| `plastico(cor, 'brilhante'/'acetinado'/'fosco')` | rough 0,12 / 0,32 / 0,62 ±30%; brilhante com coat 0,6 | micro-relevo no acetinado/fosco |
| `metal(tipo, acabamento)` | metallic 1; rough polido 0,04, acetinado 0,16, escovado 0,26 (+ anisotropia 0,75 e riscos esticados), jateado 0,42 | cores F0 reais em `METAIS` |
| `anodizado(cor)` | metal colorido, rough 0,3, micro-relevo fino | notebook, celular, fone premium |
| `vidro(cor, fosco, ior)` | transmission 1, IOR 1,5, rough 0 (ou fosco 0,25-0,45) | tinja de leve: #F4FAF8; espessura real |
| `liquido(cor, ior, turvo)` | IOR 1,33-1,34; cor pela Base Color (limpo) ou Volume Absorption (turvo) | turvo gera ruído no Cycles: prefira limpo |
| `ceramica(cor)` | rough 0,35 + coat 1 rough 0,03 + subsurface 0,05 | louça, embalagem esmaltada |
| `laca(cor)` | coat 1, rough 0,015 | pintura de carro, piano, embalagem premium |
| `argila(cor)` | rough 0,78, sheen 0,4, subsurface 0,15 | mundo argila |
| `tecido(cor)` | rough 0,85, sheen 1, trama esticada no relevo | almofada, roupa |
| `borracha(cor)` | rough 0,7, sheen 0,25, micro-relevo | botões, pés, cabos |
| `iridescente(cor, nm)` | metallic 1, **thin film** 420 nm, IOR 1,4 | holográfico, embalagem metalizada |
| `tela(imagem, brilho, reflexo)` | emissão = imagem, **brilho ~1,0**, coat 0,6 rough 0,02 | acima de 1,3 o AgX desbota a UI |
| `fundo(cor)` | rough 0,55 ±25%, manchas largas | ciclorama, piso |
| `piso_espelhado(cor)` | rough 0,18 ±40%, coat 0,5 | luxo, tech |

## Por que parece falso (checklist rápido)
| Sintoma | Correção |
|---|---|
| Reflexo igual e perfeito | `imperfeicao()` (2 escalas de ruído) |
| Quina sem fio de luz | chanfro; luz que raspa a quina |
| Vidro bolha/lupa | espessura real (perfil com parede no `geo.torno`) |
| Vidro incolor de CG | leve verde-azulado dessaturado |
| Vidro sem borda | bandeiras pretas laterais |
| Interior do vidro escuro | transmission bounces ≥ 8 |
| Retângulo chapado refletido | cartão com degradê; strips |
| Material "2D" | relevo fraco; displacement só em close |
| Emissão não acende | no 5.2 a força nasce 0: defina `Emission Strength` |
| Mapa técnico lavado | rugosidade/normal em Non-Color |
| Imagem limpa demais | grão, vinheta, distorção leve na pós |
| Bevel/Pointiness/AO sem efeito | são de Cycles; no EEVEE, chanfro na malha e máscaras assadas |

## Rótulo e embalagem
Rótulo é pilha de shaders: base (papel/plástico) → Mix com máscara de cromo (rough 0,05) → Mix
com máscara de foil (rough 0,08). Relevo 0,125. Vidro atrás do rótulo sem transmissão. (Jared
Brashier, receita completa em `fontes-youtube/materiais.md`.)
