import AnimatedSection from "@/components/ui/AnimatedSection";

interface AboutSectionProps {
  title?: string;
  content?: string;
}

export default function AboutSection({
  title = "Sobre Nós",
  content = "A Seven Tattoo é um estúdio privado de tatuagem fundado por Geovanny Freitas, localizado em Duque de Caxias, RJ. Com dedicação à arte e ao cliente, cada tatuagem é criada com cuidado e personalidade única. Oferecemos um ambiente exclusivo, confortável e seguro para que você possa viver a experiência de transformar sua pele em arte.",
}: AboutSectionProps) {
  return (
    <section id="sobre" className="section-padding bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <AnimatedSection direction="left">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-[var(--gold)]" />
                <span className="text-[var(--gold)] text-xs tracking-[0.4em] uppercase">
                  Quem Somos
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 leading-tight">
                {title}
              </h2>
              <div className="gold-divider mb-8 ml-0" style={{ margin: "0 0 2rem 0" }} />
              <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8 whitespace-pre-line">
                {content}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "⚜️", label: "Estúdio Privado" },
                  { value: "🇧🇷", label: "Duque de Caxias, RJ" },
                  { value: "✏️", label: "Arte Personalizada" },
                  { value: "📱", label: "@seventattoo_ofc" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border border-[var(--border)] p-4 rounded"
                  >
                    <div className="text-2xl mb-1">{item.value}</div>
                    <div className="text-[var(--text-muted)] text-sm">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Visual */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="pr-4 pb-4">
              <div className="relative">
                <div className="aspect-[3/4] bg-[var(--surface-2)] rounded border border-[var(--border)] overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-[var(--gold)] text-8xl font-bold tracking-widest mb-4">7</div>
                    <div className="text-[var(--foreground)] text-2xl tracking-[0.5em] uppercase">Tattoo</div>
                    <div className="mt-6 text-[var(--text-muted)] text-sm leading-relaxed">
                      <p>Geovanny Freitas</p>
                      <p className="mt-2 text-xs tracking-widest uppercase">Artista & Fundador</p>
                    </div>
                  </div>
                </div>
                {/* Decorative border */}
                <div
                  className="absolute -bottom-4 -right-4 w-full h-full border border-[var(--gold)] rounded opacity-30 pointer-events-none"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
