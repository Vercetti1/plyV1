import Link from "next/link";
import { Badge, Button } from "@/lib/ply";
import { ChevronRightIcon } from "@/lib/ply/components/icons";
import { LandingShowcase } from "@/components/docs/landing-showcase";
import { Logo, SiteHeader } from "@/components/docs/site-header";
import { components } from "@/registry";

const FEATURES = [
  {
    title: "Zero runtime dependencies",
    body: "The class joiner, the typed variant engine, the focus trap and the icon set are all part of the library. Nothing to audit, nothing to bump, no transitive tree.",
  },
  {
    title: "WAI-ARIA patterns, implemented",
    body: "Roving tabindex on tabs. aria-activedescendant on the select, with typeahead. Focus trapping, scroll locking and focus restoration in dialogs. Each page documents exactly what it guarantees.",
  },
  {
    title: "Controlled or uncontrolled, one API",
    body: "Every stateful component routes through a single useControllableState hook, so value and defaultValue behave the same way everywhere, including with updater functions.",
  },
  {
    title: "Themed with CSS custom properties",
    body: "No component contains a literal colour. An oklch token set drives both themes, so a rebrand is a block of variables rather than a fork.",
  },
  {
    title: "Docs that cannot go stale",
    body: "Each example's source is read off disk in a server component and highlighted with Shiki at render time. The code you read is the file that produced the preview above it.",
  },
  {
    title: "Copy-and-own, not a dependency",
    body: "Every component page ships its full source with a copy button. Paste it in and edit it like your own code, because it is.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border-base">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [background-image:radial-gradient(var(--ply-border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
          />
          <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <Badge tone="accent" className="mb-5">
                {components.length} components · v0.1
              </Badge>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-6xl">
                React components
                <br />
                built to be{" "}
                <span className="text-accent">read</span>.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
                Ply is a small, accessible component library in TypeScript and
                Tailwind CSS. No runtime dependencies, every WAI-ARIA pattern
                implemented properly, and source you copy into your project
                rather than install.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/docs">
                  <Button size="lg" trailingIcon={<ChevronRightIcon />}>
                    Read the docs
                  </Button>
                </Link>
                <Link href="/docs/components/dialog">
                  <Button size="lg" variant="secondary">
                    Browse components
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-xs text-fg-subtle">
                Press{" "}
                <kbd className="rounded border border-border-base bg-bg-inset px-1.5 py-0.5 font-mono">
                  ⌘K
                </kbd>{" "}
                anywhere to search.
              </p>
            </div>

            <div className="lg:pl-4">
              <LandingShowcase />
              <p className="mt-3 text-center text-xs text-fg-subtle">
                Everything above is live. Try it with the keyboard only.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Built the way you&apos;d want to inherit it
            </h2>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">
              Six decisions that shaped the library, each of which you can go
              read the code for.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border-base bg-[var(--ply-border)] sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-surface p-6">
                <h3 className="text-[0.9375rem] font-semibold text-fg">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Component index */}
        <section className="border-t border-border-base bg-bg-subtle">
          <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">
              The full set
            </h2>
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {components.map((component) => (
                <Link
                  key={component.slug}
                  href={`/docs/components/${component.slug}`}
                  className="group rounded-[var(--ply-radius)] border border-border-base bg-surface p-4 transition-colors hover:border-border-strong"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-fg group-hover:text-accent">
                      {component.name}
                    </span>
                    <Badge size="sm">{component.category}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                    {component.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-base">
        <div className="mx-auto flex max-w-[90rem] flex-col items-start gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <Logo className="size-5" />
            <span className="text-sm font-semibold text-fg">Ply</span>
          </div>
          <p className="text-xs text-fg-muted sm:ml-4">
            A component library and docs site built with Next.js, TypeScript and
            Tailwind CSS v4.
          </p>
          <nav aria-label="Footer" className="flex gap-4 text-xs sm:ml-auto">
            <Link href="/docs" className="text-fg-muted hover:text-fg">
              Docs
            </Link>
            <Link href="/docs/accessibility" className="text-fg-muted hover:text-fg">
              Accessibility
            </Link>
            <Link href="/docs/theming" className="text-fg-muted hover:text-fg">
              Theming
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
