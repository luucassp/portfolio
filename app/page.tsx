"use client";

import { useEffect, useState } from "react";
import { translations } from "./translations";
import Logo from "./components/Logo";

type Language = "pt" | "en";

export default function Home() {
  const [language, setLanguage] = useState<Language>("pt");
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const projects = [
    {
      name: "Pokodex",
      description: t.projects.pokodex,
      url: "https://github.com/luucassp/Pokodex",
      tags: ["React", "JavaScript", "CSS"],
    },
    {
      name: "Cosmic Drift",
      description: t.projects.cosmicDrift,
      url: "https://github.com/luucassp/cosmic-drift-",
      tags: ["JavaScript", "CSS"],
    },
    {
      name: language === "pt" ? "Lista de Tarefas" : "Todo List",
      description: t.projects.todoList,
      url: "https://github.com/luucassp/lista-de-afazer",
      tags: ["HTML", "CSS", "JavaScript"],
    },
    {
      name: language === "pt" ? "Calculadora IMC" : "BMI Calculator",
      description: t.projects.imc,
      url: "https://github.com/luucassp/IMC",
      tags: ["HTML", "CSS", "JavaScript"],
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
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <Logo size="lg" onClick={scrollToHero} />
          </div>
          <p className="text-purple-400 font-mono mb-4 text-lg">{t.hero.greeting}</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            Sergio L.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Pereira
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl text-zinc-400 font-medium mb-6">{t.hero.role}</h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#projetos"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
            >
              {t.hero.viewProjects}
            </a>
            <a
              href="#contato"
              className="px-6 py-3 border border-zinc-700 hover:border-purple-400 hover:text-purple-400 rounded-lg font-medium transition-colors"
            >
              {t.hero.contact}
            </a>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-purple-400 font-mono text-base block mb-2">01.</span>
            {t.about.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-mono text-sm leading-7">
              <p className="text-zinc-600 mb-2">{t.about.codeComment}</p>
              <p>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-cyan-400">sergio</span> {"{"}
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">{t.about.codeName}</span>:{" "}
                <span className="text-green-400">&quot;Sergio L. Pereira&quot;</span>,
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">{t.about.codeRole}</span>:{" "}
                <span className="text-green-400">
                  &quot;{language === "pt" ? "Dev Front-end" : "Front-end Developer"}&quot;
                </span>
                ,
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">{t.about.codeStack}</span>:{" "}
                <span className="text-green-400">[&quot;React&quot;, &quot;Next.js&quot;]</span>,
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">{t.about.codeAvailable}</span>:{" "}
                <span className="text-purple-400">true</span>
              </p>
              <p>{"}"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Habilidades */}
      <section id="habilidades" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-purple-400 font-mono text-base block mb-2">02.</span>
            {t.skills.title}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-6 py-3 border border-purple-500/30 bg-purple-500/10 text-purple-300 rounded-full text-sm font-medium hover:border-purple-400 hover:bg-purple-500/20 transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section id="projetos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-purple-400 font-mono text-base block mb-2">03.</span>
            {t.projects.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-xl p-6 transition-all hover:-translate-y-1 block"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors">
                    {project.name}
                  </h3>
                  <svg
                    className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 transition-colors flex-shrink-0"
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
                <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{project.description}</p>
                <div className="flex gap-3 flex-wrap">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs text-cyan-400 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://github.com/luucassp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors"
            >
              {t.projects.viewAll}
            </a>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-purple-400 font-mono text-base block mb-2">04.</span>
            {t.contact.title}
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">{t.contact.description}</p>
          <a
            href="mailto:sergio.lucas.ferrari@gmail.com"
            className="inline-block px-8 py-4 border border-purple-500 text-purple-400 hover:bg-purple-500/10 rounded-lg font-medium transition-colors mb-12"
          >
            sergio.lucas.ferrari@gmail.com
          </a>
          <div className="flex justify-center gap-10 text-zinc-500">
            <a
              href="https://github.com/luucassp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {t.contact.github}
            </a>
            <a
              href="https://www.linkedin.com/in/sergiolucaspereira"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {t.contact.linkedin}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-zinc-900">
        <p>
          {t.footer.developed} <span className="text-purple-400">Sergio L. Pereira</span> · 2025
        </p>
      </footer>
    </div>
  );
}
