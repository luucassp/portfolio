import DragonHero from "@/components/DragonHero";

export default function LabHeroPage() {
  return (
    <DragonHero
      name="Sergio L. Pereira"
      role="Desenvolvedor Front-end"
      tagline="Lab — hero do dragão"
      ctas={[
        { label: "Ver projetos", href: "#projetos" },
        {
          label: "Contato",
          href: "mailto:sergio.lucas.ferrari360@gmail.com",
          variant: "outline",
        },
      ]}
    />
  );
}
