# A herança: o que todo modelo novo já nasce sabendo

A herança de todo modelo são as **35 correções do dono, G1 a G35, na seção 0 do `REGRAS.md`** (reescritas em
2026-11-05). Elas ficam acima de tudo: do `<modelo>.md`, desta página e do código. O texto delas mora só lá; aqui vai
o índice, para ninguém copiar e deixar duas versões.

O `<modelo>.md` novo não copia as regras: declara "herda `heranca.md` (G1–G35 do `REGRAS.md`)" e lista **só o que
sobrescreve**, com o motivo. Sobrescrever só vale quando a regra bate de frente com a forma de execução do modelo, nunca
por gosto de quem edita, e nunca contra G1–G35.

## 1. Índice das correções (texto completo no `REGRAS.md`, seção 0)

| Grupo | Regras |
|---|---|
| Casa e máquina | G1 confinado · G2 disco · G3 EditOS · G4 computador livre |
| Gravação e material | G5 decupagem limpa · G6 qualidade máxima do original (sem fundo, cor, som, música ou recorte sem ordem) · G7 material em três modos · G8 nome e @ reais |
| Tempo e fala | G9 tempo do texto · G10 números e frases como ditos |
| Legenda | G11 sem picotar ao acaso · G12 legenda padrão (até 2 linhas, lugar fixo ~70%) · G13 destaque em até 3 posições · G14 trecho e subtrecho · G15 zona segura · G16 texto limpo (sem contorno, sombra colada ou brilho) |
| Destaque | G17 só onde importa · G18 acabamento (pontuação e aspas fora, contraste, nada no rosto) |
| Tela | G19 a tela mostra o que é dito · G20 palavra-chave forte animada · G21 nada solto · G22 tom · G23 tela cheia sai com o trecho · G24 prova grande · G25 interface fiel · G26 um elemento por ideia · G27 nada perdura fora do tempo |
| Composição | G28 composição dentro do tema (cada trecho e subtrecho tem a própria edição pela relevância) · G29 começo dinâmico na gravação original · G30 modelo é inspiração, não molde |
| Modelo | G31 cores do modelo ou do pedido · G32 o que é passado a um modelo afeta só ele · G33 nome do modelo e UI nunca na tela · G34 o modelo aprende com o uso sem se corromper · G35 conteúdo de cliente segue o aprovado |

## 2. O que isso muda na hora de criar um modelo

- **O modelo é inspiração (G30).** As referências ensinam o porquê e o como de cada tela; nada de copiar o timestamp, a
  ordem das telas ou a abertura delas. A edição de cada trecho e subtrecho nasce da fala nova e da relevância dela ao
  tema (G28, G14). Se a referência abre numa tela diferente, o vídeo novo só abre assim se o porquê for o mesmo; no
  padrão, abre na gravação original (G29).
- **Tudo que trata a gravação nasce desligado (G6):** efeito sonoro (inclusive o de zoom), música, tratamento de cor,
  recorte da pessoa, blur ou troca de fundo. São opções do molde, ligadas só com ordem explícita no pedido.
- **Zoom só por plano explícito.** Nada de zoom automático por tempo ou aleatório.
- **Texto limpo (G16)** no padrão do molde: sem contorno, sombra colada ou brilho.
- O checador do molde cobra as regras que dá para medir (G9, G11, G12, G13, G15, G23, G26, G27) e não cobra nada que
  tenha sido abolido.
- O `parece.py` é **opcional e só de identidade** (fonte, cor, legenda): não reprova vídeo nem obriga a parecer a
  referência.

## 3. O que todo `<modelo>.md` novo precisa ter
- A seção **"Com o que o vídeo tiver"**: tabela recurso da referência → o porquê dele → o que o modelo faz só com a
  gravação da pessoa.
- A seção **"Do seu jeito"** vazia, pro usuário preencher (nome, @, foto, chamada do fim, gostos).
- A identidade medida (fonte, cores, tamanho e posição de legenda), como guia, não como portão.
- A lista de opções: o que vem ligado e o que é escolha. Tudo que a G6 cobre aparece como opção desligada.
- Interface ou aplicativo na tela segue `interface-fiel.md` (G25).
