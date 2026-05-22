"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity X
  vy: number; // velocity Y
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface ParticleEffectProps {
  count?: number;
  color?: "purple" | "cyan" | "pink";
  speed?: "slow" | "normal" | "fast";
  size?: "small" | "medium" | "large";
  className?: string;
}

/**
 * ParticleEffect - Partículas flutuantes (tech/sci-fi)
 *
 * CONCEITO:
 * - Pequenas partículas/pontos se movem livremente
 * - Criam sensação de movimento/energia
 * - Típico de interfaces futuristas/cyberpunk
 *
 * FÍSICA SIMULADA:
 * - Cada partícula tem posição (x, y)
 * - Tem velocidade (vx, vy) - movimento
 * - Tamanho e opacidade variam
 * - Anima continuamente
 *
 * VISUAL:
 * - Pequenos pontos brilhantes
 * - Se movem em direções aleatórias
 * - Aparecem e desaparecem
 * - Não intrusivo, apenas ambiente
 *
 * EXEMPLO:
 * <ParticleEffect count={30} color="purple" speed="normal" />
 */

export default function ParticleEffect({
  count = 20,
  color = "purple",
  speed = "normal",
  size = "small",
  className = "",
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  const colorMap = {
    purple: "rgba(168, 85, 247, 0.6)",
    cyan: "rgba(34, 211, 238, 0.6)",
    pink: "rgba(236, 72, 153, 0.6)",
  };

  const speedMap = {
    slow: 1,
    normal: 2,
    fast: 3,
  };

  const sizeMap = {
    small: 2,
    medium: 4,
    large: 6,
  };

  useEffect(() => {
    // Gera partículas aleatórias
    const generateParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * speedMap[speed],
      vy: (Math.random() - 0.5) * speedMap[speed],
      size: sizeMap[size],
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));

    setParticles(generateParticles);
    setMounted(true);
  }, [count, speed, size]);

  if (!mounted) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      {particles.map((particle) => {
        // Calcula movimento usando CSS animations
        // Cria efeito de flutuação com sine waves
        const keyframes = `
          @keyframes particle-${particle.id} {
            0% {
              transform: translate(0, 0);
              opacity: 0;
            }
            10% {
              opacity: ${particle.opacity};
            }
            90% {
              opacity: ${particle.opacity};
            }
            100% {
              transform: translate(
                ${particle.vx * 100}px,
                ${particle.vy * 100}px
              );
              opacity: 0;
            }
          }
        `;

        return (
          <React.Fragment key={particle.id}>
            <style>{keyframes}</style>
            <div
              style={{
                position: "absolute",
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                borderRadius: "50%",
                backgroundColor: colorMap[color],
                boxShadow: `0 0 ${particle.size * 2}px ${colorMap[color]}`,
                animation: `particle-${particle.id} ${particle.duration}s linear infinite`,
                animationDelay: `-${particle.delay}s`,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
