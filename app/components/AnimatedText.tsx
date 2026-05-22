"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  variant?: "fadeIn" | "slideIn" | "scaleIn";
}

/**
 * AnimatedText - Texto com animação staggered de letras
 *
 * COMO FUNCIONA:
 * - Quebra o texto em letras individuais
 * - Anima cada letra com delay progressivo (stagger)
 * - Cria efeito de "escrita" ou "aparição"
 *
 * FRAMER MOTION:
 * - motion.span: componente animado do Framer Motion
 * - initial: estado inicial (invisível/deslocado)
 * - animate: estado final (visível/na posição)
 * - transition: quanto tempo leva + delay por índice
 *
 * EXEMPLO:
 * <AnimatedText text="Olá Mundo" className="text-3xl" />
 * Result: Cada letra aparece em sequência
 *
 * STAGGER DELAY:
 * - 0.05s por padrão (rápido)
 * - 0.1s = mais lento/dramático
 * - 0.02s = bem rápido
 */

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.05,
  variant = "fadeIn",
}: AnimatedTextProps) {
  const variationMap = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideIn: {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const variation = variationMap[variant];

  return (
    <motion.div className={className}>
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          initial={variation.initial}
          animate={variation.animate}
          transition={{
            duration: 0.5,
            delay: delay + index * staggerDelay,
            ease: "easeOut",
          }}
        >
          {letter === " " ? " " : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
