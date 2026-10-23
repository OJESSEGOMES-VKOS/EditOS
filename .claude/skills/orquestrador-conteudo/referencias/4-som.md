# 4 · Som

Som sincronizado é o que faz animação parecer cara; som espalhado é o que faz parecer modelo pronto. A regra é uma
só: **o som explica a imagem** (velocidade, peso, chegada, mudança). Se você não sabe dizer por que um som está ali,
ele sai.

## 1. Uma fonte de tempo
O som sai do **mesmo arquivo de tempo** que a imagem lê (o plano do vídeo: `src/plano.ts`, `src/tempos.json` ou o
equivalente do molde). Mudou a fala e os tempos andaram? Imagem e som andam juntos. Nunca posicione efeito "de olho"
na timeline.

Cada efeito é uma linha na tabela de cues (`som` no plano, ou `SONS.md` quando for à parte):

| evento | quadro | som | ganho | por quê |
|---|---|---|---|---|

Silêncio intencional também é uma linha ("silêncio antes da virada, 8 quadros").

## 2. Onde vai som
- **Marca mudança, não palavra:** mundo novo, revelação, clique, pouso, número que fecha a conta.
- **O ataque cai no quadro do evento** (±1 quadro). Alinhe o ponto em que o som "bate" (o transiente), não o começo
  do arquivo. O whoosh pode começar uns 10 a 20 ms antes do movimento, pra puxar a imagem.
- **A cauda morre com o movimento.** Som que sobra depois da imagem parar é sujeira.
- **Movimento complexo, som em camadas:** subida, aceleração e um contato curto no fim, seguindo o arco.
- **Texto:** um toque seco por grupo de palavras que importa, nunca 30 cliques iguais por segundo.
- **Não repetir o mesmo arquivo** em sequência: varie (outro take, afinação levemente diferente) ou não use.
- **Teto:** num Reel, no máximo uns 12 efeitos por minuto fora dos cortes, com pelo menos meio segundo entre eles.
- **Silêncio em volta do impacto** é o que vende o impacto. Um silêncio planejado por vídeo curto.

Evite por padrão: whoosh longo em toda transição, riser de trailer, "boom" de cinema em card, som contínuo de digitação.

## 3. Mixagem
- Voz na frente, sempre. Efeito começa uns 10 dB abaixo da voz e se ajusta **ouvindo contra a fala real**.
- Música, quando houver (é escolha do criador), entra bem abaixo da voz e abaixa quando a voz fala (ducking suave,
  sem bombear). O número de dB é ponto de partida, não regra: ajuste até a palavra ficar clara e a música natural.
- **Entrega: -14 LUFS integrado, pico real até -1 dBTP**, AAC 48 kHz. Os scripts de mixagem dos moldes já fazem isso
  em duas passadas. Confira com `tools/medir_entrega.py`.
- **LUFS não prova que o efeito é audível.** Ouça o trecho mixado em volume baixo, de preferência no celular, olhando
  a imagem. Seja honesto no relatório: "medido" (número), "ouvido" (alguém ouviu), "não conferido".

## 4. De onde vem o som
1. **O som do molde** (`moldes/<m>/scripts/som.py` ou `trilha.py`): sintetizado por código, sem licença de terceiro,
   preso aos eventos do plano. É o padrão de cada modelo e vem ligado quando o aprovado tem.
2. **Efeito novo pela ElevenLabs** (`kit/audio_ia.py`), quando o molde não cobre:
   - **Aprovação antes de gastar:** diga o prompt, a duração e quantas variações; espere o "ok".
   - **Uma chamada por vez, sem nova tentativa automática** (uma falha pode ter cobrado).
   - Gere o mínimo (0,5 s) pra som curto e recorte o ataque aqui; som curto não sai mais barato.
   - **Um som por pedido**, em inglês, descrevendo fonte, ação, material, energia, secura e o que não quer ("no
     music, no ambience").
   - Anote em `SONS.md`: prompt, duração, data, arquivo. Guarde o arquivo e reaproveite antes de gerar de novo.
   - O preço da API muda; antes de gerar em lote, faça uma geração de teste e confira no painel.
3. **Amostra licenciada do criador**, com a licença anotada em `ORIGEM.md`.

Nunca mande áudio de outra pessoa, narração privada ou trilha de terceiros pra "gerar parecido".

## 5. Carrossel animado
O Instagram silencia o som dos vídeos quando a pessoa põe música no carrossel, e muita gente desliza sem som.
**Cada página tem que funcionar muda.** Som próprio, se houver, é bônus: curto, seco, no ritmo dos movimentos.
