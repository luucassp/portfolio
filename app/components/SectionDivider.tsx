import React from "react";

interface SectionDividerProps {
  className?: string;
  variant?: "line" | "circuit" | "gradient";
}

/**
 * SectionDivider - Separador visual entre seções
 *
 * DESIGN:
 * - Linha decorativa com glow
 * - Temas diferentes (line, circuit, gradient)
 * - Reforça separação entre seções
 * - Completa a estética cyberpunk
 *
 * VARIANTES:
 * - line: simples linha reta com glow
 * - circuit: padrão tipo circuito (futurista)
 * - gradient: linha com gradiente roxo → ciano
 */

export default function SectionDivider({
  className = "",
  variant = "gradient",
}: SectionDividerProps) {
  const variants = {
    line: (
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-lg shadow-purple-500/50" />
    ),
    circuit: (
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="w-full h-12"
      >
        <defs>
          <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
          </linearGradient>
        </defs>
        {/* Main circuit line */}
        <path
          d="M0,50 Q100,30 200,50 T400,50 T600,50 T800,50 T1000,50"
          stroke="url(#circuit-grad)"
          strokeWidth="2"
          fill="none"
        />
        {/* Circuit nodes */}
        <circle cx="200" cy="50" r="4" fill="rgba(168, 85, 247, 0.8)" />
        <circle cx="400" cy="50" r="4" fill="rgba(168, 85, 247, 0.8)" />
        <circle cx="600" cy="50" r="4" fill="rgba(168, 85, 247, 0.8)" />
        <circle cx="800" cy="50" r="4" fill="rgba(168, 85, 247, 0.8)" />
      </svg>
    ),
    gradient: (
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500 via-cyan-500 to-transparent shadow-lg shadow-purple-500/30" />
    ),
  };

  return (
    <div className={`py-8 px-6 ${className}`}>
      {variants[variant]}
    </div>
  );
}
