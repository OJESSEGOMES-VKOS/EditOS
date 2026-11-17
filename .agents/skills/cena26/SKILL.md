---
name: cena26
description: >
  Estilo de cena cena26 do EditOS (Post como recibo): a postagem real de alguém como prova, com a frase-chave sublinhada. Use quando pedirem "cena X na cena26", "no post como recibo" ou a fala disser "olha o que ele postou".
---

# cena26: Social post receipt (Post como recibo)

Um estilo de cena do EditOS. A cena inteira ganha a linguagem visual dele enquanto a fala dela dura. O estilo é um
**jeito de construir**, não uma cena pronta: a demo (`cenas/estilos/cena26/demo.mp4`) é uma aplicação a uma frase, nunca
o roteiro da cena nova.

## Quando usar
- A fala cita o que alguém postou ou disse por escrito, e as palavras da pessoa são a prova.
- Pedido direto do dono ("cena 3 na cena26", "no post como recibo") manda naquela cena (`cenas/METODO.md` §4).
- Não use quando: não há o print real do post (volta como pergunta), ou é uma conversa de mensagens (cena34) ou uma
  manchete de jornal (cena15).

## Leia antes (de dentro de `sistema/`)
1. `cenas/estilos/cena26/cena26.md`: **A personalidade**, **Como variar** e **Nunca**. É o que manda.
2. `cenas/METODO.md` (o método de cenas) e `JEITO.md` §5 (o teste do clone).
3. `cenas/estilos/cena26/componente/LEIA.md` (as props do `Cena26.tsx`).

## O jeito de construir
1. **Leia a fala da cena primeiro** (o trecho em `src/palavras.json`), antes de abrir a demo de novo.
2. **Copie** `cenas/estilos/cena26/componente/Cena26.tsx` para o `src/` do vídeo e use dentro de uma `<Sequence>` com a
   duração da fala daquela cena.
3. **Componha a partir da frase dita e do print real:** nome, texto, data e números do post como estão no print (G25);
   a `fraseChave` é o pedaço que a fala aponta, onde ele estiver no post; respostas só as que a fala usa (0 a 3); o
   `contexto` resume o que a fala diz sobre o post, ou some.
4. **Palavra na tela = palavra dita ou palavra do print** (números e nomes como estão, G10). Nada da demo entra porque
   "o estilo tem".
5. **Tempos na fala:** o sublinhado cai na palavra que aponta a frase; cada resposta no trecho que a cita (os quadros
   vêm do `palavras.json`), não nos quadros da demo. Formato do vídeo (9:16, 4:5, 16:9): veja "Como variar" na ficha.
6. A legenda da casa segue as regras do `METODO.md` §6.

## O teste do clone (antes do render)
- Nenhum texto de `cenas/estilos/cena26/componente/textos-demo.json` na tela, a não ser que a fala nova diga exatamente
  aquilo.
- Quadro da cena nova ao lado de um quadro da demo: **mesmo estilo?** sim (cartão branco no cinza, um vermelho só,
  sublinhado à mão, números correndo). **Mesma cena?** não (outra pessoa, outro post, outro número de respostas). Se
  parecer "a CEO da demo com outro texto", volte e recomponha.

## Nunca
- Post inventado como se fosse real, ou logo de rede real desenhado.
- Vermelho fora do coração, do número dele e do sublinhado.
- Clonar a demo: mesmas palavras, mesma coreografia batida a batida, mesma quantidade de partes por hábito.
