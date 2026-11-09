# 6 · Conferência antes de "pronto"

Três camadas, nesta ordem. Item que reprova volta pra bancada. No recado final, diga o que foi **medido**, o que foi
**olhado** e o que **não deu pra conferir**.

## A. Técnica (medida)
- [ ] O checador do molde zerado (falas cobertas, tempo de leitura, posições, zona segura, sincronia).
- [ ] (Opcional) `sistema/tools/parece.py <video.mp4> <modelo>`: confere só identidade (fonte, cor, legenda) e não
      reprova. O vídeo não precisa parecer a referência; precisa servir à fala e ao tema (G28, G30).
- [ ] `sistema/tools/medir_entrega.py <video.mp4> --tamanho <LxA> --fps 30`: H.264, AAC 48 kHz, -14 LUFS, pico real até
      -1 dBTP, abre rápido. Página de carrossel: `--max-s 60`.
- [ ] `sistema/tools/folha.py` do vídeo inteiro: nada cortado, nada piscando, nenhum texto sumindo antes de ser lido.

## B. Conteúdo (a rubrica)
Cada item é sim ou não. Um "não" nos três primeiros reprova.
1. **O gancho está escrito desde o quadro 0, na legenda sobre a gravação** (G29: começa dinâmico na gravação original) e funciona sem som? Os destaques estão só onde importam e sem pontuação dentro (G17, G18)?
2. **A promessa do gancho foi cumprida** no vídeo?
3. **Toda prova é real**, com origem anotada? Nenhum número, nome, fala ou depoimento inventado?
4. A UMA coisa dá pra repetir em uma frase depois de assistir?
5. O CTA é uma ação só, dita e escrita?
6. A fala na tela bate com o roteiro aprovado e com o que foi dito (número como foi dito)?
7. A voz e o tom são os do criador (PERFIL), sem cara de texto de IA?
8. Alguém mandaria isso pra outra pessoa? Por quê?

## C. Cara de modelo pronto (o teste das 8 perguntas)
Responda sim ou não. **Três "sim" ou mais: refaça a partitura.**
1. Os 3 primeiros segundos funcionariam em outro vídeo do mesmo nicho sem mudar nada?
2. Alguma transição foi escolhida por ser bonita, e não pela relação entre as cenas?
3. Tem imagem de apoio que serviria pra qualquer vídeo?
4. A cor de destaque aparece em mais de duas funções?
5. Tem efeito sonoro que você não sabe dizer por que está ali?
6. Tem zoom em palavra que não seria sublinhada se fosse texto escrito?
7. A legenda é idêntica à de outra série sem motivo?
8. Algum tipo de tela passa de 40% do tempo?

## Depois de entregar
- A correção que a pessoa fizer vira **regra geral** no `sistema/criador/GOSTO.md`, com data e as palavras dela.
- O `sistema/criador/REGISTRO.md` ganha a linha do conteúdo; a métrica de 48 h entra quando a pessoa trouxer.
- Gancho que venceu com número real vai pro topo do GOSTO como "ganchos que funcionaram".
