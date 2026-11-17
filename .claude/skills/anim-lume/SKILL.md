---
name: anim-lume
description: Estilo de animação Lume do EditOS: desenho animado com o mascote Lume, uma chaminha com rosto. Use quando pedirem vídeo animado "com mascote", "personagem", "pra criança" ou o tema for explicação pra todas as idades.
---

# Lume: estilo de animação do EditOS

**2D.** Desenho animado claro e alegre conduzido por um mascote, o Lume: uma chaminha com rosto que pula de cena em cena, se espanta, sorri e olha pro que importa.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** explicação pra todas as idades, conteúdo infantil, curiosidade, "como funciona", série com personagem fixo.
- **Pedidos que chamam este estilo:** "com mascote", "personagem", "pra criança", ou um tema de explicação pra todas as idades.
- **Quando não:** Tema sério, triste, de saúde ou de marca adulta; e quando o dono não quer mascote. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** céu de dia, azul que clareia pra baixo, com dois clarões brancos bem suaves que passeiam.
- **Cores:** vivas e chapadas (`COR`): céu, azul do mar, verde da grama, amarelo e laranja do Lume, creme do balão, marrom pros rostos e contornos. O contorno é sempre da mesma cor da forma, só que mais escura.
- **Forma:** chapada, redonda e gordinha, com contorno grosso e um reflexo claro. Nada de traço fino nem de detalhe miúdo.
- **O mascote:** o `Lume` aparece em toda cena. Ele flutua, tremula, pisca sozinho e muda de humor (`alegre`, `surpreso`, `piscando`, `dormindo`). Olha pro assunto (`olhar`). Entre as cenas ele PULA em arco pro lugar novo (`pulo`).
- **Letra:** Baloo 2, gorda e redonda, em todo texto.
- **Movimento:** as coisas entram com um pulinho elástico (crescem, passam um pouco e voltam). O mar e a grama sobem de baixo. Quando algo bom acontece, saem faíscas (`Faiscas`).
- **Transição:** uma íris amarela que se abre a partir de onde o Lume estava (`Iris`), no começo da cena.
- **Legenda:** Baloo 2 800, branca com contorno marrom grosso, palavra dita em amarelo, a 72% da altura.

**Por quê:** Um personagem fixo cria vínculo: a pessoa volta pra ver o Lume. Ele olha pro que importa e reage na palavra certa, então guia o olhar sem precisar de texto.

## As peças
Em `sistema/animacoes/src/estilos/lume/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/lume'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Lume` | o mascote: posição, tamanho (`s`), `humor`, `olhar` e `brilho` |
| `pulo` | o arco de um lugar pro outro; devolve `[x, y, s]` pro Lume |
| `Balao` | a pílula creme de borda laranja, com rótulo pequeno e texto grande (até 4 palavras) |
| `Iris` | a transição |
| `Faiscas` | estouro de faíscas, pra comemorar |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Morro` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em adesivo infantil: uma ou duas formas redondas, uma cor viva, contorno da mesma cor mais escura e um
reflexo claro. Um carro é um retângulo arredondado com duas rodas; uma casa é um quadrado com um telhado triangular.
Ponha o Lume perto do assunto, olhando pra ele, e mude o humor dele na palavra que importa (`quando`). O Lume não
fala na tela: quem conta é a legenda.

**Exemplo trabalhado:** "Por que a gente boceja": o Lume num quarto em formas redondas, ele boceja e uma bolha de ar entra (círculo azul claro), o cérebro como uma nuvem rosa que esfria, e o Lume rindo quando outra figura boceja junto. O Lume não fala: quem conta é a legenda.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo lume`, em `animacoes/estilos/fotos/lume-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo lume` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Deixar o Lume de fora de uma cena: ele é o fio do vídeo.
- Lume em cima da faixa da legenda ou cobrindo o assunto.
- Cor escura ou apagada no mundo: aqui é sempre de dia (a noite é só o céu mudando de cor, quando a história pede).
- Mais de um mascote, ou dar falas e nome de gente real pro Lume.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
