# Vitral cósmico

**Tipo:** 2D
**Cara:** Uma rosácea redonda flutuando no escuro do espaço, com cada vidro feito de grãos de luz em cor de joia; a cada cena as cores giram do centro pra fora e o medalhão do meio mostra o assunto em traço de luz.
**Bom pra:** clima, mistério, ciência, "o que é", fato curioso, abertura solene, lista de etapas curtas.

## Como é

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

## As peças

| Peça | O que faz |
|---|---|
| `useRosa` | o centro e o raio da rosácea (no vertical, acima da legenda; no deitado, no meio) |
| `Rosacea` | os vidros de grãos e o chumbo; `junta` forma, `volta` e `virada` giram as cores |
| `Medalhao` | o vidro escuro do centro; o desenho entra como filho e ganha brilho |
| `TracoDeLuz` | o traço creme que se desenha; `cheio` pinta por dentro |
| `Feixes` | a luz que desce da rosácea |
| `Letreiro` | texto em Cinzel com brilho |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | ícones prontos do medalhão, que servem de molde pros novos |

## Pra desenhar coisa nova

O desenho mora no medalhão: pense num selo, um contorno de `TracoDeLuz` e um detalhe cheio, centrado em `useRosa()` e
do tamanho de `R * 0.42`. Um coração é um contorno fechado; um relógio é um círculo com dois ponteiros. Duas ideias na
mesma cena: um ícone some e o outro se desenha no lugar, ou dois ícones menores um em cima do outro (como o sol sobre
o mar do exemplo).

## Evite

- Desenho fora do medalhão: a rosácea é a moldura e não divide a tela com outra coisa grande.
- Mais de uma virada de cor por cena: a virada marca a troca de assunto.
- Ícone cheio de detalhe: no tamanho do medalhão só cabe um contorno e um detalhe.
- Texto em cima da rosácea: título vai no alto, acima dela.
