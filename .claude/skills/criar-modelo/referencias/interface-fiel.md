# Interface fiel: a tela recriada tem que parecer um print (G34)

Vale pra todo modelo e pra todo vídeo: sempre que a tela mostra um app, um site, um painel, uma conversa, um
aparelho (celular, notebook, relógio) ou qualquer interface, ela é recriada **de ponta a ponta como aquela interface
é de verdade**. A régua é esta: se alguém pausar o vídeo e comparar com um print real, a diferença tem que ser de
detalhe, não de espécie.

O dono viu o contrário acontecer várias vezes: um celular 3D genérico, um cartão branco com ícone e texto, uma
"janela" com três linhas cinzas, repetidos de modelo em modelo. Isso é a versão fraca e generalista. Ela existe porque
é mais rápida de fazer, não porque é melhor. O sistema tem capacidade de recriar interface igual à verdadeira; então
é isso que ele faz.

## 1. Antes de desenhar: a referência real

1. **Consiga o print ou a gravação real** da interface que a frase cita, na versão atual: a do usuário (pedido via
   `PEDIDO.md`), ou pública (site oficial, loja de apps, documentação, imprensa com licença). Anote origem e data no
   `ORIGEM.md` do vídeo.
2. **Meça** no print: proporção da tela, barra de status, altura da barra de navegação, raio dos cantos, margens,
   família e peso da fonte, tamanhos relativos, cores exatas (hex de quadro cheio), ícones (forma, traço, cor),
   espaçamento entre itens, estados (botão ativo, campo com cursor, mensagem lida).
3. **Liste o que é conteúdo e o que é moldura.** A moldura (barras, ícones, cores, fontes) é fiel ao produto real. O
   conteúdo (o texto da mensagem, o nome no perfil, o número no painel) é o do vídeo, **real** (G31, nada inventado) ou
   claramente o do próprio criador.

Sem print real, não se recria a interface "de memória": a tela vira outra coisa (a palavra dita grande, a tela da
casa) ou entra no `PEDIDO.md`. Interface inventada de memória é exatamente a versão genérica que esta regra proíbe.

## 2. Como recriar

- **No código do molde (Remotion), não em imagem gerada.** Interface em código fica nítida em qualquer tamanho, anima
  (o cursor digita, a mensagem chega, o botão muda de estado) e aceita o conteúdo do vídeo. Imagem gerada por IA de
  interface sai com texto errado e proporção inventada: só pra fundo desfocado, nunca pra tela legível.
- **Aparelho real, não genérico.** Se é um iPhone, é o recorte, a ilha e os botões do iPhone atual; se é Android, o do
  aparelho mais comum do público. Mesma regra pra notebook e relógio. Um "celular 3D" sem marca, igual em todos os
  vídeos, é o que o dono não quer.
- **Tipografia do produto.** Instagram, WhatsApp, Gmail, Notion e afins têm fonte, peso e tamanho reconhecíveis. Use
  a mesma família quando a licença permitir, ou a equivalente aberta mais próxima, no tamanho medido.
- **Ícones de verdade.** Forma, traço e cor do ícone real daquela função naquele app. Nada de ícone de biblioteca
  genérica no lugar do ícone do produto.
- **Estados e detalhes vivos.** Hora na barra de status, bateria, "visto por último", contador de curtidas, cursor
  piscando, teclado quando o campo está em foco. São os detalhes que fazem o olho acreditar.
- **Conteúdo com tempo de leitura e tamanho de prova** (G1, G9): a interface entra grande, para ser lida, e a câmera
  só viaja depois.
- **Mesma interface no vídeo inteiro.** Se o app aparece três vezes, é o mesmo componente, com estados diferentes.

## 3. O que cada modelo faz com isso

- O `<modelo>.md` novo declara, na seção 4 (repertório), **quais interfaces o modelo recria e de onde vem o print
  de referência de cada uma**, e não desenha "uma tela de app" genérica no molde.
- Componentes de interface fiéis que nascem em um molde (um iPhone atual, uma janela do WhatsApp, um painel do
  Instagram) podem ser reaproveitados em outro molde **como componente**, desde que a interface seja a mesma e a
  versão continue atual. O que não se reaproveita é o desenho simplificado.
- O checador do modelo acusa tela de interface sem `ORIGEM` de print.

## 4. Teste antes de mostrar

- [ ] Tem um print ou gravação real de origem, com data, e a tela recriada foi comparada lado a lado com ele.
- [ ] Proporção, barras, cantos, fonte, ícones e cores batem com o real (medidos, não "parecidos").
- [ ] O aparelho é um aparelho real e atual, não um molde genérico.
- [ ] O conteúdo é real ou do próprio criador; nada de nome, número ou mensagem inventados.
- [ ] A interface fica legível pelo tempo de leitura, grande, antes de qualquer movimento de câmera.
- [ ] Se um aluno pausar, ele reconhece o app sem o nome escrito.
