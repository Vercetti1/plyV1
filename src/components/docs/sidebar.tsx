"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/ply";
import { componentsByCategory } from "@/registry";

const GUIDES = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/accessibility", label: "Accessibility" },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const groups = componentsByCategory();

  return (
    <nav aria-label="Documentation" className="text-sm">
      <Section title="Getting started">
        {GUIDES.map((guide) => (
          <NavLink
            key={guide.href}
            href={guide.href}
            active={pathname === guide.href}
            onNavigate={onNavigate}
          >
            {guide.label}
          </NavLink>
        ))}
      </Section>

      {groups.map((group) => (
        <Section key={group.category} title={group.category}>
          {group.items.map((item) => (
            <NavLink
              key={item.slug}
              href={`/docs/components/${item.slug}`}
              active={pathname === `/docs/components/${item.slug}`}
              onNavigate={onNavigate}
            >
              {item.name}
            </NavLink>
          ))}
        </Section>
      ))}
    </nav>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-fg-subtle">
        {title}
      </h3>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
  onNavigate,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        // `aria-current` is what tells a screen reader which page you're on;
        // the highlight alone only communicates to sighted users.
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative block rounded-md px-3 py-1.5 transition-colors",
          "outline-none focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)]",
          active
            ? "bg-accent-subtle font-medium text-accent"
            : "text-fg-muted hover:bg-bg-inset hover:text-fg",
        )}
      >
        {children}
      </Link>
    </li>
  );
}
