# Câmera e movimento

Profundidade: `fontes-youtube/camera-movimento.md` (13 vídeos: Kaizen, George Kayesi, Pierrick
Picaut, Alan Becker, Ryan King Art e outros) e `fontes-youtube/direcao.md`.

## O rig (`anima.Camera`)
`pivo` (no alvo: girar Z = órbita, girar X = inclinação, subir = grua) → `braco` (y negativo =
distância; dolly anima y) → `cam` (Track To no `foco`, que também comanda o desfoque).
`inclinacao` positiva = câmera acima olhando pra baixo. `distancia_por_lente=True` mantém o
tamanho do produto quando o mundo troca a lente (bug de enquadramento corrigido no laboratório).

## Curvas (nomes da biblioteca)
| Nome | Blender | Uso |
|---|---|---|
| `pousa` | EXPO ease-out | entra e assenta (a curva premium) |
| `decola` | EXPO ease-in | sai de quadro |
| `premium` | QUINT in-out | A→B com peso de objeto caro |
| `camera` | SINE in-out | câmera |
| `firme` | CUBIC in-out | UI, cartões |
| `suave` | QUART ease-out | assentar mais macio |
| `ressalta` | BACK ease-out (back 1,2) | overshoot: pop, ícone, argila |
| `elastico` | ELASTIC ease-out | brinquedo (pouco) |
| `linear` | LINEAR | deriva, giro contínuo, câmera cortada nas pontas |
| `degrau` | CONSTANT | troca seca, blocking |

A curva de uma chave vale para o trecho que **começa** nela. Para deriva final linear depois de um
pouso, troque a interpolação da penúltima chave para LINEAR (padrão usado em `teste_anima.py`).

## Tabela de timing (30 fps)
| Ação | Quadros |
|---|---|
| Microantecipação | 1-2 |
| Stagger entre elementos | 2-5 |
| Toque/clique antes da reação | 4-5 |
| Whip pan | 6-10 |
| Ícone estourando (0 / overshoot / final) | 0 / 10 / 15 |
| Assentar com overshoot | 12-18 |
| Transição de órbita (saída + entrada) | 20-25 (corte no meio) |
| Entrada de aparelho | 30 (ease-out) |
| Passagem de luz revelando | 30 (desacelera sobre o produto) |
| Plano curto de montagem no beat | 45-60 |
| Plano de produto com movimento completo | 90-150 |
| Hold de packshot/logo | 45-90 |
| Turntable 360° | 240-360 (mais rápido = vitrine barata) |
| Texto em tela | 30 + 10 por palavra (1 s + 3 palavras/s) |
| Batida a 120 BPM | 15 |

## Movimentos e o que comunicam
Push-in (importância), pull-out (contexto/fechamento), truck lateral (varredura de detalhe),
grua (grandiosidade), órbita 10°-40° (volume), tilt over (frente→cima), flyby (final heroico),
rack focus (muda o assunto/revela), whip (energia, troca sem corte), câmera na mão (realismo:
`na_mao(0,002-0,004)`), turntable (catálogo), ortográfica de cima (grafismo), dolly zoom (choque).

## Transições de produtora
1. **Órbita espelhada com corte no pico:** câmera A acelera saindo, B desacelera entrando, mesmo
   sentido, corte no quadro de maior velocidade, motion blur ligado.
2. **Corte pelo escuro:** a passagem de luz apaga, corta no preto, a próxima acende.
3. **Rack focus como ponte:** corte no borrão.
4. **Troca de luz no quadro do corte:** cada ângulo nasce com a luz certa.
5. **Wipe por shader** (gradiente animado linear em 40 quadros) e **troca de textura por vazio**.
6. **Match cut** de forma (o círculo do relógio vira a lente da câmera).
Passo a passo de todas em `fontes-youtube/camera-movimento.md` (seção 5).

## Vetos (sinais de movimento de software)
Bezier padrão em tudo · câmera girando sem alvo · plano inteiro parado · transição em direção
oposta à do plano anterior · luz estática num produto brilhante · pouso que freia antes do chão ·
ruído do primeiro ao último quadro · texto que sai antes de ser lido · tudo entrando junto.

## Motion blur
`nucleo.motor(..., motion_blur=True, obturador=0,5)` = 180°, o padrão de cinema. Confirmado no
laboratório: o celular entra borrado na direção do giro (`provas/anima/`).
