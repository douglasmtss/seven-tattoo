"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { contactSchema, ContactInput } from "@/lib/validations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/Toast";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        addToast(
          "Mensagem enviada com sucesso! Entraremos em contato em breve.",
          "success"
        );
        reset();
      } else {
        throw new Error("Erro ao enviar");
      }
    } catch {
      addToast(
        "Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-[var(--surface-2)] border ${hasError ? "border-red-500" : "border-[var(--border)]"} text-[var(--foreground)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-muted)]`;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <section id="contato" className="section-padding bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <AnimatedSection className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-[var(--gold)]" />
              <span className="text-[var(--gold)] text-xs tracking-[0.4em] uppercase">
                Fale Conosco
              </span>
              <div className="h-px w-10 bg-[var(--gold)]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
              Contato
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              Pronto para transformar sua ideia em arte? Envie uma mensagem ou
              agende diretamente pelo WhatsApp.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <AnimatedSection direction="left" className="lg:col-span-2">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[var(--gold)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-[var(--foreground)] font-semibold mb-1">
                      Localização
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      Rua Erne
                      <br />
                      Duque de Caxias, RJ
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[var(--gold)]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-[var(--foreground)] font-semibold mb-1">
                      WhatsApp
                    </h3>
                    <a
                      href="https://api.whatsapp.com/send?phone=%2B5521965813894"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--gold)] text-sm hover:text-[var(--gold-light)] transition-colors"
                    >
                      +55 21 96581-3894
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[var(--gold)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </div>
                  <div>
                    <h3 className="text-[var(--foreground)] font-semibold mb-1">
                      Instagram
                    </h3>
                    <a
                      href="https://www.instagram.com/seventattoo_ofc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--gold)] text-sm hover:text-[var(--gold-light)] transition-colors"
                    >
                      @seventattoo_ofc
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[var(--gold)]">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-[var(--foreground)] font-semibold mb-1">
                      Agendamento
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      Via direct no Instagram
                      <br />
                      ou pelo formulário ao lado
                    </p>
                  </div>
                </div>

                {/* WhatsApp button */}
                <a
                  href="https://api.whatsapp.com/send?phone=%2B5521965813894"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-green-700 hover:bg-green-600 text-white transition-colors text-sm tracking-widest uppercase"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection direction="right" delay={0.2} className="lg:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("name")}
                      placeholder="Nome completo *"
                      className={inputClass(!!errors.name)}
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-400 text-xs">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="E-mail *"
                      className={inputClass(!!errors.email)}
                      maxLength={254}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-400 text-xs">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Telefone / WhatsApp *"
                    className={inputClass(!!errors.phone)}
                    maxLength={20}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-400 text-xs">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <textarea
                    {...register("message")}
                    placeholder="Sua mensagem — descreva sua ideia de tatuagem, local no corpo, tamanho... *"
                    rows={6}
                    className={`${inputClass(!!errors.message)} resize-none`}
                    maxLength={1000}
                  />
                  {errors.message && (
                    <p className="mt-1 text-red-400 text-xs">{errors.message.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-4 tracking-widest uppercase"
                  size="lg"
                >
                  Enviar Mensagem
                </Button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
