# Briefing — hero animado do dragão

Documento de contexto. Foi escrito para que alguém que nunca viu o histórico
consiga retomar o trabalho sem refazer as descobertas.

## Onde isso vive

Hero da home. Tela cheia, dragão de perfil à direita, texto no canto
inferior esquerdo.

## Decisões já tomadas

| Decisão | Escolha | Por quê |
|---|---|---|
| Local | Hero da home | — |
| Cena | Dragão de perfil (olhando à direita), pose de prontidão/agachado, asas abertas | Vídeo real entregue não tem chama (ver medições abaixo) — a cena "cuspindo fogo" foi abandonada em favor do que os assets realmente mostram. Pose deixa o canto inferior esquerdo livre para o texto. |
| Caminho inicial | SVG animado | Sem créditos, sem marca d'água, alguns KB |
| Caminho v2 | Sequência de quadros de vídeo | Asset de vídeo real recebido e medido (ver abaixo) |
| Loop | **Simples, sem ping-pong** | Testado quadro a quadro (SSIM do último quadro contra o primeiro, 480px): sobe monotonicamente até o fim, chegando a ≈0,80 — dentro da faixa de variação normal entre quadros vizinhos quaisquer (≈0,81–0,87). O corte não fica mais brusco que um passo comum do vídeo. |
| Licença comercial | **Confirmada** (2026-07-30) | Uso comercial/portfólio profissional liberado pelos termos do gerador. |
| Formato de extração | **WebP**, um arquivo por quadro (`-f image2`) | AVIF (`libaom-av1`) foi tentado primeiro — `ffprobe` lia os arquivos normalmente, mas o decoder real do Chromium rejeitava (`createImageBitmap` → `InvalidStateError: The source image could not be decoded`). Só apareceu testando num navegador de verdade (headless + CDP), não no `ffprobe` nem no build. Trocado por WebP, sem essa armadilha. Ver `scripts/generate-frames.mjs`. |
| Quadros/orçamento | Desktop: 640px, skip=2 (15fps), q=42 → **362 quadros, 1,91 MB reais** (orçamento 2 MB, ~95%). Mobile: 400px, skip=3 (10fps), q=42 → **241 quadros, 0,64 MB reais** (orçamento 800 KB, ~80%). | Medido rodando `npm run frames` no arquivo inteiro, não estimado por amostra — a estimativa inicial por 1 quadro de referência foi otimista demais (real ficou ~2-3x maior); margem do desktop ficou apertada (~90KB), vale revisitar se o vídeo for regerado. |

## Componentes

- **`DragonBreath.tsx`** — dragão em SVG/canvas, 12 quadros, sem dependências,
  poucos KB. Serve como peça final leve **ou** como poster/fallback da
  sequência. (Hoje vive em `app/components/`, não em `components/` — ver
  "Em aberto".)
- **`ScrollFrameSequence.tsx`** (`components/`) — canvas que troca quadros.
  Modos `scroll` (quadro amarrado à rolagem, via `frameAtProgress`, exportada
  e testável isolada) e `loop` (roda sozinho, pausa fora da viewport). Carrega
  o quadro 1 primeiro (pinta e chama `onReady`), depois o resto em segundo
  plano; `onUnsupported` dispara se o navegador não decodificar o quadro (hoje
  WebP, ver "Decisões já tomadas" — o nome do callback ficou genérico de
  propósito, não é AVIF-específico).
- **`DragonHero.tsx`** — a seção: fundo animado + scrim direcional + texto e
  CTAs em HTML. Nome, cargo, tagline e CTAs são props. `DragonBreath` pinta
  como poster instantâneo e some (`invisible`) assim que `ScrollFrameSequence`
  sinaliza `onReady`; se `onUnsupported`, o poster fica definitivo. A variante
  desktop/mobile é escolhida uma vez no mount via `matchMedia`, lendo
  `public/frames/manifest.json` (contagem/fps reais, gerado por
  `npm run frames` — evita hardcodar números que podem sair de sincronia).

## Assets gerados

Guardado em `assets-src/dragao.mp4`, fora do build e no `.gitignore`.

**Vídeo — medições reais, já verificadas (2026-07-30):**

- 1920x1080, 30 fps, 723 quadros, 24,1 s, H.264, `yuv420p` (sem canal alpha —
  o fundo preto é opaco, não é chroma key).
- **Conteúdo**: dragão de perfil olhando à direita, em pose de prontidão/
  agachado com as asas bem abertas. **Não há chama em nenhum quadro** —
  checado por amostragem em todo o vídeo (1 quadro/s) e em detalhe nos
  últimos 4s (4 quadros/s). A cena "cuspindo fogo" do plano original foi
  abandonada — não é o que este asset mostra.
- **Câmera aparentemente travada**: a variação entre quadros é sutil
  (balanço fino nas pontas das asas/espinhos), não uma mudança grande de
  pose. Primeiro e último quadro comparados via SSIM: ≈ 0,70 — parecidos,
  mas não idênticos, então o ponto de loop precisa ser testado antes de
  decidir entre loop simples e ping-pong.
- **Brilho global fica achatado o vídeo inteiro**: oscila entre ~28 e ~31
  (escala 0–255), sem nenhuma subida. Não há evento de pico — ao contrário
  do vídeo antigo, não existe "quadro mais claro" para calibrar o scrim.
- **Canto inferior esquerdo (zona do texto) permanece escuro o vídeo
  inteiro**: média 34,5, pico 40,8 (mesma escala). Sem o problema de "luz
  invadindo o texto" do plano antigo — scrim pode ser mais simples/estático.
- **Trecho útil**: por ora, parece ser o vídeo inteiro (24,1 s) — não há
  estagnação identificada tipo o corte em 8,6s do vídeo antigo. Isso ainda
  não foi validado com mais rigor (só endpoints + amostras a cada 0,5s);
  confirmar na etapa de pipeline antes de assumir os 24,1s completos contra
  o orçamento de peso do CLAUDE.md (2 MB desktop / 800 KB mobile).

**Comando de extração** (decidido, ver `scripts/generate-frames.mjs`):
`ffmpeg -i assets-src/dragao.mp4 -vf "select='not(mod(n\,SKIP))',scale=W:-1" -fps_mode passthrough -c:v libwebp -q:v 42 -f image2 frame-%04d.webp`,
com `SKIP=2, W=640` (desktop) e `SKIP=3, W=400` (mobile). `-f image2` é
essencial — sem ele o muxer de imagem sequencial some com o `%04d` e produz
um único arquivo animado com inter-predição entre quadros (inútil para busca
por índice).

Tentativa anterior com AVIF (`libaom-av1`, `-still-picture 1`, `-cpu-used 6`)
gerava arquivos que o `ffprobe` lia normalmente mas que o decoder real do
Chromium rejeitava — só detectado testando num navegador de verdade. Trocado
por WebP.

## Sequência de trabalho

1. **Rota isolada** ✅ — `/lab/hero` renderizando `<DragonHero />` em tela
   cheia, sem header, footer ou layout. Build passa, rota abre (200).
2. **Pipeline** ✅ — loop simples decidido (SSIM), `npm run frames` gera
   desktop+mobile e escreve `public/frames/manifest.json`. Formato mudou de
   AVIF pra WebP no meio do caminho (ver "Decisões já tomadas" — AVIF não
   decodificava no navegador real). Pesos medidos no arquivo inteiro: 1,91 MB
   / 0,64 MB, dentro do orçamento.
3. **Integração** ✅ — `ScrollFrameSequence` criado em `components/` e
   plugado no `DragonHero` no lugar de `DragonBreath` (que virou poster/
   fallback, como planejado). **Confirmado visualmente** (screenshot headless
   real): a troca do poster SVG pra sequência real acontece, o dragão
   correto aparece (perfil, agachado, asas abertas, sem fogo), texto
   permanece legível. Ainda em `/lab/hero`, não promovido pra home.
4. **Auditoria** — refeita com o WebP funcionando de verdade (trace real do
   Chrome via CDP, não só leitura de código). Resultados:
   - Contraste: passa com folga (nome 15,7:1, cargo 7,0:1, tagline 9,4:1 —
     mínimo WCAG AA é 3:1/4,5:1). Medido contra o quadro mais claro real na
     zona do texto + scrim CSS na posição real do `<h1>`.
   - LCP: confirmado por trace real do Chrome, nas duas rodadas — é o `<h1>`
     de texto, nunca o canvas/SVG (estrutural: nenhum dos dois entra na
     lista de candidatos a LCP do navegador).
   - `prefers-reduced-motion`: **testado ao vivo** (CDP `Emulation.setEmulatedMedia`
     + 5 amostras de pixel do canvas real, espaçadas, entre 7,2s e 10,7s
     após o load) — canvas 100% estático, confirmado. Existe uma corrida
     pequena e real no mount: `reduced` começa `false` (valor inicial do
     `useState`) e só vira `true` depois que o efeito do `matchMedia`
     roda, então em alguns mounts o loop chega a iniciar por ~200ms antes
     de ser cancelado. Não corrigido ainda — dá pra eliminar trocando o
     `useState(false)` por um inicializador preguiçoso que lê
     `matchMedia(...).matches` na primeira renderização. Pega detectada e
     descartada durante a investigação: o contador ingênuo de
     `requestAnimationFrame` conta TAMBÉM o `EmberBackground` (que roda
     sempre, sitewide, sem checar `prefers-reduced-motion` — isso é uma
     lacuna dele, não do dragão, registrado como achado à parte).
   - Peso real de rede: confirmado — o pré-carregamento realmente é gradual
     (13 requests de `/frames/` capturados num trace de alguns segundos,
     bem longe dos 362/241 quadros totais) e continua rodando mesmo se a
     hero sair da viewport (só a *animação* pausa, o *carregamento* não) —
     ainda em aberto se isso é o comportamento desejado.
   - Achado à parte (fora do escopo do dragão, confirmado 2x): `app/icon.png`
     (favicon do site inteiro) com 619KB sem compressão, maior recurso da
     página em ambas as rodadas de trace. **Corrigido e em produção**
     (commit `7fe00f4`): 256×256, 36KB, mesma logo.
5. **Responsividade** ✅ — testado de verdade em 3 larguras (390px, 1440px,
   e o corte mobile/desktop do manifest) via CDP com viewport forçado
   (`Emulation.setDeviceMetricsOverride` — `--window-size` do headless não é
   confiável, tem scaling do SO por baixo). Dois achados reais, corrigidos:
   - **Distorção**: `drawImage` esticava a imagem 16:9 pra caber no canvas
     sem preservar proporção — ficava visivelmente deformado em telas
     estreitas e altas. Corrigido com um `drawImage` "tipo cover" (recorta
     em vez de esticar), com âncora configurável (`anchorX`/`anchorY`).
   - **Enquadramento**: com o corte tipo cover centralizado, a cabeça do
     dragão saía do quadro em telas estreitas (sobrava só asa/corpo).
     Ajustado pra `anchorX=0.8, anchorY=0.15` (favorece topo/direita, onde
     fica a cabeça) — confirmado visualmente em mobile (390px) e desktop
     (1440px), cabeça sempre visível, sem distorção.
   - Falso alarme descartado: um teste inicial pareceu mostrar o nome
     cortado ("PEREI...") em mobile — era o `--window-size` do headless
     não batendo com o viewport CSS real (SO aplicando scaling por baixo).
     Com viewport forçado via CDP, o nome quebra em duas linhas
     normalmente, sem corte.

## Em aberto

- Trecho útil real: os 24,1s completos foram mantidos (skip thinning cobre o
  vídeo inteiro); não foi cortado, já que coube confortavelmente no
  orçamento.
- `DragonBreath.tsx` continua em `app/components/`, não em `components/`
  como a convenção do CLAUDE.md pede — ainda não decidido se vale mover
  agora que `ScrollFrameSequence`/`DragonHero` já existem em `components/`.
- Promoção pra home: passos 1-5 do plano original estão fechados. Só
  acontece quando pedido explicitamente — não foi pedido ainda.
