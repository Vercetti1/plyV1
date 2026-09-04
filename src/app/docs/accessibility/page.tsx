import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { PageHeader } from "@/components/docs/page-header";
import { highlight } from "@/lib/highlight";
import { readLibrarySource } from "@/lib/source";
import { components } from "@/registry";

export const metadata = {
  title: "Accessibility",
  description: "The keyboard and ARIA contract every Ply component holds to, and the reasoning behind it.",
};

const PRACTICES = [
  {
    title: "Native elements first",
    body: "The switch is a <button role=\"switch\">, not a styled div. Accordion headers sit inside <h3> so screen readers get a real document outline. Reimplementing a native element means reimplementing everything it gave you for free, so Ply only does it where styling genuinely demands it, as with Select.",
  },
  {
    title: "Focus is always visible and always somewhere sensible",
    body: "Every interactive component shares one focus treatment driven by :focus-visible, so it shows for keyboards and not for mouse clicks. Dialogs move focus in on open and restore it to the trigger on close, never leaving it stranded on <body>.",
  },
  {
    title: "One tab stop per widget",
    body: "Tabs and Select use a roving tabindex and aria-activedescendant. A ten-tab strip is one stop, not ten, and arrow keys move within it. This is the difference between a keyboard user skimming a page and tabbing thirty times to get past your nav.",
  },
  {
    title: "State is announced, not just shown",
    body: "aria-invalid with aria-describedby on a field error, aria-busy on a loading button, aria-current on the active nav link, aria-expanded on every disclosure. If a state is conveyed by colour or position, it is also conveyed in the accessibility tree.",
  },
  {
    title: "Live regions exist before their content",
    body: "The toast region is mounted once, up front. Injecting a live region at the same moment as its first message is the single most common reason toast announcements silently fail.",
  },
  {
    title: "Motion is a preference",
    body: "Every transition and animation collapses under prefers-reduced-motion: reduce. The shimmer stops, the accordion snaps, the dialog appears without a zoom.",
  },
  {
    title: "Colour is never the only signal",
    body: "Status badges pair their tint with a word. The select's chosen option gets a checkmark, not just a highlight. Presence dots carry an sr-only label.",
  },
];

export default async function AccessibilityPage() {
  const trapSource = await readLibrarySource("hooks/use-focus-trap.ts");
  const trapHtml = await highlight(trapSource, "typescript");

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Guides"
        title="Accessibility"
        description="Accessibility in Ply is a contract, not a checklist item. Each component page states exactly what it guarantees; this page covers the rules that apply to all of them."
      />

      <div className="prose-docs">
        <h2 id="practices">The rules</h2>
        <div className="not-prose my-6 space-y-5">
          {PRACTICES.map((practice, index) => (
            <div
              key={practice.title}
              className="rounded-[var(--ply-radius)] border border-border-base bg-surface p-4"
            >
              <h3 className="flex items-baseline gap-2.5 text-sm font-semibold text-fg">
                <span className="font-mono text-xs text-fg-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {practice.title}
              </h3>
              <p className="mt-1.5 pl-8 text-sm leading-relaxed text-fg-muted">
                {practice.body}
              </p>
            </div>
          ))}
        </div>

        <h2 id="focus-trap">Worked example: the focus trap</h2>
        <p>
          A modal that doesn&apos;t trap focus isn&apos;t a modal: keyboard and
          screen-reader users tab straight out into the page behind the
          overlay, with no visual indication of where they went. This hook is
          the whole implementation, including restoring focus to the element
          that opened the dialog.
        </p>
        <div className="not-prose my-5">
          <CodeBlock
            html={trapHtml}
            raw={trapSource}
            filename="lib/ply/hooks/use-focus-trap.ts"
          />
        </div>

        <h2 id="testing">How to verify it yourself</h2>
        <ul>
          <li>
            <strong>Unplug the mouse.</strong> Every example in these docs is
            reachable and operable with the keyboard alone. Tab to the first
            stop and try it.
          </li>
          <li>
            <strong>Open a dialog and hold Tab.</strong> Focus should cycle
            inside the panel forever, then land back on the trigger when you
            press Escape.
          </li>
          <li>
            <strong>Focus a tab strip and press an arrow key.</strong> Focus
            should move between tabs, and Tab should leave the strip entirely.
          </li>
          <li>
            <strong>Turn on reduced motion.</strong> In macOS System Settings →
            Accessibility → Display, every animation here should stop.
          </li>
          <li>
            <strong>Turn on VoiceOver</strong> (⌘F5) and enter a field with an
            error, the message should be read without you going looking for it.
          </li>
        </ul>

        <h2 id="per-component">Per-component contracts</h2>
        <p>
          Each component documents its own keyboard map and ARIA wiring:
        </p>
        <div className="not-prose my-6 grid gap-2 sm:grid-cols-2">
          {components.map((component) => (
            <Link
              key={component.slug}
              href={`/docs/components/${component.slug}#accessibility`}
              className="flex items-center justify-between rounded-[var(--ply-radius)] border border-border-base bg-surface px-3.5 py-2.5 text-sm transition-colors hover:border-border-strong"
            >
              <span className="font-medium text-fg">{component.name}</span>
              <span className="text-xs text-fg-subtle">
                {component.accessibility.length} guarantees
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
