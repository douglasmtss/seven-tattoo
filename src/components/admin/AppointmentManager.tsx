"use client";

import { useState } from "react";
import { Calendar, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { Appointment, AppointmentStatus } from "@/types";
import { formatDateTime, formatDate } from "@/lib/utils";

interface AppointmentManagerProps {
  initialAppointments: Appointment[];
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  completed: "Concluído",
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "text-yellow-400 bg-yellow-900/30 border-yellow-700",
  approved: "text-green-400 bg-green-900/30 border-green-700",
  rejected: "text-red-400 bg-red-900/30 border-red-700",
  completed: "text-blue-400 bg-blue-900/30 border-blue-700",
};

const SIZE_LABELS = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
  "extra-large": "Extra Grande",
};

export default function AppointmentManager({
  initialAppointments,
}: AppointmentManagerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState<AppointmentStatus>("pending");
  const [isSaving, setIsSaving] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const handleOpen = (appt: Appointment) => {
    setSelected(appt);
    setNotes(appt.notes || "");
    setNewStatus(appt.status);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/appointments/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes }),
      });
      const data = (await res.json()) as { success: boolean; data?: Appointment };
      if (!res.ok || !data.success) throw new Error();
      if (data.data) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === selected.id ? data.data! : a))
        );
        setSelected(data.data);
      }
      addToast("Agendamento atualizado!", "success");
    } catch {
      addToast("Erro ao atualizar.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este agendamento?")) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (selected?.id === id) setSelected(null);
      addToast("Agendamento excluído.", "success");
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Agendamentos</h1>
        <p className="text-[var(--text-muted)] text-sm">
          {appointments.length} total ·{" "}
          {appointments.filter((a) => a.status === "pending").length} pendentes
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "approved", "rejected", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-all border ${filter === f ? "bg-[var(--gold)] text-[#0d0d0d] border-[var(--gold)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)]"}`}
          >
            {f === "all" ? "Todos" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <Calendar size={40} className="mx-auto mb-4 opacity-40" />
          <p>Nenhum agendamento encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((appt) => (
            <div
              key={appt.id}
              className={`flex items-start gap-4 p-4 border rounded cursor-pointer transition-colors ${selected?.id === appt.id ? "border-[var(--gold)]" : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)]/50"}`}
              onClick={() => handleOpen(appt)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-medium text-[var(--foreground)] text-sm">
                    {appt.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[appt.status]}`}>
                    {STATUS_LABELS[appt.status]}
                  </span>
                </div>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  {appt.placement} · {SIZE_LABELS[appt.size]} ·{" "}
                  {formatDate(appt.preferredDate)}
                </p>
                <p className="text-[var(--text-muted)] text-sm truncate mt-1">
                  {appt.description}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); void handleDelete(appt.id); }}
                className="p-1.5 text-[var(--text-muted)] hover:text-red-400 shrink-0"
                title="Excluir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Agendamento — ${selected?.name || ""}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Nome</span>
                <p className="text-[var(--foreground)]">{selected.name}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">E-mail</span>
                <a href={`mailto:${selected.email}`} className="text-[var(--gold)]">{selected.email}</a>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Telefone</span>
                <p className="text-[var(--foreground)]">{selected.phone}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Data preferida</span>
                <p className="text-[var(--foreground)]">{formatDate(selected.preferredDate)}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Local</span>
                <p className="text-[var(--foreground)]">{selected.placement}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Tamanho</span>
                <p className="text-[var(--foreground)]">{SIZE_LABELS[selected.size]}</p>
              </div>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Descrição</span>
              <div className="bg-[var(--surface-2)] p-3 rounded whitespace-pre-wrap text-[var(--foreground)]">
                {selected.description}
              </div>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-2">Status</span>
              <div className="flex flex-wrap gap-2">
                {(["pending", "approved", "rejected", "completed"] as AppointmentStatus[]).map((s) => {
                  const Icon = s === "approved" ? CheckCircle : s === "rejected" ? XCircle : Clock;
                  return (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded transition-all ${newStatus === s ? STATUS_COLORS[s] : "border-[var(--border)] text-[var(--text-muted)]"}`}
                    >
                      <Icon size={12} />
                      {STATUS_LABELS[s]}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Notas internas</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] resize-none"
                maxLength={1000}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => void handleUpdate()} isLoading={isSaving}>
                Salvar
              </Button>
              <a
                href={`https://api.whatsapp.com/send?phone=${selected.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white text-sm transition-colors rounded-md"
              >
                WhatsApp
              </a>
            </div>
            <p className="text-[var(--text-muted)] text-xs">
              Criado em {formatDateTime(selected.createdAt)}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
