import React from "react";
import classNames from "classnames";

interface GlowEffectProps {
  children: React.ReactNode;
  color?: "purple" | "cyan" | "pink" | "green";
  intensity?: "low" | "medium" | "high";
  className?: string;
  animated?: boolean;
}

/**
 * GlowEffect - Adiciona brilho neon a qualquer elemento
 *
 * COMO FUNCIONA:
 * - Usa box-shadow CSS para criar efeito de glow
 * - Color: escolhe a cor neon (roxo, ciano, rosa ou verde)
 * - Intensity: controla intensidade do brilho
 * - Animated: se true, o brilho pulsa infinitamente
 *
 * EXEMPLO:
 * <GlowEffect color="purple" intensity="high">
 *   <button>Clica aqui</button>
 * </GlowEffect>
 */

export default function GlowEffect({
  children,
  color = "purple",
  intensity = "medium",
  className = "",
  animated = false,
}: GlowEffectProps) {
  const colorMap = {
    purple: "rgba(168, 85, 247, 0.6)",    // Roxo
    cyan: "rgba(34, 211, 238, 0.6)",      // Ciano
    pink: "rgba(236, 72, 153, 0.6)",      // Rosa
    green: "rgba(16, 185, 129, 0.6)",     // Verde
  };

  const intensityMap = {
    low: "0 0 15px",      // Pequeno
    medium: "0 0 30px",   // Médio
    high: "0 0 50px",     // Grande/Intenso
  };

  const glowColor = colorMap[color];
  const glowSize = intensityMap[intensity];
  const glowShadow = `${glowSize} ${glowColor}`;

  const containerClass = classNames(
    "transition-all duration-300 ease-out",
    {
      "glow-animation": animated,
    },
    className
  );

  return (
    <div
      className={containerClass}
      style={{
        boxShadow: glowShadow,
      }}
    >
      {children}
    </div>
  );
}
