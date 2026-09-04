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

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  orientation: "horizontal" | "vertical";
  activationMode: "automatic" | "manual";
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  return context;
}

export interface TabsProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  /**
   * `automatic` selects a tab as soon as it receives focus (the WAI-ARIA
   * default). Use `manual` when a panel is expensive to render, so arrow keys
   * only move focus and Enter/Space commits.
   */
  activationMode?: "automatic" | "manual";
  children: ReactNode;
  className?: string;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  activationMode = "automatic",
  children,
  className,
}: TabsProps) {
  const [active, setActive] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId();

  return (
    <TabsContext.Provider
      value={{ value: active, setValue: setActive, baseId, orientation, activationMode }}
    >
      <div
        data-orientation={orientation}
        className={cn(orientation === "vertical" ? "flex gap-6" : "", className)}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  const { orientation } = useTabsContext("TabsList");
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * Roving tabindex: the tab strip is one tab stop and arrow keys move
   * between tabs, per the WAI-ARIA tabs pattern. Home/End jump to the ends
   * and movement wraps.
   */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    if (!["Home", "End", nextKey, prevKey].includes(event.key)) return;

    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(
        "[role='tab']:not([disabled])",
      ) ?? [],
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex: number;
    switch (event.key) {
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = tabs.length - 1; break;
      case nextKey: nextIndex = (currentIndex + 1) % tabs.length; break;
      default: nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    event.preventDefault();
    tabs[nextIndex]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={onKeyDown}
      className={cn(
        "gap-1 rounded-[var(--ply-radius)] bg-bg-inset p-1",
        orientation === "vertical"
          ? "flex h-fit min-w-44 flex-col"
          : "inline-flex items-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  disabled,
  className,
}: {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const ctx = useTabsContext("TabsTrigger");
  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      // Only the selected tab is reachable by Tab; the rest are driven by
      // arrow keys via the list's roving-tabindex handler.
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => ctx.setValue(value)}
      onFocus={() => {
        if (ctx.activationMode === "automatic" && !disabled) ctx.setValue(value);
      }}
      className={cn(
        "relative rounded-[calc(var(--ply-radius)-2px)] px-3 py-1.5 text-sm font-medium",
        "transition-colors duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)]",
        "disabled:pointer-events-none disabled:opacity-40",
        isActive
          ? "bg-surface text-fg shadow-ply-sm"
          : "text-fg-muted hover:text-fg",
        ctx.orientation === "vertical" && "text-left",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useTabsContext("TabsPanel");
  const isActive = ctx.value === value;

  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      // Panels stay in the tree but are hidden, so `hidden` (not unmounting)
      // preserves scroll position and form state across tab switches.
      hidden={!isActive}
      tabIndex={0}
      className={cn("mt-4 outline-none focus-visible:ring-0", className)}
    >
      {isActive && children}
    </div>
  );
}
