# cena11: 3D Map Route (Rota no mapa 3D)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** onde fica, por onde passou, "fomos de A a B".
- **Quando a fala pede:** nome de lugar, "fui até", "o caminho".
- **Completa estes modelos:** documental-dados, youtube-didatico, rosto-telas.
- **Material e prova:** nomes de lugar reais ditos; mapa é ilustração (sem marca de app).
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma cidade clara em 3D, como o mapa do celular visto de cima, e uma rota azul que se desenha até um alfinete. "Onde
fica" e "por onde passamos" num plano só, satisfatório de ver.

- **Paleta:** cidade quase branca (prédios `#F7F7F5` e `#EEF0F3`, chão `#ECEAE4`, ruas `#FBFBFA`), névoa `#E4E9EE`,
  água `#8EC6EE`, parques `#C9E5BD` com árvores redondas `#9FCF8E`, uma rua principal amarela-clara `#FFE3A3`. Rota
  azul `#1A73E8` com contorno branco; alfinete vermelho `#EA4335` com borda branca. A cidade fica pálida para a rota e
  o alfinete falarem.
- **Letra:** Inter. Lugares em 600 cinza com halo branco; o destino em 700 vermelho; no cartão, os minutos em 800 com
  espaçamento fechado e números de largura fixa, uma linha pequena em 500 embaixo.
- **Layout:** a cidade enche o quadro em vista alta de três quartos. A rota vai de baixo à esquerda até o alfinete no
  alto à direita (cruzando o rio, se houver). Rótulos de lugar em terreno aberto, nunca em cima da rota. O cartão da
  viagem é uma folha larga logo acima do quinto de baixo.
- **Textura:** blocos foscos sob um sol suave (cada prédio com sombra macia), distância sumindo na névoa.
- **Os movimentos (o vocabulário):**
  - **a decolagem atrás do ponto:** o quadro 1 já é a cidade, baixo e perto, atrás do ponto azul que pulsa. A câmera
    sobe e recua primeiro, depois vira e estreita no destino, com pouso longo e macio. Nada de órbita nem balanço.
  - **a rota que segue as ruas:** desenha pelas ruas, vira as esquinas com junção redonda e freia ao chegar. Ponto e
    rota mantêm quase o mesmo tamanho na tela, como no app.
  - **o alfinete que cai:** cai, amassa um pouco no impacto e assenta; o nome do destino entra com passada.
  - **o cartão que sobe:** sobe de baixo com ~10% de passada e os minutos rolam como hodômetro (14, 13, 12).
- **Ritmo:** voo ~3 s, alfinete, cartão, segura o último segundo.

## Como variar (o jeito, não a demo)

- **O destino e os lugares são os ditos.** "A gente saiu da rodoviária e foi até a loja" → ponto azul na rodoviária,
  alfinete na loja. Lugar dito sem nome próprio vira o nome comum ("A loja"). Sem lugares intermediários na fala:
  `lugares` vazio (a demo tem três; o vídeo novo tem os que a fala tiver, de 0 a 3).
- **A rota acompanha a história:** passou por um lugar dito? A rota vira na rua dele. Monte `rota` em 3 a 8 pontos
  nas ruas; a demo é só um exemplo de traçado.
- **O cartão só com dado dito.** "Doze minutos de casa" → cartão com 12 min; sem tempo dito, sem cartão (deixe
  `minutos` vazio). Distância e o texto verde também só se ditos.
- **Que movimento cai em que palavra:** a decolagem cai no "saí de", a rota acompanha o caminho falado, o alfinete
  cai no nome do destino, o cartão no número. Fala curta: rota curta e alfinete logo. Fala longa: um lugar a mais,
  nunca mais de 3.
- **Formatos:** o palco preenche o formato (cidade em volta sobra); em 9:16 o cartão fica acima da legenda da casa,
  em 16:9 o destino fica à direita do centro.

## Nunca

- Marca, cidade real ou dado de mapa real (ruas e nomes são inventados ou do dono, nunca de um app).
- Câmera girando em volta da cidade ou quicando; só alfinete, rótulos e cartão passam do ponto.
- Fade em rótulo ou cartão; modo escuro, neon, rota brilhando, paleta carregada.
- Reusar os nomes da demo ("O Estúdio", "Cidade Velha", "Estação Central", "Parque da Ribeira"), os 14→12 min ou
  o traçado da demo por hábito.
