# 3D de bloquinho

**Tipo:** 3D Blender
**Cara:** Maquete 3D feita de blocos e formas facetadas, cor lisa e forte, sombra em degraus e contorno escuro, como um brinquedo de montar.
**Bom pra:** "como funciona", ciclo e processo, máquina por dentro, natureza, pequena história com personagem.

## Como é

- **Fundo:** céu em faixas de cor (dia azul-claro, tarde laranja e roxo, noite azul-escuro). Nada de foto nem textura.
- **Cores:** lisas e saturadas, da tabela `COR` do kit. Cada peça tem uma cor só por face; o 3D vem dos degraus de sombra.
- **Traço:** contorno escuro em volta de cada peça (`contorno`). Peça sem contorno parece solta da cena.
- **Forma:** tudo é bloco, cilindro de poucos lados, cone ou bola facetada. Nada liso nem detalhado.
- **Gente:** o boneco de blocos (`boneco`), de cabeça quadrada, com cor de camisa e calça trocáveis. Nunca pessoa real.
- **Letra:** letreiro 3D curto, cor escura que brilha sozinha, no alto da tela.
- **Movimento:** físico e plausível: as coisas crescem, caem, andam, boiam. Nada teletransporta nem pisca.
- **Câmera:** uma câmera só, que aproxima ou passeia devagar e sempre olha pro assunto.
- **Legenda:** o Blender não faz legenda. Ver `animacoes/blender/GUIA.md`, seção "Narração e legenda".

## As peças (em `blender/kit_bloquinho.py`)

| Peça | O que faz |
|---|---|
| `nova_cena` | limpa, põe o tamanho (vertical ou horizontal), 30 qps, céu e sol |
| `bloco`, `cilindro`, `cone`, `bola` | as formas; `ancora='base'` faz crescer do chão |
| `grupo`, `pecas` | junta peças pra mover junto |
| `chao`, `arvore`, `nuvem`, `texto` | prontos de uso comum |
| `boneco`, `andar`, `acenar` | a pessoa de blocos e seus movimentos |
| `contorno` | a borda escura |
| `chaves`, `aparecer`, `sumir`, `balancar`, `cor_em` | o movimento, sempre em segundos |
| `camera` | a câmera que segue um alvo |
| `renderizar` | o quadro de teste, ou o vídeo (com `pasta=`, o fundo3d de um vídeo da oficina) |

## Pra fazer coisa nova

Monte o objeto com 3 a 8 formas simples, como uma criança montaria com peças de encaixe: carro é um bloco, um bloco
menor em cima e quatro cilindros. Junte num `grupo`, passe `contorno` e anime o grupo.

## Evite

- Muita peça pequena: no celular vira ruído.
- Texto pequeno ou longo: até 2 palavras, `tamanho` 1,2 ou mais com a câmera a uns 20 m.
- Câmera girando rápido ou cortando a cada segundo: enjoa e esconde o assunto.
- Assunto principal na faixa de 62% a 82% da altura no vertical (é onde a legenda entra depois).
