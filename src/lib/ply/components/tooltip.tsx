"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../internal/cn";

type Side = "top" | "bottom" | "left" | "right";

/**
 * `pending` is a hover that hasn't outlasted the delay yet. Modelling it as
 * state rather than a timer ref means the timeout lives in an effect whose
 * cleanup cancels it, so a pointer that leaves early, a re-render, or an
 * unmount all cancel correctly without any manual bookkeeping.
 */
type Intent = "closed" | "pending" | "open";

export interface TooltipProps {
  content: ReactNode;
  side?: Side;
  /** Hover delay in ms. Focus always opens immediately, since a keyboard user has
   *  already committed, so a delay just feels broken. */
  delay?: number;
  children: ReactElement;
}

const POSITION: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ARROW: Record<Side, string> = {
  top: "top-full left-1/2 -translate-x-1/2 -mt-1",
  bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
  left: "left-full top-1/2 -translate-y-1/2 -ml-1",
  right: "right-full top-1/2 -translate-y-1/2 -mr-1",
};

export function Tooltip({ content, side = "top", delay = 250, children }: TooltipProps) {
  const [intent, setIntent] = useState<Intent>("closed");
  const id = useId();
  const open = intent === "open";

  // Promote a pending hover to open once the delay elapses. Cleanup cancels
  // it if the pointer leaves first or the component unmounts.
  useEffect(() => {
    if (intent !== "pending") return;
    const timer = setTimeout(() => setIntent("open"), delay);
    return () => clearTimeout(timer);
  }, [intent, delay]);

  const hide = useCallback(() => setIntent("closed"), []);

  // Escape dismisses, so a tooltip can never obscure content the user is
  // trying to read, a WCAG 1.4.13 requirement.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIntent("closed");
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    "aria-describedby": open ? id : undefined,
    onMouseEnter: () => setIntent("pending"),
    onMouseLeave: hide,
    // Focus skips `pending` entirely.
    onFocus: () => setIntent("open"),
    onBlur: hide,
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "ply-animate-fade pointer-events-none absolute z-40 w-max max-w-56",
            "rounded-md bg-fg px-2.5 py-1.5 text-xs font-medium leading-snug",
            "text-[var(--ply-bg)] shadow-ply-md",
            POSITION[side],
          )}
        >
          {content}
          <span
            aria-hidden="true"
            className={cn("absolute size-2 rotate-45 bg-fg", ARROW[side])}
          />
        </span>
      )}
    </span>
  );
}
