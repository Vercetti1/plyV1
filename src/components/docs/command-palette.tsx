"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/ply";
import { useFocusTrap } from "@/lib/ply/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/ply/hooks/use-scroll-lock";
import { SearchIcon } from "@/lib/ply/components/icons";
import { components } from "@/registry";

interface Entry {
  href: string;
  title: string;
  group: string;
  keywords: string;
}

const ENTRIES: Entry[] = [
  { href: "/docs", title: "Introduction", group: "Guides", keywords: "intro overview start" },
  { href: "/docs/installation", title: "Installation", group: "Guides", keywords: "install setup npm copy" },
  { href: "/docs/theming", title: "Theming", group: "Guides", keywords: "theme tokens colors dark css variables" },
  { href: "/docs/accessibility", title: "Accessibility", group: "Guides", keywords: "a11y aria keyboard screen reader wcag" },
  ...components.map((component) => ({
    href: `/docs/components/${component.slug}`,
    title: component.name,
    group: component.category,
    keywords: `${component.slug} ${component.summary}`.toLowerCase(),
  })),
];

/**
 * ⌘K palette. Scores matches so a prefix hit on the title always outranks a
 * loose keyword hit, the behaviour people expect from this control.
 */
function search(query: string): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return ENTRIES;

  return ENTRIES.map((entry) => {
    const title = entry.title.toLowerCase();
    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 80;
    else if (title.includes(q)) score = 60;
    else if (entry.keywords.includes(q)) score = 30;
    return { entry, score };
  })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.entry);
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => search(query), [query]);

  useFocusTrap(panelRef, open);
  useScrollLock(open);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // Global shortcut. `⌘K`/`Ctrl+K` opens, and `/` opens too, but only when
  // the user isn't already typing in a field.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      } else if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Reset the highlight when the query changes. Adjusting state during
  // render, rather than in an effect, avoids rendering one frame with a
  // highlight pointing at the wrong (or a nonexistent) result.
  const [lastQuery, setLastQuery] = useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setActiveIndex(0);
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) =>
          results.length ? (i - 1 + results.length) % results.length : 0,
        );
        break;
      case "Enter": {
        event.preventDefault();
        const target = results[activeIndex];
        if (target) {
          router.push(target.href);
          close();
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        close();
        break;
    }
  }

  useEffect(() => {
    if (!open) return;
    document
      .querySelector(`[data-cmd-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-[var(--ply-radius)] border border-border-base",
          "bg-surface px-3 text-sm text-fg-subtle transition-colors hover:border-border-strong hover:text-fg-muted",
          "outline-none focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)]",
        )}
      >
        <SearchIcon className="size-4" />
        <span className="hidden sm:inline">Search docs</span>
        <kbd className="ml-2 hidden rounded border border-border-base bg-bg-inset px-1.5 py-0.5 font-mono text-[0.625rem] text-fg-subtle sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
          <div
            className="ply-animate-fade absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={close}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="ply-animate-zoom relative w-full max-w-lg overflow-hidden rounded-xl border border-border-base bg-surface shadow-ply-lg"
          >
            <div className="flex items-center gap-3 border-b border-border-base px-4">
              <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
              <input
                data-ply-autofocus=""
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search components and guides…"
                aria-label="Search documentation"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-results"
                aria-activedescendant={
                  results.length ? `cmd-option-${activeIndex}` : undefined
                }
                className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
              />
            </div>

            <ul id="cmd-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-fg-muted">
                  No results for “{query}”.
                </li>
              )}
              {results.map((entry, index) => (
                <li
                  key={entry.href}
                  id={`cmd-option-${index}`}
                  data-cmd-index={index}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => {
                    router.push(entry.href);
                    close();
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm",
                    index === activeIndex && "bg-bg-inset",
                  )}
                >
                  <span className="text-fg">{entry.title}</span>
                  <span className="text-xs text-fg-subtle">{entry.group}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 border-t border-border-base bg-bg-subtle px-4 py-2 text-[0.6875rem] text-fg-subtle">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
