# 3D completo (Blender): o passo a passo

O estilo "3D de bloquinho" (a ficha está em `blender/ficha.md`) é feito no Blender, um programa de 3D gratuito.
Você escreve a cena em Python com o kit (`blender/kit_bloquinho.py`) e o Blender renderiza o vídeo.

**Limites, pra dizer à pessoa antes de começar:**
- Só funciona com o Blender instalado no computador. Sem ele, ofereça um estilo de 3D leve (`isometrico`, `pop-up`,
  `vidro-3d`, `massinha-3d`, `teatro`) ou de 3D edição (`madeira-3d`, `maquete-3d`).
- Todo comando abaixo roda **de dentro de `sistema/`** e **pela trava** do estúdio:
  `QUEM=animacoes sh tools/com-trava.sh "<blender>" -b -P ...` (um pesado por vez; o computador do dono nunca trava).
- **Demora mais** que os estilos 2D: conte uns minutos por segundo de vídeo numa placa de vídeo comum, e bem mais
  sem placa. Avise antes de renderizar.
- Precisa de uma **placa de vídeo razoável** (qualquer placa dedicada dos últimos anos serve; a placa integrada de
  notebook simples funciona, mas lenta).
- O Blender **não faz narração nem legenda**. O caminho pra isso está em "Narração e legenda", abaixo.

## 1. Conferir o Blender

Versão mínima: **Blender 5.0** (o kit foi testado no 5.2).

- Windows: `where blender`. Se não achar, procure `C:\Program Files\Blender Foundation\Blender */blender.exe`.
- macOS: `ls /Applications/Blender.app/Contents/MacOS/Blender`.
- Linux: `which blender`.

Achou? Rode `<blender> --version` e confira o número.

Não achou, ou é mais velho que 5.0? **Peça licença antes de instalar** ("Pra fazer em 3D eu preciso instalar o
Blender, um programa gratuito de uns 400 MB. Posso?"). Com o sim:
- Windows: `winget install BlenderFoundation.Blender`
- macOS: `brew install --cask blender`
- Linux: pelo gerenciador de pacotes da distribuição, ou pelo site blender.org.

Nos comandos abaixo, `blender` é o caminho que você achou (no Windows, com aspas por causa dos espaços).

## 2. Ver o exemplo

`blender -b -P animacoes/blender/exemplo_ciclo_da_agua.py` grava `animacoes/estilos/exemplos/ciclo-da-agua-3d-v1.mp4`.
Leia o `exemplo_ciclo_da_agua.py` antes de escrever uma cena: ele mostra o lugar, um objeto com brilho, coisas que
sobem, crescem, mudam de cor e caem, o letreiro e a câmera.

## 3. Escrever a cena

Roteiro e fala seguem o `animacoes/LEIA.md` como em qualquer vídeo de animação (passos 1 a 3; no `novo-video.mjs`
use `--estilo giz` ou o estilo cuja legenda vai por cima). Depois crie `oficina/<pasta>/cena3d.py`. A estrutura é
sempre esta:

```python
import sys
from pathlib import Path
RAIZ = Path(__file__).resolve().parents[2] / 'animacoes'   # oficina/<pasta>/cena3d.py -> sistema/animacoes
sys.path.insert(0, str(RAIZ / 'blender'))
import kit_bloquinho as K

dur, frases = K.ler_fala(Path(__file__).parent / 'fala.json')    # o tempo de cada frase
sc = K.nova_cena(dur)                                             # vertical; 'horizontal' pra YouTube
K.chao(sc, 'grama')

b = K.boneco('ana', (-3, 0, 0), camisa='#2F8FE0')
s0, s1, _ = frases[1]
K.andar(b, s0, s0 + 2.5, (-3, 0), (0, 0))        # anda enquanto a frase 1 é dita, olhando pra onde vai
K.acenar(b, s1 - 1.2, s1)

caixa = K.bloco('caixa', (0.8, 0.8, 0.8), (1.5, 0, 0.4), K.COR['madeira'])
K.contorno([caixa])
K.aparecer(caixa, frases[2][0])                   # cresce na hora em que a frase 2 começa

K.camera(sc, (0, -14, 5), alvo=(0, 0, 1.2))
K.renderizar(sc, 'fundo3d', pasta=RAIZ / 'public' / 'videos' / Path(__file__).parent.name)
```

As funções do kit:

| Função | Pra quê |
|---|---|
| `nova_cena(segundos, formato, clima)` | começa do zero; clima `'dia'`, `'tarde'` ou `'noite'` |
| `bloco`, `cilindro`, `cone`, `bola` | as formas (medidas em metros); `ancora='base'` cresce do chão; `brilha=True` brilha sozinho |
| `grupo(nome, loc)`, `pecas(g)` | juntar peças pra mover junto (passe `pai=g` ao criar) |
| `chao`, `arvore`, `nuvem`, `texto` | prontos comuns; `nuvem` devolve também o material, pra escurecer |
| `boneco`, `andar`, `acenar`, `parte` | a pessoa de blocos; `parte(b, 'braco_d')` pra animar um membro |
| `contorno(lista)` | a borda escura: passe em tudo que for peça da cena |
| `chaves(obj, 'location', [(seg, valor), ...])` | o movimento. `suave=False` pra velocidade constante (queda, giro) |
| `aparecer`, `sumir`, `balancar`, `cor_em` | crescer do zero, encolher, ir e voltar, mudar de cor |
| `camera(sc, loc, alvo)` | devolve (câmera, alvo); anime os dois com `chaves` pra câmera passear |
| `ler_fala(caminho)` | tempos das frases do `fala.json` |
| `renderizar(sc, nome, pasta=None)` | o vídeo ou, com `-- --quadro N`, só um quadro de teste |

Regras de montagem:
- **Tempo sempre em segundos**, e amarrado à fala (`frases[k][0]` é o segundo em que a frase k começa).
- **A câmera olha pra -Y → +Y** (fica em y negativo). A frente do boneco e dos letreiros é virada pra ela.
- Nada de número aleatório sem semente: use `random.Random(7)`, senão cada render sai diferente.
- Todo caminho é relativo à pasta do script (`Path(__file__)`), nunca um caminho da máquina.

## 4. Quadro de teste (sempre, antes do render inteiro)

`blender -b -P oficina/<pasta>/cena3d.py -- --quadro 6.5` grava `.tmp/fundo3d-quadro-6.5.png` (o `.tmp` de `sistema/`) em menos de um minuto.
**Abra a imagem e olhe.** Tire 2 ou 3 quadros dos momentos importantes. Confira:
- o assunto está no meio e grande, nada cortado na borda;
- nada importante na faixa de 62% a 82% da altura (é onde a legenda entra);
- o letreiro dá pra ler e não encosta na borda;
- cores vivas, nada estourado de branco nem escuro demais;
- cada peça tem contorno.

## 5. Renderizar

`blender -b -P oficina/<pasta>/cena3d.py`. Avise a pessoa quanto tempo deve levar. Se o computador dela ficar
pesado, diga que é normal durante o render e que dá pra usar só coisa leve enquanto isso.

## 6. Regras de qualidade (o que reprova)

- **Movimento físico.** Nada teletransporta: tudo que muda de lugar viaja até lá. Nada pisca: coisa nova cresce
  (`aparecer`) e coisa que sai encolhe (`sumir`). Ninguém anda de costas (`andar` já vira o boneco pra frente).
  Nada atravessa outro objeto: gota para no chão, boneco desvia da mesa. Queda é rápida e reta (`suave=False`).
- **Câmera suave.** Uma câmera, movimento lento e contínuo. Nada de giro rápido nem corte a cada segundo.
- **Texto legível.** Até 2 palavras por letreiro, `tamanho` 1,2 ou mais com a câmera a uns 20 m, no alto da tela,
  pelo tempo de ler (1 s mais 1 s a cada 3 palavras).
- **Sempre tem movimento.** Nada parado mais de 2 segundos (`balancar` resolve o que está esperando).
- **A tela mostra o que a frase diz**, na hora em que é dita.
- **Nada de terceiros**: personagem conhecido, marca ou pessoa real não entram.

## 7. Narração e legenda

O vídeo do Blender sai **mudo e sem legenda**. O caminho mais simples é usar o 3D como **fundo**
de um vídeo comum de animação, que já sabe pôr a voz e a legenda:

1. Rode a voz como sempre (`node animacoes/ferramentas/voz.mjs <pasta> ...`): sai o `fala.json`.
2. A cena 3D lê os tempos do `fala.json` (`K.ler_fala`) e grava com
   `K.renderizar(sc, 'fundo3d', pasta=RAIZ / 'public' / 'videos' / '<pasta>')`.
3. No `oficina/<pasta>/video.tsx`, uma cena só, que toca o vídeo do Blender:

```tsx
import React from 'react';
import {OffthreadVideo, staticFile} from 'remotion';
import type {Fala, Formato, PropsCena} from '../../animacoes/src/kit';
import {Filme, cenasPorFrase} from '../../animacoes/src/kit';
import {tema} from '../../animacoes/src/estilos/giz';         // só pela legenda; troque pelo estilo cuja legenda combinar
import falaJson from './fala.json';

export const fala = falaJson as Fala;
export const formato: Formato = 'vertical';
const Fundo3D: React.FC<PropsCena> = () => (
  <OffthreadVideo src={staticFile('videos/<pasta>/fundo3d.mp4')} muted style={{width: '100%', height: '100%'}} />
);
export const Video = () => (
  <Filme tema={tema} fala={fala} cenas={cenasPorFrase(fala, [[0, fala.frases.length - 1, Fundo3D, 0]])} />
);
```

4. `node animacoes/ferramentas/fotos.mjs <pasta>` e `node animacoes/ferramentas/render.mjs <pasta>` (pela trava) como em
   qualquer vídeo; o render entrega no perfil pelo `tools/entregar.py`. A voz e a
   legenda entram por cima do 3D.

**Honestidade:** este caminho foi escrito em cima das peças que já existem, mas **ainda não foi testado de ponta a
ponta**. Na primeira vez, confira nas fotos se o fundo 3D aparece e se a legenda está no lugar. Se não funcionar,
entregue o vídeo do Blender mudo e diga à pessoa que a legenda pode ser posta no próprio app da rede social
(Instagram, TikTok e CapCut geram legenda automática).
