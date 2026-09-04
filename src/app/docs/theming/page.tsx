import { CodeBlock } from "@/components/docs/code-block";
import { PageHeader } from "@/components/docs/page-header";
import { highlight } from "@/lib/highlight";
import { readLibrarySource } from "@/lib/source";

export const metadata = {
  title: "Theming",
  description: "Re-skin every Ply component by overriding one block of CSS custom properties.",
};

const TOKENS: { group: string; note: string; tokens: { name: string; role: string }[] }[] = [
  {
    group: "Surfaces",
    note: "Four layers, back to front. Keeping them distinct is what lets a popover read as raised above a card on the same page.",
    tokens: [
      { name: "--ply-bg", role: "Page background" },
      { name: "--ply-bg-subtle", role: "Section and header fills" },
      { name: "--ply-bg-inset", role: "Recessed: code blocks, tab strips, disabled fields" },
      { name: "--ply-surface", role: "Raised: cards, popovers, dialog panels" },
    ],
  },
  {
    group: "Text",
    note: "Three weights only. More than three and the hierarchy stops being legible as a hierarchy.",
    tokens: [
      { name: "--ply-fg", role: "Primary text" },
      { name: "--ply-fg-muted", role: "Secondary text, descriptions" },
      { name: "--ply-fg-subtle", role: "Placeholders, meta, disabled" },
    ],
  },
  {
    group: "Borders",
    note: "The strong variant is for hover and focus, so a border can respond without shifting layout.",
    tokens: [
      { name: "--ply-border", role: "Default hairline" },
      { name: "--ply-border-strong", role: "Hover and emphasis" },
    ],
  },
  {
    group: "Accent & status",
    note: "Each status colour has a solid and a subtle form: the subtle one backs badges and banners, the solid one carries text and icons on it.",
    tokens: [
      { name: "--ply-accent", role: "Primary actions, focus rings, links" },
      { name: "--ply-accent-fg", role: "Text on the accent fill" },
      { name: "--ply-accent-subtle", role: "Tinted accent background" },
      { name: "--ply-success / -subtle", role: "Positive state" },
      { name: "--ply-warning / -subtle", role: "Caution state" },
      { name: "--ply-danger / -subtle", role: "Destructive and error state" },
    ],
  },
];

const BRAND_EXAMPLE = `/* A brand override. Only the tokens change; no component is touched. */
:root {
  --ply-accent: oklch(58% 0.17 162);       /* jade */
  --ply-accent-hover: oklch(52% 0.17 162);
  --ply-accent-subtle: oklch(96% 0.03 162);
  --ply-accent-ring: oklch(58% 0.17 162 / 0.4);
  --ply-radius: 0.25rem;                    /* sharper corners */
}

.dark {
  --ply-accent: oklch(72% 0.15 162);
  --ply-accent-fg: oklch(16% 0.02 162);
  --ply-accent-subtle: oklch(26% 0.06 162);
}`;

const NO_FLASH = `// Blocking script in <head>. An effect would paint one frame of the
// wrong theme first, which reads as a white flash on every load.
const THEME_SCRIPT = \`
try {
  var stored = localStorage.getItem("ply-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
\`;

<head>
  <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
</head>`;

export default async function ThemingPage() {
  const variantsSource = await readLibrarySource("internal/variants.ts");
  const [brandHtml, flashHtml, variantsHtml] = await Promise.all([
    highlight(BRAND_EXAMPLE, "css"),
    highlight(NO_FLASH, "tsx"),
    highlight(variantsSource, "typescript"),
  ]);

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Guides"
        title="Theming"
        description="No component in Ply contains a literal colour. Every one resolves through a CSS custom property, so a theme is a block of variables rather than a fork of the library."
      />

      <div className="prose-docs">
        <h2 id="why-oklch">Why oklch</h2>
        <p>
          The palette is defined in <code>oklch()</code> rather than hex.
          Because the space is perceptually uniform, holding lightness constant
          and rotating the hue gives you colours of genuinely matching weight,
          which is what makes the six badge tones sit together instead of one
          of them shouting. It also makes a dark theme a lightness edit rather
          than a redesign.
        </p>

        <h2 id="tokens">The token set</h2>
        {TOKENS.map((group) => (
          <div key={group.group} className="not-prose my-7">
            <h3 className="text-sm font-semibold text-fg">{group.group}</h3>
            <p className="mt-1 mb-3 text-sm leading-relaxed text-fg-muted">
              {group.note}
            </p>
            <dl className="divide-y divide-[var(--ply-border)] overflow-hidden rounded-[var(--ply-radius)] border border-border-base bg-surface">
              {group.tokens.map((token) => (
                <div
                  key={token.name}
                  className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4"
                >
                  <dt className="shrink-0 font-mono text-xs text-accent sm:w-56">
                    {token.name}
                  </dt>
                  <dd className="text-sm text-fg-muted">{token.role}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <h2 id="rebrand">Rebranding</h2>
        <p>
          Override the tokens you care about and leave the rest. Everything
          downstream (focus rings, badge tints, the accent on a selected tab)
          follows automatically.
        </p>
        <div className="not-prose my-5">
          <CodeBlock html={brandHtml} raw={BRAND_EXAMPLE} filename="globals.css" />
        </div>

        <h2 id="dark-mode">Dark mode without a flash</h2>
        <p>
          The <code>dark:</code> variant is remapped to a class rather than the
          OS media query, so an explicit choice can override the system
          preference. That choice then has to be applied{" "}
          <strong>before first paint</strong>:
        </p>
        <div className="not-prose my-5">
          <CodeBlock html={flashHtml} raw={NO_FLASH} filename="app/layout.tsx" />
        </div>
        <p>
          The toggle reads the class the script already set rather than keeping
          its own guess, which is what keeps its icon correct on first render.
        </p>

        <h2 id="variants">The variant engine</h2>
        <p>
          Component-level styling goes through a small typed resolver. The point
          of hand-rolling it is the type surface:{" "}
          <code>VariantProps&lt;typeof button&gt;</code> derives the
          component&apos;s prop types straight from its style config, so adding
          a variant key is a compile error everywhere it isn&apos;t handled.
        </p>
        <div className="not-prose my-5">
          <CodeBlock
            html={variantsHtml}
            raw={variantsSource}
            filename="lib/ply/internal/variants.ts"
          />
        </div>
      </div>
    </div>
  );
}
