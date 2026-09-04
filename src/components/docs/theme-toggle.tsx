"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Button } from "@/lib/ply";
import { MoonIcon, SunIcon } from "@/lib/ply/components/icons";

type Theme = "light" | "dark";

/** Must match the key read by the blocking script in the root layout. */
export const THEME_KEY = "ply-theme";

/**
 * Watches the `dark` class on <html> instead of keeping a parallel copy of
 * the theme in state. The blocking script in <head> sets that class before
 * first paint, so this is the only source of truth that is never wrong,
 * and the observer keeps the button correct even if something else flips it.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function useTheme(): Theme | null {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light"),
    // No theme is known during server render, so the label stays generic
    // until hydration rather than asserting the wrong one.
    () => null,
  );
}

export function ThemeToggle() {
  const theme = useTheme();

  const toggle = useCallback(() => {
    const next: Theme =
      document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works
      // for this page view.
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="size-9"
      aria-label={
        theme === null
          ? "Toggle theme"
          : `Switch to ${theme === "dark" ? "light" : "dark"} theme`
      }
    >
      {/* Render both and swap with CSS so there's no icon flash before hydration. */}
      <SunIcon className="size-4 dark:hidden" />
      <MoonIcon className="hidden size-4 dark:block" />
    </Button>
  );
}
