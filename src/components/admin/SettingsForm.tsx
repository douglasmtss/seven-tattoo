"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { StudioSettings } from "@/types";

interface SettingsFormProps {
  initialSettings: StudioSettings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<StudioSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleChange = (
    field: string,
    value: string,
    nested?: string
  ) => {
    if (nested) {
      setSettings((prev) => ({
        ...prev,
        [nested]: {
          ...(prev[nested as keyof StudioSettings] as object),
          [field]: value,
        },
      }));
    } else {
      setSettings((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      addToast("Configurações salvas!", "success");
    } catch {
      addToast("Erro ao salvar.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors";
  const labelClass =
    "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1.5";

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Configurações</h1>
        <p className="text-[var(--text-muted)] text-sm">Informações do estúdio</p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8 max-w-2xl">
        {/* Basic info */}
        <section className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-2">
            Informações Básicas
          </h2>
          <div>
            <label className={labelClass}>Nome do Estúdio</label>
            <input type="text" value={settings.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass} maxLength={100} />
          </div>
          <div>
            <label className={labelClass}>Slogan</label>
            <input type="text" value={settings.tagline} onChange={(e) => handleChange("tagline", e.target.value)} className={inputClass} maxLength={200} />
          </div>
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea value={settings.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className={`${inputClass} resize-none`} maxLength={1000} />
          </div>
          <div>
            <label className={labelClass}>Endereço</label>
            <input type="text" value={settings.address} onChange={(e) => handleChange("address", e.target.value)} className={inputClass} maxLength={200} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Telefone</label>
              <input type="tel" value={settings.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass} maxLength={30} />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input type="email" value={settings.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass} maxLength={254} />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-2">
            Redes Sociais
          </h2>
          {[
            { key: "instagram", label: "Instagram URL" },
            { key: "facebook", label: "Facebook URL" },
            { key: "whatsapp", label: "WhatsApp API URL" },
            { key: "tiktok", label: "TikTok URL" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="url"
                value={(settings as unknown as Record<string, string>)[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className={inputClass}
                maxLength={300}
              />
            </div>
          ))}
        </section>

        <Button type="submit" isLoading={isSaving} size="lg" className="tracking-widest">
          Salvar Configurações
        </Button>
      </form>
    </>
  );
}
