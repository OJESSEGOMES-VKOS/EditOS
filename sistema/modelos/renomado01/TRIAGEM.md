# Triagem: renomado01 (2026-11-03)

Pedido do dono (via orquestração, aprovado): modelo para vídeo de especialista renomado (serviço VirtuoKingdom para
especialistas, médicos, advogados), edição sofisticada. Base: `treinamento/especialista-renomado/` (manual + fichas).

## 1. A forma de execução em uma frase
"O especialista fala calmo com uma legenda serifada pequena no peito, e só nas frases marcadas a tela troca de modo por
corte seco com aproximação (palavra gigante = peso, cursiva escrita à mão = nome do conceito/tese, preto e branco com
legenda dourada = fala citada), sempre no mesmo lugar, e cada modo sai num clarão de película na cor da cena."

## 2. Teste do clone (frase de uma linha dos vizinhos)
| Modelo | Frase | Cabe a nova? |
|---|---|---|
| profissional01 | profissional na tomada única, tudo que puder vira ilustração, tela cheia ou tela dividida; nada de P&B | Não: o renomado não tem tela cheia, dividida nem objeto; a tipografia é o único grafismo, e o P&B é gramática dele |
| modelodinamico03 | podcast como trailer: destaque de 3 tipos de letra por cima da pessoa, legenda serifada, transições de textura | Não: o 03 mistura 3 famílias e vermelho Anton, 2 posições de texto, destaque por palavra forte sem sentido fixo; o renomado tem 4 modos com sentido fixo, 1 posição só, entrada por corte e saída por clarão |
| sofistmotion01 | motion narrado sem apresentador | Não: aqui a pessoa está sempre na tela |
| modelopadrao01 / modelodinamico01 | a tela encena a frase com painéis/objetos | Não: o renomado não encena com objeto |

Decisão: **modelo novo**. A diferença não é cor nem fonte: é a gramática de modos (cada efeito tem um sentido e só
um) com a mecânica fixa de entrada (corte + aproximação) e saída (clarão), e a contenção (~57% do tempo só pessoa +
legenda pequena).

## 3. Quantas referências e de quantos criadores
- ref1 = DeziDpVAqAV (Lucas Torres, 69 s): a forma inteira vem dela.
- DewlyZSNcme (Edita Visuals, 23 s, só o "depois"): **não entra como referência deste modelo** (é reforço do
  modelopadrao01/modelodinamico01, decisão do manual). Dele vêm só as leis comuns aos dois criadores, que o manual
  separou: gancho ≤ 3 s, objeção respondida, cor tirada da cena/roupa, texto no peito, fecho que volta ao gancho,
  clarão na cor da cena (Dewly 10,0 s e 20,5 s).
- **Uma referência só dá exemplo, não modelo** (regra da skill). Por isso: o que é comum aos dois criadores é regra;
  o que é só do Dezi (os 4 modos, o P&B dourado, a cursiva) está no `.md` como a forma do modelo porque o dono pediu
  o modelo a partir dele, mas cada número tem a medida do Dezi ao lado e a **referência própria definitiva fica
  pendente** (uma gravação de especialista real editada no modelo e aprovada pelo dono vira o `referencia/`).

## 4. Nome
`renomado01`.
