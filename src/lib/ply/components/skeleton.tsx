import { cn } from "../internal/cn";

export interface SkeletonProps {
  className?: string;
  /** Number of stacked lines; the last one is shortened for a natural look. */
  lines?: number;
  circle?: boolean;
}

export function Skeleton({ className, lines = 1, circle }: SkeletonProps) {
  const base = cn(
    "relative overflow-hidden bg-bg-inset",
    circle ? "rounded-full" : "rounded-md",
    // A sweeping highlight reads as "loading" more clearly than a pulse and
    // costs one composited transform.
    "after:absolute after:inset-0 after:-translate-x-full",
    "after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent",
    "after:animate-[ply-shimmer_1.6s_infinite]",
  );

  if (lines === 1) {
    return (
      <div aria-hidden="true" className={cn(base, !className && "h-4 w-full", className)} />
    );
  }

  return (
    <div role="status" aria-label="Loading" className="w-full space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(base, "h-4", index === lines - 1 ? "w-3/5" : "w-full", className)}
        />
      ))}
    </div>
  );
}
