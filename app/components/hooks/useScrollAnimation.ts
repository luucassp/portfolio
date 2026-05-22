import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number; // 0-1, quanto do elemento precisa estar visível
  triggerOnce?: boolean; // Se true, anima só uma vez; se false, toda vez que entra na tela
}

/**
 * useScrollAnimation - Hook que detecta quando elemento entra na tela
 *
 * INTERSECTION OBSERVER API:
 * - Método nativo do navegador
 * - Observa quando um elemento é visível (entra no viewport)
 * - Muito mais eficiente que scroll listeners
 * - Roda em background thread (não bloqueia UI)
 *
 * COMO FUNCIONA:
 * 1. Cria um observador para o elemento
 * 2. Quando o elemento entra na tela (threshold), muda isVisible para true
 * 3. Se triggerOnce = true, para de observar (anima só uma vez)
 * 4. Se triggerOnce = false, continua observando (anima toda vez)
 *
 * EXEMPLO:
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
 *
 * <motion.div
 *   ref={ref}
 *   initial={{ opacity: 0 }}
 *   animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
 * >
 *   Content
 * </motion.div>
 *
 * THRESHOLD:
 * - 0.1 = 10% visível já dispara
 * - 0.5 = 50% visível
 * - 1.0 = 100% visível (todo elemento na tela)
 */

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
) => {
  const { threshold = 0.2, triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Elemento entrou na tela
          setIsVisible(true);

          // Se triggerOnce, para de observar (só anima uma vez)
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else {
          // Elemento saiu da tela
          // Só resetamos se triggerOnce = false
          if (!triggerOnce) {
            setIsVisible(false);
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup: remove observer quando componente desmonta
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, triggerOnce]);

  return { ref, isVisible };
};
