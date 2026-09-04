"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `handler` on a pointer press outside every provided ref.
 *
 * Listens on `pointerdown` rather than `click` so a press that starts outside
 * and ends inside still dismisses, and captures at the document level so a
 * child's `stopPropagation` can't silently break dismissal.
 */
export function useOutsideInteraction(
  refs: Array<RefObject<HTMLElement | null>>,
  handler: () => void,
  active = true,
) {
  useEffect(() => {
    if (!active) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target || !target.isConnected) return;
      const inside = refs.some((ref) => ref.current?.contains(target));
      if (!inside) handler();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, handler, ...refs]);
}
