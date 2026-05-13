"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type AdminToastContextValue = {
  showToast: (input: Omit<ToastItem, "id">) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

const TOAST_DURATION_MS = 3200;

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((input: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...input }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-5 top-5 z-[120] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </AdminToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [onDismiss, toast.id]);

  return (
    <div
      className={cn(
        "pointer-events-auto rounded-sm border bg-white px-4 py-3 shadow-[0_16px_40px_rgba(56,53,50,0.12)]",
        toast.tone === "success"
          ? "border-[#cfe3d4]"
          : "border-[#e8b8b1]",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            toast.tone === "success"
              ? "bg-[#eef6f0] text-[#3f7a50]"
              : "bg-[#fff0ee] text-[#a13c2f]",
          )}
        >
          {toast.tone === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#383532]">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-xs leading-5 text-[#8a867f]">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded-sm p-1 text-[#a5a098] transition-colors hover:bg-[#f4efe6] hover:text-[#383532]"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);

  if (!context) {
    throw new Error("useAdminToast must be used within AdminToastProvider.");
  }

  return context;
}
