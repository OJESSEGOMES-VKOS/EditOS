# cena46: Blue Grid (Grade azul (como funciona))

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** como uma máquina funciona por dentro, em corte.
- **Quando a fala pede:** "como funciona o", "por dentro do motor".
- **Completa estes modelos:** motion-ouro, personagem; mecanismo físico com rigor: 3d-como-funciona (Blender).
- **Material e prova:** o sistema faz tudo; física verdadeira.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um modelo de argila branca sobre uma folha de engenharia azul, com um pedaço cortado para mostrar por dentro. É a
linguagem do "como funciona" de canal sério: limpo, frio, e a única coisa quente é o que corre lá dentro (ar, calor,
força, dinheiro, sinal).

- **Fundo:** azul de engenharia profundo, mais claro numa poça atrás do modelo (`#1E5A9C`), caindo para `#0B417D` e
  `#042D61` nas bordas. Por cima, uma grade fina (linha a cada 66 px, outra mais fraca no meio), levemente torta como
  papel impresso.
- **O modelo:** argila fosca branco-acinzentada `#EAEEF2` com sombra azul fria. As faces cortadas um tom mais escuras
  `#BCC8D5`, peças internas `#D2DBE5`, poucas linhas finas de painel `#45515F` na pele. Sem metal, sem textura real.
- **O corte:** um quarto do objeto aberto desde o primeiro quadro, de um ângulo três-quartos alto. Ninguém precisa
  "abrir" nada: a gente já está olhando por dentro.
- **O único quente:** o fluxo. Laranja `#F38F3F` enquanto está frio, indo a vermelho `#F25148` onde é apertado ou
  queimado. As linhas e o miolo quente são os únicos brilhos.
- **Letra:** Montserrat 600. Título no alto à esquerda (~72 px, branco-gelo com sombra escura); chamadas em caixa alta
  espaçada (~40 px) sobre fios brancos finos.
- **Luz:** uma luz grande e macia do alto à esquerda, preenchimento azul do ambiente, sombra suave dentro do corte.

**Os movimentos (o vocabulário):**
- **Já girando:** o modelo cortado gira devagar desde o primeiro quadro, com a peça móvel em marcha lenta.
- **O fluxo que entra:** linhas laranja com ponta brilhante entram por um lado e percorrem o caminho real da coisa.
- **A peça que acelera:** a parte que trabalha (pá, engrenagem, pistão) ganha velocidade junto com o fluxo.
- **O aperto e o calor:** onde o fluxo é comprimido ou queimado, a linha avermelha e o miolo acende por dentro.
- **A saída:** o resultado sai do outro lado (jato, luz, água), em vermelho quente.
- **Os pulsos:** pontos claros viajam pelas linhas, mostrando direção.
- **A chamada:** um ponto pousa na peça, um fio sobe até uma régua e a palavra salta em cima.
- **A parada junto:** giro, peça e fluxo freiam juntos; o último segundo fica parado.

## Como variar (o jeito, não a demo)

- **A máquina é a da fala, e é construção sob medida.** O motor turbofan é a demo. Uma fala sobre a geladeira, o coração,
  a caixa d'água ou a turbina de hidrelétrica pede outra máquina: copie o `Cena46.tsx` e troque os perfis (`NAC`, `CORE`,
  as funções `revolve`, `disc`, `cutFaces` servem a qualquer peça redonda; peça de caixa pede faces retas), o caminho das
  linhas de fluxo e onde fica o quente. Mantenha a grade azul, a argila, o corte de um quarto, o único quente e a luz.
  Mecanismo físico com rigor e muitas peças vai para o `3d-como-funciona` (Blender).
- **O fluxo é o que a fala diz que corre:** ar, sangue, água, eletricidade, dinheiro. Sempre laranja virando vermelho
  onde a coisa "aperta" ou "esquenta".
- **As chamadas são as partes ditas, na ordem em que são ditas.** Uma, duas ou três (`chamadas`), com `inicios` na
  palavra de cada uma. A fala cita só uma parte? Uma chamada. Nenhuma? Nenhuma.
- **O título** é o que a fala chama a coisa ("Como a geladeira gela"). Sem título dito, sem título.
- **As batidas seguem a frase:** frase curta é o modelo girando e uma chamada; frase longa que percorre o caminho pede o
  fluxo chegando parte por parte, cada parte acendendo quando é dita.
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 corta as laterais, então deixe o objeto mais vertical (ou mais perto
  da câmera) e as chamadas em cima e embaixo; em 16:9 corta em cima e embaixo, então deite o objeto e espalhe as chamadas
  nos lados.

## Nunca

- Peças voando ou explodindo para fora: o corte é fixo desde o primeiro quadro (separar peças é a cena12).
- Metal realista, textura, avião ou máquina real com marca, logo ou matrícula.
- Tempestade de partículas: poucas linhas limpas contam a história.
- Lens flare, degradê roxo, brilho no texto.
- Reaproveitar o turbofan ou as chamadas da demo (`componente/textos-demo.json`) quando a fala não fala de turbina, ou
  repetir a coreografia da demo (três chamadas nos mesmos tempos) batida a batida.
