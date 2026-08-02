"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

type Language = "pt" | "en";

interface NavLink {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  navLinks: NavLink[];
  onLogoClick: () => void;
}

const menuIconPath = (open: boolean) =>
  open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16";

// Header flutuante, sem fundo opaco. No desktop, a barra cheia do topo
// encolhe (via `layout` do framer-motion, com transição em mola) pra um
// ícone de menu sozinho no canto superior direito ao rolar; clicar nele abre
// um dropdown de cima pra baixo com os links + PT/EN — o mesmo padrão
// ícone→dropdown que o mobile já usa, só que disparado por scroll em vez de
// breakpoint.
export default function SiteHeader({ language, onLanguageChange, navLinks, onLogoClick }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Limiar amarrado à altura da tela (não um pixel fixo) — só colapsa
    // depois de rolar bem além do hero, pra não disparar "nervoso" logo no
    // início do scroll.
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.6);
      setIsMenuOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth >= 640) setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const langButton = (lang: Language, onDone?: () => void) => (
    <button
      onClick={() => {
        onLanguageChange(lang);
        onDone?.();
      }}
      className={cn(
        "px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer",
        language === lang
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {lang.toUpperCase()}
    </button>
  );

  const menuButton = (open: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      className="p-3 rounded-full bg-background/70 backdrop-blur-md border border-[var(--targaryen-gold)]/15 shadow-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuIconPath(open)} />
      </svg>
    </button>
  );

  const dropdownLinks = (onItemClick: () => void) => (
    <div className="flex flex-col p-2 min-w-[180px]">
      {navLinks.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-accent hover:bg-white/5 transition-colors"
        >
          {item.label}
        </a>
      ))}
      <div className="flex gap-1 px-3 pt-2 mt-1 border-t border-[var(--targaryen-gold)]/15">
        {langButton("pt", onItemClick)}
        {langButton("en", onItemClick)}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: barra cheia flutuando no topo, vira ícone de menu ao rolar */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
        className={cn(
          "hidden sm:flex items-center z-50",
          isScrolled
            ? "fixed top-4 right-6"
            : "fixed top-4 left-6 right-6 justify-between gap-6 px-6 py-4"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isScrolled ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative"
            >
              {menuButton(isMenuOpen, () => setIsMenuOpen((v) => !v))}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="absolute top-full right-0 mt-2 overflow-hidden rounded-2xl bg-background/80 backdrop-blur-md border border-[var(--targaryen-gold)]/15 shadow-lg"
                  >
                    {dropdownLinks(() => setIsMenuOpen(false))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-between gap-6 w-full"
            >
              <div className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                <Logo size="sm" onClick={onLogoClick} />
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                {navLinks.map((item) => (
                  <a key={item.href} href={item.href} className="hover:text-accent transition-colors whitespace-nowrap">
                    {item.label}
                  </a>
                ))}
                <div className="flex gap-1 pl-3 border-l border-[var(--targaryen-gold)]/25 items-center">
                  {langButton("pt")}
                  {langButton("en")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile: mesmo padrão ícone→dropdown, sempre visível (não só ao rolar) */}
      <div className="sm:hidden fixed top-4 right-6 z-50">
        {menuButton(isMenuOpen, () => setIsMenuOpen((v) => !v))}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="absolute top-full right-0 mt-2 overflow-hidden rounded-2xl bg-background/80 backdrop-blur-md border border-[var(--targaryen-gold)]/15 shadow-lg"
            >
              {dropdownLinks(() => setIsMenuOpen(false))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sm:hidden fixed top-4 left-6 z-50 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
        <Logo size="sm" onClick={onLogoClick} />
      </div>
    </>
  );
}
