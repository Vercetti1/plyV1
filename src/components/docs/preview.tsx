"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/ply";
import { CodeIcon, LayersIcon } from "@/lib/ply/components/icons";
import { CodeBlock } from "./code-block";

export interface PreviewProps {
  children: ReactNode;
  html: string;
  raw: string;
  filename: string;
  title?: string;
  description?: string;
}

/**
 * The docs' core unit: a live component next to the exact source that
 * rendered it. The demo stays mounted when the code tab is shown, so any
 * state the user set up survives a peek at the source.
 */
export function Preview({
  children,
  html,
  raw,
  filename,
  title,
  description,
}: PreviewProps) {
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <section className="not-prose my-8 first:mt-0">
      {(title || description) && (
        <div className="mb-3">
          {title && <h4 className="text-sm font-semibold text-fg">{title}</h4>}
          {description && (
            <p className="mt-1 text-sm text-fg-muted">{description}</p>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border-base bg-surface">
        <div className="flex items-center gap-1 border-b border-border-base bg-bg-subtle px-2 py-1.5">
          {(["preview", "code"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setView(tab)}
              aria-pressed={view === tab}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium capitalize",
                "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)]",
                view === tab
                  ? "bg-surface text-fg shadow-ply-sm"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {tab === "preview" ? (
                <LayersIcon className="size-3.5" />
              ) : (
                <CodeIcon className="size-3.5" />
              )}
              {tab}
            </button>
          ))}
          <span className="ml-auto pr-1 font-mono text-[0.6875rem] text-fg-subtle">
            {filename}
          </span>
        </div>

        {/* Both panes stay mounted; `hidden` preserves the demo's state. */}
        <div hidden={view !== "preview"}>
          <div className="flex min-h-40 flex-wrap items-center gap-4 p-6 sm:p-8">
            {children}
          </div>
        </div>

        <div hidden={view !== "code"}>
          <CodeBlock html={html} raw={raw} className="rounded-none border-0" />
        </div>
      </div>
    </section>
  );
}
