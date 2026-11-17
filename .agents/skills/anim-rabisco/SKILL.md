---
name: anim-rabisco
description: Estilo de animação Rabisco de canetão do EditOS: canetão preto que ferve com marca-texto borrado por baixo. Use quando pedirem vídeo animado "rabisco", "canetão", "doodle", "marca-texto" ou o tema for dica rápida, ideia simples ou conteúdo divertido.
---

# Rabisco de canetão: estilo de animação do EditOS

**2D.** Folha branca de bloco com desenho de canetão preto que ferve e cor de marca-texto borrada por baixo, um pouco fora do contorno.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** explicação leve, curiosidade, ideia simples, dica rápida, conteúdo divertido.
- **Pedidos que chamam este estilo:** "rabisco", "canetão", "doodle", "marca-texto", ou um tema de dica rápida, ideia simples ou conteúdo divertido.
- **Quando não:** Tema solene, luxo ou institucional sério. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** folha branca de bloco de desenho, com fibra leve e o cantinho escurecido. Sem pauta (pauta é o estilo `caderno`).
- **Cores:** preto de canetão no contorno; amarelo, rosa, azul, verde e laranja de marca-texto só por baixo, translúcidos (`COR`).
- **Traço:** canetão grosso em duas passadas, tremido, que "ferve" 8 vezes por segundo como animação feita à mão. Sempre se desenha.
- **Cor por dentro:** o `Borrao`, pinceladas largas de marca-texto que passam um pouco do contorno, como quem pinta rápido.
- **Letra:** Caveat Brush (letra de pincel atômico) em títulos, palavras soltas e legenda; Patrick Hand pra anotação pequena.
- **Movimento:** contorno se desenha, a cor entra por baixo, a coisa ganha vida aos trancos da fervura. Câmera parada.
- **Transição:** o `Riscado`, um marca-texto gigante que cobre a tela em zigue-zague, no fim da cena. Mude a cor a cada cena.
- **Legenda:** Caveat Brush preta, palavra dita em rosa forte, halo branco, a 72% da altura.

**Por quê:** Parece desenhado na hora por alguém animado: leve e engraçado. O marca-texto fora do contorno dá cor sem formalidade.

## As peças
Em `sistema/animacoes/src/estilos/rabisco/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/rabisco'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Canetao` | traço preto que se desenha e ferve (precisa do `t`) |
| `Borrao` | a cor de marca-texto por baixo de uma forma |
| `Forma` | os dois juntos: contorno de canetão com cor por baixo |
| `Letra` | palavra de canetão, torta, entrando palavra por palavra |
| `Riscado` | a transição: marca-texto cobrindo a tela |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Seta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em quem desenha rápido num bloco: contorno redondinho, um ou dois detalhes, uma cor de marca-texto. Use
`Forma` pra coisa com cor e `Canetao` pra linha solta. Toda peça recebe o `t` da cena pra ferver; nunca deixe o
traço parado.

**Exemplo trabalhado:** "Por que a pipoca estoura": o grão de milho com a água dentro (gotinha azul), a panela que esquenta (marca-texto laranja), o grão que treme e estoura numa nuvem branca de canetão, e a pipoca pronta numa tigela.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo rabisco`, em `animacoes/estilos/fotos/rabisco-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo rabisco` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Cor chapada sem contorno: a cor vive por baixo do preto, nunca sozinha.
- Mais de duas cores de marca-texto no mesmo objeto.
- Traço fino: canetão é grosso, nada abaixo de 6.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
