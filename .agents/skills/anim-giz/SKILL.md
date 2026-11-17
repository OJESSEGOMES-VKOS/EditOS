---
name: anim-giz
description: Estilo de animação Quadro de giz do EditOS: lousa verde com tudo desenhado a giz na frente de quem assiste. Use quando pedirem vídeo animado "no quadro de giz", "na lousa", "como uma aula" ou o tema for aula, explicação passo a passo ou conta.
---

# Quadro de giz: estilo de animação do EditOS

**2D.** Lousa verde com moldura de madeira; tudo é desenhado a giz na frente de quem assiste.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** aula, explicação passo a passo, curiosidade, conta e comparação.
- **Pedidos que chamam este estilo:** "no quadro de giz", "na lousa", "como uma aula", ou um tema de aula, explicação passo a passo ou conta.
- **Quando não:** Tema de luxo, festa, noite ou marca moderna; e cena que precisa de muitos detalhes ao mesmo tempo. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** lousa verde-escura com manchas de apagador, moldura de madeira. Não muda de cor.
- **Cores:** só giz claro: branco, amarelo, azul, verde, rosa e laranja (`COR`). Nada de cor escura nem de preto.
- **Traço:** risco grosso com grão e tremor de mão (o filtro `giz`). O traço sempre SE DESENHA, nunca aparece pronto.
- **Cor por dentro:** hachura, riscos inclinados, como quem pinta com o giz de lado (`Risco cheio`).
- **Letra:** Fredericka the Great nos títulos (letra de lousa desenhada), Kalam no resto (letra de mão).
- **Movimento:** desenha, espera um instante, ganha vida (balança, cresce, chove). A câmera fica parada.
- **Transição:** o apagador passa e limpa a lousa (`Apagador`), sempre no fim da cena.
- **Legenda:** Kalam 700, branca, palavra dita em amarelo, a 72% da altura.

**Por quê:** É o lugar onde todo mundo aprendeu algo: dá autoridade de professor sem ficar pesado. O traço que se desenha na hora faz a pessoa acompanhar o raciocínio, e o apagador fecha cada passo.

## As peças
Em `sistema/animacoes/src/estilos/giz/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/giz'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Giz` | a camada que dá grão e tremor; todo desenho vai dentro dela |
| `Risco` | um caminho de pontos que se desenha; com `cheio`, pinta por dentro em hachura |
| `Escrito` | texto que se escreve da esquerda pra direita |
| `Apagador` | a transição: limpa a cena |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Seta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Todo objeto é uma lista de pontos passada pro `Risco`. Pense no objeto como um professor desenharia na lousa em dez
segundos: o contorno, um ou dois detalhes, uma cor. Copo é um trapézio; casa é um quadrado com um triângulo.
Use `circulo()` pra formas redondas e `reto` pra formas de quina.

**Exemplo trabalhado:** "Quanto tempo a luz do Sol leva pra chegar na Terra": o Sol a giz amarelo num canto, a Terra azul do outro, uma seta que atravessa a lousa no tempo da fala, a conta "150 milhões de km" escrita e o resultado circulado. O apagador limpa entre a distância e a conta.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo giz`, em `animacoes/estilos/fotos/giz-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo giz` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Desenho cheio de detalhe: giz é simples. Mais de 8 riscos num objeto já é muito.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Deixar a lousa cheia: cada cena apaga a anterior.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
