"use client";

import React, { useEffect, useState } from "react";

/**
 * CyberpunkBackground - Fundo animado com grid + orbs flutuantes
 *
 * DESIGN CYBERPUNK:
 * - Grid de perspectiva (como em Blade Runner)
 * - Orbs coloridos flutuando (luzes de néon)
 * - Gradientes animados
 * - Efeito de "profundidade" e movimento
 *
 * TECNOLOGIA:
 * - SVG para grid escalável
 * - CSS animations para movimento infinito
 * - Multiple layers para profundidade
 * - Gradientes com cor neon roxo/ciano
 *
 * VISUAL:
 * - Parece um universo digital/futurista
 * - Tranquilo, não é intrusivo
 * - Move-se lentamente (fundo, não distrai)
 *
 * USO:
 * - Coloca na raiz da página (atrás de tudo)
 * - position: fixed, z-index baixo
 * - pointer-events: none (não interfere com cliques)
 */

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: "purple" | "cyan" | "pink";
}

export default function CyberpunkBackground() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Gera 8 orbs aleatórios
    const generateOrbs: Orb[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 100, // 100-400px
      duration: Math.random() * 20 + 20, // 20-40s
      delay: Math.random() * 10, // 0-10s
      color: ["purple", "cyan", "pink"][Math.floor(Math.random() * 3)] as
        | "purple"
        | "cyan"
        | "pink",
    }));
    setOrbs(generateOrbs);
    setMounted(true);
  }, []);

  const colorMap = {
    purple: {
      bg: "rgba(168, 85, 247, 0.15)",
      blur: "rgba(168, 85, 247, 0.3)",
    },
    cyan: {
      bg: "rgba(34, 211, 238, 0.15)",
      blur: "rgba(34, 211, 238, 0.3)",
    },
    pink: {
      bg: "rgba(236, 72, 153, 0.15)",
      blur: "rgba(236, 72, 153, 0.3)",
    },
  };

  if (!mounted) return null;

  return (
    <>
      {/* Grid Background Layer */}
      <div
        className="fixed inset-0 -z-40 overflow-hidden"
        style={{
          background: `linear-gradient(
            to bottom,
            #0a0a0a,
            #0f0f1e
          )`,
        }}
      >
        {/* Grid Pattern SVG */}
        <svg
          className="w-full h-full opacity-20"
          style={{
            animation: "grid-shift 20s linear infinite",
          }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(
              ellipse at 20% 50%,
              rgba(168, 85, 247, 0.2) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 80% 80%,
              rgba(34, 211, 238, 0.2) 0%,
              transparent 50%
            )`,
          }}
        />
      </div>

      {/* Floating Orbs Layer */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        {orbs.map((orb) => {
          const colors = colorMap[orb.color];

          return (
            <div
              key={orb.id}
              className="absolute rounded-full blur-3xl"
              style={{
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                background: colors.bg,
                boxShadow: `0 0 80px ${colors.blur}`,
                animation: `float ${orb.duration}s ease-in-out infinite`,
                animationDelay: `-${orb.delay}s`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>

      {/* Top-to-Bottom Gradient Overlay (subtle fade) */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(10, 10, 10, 0) 0%,
            rgba(10, 10, 10, 0.3) 100%
          )`,
        }}
      />

      {/* Vignette Effect (darker edges) */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 200px rgba(0, 0, 0, 0.8),
            inset 0 0 100px rgba(0, 0, 0, 0.5)
          `,
        }}
      />
    </>
  );
}
