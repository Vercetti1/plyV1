"use client";

import {
  createContext,
  useContext,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../internal/cn";
import { useControllableState } from "../hooks/use-controllable-state";
import { ChevronDownIcon } from "./icons";

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <Accordion>.`);
  return context;
}

export interface AccordionProps {
  /** `single` closes the previous item on open; `multiple` allows several. */
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** In `single` mode, allow closing the open item by clicking it again. */
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
}

export function Accordion({
  type = "single",
  value,
  defaultValue = [],
  onValueChange,
  collapsible = true,
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  function toggle(item: string) {
    setOpenItems((prev) => {
      const isOpen = prev.includes(item);
      if (type === "multiple") {
        return isOpen ? prev.filter((v) => v !== item) : [...prev, item];
      }
      if (isOpen) return collapsible ? [] : prev;
      return [item];
    });
  }

  /** Arrow keys move between headers, per the WAI-ARIA accordion pattern. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const headers = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-ply-accordion-trigger]:not([disabled])",
      ) ?? [],
    );
    const index = headers.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;

    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? headers.length - 1
          : event.key === "ArrowDown"
            ? (index + 1) % headers.length
            : (index - 1 + headers.length) % headers.length;
    headers[next]?.focus();
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggle, baseId }}>
      <div
        ref={rootRef}
        onKeyDown={onKeyDown}
        className={cn(
          "divide-y divide-[var(--ply-border)] overflow-hidden rounded-[var(--ply-radius)] border border-border-base bg-surface",
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  title,
  children,
  disabled,
}: {
  value: string;
  title: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}) {
  const { openItems, toggle, baseId } = useAccordionContext("AccordionItem");
  const isOpen = openItems.includes(value);
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <div data-state={isOpen ? "open" : "closed"}>
      <h3 className="m-0">
        <button
          type="button"
          id={triggerId}
          data-ply-accordion-trigger=""
          aria-expanded={isOpen}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => toggle(value)}
          className={cn(
            "flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left",
            "text-sm font-medium text-fg transition-colors",
            "hover:bg-bg-subtle focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ply-accent-ring)] outline-none",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {title}
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 text-fg-subtle transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </h3>

      {/*
        Animating to `auto` height isn't possible with plain CSS transitions,
        so the panel is a grid row that animates between 0fr and 1fr. This
        keeps the content in the flow and needs no height measurement.
      */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-sm leading-relaxed text-fg-muted">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
