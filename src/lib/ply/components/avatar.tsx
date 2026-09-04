"use client";

import { useState } from "react";
import { cn } from "../internal/cn";

const SIZES = {
  xs: "size-6 text-[0.625rem]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
} as const;

export interface AvatarProps {
  src?: string;
  /** Also used for the initials fallback, so always pass a real name. */
  name: string;
  size?: keyof typeof SIZES;
  status?: "online" | "away" | "offline";
  className?: string;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Deterministic hue from the name, so a given person is always the same colour. */
function hueFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }
  return hash;
}

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-full",
          "border border-border-base font-semibold select-none",
          SIZES[size],
        )}
        style={
          showImage
            ? undefined
            : {
                backgroundColor: `oklch(92% 0.05 ${hueFor(name)})`,
                color: `oklch(38% 0.13 ${hueFor(name)})`,
              }
        }
      >
        {showImage ? (
          // A broken URL falls back to initials rather than a broken-image icon.
          // Deliberately a plain <img>: Ply must stay framework-agnostic, so
          // it can't reach for next/image. Pass pre-sized URLs.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initials(name)}</span>
        )}
        {!showImage && <span className="sr-only">{name}</span>}
      </span>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--ply-bg)]",
            size === "xs" || size === "sm" ? "size-2" : "size-2.5",
            status === "online" && "bg-success",
            status === "away" && "bg-warning",
            status === "offline" && "bg-fg-subtle",
          )}
        >
          <span className="sr-only">{status}</span>
        </span>
      )}
    </span>
  );
}
