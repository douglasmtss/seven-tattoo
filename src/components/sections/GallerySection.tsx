"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { GalleryItem } from "@/types";

interface GallerySectionProps {
  items: GalleryItem[];
}

const CATEGORIES = ["Todas", "Blackwork", "Geométrico", "Fineline", "Dotwork", "Japonês", "Old School", "Ornamental", "Lettering", "Realismo"];

export default function GallerySection({ items }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === "Todas"
      ? items
      : items.filter((item) => item.category === activeCategory);

  // Fallback items when no real images are uploaded
  const displayItems =
    filtered.length > 0
      ? filtered
      : Array.from({ length: 9 }, (_, i) => ({
          id: `placeholder-${i}`,
          title: "Tatuagem Exclusiva",
          description: "Arte personalizada por Geovanny Freitas",
          imageUrl: `https://picsum.photos/seed/tattoo${i + 1}/400/500`,
          category: "Realismo",
          createdAt: new Date().toISOString(),
          visible: true,
        }));

  return (
    <section id="galeria" className="section-padding bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[var(--gold)]" />
            <span className="text-[var(--gold)] text-xs tracking-[0.4em] uppercase">
              Nosso Trabalho
            </span>
            <div className="h-px w-10 bg-[var(--gold)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Galeria
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Cada tatuagem conta uma história. Explore nossas criações exclusivas
            e personalizadas.
          </p>
        </AnimatedSection>

        {/* Category filter */}
        <AnimatedSection delay={0.1} className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-[var(--gold)] text-[#0d0d0d] border-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          layout
        >
          <AnimatePresence>
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="relative group cursor-pointer overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] aspect-[3/4]"
                onClick={() => setLightboxItem(item)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0d0d0d]/0 group-hover:bg-[#0d0d0d]/60 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn
                    size={28}
                    className="text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
              onClick={() => setLightboxItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-lg w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute -top-10 right-0 text-[var(--text-muted)] hover:text-white"
                  aria-label="Fechar"
                >
                  <X size={24} />
                </button>
                <div className="relative aspect-[3/4] bg-[var(--surface-2)]">
                  <Image
                    src={lightboxItem.imageUrl}
                    alt={lightboxItem.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 90vw, 512px"
                  />
                </div>
                <div className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                  <h3 className="text-[var(--foreground)] font-semibold">
                    {lightboxItem.title}
                  </h3>
                  {lightboxItem.description && (
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                      {lightboxItem.description}
                    </p>
                  )}
                  <span className="mt-2 inline-block text-[var(--gold)] text-xs tracking-widest uppercase">
                    {lightboxItem.category}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <AnimatedSection delay={0.3} className="text-center mt-12">
          <p className="text-[var(--text-muted)] mb-6">
            Quer uma tatuagem exclusiva? Entre em contato!
          </p>
          <a
            href="https://www.instagram.com/seventattoo_ofc/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--gold)] text-[var(--gold)] tracking-widest uppercase text-sm hover:bg-[var(--gold)] hover:text-[#0d0d0d] transition-all duration-200"
          >
            Ver mais no Instagram
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
