---
name: anim-vitral-cosmico
description: Estilo de animação Vitral cósmico do EditOS: rosácea de vitral no espaço, grãos de luz e medalhão no centro. Use quando pedirem vídeo animado "vitral cósmico", "rosácea", "mandala" ou o tema for mistério, ciência, fato curioso ou abertura solene.
---

# Vitral cósmico: estilo de animação do EditOS

**2D.** Uma rosácea redonda flutuando no escuro do espaço, com cada vidro feito de grãos de luz em cor de joia; a cada cena as cores giram do centro pra fora e o medalhão do meio mostra o assunto em traço de luz.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** clima, mistério, ciência, "o que é", fato curioso, abertura solene, lista de etapas curtas.
- **Pedidos que chamam este estilo:** "vitral cósmico", "rosácea", "mandala", ou um tema de mistério, ciência, fato curioso ou abertura solene.
- **Quando não:** Explicação com muitas etapas visuais simultâneas ou tema leve e cômico. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** o espaço quase preto, poucas estrelas e um halo violeta atrás da rosácea.
- **A rosácea:** três anéis de vidros (8, 16 e 24) presos por chumbo preto, com um filete de ouro por fora. Cada vidro é uma nuvenzinha de grãos de luz que ondulam e piscam em onda, do centro pra borda. No começo do vídeo os grãos estão espalhados pela tela e se juntam até formar a rosácea (`junta`).
- **Cores:** sete joias (`JOIAS`): rubi, safira, ouro, esmeralda, ametista, laranja e turquesa. Creme (`COR.luz`) e ouro (`COR.ouro`) pros traços e letras.
- **O medalhão:** o vidro escuro do centro. É ali que a história acontece: o assunto da cena aparece em traço de luz creme que se desenha.
- **Letra:** Cinzel em tudo, com brilho dourado.
- **Movimento:** os grãos respiram sem parar; o ícone do medalhão se desenha e ganha vida (raio gira, chuva cai, folha balança); feixes de luz descem da rosácea.
- **Transição:** a virada das cores (`Rosacea` com `volta` nova e `virada` de 0 a 1): cada vidro troca de joia, varrendo do centro pra fora. Use fusão 0 entre as cenas, a rosácea não some.
- **Legenda:** Cinzel 700, creme com halo dourado e sombra preta, palavra dita em ouro, a 72% da altura.

Diferença pro estilo `vitral`: lá a tela inteira é um painel de cacos chapados e a coisa nasce acendendo cacos; aqui é
uma rosácea só, de poeira de luz no escuro, e a coisa aparece no medalhão do meio.

**Por quê:** A rosácea que gira as cores a cada cena dá ritmo e solenidade, e o medalhão do centro concentra o assunto num selo fácil de ler.

## As peças
Em `sistema/animacoes/src/estilos/vitral-cosmico/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/vitral-cosmico'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `useRosa` | o centro e o raio da rosácea (no vertical, acima da legenda; no deitado, no meio) |
| `Rosacea` | os vidros de grãos e o chumbo; `junta` forma, `volta` e `virada` giram as cores |
| `Medalhao` | o vidro escuro do centro; o desenho entra como filho e ganha brilho |
| `TracoDeLuz` | o traço creme que se desenha; `cheio` pinta por dentro |
| `Feixes` | a luz que desce da rosácea |
| `Letreiro` | texto em Cinzel com brilho |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | ícones prontos do medalhão, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
O desenho mora no medalhão: pense num selo, um contorno de `TracoDeLuz` e um detalhe cheio, centrado em `useRosa()` e
do tamanho de `R * 0.42`. Um coração é um contorno fechado; um relógio é um círculo com dois ponteiros. Duas ideias na
mesma cena: um ícone some e o outro se desenha no lugar, ou dois ícones menores um em cima do outro (como o sol sobre
o mar do exemplo).

**Exemplo trabalhado:** "O que é um eclipse": o medalhão com o Sol em traço de luz, a Lua que desliza por cima, o anel de fogo quando cobre, e as cores da rosácea que escurecem e voltam.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo vitral-cosmico`, em `animacoes/estilos/fotos/vitral-cosmico-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo vitral-cosmico` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Desenho fora do medalhão: a rosácea é a moldura e não divide a tela com outra coisa grande.
- Mais de uma virada de cor por cena: a virada marca a troca de assunto.
- Ícone cheio de detalhe: no tamanho do medalhão só cabe um contorno e um detalhe.
- Texto em cima da rosácea: título vai no alto, acima dela.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
