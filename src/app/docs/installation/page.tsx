import { CodeBlock } from "@/components/docs/code-block";
import { PageHeader } from "@/components/docs/page-header";
import { highlight } from "@/lib/highlight";

export const metadata = {
  title: "Installation",
  description: "Copy Ply into an existing Next.js or Vite project.",
};

const STEPS = [
  {
    id: "copy",
    heading: "Copy the library",
    body: "Ply is distributed as source. Drop the folder into your project. There is no package to install and no build step.",
    lang: "bash" as const,
    code: `# From the root of your project
cp -r path/to/ply/src/lib/ply src/lib/ply`,
  },
  {
    id: "tokens",
    heading: "Add the design tokens",
    body: "Every component resolves its colours through these custom properties. Import Tailwind, declare the tokens, and map them to Tailwind theme keys so utilities like bg-surface work.",
    lang: "css" as const,
    code: `@import "tailwindcss";

/* Make \`dark:\` follow a class instead of the OS setting, so a
   theme toggle can override the system preference. */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --ply-bg: oklch(99% 0.002 285);
  --ply-surface: oklch(100% 0 0);
  --ply-border: oklch(91% 0.005 285);
  --ply-fg: oklch(21% 0.012 285);
  --ply-fg-muted: oklch(50% 0.011 285);
  --ply-accent: oklch(55% 0.215 288);
  --ply-accent-fg: oklch(100% 0 0);
  --ply-radius: 0.625rem;
  /* …see globals.css for the full set */
}

@theme inline {
  --color-bg: var(--ply-bg);
  --color-surface: var(--ply-surface);
  --color-fg: var(--ply-fg);
  --color-accent: var(--ply-accent);
  --radius-ply: var(--ply-radius);
}`,
  },
  {
    id: "provider",
    heading: "Mount the toast provider",
    body: "Only needed if you use toasts. It renders a single persistent live region. Mounting the region up front is what makes screen-reader announcements reliable.",
    lang: "tsx" as const,
    code: `import { ToastProvider } from "@/lib/ply";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}`,
  },
  {
    id: "use",
    heading: "Use a component",
    body: "Import from the barrel file. Everything is a client component; the barrel re-exports types alongside each component.",
    lang: "tsx" as const,
    code: `import { Button, Input, useToast } from "@/lib/ply";

export function SignupForm() {
  const { toast } = useToast();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        toast({ title: "Welcome aboard", tone: "success" });
      }}
      className="grid max-w-sm gap-4"
    >
      <Input label="Email" type="email" required />
      <Button type="submit" fullWidth>
        Create account
      </Button>
    </form>
  );
}`,
  },
];

export default async function InstallationPage() {
  const steps = await Promise.all(
    STEPS.map(async (step) => ({
      ...step,
      html: await highlight(step.code, step.lang),
    })),
  );

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Getting started"
        title="Installation"
        description="Ply is copy-and-own. Four steps, no package manager involved."
      />

      <div className="prose-docs">
        <p>
          Requires React 19 and Tailwind CSS v4. The components use no Node or
          Next.js APIs, so they work identically in Vite, Remix or Astro.
        </p>

        <ol className="not-prose my-8 space-y-10">
          {steps.map((step, index) => (
            <li key={step.id} className="relative pl-11">
              <span className="absolute left-0 top-0 inline-flex size-8 items-center justify-center rounded-full border border-border-base bg-surface text-sm font-semibold text-accent">
                {index + 1}
              </span>
              <h3 id={step.id} className="text-base font-semibold text-fg">
                {step.heading}
              </h3>
              <p className="mt-1.5 mb-3 text-sm leading-relaxed text-fg-muted">
                {step.body}
              </p>
              <CodeBlock html={step.html} raw={step.code} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
