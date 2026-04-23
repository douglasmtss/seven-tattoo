"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2, Reply } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { ContactMessage } from "@/types";
import { formatDateTime } from "@/lib/utils";

interface MessageManagerProps {
  initialMessages: ContactMessage[];
}

export default function MessageManager({ initialMessages }: MessageManagerProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "replied") return m.replied;
    return true;
  });

  const markRead = async (id: string, read: boolean) => {
    const res = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read } : m))
      );
    }
  };

  const handleOpen = (msg: ContactMessage) => {
    setSelected(msg);
    setReplyText(msg.reply || "");
    if (!msg.read) void markRead(msg.id, true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta mensagem?")) return;
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      addToast("Mensagem excluída.", "success");
    }
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/messages/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });
      if (!res.ok) throw new Error();
      const updated = { ...selected, reply: replyText, replied: true, read: true };
      setMessages((prev) => prev.map((m) => (m.id === selected.id ? updated : m)));
      setSelected(updated);
      addToast("Resposta salva!", "success");
    } catch {
      addToast("Erro ao salvar resposta.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Mensagens</h1>
        <p className="text-[var(--text-muted)] text-sm">
          {messages.length} mensagens · {unreadCount} não lidas
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "unread", "replied"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-all border ${filter === f ? "bg-[var(--gold)] text-[#0d0d0d] border-[var(--gold)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)]"}`}
          >
            {f === "all" ? "Todas" : f === "unread" ? "Não lidas" : "Respondidas"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <Mail size={40} className="mx-auto mb-4 opacity-40" />
          <p>Nenhuma mensagem encontrada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-4 p-4 border rounded cursor-pointer transition-colors ${selected?.id === msg.id ? "border-[var(--gold)] bg-[var(--gold)]/5" : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)]/50"}`}
              onClick={() => handleOpen(msg)}
            >
              <div className={`mt-1 shrink-0 ${msg.read ? "text-[var(--text-muted)]" : "text-[var(--gold)]"}`}>
                {msg.read ? <MailOpen size={18} /> : <Mail size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-medium text-sm ${msg.read ? "text-[var(--foreground)]" : "text-[var(--gold)]"}`}>
                    {msg.name}
                  </span>
                  <span className="text-[var(--text-muted)] text-xs shrink-0">
                    {formatDateTime(msg.createdAt)}
                  </span>
                </div>
                <p className="text-[var(--text-muted)] text-xs truncate">{msg.email}</p>
                <p className="text-[var(--text-muted)] text-sm truncate mt-1">{msg.message}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); void handleDelete(msg.id); }}
                  className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Mensagem de ${selected?.name || ""}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">E-mail</span>
                <a href={`mailto:${selected.email}`} className="text-[var(--gold)] hover:text-[var(--gold-light)]">
                  {selected.email}
                </a>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-1">Telefone</span>
                <a href={`tel:${selected.phone}`} className="text-[var(--foreground)]">
                  {selected.phone}
                </a>
              </div>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest block mb-2">Mensagem</span>
              <div className="bg-[var(--surface-2)] p-4 rounded text-sm text-[var(--foreground)] whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                <Reply size={14} />
                Resposta (nota interna)
              </span>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Escreva uma resposta ou nota interna..."
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] resize-none"
                maxLength={2000}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => void handleReply()} isLoading={isSending}>
                Salvar Resposta
              </Button>
              <a
                href={`https://api.whatsapp.com/send?phone=${selected.phone.replace(/\D/g, "")}&text=Olá ${encodeURIComponent(selected.name)}, tudo bem?`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white text-sm transition-colors rounded-md"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
