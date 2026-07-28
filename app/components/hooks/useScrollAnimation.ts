import { useCallback, useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number; // 0-1, quanto do elemento precisa estar visível
  triggerOnce?: boolean; // Se true, anima só uma vez; se false, toda vez que entra na tela
}

/**
 * useScrollAnimation - Hook que detecta quando elemento entra na tela
 *
 * Usa um CALLBACK REF em vez de useRef + useEffect: a observação começa
 * exatamente no momento em que o nó é anexado ao DOM. Isso funciona mesmo
 * quando o componente adia a montagem (ex: `if (!mounted) return null`),
 * caso em que um useEffect rodaria cedo demais com ref.current = null e
 * nunca voltaria a observar.
 *
 * INTERSECTION OBSERVER API:
 * - Método nativo do navegador, roda em background thread
 * - Observa quando um elemento entra no viewport (threshold)
 *
 * EXEMPLO:
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
 * <div ref={ref} className={isVisible ? "opacity-100" : "opacity-0"}>...</div>
 */
export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
) => {
  const { threshold = 0.2, triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      // Limpa observação anterior (troca de nó ou desmontagem)
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) observer.disconnect();
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { threshold }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, triggerOnce]
  );

  // Cleanup final ao desmontar
  useEffect(() => () => observerRef.current?.disconnect(), []);

  return { ref, isVisible };
};
