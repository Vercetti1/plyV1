"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el.getClientRects().length > 0,
  );
}

/**
 * Safari (and iOS) does not focus a `<button>` when it is clicked, so a
 * trigger can open an overlay without ever having been the active element,
 * and then there is nothing for `useFocusTrap` to hand focus back to on
 * close. Call this from `onPointerDown` on a trigger to focus it explicitly.
 */
export function focusOnPointerDown(event: { target: EventTarget | null }) {
  const el = (event.target as HTMLElement | null)?.closest<HTMLElement>(
    "button, a[href], [tabindex]:not([tabindex='-1'])",
  );
  el?.focus({ preventScroll: true });
}

/**
 * Traps Tab/Shift+Tab inside `ref` while `active`, moves focus in on open,
 * and restores it to the previously focused element on close.
 *
 * This is the difference between a div that looks like a modal and a modal:
 * without it, keyboard and screen-reader users tab straight out into the
 * page behind the overlay.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    // Remember where focus came from so it can be handed back on close.
    // `document.body` doesn't count: restoring to it is the same as losing
    // focus, and it means the trigger was never focused in the first place
    // (see `focusOnPointerDown`).
    const previous = document.activeElement as HTMLElement | null;
    const restoreTo =
      previous && previous !== document.body ? previous : null;

    // Prefer an explicit autofocus target, then the first tabbable node,
    // then the container itself so focus is never left on <body>.
    const initial =
      container.querySelector<HTMLElement>("[data-ply-autofocus]") ??
      getFocusable(container)[0] ??
      container;
    initial.focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const focusable = getFocusable(container!);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement;

      if (event.shiftKey && (activeEl === first || activeEl === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // The trigger can be gone by now (a menu that unmounted with the
      // overlay), so check it's still in the document before focusing it.
      if (restoreTo?.isConnected) restoreTo.focus({ preventScroll: true });
    };
  }, [ref, active]);
}
