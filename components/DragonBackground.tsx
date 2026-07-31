/**
 * DragonBackground — fundo animado do dragão (SVG poster + sequência real de
 * quadros), extraído do DragonHero pra poder ser reaproveitado atrás de
 * qualquer layout de conteúdo (não só o do /lab/hero). Sempre `aria-hidden`,
 * decorativo — ver docs/briefing-hero-dragao.md.
 */

"use client";

import { useEffect, useState } from "react";
import DragonBreath from "@/app/components/DragonBreath";
import ScrollFrameSequence from "@/components/ScrollFrameSequence";

type Variant = "desktop" | "mobile";

type Manifest = {
  loop: "simple";
  variants: Record<Variant, { count: number; width: number; height: number; fps: number }>;
};

function useFrameVariant(): Variant | null {
  const [variant, setVariant] = useState<Variant | null>(null);
  useEffect(() => {
    setVariant(window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop");
  }, []);
  return variant;
}

export type DragonBackgroundProps = {
  /** className do wrapper aria-hidden; default cobre a seção pai (relative) */
  className?: string;
  /** 'loop' roda sozinho (para heróis isolados); 'scroll' amarra o quadro à rolagem */
  mode?: "loop" | "scroll";
  /** só relevante com mode="scroll": progresso do host vs. do documento inteiro */
  scrollTarget?: "self" | "document";
};

export default function DragonBackground({ className, mode = "loop", scrollTarget = "self" }: DragonBackgroundProps) {
  const variant = useFrameVariant();
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [sequenceReady, setSequenceReady] = useState(false);
  const [sequenceUnsupported, setSequenceUnsupported] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/frames/manifest.json")
      .then((res) => res.json())
      .then((data: Manifest) => {
        if (!cancelled) setManifest(data);
      })
      .catch(() => {
        if (!cancelled) setSequenceUnsupported(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const variantConfig = variant && manifest ? manifest.variants[variant] : null;
  const showSequence = sequenceReady && !sequenceUnsupported;

  return (
    <div aria-hidden className={className ?? "absolute inset-0 z-0"}>
      <DragonBreath
        mode="loop"
        cover
        className={`absolute inset-0 h-full w-full opacity-70 ${showSequence ? "invisible" : ""}`}
      />
      {variantConfig && !sequenceUnsupported && (
        <ScrollFrameSequence
          key={variant}
          frameCount={variantConfig.count}
          fps={variantConfig.fps}
          frameSrc={(i) => `/frames/${variant}/frame-${String(i).padStart(4, "0")}.webp`}
          mode={mode}
          scrollTarget={scrollTarget}
          anchorX={0.8}
          anchorY={0.15}
          className={`absolute inset-0 h-full w-full opacity-70 ${showSequence ? "" : "invisible"}`}
          onReady={() => setSequenceReady(true)}
          onUnsupported={() => setSequenceUnsupported(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
    </div>
  );
}
