---
name: anim-neon
description: Estilo de animação Neon do EditOS: letreiros de tubo de neon que acendem numa parede de tijolo à noite. Use quando pedirem vídeo animado "neon", "letreiro", "noturno" ou o tema for música, bar, comida, lista ou clima de cidade.
---

# Neon: estilo de animação do EditOS

**2D.** Parede de tijolo escura à noite onde cada desenho é um letreiro de tubo de neon que acende piscando.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** vídeo noturno, música, bar e comida, lista de destaque, assunto com clima de cidade e de festa.
- **Pedidos que chamam este estilo:** "neon", "letreiro", "noturno", ou um tema de música, bar, comida, lista ou clima de cidade.
- **Quando não:** Tema calmo e afetivo, natureza ou assunto de criança. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** tijolo quase preto com vinheta escura nas bordas. Não muda.
- **Cores:** só as dos tubos (`COR`): rosa, ciano, azul, amarelo, laranja, verde, lilás e branco. Sempre claras e saturadas; a cor escura é só a parede.
- **Traço:** tubo grosso de ponta redonda em quatro camadas: halo largo borrado, brilho, o tubo e um fio branco quente no meio. Nunca forma cheia: neon é linha.
- **Movimento:** o tubo se estende e acende piscando como lâmpada velha (`acende`), depois fica zumbindo de leve. Coisa viva mexe devagar (raio gira, onda corre, chuva cai).
- **Letra:** Tilt Neon, branca com halo da cor do letreiro.
- **Transição:** o apagão, a parede escurece aos trancos no fim da cena.
- **Legenda:** Tilt Neon branca com halo rosa, palavra dita em rosa claro, a 72% da altura.

**Por quê:** O neon acendendo piscando chama o olho como letreiro na rua. A parede escura deixa cada desenho brilhar sozinho, então cabe pouco e o pouco fica forte.

## As peças
Em `sistema/animacoes/src/estilos/neon/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/neon'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Tubo` | um caminho SVG vira tubo de neon; `p` estende, `luz` acende |
| `tubo` | atalho: lista de pontos vira o caminho de um tubo |
| `acende` | o piscar de lâmpada ligando, a partir de um segundo |
| `Letreiro` | texto em neon que acende piscando |
| `Apagao` | a transição: escurece aos trancos |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como quem dobra um tubo de vidro: o contorno do objeto em uma ou duas linhas contínuas, cada parte de uma cor.
Use `circulo()` com `tubo(..., true)` pra redondo e caminho SVG com `q` pra curva. Cada parte acende um pouco depois
da outra (`ini` crescendo), que é o que dá o charme.

**Exemplo trabalhado:** "Os 3 drinks mais pedidos no bar": uma taça de tubo rosa que acende parte por parte, um limão verde, um copo baixo azul com gelo, e o número de cada um em tubo amarelo piscando ao entrar.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo neon`, em `animacoes/estilos/fotos/neon-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo neon` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Muito tubo junto: mais de 5 ou 6 na tela vira borrão de luz.
- Tubo encostado em tubo: deixe espaço escuro entre as linhas.
- Preencher forma com cor: neon é só contorno.
- Texto comprido no letreiro: até 4 palavras, nunca abaixo de 56.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
