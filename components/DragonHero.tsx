/**
 * DragonHero — seção hero de tela cheia: fundo animado do dragão + scrim
 * direcional + texto/CTAs em HTML puro (nunca no SVG/canvas).
 *
 * O fundo é `aria-hidden` (decorativo). <DragonBreath> (SVG) pinta
 * instantaneamente como poster e continua visível até <ScrollFrameSequence>
 * (quadros reais, ver docs/briefing-hero-dragao.md) sinalizar que o primeiro
 * quadro decodificou; se o navegador não decodificar AVIF, o poster fica
 * definitivo. Texto fica no canto inferior esquerdo, onde o fundo permanece
 * mais escuro.
 */

"use client";

import { Button } from "@/components/ui/button";
import DragonBackground from "@/components/DragonBackground";

export type DragonHeroCta = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "ghost";
};

export type DragonHeroProps = {
  name: string;
  role: string;
  tagline: string;
  ctas?: DragonHeroCta[];
};

export default function DragonHero({ name, role, tagline, ctas = [] }: DragonHeroProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-end">
      <DragonBackground />

      <div className="relative z-10 max-w-2xl px-6 pb-16 md:pb-24 md:px-16">
        <p className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4">
          {tagline}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-cinzel)] mb-3">
          {name}
        </h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground font-medium mb-8">
          {role}
        </h2>
        {ctas.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {ctas.map((cta) => (
              <Button key={cta.href} asChild size="lg" variant={cta.variant ?? "default"}>
                <a href={cta.href}>{cta.label}</a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
