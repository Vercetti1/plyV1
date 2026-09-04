"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Badge, Button, cn } from "@/lib/ply";
import { focusOnPointerDown, useFocusTrap } from "@/lib/ply/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/ply/hooks/use-scroll-lock";
import { MenuIcon, XIcon } from "@/lib/ply/components/icons";
import { CommandPalette } from "./command-palette";
import { SidebarNav } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, menuOpen);
  useScrollLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border-base bg-[var(--ply-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-4 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 lg:hidden"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onPointerDown={focusOnPointerDown}
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon className="size-5" />
        </Button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)]"
        >
          <Logo />
          <span className="text-[0.9375rem] font-semibold tracking-tight text-fg">Ply</span>
          <Badge tone="accent" size="sm" className="hidden sm:inline-flex">
            v0.1
          </Badge>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {[
            { href: "/docs", label: "Docs" },
            { href: "/docs/components/button", label: "Components" },
            { href: "/docs/theming", label: "Theming" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                "outline-none focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)]",
                pathname.startsWith(item.href)
                  ? "text-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CommandPalette />
          <ThemeToggle />
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden">
          <div
            className="ply-animate-fade fixed inset-0 z-40 bg-black/45"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-border-base bg-surface p-4 shadow-ply-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-fg">Navigation</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Close navigation"
                onClick={() => setMenuOpen(false)}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6 text-accent", className)}
      aria-hidden="true"
    >
      <path
        d="M12 2.5 21 7.25 12 12 3 7.25 12 2.5Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path d="M3 12.25 12 17l9-4.75" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M3 16.75 12 21.5l9-4.75" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    </svg>
  );
}
