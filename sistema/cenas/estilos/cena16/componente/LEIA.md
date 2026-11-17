# cena16: Número com gráfico (componente)

Componente: `Cena16.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`; obrigatórias (sem padrão): rotulo, serie (um valor por mês, série real com fonte), anoInicial, indiceEvento, eventoData, eventoTitulo, delta, fonte. Opcionais: empresa, letraMiuda, prefixo, unidade, casas, mesesEixo (padrão: tamanho da série), eventoLinha, deltaTexto, periodo, teto (padrão 1,15 x o maior valor), marcas (padrão: 4 marcas redondas), sufixoEixo, queda (chip ▼), acento, fimLinha.

**Textos da demo:** ficam só no `demo.tsx` (com a série inventada) e em `textos-demo.json`; nunca voltam num vídeo (teste do clone).

## O que a cena faz
Número em dígitos tabulares sempre igual ao valor sob a ponta da linha; linha já anda no quadro 0, freia no evento, sobe laranja e grossa depois dele; anel no evento, linha-guia e chamada em três linhas; chip pula quando a contagem pousa; anel na ponta e etiqueta saindo do eixo.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
