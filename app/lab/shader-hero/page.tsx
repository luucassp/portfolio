"use client";

import Hero from "@/components/ui/animated-shader-hero";

export default function LabShaderHeroPage() {
  return (
    <Hero
      trustBadge={{
        text: "Disponível para novos projetos",
        icons: ["✨"],
      }}
      headline={{
        line1: "Sergio L. Pereira",
        line2: "Desenvolvedor Front-end",
      }}
      subtitle="Interfaces rápidas, acessíveis e bem-acabadas — de protótipo a produção."
      buttons={{
        primary: {
          text: "Ver projetos",
          onClick: () => {
            window.location.href = "/#projetos";
          },
        },
        secondary: {
          text: "Contato",
          onClick: () => {
            window.location.href = "mailto:sergio.lucas.ferrari360@gmail.com";
          },
        },
      }}
    />
  );
}
