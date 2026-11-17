---
name: anim-desenho-plano
description: Estilo de animação Desenho plano do EditOS: ilustração flat, formas lisas em cores vivas que entram com mola. Use quando pedirem vídeo animado "flat", "desenho plano", "ilustração moderna" ou o tema for explicação rápida, número, produto ou serviço.
---

# Desenho plano: estilo de animação do EditOS

**2D.** Ilustração flat moderna: formas lisas em cores chapadas e vivas, sem contorno nem sombra, que entram com mola sobre um fundo de cor inteira.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** explicação rápida, dado e número, produto e serviço, curiosidade, conteúdo de marca.
- **Pedidos que chamam este estilo:** "flat", "desenho plano", "ilustração moderna", ou um tema de explicação rápida, número, produto ou serviço.
- **Quando não:** Clima sombrio, história antiga ou assunto que pede textura e mão humana. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** cada cena tem um fundo de uma cor só (`FundoCena`): azul-noite, céu, creme, laranja. Alterne claro e escuro entre as cenas.
- **Cores:** a paleta chapada de `COR`. No máximo quatro cores por cima do fundo. Nada de gradiente, contorno ou sombra.
- **Forma:** geometria lisa: círculo, retângulo de canto redondo, pílula, onda. O desenho é montado por peças sobrepostas.
- **Letra:** Poppins 800 em tudo: manchete grande e etiqueta em pílula, em caixa alta e espaçada.
- **Movimento:** cada peça entra com mola (`mola`, `Peca`), passa um pouco do tamanho e volta, uma depois da outra. Depois a cena respira: gira, corre de lado, cai. Câmera parada.
- **Transição:** um círculo da cor do próximo fundo cresce do centro e cobre a tela (`Bola`), no fim da cena.
- **Legenda:** Poppins 800 branca com contorno azul-tinta, palavra dita em amarelo, a 72% da altura.

**Por quê:** Formas chapadas leem na hora, até na miniatura, e a mola dá energia sem confundir. Duas cores próximas fazem o volume sem sombra, então tudo fica limpo e de marca.

## As peças
Em `sistema/animacoes/src/estilos/desenho-plano/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/desenho-plano'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `mola(t, em)` | o número de 0 a 1 com balanço que anima tudo no estilo |
| `Peca` | qualquer forma que entra crescendo com mola a partir de um ponto |
| `FundoCena` | o fundo de cor inteira da cena |
| `Etiqueta` | rótulo curto em pílula, em caixa alta |
| `Manchete` | texto grande que sobe com mola (até 5 palavras) |
| `Bola` | a transição: círculo de cor que cobre a tela |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Monte o objeto com três a seis formas geométricas chapadas, uma por cima da outra, cada uma num `Peca` com um
tempinho de diferença (0,08 a 0,15 s). Bicho e gente são pílula + círculo + um olho de bolinha. Duas cores
próximas (um tom e um tom mais escuro) dão volume sem sombra.

**Exemplo trabalhado:** "Como funciona o Pix": um celular (retângulo arredondado e tela), um raio amarelo que corre de um celular pro outro na palavra "segundos", uma moeda que pula pro bolso de uma pessoa feita de pílula e círculo, e o check verde no fim.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo desenho-plano`, em `animacoes/estilos/fotos/desenho-plano-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo desenho-plano` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Contorno, sombra, gradiente ou textura: matam o flat.
- Mais de quatro cores por cena.
- Fundo da mesma cor duas cenas seguidas: a `Bola` some.
- Peças entrando todas juntas: a graça é a fila de molas.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
