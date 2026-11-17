---
name: anim-traco-dourado
description: Estilo de animação Traço dourado do EditOS: pincel de tinta preta em papel de arroz costurado por um fio de ouro. Use quando pedirem vídeo animado "traço dourado", "nanquim com ouro", "fio de ouro" ou o tema for reflexão, origem ou ensinamento.
---

# Traço dourado: estilo de animação do EditOS

**2D.** Papel de arroz quente com tudo pincelado em tinta preta de cerdas; depois um fio de ouro com brilho costura a obra (contorna, atravessa, sublinha) e uma faísca corre por ele.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** reflexão, história com peso, origem das coisas, ensinamento, tema bonito e solene em poucos traços.
- **Pedidos que chamam este estilo:** "traço dourado", "nanquim com ouro", "fio de ouro", ou um tema de reflexão, origem ou ensinamento.
- **Quando não:** Assunto técnico com muitos rótulos, humor, tema infantil colorido ou ritmo frenético. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** papel de arroz creme quente (`#efe5cf`) com fibras curtas em todas as direções e o canto queimado de leve. Não muda.
- **Cores:** tinta quase preta e ouro (escuro, claro e a faísca). Mais nada: sem aguada, sem vermelho, sem cor chapada.
- **Traço:** a pincelada de cerdas (o `Pincel`, o mesmo do estilo `nanquim`): grossa no meio, fina nas pontas, as cerdas de fora secando. Peso cheio vira `Mancha`, tinta que se espalha de baixo pra cima.
- **O ouro:** o `Fio` entra DEPOIS da tinta e marca o que importa: os raios do sol, o reflexo no mar, o caule que sobe, o contorno de uma ideia. Ele tem brilho em volta e uma faísca na ponta que avança; pronto, a faísca corre por ele.
- **Letra:** Cormorant Garamond 700: rótulo pequeno em ouro escuro espaçado e a palavra grande em tinta (`Titulo`).
- **Movimento:** a tinta se desenha, o ouro costura, a faísca corre. Câmera parada.
- **Transição:** a cena nova nasce por cima enquanto a anterior desbota (fusão de 0,45 s).
- **Legenda:** Cormorant Garamond 700 em tinta com halo de papel, palavra dita em ouro escuro, a 72% da altura.

**Por quê:** A tinta mostra a coisa e o ouro mostra o que importa nela: o olho vai direto pro detalhe que a frase quer. O fio com a faísca correndo dá vida a um desenho de poucos gestos.

## As peças
Em `sistema/animacoes/src/estilos/traco-dourado/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/traco-dourado'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Tinta` | a camada em que a tinta bebe no papel; todo `Pincel` vai dentro dela |
| `Pincel` | pincelada de cerdas que se desenha por uma lista de pontos (vem do `nanquim`) |
| `Fio` | o fio de ouro com brilho e faísca; `fechado` dá a volta na forma |
| `Mancha` | forma cheia de tinta que se espalha de baixo pra cima (silhueta, peso) |
| `Titulo` | rótulo pequeno em ouro e a palavra grande em tinta |
| `SeloOuro` | quadrado de ouro com número ou letra, que bate com mola (fecha um título ou o vídeo) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Dois tempos sempre: primeiro a tinta (poucos gestos largos de `Pincel`, ou uma `Mancha` pro que tem peso), depois o
ouro no único detalhe que a frase quer que a pessoa veja. Uma casa é um quadrado e um telhado de duas pinceladas, e o
fio de ouro acende a janela; uma pessoa é uma `Mancha` de silhueta e o fio de ouro desenha o caminho na frente dela;
um coração é uma pincelada só, e o ouro costura a rachadura. Se tudo tem ouro, nada tem.

**Exemplo trabalhado:** "Por que o bambu demora anos e depois dispara" (4 cenas): a terra em pincelada e o fio de ouro descendo como raiz; o broto em Mancha que sobe; o caule de três pinceladas com o ouro marcando os nós; o SeloOuro com o número de metros conferido. Nada de sol, mar ou nuvem.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo traco-dourado`, em `animacoes/estilos/fotos/traco-dourado-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo traco-dourado` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Ouro em mais de um ou dois elementos por cena.
- Aguada, cor chapada ou vermelho: isso é o `nanquim`.
- Desenho cheio de detalhe: mais de 8 pinceladas num objeto já é muito.
- Texto pequeno: nada abaixo de 56.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
