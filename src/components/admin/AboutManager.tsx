"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { StudioSettings } from "@/types";

interface AboutManagerProps {
  initialSettings: StudioSettings;
}

export default function AboutManager({ initialSettings }: AboutManagerProps) {
  const [title, setTitle] = useState(initialSettings.about.title);
  const [content, setContent] = useState(initialSettings.about.content);
  const [isSaving, setIsSaving] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...initialSettings,
          about: { title, content },
        }),
      });
      if (!res.ok) throw new Error();
      addToast("Seção 'Sobre Nós' atualizada!", "success");
    } catch {
      addToast("Erro ao salvar.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors";

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Sobre Nós</h1>
        <p className="text-[var(--text-muted)] text-sm">
          Edite o conteúdo da seção "Sobre Nós" da landing page
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6 max-w-2xl">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
              Título da Seção
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
              Conteúdo
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className={`${inputClass} resize-none`}
              maxLength={2000}
              placeholder="Escreva a história e descrição do estúdio..."
            />
            <p className="text-[var(--text-muted)] text-xs mt-1">
              {content.length}/2000 caracteres
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded">
          <h2 className="text-xs uppercase tracking-widest text-[var(--gold)] mb-3">
            Pré-visualização
          </h2>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{title}</h3>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>

        <Button type="submit" isLoading={isSaving} size="lg" className="tracking-widest">
          Salvar
        </Button>
      </form>
    </>
  );
}
