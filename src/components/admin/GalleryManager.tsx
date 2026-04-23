"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { GalleryItem } from "@/types";

const CATEGORIES = [
  "Realismo",
  "Old School",
  "Geométrico",
  "Tribal",
  "Blackwork",
  "Aquarela",
  "Lettering",
  "Outro",
];

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

export default function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    visible: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileRef.current?.files?.[0]) {
      addToast("Selecione uma imagem.", "error");
      return;
    }
    if (!form.title.trim()) {
      addToast("Informe um título.", "error");
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", fileRef.current.files[0]);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("visible", String(form.visible));

      const res = await fetch("/api/gallery", { method: "POST", body: fd });
      const data = (await res.json()) as { success: boolean; data?: GalleryItem };
      if (!res.ok || !data.success) throw new Error("Erro no upload");

      if (data.data) setItems((prev) => [data.data!, ...prev]);
      setIsModalOpen(false);
      setPreview(null);
      setForm({ title: "", description: "", category: CATEGORIES[0], visible: true });
      if (fileRef.current) fileRef.current.value = "";
      addToast("Tatuagem adicionada!", "success");
    } catch {
      addToast("Erro ao adicionar. Tente novamente.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleVisibility = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !item.visible }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, visible: !i.visible } : i))
      );
    } catch {
      addToast("Erro ao atualizar visibilidade.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta tatuagem da galeria?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
      addToast("Tatuagem removida.", "success");
    } catch {
      addToast("Erro ao remover.", "error");
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Galeria
          </h1>
          <p className="text-[var(--text-muted)] text-sm">{items.length} tatuagens</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Adicionar
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <Upload size={40} className="mx-auto mb-4 opacity-40" />
          <p>Nenhuma tatuagem na galeria.</p>
          <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
            Adicionar primeira tatuagem
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`relative group border rounded overflow-hidden ${item.visible ? "border-[var(--border)]" : "border-[var(--border)] opacity-50"}`}
            >
              <div className="aspect-[3/4] relative bg-[var(--surface-2)]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-2 bg-[var(--surface)]">
                <p className="text-xs font-medium text-[var(--foreground)] truncate">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--gold)]">{item.category}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => void toggleVisibility(item)}
                  className="p-1.5 bg-[#0d0d0d]/80 rounded text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  title={item.visible ? "Ocultar" : "Mostrar"}
                >
                  {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => void handleDelete(item.id)}
                  className="p-1.5 bg-[#0d0d0d]/80 rounded text-[var(--text-muted)] hover:text-red-400"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPreview(null);
        }}
        title="Adicionar Tatuagem"
        size="md"
      >
        <div className="space-y-4">
          {/* Image preview */}
          <div
            className="border-2 border-dashed border-[var(--border)] rounded p-4 text-center cursor-pointer hover:border-[var(--gold)] transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <div className="relative aspect-square max-h-48 mx-auto">
                <Image src={preview} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <div className="py-8 text-[var(--text-muted)]">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm">Clique para selecionar imagem</p>
                <p className="text-xs mt-1">JPG, PNG, WEBP — max 10MB</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <input
            type="text"
            placeholder="Título *"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)]"
            maxLength={100}
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)] resize-none"
            maxLength={500}
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
              className="accent-[var(--gold)] w-4 h-4"
            />
            <span className="text-[var(--text-muted)] text-sm">Visível na galeria pública</span>
          </label>

          <Button
            onClick={() => void handleUpload()}
            isLoading={isUploading}
            className="w-full"
          >
            Salvar Tatuagem
          </Button>
        </div>
      </Modal>
    </>
  );
}
