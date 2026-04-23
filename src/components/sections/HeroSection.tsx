"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToAbout = () => {
    document.querySelector("#sobre")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[#0d0d0d]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, #d4af37 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #d4af37 0px, #d4af37 1px, transparent 0px, transparent 50%)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Ornament */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
          <span className="text-[var(--gold)] text-xs tracking-[0.5em] uppercase">
            Estúdio Privado
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="text-7xl sm:text-8xl md:text-9xl font-bold text-[var(--foreground)] leading-none mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-[var(--gold)]">Seven</span>
        </motion.h1>
        <motion.div
          className="text-3xl sm:text-4xl md:text-5xl tracking-[0.6em] uppercase text-[var(--foreground)] mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Tattoo
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-[var(--text-muted)] text-lg sm:text-xl tracking-widest mb-12 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Arte na pele, para sempre.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <a
            href="https://api.whatsapp.com/send?phone=%2B5521965813894"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-[var(--gold)] text-[#0d0d0d] font-semibold tracking-widest uppercase text-sm hover:bg-[var(--gold-light)] transition-all duration-200 min-w-48"
          >
            Agendar Tatuagem
          </a>
          <button
            onClick={scrollToAbout}
            className="px-8 py-3.5 border border-[var(--gold)] text-[var(--gold)] tracking-widest uppercase text-sm hover:bg-[var(--gold)] hover:text-[#0d0d0d] transition-all duration-200 min-w-48"
          >
            Conheça o Estúdio
          </button>
        </motion.div>

        {/* Location tag */}
        <motion.p
          className="mt-10 text-[var(--text-muted)] text-xs tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          📍 Rua Erne — Duque de Caxias, RJ
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--gold)] opacity-60 hover:opacity-100 transition-opacity"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        aria-label="Rolar para baixo"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
}
