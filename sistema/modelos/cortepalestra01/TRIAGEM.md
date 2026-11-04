# Triagem: cortepalestra01 (etapa 0 da skill criar-modelo)

Data: 2026-11-03. Pedido do dono (aprovado): modelo de corte de 50 a 70 s tirado de pregação, palestra ou evento gravado,
base da "Máquina de Cortes" do curso VKOSHUB e da página jovemdapalavra. Lote: `treinamento/cortes-palestras/`.

## 1. A forma de execução em uma frase

**Um pensamento inteiro recortado da gravação longa, da primeira palavra da frase de impacto até a palavra que
resolve, com uma legenda pequena e quieta de 1 a 3 palavras num lugar só, e a palavra-resposta acendendo grande em
serifa itálica: denso no gancho, raro no corpo, e a última frase respirando.**

O trabalho do modelo é, nesta ordem: escolher o trecho (o "ponto certo"), conter a edição (quase nada na tela além da
legenda) e gastar o destaque só onde a fala dá a resposta.

## 2. O teste do clone (a frase nova contra as do catálogo)

| Modelo | A frase dele | Por que o cortepalestra01 não cabe nele |
|---|---|---|
| pregacaodinamica01 | "A fala é a estrela… a cada 5 a 10 s, um momento de ênfase" (frase-bloco, letreiro atrás da pessoa, tela creme, zoom 1,0–1,18, chicote) em 30 s de gravação própria | Aqui a ênfase **não** é periódica: 8 destaques nos 6,7 s do gancho e 2 nos 60 s seguintes (ref1); 22 s finais sem bloco (ref2). Não há letreiro, tela creme, zoom de edição nem chicote. Legenda de 1 a 3 palavras (~54 px), não páginas de 2 linhas de 60 px. E o vídeo nasce da **escolha do trecho** numa gravação longa, que o pregacaodinamica01 não ensina. Forçar isso lá mudaria a cara dele (o manual do lote chegou à mesma conclusão). |
| ojgstyle01 | "A legenda conta a história… o termo protagonista acende grande em serifa itálica amarela" (uma palavra-chave por frase, 1 a cada ~5,4 s; papel com quadros; decupagem de tomadas) | É o estilo pessoal do Jessé: palavra-chave **em toda frase**, legenda Inter 66 px em 2 linhas, cor fixa amarela, papel como segundo mundo. Aqui o destaque é raro de propósito (o encanto é a contenção), a cor sai do fundo da gravação e o corte é um trecho contínuo de evento. |
| superpodcast01 / storypodcast01 | minidocumentário com 4 mundos / página de livro sobre estúdio escuro | Opostos: este modelo quase não mexe na imagem. |
| modelodinamico03 / profissional01 / modelopadrao01 / dynamic01 / youtubeedition01 | a tela responde a cada frase (cartão, ilustração, punch-in, trailer) | Aqui a tela não responde a cada frase; a força é da fala escolhida. |

Resultado: **modelo novo**. Não é variação (a diferença não é só cor ou fonte: muda a densidade, o tamanho da legenda,
o papel da cor e o passo de escolher o trecho) nem fusão (nenhum modelo do catálogo tem referências de corte de evento).

## 3. Referências e criadores

2 referências de **2 criadores diferentes** (Aluízio A. Silva e Instituto Bíblico Palavra da Fé), as duas cortes de
pregação 9:16 de evento multicâmera com curtidas iguais (7.353 e 7.373).
- Comum aos dois → regra: entrada na 1ª palavra (0,00 s), gancho na vida de quem assiste, um pensamento só, última
  palavra forte, legenda fixa centrada, serifa itálica na palavra de peso, densidade de destaque que cai depois do
  gancho, fecho sem pressa.
- De um só → opção ou exemplo: o bloco de pergunta-e-resposta montado (ref1), o azul `#4763B0` (ref1, escolhido contra
  LED vermelho), a sans pesada maior (ref2), o escurecer para o preto (ref1) x segurar a imagem (ref2).
- Instruções do dono no lote: as trocas de câmera vêm da gravação (não são edição, não viram regra); a música da ref2 não
  é referência (o modelo vem sem música).

Duas referências bastam para um modelo cuja forma é contenção + escolha do trecho; a referência própria definitiva
(um corte de gravação longa do dono, aprovado) fica como pendência da etapa 8.

## 4. O nome

`cortepalestra01`.
