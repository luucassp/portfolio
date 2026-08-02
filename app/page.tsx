"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "./translations";
import SiteHeader from "./components/SiteHeader";
import { useScrollAnimation } from "./components/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Hero from "@/components/ui/animated-shader-hero";

type Language = "pt" | "en";

const cardBase =
  "bg-card/75 backdrop-blur-md border-[var(--targaryen-gold)]/15 transition-all duration-300";

export default function Home() {
  const [language, setLanguage] = useState<Language>("pt");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: skillsRef, isVisible: skillsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation({ threshold: 0.08 });
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSkill(null);
    };
    if (selectedSkill) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedSkill]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const scrollToHero = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const t = translations[language];

  const skills = ["JavaScript", "TypeScript", "HTML5", "CSS3", "React", "Next.js", "Git", "GitHub"];

  const tagColors: Record<string, string> = {
    React: "border-cyan-500/40 text-cyan-300",
    JavaScript: "border-yellow-500/40 text-yellow-300",
    TypeScript: "border-blue-500/40 text-blue-300",
    CSS: "border-pink-500/40 text-pink-300",
    HTML: "border-orange-500/40 text-orange-300",
    "Next.js": "border-zinc-400/40 text-zinc-200",
  };

  const projects = [
    {
      name: "City Sightseeing Bike Tours",
      description: t.projects.citySightseeing,
      url: "https://github.com/luucassp/City-Sightseeing-Bike-Tours",
      demo: "https://city-sightseeing-bike-tours.vercel.app",
      tags: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
      name: "Traveland",
      description: t.projects.traveland,
      url: "https://github.com/luucassp/Traveland",
      demo: "https://traveland-kappa.vercel.app",
      tags: ["Next.js", "TypeScript", "i18n"],
    },
    {
      name: "Cosmic Drift",
      description: t.projects.cosmicDrift,
      url: "https://github.com/luucassp/cosmic-drift-",
      demo: "https://cosmic-drift-three.vercel.app",
      tags: ["JavaScript", "CSS"],
    },
    {
      name: language === "pt" ? "Calculadora IMC" : "BMI Calculator",
      description: t.projects.imc,
      url: "https://github.com/luucassp/IMC",
      demo: "https://imc-neon.vercel.app",
      tags: ["HTML", "CSS", "JavaScript"],
    },
  ];

  const navLinks = [
    { href: "#sobre", label: t.nav.sobre },
    { href: "#habilidades", label: t.nav.habilidades },
    { href: "#projetos", label: t.nav.projetos },
    { href: "#contato", label: t.nav.contato },
  ];

  const sectionLabel = (num: string, title: string) => (
    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-[family-name:var(--font-cinzel)]">
      <span className="text-fire-gradient font-mono text-base block mb-2 tracking-widest">{num}</span>
      {title}
    </h2>
  );

  return (
    <div className="min-h-screen text-foreground scroll-smooth">
      {/* Header */}
      <SiteHeader
        language={language}
        onLanguageChange={changeLanguage}
        navLinks={navLinks}
        onLogoClick={scrollToHero}
      />

      {/* Hero */}
      <Hero
        trustBadge={{ text: t.hero.badge }}
        headline={{ line1: "Sergio L.", line2: "Pereira" }}
        subtitle={`${t.hero.role}. ${t.hero.description}`}
        buttons={{
          primary: {
            text: t.hero.viewProjects,
            onClick: () =>
              document.getElementById("projetos")?.scrollIntoView({ behavior: "smooth" }),
          },
          secondary: {
            text: t.hero.contact,
            onClick: () =>
              document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" }),
          },
        }}
      />

      {/* Sobre */}
      <section id="sobre" className="py-24 px-6">
        <div
          ref={aboutRef}
          className={cn(
            "max-w-4xl mx-auto transition-all duration-700 ease-out",
            aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {sectionLabel("01.", t.about.title)}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="hover:text-foreground transition-colors">{t.about.p1}</p>
              <p className="hover:text-foreground transition-colors">{t.about.p2}</p>
              <p className="hover:text-foreground transition-colors">{t.about.p3}</p>
            </div>

            <Card className={cn(cardBase, "p-6")}>
              <div className="font-mono text-sm leading-7">
                <p className="text-accent mb-2">{t.about.codeComment}</p>
                <p>
                  <span className="text-primary">const</span>{" "}
                  <span className="text-accent">sergio</span> {"{"}
                </p>
                <p className="pl-4">
                  <span className="text-[#e08a3c]">{t.about.codeName}</span>:{" "}
                  <span className="text-emerald-400">&quot;Sergio L. Pereira&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-[#e08a3c]">{t.about.codeRole}</span>:{" "}
                  <span className="text-emerald-400">
                    &quot;{language === "pt" ? "Dev Front-end" : "Front-end Developer"}&quot;
                  </span>,
                </p>
                <p className="pl-4">
                  <span className="text-[#e08a3c]">{t.about.codeStack}</span>:{" "}
                  <span className="text-emerald-400">[&quot;React&quot;, &quot;Next.js&quot;, &quot;TypeScript&quot;]</span>,
                </p>
                <p className="pl-4">
                  <span className="text-[#e08a3c]">{t.about.codeAvailable}</span>:{" "}
                  <span className="text-primary">true</span>
                </p>
                <p>{"}"}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <Separator className="bg-[var(--targaryen-gold)]/15" />
      </div>

      {/* Habilidades */}
      <section id="habilidades" className="py-24 px-6">
        <div
          ref={skillsRef}
          className={cn(
            "max-w-6xl mx-auto transition-all duration-700 ease-out",
            skillsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {sectionLabel("02.", t.skills.title)}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl group cursor-pointer"
              >
                <Card className={cn(cardBase, "p-6 hover:scale-105 hover:border-primary/40")}>
                  <div className="text-center">
                    <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                      {skill}
                    </p>
                    <p className="text-muted-foreground/80 text-xs mt-2 group-hover:text-muted-foreground transition-colors">
                      {t.skills.clickHint}
                    </p>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <Separator className="bg-[var(--targaryen-gold)]/15" />
      </div>

      {/* Projetos */}
      <section id="projetos" className="py-24 px-6">
        <div
          ref={projectsRef}
          className={cn(
            "max-w-6xl mx-auto transition-all duration-700 ease-out",
            projectsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {sectionLabel("03.", t.projects.title)}
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={project.name} className="group">
                <Card className={cn(cardBase, "h-full p-6 hover:-translate-y-2 hover:border-primary/40 overflow-hidden flex flex-col")}>
                  <div className="-mx-6 -mt-6 mb-5 h-[3px] bg-gradient-to-r from-primary via-ember to-accent" />

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-accent/70 font-mono text-xs font-bold">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <h3 className="text-lg font-semibold group-hover:text-accent transition-colors font-[family-name:var(--font-cinzel)]">
                      {project.name}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/90 transition-colors flex-1 mb-5">
                    {project.description}
                  </p>

                  <div className="flex gap-2 flex-wrap mb-5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline"
                        className={cn("font-mono bg-transparent", tagColors[tag] ?? "border-muted text-muted-foreground")}>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-[var(--targaryen-gold)]/10">
                    {project.demo && (
                      <Button asChild size="sm">
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {t.projects.viewDemo}
                        </a>
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline"
                      className="border-[var(--targaryen-gold)]/25 text-muted-foreground hover:text-accent hover:border-accent/50">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.68.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        {t.projects.viewGithub}
                      </a>
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="ghost" className="text-accent hover:bg-accent/10 hover:text-accent">
              <a href="https://github.com/luucassp" target="_blank" rel="noopener noreferrer">
                {t.projects.viewAll}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <Separator className="bg-[var(--targaryen-gold)]/15" />
      </div>

      {/* Contato */}
      <section id="contato" className="py-24 px-6 relative overflow-hidden">
        <div
          ref={contactRef}
          className={cn(
            "max-w-2xl mx-auto text-center relative z-10 transition-all duration-700 ease-out",
            contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {sectionLabel("04.", t.contact.title)}
          <p className="text-muted-foreground mb-10 leading-relaxed">{t.contact.description}</p>

          <div className="mb-12">
            <Button asChild size="lg" className="fire-glow-animation h-auto px-8 py-4 text-base">
              <a href="mailto:sergio.lucas.ferrari360@gmail.com">sergio.lucas.ferrari360@gmail.com</a>
            </Button>
          </div>

          <div className="flex justify-center gap-8 text-muted-foreground">
            <a href="https://github.com/luucassp" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 hover:text-accent transition-colors">
              {t.contact.github}
            </a>
            <a href="https://www.linkedin.com/in/sergiolucaspereira" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 hover:text-accent transition-colors">
              {t.contact.linkedin}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground/85 text-sm border-t border-[var(--targaryen-gold)]/10">
        <p>
          {t.footer.developed} <span className="text-fire-gradient font-semibold">Sergio L. Pereira</span> · 2025
        </p>
      </footer>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6"
            onClick={() => setSelectedSkill(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md"
            >
              <Card className={cn(cardBase, "p-6 border-primary/30 fire-glow-animation")}>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-lg leading-none cursor-pointer"
                  aria-label="Fechar"
                >
                  ✕
                </button>
                <p className="text-accent font-mono text-xs mb-2">{"// skill.detail"}</p>
                <h3 className="text-2xl font-bold text-foreground mb-4 font-[family-name:var(--font-cinzel)]">
                  {selectedSkill}
                </h3>
                <div className="h-px bg-gradient-to-r from-primary/60 via-ember/60 to-accent/60 mb-4" />
                <p className="text-muted-foreground leading-relaxed text-sm pr-4">
                  {(t.skills.details as Record<string, string>)[selectedSkill]}
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
