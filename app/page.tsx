"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "./translations";
import Logo from "./components/Logo";
import AnimatedText from "./components/AnimatedText";
import GlowEffect from "./components/GlowEffect";
import NeonButton from "./components/NeonButton";
import GlassmorphCard from "./components/GlassmorphCard";
import ParticleEffect from "./components/ParticleEffect";
import SectionDivider from "./components/SectionDivider";
import { useScrollAnimation } from "./components/hooks/useScrollAnimation";

type Language = "pt" | "en";

export default function Home() {
  const [language, setLanguage] = useState<Language>("pt");
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: skillsRef, isVisible: skillsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation({ threshold: 0.08 });
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  const t = translations[language];

  const skills = ["JavaScript", "TypeScript", "HTML5", "CSS3", "React", "Next.js", "Git", "GitHub"];

  const tagColors: Record<string, string> = {
    React: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10 hover:border-cyan-400 hover:bg-cyan-500/20",
    JavaScript: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10 hover:border-yellow-400 hover:bg-yellow-500/20",
    TypeScript: "text-blue-400 border-blue-500/40 bg-blue-500/10 hover:border-blue-400 hover:bg-blue-500/20",
    CSS: "text-pink-400 border-pink-500/40 bg-pink-500/10 hover:border-pink-400 hover:bg-pink-500/20",
    HTML: "text-orange-400 border-orange-500/40 bg-orange-500/10 hover:border-orange-400 hover:bg-orange-500/20",
    "Next.js": "text-white border-zinc-500/40 bg-zinc-500/10 hover:border-zinc-300 hover:bg-zinc-500/20",
  };

  const projects = [
    {
      name: "Pokodex",
      description: t.projects.pokodex,
      url: "https://github.com/luucassp/Pokodex",
      tags: ["React", "JavaScript", "CSS"],
      accent: "from-cyan-500 to-purple-500",
    },
    {
      name: "Cosmic Drift",
      description: t.projects.cosmicDrift,
      url: "https://github.com/luucassp/cosmic-drift-",
      tags: ["JavaScript", "CSS"],
      accent: "from-yellow-500 to-pink-500",
    },
    {
      name: language === "pt" ? "Lista de Tarefas" : "Todo List",
      description: t.projects.todoList,
      url: "https://github.com/luucassp/lista-de-afazer",
      tags: ["HTML", "CSS", "JavaScript"],
      accent: "from-orange-500 to-yellow-500",
    },
    {
      name: language === "pt" ? "Calculadora IMC" : "BMI Calculator",
      description: t.projects.imc,
      url: "https://github.com/luucassp/IMC",
      tags: ["HTML", "CSS", "JavaScript"],
      accent: "from-green-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="sm" onClick={scrollToHero} showInitials={isScrolled} />
          <div className="hidden sm:flex gap-8 text-sm text-zinc-400 items-center">
            <a href="#sobre" className="hover:text-purple-400 transition-colors">
              {t.nav.sobre}
            </a>
            <a href="#habilidades" className="hover:text-purple-400 transition-colors">
              {t.nav.habilidades}
            </a>
            <a href="#projetos" className="hover:text-purple-400 transition-colors">
              {t.nav.projetos}
            </a>
            <a href="#contato" className="hover:text-purple-400 transition-colors">
              {t.nav.contato}
            </a>
            <div className="flex gap-2 ml-4 pl-4 border-l border-zinc-700">
              <button
                onClick={() => changeLanguage("pt")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  language === "pt"
                    ? "bg-purple-600 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                PT
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  language === "en"
                    ? "bg-purple-600 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Particle Effect Background */}
        <ParticleEffect count={30} color="purple" speed="slow" size="small" className="absolute inset-0" />

        <div className="max-w-3xl text-center relative z-10">
          <div className="mb-12 flex justify-center">
            <GlowEffect color="purple" intensity="high" animated>
              <Logo size="lg" onClick={scrollToHero} />
            </GlowEffect>
          </div>

          <p className="text-purple-400 font-mono mb-4 text-lg animate-pulse">
            {t.hero.greeting}
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            <AnimatedText
              text="Sergio L."
              className="block"
              staggerDelay={0.03}
              variant="slideIn"
            />
            <motion.div
              className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              Pereira
            </motion.div>
          </h1>

          <h2 className="text-xl md:text-2xl text-zinc-300 font-medium mb-6">
            {t.hero.role}
          </h2>

          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <NeonButton
              variant="primary"
              color="purple"
              size="md"
              href="#projetos"
            >
              {t.hero.viewProjects}
            </NeonButton>
            <NeonButton
              variant="secondary"
              color="cyan"
              size="md"
              href="#contato"
            >
              {t.hero.contact}
            </NeonButton>
          </div>
        </div>
      </section>

      <SectionDivider variant="circuit" />

      {/* Sobre */}
      <section id="sobre" className="py-24 px-6">
        <div
          ref={aboutRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ease-out ${
            aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-purple-400 font-mono text-base block mb-2">01.</span>
            {t.about.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p className="hover:text-zinc-200 transition-colors">{t.about.p1}</p>
              <p className="hover:text-zinc-200 transition-colors">{t.about.p2}</p>
              <p className="hover:text-zinc-200 transition-colors">{t.about.p3}</p>
            </div>

            <GlassmorphCard glowIntensity="medium">
              <div className="font-mono text-sm leading-7">
                <p className="text-cyan-400 mb-2">{t.about.codeComment}</p>
                <p>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-cyan-400">sergio</span> {"{"}
                </p>
                <p className="pl-4">
                  <span className="text-pink-400">{t.about.codeName}</span>:{" "}
                  <span className="text-green-400">&quot;Sergio L. Pereira&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-pink-400">{t.about.codeRole}</span>:{" "}
                  <span className="text-green-400">
                    &quot;{language === "pt" ? "Dev Front-end" : "Front-end Developer"}&quot;
                  </span>
                  ,
                </p>
                <p className="pl-4">
                  <span className="text-pink-400">{t.about.codeStack}</span>:{" "}
                  <span className="text-green-400">[&quot;React&quot;, &quot;Next.js&quot;, &quot;TypeScript&quot;]</span>,
                </p>
                <p className="pl-4">
                  <span className="text-pink-400">{t.about.codeAvailable}</span>:{" "}
                  <span className="text-purple-400">true</span>
                </p>
                <p>{"}"}</p>
              </div>
            </GlassmorphCard>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" />

      {/* Habilidades */}
      <section id="habilidades" className="py-24 px-6">
        <div
          ref={skillsRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ease-out ${
            skillsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-purple-400 font-mono text-base block mb-2">02.</span>
            {t.skills.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
              >
                <GlassmorphCard glowIntensity="low" className="hover:scale-105 group cursor-pointer">
                  <div className="text-center">
                    <p className="text-purple-300 font-medium group-hover:text-cyan-300 transition-colors">
                      {skill}
                    </p>
                    <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </GlassmorphCard>
              </button>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider variant="circuit" />

      {/* Projetos */}
      <section id="projetos" className="py-24 px-6">
        <div
          ref={projectsRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ease-out ${
            projectsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-purple-400 font-mono text-base block mb-2">03.</span>
            {t.projects.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <GlassmorphCard glowIntensity="medium" className="h-full hover:-translate-y-2 cursor-pointer overflow-hidden">
                  {/* Accent strip bleeds to card edges via negative margin */}
                  <div className={`-mx-6 -mt-6 mb-5 h-[3px] bg-gradient-to-r ${project.accent}`} />

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 font-mono text-xs font-bold">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <svg
                      className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed group-hover:text-zinc-200 transition-colors">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs font-mono border px-2 py-1 rounded transition-all ${
                          tagColors[tag] ?? "text-zinc-400 border-zinc-600/40 bg-zinc-600/10"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassmorphCard>
              </a>
            ))}
          </div>
          <div className="text-center mt-12">
            <NeonButton
              variant="ghost"
              color="cyan"
              href="https://github.com/luucassp"
            >
              {t.projects.viewAll}
            </NeonButton>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" />

      {/* Contato */}
      <section id="contato" className="py-24 px-6 relative overflow-hidden">
        <ParticleEffect count={20} color="cyan" speed="slow" size="small" className="absolute inset-0" />

        <div
          ref={contactRef}
          className={`max-w-2xl mx-auto text-center relative z-10 transition-all duration-700 ease-out ${
            contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-purple-400 font-mono text-base block mb-2">04.</span>
            {t.contact.title}
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">{t.contact.description}</p>

          <div className="mb-12">
            <GlowEffect color="purple" intensity="high" animated>
              <a
                href="mailto:sergio.lucas.ferrari@gmail.com"
                className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
              >
                sergio.lucas.ferrari@gmail.com
              </a>
            </GlowEffect>
          </div>

          <div className="flex justify-center gap-10 text-zinc-500">
            <GlowEffect color="cyan" intensity="low">
              <a
                href="https://github.com/luucassp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 hover:text-white transition-colors"
              >
                {t.contact.github}
              </a>
            </GlowEffect>
            <GlowEffect color="pink" intensity="low">
              <a
                href="https://www.linkedin.com/in/sergiolucaspereira"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 hover:text-white transition-colors"
              >
                {t.contact.linkedin}
              </a>
            </GlowEffect>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-zinc-900">
        <p>
          {t.footer.developed} <span className="text-purple-400">Sergio L. Pereira</span> · 2025
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md"
            >
              <GlassmorphCard glowIntensity="high">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors text-lg leading-none"
                  aria-label="Fechar"
                >
                  ✕
                </button>
                <p className="text-purple-400 font-mono text-xs mb-2">// skill.detail</p>
                <h3 className="text-2xl font-bold text-white mb-4">{selectedSkill}</h3>
                <p className="text-zinc-300 leading-relaxed pr-4">
                  {(t.skills.details as Record<string, string>)[selectedSkill]}
                </p>
              </GlassmorphCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
