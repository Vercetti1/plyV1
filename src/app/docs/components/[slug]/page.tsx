import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/lib/ply";
import { ChevronRightIcon } from "@/lib/ply/components/icons";
import { CodeBlock } from "@/components/docs/code-block";
import { Preview } from "@/components/docs/preview";
import { PropsTable } from "@/components/docs/props-table";
import { highlight } from "@/lib/highlight";
import { readDemoSource, readLibrarySource } from "@/lib/source";
import { components, getComponent } from "@/registry";
import { demoComponents } from "@/registry/demo-map";

// Every component page is known at build time, so prerender the lot.
export function generateStaticParams() {
  return components.map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};
  return { title: component.name, description: component.summary };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) notFound();

  // Read and highlight every demo and source file for this page in parallel,
  // rather than serially awaiting each one.
  const [demos, sources] = await Promise.all([
    Promise.all(
      component.demos.map(async (demo) => {
        const raw = await readDemoSource(demo.id);
        return { ...demo, raw, html: await highlight(raw, "tsx") };
      }),
    ),
    Promise.all(
      component.sources.map(async (file) => {
        const raw = await readLibrarySource(file);
        return { file, raw, html: await highlight(raw, "tsx") };
      }),
    ),
  ]);

  const index = components.findIndex((c) => c.slug === slug);
  const previous = components[index - 1];
  const next = components[index + 1];

  return (
    <div className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-fg-subtle">
        <Link href="/docs" className="hover:text-fg-muted">
          Docs
        </Link>
        <ChevronRightIcon className="size-3" />
        <span>{component.category}</span>
        <ChevronRightIcon className="size-3" />
        <span className="text-fg-muted">{component.name}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">
          {component.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">
          {component.summary}
        </p>
      </header>

      <div className="prose-docs">
        <h2 id="examples">Examples</h2>
        {demos.map((demo) => {
          const Demo = demoComponents[demo.id];
          return (
            <Preview
              key={demo.id}
              html={demo.html}
              raw={demo.raw}
              filename={`${demo.id}.tsx`}
              title={demo.title}
              description={demo.description}
            >
              {Demo ? <Demo /> : null}
            </Preview>
          );
        })}

        {component.anatomy && (
          <>
            <h2 id="anatomy">Anatomy</h2>
            <p>
              {component.name} is a set of composable parts rather than one
              prop-heavy component, so you control the markup between them.
            </p>
            <dl className="not-prose my-6 divide-y divide-[var(--ply-border)] overflow-hidden rounded-[var(--ply-radius)] border border-border-base bg-surface">
              {component.anatomy.map((part) => (
                <div key={part.name} className="px-4 py-3">
                  <dt className="font-mono text-[0.8125rem] font-medium text-fg">
                    {`<${part.name}>`}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-fg-muted">
                    {part.description}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <h2 id="props">Props</h2>
        <PropsTable props={component.props} />

        <h2 id="accessibility">Accessibility</h2>
        <p>
          What this component guarantees, and why each item is there.
        </p>
        <ul className="not-prose my-6 space-y-2.5">
          {component.accessibility.map((note) => (
            <li key={note} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
              />
              <span>{note}</span>
            </li>
          ))}
        </ul>

        <h2 id="source">Source</h2>
        <p>
          Read it, or paste it straight into your project. Ply is
          copy-and-own, not a dependency.
        </p>
        {sources.map((source) => (
          <div key={source.file} className="not-prose my-5">
            <CodeBlock
              html={source.html}
              raw={source.raw}
              filename={`lib/ply/${source.file}`}
            />
          </div>
        ))}
      </div>

      <nav
        aria-label="Pagination"
        className="mt-16 flex items-stretch justify-between gap-4 border-t border-border-base pt-6"
      >
        {previous ? (
          <Link
            href={`/docs/components/${previous.slug}`}
            className="group flex-1 rounded-[var(--ply-radius)] border border-border-base bg-surface p-4 transition-colors hover:border-border-strong"
          >
            <span className="text-xs text-fg-subtle">Previous</span>
            <span className="mt-0.5 block text-sm font-medium text-fg">
              {previous.name}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/docs/components/${next.slug}`}
            className="group flex-1 rounded-[var(--ply-radius)] border border-border-base bg-surface p-4 text-right transition-colors hover:border-border-strong"
          >
            <span className="text-xs text-fg-subtle">Next</span>
            <span className="mt-0.5 block text-sm font-medium text-fg">
              {next.name}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>

      <p className="mt-8 flex items-center gap-2 text-xs text-fg-subtle">
        <Badge size="sm">{component.category}</Badge>
        Zero runtime dependencies.
      </p>
    </div>
  );
}
