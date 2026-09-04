"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../internal/cn";
import { useMounted } from "../hooks/use-mounted";
import { AlertIcon, CheckIcon, InfoIcon, XIcon } from "./icons";

type ToastTone = "info" | "success" | "warning" | "danger";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  duration: number;
}

type ToastInput = Omit<Partial<Toast>, "id"> & { title: string };

interface ToastContextValue {
  toasts: Toast[];
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}

const TONE_STYLES: Record<ToastTone, { icon: ReactNode; accent: string }> = {
  info: { icon: <InfoIcon />, accent: "text-accent" },
  success: { icon: <CheckIcon />, accent: "text-success" },
  warning: { icon: <AlertIcon />, accent: "text-warning" },
  danger: { icon: <AlertIcon />, accent: "text-danger" },
};

export function ToastProvider({
  children,
  max = 4,
}: {
  children: ReactNode;
  /** Oldest toasts are dropped once this many are on screen. */
  max?: number;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const mounted = useMounted();

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = Math.random().toString(36).slice(2, 10);
      const next: Toast = {
        id,
        title: input.title,
        description: input.description,
        tone: input.tone ?? "info",
        duration: input.duration ?? 4500,
      };

      setToasts((prev) => [...prev, next].slice(-max));
      if (next.duration > 0) {
        timers.current.set(id, setTimeout(() => dismiss(id), next.duration));
      }
      return id;
    },
    [dismiss, max],
  );

  // Clear every pending timer on unmount so we never set state on a dead tree.
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    },
    [],
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          /*
            One persistent live region that is always in the DOM: injecting a
            region at the same time as its content is the classic reason
            screen readers announce nothing. `polite` so toasts never
            interrupt what the user is reading.
          */
          <div
            role="region"
            aria-label="Notifications"
            className="pointer-events-none fixed bottom-0 right-0 z-[60] flex w-full max-w-sm flex-col gap-2 p-4"
          >
            <div aria-live="polite" aria-atomic="false" className="contents">
              {toasts.map((item) => (
                <ToastCard key={item.id} toast={item} onDismiss={dismiss} />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const tone = TONE_STYLES[toast.tone];
  return (
    <div
      className={cn(
        "ply-animate-slide-right pointer-events-auto flex gap-3 rounded-[var(--ply-radius)]",
        "border border-border-base bg-surface p-3.5 shadow-ply-lg",
      )}
    >
      <span className={cn("mt-0.5 shrink-0 text-base", tone.accent)}>{tone.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        aria-label={`Dismiss: ${toast.title}`}
        onClick={() => onDismiss(toast.id)}
        className="-mr-1 -mt-1 size-6 shrink-0 rounded text-fg-subtle transition-colors hover:bg-bg-inset hover:text-fg"
      >
        <XIcon className="mx-auto size-3.5" />
      </button>
    </div>
  );
}
