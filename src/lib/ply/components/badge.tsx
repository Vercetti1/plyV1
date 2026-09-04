import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../internal/cn";
import { variants, type VariantProps } from "../internal/variants";

const badge = variants(
  "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border-base bg-bg-subtle text-fg-muted",
        accent: "border-transparent bg-accent-subtle text-accent",
        success: "border-transparent bg-success-subtle text-success",
        warning: "border-transparent bg-warning-subtle text-warning",
        danger: "border-transparent bg-danger-subtle text-danger",
        solid: "border-transparent bg-accent text-accent-fg",
      },
      size: {
        sm: "h-5 px-2 text-[0.6875rem]",
        md: "h-6 px-2.5 text-xs",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  /** Renders a small status dot in the badge's own colour. */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone, size, dot, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(badge({ tone, size }), className)} {...props}>
      {dot && (
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {children}
    </span>
  );
});
