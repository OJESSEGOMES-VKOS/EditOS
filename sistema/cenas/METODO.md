# O método de cenas: o vídeo é uma composição, não uma cópia do modelo

Regra do dono (2026-11-03): um vídeo não é o modelo copiado de ponta a ponta. É uma composição de cenas, e cada cena
recebe a edição que a deixa mais interessante e mais didática, decidida ali, para aquela fala. Vale para todo vídeo do
EditOS, em qualquer modelo.

## 1. O que é uma cena
- **Cena = um trecho da fala.** Em geral o que vai até uma vírgula ou um ponto; às vezes dois trechos curtos juntos,
  ou vários cortes da gravação que contam uma coisa só. Quem decide o tamanho é o sentido, não o relógio.
- **Decupar** é dividir a fala inteira em cenas antes de editar: cena 1, cena 2, cena 3... com o tempo de começo e fim
  de cada uma sobre o `src/palavras.json`.
- Cada cena tem uma **função** (a gramática do youtubeedition01 §4 é o mapa geral): mostrar o que é dito, provar o que é
  afirmado, explicar o abstrato, listar, dar peso e respiro, chamar para a ação.

## 2. As três camadas
1. **A casa (o modelo escolhido para o vídeo).** Dá a identidade que vale do começo ao fim: o tratamento da gravação,
   o enquadramento do rosto, a legenda (fonte, tamanho, cor, lugar), a fonte dos títulos, a cor de destaque, o som e o
   ritmo geral. É isso que o `tools/parece.py` mede, e é isso que "parecer o modelo" quer dizer.
2. **O repertório (as respostas possíveis para uma cena).** Para cada cena, o assistente escolhe uma, e só uma:
   - **rosto puro** (respiro, opinião, emoção: muitas cenas são assim, e está certo);
   - **uma resposta da própria casa** (as telas, cartões e efeitos que o `<modelo>.md` descreve);
   - **a resposta de outro modelo** (todo modelo é capacidade: a conta no gelo do youtubeedition01, o contador do
     provaferramenta01, a palavra gigante do storypodcast01, o bonequinho do youtubedark01...), vestida com a identidade
     da casa;
   - **um estilo de cena** (`animationstyleNN`, os 46 de `INDICE.md`), que é uma cena inteira com linguagem própria.
3. **As regras que nunca mudam**, em qualquer cena: só material do dono e prova verdadeira; números e nomes como foram
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
1. **O pedido do dono** para aquela cena ("cena 3 no animationstyle07", "a parte do dinheiro no 30", "cena 5 sem nada").
2. **As regras que nunca mudam** (§2.3). Um pedido que fere uma delas (ex.: estilo de prova sem o print real) volta como
   pergunta, com o plano B.
3. **A identidade da casa.** A legenda continua a mesma no vídeo inteiro, inclusive em cima de um estilo de cena, no
   mesmo lugar, trocando só a cor quando o fundo pede (branca no escuro, tinta no claro). O rosto volta no enquadramento
   da casa.
4. **O visual do estilo**, dentro da cena dele. O estilo traz o mundo dele (paleta, textura, fonte do título interno)
   enquanto está na tela: é isso que faz dele um estilo. Exceção: inserção pequena (estilo dentro de um cartão, com o rosto
   na tela) usa a cor de destaque da casa no lugar do acento do estilo. O dono pode pedir "no visual da casa" para
   recolorir uma cena inteira.
- **Formato:** os GIFs de referência são 4:5. Recomponha para o formato do vídeo (9:16 ou 16:9) respeitando a zona
  segura e a legenda; nunca estique nem corte o essencial.

## 5. Onde a decisão fica escrita e como o estilo vira código
- **O plano de cenas é a primeira parte do `plano.md`** da pasta do vídeo (não há arquivo novo): uma linha por cena.
  ```
  | Cena | Tempo | Fala | Função | Resposta | Por quê | Material |
  | 1 | 0,0–1,4 s | Você está vendo | gancho | rosto, punch-in (casa) | abre no rosto | gravação |
  | 2 | 1,4–3,6 s | lado a lado o resultado | comparação | animationstyle28 Versus | duas edições lado a lado | as duas edições (PEDIDO.md) |
  ```
  Depois do plano de cenas vem o plano frase a frase que o `<modelo>.md` já pede, agora seguindo as cenas.
- **Componente:** a primeira vez que um estilo é usado, o assistente constrói o componente Remotion dele, confere contra o
  `referencia.gif` (quadros lado a lado) e guarda em `estilos/<id>/componente/` (o `.tsx` com as props: textos, tempos,
  cores, formato, e um `LEIA.md` de uma tela com as props e o que foi conferido). Nos vídeos seguintes, copia o
  componente para o `src/` do vídeo e só troca as props. Correção do dono num estilo vai para a ficha do estilo
  (seção "Correções do dono", com data) e para o componente.
- **Prova:** o checador do molde continua valendo para o vídeo todo; a cena com estilo passa pelas mesmas regras de
  legenda, leitura e zona segura. Antes de entregar, olhe os quadros de cada cena com estilo.

## 6. Como o dono pede
- "Edita no youtubeedition01": a casa é o youtubeedition01; o assistente decupa, escolhe cena a cena e mostra a tabela de
  cenas junto com o vídeo, para o dono trocar o que quiser.
- "Cena 3 no animationstyle07" / "o trecho do dinheiro no animationstyle30": manda naquela cena.
- "Cena 5 sem nada": rosto puro.
- "Mostra a decupagem antes": o assistente para depois do plano de cenas e espera.

## 7. 3D: dois nomes, duas coisas
- **3D Blender:** modelagem e render no Blender (o modelo `3d-explicativo` e o `/estudio-3d`). Para mecanismo físico com
  rigor e filme de produto em nível de produtora. Caro e lento (render).
- **3D edição:** profundidade feita no próprio Remotion (perspectiva, CSS 3D, three.js), sem modelagem: os estilos de
  cena marcados "3D edição" no `INDICE.md`. Rápido, cabe dentro de qualquer vídeo.
- Uma cena que pede o mecanismo físico de verdade (como o motor gira por dentro) é 3D Blender; uma cena que pede
  profundidade, objeto girando ou câmera viajando é 3D edição.

## 8. Origem
Os 46 estilos vêm da página "Animation styles" do Notion do dono (cópia fiel em
`../../treinamento/animation-styles/notion-original.md`; cada GIF virou o `referencia.gif` da ficha do estilo, baixados
em 2026-11-03). Os cartões citam os
canais que inspiraram cada linguagem: o estilo é a linguagem visual, nunca a arte, o personagem, a marca ou o nome
desses canais. Os estilos ficam fora do EditOS aberto até o dono decidir.
