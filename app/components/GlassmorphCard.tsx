import React from "react";
import classNames from "classnames";

interface GlassmorphCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glowIntensity?: "low" | "medium" | "high";
}

/**
 * GlassmorphCard - Card com efeito de vidro fosco
 *
 * CONCEITO GLASSMORPHISM:
 * - Imita vidro fosco/translúcido (como janelas de vidro)
 * - Usa backdrop-filter: blur para desfoque de fundo
 * - Fundo semi-transparente rgba(17, 17, 17, 0.4)
 * - Borda sutil com cor roxo neon
 *
 * VISUAL:
 * - Parece que é feito de vidro/plástico transparente
 * - Permite ver o fundo desfocado atrás
 * - Quando passa mouse: fica mais opaco + brilho mais forte
 *
 * EXEMPLO:
 * <GlassmorphCard glowIntensity="medium">
 *   <p>Conteúdo do card</p>
 * </GlassmorphCard>
 */

export default function GlassmorphCard({
  children,
  className = "",
  hover = true,
  glowIntensity = "medium",
}: GlassmorphCardProps) {
  const glowShadowMap = {
    low: "0 4px 16px rgba(168, 85, 247, 0.1)",
    medium: "0 8px 32px rgba(168, 85, 247, 0.15)",
    high: "0 12px 48px rgba(168, 85, 247, 0.25)",
  };

  const containerClass = classNames(
    // Base glassmorphism style
    "bg-[rgba(17,17,17,0.4)]",
    "backdrop-blur-[12px]",
    "border border-[rgba(168,85,247,0.2)]",
    "rounded-xl",
    "p-6",
    // Hover effect
    {
      "transition-all duration-300 hover:bg-[rgba(17,17,17,0.6)] hover:border-[rgba(168,85,247,0.5)] hover:shadow-lg": hover,
    },
    className
  );

  return (
    <div
      className={containerClass}
      style={{
        boxShadow: hover ? glowShadowMap[glowIntensity] : "none",
      }}
    >
      {children}
    </div>
  );
}
