---
name: anim-tipografia
description: Estilo de animação Tipografia cinética do EditOS: a palavra é o desenho, letras enormes em branco e ouro. Use quando pedirem vídeo animado "tipografia", "motion de texto", "só texto" ou o tema for abertura, anúncio ou frase de impacto.
---

# Tipografia cinética: estilo de animação do EditOS

**2D.** Fundo preto onde a palavra é o desenho: letras enormes em branco e ouro que caem, giram e ondulam.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** abertura, anúncio, motion, frase de impacto e vídeo curto com ritmo.
- **Pedidos que chamam este estilo:** "tipografia", "motion de texto", "só texto", ou um tema de abertura, anúncio ou frase de impacto.
- **Quando não:** Explicação de objeto ou processo físico que precisa ser visto. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** preto puro com uma luz quente fraca no alto. Não muda.
- **Cores:** branco quente, ouro com brilho de metal e, só pra água que cai, azul-gelo (`COR`).
- **Forma:** não tem traço desenhado. Toda coisa é feita da própria palavra: o mar é a palavra "mar" repetida
  ondulando, o sol é "SOL" com anéis de texto girando, a chuva são letras caindo.
- **Letra:** Anton (condensada, em caixa alta) pro peso; Playfair Display itálica em ouro pra o contraponto.
- **Movimento:** a letra entra uma a uma, caindo e passando do ponto. As faixas correm de lado sem parar.
- **Transição:** corte seco com um flash em negativo, e a cena nova faz um zoom lento (`Corte`).
- **Legenda:** Anton em caixa alta, branca, palavra dita em ouro, a 72% da altura, com sombra preta.

**Por quê:** Quando a palavra é a imagem, a mensagem não tem como se perder. O ouro marca a palavra principal e o movimento dá ritmo.

## As peças
Em `sistema/animacoes/src/estilos/tipografia/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/tipografia'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Letras` | a palavra entra letra por letra (`fina` pra itálica, `ouro` pra dourada) |
| `Faixa` | a palavra repetida numa faixa que corre e ondula; empilhada vira mar, chão, multidão |
| `Anel` | a palavra correndo num círculo que gira (dentro de `<Tela>`) |
| `Fio` | o fio de ouro que cresce do centro (sublinha, chão) |
| `Corte` | a transição: embrulha a cena inteira; use fusão 0 |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos feitos de palavra, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pergunte: como essa coisa seria se fosse feita do nome dela? Uma estrada é a `Faixa` com "estrada" correndo; um
relógio é o `Anel` com "hora" girando; uma montanha são palavras empilhadas, a de baixo maior. Uma palavra grande
no centro e o resto em volta, em movimento.

**Exemplo trabalhado:** "As 3 regras pra falar em público": "RESPIRA" que enche e esvazia, "OLHA" com as letras virando pra frente, "PAUSA" que congela no meio, cada uma em ouro sobre o preto e o resto em branco em volta.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo tipografia`, em `animacoes/estilos/fotos/tipografia-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo tipografia` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Ilustração de verdade (ícone, figura desenhada): aqui só tem texto.
- Mais de duas palavras grandes ao mesmo tempo; o resto fica pequeno e apagado.
- Fusão lenta entre cenas: o estilo vive do corte seco.
- Texto pequeno: nada abaixo de 56.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
