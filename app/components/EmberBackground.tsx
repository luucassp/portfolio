"use client";

import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  op: number;
  life: number;
  maxLife: number;
  hue: number;
  parallax: number;
  flick: number;
  flickP: number;
}

export default function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let scrollY = 0;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Optional background image (procedural fire texture if present)
    const bgImg = new Image();
    let bgLoaded = false;
    bgImg.onload = () => {
      bgLoaded = true;
    };
    bgImg.src = "/ember-bg.jpg";

    const W0 = window.innerWidth;
    const H0 = window.innerHeight;

    const spawn = (initial: boolean): Ember => {
      const maxLife = 3 + Math.random() * 5;
      return {
        x: Math.random() * W0,
        y: initial ? Math.random() * H0 : H0 + Math.random() * 40,
        r: 0.6 + Math.random() * 2.2,
        vy: -(12 + Math.random() * 34),
        vx: (Math.random() - 0.5) * 14,
        op: 0,
        life: initial ? Math.random() * maxLife : 0,
        maxLife,
        hue: 8 + Math.random() * 38, // red→orange→gold range
        parallax: 0.05 + Math.random() * 0.35,
        flick: 0.05 + Math.random() * 0.15,
        flickP: Math.random() * Math.PI * 2,
      };
    };

    const EMBER_COUNT = 140;
    let embers: Ember[] = Array.from({ length: EMBER_COUNT }, () => spawn(true));

    // Slow-drifting ash motes
    const ash = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random() * 3,
      r: 0.5 + Math.random() * 1.2,
      op: 0.05 + Math.random() * 0.12,
      speed: 0.04 + Math.random() * 0.12,
    }));

    const draw = () => {
      t += 0.016;
      const W = canvas.width;
      const H = canvas.height;
      const totalHeight = Math.max(document.body.scrollHeight, H * 3);
      const scrollFrac = scrollY / (totalHeight - H || 1);

      ctx.clearRect(0, 0, W, H);

      // 1. Base gradient — warm black, deepens to blood at bottom
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0a0806");
      grad.addColorStop(0.55, "#0c0705");
      grad.addColorStop(1, `hsl(${8 + scrollFrac * 6}, 55%, ${6 + scrollFrac * 2}%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. Optional texture with parallax
      if (bgLoaded) {
        const scale = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight) * 1.4;
        const iw = bgImg.naturalWidth * scale;
        const ih = bgImg.naturalHeight * scale;
        const ix = (W - iw) / 2;
        const iy = (H - ih) / 2 - scrollY * 0.18;
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.drawImage(bgImg, ix, iy, iw, ih);
        ctx.restore();
      }

      // 3. Pulsing fire glow anchored at the bottom
      const pulse = 0.75 + 0.25 * Math.sin(t * 1.4);
      const glowH = H * 0.6;
      const fg = ctx.createLinearGradient(0, H, 0, H - glowH);
      fg.addColorStop(0, `rgba(180,28,20,${(0.28 * pulse).toFixed(3)})`);
      fg.addColorStop(0.4, `rgba(120,20,14,${(0.12 * pulse).toFixed(3)})`);
      fg.addColorStop(1, "transparent");
      ctx.fillStyle = fg;
      ctx.fillRect(0, H - glowH, W, glowH);

      // Central ember bloom
      const bloom = ctx.createRadialGradient(W / 2, H * 1.02, 0, W / 2, H * 1.02, W * 0.7);
      bloom.addColorStop(0, `rgba(234,88,12,${(0.18 * pulse).toFixed(3)})`);
      bloom.addColorStop(1, "transparent");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      // 4. Drifting ash
      for (const a of ash) {
        const rawY = a.y * totalHeight - scrollY * a.speed;
        const displayY = ((rawY % H) + H) % H;
        ctx.beginPath();
        ctx.arc(a.x * W, displayY, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,170,150,${a.op})`;
        ctx.fill();
      }

      // 5. Rising embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += 0.016;
        if (e.life >= e.maxLife || e.y < -20) {
          embers[i] = spawn(false);
          continue;
        }

        const lifeFrac = e.life / e.maxLife;
        // fade in then out
        e.op = Math.sin(lifeFrac * Math.PI);

        e.x += e.vx * 0.016 + Math.sin(t * 0.6 + i) * 0.3;
        e.y += e.vy * 0.016;

        const flicker = 0.6 + 0.4 * Math.sin(t * e.flick * 60 + e.flickP);
        const displayY = e.y - scrollY * e.parallax;
        const alpha = e.op * flicker;

        if (displayY < -10 || displayY > H + 10) continue;

        // glow halo
        const halo = ctx.createRadialGradient(e.x, displayY, 0, e.x, displayY, e.r * 4);
        halo.addColorStop(0, `hsla(${e.hue}, 95%, 60%, ${(alpha * 0.5).toFixed(3)})`);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(e.x, displayY, e.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(e.x, displayY, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue + 15}, 100%, 75%, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // 6. Top vignette so navbar text stays readable
      const topVig = ctx.createLinearGradient(0, 0, 0, H * 0.25);
      topVig.addColorStop(0, "rgba(10,8,6,0.7)");
      topVig.addColorStop(1, "transparent");
      ctx.fillStyle = topVig;
      ctx.fillRect(0, 0, W, H * 0.25);

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
