import { Badge } from "@/lib/ply";
import type { PropDef } from "@/registry";

/**
 * Renders as a real <table> on wide screens and as stacked cards below `sm`, because
 * a props table squeezed into a phone-width horizontal scroller is unreadable.
 */
export function PropsTable({ props: rows }: { props: PropDef[] }) {
  return (
    <div className="not-prose my-6">
      {/* Mobile: one card per prop. */}
      <ul className="space-y-3 sm:hidden">
        {rows.map((row) => (
          <li
            key={row.name}
            className="rounded-[var(--ply-radius)] border border-border-base bg-surface p-3.5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-mono text-sm font-medium text-fg">{row.name}</code>
              {row.required && (
                <Badge tone="danger" size="sm">
                  required
                </Badge>
              )}
            </div>
            <code className="mt-1.5 block font-mono text-xs break-words text-accent">
              {row.type}
            </code>
            {row.default && (
              <p className="mt-1 font-mono text-xs text-fg-subtle">
                default: {row.default}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {row.description}
            </p>
          </li>
        ))}
      </ul>

      {/* Desktop: a proper table with a header row. */}
      <div className="hidden overflow-hidden rounded-[var(--ply-radius)] border border-border-base sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-bg-subtle">
              <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-fg-muted">
                Prop
              </th>
              <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-fg-muted">
                Type
              </th>
              <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-fg-muted">
                Default
              </th>
              <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-fg-muted">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ply-border)]">
            {rows.map((row) => (
              <tr key={row.name} className="align-top bg-surface">
                <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-normal">
                  <code className="font-mono text-[0.8125rem] font-medium text-fg">
                    {row.name}
                  </code>
                  {row.required && (
                    <span className="ml-1 text-danger" title="Required">
                      *
                    </span>
                  )}
                </th>
                <td className="max-w-64 px-4 py-3">
                  <code className="font-mono text-xs break-words text-accent">
                    {row.type}
                  </code>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {row.default ? (
                    <code className="font-mono text-xs text-fg-subtle">{row.default}</code>
                  ) : (
                    // A required prop has no default to fall back on, which is
                    // a different statement from "defaults to nothing".
                    <span className="text-fg-subtle">
                      {row.required ? "n/a" : "none"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 leading-relaxed text-fg-muted">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
