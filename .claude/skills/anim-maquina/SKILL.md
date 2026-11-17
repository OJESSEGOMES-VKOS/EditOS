---
name: anim-maquina
description: Estilo de animação Máquina do EditOS: vídeo montado por lista: traço de ouro no escuro e a frase. Use quando pedirem vídeo animado "máquina", "vídeo por lista", "citação com desenho" ou o tema for citação, regra ou série fixa.
---

# Máquina: estilo de animação do EditOS

**2D.** Vídeo montado por uma lista: em cada cena um desenho em traço de ouro se desenha sozinho no alto e a frase dita fica escrita embaixo em serifada itálica creme, sobre gravura escura com poeira dourada subindo.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** citação, texto que é a peça (regra, lista de passos, conselho), série de vídeos iguais em formato, vídeo rápido de fazer com cara solene.
- **Pedidos que chamam este estilo:** "máquina", "vídeo por lista", "citação com desenho", ou um tema de citação, regra ou série fixa.
- **Quando não:** História com personagem e ação contínua, ou assunto que pede cor e cenário. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** gravura escura (marrom quase preto em degradê radial), linhas finas de buril em diagonal a 7%, poeira de ouro subindo devagar e o canto fechado em sombra. Não muda.
- **Cores:** ouro (`#e8c170`) no desenho e nos títulos, creme na frase. Nenhuma outra.
- **Desenho:** traço de ouro de grossura única com brilho, de placa de museu: contorno e um ou dois detalhes, numa caixa de 1000 x 1000. Os traços se desenham em sequência (um a cada 0,23 s) e o desenho cresce de leve enquanto a cena dura.
- **Letra:** Cinzel 700 no título, nos rótulos e no fecho; Cormorant Garamond itálico 600 na frase.
- **Montagem:** em pé, desenho em cima e frase embaixo; deitado, desenho à esquerda e frase à direita (`useCaixas`).
- **Abertura:** o título e o subtítulo já escritos no quadro 0, com o primeiro desenho apagado atrás. **Fecho:** um símbolo que se desenha no centro e uma linha curta.
- **Transição:** a cena apaga nos últimos 0,4 s e a próxima se desenha do zero.
- **Legenda:** **desligada**: a frase dita já está escrita na cena (a `Maquina` monta assim).

**Por quê:** O formato fixo (desenho em cima, frase embaixo) deixa a pessoa só ler e entender, e a montagem por dados faz uma série inteira sair igual sem reescrever cena a cena.

## As peças
Em `sistema/animacoes/src/estilos/maquina/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/maquina'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Maquina` | o vídeo inteiro a partir de dados: `fala`, `titulo`, `subtitulo`, `cenas` ({frases, desenho, rotulo}) e `fecho` |
| `DESENHOS` | a biblioteca de traços genéricos (luz, sol, mar, nuvem, chuva, planta, montanha, casa, estrelas, pessoa, livro, relógio, lâmpada, coração, seta, ciclo) |
| `Ouro` | desenha uma lista de traços em sequência |
| `Desenho`, `Texto`, `Abertura`, `Fecho` | as partes de cada cena, se quiser montar à mão |
| `raios`, `ondas`, `estrela`, `circ` | ajudantes pra escrever traços novos na caixa de 1000 x 1000 |
| `useCaixas` | onde mora o desenho e o texto em cada formato |

## A invenção (o que a fala nova pede e o exemplo não tem)
O vídeo é dado, não cena: escreva a fala (a frase 0 é o título), monte a lista de cenas (quais frases cada uma cobre
e qual desenho) e passe pra `Maquina`. Desenho que falta é uma entrada nova num objeto `desenhos` no próprio
`video.tsx`: uma lista de strings de `<path>` na caixa de 1000 x 1000, cada string um gesto que se desenha. Pense
em placa de museu: uma bicicleta são dois `circ` e três retas; um carro, uma caixa com dois `circ`. Até 6 traços
por desenho. Fala longa (mais de 18 palavras) vira duas cenas.

**Exemplo trabalhado:** "Quatro regras de quem guarda dinheiro" (título + 4 cenas): desenhos novos no video.tsx: um cofre (caixa + fenda + circ), uma balança, um calendário (grade de retas) e uma seta subindo; rótulos I a IV; fecho com o `ciclo`. A fala é a frase escrita.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo maquina`, em `animacoes/estilos/fotos/maquina-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo maquina` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Desenho com mais de 6 traços ou com preenchimento: aqui é linha de ouro.
- Ligar a legenda: a frase já está escrita.
- Cena sem desenho que diga a frase: se não existe, desenhe; `luz` é só o último recurso.
- Frase com mais de 18 palavras numa cena só.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
