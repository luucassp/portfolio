import React from "react";
import classNames from "classnames";

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  color?: "purple" | "cyan" | "pink" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  animated?: boolean;
}

/**
 * NeonButton - Botão com brilho neon
 *
 * CONCEITO NEON GLOW:
 * - Cria efeito de placa neon (como Las Vegas)
 * - Usa box-shadow com cores vibrantes
 * - Glow intenso ao passar mouse
 * - Pode ser animado (pulsa continuamente)
 *
 * VARIANTES:
 * - primary: fundo colorido + brilho (CTA - Call To Action)
 * - secondary: borda + texto colorido (alternativa)
 * - ghost: só brilho, sem fundo (minimalista)
 *
 * EXEMPLO:
 * <NeonButton variant="primary" color="purple" animated>
 *   Clica aqui
 * </NeonButton>
 */

export default function NeonButton({
  children,
  variant = "primary",
  color = "purple",
  size = "md",
  className = "",
  onClick,
  href,
  disabled = false,
  animated = false,
}: NeonButtonProps) {
  const colorMap = {
    purple: {
      bg: "bg-purple-600",
      bgHover: "hover:bg-purple-500",
      border: "border-purple-500",
      text: "text-purple-400",
      glow: "0 0 30px rgba(168, 85, 247, 0.7)",
      glowHover: "0 0 50px rgba(168, 85, 247, 1)",
    },
    cyan: {
      bg: "bg-cyan-600",
      bgHover: "hover:bg-cyan-500",
      border: "border-cyan-500",
      text: "text-cyan-400",
      glow: "0 0 30px rgba(34, 211, 238, 0.7)",
      glowHover: "0 0 50px rgba(34, 211, 238, 1)",
    },
    pink: {
      bg: "bg-pink-600",
      bgHover: "hover:bg-pink-500",
      border: "border-pink-500",
      text: "text-pink-400",
      glow: "0 0 30px rgba(236, 72, 153, 0.7)",
      glowHover: "0 0 50px rgba(236, 72, 153, 1)",
    },
    green: {
      bg: "bg-green-600",
      bgHover: "hover:bg-green-500",
      border: "border-green-500",
      text: "text-green-400",
      glow: "0 0 30px rgba(16, 185, 129, 0.7)",
      glowHover: "0 0 50px rgba(16, 185, 129, 1)",
    },
  };

  const sizeMap = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const colors = colorMap[color];

  const baseClass = classNames(
    "font-medium rounded-lg transition-all duration-300 cursor-pointer",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeMap[size],
    {
      "glow-animation": animated,
    },
    className
  );

  const primaryClass = classNames(
    baseClass,
    colors.bg,
    colors.bgHover,
    "text-white"
  );

  const secondaryClass = classNames(
    baseClass,
    `border ${colors.border}`,
    colors.text,
    `hover:${colors.bgHover} hover:text-white hover:border-opacity-100`
  );

  const ghostClass = classNames(
    baseClass,
    colors.text,
    "hover:text-white"
  );

  const variantMap = {
    primary: primaryClass,
    secondary: secondaryClass,
    ghost: ghostClass,
  };

  const buttonClass = variantMap[variant];

  const commonProps = {
    className: buttonClass,
    onClick,
    disabled,
  };

  if (href) {
    return (
      <a href={href} className={buttonClass}>
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps}>
      {children}
    </button>
  );
}
