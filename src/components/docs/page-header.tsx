import { Badge } from "@/lib/ply";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && (
        <Badge tone="accent" size="sm" className="mb-3">
          {eyebrow}
        </Badge>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-fg-muted">{description}</p>
    </div>
  );
}
