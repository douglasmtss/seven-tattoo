"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre Nós", href: "#sobre" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    // Aguarda o menu fechar antes de scrollar (importante para mobile)
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        if (typeof target.scrollIntoView === "function") {
          try {
            target.scrollIntoView({ behavior: "smooth" });
          } catch {
            target.scrollIntoView();
          }
        } else {
          window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
        }
      }
    }, 300); // 300ms cobre a animação do menu mobile
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[var(--border)] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#inicio");
            }}
            className="flex flex-col leading-none cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[var(--gold)] text-2xl font-bold tracking-widest uppercase">
              Seven
            </span>
            <span className="text-[var(--foreground)] text-xs tracking-[0.4em] uppercase">
              Tattoo
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <motion.nav
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>

          {/* WhatsApp CTA */}
          <motion.a
            href="https://api.whatsapp.com/send?phone=%2B5521965813894"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 border border-[var(--gold)] text-[var(--gold)] text-sm tracking-widest uppercase hover:bg-[var(--gold)] hover:text-[#0d0d0d] transition-all duration-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Agendar
          </motion.a>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[var(--foreground)] p-2"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0d0d0d]/98 border-t border-[var(--border)]"
          >
            <nav className="flex flex-col p-6 gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors uppercase tracking-widest text-sm cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://api.whatsapp.com/send?phone=%2B5521965813894"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-center py-3 border border-[var(--gold)] text-[var(--gold)] uppercase tracking-widest text-sm hover:bg-[var(--gold)] hover:text-[#0d0d0d] transition-all"
              >
                Agendar via WhatsApp
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
