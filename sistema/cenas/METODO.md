# O método de cenas: o vídeo é uma composição, não uma cópia do modelo

Regra do dono (2026-11-03): um vídeo não é o modelo copiado de ponta a ponta. É uma composição de cenas, e cada cena
recebe a edição que a deixa mais interessante e mais didática, decidida ali, para aquela fala. Vale para todo vídeo do
EditOS, em qualquer modelo.

## 1. O que é uma cena
- **Cena = um trecho da fala.** Em geral o que vai até uma vírgula ou um ponto; às vezes dois trechos curtos juntos,
  ou vários cortes da gravação que contam uma coisa só. Quem decide o tamanho é o sentido, não o relógio.
- **Decupar** é dividir a fala inteira em cenas antes de editar: cena 1, cena 2, cena 3... com o tempo de começo e fim
  de cada uma sobre o `src/palavras.json`.
- Cada cena tem uma **função** (a gramática do youtube-didatico §4 é o mapa geral): mostrar o que é dito, provar o que é
  afirmado, explicar o abstrato, listar, dar peso e respiro, chamar para a ação.

## 2. As três camadas
1. **A casa (o modelo escolhido para o vídeo).** Dá a identidade que vale do começo ao fim: o tratamento da gravação,
   o enquadramento do rosto, a legenda (fonte, tamanho, cor, lugar), a fonte dos títulos, a cor de destaque, o som e o
   ritmo geral. É isso que o `tools/parece.py` mede, e é isso que "parecer o modelo" quer dizer.
2. **O repertório (as respostas possíveis para uma cena).** Para cada cena, o assistente escolhe uma, e só uma:
   - **rosto puro** (respiro, opinião, emoção: muitas cenas são assim, e está certo);
   - **uma resposta da própria casa** (as telas, cartões e efeitos que o `<modelo>.md` descreve);
   - **a resposta de outro modelo** (todo modelo é capacidade: a conta no gelo do youtube-didatico, o contador do
     prova-print, a palavra gigante do pagina-de-livro, o bonequinho do personagem...), vestida com a identidade
     da casa;
   - **um estilo de cena** (`cenaNN`, os 46 de `INDICE.md`), que é uma cena inteira com linguagem própria.
3. **As regras que nunca mudam**, em qualquer cena: o material que o modo do vídeo permite (G24: só materiais, livre ou indicado) e prova verdadeira; números e nomes como foram
   ditos; tempo de leitura; nada repetido na tela ao mesmo tempo (G38); nada pendurado depois da fala (G39); nada
   atravessa corte seco; zona segura; texto nunca sobre o rosto.

## 3. Como decidir cada cena
Para cada cena, nesta ordem:
1. **A cena é crucial para entender?** Não é: rosto puro. Na dúvida, rosto.
2. **Qual a função?** (seção 1). A função aponta o tipo de resposta, não o enfeite.
3. **Qual resposta deixa esta cena mais clara e mais interessante, com o material que existe?** Primeiro a casa e o
   repertório dos modelos; um estilo de cena quando ele resolve melhor (o `INDICE.md` diz a cena que cada um resolve e o
   gatilho na fala). Estilo que pede prova sem a prova real na mão não entra.
4. **Olhe o vizinho.** A mesma resposta em duas cenas seguidas só com motivo (callback, lista). Estilo de cena cheio é
   tempero: um a três por vídeo curto, para os momentos que pedem; o resto é a casa.
5. **O ritmo é da casa.** A cena dura o que a fala dela dura (estilo de cena cheio: em geral 2 a 6 s); nunca se estica a
   fala nem se acelera texto para caber o estilo.

## 4. Quem manda quando duas coisas batem
1. **O pedido do dono** para aquela cena ("cena 3 na cena07", "a parte do dinheiro no 30", "cena 5 sem nada").
2. **As regras que nunca mudam** (§2.3). Um pedido que fere uma delas (ex.: estilo de prova sem o print real) volta como
   pergunta, com o plano B.
3. **A identidade da casa.** A legenda continua a mesma no vídeo inteiro, inclusive em cima de um estilo de cena, no
   mesmo lugar, trocando só a cor quando o fundo pede (branca no escuro, tinta no claro). O rosto volta no enquadramento
   da casa.
4. **O visual do estilo**, dentro da cena dele. O estilo traz o mundo dele (paleta, textura, fonte do título interno)
   enquanto está na tela: é isso que faz dele um estilo. Exceção: inserção pequena (estilo dentro de um cartão, com o rosto
   na tela) usa a cor de destaque da casa no lugar do acento do estilo. O dono pode pedir "no visual da casa" para
   recolorir uma cena inteira.
- **Formato:** as demos são 4:5. Recomponha para o formato do vídeo (9:16 ou 16:9) respeitando a zona
  segura e a legenda; nunca estique nem corte o essencial.

## 5. Onde a decisão fica escrita e como o estilo vira código
- **O plano de cenas é a primeira parte do `plano.md`** da pasta do vídeo, gerado do `cenas.json` pelo
  `tools/decupar.py <pasta> --plano` (§6): uma linha por cena ou subcena.
  ```
  | Cena | Tempo | Fala | Resposta | Por quê |
  | 1.1 | 0,5–5,3 s | Você está vendo lado a lado o resultado... | cena28 Versus | comparação: duas edições lado a lado (material: as duas edições) |
  | 1.2 | 5,3–6,7 s | e o GPT-Astra. | rosto, punch-in (casa) | o nome fecha a frase no rosto |
  ```
  Depois do plano de cenas vem o plano frase a frase que o `<modelo>.md` já pede, agora seguindo as cenas.
- **Componente:** a primeira vez que um estilo é usado, o assistente constrói o componente Remotion dele, confere contra a ficha e a demo e guarda em `estilos/<id>/componente/` (o `.tsx` com as props: textos, tempos,
  cores, formato, e um `LEIA.md` de uma tela com as props e o que foi conferido). Nos vídeos seguintes, copia o
  componente para o `src/` do vídeo e só troca as props. Correção do dono num estilo vai para a ficha do estilo
  (seção "Correções do dono", com data) e para o componente.
- **Prova:** o checador do molde continua valendo para o vídeo todo; a cena com estilo passa pelas mesmas regras de
  legenda, leitura e zona segura. Antes de entregar, olhe os quadros de cada cena com estilo.

## 6. Os dois modos: semiautomático e automático (G41)
**A demarcação é a mesma nos dois.** O `tools/decupar.py oficina/<pasta>` (o `novo-video.py` já roda no fim) divide a
fala em **cenas** (até um ponto, ou uma pausa longa: o ponto imaginário) e **subcenas** (até uma vírgula, ou uma pausa
média: a vírgula imaginária), numeradas `1`, `2.1`, `2.2`... Trecho longo demais sem marca ganha uma vírgula imaginária
num lugar que respira (nunca entre artigo e nome nem no meio de um número). É a regra do dono: tela nenhuma fica pela
metade de uma ideia, então ela só troca onde a fala fecha um pedaço. Tudo fica em `<pasta>/cenas.json`.

**Modo semiautomático** (o dono diz "semi", "semiautomático", "me manda a decupagem" ou "mostra as cenas antes"):
1. Mostre ao dono a lista do `decupar.py` como está (número, tempo, fala; "(imaginária)" onde a marca foi uma pausa),
   e pare. Nenhuma tela é escolhida antes da resposta dele.
2. Ele responde cena a cena, do jeito que quiser: "1 - cena04; 2.1 - prova-print contador; 3 a 5 -
   rosto; 6 - tela da casa". Aceite número de cena (vale para todas as subcenas dela), subcena, intervalo ("3 a 5") e
   nome solto ("hook dinâmico", "a tela do print"): traduza para o estilo ou a resposta de modelo mais perto
   (`INDICE.md`, o repertório do `<modelo>.md`) e diga qual escolheu.
3. Cena que ele não citou: a casa decide (como no automático) e a lista de volta marca "(escolha minha)", para ele
   trocar. Se ele disser "o resto sem nada", é rosto puro.
4. Antes de construir, devolva a lista com as respostas em uma mensagem (`decupar.py <pasta> --lista`) só se alguma
   tradução de nome solto foi incerta; senão, siga direto.
5. Pedido que fere as regras que nunca mudam (§2.3: estilo de prova sem o print real, por exemplo) volta como pergunta
   com o plano B, antes de construir.

**Modo automático** (o dono diz "automático", "decide você" ou só "edita no <modelo>"): o assistente decupa e escolhe
cada cena pelo §3, constrói, e entrega o vídeo com a lista de cenas e respostas, para o dono trocar qualquer uma pelo
número ("2.1 na cena12"). Na dúvida entre os dois modos, é o automático.

**Nos dois:** as respostas e o porquê de cada uma são escritos no `cenas.json` (campos `resposta` e `por_que`, mais
`modo`, `casa` e `legenda_base` no topo). Antes do render, `tools/decupar.py <pasta> --plano` confere (toda cena com
resposta e porquê, todo nome de modelo e estilo existente, nenhum estilo cheio repetido em seguida sem motivo) e grava a
tabela como `## Plano de cenas` no topo do `plano.md`. A troca de tela acontece no limite de cena ou subcena, nunca no
meio dele. Correção depois do vídeo ("2.1 no 12") muda só aquela linha do `cenas.json` e aquela cena do código.

**Outros pedidos que valem nos dois modos:**
- "Cena 3 na cena07" / "o trecho do dinheiro na cena30": manda naquela cena.
- "Cena 5 sem nada": rosto puro.
- "Junta 4.1 e 4.2" / "separa a 6 em 'Isso me permitindo' e o resto": o assistente ajusta a demarcação no `cenas.json`
  (no limite de palavra) e segue.

### A legenda base ("legenda padrão consistente em <modelo>")
Quando o dono pede a legenda de um modelo para o vídeo todo (`legenda_base` no `cenas.json`), ela é **a** legenda do
vídeo: a fonte, o tamanho, a cor, o lugar, o pedaço de palavras e o tempo de leitura daquele modelo, do começo ao fim,
mesmo que a casa seja outra (ex.: casa youtube-didatico, legenda minidocumentario). Ela só sai de cena dentro da **zona de
atuação** de um modelo ou estilo que traz a fala como imagem (a palavra gigante do pagina-de-livro, a letra dinâmica do
dynamiclyrics01, o texto que é a própria tela de um estilo): ali a fala aparece do jeito daquela zona. Para ficar
harmônico, e não um Frankenstein:
- uma legenda por vez: na zona, a base some; nunca as duas ao mesmo tempo (G38);
- a troca é no limite da cena, junto com a troca de tela, e a base volta igual no pedaço seguinte, no mesmo lugar;
- a zona usa a cor de destaque e a fonte de título da casa quando o estilo deixa (§4.4), para não chegar uma terceira
  identidade;
- zona que não mostra a fala (um gráfico, um print, um estilo sem texto falado) não tira a base: ela continua por cima,
  trocando só a cor quando o fundo pede (branca no escuro, tinta no claro);
- sem pedido de legenda base, a legenda é a da casa.

## 7. 3D: dois nomes, duas coisas
- **3D Blender:** modelagem e render no Blender (o modelo `3d-como-funciona` e o `/estudio-3d`). Para mecanismo físico com
  rigor e filme de produto em nível de produtora. Caro e lento (render).
- **3D edição:** profundidade feita no próprio Remotion (perspectiva, CSS 3D, three.js), sem modelagem: os estilos de
  cena marcados "3D edição" no `INDICE.md`. Rápido, cabe dentro de qualquer vídeo.
- Uma cena que pede o mecanismo físico de verdade (como o motor gira por dentro) é 3D Blender; uma cena que pede
  profundidade, objeto girando ou câmera viajando é 3D edição.

## 8. Origem
Os 46 estilos são linguagens visuais desenhadas em código no EditOS; o estilo é a linguagem, nunca a arte, o
personagem, a marca ou o nome de alguém.
