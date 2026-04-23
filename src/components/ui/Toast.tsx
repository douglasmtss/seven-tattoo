"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { Toast as ToastType } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onRemove,
}: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-xl border ${
              toast.type === "success"
                ? "bg-green-900/90 border-green-700 text-green-100"
                : toast.type === "error"
                  ? "bg-red-900/90 border-red-700 text-red-100"
                  : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--foreground)]"
            }`}
          >
            <span className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle size={18} />}
              {toast.type === "error" && <XCircle size={18} />}
              {toast.type === "info" && <Info size={18} />}
            </span>
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Fechar notificação"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
