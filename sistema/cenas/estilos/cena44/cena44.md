# cena44: Neon Silhouette (Silhueta neon)

- **Tipo:** 2D
- **A cena que ele resolve:** "e se...", momento dramático e cinematográfico de uma pessoa.
- **Quando a fala pede:** "e se você parasse", "às 22h", "naquela noite".
- **Completa estes modelos:** personagem, pagina-de-livro, minidocumentario, pregacao.
- **Material e prova:** o sistema faz tudo; silhueta genérica.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um quarto de desenho plano iluminado como filme: a pessoa é uma silhueta preta com um fio de luz vermelha de um lado, e
quem faz o clima é a luz, não o detalhe. É o "e se..." contado com respiração de cinema.

- **Paleta:** quarto ameixa (`#48304F` perto da luz, `#170F1D` nos cantos); céu de pôr do sol que vai de índigo
  `#2F2A57` a rosa `#B3687C`, laranja `#EE8F67` e pêssego `#FFD7A0`; luz morna creme `#FFE2B4`; janelinhas acesas
  `#FFC383`. A pessoa é quase preta `#08070B`, roupa numa cor chapada (teal `#2B6470` na demo).
- **O contorno de luz:** uma cópia vermelho-coral `#FF5A44` da silhueta, deslocada para o lado da luz, com brilho macio.
  Vira uma lua crescente fina. É a assinatura do estilo.
- **A pessoa:** cabeça grande redonda preta, pescoço de palito, roupa chapada com duas ou três dobras finas. Sem rosto:
  dois olhos brancos simples fazem toda a atuação.
- **Duas luzes:** uma de trás (sol na janela, poste, tela) que desenha o contorno, e uma de dentro (luminária, abajur)
  com cone de poeira e poça de luz na mesa.
- **Profundidade em camadas planas:** céu, cidade longe, cidade perto, parede, objetos, pessoa e uma planta desfocada
  colada na lente.
- **Acabamento:** fundo um pouco desfocado, vinheta forte, faixas pretas finas em cima e embaixo, grão de filme.
- **Letra:** um rótulo pequeno no topo, Oswald 600, caixa alta bem espaçada, branco morno com brilho vermelho leve. Os
  números de objeto em Rubik 800 grosso.

**Os movimentos (o vocabulário):**
- **O quarto já vivo:** o primeiro quadro é a cena acesa, poeira no cone, a pessoa fazendo a ação de antes (digitando,
  olhando o celular), câmera já chegando devagar. A planta da frente anda mais rápido que o céu.
- **O objeto que vira:** o objeto da virada muda (página de relógio que cai, tela que acende, carta que chega), com um
  pulinho e a câmera dando um passo.
- **A cabeça que vira:** a ação para, a cabeça gira para a câmera com um susto pequeno, os olhos deslizam e abrem.
- **O rótulo que estoura:** a palavra do momento aparece no topo com mola.
- **O mundo reage:** as janelas da cidade acendem em grupos rápidos, a pessoa pisca.
- **A pausa:** tudo assenta e o último segundo fica parado, sem poeira e sem grão mexendo.

## Como variar (o jeito, não a demo)

- **O quarto, o objeto e a pose são da fala.** O componente é a referência (alguém trabalhando até tarde, relógio
  21:59). "E se você acordasse sem internet" pede um quarto de manhã com a luz fria do celular apagado; "e se o
  ônibus não viesse" pede um ponto à noite com poste atrás. Copie o `Cena44.tsx` e troque o cenário, o objeto da virada
  e a pose, mantendo silhueta, contorno coral, duas luzes, camadas, vinheta e grão.
- **Cor do céu e da roupa** acompanham a hora dita: noite é índigo e azul-petróleo, manhã é pêssego mais claro. O
  contorno coral fica.
- **As batidas seguem a frase.** Uma frase curta ("e se fosse você?") é o quarto vivo, a cabeça que vira e a pausa. Uma
  frase com hora ou número que muda usa o objeto que vira (`horaAntes`/`horaDepois`, os números como foram ditos). Uma
  frase com duas ações pede dois gestos, nunca o relógio só porque a demo tem.
- **O rótulo** é uma palavra que a fala disse ("PRAZO", "MEIA-NOITE"). Sem palavra forte, sem rótulo.
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 corta as laterais (pessoa e objeto perto do meio), em 16:9 corta em
  cima e embaixo, então abra a janela e o cenário para os lados.

## Nunca

- Rosto detalhado (boca, nariz, sobrancelha), contorno grosso, textura realista, sombreado 3D.
- Luz que pisca na pausa final, lens flare, explosão de partículas, tubo de neon. O único brilho é o contorno e as luzes.
- Copiar personagem, elenco ou cena de canal existente.
- Reaproveitar o relógio 21:59, o "PRAZO", o notebook ou a cidade da demo (`componente/textos-demo.json`) quando a fala
  não pede, ou repetir a coreografia da demo batida a batida.
