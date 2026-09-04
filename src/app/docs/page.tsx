import Link from "next/link";
import { Badge } from "@/lib/ply";
import { PageHeader } from "@/components/docs/page-header";
import { componentsByCategory, components } from "@/registry";

export const metadata = {
  title: "Introduction",
  description: "What Ply is, what it deliberately isn't, and how it's built.",
};

export default function DocsIndexPage() {
  const groups = componentsByCategory();

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Getting started"
        title="Introduction"
        description="Ply is a small React component library built to be read. Every component implements its WAI-ARIA pattern properly, ships as TypeScript you own, and depends on nothing but React."
      />

      <div className="prose-docs">
        <h2 id="why">Why another component library</h2>
        <p>
          Most component libraries ask you to choose between two bad options: a
          large dependency you can&apos;t change, or a pile of unstyled
          primitives you have to design from scratch. Ply is neither. It&apos;s{" "}
          <strong>{components.length} components</strong> of plain TypeScript
          you copy into your project and edit like your own code.
        </p>

        <h2 id="principles">Principles</h2>
        <ul>
          <li>
            <strong>Accessibility isn&apos;t a feature flag.</strong> The
            keyboard and ARIA contract is part of each component, documented on
            its page, and explained, not just asserted.
          </li>
          <li>
            <strong>No runtime dependencies.</strong> The class joiner, the
            variant engine, the focus trap and the icons are all in the
            library. Nothing to audit, nothing to bump.
          </li>
          <li>
            <strong>Controlled or uncontrolled, one API.</strong> Every stateful
            component routes through a single{" "}
            <code>useControllableState</code> hook, so <code>value</code> and{" "}
            <code>defaultValue</code> behave predictably everywhere.
          </li>
          <li>
            <strong>Tokens, not hard-coded colours.</strong> Every colour,
            radius and shadow resolves to a CSS custom property, so one block
            re-skins the set in both themes.
          </li>
          <li>
            <strong>The docs can&apos;t go stale.</strong> Each example&apos;s
            source is read off disk at render time: the code you see is
            literally the file that produced the preview above it.
          </li>
        </ul>

        <h2 id="components">Components</h2>
        <div className="not-prose my-6 space-y-6">
          {groups.map((group) => (
            <div key={group.category}>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {group.category}
              </h3>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {group.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/docs/components/${item.slug}`}
                    className="group rounded-[var(--ply-radius)] border border-border-base bg-surface p-3.5 transition-colors hover:border-border-strong"
                  >
                    <span className="text-sm font-medium text-fg group-hover:text-accent">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-fg-muted">
                      {item.summary}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 id="scope">What Ply is not</h2>
        <p>
          It has no data table, no date picker and no virtualised list. Those
          are genuinely large problems, and a half-built version of each is
          worse than none. What&apos;s here is finished.
        </p>

        <p className="not-prose mt-8 flex flex-wrap items-center gap-2">
          <Badge tone="success" dot>
            No dependencies
          </Badge>
          <Badge tone="accent">TypeScript strict</Badge>
          <Badge>Tailwind CSS v4</Badge>
          <Badge>React 19</Badge>
        </p>
      </div>
    </div>
  );
}
