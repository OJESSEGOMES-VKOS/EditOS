---
name: anim-bordado
description: Estilo de animação Bordado do EditOS: ponto-cruz num bastidor sobre linho, costurado ponto a ponto. Use quando pedirem vídeo animado "bordado", "ponto-cruz", "costurado" ou o tema for família, receita, memória ou conselho.
---

# Bordado: estilo de animação do EditOS

**2D.** Ponto-cruz num bastidor de madeira sobre linho; cada desenho é costurado ponto a ponto, com a agulha indo atrás.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história de família, receita, conselho, memória, assunto calmo e afetivo.
- **Pedidos que chamam este estilo:** "bordado", "ponto-cruz", "costurado", ou um tema de família, receita, memória ou conselho.
- **Quando não:** Assunto urgente, tecnologia, número que precisa de precisão ou ritmo rápido: o bordado é lento por natureza. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** toalha de linho com trama fina. No alto, o bastidor de madeira com o pano esticado; o pano pode ser tingido (`TECIDO`: cru, céu, nublado, noite, campo).
- **Cores:** linhas de meada firmes (`LINHA`): azul, céu, amarelo, laranja, vermelho, verde, verde claro, marrom, branco, cinza, tinta.
- **Traço:** tudo vira pontos em X numa grade (`Costura`). Corpo é preenchido em fileiras; coisa fina é ponto seguindo a linha.
- **Movimento:** a costura avança ponto a ponto com a agulha e a linha no ponto da vez. Coisa que anda (chuva, onda, vapor) pula de casa em casa na grade.
- **Letra:** DM Serif Display, com a costura tracejada de "ponto atrás" embaixo; rótulo em Playfair Display itálico vermelho.
- **Transição:** um pano novo, da cor da cena seguinte, desce esticado por cima do bordado (`PanoNovo`).
- **Legenda:** DM Serif Display escura, palavra dita em vermelho, halo claro de linho, a 72% da altura.

**Por quê:** A agulha que costura devagar dá tempo e carinho: o tema parece guardado à mão, como coisa de vó. A grade de pontos obriga o desenho a ser simples, e é isso que deixa ele legível no celular.

## As peças
Em `sistema/animacoes/src/estilos/bordado/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/bordado'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Bastidor` | o aro com o pano (cor em `tecido`); tudo que é bordado vai dentro e fica preso ao círculo |
| `useAro` | o centro, o raio e o tamanho da casa da grade, pra desenhar em proporção ao bastidor |
| `Costura` | borda uma lista de formas ponto a ponto (`p` de 0 a 1), com a agulha |
| `Cruz`, `pontosDe` | um ponto em X e a conversão de forma em pontos da grade |
| `Letreiro` | texto com a costura tracejada embaixo, que aparece da esquerda pra direita |
| `PanoNovo` | a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense no risco de bordado de revista: contornos grandes e simples, uma cor por parte. Monte a lista de formas
(`{pts, cor}` pra corpo cheio, `{pts, cor, linha: true}` pra traço) e passe pra uma `Costura`. Desenhe com o tamanho
do raio do bastidor (`useAro().r`): forma com menos de três casas de largura some na grade. Costure as partes em
fila, uma `Costura` por parte, com `p` escalonado.

**Exemplo trabalhado:** "A receita do pão de queijo da vó" (5 cenas): a tigela costurada em bege com o polvilho branco caindo em pontos; o ovo amarelo que entra ponto a ponto; a bolinha enrolada (círculo em ponto-cruz que encolhe); a assadeira com seis bolinhas costuradas em fila; o pão dourado que troca de cor ponto a ponto quando a fala diz "dourar". Nada de sol, nuvem ou chuva.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo bordado`, em `animacoes/estilos/fotos/bordado-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo bordado` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Detalhe menor que duas casas da grade: não aparece.
- Linha da mesma cor do pano (branco no cru, azul-escuro na noite).
- Desenho fora do bastidor: o bordado mora dentro do aro; fora dele, só o texto.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
