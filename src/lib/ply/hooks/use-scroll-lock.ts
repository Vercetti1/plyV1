"use client";

import { useEffect } from "react";

let lockCount = 0;
let restore = "";

/**
 * Locks body scroll while `active`, compensating for the scrollbar width so
 * the page doesn't shift. Reference-counted, so nested overlays (a popover
 * inside a dialog) don't unlock each other prematurely.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      restore = document.body.style.cssText;
      document.body.style.overflow = "hidden";
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) document.body.style.cssText = restore;
    };
  }, [active]);
}
