# cena09: Swiss Grid (Grade suíça)

- **Tipo:** 2D
- **A cena que ele resolve:** princípio, regra, manifesto de abertura, frase de posicionamento.
- **Quando a fala pede:** "regra número 1", "o princípio é", "eu acredito".
- **Completa estes modelos:** texto-e-objeto, autoridade, especialista, motion-ouro.
- **Material e prova:** o sistema faz tudo; só texto dito.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Tipografia suíça em movimento: uma grade rígida, letra preta pesada alinhada à esquerda, um campo vermelho e um
círculo. Tudo cai em linha de grade. É a cara de princípio, regra, manifesto: a frase parece lei.

- **Paleta:** papel `#F0F0E8`, tinta `#101010`, vermelho sinal `#F03820`. Só isso: três cores chapadas.
- **Letra:** Public Sans 800, frase comum, espaçamento bem fechado (-0.05em), alinhada à esquerda e solta à direita.
  A entrelinha é um módulo da grade: cada linha de base pousa numa linha da grade. Legendas pequenas em 600: número
  cheio (01, 02...) e palavra a ~60%.
- **Layout:** quatro colunas iguais de módulo quadrado entre margens largas, linhas finas (2 px) de borda a borda. O
  campo vermelho cobre células inteiras e pode sangrar no topo e na direita. O círculo tem um ou dois módulos e mora em
  cruzamentos. A frase ocupa as fileiras de baixo do campo e passa por cima dele. O quinto de baixo é grade vazia.
- **Textura:** nenhuma. Cor chapada, borda dura.
- **Os movimentos (o vocabulário):**
  - **a grade que se traça:** já no quadro 1 as verticais caem e as horizontais varrem, ~2 quadros uma da outra,
    começo rápido e assentar longo. A ordem vem antes do conteúdo.
  - **o passo de torre:** o círculo anda de célula em célula pelas linhas, cada passo numa mola seca (~9% de passada)
    com borrão de movimento só enquanto anda.
  - **o campo que abre da célula:** o vermelho nasce da célula onde o círculo parou, atravessa as colunas e depois as
    fileiras; cada borda passa da linha e volta para ela.
  - **a linha empurrada da margem:** cada linha da frase sai de trás da margem esquerda, 6 quadros depois da anterior,
    passa ~8% e trava rente.
  - **a legenda que cai da linha:** cada legenda numerada desce de uma linha da grade quando a parte dela pousa.
  - **o recuo e o crescimento:** no fim o círculo recua ~10% e cresce para o lugar de dois módulos.
- **Ritmo:** tudo assentado em ~2,5 s e segura parado.

## Como variar (o jeito, não a demo)

- **A frase é a regra dita**, quebrada em 1 a 3 linhas onde a fala respira ("Preço / não é / valor."; "Faça / antes
  de / pensar."). Linha curta (até ~8 letras) fica no tamanho cheio; linha longa encolhe a letra (o componente faz),
  e mais de 3 linhas é sinal de que a frase não é para este estilo.
- **Batidas = partes da fala:** cada linha entra na palavra que abre aquela linha. As legendas numeradas só existem
  se a fala enumera (três passos, quatro pilares); senão, ficam fora (nenhuma legenda por enfeite).
- **Que movimento cai em que palavra:** os passos do círculo marcam a contagem dita ("um, dois, três"); o campo
  vermelho abre na palavra de força ou na virada ("mas"); o crescimento final do círculo é o ponto da frase. O caminho
  do círculo e o bloco do campo podem mudar de célula: o que não muda é tudo cair em linha de grade.
- **Formatos:** em 9:16 a grade ganha fileiras (mais altura), a frase segue nas fileiras de baixo, acima da legenda da
  casa; em 16:9 a grade ganha colunas e a frase ocupa as da esquerda, o campo as da direita.

## Nunca

- Centralizar a frase ou deixar qualquer borda cair entre linhas da grade.
- Segunda cor de destaque, degradê, sombra, brilho ou grão; letra geométrica ou arredondada.
- Fade: aqui tudo trava, desliza ou cresce de uma linha.
- Rótulo nos cantos como enfeite.
- Reusar a frase e as legendas da demo ("A forma segue o ritmo.", Grade/Campo/Tipo/Círculo) ou o mesmo caminho do
  círculo por hábito.
