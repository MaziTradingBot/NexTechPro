"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToastStore } from "@/lib/store/toast";

const icons = {
  success: <CheckCircle2 size={18} className="text-emerald-500" />,
  info: <Info size={18} className="text-brand-500" />,
  error: <XCircle size={18} className="text-rose-500" />,
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-sm font-medium text-slate-100 shadow-lg"
          >
            {icons[toast.type]}
            <span className="line-clamp-2">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
