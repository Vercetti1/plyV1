"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../internal/cn";
import { focusOnPointerDown, useFocusTrap } from "../hooks/use-focus-trap";
import { useScrollLock } from "../hooks/use-scroll-lock";
import { useControllableState } from "../hooks/use-controllable-state";
import { useMounted } from "../hooks/use-mounted";
import { Button } from "./button";
import { XIcon } from "./icons";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(component: string) {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(`<${component}> must be rendered inside <Dialog>.`);
  }
  return context;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();

  return (
    <DialogContext.Provider
      value={{
        open: isOpen,
        setOpen,
        titleId: `${baseId}-title`,
        descriptionId: `${baseId}-description`,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: { children: ReactNode }) {
  const { setOpen } = useDialogContext("DialogTrigger");
  return (
    <span
      className="contents"
      // Focus the trigger before opening, so focus has somewhere to return
      // to on close even in browsers that don't focus buttons on click.
      onPointerDown={focusOnPointerDown}
      onClick={() => setOpen(true)}
    >
      {children}
    </span>
  );
}

export interface DialogContentProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Set false to require an explicit action, useful for destructive flows. */
  dismissable?: boolean;
  className?: string;
}

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

export function DialogContent({
  children,
  size = "md",
  dismissable = true,
  className,
}: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialogContext("DialogContent");
  const panelRef = useRef<HTMLDivElement>(null);
  // Portals need a DOM target, which doesn't exist during SSR.
  const mounted = useMounted();

  useFocusTrap(panelRef, open);
  useScrollLock(open);

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open || !dismissable) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, dismissable, close]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="ply-animate-fade absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        // The overlay is decorative (the panel owns the dialog semantics),
        // so it is hidden from assistive tech and closing is keyboard-served
        // by Escape rather than by making this div focusable.
        aria-hidden="true"
        onClick={dismissable ? close : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={cn(
          "ply-animate-zoom relative w-full overflow-hidden",
          "rounded-2xl border border-border-base bg-surface shadow-ply-lg",
          SIZES[size],
          className,
        )}
      >
        {dismissable && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close dialog"
            onClick={close}
            className="absolute right-3 top-3 size-8 text-fg-subtle"
          >
            <XIcon className="size-4" />
          </Button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="space-y-1.5 px-6 pt-6 pr-14">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  const { titleId } = useDialogContext("DialogTitle");
  return (
    <h2 id={titleId} className="text-lg font-semibold tracking-tight text-fg">
      {children}
    </h2>
  );
}

export function DialogDescription({ children }: { children: ReactNode }) {
  const { descriptionId } = useDialogContext("DialogDescription");
  return (
    <p id={descriptionId} className="text-sm leading-relaxed text-fg-muted">
      {children}
    </p>
  );
}

export function DialogBody({ children }: { children: ReactNode }) {
  return <div className="max-h-[60vh] overflow-y-auto px-6 py-5 text-sm text-fg">{children}</div>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-border-base bg-bg-subtle px-6 py-4 sm:flex-row sm:justify-end">
      {children}
    </div>
  );
}

export function DialogClose({ children }: { children: ReactNode }) {
  const { setOpen } = useDialogContext("DialogClose");
  return (
    <span className="contents" onClick={() => setOpen(false)}>
      {children}
    </span>
  );
}
