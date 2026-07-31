/**
 * ScrollFrameSequence — canvas que desenha uma sequência de quadros (AVIF),
 * gerada por `npm run frames` (ver scripts/generate-frames.mjs e
 * docs/briefing-hero-dragao.md). Sem bibliotecas de animação — canvas + rAF.
 *
 * Modos:
 *   loop   — avança sozinho a `fps`, pausa fora da viewport
 *   scroll — o quadro é amarrado ao scroll (frameAtProgress). `scrollTarget`
 *            escolhe a referência: 'self' (progresso do próprio host cruzando
 *            a viewport, para heróis isolados) ou 'document' (progresso da
 *            rolagem da página inteira, para um fundo fixo site-wide).
 *
 * Loop decidido como simples (sem ping-pong): o último quadro da sequência já
 * fica visualmente próximo do primeiro (ver briefing). `onReady` dispara
 * assim que o primeiro quadro decodifica; `onUnsupported` dispara se o
 * navegador não conseguir decodificar AVIF — o chamador deve ter um
 * fallback (ex.: DragonBreath) pronto para esse caso.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function frameAtProgress(progress: number, frameCount: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return Math.min(frameCount, Math.max(1, Math.round(p * (frameCount - 1)) + 1));
}

export type ScrollFrameSequenceProps = {
  frameCount: number;
  frameSrc: (index: number) => string;
  mode?: 'loop' | 'scroll';
  fps?: number;
  className?: string;
  onReady?: () => void;
  onUnsupported?: () => void;
  /** ponto de ancoragem do corte tipo "cover", 0-1 (0.5 = centralizado) */
  anchorX?: number;
  anchorY?: number;
  /** referência do progresso no modo scroll: host próprio ou documento inteiro */
  scrollTarget?: 'self' | 'document';
};

export default function ScrollFrameSequence({
  frameCount,
  frameSrc,
  mode = 'loop',
  fps = 15,
  className,
  onReady,
  onUnsupported,
  anchorX = 0.5,
  anchorY = 0.5,
  scrollTarget = 'self',
}: ScrollFrameSequenceProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const currentFrameRef = useRef(1);

  const [ready, setReady] = useState(false);
  // inicializador preguiçoso: lê matchMedia já na primeira renderização, em
  // vez de começar sempre false — sem isso há uma corrida real de ~200ms no
  // mount onde o loop chega a iniciar antes do efeito de sync rodar
  // (achado durante auditoria, ver docs/briefing-hero-dragao.md).
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // desenha tipo `object-fit: cover` (preserva proporção, corta o excesso)
  // em vez de esticar — sem isso o dragão fica distorcido em telas estreitas,
  // onde a proporção do canvas (alto/estreito) é bem diferente da do vídeo
  // fonte (16:9). Achado na auditoria de responsividade, ver
  // docs/briefing-hero-dragao.md.
  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (imgRatio > canvasRatio) {
      sw = ih * canvasRatio;
      sx = (iw - sw) * anchorX;
    } else {
      sh = iw / canvasRatio;
      sy = (ih - sh) * anchorY;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, [anchorX, anchorY]);

  // resize canvas para o tamanho real do host (com devicePixelRatio)
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      draw(currentFrameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  // carrega o quadro 1 primeiro (pinta assim que possível), depois os
  // restantes em segundo plano, um de cada vez
  useEffect(() => {
    let cancelled = false;
    const first = new window.Image();
    first.decoding = 'async';
    first.onload = () => {
      if (cancelled) return;
      imagesRef.current[1] = first;
      currentFrameRef.current = 1;
      draw(1);
      setReady(true);
      onReady?.();

      let i = 2;
      const loadNext = () => {
        if (cancelled || i > frameCount) return;
        const img = new window.Image();
        img.decoding = 'async';
        img.onload = () => {
          imagesRef.current[i] = img;
          i += 1;
          loadNext();
        };
        img.onerror = () => {
          i += 1;
          loadNext();
        };
        img.src = frameSrc(i);
      };
      loadNext();
    };
    first.onerror = () => {
      if (!cancelled) onUnsupported?.();
    };
    first.src = frameSrc(1);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega uma única vez por frameSrc/frameCount
  }, [frameSrc, frameCount]);

  // modo loop
  useEffect(() => {
    if (mode !== 'loop' || reduced || !ready || !visible) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      if (now - last >= 1000 / fps) {
        last = now;
        const next = currentFrameRef.current >= frameCount ? 1 : currentFrameRef.current + 1;
        if (imagesRef.current[next]) {
          currentFrameRef.current = next;
          draw(next);
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mode, reduced, ready, visible, fps, frameCount, draw]);

  // modo scroll
  const onScroll = useCallback(() => {
    if (!ready) return;
    let progress: number;
    if (scrollTarget === 'document') {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      progress = max > 0 ? window.scrollY / max : 0;
    } else {
      const host = hostRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      progress = 1 - rect.bottom / span;
    }
    const idx = frameAtProgress(progress, frameCount);
    if (imagesRef.current[idx]) {
      currentFrameRef.current = idx;
      draw(idx);
    }
  }, [ready, frameCount, draw, scrollTarget]);

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

  // prefers-reduced-motion: quadro do meio, estático (aproximação do "pico")
  useEffect(() => {
    if (!reduced || !ready) return;
    const mid = Math.max(1, Math.round(frameCount / 2));
    const draw_ = () => {
      if (imagesRef.current[mid]) {
        currentFrameRef.current = mid;
        draw(mid);
      } else {
        const img = new window.Image();
        img.decoding = 'async';
        img.onload = () => {
          imagesRef.current[mid] = img;
          currentFrameRef.current = mid;
          draw(mid);
        };
        img.src = frameSrc(mid);
      }
    };
    draw_();
  }, [reduced, ready, frameCount, frameSrc, draw]);

  return (
    <div ref={hostRef} className={className} style={{ lineHeight: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
