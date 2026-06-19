"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
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
    let animationId: number;
    let scrollY = 0;

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

    const createStars = (
      count: number,
      minR: number,
      maxR: number,
      speed: number
    ): Star[] =>
      Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random() * 6,
        radius: minR + Math.random() * (maxR - minR),
        opacity: 0.4 + Math.random() * 0.6,
        speed,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
      }));

    const starsSmall = createStars(300, 0.3, 0.8, 0.1);
    const starsMedium = createStars(150, 0.8, 1.5, 0.25);
    const starsLarge = createStars(60, 1.5, 2.5, 0.4);

    const planets: Planet[] = [
      { x: 0.15, y: 0.8, radius: 55, color: "#7c3aed", glowColor: "#a855f7", speed: 0.15, rings: false },
      { x: 0.75, y: 2.2, radius: 38, color: "#1d4ed8", glowColor: "#3b82f6", speed: 0.2, rings: true },
      { x: 0.88, y: 3.8, radius: 70, color: "#047857", glowColor: "#10b981", speed: 0.12, rings: false },
      { x: 0.25, y: 5.0, radius: 45, color: "#9d174d", glowColor: "#ec4899", speed: 0.18, rings: true },
    ];

    let time = 0;

    const draw = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const totalHeight = Math.max(document.body.scrollHeight, h);
      const scrollFraction = scrollY / (totalHeight - h || 1);
      const hue = 220 + scrollFraction * 60;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `hsl(${hue}, 40%, 3%)`);
      grad.addColorStop(1, `hsl(${hue + 30}, 30%, 6%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      drawNebula(ctx, w * 0.8, h * 0.3 - scrollY * 0.05, 200, "rgba(120,40,200,0.06)");
      drawNebula(ctx, w * 0.2, h * 0.7 - scrollY * 0.08, 150, "rgba(30,80,200,0.07)");
      drawNebula(ctx, w * 0.5, h * 0.5 - scrollY * 0.03, 250, "rgba(80,20,160,0.04)");

      const allLayers = [starsSmall, starsMedium, starsLarge];
      for (let l = 0; l < allLayers.length; l++) {
        const layer = allLayers[l];
        for (let i = 0; i < layer.length; i++) {
          const star = layer[i];
          const twinkle = 0.7 + 0.3 * Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
          const yPos = (star.y * h - scrollY * star.speed) % h;
          const displayY = yPos < 0 ? yPos + h : yPos;

          ctx.beginPath();
          ctx.arc(star.x * w, displayY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${star.opacity * twinkle})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < planets.length; i++) {
        const p = planets[i];
        const px = p.x * w;
        const py = p.y * totalHeight * 0.25 - scrollY * p.speed;

        if (py < -p.radius * 3 || py > h + p.radius * 3) continue;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.radius * 3);
        glow.addColorStop(0, p.glowColor + "40");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        const planetGrad = ctx.createRadialGradient(
          px - p.radius * 0.3,
          py - p.radius * 0.3,
          0,
          px,
          py,
          p.radius
        );
        planetGrad.addColorStop(0, lighten(p.color, 40));
        planetGrad.addColorStop(0.5, p.color);
        planetGrad.addColorStop(1, darken(p.color, 40));
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = planetGrad;
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

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}

function drawNebula(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
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
