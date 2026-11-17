---
name: anim-terminal
description: Estilo de animação Terminal do EditOS: tela antiga em fósforo verde, tudo feito de letras e símbolos. Use quando pedirem vídeo animado "terminal", "ASCII", "hacker", "código" ou o tema for tecnologia, programação, dados ou mistério.
---

# Terminal: estilo de animação do EditOS

**2D.** Tela de computador antigo em fósforo verde, onde todo desenho é feito de letras e símbolos.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** tecnologia, programação, dados, mistério, "como funciona por dentro".
- **Pedidos que chamam este estilo:** "terminal", "ASCII", "hacker", "código", ou um tema de tecnologia, programação, dados ou mistério.
- **Quando não:** Tema afetivo, natureza colorida ou criança. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** preto esverdeado com um brilho leve no meio, como tubo de imagem apagado.
- **Cores:** fósforo verde (`COR.verde`), verde quase branco pro texto grande (`COR.claro`), verde escuro pra chão e coisa de fundo, e o âmbar só pro que é quente ou importante (o sol, um alerta).
- **Forma:** não existe traço. Cada desenho é um campo de claro e escuro, e cada ponto vira um caractere: vazio é espaço, meio é `:` ou `+`, cheio é `#` ou `@`.
- **Movimento:** o desenho é impresso de cima pra baixo com uma linha de `#` na frente; depois o campo mexe (raio gira, onda corre, chuva cai).
- **Letra:** JetBrains Mono em tudo.
- **Texto:** dentro da janela do terminal, depois de um `$ comando`, digitado com cursor de bloco piscando.
- **Transição:** a varredura, uma barra verde que desce e apaga a tela.
- **Por cima de tudo:** linhas de varredura e a borda escura do tubo (`Tubo`).
- **Legenda:** JetBrains Mono 800, verde, palavra dita em verde claro, com halo preto, a 72% da altura.

**Por quê:** Desenho feito de letra é a cara do computador por dentro: ar de segredo revelado. O verde único no preto deixa tudo coeso.

## As peças
Em `sistema/animacoes/src/estilos/terminal/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/terminal'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Letras` | pinta uma caixa com caracteres a partir de um campo de brilho; `p` imprime de cima pra baixo |
| `Prompt` | a janela do terminal com o comando e o texto grande digitado |
| `cursor` | o bloco █ que pisca |
| `Tubo` | linhas de varredura e borda escura; vai por último em toda cena |
| `Varredura` | a transição: barra que desce e limpa a tela |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Escreva um campo: uma conta que recebe x e y (de 0 a 1 dentro da caixa) e devolve o brilho de 0 a 1. Forma redonda é
distância até o centro; forma cheia devolve 1 dentro e 0 fora; borda que esmaece usa `Math.exp`. Passe o campo pra
`Letras` com a caixa em volta do objeto. Use o tempo `t` dentro da conta pra ele mexer. Objeto grande lê melhor:
caixa de pelo menos 300 de largura.

**Exemplo trabalhado:** "Como uma senha é quebrada": um cadeado feito de caracteres, as tentativas digitadas em fila que aceleram, a barra de tempo que cresce pra senha curta e some pra senha longa, e o cadeado que abre na palavra "quebrada".

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo terminal`, em `animacoes/estilos/fotos/terminal-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo terminal` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Objeto pequeno demais: com poucas células vira borrão de letras.
- Cor fora do verde e do âmbar.
- Contorno fino: aqui a forma é cheia, feita de claro e escuro.
- Esquecer o `Tubo` no fim da cena: sem ele a tela perde a cara de monitor.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
