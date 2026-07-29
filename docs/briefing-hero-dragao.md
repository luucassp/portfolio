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
| Cena | Dragão de perfil, cuspindo fogo para cima | Deixa o canto inferior esquerdo livre para o texto |
| Caminho inicial | SVG animado | Sem créditos, sem marca d'água, alguns KB |
| Caminho v2 | Sequência de quadros de vídeo | Assets já gerados e validados (ver abaixo) |
| Loop | Ping-pong | O vídeo termina no pico e não fecha o ciclo sozinho |

## Componentes

- **`DragonBreath.tsx`** — dragão em SVG, 12 quadros, sem dependências, poucos
  KB. viewBox 1200x800 com `preserveAspectRatio="slice"`, cobre o container
  como background. Serve como peça final leve **ou** como poster/fallback da
  sequência.
- **`ScrollFrameSequence.tsx`** — canvas sticky que troca quadros. Modos
  `scroll` (quadro amarrado à rolagem) e `loop` (roda sozinho, pausa fora da
  viewport). `pingPong` ativo por padrão. Exporta `frameAtProgress`, que é
  onde mora a lógica de ida-e-volta e dá para testar isolada.
- **`DragonHero.tsx`** — a seção: fundo animado + scrim direcional + texto e
  CTAs em HTML. Nome, cargo, tagline e CTAs são props.

## Assets gerados

Três imagens (Gemini/Whisk) e um vídeo (Flow, frames-to-video). Guardar em
`assets-src/`, fora do build e no `.gitignore`.

**Vídeo — medições reais, já verificadas:**

- 1280x720, 24 fps, 240 quadros, 10,0 s, H.264
- **A câmera está travada.** A variação na faixa inferior esquerda entre o
  primeiro e o último quadro é quase toda mudança de luz, não de geometria.
  Isso era o principal risco e não se concretizou.
- **O vídeo termina no pico.** O brilho global sobe de 37,8 até 62,9 no quadro
  206 e fica lá. Não há dissipação — daí o ping-pong ser necessário.
- **O trecho útil vai até ~8,6 s.** Depois disso é estagnação.
- **A luz do fogo invade a zona do texto**: o brilho do quadrante inferior
  esquerdo sobe de 46,7 para 57,3 ao longo da animação. O fogo em si não
  invade, mas o contraste cai. **Calibrar o scrim pelo quadro 206, não pelo
  primeiro.**

**Comando de extração já ajustado ao que o vídeo entregou:**

```bash
ffmpeg -to 8.6 -i assets-src/dragao.mp4 \
  -vf "fps=12,scale=1280:-2" \
  -c:v libwebp -quality 72 \
  public/frames/dragon-%04d.webp
```

Resulta em ~103 arquivos. Com ping-pong viram 206 quadros de animação
percebida, pesando o de 103. Versão mobile: `scale=720:-2`, `fps=10`, em
`public/frames/mobile/`.

## Sequência de trabalho

1. **Rota isolada** — `/lab/hero` renderizando `<DragonHero />` em tela cheia,
   sem header, footer ou layout. Pronto quando o build passa e a rota abre.
2. **Pipeline** — script npm `frames` rodando o comando acima, gerando também
   a versão mobile, e imprimindo contagem e peso de cada pasta ao final.
3. **Integração** — trocar `DragonBreath` por `ScrollFrameSequence` dentro do
   `DragonHero`, com `pingPong` e o `frameCount` real. Manter texto e CTAs.
   Ajustar o scrim conferindo o quadro mais claro.
4. **Auditoria** — contraste sobre o quadro mais claro, `prefers-reduced-motion`,
   peso baixado na primeira visita, e qual elemento é o LCP. **Relatar antes de
   corrigir.**
5. **Responsividade** — passo separado, iterativo e visual. Não misturar com o
   passo 3.

## Em aberto

- O enquadramento corta o dragão em tela estreita? Provável ajuste em
  `preserveAspectRatio` (SVG) ou no posicionamento do `drawImage` (canvas).
- Vale mesmo a sequência de vídeo, ou o SVG sozinho já entrega a peça? O SVG
  pesa quase nada e diz mais sobre a mão de quem fez.
- Termos de uso comercial da saída do Veo, já que o site é vitrine
  profissional.

---

## Adendo — verificação do vídeo contra o que está acima

O vídeo foi medido com ffmpeg/ffprobe direto no arquivo entregue
(`assets-src/dragao.mp4`). O que segue substitui os números da seção
anterior onde houver divergência.

**Confirmado, sem ressalva:**

- 1280x720, 24 fps, 240 quadros, 10,0 s, H.264 — idêntico ao documentado.
- Câmera travada.
- Pico no quadro 206 — exato.
- Estagnação depois do pico: a variação entre o quadro 206 e o fim é de
  apenas 2,7. O ping-pong continua necessário.
- Dentro do corte de 8,6 s, o quadro 206 é mesmo o pior caso para o texto.
  Calibrar o scrim por ele está correto.

**Divergente — os valores absolutos de brilho são mais altos:**

| Medição | Documentado antes | Medido (signalstats YAVG) |
|---|---|---|
| Global, início → pico | 37,8 → 62,9 | **49,7 → 71,2** |
| Quadrante inf. esquerdo, início → pico | 46,7 → 57,3 | **56,5 → 70,5** |

A forma da curva bate; a escala não. Provável diferença de ferramenta ou
espaço de cor na medição original. O efeito prático é que **o problema de
contraste é pior do que esta página dizia**.

**Não documentado antes, e mais grave que a média sugere:** a partir do
quadro 117 (4,88 s) a zona do texto passa a conter pixels de branco puro
(YMAX 255). São 62 dos ~103 quadros extraídos. Não é só queda de contraste
— é branco estourado atrás do texto.

**Duas descobertas que invalidam premissas:**

1. **A cena não é a descrita.** O dragão cospe fogo **na horizontal, para a
   esquerda**, não para cima. O jato ocupa a faixa central-esquerda e a zona
   do texto recebe a base do fogo por cima, mais uma chuva de faíscas
   atravessando ela inteira. A premissa "fogo para cima deixa o canto
   inferior esquerdo livre" não vale para este vídeo.

2. **O vídeo tem marca d'água.** Um sparkle de quatro pontas (Gemini/Whisk)
   no pescoço do dragão, canto inferior direito, presente nos 240 quadros em
   posição fixa. Isso torna concreta a questão de uso comercial que estava
   listada em aberto.

**Decisão tomada a partir disso:** o SVG passa a ser o caminho principal, e
o vídeo fica como referência de timing e aparência. Motivos: a marca d'água
não tem remoção limpa (está sobre o próprio dragão), a licença é risco num
site de vitrine profissional, e com SVG a composição é controlada — fogo
para cima e canto inferior esquerdo livre, como o layout pede. De quebra,
o orçamento de peso, o LCP e o `prefers-reduced-motion` deixam de ser
problema.
