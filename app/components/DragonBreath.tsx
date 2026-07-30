/**
 * DragonBreath — animação quadro a quadro (12 quadros) de um dragão cuspindo fogo.
 *
 * Ilustração original em SVG, sem dependências. Funciona em Next.js (App Router):
 * marque o arquivo como client component ou importe dentro de um.
 *
 *   'use client';
 *   import DragonBreath from '@/app/components/DragonBreath';
 *
 *   <DragonBreath mode="loop" fps={12} className="w-full max-w-[600px]" />
 *
 * Modos:
 *   loop   — roda sozinho, pausa quando sai da viewport
 *   hover  — parado no quadro 0, anima no hover/foco
 *   scroll — o quadro é controlado pela posição do elemento na viewport (scrub)
 *
 * Respeita prefers-reduced-motion: mostra o quadro de pico, sem movimento.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const FRAME_COUNT = 12;

const JAW = [6, 12, 20, 28, 32, 30, 33, 29, 24, 18, 11, 7];
const JET_SCALE = [0.06, 0.18, 0.4, 0.8, 1, 0.95, 1.06, 0.9, 0.7, 0.45, 0.24, 0.1];
const JET_ALPHA = [0.5, 0.8, 1, 1, 1, 1, 1, 1, 0.92, 0.72, 0.5, 0.28];
const GLOW = [0.35, 0.6, 0.9, 1, 1, 0.95, 1, 0.88, 0.7, 0.5, 0.34, 0.2];
const SMOKE_SCALE = [0.1, 0.22, 0.42, 0.7, 0.92, 1.06, 1.2, 1.34, 1.44, 1.52, 1.58, 1.62];
const SMOKE_ALPHA = [0.18, 0.3, 0.45, 0.6, 0.7, 0.72, 0.72, 0.68, 0.62, 0.55, 0.46, 0.36];
export const PEAK_FRAME = 6;

const EMBER_COUNT = 18;
const SPARK_COUNT = 14;

function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

type Dot = { x: number; y: number; r: number; o: number };

const EMBERS: Dot[][] = Array.from({ length: FRAME_COUNT }, (_, f) =>
  Array.from({ length: EMBER_COUNT }, (_, i) => {
    const a = rand(i * 3.1 + f * 7.7);
    const b = rand(i * 5.3 + f * 2.9);
    const reach = Math.max(JET_SCALE[f], 0.15);
    return {
      x: 30 + a * 290 * reach,
      y: (b * 96 - 48) * (0.4 + JET_SCALE[f] * 0.9),
      r: 1.4 + (i % 3) * 0.9,
      o: JET_ALPHA[f] * (0.3 + a * 0.65),
    };
  }),
);

const SPARKS: Dot[][] = Array.from({ length: FRAME_COUNT }, (_, f) =>
  Array.from({ length: SPARK_COUNT }, (_, i) => {
    const a = rand(i * 9.7 + 4.2);
    const b = rand(i * 2.3 + 8.1);
    const drift = (f + i * 3) % FRAME_COUNT;
    return {
      x: 40 + a * 520,
      y: 820 - ((b * 640 + drift * 26) % 660),
      r: 1 + (i % 2) * 0.8,
      o: 0.25 + b * 0.55,
    };
  }),
);

export type DragonBreathProps = {
  mode?: 'loop' | 'hover' | 'scroll';
  fps?: number;
  className?: string;
  label?: string;
  /** cobre o container (recorta as bordas) em vez de manter a cena inteira visível */
  cover?: boolean;
};

export default function DragonBreath({
  mode = 'loop',
  fps = 12,
  className,
  label = 'Dragão cuspindo fogo sobre um desfiladeiro',
  cover = false,
}: DragonBreathProps) {
  const [frame, setFrame] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(mode !== 'loop');
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || mode !== 'loop') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  const running = !reduced && (mode === 'loop' ? visible : mode === 'hover' ? hovering : false);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      if (now - last >= 1000 / fps) {
        last = now;
        setFrame((f) => (f + 1) % FRAME_COUNT);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, fps]);

  const onScroll = useCallback(() => {
    const el = hostRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const span = window.innerHeight + rect.height;
    const p = 1 - (rect.bottom / span);
    setFrame(Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1)))));
  }, []);

  useEffect(() => {
    if (mode !== 'scroll' || reduced) return;
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [mode, reduced, onScroll]);

  const f = reduced ? PEAK_FRAME : mode === 'hover' && !hovering ? 0 : frame;
  const wobble = Math.sin(f * 1.7) * 2.4;
  const bob = Math.sin(f * 0.9) * 3;

  return (
    <div
      ref={hostRef}
      className={className}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      tabIndex={mode === 'hover' ? 0 : -1}
      style={{ lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 600 840"
        width="100%"
        height={cover ? '100%' : undefined}
        preserveAspectRatio={cover ? 'xMidYMid slice' : 'xMidYMid meet'}
        role="img"
        aria-label={label}
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="db-sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b2130" />
            <stop offset="0.42" stopColor="#7d4a30" />
            <stop offset="0.75" stopColor="#e6a044" />
            <stop offset="1" stopColor="#f9d885" />
          </linearGradient>
          <radialGradient id="db-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe6a8" stopOpacity="0.85" />
            <stop offset="1" stopColor="#ffc65c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="db-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffc061" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ff8a1f" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="600" height="840" fill="url(#db-sky)" />
        <circle cx="470" cy="470" r="230" fill="url(#db-sun)" />
        <path d="M0 92 C 96 40 186 74 262 44 C 210 106 132 132 62 154 C 34 138 14 118 0 92 Z" fill="#241c28" opacity="0.75" />
        <path d="M0 196 C 74 168 132 196 198 176 C 148 222 86 240 0 246 Z" fill="#2c2130" opacity="0.6" />

        <path d="M0 468 L64 446 L118 470 L182 442 L240 466 L302 448 L364 470 L442 440 L520 466 L600 448 L600 528 L0 528 Z" fill="#8d5c3c" opacity="0.5" />
        <path d="M0 636 C 122 596 244 644 362 614 C 462 590 542 622 600 602 L600 840 L0 840 Z" fill="#6b3a22" />
        <path d="M0 724 C 132 686 252 734 382 704 C 480 682 552 710 600 698 L600 840 L0 840 Z" fill="#482314" />
        <path d="M64 742 L128 700 L182 748 Z M330 782 L402 736 L462 790 Z" fill="#33170d" opacity="0.8" />

        <ellipse cx={70 + 40 * JET_SCALE[f]} cy="812" rx={150 * JET_SCALE[f] + 40} ry={44 * JET_SCALE[f] + 14} fill="url(#db-glow)" opacity={GLOW[f]} />

        <g transform={`translate(0 ${bob})`}>
          <path d="M392 246 C 296 156 176 126 68 166 C 148 176 212 200 262 238 C 192 238 130 260 90 296 C 174 270 254 270 320 302 Z" fill="#40241a" />
          <path d="M392 246 C 320 190 236 166 152 172 C 214 186 268 210 312 244 Z" fill="#573020" opacity="0.85" />
          <path d="M404 208 C 448 122 522 58 594 34 C 546 118 516 192 490 250 Z" fill="#341d14" />

          <path d="M300 306 C 336 208 432 186 492 234 C 546 276 540 360 488 400 C 430 444 348 424 312 374 Z" fill="#5c3320" />
          <path d="M330 300 C 366 232 434 216 480 250 C 520 280 516 342 478 372 C 434 406 366 386 340 348 Z" fill="#6f3f25" />
          <path d="M356 214 L378 178 L392 218 Z M406 190 L430 156 L442 198 Z M452 184 L478 156 L484 200 Z" fill="#42241a" />
          <path d="M352 300 C 396 288 440 296 470 318 M348 344 C 392 332 438 340 468 360" stroke="#ff8a2b" strokeWidth="2.5" fill="none" opacity="0.55" />

          <path d="M332 348 C 322 418 300 470 266 522 L 352 562 C 382 500 402 442 406 386 Z" fill="#5c3320" />
          <path d="M340 356 C 332 416 314 464 288 508 L 336 530 C 362 480 380 430 386 384 Z" fill="#6f3f25" />
          <path d="M318 386 L292 370 L306 410 Z M300 440 L272 428 L284 468 Z M280 492 L252 484 L264 522 Z" fill="#42241a" />
          <path d="M330 400 C 316 444 300 480 280 512" stroke="#ff8a2b" strokeWidth="2.5" fill="none" opacity="0.5" />

          <g transform="translate(276 548) rotate(-53) scale(0.9)">
            <path d="M170 -58 C 122 -58 80 -44 42 -22 C 88 -58 142 -80 186 -74 Z" fill="#3d2317" />
            <path d="M186 -26 C 140 -34 96 -36 56 -28 C 104 -54 158 -56 198 -42 Z" fill="#4e2c1b" />
            <path d="M142 26 C 178 36 204 60 216 86 C 182 64 152 48 122 42 Z" fill="#3d2317" />
            <path d="M-160 -10 L-115 -26 L-58 -37 L0 -41 L54 -30 L78 -4 L58 14 L-10 8 L-76 3 L-142 1 Z" fill="#5c3320" />
            <path d="M-142 -8 L-92 -21 L-40 -30 L6 -32 L50 -23 L66 -6 L38 2 L-30 -2 L-96 -6 Z" fill="#7a4526" />
            <path d="M-138 1 L-132 14 L-124 2 Z M-106 3 L-99 18 L-91 4 Z M-72 4 L-64 20 L-55 5 Z M-34 5 L-26 21 L-17 6 Z M6 6 L14 20 L22 7 Z" fill="#f2e6cc" />
            <path d="M-120 -14 C -70 -22 -20 -26 26 -24" stroke="#ff8a2b" strokeWidth="2" fill="none" opacity={0.35 + 0.5 * GLOW[f]} />
            <circle cx="12" cy="-18" r="13" fill="#ff8a1f" opacity={0.25 * GLOW[f]} />
            <circle cx="12" cy="-18" r="6.5" fill="#2a1509" />
            <circle cx="12" cy="-18" r="4.6" fill="#ffb02e" />
            <circle cx="13" cy="-19" r="1.9" fill="#fff4d6" />
            <g transform={`rotate(${JAW[f]} 66 10)`}>
              <path d="M-150 6 L-86 24 L-20 35 L38 37 L64 20 L10 18 L-66 10 L-146 4 Z" fill="#4e2c1b" />
              <path d="M-138 8 L-82 23 L-24 31 L32 32 L50 20 L4 15 L-68 8 L-136 3 Z" fill="#6b3d23" />
              <path d="M-130 5 L-124 -8 L-116 6 Z M-96 8 L-89 -7 L-81 9 Z M-60 12 L-52 -4 L-44 13 Z M-22 15 L-14 0 L-6 16 Z" fill="#f2e6cc" />
            </g>
          </g>
        </g>

        <g transform="translate(182 658) rotate(133)">
          <g transform={`scale(${SMOKE_SCALE[f].toFixed(2)})`} opacity={SMOKE_ALPHA[f]}>
            <ellipse cx="236" cy="-24" rx="70" ry="54" fill="#3a2b26" />
            <ellipse cx="292" cy="20" rx="84" ry="64" fill="#312320" />
            <ellipse cx="204" cy="34" rx="58" ry="46" fill="#4a352c" />
            <ellipse cx="332" cy="-32" rx="58" ry="48" fill="#543d31" />
          </g>
          <g transform={`scale(${JET_SCALE[f].toFixed(2)} 1) rotate(${wobble.toFixed(1)})`} opacity={JET_ALPHA[f]}>
            <path d="M0 -20 C 62 -48 142 -62 232 -44 C 286 -32 286 36 230 48 C 142 64 62 44 0 20 Z" fill="#8c2f08" />
            <path d="M0 -15 C 58 -36 130 -50 202 -35 C 244 -26 246 30 198 38 C 130 50 58 34 0 15 Z" fill="#d9560f" />
            <path d="M0 -10 C 46 -24 102 -32 152 -22 C 182 -16 183 19 150 25 C 100 33 46 21 0 10 Z" fill="#f5a71c" />
            <path d="M0 -5 C 30 -13 68 -18 100 -11 C 120 -8 120 11 99 14 C 68 19 30 11 0 5 Z" fill="#fff0c2" />
          </g>
          <g>
            {EMBERS[f].map((d, i) => (
              <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r} fill={i % 3 === 0 ? '#ffd98a' : '#f5a71c'} opacity={d.o.toFixed(2)} />
            ))}
          </g>
        </g>

        <g>
          {SPARKS[f].map((d, i) => (
            <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r} fill="#ffe9b8" opacity={(d.o * (0.4 + GLOW[f] * 0.6)).toFixed(2)} />
          ))}
        </g>
      </svg>
    </div>
  );
}
