"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/ply";
import { CheckIcon, CopyIcon } from "@/lib/ply/components/icons";

export interface CodeBlockProps {
  /** Pre-highlighted markup from `highlight()` on the server. */
  html: string;
  /** Plain source, used for the clipboard. */
  raw: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ html, raw, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied (insecure context, permissions);
      // the code is still selectable, so fail quietly.
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[var(--ply-radius)] border border-border-base bg-bg-inset",
        className,
      )}
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-border-base px-4 py-2">
          <span className="font-mono text-xs text-fg-muted">{filename}</span>
        </div>
      )}

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn(
          "absolute right-2.5 z-10 inline-flex size-8 items-center justify-center rounded-md",
          "border border-border-base bg-surface text-fg-muted shadow-ply-sm",
          "transition-[opacity,color] hover:text-fg",
          // Visible on hover for mouse users, and always visible once focused.
          "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          filename ? "top-11" : "top-2.5",
        )}
      >
        {copied ? (
          <CheckIcon className="size-4 text-success" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </button>

      {/*
        `html` is produced by Shiki on the server from files in this repo,
        never from user input, so there is no untrusted markup to sanitise.
      */}
      <div
        className="ply-code overflow-x-auto text-[0.8125rem] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <span aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </div>
  );
}
