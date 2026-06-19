"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  op: number;
  speed: number;
  tw: number;
  twP: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  speed: number;
  op: number;
  active: boolean;
  angle: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  speed: number;
  rings: boolean;
}

export default function SpaceBackground() {
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

    // Try loading external image; fall back to procedural
    const bgImg = new Image();
    let bgLoaded = false;
    bgImg.onload = () => {
      bgLoaded = true;
    };
    bgImg.src = "/space-bg.jpg";

    // Rich procedural nebula texture
    const buildNebulaTex = () => {
      const s = 640;
      const nc = document.createElement("canvas");
      nc.width = s;
      nc.height = s;
      const nctx = nc.getContext("2d")!;

      nctx.fillStyle = "#030010";
      nctx.fillRect(0, 0, s, s);

      const blobs: [number, number, number, string][] = [
        // Core pink/magenta
        [320, 280, 180, "rgba(200,30,120,0.40)"],
        [300, 320, 140, "rgba(230,50,150,0.30)"],
        [340, 260, 100, "rgba(255,80,180,0.25)"],
        // Purple surroundings
        [220, 200, 200, "rgba(120,30,200,0.35)"],
        [440, 350, 180, "rgba(100,20,180,0.30)"],
        [180, 400, 160, "rgba(140,40,200,0.25)"],
        [400, 180, 150, "rgba(110,25,190,0.28)"],
        // Blue edges
        [100, 150, 200, "rgba(30,50,220,0.22)"],
        [520, 480, 190, "rgba(20,60,200,0.20)"],
        [500, 120, 160, "rgba(40,40,210,0.18)"],
        [120, 500, 170, "rgba(25,70,190,0.20)"],
        // Teal accents
        [480, 280, 100, "rgba(20,180,180,0.12)"],
        [160, 320, 90, "rgba(30,160,200,0.10)"],
        // Deep violet fill
        [320, 320, 260, "rgba(80,15,140,0.20)"],
        [250, 250, 220, "rgba(60,10,120,0.15)"],
      ];

      for (const [bx, by, br, bc] of blobs) {
        const g = nctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, bc);
        g.addColorStop(0.4, bc.replace(/[\d.]+\)$/, `${parseFloat(bc.match(/[\d.]+\)$/)?.[0] || "0.1") * 0.5})`));
        g.addColorStop(1, "transparent");
        nctx.fillStyle = g;
        nctx.beginPath();
        nctx.arc(bx, by, br, 0, Math.PI * 2);
        nctx.fill();
      }

      // Wispy filaments
      nctx.save();
      nctx.globalAlpha = 0.15;
      nctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 12; i++) {
        const fx = 200 + Math.random() * 240;
        const fy = 180 + Math.random() * 280;
        const fr = 60 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        nctx.save();
        nctx.translate(fx, fy);
        nctx.rotate(angle);
        nctx.scale(1, 0.3 + Math.random() * 0.4);
        const fg = nctx.createRadialGradient(0, 0, 0, 0, 0, fr);
        const hue = 280 + Math.random() * 60;
        fg.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.4)`);
        fg.addColorStop(1, "transparent");
        nctx.fillStyle = fg;
        nctx.beginPath();
        nctx.arc(0, 0, fr, 0, Math.PI * 2);
        nctx.fill();
        nctx.restore();
      }
      nctx.restore();

      // Fine grain noise
      const imgData = nctx.getImageData(0, 0, s, s);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15;
        d[i] = Math.max(0, Math.min(255, d[i] + noise));
        d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise));
        d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise));
      }
      nctx.putImageData(imgData, 0, 0);

      // Embedded stars in the texture
      for (let i = 0; i < 80; i++) {
        const sx = Math.random() * s;
        const sy = Math.random() * s;
        const sr = 0.5 + Math.random() * 1.5;
        nctx.beginPath();
        nctx.arc(sx, sy, sr, 0, Math.PI * 2);
        nctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`;
        nctx.fill();
      }

      return nc;
    };
    const nebulaCanvas = buildNebulaTex();

    // Stars — 3 layers
    const mkStars = (n: number, rMin: number, rMax: number, spd: number): Star[] =>
      Array.from({ length: n }, () => {
        const isBright = Math.random() < 0.08;
        return {
          x: Math.random(),
          y: Math.random() * 5,
          r: isBright ? rMax + Math.random() * 1.5 : rMin + Math.random() * (rMax - rMin),
          op: isBright ? 0.8 + Math.random() * 0.2 : 0.3 + Math.random() * 0.7,
          speed: spd,
          tw: 0.006 + Math.random() * 0.02,
          twP: Math.random() * Math.PI * 2,
          color: isBright
            ? ["rgba(200,220,255,", "rgba(255,200,220,", "rgba(220,200,255,"][Math.floor(Math.random() * 3)]
            : "rgba(255,255,255,",
        };
      });

    const back = mkStars(300, 0.2, 0.6, 0.06);
    const mid = mkStars(160, 0.6, 1.3, 0.16);
    const front = mkStars(70, 1.3, 2.2, 0.32);

    // Meteors
    const meteors: Meteor[] = Array.from({ length: 6 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.5,
      len: 80 + Math.random() * 130,
      speed: 5 + Math.random() * 9,
      op: 0,
      active: false,
      angle: Math.PI / 4 + (Math.random() * 0.4 - 0.2),
    }));
    let nextMeteor = 2 + Math.random() * 6;

    // Planets
    const planets: Planet[] = [
      { x: 0.15, y: 0.8, radius: 55, color: "#7c3aed", glowColor: "#a855f7", speed: 0.15, rings: false },
      { x: 0.75, y: 2.2, radius: 38, color: "#1d4ed8", glowColor: "#3b82f6", speed: 0.2, rings: true },
      { x: 0.88, y: 3.8, radius: 70, color: "#047857", glowColor: "#10b981", speed: 0.12, rings: false },
      { x: 0.25, y: 5.0, radius: 45, color: "#9d174d", glowColor: "#ec4899", speed: 0.18, rings: true },
    ];

    const drawNebula = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      t += 0.016;
      const W = canvas.width;
      const H = canvas.height;
      const totalHeight = Math.max(document.body.scrollHeight, H * 5);
      const scrollFrac = scrollY / (totalHeight - H || 1);

      ctx.clearRect(0, 0, W, H);

      // 1. Base gradient (shifts hue with scroll)
      const hue = 240 + scrollFrac * 40;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `hsl(${hue}, 50%, 2%)`);
      grad.addColorStop(0.5, `hsl(${hue - 10}, 40%, 3%)`);
      grad.addColorStop(1, `hsl(${hue + 20}, 35%, 4%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. Background image OR procedural nebula texture
      const tex = bgLoaded ? bgImg : nebulaCanvas;
      const texW = bgLoaded ? bgImg.naturalWidth : 640;
      const texH = bgLoaded ? bgImg.naturalHeight : 640;
      const scale = Math.max(W / texW, H / texH) * 1.5;
      const iw = texW * scale;
      const ih = texH * scale;
      const ix = (W - iw) / 2;
      const iy = (H - ih) / 2 - scrollY * 0.20;

      ctx.save();
      ctx.globalAlpha = bgLoaded ? 0.25 : 0.40;
      ctx.drawImage(tex, ix, iy, iw, ih);
      ctx.restore();

      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, W * 0.8);
      vig.addColorStop(0, "rgba(3,0,15,0.0)");
      vig.addColorStop(1, "rgba(3,0,15,0.78)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // 3. Synthetic nebula clouds (additional depth layers)
      drawNebula(W * 0.80, H * 0.15 - scrollY * 0.05, 220, "rgba(120,30,200,0.07)");
      drawNebula(W * 0.15, H * 0.65 - scrollY * 0.07, 180, "rgba(30,50,220,0.06)");
      drawNebula(W * 0.50, H * 0.35 - scrollY * 0.03, 260, "rgba(200,30,120,0.05)");
      drawNebula(W * 0.70, H * 0.80 - scrollY * 0.09, 190, "rgba(80,20,200,0.06)");
      drawNebula(W * 0.35, H * 0.20 - scrollY * 0.04, 150, "rgba(160,40,180,0.04)");

      // 4. Stars — 3 layers with parallax
      for (const layer of [back, mid, front]) {
        for (const s of layer) {
          const twinkle = 0.5 + 0.5 * Math.sin(t * s.tw * 60 + s.twP);
          const rawY = s.y * totalHeight - scrollY * s.speed;
          const displayY = ((rawY % H) + H) % H;
          const alpha = s.op * twinkle;

          ctx.beginPath();
          ctx.arc(s.x * W, displayY, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${alpha.toFixed(3)})`;
          ctx.fill();

          // Bright stars get a subtle glow
          if (s.r > 2) {
            ctx.beginPath();
            ctx.arc(s.x * W, displayY, s.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = `${s.color}${(alpha * 0.15).toFixed(3)})`;
            ctx.fill();
          }
        }
      }

      // 5. Planets
      for (const p of planets) {
        const px = p.x * W;
        const py = p.y * totalHeight * 0.25 - scrollY * p.speed;

        if (py < -p.radius * 3 || py > H + p.radius * 3) continue;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.radius * 3);
        glow.addColorStop(0, p.glowColor + "40");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        const pg = ctx.createRadialGradient(px - p.radius * 0.3, py - p.radius * 0.3, 0, px, py, p.radius);
        pg.addColorStop(0, lighten(p.color, 40));
        pg.addColorStop(0.5, p.color);
        pg.addColorStop(1, darken(p.color, 40));
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();

        if (p.rings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.scale(1, 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = p.glowColor + "60";
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 6. Meteors
      nextMeteor -= 0.016;
      if (nextMeteor <= 0) {
        const idle = meteors.find((m) => !m.active);
        if (idle) {
          idle.x = 0.05 + Math.random() * 0.7;
          idle.y = 0.05 + Math.random() * 0.35;
          idle.op = 1;
          idle.active = true;
        }
        nextMeteor = 5 + Math.random() * 10;
      }

      for (const m of meteors) {
        if (!m.active) continue;
        const mx = m.x * W;
        const my = m.y * H - scrollY * 0.1;
        const ex = mx + Math.cos(m.angle) * m.len;
        const ey = my + Math.sin(m.angle) * m.len;

        const mg = ctx.createLinearGradient(mx, my, ex, ey);
        mg.addColorStop(0, `rgba(255,255,255,${m.op.toFixed(2)})`);
        mg.addColorStop(0.3, `rgba(180,160,255,${(m.op * 0.6).toFixed(2)})`);
        mg.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = mg;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        m.x += (Math.cos(m.angle) * m.speed) / W;
        m.y += (Math.sin(m.angle) * m.speed) / H;
        m.op -= 0.015;
        if (m.op <= 0 || m.x > 1.1 || m.y > 1.1) m.active = false;
      }

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

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}
