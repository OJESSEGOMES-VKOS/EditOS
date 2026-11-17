# cena42: Ink Doodle (Rabisco de nanquim)

- **Tipo:** 2D
- **A cena que ele resolve:** canal sem rosto: a pergunta virando história visível.
- **Quando a fala pede:** "e se você", "imagina", pergunta curiosa.
- **Completa estes modelos:** personagem, vetor-minimo, pagina-de-livro.
- **Material e prova:** o sistema faz tudo.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um rabisco de explicativo sem rosto: a pergunta vira uma cena simples que dá pra imaginar, desenhada a nanquim fino
num palco visto de lado. Parece feito à mão em poucos minutos, e é isso que dá vontade de assistir.

- **Traço:** uma tinta só, quase preta `#1D1B1A`, fina, com tremor de mão e pontas redondas. O cenário leva traço de
  3 a 4 px; o personagem, 6 a 7 px, para ser sempre o desenho mais forte do quadro. Sem sombra, degradê ou textura.
- **Cor:** chapada e calma. Céu azul pálido `#A9E2EC` com nuvens brancas contornadas, grama `#7DB25C`, calçada cinza
  quente `#D2CEC5`, rua `#7E848B`, madeira `#B07A4C`, árvore `#6CA555`. Cor de cenário comum, nunca neon.
- **A pessoa:** cabeça grande, redonda e branca, dois olhos ovais pretos, sobrancelha curta, boca pequena, cabelo
  bagunçado marrom `#6A4126` em tufos. Corpo, braços e pernas de palito, mão branca de luva, pé oval preto.
- **O palco:** de lado, como teatro. Céu em cima, chão em faixas, um objeto-herói no meio, um marco de cada lado.
- **Letra:** um só rótulo pequeno em Patrick Hand, caixa alta preta, numa caixa branca de borda tremida.
- **O acento:** um vermelho de pincel atômico `#E1191F`, guardado para a piada (o X, o risco, o "não").

**Os movimentos (o vocabulário):**
- **A cena já pronta:** o primeiro quadro é a cena inteira com a pessoa no lugar. Rabisco não "se monta".
- **O tremor (line boil):** o traço se redesenha a cada 3 quadros. Dá vida de desenho à mão.
- **Aproximação lenta:** a câmera chega uns 5% durante a cena.
- **A coisa que cresce:** um acontecimento que vai aumentando (vento, chuva, fila, pilha), com objetos passando cada vez
  mais rápido, alguns na frente e outros atrás da pessoa, e três riscos de velocidade atrás de quem voa.
- **A reação do corpo:** mãos na cabeça, olho apertado, cabelo voando. A emoção é do corpo, não do rosto detalhado.
- **O objeto que pula:** a coisa da história aparece com um passinho além (mola curta).
- **O risco vermelho:** dois traços rápidos de pincel atômico, o objeto dá um tranco em cada traço.
- **O fecho do corpo:** dar de ombros, apontar, cair sentado: um gesto que responde a pergunta.
- **A pausa:** o tremor para e o último segundo fica totalmente parado.

## Como variar (o jeito, não a demo)

- **Cada cena é desenhada para a pergunta dita.** O componente é a implementação de referência (o ponto de ônibus);
  uma fala nova pede outro palco e outra história, então copie o `Cena42.tsx` e troque o cenário, os objetos e as poses.
  Mantenha o filtro de tremor, as espessuras, a cabeça e as cores chapadas.
- **Palco novo:** pense no lugar em três camadas (céu ou parede, chão em faixas, um objeto-herói). Cozinha é parede
  lisa, bancada e fogão; escola é quadro, carteira e janela. Até 8 desenhos no quadro.
- **As batidas seguem a frase:** "como era esperar sem celular" pede o acontecimento que cresce e o fecho. "Ele comprou,
  se arrependeu e devolveu" pede três gestos, um por verbo. Uma frase curta pode ser só a cena parada com uma reação.
- **Que movimento para que palavra:** verbo de ação vira o gesto da pessoa; o nome de um objeto vira o objeto que pula;
  "não", "nunca", "sem" é o risco vermelho; número dito vai no rótulo ou desenhado (três copos, não "3x").
- **O rótulo** é a pergunta ou o lugar dito, em poucas palavras. Sem fala que peça, sem rótulo (`rotulo` vazio).
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 corta as laterais (deixe pessoa e objeto-herói no meio), em 16:9
  corta em cima e embaixo (abra mais o cenário para os lados em vez de esticar).

## Nunca

- Contorno grosso, degradê, sombra, textura, rosto detalhado com nariz, corpo realista.
- Mais de um rótulo, ou tremor durante a pausa final.
- Copiar personagem, mascote ou marca de canal existente.
- Reaproveitar o banco, o ponto de ônibus, o celular riscado ou o rótulo da demo (`componente/textos-demo.json`) quando a
  fala não fala disso.
- Refazer a coreografia da demo (vento, mãos na cabeça, X, ombros) batida a batida para outra pergunta.
