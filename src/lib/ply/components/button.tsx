"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../internal/cn";
import { focusRing, variants, type VariantProps } from "../internal/variants";
import { SpinnerIcon } from "./icons";

const button = variants(
  cn(
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--ply-radius)] font-medium",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    focusRing,
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg shadow-ply-sm hover:bg-accent-hover",
        secondary:
          "border border-border-base bg-surface text-fg shadow-ply-sm hover:bg-bg-subtle hover:border-border-strong",
        ghost: "text-fg-muted hover:bg-bg-inset hover:text-fg",
        danger: "bg-danger text-white shadow-ply-sm hover:bg-danger-hover",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[0.8125rem]",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10 p-0",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    compoundVariants: [
      // The link variant is text, not a control: strip the box affordances.
      { variant: "link", size: "sm", className: "h-auto px-0" },
      { variant: "link", size: "md", className: "h-auto px-0" },
      { variant: "link", size: "lg", className: "h-auto px-0" },
    ],
    defaultVariants: { variant: "primary", size: "md", fullWidth: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  /** Shows a spinner and blocks interaction without changing the button's width. */
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    fullWidth,
    loading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={props.type ?? "button"}
      disabled={disabled || loading}
      // Screen readers get told the control is busy; sighted users see the
      // spinner. The label stays mounted (just hidden) so width never jumps.
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={cn(button({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading && (
        <SpinnerIcon className="absolute size-[1.15em]" />
      )}
      <span
        className={cn(
          "inline-flex items-center gap-2",
          loading && "invisible",
        )}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </span>
    </button>
  );
});
