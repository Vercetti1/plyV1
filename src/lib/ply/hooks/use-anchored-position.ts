"use client";

import { useCallback, useEffect, useState, type CSSProperties, type RefObject } from "react";

export interface AnchoredPosition {
  style: CSSProperties;
  /** Which side the popup actually landed on, after flipping. */
  placement: "bottom" | "top";
}

interface Options {
  /** Gap between the anchor and the popup, in px. */
  gap?: number;
  /** Preferred maximum height; shrinks when the viewport is tighter. */
  maxHeight?: number;
}

const COLLAPSED: AnchoredPosition = {
  style: { position: "fixed", top: 0, left: 0, visibility: "hidden" },
  placement: "bottom",
};

/**
 * Positions a portalled popup against an anchor element.
 *
 * A popup rendered inside its trigger's DOM subtree gets clipped by any
 * ancestor with `overflow: hidden`: a card, a modal body, a tab panel. The
 * fix is to portal it to <body> and position it manually, which is what this
 * hook computes: viewport coordinates matched to the anchor's width, flipped
 * above when there isn't room below, and height-clamped to what's available.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  { gap = 6, maxHeight = 240 }: Options = {},
): AnchoredPosition {
  const [position, setPosition] = useState<AnchoredPosition>(COLLAPSED);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - gap;
    const above = rect.top - gap;

    // Only flip when going up genuinely gives more room; otherwise a popup
    // near the middle of the screen would jitter between sides.
    const flip = below < Math.min(maxHeight, 160) && above > below;
    const available = Math.max(120, Math.floor(flip ? above : below));

    setPosition({
      placement: flip ? "top" : "bottom",
      style: {
        position: "fixed",
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        maxHeight: Math.min(maxHeight, available),
        ...(flip
          ? { bottom: Math.round(window.innerHeight - rect.top + gap) }
          : { top: Math.round(rect.bottom + gap) }),
      },
    });
  }, [anchorRef, gap, maxHeight]);

  useEffect(() => {
    if (!open) return;

    measure();

    // `true` captures scrolls on any ancestor, not just the window, since a popup
    // inside a scrollable panel has to track it too.
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);

    // The anchor can move without any scroll or resize (a sibling collapsing,
    // a font finishing loading), so observe it directly where supported.
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    if (anchorRef.current) observer?.observe(anchorRef.current);

    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [open, measure, anchorRef]);

  // While closed, and for the one frame between opening and the first
  // measurement, report the hidden placeholder. The popup therefore appears
  // already in the right place, rather than flashing at a stale position.
  return open ? position : COLLAPSED;
}
