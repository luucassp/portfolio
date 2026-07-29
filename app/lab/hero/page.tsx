import DragonBreath from "@/components/DragonBreath";

export const metadata = {
  title: "Lab — hero do dragão",
  robots: { index: false, follow: false },
};

/**
 * Página de trabalho do hero, isolada do layout do site.
 *
 * `fixed inset-0` cobre o fundo de brasas que o layout raiz monta, então o
 * que aparece aqui é só o hero. Não promover para a home sem pedido.
 */
export default function LabHeroPage() {
  return (
    <main className="fixed inset-0 z-50 overflow-hidden bg-[#07050a]">
      {/* Fundo animado — decorativo */}
      <DragonBreath className="absolute inset-0" />

      {/* Texto em HTML, nunca dentro do SVG: indexável e selecionável */}
      <div className="relative z-10 flex h-full items-end">
        <div className="w-full max-w-2xl p-8 pb-16 sm:p-14 sm:pb-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#d4af37]">
            Fogo e Sangue
          </p>

          <h1 className="font-[family-name:var(--font-cinzel)] text-5xl font-bold leading-tight text-[#ede4d3] sm:text-7xl">
            Sergio L.
            <span className="block bg-gradient-to-r from-[#b91c1c] via-[#ea580c] to-[#d4af37] bg-clip-text text-transparent">
              Pereira
            </span>
          </h1>

          <p className="mt-4 text-lg text-[#a89880] sm:text-xl">
            Desenvolvedor Front-end
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projetos"
              className="rounded-md bg-[#b91c1c] px-6 py-3 text-sm font-medium text-[#fdf6e8] transition-colors hover:bg-[#a11818]"
            >
              Ver Projetos
            </a>
            <a
              href="#contato"
              className="rounded-md border border-[#d4af37]/40 px-6 py-3 text-sm font-medium text-[#d4af37] transition-colors hover:bg-[#d4af37]/10"
            >
              Entrar em Contato
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
