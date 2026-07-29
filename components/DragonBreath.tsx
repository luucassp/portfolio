/**
 * DragonBreath — dragão de perfil cuspindo fogo para cima, em SVG.
 *
 * Serve como peça final leve do hero ou como poster/fallback de uma
 * sequência de quadros.
 *
 * Como funciona: a chama é desenhada em 12 quadros discretos. Cada quadro é
 * um <g> que fica visível durante 1/12 do ciclo, via `steps(1)` + delay
 * escalonado. É animação quadro a quadro de verdade, não interpolação — o
 * tremular fica seco, como fogo, e não elástico.
 *
 * Sem dependências e sem JavaScript em runtime: é um server component, a
 * animação é CSS puro. `prefers-reduced-motion` é tratado no próprio CSS,
 * congelando no quadro de pico.
 *
 * Enquadramento: viewBox 1200x800 com preserveAspectRatio="slice", então
 * cobre o container como background. O dragão fica à direita e o fogo sobe
 * pela faixa central — o canto inferior esquerdo fica livre para o texto.
 *
 * É decorativo: `aria-hidden`. O hero precisa fazer sentido sem ele.
 */

const FRAME_COUNT = 12;
const CYCLE_SECONDS = 1.6;

/** Quadro mais aceso — usado quando o usuário pede menos movimento. */
const PEAK_FRAME = 7;

type Tongue = {
  /** deslocamento horizontal a partir da boca */
  x: number;
  /** altura relativa da língua de fogo */
  scale: number;
  /** inclinação, em graus */
  tilt: number;
  opacity: number;
};

/**
 * Gera as línguas de fogo de um quadro.
 *
 * Determinístico de propósito: o mesmo índice sempre produz a mesma forma,
 * senão servidor e cliente renderizariam SVGs diferentes e a hidratação
 * quebraria. Nada de Math.random aqui.
 */
function tonguesForFrame(frame: number): Tongue[] {
  const phase = (frame / FRAME_COUNT) * Math.PI * 2;

  return [
    {
      x: -16 + Math.sin(phase) * 9,
      scale: 1.0 + Math.sin(phase) * 0.13,
      tilt: -7 + Math.sin(phase * 1.3) * 6,
      opacity: 0.9,
    },
    {
      x: 22 + Math.cos(phase * 1.1) * 10,
      scale: 0.84 + Math.cos(phase * 0.9) * 0.15,
      tilt: 9 + Math.cos(phase) * 6,
      opacity: 0.88,
    },
    {
      x: 2 + Math.sin(phase * 1.7) * 12,
      scale: 1.24 + Math.cos(phase * 1.4) * 0.11,
      tilt: 0 + Math.sin(phase * 0.8) * 4,
      opacity: 1,
    },
    {
      x: -40 + Math.cos(phase * 1.5) * 8,
      scale: 0.62 + Math.sin(phase * 1.2) * 0.13,
      tilt: -19 + Math.cos(phase * 1.1) * 7,
      opacity: 0.72,
    },
    {
      x: 48 + Math.sin(phase * 0.7) * 9,
      scale: 0.58 + Math.cos(phase * 1.6) * 0.12,
      tilt: 20 + Math.sin(phase * 1.4) * 8,
      opacity: 0.68,
    },
  ];
}

/** Fagulhas subindo. Posições fixas, animação escalonada por CSS. */
const EMBERS = Array.from({ length: 24 }, (_, i) => {
  const t = i / 24;
  return {
    x: 420 + Math.sin(i * 2.3) * 250 + t * 120,
    y: 250 + Math.cos(i * 1.7) * 190,
    r: 1.3 + (i % 4) * 0.6,
    delay: (i * 0.37) % 4,
    duration: 3.2 + (i % 5) * 0.6,
  };
});

export default function DragonBreath({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <style>{`
        @keyframes db-frame {
          0%, 8.333% { opacity: 1; }
          8.334%, 100% { opacity: 0; }
        }
        @keyframes db-ember {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          12%  { opacity: 1; }
          75%  { opacity: .7; }
          100% { transform: translateY(-200px) scale(.3); opacity: 0; }
        }
        @keyframes db-glow {
          0%, 100% { opacity: .55; }
          50%      { opacity: .9; }
        }
        .db-frame {
          opacity: 0;
          animation: db-frame ${CYCLE_SECONDS}s steps(1, end) infinite both;
        }
        .db-ember { animation: db-ember linear infinite both; }
        .db-glow  { animation: db-glow 2.4s ease-in-out infinite both; }

        /* Sem movimento: congela no quadro de pico. */
        @media (prefers-reduced-motion: reduce) {
          .db-frame { animation: none; opacity: 0; }
          .db-frame[data-peak="true"] { opacity: 1; }
          .db-ember { animation: none; opacity: .75; }
          .db-glow  { animation: none; opacity: .75; }
        }
      `}</style>

      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        role="presentation"
        focusable="false"
        style={{ display: "block" }}
      >
        <defs>
          {/* Céu noturno, com o calor do fogo lavando a parte de cima */}
          <linearGradient id="db-sky" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#1c1015" />
            <stop offset="45%" stopColor="#100a10" />
            <stop offset="100%" stopColor="#07050a" />
          </linearGradient>

          <radialGradient id="db-fireglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#b91c1c" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
          </radialGradient>

          {/* Chama: dourado no núcleo, sangue na borda */}
          <linearGradient id="db-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="28%" stopColor="#d4af37" />
            <stop offset="62%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="db-flame-core" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="45%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
          </linearGradient>

          {/* Escamas: pedra escura, iluminada por cima pelo fogo */}
          <linearGradient id="db-hide" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#5c3a2c" />
            <stop offset="35%" stopColor="#33201d" />
            <stop offset="100%" stopColor="#150d10" />
          </linearGradient>

          <linearGradient id="db-hide-dark" x1="0" y1="0" x2="1" y2="0.8">
            <stop offset="0%" stopColor="#2a1a18" />
            <stop offset="100%" stopColor="#100a0c" />
          </linearGradient>

          {/* Chifre: base escura, ponta pegando de leve a luz do fogo */}
          <linearGradient id="db-horn" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#180f0d" />
            <stop offset="55%" stopColor="#241811" />
            <stop offset="100%" stopColor="#42301f" />
          </linearGradient>

          {/* Textura de escamas, sobreposta ao couro */}
          <pattern
            id="db-scales"
            width="30"
            height="22"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-40)"
          >
            <path
              d="M0,22 A15,16 0 0 1 30,22"
              fill="none"
              stroke="#6b442f"
              strokeWidth="1.5"
              opacity="0.34"
            />
            <path
              d="M-15,11 A15,16 0 0 1 15,11"
              fill="none"
              stroke="#6b442f"
              strokeWidth="1.5"
              opacity="0.34"
            />
            <path
              d="M15,11 A15,16 0 0 1 45,11"
              fill="none"
              stroke="#6b442f"
              strokeWidth="1.5"
              opacity="0.34"
            />
          </pattern>

          {/* Uma língua de fogo, apontando para cima a partir de (0,0) */}
          <path
            id="db-tongue"
            d="M0,0
               C-30,-46 -36,-104 -14,-158
               C-7,-182 3,-200 0,-232
               C12,-198 26,-172 35,-136
               C46,-90 30,-38 0,0 Z"
          />

          <filter id="db-soften" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="db-soften-sm" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="db-soften-lg" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="34" />
          </filter>
        </defs>

        {/* Céu */}
        <rect width="1200" height="800" fill="url(#db-sky)" />

        {/* Brilho do fogo lavando o céu. Fica na faixa central/alta,
            longe do canto inferior esquerdo onde o texto vai. */}
        <ellipse
          className="db-glow"
          cx="700"
          cy="200"
          rx="430"
          ry="330"
          fill="url(#db-fireglow)"
        />

        {/* Montanhas ao fundo */}
        <path
          d="M0,800 L0,690 L150,628 L286,676 L430,596 L560,660 L700,610 L840,668 L1000,614 L1200,672 L1200,800 Z"
          fill="#0a0609"
          opacity="0.95"
        />

        {/* ══ Dragão ══ */}
        <g>
          {/* Chifres, varridos para trás — atrás do crânio */}
          <g fill="url(#db-horn)">
            <path d="M940,222 C976,186 1030,152 1092,126 C1060,166 1014,206 972,242 Z" />
            <path d="M960,258 C1000,232 1054,212 1104,204 C1064,226 1016,254 984,282 Z" />
            <path d="M936,196 C962,166 996,140 1032,120 C1012,154 986,190 968,220 Z" opacity="0.85" />
          </g>

          {/* Pescoço */}
          <path
            id="db-neck"
            d="M1200,800
               L1200,470
               C1156,432 1104,388 1054,344
               C1022,316 996,292 976,274
               L892,330
               C934,366 1000,420 1054,468
               C1104,512 1136,576 1152,660
               L1166,800 Z"
            fill="url(#db-hide)"
          />
          {/* Escamas sobre o pescoço */}
          <use href="#db-neck" fill="url(#db-scales)" />

          {/* Crista dorsal */}
          <g fill="url(#db-hide-dark)">
            <path d="M1064,352 L1108,292 L1120,364 Z" />
            <path d="M1114,398 L1160,340 L1170,412 Z" />
            <path d="M1160,448 L1200,396 L1200,470 Z" />
          </g>

          {/* Fendas de brasa no couro */}
          <g stroke="#ea580c" strokeLinecap="round" fill="none">
            <path d="M1082,506 C1104,542 1112,584 1108,628" strokeWidth="3" opacity="0.7" />
            <path d="M1118,556 C1142,576 1160,602 1168,636" strokeWidth="2.4" opacity="0.55" />
            <path d="M1052,458 C1070,480 1078,506 1080,530" strokeWidth="2" opacity="0.6" />
            <path d="M1130,660 C1144,696 1150,736 1152,778" strokeWidth="2.6" opacity="0.45" />
          </g>

          {/* Interior da goela — desenhado antes das mandíbulas */}
          <path d="M984,296 L756,142 L748,232 L978,356 Z" fill="#6b0f0f" />
          <path
            d="M968,304 L784,180 L778,236 L964,342 Z"
            fill="#2b0606"
            opacity="0.75"
          />

          {/* Maxilar superior */}
          <path
            d="M986,292
               C972,246 944,206 908,180
               C866,150 812,132 774,128
               C760,126 752,136 762,146
               C794,180 836,220 876,254
               C912,284 954,306 976,310
               C988,312 990,302 986,292 Z"
            fill="url(#db-hide)"
          />
          <path
            d="M986,292
               C972,246 944,206 908,180
               C866,150 812,132 774,128
               C760,126 752,136 762,146
               C794,180 836,220 876,254
               C912,284 954,306 976,310
               C988,312 990,302 986,292 Z"
            fill="url(#db-scales)"
          />

          {/* Mandíbula inferior */}
          <path
            d="M980,320
               C950,314 910,296 872,272
               C834,248 798,226 774,212
               C762,205 752,216 761,226
               C790,260 828,296 868,324
               C906,350 950,364 972,360
               C986,357 988,326 980,320 Z"
            fill="url(#db-hide-dark)"
          />
          <path
            d="M980,320
               C950,314 910,296 872,272
               C834,248 798,226 774,212
               C762,205 752,216 761,226
               C790,260 828,296 868,324
               C906,350 950,364 972,360
               C986,357 988,326 980,320 Z"
            fill="url(#db-scales)"
            opacity="0.6"
          />

          {/* Dentes — assentados na linha das mandíbulas */}
          <g fill="#efe4cc">
            {/* superiores, descendo do céu da boca */}
            <path d="M804,184 L818,194 L806,214 Z" />
            <path d="M849,226 L863,236 L851,256 Z" />
            <path d="M894,266 L908,276 L896,296 Z" opacity="0.95" />
            <path d="M937,296 L951,305 L939,325 Z" opacity="0.85" />
            {/* inferiores, subindo da mandíbula */}
            <path d="M814,248 L826,228 L830,252 Z" opacity="0.92" />
            <path d="M860,282 L872,262 L876,286 Z" opacity="0.92" />
            <path d="M906,310 L918,290 L922,314 Z" opacity="0.82" />
          </g>

          {/* Luz do fogo correndo pela quina do focinho */}
          <path
            d="M774,128 C812,132 866,150 908,180 C944,206 972,246 986,292"
            fill="none"
            stroke="#e09553"
            strokeWidth="3.5"
            opacity="0.4"
            filter="url(#db-soften-sm)"
          />

          {/* Arco superciliar */}
          <path
            d="M916,214 C940,200 966,196 990,202 C972,216 950,230 934,246 Z"
            fill="url(#db-hide-dark)"
          />

          {/* Olho */}
          <ellipse cx="944" cy="238" rx="14" ry="9" fill="#f59e0b" transform="rotate(28 944 238)" />
          <ellipse cx="944" cy="238" rx="3.2" ry="8" fill="#170803" transform="rotate(28 944 238)" />
          <ellipse
            className="db-glow"
            cx="944"
            cy="238"
            rx="32"
            ry="24"
            fill="#f59e0b"
            opacity="0.28"
            filter="url(#db-soften)"
          />

          {/* Narina */}
          <ellipse cx="800" cy="150" rx="7" ry="4.5" fill="#150c0a" transform="rotate(34 800 150)" />
        </g>

        {/* ══ Fogo: 12 quadros discretos, saindo da goela para cima ══ */}
        <g transform="translate(806, 176)">
          {/* halo atrás da chama */}
          <ellipse
            className="db-glow"
            cx="0"
            cy="-150"
            rx="210"
            ry="250"
            fill="url(#db-fireglow)"
            filter="url(#db-soften-lg)"
          />

          {/* base contínua: costura as línguas num jato só */}
          <path
            d="M-60,16 C-38,-26 -26,-72 -20,-118 L20,-118 C26,-72 38,-26 60,16 Z"
            fill="url(#db-flame)"
            opacity="0.55"
            filter="url(#db-soften)"
          />

          {Array.from({ length: FRAME_COUNT }, (_, frame) => (
            <g
              key={frame}
              className="db-frame"
              data-peak={frame === PEAK_FRAME ? "true" : undefined}
              style={{ animationDelay: `${(frame * CYCLE_SECONDS) / FRAME_COUNT}s` }}
            >
              {tonguesForFrame(frame).map((tongue, i) => (
                <g
                  key={i}
                  transform={`translate(${tongue.x.toFixed(2)}, 0) rotate(${tongue.tilt.toFixed(
                    2
                  )}) scale(${tongue.scale.toFixed(3)})`}
                >
                  <use
                    href="#db-tongue"
                    fill="url(#db-flame)"
                    opacity={tongue.opacity}
                    filter="url(#db-soften)"
                  />
                  <use
                    href="#db-tongue"
                    fill="url(#db-flame-core)"
                    opacity={tongue.opacity * 0.8}
                    transform="scale(0.5)"
                    filter="url(#db-soften-sm)"
                  />
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* Fagulhas subindo */}
        <g>
          {EMBERS.map((e, i) => (
            <circle
              key={i}
              className="db-ember"
              cx={e.x.toFixed(1)}
              cy={e.y.toFixed(1)}
              r={e.r}
              fill={i % 3 === 0 ? "#d4af37" : "#ea580c"}
              style={{
                animationDelay: `${e.delay.toFixed(2)}s`,
                animationDuration: `${e.duration.toFixed(2)}s`,
              }}
            />
          ))}
        </g>

        {/* Escurecimento no canto inferior esquerdo, onde o texto entra.
            Calibrado pelo estado mais aceso da animação, não pelo mais escuro. */}
        <linearGradient id="db-scrim" x1="0" y1="1" x2="0.85" y2="0">
          <stop offset="0%" stopColor="#07050a" stopOpacity="0.94" />
          <stop offset="42%" stopColor="#07050a" stopOpacity="0.66" />
          <stop offset="100%" stopColor="#07050a" stopOpacity="0" />
        </linearGradient>
        <rect width="1200" height="800" fill="url(#db-scrim)" />
      </svg>
    </div>
  );
}
